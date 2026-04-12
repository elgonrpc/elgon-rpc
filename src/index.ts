import { ClientOptions, Answer } from "./types";
import { verifyReceipt } from "./receipt";
import { NetworkError, TimeoutError } from "./errors";

export { ElgonError, NetworkError, TimeoutError } from "./errors";
export { ReceiptVerificationError } from "./errors";
export type { ClientOptions, Answer, Receipt } from "./types";

export class ElgonClient {
  private endpoint: string;
  private accessToken?: string;

  constructor(opts: ClientOptions) {
    this.endpoint = opts.endpoint.replace(/\/$/, "");
    this.accessToken = opts.accessToken;
  }

  async read(req: { method: string; params: unknown[] }): Promise<Answer> {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (this.accessToken) headers["authorization"] = `Bearer ${this.accessToken}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    let res: Response;
    try {
      res = await fetch(`${this.endpoint}/read`, {
        method: "POST",
        headers,
        body: JSON.stringify(req),
        signal: controller.signal,
      });
    } catch (err: any) {
      if (err.name === "AbortError") throw new TimeoutError(30_000);
      throw new NetworkError(err.message);
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) throw new NetworkError(`HTTP ${res.status}`, res.status);
    return res.json();
  }

  async getBalance(address: string): Promise<Answer> {
    return this.read({ method: "getBalance", params: [address] });
  }

  async getAccountInfo(address: string): Promise<Answer> {
    return this.read({ method: "getAccountInfo", params: [address] });
  }

  async verify(answer: Answer, headSlot?: number): Promise<{ ok: boolean; reason?: string }> {
    return verifyReceipt(answer, headSlot ? { headSlot } : {});
  }
}

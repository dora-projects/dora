import { BatchEvent, TransportOptions } from "@doras/types";
import { beforeSendHook } from "@doras/types";

export class Transport {
  public readonly url: string;
  public readonly beforeSendHook: beforeSendHook;

  public constructor(opts: TransportOptions) {
    this.url = opts.url;
    if (opts.beforeSend) this.beforeSendHook = opts.beforeSend;
  }

  send(data: BatchEvent): Promise<any> {
    return;
  }
}

import { EventLike } from "@doras/types";

export abstract class CoreTransport {
  abstract beforeSend(e: EventLike): void;

  abstract send(url: string, data: any): void;
}

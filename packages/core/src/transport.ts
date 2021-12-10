import { EventLike } from "@doras/types";

export abstract class Transport {
  abstract beforeSend(e: EventLike): void;

  abstract send(url: string, data: any): void;
}

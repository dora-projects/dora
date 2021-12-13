import { DataItem } from "@doras/types";

export abstract class Store {
  abstract save(data: DataItem): boolean;

  abstract get(): DataItem[];

  abstract remove(): void;

  abstract getAnonymousId(): string;

  abstract getSessionId(): string;
}

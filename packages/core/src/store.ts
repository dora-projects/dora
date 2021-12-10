export interface DataItem {}

export abstract class Store {
  abstract push(data: DataItem): void;
  abstract get(): DataItem[];
  abstract remove(): void;

  abstract getAnonymousId(): string;
  abstract getSessionId(): string;
}

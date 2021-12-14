import { Plugin } from "./plugin";
import { ErrorLike, IssueArgs, StatArgs, UserInfo } from "@doras/types";

export abstract class Client {
  clientName: string;

  abstract use(plugin: Plugin | Plugin[]): void;

  abstract isActive(): boolean;

  abstract start(): void;

  abstract stop(): void;

  abstract setUser(user: UserInfo): void;

  // abstract setMetadata(key: string, value: string): void;

  abstract stat(args: StatArgs): void;

  abstract issue(args: IssueArgs): void;

  abstract catchError(e: ErrorLike): void;
}

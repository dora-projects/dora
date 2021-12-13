import { Plugin } from "./plugin";
import { UserInfo } from "@doras/types";

export abstract class Client {
  clientName: string;

  abstract use(plugin: Plugin | Plugin[]): void;

  abstract isActive(): boolean;

  abstract start(): void;

  abstract stop(): void;

  abstract setUser(user: UserInfo): void;

  // abstract setMetadata(key: string, value: string): void;

  abstract stat(category: string, label: string, value: string | number): void;

  abstract issue(message: string, content: string, contact: string): void;

  abstract catchError(e: any): void;
}

import { CorePlugin } from "./plugin";

export abstract class CoreApi {
  name: string;
  use(plugin: CorePlugin | CorePlugin[]) {}
  isActive: () => boolean;
  start() {}
  stop() {}
  setUser() {}
  setMetadata() {}
  issue() {}
  catchError() {}
}

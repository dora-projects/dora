import { CorePlugin } from "./plugin";

export abstract class CoreApi {
  clientName: string;
  use: (plugin: CorePlugin | CorePlugin[]) => void;
  isActive: () => boolean;
  abstract start: () => void;
  abstract stop: () => void;
  setUser: () => void;
  setMetadata: (key: string, value: string) => void;
  abstract issue: () => void;
  abstract catchError: () => void;
}

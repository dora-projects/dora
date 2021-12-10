import { PluginRegisterFunc } from "@doras/types";

export interface Plugin {
  name: string;
  register: PluginRegisterFunc;
  unregister: () => void;
}

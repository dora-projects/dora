import { Config } from "@doras/types";

export type PluginRegisterFunc = (args: {
  report: (e) => void;
  clientConfig: Config;
}) => void;

export interface Plugin {
  name: string;
  register: PluginRegisterFunc;
  unregister: () => void;
}

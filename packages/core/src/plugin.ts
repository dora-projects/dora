export abstract class CorePlugin {
  name: string;
  register: () => void;
  unregister: () => void;
}

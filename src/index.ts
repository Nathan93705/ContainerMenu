import { Plugin, PluginEvents, PluginType } from "@serenityjs/plugins";
import { PacketListener } from "./PacketListener";

class ContainerMenu_Plugin extends Plugin implements PluginEvents {
  public readonly type = PluginType.Api;

  public constructor() {
    super("container-menu", "1.0.0");
  }

  public onInitialize(plugin: Plugin): void {
    PacketListener.loadListeners(plugin.serenity);
  }

}

export default new ContainerMenu_Plugin();

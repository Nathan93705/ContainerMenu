import { PacketListener } from "./PacketListener";
import { Plugin, PluginType } from "@serenityjs/plugins";

class ContainerMenuPlugin extends Plugin {

	public readonly type = PluginType.Api;

	public constructor() {
		super("ContainerMenu", "1.0.0");
	}

	public onInitialize(): void {
		PacketListener.loadListeners(this.serenity);
	}
}

export default new ContainerMenuPlugin();

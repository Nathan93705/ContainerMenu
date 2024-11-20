import { PlayerManager } from "./PlayerManager";
import { PacketListener } from "./PacketListener";

import { Plugin, PluginType } from "@serenityjs/plugins";

class ContainerMenuPlugin extends Plugin {

	public readonly type = PluginType.Api;

	public constructor() {
		super("ContainerMenu", "1.0.0");
	}

	public onInitialize(): void {
		PacketListener.loadListeners(this.serenity); setInterval(() => {
			console.log(`Map Check: `, PlayerManager.containerMap.size);
			console.log("Map Keys: ", Array.from(PlayerManager.containerMap.keys()).length);
		}, 3000);
	}
}

export default new ContainerMenuPlugin();
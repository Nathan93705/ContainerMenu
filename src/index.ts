import { WorldEvent } from "@serenityjs/core";
import { PacketListener } from "./PacketListener";
import { Plugin, PluginType } from "@serenityjs/plugins";
import { openMenu } from "../Examples/GamemodeSelector"


class ContainerMenuPlugin extends Plugin {

	public readonly type = PluginType.Api;

	public constructor() {
		super("ContainerMenu", "1.0.0");
	}

	public onInitialize(): void {
		PacketListener.loadListeners(this.serenity);
		/*
		setInterval(() => {
			console.log(`Check Size: `, PacketListener.ContainerMap.size)
		}, 3000)
		*/
		this.serenity.on(WorldEvent.PlayerChat, (event) => {
			const player = event.player
			openMenu(player)
		})

	}
}

export default new ContainerMenuPlugin();

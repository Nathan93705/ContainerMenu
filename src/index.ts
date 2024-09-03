import { Serenity } from "@serenityjs/serenity";
import { WorldEvent } from "@serenityjs/world";
import { PlayerManager } from "./PlayerManager";
import { PacketListener } from "./PacketListener";


interface tempData {
	ticksLeft: number
	callback: () => void
}

let nextTickCallbacks: tempData[] = []

export function waitTicks(callback: () => void, ticks: number) {
	nextTickCallbacks.push({ ticksLeft: ticks, callback: callback })
}

export function onStartup(serenity: Serenity): void {

	PacketListener.loadListeners(serenity);

	serenity.worlds.on(WorldEvent.WorldTick, () => {
		if (nextTickCallbacks.length > 0) {
			const newData: tempData[] = []
			for (const { ticksLeft, callback } of nextTickCallbacks) {
				if (ticksLeft < 1) {
					callback()
					continue;
				} else {
					newData.push({
						ticksLeft: ticksLeft - 1,
						callback: callback
					})
				}
			}
			nextTickCallbacks = newData
		}
	})
}

export function onShutdown(): void {
	PlayerManager.getAllContainers().forEach(container => {
		container.closeContainer()
	})
}



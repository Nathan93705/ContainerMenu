import { ContainerMenu, IMMOVEABLE, MOVEABLE } from "./ContainerMenu";
import { PlayerManager } from "./PlayerManager";
import { Packet } from "@serenityjs/protocol";
import { Serenity } from "@serenityjs/core";


export namespace PacketListener {

    export function loadListeners(serenity: Serenity) {

        serenity.network.before(Packet.ItemStackRequest, (event) => {
            const player = serenity.getPlayerByConnection(event.connection)!
            if (PlayerManager.hasContainer(event.connection)) {
                let isMoveable = false
                const fakeContainer = PlayerManager.getContainer(player.connection)!
                event.packet.requests.forEach((requestData) => {
                    requestData.actions.forEach((action) => {
                        const slot = ContainerMenu.getSlot(action).sourceSlot!
                        const response = fakeContainer.callTransactionCallback(action)
                        if (slot == undefined) return false;
                        if (response) {
                            if (response[slot]) {
                                if (response[slot] == MOVEABLE) {
                                    isMoveable = true
                                } else if (response[slot] == IMMOVEABLE) {
                                    isMoveable = false
                                }
                            }
                            else if (response["-1"] == MOVEABLE) {
                                isMoveable = true
                            } else if (response["-1"] == IMMOVEABLE) {
                                isMoveable = false
                            }
                        }
                    });
                });
                return isMoveable
            }
            return true
        });


        serenity.network.on(Packet.ContainerClose, (packet) => {
            const container = PlayerManager.getContainer(packet.connection)
            if (container) {
                PlayerManager.removeContainer(packet.connection)
                container.callContainerCloseCallback();
            }
        });

        serenity.network.on(Packet.Disconnect, (packet) => {
            const container = PlayerManager.getContainer(packet.connection)!
            container.destruct();
            PlayerManager.removeContainer(packet.connection)
        });
    }
}
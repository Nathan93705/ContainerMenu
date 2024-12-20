import { Serenity } from "@serenityjs/core";
import { PlayerManager } from "./PlayerManager";
import { ItemStackResponsePacket, ItemStackResponses, ItemStackStatus, Packet } from "@serenityjs/protocol";
import { ContainerMenu, IMMOVEABLE, MOVEABLE } from "./ContainerMenu";


export namespace PacketListener {
    export function loadListeners(serenity: Serenity) {
        serenity.network.before(Packet.ItemStackRequest, (event) => {
            if (PlayerManager.hasContainer(event.connection)) {
                const responses: ItemStackResponses[] = []
                const packet = new ItemStackResponsePacket()
                const container = PlayerManager.getContainer(event.connection)!;
                event.packet.requests.forEach((requestData) => {
                    let status = ItemStackStatus.Error
                    requestData.actions.forEach((action) => {
                        const slot = ContainerMenu.getSlot(action).sourceSlot!
                        const response = container.callTransactionCallback(action)
                        if (slot == -1) return;
                        if (response) {

                            if (response[slot]) {
                                if (response[slot] == MOVEABLE) {
                                    status = ItemStackStatus.Ok
                                } else if (response[slot] == IMMOVEABLE) {
                                    status = ItemStackStatus.Error
                                }
                            }

                            else if (response[-1] == MOVEABLE) {
                                status = ItemStackStatus.Ok
                            } else if (response[-1] == IMMOVEABLE) {
                                status = ItemStackStatus.Error
                            }

                        }

                    });
                    responses.push({
                        status: status,
                        id: requestData.clientRequestId
                    })
                });
                packet.responses = responses;
                serenity.getPlayerByConnection(event.connection)?.send(packet)
            }

            return true
        });

        serenity.network.before(Packet.ContainerClose, (packet) => {
            const container = PlayerManager.getContainer(packet.connection);
            console.log(`Listener 1 `, PlayerManager.getAllContainers().length)
            container ? container.callContainerCloseCallback() : null;
            PlayerManager.removeContainer(packet.connection);
            console.log(`Listener 2 `, PlayerManager.getAllContainers().length)
            return true
        });

        serenity.network.on(Packet.Disconnect, (packet) => {
            PlayerManager.getContainer(packet.connection)?.destruct();
        });
    }
}
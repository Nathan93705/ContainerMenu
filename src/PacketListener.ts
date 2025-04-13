import { ContainerMenu, IMMOVEABLE, MOVEABLE } from "./ContainerMenu";
import { PlayerManager } from "./PlayerManager";
import { ItemStackResponsePacket, ItemStackStatus, Packet } from "@serenityjs/protocol";
import { NetworkBound, Serenity } from "@serenityjs/core";


export namespace PacketListener {

    export function loadListeners(serenity: Serenity) {

        serenity.network.before(Packet.ItemStackRequest, (event) => {

            //Check if the player has a fake container open
            if (PlayerManager.hasContainer(event.connection)) {

                //Get the player
                const player = serenity.getPlayerByConnection(event.connection)!

                //Get The Container
                const { container } = PlayerManager.getContainer(player.connection)!

                const packet = new ItemStackResponsePacket()
                packet.responses = []

                //Loop through the requests and actions
                for (const request of event.packet.requests) {
                    for (const action of request.actions) {
                        let status = ItemStackStatus.Error

                        //Call The Callback
                        const response = container.callTransactionCallback(action, player)
                        packet.responses.push({ id: request.clientRequestId, status: status })
                        continue;

                        //TODO - Fully Impliment Item Move Later

                        const slot = ContainerMenu.getSlot(action).sourceSlot
                        if (!slot) status = ItemStackStatus.Error;
                        else if (response) {
                            //@ts-ignore
                            const slotData = response[slot]
                            //@ts-ignore
                            const globalData = response["-1"]
                            if (slotData) {
                                if (slotData == MOVEABLE) status = ItemStackStatus.Ok
                                else if (slotData == IMMOVEABLE) status = ItemStackStatus.Error
                            }
                            else if (globalData == MOVEABLE) status = ItemStackStatus.Ok
                            else if (globalData == IMMOVEABLE) status = ItemStackStatus.Error
                        }

                        packet.responses.push({ id: request.clientRequestId, status: status })

                    }
                }

                player.send(packet)

            }

            return true
        });


        serenity.network.on(Packet.ContainerClose, ({ connection, bound }) => {
            //Ignore Packets Sent By The Server
            if (bound != NetworkBound.Server) return

            if (PlayerManager.hasContainer(connection)) {
                const player = serenity.getPlayerByConnection(connection)!
                const { container } = PlayerManager.getContainer(connection)!

                //Closes The Container
                container.closeContainer(player, false)
            }
        });

        serenity.network.on(Packet.Disconnect, ({ connection }) => {
            if (PlayerManager.hasContainer(connection)) {
                const { container } = PlayerManager.getContainer(connection)!
                container.callCloseCallback()
                PlayerManager.removeContainer(connection)
            }
        });
    }
}
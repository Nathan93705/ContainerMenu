import { BlockActorDataPacket, BlockPosition, ContainerType } from "@serenityjs/protocol";
import { ByteTag, CompoundTag, IntTag, StringTag, Tag } from "@serenityjs/nbt";
import { FakeContainer, getAbovePosition } from "./FakeContainer";
import { ContainerInventory } from "../ContainerMenu";
import { Player, BlockIdentifier } from "@serenityjs/core";



export class FakeDoubleContainer extends FakeContainer {

    constructor(block: BlockIdentifier, containerType: ContainerType, containerSize: number, inventory: ContainerInventory = {}) {
        super(block, containerType, containerSize, inventory);
    }

    /**
     * Sends the fake container to the client.
     */
    public show(player: Player): void {
        const blockPos1 = getAbovePosition(player);
        const blockPos2 = blockPos1
        blockPos2.x += 1

        this.placeContainer(player, blockPos1);
        this.placeContainer(player, blockPos2);

        this.sendNbtData(player, [blockPos1, blockPos2], true);
        this.sendNbtData(player, [blockPos1, blockPos2], false);

        this.openContainer(player, blockPos1);

        const schedule = player.world.schedule(1)
        schedule.on(() => this.update(player))
    }

    /**
     * Sends the container's nbt data to the client.
     */
    private sendNbtData(player: Player, positions: [BlockPosition, BlockPosition], pairLead: boolean = false): void {
        const pk = new BlockActorDataPacket();
        pk.position = pairLead ? positions[0] : positions[1]!;
        let nbtData: Record<string, Tag> = {};
        if (!pk.nbt) pk.nbt = new CompoundTag()
        const customName = this.getCustomName()
        if (customName) nbtData["CustomName"] = new StringTag({ name: "CustomName", value: customName });
        nbtData["pairlead"] = new ByteTag({ name: "pairlead", value: pairLead ? 1 : 0 });
        nbtData["pairx"] = new IntTag({ name: "pairx", value: pairLead ? positions[0].x : positions[0].x })
        nbtData["pairz"] = new IntTag({ name: "pairz", value: pairLead ? positions[1].z : positions[1].z })
        for (const [_, tag] of Object.entries(nbtData)) pk.nbt.addTag(tag);
        player.send(pk)
    }

    protected destroyContainer(player: Player, pos: BlockPosition): void {
        const blockPos1 = pos;
        const blockPos2 = blockPos1
        blockPos2.x += 1

        this.destroyContainer(player, blockPos1)
        this.destroyContainer(player, blockPos2)
    }
}
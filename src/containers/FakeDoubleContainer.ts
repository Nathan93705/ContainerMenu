import { BlockActorDataPacket, BlockPosition, ContainerType } from "@serenityjs/protocol";
import { ByteTag, CompoundTag, IntTag, StringTag, Tag } from "@serenityjs/nbt";
import { FakeContainer, getAbovePosition } from "./FakeContainer";
import { ContainerInventory } from "../ContainerMenu";
import { Player, Block } from "@serenityjs/core";
import { PlayerManager } from "../PlayerManager";



export class FakeDoubleContainer extends FakeContainer {
    private position2!: BlockPosition;
    private player2: Player

    constructor(block: Block, containerType: ContainerType, containerSize: number, player: Player, inventory: ContainerInventory = {}) {
        super(block, containerType, containerSize, player, inventory);
        this.player2 = player
    }

    /**
     * Sends the fake container to the client.
     */
    public sendToPlayer(): void {
        PlayerManager.setContainer(this.player2.connection, this)
        this.position = getAbovePosition(this.player2);
        this.position2 = new BlockPosition(this.position.x + 1, this.position.y, this.position.z);
        this.placeContainer(this.position);
        this.placeContainer(this.position2);
        this.sendNbtData(true);
        this.sendNbtData(false);
        this.openContainer();

        this.player2.world.schedule(1).on(() => this.updateAllItems())
    }

    /**
     * Sends the container's nbt data to the client.
     */
    private sendNbtData(pairLead: boolean = false): void {
        const pk = new BlockActorDataPacket();
        pk.position = pairLead ? this.position : this.position2;
        let nbtData: Record<string, Tag> = {};
        if (!pk.nbt) pk.nbt = new CompoundTag()
        if (this.customName) nbtData["CustomName"] = new StringTag({ value: this.customName, name: "CustomName" });
        nbtData["pairlead"] = new ByteTag({ name: "pairlead", value: pairLead ? 1 : 0 });
        nbtData["pairx"] = new IntTag({ name: "pairx", value: pairLead ? this.position2.x : this.position.x })
        nbtData["pairz"] = new IntTag({ name: "pairz", value: pairLead ? this.position2.z : this.position.z })
        for (const [_, tag] of Object.entries(nbtData)) pk.nbt.addTag(tag);
        this.player2.send(pk)
    }

    /**
     * Destroys the containers, and destructs all the ItemStack instances, if needed.
     */
    public destruct(): void {
        this.destroyContainer(this.position);
        this.destroyContainer(this.position2);
        PlayerManager.getContainer(this.player2.connection)!.destruct()
    }
}
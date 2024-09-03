import { Block, ItemStack, Player } from "@serenityjs/world";
import { ContainerInventory, IMMOVEABLE, MOVEABLE } from "../ContainerMenu";
import { BlockActorDataPacket, BlockCoordinates, ContainerClosePacket, ContainerId, ContainerOpenPacket, ContainerType, InventoryContentPacket, ItemStackRequestAction, NetworkItemStackDescriptor, UpdateBlockFlagsType, UpdateBlockPacket } from "@serenityjs/protocol";
import { BlockPermutation } from "@serenityjs/block";
import { PlayerManager } from "../PlayerManager";
import { ItemIdentifier } from "@serenityjs/item";
import { CompoundTag, StringTag } from "@serenityjs/nbt";
import { waitTicks } from "..";
import { ContainerSize } from "./Containers";

interface ItemInteractionData { [slot: number]: MOVEABLE | IMMOVEABLE }

type TransactionCallback = (action: ItemStackRequestAction) => ItemInteractionData | void;
type ContainerCloseCallback = () => void;


export function getAbovePosition(player: Player): BlockCoordinates {
    const pos = player.position
    pos.y += 2;
    return new BlockCoordinates(pos.x, pos.y, pos.z);
}

export function getBlockAtPosition(player: Player, pos: BlockCoordinates): Block {
    return player.dimension.getBlock(pos);
}

export class FakeContainer {
    private readonly containerId: ContainerId;
    protected position!: BlockCoordinates;
    private readonly block: Block;
    private readonly containerType: ContainerType;
    private readonly containerSize: ContainerSize;
    private readonly player: Player;
    protected inventory: ContainerInventory;
    protected customName!: string;

    private transactionCallback!: TransactionCallback;
    private containerCloseCallback!: ContainerCloseCallback;

    constructor(block: Block, containerType: ContainerType, containerSize: number, player: Player, inventory: ContainerInventory = {}) {
        this.containerId = ContainerId.Ui;
        this.block = block;
        this.containerType = containerType;
        this.containerSize = containerSize;
        this.inventory = inventory;
        this.player = player;
    }

    /**
     * Places the container client-side.
     * This is required in Bedrock edition.
     */
    protected placeContainer(pos: BlockCoordinates): void {
        let packet = new UpdateBlockPacket();
        packet.position = pos;
        packet.networkBlockId = BlockPermutation.resolve(this.block.getType().identifier).network;
        packet.flags = 0;
        packet.layer = 0;
        packet.offset = 0;
        this.player.session.send(packet);
    }

    /**
     * Opens the container client-side.
     */
    protected openContainer(): void {
        const pk = new ContainerOpenPacket();
        pk.identifier = this.containerId;
        pk.type = this.containerType;
        pk.position = this.position;
        pk.uniqueId = -1n;
        this.player.session.send(pk);
    }

    /**
     * Force-closes the container client-side.
     *
     * @remarks This will destruct the container
     */
    public closeContainer(): void {
        const pk = new ContainerClosePacket();
        pk.identifier = this.containerId;
        pk.serverInitiated = true;
        pk.type = this.containerType;
        this.player.session.send(pk);
    }

    /**
     * Sends the fake container to the client.
     */
    public sendToPlayer(): void {
        PlayerManager.setContainer(this.player.session, this);
        this.position = getAbovePosition(this.player);
        this.placeContainer(this.position);
        if (this.customName) this.sendCustomName();
        waitTicks(() => {
            this.openContainer();
            this.updateAllItems();
        }, 3)
    }

    /**
     * Sets an item in the container.
     *
     * @param slot - The slot to set the item in.
     * @param item - The item to set.
     * @param destructOld - Whether to destroy the old item.
     *
     *
     * @remarks This will update the item client-side if needed to.
     */
    public setItem(slot: number, item: ItemStack): void {
        if (slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        this.inventory[slot] = item;
        // If the container is not sent yet, no need to update the slot.
        if (PlayerManager.hasContainer(this.player.session)) {
            this.updateAllItems();
        }
    }

    /**
     * Sets the container's inventory contents.
     *
     * @param contents - The contents to set.
     * @param destructOld - Whether to destroy the old items.
     */
    public setContents(contents: ContainerInventory): void {
        for (const [slot, item] of Object.entries(contents)) {
            this.setItem(+slot, item);
        }
    }

    /**
     * Adds an item to the container
     *
     * @param item - The item to add.
     */
    public addItem(item: ItemStack): void {
        for (let i = 0; i < this.containerSize; i++) {
            if (!this.inventory[i]) {
                this.setItem(i, item);
                return;
            }
        }
    }
    /**
     * Updates a single item in the container's inventory client-side.
     */
    /*
    private updateItem(slot: number, item: ItemStack): void {
        if (slot < 0 || slot >= this.containerSize) throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        const packet = new InventorySlotPacket();
        const itemNetworkDescriptor = ItemStack.toNetworkStack(item);

        packet.item = itemNetworkDescriptor;
        packet.containerId = this.containerId;
        packet.slot = slot;
        packet.dynamicContainerId = 0;

        this.player.session.send(packet);
    }
    */

    /**
     * Updates the container's inventory client-side.
     */
    protected updateAllItems(): void {
        /*
        for (let [slot, item] of Object.entries(this.inventory)) {
            this.updateItem(+slot, item);
        }
        */
        const items: NetworkItemStackDescriptor[] = [];
        for (let i = 0; i < this.containerSize; i++) {
            const item = this.inventory[i] ?? new ItemStack(ItemIdentifier.Air, 1)
            items.push(ItemStack.toNetworkStack(item))
        }
        const packet = new InventoryContentPacket();

        packet.containerId = this.containerId;
        packet.items = items
        packet.dynamicContainerId = 0;

        this.player.session.send(packet)
    }

    /**
     * Returns the item at the specified slot.
     *
     * @param slot - The slot to get the item from.
     */
    public getItem(slot: number): ItemStack | undefined {
        if (slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        return this.inventory[slot];
    }

    /**
     * Returns the contents of the container.
     */
    public getContents(): ContainerInventory {
        return this.inventory;
    }

    /**
     * Clears a container's slot,
     * updating it client-side if needed.
     */
    public clearItem(slot: number): void {
        if (slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        if (this.inventory[slot]) {
            delete this.inventory[slot];
            // If the container is not sent yet, no need to update the slot.
            if (PlayerManager.hasContainer(this.player.session)) {
                this.updateAllItems();
            }
        }
    }

    /**
     * Clears the container's contents,
     * updating it client-side if needed.
     */
    public clearContents(): void {
        for (const [slot, item] of Object.entries(this.inventory)) {
            this.clearItem(+slot);
        }
    }

    /**
     * Sets a custom name to the container.
     *
     * @param name - The name to set.
     *
     * @remarks This needs to be set BEFORE sending the container.
     */
    public setCustomName(name: string): void {
        this.customName = name;
    }

    /**
     * Sends the container's custom name to the client.
     */
    private sendCustomName(): void {
        const pk = new BlockActorDataPacket();
        pk.position = this.position;
        if (!pk.nbt) pk.nbt = new CompoundTag()
        pk.nbt.addTag(new StringTag("CustomName", this.customName))
        this.player.session.send(pk)
    }

    /**
     * Callback is triggered when the player interacts with an item,
     * in the container, or in its inventory.
     * 
     * If callback returns `CANCEL`, the items wont be allowed to be `taken / placed / swapped`
     */
    public onTransaction(callback: TransactionCallback): void {
        this.transactionCallback = callback;
    }

    /**
     * Returns whether a transaction callback is set.
     */
    private hasTransactionCallback(): boolean {
        return this.transactionCallback !== undefined;
    }

    /**
     * Calls the transaction callback.
     */
    public callTransactionCallback(action: ItemStackRequestAction): ItemInteractionData | void {
        if (this.hasTransactionCallback()) return this.transactionCallback(action)
        return
    }

    /**
     * Callback is triggered when the player closes the container, or is forced to do so.
     */
    public onContainerClose(callback: ContainerCloseCallback): void {
        this.containerCloseCallback = callback;
    }

    /**
     * Returns whether a container close callback is set.
     */
    private hasContainerCloseCallback(): boolean {
        return this.containerCloseCallback !== undefined;
    }

    /**
     * Calls the container close callback.
     */
    public callContainerCloseCallback(): void {
        if (this.hasContainerCloseCallback()) this.containerCloseCallback();
        this.destruct();
    }

    /**
     * Destroys the container client-side,
     * and replaces it with the original block.
     */
    protected destroyContainer(pos: BlockCoordinates): void {
        const block = getBlockAtPosition(this.player, pos)
        let packet = new UpdateBlockPacket();
        packet.position = pos;
        packet.networkBlockId = BlockPermutation.resolve(block.getType().identifier).network;
        packet.flags = UpdateBlockFlagsType.Network;
        packet.layer = 0;
        packet.offset = 0;
        this.player.session.send(packet);
    }

    /**
     * Destructs all the ItemStack instances of the container's inventory.
     *
     * @remarks This is called automatically if `destructItems` is set to true.
     */
    public destructAllItems(): void {
        this.inventory = {};
    }

    /**
     * Destroys the container, and destructs all the ItemStack instances, if needed.
     */
    public destruct(): void {
        this.destroyContainer(this.position);
        PlayerManager.removeContainer(this.player.session);
    }
}


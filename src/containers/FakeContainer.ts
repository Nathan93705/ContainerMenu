import { BlockActorDataPacket, BlockPosition, ContainerId, ContainerType, ItemStackRequestAction, UpdateBlockFlagsType, UpdateBlockPacket } from "@serenityjs/protocol";
import { Player, Block, BlockPermutation, ItemStack, ItemIdentifier, BlockContainer } from "@serenityjs/core";
import { ContainerInventory, IMMOVEABLE, MOVEABLE } from "../ContainerMenu";
import { CompoundTag, StringTag } from "@serenityjs/nbt";
import { PlayerManager } from "../PlayerManager";
import { ContainerSize } from "./Containers";

interface ItemInteractionData { [slot: number]: MOVEABLE | IMMOVEABLE }

type TransactionCallback = (action: ItemStackRequestAction) => ItemInteractionData | void;
type ContainerCloseCallback = () => void;


export function getAbovePosition(player: Player): BlockPosition {
    const pos = player.position
    return new BlockPosition(Math.floor(pos.x), Math.floor(pos.y + 2), Math.floor(pos.z));
}

export function getBlockAtPosition(player: Player, pos: BlockPosition): Block {
    return player.dimension.getBlock(pos);
}

export class FakeContainer {
    protected position!: BlockPosition;
    private readonly block: Block;
    private readonly containerSize: ContainerSize;
    private readonly player: Player;
    private blockContainer: BlockContainer;
    protected inventory: ContainerInventory;
    protected customName!: string;
    private timeout: number

    private transactionCallback!: TransactionCallback;
    private containerCloseCallback!: ContainerCloseCallback;

    constructor(block: Block, containerType: ContainerType, containerSize: number, player: Player, inventory: ContainerInventory = {}) {
        this.block = block;
        this.containerSize = containerSize;
        this.inventory = inventory;
        this.player = player;
        this.blockContainer = new BlockContainer(block, containerType, ContainerId.Ui, containerSize);
        this.timeout = 60000
    }

    public setTimeout(ms: number) {
        this.timeout = ms
    }

    /**
     * Places the container client-side.
     * This is required in Bedrock edition.
     */
    protected placeContainer(pos: BlockPosition): void {
        let packet = new UpdateBlockPacket();
        packet.position = pos;
        packet.networkBlockId = BlockPermutation.resolve(this.block.type.identifier).network;
        packet.flags = 0;
        packet.layer = 0;
        packet.offset = 0;
        this.player.send(packet);
    }

    /**
     * Opens the container client-side.
     */
    protected openContainer(): void {
        this.blockContainer.show(this.player)
    }

    /**
     * Force-closes the container client-side.
     */
    public closeContainer(): void {
        this.blockContainer.close(this.player)
    }

    /**
     * Sends the fake container to the client.
     */
    public sendToPlayer(): void {
        PlayerManager.setContainer(this.player.connection, this)
        this.position = getAbovePosition(this.player);

        this.placeContainer(this.position);

        if (this.customName) this.sendCustomName();

        this.openContainer();

        this.player.world.schedule(1).on(() => this.updateAllItems())
        setTimeout(() => {

        }, this.timeout)
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
        if (this.player.openedContainer && this.player.hasTag(`ContainerMenu:Open`)) {
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
     * Updates the container's inventory client-side.
     */
    protected updateAllItems(): void {
        this.blockContainer.clear()
        for (let i = 0; i < this.containerSize; i++) {
            const item = this.inventory[i] ?? new ItemStack(ItemIdentifier.Air)
            this.blockContainer.setItem(i, item)
        }
        this.blockContainer.update(this.player)
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
            if (PlayerManager.hasContainer(this.player.connection)) this.updateAllItems();

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
        pk.nbt.addTag(new StringTag({ value: this.customName, name: "CustomName" }))
        this.player.send(pk)
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
    protected destroyContainer(pos: BlockPosition): void {
        this.closeContainer()
        const block = getBlockAtPosition(this.player, pos)
        let packet = new UpdateBlockPacket();
        packet.position = pos;
        packet.networkBlockId = BlockPermutation.resolve(block.type.identifier).network;
        packet.flags = UpdateBlockFlagsType.Network;
        packet.layer = 0;
        packet.offset = 0;
        this.player.send(packet);
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
    }
}
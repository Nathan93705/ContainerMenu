import { BlockActorDataPacket, BlockPosition, ContainerClosePacket, ContainerId, ContainerName, ContainerOpenPacket, ContainerType, FullContainerName, InventoryContentPacket, InventorySlotPacket, ItemStackRequestAction, NetworkItemStackDescriptor, UpdateBlockFlagsType, UpdateBlockPacket } from "@serenityjs/protocol";
import { Player, BlockPermutation, ItemStack, ItemIdentifier, BlockIdentifier } from "@serenityjs/core";
import { ContainerInventory, IMMOVEABLE, MOVEABLE } from "../ContainerMenu";
import { CompoundTag, StringTag } from "@serenityjs/nbt";
import { PlayerManager } from "../PlayerManager";
import { ContainerSize } from "./Containers";

interface ItemInteractionData { [slot: number]: MOVEABLE | IMMOVEABLE }

type TransactionCallback = (res: { action: ItemStackRequestAction, player: Player }) => ItemInteractionData | void;
type ContainerCloseCallback = (player?: Player) => void;


export function getAbovePosition(player: Player): BlockPosition {
    const pos = player.position
    return new BlockPosition(Math.floor(pos.x), Math.floor(pos.y + 2), Math.floor(pos.z));
}

export class FakeContainer {
    public readonly blockIdentifier: BlockIdentifier;

    public readonly containerId: ContainerId = ContainerId.None
    public readonly containerType: ContainerType
    private readonly containerSize: ContainerSize;

    private inventory: ContainerInventory;
    private customName?: string;

    private transactionCallback?: TransactionCallback;
    private containerCloseCallback?: ContainerCloseCallback;

    constructor(block: BlockIdentifier, containerType: ContainerType, containerSize: number, inventory: ContainerInventory = {}) {
        this.blockIdentifier = block;
        this.containerType = containerType;
        this.containerSize = containerSize;
        this.inventory = inventory;
    }



    /**
     * Sends the fake container to the client.
     * @remarks if used on a command, recommended to send it like 25-30 ticks after to give time for chat to close 
     */
    public show(player: Player): void {
        if (PlayerManager.hasContainer(player)) throw Error(`Player Already Has A Fake Container Open`)
        const blockPos = getAbovePosition(player);

        this.placeContainer(player, blockPos);

        if (this.customName) this.sendCustomName(player, blockPos);

        this.openContainer(player, blockPos)

        const schedule = player.world.schedule(1)
        schedule.on(() => this.update(player))
    }




    // ----------------------------
    //  Handle Container Inventory
    // ----------------------------





    /**
     * Sets the item in the specified slot.
     * @param slot - The slot to set the item in.
     * @param item - The item to set.
     */
    public setItem(slot: number, item: ItemStack): void {
        if (slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        this.inventory[slot] = item;
    }

    /**
     * Gets the item in the specified slot.
     * @param slot - The slot to get the item from.
     * @returns The item in the specified slot, or undefined if the slot is empty.
     */
    public getItem(slot: number): ItemStack | undefined {
        if (slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        return this.inventory[slot];
    }

    /**
     * Adds an item to the first available slot in the container.
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
     * Removes the item from the specified slot.
     * @param slot - The slot to remove the item from.
     */
    public clearItem(slot: number): void {
        if (slot < 0 || slot >= this.containerSize) {
            throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        }
        if (this.inventory[slot]) {
            delete this.inventory[slot];
        }
    }

    /**
     * Sets the contents of the container.
     * @param contents - The contents to set.
     */
    public setContents(contents: ContainerInventory): void {
        for (const [slot, item] of Object.entries(contents)) {
            this.setItem(+slot, item);
        }
    }

    /**
     * Gets the contents of the container.
     * @returns The contents of the container.
     */
    public getContents(): ContainerInventory {
        return this.inventory;
    }

    /**
     * Clears the contents of the container.
     */
    public clearContents(): void {
        for (const [slot, item] of Object.entries(this.inventory)) {
            this.clearItem(+slot);
        }
    }


    /**
     * Updates the item in the specified slot.
     * @param slot - The slot to update the item in.
     * @param item - The item to update.
     */
    /*
    private updateSlot(player: Player, slot: number, item: ItemStack): void {
        if (slot < 0 || slot >= this.containerSize) throw new Error(`Slot ${slot} is out of range (container has ${this.containerSize} slots)`);
        const packet = new InventorySlotPacket();
        const itemNetworkDescriptor = ItemStack.toNetworkStack(item);

        packet.item = itemNetworkDescriptor;
        packet.containerId = this.containerId;
        packet.slot = slot;
        packet.storageItem = new NetworkItemStackDescriptor(0);
        packet.fullContainerName = new FullContainerName(0, 0);

        player.send(packet);
    }
    */

    /**
     * Updates all items in the container.
     * @remarks This is called when the container is opened or when an item is added/removed.
     */
    public update(player: Player): void {
        if (!PlayerManager.hasContainer(player)) throw Error(`Player Doesnt Have A Fake Container Open`)

        /*
        for (let [slot, item] of Object.entries(this.inventory)) {
            this.updateSlot(player, +slot, item);
        }
        */

        const items: NetworkItemStackDescriptor[] = [];
        for (let i = 0; i < this.containerSize; i++) {
            const itemStack = this.inventory[i] ?? new ItemStack(ItemIdentifier.Air)
            const networkStack = ItemStack.toNetworkStack(itemStack)
            items.push(networkStack)
        }

        const packet = new InventoryContentPacket();
        packet.containerId = this.containerId;
        packet.items = items
        packet.fullContainerName = new FullContainerName(ContainerName.Container)
        packet.storageItem = new NetworkItemStackDescriptor(0);

        player.send(packet)
    }


    // ------------------------------
    //  Handle Container Placement
    // ------------------------------

    /**
     * Destroys The Container Block - used for internals.
     * @param player The Player To Send The Packet Too
     * @param pos The Block Position
     * @remarks This is called when the container is closed, to remove the block.
     */
    protected destroyContainer(player: Player, pos: BlockPosition): void {
        const block = player.dimension.getBlock(pos);
        const networkId = BlockPermutation.resolve(block.type.identifier).networkId
        let packet = new UpdateBlockPacket();
        packet.position = pos;
        packet.networkBlockId = networkId;
        packet.flags = UpdateBlockFlagsType.Network;
        packet.layer = 0;
        packet.offset = 0;
        player.send(packet);
    }

    /**
     * Places the container at the specified position.
     * @param player The Player To Send The Packet Too
     * @param pos - The position to place the container at.
     */
    protected placeContainer(player: Player, pos: BlockPosition): void {
        const networkId = BlockPermutation.resolve(this.blockIdentifier).networkId
        const packet = new UpdateBlockPacket();
        packet.position = pos;
        packet.networkBlockId = networkId;
        packet.flags = 0;
        packet.layer = 0;
        packet.offset = 0;
        player.send(packet);
    }

    /**
     * Opens the container.
     * @param player The Player To Send The Packet Too
     * @param pos The Block Position
     * @remarks This is called when the container is opened.
     */
    protected openContainer(player: Player, pos: BlockPosition): void {
        const packet = new ContainerOpenPacket();
        packet.identifier = this.containerId;
        packet.type = this.containerType;
        packet.position = pos;
        packet.uniqueId = -1n;
        player.send(packet);
        PlayerManager.setContainer(player, { blockPos: pos, container: this })
    }
    /**
     * Forcably closes the container.
     * @param player The Player To Send The Packet Too
     * @param serverInitiated Wether The Server is closing it
     */
    public closeContainer(player: Player, serverInitiated = true): void {
        if (!PlayerManager.hasContainer(player)) throw Error(`Player Doesnt Have A Fake Container Open`)
        const metadata = PlayerManager.getContainer(player)!
        const pk = new ContainerClosePacket();
        pk.identifier = this.containerId;
        pk.serverInitiated = serverInitiated;
        pk.type = this.containerType;
        player.send(pk);
        const schedule = player.world.schedule(1)
        schedule.on(() => this.destroyContainer(player, metadata.blockPos))
        this.callCloseCallback(player)
        PlayerManager.removeContainer(player)

    }


    // ------------------------------
    //  Handle Custom Container Name
    // ------------------------------

    /**
     * Sends the custom name to the client.
     */
    private sendCustomName(player: Player, pos: BlockPosition): void {
        const packet = new BlockActorDataPacket();
        packet.position = pos;
        const tag = new StringTag({ name: "CustomName", value: this.customName })
        if (!packet.nbt) packet.nbt = new CompoundTag()
        packet.nbt.addTag(tag)
        player.send(packet)
    }

    /**
     * Sets a custom name to the container.
     * @param name - The name to set.
     * @remarks This needs to be set BEFORE sending the container.
     */
    public setCustomName(name: string): void {
        this.customName = name;
    }

    /**
     * Gets the custom name of the container.
     * @returns The custom name of the container.
     */
    public getCustomName(): string | undefined {
        return this.customName
    }




    // -----------------------------
    //       Handle Callbacks
    // -----------------------------

    /**
     * Sets the callback to be called when the container is interacted with.
     * @param callback - The callback to be called when the container is interacted with.
     */
    public onTransaction(callback: TransactionCallback): void {
        this.transactionCallback = callback;
    }

    /**
     * Calls the transaction callback with the given action.
     * @param action - The action to be passed to the callback.
     * @returns The result of the callback, or undefined if no callback is set.
     */
    public callTransactionCallback(action: ItemStackRequestAction, player: Player): ItemInteractionData | void {
        if (this.transactionCallback !== undefined) return this.transactionCallback({ action, player })
        return
    }

    /**
     * Sets the callback to be called when the container is closed.
     * @param callback - The callback to be called when the container is closed.
     */
    public onClose(callback: ContainerCloseCallback): void {
        this.containerCloseCallback = callback;
    }

    /**
     * Calls the close callback
     */
    public callCloseCallback(player?: Player): void {
        if (this.containerCloseCallback !== undefined) this.containerCloseCallback(player);
    }
}

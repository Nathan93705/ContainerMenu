import { ItemStack, Player } from "@serenityjs/core";
import { FakeContainer } from "./containers/FakeContainer";
import { PlayerManager } from "./PlayerManager";
import { ItemStackRequestAction, ItemStackRequestActionType } from "@serenityjs/protocol";
import { AnvilContainer, BlastFurnaceContainer, BrewingStandContainer, ChestContainer, CraftingContainer, DispenserContainer, DoubleChestContainer, DoubleTrappedChestContainer, DropperContainer, EnchantingContainer, FakeContainerType, FurnaceContainer, GrindstoneContainer, HopperContainer, SmithingContainer, SmokerContainer, StonecutterContainer, TrappedChestContainer } from "./containers/Containers";
import { Connection } from "@serenityjs/raknet";

/**
 * Cancels Container Menu Item Transaction
 */
export class MOVEABLE { }
export class IMMOVEABLE { }

export type ContainerInventory = Record<number, ItemStack>;

export namespace ContainerMenu {

    /**
     * Creates a fake container for a specific player.
     *
     * @param player - The player to create the container for.
     * @param container - The container type to create.
     * @param destructItems - Whether the ItemStacks should be automatically destructed.
     * @param inventory - The inventory of the container.
     */
    export function create(player: Player, container: FakeContainerType, inventory?: ContainerInventory): FakeContainer {
        if (!PlayerManager.hasContainer(player.connection)) {
            switch (container) {
                case FakeContainerType.Chest:
                    return new ChestContainer(player, inventory);
                case FakeContainerType.TrappedChest:
                    return new TrappedChestContainer(player, inventory);
                case FakeContainerType.DoubleChest:
                    return new DoubleChestContainer(player, inventory);
                case FakeContainerType.DoubleTrappedChest:
                    return new DoubleTrappedChestContainer(player, inventory);
                case FakeContainerType.Hopper:
                    return new HopperContainer(player, inventory);
                case FakeContainerType.Dropper:
                    return new DropperContainer(player, inventory);
                case FakeContainerType.Dispenser:
                    return new DispenserContainer(player, inventory);
                case FakeContainerType.EnchantingTable:
                    return new EnchantingContainer(player, inventory);
                case FakeContainerType.Anvil:
                    return new AnvilContainer(player, inventory);
                case FakeContainerType.BlastFurnace:
                    return new BlastFurnaceContainer(player, inventory);
                case FakeContainerType.BrewingStand:
                    return new BrewingStandContainer(player, inventory);
                case FakeContainerType.CraftingTable:
                    return new CraftingContainer(player, inventory);
                case FakeContainerType.Furnace:
                    return new FurnaceContainer(player, inventory);
                case FakeContainerType.Grindstone:
                    return new GrindstoneContainer(player, inventory);
                case FakeContainerType.SmithingTable:
                    return new SmithingContainer(player, inventory);
                case FakeContainerType.Smoker:
                    return new SmokerContainer(player, inventory);
                case FakeContainerType.Stonecutter:
                    return new StonecutterContainer(player, inventory);
            }
        } else throw new Error("Player already has a fake container assigned. Close it before creating a new one.");
    }

    interface ActionData {
        sourceSlot?: number
        destinationSlot?: number,
        data: any
    }

    /**
     * Gets The Slot Index Number From An ItemStackRequestAction
     * @param action ItemStackRequestAction
     * @returns Item Slot Index Number
     */
    export function getSlot(action: ItemStackRequestAction): ActionData {
        let returnData: ActionData = {
            sourceSlot: undefined,
            destinationSlot: undefined,
            data: undefined,
        };

        switch (action.action) {
            case ItemStackRequestActionType.Place:
            case ItemStackRequestActionType.Take:
                returnData.sourceSlot = action.takeOrPlace?.source.slot;
                returnData.destinationSlot = action.takeOrPlace?.destination.slot;
                returnData.data = action.takeOrPlace;
                break;

            case ItemStackRequestActionType.Swap:
                returnData.sourceSlot = action.swap?.source.slot;
                returnData.destinationSlot = action.swap?.destination.slot;
                returnData.data = action.swap;
                break;

            case ItemStackRequestActionType.Drop:
                returnData.sourceSlot = action.drop?.source.slot;
                returnData.data = action.drop;
                break;
        }

        return returnData;
    }

}

export { };

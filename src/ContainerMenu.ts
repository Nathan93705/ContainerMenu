import { ItemStackRequestAction, ItemStackRequestActionType } from "@serenityjs/protocol";
import { FakeContainer } from "./containers/FakeContainer";
import { ItemStack } from "@serenityjs/core";
import { FakeContainerType, ChestContainer, TrappedChestContainer, DoubleChestContainer, DoubleTrappedChestContainer, HopperContainer, DropperContainer, DispenserContainer, EnchantingContainer, AnvilContainer, BlastFurnaceContainer, BrewingStandContainer, CraftingContainer, FurnaceContainer, GrindstoneContainer, SmithingContainer, SmokerContainer, StonecutterContainer } from "./containers/Containers";

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
    export function create(container: FakeContainerType, inventory?: ContainerInventory): FakeContainer {
        switch (container) {
            case FakeContainerType.Chest:
                return new ChestContainer(inventory);
            case FakeContainerType.TrappedChest:
                return new TrappedChestContainer(inventory);
            case FakeContainerType.DoubleChest:
                return new DoubleChestContainer(inventory);
            case FakeContainerType.DoubleTrappedChest:
                return new DoubleTrappedChestContainer(inventory);
            case FakeContainerType.Hopper:
                return new HopperContainer(inventory);
            case FakeContainerType.Dropper:
                return new DropperContainer(inventory);
            case FakeContainerType.Dispenser:
                return new DispenserContainer(inventory);
            case FakeContainerType.EnchantingTable:
                return new EnchantingContainer(inventory);
            case FakeContainerType.Anvil:
                return new AnvilContainer(inventory);
            case FakeContainerType.BlastFurnace:
                return new BlastFurnaceContainer(inventory);
            case FakeContainerType.BrewingStand:
                return new BrewingStandContainer(inventory);
            case FakeContainerType.CraftingTable:
                return new CraftingContainer(inventory);
            case FakeContainerType.Furnace:
                return new FurnaceContainer(inventory);
            case FakeContainerType.Grindstone:
                return new GrindstoneContainer(inventory);
            case FakeContainerType.SmithingTable:
                return new SmithingContainer(inventory);
            case FakeContainerType.Smoker:
                return new SmokerContainer(inventory);
            case FakeContainerType.Stonecutter:
                return new StonecutterContainer(inventory);
            default:
                throw new Error(`Container type ${container} is not supported.`);
        }
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

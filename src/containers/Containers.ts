import { BlockIdentifier } from "@serenityjs/core";
import { FakeContainer } from "./FakeContainer";
import { FakeDoubleContainer } from "./FakeDoubleContainer";
import { ContainerInventory } from "../ContainerMenu";
import { ContainerType } from "@serenityjs/protocol";

/**
 * All the fake containers types.
 */
export enum FakeContainerType {
    Chest,
    TrappedChest,
    DoubleChest,
    DoubleTrappedChest,
    Hopper,
    Dropper,
    Dispenser,
    EnchantingTable,
    SmithingTable,
    Furnace,
    BlastFurnace,
    Smoker,
    Grindstone,
    Stonecutter,
    CraftingTable,
    BrewingStand,
    Anvil

}

/**
 * All the containers sizes.
 */
export enum ContainerSize {
    Chest = 27,
    DoubleChest = 54,
    Hopper = 5,
    Dropper = 9,
    Dispenser = 9,
    EnchantingTable = 2,
    SmithingTable = 4,
    Furnace = 3,
    BlastFurnace = 3,
    Smoker = 3,
    Anvil = 3,
    Grindstone = 3,
    Stonecutter = 2,
    CraftingTable = 10,
    BrewingStand = 5
}

export class TrappedChestContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.TrappedChest,
            ContainerType.Container,
            ContainerSize.Chest,
            inventory
        );
    }
}


export class ChestContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Chest,
            ContainerType.Container,
            ContainerSize.Chest,
            inventory
        );
    }
}

export class DispenserContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Dispenser,
            ContainerType.Dispenser,
            ContainerSize.Dispenser,
            inventory
        );
    }
}

export class DropperContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Dropper,
            ContainerType.Dropper,
            ContainerSize.Dropper,
            inventory
        );
    }
}

export class EnchantingContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.EnchantingTable,
            ContainerType.Enchantment,
            ContainerSize.EnchantingTable,
            inventory
        );
    }
}

export class HopperContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Hopper,
            ContainerType.Hopper,
            ContainerSize.Hopper,
            inventory
        );
    }
}



export class CraftingContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.CraftingTable,
            ContainerType.Workbench,
            ContainerSize.CraftingTable,
            inventory
        );
    }
}

export class SmithingContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.SmithingTable,
            ContainerType.SmithingTable,
            ContainerSize.SmithingTable,
            inventory
        );
    }
}

export class FurnaceContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Furnace,
            ContainerType.Furnace,
            ContainerSize.Furnace,
            inventory
        );
    }
}

export class SmokerContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Smoker,
            ContainerType.Smoker,
            ContainerSize.Smoker,
            inventory
        );
    }
}

export class BlastFurnaceContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.BlastFurnace,
            ContainerType.BlastFurnace,
            ContainerSize.BlastFurnace,
            inventory
        );
    }
}

export class AnvilContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Anvil,
            ContainerType.Anvil,
            ContainerSize.Anvil,
            inventory
        );
    }
}

export class BrewingStandContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.BrewingStand,
            ContainerType.BrewingStand,
            ContainerSize.BrewingStand,
            inventory
        );
    }
}

export class GrindstoneContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Grindstone,
            ContainerType.Grindstone,
            ContainerSize.Grindstone,
            inventory
        );
    }
}

export class StonecutterContainer extends FakeContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Stonecutter,
            ContainerType.Stonecutter,
            ContainerSize.Stonecutter,
            inventory
        );
    }
}

/**
 * Double Containers
 */
export class DoubleChestContainer extends FakeDoubleContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.Chest,
            ContainerType.Container,
            ContainerSize.DoubleChest,
            inventory
        );
    }
}

export class DoubleTrappedChestContainer extends FakeDoubleContainer {
    public constructor(inventory?: ContainerInventory) {
        super(
            BlockIdentifier.TrappedChest,
            ContainerType.Container,
            ContainerSize.DoubleChest,
            inventory
        );
    }
}
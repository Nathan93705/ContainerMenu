import { BlockPermutation, BlockType, BlockIdentifier } from "@serenityjs/block";
import { ContainerType } from "@serenityjs/protocol";
import { Block, Player } from "@serenityjs/world";
import { FakeContainer, getAbovePosition } from "./FakeContainer";
import { FakeDoubleContainer } from "./FakeDoubleContainer";
import { ContainerInventory } from "../ContainerMenu";

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
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.TrappedChest)), getAbovePosition(player))!,
            ContainerType.Container,
            ContainerSize.Chest,
            player,
            inventory
        );
    }
}

export class ChestContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Chest)), getAbovePosition(player))!,
            ContainerType.Container,
            ContainerSize.Chest,
            player,
            inventory
        );
    }
}

export class DispenserContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Dispenser)), getAbovePosition(player))!,
            ContainerType.Dispenser,
            ContainerSize.Dispenser,
            player,
            inventory
        );
    }
}

export class DropperContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Dropper)), getAbovePosition(player))!,
            ContainerType.Dropper,
            ContainerSize.Dropper,
            player,
            inventory
        );
    }
}

export class EnchantingContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.EnchantingTable)), getAbovePosition(player))!,
            ContainerType.Enchantment,
            ContainerSize.EnchantingTable,
            player,
            inventory
        );
    }
}

export class HopperContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Hopper)), getAbovePosition(player))!,
            ContainerType.Hopper,
            ContainerSize.Hopper,
            player,
            inventory
        );
    }
}


/**
 * New Stuff
 */
export class CraftingContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.CraftingTable)), getAbovePosition(player))!,
            ContainerType.Workbench,
            ContainerSize.CraftingTable,
            player,
            inventory
        );
    }
}
export class SmithingContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.SmithingTable)), getAbovePosition(player))!,
            ContainerType.SmithingTable,
            ContainerSize.SmithingTable,
            player,
            inventory
        );
    }
}
export class FurnaceContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Furnace)), getAbovePosition(player))!,
            ContainerType.Furnace,
            ContainerSize.Furnace,
            player,
            inventory
        );
    }
}
export class SmokerContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Smoker)), getAbovePosition(player))!,
            ContainerType.Smoker,
            ContainerSize.Smoker,
            player,
            inventory
        );
    }
}
export class BlastFurnaceContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.BlastFurnace)), getAbovePosition(player))!,
            ContainerType.BlastFurnace,
            ContainerSize.BlastFurnace,
            player,
            inventory
        );
    }
}
export class AnvilContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Anvil)), getAbovePosition(player))!,
            ContainerType.Anvil,
            ContainerSize.Anvil,
            player,
            inventory
        );
    }
}
export class BrewingStandContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.BrewingStand)), getAbovePosition(player))!,
            ContainerType.BrewingStand,
            ContainerSize.BrewingStand,
            player,
            inventory
        );
    }
}
export class GrindstoneContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Grindstone)), getAbovePosition(player))!,
            ContainerType.Grindstone,
            ContainerSize.Grindstone,
            player,
            inventory
        );
    }
}
export class StonecutterContainer extends FakeContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Stonecutter)), getAbovePosition(player))!,
            ContainerType.Stonecutter,
            ContainerSize.Stonecutter,
            player,
            inventory
        );
    }
}

/**
 * Double Containers
 */
export class DoubleChestContainer extends FakeDoubleContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.Chest)), getAbovePosition(player))!,
            ContainerType.Container,
            ContainerSize.DoubleChest,
            player,
            inventory
        );
    }
}

export class DoubleTrappedChestContainer extends FakeDoubleContainer {
    public constructor(player: Player, inventory?: ContainerInventory) {
        super(
            new Block(player.dimension, BlockPermutation.create(BlockType.get(BlockIdentifier.TrappedChest)), getAbovePosition(player))!,
            ContainerType.Container,
            ContainerSize.DoubleChest,
            player,
            inventory
        );
    }
}
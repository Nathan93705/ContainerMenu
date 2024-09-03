import { ItemIdentifier } from "@serenityjs/item";
import { ItemNametagComponent, ItemStack, Player } from "@serenityjs/world";
import { ContainerMenu } from "../src/ContainerMenu"
import { FakeContainerType } from "../src/containers/Containers";

function openMenu(player: Player) {
    const container = ContainerMenu.create(player, FakeContainerType.Chest)

    const survival = new ItemStack(ItemIdentifier.GrassBlock, 1)
    const comp1 = new ItemNametagComponent(survival)
    comp1.setCurrentValue("Survival")

    const creative = new ItemStack(ItemIdentifier.CommandBlock, 1)
    const comp2 = new ItemNametagComponent(creative)
    comp2.setCurrentValue("Creative")

    const spectator = new ItemStack(ItemIdentifier.Barrier, 1)
    const comp3 = new ItemNametagComponent(spectator)
    comp3.setCurrentValue("Spectator")

    player.getComponent("minecraft:inventory").container.addItem(survival)

    container.setItem(12, survival)
    container.setItem(13, creative)
    container.setItem(14, spectator)

    container.setCustomName("Gamemode Selector")

    container.onTransaction((action) => {
        const slot = ContainerMenu.getSlot(action).sourceSlot
        if (!slot) {
            container.closeContainer();
            return
        }

        switch (slot) {
            case 12:
                player.executeCommand(`gamemode s @s`)
                player.sendMessage(`Set Gamemode To Survival`)
                break;
            case 13:
                player.executeCommand(`gamemode c @s`)
                player.sendMessage(`Set Gamemode To Creative`)
                break;
            case 14:
                player.executeCommand(`gamemode spectator @s`)
                player.sendMessage(`Set Gamemode To Spectator`)
                break;
        }
        container.closeContainer();
    })
    container.onTransaction((action) => {
        const slot = ContainerMenu.getSlot(action).sourceSlot!
        const item = container.getItem(slot)!;
        player.sendMessage(`You Clicked On The Item: "${item.type.identifier}"`)
    })
    container.sendToPlayer();
}
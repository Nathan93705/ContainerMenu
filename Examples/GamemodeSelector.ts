import { ItemIdentifier, ItemStack, Player } from "@serenityjs/core";
import { ContainerMenu } from "../src/ContainerMenu"
import { FakeContainerType } from "../src/containers/Containers";
import { CompoundTag } from "@serenityjs/nbt";

function openMenu(player: Player) {
    const container = ContainerMenu.create(player, FakeContainerType.Chest)

    const survival = new ItemStack(ItemIdentifier.GrassBlock)
    const comp1 = new CompoundTag("display");
    comp1.createStringTag("Name", "Survival");
    survival.nbt.add(comp1);

    const creative = new ItemStack(ItemIdentifier.CommandBlock)
    const comp2 = new CompoundTag("display");
    comp2.createStringTag("Name", "Creative");
    creative.nbt.add(comp2);

    const spectator = new ItemStack(ItemIdentifier.Barrier)
    const comp3 = new CompoundTag("display");
    comp3.createStringTag("Name", "Spectator");
    spectator.nbt.add(comp3);


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
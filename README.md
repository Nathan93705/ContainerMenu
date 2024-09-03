# ContainerMenu
Container Menu is a library plugin for serenityjs to allow players to make things such as chest ui's

----

## Usage Examples

Creating A Chest GUI
```ts
const container = ContainerMenu.create(player, FakeContainerType.Chest);
container.sendToPlayer();
```

Callbacks
```ts
// When The Player Interacts With An Item
container.onTransaction(() => {
    // Do Something
})

//When The Player Closes The Container
container.onContainerClose(() => {
    // Do Something Else
})
```

Add/Remove Items
```ts
//Set The Item Into The 12'th slot
container.setItem(12, new ItemStack(ItemIdentifier.Grass, 1))

//Adds The Item Into The First Free Slot
container.addItem(12, new ItemStack(ItemIdentifier.Grass, 1))

// Clears the item in slot 5
container.clearItem(5);

// Clears all items
container.clearContents();
```

Misc Features
```ts
// Set a custom name to the container
// (must be called before sending the container)
container.setCustomName("Custom Chest UI");

// Closes the container, and destructs it.
container.closeContainer();
```
----
## Examples
```ts
const container = ContainerMenu.create(player, FakeContainerType.Chest)
container.setItem(12, new ItemStack(ItemIdentifier.GrassBlock, 1))
container.setItem(13, new ItemStack(ItemIdentifier.Diamond, 1))

container.onTransaction((action) => {
    const slot = ContainerMenu.getSlot(action).sourceSlot!
    const item = container.getItem(slot)!;
    player.sendMessage(`You Clicked On The Item: "${item.type.identifier}"`)
    container.closeContainer()
})
container.sendToPlayer();
```
Moveable Slots
```ts
container.setItem(12, new ItemStack(ItemIdentifier.GrassBlock, 1))
container.setItem(13, new ItemStack(ItemIdentifier.Diamond, 1))

container.onTransaction((action) => {
    //Make It So All The Slots Can Be Moved
    return {"-1": MOVEABLE}
})
container.sendToPlayer();
```

----
## Advanced Features

Moveable Slots:
```ts
container.setContents({
    12: new ItemStack(ItemIdentifier.Dirt, 1),
    13: new ItemStack(ItemIdentifier.Dirt, 1)
});
container.onTransaction((action) => {
    const slot = ContainerMenu.getSlot(action).sourceSlot!
    player.sendMessage(`Clicked Item Slot ${slot}`);
    container.closeContainer()
    // Sets It So The 12th Slot Cant Be Moved
    // And The 13th Can Be
    return { "12": IMMOVEABLE, "13": MOVEABLE }
})
container.sendToPlayer();
```
You can also have it set the `"-1"` slot to `IMMOVEABLE` or `MOVEABLE` to make all the slots one of the options.

The specifc slot info comes first, before checking for `"-1"` data.

If no return data is provided items wont be able to be moved

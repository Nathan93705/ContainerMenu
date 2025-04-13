# ContainerMenu
Container Menu is a library plugin for serenityjs to allow players to make things such as chest ui's

----

## Usage Examples

Creating A Chest GUI
```ts
const container = ContainerMenu.create(FakeContainerType.Chest);
container.show(player);
```

Callbacks
```ts
// When The Player Interacts With An Item
container.onTransaction(({action}) => {
    // Do Something
})

//When The Player Closes The Container
container.onContainerClose(() => {
    // Do Something Else
})
```

Inventory Mangement
```ts
//Set The Item Into The 12'th slot
container.setItem(12, new ItemStack(ItemIdentifier.Grass))

//Adds The Item Into The First Free Slot
container.addItem(12, new ItemStack(ItemIdentifier.Grass))

// Clears the item in slot 5
container.clearItem(5);

// Clears all items
container.clearContents();

//Updates the content of a container if its already open
container.update(player)
```

Misc Features
```ts
// Set a custom name to the container
// (must be called before sending the container)
container.setCustomName("Custom Chest UI");

// Closes the container, and destructs it.
container.closeContainer(player);
```
----
## Examples
```ts
const container = ContainerMenu.create(FakeContainerType.Chest)
container.setItem(12, new ItemStack(ItemIdentifier.GrassBlock))
container.setItem(13, new ItemStack(ItemIdentifier.Diamond))

container.onTransaction(({action}) => {
    const slot = ContainerMenu.getSlot(action).sourceSlot!
    const item = container.getItem(slot)!;
    player.sendMessage(`You Clicked On The Item: "${item.type.identifier}"`)
    container.closeContainer(player)
})
container.show(player);
```
Moveable Slots
```ts
container.setItem(12, new ItemStack(ItemIdentifier.GrassBlock))
container.setItem(13, new ItemStack(ItemIdentifier.Diamond))

container.onTransaction(({action}) => {
    //Make It So All The Slots Can Be Moved
    return {"-1": MOVEABLE}
})
container.show(player);
```

----
## Advanced Features

Moveable Slots:
```ts
container.setContents({
    12: new ItemStack(ItemIdentifier.Dirt),
    13: new ItemStack(ItemIdentifier.Dirt)
});
container.onTransaction(({action}) => {
    const slot = ContainerMenu.getSlot(action).sourceSlot!
    player.sendMessage(`Clicked Item Slot ${slot}`);

    // Sets It So The 12th Slot Cant Be Moved
    // And The 13th Can Be
    return { "12": IMMOVEABLE, "13": MOVEABLE }
})
container.show(player);
```

(Doesnt Work At This Moment)

You can also have it set the `"-1"` slot to `IMMOVEABLE` or `MOVEABLE` to make all the slots one of the options.

The specifc slot info comes first, before checking for `"-1"` data.

If no return data is provided items wont be able to be moved

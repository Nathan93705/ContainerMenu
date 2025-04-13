import { BlockPosition } from "@serenityjs/protocol";
import { FakeContainer } from "./containers/FakeContainer";
import { Connection } from "@serenityjs/raknet";
import { Player } from "@serenityjs/core";

interface ContainerMetadata {
    container: FakeContainer,
    blockPos: BlockPosition,
}

export namespace PlayerManager {

    export const containerMap = new Map<Connection, ContainerMetadata>()

    export function setContainer(target: Connection | Player, container: ContainerMetadata): void {
        if (target instanceof Player) target = target.connection
        containerMap.set(target, container);
    }

    export function getAllContainers(): ContainerMetadata[] {
        return Array.from(containerMap.values());
    }

    export function removeContainer(target: Connection | Player): void {
        if (target instanceof Player) target = target.connection
        containerMap.delete(target);
    }


    export function getContainer(target: Connection | Player): ContainerMetadata | undefined {
        if (target instanceof Player) target = target.connection
        return containerMap.get(target);
    }

    export function hasContainer(target: Connection | Player): boolean {
        if (target instanceof Player) target = target.connection
        return containerMap.has(target);
    }
}
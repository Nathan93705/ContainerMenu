import { NetworkSession } from "@serenityjs/network";
import { FakeContainer } from "./containers/FakeContainer";

export namespace PlayerManager {
    let playerContainerMap: Map<NetworkSession, FakeContainer> = new Map();

    export function setContainer(session: NetworkSession, container: FakeContainer): void {
        playerContainerMap.set(session, container);
    }

    export function getAllContainers(): FakeContainer[] {
        return Array.from(playerContainerMap.values());
    }

    export function removeContainer(session: NetworkSession): void {
        playerContainerMap.delete(session);
    }

    export function getContainer(session: NetworkSession): FakeContainer | undefined {
        return playerContainerMap.get(session);
    }

    export function hasContainer(session: NetworkSession): boolean {
        return playerContainerMap.has(session);
    }
}
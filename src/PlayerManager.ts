import { Connection } from "@serenityjs/raknet";
import { FakeContainer } from "./containers/FakeContainer";

export namespace PlayerManager {

    export function setContainer(session: Connection, container: FakeContainer): void {
        containerMap.set(session, container);
    }

    export const containerMap = new Map<Connection, FakeContainer>()

    export function getAllContainers(): FakeContainer[] {
        return Array.from(containerMap.values());
    }

    export function removeContainer(session: Connection): void {
        console.log("Removing container for:", session);
        containerMap.delete(session);
    }


    export function getContainer(session: Connection): FakeContainer | undefined {
        return containerMap.get(session);
    }

    export function hasContainer(session: Connection): boolean {
        return containerMap.has(session);
    }
}

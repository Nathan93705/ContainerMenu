import { Plugin, PluginEvents, PluginType } from '@serenityjs/plugins';

declare class ContainerMenu_Plugin extends Plugin implements PluginEvents {
    readonly type = PluginType.Api;
    constructor();
    onInitialize(plugin: Plugin): void;
}
declare const _default: ContainerMenu_Plugin;

export { _default as default };

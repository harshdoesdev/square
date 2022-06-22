import Emitter from "./Emitter";
export default class Entity extends Emitter implements IEntity {
    id: number;
    tags: Set<string>;
    components: Set<string>;
    constructor();
    attach(prop: string, data: any): this;
    detach(prop: string): this;
    tag(tag: string): this;
    untag(tag: string): this;
    destroy(): void;
}

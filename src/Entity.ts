import Emitter from "./Emitter";

let id: number = 0;

export default class Entity extends Emitter implements IEntity {

    id: number;
    tags: Set<string>;
    components: Set<string>;

    constructor() {
        super();
        this.id = id++;
        this.tags = new Set();
        this.components = new Set();
        
        this.tag('*');
    }

    hasComponent(component: string) {
        return this.components.has(`@${component}`);
    }

    attach(prop: string, data: any) {
        this[prop as keyof Entity] = data;
        this.tag(`@${prop}`);
        this.components.add(prop);
        this.emit("attach", prop, this);

        return this;
    }

    detach(prop: string) {
        delete this[prop as keyof Entity];
        this.untag(`@${prop}`);
        this.components.delete(prop);
        this.emit("detach", prop, this);

        return this;
    }
    
    tag(tag: string) {
        this.tags.add(tag);
        this.emit("tag", tag, this);

        return this;
    }

    untag(tag: string) {
        if(this.hasComponent(tag)) {
            console.warn(`Component ${tag} could not be detached.`);
        }
        this.tags.delete(tag);
        this.emit("untag", tag, this);

        return this;
    }

    destroy() {
        super.destroy();
        this.components.forEach(component => this.detach(component));
        this.components.clear();
        this.tags.clear();
        this.tags.add("*");
    }

}

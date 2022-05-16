import Emitter from "./Emitter.js";

let id = 0;

export default class Entity extends Emitter {

    constructor() {
        super();
        this.id = id++;
        this.children = new Set();
        this.tags = new Set();
        
        this.tag('*');
    }

    add(child) {
        child.init();
        this.children.add(child);
        this.emit("add", child);
    }

    remove(child) {
        child.destroy();
        this.children.delete(child);
        this.emit("remove", child);
    }

    attach(prop, component) {
        this[prop] = component;
        this.tag(`@${prop}`);
        this.emit("attach", prop, this);
    }

    detach(prop) {
        delete this[prop];
        this.untag(`@${prop}`);
        this.emit("detach", prop, this);
    }

    tag(...tags) {
        tags.forEach(tag => {
            this.tags.add(tag);
            this.emit("tag", tag, this);
        });
    }

    untag(...tags) {
        tags.forEach(tag => {
            this.tags.delete(tag);
            this.emit("untag", tag, this);
        });
    }

}

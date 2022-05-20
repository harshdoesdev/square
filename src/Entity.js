import Emitter from "./Emitter.js";

let id = 0;

export default class Entity extends Emitter {

    constructor(app) {
        super();
        this.app = app;
        this.id = id++;
        this.tags = new Set();
        this.components = new Set();
        
        this.tag('*');
    }

    attach(prop, data) {
        this[prop] = data;
        this.tag(`@${prop}`);
        this.components.add(prop);
        this.emit("attach", prop, this);

        return this;
    }

    detach(prop) {
        delete this[prop];
        this.untag(`@${prop}`);
        this.components.delete(prop);
        this.emit("detach", prop, this);

        return this;
    }
    
    tag(tag) {
        this.tags.add(tag);
        this.emit("tag", tag, this);

        return this;
    }

    untag(tag) {
        if(this.components.has(`@${tag}`)) {
            console.warn(`Component ${tag} could not be detached.`);
        }
        this.tags.delete(tag);
        this.emit("untag", tag, this);

        return this;
    }

    destroy() {
        this.components.forEach(component => this.detach(component));
        this.components.clear();
        this.tags.clear();
        this.tags.add("*");
    }

}

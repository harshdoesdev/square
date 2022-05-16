import Emitter from "./Emitter.js";
import QueryMap from "./QueryMap.js";

export default class Application extends Emitter {

    running = false

    constructor({ state, systems, entities }) {
        super();
        this.state = state;
        this.systems = new Set(systems);
        this.queryMap = new QueryMap(this);
        entities.forEach(entity => this.add(entity));
    }

    add(entity) {
        this.emit("add", entity);

        entity.on("tag", this.queryMap.boundHandleTag);
        entity.on("untag", this.queryMap.boundHandleUntag);
    }

    remove(entity) {
        this.emit("remove", entity);

        entity.off("tag", this.queryMap.boundHandleTag);
        entity.off("untag", this.queryMap.boundHandleUntag);
    }

    start() {
        if(this.running)
            return;
        this.running = true;
        this._lastStep = performance.now();

        this.systems.forEach(system => system.init(this));
    
        const loop = () => {
            this.tick();
            this._lastStep = performance.now();
            this._frameRequest = requestAnimationFrame(loop);
        };
    
        requestAnimationFrame(loop);
    }

    tick() {
        const now = performance.now();
        const dt = (now - this._lastStep) / 1000;

        this._lastStep = now;
        
        this.systems.forEach(system => {
            const entities = this.queryMap.getEntities(system.constructor.query);
            system.tick(dt, entities, this.state);
        });
    }

    stop() {
        if(this._frameRequest)
            cancelAnimationFrame(this._frameRequest);
        this._frameRequest = null;
        this.running = false;
    }
    
}

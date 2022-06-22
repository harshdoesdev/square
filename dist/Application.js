import Emitter from "./Emitter";
import EntityPool from "./EntityPool";
import QueryMap from "./QueryMap";
export default class Application extends Emitter {
    constructor({ initialState = {}, config = {}, systems }) {
        super();
        this.running = false;
        this._lastStep = 0;
        this._frameRequest = null;
        this.state = initialState;
        this.config = config;
        this.entityPool = new EntityPool();
        this.entities = new Set();
        this.systems = new Set(systems);
        this.queryMap = new QueryMap(this);
    }
    add(entity) {
        this.emit("add", entity);
        this.entities.add(entity);
        entity.on("tag", this.queryMap.boundHandleTag);
        entity.on("untag", this.queryMap.boundHandleUntag);
    }
    remove(entity) {
        this.emit("remove", entity);
        this.entities.delete(entity);
        this.entityPool.recycle(entity);
        entity.off("tag", this.queryMap.boundHandleTag);
        entity.off("untag", this.queryMap.boundHandleUntag);
    }
    query(q) {
        return this.queryMap.getEntities(q);
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        this._lastStep = performance.now();
        this.systems.forEach(system => system(this));
        this.emit("init", this);
        const loop = () => {
            this.update();
            this._lastStep = performance.now();
            this._frameRequest = requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
    update() {
        const now = performance.now();
        const dt = (now - this._lastStep) / 1000;
        this._lastStep = now;
        this.emit("update", dt, this);
    }
    stop() {
        if (this._frameRequest)
            cancelAnimationFrame(this._frameRequest);
        this._frameRequest = null;
        this.running = false;
        this.emit("stop");
    }
}

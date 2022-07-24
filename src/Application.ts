import Emitter from "./Emitter";
import EntityPool from "./EntityPool";
import QueryMap from "./QueryMap";

export default class Application extends Emitter implements IApplication {

    data: {}
    entityPool: EntityPool
    entities: Set<IEntity>
    systems: Set<ISystem>
    queryMap: IQueryMap
    running: boolean = false
    _lastStep: number = 0;
    _frameRequest: number | null = null;

    constructor({ data = {}, systems } : { data: {}, systems: ISystem[] }) {
        super();
        this.data = data;
        this.entityPool = new EntityPool();
        this.entities = new Set();
        this.systems = new Set(systems);
        this.queryMap = new QueryMap(this);
    }

    add(entity: IEntity) {
        this.emit("add", entity);
        this.entities.add(entity);
    }

    remove(entity: IEntity) {
        this.emit("remove", entity);
        this.entities.delete(entity);
        this.entityPool.recycle(entity);
    }

    query(q: string[]) {
        return this.queryMap.getEntities(q);
    }

    start() {
        if(this.running)
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
        if(this._frameRequest)
            cancelAnimationFrame(this._frameRequest);
        this._frameRequest = null;
        this.running = false;
        this.emit("stop");
    }
    
}
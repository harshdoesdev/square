import Emitter from "./Emitter";
import EntityPool from "./EntityPool";
export default class Application extends Emitter implements IApplication {
    data: {};
    entityPool: EntityPool;
    entities: Set<IEntity>;
    systems: Set<ISystem>;
    queryMap: IQueryMap;
    running: boolean;
    _lastStep: number;
    _frameRequest: number | null;
    constructor({ data, systems }: {
        data: {};
        systems: ISystem[];
    });
    add(entity: IEntity): void;
    remove(entity: IEntity): void;
    query(q: string[]): any;
    start(): void;
    update(): void;
    stop(): void;
}

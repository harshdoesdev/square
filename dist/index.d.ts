declare class Emitter {
    topics: Record<string, Set<IListener>>;
    emit(id: string, ...data: any[]): void;
    hasTopic(id: string): boolean;
    on(id: string, listener: IListener): () => void;
    once(id: string, listener: IListener): () => void;
    off(id: string, listener: IListener): void;
    destroy(): void;
}

declare class EntityPool {
    entities: IEntity[];
    constructor();
    getEntities(n: number): IEntity[];
    getEntity(): IEntity | undefined;
    recycle(entity: IEntity): void;
    expand(n?: number): void;
}

declare class Application extends Emitter implements IApplication {
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

export { Application };

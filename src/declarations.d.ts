declare interface IApplication extends IEmitter {
    running: boolean,
    state: {},
    config: {},
    systems: Set<ISystem>,
    entities: Set<IEntity>,
    add(entity): void,
    remove(entity): void,
    query(q): void,
    start(): void,
    update(): void,
    stop(): void
}

declare interface ISystem {
    (app: IApplication): void
}

declare interface IEntity extends IEmitter {
    id: number,
    tags: Set<string>,
    components: Set<string>,
    attach(prop: string, data: any): this,
    detach(prop: string): this,
    tag(tag: string): this,
    untag(tag: string): this,
    destroy(): void
}

declare interface IListener {
    (...data: any[]): void
}

declare interface IEmitter {
    topics: any,
    emit(id: string, ...data: any[]),
    on(id: string, listener: IListener),
    off(id: string, listener: IListener)
}

declare interface IQueryMap {
    boundHandleTag(arg0: string, boundHandleTag: any)
    boundHandleUntag(arg0: string, boundHandleUntag: any)
    getEntities(q: any)
    app: IApplication
    queryMap: Map<string[], Set<IEntity>>
}

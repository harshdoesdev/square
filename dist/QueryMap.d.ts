export default class QueryMap implements IQueryMap {
    app: IApplication;
    queryMap: Map<string[], Set<IEntity>>;
    boundHandleTag: (tag: string, entity: IEntity) => void;
    boundHandleUntag: (tag: string, entity: IEntity) => void;
    constructor(app: IApplication);
    getEntities(query: string[]): Set<IEntity> | undefined;
    onAdd(entity: IEntity): void;
    onRemove(entity: IEntity): void;
    addToMap(entity: IEntity): void;
    removeFromMap(entity: IEntity): void;
    handleTag(tag: string, entity: IEntity): void;
    handleUntag(tag: string, entity: IEntity): void;
    static matchesQuery(entity: IEntity, query: string[]): boolean;
}

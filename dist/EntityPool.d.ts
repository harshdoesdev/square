export default class EntityPool {
    entities: IEntity[];
    constructor();
    getEntities(n: number): IEntity[];
    getEntity(): IEntity | undefined;
    recycle(entity: IEntity): void;
    expand(n?: number): void;
}

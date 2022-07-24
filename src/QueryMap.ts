export default class QueryMap implements IQueryMap {

    app: IApplication
    queryMap: Map<string[], Set<IEntity>>

    handleTag = (_tag: string, entity: IEntity) => {
        this.addToMap(entity);
    }

    handleUntag = (tag: string, entity: IEntity) => {
        this.queryMap.forEach((entities, query) => {
            if(entities.has(entity) && query.includes(tag)) {
                entities.delete(entity);
            }
        });
    }

    constructor(app: IApplication) {
        this.app = app;
        this.queryMap = new Map();
        this.app.on("add", this.onAdd.bind(this));
        this.app.on("remove", this.onRemove.bind(this));
    }

    getEntities(query: string[]) {
        if(!this.queryMap.has(query)) {
            const entitySet: Set<IEntity> = new Set();
            this.app.entities.forEach(entity => {
                if(QueryMap.matchesQuery(entity, query)) {
                    entitySet.add(entity);
                }
            });
            this.queryMap.set(query, entitySet);
        }
        return this.queryMap.get(query);
    }

    onAdd(entity: IEntity) {
        entity.on("tag", this.handleTag);
        entity.on("untag", this.handleUntag);
        
        this.addToMap(entity);
    }

    onRemove(entity: IEntity) {
        entity.off("tag", this.handleTag);
        entity.off("untag", this.handleUntag);

        this.removeFromMap(entity);
    }

    addToMap(entity: IEntity) {
        this.queryMap.forEach((entities, query) => {
            const matches = QueryMap.matchesQuery(entity, query);
            if(matches) {
                entities.add(entity);
            }
        });
    }

    removeFromMap(entity: IEntity) {
        this.queryMap.forEach((entities) => {
            if(entities.has(entity)) {
                entities.delete(entity);
            }
        });
    }

    static matchesQuery(entity: IEntity, query: string[]) {
        if(Array.isArray(query)) {
            return query.every(q => entity.tags.has(q));
        }

        return entity.tags.has(query);
    }

}
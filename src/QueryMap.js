export default class QueryMap {

    boundHandleTag = this.handleTag.bind(this)
    boundHandleUntag = this.handleUntag.bind(this)

    constructor(app) {
        this.app = app;

        this.queries = Array
            .from(this.app.systems)
            .map(system => system.constructor.query || [])
            .map(query => [query, new Set()]);
        
        this.queryMap = new Map(this.queries);
        
        this.app.on("add", this.onAdd.bind(this));
        this.app.on("remove", this.onRemove.bind(this));
    }

    getEntities(query) {
        return this.queryMap.get(query);
    }

    onAdd(entity) {
        this.addToMap(entity);
    }

    onRemove(entity) {
        this.removeFromMap(entity);
    }

    addToMap(entity) {
        this.queryMap.forEach((entities, query) => {
            const matches = QueryMap.matchesQuery(entity, query);
            if(matches) {
                entities.add(entity);
            }
        });
    }

    removeFromMap(entity) {
        this.queryMap.forEach((entities) => {
            if(entities.has(entity)) {
                entities.delete(entity);
            }
        });
    }

    handleTag(tag, entity) {
        this.addToMap(entity);
        console.log(this.queryMap)
    }

    handleUntag(tag, entity) {
        this.queryMap.forEach((entities, query) => {
            if(entities.has(entity) && query.includes(tag)) {
                entities.delete(entity);
            }
        });
    }

    static matchesQuery(entity, query) {
        if(Array.isArray(query)) {
            return query.every(q => entity.tags.has(q));
        }
        return entity.tags.has(query);
    }

}

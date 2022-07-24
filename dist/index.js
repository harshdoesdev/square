class Emitter {
  topics = {};
  emit(id, ...data) {
    const listeners = this.topics[id];
    if (!listeners || listeners.size < 0) {
      return;
    }
    listeners.forEach((listener) => listener(...data));
  }
  hasTopic(id) {
    return Reflect.has(this.topics, id);
  }
  on(id, listener) {
    if (!this.hasTopic(id)) {
      this.topics[id] = /* @__PURE__ */ new Set();
    }
    this.topics[id].add(listener);
    return () => this.off(id, listener);
  }
  once(id, listener) {
    const proxy = (...data) => {
      this.off(id, proxy);
      listener(...data);
    };
    return this.on(id, proxy);
  }
  off(id, listener) {
    if (this.hasTopic(id)) {
      this.topics[id].delete(listener);
    }
  }
  destroy() {
    this.topics = {};
  }
}

let id = 0;
class Entity extends Emitter {
  id;
  tags;
  components;
  constructor() {
    super();
    this.id = id++;
    this.tags = /* @__PURE__ */ new Set();
    this.components = /* @__PURE__ */ new Set();
    this.tag("*");
  }
  hasComponent(component) {
    return this.components.has(`@${component}`);
  }
  attach(prop, data) {
    this[prop] = data;
    this.tag(`@${prop}`);
    this.components.add(prop);
    this.emit("attach", prop, this);
    return this;
  }
  detach(prop) {
    delete this[prop];
    this.untag(`@${prop}`);
    this.components.delete(prop);
    this.emit("detach", prop, this);
    return this;
  }
  tag(tag) {
    this.tags.add(tag);
    this.emit("tag", tag, this);
    return this;
  }
  untag(tag) {
    if (this.hasComponent(tag)) {
      console.warn(`Component ${tag} could not be detached.`);
    }
    this.tags.delete(tag);
    this.emit("untag", tag, this);
    return this;
  }
  destroy() {
    super.destroy();
    this.components.forEach((component) => this.detach(component));
    this.components.clear();
    this.tags.clear();
    this.tags.add("*");
  }
}

class EntityPool {
  entities = [];
  constructor() {
    this.expand();
  }
  getEntities(n) {
    if (n > this.entities.length) {
      this.expand(n - this.entities.length);
    }
    return this.entities.splice(0, n);
  }
  getEntity() {
    if (!this.entities.length) {
      this.expand();
    }
    return this.entities.pop();
  }
  recycle(entity) {
    entity.destroy();
    this.entities.push(entity);
  }
  expand(n = 10) {
    for (let i = 0; i < n; i++) {
      this.entities.push(new Entity());
    }
  }
}

class QueryMap {
  app;
  queryMap;
  handleTag = (_tag, entity) => {
    this.addToMap(entity);
  };
  handleUntag = (tag, entity) => {
    this.queryMap.forEach((entities, query) => {
      if (entities.has(entity) && query.includes(tag)) {
        entities.delete(entity);
      }
    });
  };
  constructor(app) {
    this.app = app;
    this.queryMap = /* @__PURE__ */ new Map();
    this.app.on("add", this.onAdd.bind(this));
    this.app.on("remove", this.onRemove.bind(this));
  }
  getEntities(query) {
    if (!this.queryMap.has(query)) {
      const entitySet = /* @__PURE__ */ new Set();
      this.app.entities.forEach((entity) => {
        if (QueryMap.matchesQuery(entity, query)) {
          entitySet.add(entity);
        }
      });
      this.queryMap.set(query, entitySet);
    }
    return this.queryMap.get(query);
  }
  onAdd(entity) {
    entity.on("tag", this.handleTag);
    entity.on("untag", this.handleUntag);
    this.addToMap(entity);
  }
  onRemove(entity) {
    entity.off("tag", this.handleTag);
    entity.off("untag", this.handleUntag);
    this.removeFromMap(entity);
  }
  addToMap(entity) {
    this.queryMap.forEach((entities, query) => {
      const matches = QueryMap.matchesQuery(entity, query);
      if (matches) {
        entities.add(entity);
      }
    });
  }
  removeFromMap(entity) {
    this.queryMap.forEach((entities) => {
      if (entities.has(entity)) {
        entities.delete(entity);
      }
    });
  }
  static matchesQuery(entity, query) {
    if (Array.isArray(query)) {
      return query.every((q) => entity.tags.has(q));
    }
    return entity.tags.has(query);
  }
}

class Application extends Emitter {
  data;
  entityPool;
  entities;
  systems;
  queryMap;
  running = false;
  _lastStep = 0;
  _frameRequest = null;
  constructor({ data = {}, systems }) {
    super();
    this.data = data;
    this.entityPool = new EntityPool();
    this.entities = /* @__PURE__ */ new Set();
    this.systems = new Set(systems);
    this.queryMap = new QueryMap(this);
  }
  add(entity) {
    this.emit("add", entity);
    this.entities.add(entity);
  }
  remove(entity) {
    this.emit("remove", entity);
    this.entities.delete(entity);
    this.entityPool.recycle(entity);
  }
  query(q) {
    return this.queryMap.getEntities(q);
  }
  start() {
    if (this.running)
      return;
    this.running = true;
    this._lastStep = performance.now();
    this.systems.forEach((system) => system(this));
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
    const dt = (now - this._lastStep) / 1e3;
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

export { Application };
//# sourceMappingURL=index.js.map

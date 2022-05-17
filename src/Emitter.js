export default class Emitter {

    constructor() {
        this.topics = {};
    }

    emit(id, ...data) {
        const listeners = this.topics[id];
        if(!listeners)
            return;
        listeners.forEach(listener => listener(...data));
    }

    on(id, listener) {
        if(!Reflect.has(this.topics, id)) {
            this.topics[id] = new Set();
        }
        this.topics[id].add(listener);
    }

    off(id, listener) {
        if(Reflect.has(this.topics, id)) {
            this.topics[id].delete(listener);
        }
    }

}
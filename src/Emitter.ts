export default class Emitter implements IEmitter {
    topics: any

    constructor() {
        this.topics = {};
    }

    emit(id: string, ...data: any[]) {
        const listeners = this.topics[id];
        if(!listeners)
            return;
        listeners.forEach((listener: IListener) => listener(...data));
    }

    on(id: string, listener: IListener) {
        if(!Reflect.has(this.topics, id)) {
            this.topics[id] = new Set();
        }
        this.topics[id].add(listener);
    }

    off(id: string, listener: IListener) {
        if(Reflect.has(this.topics, id)) {
            this.topics[id].delete(listener);
        }
    }

}
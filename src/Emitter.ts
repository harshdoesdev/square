export default class Emitter {

    topics: Record<string, Set<IListener>> = {}

    emit(id: string, ...data: any[]) {
        const listeners = this.topics[id];
        
        if(!listeners || listeners.size < 0) {
            return;
        }

        listeners.forEach(listener => listener(...data));
    }

    hasTopic(id: string) {
        return Reflect.has(this.topics, id);
    }

    on(id: string, listener: IListener) {
        if(!this.hasTopic(id)) {
            this.topics[id] = new Set();
        }

        this.topics[id].add(listener);

        return () => this.off(id, listener);
    }

    once(id: string, listener: IListener) {
        const proxy = (...data: any[]) => {
            this.off(id, proxy);

            listener(...data);
        };

        return this.on(id, proxy);
    }

    off(id: string, listener: IListener) {
        if(this.hasTopic(id)) {
            this.topics[id].delete(listener);
        }
    }
    
    destroy() {
        this.topics = {};
    }

}
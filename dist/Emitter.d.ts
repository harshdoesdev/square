export default class Emitter implements IEmitter {
    topics: any;
    constructor();
    emit(id: string, ...data: any[]): void;
    on(id: string, listener: IListener): void;
    off(id: string, listener: IListener): void;
}

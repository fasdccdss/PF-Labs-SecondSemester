import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();

export function Subscribe(command: string, handler: (args: string[]) => Promise<void>) {
    emitter.on(command, handler);
}

export function Unsubscribe(command: string, handler: (args: string[]) => Promise<void>) {
    emitter.off(command, handler);
}

export function Dispatch(command: string, args: string[]) {
    emitter.emit(command, args);
}
// usage examples are at main.ts
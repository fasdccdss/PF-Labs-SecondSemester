import { EventEmitter } from 'node:events';
import * as readline from 'node:readline';

export namespace EventBus 
{
    const emitter = new EventEmitter();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    export function Subscribe(command: string, event: (...args: any[]) => void) {
        emitter.on(command, event);
    }

    export function Unsubscribe(command: string, event: (...args: any[]) => void) {
        emitter.off(command, event);
    }

    export async function Dispatch(command: string) {
        const listeners = emitter.listeners(command);
        await Promise.all(listeners.map(fn => fn()));
    }

    export function PromptCommand() {
        rl.question('Enter command: ', (command) => {
            command = command.trim();

            if (!command) return PromptCommand();
            if (command == 'exit') { rl.close(); return; }

            Dispatch(command);
            PromptCommand();
        });
    }
} 

// usage examples are at main.ts

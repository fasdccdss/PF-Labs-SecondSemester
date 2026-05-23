import { EventEmitter } from 'node:events';
import * as readline from 'node:readline';
import { Command, CommandParam, ResolveParams } from './Kursova/Console';

export namespace EventBus 
{
    const emitter = new EventEmitter();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const TYPE_COERCIONS: Record<string, (v: string) => unknown> = 
    {
        int: v => parseInt(v),
        float: v => parseFloat(v),
        string: v => v,
        bool: v => v === "true",
    };

    function parseArgs(rawArgs: string[], params: CommandParam[]): Record<string, unknown> 
    {
        const result: Record<string, unknown> = {};
        params.forEach((p, i) => {
            const coerce = TYPE_COERCIONS[p.type] ?? (v => v);
            result[p.name] = coerce(rawArgs[i]);
        });
        return result;
    }

    export function SubscribeCommand<T extends CommandParam[]>(
        command: Command & { params: T },
        handler: (params: ResolveParams<T>) => void
    ) {
        emitter.on(command.base, (rawArgs: string[]) => {
            const parsed = parseArgs(rawArgs, command.params!);
            handler(parsed as ResolveParams<T>);
        });
    }

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

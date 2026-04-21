import { CalculateAverage } from "rngdebugger";
import { GenerateRandNumInf } from "./generator";
import { TimeoutIterator } from "./iterator";

import * as readline from 'node:readline';
import { Subscribe, Unsubscribe, Dispatch } from './eventbus';

console.log("Average: " + CalculateAverage(TimeoutIterator(GenerateRandNumInf(), 5)));

// Task 7 usage example:
export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// subscribe commands
// Subscribe('filter', filterCommand);
// Subscribe('generate', generateCommand);
// Subscribe('memo', memoCommand);
// Subscribe('queue', queueCommand);
// Subscribe('help', helpCommand);

function promptCommand() {
    rl.question('Enter command: ', (command) => {
        command = command.trim();

        if (!command) return promptCommand();

        if (command === 'exit') {
            rl.close();
            process.exit(0);
        }

        rl.question('Enter arguments: ', (input) => {
            const args = input.trim().split(' ').filter(Boolean);
            Dispatch(command, args);
            promptCommand();
        });
    });
}
rl.on('close', () => process.exit(0));

console.log('AsyncShell ready. Type "exit" to quit.');
promptCommand();
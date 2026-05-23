import { spawn } from 'child_process';
import { EventBus } from '../eventbus';

export class Console
{
    static commands =
    {
        
    }

    OpenWindow(): void
    {
        spawn('cmd', ['/c', 'start', 'cmd', '/k', 'npx ts-node src/Kursova/Console.ts'], {
            detached: true,
            stdio: 'ignore'
        });
    }

    SubscribeCommands()
    {
        EventBus.Subscribe('/help', () => {
            console.log('Hello!');
        });

        EventBus.PromptCommand();
    }
}

type CommandList =
{
    memoize: "/memoize",
    randomInRange: "/randomInRange", // than here we also want to accept 2 nums (min, max)

}

new Console().SubscribeCommands();
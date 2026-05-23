import { spawn } from 'child_process';
import { EventBus } from '../eventbus';
import * as blessed from "blessed";
import { RandIntInRange } from '../generator';

/* COMMAND DEFINITION */
type CommandParam =
{
    name: string,
    type: any
}
type Command = 
{
    command: string; // command itself, for example /add <num1> <num2>
    syntax: string; // command syntax example, example: /add <num> <num>
    description: string; // description of what this command does

    params?: CommandParam[]; // params that command expects (<num1> <num2>)
}
function DefineCommand(
    base: string,
    description: string,
    params: CommandParam[] = []
): Command 
{

};

class CommandList {
    
    /*
    {
        command: "",
        syntax: "",
        description: ""
    }
    */

    randomInRange: Command = 
    {
        params:

        command: "/randomInRange <min> <max>",
        syntax: "/randomInRange <int> <int>",
        description: "Generates a random number in range between <min> and <max>"
    };

    memoize: Command = 
    {
        command: "/memoize",
        syntax: "",
        description: ""
    }

    filter: Command = 
    {
        command: "/filter",
        syntax: "",
        description: ""
    }

    clear: Command = 
    {
        command: "/clear",
        syntax: "",
        description: ""
    }

    exit: Command = 
    {
        command: "/exit",
        syntax: "",
        description: ""
    }

    static commands: Command[] = 
    [

        {
            command: "/randomInRange",
            syntax: "/randomInRange <min> <max>",
            description: "Generates a random number in range between <min> and <max>"
        },
        {
            command: "",
            syntax: "",
            description: ""
        },
        {
            command: "",
            syntax: "",
            description: ""
        }
        {
            randomInRange = {
                "/randomInRange", // than here we also want to accept 2 nums <min>, <max>
            }; 
            memoize: "/memoize", // this one has to be able to accept a <function> param, by processing a command
            filter: "/filter",
            clear: "/clear",
            exit: "/exit"
        }
    ];
}

/* COMMAND SUBSCRIPTION */
function SubscribeCommands()
{
    EventBus.Subscribe(CommandList.commands., () => {
        console.log('Hello!');
    });

    EventBus.Subscribe(CommandList.commands.randomInRange, () => {
        RandIntInRange
    });

    EventBus.PromptCommand();
}

/* BLESSED INITIALIZATION */
const screen = blessed.screen({
    smartCSR: true,
    title: "TUI Console",
    fullUnicode: true,
});

/* SIDEBAR COMMAND LOOK UP */

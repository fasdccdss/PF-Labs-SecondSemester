import { EventBus } from '../eventbus';
import * as blessed from "blessed";
import { RandIntInRange } from '../generator';

/* COMMAND DEFINITION */
type ParamType = 
{
    int: number,
    float: number,
    string: string,
    bool: boolean
}

export type CommandParam =
{
    name: string,
    type: keyof ParamType
}

export type Command = 
{
    params?: CommandParam[]; // params that command expects (<num1> <num2>)

    command: string; // command itself, for example /add <num1> <num2>
    syntax: string; // command syntax example, example: /add <num> <num>
    description: string; // description of what this command does
}

// DefineCommands method allows for robust command definition, with predetermined variables and their types,
// to avoid re-typing those things and possibly fucking them up
function DefineCommand(
    base: string,
    description: string,
    params: CommandParam[] = []
): Command 
{
    let command: string;
    let syntax: string;

    if (params.length == 0)
    {
        command = base;
        syntax = base;
    }
    else
    {
        let paramNames = "";
        let paramTypes = "";

        for (const p of params)
        {
            paramNames += `<${p.name}>`;
            paramTypes += `<${p.type}>`;
        }

        command = `${base} ${paramNames.trim()}`;
        syntax = `${base} ${paramTypes.trim()}`;
    }

    return { params, command,  syntax, description };
};

// helper that converts each defined "CommandParam" in "Command" to an
// object with its name and type fetched from its respective "CommandParam"
// this is integrated to provide type control when subscriding a command
type ResolveParams<T extends CommandParam[]> = {
    [K in T[number]as K["name"]]: ParamType[K["type"]];
};

/* COMMAND LIST */ 
class CommandList {
    
    /*
    {
        command: "",
        syntax: "",
        description: ""
    }
    */

    randomInRange = DefineCommand(
        "/randomInRange", 
        "Generates a random number in range between <min> and <max>",
        [
            { name: "min", type: "int" },
            { name: "max", type: "int" }
        ]
    );

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
}

/* COMMAND SUBSCRIPTION */
function SubscribeCommands()
{
    EventBus.Subscribe(, () => {
        console.log('Hello!');
    });

    EventBus.Subscribe(, () => {
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

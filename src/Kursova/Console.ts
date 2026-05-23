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
    params: CommandParam[]; // params that command expects (<num1> <num2>)

    base: string; // base of the command, example: /add
    command: string; // command itself, constructed by adding names of params to the base, example: /add <num1> <num2>
    syntax: string; // command syntax, example: /add <int> <int>
    description: string; // description of what this command does
}

// DefineCommands method allows for robust command definition, with predetermined variables and their types,
// to avoid re-typing those things and possibly fucking them up
function DefineCommand<const T extends CommandParam[]>(
    base: string,
    description: string,
    params: T = [] as unknown as T
): Command & { params: T }
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

    return { base, params, command,  syntax, description };
};

// helper that converts each defined "CommandParam" in "Command" to an
// object with its name and type fetched from its respective "CommandParam"
// this is integrated to provide type control when subscriding a command
export type ResolveParams<T extends CommandParam[]> = {
    [K in T[number]as K["name"]]: ParamType[K["type"]];
};

/* COMMAND LIST */ 
class CommandList {

    static randomInRange = DefineCommand(
        "/randomInRange", 
        "Generates a random number in range between <min> and <max>",
        [
            { name: "min", type: "int" },
            { name: "max", type: "int" }
        ]
    );

    static memoize = DefineCommand(
        "/memoize",
        "Caches the provided function",
        [
            // some form of function here
        ]
    );

    /*
    filter: Command = 
    {
        command: "/filter",
        syntax: "",
        description: ""
    }
    */

    static clear = DefineCommand(
        "/clear",
        "Clears the console"
    );

    static exit = DefineCommand(
        "/exit",
        "Exits the console"
    );
}

/* COMMAND SUBSCRIPTION */
function SubscribeCommands()
{
    // random int in range
    EventBus.SubscribeCommand(CommandList.randomInRange, (params) => {
        var intInRange = RandIntInRange(params.min, params.max);
        console.log(`Random int in range ${params.min}-${params.max}:`, intInRange);
    });
    // clear
    EventBus.SubscribeCommand(CommandList.clear, (params) => {
        console.clear();
    });
    // exit
    EventBus.SubscribeCommand(CommandList.exit, (params) => {
        console.log("haven't implemented yet");
    });

    // start the event bus
    EventBus.PromptCommand();
}

////////////////////////////
// INTERFACE CONSTRUCTION //
////////////////////////////

/* SCREEN INITIALIZATION */
const screen = blessed.screen({
    smartCSR: true,
    title: "TUI Console",
    fullUnicode: true
});
// 
const background = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    style: {
        bg: "#1c1c1c"
    }
});

/* SIDEBAR COMMAND LOOK UP TABLE*/
const lookupTable = blessed.box({
    parent: screen,
    top: 0, 
    left: 0,
    width: 30,
    height: "100%",
    label: " command list ",
    tags: true,
    border: { type: "line" },
    style: 
    {
        bg: "#1c1c1c",
        fg: "#e8e8e8",
        border: { bg: "#121212", fg: "#ff0000" },
        label: { bg: "#121212", fg: "#ff0000" },
        scrollbar: { bg: "#121212", fg: "#ff0000" },
    },
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    vi: true,
    mouse: true,
    scrollbar: { ch: " ", style: { bg: "#ff0000" } },
    padding: { left: 1, right: 1 }
});
// draw text to the command look up table
function DrawLookupTable()
{
    const commands = Object.values(CommandList) as Command[];
    const separatorWidth = 25;
    const separator = "─".repeat(separatorWidth);

    const lines = commands.map(cmd => 
    {
        const finalText: string[] = [];

        finalText.push(""); // add some space
        finalText.push(`{bold}${cmd.command}{/bold}`); // draws the command
        finalText.push(""); // add some space

        for (const param of cmd.params) // loops over and draws each param of the command
        {
            finalText.push(`{#aaaaaa-fg}  ${param.name}: ${param.type}{/#aaaaaa-fg}`);
        }
        finalText.push(""); // add some space

        finalText.push("Description:", cmd.description); // draws the description
        finalText.push(""); // add some space

        return finalText.join("\n");
    });

    // join each command block with a blank line + separator + blank line
    lookupTable.setContent(lines.join(`\n${separator}\n`));
    screen.render();
}

DrawLookupTable()

screen.render(); // renders the window..
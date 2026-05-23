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
        logBox.log(`Random int in range ${params.min}-${params.max}: ${intInRange}`);
        screen.render();
    });
    // clear
    EventBus.SubscribeCommand(CommandList.clear, (params) => {
        logBox.setContent(""); // clears the log
        screen.render();
    });
    // exit
    EventBus.SubscribeCommand(CommandList.exit, (params) => {
        logBox.log("haven't implemented yet");
        screen.render();
    });
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

/* LOG BOX */
const logBox = blessed.log({
    parent: screen,
    top: 0,
    left: 30,
    width: "100%-30",
    height: "100%-3",
    label: " output ",
    tags: true,
    border: { type: "line" },
    style: {
        bg: "#080808",
        fg: "#e8e8e8",
        border: { bg: "#080808", fg: "#e8e8e8" },
        label: { bg: "#080808", fg: "#e8e8e8" },
        scrollbar: { bg: "#e8e8e8" }
    },
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    mouse: true,
    scrollbar: { ch: " ", style: { bg: "#e8e8e8" } },
    padding: { left: 1 },
});

/* INPUT BAR */
const inputBar = blessed.textbox({
    parent: screen,
    bottom: 0,
    left: 30,
    width: "100%-30",
    height: 3,
    label: " input ",
    tags: true,
    border: { type: "line"},
    style: {
        bg: "#080808",
        fg: "#e8e8e8",
        border: { bg: "#080808", fg: "#e8e8e8" },
        label: { bg: "#080808", fg: "#e8e8e8" },
    },
    inputOnFocus: true, // enables typing
    mouse: true,
    padding: { left: 1 },
});

// turning input bar on
inputBar.on("submit", (value: string) => {
    const trimmed = value.trim();

    if (trimmed) {
        logBox.log(`{bold}{lime-fg}> ${trimmed}{/lime-fg}{/bold}`);
        EventBus.DispatchRaw(trimmed);
    }

    inputBar.clearValue();
    inputBar.focus();
    inputBar.readInput();
    screen.render();
});

/* FINAL PASS */
screen.key(["Esc"], () => process.exit(0)); // subscribe an exit to input bar
inputBar.focus(); // enter input bar at start

SubscribeCommands(); // register all commands
DrawLookupTable(); // draw lookup

screen.render(); // renders the window..
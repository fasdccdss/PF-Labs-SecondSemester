import { spawn } from "child_process";
import * as path from "path";

const scriptPath = path.resolve(__dirname, "Console.ts");

function openInNewWindow(): void {
    const isWindows = process.platform === "win32";

    if (isWindows) {
        spawn(
            "cmd",
            ["/c", "start", "cmd", "/k", `set TERM=xterm-256color && npx tsx ${scriptPath}`],
            { detached: true, stdio: "ignore" }
        ).unref();

    } else {
        spawn(
            "xterm",
            ["-e", `npx ts-node "${scriptPath}"`],
            { detached: true, stdio: "inherit" }
        ).unref();
    }
}

openInNewWindow();
import { spawn } from "child_process";
import * as path from "path";

const scriptPath = path.resolve(__dirname, "Console.ts");

/**
 * Windows: start — открывает новое окно cmd/powershell
 * Mac/Linux: используй 'xterm', 'gnome-terminal' и т.д. (см. ниже)
 */
function openInNewWindow(): void {
    const isWindows = process.platform === "win32";

    if (isWindows) {
        /**
         * spawn('cmd', [...]) — запускаем cmd.exe
         * /c start           — открыть новое окно
         * powershell         — в новом окне запустить PowerShell
         * -NoExit            — не закрывать окно после завершения команды
         * -Command           — передать команду
         */
        spawn(
            "cmd",
            ["/c", "start", "cmd", "/k", `npx tsx ${scriptPath}`],
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
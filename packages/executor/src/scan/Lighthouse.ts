import { fork, ChildProcess } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const log = logger.child({ module: "Lighthouse" });

export class Lighthouse {
  private static childProcesses: Set<ChildProcess> = new Set();

  public static async calculateA11yScore(
    url: string,
  ): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      const child = fork(path.join(__dirname, "LighthouseRunner.js"), [url]);
      this.childProcesses.add(child);

      child.on("message", (message) => {
        log.debug(`Lighthouse process for ${url} returned ${message}`);
        if (message === "undefined") {
          resolve(undefined);
        } else {
          resolve(parseInt(message.toString()));
        }
      });

      child.on("error", reject);

      child.on("exit", (code) => {
        log.debug(`Lighthouse process for ${url} exited ${code}`);
        this.childProcesses.delete(child);
        if (code !== 0) {
          reject(
            new Error(
              `💥 Lighthouse process for ${url} exited with code ${code}`,
            ),
          );
        }
      });
    });
  }

  public static cleanUpChildProcesses() {
    log.debug("Stopping all Lighthouse child processes...");
    for (const child of this.childProcesses) {
      child.kill();
    }
  }
}

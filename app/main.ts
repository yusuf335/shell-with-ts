import { createInterface } from "readline";
import path from "node:path";
import { accessSync, constants } from "node:fs";
import { spawnSync } from "node:child_process";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

const BUILTINS = new Set(["exit", "echo", "type"]);

rl.prompt();

rl.on("line", (line: string) => {
  const [command, ...args] = line.trim().split(" ");

  switch (command) {
    case "exit":
      return rl.close();

    case "echo":
      console.log(args.join(" "));
      break;

    case "type": {
      let found = false;
      const target = args.join(" ");
      if (BUILTINS.has(target)) {
        console.log(`${target} is a shell builtin`);
        break;
      }

      const directories = process.env.PATH.split(path.delimiter);
      for (const dir of directories) {
        try {
          accessSync(path.join(dir, target), constants.X_OK);
          console.log(`${target} is ${path.join(dir, target)}`);
          found = true;
          break;
        } catch (err) {
          continue;
        }
      }
      if (!found) console.error(`${target}: not found`);

      break;
    }

    default: {
      let executeProgram = false;
      const directories = process.env.PATH.split(path.delimiter);
      for (const dir of directories) {
        try {
          accessSync(path.join(dir, command), constants.X_OK);
          executeProgram = true;
          spawnSync(command, args, { studio: "inherit" });
          break;
        } catch (err) {
          continue;
        }
      }
      if (!executeProgram) console.log(`${line}: command not found`);
    }
  }

  rl.prompt();
});

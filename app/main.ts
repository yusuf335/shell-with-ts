import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();
rl.on("line", (command: string) => {
  switch (command.trim().split(" ")[0]) {
    case "exit":
      return rl.close();
    case "echo":
      const removeEcho = command.split(" ");
      removeEcho.shift();
      console.log(removeEcho.join(" "));
      break;
    case "type":
      const removeType = command.split(" ");
      removeType.shift();
      if (removeType.join(" ") !== "exit" || "echo" || " type") {
        console.log(`${removeType.join(" ")}: not found`);
        break;
      }

      console.log(`${removeType.join(" ")} is a shell builtin`);
      break;
    default:
      console.log(`${command}: command not found`);
  }
  rl.prompt();
});

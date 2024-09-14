import { Interpreter } from "./interpret.ts";
import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";
import { error } from "./util.ts";

const args = Deno.args;

if (args.length !== 1) {
    error("usage: elysium <path>");
}

const contents = await Deno.readTextFile(args[0])
    .catch((e) => error(e));

const lexer = new Lexer(contents ?? "");
const parser = new Parser(lexer.lex());
new Interpreter(parser.parse()).interpret();
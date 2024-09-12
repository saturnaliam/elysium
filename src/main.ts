import { Interpreter } from "./interpret.ts";
import { Lexer, print_tokens } from "./lexer.ts";
import { Stack } from "./stack.ts";

//const lexer = new Lexer("]24.+9//.+2/..+1^*****");
const lexer = new Lexer("]24.+9//.+2/..+1.-23//.-4.+18/.+8.+1.-2.-3/^************");
const tokens = lexer.lex();
const interpreter = new Interpreter(tokens);
interpreter.interpret();
import { Interpreter } from "./interpret.ts";
import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";

//const lexer = new Lexer("]24.+9//.+2/..+1^*****");
const lexer = new Lexer("]24.+9//.+2/..+1.-23//.-4.+18/.+8.+1.-2.-3/^************");
const tokens = lexer.lex();
const parser = new Parser(tokens);
const interpreter = new Interpreter(parser.parse());
interpreter.interpret();
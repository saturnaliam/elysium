import { Interpreter } from "./interpret.ts";
import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";

//const lexer = new Lexer("]24.+9//.+2/..+1^*****");
//const lexer = new Lexer("]24.+9//.+2/..+1.-23//.-4.+18/.+8.+1.-2.-3/^************");
const lexer = new Lexer("push 24 dup add 9 one one dup add 2 one dup dup add 1 dup sub 23 one one dup sub 4 dup add 18 one dup add 8 dup add 1 dup sub 2 dup sub 3 one reverse print print print print print print print print print print print print");
const tokens = lexer.lex();
const parser = new Parser(tokens);
const interpreter = new Interpreter(parser.parse());
interpreter.interpret();
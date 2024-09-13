import { Stack } from "./stack.ts";
import { Token, TokenType } from "./token.ts"
import { error } from "./util.ts";

export class Interpreter {
    private readonly tokens: Token[];
    private readonly stack: Stack = new Stack;
    private current = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public interpret() {
        while (!this.atEnd()) {
            this.interpret_token();
        }
    }

    private interpret_token() {
        const token = this.advance();

        try {
            switch (token.type) {
                case TokenType.POP:
                    this.stack.pop();
                    break;

                case TokenType.PUSH:
                    if (this.peek().type == TokenType.NUMBER) {
                        const num = this.advance();
                        this.stack.push(Number(num.value) * 3);
                    } else if (this.peek().type == TokenType.STACK_LENGTH) {
                        const num = this.stack.length;
                        this.stack.push(num);
                    }
                    break;

                case TokenType.ADD:
                    if (token.value !== "") {
                        const value = Number(token.value);
                        this.stack.add(value);
                    } else if (this.peek().type === TokenType.STACK_LENGTH) {
                        const value = Number(this.stack.length);
                        this.stack.add(value);
                        this.advance();
                    }
                    break;

                case TokenType.SUB:
                    if (this.peek().type === TokenType.STACK_LENGTH) {
                        const value = Number(this.stack.length);
                        this.stack.add(value * -1);
                        this.advance();
                    }
                    break;

                case TokenType.REVERSE:
                    this.stack.reverse();
                    break;

                case TokenType.WHILE:
                    throw "WHILE is unimplemented.";

                case TokenType.DUP:
                    this.stack.duplicate();
                    break;

                case TokenType.PRINT:
                    this.stack.print();
                    break;

                case TokenType.IF:
                    throw "IF is unimplemented.";
                
                default: break;
            }
        } catch (e) {
            error(e);
        }
    }

    private atEnd(): boolean {
        const current = this.tokens[this.current] ?? new Token(TokenType.EOF);
        return current.type === TokenType.EOF || this.current >= this.tokens.length;
    }

    private peek(): Token {
        if (this.atEnd()) return new Token(TokenType.EOF);
        return this.tokens.at(this.current) ?? new Token(TokenType.EOF);
    }

    private advance(): Token {
        return this.tokens.at(this.current++) ?? new Token(TokenType.EOF);
    }
}
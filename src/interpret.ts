import { Stack } from "./stack.ts";
import { Token, TokenType } from "./token.ts"

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

        switch (token.type) {
            case TokenType.POP: 
                try {
                    this.stack.pop();
                } catch (e) {
                    console.error(e);
                    Deno.exit(1);
                }
                break;

            case TokenType.PUSH:
                if (this.peek().type == TokenType.NUMBER) {
                    const num = this.advance();
                    this.stack.push(Number(num.value) * 3);
                }
                break;

            case TokenType.ADD:
                if (this.peek().type == TokenType.NUMBER) {
                    const num = this.advance();
                    this.stack.add(Number(num.value) * 3);
                }
                break;

            case TokenType.SUB:
                if (this.peek().type == TokenType.NUMBER) {
                    const num = this.advance();
                    this.stack.add(Number(num.value) * -3);
                }
                break;

            case TokenType.ONE:
                this.stack.add(1);
                break;

            case TokenType.REVERSE:
                this.stack.reverse();
                break;

            case TokenType.WHILE:
                break;
            case TokenType.DUP:
                try {
                    this.stack.duplicate();
                } catch (e) {
                    console.error(e);
                    Deno.exit(1);
                }
                break;

            case TokenType.PRINT:
                try {
                    this.stack.print();
                } catch (e) {
                    console.error(e);
                    Deno.exit(1);
                }
                break;

            case TokenType.IF:
                break;

            default: break;
        }
    }

    private atEnd(): boolean {
        return this.tokens[this.current].type == TokenType.EOF;
    }

    private peek(): Token {
        if (this.atEnd()) return new Token(TokenType.EOF);
        return this.tokens.at(this.current) ?? new Token(TokenType.EOF);
    }

    private advance(): Token {
        return this.tokens.at(this.current++) ?? new Token(TokenType.EOF);
    }
}
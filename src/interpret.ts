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
                    if (token.value !== "") {
                        this.stack.push(Number(token.value));
                    } else if (this.peek().type === TokenType.STACK_LENGTH) {
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
                    } else {
                        // this MUST mean a value popped is being added
                        const value = this.stack.pop();
                        this.stack.add(value);
                    }
                    break;

                case TokenType.SUB:
                    if (this.peek().type === TokenType.STACK_LENGTH) {
                        const value = Number(this.stack.length);
                        this.stack.add(value * -1);
                        this.advance();
                    } else {
                        // this MUST mean a value popped is being added
                        const value = this.stack.pop();
                        this.stack.add(value * -1);
                    }
                    break;

                case TokenType.REVERSE:
                    this.stack.reverse();
                    break;

                case TokenType.WHILE:
                    this.while();
                    break;

                case TokenType.DUP:
                    this.stack.duplicate();
                    break;

                case TokenType.PRINT:
                    this.stack.print();
                    break;

                
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

    // rly bad
    private while() {
        let condition = (): boolean => { return false };
        
        if (this.peek().type === TokenType.STACK) {
            condition = (): boolean => !this.stack.isEmpty;
            this.advance();
        } else {
            // while stacklength <op> y
            if (this.peek().type === TokenType.STACK_LENGTH) this.advance();
            const next = this.peek();
            const rh = Number(next.value);
            switch (next.type) {
                case TokenType.GREATER:
                    condition = (): boolean => this.stack.length > rh;
                    break;
                case TokenType.GREATER_EQUAL:
                    condition = (): boolean => this.stack.length >= rh;
                    break
                case TokenType.LESS:
                    condition = (): boolean => this.stack.length < rh;
                    break
                case TokenType.LESS_EQUAL:
                    condition = (): boolean => this.stack.length <= rh;
                    break;
                case TokenType.EQUAL:
                    condition = (): boolean => this.stack.length === rh;
                    break;
                case TokenType.BANG:
                    condition = (): boolean => this.stack.length !== rh;
                    break;
                default:
                    error("no comparison given!");
                }
                this.advance();
            }
            
            const while_index = this.current;
            let paren_depth = 0;
            while (condition()) {
                const next = this.peek();
                
            switch (next.type) {
                case TokenType.L_CURLY:
                    paren_depth++;
                    this.advance();
                    break;

                case TokenType.R_CURLY:
                    paren_depth--;
                    this.advance();
                    break;
            
                default:
                    this.interpret_token();
                    break;
            }

            if (paren_depth === 0) {
                this.current = while_index;
            }
        }
    }
}
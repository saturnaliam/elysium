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

    public async interpret() {
        while (!this.at_end()) {
            await this.interpret_token();
        }
    }

    private async interpret_token() {
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

                case TokenType.INPUT:
                    await this.input();
                    break;
                
                default: break;
            }
        } catch (e) {
            error(e);
        }
    }

    private at_end(): boolean {
        return this.peek().type === TokenType.EOF || this.current >= this.tokens.length;
    }

    private peek(): Token {
        return this.tokens.at(this.current) ?? new Token(TokenType.EOF);
    }

    private advance(): Token {
        return this.tokens.at(this.current++) ?? new Token(TokenType.EOF);
    }

    // rly bad
    private while() {
        let condition = (): boolean => { return false };
        
        if (this.peek().type === TokenType.STACK) {
            condition = (): boolean => !this.stack.is_empty;
            this.advance();
        } else {
            // handling comparison between stack length & a value

            // removing stack length from the comparison, bc its optional
            if (this.peek().type === TokenType.STACK_LENGTH) this.advance();

            // getting the comparison operator & the value to compare against
            const operator = this.peek();
            const rh = Number(operator.value);
            
            switch (operator.type) {
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
                
                // handling opening / closing curly braces, or handing off the token to be interpreted.
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

    private async input() {
        // https://stackoverflow.com/a/77718952
        Deno.stdin.setRaw(true);

        let chunk = new Uint8Array(0);
        const reader = Deno.stdin.readable.getReader();
        
        if (chunk.length === 0) {
            const readResult = await reader.read();
            if (readResult.done) return;
            chunk = readResult.value;
        }

        const key = chunk[0];
        chunk = chunk.slice(1);
        if (key === 3) Deno.exit(1);

        this.stack.push(key);
        Deno.stdin.setRaw(false);
    }
}
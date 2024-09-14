import { TokenType } from "./token.ts";
import { Token } from "./token.ts";
import { error } from "./util.ts";

export class Parser {
    private readonly input: Token[];
    private tokens: Token[] = new Array<Token>();
    private current = 0;
    
    constructor(input: Token[]) {
        this.input = input;
    }

    public parse(): Token[] {
        while (!this.atEnd()) {
            this.parseToken();
        }

        return this.tokens;
    }

    private parseToken() {
        const token = this.advance();

        switch (token.type) {
            case TokenType.ADD: {
                const next = this.peek();
                if (next.type === TokenType.NUMBER) {
                    const value = Number(next.value);
                    this.addToken(TokenType.ADD, `${value * 3}`);
                    this.advance();
                } else if (next.type === TokenType.STACK_LENGTH || next.type === TokenType.POP) {
                    this.addToken(TokenType.ADD);
                } else {
                    error("no number given to add!");
                }
            }
            break;
                
            case TokenType.SUB: {
                const next = this.peek();
                if (next.type === TokenType.NUMBER) {
                    const value = Number(next.value);
                    this.addToken(TokenType.ADD, `${value * -3}`);
                    this.advance();
                } else if (next.type === TokenType.STACK_LENGTH || next.type === TokenType.POP) {
                    this.addToken(TokenType.SUB);
                } else {
                    error("no number given to subtract!");
                }
            }
            break;

            case TokenType.ONE:
                this.addToken(TokenType.ADD, "1");
                break;

            case TokenType.PUSH: {
                const next = this.peek();
                if (next.type === TokenType.NUMBER) {
                    const value = Number(next.value);
                    this.addToken(TokenType.PUSH, `${value * 3}`);
                    this.advance();
                } else if (next.type === TokenType.STACK_LENGTH) {
                    this.addToken(TokenType.PUSH);
                } else {
                    error("no number given to push!");
                }
            }
            break;

            case TokenType.GREATER:
            case TokenType.GREATER_EQUAL:
            case TokenType.LESS:
            case TokenType.LESS_EQUAL:
            case TokenType.EQUAL:
            case TokenType.BANG: {
                const next = this.peek();
                if (next.type === TokenType.NUMBER) {
                    const value = Number(next.value);
                    this.addToken(token.type, `${value}`);
                    this.advance();
                } else {
                    error("no number given for comparison.");
                }
            }
            break;
           
            default:
                this.addToken(token.type, token.value);
        }
    }

    private addToken(type: TokenType, value = "") {
        this.tokens.push(new Token(type, value));
    }

    private advance(): Token {
        return this.input.at(this.current++) ?? new Token(TokenType.EOF);
    }

    private peek(): Token {
        return this.input.at(this.current) ?? new Token(TokenType.EOF);
    }

    private atEnd(): boolean {
        return (this.input[this.current].type === TokenType.EOF) || this.current >= this.input.length;
    }
}
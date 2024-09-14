import { Token, TokenType, keywords } from "./token.ts";

export class Lexer {
    private readonly src: string;
    private readonly tokens = new Array<Token>();
    private current = 0;
    private start = 0;

    constructor(source_code: string) {
        this.src = source_code;
    }

    public lex(): Token[] {
        while (!this.at_end()) {
            this.lex_token();
        }

        this.add_token(TokenType.EOF);
    
        return this.tokens;
    }

    private lex_token() {
        this.start = this.current;
        const c = this.advance();

        switch (c) {
            case ']': this.add_token(TokenType.PUSH);         break;
            case '[': this.add_token(TokenType.POP);          break;
            case '+': this.add_token(TokenType.ADD);          break;
            case '-': this.add_token(TokenType.SUB);          break;
            case '/': this.add_token(TokenType.ONE);          break;
            case '^': this.add_token(TokenType.REVERSE);      break;
            case '~': this.add_token(TokenType.WHILE);        break;
            case '.': this.add_token(TokenType.DUP);          break;
            case '#': this.add_token(TokenType.STACK);        break;
            case '*': this.add_token(TokenType.PRINT);        break;
            case '{': this.add_token(TokenType.L_CURLY);      break;
            case '}': this.add_token(TokenType.R_CURLY);      break;
            case '=': this.add_token(TokenType.EQUAL);        break;
            case '$': this.add_token(TokenType.STACK_LENGTH); break;
            case '@': this.add_token(TokenType.INPUT);        break;

            case '<':
                this.add_token((this.match('=')) ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;

            case '>':
                this.add_token((this.match('=')) ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;

            case ';':
                while (this.peek() != "\n" && !this.at_end()) this.advance();
                break;
            
            case '\r':
            case '\t':
            case '\n':
            case ' ':
                break;

            default:
                if (this.is_digit(c)) {
                    this.number();
                } else if (this.is_alpha(c)) {
                    this.identifier();
                }
                break;
        }
    }

    // peeking / consuming functions
    private advance(): string {
        return this.src.at(this.current++) ?? "\0";
    }

    private match(expected: string): boolean {
        if (this.at_end()) return false;
        if (this.src.at(this.current) != expected) return false;

        this.current++;
        return true;
    }

    private peek(): string {
        if (this.at_end()) return "\0";
        return this.src.at(this.current) ?? "\0";
    }

    // number / ident
    private number() {
        while (this.is_digit(this.peek())) this.advance();

        const value = this.src.substring(this.start, this.current);
        this.add_token(TokenType.NUMBER, value);
    }

    private identifier() {
        while (this.is_alpha_num(this.peek())) this.advance();

        const text = this.src.substring(this.start, this.current);
        const type = keywords[text];
        if (type == null) {
            console.log(type);
            console.error("ERROR: invalid keyword");
            Deno.exit(1);
        }
        this.add_token(type);
    }

    // adding tokens
    private add_token(type: TokenType, value = "") {
        this.tokens.push(new Token(type, value));
    }

    // basic utilities
    private at_end(): boolean { return this.current >= this.src.length; }
    
    private is_digit(input: string): boolean { return /[0-9]/.test(input); }

    private is_alpha(input: string): boolean { return /[a-zA-Z_]/.test(input); }

    private is_alpha_num(input: string): boolean {
        return this.is_alpha(input) || this.is_digit(input);
    }
};

export function print_tokens(tokens: Token[]) {
    for (const token of tokens) {
        console.log(token.pretty_print());
    }
}
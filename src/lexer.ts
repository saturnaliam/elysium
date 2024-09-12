import { Token, TokenType, keywords } from "./token.ts";

export class Lexer {
    private readonly src: string;
    private readonly tokens = new Array<Token>();
    private current = 0;
    private start = 0;

    constructor(sourceCode: string) {
        this.src = sourceCode;
    }

    public lex(): Token[] {
        while (!this.atEnd()) {
            this.lexToken();
        }

        this.addToken(TokenType.EOF);
    
        return this.tokens;
    }

    private lexToken() {
        this.start = this.current;
        const c = this.advance();

        switch (c) {
            case ']': this.addToken(TokenType.PUSH);         break;
            case '[': this.addToken(TokenType.POP);          break;
            case '+': this.addToken(TokenType.ADD);          break;
            case '-': this.addToken(TokenType.SUB);          break;
            case '/': this.addToken(TokenType.ONE);          break;
            case '^': this.addToken(TokenType.REVERSE);      break;
            case '~': this.addToken(TokenType.WHILE);        break;
            case '.': this.addToken(TokenType.DUP);          break;
            case '#': this.addToken(TokenType.STACK);        break;
            case '*': this.addToken(TokenType.PRINT);        break;
            case '{': this.addToken(TokenType.L_CURLY);      break;
            case '}': this.addToken(TokenType.R_CURLY);      break;
            case '_': this.addToken(TokenType.LEAVE);        break;
            case '%': this.addToken(TokenType.IF);           break;
            case '=': this.addToken(TokenType.EQUAL);        break;
            case '$': this.addToken(TokenType.STACK_LENGTH); break;

            case '!':
                this.addToken((this.match('=')) ? TokenType.BANG_EQUAL : TokenType.BANG);
                break;

            case '<':
                this.addToken((this.match('=')) ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;

            case '>':
                this.addToken((this.match('=')) ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;

            case ';':
                while (this.peek() != "\n" && !this.atEnd()) this.advance();
                break;
            
            case '\r':
            case '\t':
            case '\n':
            case ' ':
                break;

            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
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
        if (this.atEnd()) return false;
        if (this.src.at(this.current) != expected) return false;

        this.current++;
        return true;
    }

    private peek(): string {
        if (this.atEnd()) return "\0";
        return this.src.at(this.current) ?? "\0";
    }

    private peekNext(): string {
        if (this.current + 1 >= this.src.length) return "\0";
        return this.src.at(this.current + 1) ?? "\0";
    }

    // number / ident
    private number() {
        while (this.isDigit(this.peek())) this.advance();

        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance();

            while (this.isDigit(this.peek())) this.advance();
        }

        const value = this.src.substring(this.start, this.current);
        this.addToken(TokenType.NUMBER, value);
    }

    private identifier() {
        while (this.isAlphanum(this.peek())) this.advance();

        const text = this.src.substring(this.start, this.current);
        const type = keywords[text];
        if (type == null) {
            console.log(type);
            console.error("ERROR: invalid keyword");
            Deno.exit(1);
        }
        this.addToken(type);
    }

    // adding tokens
    private addToken(type: TokenType, value = "") {
        this.tokens.push(new Token(type, value));
    }

    // basic utilities
    private atEnd(): boolean { return this.current >= this.src.length; }
    
    private isDigit(input: string): boolean { return /[0-9]/.test(input); }

    private isAlpha(input: string): boolean { return /[a-zA-Z_]/.test(input); }

    private isAlphanum(input: string): boolean {
        return this.isAlpha(input) || this.isDigit(input);
    }
};

export function print_tokens(tokens: Token[]) {
    for (const token of tokens) {
        console.log(token.pretty_print());
    }
}
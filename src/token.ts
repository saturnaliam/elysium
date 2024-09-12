export enum TokenType {
    PUSH,         POP,           // [ ]
    ADD,          SUB,           // + -
    ONE,          REVERSE,       // / ^
    WHILE,        DUP,           // ~ .
    STACK,        PRINT,         // # *
    L_CURLY,      R_CURLY,       // { }
    LEAVE,        IF,            // _ %
    GREATER,      GREATER_EQUAL, // > >=
    LESS,         LESS_EQUAL,    // < <=
    EQUAL,        BANG_EQUAL,    // = !=
    STACK_LENGTH, NUMBER,        // $
    BANG, EOF                    // !
};

export class Token {
    public readonly type: TokenType;
    public readonly value: string;

    constructor(type: TokenType, value = "") {
        this.type = type;
        this.value = value;
    }

    public pretty_print(): string {
        return `${TokenType[this.type]} ${(this.value == "") ? "" : this.value}`;
    }
}

export const keywords: Record<string, TokenType> = {
    "if":      TokenType.IF,
    "add":     TokenType.ADD,
    "dup":     TokenType.DUP,
    "one":     TokenType.ONE,
    "pop":     TokenType.POP,
    "sub":     TokenType.SUB,
    "push":    TokenType.PUSH,
    "leave":   TokenType.LEAVE,
    "print":   TokenType.PRINT,
    "stack":   TokenType.STACK,
    "while":   TokenType.WHILE,
    "length":  TokenType.STACK_LENGTH,
    "reverse": TokenType.REVERSE,
}
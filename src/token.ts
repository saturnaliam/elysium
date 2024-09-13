export enum TokenType {
    PUSH,         POP,           // [ ]
    ADD,          SUB,           // + -
    ONE,          REVERSE,       // / ^
    WHILE,        DUP,           // ~ .
    STACK,        PRINT,         // # *
    L_CURLY,      R_CURLY,       // { }
    STACK_LENGTH, NUMBER,        // $
    EQUAL,        BANG,          // = !
    GREATER,      GREATER_EQUAL,  // > >=
    LESS,         LESS_EQUAL,    // < <=
    EOF
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
    "add":     TokenType.ADD,
    "dup":     TokenType.DUP,
    "one":     TokenType.ONE,
    "pop":     TokenType.POP,
    "sub":     TokenType.SUB,
    "push":    TokenType.PUSH,
    "print":   TokenType.PRINT,
    "stack":   TokenType.STACK,
    "while":   TokenType.WHILE,
    "length":  TokenType.STACK_LENGTH,
    "reverse": TokenType.REVERSE,
}
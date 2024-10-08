export class Stack {
    private stack: number[] = [];

    public push(input: number) {
        // the stack MUST be empty to be pushed to :3 otherwise it's lame
        if (this.length !== 0) throw "the stack must be empty to be pushed!"
        this.stack.push(input);
    }

    public pop(): number {
        const value = this.stack.pop();

        if (value === undefined) throw "stack empty :(";

        return value;
    }

    public add(input: number) {
        try {
            let last_val = this.pop();
            last_val += input;
            this.stack.push(last_val);
        } catch (e) {
            throw e;
        }
    }

    public duplicate() {
        const value = this.stack.at(-1);

        if (value === undefined) throw "stack empty :(";

        this.stack.push(value);
    }

    public print() {
        try {
            const value = this.pop();
            Deno.stdout.writeSync(new TextEncoder().encode(String.fromCharCode(value)));
        } catch (e) {
            throw e;
        }
    }

    public reverse() {
        this.stack.reverse();
    }

    get length(): number {
        return this.stack.length;
    }

    get is_empty(): boolean {
        return this.stack.length === 0;
    }
}
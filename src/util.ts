export function error(input: string, code = -1) {
    console.error(`[ERROR]: ${input}`);
    Deno.exit(code);
}

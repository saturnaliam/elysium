# about
elysium is the most heavenly esolang of all time, a gift handed down to us by the gods.

elysium is stack based, meaning all operations take place on the stack. however, while most languages allow you to push at any time, elysium only allows you to when empty

so
```
push 1
pop
push 2
```
is valid code, but
```
push 1
push 2
pop
```
is not.

and, just for shits and giggles, whenever you push a value, it gets multiplied by 3. so `push 1` actually pushes 3 to the stack, not 1.

# instructions
each instruction has 2 forms, the boring lame **loser** way, and the awesome, dope, amazing, cool ass way, the shortened form.
| instruction | shorthand | description                                                       |
| ----------- | --------- | ----------------------------------------------------------------- |
| push x      | [x        | pushes 3*x to the stack.                                          |
| pop         | ]         | pops from the stack.                                              |
| add x       | +x        | pops the top value of the stack, adds 3*x, and pushes the result. |
| sub x       | -x        | the same as add, but subtracts instead.                           |
| one         | /         | pops the top value of the stack, adds 1, and pushes the result.   |
| reverse     | ^         | reverses the stack order                                          |
| while x {}  | ~         | repeats the code in brackets while condition x is `true`.         |
| dup         | .         | duplicates the top value on the stack.                            |
| stack       | #         | returns `true` if the stack has values, `false` if not.           |
| length      | $         | the length of the stack.                                          |
| print       | *         | pops the top value, and prints the character to the stack.        |
| input       | @         | gets 1 character input from the user.                             |
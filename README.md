# mIRCCloud

Enhancements for your IRCCloud chatting experience.

## Available commands

- `/fb <optional msg>` - Mass highlight a channel with an optional message.

- `/ascii <url>` - Scroll an ascii to current channel at the rate of the specified DELAY (default=0.45).

- `/rst <optional ['rude', 'tru', 'same']>` - Qualify the previous line of chat with a nifty checkbox reaction.

## Available filters

- `-repeat [n]` - Repeat a command n times. This filter can be used on any command.

## Example usage: 

- `/ascii http://wepump.in/ascii/lol.txt`
- `/fb lol hey everyone -repeat 3`

## Todo

### Filters
- Add more filters
- Rainbow text color filters, etc.

### Ascii
- Add delay as argument instead of global variable
- Transform functions
- Alias asciis for repeated use (possible local storage... maybe)
- Allow ending a currently running ascii scroll

### Flashing Bar
- Allow mass commands


### Misc

- Add more commands
- Better argument parsing
- Improvement in general (not a JS guy)
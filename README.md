# mIRCCloud

Enhancements for your IRCCloud chatting experience.

## Available commands

- `/fb <optional msg>` - Mass highlight a channel with an optional message.

- `/ascii <url>` - Scroll an ascii to current channel at the rate of the specified DELAY (default=0.45).

- `/rst <optional ['rude', 'tru', 'same']>` - Qualify the previous line of chat with a nifty checkbox reaction.

- `/troll` - Get a random troll and post it to the channel.

- `/say` - Send a message to the channel using the available filters.

## Coming soon 

- `/amsg`
- `/perform`
- `/alias`

## Available filters

- `-repeat [n]` - Repeat a command n times. This filter can be used on any command (except /ascii and /troll atm LOL)
- `-color [r,]` - Colorize text, currently only one option `-r` for random foreground and background for all characters.

## Example usage: 

- `/ascii http://wepump.in/ascii/lol.txt`
- `/fb lol hey everyone -repeat 3 -color r`
- `/troll`

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
- Allow mass `/perform` commands

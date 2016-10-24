// ==UserScript==
// @name mirccloud.user.js
// @namespace https://github.com/erm/mirccloud
// @description IRCCloud chat enhancement
// @downloadURL https://raw.githubusercontent.com/erm/mirccloud/master/mirccloud.user.js
// @version 1.2.6
// @match https://www.irccloud.com/*
// @match https://irccloud.mozilla.com/*
// @noframes
// @grant none
// ==/UserScript==
(function() {
    function init() {
        var context = window.SESSIONVIEW.mainArea.current.input.__proto__.say;
        window.SESSIONVIEW.mainArea.current.input.__proto__.say = function(m) {
            var args = m.split(' ');
            var cmd = args[0];
            args.splice(0, 1);
            if (m.startsWith('/') && COMMANDS.indexOf(cmd) >= 0 || localStorage.getItem(cmd) != null) {
                var outputText = [];
                // Repeat filter
                var repeatFilter = 1;
                var repeatFilterIndex = args.indexOf('-repeat');
                if (repeatFilterIndex !== -1) {
                    args,
                    repeatFilter = getFilterArgs(repeatFilterIndex, args)
                }
                // Color filter
                var colorFilter = false;
                var colorFilterIndex = args.indexOf('-color');
                if (colorFilterIndex !== -1) {
                    args,
                    colorFilter = getFilterArgs(colorFilterIndex, args);
                    if (COLOR_FILTER_OPTIONS.indexOf(colorFilter) == -1) {
                        colorFilter = false;
                    }
                }
                this.clear()
                var self = this;
                if (COMMANDS.indexOf(cmd) < 0) {
                    console.log(args.length);
                    alias = localStorage.getItem(cmd);
                    if (alias.indexOf('&1') !== -1) {
                        if (args.length > 0) {
                            alias = alias.replace(/&1/g, args[0])
                        } else {
                            outputText = -1;
                        }
                    }
                    if (alias.indexOf('&2') !== -1 && outputText != -1) {
                        if (args.length > 1) {
                            alias = alias.replace(/&2/g, args[1])
                        } else {
                            outputText = -1;
                        }
                    }
                    if (alias.indexOf('&3') !== -1 && outputText != -1) {
                        if (args.length > 2) {
                            alias = alias.replace(/&3/g, args[2])
                        } else {
                            outputText = -1;
                        }
                    }
                    console.log(outputText);
                    if (outputText != -1) {
                        console.log(outputText);
                        outputText = alias;
                    }
                }
                if (cmd == '/alias') {
                    var alias_name = '/' + args[0];
                    args.splice(0, 1);
                    localStorage.setItem(alias_name, args.join(' '));
                }
                if (cmd == '/box') {
                    var randomColors = randomChoice([[12, 02], [11, 10] ,[07, 08], [9, 3], [13, 06], [15, 14], [04, 05]])
                    
                    var col1 = randomColors[0];
                    var col2 = randomColors[1];
                    var col = "00," + col1;
                    var fc = ""+col1+","+col1;
                    var bcol = ""+col2+","+col2;
                    var end = "+";
                    var parts = "-";
                    var side = "|";
                    var border = bcol + "#";
                    var message = args.join(' ');
                    var toppart = end + parts.repeat(message.length) + end;
                    var top = fc + toppart;
                    var middle = fc + side + col + message + fc + side + border;
                    message = top + '\n' + middle + border + '\n' + top + border.repeat(2) + '\n  ' + border.repeat(toppart.length)
                    context.apply(self, [message])
                }
                if (cmd == '/hueg') {
                    var randomColors = randomColorCode(true);
                    var r1 = randomColors[0];
                    var r2 = randomColors[1];
                    var c2 = "" + r1 + "," + r1;
                    var c1 = "" + r2 + "," + r2;
                    var c3 = "";
                    var buffer = [];
                    var strs = args;
                    for (i = 0; i < strs.length; i++) {
                        var count = 0;
                        var listl = strs[i].split().length;
                        for (z = 0; z < strs[i].length; z++) {
                            var l = strs[i][z];
                            char = c3 + HUEG_CHARS[l];
                            char = char.split('$c1').join(c1);
                            char = char.split('$c2').join(c2);
                            char = char.split('$c3').join(c3);
                            char = char.split('\n').join('\n' + c3 + " ")
                            if (count == listl) {
                                char = char.split('\n').join(c3 + ' \n');
                            }
                            buffer.push(char);
                            count = count + 1;
                        }
                    }
                    var newbuffer = lineUp(buffer);
                    for (i = 0; i < newbuffer.length; i++) {
                        context.apply(self, [newbuffer[i]]);
                    }
                }
                if (cmd == '/troll' || cmd == '/ascii') {
                    var requestArgs = (cmd == '/troll') ? false : args[0];
                    getRequest(requestArgs).then(function(outputData) {
                        if (cmd == '/troll') {
                            context.apply(self, [outputData]);
                        } else {
                            var i = -1;
                            var outputText = outputData.split('\n').reverse();
                            (function outputLoop(i) {
                                setTimeout(function() {
                                    context.apply(self, [outputText[i]]);
                                    if (--i) {
                                        outputLoop(i)
                                    };
                                }, DELAY * 1000)
                            })(outputText.length + 1);
                        }
                    });
                }
                if (cmd == '/fb') {
                    var nicklist = window.SESSIONVIEW.mainArea.current.members.$el['0'].innerText.split('\n');
                    var outputText = '';
                    var s = '';
                    for (i = 0; i < nicklist.length; i++) {
                        s = nicklist[i];
                        if (s.startsWith('Ops@') || s.startsWith('HalfOps') || s.startsWith('Members') || s.startsWith('Voiced+') || s.startsWith('Owner~')) {
                            nicklist.splice(i, 1);
                        }
                    }
                    if (args[0] !== undefined) {
                        outputText = nicklist.join(' ' + args.join(' ') + ' ');
                    } else {
                        outputText = nicklist.join(' ');
                    }
                }
                if (cmd == '/rst') {
                    var choice = '';

                    var mark = randomChoice(RST_MARKS);
                    if (args[0] !== undefined) {
                        choice = RST_CHOICES[args];
                    } else {
                        choice = RST_CHOICES[randomChoice(['rude', 'tru', 'same'])];
                    }
                    var outputText = choice.replace('X', mark)
                }
                if (cmd == '/say') {
                    outputText = args.join(' ');
                }
                if (cmd != '/box' && cmd != '/troll' && cmd != '/ascii' && cmd != '/hueg' && cmd != '/alias' && outputText != false) {
                    if (colorFilter != false) {
                        var outputTextOld = outputText.slice(0);
                        var outputText = '';
                        if (colorFilter == 'rand') {
                            for (i = 0; i < outputTextOld.length; i++) {
                                var randomColors = randomColorCode(true);
                                var fgColor = randomColors[0];
                                var bgColor = randomColors[1];
                                outputText += '' + fgColor + ',' + bgColor + outputTextOld[i] + '';
                            }
                        }
                        // if (colorFilter == 'rb') {

                        // }
                    }
                    if (repeatFilter > 1) {
                        for (i = 0; i < repeatFilter; i++) {
                            context.apply(this, [outputText]);
                        }
                    } else {
                        context.apply(this, [outputText]);
                    }
                }
            } else {
                // process the input data normally
                context.apply(this, [m]);
            }
        };
    }
    (function checkSession() {
        if (window.hasOwnProperty('SESSION')) {
            if (window.SESSION.initialized) {
                init();
            } else {
                window.SESSION.bind('init', function() {
                    init();
                });
            }
        } else {
            window.setTimeout(checkSession, 100);
        }
    })();
})();

function lineUp(buff) {
    var newbuff = [];
    var i = '';
    var index = 0;
    for (j = 0; j < buff.length; j++) {
        i = buff[j];
        index = buff.indexOf(i);
        i = i.split('\n');
        i.splice(0, 1);
        i.pop();
        buff[index] = i;
    }
    var line = '';
    var x = '';
    for (i = 0; i < 9; i++) {
        line = '';
        for (z = 0; z < buff.length; z++) {
            x = buff[z];
            line = line + x[i]
        }
        newbuff.push(line);
    }
    return newbuff
}

function randomChoice(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}

function randomColorCode(pair) {
    var _colorCodeRange = COLOR_CODE_RANGE.slice(1);
    var colorCodeOne = randomChoice(_colorCodeRange);
    if (pair != false) {
        _colorCodeRange.splice(_colorCodeRange.indexOf(colorCodeOne), 1)
        var colorCodeTwo = randomChoice(_colorCodeRange);
        return [colorCodeOne, colorCodeTwo];
    }
    return colorCodeOne;
}

function getFilterArgs(filterIndex, args) {
    filterArg = args[filterIndex + 1];
    args.splice(filterIndex, 2);
    return args, filterArg
}

function getRequest(requestArgs) {
    var requestUrl = '';
    var response = new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.responseType = "text";
        req.onload = function() {
            if (req.status != 200) {
                reject("Failed");
            } else {
                resolve(req.response);
            }
        };
        req.onerror = function(e) {
            reject(e);
        };
        if (requestArgs == false) {
            random_value = '?t=' + Math.random();
            requestUrl = 'http://rolloffle.churchburning.org/troll_me_text.php' + '?t=' + Math.random();
        } else {
            requestUrl = requestArgs;
        }
        req.open('GET', 'https://crossorigin.me/' + requestUrl, true);
        req.send();
    });
    return response;
}

const COLOR_FILTER_OPTIONS = ['rand']; //, 'rb', 'usa'];
const COLOR_CODE_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const COMMANDS = ['/ascii', '/fb', '/rst', '/troll', '/say', '/hueg', '/amsg', '/aliassay', '/alias', '/box'];
const DELAY = 0.35;
const RST_MARKS = ["☑", "☒", "☓", "✓", "✔", "✕", "✖", "✗", "✘"];
const RST_CHOICES = {
    'rude': '[X] rude [ ] tru [ ] same',
    'tru': '[ ] rude [X] tru [ ] same',
    'same': '[ ] rude [ ] tru [X] same'
};

const HUEG_CHARS = {
    " ": `
    $c3      
    $c3      
    $c3      
    $c3      
    $c3      
    $c3      
    $c3      
    $c3      
    $c3      
    `,
    "\u5350": `
    $c3             
    $c1 $c2  $c3  $c1 $c2       $c3
    $c1 $c2  $c3  $c1 $c2  $c3     
    $c1 $c2  $c3  $c1 $c2  $c3     
    $c1 $c2            $c3
    $c3     $c1 $c2  $c3  $c1 $c2  $c3
    $c3     $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2       $c3  $c1 $c2  $c3
    $c3             
    `,
    "0": `
    $c3         
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3 $c1 $c2      $c3 
    $c3         
    `,
    "1": `
    $c3       
    $c3  $c1 $c2  $c3  
    $c3 $c1 $c2   $c3  
    $c1 $c2    $c3  
    $c3  $c1 $c2  $c3  
    $c3  $c1 $c2  $c3  
    $c3  $c1 $c2  $c3  
    $c1 $c2      $c3
    $c3       
    `,
    "2": `
    $c3        
    $c3 $c1 $c2     $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3    $c1 $c2  $c3 
    $c3   $c1 $c2  $c3  
    $c3  $c1 $c2  $c3   
    $c3 $c1 $c2  $c3    
    $c1 $c2       $c3
    $c3        
    `,
    "3": `
    $c3        
    $c3 $c1 $c2     $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3     $c1 $c2  $c3
    $c3   $c1 $c2   $c3 
    $c3     $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3 $c1 $c2     $c3 
    $c3        
    `,
    "4": `
    $c3        
    $c3    $c1 $c2  $c3 
    $c3   $c1 $c2   $c3 
    $c3  $c1 $c2 $c1 $c2  $c3 
    $c3 $c1 $c2 $c3 $c1 $c2  $c3 
    $c1 $c2       $c3
    $c3    $c1 $c2  $c3 
    $c3    $c1 $c2  $c3 
    $c3        
    `,
    "5": `
    $c3        
    $c1 $c2      $c3 
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2      $c3 
    $c3     $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3 $c1 $c2     $c3 
    $c3        
    `,
    "6": `
    $c3        
    $c3   $c1 $c2  $c3  
    $c3  $c1 $c2  $c3   
    $c3 $c1 $c2  $c3    
    $c1 $c2      $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3 $c1 $c2     $c3 
    $c3        
    `,
    "7": `
    $c3         
    $c1 $c2        $c3
    $c3      $c1 $c2  $c3
    $c3     $c1 $c2  $c3 
    $c3    $c1 $c2  $c3  
    $c3   $c1 $c2  $c3   
    $c3  $c1 $c2  $c3    
    $c3 $c1 $c2  $c3     
    $c3         
    `,
    "8": `
    $c3         
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3 $c1 $c2      $c3 
    $c3         
    `,
    "9": `
    $c3        
    $c3 $c1 $c2     $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3 $c1 $c2      $c3
    $c3    $c1 $c2  $c3 
    $c3   $c1 $c2  $c3  
    $c3  $c1 $c2  $c3   
    $c3        
    `,
    "A": `
    $c3        
    $c3  $c1 $c2   $c3  
    $c3 $c1 $c2  $c1 $c2  $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2       $c3
    $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3        
    `,
    "a": `
    $c3         
    $c3         
    $c3         
    $c3 $c1 $c2     $c3  
    $c3     $c1 $c2  $c3 
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3  $c1 $c2  $c3 
    $c3 $c1 $c2       $c3
    $c3         
    `,
    "B": `
    $c3         
    $c1 $c2       $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2       $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2       $c3 
    $c3         
    `,
    "b": `
    $c3         
    $c1 $c2  $c3      
    $c1 $c2  $c3      
    $c1 $c2      $c3  
    $c1 $c2  $c3  $c1 $c2  $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2  $c3 
    $c1 $c2      $c3  
    $c3         
    `,
    "C": `
    $c3         
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3      
    $c1 $c2  $c3      
    $c1 $c2  $c3      
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3 $c1 $c2      $c3 
    $c3         
    `,
    "c": `
    $c3        
    $c3        
    $c3        
    $c3  $c1 $c2     $c3
    $c3 $c1 $c2  $c3    
    $c1 $c2  $c3     
    $c3 $c1 $c2  $c3    
    $c3  $c1 $c2     $c3
    $c3        
    `,
    "D": `
    $c3          
    $c1 $c2       $c3  
    $c1 $c2  $c3   $c1 $c2  $c3 
    $c1 $c2  $c3    $c1 $c2  $c3
    $c1 $c2  $c3    $c1 $c2  $c3
    $c1 $c2  $c3    $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3 
    $c1 $c2       $c3  
    $c3          
    `,
    "d": `
    $c3         
    $c3      $c1 $c2  $c3
    $c3      $c1 $c2  $c3
    $c3  $c1 $c2      $c3
    $c3 $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3 $c1 $c2  $c3  $c1 $c2  $c3
    $c3  $c1 $c2      $c3
    $c3         
    `,
    "E": `
    $c3        
    $c1 $c2       $c3
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2      $c3 
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2       $c3
    $c3        
    `,
    "e": `
    $c3         
    $c3         
    $c3         
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  
    $c1 $c2       $c3 
    $c1 $c2  $c3      
    $c3 $c1 $c2      $c3 
    $c3         
    `,
    "F": `
    $c3        
    $c1 $c2       
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2      $c3 
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c3        
    `,
    "f": `
    $c3      
    $c3      
    $c3  $c1 $c2   
    $c3 $c1 $c2  $c3  
    $c1 $c2     
    $c3 $c1 $c2  $c3  
    $c3 $c1 $c2  $c3  
    $c3 $c1 $c2  $c3  
    $c3      
    `,
    "G": `
    $c3          
    $c3  $c1 $c2      $c3 
    $c3 $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3       
    $c1 $c2  $c3  $c1 $c2    $c3
    $c1 $c2  $c3    $c1 $c2  $c3
    $c3 $c1 $c2  $c3   $c1 $c2  $c3
    $c3  $c1 $c2      $c3 
    $c3          
    `,
    "g": `
    $c3         
    $c3         
    $c3         
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3 $c1 $c2       $c3
    $c3      $c1 $c2  $c3
    $c3 $c1 $c2      $c3 
    `,
    "H": `
    $c3         
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2        $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3         
    `,
    "h": `
    $c3         
    $c1 $c2  $c3      
    $c1 $c2  $c3      
    $c1 $c2       $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3         
    `,
    "I": `
    $c3       
    $c1 $c2      $c3
    $c3  $c1 $c2  $c3  
    $c3  $c1 $c2  $c3  
    $c3  $c1 $c2  $c3  
    $c3  $c1 $c2  $c3  
    $c3  $c1 $c2  $c3  
    $c1 $c2      $c3
    $c3       
    `,
    "i": `
    $c3     
    $c3 $c1 $c2  $c3 
    $c3     
    $c1 $c2   $c3 
    $c3 $c1 $c2  $c3 
    $c3 $c1 $c2  $c3 
    $c3 $c1 $c2  $c3 
    $c1 $c2    
    $c3     
    `,
    "J": `
    $c3        
    $c3 $c1 $c2      
    $c3    $c1 $c2  $c3 
    $c3    $c1 $c2  $c3 
    $c3    $c1 $c2  $c3 
    $c3    $c1 $c2  $c3 
    $c1 $c2  $c3 $c1 $c2  $c3 
    $c3 $c1 $c2    $c3  
    $c3        
    `,
    "j": `
    $c3       
    $c3    $c1 $c2  
    $c3       
    $c3   $c1 $c2   
    $c3    $c1 $c2  
    $c3    $c1 $c2  
    $c3    $c1 $c2  
    $c1 $c2  $c3 $c1 $c2  
    $c3 $c1 $c2    $c3 
    `,
    "K": `
    $c3        
    $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2  $c3 $c1 $c2  $c3 
    $c1 $c2  $c1 $c2  $c3  
    $c1 $c2    $c3   
    $c1 $c2  $c1 $c2  $c3  
    $c1 $c2  $c3 $c1 $c2  $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3        
    `,
    "k": `
    $c3        
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2  $c3  $c1 $c2  
    $c1 $c2  $c3 $c1 $c2  $c3 
    $c1 $c2     $c3  
    $c1 $c2  $c3 $c1 $c2  $c3 
    $c1 $c2  $c3  $c1 $c2  
    $c3        
    `,
    "L": `
    $c3        
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2       $c3
    $c3        
    `,
    "l": `
    $c3     
    $c1 $c2   $c3 
    $c3 $c1 $c2  $c3 
    $c3 $c1 $c2  $c3 
    $c3 $c1 $c2  $c3 
    $c3 $c1 $c2  $c3 
    $c3 $c1 $c2  $c3 
    $c1 $c2    
    $c3     
    `,
    "M": `
    $c3            
    $c1 $c2  $c3      $c1 $c2  $c3
    $c1 $c2   $c3    $c1 $c2   $c3
    $c1 $c2    $c3  $c1 $c2    $c3
    $c1 $c2  $c1 $c2  $c1 $c2  $c1 $c2  $c3
    $c1 $c2  $c3 $c1 $c2   $c3 $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2 $c3  $c1 $c2  $c3
    $c1 $c2  $c3      $c1 $c2  $c3
    $c3            
    `,
    "m": `
    $c3          
    $c3          
    $c3          
    $c3 $c1 $c2  $c3  $c1 $c2  $c3 
    $c1 $c2    $c1 $c2    $c3
    $c1 $c2  $c1 $c2   $c1 $c2  $c3
    $c1 $c2  $c3 $c1 $c2 $c3 $c1 $c2  $c3
    $c1 $c2  $c3    $c1 $c2  $c3
    $c3          
    `,
    "N": `
    $c3           
    $c1 $c2   $c3    $c1 $c2  
    $c1 $c2    $c3   $c1 $c2  
    $c1 $c2  $c1 $c2  $c3  $c1 $c2  
    $c1 $c2  $c3 $c1 $c2  $c3 $c1 $c2  
    $c1 $c2  $c3  $c1 $c2  $c1 $c2  
    $c1 $c2  $c3   $c1 $c2    
    $c1 $c2  $c3    $c1 $c2   
    $c3           
    `,
    "n": `
    $c3         
    $c3         
    $c3         
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3         
    `,
    "O": `
    $c3           
    $c3  $c1 $c2      $c3  
    $c3 $c1 $c2  $c3   $c1 $c2  $c3 
    $c1 $c2  $c3     $c1 $c2  $c3
    $c1 $c2  $c3     $c1 $c2  $c3
    $c1 $c2  $c3     $c1 $c2  $c3
    $c3 $c1 $c2  $c3   $c1 $c2  $c3 
    $c3  $c1 $c2      $c3  
    $c3           
    `,
    "o": `
    $c3         
    $c3         
    $c3         
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3 $c1 $c2      $c3 
    $c3         
    `,
    "P": `
    $c3         
    $c1 $c2       $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2       $c3 
    $c1 $c2  $c3      
    $c1 $c2  $c3      
    $c1 $c2  $c3      
    $c3         
    `,
    "p": `
    $c3         
    $c3         
    $c3         
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2       $c3 
    $c1 $c2  $c3      
    $c1 $c2  $c3      
    `,
    "Q": `
    $c3           
    $c3  $c1 $c2      $c3  
    $c3 $c1 $c2  $c3   $c1 $c2  $c3 
    $c1 $c2  $c3     $c1 $c2  $c3
    $c1 $c2  $c3     $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2  $c1 $c2  $c3
    $c3 $c1 $c2  $c3  $c1 $c2   $c3 
    $c3  $c1 $c2      $c3  
    $c3       $c1 $c2  $c3 
    `,
    "q": `
    $c3         
    $c3         
    $c3         
    $c3 $c1 $c2      $c3 
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3 $c1 $c2       $c3
    $c3      $c1 $c2  $c3
    $c3      $c1 $c2  $c3
    `,
    "R": `
    $c3           
    $c1 $c2       $c3   
    $c1 $c2  $c3   $c1 $c2  $c3  
    $c1 $c2  $c3   $c1 $c2  $c3  
    $c1 $c2       $c3   
    $c1 $c2  $c3   $c1 $c2  $c3  
    $c1 $c2  $c3    $c1 $c2  $c3 
    $c1 $c2  $c3     $c1 $c2  
    $c3           
    `,
    "r": `
    $c3        
    $c3        
    $c3        
    $c3 $c1 $c2     $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c1 $c2  $c3     
    $c3        
    `,
    "S": `
    $c3        
    $c3 $c1 $c2     $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2  $c3     
    $c3 $c1 $c2     $c3 
    $c3     $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3 $c1 $c2     $c3 
    $c3        
    `,
    "s": `
    $c3       
    $c3       
    $c3       
    $c3 $c1 $c2     $c3
    $c1 $c2  $c3    
    $c3 $c1 $c2    $c3 
    $c3    $c1 $c2  $c3
    $c1 $c2     $c3 
    $c3       
    `,
    "T": `
    $c3         
    $c1 $c2        $c3
    $c3   $c1 $c2  $c3   
    $c3   $c1 $c2  $c3   
    $c3   $c1 $c2  $c3   
    $c3   $c1 $c2  $c3   
    $c3   $c1 $c2  $c3   
    $c3   $c1 $c2  $c3   
    $c3         
    `,
    "t": `
    $c3       
    $c3       
    $c3 $c1 $c2  $c3   
    $c1 $c2     $c3 
    $c3 $c1 $c2  $c3   
    $c3 $c1 $c2  $c3   
    $c3 $c1 $c2  $c1 $c2  
    $c3  $c1 $c2   $c3 
    $c3       
    `,
    "U": `
    $c3           
    $c1 $c2  $c3     $c1 $c2  $c3
    $c1 $c2  $c3     $c1 $c2  $c3
    $c1 $c2  $c3     $c1 $c2  $c3
    $c1 $c2  $c3     $c1 $c2  $c3
    $c1 $c2  $c3     $c1 $c2  $c3
    $c3 $c1 $c2  $c3   $c1 $c2  $c3 
    $c3  $c1 $c2      $c3  
    $c3           
    `,
    "u": `
    $c3         
    $c3         
    $c3         
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c1 $c2  $c3   $c1 $c2  $c3
    $c3 $c1 $c2      $c3 
    $c3         
    `,
    "V": `
    $c3             
    $c1 $c2 $c3         $c1 $c2 
    $c1 $c2  $c3       $c1 $c2  
    $c3 $c1 $c2  $c3     $c1 $c2  $c3 
    $c3  $c1 $c2  $c3   $c1 $c2  $c3  
    $c3   $c1 $c2  $c3 $c1 $c2  $c3   
    $c3    $c1 $c2    $c3    
    $c3     $c1 $c2  $c3     
    $c3             
    `,
    "v": `
    $c3            
    $c3            
    $c3            
    $c1 $c2  $c3      $c1 $c2  
    $c3 $c1 $c2  $c3    $c1 $c2  $c3 
    $c3  $c1 $c2  $c3  $c1 $c2  $c3  
    $c3   $c1 $c2  $c1 $c2  $c3   
    $c3    $c1 $c2   $c3    
    $c3            
    `,
    "W": `
    $c3           
    $c1 $c2  $c3     $c1 $c2  
    $c1 $c2  $c3     $c1 $c2  
    $c1 $c2  $c3     $c1 $c2  
    $c1 $c2  $c3 $c1 $c2  $c3 $c1 $c2  
    $c1 $c2  $c1 $c2    $c1 $c2  
    $c1 $c2    $c3 $c1 $c2    
    $c3 $c1 $c2  $c3   $c1 $c2  $c3 
    $c3           
    `,
    "w": `
    $c3          
    $c3          
    $c3          
    $c1 $c2  $c3    $c1 $c2  $c3
    $c1 $c2  $c3 $c1 $c2 $c3 $c1 $c2  $c3
    $c1 $c2  $c1 $c2   $c1 $c2  $c3
    $c1 $c2    $c1 $c2    $c3
    $c3 $c1 $c2  $c3  $c1 $c2  $c3 
    $c3          
    `,
    "X": `
    $c3          
    $c1 $c2  $c3    $c1 $c2  $c3
    $c3 $c1 $c2  $c3  $c1 $c2  $c3 
    $c3  $c1 $c2  $c1 $c2  $c3  
    $c3   $c1 $c2   $c3   
    $c3  $c1 $c2  $c1 $c2  $c3  
    $c3 $c1 $c2  $c3  $c1 $c2  $c3 
    $c1 $c2  $c3    $c1 $c2  $c3
    $c3          
    `,
    "x": `
    $c3        
    $c3        
    $c3        
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3 $c1 $c2  $c1 $c2  $c3 
    $c3   $c2   $c3  
    $c3 $c1 $c2  $c1 $c2  $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3        
    `,
    "Y": `
    $c3           
    $c1 $c2  $c3     $c1 $c2  $c3
    $c3 $c1 $c2  $c3   $c1 $c2  $c3 
    $c3  $c1 $c2  $c3 $c1 $c2  $c3  
    $c3   $c1 $c2    $c3   
    $c3    $c1 $c2  $c3    
    $c3    $c1 $c2  $c3    
    $c3    $c1 $c2  $c3    
    $c3           
    `,
    "y": `
    $c3           
    $c3           
    $c3           
    $c1 $c2  $c3     $c1 $c2  $c3
    $c3 $c1 $c2  $c3   $c1 $c2  $c3 
    $c3  $c1 $c2  $c3 $c1 $c2  $c3  
    $c3   $c1 $c2    $c3   
    $c3    $c1 $c2  $c3    
    $c3   $c1 $c2  $c3     
    `,
    "Z": `
    $c3         
    $c1 $c2        $c3
    $c3     $c1 $c2  $c3 
    $c3    $c1 $c2  $c3  
    $c3   $c1 $c2  $c3   
    $c3  $c1 $c2  $c3    
    $c3 $c1 $c2  $c3     
    $c1 $c2        $c3
    $c3         
    `,
    "z": `
    $c3          
    $c3          
    $c3          
    $c1 $c2        $c3 
    $c3     $c1 $c2  $c3  
    $c3   $c1 $c2  $c3    
    $c3 $c1 $c2  $c3      
    $c1 $c2        $c3 
    $c3          
    `,
    "~": `
    $c3             
    $c3             
    $c3             
    $c3  $c1 $c2    $c3   $c1 $c2  $c3
    $c3 $c1 $c2  $c3 $c1 $c2  $c3 $c1 $c2  $c3 
    $c1 $c2  $c3   $c1 $c2    $c3  
    $c3             
    $c3             
    $c3             
    `,
    "`": `
    $c3    
    $c1 $c2  $c3 
    $c3 $c1 $c2  
    $c3    
    $c3    
    $c3    
    $c3    
    $c3    
    $c3    
    `,
    "!": `
    $c3         
    $c3      $c1 $c2  $c3
    $c3     $c1 $c2  $c3 
    $c3    $c1 $c2  $c3  
    $c3   $c1 $c2  $c3   
    $c3  $c1 $c2  $c3    
    $c3         
    $c1 $c2  $c3      
    $c3         
    `,
    "@": `
    $c3            
    $c3  $c1 $c2       $c3  
    $c3 $c1 $c2  $c3    $c1 $c2  $c3 
    $c1 $c2  $c3  $c1 $c2  $c3 $c1 $c2  $c3
    $c1 $c2  $c3 $c1 $c2  $c3  $c1 $c2  $c3
    $c1 $c2  $c3  $c1 $c2     $c3 
    $c3 $c1 $c2  $c3        
    $c3  $c1 $c2       $c3  
    $c3            
    `,
    "#": `
    $c3           
    $c3  $c1 $c2  $c3 $c1 $c2  $c3  
    $c3  $c1 $c2  $c3 $c1 $c2  $c3  
    $c1 $c2          
    $c3  $c1 $c2  $c3 $c1 $c2  $c3  
    $c1 $c2          
    $c3  $c1 $c2  $c3 $c1 $c2  $c3  
    $c3  $c1 $c2  $c3 $c1 $c2  $c3  
    $c3           
    `,
    "$": `
    $c3    $c1 $c2 $c3    
    $c3 $c1 $c2       $c3 
    $c1 $c2  $c3 $c1 $c2 $c3 $c1 $c2  $c3
    $c1 $c2  $c3 $c1 $c2 $c3    
    $c3 $c1 $c2       $c3 
    $c3    $c1 $c2 $c3 $c1 $c2  $c3
    $c1 $c2  $c3 $c1 $c2 $c3 $c1 $c2  $c3
    $c3 $c1 $c2       $c3 
    $c3    $c1 $c2 $c3    
    `,
    "%": `
    $c3         
    $c1 $c2  $c3   $c1 $c2  
    $c3     $c1 $c2  $c3 
    $c3    $c1 $c2  $c3  
    $c3   $c1 $c2  $c3   
    $c3  $c1 $c2  $c3    
    $c3 $c1 $c2  $c3     
    $c1 $c2  $c3   $c1 $c2  
    $c3         
    `,
    "^": `
    $c3        
    $c3        
    $c3  $c1 $c2   $c3  
    $c3 $c1 $c2  $c1 $c2  $c3 
    $c1 $c2  $c3  $c1 $c2  $c3
    $c3        
    $c3        
    $c3        
    $c3        
    `,
    "&": `
    $c3           
    $c3  $c1 $c2    $c3    
    $c3 $c1 $c2  $c3 $c1 $c2  $c3   
    $c3  $c1 $c2    $c3    
    $c3 $c1 $c2  $c3 $c1 $c2  $c3   
    $c1 $c2  $c3   $c1 $c2  $c3  
    $c1 $c2  $c3    $c1 $c2  $c3 
    $c3 $c1 $c2      $c1 $c2  $c3
    $c3           
    `,
    "*": `
    $c3     
    $c3     
    $c1 $c2 $c3 $c1 $c2 
    $c3 $c1 $c2  $c3 
    $c1 $c2 $c3 $c1 $c2 
    $c3     
    $c3     
    $c3     
    $c3     
    `,
    "(": `
    $c3     
    $c3  $c1 $c2  $c3
    $c3 $c1 $c2  $c3 
    $c1 $c2  $c3  
    $c1 $c2  $c3  
    $c1 $c2  $c3  
    $c3 $c1 $c2  $c3 
    $c3  $c1 $c2  $c3
    $c3     
    `,
    ")": `
    $c3     
    $c1 $c2  $c3  
    $c3 $c1 $c2  $c3 
    $c3  $c1 $c2  $c3
    $c3  $c1 $c2  $c3
    $c3  $c1 $c2  $c3
    $c3 $c1 $c2  $c3 
    $c1 $c2  $c3  
    $c3     
    `,
    "_": `
    $c3         
    $c3         
    $c3         
    $c3         
    $c3         
    $c3         
    $c3         
    $c1 $c2        $c3
    $c3         
    `,
    "-": `
    $c3         
    $c3         
    $c3         
    $c3         
    $c1 $c2        $c3
    $c3         
    $c3         
    $c3         
    $c3         
    `,
    "+": `
    $c3         
    $c3         
    $c3   $c1 $c2  $c3   
    $c3   $c1 $c2  $c3   
    $c1 $c2        $c3
    $c3   $c1 $c2  $c3   
    $c3   $c1 $c2  $c3   
    $c3         
    $c3         
    `,
    "=": `
    $c3         
    $c3         
    $c3         
    $c1 $c2        $c3
    $c3         
    $c1 $c2        $c3
    $c3         
    $c3         
    $c3         
    `,
    "|": `
    $c3   
    $c1 $c2  $c3
    $c1 $c2  $c3
    $c1 $c2  $c3
    $c1 $c2  $c3
    $c1 $c2  $c3
    $c1 $c2  $c3
    $c1 $c2  $c3
    $c3   
    `,
    "\\": `
    $c3         
    $c1 $c2  $c3      
    $c3 $c1 $c2  $c3     
    $c3  $c1 $c2  $c3    
    $c3   $c1 $c2  $c3   
    $c3    $c1 $c2  $c3  
    $c3     $c1 $c2  $c3 
    $c3      $c1 $c2  $c3
    $c3         
    `,
    "[": `
    $c3     
    $c1 $c2    $c3
    $c1 $c2  $c3  
    $c1 $c2  $c3  
    $c1 $c2  $c3  
    $c1 $c2  $c3  
    $c1 $c2  $c3  
    $c1 $c2    $c3
    $c3     
    `,
    "]": `
    $c3     
    $c1 $c2    $c3
    $c3  $c1 $c2  $c3
    $c3  $c1 $c2  $c3
    $c3  $c1 $c2  $c3
    $c3  $c1 $c2  $c3
    $c3  $c1 $c2  $c3
    $c1 $c2    $c3
    $c3     
    `,
    "{": `
    $c3     
    $c3 $c1 $c2   $c3
    $c1 $c2  $c3  
    $c3 $c1 $c2  $c3 
    $c1 $c2  $c3  
    $c3 $c1 $c2  $c3 
    $c1 $c2  $c3  
    $c3 $c1 $c2   $c3
    $c3     
    `,
    "}": `
    $c3     
    $c1 $c2   $c3 
    $c3  $c1 $c2  $c3
    $c3 $c1 $c2  $c3 
    $c3  $c1 $c2  $c3
    $c3 $c1 $c2  $c3 
    $c3  $c1 $c2  $c3
    $c1 $c2   $c3 
    $c3     
    `,
    ":": `
    $c3     
    $c3     
    $c3     
    $c3 $c1 $c2  $c3 
    $c3     
    $c3     
    $c3 $c1 $c2  $c3 
    $c3     
    $c3     
    `,
    ";": `
    $c3     
    $c3     
    $c3     
    $c3 $c1 $c2  $c3 
    $c3     
    $c3     
    $c3 $c1 $c2  $c3 
    $c3  $c1 $c2 $c3 
    $c3     
    `,
    "'": `
    $c3    
    $c3 $c1 $c2  
    $c1 $c2  $c3 
    $c3    
    $c3    
    $c3    
    $c3    
    $c3    
    $c3    
    `,
    '"': `
    $c3       
    $c1 $c2  $c3 $c1 $c2  $c3
    $c1 $c2  $c3 $c1 $c2  $c3
    $c3       
    $c3       
    $c3       
    $c3       
    $c3       
    $c3       
    `,
    "<": `
    $c3       
    $c3       
    $c3    $c1 $c2  $c3
    $c3  $c1 $c2  $c3  
    $c1 $c2  $c3    
    $c3  $c1 $c2  $c3  
    $c3    $c1 $c2  $c3
    $c3       
    $c3       
    `,
    ">": `
    $c3       
    $c3       
    $c1 $c2  $c3    
    $c3  $c1 $c2  $c3  
    $c3    $c1 $c2  $c3
    $c3  $c1 $c2  $c3  
    $c1 $c2  $c3    
    $c3       
    $c3       
    `,
    "?": `
    $c3         
    $c3  $c1 $c2     $c3 
    $c3 $c1 $c2  $c3  $c1 $c2  
    $c3     $c1 $c2  $c3 
    $c3    $c1 $c2  $c3  
    $c3   $c1 $c2  $c3   
    $c3         
    $c3 $c1 $c2  $c3     
    $c3         
    `,
    ",": `
    $c3   
    $c3   
    $c3   
    $c3   
    $c3   
    $c3   
    $c3   
    $c1 $c2  $c3
    $c3 $c1 $c2 $c3
    `,
    ".": `
    $c3   
    $c3   
    $c3   
    $c3   
    $c3   
    $c3   
    $c3   
    $c1 $c2  
    $c3   
    `,
    "/": `
    $c3         
    $c3      $c1 $c2  $c3
    $c3     $c1 $c2  $c3 
    $c3    $c1 $c2  $c3  
    $c3   $c1 $c2  $c3   
    $c3  $c1 $c2  $c3    
    $c3 $c1 $c2  $c3     
    $c1 $c2  $c3      
    $c3         
    `
}
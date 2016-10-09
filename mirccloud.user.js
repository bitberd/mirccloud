// ==UserScript==
// @name mirccloud.user.js
// @namespace https://github.com/erm/mirccloud
// @description IRCCloud chat enhancement
// @downloadURL https://raw.githubusercontent.com/erm/mirccloud/master/mirccloud.user.js
// @version 1.1
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
            if (m.startsWith('/') && _COMMANDS.indexOf(cmd) >= 0) {
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
                }
                this.clear()
                var self = this;
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
                if (cmd != '/troll' || cmd != '/ascii') {
                    if (colorFilter != false) {
                        if (colorFilter == 'r') {
                            var outputTextOld = outputText.slice(0);
                            var outputText = '';
                            for (i = 0; i < outputTextOld.length; i++) {
                                var randomColors = randomColorCode(true);
                                var fgColor = randomColors[0];
                                var bgColor = randomColors[1];
                                outputText += '' + fgColor + ',' + bgColor + outputTextOld[i] + '';
                            }
                        }
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

function randomChoice(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}

function randomColorCode(pair) {
    var colorCodeRange = [...Array(15 + 1).keys()].slice(1);
    var colorCodeOne = randomChoice(colorCodeRange);
    if (pair != false) {
        colorCodeRange.splice(colorCodeRange.indexOf(colorCodeOne), 1)
        var colorCodeTwo = randomChoice(colorCodeRange);
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

const _COMMANDS = ['/ascii', '/fb', '/rst', '/troll', '/say'];
const DELAY = 0.35;
const RST_MARKS = ["☑", "☒", "☓", "✓", "✔", "✕", "✖", "✗", "✘"];
const RST_CHOICES = {
    'rude': '[X] rude [ ] tru [ ] same',
    'tru': '[ ] rude [X] tru [ ] same',
    'same': '[ ] rude [ ] tru [X] same'
};
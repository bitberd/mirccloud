// ==UserScript==
// @name mirccloud.user.js
// @namespace https://github.com/erm/mirccloud
// @description IRCCloud chat enhancement
// @downloadURL https://raw.githubusercontent.com/erm/mirccloud/master/mirccloud.user.js
// @version 1
// @match https://www.irccloud.com/*
// @match https://irccloud.mozilla.com/*
// @noframes
// @grant none
// ==/UserScript==


(function() {
    DELAY = 0.45;
    //RUNNING = false;
    function getAscii(url) {
        var ascii = new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.responseType = "text";
            console.log(req);
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
            req.open('GET', 'https://crossorigin.me/' + url, true);
            req.send();
        });
        return ascii;
    }

    function randomChoice(choices) {
      return choices[Math.floor(Math.random() * choices.length)];
    }

    var _COMMANDS = ['ascii', 'fb', 'rst'];

    function init() {
        var context = window.SESSIONVIEW.mainArea.current.input.__proto__.say;
        window.SESSIONVIEW.mainArea.current.input.__proto__.say = function(m) {
            // Get the user input and extract the command
            var inputData = m.split(' ');
            var cmd = inputData[0].substr(1);
            // Check if this script handles the command
            if (m.startsWith('/') && _COMMANDS.indexOf(cmd) >= 0) {
                // This command exists, let's retrieve the arguments
                var args = inputData.slice(1, inputData.length);
                // Filters
                var repeat = 1;
                var repeatFilter = args.indexOf('-repeat');
                if (repeatFilter > -1) {
                  var repeatIndex = args.indexOf('-repeat');
                  var repeatNumberIndex = repeatIndex + 1;
                  repeat = args[repeatNumberIndex];
                  args = args.splice(repeatIndex, 1);
                  args = args.splice(repeatNumberIndex, 1);
                }
                console.log(args);
                this.clear()
                var self = this;
                if (cmd == 'ascii') {
                  getAscii(args).then(function(outputData) {
                      //RUNNING = true;
                      var i = -1;
                      var outputText = outputData.split("\n").reverse();
                      (function outputLoop(i) {
                          setTimeout(function() {
                              context.apply(self, [outputText[i]]);
                              if (--i) { //&& RUNNING == true) {
                                  outputLoop(i)
                              };
                          }, DELAY * 1000)
                      })(outputText.length * repeat);
                  });
                }
                if (cmd == 'fb') {
                  var nicklist = window.SESSIONVIEW.mainArea.current.members.$el["0"].innerText.split('\n');
                  var outputText = '';
                  var s = '';
                  for (i = 0; i < nicklist.length; i++) { 
                    s = nicklist[i];
                    if (s.startsWith('Ops@') || s.startsWith('Members') || s.startsWith('Voiced+') || s.startsWith('Owner~')) {
                      nicklist.splice(i, 1);
                    }
                  }
                  if (args.length == 0) {
                    outputText = nicklist.join(' ');
                  } else {
                    outputText = nicklist.join(' ' + args.join(' ') + ' ');
                  }
                  if (repeat > 1) {
                    for (i = 0; i < repeat; i++) { 
                      context.apply(this, [outputText]);
                    }
                  } else {
                    context.apply(this, [outputText]);
                  }
                }
                if (cmd == 'rst') {
                  var choice = '';
                  var marks = ["☑","☒","☓","✓","✔","✕","✖","✗","✘"];
                  var choices = {
                    'rude': '[X] rude [ ] tru [ ] same',
                    'tru': '[ ] rude [X] tru [ ] same',
                    'same': '[ ] rude [ ] tru [X] same'
                  };
                  var mark = randomChoice(marks);
                  if (args.length == 0) {
                    var keys = ['rude', 'tru', 'same'];
                    var key_choice = randomChoice(keys);
                    choice = choices[key_choice];
                  } else {
                    choice = choices[args];
                  }
                  var outputText = choice.replace('X', mark)
                  if (repeat > 1) {
                    for (i = 0; i < repeat; i++) { 
                      context.apply(this, [outputText]);
                    }
                  } else {
                    context.apply(this, [outputText]);
                  }
                }
            } else {
              // Process the input data normally
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
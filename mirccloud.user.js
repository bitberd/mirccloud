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
    DELAY = 0.00;
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

    var _COMMANDS = ['/ascii', '/fb', '/rst'];



    function init() {
        var context = window.SESSIONVIEW.mainArea.current.input.__proto__.say;
        window.SESSIONVIEW.mainArea.current.input.__proto__.say = function(m) {
            var args = m.split(' ');
            var cmd = args[0];
            console.log('cmd = '+cmd);
            console.log('old args'+args);
            args.splice(0, 1);
            console.log('new args'+args);
            if (m.startsWith('/') && _COMMANDS.indexOf(cmd) >= 0) {
              console.log('args are: '+args);
                var repeatFilter = 1;
                var repeatFilterIndex = args.indexOf('-repeat');
                console.log('index '+repeatFilterIndex);
                if (repeatFilterIndex !== -1) {
                  repeatFilter = args[repeatFilterIndex+1];
                  console.log('yes: '+repeatFilter);
                  args.splice(repeatFilterIndex, 2);
                }
                console.log('repeating: '+repeatFilter);
                this.clear()
                var self = this;
                if (cmd == '/ascii') {
                  getAscii(args[0]).then(function(outputData) {
                      var i = -1;
                      var outputText = outputData.split("\n").reverse();

                      (function outputLoop(i) {
                          setTimeout(function() {
                              context.apply(self, [outputText[i]]);
                              if (--i) { //&& RUNNING == true) {
                                  outputLoop(i)
                              };
                          }, DELAY * 1000)
                      })(outputText.length);
                  });
                }
                if (cmd == '/fb') {
                  var nicklist = window.SESSIONVIEW.mainArea.current.members.$el["0"].innerText.split('\n');
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
                  if (repeatFilter > 1) {
                    for (i = 0; i < repeatFilter; i++) { 
                      context.apply(this, [outputText]);
                    }
                  } else {
                    context.apply(this, [outputText]);
                  }
                }
                if (cmd == '/rst') {
                  var choice = '';
                  var marks = ["☑","☒","☓","✓","✔","✕","✖","✗","✘"];
                  var choices = {
                    'rude': '[X] rude [ ] tru [ ] same',
                    'tru': '[ ] rude [X] tru [ ] same',
                    'same': '[ ] rude [ ] tru [X] same'
                  };
                  var mark = randomChoice(marks);
                  if (args[0] !== undefined) {
                     choice = choices[args];
                   } else {
                      choice = choices[randomChoice(['rude', 'tru', 'same'])];
                   }
                  var outputText = choice.replace('X', mark)
                  if (repeatFilter > 1) {
                    for (i = 0; i < repeatFilter; i++) { 
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
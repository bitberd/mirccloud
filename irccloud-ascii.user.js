/* Any copyright is dedicated to the Public Domain.
 http://creativecommons.org/publicdomain/zero/1.0/ */
/*global Promise, unsafeWindow */
// ==UserScript==
// @name irccloud ascii command
// @namespace https://github.com/erm/irccloud-asciicommand
// @description Add a /ascii command to irccloud
// @downloadURL https://raw.githubusercontent.com/erm/irccloud-asciicommand/master/irccloud_ascii.user.js
// @version 1
// @match https://www.irccloud.com/*
// @match https://irccloud.mozilla.com/*
// @noframes
// @grant none
// ==/UserScript==

(function() {
  function getASCII(url) {
    return new Promise(function(resolve, reject) {
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
      
      req.open('GET', 'https://crossorigin.me/' + url , true);
      req.send();
    });
  }

  var _COMMANDS = {
    ascii: getASCII
  };
   
  var DELAY = 0.45 //seconds

  function init() {
    var _oldsay = window.SESSIONVIEW.mainArea.current.input.__proto__.say;
    window.SESSIONVIEW.mainArea.current.input.__proto__.say = function(m) {
      var cmd = m.split(' ')[0].substr(1);
      if (m.startsWith('/') && _COMMANDS.hasOwnProperty(cmd)) {
        this.clear();
        var self = this;
        _COMMANDS[cmd](m.substr(cmd.length + 2)).then(function (newmsg) {
          var i = -1;
          var ascii = newmsg.split("\n").reverse();
          (function asciiLoop (i) {          
               setTimeout(function () {   
                  _oldsay.apply(self, [ascii[i]]);      
                  if (--i) asciiLoop(i); 
               }, DELAY*1000)
            })(ascii.length); 
        });
      } else {
        _oldsay.apply(this, [m]);
      }
    };
  }
    
  (function checkSession() {
    if (window.hasOwnProperty('SESSION')) {
      if (window.SESSION.initialized) {
        init();
      } else {
        window.SESSION.bind('init', function () {
          init();
        });
      }
    } else {
      window.setTimeout(checkSession, 100);
    }
  })();

})();

// Example usage: /ascii http://wepump.in/ascii/lol.txt
// ==UserScript==
// @name irccloud flashingbar command
// @namespace https://github.com/erm/irccloud-scripts
// @description Add a /fb command
// @downloadURL https://raw.githubusercontent.com/erm/irccloud-scripts/master/irccloud_flashingbar.user.js
// @version 1
// @match https://www.irccloud.com/*
// @match https://irccloud.mozilla.com/*
// @noframes
// @grant none
// ==/UserScript==

(function() {
  function init() {
    var _oldsay = window.SESSIONVIEW.mainArea.current.input.__proto__.say;
    window.SESSIONVIEW.mainArea.current.input.__proto__.say = function(m) {
      var args = m.split(' ');
      var cmd = args[0];
      var msg = args.slice(1, args.length).join(' ');
      if (cmd == '/fb') {
        this.clear();
        var self = this;
        var nicklist = window.SESSIONVIEW.mainArea.current.members.$el["0"].innerText.split('\n')
        for(var i = nicklist.length - 1; i >= 0; i--) {
            if(nicklist[i].startsWith('Ops@') || nicklist[i].startsWith('Members') || nicklist[i].startsWith('Voiced+')) {
               nicklist.splice(i, 1);
            }
        }
        nicklist = nicklist.join(' ' + msg + ' ');;
       _oldsay.apply(self, [nicklist]);      
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

(function() {
  'use strict';

/*
   http://my.host/bwa.js
*/

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  var host = 'https://bwa.to';
  var myhost = 'https://harimambura.github.io';
  var framework = host + '/bwa'; // download and unzip https://bwa.pages.dev/latest.zip to my.host/bwa

  var plugins = ['s.js', 'o.js']; // s.js porn | o.js online
  var plugins_version = '?v=180924';

  function putplugins() {
    Lampa.Utils.putScriptAsync(plugins.filter(function(u) {
      return (!window.bwajs_plugin && u == 'o.js') || (!window['plugin_sisi_pwa_ready'] && u == 's.js');
    }).map(function(u) {
      console.log('BWA', myhost + '/plugins/' + u + plugins_version);
      return myhost + '/plugins/' + u + plugins_version;
    }), function() {});
  }

  if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
    if (window.blazor_load == undefined) {
      window.blazor_load = true;
      var s = document.createElement('script');
      s.onload = function() {
        if (typeof Blazor == undefined) {
          console.log('BWA', 'Blazor undefined');
          return;
        }

        try {
          Blazor.start({
            loadBootResource: function loadBootResource(type, name, defaultUri, integrity) {
              //console.log('BWA', 'load: ' + name);
              return framework + '/' + name;
            }
          }).then(function() {
            console.log('BWA', 'load complete');
            var net = new Lampa.Reguest();
            window.httpReq = function(url, post, params) {
              return new Promise(function(resolve, reject) {
                net["native"](url, function(result) {
                  if (_typeof(result) == 'object') resolve(JSON.stringify(result));
                  else resolve(result);
                }, reject, post, params);
              });
            };

            var check = function check(good) {
              try {
                DotNet.invokeMethodAsync("JinEnergy", 'initial').then(function(initial) {
                  if (initial) {
                    window.blazor_init = true;
                    putplugins();
                    DotNet.invokeMethodAsync("JinEnergy", 'oninit', 'apk', myhost + '/settings.json');
                  } else {
                    console.log('BWA', 'not initial');
                  }
                })["catch"](function(e) {
                  console.log('BWA', e);
                });
              } catch (e) {
                console.log('BWA', e);
              }
            };

            check(true);
          })["catch"](function(e) {
            console.log('BWA', e);
          });
        } catch (e) {
          console.log('BWA', e);
        }
      };

      s.setAttribute('autostart', 'false');
      s.setAttribute('src', framework + '/blazor.webassembly.js');
      document.body.appendChild(s);
    } else if (window.blazor_init) {
      putplugins();
    }
  }
})();
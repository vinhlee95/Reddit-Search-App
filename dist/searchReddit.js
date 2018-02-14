// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.default = {
   search: function (searchTerm, searchLimit, sortBy) {
      return fetch(`https://www.reddit.com/search.json?q=${searchTerm}&limit=${searchLimit}&sort=${sortBy}`).then(res => res.json()).then(data => data.data.children.map(data => data.data)).catch(err => console.log(err));
   }
};
},{}],2:[function(require,module,exports) {
'use strict';

var _redditapi = require('./redditapi');

var _redditapi2 = _interopRequireDefault(_redditapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Get searchForm
const searchForm = document.getElementById('search-form');

// Add event submit listener
// Get search term, search limit, sort by
// Use search method of reddit api to fetch data

// Import
searchForm.addEventListener('submit', e => {
   // Get search term
   const searchTerm = document.getElementById('search-input').value;

   // Get Sort By
   const sortBy = document.querySelector('input[name="sortby"]:checked').value;

   // Get Search limit
   const searchLimit = document.getElementById('limit').value;

   // // Search Term validation
   // if(searchTerm === '') {
   //    showMessage('Please add the search term', 'alert-danger');
   // }

   // In case not importing reddit
   // function search(searchTerm, searchLimit, sortBy)  {
   //    return fetch(`https://www.reddit.com/search.json?q=${searchTerm}&limit=${searchLimit}&sort=${sortBy}`)
   //    .then(res => res.json())
   //    .then(data => data.data.children.map(data => data.data))
   //    .catch(err => console.log(err));
   // }

   //Search Reddit
   _redditapi2.default.search(searchTerm, searchLimit, sortBy).then(results => {
      let output = '<div class="card-columns">';
      results.forEach(result => {
         console.log(result);
         // Check image
         const image = result.preview ? result.preview.images[0].source.url : 'https://s3.amazonaws.com/media.eremedia.com/uploads/2014/10/15174120/reddit-logo2.png';

         output += `
            <div class="card">
               <img class="card-img-top" src='${image}' alt="Card image cap">
               <div class="card-body">
                  <h5 class="card-title">${result.title}</h5>
                  <p class="card-text">${truncateText(result.selftext, 100)}</p>
                  <a href=${result.url} class="btn btn-primary">Read More</a>
               </div>
            </div>
         `;
      });

      output += '</div>';
      // Display output
      document.getElementById('results').innerHTML = output;
   });

   e.preventDefault();
});

//Truncate text
function truncateText(text, limit) {
   const shortened = text.indexOf(' ', limit);
   if (shortened == -1) return text;
   return text.substring(0, shortened);
}
},{"./redditapi":3}],10:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var ws = new WebSocket('ws://' + hostname + ':' + '54312' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[10,2])
//# sourceMappingURL=/dist/searchReddit.map
// src/minilib.js

(function (global) {
  const MiniLib = {
    sayHello(name = 'World') {
      console.log(`Hello, ${name}!`);
    },

    sum(a, b) {
      return a + b;
    }
  };

  global.MiniLib = MiniLib;
})(typeof window !== 'undefined' ? window : global);

var rafDebounce = (function( window ){
  "use strict";

  var raf = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var lastScrollY = 0,
      lastWidth   = window.innerWidth,
      lastHeight  = window.innerHeight;

  var state = {};

  for ( var i = 0, e = ["scroll","resize"]; i < e.length; i++ ) {
    state[ e[i] ] = {
      listening: false,
      ticking: false,
      queue: {}
    };
  }


  function onResize( evt ) {
    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;

    if ( ! state.resize.ticking ) {
      processQueue("resize", [ evt, lastWidth, lastHeight ] );
    }
  }

  function onScroll( evt ) {
    lastScrollY = window.scrollY;

    if ( ! state.scroll.ticking ) {
      processQueue("scroll", [ evt, lastScrollY ] );
    }
  }

  function processQueue( type, args ) {
    var queue = state[ type ].queue;


  }

  return {
    on: function( type, key, callback ) {
      if ( typeof key === "function" ) {
        callback = key;
        key = "anon";
      }

      var s = state[ type ];

      if ( ! s.queue[ key ] ) {
        s.queue[ key ] = [];
      }

      s.queue[ key ].push( callback );
    },
    off: function( type, key ) {
      if ( typeof key !== "string" ) {

      }
    }
  };

})( this );

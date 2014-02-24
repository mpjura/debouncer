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

  state.scroll.handler = function( evt ) {
    lastScrollY = window.scrollY;

    if ( ! state.scroll.ticking ) {
      processQueue("scroll", [ lastScrollY ] );
    }
  };

  state.resize.handler = function( evt ) {
    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;

    if ( ! state.resize.ticking ) {
      processQueue("resize", [ lastWidth, lastHeight ] );
    }
  };

  function processQueue( type, args ) {
    var s = state[ type ],
        q = s.queue;

    if ( !s.ticking ) {
      
      raf( function(){
        var queue;

        s.ticking = false;

        for ( var i in q ) {
          queue = q[i];

          for ( var f = 0, len = queue.length; f < len; f++ ) {
            queue[ f ].apply( window, args );
          }
        }
      });
    }
    s.ticking = true;
  }

  return {
    on: function( type, key, callback ) {
      if ( typeof key === "function" ) {
        callback = key;
        key = "anon";
      }

      var s = state[ type ],
          q = s.queue;

      if ( ! q[ key ] ) {
        q[ key ] = [];
      }

      q[ key ].push( callback );

      if ( ! s.listening ) {
        window.addEventListener( type, s.handler, false );
      }
    },
    off: function( type, key ) {
      if ( typeof key !== "string" ) {
        key = "anon";
      }

      var s = state[ type ],
          q = state.queue,
          keys  = false;

      delete q[ key ];

      for ( var i in q ){
        keys = true;
        break;
      }

      if ( keys ) {
        window.removeEventListener( type, s.handler, false );
        s.listnening = false;
      }
    }
  };

})( this );

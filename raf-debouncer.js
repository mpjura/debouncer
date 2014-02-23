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
      processQueue("scroll", [ evt, lastScrollY ] );
    }
  };

  state.resize.handler = function( evt ) {
    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;

    if ( ! state.resize.ticking ) {
      processQueue("resize", [ evt, lastWidth, lastHeight ] );
    }
  };

  function processQueue( type, context, args ) {
    var state = state[ type ],
        queue = state.queue;

    if ( !state.ticking ) {
      
      raf( function(){
        state.ticking = false;

        for ( var i in queue ) {
          queue[ i ].apply( window, args );
        }
      });
    }
    state.ticking = true;
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

      if ( ! s.listening ) {
        window.addEventListner( type, s.handler, false );
      }
    },
    off: function( type, key ) {
      if ( typeof key !== "string" ) {
        key = "anon";
      }

      var queue = state[ type ].queue,
          keys  = 0;

      delete queue[ key ];

      for ( var i in queue ){
        keys++;
      }

      if ( keys > 0 ) {
        window.removeEventListener( type, s.handler, false );
      }
    }
  };

})( this );

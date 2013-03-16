function striptags(a) {
    return a.replace(/(<([^>]+)>)/ig, "")
}

function getURLPara(a) {
    return decodeURIComponent((RegExp("[?|&]" + a + "=" + "(.+?)(&|#|;|$)").exec(location.search) || [, ""])[1].replace(/\+/g, "%20")) || null
}

/********* jquery cookie plugin *********/
(function (e) {
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define(["jquery"], e)
    } else {
        e(jQuery)
    }
})(function (e) {
    function n(e) {
        return e
    }
    function r(e) {
        return decodeURIComponent(e.replace(t, " "))
    }
    function i(e) {
        if (e.indexOf('"') === 0) {
            e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
        }
        return s.json ? JSON.parse(e) : e
    }
    var t = /\+/g;
    var s = e.cookie = function (t, o, u) {
        if (o !== undefined) {
            u = e.extend({}, s.defaults, u);
            if (typeof u.expires === "number") {
                var a = u.expires,
                    f = u.expires = new Date;
                f.setDate(f.getDate() + a)
            }
            o = s.json ? JSON.stringify(o) : String(o);
            return document.cookie = [encodeURIComponent(t), "=", s.raw ? o : encodeURIComponent(o), u.expires ? "; expires=" + u.expires.toUTCString() : "", u.path ? "; path=" + u.path : "", u.domain ? "; domain=" + u.domain : "", u.secure ? "; secure" : ""].join("")
        }
        var l = s.raw ? n : r;
        var c = document.cookie.split("; ");
        var h = t ? undefined : {};
        for (var p = 0, d = c.length; p < d; p++) {
            var v = c[p].split("=");
            var m = l(v.shift());
            var g = l(v.join("="));
            if (t && t === m) {
                h = i(g);
                break
            }
            if (!t) {
                h[m] = i(g)
            }
        }
        return h
    };
    s.defaults = {};
    e.removeCookie = function (t, n) {
        if (e.cookie(t) !== undefined) {
            e.cookie(t, "", e.extend(n, {
                expires: -1
            }));
            return true
        }
        return false
    }
});

/*
 * Project: Twitter Bootstrap Hover Dropdown
 * Author: Cameron Spear
 * Contributors: Mattia Larentis
 *
 * Dependencies?: Twitter Bootstrap's Dropdown plugin
 *
 * A simple plugin to enable twitter bootstrap dropdowns to active on hover and provide a nice user experience.
 *
 * No license, do what you want. I'd love credit or a shoutout, though.
 *
 * http://cameronspear.com/blog/twitter-bootstrap-dropdown-on-hover-plugin/
 */
;(function($, window, undefined) {
    // outside the scope of the jQuery plugin to
    // keep track of all dropdowns
    var $allDropdowns = $();

    // if instantlyCloseOthers is true, then it will instantly
    // shut other nav items when a new one is hovered over
    $.fn.dropdownHover = function(options) {

        // the element we really care about
        // is the dropdown-toggle's parent
        $allDropdowns = $allDropdowns.add(this.parent());

        return this.each(function() {
            var $this = $(this).parent(),
                defaults = {
                    delay: 100,
                    instantlyCloseOthers: true
                },
                data = {
                    delay: $(this).data('delay'),
                    instantlyCloseOthers: $(this).data('close-others')
                },
                options = $.extend(true, {}, defaults, options, data),
                timeout;

            $this.hover(function() {
                if(options.instantlyCloseOthers === true)
                    $allDropdowns.removeClass('open');

                window.clearTimeout(timeout);
                $(this).addClass('open');
            }, function() {
                timeout = window.setTimeout(function() {
                    $this.removeClass('open');
                }, options.delay);
            });
        });
    };

    $(document).ready(function() {
        $('[data-hover="dropdown"]').dropdownHover();
    });
})(jQuery, this);


/** 
 ** noUislider 2.0
 ** No copyrights or licenses. Do what you like. Feel free to share this code, or build upon it.
 ** @author:        @leongersen
 ** @repository:    https://github.com/leongersen/noUiSlider
 **
 **/

(function( $ ){

    $.fn.left = function(){
       return parseInt(this.css('left'));
    };

/**
 ** Touch support
 **
 ** Implementation from:
 ** http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
 **/

    function touchHandler(event){
    
        var touches = event.changedTouches, first = touches[0], type = "";

        switch(event.type){
            case "touchstart": type = "mousedown"; break;
            case "touchmove": type="mousemove"; break;        
            case "touchend": type="mouseup"; break;
            default: return;
        }

        var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
            
            first.target.dispatchEvent(simulatedEvent);
            event.preventDefault();

    }

    $.fn.noUiSlider = function( method, options ) {

        var settings = {
            
        /**
         ** {knobs}             Specifies the number of knobs. (init)
         ** [INT]               1, 2
         **/
            'knobs'     :       2,
        /**
         ** {connect}           Whether to connect the middle bar to the knobs. (init)
         ** [MIXED]             "upper", "lower", false, true
         **/
            'connect'   :       true,
        /**
         ** {scale};            The values represented by the slider knobs. (init,move,value)
         ** [ARRAY]             [-+x,>x]
         **/
            'scale'     :       [0,100],
        /**
         ** {start}             The starting positions for the knobs, mapped to {scale}. (init)
         ** [ARRAY]             [y>={scale[0]}, y=<{scale[1]}]
         **/
            'start'     :       [25,75],
        /**
         ** {to}                The position to move a knob to. (move)
         ** [INT]               Any, but will be corrected to match z > {scale[0]} || _l, z < {scale[1]} || _u
         **/
            'to'        :       0,
        /**
         ** {knob}              The knob to move. (move)
         ** [MIXED]             0,1,"lower","upper"
         **/
            'knob'      :       0,
        /**
         ** {change}            The function to be called on every change. (init)
         ** [FUNCTION]          param [STRING]'move type'
         **/
            'change'    :       '',
        /**
         ** {end}               The function when a knob is no longer being changed. (init)
         ** [FUNCTION]          param [STRING]'move type'
         **/
            'end'       :       '',
        /**
         ** {step}              Whether, and at what intervals, the slider should snap to a new position. Adheres to {scale} (init)
         ** [MIXED]             <x, FALSE
         **/
            'step'      :       false,
        /**
         ** {save}              Whether a scale give to a function should become the default for the slider it is called on. (move,value)
         ** [BOOLEAN]           true, false
         **/
            'save'      :       false
        
        };

    /**
     ** [FUNCTION]  attach
     ** param       [noUiSliderObject]
     ** returns     [NULL]
     **/
        function attach(o){

            var s = o.data('settings');
        
            var _l      = o.children('.noUi-lowerHandle');
            var _u      = o.children('.noUi-upperHandle');
            var _b      = o.children('.noUi-midBar');
        
            if ( s.connect !== false ){
            
                if ( _l ) {
                    if ( _u ) {
                        _b.css( 'left', _l.left() );
                    } else {
                        if ( s.connect == 'lower' ){
                            _b.css( 'right', ( o.innerWidth() - _l.left() ) );
                        } else {
                            _b.css({ 'left' : _l.left(), 'right': 0 });
                        }
                    }
                }
                if ( _u ) {
                    if ( _l ) {
                        _b.css( 'right', ( o.innerWidth() - _u.left() ) );
                    } else {
                        if ( s.connect == 'lower' ){
                            _b.css( 'right', ( o.innerWidth() - _u.left() ) );
                        } else {
                            _b.css({ 'left' : _u.left(), 'right': 0 });
                        }
                    }
                }
            
            }
            
            var values = new Array();
            
            if ( _l ){
                values[0] = reverse( s.scale[0], s.scale[1], _l.left(), o.innerWidth() );
            } else {
                values[0] = false;
            }
            
            if ( _u ){
                values[1] = reverse( s.scale[0], s.scale[1], _u.left(), o.innerWidth() );
            } else {
                values[1] = false;
            }
            
            o.data('values', values);
            
        }

    /**
     ** [FUNCTION]  isNeg
     ** param       [INT]
     ** returns     true, false
     **/
        function isNeg ( test ) {
            return test < 0;
        }

    /**
     ** [FUNCTION]  inv
     ** param       [INT]
     ** returns     inverted [INT]
     **/            
        function inv ( subject ) {
            return subject * -1;
        }

    /**
     ** [FUNCTION]  translate
     ** param       [INT][INT][INT][INT]
     ** returns     [INT]
     **/
        function translate( low, high, val, ref ) {

            if ( isNeg ( low ) ) {

                val = val + inv ( low );
                high = high + inv ( low );
            
            } else {
            
                val = val - low;
                high = high - low;
            
            }

            return ( ( val * ref ) / high );

        }

    /**
     ** [FUNCTION]  reverse
     ** param       [INT][INT][INT][INT]
     ** returns     [INT]
     **/            
        function reverse( low, high, val, ref ) {

            if ( isNeg ( low ) ) {

                high = high + inv ( low );
            
            } else {

                high = high - low;
            
            }
            
            return ( ( ( val * high ) / ref ) + low );
        
        }
        
        var methods = {
        
    /**
     ** [FUNCTION]
     ** Initialises slider, places DOM elements, binds events
     **/
            init:
            
            function(){

                return this.each( function(){
                
                    var o = $(this);
                    var s = settings;
                    
                    o.data( 'settings' , s );
                    
                    var _l          = $('<div class="noUi-handle noUi-lowerHandle"><div></div></div>');
                    var _u          = $('<div class="noUi-handle noUi-upperHandle"><div></div></div>');
                    var _b          = $('<div class="noUi-midBar"></div>');
                    var knobs       = false;

                    if ( s.knobs === 1 ){

                        if ( s.connect === true || s.connect === 'lower' ){
                        
                            _l      = false;
                            _u      = _u.appendTo(o);
                            _b      = _b.insertBefore(_u);
                            
                            knobs   = _u;

                        } else {
                        
                            if ( s.connect === 'upper' ) {
                            
                                _l  = _l.appendTo(o);
                                _b      = _b.insertAfter(_l);
                                _u  = false;
                                
                                knobs       = _l;
                            
                            } else {
                            
                                _l  = _l.appendTo(o);
                                _b      = false;
                                _u  = false;
                                
                                knobs       = _l;
                            
                            }                                       
                        
                        }                                   
                    
                    } else {
                    
                        knobs = _l.add(_u).appendTo(o);

                        _l = knobs.filter( '.noUi-lowerHandle' );
                        _u = knobs.filter( '.noUi-upperHandle' );
                        
                        if ( s.connect === true ){
                        
                            _b              = _b.insertAfter(_l);
                        
                        } else {
                        
                            _b              = false;
                        
                        }
                    
                    }
                    
                    o.data('knobs',knobs).css('position','relative').children().css('position','absolute');
                    
                    if ( _b ) { _b.css({ 'left' : 0 , 'right' : 0 }); }

                    /** Setting all knobs to their initial position **/
                    knobs.each( function( index ){

                        $(this).css({ 'left': translate( s.scale[0], s.scale[1], s.start[index], o.innerWidth() ), 'zIndex':index+1 });

                        if(document.addEventListener){
                            this.addEventListener("touchstart", touchHandler, true);
                            this.addEventListener("touchmove", touchHandler, true);
                            this.addEventListener("touchend", touchHandler, true);
                            this.addEventListener("touchcancel", touchHandler, true);
                        }

                    });
                    
                    /** Trigger midbar build **/
                    attach(o);

                    /** Bind mousedown event on all knobs. **/
                    knobs.children().bind('mousedown.noUiSlider',function(e){
                        if ($(this).parent().parent().hasClass("disabled")) return;
                    
                        var k = $(this).parent();
                        $(this).addClass('noUi-activeHandle');
                        e.preventDefault();
                    
                    /** Prevent accidental selecting **/
                        $('body').bind( 'selectstart.noUiSlider' , function(){  
                            return false;
                        });
                    
                    /** Respond to the mouse moving trough the document. **/
                        $(document).bind('mousemove.noUiSlider', function(f){
                            
                            var newPosition = ( f.pageX - ( Math.round(o.offset().left )) );
                            var currentPosition = k.left();
                            
                            var greenLight = false;
                            
                            /** Correcting the new value for overlap with either the other knob or the sliders edges. Any correction vouches for step. **/
                            if ( k.hasClass( 'noUi-upperHandle' ) ) {
                            
                                if ( _l && newPosition < _l.left() ){

                                    newPosition = _l.left();
                                    greenLight = true;
                                    
                                }
                                
                            }
                            
                            if ( k.hasClass( 'noUi-lowerHandle' ) ) {
                            
                                if ( _u && newPosition > _u.left() ){

                                    newPosition = _u.left();
                                    greenLight = true;

                                }
                                
                            }
                            
                            if ( newPosition > o.innerWidth() ) {
                            
                                newPosition = o.innerWidth();
                                greenLight = true;
                            
                            } else if ( newPosition < 0 ){
                            
                                newPosition = 0;
                                greenLight = true;
                            
                            }
                            
                            if( s.step && !greenLight ){
                            
                                if ( Math.abs( currentPosition - newPosition ) >= translate( s.scale[0], s.scale[1], s.step, o.innerWidth() ) ){
                            
                                    greenLight = true;
                                
                                }
                            
                            } else {
                            
                                greenLight = true;
                                
                            }
                            
                            /** Even if all checks worked fine, there is still no need what-so-ever to fire any functions without change. **/
                            if ( currentPosition == newPosition ){
                            
                                greenLight = false;
                            
                            }
                            
                            /** Move the knob to it's new position, and call all callbacks **/
                            if ( greenLight ){
                            
                                k.css( 'left', newPosition );
                                
                                /** Safety patch to prevent knobs getting stuck **/
                                if( (k.hasClass( 'noUi-upperHandle' ) && k.left() == 0) || (k.hasClass( 'noUi-lowerHandle' ) && k.left() == o.innerWidth())){
                                    k.css('zIndex',parseInt(k.css('zIndex'))+2);
                                }
                                
                                attach(o);
                                if ( typeof(s.change) == "function" ){ s.change.call(o, 'slide'); }
                            
                            }
                            
                        });
                    
                    /** Unbind events on mouseup **/
                        $(document).bind('mouseup.noUiSlider',function(){
                        
                            $('.noUi-activeHandle').removeClass('noUi-activeHandle');
                            $(document).unbind('mousemove.noUiSlider').unbind('mouseup.noUiSlider');
                            $('body').unbind('selectstart.noUiSlider');
                            
                            if ( typeof(s.end) == "function" ){ s.end.call(o, 'slide'); }
                            
                        });
                    
                    });
                    
                    /** clickMove functionality **/                         
                    o.click( function( e ){
                        if ($(this).hasClass("disabled")) return;
                    
                        if ( _l && _u ){

                            var calc = e.pageX - o.offset().left;

                            if ( calc < ( ( _l.left() + _u.left() ) / 2 ) ){
                            
                                _l.css("left", calc);
                                
                            } else {
                            
                                _u.css("left", calc);
                                
                            }
                            
                        } else {
                        
                            knobs.css('left', (e.pageX - o.offset().left));
                        
                        }

                        attach(o);
                    
                        if ( typeof(s.change) == "function" ){ s.change.call(o,'click'); }
                        if ( typeof(s.end) == "function" ){ s.end.call(o, 'click'); }

                    }).find('*:not(.noUi-midBar)').click(function(){

                        return false;
                        
                    });

                });

            },
            
    /**
     ** [FUNCTION]
     ** Moves slider to given point
     **/
         
            move:
            
            function(){

                var o = $(this);

                var s = o.data( 'settings' );
                var knobs = o.data('knobs');
                
                var _l = knobs.filter( '.noUi-lowerHandle' );
                var _u = knobs.filter( '.noUi-upperHandle' );
                
                var n = settings;
                
                if ( n.scale ){
                
                    s.scale = n.scale;
                    
                    if ( n.save ){
                        o.data( 'settings', s )
                    }
                    
                }
                
                var newPosition = translate( s.scale[0], s.scale[1], n.to, o.innerWidth() );

                var k;
                
                if ( n.knob === 'upper' || n.knob == 1  ) {
                
                    if ( _l && newPosition < _l.left() ){

                        newPosition = _l.left();

                    }
                    
                    k = _u;
                    
                } else if ( n.knob === 'lower' || n.knob == 0 ) {
                
                    if ( _u && newPosition > _u.left() ){

                        newPosition = _u.left();

                    }
                    
                    k = _l;
                
                }
                
                if ( newPosition > o.innerWidth() ) {
                
                    newPosition = o.innerWidth();
                
                } else if ( newPosition < 0 ){
                
                    newPosition = 0;
                
                }
                
                k.css( 'left', newPosition );
                
                /** Safety patch to prevent knobs getting stuck **/
                if( (k.hasClass( 'noUi-upperHandle' ) && k.left() == 0) || (k.hasClass( 'noUi-lowerHandle' ) && k.left() == o.innerWidth())){
                    k.css('zIndex',parseInt(k.css('zIndex'))+2);
                }

                attach(o);
                
                if ( typeof(s.change) == "function" ){ s.change.call(o, 'move'); }
                if ( typeof(s.end) == "function" ){ s.end.call(o, 'move'); }

            },
            
            value:  
            
            function(){
        
                var o = $(this);
                var s = o.data( 'settings' );
                
                var n = optns;
                
                var values = o.data('values');

                if ( typeof n != "undefined" && typeof n.scale != "undefined" && ! ( ( n.scale[0] == s.scale[0] ) && ( n.scale[1] == s.scale[1] ) ) ){
                
                    /** crazy wizard magic! **/
                
                    if(values[0]){
                        values[0] = translate ( n.scale[0], n.scale[1], reverse( s.scale[0], s.scale[1], values[0], o.innerWidth() ), o.innerWidth() );
                    }
                    if(values[1]){
                        values[1] = translate ( n.scale[0], n.scale[1], reverse( s.scale[0], s.scale[1], values[1], o.innerWidth() ), o.innerWidth() );
                    }
                    
                    if ( n.save ){
                    
                        s.scale = n.scale;
                        o.data( 'settings' , s );
                        $(this).data('values', values)
                        
                    }
                
                }

                /** For usability. There is no real use for floats here. **/
                if(values[0]){ values[0]=Math.round(values[0]); }
                if(values[1]){ values[1]=Math.round(values[1]); }
                
                return values;

            }
            
        };

        var optns = options;
        var options = $.extend( settings, options );

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'No such method: ' +  method );
        }

    };

})( jQuery );

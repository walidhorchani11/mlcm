/*
 * Reveal.js menu plugin
 * MIT licensed
 * (c) Greg Denehy 2015
 */

var RevealMenu = window.RevealMenu || (function(){

        var config = Reveal.getConfig();
        var options = config.menu || {};
        options.path = options.path || scriptPath() || 'plugin/menu';

        var module = {};

        loadResource(options.path + '/lib/jeesh.min.js', 'script', function() {
            loadResource(options.path + '/lib/bowser.min.js', 'script', function() {

                // does not support IE8 or below
                if (!bowser.msie || bowser.version >= 9) {

                    var side = options.side || 'left';

                    var titleSelector = 'h1, h2, h3, h4, h5';
                    if (typeof options.titleSelector === 'string') titleSelector = options.titleSelector;
                    var themes = options.themes;
                    if (typeof themes === "undefined") {
                        themes = [
                            { name: 'Black', theme: 'css/theme/black.css' },
                            { name: 'White', theme: 'css/theme/white.css' },
                            { name: 'League', theme: 'css/theme/league.css' },
                            { name: 'Sky', theme: 'css/theme/sky.css' },
                            { name: 'Beige', theme: 'css/theme/beige.css' },
                            { name: 'Simple', theme: 'css/theme/simple.css' },
                            { name: 'Serif', theme: 'css/theme/serif.css' },
                            { name: 'Blood', theme: 'css/theme/blood.css' },
                            { name: 'Night', theme: 'css/theme/night.css' },
                            { name: 'Moon', theme: 'css/theme/moon.css' },
                            { name: 'Solarized', theme: 'css/theme/solarized.css' }
                        ];
                    }
                    var transitions = options.transitions;
                    if (typeof transitions === "undefined") transitions = true;
                    function openMenu(event) {
                        if (event) event.preventDefault();
                        if (!isOpen()) {
                            $('body').addClass('slide-menu-active');
                            $('.reveal').addClass('has-' + options.effect + '-' + side);
                            $('.slide-menu').addClass('active');
                            $('.slide-menu-overlay').addClass('active');

                            // identify active theme
                            $('div[data-panel="Themes"] li').removeClass('active');
                            $('li[data-theme="' + $('#theme').attr('href') + '"]').addClass('active');

                            // identify active transition
                            $('div[data-panel="Transitions"] li').removeClass('active');
                            $('li[data-transition="' + Reveal.getConfig().transition + '"]').addClass('active');

                            // set item selections to match active items
                            $('.slide-menu-panel li.active')
                                .addClass('selected')
                                .each(function(item) { keepVisible(item) });
                        }
                    }
                    function closeMenu(event) {
                        return false;
                    }
                    function isOpen() {
                        return $('body').hasClass('slide-menu-active');
                    }
                    function openItem(item) {
                        var h = $(item).data('slide-h');
                        var v = $(item).data('slide-v');
                        var theme = $(item).data('theme');
                        var transition = $(item).data('transition');
                        if (typeof h !== "undefined" && typeof v !== "undefined") {
                            h--;
                            Reveal.slide(h, v);
                            closeMenu();
                        } else {
                            var links = $(item).find('a');
                            if (links.length > 0) {
                                links.get(0).click();
                            }
                            closeMenu();
                        }
                    }
                    function clicked(event) {
                        if (event.target.nodeName !== "A") {
                            event.preventDefault();
                        }
                        openItem(event.currentTarget);
                    }
                    function highlightCurrentSlide() {
                        var state = Reveal.getState();

                        $('li.slide-menu-item, li.slide-menu-item-vertical')
                            .removeClass('past')
                            .removeClass('active')
                            .removeClass('future')
                            .removeClass('current')
                            .css('background-image', '');
                        var fc = fontColor.slice(7, -1);
                        var ic = itemColor.slice(7, -1);
                        $('li.slide-menu-item a, li.slide-menu-item-vertical a').css('color',  fc	);
                        $('li.slide-menu-item, li.slide-menu-item-vertical').each(function(e) {
                            var h = $(e).data('slide-h');
                            var v = $(e).data('slide-v');
                            var sh = h;
                            h--;
                            $(".sousMenu-"+sh).removeClass('has-levelSecond');
                            if (h === state.indexh) {
                                if(v === state.indexv) {
                                    $(e).addClass('active');
                                    $(e).addClass('current');
                                    $(e).children('a').css('color', ic);
                                    if(highlight != 'no'){
                                        $(e).css('background-image', 'url("'+imgHighlight+'")');
                                    }
                                }
                                h++;
                                $(".sousMenu-"+sh).addClass('has-levelSecond');

                            }
                            else {
                                $(e).addClass('future');
                            }
                        });
                    }
                    function createSlideMenu() {

                        if ( !document.querySelector('section[data-markdown]:not([data-markdown-parsed="true"]') ) {

                            $('.slide-menu-item, .slide-menu-item-vertical').click(clicked);
                            highlightCurrentSlide();
                        }
                        else {
                            // wait for markdown to be loaded and parsed
                            setTimeout( createSlideMenu, 100 );
                        }

                    }

                    createSlideMenu();
                    openMenu();

                    Reveal.addEventListener('slidechanged', highlightCurrentSlide);


                    var mouseSelectionEnabled = true;
                    $('.slide-menu-panel .slide-menu-items li').mouseenter(function(event) {
                        if (mouseSelectionEnabled) {
                            $('.active-menu-panel .slide-menu-items li').removeClass('selected');
                            $(event.currentTarget).addClass('selected');
                        }
                    });

                    module.isOpen = isOpen;

                    /**
                     * Extend object a with the properties of object b.
                     * If there's a conflict, object b takes precedence.
                     */
                    function extend( a, b ) {
                        for( var i in b ) {
                            a[ i ] = b[ i ];
                        }
                    }

                    /**
                     * Dispatches an event of the specified type from the
                     * reveal DOM element.
                     */
                    function dispatchEvent( type, args ) {
                        var event = document.createEvent( 'HTMLEvents', 1, 2 );
                        event.initEvent( type, true, true );
                        extend( event, args );
                        document.querySelector('.reveal').dispatchEvent( event );

                        // If we're in an iframe, post each reveal.js event to the
                        // parent window. Used by the notes plugin
                        if( config.postMessageEvents && window.parent !== window.self ) {
                            window.parent.postMessage( JSON.stringify({ namespace: 'reveal', eventName: type, state: getState() }), '*' );
                        }
                    }

                    dispatchEvent('menu-ready');
                }
            })
        });


        // modified from math plugin
        function loadResource( url, type, callback ) {
            var head = document.querySelector( 'head' );
            var resource;

            if ( type === 'script' ) {
                resource = document.createElement( 'script' );
                resource.type = 'text/javascript';
                resource.src = url;
            }
            else if ( type === 'stylesheet' ) {
                resource = document.createElement( 'link' );
                resource.rel = 'stylesheet';
                resource.href = url;
            }

            // Wrapper for callback to make sure it only fires once
            var finish = function() {
                if( typeof callback === 'function' ) {
                    callback.call();
                    callback = null;
                }
            }

            resource.onload = finish;

            // IE
            resource.onreadystatechange = function() {
                if ( this.readyState === 'loaded' ) {
                    finish();
                }
            }

            // Normal browsers
            head.appendChild( resource );
        }
        $(document).on('click', '.link-to-home', function (e) {
            e.preventDefault();
            Reveal.slide(0,0);
        })
        function scriptPath() {
            // obtain plugin path from the script element
            var path;
            if (document.currentScript) {
                path = document.currentScript.src.slice(0, -7);
            } else {
                var sel = document.querySelector('script[src$="/menu.js"]')
                if (sel) {
                    path = sel.src.slice(0, -7);
                }
            }
            return path;
        }

        return module;
    })();

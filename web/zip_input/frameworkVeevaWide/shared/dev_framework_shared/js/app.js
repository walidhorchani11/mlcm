/*
 _______________________________________________________
 _      ____    ____   ____           _____  ____
 / \    |    \  |      |    | |     | |      |
 /   \   |  __/  |  __  |    | |     | |__    |_
 /_____\  |   \   |    | |    | |     | |      |
 /       \ |    \  |____| |____| |____ | |      |____
 _______________________________________________________

 @author:    Kevin Bouret
 @contact:   kevin.bouret@gmail.com

 __________________________________________________________

 */

var app = app || {};

app = function () {
};


app.stage = {

    library: ["jquery-1.11.2.min", "jquery_ui", "veeva-library-4.2", "iscroll", "touchPunch", "touchSwipe.min", "velocity.min", "velocity.ui.min"],
    request: null,
    slide: {
        id: null,
        flowName: null
    },
    defaultFlow: "flow1",
    flow: null,
    flowKey: null,
    events: null,
    eventsEnd: null,
    _load: function () {

        var _this = this;
        this.request = new XMLHttpRequest,
            data = sessionStorage.getItem('flow');

        _this.slide.flowName = data ? data : _this.defaultFlow;

        if ('ontouchstart' in window) {
            this.events = "touchstart";
            this.eventsEnd = "touchend";
        } else {
            this.events = "mousedown";
            this.eventsEnd = "mouseup";
        }

        this.helper.loadLib(function () {
            _this._construct(SLIDE.start());
        }, this);
    },
    _construct: function (slide) {

        var _this = this;
        // Set ID
        this.slide.id = slide.id;

        // Get flow
        $.getScript('../shared/dev_framework_shared/js/flows.js').done(function () {

            _this.flow = flows[_this.slide.flowName];
            _this.presentation = flows.presentation_name;
            // Get key
            for (var e in _this.flow) {

                if (_this.flow[e].id == _this.slide.id) {
                    _this.flowKey = e;
                }
            }

            // Load HTML && CSS
            _this.helper.loadAll(function () {
                _this.selectedMenu();
                _this.handleEvents();
            }, _this);


        });

    },
    selectedMenu: function () {

        // Set Chapter
        $('#menu').find('[data-chapter="' + this.flow[this.flowKey].chapter + '"]')
            .addClass('current');

        // Set subChapter
        $('.subMenu').find('[data-link="' + this.slide.id + '"]')
            .addClass('current');

        this.flow[this.flowKey].ref.length > 0 ? $('.minMenu .ref').css({
                opacity: 1
            }) : "";
        this.flow[this.flowKey].ref.length > 0 ? $('.minMenu .doc').css({
                opacity: 1
            }) : "";

    },
    handleEvents: function () {

        var _this = this;

        var wrapperMenuScroll = $('#stage #wrapperMenuScroll');
        if (wrapperMenuScroll != undefined && $(wrapperMenuScroll).length > 0) {
            $(wrapperMenuScroll).remove();
        }

        //open modal
        $(document).on(_this.events, 'a[data-toggle="modal"]:not(.show)', function (e) {
            e.stopPropagation();

            var floder = $(this).attr('data-target'),
                button = $(this);
            button.addClass('in');

            $.ajax({
                url: 'popup/' + floder + '.html',
                dataType: "text",
                success: function (data) {

                    $('#popup [contentPopup]').empty();
                    $('#popup [contentPopup]').append(data);
                    $('#popup[data-popup]').css({
                        display: "block"
                    });
                    $('#popup[data-popup]')
                        .velocity({
                            opacity: 1
                        }, {
                            duration: 400
                        });
                }
            });

        });
        // Btn close popup
        $(document).on(_this.events, '#popup [btnclose]', function () {

            $('a[data-toggle="modal"].in').removeClass('in');
            $('#popup [contentPopup]').empty();
            $('#popup').velocity({
                opacity: 0
            }, {
                display: "none",
                duration: 300
            });
        });


        // Btn open rcp
        $(document).on(_this.events, '.minMenu .doc:not(".show")', function () {

            $(this).addClass('show');
            if (_this.flow[_this.flowKey].doc.length > 0) {

                $('#rcp').velocity({
                    opacity: 1
                }, {
                    display: "block",
                    duration: 300
                });

                // setTimeout(function(){
                //    var scroller = new iScroll("scroller", {
                //        vScroll: true,
                //        vScrollbar: false,
                //        hideScrollbar: false,
                //        bounce: false
                //     });
                // },200);
            }
        });

        // Btn close rcp
        $(document).on(_this.events, '#rcp [btnclose]', function () {

            $('.minMenu .doc').removeClass('show');
            $('#rcp').velocity({
                opacity: 0
            }, {
                display: "none",
                duration: 300
            });
        });


        // Btn open reference
        $(document).on(_this.events, '.minMenu .ref:not(".show")', function () {

            $(this).addClass('show');
            if (_this.flow[_this.flowKey].ref.length > 0) {

                $('#reference').velocity({
                    opacity: 1
                }, {
                    display: "block",
                    duration: 300
                });

                // setTimeout(function(){
                //    var scroller = new iScroll("scroller", {
                //        vScroll: true,
                //        vScrollbar: false,
                //        hideScrollbar: false,
                //        bounce: false
                //     });
                // },200);
            }
        });

        // Btn close reference
        $(document).on(_this.events, '#reference [btnclose]', function () {

            $('.minMenu .ref').removeClass('show');
            $('#reference').velocity({
                opacity: 0
            }, {
                display: "none",
                duration: 300
            });
        });

        // Data link
        $(document).on(_this.events, '[data-link]', function () {
            var newScreen = $(this).attr('data-link');
            _this.changeSlide(newScreen);
        });

        // Swipe

        if ($("#stage .content .reveal .slides > section").attr("data-block-left-nav") === "true"){
            console.log("swipe left disabled");
            $("#stage .content").swipe("disable");
        }else{
            $('#stage .content').swipe({
                swipe: function (event, direction) {

                    var max = _this.flow.length - 1,
                        key = parseInt(_this.flowKey);
                    //if swip to left is disabled
                    // if (direction == "left" && screen < max && $("#stage .content .reveal .slides > section").attr("data-block-left-nav") == "true") {
                    //     $("#stage .content").swipe("disable");
                    //     return false;
                    // }
                    if (direction == "left" && (key + 1) <= max) {
                        var newScreen = _this.flow[parseInt(_this.flowKey) + 1].id;
                        _this.changeSlide(newScreen);
                    }
                    //if swip to right is disabled
                    // if (direction == "right" && screen < max && $("#stage .content .reveal .slides > section").attr("data-block-right-nav") == "true") {
                    //     $("#stage .content").swipe("disable");
                    //     return false;
                    // }
                    // if (direction == "right" && (key - 1) >= 0 && ($("#stage .content .reveal .slides > section").attr("data-block-right-nav") == "false" || $("#stage .content .reveal .slides > section").attr("data-block-right-nav") == undefined)) {
                    //     var newScreen = _this.flow[parseInt(_this.flowKey) - 1].id;
                    //     _this.changeSlide(newScreen);
                    // }
                }
            });
        }

        if ($("#stage .content .reveal .slides > section").attr("data-block-right-nav") === "true"){
            console.log("swipe right disabled");
            $("#stage .content").swipe("disable");
        }else{
            $('#stage .content').swipe({
                swipe: function (event, direction) {

                    var max = _this.flow.length - 1,
                        key = parseInt(_this.flowKey);
                    //if swip to left is disabled
                    // if (direction == "left" && screen < max && $("#stage .content .reveal .slides > section").attr("data-block-left-nav") == "true") {
                    //     $("#stage .content").swipe("disable");
                    //     return false;
                    // }
                    // if (direction == "left" && (key + 1) <= max) {
                    //     var newScreen = _this.flow[parseInt(_this.flowKey) + 1].id;
                    //     _this.changeSlide(newScreen);
                    // }
                    //if swip to right is disabled
                    // if (direction == "right" && screen < max && $("#stage .content .reveal .slides > section").attr("data-block-right-nav") == "true") {
                    //     $("#stage .content").swipe("disable");
                    //     return false;
                    // }
                    if (direction == "right" && (key - 1) >= 0 ) {
                        var newScreen = _this.flow[parseInt(_this.flowKey) - 1].id;
                        _this.changeSlide(newScreen);
                    }
                }
            });
        }

        new iScroll("warraper", {

            scrollbarClass: "scroll",
            hideScrollbar: true,
            checkDOMChange: true,
            checkDOMChanges: true,
            vScroll: false,
            hScroll: true,
            onScrollMove: function () {
                $('#menu > .maxMenu > #warraper > #scroller > a').css('pointer-events', 'none')
            },
            onScrollEnd: function () {
                $('#menu > .maxMenu > #warraper > #scroller > a').css('pointer-events', 'auto')
            }
        });
        if ( typeof $('#warraperSub') != "undefined" && $('#warraperSub').length > 0){
            new iScroll("warraperSub", {
                scrollbarClass: "scroll",
                hideScrollbar: true,
                checkDOMChange: true,
                checkDOMChanges: true,
                vScroll: false,
                hScroll: true,
                onScrollMove: function () {
                    $('#menu > .subMenu > #warraperSub > #scrollerSub > a').css('pointer-events', 'none')
                },
                onScrollEnd: function () {
                    $('#menu > .subMenu > #warraperSub > #scrollerSub > a').css('pointer-events', 'auto')
                }
            });
        }

        setTimeout(function () {
            $('#stage .content').removeClass('hide');
        }, 150);
        setTimeout(function () {
            //animation
            $(document).on(_this.events, "[data-block-anim=tap]", function (e) {
                var TypeAnimation = $(this).find("[data-animation-type-tap]").attr("data-animation-type-tap"),
                    dataAnimationBlockType = $(this).find(".sl-block-content").attr("data-animation-type-tap");
                _this.helper.animBlock(dataAnimationBlockType, $(this));
            });

            /* Animation launched by click on the object (reset) */
            $("[data-block-anim=tap]").each(function (index, elm) {
                var this_ = $(this);
                console.log(this_.find(".sl-block-content").attr("data-animation-type-tap"));
                if (this_.find(".sl-block-content").attr("data-animation-type-tap") != "fade-out-edit-tap") {
                    this_.find(".sl-block-content").hide();
                }
                var dataObjectBeforeAnimStyle;
                //console.log(dataObjectBeforeAnimStyle);
                this_.find(".sl-block-content").css({
                    "transition-delay": "",
                    "transition-duration": ""
                }).promise().done(function () {
                    dataObjectBeforeAnimStyle = this_.find(".sl-block-content").attr("style");
                    this_.find(".sl-block-content").attr("data-style", dataObjectBeforeAnimStyle)
                });
            });
            /* End animation launched by click on the object (reset) */
            /* Fix animation BY TAP */
            $(".content .reveal").removeClass("ready");
            //console.log("data-trigger-anim-byclick: " + $(".content.active .reveal").find("section").attr("data-trigger-anim-byclick"));
            if ($("#stage .content .reveal .slides").find("section").attr("data-trigger-anim-byclick") == "false" || $("#stage .content .reveal .slides").find("section").attr("data-trigger-anim-byclick") == undefined) {
                setTimeout(function () {
                    $("#stage .content .reveal").addClass("ready");
                }, 100);
            }
            $(document).off(_this.events, ".content").on(_this.events, ".content", function (e) {
                //e.preventDefault();
                if ($(this).find(".reveal").not(".ready").length > 0) {
                    $(this).find(".reveal").addClass("ready");
                }
            });

            $("[data-block-anim=tap]").each(function (index, elm) {
                var this_ = $(this),
                    dataStyle = $(this).find(".sl-block-content").attr("data-style"),
                    dataRemovedAnimBlockType = $(this).find(".sl-block-content").attr("data-animation-type-tap");

                //console.log(dataStyle);
                this_.find(".sl-block-content").attr("style", dataStyle);
                _this.helper.hideAnimBlock(dataRemovedAnimBlockType, this_);
            });
            /* End fix animation */
        }, 140);


    },
    changeSlide: function (newScreen) {
        try {
            com.veeva.clm.gotoSlide(newScreen + '.zip');
        } catch (e) {
            window.location = "../" + newScreen + "/" + newScreen + ".html";
        }
    },
    init: function (flow, screen) {

        sessionStorage.setItem('flow', flow);
        this.changeSlide(screen);


    },
    helper: {

        loadAll: function (callback, _this) {


            var theme = "../shared/dev_framework_shared/theme/" + _this.flow[_this.flowKey].theme,
                textRef = _this.flow[_this.flowKey].ref,
                textDoc = _this.flow[_this.flowKey].doc;

            // Load global css
            _this.helper.ajax_("../shared/dev_framework_shared/css/main.css", "text", function (theme) {
                $("<style>", {
                    type: "text/css"
                }).appendTo($("head")).append(theme)
            });

            // Load eidtor css
            _this.helper.ajax_("../shared/dev_framework_shared/css/editor.css", "text", function (theme) {
                $("<style>", {
                    type: "text/css"
                }).appendTo($("head")).append(theme)
            });

            //load popup css
            _this.helper.ajax_(theme + "/popup/popup.css", "text", function (css) {
                $("<style>", {
                    type: "text/css"
                }).appendTo($("head")).append(css);
            });


            // Load reference css
            _this.helper.ajax_(theme + "/reference/reference.css", "text", function (css) {
                $("<style>", {
                    type: "text/css"
                }).appendTo($("head")).append(css);
            });


            // Load rcp css
            _this.helper.ajax_(theme + "/rcp/rcp.css", "text", function (css) {
                $("<style>", {
                    type: "text/css"
                }).appendTo($("head")).append(css);
            });
            // Load css template
            _this.helper.ajax_(theme + "/css/main.css", "text", function (css) {
                $("<style>", {
                    type: "text/css"
                }).appendTo($("head")).append(css)
            });


            // Load reference html
            _this.helper.ajax_(theme + "/reference/reference.html", "text", function (html) {
                $("body").append(html);

                textRef.length > 0 ? $('#reference [content]').html(textRef) : "";
            });

            // Load popup html
            _this.helper.ajax_(theme + "/popup/popup.html", "text", function (html) {
                $("body").append(html);
            });
            // Load rcp html
            _this.helper.ajax_(theme + "/rcp/rcp.html", "text", function (html) {
                $("body").append(html);

                textDoc.length > 0 ? $('#rcp [content]').html(textDoc) : "";
            });

            // Load html template
            _this.helper.ajax_(theme + "/menu.html", "text", function (html) {
                $("<div>", {
                    id: "menu"
                }).appendTo($("body")).append(html)

                callback();
            });

        },
        loadLib: function (callback, _this) {
            var jsScript;

            for (var e in _this.library) {
                _this.request.open("GET", "../shared/dev_framework_shared/lib/" + _this.library[e] + ".js", !1);
                _this.request.send(null);
                jsScript += _this.request.responseText;
            }

            var DSLScript = document.createElement("script");
            DSLScript.innerHTML = jsScript,
                DSLScript.type = "text/javascript",
                document.body.appendChild(DSLScript),
                document.body.removeChild(DSLScript);

            callback();
        },
        ajax_: function (path, type, callback) {
            $.ajax({
                url: path,
                dataType: type,
                success: function (a) {
                    callback(a)
                }
            });
        },
        animBlock: function (typeAnimation, animatedElm) {
            var TDuration = parseInt(animatedElm.find("[data-animation-type-tap]").attr("data-duration-tap")),
                Tdelay = parseInt(animatedElm.find("[data-animation-type-tap]").attr("data-delay-tap"));

            if (typeAnimation != undefined) {
                if (typeAnimation == "fade-in-tap") {
                    animatedElm.find("[data-animation-type-tap]").hide();
                    animatedElm.find("[data-animation-type-tap]").delay(Tdelay).fadeIn(TDuration);
                } else if (typeAnimation == "fade-out-edit-tap") {
                    animatedElm.find("[data-animation-type-tap]").css('opacity', '1').css('display', 'block');
                    animatedElm.find("[data-animation-type-tap]").delay(Tdelay).fadeOut(TDuration);
                } else if (typeAnimation == "slide-up-tap") {
                    animatedElm.find("[data-animation-type-tap]").hide();
                    animatedElm.find("[data-animation-type-tap]").delay(Tdelay).show("slide", {
                        direction: "down"
                    }, TDuration);
                } else if (typeAnimation == "slide-down-tap") {
                    animatedElm.find("[data-animation-type-tap]").hide();
                    animatedElm.find("[data-animation-type-tap]").delay(Tdelay).show("slide", {
                        direction: "up"
                    }, TDuration);
                } else if (typeAnimation == "slide-right-tap") {
                    animatedElm.find("[data-animation-type-tap]").hide();
                    animatedElm.find("[data-animation-type-tap]").delay(Tdelay).show("slide", {
                        direction: "left"
                    }, TDuration);
                } else if (typeAnimation == "slide-left-tap") {
                    animatedElm.find("[data-animation-type-tap]").hide();
                    animatedElm.find("[data-animation-type-tap]").delay(Tdelay).show("slide", {
                        direction: "right"
                    }, TDuration);
                } else if (typeAnimation == "scale-up-tap") {
                    animatedElm.find("[data-animation-type-tap]").hide();
                    animatedElm.find("[data-animation-type-tap]").delay(Tdelay).show('scale', {
                        direction: 'horizontal'
                    });
                } else if (typeAnimation == "scale-down-tap") {
                    animatedElm.find("[data-animation-type-tap]").hide();
                    animatedElm.find("[data-animation-type-tap]").delay(Tdelay).show("scale", {
                        percent: 130,
                        direction: 'horizontal'
                    }, TDuration);
                }
            }
        },
        hideAnimBlock: function (typeAnimation, toBeHiddenElm) {
            if (typeAnimation == "fade-in-tap") {
                toBeHiddenElm.find("[data-animation-type-tap]").clearQueue().stop();
            } else if (typeAnimation == "fade-out-edit-tap") {
                toBeHiddenElm.find("[data-animation-type-tap]").clearQueue().stop();
            } else if (typeAnimation == "slide-up-tap") {
                toBeHiddenElm.find("[data-animation-type-tap]").clearQueue().stop();
            } else if (typeAnimation == "slide-down-tap") {
                toBeHiddenElm.find("[data-animation-type-tap]").clearQueue().stop();
            } else if (typeAnimation == "slide-right-tap") {
                toBeHiddenElm.find("[data-animation-type-tap]").clearQueue().stop();
            } else if (typeAnimation == "slide-left-tap") {
                toBeHiddenElm.find("[data-animation-type-tap]").clearQueue().stop();
            } else if (typeAnimation == "scale-up-tap") {
                toBeHiddenElm.find("[data-animation-type-tap]").clearQueue().stop();
            } else if (typeAnimation == "scale-down-tap") {
                toBeHiddenElm.find("[data-animation-type-tap]").clearQueue().stop();
            }
        },
    }
};

document.addEventListener("DOMContentLoaded", function () {
    ARGO = Object.create(app.stage);
    ARGO._load();
});

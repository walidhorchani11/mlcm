var app = app || {};

app = function() {};

app.stage = {

    options: {
        events: null,
        popup: null,
        easing: {
            popup: null,
            reference: null,
            slideIn: null,
            slideOut: null
        },
        currentScreen: 0,
        currentFlow: "flow1",
        flowsMax: null,
        flow: null,
        flowTheme: null,
        ref: null,
        dom: {
            content: null,
            stage: null,
            css: null,
            head: document.getElementsByTagName('head')[0],
            menu: null,
            menuCss: null
        },
        removeClass: [],
        removeTimeouts: [],
        removeInterval: [],
        inSwipe: false,
        scrollerH: null,
        scrollerHMenuScroll: [],
        canClick: 1,
        tracking: {
            time: null,
            id: null,
            description: null
        },
        statut: "on",
        flowExist: {},
        submenuIsHidden: false,
        disableScroll : false
    },
    _SendData_: function() {
        //*******MCM SURVEY********
        console.log("send Done ");
        var ReponseCheckBox = "";
        var ReponseRad = "";
        var IDReponseCheckBox = "";
        var IDReponseRad = "";
        var ReponseTextFieled = "";
        var ReponseSelect = "";

        this.options.dom.stage.find('.active').find(".table-survey").each(function() {
            if ($(this).find('th').html() != undefined) {
                IDReponseCheckBox = $(this).find('th').attr('id');
                $(this).find(":checkbox").each(function() {
                    if ($(this).is(':checked')) {
                        ReponseCheckBox = ReponseCheckBox + $(this).val() + "|";
                    }
                });
            }
            if (ReponseCheckBox != "") {
                //console.log( "ID Question :      "+IDReponseCheckBox+"     Reponse    :"+ReponseCheckBox);
                window.parent.addData(IDReponseCheckBox, ReponseCheckBox);
            }
            ReponseCheckBox = "";
            IDReponseCheckBox = "";
        });
        this.options.dom.stage.find('.active').find(".table-survey-radio").each(function() {
            if ($(this).find('th').html() != undefined) {
                if ($(this).attr('id').indexOf("radio") != -1) {
                    IDReponseRad = $(this).find('th').attr('id');
                    $(this).find(":radio ").each(function() {
                        if ($(this).is(':checked')) {
                            ReponseRad = ReponseRad + $(this).val();

                        }
                    });
                }
            }
            if (ReponseRad != "") {
                //console.log("ID Question    :   "+IDReponseRad+"  Reponse   :   "+ReponseRad);
                window.parent.addData(IDReponseRad, ReponseRad);
            }
            ReponseRad = "";
            IDReponseRad = "";
        });
        this.options.dom.stage.find('.active').find(".text-field-output").each(function() {
            window.parent.addData($(this).find(".q-textField").attr('id'), $(this).find("input").val());
            //console.log("ID Question    :   "+$(this).find(".q-textField").attr('id')+"  Reponse   :   "+$(this).find("input").val());
            ReponseTextFieled = "";
        });
        this.options.dom.stage.find('.active').find(".select-survey-output").each(function() {
            window.parent.addData($(this).find(".q-select-question").attr('id'), $(this).find(".q-select option:selected").text());
            //console.log("ID Question    :   "+$(this).find(".q-select-question").attr('id')+"  Reponse   :   "+$(this).find(".q-select option:selected").text());
            ReponseSelect = "";
        });
        //*******END MCM SURVEY********
    },
    _construct_: function() {
        var _this = this;

        /* Disable alerts and error messages on MI*/
        window.parent.alert = function() {
            return false;
        };

        this.options.dom.stage = $('<div>', {
            id: "stage",
            class: "theme-font-montserrat",
            "data-prevent-tap": "true"
        });
        this.options.dom.stage.appendTo(document.body);

        this.options.dom.menu = $('<div>', {
            id: "menu",
            "data-prevent-tap": "true"
        });
        this.options.dom.menu.appendTo(this.options.dom.stage);

        this.options.dom.css = $('<style>', {
            type: "text/css"
        });
        this.options.dom.css.appendTo(this.options.dom.head);

        this.options.dom.menuCss = $('<style>', {
            type: "text/css"
        });
        this.options.dom.menuCss.appendTo(this.options.dom.head);

        $.getScript('js/framework/flows.js').done(function() {
            _this.init(_this.options.currentFlow, _this.options.currentScreen);
        });
        $( "<div class='trackCurrentScreen' data-prevent-tap='false'></div>" ).insertBefore( "#stage" );
    },
    initvideos: function() {
        var $videos         = $('#stage .main.active .reveal section').find('.sl-block[data-block-type="video"]'),
            $playedvideos   = $('#stage .main:not(.active) .reveal:not(.ready) section').find('.sl-block[data-block-type="video"]');

        if ($playedvideos.length > 0) {
            $playedvideos.each(function(index, videovalue) {
                var $elmvideo   = $(videovalue),
                    videoplayed = $elmvideo.find('video'),
                    videosrc    = videoplayed.attr('src');

                videoplayed.attr('preload', 'none');
                videoplayed[0].pause();
            });
        }
        if ($videos.length > 0) {
            $videos.find('.video-placeholder').remove();
            $videos.each(function(index, value) {
                var $elm        = $(value),
                    poster      = $elm.attr('data-video-poster'),
                    autoplay    = $elm.attr('data-video-autoplay'),
                    video       = $elm.find('video');
                $elm.append('<div class="video-placeholder"></div>');
                if (typeof poster !== 'undefined' && poster !== '') {
                    video.removeAttr('controls');
                }
                if (typeof autoplay !== 'undefined' && autoplay === 'true') {
                    $elm.removeAttr('poster');
                    $elm.find('.video-placeholder').remove();
                    video.removeAttr('poster');
                    video.attr({ 'controls' : 'controls', 'autoplay' : true });
                    video[0].play();
                }
            });
        }
    },
    init: function(currentFlow, screen) {

        var _this = this;

        this.options.currentFlow = currentFlow;
        console.log(currentFlow);
        this.options.flow = flows[currentFlow];
        this.options.flowsMax = this.options.flow.length - 2;
        this.options.flowTheme = this.options.flow[0].theme;
        this.options.events = this.options.flow[0].events;
        this.options.easing.popup = this.options.flow[0].easingPop;
        this.options.easing.reference = this.options.flow[0].easingRef;
        this.options.easing.slideIn = this.options.flow[0].easingSlideIn;
        this.options.easing.slideOut = this.options.flow[0].easingSlideOut;

        this.loadMenu(function() {
            //previewMenu();
            _this.loadContent(currentFlow, screen);
            if(ARGO.options.disableScroll != true){
                ARGO.customizeMenuScroll();
            }
        });
        _this.handleEvent();


        /* Animation launched by click on the object */
        jQuery(document).on(ARGO.options.events, "[data-block-anim=tap]", function(e) {
            e.stopPropagation();
            if (jQuery(this).attr("data-block-anim") == "tap" && jQuery(this).find((".sl-block-content")).attr("data-animation-type") != undefined && jQuery(this).find((".sl-block-content")).attr("data-animation-type").indexOf("-tap") == -1) {

                ((jQuery(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out") || (jQuery(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out-edit") ) ? jQuery(this).find(".sl-block-content").css('opacity', '1') : jQuery(this).find(".sl-block-content").css('opacity', '1');
                jQuery(this).find((".sl-block-content")).attr("data-animation-type-tap", jQuery(this).find((".sl-block-content")).attr("data-animation-type") + "-tap").removeAttr('data-animation-type');
                jQuery(this).find(".sl-block-content").css("transition-delay", '');
                jQuery(this).find(".sl-block-content").css("transition-duration", '');
            }
            else if (jQuery(this).attr("data-block-anim") != "tap" && (jQuery(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out-edit")) {
                jQuery(this).find((".sl-block-content")).attr("data-animation-type", "fade-out");
            }
            var TypeAnimation = jQuery(this).find("[data-animation-type-tap]").attr("data-animation-type-tap"),
                dataAnimationBlockType = jQuery(this).find(".sl-block-content").attr("data-animation-type-tap");

            ARGO.animBlock(dataAnimationBlockType, $(this));
        });
        /* End animation launched by click on the object */
    },
    loadMenu: function(callback) {

        this.options.dom.stage.find('#menu').html("");

        var path = this.options.flowTheme,
            _this = this;

        this.ajax_('theme/' + path + '/main.css', 'text', function(data) {
            _this.options.dom.menuCss.append(data);
        });

        this.ajax_('theme/' + path + '/index.html', 'html', function(data) {
            _this.options.dom.menu.append(data);
            if(_this.options.dom.menu.find(".maxMenu").is("[data-disable-scroll=true]")){
                ARGO.options.disableScroll = true;
            }
            $.getScript('theme/' + path + '/main.js');
            callback();
        });
    },
    loadContent: function(currentFlow, screen) {

        var _this = this,
            loaded = 1,
            content = "";

        if (_this.options.flowExist[currentFlow] != true) {

            for (var i = 1; i <= this.options.flow.length - 1; i++) {

                _this.ajax_('screen/' + _this.options.flow[i].id + '/main.css', 'text', function(data) {

                    _this.options.dom.css.append(data);
                });

                _this.ajax_('screen/' + _this.options.flow[i].id + '/index.html', 'html', function(data) {
                    content += data + "\r\n";
                    loaded++;
                    if (loaded == _this.options.flow.length) {
                        _this.options.dom.stage.append(content);
                        _this.loadScreen(screen);
                    }
                });
            };
            _this.options.flowExist[currentFlow] = true;
        } else {
            _this.loadScreen(screen);
        }
    },
    loadScreen: function(screen) {
        ARGO._SendData_();
        var screen = parseInt(screen);
        this.options.currentScreen = screen;
        var path = this.options.flow[screen + 1].id,
            current = this.options.dom.stage.find('.active'),
            news = this.options.dom.stage.find('#' + path),
            chapter = this.options.flow[screen + 1].chapter;

        //Current slide remove active class
        current.removeClass('active').css({
            display: "none"
        });

        //New slide add class active
        news.addClass('active').css({
            display: "block"
        });

        // Load Js new screen
        $.getScript('screen/' + path + '/main.js');

        //set menu
        this.setMenu(chapter, screen + 1);

        //Mi DataTracking
        this.tracking(screen);

        //Remove class/setTimeout/style
        this.removeAll(current);


        //*******MCM SURVEY With clique********

        $(".submit-btn-preview").off("click").on("click", function() {
            $(this).css('background-color', $(this).attr('activated-color'));
            ARGO._SendData_();
        });
        //*******END MCM SURVEY********

        /* Scroll active menu swiping (zip) */
        var stmScroll = setTimeout(function() {
            for (var key in ARGO.options.scrollerHMenuScroll) {
                //console.log("Key: " + key + " / Valeur tab ID: " + ARGO.options.scrollerHMenuScroll[key].wrapper.id);
                if (ARGO.options.scrollerHMenuScroll[key].wrapper.id === $(".current").parents("#menu .maxMenu > div").attr("id")) {
                    //console.log("Key: " + key + " / Valeur tab ID Maxmenu: " + ARGO.options.scrollerHMenuScroll[key].wrapper.id);
                    if ($("#menu .maxMenu a.current").index() != -1) {
                        ARGO.options.scrollerHMenuScroll[key].scrollToElement('a:nth-child(' + ($("#menu .maxMenu a.current").index() + 1) + ')', 1000);
                    }
                } else if (ARGO.options.scrollerHMenuScroll[key].wrapper.id === $("#menu .subMenu.current .scrollmenu1").attr("id")) {
                    //console.log("Key: " + key + " / Valeur tab ID Submenu: " + ARGO.options.scrollerHMenuScroll[key].wrapper.id);
                    if ($("#menu .scrollmenu1 a.current").index() != -1) {
                        ARGO.options.scrollerHMenuScroll[key].scrollToElement('a:nth-child(' + ($("#menu .scrollmenu1 a.current").index() + 1) + ')', 1000);
                    }
                } else if ($("#menu a.home.current").length > 0) {
                    ARGO.options.scrollerHMenuScroll[key].scrollToElement('a:nth-child(1)', 1000);
                }
                //console.log("----------------------------------------------------------------------------");
            }
        }, 300);
        ARGO.options.removeTimeouts.push(stmScroll);


    },
    setMenu: function(chapter, screen) {

        var ref = this.options.dom.menu.find('.ref'),
            sub = this.options.flow[screen].id;

        //Add class to Menu
        this.options.dom.menu.find('.current').removeClass('current');
        this.options.dom.menu.find('[data-chapter = "' + chapter + '"]').addClass('current');


        //Add class to subMenu
        if (this.options.dom.menu.find('.subMenu').length > 0) {
            this.options.dom.menu.find('.subMenu .current').removeClass('current');
            this.options.dom.menu.find('.subMenu [data-sub="' + sub + '"]').addClass('current');
        }

        //Set reference status
        if (this.options.flow[screen].ref.length <= 0) {
            ref.css({
                "opacity": "0.5"
            });
            this.options.ref = false;
        } else {
            ref.css({
                "opacity": "1"
            });
            this.options.ref = true;
        }

        /* Customize navbar appearance (zip) */
        if(ARGO.options.dom.menu.find('.subMenu [data-sub="' + ARGO.options.flow[ARGO.options.currentScreen+1].id + '"]').parents(".subMenu").is(".hide-menu") == true){
            ARGO.options.submenuIsHidden = true;
        }
        //console.log(ARGO.options.submenuIsHidden);

        var customNavbarAppearance = $(".content.active [data-custom-navbar-appearance]").attr("data-custom-navbar-appearance");
        //console.log(customNavbarAppearance);
        if(customNavbarAppearance != undefined){
            switch(customNavbarAppearance){
                case "standard":
                    /**************** Toggle data-prevent-tap for Menu and Stage ****************/
                    /*$("#stage").attr("data-prevent-tap", "false");
                    $("#menu").attr("data-prevent-tap", "");*/
                    $(".hide-menu").each(function(index, elm){
                        if(($(this).is(".subMenu") == false && ARGO.options.submenuIsHidden == false) || ($(this).is(".subMenu") == false && ARGO.options.submenuIsHidden == true)){
                            $(this).removeClass("hide-menu");
                        }
                    });
                    //console.log("Switch case: " + customNavbarAppearance);
                    break;
                case "Hide-all":
                    /**************** Toggle data-prevent-tap for Menu and Stage ****************/
                    /*$("#stage").attr("data-prevent-tap", "true");
                    $("#menu").attr("data-prevent-tap", "true");*/
                    $("#menu, .subMenu, .maxMenu").each(function(index, elm){
                        if($(this).is(".subMenu") == true){
                            if($(this).find("[data-sub=" + ARGO.options.flow[ARGO.options.currentScreen+1].id + "]") > 0){
                                $(this).addClass("hide-menu");
                            }
                        }
                        else{
                            $(this).addClass("hide-menu");
                        }
                    });
                    //console.log("Switch case: " + customNavbarAppearance);
                    break;
                case "Hide-chapters":
                    /**************** Toggle data-prevent-tap for Menu and Stage ****************/
                    /*$("#stage").attr("data-prevent-tap", "false");
                    $("#menu").attr("data-prevent-tap", "");*/
                    $("#menu").is(".hide-menu") ? $("#menu").removeClass("hide-menu") : null;
                    $(".maxMenu").is(".hide-menu") == false ? $(".maxMenu").addClass("hide-menu") : null;
                    $(".subMenu").is(".hide-menu") == false ? ARGO.options.dom.menu.find('.subMenu [data-sub="' + ARGO.options.flow[ARGO.options.currentScreen+1].id + '"]').parents(".subMenu").addClass("hide-menu") : null;
                    //console.log("Switch case: " + customNavbarAppearance);
                    break;
            }
        }
        else{
            //console.log(ARGO.options.submenuIsHidden);
            /**************** Toggle data-prevent-tap for Menu ****************/
            /*$("#menu").attr("data-prevent-tap", "");*/
            $(".hide-menu").each(function(index, elm){
                if(($(this).is(".subMenu") == false && ARGO.options.submenuIsHidden == false) || ($(this).is(".subMenu") == false && ARGO.options.submenuIsHidden == true)){
                    $(this).removeClass("hide-menu");
                }
            });
            //console.log("Switch case: " + customNavbarAppearance);
        }
        /* End customize navbar appearance (zip) */

    },
    handleEvent: function() {

        var _this = this,
            path = this.options.flowTheme;
        if (Object.keys(ARGO.options.flowExist).length <= 0) {
            //Swipe
            this.options.dom.stage.swipe({
                swipe: function(event, direction) {

                    var screen = _this.options.currentScreen,
                        nameScreen = _this.options.flow[screen + 1].id;
                    min = 0,
                        max = _this.options.flowsMax,
                        statut = _this.options.statut;

                    if (direction === 'up' || direction === 'down') {
                        return false;
                    }
                    _this.options.inSwipe = true;


                    if (direction == "left" && screen < max && ($(".content.active .reveal").find("section").attr("data-block-left-nav") == "false" || $(".content.active .reveal").find("section").attr("data-block-left-nav")==undefined
                        )) {
                        console.log("left");
                        _this.loadScreen(screen + 1);
                    }
                    if (direction == "left" && screen < max && $(".content.active .reveal").find("section").attr("data-block-left-nav") == "true" ){
                        //_this.loadScreen(screen);
                        console.log("left-block");
                    }


                    if (direction == "right" && screen > min && ($(".content.active .reveal").find("section").attr("data-block-right-nav") == "false" || $(".content.active .reveal").find("section").attr("data-block-right-nav")==undefined
                        )) {
                        console.log("rigth");
                        _this.loadScreen(screen - 1);
                    }
                    if (direction == "right" && screen > min && $(".content.active .reveal").find("section").attr("data-block-right-nav") == "true" ) {
                        console.log("rigth-block");
                        //  _this.loadScreen(screen);
                    }

                    /*  if (direction == "left" && screen < max) {
                     _this.loadScreen(screen + 1);
                     }

                     if (direction == "right" && screen > min) {
                     _this.loadScreen(screen - 1);
                     }*/
                    setTimeout(function() { _this.initvideos(); }, 300);
                }
            });

            //Global link
            /*$(document).on("touchend",'[data-link]:not(".disable")', function(){
             if(_this.options.inSwipe != true){
             var location = $(this).attr('data-link');
             _this.loadScreen(location);
             }
             });*/
            $(document).on("touchend", '[data-link]', function() {
                if (ARGO.options.canClick == 1) {
                    var location = $(this).attr('data-link');
                    _this.loadScreen(location);
                    setTimeout(function() { _this.initvideos(); }, 300);
                }
            });
            $(document).on("touchstart", '.sl-block[data-block-type="scrollabletext"]', function() {
                _this.swipe('disable');
            });
            //Open reference
            this.options.dom.menu.on(this.options.events, '.ref.show', function(e) {

                $('.content.active [data-popup]').addClass('show');

                e.stopPropagation();
                if (_this.options.ref == true) {
                    var screen = _this.options.currentScreen,
                        ref = _this.options.flow[screen + 1].ref,
                        thisPicto = $(this);

                    thisPicto.removeClass('show');

                    $.ajax({
                        url: 'theme/' + _this.options.flowTheme + '/reference/reference.html',
                        dataType: "text",
                        success: function(data) {

                            $('.content.active').append(data);
                            $('#textReference').html(ref);
                            $('#boxReference').promise().done(function() {
                                setTimeout(function() {
                                    var scrollerRefHeight = $("#boxReference").height(),
                                        scrollerRefTitleHeight = $("#boxReference").find("h3").outerHeight(true);
                                    //console.log(scrollerRefHeight + " / " + scrollerRefTitleHeight);
                                    $("#boxReference #scrollerRef").outerHeight(scrollerRefHeight - (scrollerRefTitleHeight + 20));
                                }, 200);
                            });

                            setTimeout(function() {
                                _this.scroller('scrollerRef');
                            }, 300);

                            _this.swipe('disable');

                            $('#layer[data-ref]')
                                .velocity({
                                    opacity: "1"
                                }, {
                                    display: "block",
                                    duration: 700
                                });

                            //Close reference
                            $('#boxReferenceClose').on(_this.options.events, function(e) {

                                e.stopPropagation();
                                $('#layer[data-ref]')
                                    .velocity("reverse", {
                                        duration: 700,
                                        complete: function() {
                                            $('.content.active [data-popup]').removeClass('show');
                                            $('#layer[data-ref]').remove();
                                            thisPicto.addClass('show');
                                            _this.swipe('enable');
                                        }
                                    });
                            });
                        }
                    });
                }
            });


            //Open RCP
            this.options.dom.menu.on(this.options.events, '.menu-ml.showRcp', function() {
                /********************/
                var Rcpelm = flows[ARGO.options.currentFlow][0].rcp;
                if (Rcpelm != "") {
                    var RcpNumber = Rcpelm.match(/<li/g);
                    //console.log(RcpNumber.length);

                    if ($(this).not('[data-pdf]') && RcpNumber.length != 1) {

                        var screen = _this.options.currentScreen,
                            rcp = ARGO.options.flow[0].rcp,
                            thisPicto = $(this);

                        thisPicto.removeClass('showRcp');

                        $.ajax({
                            url: 'theme/' + _this.options.flowTheme + '/rcp/rcp.html',
                            dataType: "text",
                            success: function(data) {

                                $('.content.active').append(data);
                                $('#textRcp').html(rcp);

                                _this.swipe('disable');

                                $('#layer[data-rcp]')
                                    .velocity(_this.options.easing.reference, {
                                        duration: 700,
                                        complete: function() {
                                            //_this.scroller('scroller');

                                            var scrollerRCPHeight = $("#scrollerRCP > div").first().height();
                                            //console.log("scrollerRCPHeight " + scrollerRCPHeight);
                                            $("#scrollerRCP > div").first().outerHeight(scrollerRCPHeight);
                                        }
                                    });

                                    setTimeout(function(){
                                        _this.scroller('scrollerRCP');
                                    }, 100);

                                //Close RCP
                                $('#boxRcpClose').on(_this.options.events, function() {

                                    $('#layer[data-rcp]')
                                        .velocity("reverse", {
                                            duration: 700,
                                            complete: function() {
                                                $('#layer[data-rcp]').remove();
                                                thisPicto.addClass('showRcp');
                                                _this.swipe('enable');
                                            }
                                        });
                                });
                            }
                        });
                    }
                }

            });
            $(document).on("touchend", '[data-video]', function(e) {
                e.stopPropagation();
                var videoAttr   = $(this).attr('data-video'),
                    video       = $(this).find('video');

                if (typeof videoAttr !== 'undefined' && videoAttr !== '' && video[0] !== '') {
                    video.attr('preload', 'none');
                    if (video[0].paused) {
                        $(this).find('.video-placeholder').hide();
                        video[0].play(),
                            video.attr({ 'played' : true, 'controls' : true })
                        return;
                    }
                    $(this).find('.video-placeholder').show();
                    video[0].pause(),
                        video.attr({ 'played' : false, 'controls' : false })
                }
            });
            $(document).on("touchend", '[data-popup]:not(.show)', function(e) {

                e.stopPropagation();

                var folder = $(this).attr('data-popup'),
                    parentFolder = $(this).closest('.content').attr('id'),
                    button = $(this);
                var  DescriptionPopin= null;
                /*Alou*/
                setTimeout(function() {
                    jQuery('.popin').find(".submit-btn-preview").off("click").on("click", function() {
                        $(this).css('background-color', $(this).attr('activated-color'));
                        ARGO._SendData_();
                    });
                    /*AlouAlou*/
                    /*******************************************Animation_aut*************************************************************/
                    jQuery('.popin').find(".sl-block").each(function () {
                        if ($(this).attr("data-block-anim") != "tap" && $(this).find((".sl-block-content")).attr("data-animation-type") != undefined) {
                            //  ($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out") ? $(this).find(".sl-block-content").show() : $(this).find(".sl-block-content").hide();
                            (($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out") || ($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out-edit") ) ? $(this).find(".sl-block-content").css('opacity', '1') : $(this).find(".sl-block-content").css('opacity', '1');
                            $(this).find((".sl-block-content")).attr("data-animation-type-aut", $(this).find((".sl-block-content")).attr("data-animation-type") + "-aut").removeAttr('data-animation-type');
                            $(this).find((".sl-block-content")).attr("data-duration-aut", parseFloat($(this).find(".sl-block-content").css("transition-duration")) * 1000);
                            $(this).find((".sl-block-content")).attr("data-delay-aut", parseFloat($(this).find(".sl-block-content").css("transition-delay")) * 1000);


                            $(this).find(".sl-block-content").css("transition-delay", '');
                            $(this).find(".sl-block-content").css("transition-duration", '');
                        }
                        else if ($(this).attr("data-block-anim") != "aut" && ($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out-edit")) {
                            $(this).find((".sl-block-content")).attr("data-animation-type", "fade-out");
                        }
                    });
                    /***********************************************************************************************************************/
                    jQuery('.popin').find(".sl-block").each(function () {
                        $(this).find(".sl-block-content").css('opacity', '');
                        var TypeAnimation = $(this).find((".sl-block-content")).attr("data-animation-type-aut");
                        if (TypeAnimation != undefined) {
                            var TDuration = parseInt($(this).find((".sl-block-content")).attr("data-duration-aut"));
                            var Tdelay = parseInt($(this).find((".sl-block-content")).attr("data-delay-aut"));
                            if (TypeAnimation == "fade-in-aut") {
                                $(this).find(".sl-block-content").hide();
                                $(this).find(".sl-block-content").delay(Tdelay).fadeIn(TDuration);
                            }
                            else if ((TypeAnimation == "fade-out-aut") || (TypeAnimation == "fade-out-edit-aut")) {
                                $(this).find(".sl-block-content").css('opacity', '1').css('display', 'block');
                                if ($(this).find(".sl-block-content").css('opacity') == '1' && $(this).find(".sl-block-content").css('display') == 'block') {
                                    $(this).find(".sl-block-content").delay(Tdelay).fadeOut(TDuration);
                                }
                            }
                            else if (TypeAnimation == "slide-up-aut") {
                                $(this).find(" .sl-block-content").hide();
                                $(this).find(" .sl-block-content").delay(Tdelay).show("slide", {direction: "down"}, TDuration);
                            }
                            if (TypeAnimation == "slide-down-aut") {
                                $(this).find(" .sl-block-content").hide();
                                $(this).find(" .sl-block-content").delay(Tdelay).show("slide", {direction: "up"}, TDuration);
                            }
                            else if (TypeAnimation == "slide-right-aut") {
                                $(this).find(" .sl-block-content").hide();
                                $(this).find(".sl-block-content").delay(Tdelay).show("slide", {
                                    direction: "left"
                                }, TDuration);
                            }
                            else if (TypeAnimation == "slide-left-aut") {
                                $(this).find(" .sl-block-content").hide();
                                $(this).find(".sl-block-content").delay(Tdelay).show("slide", {
                                    direction: "right"
                                }, TDuration);
                            }
                            else if (TypeAnimation == "scale-up-aut") {
                                /*  $(this).find(" .sl-block-content").hide();
                                 $(this).find(".sl-block-content ").delay(Tdelay).show('scale', {direction: 'horizontal'});*/
                                var animatedElm = $(this);
                                animatedElm.css("transform"," scale(0)").css("transition", "all 0s");
                                setTimeout(function () {
                                    var TDurationS = TDuration/1000;
                                    animatedElm.css("transform"," scale(1)").css("transition", "all "+TDurationS+"s");
                                }, Tdelay);
                            }
                            else if (TypeAnimation == "scale-down-aut") {
                                var animatedElm = $(this);
                                animatedElm.css("transform"," scale(1.7)").css("transition", "all 0s");
                                setTimeout(function () {
                                    var TDurationS = TDuration/1000;
                                    animatedElm.css("transform"," scale(1)").css("transition", "all "+TDurationS+"s");
                                }, Tdelay);
                                /* $(this).find(".sl-block-content").hide();
                                 $(this).find(".sl-block-content ").delay(Tdelay).show("scale",
                                 {percent: 130, direction: 'horizontal'}, TDuration);*/
                            }
                        }
                    });
                    /*******************************************END_Animation_aut**********************************************************/
                    /*******************************************Animation_Tap**********************************************************/
                    jQuery('.popin').find(".sl-block").each(function () {
                        if ($(this).attr("data-block-anim") == "tap" && $(this).find((".sl-block-content")).attr("data-animation-type") != undefined && $(this).find((".sl-block-content")).attr("data-animation-type").indexOf("-tap") == -1) {
                            //  ($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out") ? $(this).find(".sl-block-content").show() : $(this).find(".sl-block-content").hide();
                            (($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out") || ($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out-edit") ) ? $(this).find(".sl-block-content").css('opacity', '1') : $(this).find(".sl-block-content").css('opacity', '0');
                            $(this).find((".sl-block-content")).attr("data-animation-type-tap", $(this).find((".sl-block-content")).attr("data-animation-type") + "-tap").removeAttr('data-animation-type');
                            $(this).find(".sl-block-content").css("transition-delay", '');
                            $(this).find(".sl-block-content").css("transition-duration", '');
                        }
                        else if ($(this).attr("data-block-anim") != "tap" && ($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out-edit")) {
                            $(this).find((".sl-block-content")).attr("data-animation-type", "fade-out");
                        }
                    });
                    /***********************************************************************************************************************/
                    jQuery('.popin').find(".sl-block").click(function () {
                        $(this).find(".sl-block-content").css('opacity', '');
                        var TypeAnimation = $(this).find((".sl-block-content")).attr("data-animation-type-tap");
                        if (TypeAnimation != undefined) {
                            var TDuration = parseInt($(this).find((".sl-block-content")).attr("data-duration-tap"));
                            var Tdelay = parseInt($(this).find((".sl-block-content")).attr("data-delay-tap"));
                            if (TypeAnimation == "fade-in-tap") {
                                $(this).find(".sl-block-content").hide();
                                $(this).find(".sl-block-content").delay(Tdelay).fadeIn(TDuration);
                            }
                            else if ((TypeAnimation == "fade-out-tap") || (TypeAnimation == "fade-out-edit-tap")) {
                                $(this).find(".sl-block-content").css('opacity', '1').css('display', 'block');
                                if ($(this).find(".sl-block-content").css('opacity') == '1' && $(this).find(".sl-block-content").css('display') == 'block') {
                                    $(this).find(".sl-block-content").delay(Tdelay).fadeOut(TDuration);
                                }
                            }
                            else if (TypeAnimation == "slide-up-tap") {
                                $(this).find(" .sl-block-content").hide();
                                $(this).find(" .sl-block-content").delay(Tdelay).show("slide", {direction: "down"}, TDuration);
                            }
                            if (TypeAnimation == "slide-down-tap") {
                                $(this).find(" .sl-block-content").hide();
                                $(this).find(" .sl-block-content").delay(Tdelay).show("slide", {direction: "up"}, TDuration);
                            }
                            else if (TypeAnimation == "slide-right-tap") {
                                $(this).find(" .sl-block-content").hide();
                                $(this).find(".sl-block-content").delay(Tdelay).show("slide", {
                                    direction: "left"
                                }, TDuration);
                            }
                            else if (TypeAnimation == "slide-left-tap") {
                                $(this).find(" .sl-block-content").hide();
                                $(this).find(".sl-block-content").delay(Tdelay).show("slide", {
                                    direction: "right"
                                }, TDuration);
                            }
                            else if (TypeAnimation == "scale-up-tap") {
                                $(this).find(" .sl-block-content").hide();
                                $(this).find(".sl-block-content ").delay(Tdelay).show('scale', {direction: 'horizontal'});
                            }
                            else if (TypeAnimation == "scale-down-tap") {
                                $(this).find(".sl-block-content").hide();
                                $(this).find(".sl-block-content ").delay(Tdelay).show("scale",
                                    {percent: 130, direction: 'horizontal'}, TDuration);
                            }
                        }
                    });
                    /********************************END_Animation_Tap*****************************************************************/
                    /*EndAloualou*/
                    DescriptionPopin=$($("#stage").find('#textPopup').find('section')[0]).attr('data-popin-name');
                    _this.trackingPopin(DescriptionPopin);

                    /* Toggle prevent tap when open popin */
                    //$('.trackCurrentScreen').attr('data-prevent-tap','true');
                    $('.trackCurrentScreen').css('width','calc(100% - 60px)');
                    /* End toggle prevent tap when open popin */
                }, 100);
                /*EAlou*/
                $.ajax({
                    url: 'theme/' + _this.options.flowTheme + '/popup/popup.html',
                    dataType: "text",
                    success: function(data) {

                        $('.content.active').append(data);
                        _this.swipe('disable');
                        button.addClass('show');
                        $('#boxPopup').addClass(folder);
                        var closepop = $('#boxPopup .close').clone();
                        closepop.removeClass('hide');
                        $.ajax({
                            url: 'screen/' + parentFolder + '/popup/' + folder + '.html',
                            dataType: "text",
                            success: function(data) {
                                $('#textPopup').append(data);
                                $('#layer[data-pop]').css({
                                    display: "block"
                                });
                                $('#boxPopup section.popin').prepend(closepop);
                                var $poster = $('#boxPopup section.popin .sl-block[data-block-type="video"]');

                                $poster.each(function(index, value) {
                                    var $elm        = $(value),
                                        poster      = $elm.attr('data-video-poster'),
                                        autoplay    = $elm.attr('data-video-autoplay'),
                                        video       = $elm.find('video');

                                    $elm.append('<div class="video-placeholder"></div>');
                                    if (typeof poster !== 'undefined' && poster !== '') {
                                        video.attr('poster', poster);
                                        video.removeAttr('controls');
                                    }
                                    if (typeof autoplay !== 'undefined' && autoplay === 'true') {
                                        $elm.find('.video-placeholder').remove();
                                        video.removeAttr('poster');
                                        video.attr({ 'controls' : 'controls', 'autoplay' : true });
                                        video[0].play();
                                    }
                                });
                                //$('#menu').css({'z-index': 5});

                                // $('#boxPopup').promise().done(function() {
                                //     setTimeout(function() {
                                //         var scrollerPopHeight = $("#boxPopup").height();
                                //         //console.log(scrollerPopHeight);
                                //         $("#boxPopup #scrollerPop").outerHeight(scrollerPopHeight - ($("#boxPopup #scrollerPop").offset().top - $("#boxPopup").offset().top), true);
                                //     }, 200);
                                // });

                                /*setTimeout(function() {
                                 _this.scroller('scrollerPop');
                                 }, 300);*/

                                $('#layer[data-pop]')
                                    .velocity({
                                        opacity: 1
                                    }, {
                                        duration: 400
                                    });


                                $('#boxPopup .close').on(_this.options.events, function() {
                                    //	close pop-up
                                    $('#boxPopup section.popin .close').remove();

                                    $('#layer[data-pop]')
                                        .velocity({
                                            opacity: 0
                                        }, {
                                            duration: 100,
                                            complete: function() {
                                                var videos = $('#boxPopup section.popin').find('video');

                                                if (videos.length > 0) {
                                                    videos.each(function() {
                                                        this.pause();
                                                        this.currentTime = 0;
                                                    });
                                                }

                                                $('#layer[data-pop]').remove();

                                                /* Toggle prevent tap when close popin */
                                                //$('.trackCurrentScreen').attr('data-prevent-tap','false');
                                                $('.trackCurrentScreen').css('width','100%');
                                                /* End toggle prevent tap when close popin */
                                                _this.swipe('enable');
                                                button.removeClass('show');
                                            }
                                        });
                                    //$('.content.main').css({'z-index': 0});
                                });
                            }
                        });
                    }
                });
            });
        };
        setTimeout(function() { _this.initvideos(); }, 300);
    },
    removeAll: function(current) {
        var currentScreen = current;
        var Rclass = this.options.removeClass,
            Rtimeout = this.options.removeTimeouts,
            Rinterval = this.options.removeInterval;
        current = "#" + current.attr('id') + " *",
            _this = this;


        /* Animation launched by click on the object (reset) */

        setTimeout(function () {
            $("[data-block-anim=tap]").each(function (index, elm) {
                var this_ = $(this);
                if (this_.find(".sl-block-content").attr("data-animation-type-tap") != "fade-out-edit-tap") {
                    this_.find(".sl-block-content").css('opacity', '0');
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
        }, 100);
        /* End animation launched by click on the object (reset) */

        /* Fix animation BY TAP */
        $("[data-animation-type=fade-out-edit]").each(function (index, elm) {
            var this_ = $(this);
            if (this_.parents(".sl-block").is("[data-block-anim]") == false) {
                this_.attr("data-animation-type", "fade-out");
            }
        });

        $(".content .reveal").removeClass("ready");
        //console.log("data-trigger-anim-byclick: " + $(".content.active .reveal").find("section").attr("data-trigger-anim-byclick"));
        if ($(".content.active .reveal").find("section").attr("data-trigger-anim-byclick") == "false" || $(".content.active .reveal").find("section").attr("data-trigger-anim-byclick") == undefined) {
            setTimeout(function () {
                $(".content.active .reveal").addClass("ready");
            }, 100);
        }
        $(document).off(ARGO.options.events, ".content.active").on(ARGO.options.events, ".content.active", function (e) {
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
            ARGO.hideAnimBlock(dataRemovedAnimBlockType, this_);
        });

        /* End fix animation */


        $('*').removeClass('grey off on orange show');
        $('#layer').remove();
        $('.ref').addClass('show');

        _this.options.dom.stage.swipe("enable");
        /*   $(current).removeAttr('style'); */
        $(current).velocity("stop");
        $(current).removeClass(Rclass[0]);

        for (key in Rtimeout) {

            clearTimeout(Rtimeout[key]);
        }
        for (key in Rinterval) {

            clearInterval(Rinterval[key]);
        }

        this.options.removeClass = [];
        this.options.removeTimeouts = [];
        setTimeout(function() {
            _this.options.inSwipe = false;
        }, 200);

    },
    ajax_: function(path, type, callback) {

        $.ajax({
            url: path,
            dataType: type,
            success: function(data) {
                callback(data);
            }
        });
    },
    tracking: function(screen) {
        try {
            window.parent.onEnterPage(this.options.flow[screen + 1].description);
        } catch (e) {
            console.log("On Enter page : " + this.options.flow[screen + 1].description);
        }
    },
    trackingPopin: function(DescriptionPopin) {
        try {
            window.parent.onEnterPage(DescriptionPopin);
        } catch (e) {
            console.log("On Enter page : " +DescriptionPopin);
        }
    },
    scroller: function(el) {
        var scroller = new iScroll(el, {
            vScroll: true,
            vScrollbar: true,
            hideScrollbar: false,
            bounce: false,
            onScrollMove: function() {
                ARGO.options.canClick = 0;
            },
            onScrollEnd: function() {
                setTimeout(function(){
                    ARGO.options.canClick = 1;
                }, 500);
            }
        });
    },
    scrollerH: function(el) {

        var scrollerH = new iScroll(el, {

            scrollbarClass: "scroll",
            hideScrollbar: true,
            checkDOMChange: true,
            checkDOMChanges: true,
            vScroll: false,
            hScroll: true,
            onScrollMove: function() {
                ARGO.options.canClick = 0;
            },
            onScrollEnd: function() {
                ARGO.options.canClick = 1;
            }
        });
        return scrollerH
    },
    swipe: function(action) {
        this.options.dom.stage.swipe(action);
    },
    animBlock: function(typeAnimation, animatedElm) {
        var TDuration = parseInt(animatedElm.find("[data-animation-type-tap]").attr("data-duration-tap")),
            Tdelay = parseInt(animatedElm.find("[data-animation-type-tap]").attr("data-delay-tap"));

        if (animatedElm.find(".sl-block-content").attr("data-animation-type-tap") != "fade-out-edit-tap") {
            animatedElm.find(".sl-block-content").css('opacity', '1');
        }

        if (typeAnimation != undefined) {
            if (typeAnimation == "fade-in-tap") {
                animatedElm.find("[data-animation-type-tap]").hide();
                animatedElm.find("[data-animation-type-tap]").delay(Tdelay).fadeIn(TDuration);
            } else if (typeAnimation == "fade-out-edit-tap") {
                animatedElm.find("[data-animation-type-tap]").css('opacity', '1').css('display', 'block');
                animatedElm.find("[data-animation-type-tap]").delay(Tdelay).fadeOut(TDuration);

                setTimeout(function () {
                    animatedElm.find("[data-animation-type-tap]").delay(Tdelay).css('opacity', '0').css('display', 'block');
                }, Tdelay + 1000);

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
                animatedElm.css("transform"," scale(0)").css("transition", "all 0s");
                setTimeout(function () {
                    var TDurationS = TDuration/1000;
                    animatedElm.css("transform"," scale(1)").css("transition", "all "+TDurationS+"s");
                }, Tdelay);
            } else if (typeAnimation == "scale-down-tap") {
                animatedElm.css("transform"," scale(1.7)").css("transition", "all 0s");
                setTimeout(function () {
                    var TDurationS = TDuration/1000;
                    animatedElm.css("transform"," scale(1)").css("transition", "all "+TDurationS+"s");
                }, Tdelay);
            }
        }
    },
    hideAnimBlock: function(typeAnimation, toBeHiddenElm) {
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
    customizeMenuScroll: function() {
        var childsZipWidthSum = 0,
            childsSubmenuZipWidthSum = 0,
            _this = this;
        if (_this.options.scrollerHMenuScroll.length > 0) {
            _this.options.scrollerHMenuScroll = [];
        }

        setTimeout(function() {

            $("#scrollmenu").css({
                "width": "auto",
                "white-space": "nowrap"
            });
            $(".hide-menu").css({
                "display": "block"
            });
            $("#scrollmenu").find("#scroller").css("width", "auto");
            $("#scrollmenu a").each(function(index, elm) {
                //childsZipWidthSum += $(this).outerWidth(true);
                childsZipWidthSum += $(this).outerWidth();
            });

            $("#scrollmenu").css({
                "width": "782px",
                "white-space": "nowrap"
            });
            $(".hide-menu").css({
                "display": ""
            });
            $("#scrollmenu").find("#scroller").css("width", childsZipWidthSum + 50);

            _this.options.scrollerHMenuScroll.push(_this.scrollerH('scrollmenu'));

            $(".scrollmenu1").each(function(index, elm) {

                childsSubmenuZipWidthSum = 0;

                $(this).parent(".subMenu").css({
                    "display": "block",
                    "visibility": "hidden"
                });
                $(this).css({
                    "width": "auto",
                    "white-space": "nowrap"
                });
                $(this).find(".scroller1").css("width", "auto");

                $(this).find(".scroller1 a").each(function(index, elm) {
                    childsSubmenuZipWidthSum += $(this).outerWidth(true);
                });
                $(this).parent(".subMenu").css({
                    /*"display": "none",*/
                    "display": "",
                    "visibility": "visible"
                });
                if($(this).hasClass('fullWidthSubmenu')){
                    $(this).css({
                        "width": "1024px",
                        "white-space": "nowrap"
                    });
                }else{
                    $(this).css({
                        "width": "450px",
                        "white-space": "nowrap"
                    });
                }
                $(this).find(".scroller1").css("width", childsSubmenuZipWidthSum + 25);

                $(this).attr("id", "scrollmenu-" + index);
                _this.options.scrollerHMenuScroll.push(_this.scrollerH("scrollmenu-" + index));
            });
        }, 1000);

        setTimeout(function() {
            _this.scrollerH('scrollmenu');
            $(".scrollmenu1").each(function(index, elm) {
                $(this).attr("id", "scrollmenu-" + index);
                _this.scrollerH("scrollmenu-" + index);
            });
        }, 150);
    }
};

document.addEventListener("DOMContentLoaded", function() {
    ARGO = Object.create(app.stage);
    ARGO._construct_();
});
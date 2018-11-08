
/* Scroll menu setting */
    var scrollHMenuElm,
    scrollHMenuElmTab = [],
    scrollHMenuElmIdTab = [],
    childsPreviewWidthSum = 0,
    cloneSubmenuUL = [];
    function setIdToMenuPreview(){
        /* Set IDs to menus */
        scrollHMenuElm = jQuery(".menu, .wrapper-submenu"),
        scrollHMenuElmIdTab = [];
        scrollHMenuElm.each(function(index, elm){
            var submenu = $(this),
                menuScroll = $("#wrapperMenuScroll");

            if(submenu.is(".menu")){
                scrollHMenuElmIdTab[index] = "menu_" + menuScroll.find(".current").attr("data-item") + "_" + menuScroll.find(".current").attr("data-slide-h") + "_" + menuScroll.find(".current").attr("data-slide-v");
            }
            else{
                scrollHMenuElmIdTab[index] = "submenu_" + menuScroll.find(".current").attr("data-item") + "_" + menuScroll.find(".current").attr("data-slide-h") + "_" + menuScroll.find(".current").attr("data-slide-v");
            }
            submenu.attr("id", scrollHMenuElmIdTab[index]);
        });
    }
    function setScrollToMenuPreview() {
        /* Scroll menu setting */
        setIdToMenuPreview();

        if(scrollHMenuElmTab.length != 0 && scrollHMenuElmTab != undefined && scrollHMenuElmTab != null){
            scrollHMenuElmTab = [];
        }
        childsPreviewWidthSum = 0;
        //console.log(scrollHMenuElm.length);
        for (i = 0; i < scrollHMenuElm.length; i++) {
            //console.log("scrollHMenuElm " + scrollHMenuElm.eq(i).attr("id"));
            var idScroll = scrollHMenuElm.eq(i).attr("id");
            scrollHMenuElmIdTab[i] = idScroll;
            //console.log(idScroll + " / " + scrollHMenuElmIdTab[i]);
            childsPreviewWidthSum = 0;
            jQuery(".slides #" + scrollHMenuElmIdTab[i]).promise().done(function () {
                var oldDisplayPreviewStack = jQuery(".slides #" + scrollHMenuElmIdTab[i]).parents("section.stack").css("display"),
                        oldDisplayPreview = jQuery(".slides #" + scrollHMenuElmIdTab[i]).parents("section").not(".stack").css("display");
                if (jQuery(".slides #" + scrollHMenuElmIdTab[i]).is(".menu")) {
                    jQuery(".slides #" + scrollHMenuElmIdTab[i]).css({
                        "width": "auto",
                        "white-space": "nowrap"
                    });
                    $(".slides #" + scrollHMenuElmIdTab[i]).find(".maxMenu").css("width", "auto");
                    //childsPreviewWidthSum = $(this).outerWidth(true);
                    $(this).find("ul li").each(function (index, elm) {
                        if(index != 0){
                            childsPreviewWidthSum += $(elm).outerWidth(true);
                        }
                    });
                }
                else if (jQuery(".slides #" + scrollHMenuElmIdTab[i]).is(".wrapper-submenu")) {
                    jQuery(".slides #" + scrollHMenuElmIdTab[i]).css({
                        "width": "auto",
                        "white-space": "nowrap"
                    });
                    jQuery(".slides #" + scrollHMenuElmIdTab[i] + " ul.has-levelSecond").css({
                        "display": "block"
                    });
                    jQuery(".slides #" + scrollHMenuElmIdTab[i] + " > div:first-child").css("width", "auto");
                    $(this).find("ul.has-levelSecond li").each(function (index, elm) {
                        childsPreviewWidthSum += $(elm).outerWidth(true);
                    });
                }


                //console.log("Load: #" + scrollHMenuElmIdTab[i] + " / childsPreviewWidthSum: " + childsPreviewWidthSum);

                if (jQuery(".slides #" + scrollHMenuElmIdTab[i]).is(".menu") && typeof(TWIG) !== 'undefined') {
                    jQuery(".slides #" + scrollHMenuElmIdTab[i]).css({
                        "width": TWIG.plateform == "veeva" ? "735px" : "782px",
                        "white-space": "normal"
                    });
                    if(TWIG.plateform == "veeva"){
                        jQuery(".slides #" + scrollHMenuElmIdTab[i]).find(".maxMenu").css("width", childsPreviewWidthSum <= 735 ? "735px" : childsPreviewWidthSum + 50);
                    }
                    else{
                        jQuery(".slides #" + scrollHMenuElmIdTab[i]).find(".maxMenu").css("width", childsPreviewWidthSum <= 782 ? "782px" : childsPreviewWidthSum + 50);
                    }
                }
                else if (jQuery(".slides #" + scrollHMenuElmIdTab[i]).is(".wrapper-submenu")) {
                    if ($(this).hasClass('fullWidthSubmenu')) {
                        jQuery(".slides #" + scrollHMenuElmIdTab[i]).css({
                            "width": "1024px"
                        });
                    } else {
                        jQuery(".slides #" + scrollHMenuElmIdTab[i]).css({
                            "width": "450px"/*,
                             "white-space": "normal"*/
                        });
                    }

                    jQuery(".slides #" + scrollHMenuElmIdTab[i] + " ul").each(function (index, elm) {
                        if ($(this).is(".has-levelSecond") == false) {
                            $(this).css({
                                "display": "none"
                            });
                        }
                    });
                    jQuery(".slides #" + scrollHMenuElmIdTab[i] + " > div:first-child").css("width", childsPreviewWidthSum + 20);
                }
            });

            var presParam;
            try{
                presParam = jsonParam;
            }
            catch(e){
                presParam = data.settings;
            }
            if(presParam.dataDisableScroll != true && presParam.dataDisableScroll != "true"){
                scrollHMenuElmTab[i] = new iScroll(idScroll, {
                    scrollbarClass: "scroll",
                    hideScrollbar: true,
                    checkDOMChange: true,
                    checkDOMChanges: true,
                    vScroll: false,
                    hScroll: true,
                });
            }
        }
        /* End scroll menu setting */
        //console.log(scrollHMenuElmTab);
    }

function updateCreatedMenu() {
    cloneSubmenuUL = [];
    var section = null;
    createMenu(section, Reveal.getState().indexh, Reveal.getState().indexv);

    setTimeout(function () {
        setScrollToMenuPreview();
    }, 400);
}

function generateItem(currentSection, currentH, currentV, type, section, i, h, v, chapterName, nextCurrentIndexV) {
    h = h + 1;
    var currentIndex = 0;
    var currentIndexV = 0;
    var className = "";
    var currentTitle = $(Reveal.getCurrentSlide()).attr("data-screen-name");
    var title = $(section).attr("data-screen-name");
    var currentChapter = $(Reveal.getCurrentSlide()).attr("data-chapter-name");
    var dataID = $(section).attr("data-id");
    //console.log("currentChapter: " + currentChapter);
    //console.log(chapterName);

    if (v != undefined) {
        if (v != 0 && type == 'slide-menu-item-vertical') {
            currentIndexV = v;
        }
    }
    if (chapterName != undefined && chapterName != "") {
        /*
         console.log("Chapter name: " + chapterName + "******** / ******** " + chapterName + " Title: " + title + "******** / ******** Type: " + type);
         console.log(section);
         console.log("_______________________________________" + title + " / " + currentTitle);
         console.log(currentSection);
         */
        title = type == "slide-menu-item-vertical" ? (title == "" || title == undefined ? "Slide " + h + "." + 1 : title) : chapterName;
    }
    else {
        if (title == "" || title == undefined) {
            title = "Slide " + h + (currentIndexV != 0 ? "." + (nextCurrentIndexV != undefined && nextCurrentIndexV != "" && nextCurrentIndexV == true ? currentIndexV + 1 : currentIndexV) : "");
        }
    }

    if (currentChapter != undefined && currentChapter != "") {
        if (type == "slide-menu-item-vertical") {
            currentIndex = currentH + 1;
            currentIndexV = currentV;

            currentTitle = currentTitle == "" || currentTitle == undefined ? "Slide " + currentIndex + "." + 1 : currentTitle;
        }
        else {
            currentTitle = currentChapter;
        }
    }
    else {
        if (currentTitle == "" || currentTitle == undefined) {

            currentIndex = currentH + 1;
            currentIndexV = currentV;

            currentTitle = "Slide " + currentIndex + (currentIndexV != 0 ? "." + (nextCurrentIndexV != undefined && nextCurrentIndexV != "" && nextCurrentIndexV == true ? currentIndexV + 1 : currentIndexV) : "");
        }
    }
    /*
     console.log("_______________________________________" + title + " / " + currentTitle);
     console.log("_______________________________________" + chapterName + " / " + currentChapter);
     */
    var state = Reveal.getState();
    if (currentTitle == title) {
        className = " current";
    }
    //console.log(className);
    title = '<a href="" class="clickMenu"><span class="slide-menu-item-title">' + title + '</span><a/>';

    /*if(v === 0){
     return  '<li class="menu-level1 ' + type + className +'" data-item="' + i + '" data-slide-h="' + h +  '"data-slide-v="' + v +  '">'+ title + '<ul class="sousMenu-'+ h +'"></ul></li>';
     }else{

     return '<li class="menu-level2 ' + type + className +'" data-item="' + i + '" data-slide-h="' + h +  '"data-slide-v="' + v +  '">' + title + '</li>';
     }*/

    if (v === 0) {
        if ($("#wrapperMenuScroll").find('.wrapper-submenu .sousMenu-' + h).length == 0) {
            $("#wrapperMenuScroll").find('.wrapper-submenu > div').append('<ul class="sousMenu-' + h + '"></ul>');
        }
        return chapterName != "" && chapterName != undefined && type == "slide-menu-item-vertical" ? '<li class="menu-level2 ' + type + className + '" data-item="' + i + '" data-slide-h="' + h + '"data-slide-v="' + v + '">' + title + '</li>' : '<li class="menu-level1 ' + type + className + '" data-item="' + i + '" data-section-id="'+ dataID +'"  data-slide-h="' + h + '"data-slide-v="' + v + '">' + title + '</li>';
    } else {
        return '<li class="menu-level2 ' + type + className + '" data-item="' + i + '" data-section-id="'+ dataID +'" data-slide-h="' + h + '"data-slide-v="' + v + '">' + title + '</li>';
    }
}

function createMenu(currentSection, currentH, currentV) {
    if ($('#wrapperMenuScroll').length == 0) {
        $("<div id='wrapperMenuScroll'><div class='link-to-home' data-item='1' data-slide-h='1' data-slide-v='0'><a href='' class='clickMenu'></a></div><div class='wrapper-submenu'><div></div></div><div class='menu' style='display:block;' ><ul class='maxMenu'></ul></div><div class='logoEADV'></div><a href='#' class='ref-link'><i class='fa fa-stack-exchange'></i></a><a href='#' class='rcp-link-eadv'><i class='fa fa-rcp'></i></a></div>").prependTo($(".slides"))
    }
    $('.menu > .maxMenu').html('');
    var items = $('.menu > .maxMenu');
    var slideCount = 1;
    var start = false;
    var nextCurrentIndexV = false;
    var tabForSubmenu
    $('.slides > section').each(function (h, section) {
        var cptSousMenu = h + 1;
        $(".sousMenu-" + cptSousMenu).html('');
        var chapter = $(section).is(".stack") ? $(section).find("section").eq(0).attr("data-chapter-name") : $(section).attr("data-chapter-name");
        var subsections = $('section', section);
        tabForSubmenu = '<ul class="sousMenu-' + cptSousMenu + '">';
        //console.log(chapter);
        if (subsections.length > 0) {
            if (chapter != "" && chapter != undefined) {
                nextCurrentIndexV = true;
                var item2 = generateItem(currentSection, currentH, 0, 'slide-menu-item-vertical', $(section).is(".stack") ? $(section).find("section").first() : section, slideCount, h, 0, chapter);
                var cpt = h + 1;
                $("#wrapperMenuScroll").find('.sousMenu-' + cpt).append(item2);
                tabForSubmenu += item2;
                $('.menu-level2.slide-menu-item-vertical.current').parent('ul[class^=sousMenu-]').addClass('has-levelSecond');
            }
            else {
                nextCurrentIndexV = false;
            }
            subsections.each(function (v, subsection) {
                var type = (v === 0 ? 'slide-menu-item' : 'slide-menu-item-vertical');

                if (v != 0) {
                    //console.log("sub: " + slideCount);
                    var item = nextCurrentIndexV != undefined && nextCurrentIndexV != "" && nextCurrentIndexV == true ? generateItem(currentSection, currentH, currentV, type, subsection, slideCount, h, v, "", nextCurrentIndexV) : generateItem(currentSection, currentH, currentV, type, subsection, slideCount, h, v);
                    slideCount++;
                    var cpt = h + 1;
                    $("#wrapperMenuScroll").find('.sousMenu-' + cpt).append(item);
                    tabForSubmenu += item;
                    $('.menu-level2.slide-menu-item-vertical.current').parent('ul[class^=sousMenu-]').addClass('has-levelSecond');
                }
                else {
                    //console.log("menu: " + slideCount);
                    var item = chapter == "" || chapter == undefined ? generateItem(currentSection, currentH, currentV, type, subsection, slideCount, h, v) : generateItem(currentSection, currentH, currentV, type, subsection, slideCount, h, v, chapter);
                    if (chapter == "" || chapter == undefined) {
                        //console.log("chapppp");
                    }
                    slideCount++;
                    items.append(item);
                    var currentItemH = $("#wrapperMenuScroll").find('.menu-level1.slide-menu-item.current');
                    $("#wrapperMenuScroll").find('.sousMenu-' + currentItemH.attr("data-slide-h")).addClass('has-levelSecond');
                }
            });
        } else {
            if (chapter == "" || chapter == undefined) {
                //console.log("When chapter is NOT defined");
                var item = generateItem(currentSection, currentH, 0, 'slide-menu-item', section, slideCount, h, 0);
                //slideCount++;
                items.append(item);
            }
            else {
                //console.log("When chapter is defined");
                var item1 = generateItem(currentSection, currentH, 0, 'slide-menu-item', section, slideCount, h, 0, chapter);


                //slideCount++;

                var item2 = generateItem(currentSection, currentH, 0, 'slide-menu-item-vertical', $(section).is(".stack") ? $(section).find("section").first() : section, slideCount, h, 0, chapter);

                //slideCount++;
                var cpt = h + 1;
                items.append(item1);
                $("#wrapperMenuScroll").find('.sousMenu-' + cpt).append(item2);
                tabForSubmenu += item2;
                $('.menu-level2.slide-menu-item-vertical.current').parent('ul[class^=sousMenu-]').addClass('has-levelSecond');
            }
            slideCount++;
            //console.log("slideCount: " + slideCount);
        }
        tabForSubmenu += '</ul>';
        //console.log("tabForSubmenu: " + tabForSubmenu);
        cloneSubmenuUL.push(tabForSubmenu);
    });
    //console.log(TWIG.cloneSubmenuUL.length);
}

function InitMenuPreview() {
    if(!$(Reveal.getCurrentSlide()).attr('popin-page')){
        if ($(Reveal.getCurrentSlide()).attr("data-custom-navbar-appearance") == undefined || $(Reveal.getCurrentSlide()).attr("data-custom-navbar-appearance") == "") {
            $(".hide-menu").each(function (index, elm) {
                if ($(this).is(".hide-menu")) {
                    $(this).removeClass("hide-menu");
                }
            });
        }
        else if ($(Reveal.getCurrentSlide()).attr("data-custom-navbar-appearance") != undefined && $(Reveal.getCurrentSlide()).attr("data-custom-navbar-appearance") != "") {
            switch ($(Reveal.getCurrentSlide()).attr("data-custom-navbar-appearance")) {

                case "standard":
                    $(".hide-menu").each(function (index, elm) {
                        if ($(this).is(".hide-menu")) {
                            $(this).removeClass("hide-menu");
                        }
                    });

                    break;
                case "Hide-all":
                    $("#wrapperMenuScroll, .wrapper-submenu, .menu").addClass("hide-menu");
                    break;
                case "Hide-chapters":
                    $("#wrapperMenuScroll").is(".hide-menu") ? $("#wrapperMenuScroll").removeClass("hide-menu") : null;
                    $(".menu").is(".hide-menu") == false ? $(".menu").addClass("hide-menu") : null;
                    $(".wrapper-submenu").is(".hide-menu") == false ? $(".wrapper-submenu").addClass("hide-menu") : null;
                    break;
            }
        }
        else {
            $(Reveal.getCurrentSlide()).find(".hide-menu").each(function (index, elm) {

                if ($(this).is(".hide-menu")) {
                    $(this).removeClass("hide-menu");
                }
            });
        }
    }
}
function renderMenuParams(){
    //console.log(jsonParam);
    var presParam;
    try{
        presParam = jsonParam;
    }
    catch(e){
        presParam = data.settings;
    }
    //Icone home
    $(".slides #wrapperMenuScroll .link-to-home").css({
        "background-image": presParam.dataLogoHomeUrl != "" && presParam.dataLogoHomeUrl !== undefined ? "url(" + presParam.dataLogoHomeUrl + ")" : "url(/img/picto-home.png)"
    });

    //Icone reference
    if (presParam.dataLogoRefrsUrl != undefined && presParam.dataLogoRefrsUrl != "") {
        $(".slides .ref-link").empty().append("<img src='" + presParam.dataLogoRefrsUrl + "' alt='' />");
        $('.logo-ref-link').css({
            'background-image': "url('" + presParam.dataLogoRefrsUrl + "')",
            'display': 'block'
        });
        $('.logo-ref-link').show();
    } else {
        $(".slides .ref-link").empty().append('<i class="fa fa-stack-exchange"></i>')
    }

    // Icone rcp
    if (presParam.dataLogoRcpUrl != undefined && presParam.dataLogoRcpUrl != "") {
        $(".slides .rcp-link-eadv").empty().append("<img src='" + presParam.dataLogoRcpUrl + "' alt='' />");
    } else {
        $(".slides .rcp-link-eadv").empty().append('<i class="fa fa-rcp"></i>')
    }

    // Logo EADV Rendering
    if (presParam.dataLogoPresUrl != "" && presParam.dataLogoPresUrl != undefined) {
        $('#wrapperMenuScroll .logoEADV').empty().append("<img src='" + presParam.dataLogoPresUrl + "' alt='' />");
    }

    //bgColor menu
    if (presParam.dataBgMenuColor != "" && presParam.dataBgMenuColor != undefined) {
        $(".slides #wrapperMenuScroll , .slides .wrapper-submenu").css("background-color", presParam.dataBgMenuColor);
    }

    //Menu Font type
    if (presParam.dataMenuFont != "" && presParam.dataMenuFont != undefined) {
        $(".slides .menu, .slides .wrapper-submenu ul").css("font-family", presParam.dataMenuFont);
    }

    //Menu Font Size
    $(".slides .menu, .slides .wrapper-submenu ul").css("font-size", (presParam.dataFontSizeSelect != "" ? presParam.dataFontSizeSelect : "15") + "px");

    //render fullWideSubmenu
    if (presParam.dataAllowSubmenuwidth == "true" || presParam.dataAllowSubmenuwidth == true) {
        $("#wrapperMenuScroll .wrapper-submenu").addClass("fullWidthSubmenu");
    } else {
        $("#wrapperMenuScroll .wrapper-submenu").removeClass("fullWidthSubmenu");
    }

    //render allowSubmenu
    if (presParam.dataAllowSubmenu == "true" || presParam.dataAllowSubmenu == true) {
        $("#wrapperMenuScroll .wrapper-submenu").removeClass("is-hidden");
    } else {
        $("#wrapperMenuScroll .wrapper-submenu").addClass("is-hidden");
    }
}
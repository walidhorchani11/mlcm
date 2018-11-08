'use strict';

export const controllerMenu = {
    init: function (e) {
        this.editor = e,
        this.slidesChanged = new signals.Signal,
        this.projector = $("#params_clm_edidtor"),
        this.generatedIdMenu = [],
        this.scrollHMenu = [],
        this.scrollHMenuTimeout = [],
        this.homeLink,
        this.cloneHomeLink,
        this.setup()
    },
    setup: function () {
        this.MenuListner();
    },
    navbarAppearance: function () {
          var $current_slide = SL.editor.controllers.Markup.getCurrentSlide(),
              $navbar_appearance = $current_slide.attr("data-custom-navbar-appearance");

          if ($navbar_appearance == undefined || $navbar_appearance == "") {
              $(".hide-menu").each(function (index, elm) {
                  var $this = $(this);
                  if ($this.is(".hide-menu")) {
                      $this.removeClass("hide-menu");
                  }
              });
          }
          else{
              this.updateNavbarAppearance($navbar_appearance);
          }
          if ($navbar_appearance != undefined && $navbar_appearance != "") {
              var optionVal = $navbar_appearance;
              $("#custom-navbar-appearance").val(optionVal).change();
          } else {
              $("#custom-navbar-appearance").val("standard").change();
          }
    },
    updateNavbarAppearance: function(navbar_appearance){
        if(navbar_appearance != undefined){
            switch (navbar_appearance) {
                case "standard":
                    $(".hide-menu").each(function (index, elm) {
                        var $this = $(this);
                        if ($this.is(".hide-menu")) {
                            $this.removeClass("hide-menu");
                        }
                    });
                    break;
                case "Hide-all":
                    $("#wrapperMenuScroll, .wrapper-submenu, .menu").addClass("hide-menu");
                    break;
                case "Hide-chapters":
                    var $wrapperMenuScroll = $("#wrapperMenuScroll"),
                        $menu = $(".menu"),
                        $wrappersubmenu = $(".wrapper-submenu");
                    $wrapperMenuScroll.is(".hide-menu") ? $wrapperMenuScroll.removeClass("hide-menu") : null;
                    $menu.is(".hide-menu") == false ? $menu.addClass("hide-menu") : null;
                    $wrappersubmenu.is(".hide-menu") == false ? $wrappersubmenu.addClass("hide-menu") : null;
                    break;
            }
        }
    },
    scrollToMenuElm:function(){
        var $this = this,
            $slides = $(".slides");
            //console.log("---------------------scroll length: " + $this.scrollHMenu.length + " ------ disableScroll: " + SL.editor.controllers.Appearence.disableScroll);
            $("#get-all-ul .current").removeClass("current");
            if($slides.find("#wrapperMenuScroll .current").length == 1){
                var clickMenuIndex = $slides.find(".current").index(),
                    clickMenuScreenId = $slides.find(".menu .current").length > 0 ? $slides.find(".menu").attr("id") : $slides.find(".wrapper-submenu").attr("id"),
                    clickMenuScreenIndexof = $this.generatedIdMenu.indexOf(clickMenuScreenId);

                $("#" + clickMenuScreenId).promise().done(function(){
                    setTimeout(function(){
                        if(SL.editor.controllers.Appearence.disableScroll != true && SL.editor.controllers.Appearence.disableScroll != "true" && $this.scrollHMenu.length > 0){
                            $this.scrollHMenu[clickMenuScreenIndexof].scrollToElement('li:nth-child(' + (clickMenuIndex + 1) + ')', 1000);
                        }
                    }, 300);
                });
            } else{
                var clickMenuIndex = new Array();
                clickMenuIndex.push($slides.find(".menu .current").index());
                clickMenuIndex.push($(".slides .wrapper-submenu ul.has-levelSecond li").index($("li.current")));

                var clickMenuScreenId = new Array();
                clickMenuScreenId.push($slides.find(".menu").attr("id"));
                clickMenuScreenId.push($slides.find(".wrapper-submenu").attr("id"));

                var clickMenuScreenIndexof = new Array();
                clickMenuScreenIndexof.push($this.generatedIdMenu.indexOf(clickMenuScreenId[0]));
                clickMenuScreenIndexof.push($this.generatedIdMenu.indexOf(clickMenuScreenId[1]));

                $("#" + clickMenuScreenId[0] + ", #" + clickMenuScreenId[1]).promise().done(function(){
                    setTimeout(function(){
                        if(SL.editor.controllers.Appearence.disableScroll != true && SL.editor.controllers.Appearence.disableScroll != "true" && $this.scrollHMenu.length > 0){
                            $this.scrollHMenu[1].scrollToElement('li:nth-child(' + (clickMenuIndex[0] + 1) + ')', 1000);
                            $this.scrollHMenu[0].scrollToElement('li:nth-child(' + (clickMenuIndex[1] + 1) + ')', 1000);
                        }
                    }, 300);
                });
            }
    },
    setScrollToMenu: function (){
    /* Set scroll to menus */
    var $this = this;
    $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu").each(function(index, elm){
        var $submenu = $(this),
            $menuScroll = $("#wrapperMenuScroll");

        if($submenu.is(".menu")){
            $this.generatedIdMenu[index] = "menu_" + $menuScroll.find(".current").attr("data-item") + "_" + $menuScroll.find(".current").attr("data-slide-h") + "_" + $menuScroll.find(".current").attr("data-slide-v");
        }
        else{
            $this.generatedIdMenu[index] = "submenu_" + $menuScroll.find(".current").attr("data-item") + "_" + $menuScroll.find(".current").attr("data-slide-h") + "_" + $menuScroll.find(".current").attr("data-slide-v");
        }
        $submenu.attr("id", $this.generatedIdMenu[index]);
    });

    if($this.scrollHMenu.length != 0 && $this.scrollHMenu != undefined && $this.scrollHMenu != null){
        if(SL.editor.controllers.Appearence.disableScroll != true && SL.editor.controllers.Appearence.disableScroll != "true"){
            $this.scrollHMenu = [];
        }
    }

    var childsWidthSum = 0;
    for(var key in $this.generatedIdMenu){
        childsWidthSum = 0;
        var $editPresSlides = $(".edit-pres-wrap .slides #" + $this.generatedIdMenu[key]);
        $editPresSlides.promise().done(function(){
            var oldDisplayStack = $editPresSlides.parents("section.stack").css("display"),
                oldDisplay = $editPresSlides.parents("section").not(".stack").css("display");

            if($editPresSlides.is(".menu")){
                $editPresSlides.css({
                    "width": "auto",
                    "white-space": "nowrap"
                });
                $editPresSlides.find(".maxMenu").css("width", "auto");
                $(this).find("ul li").each(function (index, elm) {
                    if(index != 0){
                        childsWidthSum += $(elm).outerWidth(true);
                    }
                });
            }
            else if($editPresSlides.is(".wrapper-submenu")){
                $editPresSlides.css({
                    "width": "auto",
                    "white-space": "nowrap"
                });
                $(".edit-pres-wrap .slides #" + $this.generatedIdMenu[key] + " ul.has-levelSecond").css({
                    "display": "block"
                });
                $(".edit-pres-wrap .slides #" + $this.generatedIdMenu[key] + " > div:first-child").css("width", "auto");
                $(this).find("ul.has-levelSecond li").each(function(index, elm){
                    childsWidthSum += $(this).outerWidth(true);
                });
            }

            if($editPresSlides.is(".menu")){
                $editPresSlides.css({
                    "width": "782px",
                    "white-space": "normal"
                });
                if(childsWidthSum < 782){
                    $editPresSlides.find(".maxMenu").css("width", 782);
                }
                else{
                    $editPresSlides.find(".maxMenu").css("width", childsWidthSum + 50);
                }
            }
            else if($editPresSlides.is(".wrapper-submenu")){
                $editPresSlides.css({
                    "width": "450px"/*,
                     "white-space": "normal"*/
                });
                $(".edit-pres-wrap .slides #" + $this.generatedIdMenu[key] + " ul").each(function(index, elm){
                    var $this = $(this);
                    if($this.is(".has-levelSecond") == false){
                        $this.css({
                            "display": "none"
                        });
                    }
                });
                $(".edit-pres-wrap .slides #" + $this.generatedIdMenu[key] + " > div:first-child").css("width", childsWidthSum + 20);
            }
        });

        if(SL.editor.controllers.Appearence.disableScroll != true && SL.editor.controllers.Appearence.disableScroll != "true"){
            $this.scrollHMenu[key] = new iScroll($this.generatedIdMenu[key], {
                scrollbarClass: "scroll",
                hideScrollbar: true,
                checkDOMChange: true,
                checkDOMChanges: true,
                vScroll: false,
                hScroll: true
            });
        }
        else{
            for(var key in $this.scrollHMenu){
                $this.scrollHMenu[key].destroy();
            }
            $this.scrollHMenu = [];
        }
    }
},
    updateCreatedMenu:function (updateOnlyScroll){
    var $this = this;
    if(updateOnlyScroll != true || updateOnlyScroll == undefined){
        TWIG.cloneSubmenuUL = [];

        var section=null;
        $this.createMenu(section,Reveal.getState().indexh,Reveal.getState().indexv);
        $(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child");

        if ($('.link-to-home').length == 0) {

            $(".edit-pres-wrap .slides #wrapperMenuScroll").prepend("<div class='link-to-home'><a href='' class='clickMenu'></a></div>");
            $this.homeLink = $(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item:first-child");
            $this.cloneHomeLink = $(".edit-pres-wrap .slides #wrapperMenuScroll .link-to-home");
            $this.cloneHomeLink.attr("data-item", $this.homeLink.attr("data-item"));
            $this.cloneHomeLink.attr("data-slide-h", $this.homeLink.attr("data-slide-h"));
            $this.cloneHomeLink.attr("data-slide-v", $this.homeLink.attr("data-slide-v"));
        }
    }
    setTimeout(function(){
        $this.setScrollToMenu();
        $this.scrollToMenuElm();
    }, 50);

},
    generateItem:function(currentSection,currentH,currentV, type, section, i, h, v, chapterName, nextCurrentIndexV) {
    h = h+1;
    var currentIndex =0;
    var currentIndexV =0;
    var className = "";
    var currentTitle = $(Reveal.getCurrentSlide()).attr("data-screen-name");
    var title = $(section).attr("data-screen-name");
    var currentChapter =$(Reveal.getCurrentSlide()).attr("data-chapter-name");

    if(v != undefined){
        if (v !=0 && type == 'slide-menu-item-vertical'){
            currentIndexV = v;
        }
    }
    if(chapterName != undefined && chapterName != ""){

        title = type == "slide-menu-item-vertical" ? (title == "" || title == undefined ? "Slide " + h + "."+1: title) : chapterName;
    }
    else{
        if(title == "" || title == undefined){
            title = "Slide " + h + (currentIndexV != 0 ? "."+(nextCurrentIndexV != undefined && nextCurrentIndexV != "" && nextCurrentIndexV == true ? currentIndexV+1 : currentIndexV) : "");
        }
    }

    if(currentChapter != undefined && currentChapter != ""){
        if(type == "slide-menu-item-vertical"){
            currentIndex = currentH + 1;
            currentIndexV = currentV;

            currentTitle = currentTitle == "" || currentTitle == undefined ? "Slide " + currentIndex  + "."+1 : currentTitle;
        }
        else{
            currentTitle = currentChapter;
        }
    }
    else{
        if(currentTitle == "" || currentTitle == undefined){

            currentIndex = currentH + 1;
            currentIndexV = currentV;

            currentTitle = "Slide " + currentIndex  + (currentIndexV != 0 ? "."+(nextCurrentIndexV != undefined && nextCurrentIndexV != "" && nextCurrentIndexV == true ? currentIndexV+1 : currentIndexV) : "") ;
        }
    }


    var state = Reveal.getState();
    if(currentTitle == title ){
        className = " current";
    }
    title = '<a style="color: ' + SL.editor.controllers.Menu.generateMenuItemColor() + ';" href="" class="clickMenu"><span class="slide-menu-item-title">' + title + '</span><a/>';



    if(v === 0){
        var $menuscrool =$("#wrapperMenuScroll");
        if($menuscrool.find('.wrapper-submenu .sousMenu-' + h).length == 0){
            $menuscrool.find('.wrapper-submenu > div').append('<ul class="sousMenu-' + h + '"></ul>');
        }
        return chapterName != "" && chapterName != undefined && type == "slide-menu-item-vertical" ? '<li class="menu-level2 ' + type + className +'" data-item="' + i + '" data-slide-h="' + h +  '"data-slide-v="' + v +  '">' + title + '</li>' : '<li class="menu-level1 ' + type + className +'" data-item="' + i + '" data-slide-h="' + h +  '"data-slide-v="' + v +  '">'+ title + '</li>';
    }else{
        return '<li class="menu-level2 ' + type + className +'" data-item="' + i + '" data-slide-h="' + h +  '"data-slide-v="' + v +  '">' + title + '</li>';
    }
},
    createMenu:function(currentSection,currentH,currentV){
    var $this = this;
    if ($('#wrapperMenuScroll').length == 0) {
        $("<div id='wrapperMenuScroll'><div id='get-all-ul' style='display:none;'></div><div class='wrapper-submenu is-hidden'><div></div></div><div class='menu' style='display:block;' ><ul class='maxMenu'></ul></div><div class='logoEADV'></div><a href='#' class='ref-link'><i class='fa fa-stack-exchange'></i></a><a href='#' class='rcp-link-eadv'><i class='fa fa-rcp'></i></a></div>").prependTo($(".slides"))
    }
    $('.menu > .maxMenu').html('');
    var items = $('.menu > .maxMenu');
    var slideCount = 1;
    var start = false;
    var nextCurrentIndexV = false;
    var tabForSubmenu
    $('.slides > section').each(function(h,section) {
        var  cptSousMenu = h+1;
        $(".sousMenu-"+cptSousMenu).html('');
        var chapter = $(section).is(".stack") ? $(section).find("section").eq(0).attr("data-chapter-name") : $(section).attr("data-chapter-name");
        var subsections = $('section', section);
        tabForSubmenu = '<ul class="sousMenu-' + cptSousMenu + '">';

        if (subsections.length > 0) {
            if(chapter != "" && chapter != undefined){
                nextCurrentIndexV = true;
                var item2 = $this.generateItem(currentSection,currentH,0, 'slide-menu-item-vertical',$(section).is(".stack") ? $(section).find("section").first() : section, slideCount, h,0, chapter);
                var cpt = h + 1;
                $("#wrapperMenuScroll").find('.sousMenu-' + cpt).append(item2);
                tabForSubmenu += item2;
                $('.menu-level2.slide-menu-item-vertical.current').parent('ul[class^=sousMenu-]').addClass('has-levelSecond');
            }
            else {
                nextCurrentIndexV = false;
            }
            subsections.each(function(v, subsection) {
                var type = (v === 0 ? 'slide-menu-item' : 'slide-menu-item-vertical');

                if(v != 0){
                    var item = nextCurrentIndexV != undefined && nextCurrentIndexV != "" && nextCurrentIndexV == true ? $this.generateItem(currentSection,currentH,currentV,type, subsection, slideCount, h, v, "", nextCurrentIndexV) : $this.generateItem(currentSection,currentH,currentV,type, subsection, slideCount, h, v);
                    slideCount++;
                    var cpt = h + 1;
                    $("#wrapperMenuScroll").find('.sousMenu-' + cpt).append(item);
                    tabForSubmenu += item;
                    $('.menu-level2.slide-menu-item-vertical.current').parent('ul[class^=sousMenu-]').addClass('has-levelSecond');
                }
                else{
                    var item = chapter == "" || chapter == undefined ? $this.generateItem(currentSection,currentH,currentV,type, subsection, slideCount, h, v) : $this.generateItem(currentSection,currentH,currentV,type, subsection, slideCount, h, v, chapter);
                    if(chapter == "" || chapter == undefined){
                    }
                    slideCount++;
                    items.append(item);
                    var currentItemH = $("#wrapperMenuScroll").find('.menu-level1.slide-menu-item.current');
                    $("#wrapperMenuScroll").find('.sousMenu-' + currentItemH.attr("data-slide-h")).addClass('has-levelSecond');
                }
            });
        } else {
            if(chapter == "" || chapter == undefined){
                var item = $this.generateItem(currentSection,currentH,0, 'slide-menu-item',section, slideCount, h,0);
                items.append(item);
            }
            else{
                var item1 = $this.generateItem(currentSection,currentH,0, 'slide-menu-item',section, slideCount, h,0, chapter);
                var item2 = $this.generateItem(currentSection,currentH,0, 'slide-menu-item-vertical',$(section).is(".stack") ? $(section).find("section").first() : section, slideCount, h,0, chapter);

                var cpt = h + 1;
                items.append(item1);
                $("#wrapperMenuScroll").find('.sousMenu-' + cpt).append(item2);
                tabForSubmenu += item2;
                $('.menu-level2.slide-menu-item-vertical.current').parent('ul[class^=sousMenu-]').addClass('has-levelSecond');
            }
            slideCount++;
        }
        tabForSubmenu += '</ul>';
        TWIG.cloneSubmenuUL.push(tabForSubmenu);
    });
        var $menuScroll = $("#wrapperMenuScroll");
        $menuScroll.find('.maxMenu li[data-slide-h=' + $menuScroll.find('.menu-level2.slide-menu-item-vertical.current').attr('data-slide-h') + ']').addClass('current');


},
    clickMenu : function(){
        $(document).off("click", ".clickMenu").on("click", ".clickMenu", function(e) {
            e.preventDefault();
            var  $menuScroll =  $(this).parent(),
              h = $menuScroll.attr('data-slide-h'),
              v = $menuScroll.attr('data-slide-v');
            Reveal.slide(h - 1, v);

        });

    },
    highlightActiveMenu: function(){
        var state = Reveal.getState();
        state.indexh++;
        $('li.slide-menu-item, li.slide-menu-item-vertical')
            .removeClass('current')
            .css('background-image', 'none');

        $('li.slide-menu-item, li.slide-menu-item-vertical').each(function(e) {

            var h = $(this).data('slide-h');
            var v = $(this).data('slide-v');
            $(".sousMenu-"+h).removeClass('has-levelSecond');
            // console.log(h + '----' + v);
            // console.log(state.indexh + '----' + state.indexv);

            if (h === state.indexh) {

                $(".wrapper-submenu ul").remove();
                //$(".wrapper-submenu > div:first-child").append(TWIG.cloneSubmenuUL[h - 1]);
                for(var key in TWIG.cloneSubmenuUL){
                    var submenuHtml = $(TWIG.cloneSubmenuUL[key]),
                    submenuA = submenuHtml.find("li a");
                    submenuA.css("color", SL.editor.controllers.Menu.generateMenuItemColor());
                    TWIG.cloneSubmenuUL[key] = submenuHtml[0].outerHTML;

                    if($(TWIG.cloneSubmenuUL[key]).is(".sousMenu-"+h) == true && $(this).is("li.slide-menu-item-vertical") == false){
                        $(".wrapper-submenu > div:first-child").append($(TWIG.cloneSubmenuUL[key]));
                        //console.log($(TWIG.cloneSubmenuUL[key]).attr("class") + " / " + "sousMenu-" + h + " / " + $(this).attr("class"));
                    }
                }
                if(v === state.indexv || (v == 0 && $(this).is(".slide-menu-item") == true)) {
                    $(this).addClass('current');
                }
                $(".sousMenu-" + h).find('li.slide-menu-item-vertical').each(function(index, elm){
                    $(this).removeClass('current');
                    if($(this).data('slide-v') === state.indexv){
                        $(this).addClass('current');
                    }
                });
                $(".sousMenu-"+h).addClass('has-levelSecond');

            }
        });
        SL.editor.controllers.Appearence.renderMenuParameters();
    },
    generateMenuItemColor: function(){
        var color;
        if (SL.editor.controllers.Appearence.menuColorItem != "" && SL.editor.controllers.Appearence.menuColorItem != undefined) {
            color = SL.editor.controllers.Appearence.menuColorItem;
        } else {
            color = "#fff";
        }
        return color
    },
    MenuListner: function () {
        this.clickMenu();
        Reveal.addEventListener( 'ready', function( event ) {
            this.navbarAppearance();
        }.bind(this));
    }
};

/* Menu creation functions UPDATE MENU*/
var projector = $("#params_clm_edidtor");
 /*   generatedIdMenu = [],
    scrollHMenu = [],
    scrollHMenuTimeout = [],
    homeLink,
    cloneHomeLink;*/
//console.log(scrollHMenuTimeout.length);

/*$('#save_pres').on('click', function () {
    console.log("save presentation");
    $('.projector .reveal-viewport .slides .BlockRef h3').each(function () {
        $(this).css({
            //"font-family": projector.attr("data-menu-font-title-ref") != "" && projector.attr("data-menu-font-title-ref") !== undefined  ? projector.attr("data-menu-font-title-ref") : "Montserrat",
            //"font-size": projector.attr('data-font-size-title-ref') != "" && projector.attr("data-font-size-title-ref") !== undefined  ? projector.attr('data-font-size-title-ref')+ 'px' : '20'
        });
    });
   /!* $('.projector .reveal-viewport .slides .BlockRef .wrapper-refs ').each(function () {
        $(this).css({
            "font-family": projector.attr("data-menu-font-title-ref") != "" && projector.attr("data-menu-font-title-ref") !== undefined  ? projector.attr("data-menu-font-title-ref") : "Montserrat",
            "font-size": projector.attr('data-font-size-title-ref-content') != "" && projector.attr("data-font-size-title-ref-content") !== undefined  ? projector.attr('data-font-size-title-ref')+ 'px' : '20'
        });
    });*!/
    //Reference Title
    var inputExist = $('#content-ref-title').length;
    var dataContent = projector.attr('data-title-ref-content');
    if(!(inputExist == null)){
        if(typeof dataContent == 'undefined' ||  dataContent == ""){
            document.getElementById('content-ref-title').value = 'Reference';
            $('.projector .reveal-viewport .slides .BlockRef h3').each(function () {
                $(this).html('Reference');
            })
        }else{
            document.getElementById('content-ref-title').value = projector.attr('data-');
            $('.projector .reveal-viewport .slides .BlockRef h3').each(function () {
                $(this).html(dataContent);
            });
            document.getElementById('content-ref-title').value = dataContent;
        }

    }
    $('.wrapper-refs .item-ref-wrapper .row-ref').each(function () {
        var color = $(this).find('.descRef').find('span').css('color');
        $(this).find('.codeRef').css('color' , color);
    });

});*/
/*
$(document).on({
    "click": function() {
        var __lenght =  $(".wrapper-submenu ul ").length ;
        if (__lenght > 1){
            console.log("lenght" + __lenght);
            setTimeout(function () {
                $(".wrapper-submenu  ul:not(first)").nextAll('ul').remove();
            },5);
        }
    },
    "change": function() {
        var __lenght =  $(".wrapper-submenu  ul ").length ;
        if (__lenght > 1){
            console.log("lenght" + __lenght);
            setTimeout(function () {
                $(".wrapper-submenu  ul:not(first)").nextAll('ul').remove();
            },5);

        }
    }
});*/

/*function setScrollToMenu (){
       console.log("setScrollToMenu");
    /!* Set scroll to menus *!/

    $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu").each(function(index, elm){
        if($(this).is(".menu")){
            generatedIdMenu[index] = "menu_" + $("#wrapperMenuScroll").find(".current").attr("data-item") + "_" + $("#wrapperMenuScroll").find(".current").attr("data-slide-h") + "_" + $("#wrapperMenuScroll").find(".current").attr("data-slide-v");
        }
        else{
            generatedIdMenu[index] = "submenu_" + $("#wrapperMenuScroll").find(".current").attr("data-item") + "_" + $("#wrapperMenuScroll").find(".current").attr("data-slide-h") + "_" + $("#wrapperMenuScroll").find(".current").attr("data-slide-v");
        }
        $(this).attr("id", generatedIdMenu[index]);
        //console.log("Current menu Id: " + $(this).attr("id"));
    });

    //console.log("Current menu Id: " + generatedIdMenu);
    if(scrollHMenu.length != 0 && scrollHMenu != undefined && scrollHMenu != null){
        scrollHMenu = [];
    }

    var childsWidthSum = 0;
    for(var key in generatedIdMenu){
        //console.log("//////////////////////////////// " + key + " / " + generatedIdMenu[key] + "//////////////////////////////// ");
        //console.log("scrollHMenu !");

        childsWidthSum = 0;
        $(".edit-pres-wrap .slides #" + generatedIdMenu[key]).promise().done(function(){
            var oldDisplayStack = $(".edit-pres-wrap .slides #" + generatedIdMenu[key]).parents("section.stack").css("display"),
                oldDisplay = $(".edit-pres-wrap .slides #" + generatedIdMenu[key]).parents("section").not(".stack").css("display");

            if($(".edit-pres-wrap .slides #" + generatedIdMenu[key]).is(".menu")){
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key]).css({
                    "width": "auto",
                    "white-space": "nowrap"
                });
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key]).find(".maxMenu").css("width", "auto");
                //childsWidthSum = $(this).outerWidth(true);
                $(this).find("ul li").each(function (index, elm) {
                    if(index != 0){
                        childsWidthSum += $(elm).outerWidth(true);
                    }
                });
            }
            else if($(".edit-pres-wrap .slides #" + generatedIdMenu[key]).is(".wrapper-submenu")){
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key]).css({
                    "width": "auto",
                    "white-space": "nowrap"
                });
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key] + " ul.has-levelSecond").css({
                    "display": "block"
                });
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key] + " > div:first-child").css("width", "auto");
                $(this).find("ul.has-levelSecond li").each(function(index, elm){
                    childsWidthSum += $(this).outerWidth(true);
                });
            }

            //console.log("Load: #" + generatedIdMenu[key] + " / childsWidthSum: " + childsWidthSum);

            if($(".edit-pres-wrap .slides #" + generatedIdMenu[key]).is(".menu")){
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key]).css({
                    "width": "782px",
                    "white-space": "normal"
                });
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key]).find(".maxMenu").css("width", childsWidthSum + 50);
            }
            else if($(".edit-pres-wrap .slides #" + generatedIdMenu[key]).is(".wrapper-submenu")){
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key]).css({
                    "width": "450px"/!*,
                    "white-space": "normal"*!/
                });
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key] + " ul").each(function(index, elm){
                    if($(this).is(".has-levelSecond") == false){
                        $(this).css({
                            "display": "none"
                        });
                    }
                });
                $(".edit-pres-wrap .slides #" + generatedIdMenu[key] + " > div:first-child").css("width", childsWidthSum + 20);
            }
        });
        /!*$(".edit-pres-wrap .slides #" + generatedIdMenu[key] + " li").each(function(index, elm){
         childsWidthSum += $(".edit-pres-wrap .slides #" + generatedIdMenu[key] + " li").eq(index).outerWidth(true);
         });*!/

        /!*if($(".edit-pres-wrap .slides #" + generatedIdMenu[key] + " .maxMenu").length > 0){
         setTimeout(function(){
         childsWidthSum = 0;
         for(var i=0; i < $(".edit-pres-wrap .slides #" + generatedIdMenu[key] + " .maxMenu li").length; i++){
         childsWidthSum += $(".edit-pres-wrap .slides #" + generatedIdMenu[key] + " li").eq(i).outerWidth(true);
         }
         console.log("key: " + key + " / childsWidthSum is: " + childsWidthSum + " / id: " + generatedIdMenu[key]);
         }, 1000);
         //alert("key: " + key + "childsWidthSum is: " + childsWidthSum + " / id: " + generatedIdMenu[key]);
         }*!/



        scrollHMenu[key] = new iScroll(generatedIdMenu[key], {
            scrollbarClass: "scroll",
            hideScrollbar: true,
            checkDOMChange: true,
            checkDOMChanges: true,
            vScroll: false,
            hScroll: true
        });/!**!/
    }
}

function updateCreatedMenu (updateOnlyScroll){
    console.log("updateCreatedMenu ");
    if(updateOnlyScroll != true || updateOnlyScroll == undefined){
        TWIG.cloneSubmenuUL = [];
      /!*  if ($('#wrapperMenuScroll').length == 0) {
            $('.slides > section').each(function(h,section) {
                var subsections = $('section', section);
                if (subsections.length > 0) {
                    subsections.each(function(v, subsection) {
                        createMenu(subsection,h,v);
                    });
                } else {
                    createMenu(section,h,0);
                }

            });
            //$(".wrapper-submenu ul").not(".has-levelSecond").remove();
        }else{
            $('.slides > section').each(function(h,section) {
                var subsections = $('section', section);
                if (subsections.length > 0) {
                    subsections.each(function(v, subsection) {
                        $('#wrapperMenuScroll').remove();
                        createMenu(subsection,h,v);
                    });
                } else {
                    $('#wrapperMenuScroll').remove();
                    createMenu(section,h,0);
                }

            });
        }*!/
        var section=null;
        //createMenu(section,0,0);
        createMenu(section,Reveal.getState().indexh,Reveal.getState().indexv);

        //var optionref = $(".item-ref .ref-option ref-code").val();

        if ($("#tab-1 .item-ref span.ref-title").length >= 1) {
            $("#tab-1 span.ref-title").each(function () {
                var refcode = $(this).parent().find('.refId').val();
                var $listeref = $('.reference-select');


                var reftitle = $(this).html();
                var refId = $(this).parent().find('.refId').val();

                $listeref.append('<option class="' + refcode + '" value="' + refId + '">' + reftitle + '</option>');

            });
        }

        // $(".edit-pres-wrap .slides #wrapperMenuScroll").css({
        //     "background-color": projector.attr("data-bg-menu-color") != "" ? projector.attr("data-bg-menu-color") : "#4a5667"
        // });

        // if(projector.attr("data-allow-submenu") != ""){
        //     if(projector.attr("data-allow-submenu") == "true"){
        //         $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("is-hidden");
        //     }
        //     else{
        //         $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
        //     }
        // }
        // else{
        //     $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
        // }
        // if(projector.attr("data-allow-submenuwidth") != ""){
        //     if(projector.attr("data-allow-submenuwidth") == "true"){
        //         $(".edit-pres-wrap .slides .wrapper-submenu").addClass("fullWidthSubmenu");
        //     }
        //     else{
        //         $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("fullWidthSubmenu");
        //     }
        // }
        // else{
        //     $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("fullWidthSubmenu");
        // }

        // $(".edit-pres-wrap .slides .wrapper-submenu").css({
        //     "background-color": projector.attr("data-bg-menu-color") != "" ? projector.attr("data-bg-menu-color") : "#4a5667"
        // });

        // $(".edit-pres-wrap .slides .menu .maxMenu > li, .edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").children("a").css({
        //     "color": projector.attr("data-font-menu-color") != "" ? projector.attr("data-font-menu-color") : "#ffffff"
        // });

        // $(".edit-pres-wrap .slides .menu .maxMenu > .menu-level1 ul li").not(".current").find("a").css({
        //     "color": projector.attr("data-font-menu-color") != "" ? projector.attr("data-font-menu-color") : "#ffffff"
        // });

        // $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
        //     "background-image": projector.attr("data-highlight-menu") != "" ? (projector.attr("data-highlight-menu") == "true" ? "url(/img/selected.png)" : "none") : "none"
        // });

        // $(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child").css({
        //     "background-image": projector.attr("data-highlight-menu") != "" ? (projector.attr("data-highlight-menu") == "true" ? "url(/img/picto-home-active.png)" : "url(/img/picto-home.png)") : "url(/img/picto-home.png)"
        // });

        $(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child");

        // $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css({
        //     "color": projector.attr("data-current-item-color") != "" ? projector.attr("data-current-item-color") : "#3e8787"
        // });

        $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css({
           // "font-family": projector.attr("data-menu-font") != "" ? projector.attr("data-menu-font") : "Montserrat",
            //"font-size": projector.attr("data-font-size-select") != "" ? projector.attr("data-font-size-select") + "px" : "15px"
        });

        $('.projector .reveal-viewport .slides .BlockRef h3').css({
                //"font-family": projector.attr("data-menu-font-title-ref") != "" && projector.attr("data-menu-font-title-ref") !== undefined  ? projector.attr("data-menu-font-title-ref") : "Montserrat",
                //"font-size": projector.attr('data-font-size-title-ref') != "" && projector.attr("data-font-size-title-ref") !== undefined  ? projector.attr('data-font-size-title-ref')+ 'px' : '20'
        });
        /!*$('.projector .reveal-viewport .slides .BlockRef .wrapper-refs ').each(function () {
            $(this).css({
                "font-family": projector.attr("data-menu-font-title-ref") != "" && projector.attr("data-menu-font-title-ref") !== undefined  ? projector.attr("data-menu-font-title-ref") : "Montserrat",
                "font-size": projector.attr('data-font-size-title-ref-content') != "" && projector.attr("data-font-size-title-ref-content") !== undefined  ? projector.attr('data-font-size-title-ref')+ 'px' : '20'
            });
        });*!/
        //Reference Title
        // setTimeout(function () {
        //     var inputExist = $('#content-ref-title').length;
        //     var dataContent = projector.attr('data-title-ref-content');
        //      if(!(inputExist == null)){
        //         if(typeof dataContent == 'undefined' ||  dataContent == ""){
        //             document.getElementById('content-ref-title').value = 'Reference';
        //             $('.projector .reveal-viewport .slides .BlockRef h3').html('Reference');
        //         }else{
        //             document.getElementById('content-ref-title').value = projector.attr('data-');
        //             $('.projector .reveal-viewport .slides .BlockRef h3').html(dataContent);
        //             document.getElementById('content-ref-title').value = dataContent;
        //         }

        //     }
        // },50);

        //Font domaine Merck
      /!*  var fontJson  = {
            "data": [
                {"name": "Merck"},
                {"name": "FuturaStd-CondensedLight"},
                {"name": "ProximaNova"},
                {"name": "ProximaNovaBold"},
                {"name": "ProximaNovaSemibold"},
                {"name": "MerckBold"},
                {"name": "MerckPro"},
                {"name": "MerckBold"},
                {"name": "RajdhaniBold"},
                {"name": "RajdhaniRegular"},
                {"name": "RajdhaniMedium"},
                {"name": "RajdhaniSemiBold"},
                {"name": "RajdhaniLight"},
                {"name": "FuturaBTMediumItalic"},
                {"name": "FuturaBTMedium"},
                {"name": "FuturaBTCondMedium"},
            ]
        };
        if (TWIG.urlBase.indexOf('merck') == -1) {
            $(document).on('click', function () {
                $("#menu-font option , #menu-font-ref option").each(function () {
                    var t = $(this);
                     for(var x= 0 ; fontJson.data.length > x ; x++){

                         if (t.data('name') == fontJson.data[x].name){
                             t.remove();
                         }
                     }
                    /!*if (t.data('name') == "Merck" && t.data('name') == "FuturaStd-CondensedLight" && t.data('name') == "ProximaNova" && t.data('name') == "ProximaNovaBold" && t.data('name') == "ProximaNovaSemibold"
                        && t.data('name') == "MerckBold"&& t.data('name') == "MerckPro"&& t.data('name') == "RajdhaniBold" && t.data('name') == "RajdhaniRegular" && t.data('name') == "RajdhaniMedium"
                        && t.data('name') == "RajdhaniSemiBold" && t.data('name') == "RajdhaniLight" && t.data('name') == "FuturaBTMediumItalic" && t.data('name') == "FuturaBTMedium" && t.data('name') == "FuturaBTCondMedium"){
                        t.remove();
                    }*!/
                });
                // $("#menu-font-ref option[data-name='FuturaStd-CondensedLight']").remove();
                // $("#menu-font-ref option[data-name='Merck']").remove();
                // $("#menu-font-ref option[data-name='ProximaNova']").remove();
                // $("#menu-font-ref option[data-name='ProximaNovaBold']").remove();
                // $("#menu-font-ref option[data-name='ProximaNovaSemibold']").remove();
                // $("#menu-font-ref option[data-name='MerckBold']").remove();
                // $("#menu-font-ref option[data-name='MerckPro']").remove();
                // $("#menu-font-ref option[data-name='RajdhaniBold']").remove();
                // $("#menu-font-ref option[data-name='RajdhaniRegular']").remove();
                // $("#menu-font-ref option[data-name='RajdhaniMedium']").remove();
                // $("#menu-font-ref option[data-name='RajdhaniSemiBold']").remove();
                // $("#menu-font-ref option[data-name='RajdhaniLight']").remove();
                // $("#menu-font-ref option[data-name='FuturaBTMediumItalic']").remove();
                // $("#menu-font-ref option[data-name='FuturaBTMedium']").remove();
                // $("#menu-font-ref option[data-name='FuturaBTCondMedium']").remove();
                //
                // //!*****
                // $("#menu-font option[data-name='Merck']").remove();
                // $("#menu-font option[data-name='FuturaStd-CondensedLight']").remove();
                // $("#menu-font option[data-name='ProximaNova']").remove();
                // $("#menu-font option[data-name='ProximaNovaBold']").remove();
                // $("#menu-font option[data-name='ProximaNovaSemibold']").remove();
                // $("#menu-font option[data-name='MerckBold']").remove();
                // $("#menu-font option[data-name='MerckPro']").remove();
                // $("#menu-font option[data-name='RajdhaniBold']").remove();
                // $("#menu-font option[data-name='RajdhaniRegular']").remove();
                // $("#menu-font option[data-name='RajdhaniMedium']").remove();
                // $("#menu-font option[data-name='RajdhaniSemiBold']").remove();
                // $("#menu-font option[data-name='RajdhaniLight']").remove();
                // $("#menu-font option[data-name='FuturaStd-CondensedLight']").remove();
                // $("#menu-font option[data-name='FuturaBTMediumItalic']").remove();
                // $("#menu-font option[data-name='FuturaBTMedium']").remove();
                // $("#menu-font option[data-name='FuturaBTCondMedium']").remove();

            });

        }
*!/
        // if(projector.attr("data-logo-pres-url") != ""){
        //     $(".edit-pres-wrap .slides .logoEADV").empty().append("<img src='" + projector.attr("data-logo-pres-url") + "' alt='' />");
        // }

        // if(projector.attr("data-logo-pres-url") != ""){
        //     $(".edit-pres-wrap .slides .logoEADV").empty().append("<img src='" + projector.attr("data-logo-pres-url") + "' alt='' />");
        // }


        //logo refer
        // if((typeof projector.attr('data-logo-refrs-url') != "undefined") && (projector.attr("data-logo-refrs-url") !== "")) {
        //     $(".edit-pres-wrap .slides .ref-link").empty().append("<img src='" + projector.attr("data-logo-refrs-url") + "' alt='' />");
        //     $('.logo-ref-link').css({
        //         'background-image': 'url('+ projector.attr("data-logo-refrs-url") +')',
        //         'display' : 'block'
        //     });
        //     $('.logo-ref-link').show();
        //     if ($(".wrapper-logo-ref .del-current-bg").length == 0) {
        //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-ref-link");
        //     }
        // }
        // logo rcp

        // if((typeof projector.attr('data-logo-rcp-url') != "undefined") && ( projector.attr("data-logo-rcp-url") !== "")) {
        //     $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append("<img src='" + projector.attr("data-logo-rcp-url") + "' alt='' />");
        //     $('.logo-rcp-link').css({
        //         'background-image': 'url('+ projector.attr("data-logo-rcp-url") +')',
        //         'display' : 'block'
        //     });
        //     $('.logo-rcp-link').show();
        //     if ($(".wrapper-rcp-logo .del-current-bg").length == 0) {
        //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-rcp-link");
        //     }
        // }

        //logo home
        // setTimeout(function () {
        //     if((typeof  projector.attr('data-logo-home-url') != 'undefined') && (projector.attr("data-logo-home-url") !== "" )){
        //         $(".edit-pres-wrap .slides .link-to-home").css( "background-image" , "url("+ projector.attr('data-logo-home-url') +") ");

        //         $('.logo-home-link').css({
        //             'background-image':'url('+ projector.attr("data-logo-home-url") +')',
        //             'display' : 'block'
        //         });
        //         $('.logo-home-link').show();
        //         if ($(".wrapper-logo-home .del-current-bg").length == 0) {
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-home-link");
        //         }
        //     }
        // },10);

        /!*$(document).on('click', function () {
            if ($('.settings.screen-parameters ').hasClass('visible')){
                var elem = $(this)
                   var value =$(elem).find('#customize_screen').find('.wrapper-bg-screen-image').find('.bg-screen-image').css('display');
                    if (value == "none"){
                        $(elem).find('#customize_screen').find('#bg-size-screen').prop('disabled', true)
                    }else{
                        $(elem).find('#customize_screen').find('#bg-size-screen').prop('disabled', false)
                    }

            }
        });*!/
        //backgound image size pres
        // var bgPresSize = $('.slides section').css('background-size');
        // if(bgPresSize == "contain"){
        //     $('#bg-size-pres option[value="contain"]').prop('selected', true)
        // }else if (bgPresSize == "cover") {
        //     $('#bg-size-pres option[value="cover"]').prop('selected', true)
        // }else{
        //     $('#bg-size-pres option[value="initial"]').prop('selected', true)
        // }
        /!* Set IDs to menus *!/

        /!*$(".edit-pres-wrap .slides .menu").each(function(index, elm){
         if($(this).find(".current").length > 0){
         generatedIdMenu[index] = "menu_" + $(this).find(".current").attr("data-item") + "_" + $(this).find(".current").attr("data-slide-h") + "_" + $(this).find(".current").attr("data-slide-v");
         }
         else{
         var menuOfCurrentSlide = $(this).parent("#wrapperMenuScroll").find(".wrapper-submenu .current");
         generatedIdMenu[index] = "menu_" + menuOfCurrentSlide.attr("data-item") + "_" + menuOfCurrentSlide.attr("data-slide-h") + "_" + menuOfCurrentSlide.attr("data-slide-v");
         }
         $(this).attr("id", generatedIdMenu[index]);
         //console.log("Current menu Id: " + $(this).attr("id"));
         });

         $(".edit-pres-wrap .slides .wrapper-submenu").each(function(index, elm){
         var submenuIndex = index + $(".edit-pres-wrap .slides .menu").length;
         if($(this).find(".current").length > 0){
         generatedIdMenu[submenuIndex] = "submenu_" + $(this).find(".current").attr("data-item") + "_" + $(this).find(".current").attr("data-slide-h") + "_" + $(this).find(".current").attr("data-slide-v");
         }
         else{
         var submenuOfCurrentSlide = $(this).parent("#wrapperMenuScroll").find(".menu .current");
         generatedIdMenu[submenuIndex] = "submenu_" + submenuOfCurrentSlide.attr("data-item") + "_" + submenuOfCurrentSlide.attr("data-slide-h") + "_" + submenuOfCurrentSlide.attr("data-slide-v");
         }
         $(this).attr("id", generatedIdMenu[submenuIndex]);
         });*!/
        if ($('.link-to-home').length == 0) {

            $(".edit-pres-wrap .slides #wrapperMenuScroll").prepend("<div class='link-to-home'><a href='' class='clickMenu'></a></div>");
            $(".edit-pres-wrap .slides #wrapperMenuScroll .link-to-home").eq(0).css({
                /!*"background-image": projector.attr("data-highlight-menu") != ""  ? (projector.attr("data-highlight-menu") == "true" ? "url(/img/picto-home-active.png)" : "url(/img/picto-home.png)") : "url(/img/picto-home.png)"*!/
                //"background-image": projector.attr("data-logo-home-url") != "" && projector.attr("data-logo-home-url") !== undefined ? "url(" + projector.attr("data-logo-home-url") + ")" : "url(/img/picto-home.png)"
            });
            homeLink = $(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item:first-child");
            cloneHomeLink = $(".edit-pres-wrap .slides #wrapperMenuScroll .link-to-home");
            cloneHomeLink.attr("data-item", homeLink.attr("data-item"));
            cloneHomeLink.attr("data-slide-h", homeLink.attr("data-slide-h"));
            cloneHomeLink.attr("data-slide-v", homeLink.attr("data-slide-v"));
        }
    }

    setTimeout(function(){
        setScrollToMenu();
    }, 400);

    $(".projector .slides section").not(".stack").each(function(index, elm){
        if($(this).attr("data-custom-navbar-appearance") != undefined && $(this).attr("data-custom-navbar-appearance") != ""){
            switch($(this).attr("data-custom-navbar-appearance")){
                case "standard":
                    $(this).find(".hide-menu").each(function(index, elm){
                        if($(this).is(".hide-menu")){
                            $(this).removeClass("hide-menu");
                        }
                    });
                    break;
                case "Hide-all":
                    $(this).find("#wrapperMenuScroll, .wrapper-submenu, .menu").addClass("hide-menu");
                    break;
                case "Hide-chapters":
                    $(this).find("#wrapperMenuScroll").is(".hide-menu") ? $(this).find("#wrapperMenuScroll").removeClass("hide-menu") : null;
                    $(this).find(".menu").is(".hide-menu") == false ? $(this).find(".menu").addClass("hide-menu") : null;
                    $(this).find(".wrapper-submenu").is(".hide-menu") == false ? $(this).find(".wrapper-submenu").addClass("hide-menu") : null;
                    break;
            }
        }
        else{
            $(this).find(".hide-menu").each(function(index, elm){
                if($(this).is(".hide-menu")){
                    $(this).removeClass("hide-menu");
                }
            });
        }
    });
    /!*console.log($(".wrapper-submenu ul").length);
    console.log(".has-levelSecond: " + $(".has-levelSecond").length);
    $(".wrapper-submenu ul").each(function(index, elm){
        TWIG.cloneSubmenuUL.push($(elm));
        //console.log($(elm));
    });*!/

}

function generateItem(currentSection,currentH,currentV, type, section, i, h, v, chapterName, nextCurrentIndexV) {
    console.log("generateItem");
    h = h+1;
    var currentIndex =0;
    var currentIndexV =0;
    var className = "";
    var currentTitle = $(Reveal.getCurrentSlide()).attr("data-screen-name");
    var title = $(section).attr("data-screen-name");
    var currentChapter =$(Reveal.getCurrentSlide()).attr("data-chapter-name");
    var dataID = $(section).attr("data-id");
    //console.log("currentChapter: " + currentChapter);
    //console.log(chapterName);

    if(v != undefined){
        if (v !=0 && type == 'slide-menu-item-vertical'){
            currentIndexV = v;
        }
    }
    if(chapterName != undefined && chapterName != ""){
/!*
        console.log("Chapter name: " + chapterName + "******** / ******** " + chapterName + " Title: " + title + "******** / ******** Type: " + type);
        console.log(section);
        console.log("_______________________________________" + title + " / " + currentTitle);
        console.log(currentSection);
*!/
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
/!*
    console.log("_______________________________________" + title + " / " + currentTitle);
    console.log("_______________________________________" + chapterName + " / " + currentChapter);
*!/
    var state = Reveal.getState();
    if(currentTitle == title ){
        className = " current";
    }
    //console.log(className);
    title = '<a href="" class="clickMenu"><span class="slide-menu-item-title">' + title + '</span><a/>';

    /!*if(v === 0){
     return  '<li class="menu-level1 ' + type + className +'" data-item="' + i + '" data-slide-h="' + h +  '"data-slide-v="' + v +  '">'+ title + '<ul class="sousMenu-'+ h +'"></ul></li>';
     }else{

     return '<li class="menu-level2 ' + type + className +'" data-item="' + i + '" data-slide-h="' + h +  '"data-slide-v="' + v +  '">' + title + '</li>';
     }*!/

    if(v === 0){
        if($("#wrapperMenuScroll").find('.wrapper-submenu .sousMenu-' + h).length == 0){
            $("#wrapperMenuScroll").find('.wrapper-submenu > div').append('<ul class="sousMenu-' + h + '"></ul>');
        }
        return chapterName != "" && chapterName != undefined && type == "slide-menu-item-vertical" ? '<li class="menu-level2 ' + type + className +'" data-item="' + i + '" data-slide-h="' + h +  '"data-slide-v="' + v +  '">' + title + '</li>' : '<li class="menu-level1 ' + type + className +'" data-item="' + i + '" data-section-id="'+ dataID +'"  data-slide-h="' + h +  '"data-slide-v="' + v +  '">'+ title + '</li>';
    }else{
        return '<li class="menu-level2 ' + type + className +'" data-item="' + i + '" data-section-id="'+ dataID +'" data-slide-h="' + h +  '"data-slide-v="' + v +  '">' + title + '</li>';
    }
}

function createMenu(currentSection,currentH,currentV){
    console.log("createMenu");
    if ($('#wrapperMenuScroll').length == 0) {
        $("<div id='wrapperMenuScroll'><div id='get-all-ul' style='display:none;'></div><div class='wrapper-submenu is-hidden'><div></div></div><div class='menu' style='display:block;' ><ul class='maxMenu'></ul></div><div class='logoEADV'></div><a href='#' class='ref-link'><i class='fa fa-stack-exchange'></i></a><a href='#' class='rcp-link-eadv'><i class='fa fa-rcp'></i></a></div>").appendTo($(".slides"))
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
        //console.log(chapter);
        if (subsections.length > 0) {
            if(chapter != "" && chapter != undefined){
                nextCurrentIndexV = true;
                var item2 = generateItem(currentSection,currentH,0, 'slide-menu-item-vertical',$(section).is(".stack") ? $(section).find("section").first() : section, slideCount, h,0, chapter);
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
                    //console.log("sub: " + slideCount);
                    var item = nextCurrentIndexV != undefined && nextCurrentIndexV != "" && nextCurrentIndexV == true ? generateItem(currentSection,currentH,currentV,type, subsection, slideCount, h, v, "", nextCurrentIndexV) : generateItem(currentSection,currentH,currentV,type, subsection, slideCount, h, v);
                    slideCount++;
                    var cpt = h + 1;
                    $("#wrapperMenuScroll").find('.sousMenu-' + cpt).append(item);
                    tabForSubmenu += item;
                    $('.menu-level2.slide-menu-item-vertical.current').parent('ul[class^=sousMenu-]').addClass('has-levelSecond');
                }
                else{
                    //console.log("menu: " + slideCount);
                    var item = chapter == "" || chapter == undefined ? generateItem(currentSection,currentH,currentV,type, subsection, slideCount, h, v) : generateItem(currentSection,currentH,currentV,type, subsection, slideCount, h, v, chapter);
                    if(chapter == "" || chapter == undefined){
                        //console.log("chapppp");
                    }
                    slideCount++;
                    items.append(item);
                    var currentItemH = $("#wrapperMenuScroll").find('.menu-level1.slide-menu-item.current');
                    $("#wrapperMenuScroll").find('.sousMenu-' + currentItemH.attr("data-slide-h")).addClass('has-levelSecond');
                }
            });
        } else {
            if(chapter == "" || chapter == undefined){
                //console.log("When chapter is NOT defined");
                var item = generateItem(currentSection,currentH,0, 'slide-menu-item',section, slideCount, h,0);
                //slideCount++;
                items.append(item);
            }
            else{
                //console.log("When chapter is defined");
                var item1 = generateItem(currentSection,currentH,0, 'slide-menu-item',section, slideCount, h,0, chapter);


                //slideCount++;

                var item2 = generateItem(currentSection,currentH,0, 'slide-menu-item-vertical',$(section).is(".stack") ? $(section).find("section").first() : section, slideCount, h,0, chapter);

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
        TWIG.cloneSubmenuUL.push(tabForSubmenu);
    });
    //console.log(TWIG.cloneSubmenuUL.length);
    //console.log($(currentSection).find('.maxMenu li[data-slide-h=' + $(currentSection).find('.menu-level2.slide-menu-item-vertical.current').attr('data-slide-h') + ']').attr('class'));
    $("#wrapperMenuScroll").find('.maxMenu li[data-slide-h=' + $("#wrapperMenuScroll").find('.menu-level2.slide-menu-item-vertical.current').attr('data-slide-h') + ']').addClass('current');


}*/

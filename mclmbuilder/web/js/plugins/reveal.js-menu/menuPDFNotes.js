/* Costomize menu appearence (standard - hidden - hidden chapters) */
/*function InitMenuPreview()
{
    /!*********************************************Menu******************************************************************!/
    if(!$(Reveal.getCurrentSlide()).attr('popin-page')){
        if(jQuery("section.present").not(".stack").attr("data-custom-navbar-appearance")== undefined || jQuery("section.present").not(".stack").attr("data-custom-navbar-appearance")=="")
        {
            $(".hide-menu").each(function(index, elm){
                if($(this).is(".hide-menu")){
                    $(this).removeClass("hide-menu");
                }
            });
        }
        else
        if(jQuery("section.present").not(".stack").attr("data-custom-navbar-appearance") != undefined && jQuery("section.present").not(".stack").attr("data-custom-navbar-appearance") != ""){
            switch(jQuery("section.present").not(".stack").attr("data-custom-navbar-appearance")){

                case "standard":
                    $(".hide-menu").each(function(index, elm){
                        if($(this).is(".hide-menu")){
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
        else{
            jQuery("section.present").not(".stack").find(".hide-menu").each(function(index, elm){

                if($(this).is(".hide-menu")){
                    $(this).removeClass("hide-menu");
                }
            });
        }
        if(jQuery("section.present").not(".stack").attr("data-custom-navbar-appearance") != undefined && jQuery("section.present").not(".stack").attr("data-custom-navbar-appearance") != ""){
            var optionVal = jQuery("section.present").not(".stack").attr("data-custom-navbar-appearance");
            $("#custom-navbar-appearance").val(optionVal).change();
        }
        else{
            $("#custom-navbar-appearance").val("standard").change();
        }
    }
}*/

$(document).ready(function () {

    /* Fix PDF strong issue */
    /*$(".reveal .slides [data-id] strong").each(function(index, elm){
        $(this).replaceWith("<b>" + $(this).html() + "</b>");
    });*/
    /* End fix PDF strong issue */
    //disable link in menu
    $("li.slide-menu-item a, li.slide-menu-item-vertical a").removeAttr('href');
    $(".link-to-home .clickMenu").removeAttr('href');

    //disable link in menu
    $("li.slide-menu-item a, li.slide-menu-item-vertical a").removeAttr('href');
    $(".link-to-home .clickMenu").removeAttr('href');

    Reveal.addEventListener('ready', function(){
        $("section[popin-page][data-custom-navbar-appearance]").removeAttr("data-custom-navbar-appearance");
    });

    /* Scrolling ref */
    $(".BlockRef").each(function (index, elm) {
        var wrapperRefsHeight = $(this).height() - /*$(this).find("h3").outerHeight()*/38;
        $(this).find(".wrapper-refs").outerHeight(wrapperRefsHeight);
        //console.log($(this).height() + " / " + $(this).find("h3").outerHeight() + " / " + wrapperRefsHeight);
    });
    /* End scrolling ref */

    var jsonParams = data.settings,
    fc = jsonParams.dataFontMenuColor != "" && jsonParams.dataFontMenuColor != undefined ? jsonParams.dataFontMenuColor : "#fff",
    ic = jsonParams.dataCurrentItemColor != "" && jsonParams.dataCurrentItemColor != undefined ? jsonParams.dataCurrentItemColor : "#3e8787",
    highlight = jsonParams.dataHighlightMenu,
    imgHighlight = "/img/selected.png";
    /* init menu */
    updateCreatedMenu();
    //console.log(cloneSubmenuUL);
    $(".wrapper-submenu ul").not(".has-levelSecond").remove();

    var slideH = 0;
    var slideV = 0;
	highlightCurrentSlide();
	/* slide change */
	Reveal.addEventListener('slidechanged', highlightCurrentSlide);

	function highlightCurrentSlide() {

        InitMenuPreview();
        if (!$(Reveal.getCurrentSlide()).attr('new-slide') && !$(Reveal.getCurrentSlide()).attr('popin-page')) {
            // removeS = parseInt($('.menu').find('.current').attr('data-item'));
            // $('.menu').find("li").each(function (index) {
            //     if (parseInt($('.menu').find("li").attr('data-item')) === removeS + 1) {
            //         console.log($(this).attr('data-item'));


                if(Reveal.getState().indexv === 0) {
                    slideV =  0;
                }
                var state = Reveal.getState();
                $('li.slide-menu-item, li.slide-menu-item-vertical')
                    .removeClass('past active future current')
                    .css('background-image', '');

                $('li.slide-menu-item, li.slide-menu-item-vertical').each(function (e) {
                    var h = $(this).data('slide-h');
                    var v = $(this).data('slide-v');
                    var sh = h;
                    h--;
                    $(".sousMenu-" + sh).removeClass('has-levelSecond');
                    if (h === (state.indexh- slideH)) {
                        h++;
                        $(".wrapper-submenu ul").remove();
                        //$(".wrapper-submenu > div:first-child").append(cloneSubmenuUL[sh - 1]);
                        for (var key in cloneSubmenuUL) {
                            if ($(cloneSubmenuUL[key]).is(".sousMenu-" + sh) == true) {
                                $(".wrapper-submenu > div:first-child").append($(cloneSubmenuUL[key]));
                            }
                        }
                        if (v === (state.indexv - slideV) || (v == 0 && $(this).is(".slide-menu-item") == true)) {
                            $(this).addClass('active');
                            $(this).addClass('current');
                            $(this).children('a').css('color', ic);
                            if (highlight != 'false' && highlight != false && highlight != "" && highlight != undefined) {
                                $(this).css('background-image', 'url("' + imgHighlight + '")');
                            }
                        }
                        $(".sousMenu-" + sh).find('li.slide-menu-item-vertical').each(function (index, elm) {
                            if ($(this).data('slide-v') === (state.indexv - slideV)) {
                                $(this).addClass('active');
                                $(this).addClass('current');
                                $(this).children('a').css('color', ic);
                                if (highlight != 'false' && highlight != false && highlight != "" && highlight != undefined) {
                                    $(this).css('background-image', 'url("' + imgHighlight + '")');
                                }
                            }
                        });
                        $(".sousMenu-" + sh).addClass('has-levelSecond');
                    }
                    else {
                        $(this).addClass('future');
                    }
                });
                $('li.slide-menu-item, li.slide-menu-item-vertical').not(".current").find("a.clickMenu").css('color', fc);
                $('.slide-menu-item, .slide-menu-item-vertical').click(clicked);
                renderMenuParams();
                setScrollToMenuPreview();
    }
    else {
            if(Reveal.getState().indexv > 0){
                slideV = slideV + 1;
            }else {
                slideH = slideH + 1;
                slideV =  0;
            }
		}
	}

    Reveal.addEventListener('slidechanged', function (event) {
        if(!$(Reveal.getCurrentSlide()).attr('new-slide') && !$(Reveal.getCurrentSlide()).attr('popin-page')){
            //setTimeout(function(){

                if($(".slides").find("#wrapperMenuScroll .current").length == 1){
                    var clickMenuPreview = $(".slides").find(".menu .current").length > 0 ? $(".slides").find(".menu").attr("id") : $(".slides").find(".wrapper-submenu").attr("id"),
                        clickMenuPreviewIndexof = scrollHMenuElmIdTab.indexOf(clickMenuPreview),
                        clickMenuPreviewIndex = $(".slides").find(".current").index();


                        if(scrollHMenuElmTab[clickMenuPreviewIndexof] != undefined){
                            scrollHMenuElmTab[clickMenuPreviewIndexof].scrollToElement('li:nth-child(' + (clickMenuPreviewIndex + 1) + ')', 0);

                        }
                }
                else {
                    var clickMenuPreview = new Array();
                    clickMenuPreview.push($(".slides").find(".menu").attr("id"));
                    clickMenuPreview.push($(".slides").find(".wrapper-submenu").attr("id"));

                    var clickMenuPreviewIndexof = new Array();
                    clickMenuPreviewIndexof.push(scrollHMenuElmIdTab.indexOf(clickMenuPreview[0]));
                    clickMenuPreviewIndexof.push(scrollHMenuElmIdTab.indexOf(clickMenuPreview[1]));

                    var clickMenuPreviewIndex = new Array();
                    clickMenuPreviewIndex.push($(".slides").find(".menu .current").index());
                    clickMenuPreviewIndex.push($(".slides .wrapper-submenu ul.has-levelSecond li").index($("li.current")));

                    if(scrollHMenuElmTab[1] != undefined){
                        scrollHMenuElmTab[1].scrollToElement('li:nth-child(' + (clickMenuPreviewIndex[0] + 1) + ')', 0);
                    }

                    if(scrollHMenuElmTab[0] != undefined){
                        scrollHMenuElmTab[0].scrollToElement('li:nth-child(' + (clickMenuPreviewIndex[1] + 1) + ')', 0);
                    }

                }
            //}, 200);
        }

        /* Fix popin position and custom menu appearance in popin page */
        var slideWidth = $(".slides").width(),
        slideHeight = $(".slides").height();

        if($(Reveal.getCurrentSlide()).attr('popin-page') != undefined){
            var popinWidth = $(Reveal.getCurrentSlide()).width(),
            popinHeight = $(Reveal.getCurrentSlide()).height(),
            popinTop = (slideHeight - popinHeight) / 2,
            popinleft = (slideWidth - popinWidth) / 2;
            //console.log("Top: " + popinTop + " / Left: " + popinleft);
            $(Reveal.getCurrentSlide()).css({"top": popinTop, "left": popinleft});

            $("#wrapperMenuScroll").css("visibility", "hidden");
        }
        else {
            $("#wrapperMenuScroll").css("visibility", "visible");
        }
        /* End fix popin position and custom menu appearance in popin page */

        /* Stop auto animation when slide is changed */

        if (jQuery("section.present").not(".stack").attr("data-trigger-anim-byclick") == "true") {

            jQuery(".reveal").removeClass("ready");
        }
        else {
            jQuery(".reveal").addClass("ready");
        }
    });

	/*navigation by click*/
	$('.slide-menu-item, .slide-menu-item-vertical').click(clicked);
	function clicked(event) {
		if (event.target.nodeName !== "A") {
			event.preventDefault();
		}
		openItem(event.currentTarget);
	}
	function openItem(item) {
		var h = $(item).data('slide-h');
		var v = $(item).data('slide-v');
		var theme = $(item).data('theme');
		var transition = $(item).data('transition');
		if (typeof h !== "undefined" && typeof v !== "undefined") {
			h--;
			Reveal.slide(h, v);

		} else if (theme) {
			$('#theme').attr('href', theme);

		} else if (transition) {
			Reveal.configure({ transition: transition });

		} else {
			var links = $(item).find('a');
			if (links.length > 0) {
				links.get(0).click();
			}

		}
	}

	/*home section*/
	$(document).on('click', '.link-to-home', function (e) {
		e.preventDefault();
		Reveal.slide(0,0);
	})
});

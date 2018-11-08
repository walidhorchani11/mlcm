$(document).ready(function () {

	var fc              = fontColor.slice(7, -1),
        ic              = itemColor.slice(7, -1),
        cloneSubmenuUL  = [],
        data            = window.data,
        menuJson        = data.menu;

	/*$(".wrapper-submenu ul").each(function(index, elm){
		if($(this).find("li").length == 0){
			$(this).remove();
		}
	});*/
    for (var c = 0; menuJson.length > c ; c++){
        var item    = menuJson[c],
            child   = item.childs,
            temp    = $(`<ul class="sousMenu-${c+1}"></ul>`);

        for (var cpt = 0 ; child.length > cpt; cpt++){
            var content   = child[cpt].outerhtml;
            temp.append(content)
        }
        cloneSubmenuUL.push(temp);
    };
    console.log(cloneSubmenuUL)
	// $("#get-all-ul ul").each(function(index, elm){
	// 	cloneSubmenuUL.push($(elm));
	// 	//console.log($(elm));
	// });
	//console.log(cloneSubmenuUL);
	$(".wrapper-submenu ul").not(".has-levelSecond").remove();


	/* init menu */
	highlightCurrentSlide();
//	InitMenuPreview();
	/* slide change */
	Reveal.addEventListener('slidechanged', highlightCurrentSlide);

	function highlightCurrentSlide() {

		var state = Reveal.getState();
		$('li.slide-menu-item, li.slide-menu-item-vertical')
			.removeClass('past active future current')
			.css('background-image', '');

		$('li.slide-menu-item a, li.slide-menu-item-vertical a').css('color', fc);
		$('li.slide-menu-item, li.slide-menu-item-vertical').each(function (e) {
			var h   = $(this).data('slide-h');
			var v   = $(this).data('slide-v');
			var sh  = h;
			h--;
			//console.log($(this).text() + " / " + ic + " / " + fc);
			$(".sousMenu-" + sh).removeClass('has-levelSecond');
			if (h === state.indexh) {
				h++;
				//console.log(".sousMenu-" + sh);
				$(".wrapper-submenu ul").remove();
				//$(".wrapper-submenu > div:first-child").append(cloneSubmenuUL[sh - 1]);
				for(var key in cloneSubmenuUL){
					if($(cloneSubmenuUL[key]).is(".sousMenu-" + sh) == true){
						$(".wrapper-submenu > div:first-child").append($(cloneSubmenuUL[key]));
						//console.log($(cloneSubmenuUL[key]).attr("class") + " / " + "sousMenu-" + sh);
					}
				}
				if (v === state.indexv || (v == 0 && $(this).is(".slide-menu-item") == true)) {
					$(this).addClass('active');
					$(this).addClass('current');
					$(this).children('a').css('color', ic);
					if (highlight != 'no') {
						$(this).css('background-image', 'url("' + imgHighlight + '")');
					}
				}
				$(".sousMenu-" + sh).find('li.slide-menu-item-vertical').each(function(index, elm){
					if($(this).data('slide-v') === state.indexv){
						$(this).addClass('active');
						$(this).addClass('current');
						$(this).children('a').css('color', ic);
						if (highlight != 'no') {
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
		$('.slide-menu-item, .slide-menu-item-vertical').click(clicked);
        setTimeout(function(){
        	setScrollToMenuPreview();
        }, 150);
	}
	
    Reveal.addEventListener('slidechanged', function (event) {
        setTimeout(function(){
	        //console.log("///---------------------------------------------------------------///" + $("li.current").length + $("li.current").text());

	        if($(".slides").find("#wrapperMenuScroll .current").length == 1){
	            var clickMenuPreview = $(".slides").find(".menu .current").length > 0 ? $(".slides").find(".menu").attr("id") : $(".slides").find(".wrapper-submenu").attr("id"),
	                clickMenuPreviewIndexof = scrollHMenuElmIdTab.indexOf(clickMenuPreview),
	                clickMenuPreviewIndex = $(".slides").find(".current").index();

	            //$("#" + clickMenuPreview).promise().done(function () {
	                //console.log("Done! " + clickMenuPreview)
	                //var stmScroll = setTimeout(function () {
	                    if(scrollHMenuElmTab[clickMenuPreviewIndexof] != undefined){
	                    	scrollHMenuElmTab[clickMenuPreviewIndexof].scrollToElement('li:nth-child(' + (clickMenuPreviewIndex + 1) + ')', 1000);
	                    }
	                    //console.log("Current ID: " + $(".slides").find(".menu").attr("id"));
	                    //clearTimeout(stmScroll);
	                //}, 300);
	            //});
	        }
	        else {
	            var clickMenuPreview = new Array();
	            clickMenuPreview.push($(".slides").find(".menu").attr("id"));
	            clickMenuPreview.push($(".slides").find(".wrapper-submenu").attr("id"));
	            //console.log(clickMenuPreview);

	            var clickMenuPreviewIndexof = new Array();
	            clickMenuPreviewIndexof.push(scrollHMenuElmIdTab.indexOf(clickMenuPreview[0]));
	            clickMenuPreviewIndexof.push(scrollHMenuElmIdTab.indexOf(clickMenuPreview[1]));
	            //console.log(clickMenuPreviewIndexof);

	            var clickMenuPreviewIndex = new Array();
	            clickMenuPreviewIndex.push($(".slides").find(".menu .current").index());
	            clickMenuPreviewIndex.push($(".slides .wrapper-submenu ul.has-levelSecond li").index($("li.current")));
	            //console.log(clickMenuPreviewIndex);

	            //$("#" + clickMenuPreview[0] + ", #" + clickMenuPreview[1]).promise().done(function () {
	                //console.log("Done! " + clickMenuPreview)
	                //var stmScroll = setTimeout(function () {
	                    if(scrollHMenuElmTab[1] != undefined){
	                    	scrollHMenuElmTab[1].scrollToElement('li:nth-child(' + (clickMenuPreviewIndex[0] + 1) + ')', 1000);
	                    }
	                    //console.log("Current ID: " + $(".slides").find(".menu").attr("id"));

	                    
	                    if(scrollHMenuElmTab[0] != undefined){
	                    	scrollHMenuElmTab[0].scrollToElement('li:nth-child(' + (clickMenuPreviewIndex[1] + 1) + ')', 1000);
	                    }
	                    console.log("clickMenuPreviewIndex[1]: " + $(".slides .wrapper-submenu li").index($("li.current")));
	                    //console.log("Current ID: " + $(".slides").find(".wrapper-submenu").attr("id") + " / " + (clickMenuPreviewIndex[1] + 1));
	                    //clearTimeout(stmScroll);
	                //}, 300);
	            //});
	        }
        }, 200);

        /* Stop auto animation when slide is changed */
        //console.log($(".reveal").length);
        if (jQuery("section.present").not(".stack").attr("data-trigger-anim-byclick") == "true") {
           // console.log("data-trigger-anim-byclick: true");
            jQuery(".reveal").removeClass("ready");
        }
        else {
          //  console.log("data-trigger-anim-byclick: false");
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

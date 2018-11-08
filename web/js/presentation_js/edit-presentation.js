// var //min_popup_w     = 300,
//     //max_popup_w     = 1024,
//     //init_popup_w    = 600,
//     min_popup_h     = 300,
//     max_popup_h     = 768,
//     init_popup_h    = 400;

$(document).ready(function () {

    // Dump section to jsonParameters
      /*  var data = {
          	"slides" :[],
            "popins"  :[],
            "references" : []
        };
        function parseCSSText(cssText) {
            var style = {},
                [, ruleName, rule] = cssText.match(/(.*){([^}]*)}/) || [,, cssText];

            var cssToJs = s => s.replace(/[\W]+\w/g,
                match => match.slice(-1).toUpperCase());

            var properties = rule.split(";")
                .map( o => o.split(":")
                .map( x => x && x.trim() )
        );
            for (var [property,value] of properties) {
                if (property !== "" ) {
                    style[property] = value;
                }
            }

            // return {
            //     cssText,
            //     ruleName: ruleName && ruleName.trim(),
            //     style
            // };
            return style;
        };
        function getSectionAttributes (section){

          attr = {
              "data-id"					            : section.attr('data-id'),
              "data-background-size"		        : section.attr('data-background-size'),
              "data-background-image"		        : section.attr('data-background-image'),
              "data-background-color"		        : section.attr('data-background-color'),
              "data-trigger-anim-byclick"           : section.attr('data-trigger-anim-byclick'),
              "data-index-h"                        : section.attr('data-index-h'),
              "data-index-v"                        : section.attr('data-index-v'),
              "data-background-repeat"              : section.attr('data-background-repeat'),
              "data-background-position"            : section.attr('data-background-position'),
              "data-screen-name"                    : section.attr('data-screen-name'),
              "data-chapter-name"                   : section.attr('data-chapter-name'),
              "data-key-msg"                        : section.attr('data-key-msg'),
              "data-screen-description"             : section.attr('data-screen-description'),
              "data-custom-navbar-appearance"       : section.attr('data-custom-navbar-appearance'),
              "data-bg-screen-color"                : section.attr('data-bg-screen-color'),
              "data-bg-screen-img"                  : section.attr('data-bg-screen-img'),
              "data-block-left-nav"                 : section.attr('data-block-left-nav'),
              "data-block-right-nav"                : section.attr('data-block-right-nav'),
              "data-thumb-saved"                    : section.attr('data-thumb-saved')
            }

          return  attr;

        };
        function getPopinAttributes(popin) {
            attr = {
                "data-id"				: popin.attr('data-id'),
                "data-thumb-saved"      : popin.attr('data-thumb-saved'),
                "data-popin-name"       : popin.attr('data-popin-name'),
                "thumb-tosave"          : popin.attr('thumb-tosave')
            };

            return  attr;
        }
        function getBlockData(slBlock ,json) {
          slBlock.each(function(){
              var block 			= $(this),
                  blockStyle        = block.find('.block-style'),
                  slBlockContent    = block.find('.sl-block-content'),
                  blockType         = block.attr('data-block-type'),
                  imgBlock          = slBlockContent.find('img'),
                  videoBlock        = slBlockContent.find('video'),
                  svgBlock          = slBlockContent.find('svg'),
                  blockData, contentAttr, slblockAttributes;

             var jsonCss =  parseCSSText(slBlockContent[0].style.cssText);

              if (blockType === "text" || blockType === "scrollabletext" || blockType === "survey" ) {
                  blockData =  slBlockContent.html();
                  contentAttr = {
                    "data-placeholder-tag"  : slBlockContent.attr('data-placeholder-tag'),
                    "data-placeholder-text" : slBlockContent.attr('data-placeholder-text')
                  }
              }
              if (blockType === "table") {
                blockData =  slBlockContent.html();
              }
              if (blockType === "image") {
                  blockData = {
                      "tag"                 : 'img',
                      "type"                : "image",
                      "src"                 : imgBlock.attr('src'),
                      "attributes"          : {
                          "data-natural-width"  : imgBlock.attr('data-natural-width'),
                          "data-natural-height" : imgBlock.attr('data-natural-height')
                      }

                  };

              }
              if (blockType === "video") {
                  blockData = {
                      "tag"                 : 'video',
                      "type"                : "video",
                      "source"              : videoBlock.find('source').attr('src'),
                      "text"                : videoBlock[0].lastChild.textContent,
                      "attributes"          : {
                          "data-natural-width"  : videoBlock.attr('data-natural-width'),
                          "data-natural-height" : videoBlock.attr('data-natural-height'),
                          "width"               : videoBlock.attr('width'),
                          "height"              : videoBlock.attr('height')
                      }
                  }
                  slblockAttributes = {
                      'data-block-id'         : block.attr('data-block-id'),
                      'data-block-type'       : block.attr('data-block-type'),
                      "data-video"            : block.attr('data-video'),
                      "data-video-id"         : block.attr('data-video-id'),
                      "data-video-autoplay"   : block.attr('data-video-autoplay'),
                      "data-video-poster"     : block.attr('data-video-poster')
                  }
              } else {
                slblockAttributes = {
                    'data-block-id'         : block.attr('data-block-id'),
                    'data-block-type'       : block.attr('data-block-type')
                }
              }
              if (blockType === "shape") {
                  blockData = {
                      "tag"                     : 'svg',
                      "type"                    : "shape",
                      "xmlns"                   : svgBlock.attr('xmlns'),
                      "version"                 : svgBlock.attr('version'),
                      "width"                   : svgBlock.attr('width'),
                      "height"                  : svgBlock.attr('height'),
                      "preserveAspectRation"    : "none",
                      "viewBox"                 : svgBlock[0].attributes.viewBox.textContent,
                      "data"                    : svgBlock.html()
                  };
                  contentAttr = {
                    "data-shape-fill-color" : slBlockContent.attr('data-shape-fill-color'),
                    "data-shape-stretch"    : slBlockContent.attr('data-shape-stretch'),
                    "data-shape-type"       : slBlockContent.attr('data-shape-type'),
                  }


              }


              json.push({
                  'class'       : block.attr('class'),
                  'type'        : block.attr('data-block-type'),
                  'style'       : parseCSSText(block.attr('style')),
                  'blockStyle'  : {
                      "class"   : blockStyle.attr('class'),
                      "style"   : parseCSSText(blockStyle.attr('style')),
                      "blockcontent": {
                            "class"      : slBlockContent.attr('class'),
                            "data"       : blockData,
                            "attributes" : contentAttr,
                            "style"      : jsonCss
                        }
                  },
                  "attributes"  : slblockAttributes
              })
          });
        }
        function preparationRefSection () {
            var Slides = [],
                saveSlides = [];
            $('section:not(.popin):not(stack)').each(function () {
                var $this = $(this),
                    descRef = [],
                    valuRef = [],
                    itemreferences = [],
                    List_reference_id = [],
                    List_reference_id_unique = [];

                $this.find(".ref").map(function () {
                    var item = {};
                    item["code"] = this.innerText;
                    item["id"] = this.id;
                    if (List_reference_id.indexOf(item.id) == -1) {
                        List_reference_id.push(item.id);
                        itemreferences.push(item);
                    }
                });
                var all_reference_code = $this.find(".ref").map(function () {
                    return this.innerText;
                }).get();

                var List_reference_val_unique = all_reference_code.filter(function (itm, i, all_reference_id) {
                    return i == all_reference_code.indexOf(itm);
                });
                var alpha = [],
                    number = [];
                $(List_reference_val_unique).each(function (index, value) {
                    if ($.isNumeric(value) == false) {
                        alpha.push(value);
                        alpha.sort();

                    } else {
                        number.push(value);
                        number.sort(function sortEm(a, b) {
                            return parseInt(a) > parseInt(b) ? 1 : -1;
                        });
                    }
                });

                var listOfvaleurBySlide = $.merge(alpha, number);
                for (var i = 0; i < listOfvaleurBySlide.length; i++) {
                    $.each(itemreferences, function (key, value) {
                        if (value.code == listOfvaleurBySlide[i]) {
                            List_reference_id_unique.push(value.id);
                        }

                    });
                }
                var List_reference_id_unique = List_reference_id_unique;
                if (List_reference_id_unique.length != 0) {

                    _.each(List_reference_id_unique, function (reference_id_unique) {
                        var $slblock = $this.find(".sl-block"),
                            inputvalueref = $slblock.find("#" + reference_id_unique).html();

                        valuRef.push(inputvalueref);

                        if ($("#tab-1 .item-ref.sheet").length >= 1) {
                            var idreflinked = reference_id_unique,
                                $sheet_reference = $("#tab-1 .item-ref.sheet#" + idreflinked)[0];
                            if ($($sheet_reference).attr('id') == reference_id_unique) {
                                descRef.push($($sheet_reference).find('.ref-desc').html());

                            }
                        }
                    });

                    if ($(this).attr('data-id') != undefined) {
                        var item = {},
                            objetReferences = {},
                            $additional_textPresent = $("section[data-id=" + $(this).attr('data-id') + "]").find('.block-AdditionalText').html();

                        item ["data_id"] = $this.attr('data-id');
                        objetReferences ["id_reference"] = List_reference_id_unique;
                        objetReferences ["description"] = descRef;
                        objetReferences ["value"] = valuRef;
                        item["Refs"] = objetReferences;
                        $additional_textPresent != undefined ? item ["additional_text"] = $additional_textPresent : item ["additional_text"] = "";
                        Slides.push(item);

                        var objectglobale = {}, itemReferences = [];
                        objectglobale ["data_id"] = $this.attr('data-id');
                        for (var i = 0; i < List_reference_id_unique.length; i++) {
                            var Onlyobjectglobale = {}
                            Onlyobjectglobale ["id_reference"] = List_reference_id_unique[i];
                            Onlyobjectglobale ["description"] = descRef[i];
                            Onlyobjectglobale ["value"] = valuRef[i];
                            itemReferences.push(Onlyobjectglobale);
                        }
                        objectglobale["Refs"] = itemReferences;
                        $additional_textPresent != undefined ? objectglobale ["additional_text"] = $additional_textPresent : objectglobale ["additional_text"] = "";
                        saveSlides.push(objectglobale);
                    }

                }

            });

            return saveSlides;

        }
        $(".slides > section:not(.popin)").each(function(){
          	var section 	= $(this),
                slBlock 	= section.find('.sl-block'),
                dataset 	= section[0].dataset;

          	var blockJson = [];

            if(section.hasClass('stack')){

                var childrenSection = section.find('section'),
                    childJson       = [];

                childrenSection.each(function(){
                      var child = $(this),
                          childBlock      = child.find('.sl-block'),
                          childBlockJson = [];


                      getBlockData(childBlock, childBlockJson);
                      childJson.push({
                          "class" 				    : child.attr('class'),
                          "attributes"				: getSectionAttributes(child),
                          "blocks" : childBlockJson
                      });
                });

                data.slides.push({
                        "class" 				    : section.attr('class'),
                        "attributes"				: getSectionAttributes(section),
                        "children": childJson
                   });

            } else {

                getBlockData(slBlock, blockJson);
                data.slides.push({
                        "class" 					: section.attr('class'),
                        "attributes"				:getSectionAttributes(section),
                        "blocks" : blockJson
                  })

            }
        });
        $(".slidespop  section.popin").each(function(){
            var popin 	    = $(this),
                slBlock 	= popin.find('.sl-block');

            var blockJson = [];


                getBlockData(slBlock, blockJson);

                data.popins.push({
                    "class" 		: popin.attr('class'),
                    "attributes"	: getPopinAttributes(popin),
                    "style"         : parseCSSText(popin.attr('style')),
                    "blocks"        : blockJson
                });

        });

        data.references.push(
             preparationRefSection()
        );
        console.log(JSON.stringify(data));
        MJ = Object.create(data);
*/

    var autoHeightSubmenu,
        fontSizeSelectTitleRefContent,
        titleRefContent,
        menuFontTitleRef,
        menuFontNameTitleRef,
        fontSizeSelectTitleRef,
        logoRcpUrl,
        logoHomeUrl,
        logoRefsUrl,
        // logoPresURL,
        bgPresColor,
        bgPresImg,
        bgMenuColor,
        currentItemColor,
        fontMenuColor,
        menuFont,
        menuFontName,
        fontSizeSelect,
        allowSubmenu,
        highlightMenu,
        bgPopupColor,
        bgPopupImg,
        popupWidth,
        popupHeight,
        refWidth,
        refHeight,
        bgRefColor,
        bgRefImg,
        bgPopupOverlayColor,
        bgRefOverlayColor,
        overlayRefOpacity,
        textRefColor,
        bgBtnClose,
        bgScreenImg,
        bgScreenColor,
        projector = $("#params_clm_edidtor");
    $(".slides section").not(".stack").each(function(index, elm) {
        if ($(this).attr("data-trigger-anim-ByClick") == undefined || $(this).attr("data-trigger-anim-ByClick") == "") {
            $(this).attr("data-trigger-anim-ByClick", "false");
        }
    });
    // $(".slides section").each(function(index, elm) {
    //     if ($(this).attr("data-block-left-nav") == undefined || $(this).attr("data-block-left-nav") == "") {
    //         $(this).attr("data-block-left-nav", "false");
    //     }
    //     if ($(this).attr("data-block-right-nav") == undefined || $(this).attr("data-block-right-nav") == "") {
    //         $(this).attr("data-block-right-nav", "false");
    //     }
    // });
    //var cloneSubmenuUL = [];

    setTimeout(function() {
        //console.log(TWIG.cloneSubmenuUL);
        $(".wrapper-submenu ul").not(".has-levelSecond").remove();
        if ($(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").length > 0) {
            $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").removeClass("forbidden-click");
        }
    }, 100);


   /* function scrollToMenuElm(){
        console.log("scrolToMenu Elm");
        $("#get-all-ul .current").removeClass("current");
        if($(".slides").find("#wrapperMenuScroll .current").length == 1){
            var clickMenuIndex = $(".slides").find(".current").index(),
                clickMenuScreenId = $(".slides").find(".menu .current").length > 0 ? $(".slides").find(".menu").attr("id") : $(".slides").find(".wrapper-submenu").attr("id"),
                clickMenuScreenIndexof = generatedIdMenu.indexOf(clickMenuScreenId);

            //console.log(clickMenuScreenId + " / " + clickMenuScreenIndexof);
            //console.log("clickMenuIndex: " + clickMenuIndex + " / clickMenuScreenIndexof:" + clickMenuScreenIndexof);
            $("#" + clickMenuScreenId).promise().done(function(){
                //console.log("Done! " + clickMenuScreenId);
                setTimeout(function(){
                    scrollHMenu[clickMenuScreenIndexof].scrollToElement('li:nth-child(' + clickMenuIndex + ')', 1000);
                }, 300);
            });
        }
        else{
            var clickMenuIndex = new Array();
            clickMenuIndex.push($(".slides").find(".menu .current").index());
            clickMenuIndex.push($(".slides .wrapper-submenu ul.has-levelSecond li").index($("li.current")));
            //console.log("clickMenuIndex menu: " + clickMenuIndex[0] + " / clickMenuIndex submenu: " + clickMenuIndex[1]);

            var clickMenuScreenId = new Array();
            clickMenuScreenId.push($(".slides").find(".menu").attr("id"));
            clickMenuScreenId.push($(".slides").find(".wrapper-submenu").attr("id"));

            var clickMenuScreenIndexof = new Array();
            clickMenuScreenIndexof.push(generatedIdMenu.indexOf(clickMenuScreenId[0]));
            clickMenuScreenIndexof.push(generatedIdMenu.indexOf(clickMenuScreenId[1]));

            //console.log(clickMenuScreenId + " / " + clickMenuScreenIndexof);
            //console.log("clickMenuIndex: " + clickMenuIndex + " / clickMenuScreenIndexof:" + clickMenuScreenIndexof);
            $("#" + clickMenuScreenId[0] + ", #" + clickMenuScreenId[1]).promise().done(function(){
                //console.log("Done! " + clickMenuScreenId);
                setTimeout(function(){

                    scrollHMenu[1].scrollToElement('li:nth-child(' + (clickMenuIndex[0] + 1) + ')', 1000);
                    scrollHMenu[0].scrollToElement('li:nth-child(' + (clickMenuIndex[1] + 1) + ')', 1000);
                }, 300);
            });
        }
    }*/

    function insertIntoCkeditor() {
        var myinstances = [];
        for (var i in CKEDITOR.instances) {
            var clm = myinstances[CKEDITOR.instances[i].name] = CKEDITOR.instances[i].getData();
        }
        var str = document.getElementById('string').value;
        CKEDITOR.instances[i].insertText(str);
    }

    $(document).on("click", ".c_pointer", function() {
        insertIntoCkeditor();
    });

    // $("body").addClass("mini-navbar");  // close menu
    $(document).off("click", ".button.btn-popin-params").on("click", ".button.btn-popin-params", function() {
        $(document).on("click", ".export button.save, .sidebar .button.active", function() {
            $(document).off("click", ".media-library-list .media-library-list-item");
        });
    });

    $(document).off("click", ".button.settings").on("click", ".button.settings", function() {
        if (!$(this).is(".active")) {
            $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").addClass("forbidden-click");
        }

        /* Screen parameters reset */
        // if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color") != "" && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color") != undefined) {
        //     bgScreenColor = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color");
        // } else {
        //     bgScreenColor = undefined;
        // }
        $(".settings.screen-parameters input[type='text']").val("");
        //   data-block-left-nav
        /***************INE*************************************************/
        if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-trigger-anim-ByClick") == "" && SL.editor.controllers.Markup.getCurrentSlide().attr("data-trigger-anim-ByClick") == undefined) {
            $("#trigger_anim_by_click").prop('checked', false);
        } else {
            if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-trigger-anim-ByClick") == "true") {
                $("#trigger_anim_by_click").prop('checked', true);
            } else {
                $("#trigger_anim_by_click").prop('checked', false);
            }
        }

        // if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-left-nav") == "" && SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-left-nav") == undefined) {
        //     $("#Block_Left_nav").prop('checked', false);
        // } else {
        //     if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-left-nav") == "true") {
        //         $("#Block_Left_nav").prop('checked', true);
        //     } else {
        //         $("#Block_Left_nav").prop('checked', false);
        //     }
        // }
        //
        // if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-right-nav") == "" && SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-right-nav") == undefined) {
        //     $("#Block_right_nav").prop('checked', false);
        // } else {
        //     if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-block-right-nav") == "true") {
        //         $("#Block_right_nav").prop('checked', true);
        //     } else {
        //         $("#Block_right_nav").prop('checked', false);
        //     }
        // }


        /*****************************************************************************/
        if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != ""){
            var optionVal = SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance");
            $("#custom-navbar-appearance").val(optionVal).change();
        }
        else{
            $("#custom-navbar-appearance").val("standard").change();
        }

       /* $(document).on("click", ".btn-screen-parameters.settings ", function(){
             var bgPresSize = SL.editor.controllers.Markup.getCurrentSlide().css('background-size');
            if(bgPresSize == "contain"){
                $('#bg-size-screen option[value="contain"]').prop('selected', true)
            }else if (bgPresSize == "cover") {
                $('#bg-size-screen option[value="cover"]').prop('selected', true)
            }else{
                $('#bg-size-screen option[value="initial"]').prop('selected', true)
            }

        });*/
        $(document).on("click", ".settings.screen-parameters button.cancel, .sidebar .button.active", function(){

           /* var bgPresSize = SL.editor.controllers.Markup.getCurrentSlide().css('background-size');
            if(bgPresSize == "contain"){
                $('#bg-size-screen option[value="contain"]').prop('selected', true)
            }else if (bgPresSize == "cover") {
                $('#bg-size-screen option[value="cover"]').prop('selected', true)
            }else{
                $('#bg-size-screen option[value="initial"]').prop('selected', true)
            }*/

            $(document).off("click", ".media-library-list .media-library-list-item");

            if ($(this).is(".active")) {
                $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").removeClass("forbidden-click");
            } else {
                if ($(this).is(".cancel")) {
                    $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").removeClass("forbidden-click");
                }
            }

            /*$(".settings.screen-parameters input[type='text']").val("");
            $(".bg-screen-image").attr("style", "");
            $(".wrapper-bg-screen-image .del-current-bg").remove();
            SL.editor.controllers.Markup.getCurrentSlide().removeAttr("data-bg-img");*/
            // /*SL.editor.controllers.Markup.getCurrentSlide().css({
            //  backgroundImage: bgPresImg != "" ?"url("+ bgPresImg +")" : "none",
            //  backgroundColor: bgPresColor
            //  });*/

            SL.editor.controllers.Markup.getCurrentSlide().css({
                //"background-color": SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color") != undefined ? SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color") : projector.attr("data-bg-pres-color"),
                //"background-image": (SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != "") ? "url(" + SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") + ")" : (projector.attr("data-bg-pres-img") != "" ? "url(" + projector.attr("data-bg-pres-img") + ")" : "none")
            });

            if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != ""){
                SL.editor.controllers.Menu.updateNavbarAppearance(SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance"));
            }
            else{
                SL.editor.controllers.Markup.getCurrentSlide().find(".hide-menu").each(function(index, elm){
                    if($(this).is(".hide-menu")){
                        $(this).removeClass("hide-menu");
                    }
                });
            }
        });

        // setTimeout(function() {

        //     if ($("#bg-screen-color").length > 0) {
        //         var choosenColor;
        //         if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color") == undefined) {
        //             choosenColor = "#ffffff";
        //         } else {
        //             choosenColor = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color");
        //         }
        //         $("#bg-screen-color").spectrum({
        //             showAlpha: true,
        //             color: choosenColor,
        //             flat: !1,
        //             showInput: !0,
        //             showButtons: !0,
        //             showInitial: !0,
        //             showPalette: !1,
        //             showSelectionPalette: !1,
        //             preferredFormat: "hex",
        //             move: function(color) {
        //                 bgScreenColor = color.toRgbString();
        //                 /*SL.editor.controllers.Markup.getCurrentSlide().attr("data-background-color", bgScreenColor);*/
        //                 SL.editor.controllers.Markup.getCurrentSlide().css("background-color", bgScreenColor);
        //                 /*console.log(bgScreenColor);*/
        //             },
        //             change: function(color) {
        //                 bgScreenColor = color.toRgbString();
        //                 /*SL.editor.controllers.Markup.getCurrentSlide().attr("data-background-color", bgScreenColor);*/
        //                 SL.editor.controllers.Markup.getCurrentSlide().css("background-color", bgScreenColor);
        //                 /*console.log(bgScreenColor);*/
        //             }
        //         });
        //     }
        // }, 50);
        // $(document).off("click", "#bg_screen_upload").on("click", "#bg_screen_upload", function() {
        //     // console.log("change");
        //    /* $(".slide-option.background-image").trigger("click");
        //     $(".sl-popup").css("z-index", "40000");
        //     $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function() {
        //         bgScreenImg = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
        //         $(".bg-screen-image").css("background-image", "url(" + bgScreenImg + ")");
        //         $(".bg-screen-image").show();
        //         if ($(".wrapper-bg-screen-image .del-current-bg").length == 0) {
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-screen-image");
        //         }

        //         /!*SL.editor.controllers.Markup.getCurrentSlide().css("background-image", "url("+this.result+")");*!/
        //         SL.editor.controllers.Markup.getCurrentSlide().css({
        //             backgroundImage: "url(" + bgScreenImg + ")",
        //             backgroundSize: "contain",
        //             backgroundRepeat: "no-repeat",
        //             backgroundPosition: "center center"
        //         });
        //     });*/
        //     var currentSlide = Reveal.getCurrentSlide(),
        //         t = Reveal.getIndices(currentSlide),
        //         i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
        //             select: SL.models.Media.IMAGE
        //         });
        //     i.selected.addOnce(function(i) {
        //         bgScreenImg = i.data.url;
        //         $(".bg-screen-image").css("background-image", "url(" + bgScreenImg + ")");
        //         $(".bg-screen-image").show();
        //         if ($(".wrapper-bg-screen-image .del-current-bg").length == 0) {
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-screen-image");
        //             $(this).closest('#customize_screen').find('#bg-size-screen').prop('disabled', false);
        //         }
        //         $(currentSlide).attr('data-bg-img',bgScreenImg),
        //         SL.editor.controllers.Markup.getCurrentSlide().css({
        //             backgroundImage: "url(" + bgScreenImg + ")",
        //             /*backgroundSize: "contain",*/
        //             backgroundRepeat: "no-repeat",
        //             backgroundPosition: "center center"
        //         });
        //     }.bind(this));

        // });
        // $(document).on("click", ".wrapper-bg-screen-image .del-current-bg a", function(e) {
        //     e.preventDefault();
        //     $(this).closest('#customize_screen').find('#bg-size-screen').prop('disabled', true);
        //     $(this).parent(".del-current-bg").remove();
        //     $(".bg-screen-image").removeAttr("style").css("display", "none");
        //     $(".backgrounds .slide-background").removeAttr("style");
        //     /*SL.editor.controllers.Markup.getCurrentSlide().attr("style", "");*/
        //     if (bgPresImg != undefined && bgPresImg != "") {
        //         SL.editor.controllers.Markup.getCurrentSlide().css("background-image", "url(" + bgPresImg + ")");
        //     } else {
        //         if (projector.attr("data-bg-pres-img") != "") {
        //             SL.editor.controllers.Markup.getCurrentSlide().css("background-image", "url(" + projector.attr("data-bg-pres-img") + ")");
        //         } else {
        //             SL.editor.controllers.Markup.getCurrentSlide().css("background-image", "none");
        //         }
        //     }
        //     SL.editor.controllers.Markup.getCurrentSlide().removeAttr("data-bg-img");
        // });
        $(document).off("change", "#custom-navbar-appearance").on("change", "#custom-navbar-appearance", function(){
            var customNavbarAppearance = $(this).find("option:selected").val();
            //console.log(customNavbarAppearance);
            SL.editor.controllers.Menu.updateNavbarAppearance(customNavbarAppearance);
        });

        /* Screen parameters save */
        $(document).off("click", ".settings button.save").on("click", ".settings button.save", function() {

            /*$('#bg-size-screen option').each(function () {
                if ($(this).is(':selected')){
                    var valueBg = $(this).val();
                    var dataScreenBg =  SL.editor.controllers.Markup.getCurrentSlide().attr('data-bg-screen-img');
                    if (dataScreenBg != "" && dataScreenBg != undefined)
                        SL.editor.controllers.Markup.getCurrentSlide().css('background-size', valueBg);
                }
            });*/

            /*$(document).off("click", ".media-library-list .media-library-list-item");
            if ($("#screen-name").val() !== '') {
                var scrennId = SL.editor.controllers.Markup.getCurrentSlide().attr('data-id');
                $('#linktoscreen > option[value='+scrennId+']').text($("#screen-name").val());
            }
            $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").removeClass("forbidden-click");*/
            /*SL.editor.controllers.Markup.getCurrentSlide().attr({
                "data-screen-name": $("#screen-name").val(),
                "data-chapter-name": $("#chapter-name").val(),
                //"data-screen-id": $("#screen-id").val(),
                //"data-key-msg": $("#key-msg").val(),
                //"data-screen-description": $("#screen-description").val(),
                //"data-bg-screen-color": bgScreenColor ? bgScreenColor : null,
                //"data-bg-screen-img": SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img") != undefined ? SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img") : ((SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != "") ? SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") : ""),
                //"data-trigger-anim-ByClick": $("#trigger_anim_by_click").is(":checked"),
                //"data-block-left-nav": $("#Block_Left_nav").is(":checked"),
                //"data-block-right-nav": $("#Block_right_nav").is(":checked"),

                //"data-custom-navbar-appearance": $("#custom-navbar-appearance").find("option:selected").val()
            });*/
           /* if ($(".wrapper-bg-screen-image .del-current-bg a").length == 0) {
                SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img", "");
            }*/
            /*setTimeout(function() {
                SL.editor.controllers.Menu.updateCreatedMenu();
            }, 5);*/
        });

        /* Screen parameters setting */

        if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-screen-name") != undefined) {
            $("#screen-name").val(SL.editor.controllers.Markup.getCurrentSlide().attr("data-screen-name")).change();
        }
        if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-chapter-name") != undefined){
            $("#chapter-name").val(SL.editor.controllers.Markup.getCurrentSlide().attr("data-chapter-name")).change();
        }
        if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-screen-id") != undefined) {
            $("#screen-id").val(SL.editor.controllers.Markup.getCurrentSlide().attr("data-screen-id")).change();
        }
        if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-key-msg") != undefined) {
            $("#key-msg").val(SL.editor.controllers.Markup.getCurrentSlide().attr("data-key-msg")).change();
        }
        if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-screen-description") != undefined) {
            $("#screen-description").val(SL.editor.controllers.Markup.getCurrentSlide().attr("data-screen-description")).change();
        }
        if(Reveal.availableRoutes().up == true){
            //console.log("Chapter name input field is disabled!");
            //$("#chapter-name").attr("disabled", "disabled");
            $("#chapter-name").parent(".inline-box").addClass("hidden");
        }
        else{
            //console.log("Ensabled!");
            if($("#chapter-name").parent(".inline-box").is(".hidden")){
                //$("#chapter-name").removeAttr("disabled");
                $("#chapter-name").parent(".inline-box").removeClass("hidden");
            }
        }

        /* Reset screen bg thumb */

        /*if (SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != "" && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != undefined) {
            $(".bg-screen-image").css({
                backgroundImage: SL.editor.controllers.Markup.getCurrentSlide().attr('data-bg-screen-img') != undefined ? "url(" + SL.editor.controllers.Markup.getCurrentSlide().attr('data-bg-screen-img') + ")" : "none",
                display: "block"
            });
            if($("#customize_screen .wrapper-bg-screen-image .del-current-bg").length == 0){
                $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-screen-image");
            }
        }
        else {
            $("#customize_screen .bg-screen-image").css("display", "none");
            $("#customize_screen .wrapper-bg-screen-image .del-current-bg").remove();
        }*/
    });

    $(document).off("click", ".button.style").on("click", ".button.style", function() {
        setTimeout(function () {

            if ($("#clm_bg_screen .wrapper-bg-pres .bg-pres ").css('display') == "none") {
                $('#clm_bg_screen').find('#bg-size-pres').prop('disabled', true);
            }else {
                $('#clm_bg_screen').find('#bg-size-pres').prop('disabled', false);
            }
        },50)

        if (!$(this).is(".active")) {
            $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").addClass("forbidden-click");
        }

        // if (projector.attr("data-bg-pres-img") != "") {
        //     bgPresImg = projector.attr("data-bg-pres-img");
        // } else {
        //     bgPresImg = "";
        // }

        // if (projector.attr("data-logo-pres-url") != "") {
        //     logoPresURL = projector.attr("data-logo-pres-url");
        // } else {
        //     logoPresURL = "";
        // }


        //reference title
        // if((typeof projector.attr('data-title-ref-content') == "undefined") || (projector.attr('data-title-ref-content') == ""))
        // {
        //     document.getElementById('content-ref-title').value = 'Reference';
        //     $('.projector .reveal-viewport .slides .BlockRef h3').each(function () {
        //         $(this).html('Reference');
        //     })
        // }else{
        //     document.getElementById('content-ref-title').value = projector.attr('data-title-ref-content');
        //     $('.projector .reveal-viewport .slides .BlockRef h3').each(function () {
        //         $(this).html(projector.attr('data-title-ref-content'));
        //     })
        // }

        // logo reference url
        // if ((typeof projector.attr("data-logo-refrs-url") != "undefined") && (projector.attr("data-logo-refrs-url") != "")) {
        //     // logoRefsUrl = projector.attr("data-logo-refrs-url");
        //     $(".edit-pres-wrap .slides .ref-link").empty().append("<img src="+ projector.attr("data-logo-refrs-url") +">");

        //     $('.wrapper-logo-ref .logo-ref-link').css({
        //         'background-image':'url('+ projector.attr("data-logo-refrs-url") +')',
        //         'display' : 'block'
        //     });

        //     if ($(".wrapper-logo-ref .del-current-bg").length == 0) {
        //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-ref-link");
        //     }
        // } else {
        //     // logoRefsUrl = "";
        //     $(".edit-pres-wrap .slides .ref-link").empty().append('<i class="fa fa-stack-exchange"></i>');
        // }
        //logo link-to-home
        // if ((typeof projector.attr("data-logo-home-url") != "undefined") && (projector.attr("data-logo-home-url") != "")){
        //     /* logoHomeUrl = projector.attr('data-logo-home-url');*/
        //     $(".edit-pres-wrap .slides .link-to-home").css("background-image", "url(" + projector.attr('data-logo-home-url') + ")");

        //     $('.wrapper-logo-home .logo-home-link').css({
        //         'background-image':'url('+ projector.attr("data-logo-home-url") +')',
        //         'display' : 'block'
        //     });

        //     if ($(".wrapper-logo-home .del-current-bg").length == 0) {
        //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-home-link");
        //     }
        // }else{
        //     /*logoHomeUrl ="";*/
        //     $(".edit-pres-wrap .slides .link-to-home").css("background-image", "url(/img/picto-home.png)");
        // }
        //logo RCP
        // if ((typeof projector.attr("data-logo-rcp-url") !== "undefined") && (projector.attr("data-logo-rcp-url") !== "")){
        //     // logoRcpUrl =projector.attr('data-logo-rcp-url');
        //     $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append("<img src='" + projector.attr("data-logo-rcp-url") + "' alt='' />");


        //     $('.wrapper-rcp-logo .logo-rcp-link').css({
        //         'background-image':'url('+ projector.attr("data-logo-rcp-url") +')',
        //         'display' : 'block'
        //     });

        //     if ($(".wrapper-rcp-logo .del-current-bg").length == 0) {
        //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-rcp-link");
        //     }
        // }else{
        //     // logoRcpUrl ="";
        //     $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append('<i class="fa fa-rcp"></i>');
        // }

        /* Reset logo thumb */
        // if(projector.attr("data-logo-pres-url") != ""){
        //     $("#customize_appearence .logo-pres").css("background-image", "url("+ projector.attr('data-logo-pres-url') +")").show();
        // }
        // else {
        //     $("#customize_appearence .logo-pres").css("display", "none");
        // }


        /* Reset global bg thumb */
        // if (projector.attr("data-bg-pres-img") != "") {
        //     $(".bg-pres").css({
        //         backgroundImage: "url(" + projector.attr('data-bg-pres-img') + ")",
        //         display: "block"
        //     });
        //     if($("#clm_bg_screen .wrapper-bg-pres .del-current-bg").length == 0){
        //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-pres");
        //     }
        // }
        // else {
        //     $("#clm_bg_screen .bg-pres").css("display", "none");
        // }

        /* Reset pop in bg thumb */
        // if(projector.attr("data-bg-popup-img") != ""){
        //     $.when(
        //         $(".bg-popup").css({
        //             backgroundImage: "url("+ projector.attr('data-bg-popup-img') +")",
        //             display: "block"
        //         })
        //     ).then(function(x) {
        //         if($("#popin_clm .wrapper-bg-popup.popsett .del-current-bg").length == 0){
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter("#popin_clm .bg-popup");
        //         }
        //     });
        // }
        // else {
        //     $("#popin_clm .bg-popup").css("display", "none");
        // }

        /* Reset reference bg thumb */
       /* if (projector.attr("data-bg-ref-img") != "") {
            $(".bg-ref").css({
                backgroundImage: "url(" + projector.attr('data-bg-ref-img') + ")",
                display: "block"
            });
            if($("#reference_apearance .wrapper-bg-ref .del-current-bg").length == 0){
                $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-ref");
            }
        }
        else {
            $("#reference_apearance .bg-ref").css("display", "none");
        }*/

        /* Reset clode icon bg thumb */
        // if (projector.attr("data-bg-btn-close") != "") {
        //     $(".bg-btn-close").css({
        //         backgroundImage: "url(" + projector.attr('data-bg-btn-close') + ")",
        //         display: "block"
        //     });
        //     if($("#main_item .wrapper-bg-btn-close .del-current-bg").length == 0){
        //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-btn-close");
        //     }
        // }
        // else {
        //     $("#main_item .bg-btn-close").css("display", "none");
        // }

        $(document).on("click", ".settings-clm.style button.cancel, .sidebar .button.active", function() {
            if (SL.editor.controllers.Markup.getCurrentSlide().hasClass('popin') === false) {

                $(document).off("click", ".media-library-list .media-library-list-item");

                if ($(this).is(".active")) {
                    $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").removeClass("forbidden-click");
                } else {
                    if ($(this).is(".cancel")) {
                        $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").removeClass("forbidden-click");
                    }
                }

                $(".settings.screen-parameters input[type='text']").val("");
                //$(".slides section").attr("style", "");
                // $(".bg-pres").attr("style", "");
                // $(".wrapper-bg-pres .del-current-bg, .wrapper-bg-popup .del-current-bg, .wrapper-bg-ref .del-current-bg, .wrapper-bg-btn-close .del-current-bg").remove();

                // $(".slides section").each(function(index, elm) {
                //     $(this).css({
                //         "background-color": $(this).attr("data-bg-screen-color") != undefined ? $(this).attr("data-bg-screen-color") : projector.attr("data-bg-pres-color"),
                //         "background-image": ($(this).attr("data-bg-screen-img") != undefined && $(this).attr("data-bg-screen-img") != "") ? "url(" + $(this).attr("data-bg-screen-img") + ")" : (projector.attr("data-bg-pres-img") != "" ? "url(" + projector.attr("data-bg-pres-img") + ")" : "none")
                //     });
                // });

                // $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css({
                //     // "font-family": projector.attr("data-menu-font") != "" ? projector.attr("data-menu-font") : "Montserrat",
                //     "font-size": projector.attr("data-font-size-select") != "" ? projector.attr("data-font-size-select") + "px" : "15px"
                // });

               /* $('.slides .BlockRef h3').css({
                    "font-family": projector.attr("data-menu-font-title-ref") != "" && projector.attr("data-menu-font-title-ref") !== undefined  ? projector.attr("data-menu-font-title-ref") : "Montserrat",
                   // "font-size": projector.attr('data-font-size-title-ref') != "" && projector.attr("data-font-size-title-ref") !== undefined  ? projector.attr('data-font-size-title-ref')+ 'px' : '20'
                });
                $('.slides .BlockRef .wrapper-refs').css({
                    "font-family": projector.attr("data-menu-font-title-ref") != "" && projector.attr("data-menu-font-title-ref") !== undefined  ? projector.attr("data-menu-font-title-ref") : "Montserrat",
                    "font-size": projector.attr('data-font-size-ref-content') != "" && projector.attr("data-font-size-ref-content") !== undefined  ? projector.attr('data-font-size-ref-content')+ 'px' : '20'
                });*/


                // $(".edit-pres-wrap .slides #wrapperMenuScroll").css({
                //     "background-color": projector.attr("data-bg-menu-color") != "" ? projector.attr("data-bg-menu-color") : "#4a5667"
                // });

                // if (projector.attr("data-allow-submenu") != "") {
                //     if (projector.attr("data-allow-submenu") == "true") {
                //         $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("is-hidden");
                //     } else {
                //         $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
                //     }
                // } else {
                //     $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
                // }
                // if (projector.attr("data-allow-submenuwidth") != "") {
                //     if (projector.attr("data-allow-submenuwidth") == "true") {
                //         $(".edit-pres-wrap .slides .wrapper-submenu").addClass("fullWidthSubmenu");
                //     } else {
                //         $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("fullWidthSubmenu");
                //     }
                // } else {
                //     $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("fullWidthSubmenu");
                // }

                // $(".edit-pres-wrap .slides .wrapper-submenu").css({
                //     "background-color": projector.attr("data-bg-menu-color") != "" ? projector.attr("data-bg-menu-color") : "#4a5667"
                // });

                // $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").css({
                //     "color": projector.attr("data-font-menu-color") != "" ? projector.attr("data-font-menu-color") : "#ffffff"
                // });

                // $(".edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").find("a").css({
                //     "color": projector.attr("data-font-menu-color") != "" ? projector.attr("data-font-menu-color") : "#ffffff"
                // });

                // $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
                //     "background-image": projector.attr("data-highlight-menu") != "" ? (projector.attr("data-highlight-menu") == "true" ? "url(/img/selected.png)" : "none") : "none"
                // });

                /*$(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child, .edit-pres-wrap .slides #wrapperMenuScroll:first-child .link-to-home").css({
                 "background-image": projector.attr("data-highlight-menu") != "" ? (projector.attr("data-highlight-menu") == "true" ? "url(/img/picto-home-active.png)" : "url(/img/picto-home.png)") : "url(/img/picto-home.png)"
                 /!*"background-image": projector.attr("data-logo-home-url") != "" && projector.attr("data-logo-home-url") !== undefined  ?  "url(" + projector.attr("data-logo-home-url") + ")" : "url(/img/picto-home.png)"*!/
                 });*/

                // $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css({
                //     "color": projector.attr("data-current-item-color") != "" ? projector.attr("data-current-item-color") : "#3e8787"
                // }).promise().done(function() {
                //     /* Menu update */
                //     //console.log("Done menu!");
                //     updateCreatedMenu(true);
                // });

                // $(".reveal div .BlockRef").css({
                //     "color": projector.attr("data-text-ref-color") != "" ? projector.attr("data-text-ref-color") : "#000000",
                //     "background-color": projector.attr("data-bg-ref-color") != "" ? projector.attr("data-bg-ref-color") : "#ffffff",
                //     "background-image": projector.attr("data-bg-ref-img") != "" ? "url(" + projector.attr("data-bg-ref-img") + ")" : "none",
                //     "width": projector.attr("data-ref-width") != "" ? projector.attr("data-ref-width") : "600px",
                //     "height": projector.attr("data-ref-height") != "" ? projector.attr("data-ref-height") : "300px"
                // });

                /*$(".reveal div .BlockRef .arrow-after").css({
                    "border-top-color": projector.attr("data-bg-ref-color") != "" ? projector.attr("data-bg-ref-color") : "#ffffff"
                });*/

                // $(".reveal div .BlockRef .ref-close-btn").css({
                //     "background-image": projector.attr("data-bg-btn-close") != "" ? "url(" + projector.attr("data-bg-btn-close") + ")" : "url(/img/close_ref.png)"
                //     /*,
                //      "background-color": projector.attr("data-bg-btn-close") != "" ? "transparent" : "grey",
                //      "font-size": projector.attr("data-bg-btn-close") != "" ? "0" : "24px",
                //      "border-radius": projector.attr("data-bg-btn-close") != "" ? "0" : "50%"*/
                // });

                // $(".reveal .BlockRefOverlay").css({
                //     "background-color": projector.attr("data-bg-ref-overlaycolor") != "" ? projector.attr("data-bg-ref-overlaycolor") : "#000000",
                //     "opacity": projector.attr("data-overlay-ref-opacity") != "" ? projector.attr("data-overlay-ref-opacity") : "0.5"
                // });


                /*$(".edit-pres-wrap .slides .logoEADV").css({
                 "background-image": projector.attr("data-logo-pres-url") != "" ? "url("+ projector.attr("data-logo-pres-url") +")": "none"
                 });*/
                // if (projector.attr("data-logo-pres-url") != "") {
                //     $(".edit-pres-wrap .slides .logoEADV").empty().append("<img src='" + projector.attr("data-logo-pres-url") + "' alt='' />");
                // } else {
                //     $(".edit-pres-wrap .slides .logoEADV").empty();
                // }


                //logo refer
                // if( (typeof projector.attr("data-logo-refrs-url") !== "undefined") && (projector.attr("data-logo-refrs-url") !== "")){
                //     $(".edit-pres-wrap .slides .ref-link").empty().append("<img src='" + projector.attr("data-logo-refrs-url") + "' alt='' />");
                // }else {
                //     $(".edit-pres-wrap .slides .ref-link").empty().append('<i class="fa fa-stack-exchange"></i>')
                // }
                //logo rcp
                // if((typeof projector.attr("data-logo-rcp-url") !== "undefined") && (projector.attr("data-logo-rcp-url") !== "")){
                //     $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append("<img src='" + projector.attr("data-logo-rcp-url") + "' alt='' />");
                // }else {
                //     $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append('<i class="fa fa-rcp"></i>')
                // }
                //logo home

                /*if ( (typeof projector.attr('data-logo-home-url') !== "undefined") && (projector.attr('data-logo-home-url') !== "")){

                    $(".edit-pres-wrap .slides .link-to-home").css( "background-image" , "url("+ projector.attr('data-logo-home-url') +")" );
                }else{

                    $(".edit-pres-wrap .slides .link-to-home").css( "background-image" , "url("+ window.location.origin +"/img/picto-home.png)" );
                }

                var bgPresSize = $('.slides section').css('background-size');
                if(bgPresSize == "contain"){
                    $('#bg-size-pres option[value="contain"]').prop('selected', true)
                }else if (bgPresSize == "cover") {
                    $('#bg-size-pres option[value="cover"]').prop('selected', true)
                }else{
                    $('#bg-size-pres option[value="initial"]').prop('selected', true)
                }*/
            }
        });

        $(document).off("click", ".style button.save").on("click", ".style button.save", function() {

            $(document).off("click", ".media-library-list .media-library-list-item");

            $(".sidebar .secondary, .sidebar .primary, .sidebar .container-saideBarbtn").removeClass("forbidden-click");
            //popupWidth = $("#popup_width .stepper-number").val();
            //popupHeight = $("#popup_height .stepper-number").val();
            //refWidth = $("#ref_width .stepper-number").val();
            //refHeight = $("#ref_height .stepper-number").val();
            overlayRefOpacity = parseInt($("#overlay_ref_opacity .stepper-number").val()) / 100;
            /*console.log(bgPresColor + " / " + $("#bg-pres-color").spectrum("get").toRgbString());
             console.log(bgMenuColor + " / " + $("#bg-menu-color").spectrum("get").toRgbString());
             console.log(currentItemColor + " / " + $("#current-item-color").spectrum("get").toRgbString());
             console.log(fontMenuColor + " / " + $("#font-menu-color").spectrum("get").toRgbString());
             console.log(bgPopupColor + " / " + $("#bg-popup-color").spectrum("get").toRgbString());
             console.log(textRefColor + " / " + $("#text-ref-color").spectrum("get").toRgbString());
             console.log(bgRefColor + " / " + $("#bg-ref-color").spectrum("get").toRgbString());
             console.log(bgRefOverlayColor + " / " + $("#bg-ref-overlay-color").spectrum("get").toRgbString());
             console.log(menuFontName + " / " + SL.fonts.FAMILIES[SL.fonts.PACKAGES[$("#menu-font").find("option:selected").attr("data-font").toString()][0]].name);
             console.log(fontSizeSelect + " / " + $("#font-size-select").find("option:selected").val());
             console.log(allowSubmenu + " / " + $("#allow_submenu").is(":checked"));
             console.log(highlightMenu + " / " + $("#allow_submenu").is(":checked"));*/
            //Reference Title
            // var valueOfText = $('#content-ref-title').val();
            // if (valueOfText !== ""){
            //     projector.attr('data-title-ref-content', valueOfText)  ;
            //     $('.projector .reveal-viewport .slides .BlockRef h3').html(valueOfText);
            // }else {
            //     projector.attr('data-title-ref-content', 'Reference')  ;
            //     $('.projector .reveal-viewport .slides .BlockRef h3').html('Reference');
            // }



            projector.attr({
                //"data-allow-submenuWidth": $("#allow_submenuHeight").is(":checked"),
                //"data-font-size-ref-content" : fontSizeSelectTitleRefContent != undefined ? fontSizeSelectTitleRefContent : ($("#font-size-select-ref-content").find("option:selected").val() != "Select font size..." ? $("#font-size-select-ref-content").find("option:selected").val() : "15"),
                //"data-title-ref-content" : titleRefContent,
                //"data-menu-font-title-ref": menuFontTitleRef != undefined ? menuFontTitleRef : SL.fonts.FAMILIES[SL.fonts.PACKAGES[$("#menu-font-ref").find("option:selected").attr("data-font").toString()][0]].name,
                //"data-menu-font-name-title-ref": menuFontNameTitleRef != undefined ? menuFontNameTitleRef : $("#menu-font-ref").find("option:selected").attr("data-name"),
                //"data-font-size-title-ref": fontSizeSelectTitleRef != undefined ? fontSizeSelectTitleRef : ($("#font-size-select-ref").find("option:selected").val() != "Select font size..." ? $("#font-size-select-ref").find("option:selected").val() : "15"),
                //"data-logo-rcp-url" : logoRcpUrl,
                //"data-logo-home-url": logoHomeUrl,
                //"data-logo-refrs-url": logoRefsUrl,
                // "data-logo-pres-url": logoPresURL,
                // "data-bg-pres-img": bgPresImg,
                // "data-bg-pres-color": bgPresColor != undefined ? bgPresColor : $("#bg-pres-color").spectrum("get").toRgbString(),
                // "data-bg-menu-color": bgMenuColor != undefined ? bgMenuColor : $("#bg-menu-color").spectrum("get").toRgbString(),
                // "data-font-menu-color": fontMenuColor != undefined ? fontMenuColor : $("#font-menu-color").spectrum("get").toRgbString(),
                // "data-menu-font": menuFont != undefined ? menuFont : SL.fonts.FAMILIES[SL.fonts.PACKAGES[$("#menu-font").find("option:selected").attr("data-font").toString()][0]].name,
                // "data-menu-fontname": menuFontName != undefined ? menuFontName : $("#menu-font").find("option:selected").attr("data-name"),
                //"data-font-size-select": fontSizeSelect != undefined ? fontSizeSelect : ($("#font-size-select").find("option:selected").val() != "Select font size..." ? $("#font-size-select").find("option:selected").val() : "15"),
                //"data-current-item-color": currentItemColor != undefined ? currentItemColor : $("#current-item-color").spectrum("get").toRgbString(),
                //"data-allow-submenu": $("#allow_submenu").is(":checked"),
                //"data-highlight-menu": $("#highlight_menu").is(":checked"),
                //"data-bg-popup-color": bgPopupColor != undefined ? bgPopupColor : $("#bg-popup-color").spectrum("get").toRgbString(),
                //"data-bg-popup-img": bgPopupImg,
                //"data-popup-width": popupWidth,
                //"data-popup-height": popupHeight,
                //"data-ref-width": refWidth,
                //"data-ref-height": refHeight,
                //"data-bg-ref-color": bgRefColor != undefined ? bgRefColor : $("#bg-ref-color").spectrum("get").toRgbString(),
                //"data-bg-ref-img": bgRefImg,
                //"data-bg-ref-overlaycolor": bgRefOverlayColor != undefined ? bgRefOverlayColor : $("#bg-ref-overlay-color").spectrum("get").toRgbString(),
                "data-overlay-ref-opacity": overlayRefOpacity
                //"data-text-ref-color": textRefColor != undefined ? textRefColor : $("#text-ref-color").spectrum("get").toRgbString()
                // "data-bg-btn-close": bgBtnClose
            });

            // $(".slides section").each(function(index, elm) {
            //     $(this).css({
            //         "background-color": $(this).attr("data-bg-screen-color") != undefined ? $(this).attr("data-bg-screen-color") : projector.attr("data-bg-pres-color"),
            //         "background-image": ($(this).attr("data-bg-screen-img") != undefined && $(this).attr("data-bg-screen-img") != "") ? "url(" + $(this).attr("data-bg-screen-img") + ")" : (projector.attr("data-bg-pres-img") != "" ? "url(" + projector.attr("data-bg-pres-img") + ")" : "none")
            //     });
            // });

            // if($('#background-pres-size-strech').is(':checked')){
            //     $('.slides section').css('background-size', 'cover');
            // }else if($('#background-pres-size-fit').is(':checked')){
            //     $('.slides section').css('background-size', 'contain');
            // }else{
            //     $('.slides section').css('background-size', 'initial');
            // }
            // $('#bg-size-pres option').each(function () {
            //     if ($(this).is(':selected')){
            //         var valueBg = $(this).val();
            //         $('.slides section').each(function () {
            //             var that = $(this);
            //             var bg = that.attr("data-bg-screen-img");
            //             if ((bg == "") ||(bg == undefined)){
            //                 that.css('background-size', valueBg)
            //             }
            //         });
            //     }
            // });

        });


        /* Edit navbar */


        setTimeout(function() {
            // if (menuFont == undefined && projector.attr("data-menu-font") == "") {
            //     //console.log("index montserrat: " + index);
            //     var optionVal;
            //     $("#menu-font option").each(function(index, elm) {
            //         if ($(this).val() == "Montserrat") {
            //             optionVal = $(this).val();
            //         }
            //     });
            //     $("#menu-font").val(optionVal).trigger('change');
            // } else {
            //     //console.log("index News: " + index);
            //     var optionVal;
            //     if (projector.attr("data-menu-font") != "") {
            //         optionVal = projector.attr("data-menu-fontname");
            //     } else {
            //         optionVal = "Montserrat";
            //     }
            //     //console.log("optionVal: " + optionVal);
            //     $("#menu-font").val(optionVal).trigger('change');
            // }

            // if (fontSizeSelect == undefined && projector.attr("data-font-size-select") == "") {
            //     var optionVal;
            //     $("#font-size-select").each(function(index, elm) {
            //         if ($(this).val() == "Select font size...") {
            //             optionVal = $(this).val();
            //         }
            //     });
            //     $("#font-size-select").val(optionVal).trigger('change');
            // } else {
            //     var optionVal;
            //     if (projector.attr("data-font-size-select") != "") {
            //         optionVal = projector.attr("data-font-size-select");
            //         if ($("#font-size-select option[value=" + projector.attr("data-font-size-select") + "]").length == 1) {
            //             optionVal = projector.attr("data-font-size-select");
            //         } else {
            //             optionVal = "Select font size...";
            //         }
            //     } else {
            //         optionVal = "Select font size...";
            //     }
            //     //console.log("optionVal: " + optionVal);
            //     $("#font-size-select").val(optionVal).trigger('change');
            // }

            //Font title Reference
            // if( menuFontTitleRef == undefined && projector.attr("data-menu-font-title-ref") == undefined &&  projector.attr('data-menu-font-title-ref') == ""){
            //     //console.log("index montserrat: " + index);
            //     var OptionFontTitle;
            //     $("#menu-font-ref option").each(function(index, elm) {
            //         if ($(this).val() == "Montserrat") {
            //             OptionFontTitle = $(this).val();
            //         }
            //     });
            //     $("#menu-font-ref").val(OptionFontTitle).trigger('change');
            // } else {
            //     //console.log("index News: " + index);
            //     var OptionFontTitle;
            //     if ( projector.attr("data-menu-font-title-ref")!= undefined && projector.attr("data-menu-font-title-ref") != "") {
            //         OptionFontTitle = projector.attr("data-menu-font-name-title-ref");
            //     } else {
            //         OptionFontTitle = "Montserrat";
            //     }
            //     //console.log("optionVal: " + optionVal);
            //     $("#menu-font-ref").val(OptionFontTitle).trigger('change');
            // }
            //Font size Title Ref
            // if (fontSizeSelectTitleRef == undefined && projector.attr('data-font-size-title-ref') == ""){

            //     var sizeTitleRef;
            //     $("#font-size-select-ref").each(function() {
            //         if ($(this).val() == "Select font size...") {
            //             sizeTitleRef = $(this).val();
            //         }
            //     });
            //     $("#font-size-select-ref").val(sizeTitleRef).trigger('change');
            // }else {
            //     var sizeTitleRef;
            //     if (projector.attr('data-font-size-title-ref') != ""){
            //         sizeTitleRef = projector.attr('data-font-size-title-ref');
            //         if($('#font-size-select-ref option[value = ' +projector.attr('data-font-size-title-ref')+']').length == 1){
            //             sizeTitleRef = projector.attr('data-font-size-title-ref');
            //         }else {
            //             sizeTitleRef = "Select font size...";
            //         }
            //     }else{
            //         sizeTitleRef = "Select font size...";
            //     }
            //     $('#font-size-select-ref').val(sizeTitleRef).trigger('change');
            // }

            //font size Content Ref
           /* if (fontSizeSelectTitleRefContent == undefined && projector.attr('data-font-size-ref-content') == ""){

                var sizeTitleRefContent;
                $("#font-size-select-ref-content").each(function() {
                    if ($(this).val() == "Select font size...") {
                        sizeTitleRefContent = $(this).val();
                    }
                });
                $("#font-size-select-ref-content").val(sizeTitleRefContent).trigger('change');
            }else {
                var sizeTitleRefContent;
                if (projector.attr('data-font-size-ref-content') != ""){
                    sizeTitleRef = projector.attr('data-font-size-ref-content');
                    if($('#font-size-select-ref-content option[value = ' +projector.attr('data-font-size-ref-content')+']').length == 1){
                        sizeTitleRefContent = projector.attr('data-font-size-ref-content');
                    }else {
                        sizeTitleRefContent = "Select font size...";
                    }
                }else{
                    sizeTitleRefContent = "Select font size...";
                }
                $('#font-size-select-ref-content').val(sizeTitleRefContent).trigger('change');
            }*/


            // if (allowSubmenu == undefined && projector.attr("data-allow-submenu") == "") {
            //     $("#allow_submenu").prop('checked', false);
            //     $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
            //     $("#allow_submenuHeight").parents('.sl-checkbox').addClass('notAllowedCheck');
            // } else {
            //     if (projector.attr("data-allow-submenu") != "") {
            //         if (projector.attr("data-allow-submenu") == "true") {
            //             $("#allow_submenu").prop('checked', true);
            //             $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("is-hidden");
            //             $("#allow_submenuHeight").parents('.sl-checkbox').removeClass('notAllowedCheck');
            //         } else {
            //             $("#allow_submenu").prop('checked', false);
            //             $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
            //             $("#allow_submenuHeight").parents('.sl-checkbox').addClass('notAllowedCheck');
            //         }
            //     } else {
            //         $("#allow_submenu").prop('checked', false);
            //         $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
            //         $("#allow_submenuHeight").parents('.sl-checkbox').addClass('notAllowedCheck');
            //     }
            // }

            // if( autoHeightSubmenu  == undefined && projector.attr('data-allow-submenuWidth') == ""){
            //         $("#allow_submenuHeight").prop('checked', false);
            //         $("#wrapperMenuScroll .wrapper-submenu").removeClass("fullWidthSubmenu");
            // }else{
            //     if (projector.attr("data-allow-submenuWidth") != "") {
            //         if (projector.attr("data-allow-submenuWidth") == "true") {
            //             $("#allow_submenuHeight").prop('checked', true);
            //             $("#wrapperMenuScroll .wrapper-submenu").addClass("fullWidthSubmenu");
            //         } else {
            //             $("#allow_submenuHeight").prop('checked', false);
            //             $("#wrapperMenuScroll .wrapper-submenu").removeClass("fullWidthSubmenu");
            //         }
            //     } else {
            //         $("#allow_submenuHeight").prop('checked', false);
            //         $("#wrapperMenuScroll .wrapper-submenu").removeClass("fullWidthSubmenu");

            //     }
            // }

            // if (highlightMenu == undefined && projector.attr("data-highlight-menu") == "") {
            //     $("#highlight_menu").prop('checked', false);
            //     $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
            //         "background-image": "none"
            //     });

            //     /* $(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child, .edit-pres-wrap .slides #wrapperMenuScroll:first-child .link-to-home").css({
            //      "background-image": "url(/img/picto-home.png)"
            //      });*/
            // } else {
            //     if (projector.attr("data-highlight-menu") != "") {
            //         if (projector.attr("data-highlight-menu") == "true") {
            //             $("#highlight_menu").prop('checked', true);
            //             $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
            //                 "background-image": "url(/img/selected.png)"
            //             });

            //             /* $(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child, .edit-pres-wrap .slides #wrapperMenuScroll:first-child .link-to-home").css({
            //              "background-image": "url(/img/picto-home-active.png)"
            //              });*/
            //         } else {
            //             $("#highlight_menu").prop('checked', false);
            //             $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
            //                 "background-image": "none"
            //             });

            //             /*$(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child, .edit-pres-wrap .slides #wrapperMenuScroll:first-child .link-to-home").css({
            //              "background-image": "url(/img/picto-home.png)"
            //              });*/
            //         }
            //     } else {
            //         optionVal = false;
            //         $("#highlight_menu").prop('checked', false);
            //         $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
            //             "background-image": "none"
            //         });

            //         /* $(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child, .edit-pres-wrap .slides #wrapperMenuScroll:first-child .link-to-home").css({
            //          "background-image": "url(/img/picto-home.png)"
            //          });*/
            //     }
            // }
        }, 50);


        // $(document).off("change", "#menu-font").on("change", "#menu-font", function() {
        //     var dataFont,
        //         fontName;
        //     dataFont = $(this).find("option:selected").attr("data-font");
        //     fontName = SL.fonts.PACKAGES[dataFont.toString()][0];
        //     //console.log(SL.fonts.FAMILIES[fontName].name);
        //     menuFont = SL.fonts.FAMILIES[fontName].name;
        //     menuFontName = $(this).find("option:selected").attr("data-name");
        //     $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css("font-family", menuFont).promise().done(function() {
        //         /* Menu update */
        //         //console.log("Done menu!");
        //         updateCreatedMenu(true);

        //         /*var clickMenuIndexChange = SL.editor.controllers.Markup.getCurrentSlide().find(".current").index(),
        //             clickMenuScreenIdChange = SL.editor.controllers.Markup.getCurrentSlide().find(".menu .current").length > 0 ? SL.editor.controllers.Markup.getCurrentSlide().find(".menu").attr("id") : SL.editor.controllers.Markup.getCurrentSlide().find(".wrapper-submenu").attr("id"),
        //             clickMenuScreenIndexofChange = generatedIdMenu.indexOf(clickMenuScreenIdChange);

        //         $("#" + clickMenuScreenIdChange).promise().done(function() {
        //             setTimeout(function() {
        //                 scrollHMenu[clickMenuScreenIndexofChange].scrollToElement('li:nth-child(' + clickMenuIndexChange + ')', 1000);
        //             }, 300);
        //         });*/
        //         setTimeout(function(){
        //             scrollToMenuElm();
        //         }, 100);
        //     });
        // });
        // $(document).off("change", "#font-size-select").on("change", "#font-size-select", function() {
        //     var optionValSize;
        //     optionValSize = $(this).find("option:selected").val();
        //     //console.log(optionValSize);
        //     fontSizeSelect = optionValSize != "Select font size..." ? optionValSize : "15";
        //     $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css("font-size", (optionValSize != "Select font size..." ? optionValSize : "15") + "px").promise().done(function() {
        //         /* Menu update */
        //         //console.log("Done menu!");
        //         setTimeout(function(){
        //             scrollToMenuElm();
        //         }, 100);
        //     });

        //     /*var clickMenuIndexChange = SL.editor.controllers.Markup.getCurrentSlide().find(".current").index(),
        //         clickMenuScreenIdChange = SL.editor.controllers.Markup.getCurrentSlide().find(".menu .current").length > 0 ? SL.editor.controllers.Markup.getCurrentSlide().find(".menu").attr("id") : SL.editor.controllers.Markup.getCurrentSlide().find(".wrapper-submenu").attr("id"),
        //         clickMenuScreenIndexofChange = generatedIdMenu.indexOf(clickMenuScreenIdChange);

        //     $("#" + clickMenuScreenIdChange).promise().done(function() {
        //         setTimeout(function() {
        //             scrollHMenu[clickMenuScreenIndexofChange].scrollToElement('li:nth-child(' + clickMenuIndexChange + ')', 1000);
        //         }, 300);
        //     });*/
        //     scrollToMenuElm();
        // });

        //font family title Refs
        // $(document).off("change", "#menu-font-ref").on("change", "#menu-font-ref", function() {
        //     var dataFontTitle,
        //         fontNameTitle;
        //     dataFontTitle = $(this).find("option:selected").attr("data-font");
        //     fontNameTitle = SL.fonts.PACKAGES[dataFontTitle.toString()][0];
        //     menuFontTitleRef = SL.fonts.FAMILIES[fontNameTitle].name;
        //     menuFontNameTitleRef = $(this).find("option:selected").attr("data-name");
        //     $('.projector .reveal-viewport .slides .BlockRef h3').css("font-family", menuFontTitleRef).promise().done(function() {
        //         updateCreatedMenu(true);
        //     });
        //     $('.projector .reveal-viewport .slides .BlockRef .wrapper-refs ').css("font-family", menuFontTitleRef).promise().done(function() {
        //         updateCreatedMenu(true);
        //     });
        // });
        //Font size Reference title
        // $(document).off('change' , '#font-size-select-ref').on('change', '#font-size-select-ref', function(){
        //     var optionValChange;
        //     optionValChange = $(this).find('option:selected').val();
        //     fontSizeSelectTitleRef = optionValChange != "Select font size..." ? optionValChange : "20";
        //     $('.projector .reveal-viewport .slides .BlockRef h3').css("font-size", (optionValChange != "Select font size..." ? optionValChange : "20") + "px").promise().done(function() {
        //         updateCreatedMenu(true);
        //     });
        // });

        //Font size Reference content
        /*$(document).off('change' , '#font-size-select-ref-content').on('change', '#font-size-select-ref-content', function(){
            var valueContent;
            valueContent = $(this).find('option:selected').val();
            fontSizeSelectTitleRefContent = valueContent != "Select font size..." ? valueContent : "20";
            $('.projector .reveal-viewport .slides .BlockRef .wrapper-refs ').css("font-size", (valueContent != "Select font size..." ? valueContent : "20") + "px").promise().done(function() {
                updateCreatedMenu(true);
            });
        });*/

        // $(document).off("change", "#allow_submenu").on("change", "#allow_submenu", function() {
        //     allowSubmenu = $(this).is(":checked");
        //     if (allowSubmenu == true) {
        //         $('#allow_submenuHeight').prop("disabled", false);
        //         $('#allow_submenuHeight').parents('.sl-checkbox').removeClass('notAllowedCheck');
        //         $(".edit-pres-wrap .slides .wrapper-submenu").removeClass("is-hidden");
        //     } else {
        //         $(".edit-pres-wrap .slides .wrapper-submenu").addClass("is-hidden");
        //         $('#allow_submenuHeight').prop("disabled", true);
        //         $('#allow_submenuHeight').parents('.sl-checkbox').addClass('notAllowedCheck');
        //     }
        // });
        // $(document).off("change", "#allow_submenuHeight").on("change", "#allow_submenuHeight", function() {
        //     autoHeightSubmenu = $(this).is(":checked");
        //     if (autoHeightSubmenu == true) {
        //         $("#wrapperMenuScroll .wrapper-submenu").addClass("fullWidthSubmenu");
        //     } else {
        //         $("#wrapperMenuScroll .wrapper-submenu").removeClass("fullWidthSubmenu");
        //     }
        //     updateCreatedMenu(true);
        // });
        // $(document).off("change", "#highlight_menu").on("change", "#highlight_menu", function() {
        //     highlightMenu = $(this).is(":checked");
        //     //console.log(highlightMenu);
        //     if (highlightMenu == true) {
        //         $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
        //             "background-image": "url(/img/selected.png)"
        //         });

        //         /*$(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child, .edit-pres-wrap .slides #wrapperMenuScroll:first-child .link-to-home").css({
        //          "background-image": "url(/img/picto-home-active.png)"
        //          });*/
        //     } else {
        //         $(".edit-pres-wrap .slides .menu .maxMenu li.current, .edit-pres-wrap .slides .wrapper-submenu ul li.current").css({
        //             "background-image": "none"
        //         });

        //         /*$(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child, .edit-pres-wrap .slides #wrapperMenuScroll:first-child .link-to-home").css({
        //          "background-image": "url(/img/picto-home.png)"
        //          });*/
        //     }
        // });


        setTimeout(function() {
            // $('#popup_width').stepper({
            //     selectorProgressBar: '.stepper-progress',
            //     selectorInputNumber: '.stepper-number',
            //     classNameChanging: 'is-changing',
            //     decimals: 0,
            //     unit: 'px',
            //     initialValue: init_popup_w,
            //     min: min_popup_w,
            //     max: max_popup_w,
            //     stepSize: 1
            // });

            // if (popupWidth == undefined && projector.attr("data-popup-width") == "") {
            //     var optionVal = init_popup_w + "px";
            //     var scalex_w = ((init_popup_w - min_popup_w) * 100) / (max_popup_w - min_popup_w);
            //     $('#popup_width .stepper-progress').css('transform', 'scaleX(' + scalex_w / 100 + ')');
            //     $("#popup_width input").val(optionVal).trigger("change");
            // } else {
            //     var optionVal;
            //     if (projector.attr("data-popup-width") != "") {
            //         optionVal = projector.attr("data-popup-width");
            //     } else {
            //         optionVal = init_popup_w + "px";
            //     }
            //     //console.log("optionVal: " + optionVal);
            //     $("#popup_width input").val(optionVal).trigger("change");
            // }

            // $('#popup_height').stepper({
            //     selectorProgressBar: '.stepper-progress',
            //     selectorInputNumber: '.stepper-number',
            //     classNameChanging: 'is-changing',
            //     decimals: 0,
            //     unit: 'px',
            //     initialValue: init_popup_h,
            //     min: min_popup_h,
            //     max: max_popup_h,
            //     stepSize: 1
            // });

            // if (popupHeight == undefined && projector.attr("data-popup-height") == "") {
            //     var optionVal = init_popup_h + "px";
            //     var scalex_h = init_popup_h / max_popup_h;
            //     $('#popup_height .stepper-progress').css('transform', 'scaleX(' + scalex_h + ')');
            //     $("#popup_height input").val(optionVal).trigger("change");
            // } else {
            //     var optionVal;
            //     if (projector.attr("data-popup-height") != "") {
            //         optionVal = projector.attr("data-popup-height");
            //     } else {
            //         optionVal = init_popup_h + "px";
            //     }
            //     //console.log("optionVal: " + optionVal);
            //     $("#popup_height input").val(optionVal).trigger("change");
            // }

            // $('#ref_width').stepper({
            //     selectorProgressBar: '.stepper-progress',
            //     selectorInputNumber: '.stepper-number',
            //     classNameChanging: 'is-changing',
            //     decimals: 0,
            //     unit: 'px',
            //     initialValue: 600,
            //     min: 300,
            //     max: 900,
            //     stepSize: 1
            // });

            // $(document).off('change', '#ref_width input[type="text"]').on('change', '#ref_width input[type="text"]', function() {
            //     $(".reveal div .BlockRef").css("width", $(this).val());
            // });

            // if (refWidth == undefined && projector.attr("data-ref-width") == "") {
            //     var optionVal = "600px";
            //     $("#ref_width input").val(optionVal).trigger("change");
            // } else {
            //     var optionVal;
            //     if (projector.attr("data-ref-width") != "") {
            //         optionVal = projector.attr("data-ref-width");
            //     } else {
            //         optionVal = "600px";
            //     }
            //     //console.log("optionVal: " + optionVal);
            //     $("#ref_width input").val(optionVal).trigger("change");
            // }

            // $('#ref_height').stepper({
            //     selectorProgressBar: '.stepper-progress',
            //     selectorInputNumber: '.stepper-number',
            //     classNameChanging: 'is-changing',
            //     decimals: 0,
            //     unit: 'px',
            //     initialValue: 310,
            //     min: 300,
            //     max: 600,
            //     stepSize: 1
            // });

            // $(document).off('change', '#ref_height input[type="text"]').on('change', '#ref_height input[type="text"]', function() {
            //     $(".reveal div .BlockRef").css("height", $(this).val());
            // });

            // if (refHeight == undefined && projector.attr("data-ref-height") == "") {
            //     var optionVal = "310px";
            //     $("#ref_height input").val(optionVal).trigger("change");
            // } else {
            //     var optionVal;
            //     if (projector.attr("data-ref-height") != "") {
            //         optionVal = projector.attr("data-ref-height");
            //     } else {
            //         optionVal = "310px";
            //     }
            //     //console.log("optionVal: " + optionVal);
            //     $("#ref_height input").val(optionVal).trigger("change");
            // }

            $('#overlay_popup_opacity').stepper({
                selectorProgressBar: '.stepper-progress',
                selectorInputNumber: '.stepper-number',
                classNameChanging: 'is-changing',
                decimals: 0,
                unit: '%',
                initialValue: null,
                min: 0,
                max: 100,
                stepSize: 1
            });
            $('#overlay_ref_opacity').stepper({
                selectorProgressBar: '.stepper-progress',
                selectorInputNumber: '.stepper-number',
                classNameChanging: 'is-changing',
                decimals: 0,
                unit: '%',
                //initialValue: 50,
                initialValue: 100,
                min: 0,
                max: 100,
                stepSize: 1
            });

            $(document).off('change', '#overlay_ref_opacity input[type="text"]').on('change', '#overlay_ref_opacity input[type="text"]', function() {
                $(".reveal .BlockRefOverlay").css("opacity", (parseInt($(this).val()) / 100));
            });

            /*if (overlayRefOpacity == undefined && projector.attr("data-overlay-ref-opacity") == "") {
                var optionVal = 50;
                $("#overlay_ref_opacity input").val(optionVal).trigger("change");
            } else {
                var optionVal;
                if (projector.attr("data-overlay-ref-opacity") != "") {
                    optionVal = parseFloat(projector.attr("data-overlay-ref-opacity")) * 100;
                } else {
                    optionVal = 50;
                }
                //console.log("optionVal: " + optionVal);
                $("#overlay_ref_opacity input").val(optionVal).trigger("change");
            }*/

            // if ($("#bg-pres-color").length > 0) {
            //     var choosenColor;
            //     if (bgPresColor == undefined && projector.attr("data-bg-pres-color") == "") {
            //         choosenColor = "#ffffff";
            //     } else {
            //         if (projector.attr("data-bg-pres-color") != "") {
            //             choosenColor = projector.attr("data-bg-pres-color");
            //         } else {
            //             choosenColor = "#ffffff";
            //         }
            //     }
            //     $("#bg-pres-color").spectrum({
            //         showAlpha: true,
            //         color: choosenColor,
            //         flat: !1,
            //         showInput: !0,
            //         showButtons: !0,
            //         showInitial: !0,
            //         showPalette: !1,
            //         showSelectionPalette: !1,
            //         preferredFormat: "hex",
            //         move: function(color) {
            //             bgPresColor = color.toRgbString();
            //             //$(".projector .reveal-viewport").css("background-color", bgPresColor);
            //             $(".slides section").css("background-color", bgPresColor);
            //             //console.log(bgPresColor);
            //         },
            //         change: function(color) {
            //             bgPresColor = color.toRgbString();
            //             //$(".projector .reveal-viewport").css("background-color", bgPresColor);
            //             $(".slides section").css("background-color", bgPresColor);
            //             //console.log(bgPresColor);
            //         }
            //     });
            // }
            /*if($("#bg-pres-color").length > 0){
             var choosenColor;
             if(bgPresColor == undefined && projector.attr("data-bg-pres-color") == ""){
             choosenColor = "#ffffff";
             }
             else{
             if(projector.attr("data-bg-pres-color") != ""){
             choosenColor = projector.attr("data-bg-pres-color");
             }
             else{
             choosenColor = "#ffffff";
             }
             }
             $('#bg-pres-color').ColorPicker({
             color: choosenColor,
             onShow: function (colpkr) {
             $(colpkr).fadeIn(500);
             return false;
             },
             onHide: function (colpkr) {
             $(colpkr).fadeOut(500);
             return false;
             },
             onChange: function (hsb, hex, rgb) {
             $('#bg-pres-color div').css('backgroundColor', 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
             bgPresColor = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
             //$(".projector .reveal-viewport").css("background-color", bgPresColor);
             $(".slides section").css("background-color", bgPresColor);
             //console.log(bgPresColor);
             }
             });
             }*/
            // if ($("#bg-menu-color").length > 0) {
            //     var choosenColor;
            //     if (bgMenuColor == undefined && projector.attr("data-bg-menu-color") == "") {
            //         choosenColor = "#4a5667";
            //     } else {
            //         if (projector.attr("data-bg-menu-color") != "") {
            //             choosenColor = projector.attr("data-bg-menu-color");
            //         } else {
            //             choosenColor = "#4a5667";
            //         }
            //     }
            //     $("#bg-menu-color").spectrum({
            //         showAlpha: true,
            //         color: choosenColor,
            //         flat: !1,
            //         showInput: !0,
            //         showButtons: !0,
            //         showInitial: !0,
            //         showPalette: !1,
            //         showSelectionPalette: !1,
            //         preferredFormat: "hex",
            //         move: function(color) {
            //             bgMenuColor = color.toRgbString();
            //             /*console.log(bgMenuColor);*/
            //             $(".edit-pres-wrap .slides #wrapperMenuScroll").css("background-color", bgMenuColor);
            //             $(".edit-pres-wrap .slides .wrapper-submenu").css("background-color", bgMenuColor);
            //         },
            //         change: function(color) {
            //             bgMenuColor = color.toRgbString();
            //             /*console.log(bgMenuColor);*/
            //             $(".edit-pres-wrap .slides #wrapperMenuScroll").css("background-color", bgMenuColor);
            //             $(".edit-pres-wrap .slides .wrapper-submenu").css("background-color", bgMenuColor);
            //         }
            //     });
            //}
            // if ($("#current-item-color").length > 0) {
            //     var choosenColor;
            //     if (currentItemColor == undefined && projector.attr("data-current-item-color") == "") {
            //         choosenColor = "#3e8787";
            //     } else {
            //         if (projector.attr("data-current-item-color") != "") {
            //             choosenColor = projector.attr("data-current-item-color");
            //         } else {
            //             choosenColor = "#3e8787";
            //         }
            //     }
            //     $("#current-item-color").spectrum({
            //         showAlpha: true,
            //         color: choosenColor,
            //         flat: !1,
            //         showInput: !0,
            //         showButtons: !0,
            //         showInitial: !0,
            //         showPalette: !1,
            //         showSelectionPalette: !1,
            //         preferredFormat: "hex",
            //         move: function(color) {
            //             currentItemColor = color.toRgbString();
            //             /*console.log(currentItemColor);*/
            //             $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css("color", currentItemColor);
            //         },
            //         change: function(color) {
            //             currentItemColor = color.toRgbString();
            //             /*console.log(currentItemColor);*/
            //             $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css("color", currentItemColor);
            //         }
            //     });
            // }
            // if ($("#font-menu-color").length > 0) {
            //     var choosenColor;
            //     if (fontMenuColor == undefined && projector.attr("data-font-menu-color") == "") {
            //         choosenColor = "#ffffff";
            //     } else {
            //         if (projector.attr("data-font-menu-color") != "") {
            //             choosenColor = projector.attr("data-font-menu-color");
            //         } else {
            //             choosenColor = "#ffffff";
            //         }
            //     }
            //     $("#font-menu-color").spectrum({
            //         showAlpha: true,
            //         color: choosenColor,
            //         flat: !1,
            //         showInput: !0,
            //         showButtons: !0,
            //         showInitial: !0,
            //         showPalette: !1,
            //         showSelectionPalette: !1,
            //         preferredFormat: "hex",
            //         move: function(color) {
            //             fontMenuColor = color.toRgbString();
            //             /*console.log(fontMenuColor);*/
            //             $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").css("color", fontMenuColor);
            //             $(".edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").find("a").css("color", fontMenuColor);
            //         },
            //         change: function(color) {
            //             fontMenuColor = color.toRgbString();
            //             /*console.log(fontMenuColor);*/
            //             $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").css("color", fontMenuColor);
            //             $(".edit-pres-wrap .slides .wrapper-submenu ul li").not(".current").find("a").css("color", fontMenuColor);
            //         }
            //     });
            // }
            // if ($("#bg-popup-color").length > 0) {
            //     var choosenColor;
            //     if (bgPopupColor == undefined && projector.attr("data-bg-popup-color") == "") {
            //         choosenColor = "#ffffff";
            //     } else {
            //         if (projector.attr("data-bg-popup-color") != "") {
            //             choosenColor = projector.attr("data-bg-popup-color");
            //         } else {
            //             choosenColor = "#ffffff";
            //         }
            //     }
            //     $("#bg-popup-color").spectrum({
            //         showAlpha: true,
            //         color: choosenColor,
            //         flat: !1,
            //         showInput: !0,
            //         showButtons: !0,
            //         showInitial: !0,
            //         showPalette: !1,
            //         showSelectionPalette: !1,
            //         preferredFormat: "hex",
            //         move: function(color) {
            //             bgPopupColor = color.toRgbString();
            //             /*console.log(bgPopupColor);*/
            //         },
            //         change: function(color) {
            //             bgPopupColor = color.toRgbString();
            //             /*console.log(bgPopupColor);*/
            //         }
            //     });
            // }
            // if ($("#bg-ref-color").length > 0) {
            //     var choosenColor;
            //     if (bgRefColor == undefined && projector.attr("data-bg-ref-color") == "") {
            //         choosenColor = "#ffffff";
            //     } else {
            //         if (projector.attr("data-bg-ref-color") != "") {
            //             choosenColor = projector.attr("data-bg-ref-color");
            //         } else {
            //             choosenColor = "#ffffff";
            //         }
            //     }
            //     $("#bg-ref-color").spectrum({
            //         showAlpha: true,
            //         color: choosenColor,
            //         flat: !1,
            //         showInput: !0,
            //         showButtons: !0,
            //         showInitial: !0,
            //         showPalette: !1,
            //         showSelectionPalette: !1,
            //         preferredFormat: "hex",
            //         move: function(color) {
            //             bgRefColor = color.toRgbString();
            //             $(".reveal div .BlockRef").css("background-color", bgRefColor);
            //             $(".reveal div .BlockRef .arrow-after").css("border-top-color", bgRefColor);
            //             /*console.log(bgRefColor);*/
            //         },
            //         change: function(color) {
            //             bgRefColor = color.toRgbString();
            //             $(".reveal div .BlockRef").css("background-color", bgRefColor);
            //             $(".reveal div .BlockRef .arrow-after").css("border-top-color", bgRefColor);
            //             /*console.log(bgRefColor);*/
            //         }
            //     });
            // }
            // if ($("#text-ref-color").length > 0) {
            //     var choosenColor;
            //     if (textRefColor == undefined && projector.attr("data-text-ref-color") == "") {
            //         choosenColor = "#000000";
            //     } else {
            //         if (projector.attr("data-text-ref-color") != "") {
            //             choosenColor = projector.attr("data-text-ref-color");
            //         } else {
            //             choosenColor = "#000000";
            //         }
            //     }
            //     $("#text-ref-color").spectrum({
            //         showAlpha: true,
            //         color: choosenColor,
            //         flat: !1,
            //         showInput: !0,
            //         showButtons: !0,
            //         showInitial: !0,
            //         showPalette: !1,
            //         showSelectionPalette: !1,
            //         preferredFormat: "hex",
            //         move: function(color) {
            //             textRefColor = color.toRgbString();
            //             $(".reveal div .BlockRef").css("color", textRefColor);
            //             /*console.log(textRefColor);*/
            //         },
            //         change: function(color) {
            //             textRefColor = color.toRgbString();
            //             $(".reveal div .BlockRef").css("color", textRefColor);
            //             /*console.log(textRefColor);*/
            //         }
            //     });
            // }
            if ($("#bg-popup-overlay-color").length > 0) {
                $("#bg-popup-overlay-color").spectrum({
                    showAlpha: true,
                    color: "#000000",
                    flat: !1,
                    showInput: !0,
                    showButtons: !0,
                    showInitial: !0,
                    showPalette: !1,
                    showSelectionPalette: !1,
                    preferredFormat: "hex",
                    move: function(color) {
                        bgPopupOverlayColor = color.toRgbString();
                        /*console.log(bgPopupOverlayColor);*/
                    },
                    change: function(color) {
                        bgPopupOverlayColor = color.toRgbString();
                        /*console.log(bgPopupOverlayColor);*/
                    }
                });
            }
            // if ($("#bg-ref-overlay-color").length > 0) {
            //     var choosenColor;
            //     if (bgRefOverlayColor == undefined && projector.attr("data-bg-ref-overlaycolor") == "") {
            //         choosenColor = "#000000";
            //     } else {
            //         if (projector.attr("data-bg-ref-overlaycolor") != "") {
            //             choosenColor = projector.attr("data-bg-ref-overlaycolor");
            //         } else {
            //             choosenColor = "#000000";
            //         }
            //     }
            //     $("#bg-ref-overlay-color").spectrum({
            //         showAlpha: true,
            //         color: choosenColor,
            //         flat: !1,
            //         showInput: !0,
            //         showButtons: !0,
            //         showInitial: !0,
            //         showPalette: !1,
            //         showSelectionPalette: !1,
            //         preferredFormat: "hex",
            //         move: function(color) {
            //             bgRefOverlayColor = color.toRgbString();
            //             $(".reveal .BlockRefOverlay").css("background-color", bgRefOverlayColor);
            //             /*console.log(bgRefOverlayColor);*/
            //         },
            //         change: function(color) {
            //             bgRefOverlayColor = color.toRgbString();
            //             $(".reveal .BlockRefOverlay").css("background-color", bgRefOverlayColor);
            //             /*console.log(bgRefOverlayColor);*/
            //         }
            //     });
            // }
        }, 50);

        //Home Logo
        // $(document).off('click', '#logo_home_upload').on('click', '#logo_home_upload', function (e) {
        //     e.preventDefault();
        //     var currentSlide = Reveal.getCurrentSlide(),
        //         t = Reveal.getIndices(currentSlide),
        //         i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
        //             select: SL.models.Media.IMAGE
        //         });
        //     i.selected.addOnce(function(i) {
        //         logoHomeUrl = i.data.url;
        //         $(".edit-pres-wrap .slides .link-to-home").css( "background-image" , "url("+ logoHomeUrl +")" );
        //         $('.logo-home-link').css({
        //             'background-image': 'url('+ logoHomeUrl +')',
        //             'display' : 'block'
        //         });

        //         $('.logo-home-link').show();
        //         if ($(".wrapper-logo-home .del-current-bg").length == 0) {
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-home-link");
        //         }
        //     }.bind(this));
        //     // $(".slide-option.background-image").trigger("click");
        //     //$(".sl-popup").css("z-index", "40000");
        //     // $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function() {
        //     //     //logoHomeUrl = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
        //     //     logoHomeUrl = $(this).css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "")
        //     //     console.log(logoHomeUrl);
        //     //     console.log($(this).css('background-image').replace('url(','').replace(')','').replace(/\"/gi, ""));
        //     //     $(".edit-pres-wrap .slides .link-to-home").css( "background-image" , "url("+ logoHomeUrl +")" );
        //     //     $('.logo-home-link').css({
        //     //         'background-image': 'url('+ logoHomeUrl +')',
        //     //         'display' : 'block'
        //     //     });
        //     //
        //     //     $('.logo-home-link').show();
        //     //     if ($(".wrapper-logo-home .del-current-bg").length == 0) {
        //     //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-home-link");
        //     //     }
        //     // });
        // });
        // Reference Logo
        // $(document).off('click', '#logo_ref_upload').on('click', '#logo_ref_upload', function (e) {
        //     e.preventDefault();
        //     var currentSlide = Reveal.getCurrentSlide(),
        //         t = Reveal.getIndices(currentSlide),
        //         i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
        //             select: SL.models.Media.IMAGE
        //         });
        //     i.selected.addOnce(function(i) {
        //         logoRefsUrl = i.data.url;
        //         $(".edit-pres-wrap .slides .ref-link").empty().append("<img src='" + logoRefsUrl + "' alt='' />");
        //         $('.logo-ref-link').css({
        //             'background-image': 'url('+ logoRefsUrl +')',
        //             'display' : 'block'
        //         });
        //         $('.logo-ref-link').show();
        //         if ($(".wrapper-logo-ref .del-current-bg").length == 0) {
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-ref-link");
        //         }
        //     }.bind(this));
        //     // $(".slide-option.background-image").trigger("click");
        //     // $(".sl-popup").css("z-index", "40000");
        //     // $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function() {
        //     //     logoRefsUrl = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
        //     //     $(".edit-pres-wrap .slides .ref-link").empty().append("<img src='" + logoRefsUrl + "' alt='' />");
        //     //     $('.logo-ref-link').css({
        //     //         'background-image': 'url('+ logoRefsUrl +')',
        //     //         'display' : 'block'
        //     //     });
        //     //     $('.logo-ref-link').show();
        //     //     if ($(".wrapper-logo-ref .del-current-bg").length == 0) {
        //     //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-ref-link");
        //     //     }
        //     //
        //     // });
        // });

        // RCp logo
        // $(document).off('click', '#logo_rcp_upload').on('click', '#logo_rcp_upload', function (e) {
        //     e.preventDefault();
        //     var currentSlide = Reveal.getCurrentSlide(),
        //         t = Reveal.getIndices(currentSlide),
        //         i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
        //             select: SL.models.Media.IMAGE
        //         });
        //     i.selected.addOnce(function(i) {
        //         logoRcpUrl = i.data.url;
        //         $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append("<img src='" + logoRcpUrl + "' alt='' />");
        //         $('.logo-rcp-link').css({
        //             'background-image':'url('+ logoRcpUrl +')',
        //             'display' : 'block'
        //         });

        //         $('.logo-rcp-link').show();
        //         if ($(".wrapper-rcp-logo .del-current-bg").length == 0) {
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-rcp-link");
        //         }
        //     }.bind(this));
            // $(".slide-option.background-image").trigger("click");
            // $(".sl-popup").css("z-index", "40000");
            // $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function() {
            //     logoRcpUrl = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
            //     $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append("<img src='" + logoRcpUrl + "' alt='' />");
            //     $('.logo-rcp-link').css({
            //         'background-image':'url('+ logoRcpUrl +')',
            //         'display' : 'block'
            //     });
            //
            //     $('.logo-rcp-link').show();
            //     if ($(".wrapper-rcp-logo .del-current-bg").length == 0) {
            //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this icon</a></div>").insertAfter(".logo-rcp-link");
            //     }
            // });
       // });
        // Delete RCP Icon
        // $(document).on("click", '.wrapper-rcp-logo .del-current-bg a' , function(e) {

        //     e.preventDefault();
        //     logoRcpUrl = "";
        //     $(this).parent(".del-current-bg").remove();
        //     $(".logo-rcp-link").removeAttr("style").css("display", "none");
        //     $(".edit-pres-wrap .slides .rcp-link-eadv").empty().append('<i class="fa fa-rcp"></i>');

        // });

        // Delete Home logo
        // $(document).on("click", '.wrapper-logo-home .del-current-bg a' , function(e) {

        //     e.preventDefault();
        //     logoHomeUrl = "";
        //     $(this).parent(".del-current-bg").remove();
        //     $(".logo-home-link").removeAttr("style").css("display", "none");
        //     $(".edit-pres-wrap .slides .link-to-home").css("background-image", "url(" + window.location.origin + "/img/picto-home.png)");
        // });

        //Delete Refer icon
        // $(document).on("click",'.wrapper-logo-ref .del-current-bg a', function(e) {
        //     e.preventDefault();
        //     logoRefsUrl = "";
        //     $(this).parent(".del-current-bg").remove();
        //     $(".logo-ref-link").removeAttr("style").css("display", "none");
        //     $(".edit-pres-wrap .slides .ref-link").empty().append('<i class="fa fa-stack-exchange"></i>');
        // });
        // $(document).off("click", "#logo_pres_upload").on("click", "#logo_pres_upload", function() {
        //     //console.log("change");
        //     // $(".slide-option.background-image").trigger("click");
        //     // $(".sl-popup").css("z-index", "40000");
        //     // $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function() {
        //     //     logoPresURL = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
        //     //     $(".logo-pres").css("background-image", "url(" + logoPresURL + ")");
        //     //     $(".edit-pres-wrap .slides .logoEADV").css("background-image", "url("+ logoPresURL +")");
        //     //     $(".edit-pres-wrap .slides .logoEADV").empty().append("<img src='" + logoPresURL + "' alt='' />");
        //     //     $(".logo-pres").show();
        //     // });
        //     var currentSlide = Reveal.getCurrentSlide(),
        //         t = Reveal.getIndices(currentSlide),
        //         i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
        //             select: SL.models.Media.IMAGE
        //         });
        //     i.selected.addOnce(function(i) {
        //         logoPresURL = i.data.url;
        //         $(".logo-pres").css("background-image", "url(" + logoPresURL + ")");
        //         $(".edit-pres-wrap .slides .logoEADV").css("background-image", "url("+ logoPresURL +")");
        //         $(".edit-pres-wrap .slides .logoEADV").empty().append("<img src='" + logoPresURL + "' alt='' />");
        //         $(".logo-pres").show();
        //     }.bind(this));
        // });

        // $(document).off("click", "#bg_pres_upload").on("click", "#bg_pres_upload", function() {
        //     //console.log("change");
        //     // $(".slide-option.background-image").trigger("click");
        //     // $(".sl-popup").css("z-index", "40000");
        //     // $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function() {
        //     //     bgPresImg = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
        //     //     $(".bg-pres").show();
        //     //     $(".bg-pres").css("background-image", "url(" + bgPresImg + ")");
        //     //     if ($(".wrapper-bg-pres .del-current-bg").length == 0) {
        //     //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-pres");
        //     //     }
        //     //     $(".slides section").css({
        //     //         backgroundImage: "url(" + bgPresImg + ")",
        //     //         backgroundRepeat: "no-repeat",
        //     //         backgroundPosition: "center center",
        //     //         backgroundSize: "contain"
        //     //     });
        //     // });
        //     var currentSlide = Reveal.getCurrentSlide(),
        //         t = Reveal.getIndices(currentSlide),
        //         i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
        //             select: SL.models.Media.IMAGE
        //         });
        //     i.selected.addOnce(function(i) {
        //         bgPresImg = i.data.url;
        //         $(".bg-pres").show();
        //         $(".bg-pres").css("background-image", "url(" + bgPresImg + ")");
        //         if ($(".wrapper-bg-pres .del-current-bg").length == 0) {
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-pres");
        //             $(this).closest('#clm_bg_screen').find('#bg-size-pres').prop('disabled', false);
        //         }
        //         $(".slides section").css({
        //             backgroundImage: "url(" + bgPresImg + ")",
        //             backgroundRepeat: "no-repeat",
        //             backgroundPosition: "center center",
        //             // backgroundSize: "contain"
        //         });
        //     }.bind(this));

        // });
        // $(document).on("click", ".wrapper-bg-pres .del-current-bg a", function(e) {
        //     e.preventDefault();
        //     bgPresImg = "";
        //     $(this).closest('#clm_bg_screen').find('#bg-size-pres').prop('disabled', true);
        //     $(this).parent(".del-current-bg").remove();
        //     $(".bg-pres").removeAttr("style").css("display", "none");
        //     $(".slides section").each(function(index, elm) {
        //         $(this).css({
        //             "background-image": $(this).attr("data-bg-screen-img") != undefined ? "url(" + $(this).attr("data-bg-screen-img") + ")" : "none"
        //         });
        //     });
        //     $(".projector .reveal-viewport").removeAttr("style");
        // });

        // $(document).off("click", "#bg_popup_upload").on("click", "#bg_popup_upload", function() {
        //     if ($('.popin.present').size() == 0) {
        //         //console.log("change");
        //         // $(".slide-option.background-image").trigger("click");
        //         // $(".sl-popup").css("z-index", "40000");
        //         // $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function() {
        //         //     bgPopupImg = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
        //         //     $(".bg-popup").css("background-image", "url(" + bgPopupImg + ")");
        //         //     $(".bg-popup").show();
        //         //     if ($("#popin_clm .wrapper-bg-popup .del-current-bg").length == 0) {
        //         //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter("#popin_clm .bg-popup");
        //         //     }
        //         // });
        //         var currentSlide = Reveal.getCurrentSlide(),
        //             t = Reveal.getIndices(currentSlide),
        //             i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
        //                 select: SL.models.Media.IMAGE
        //             });
        //         i.selected.addOnce(function(i) {
        //             bgPopupImg = i.data.url;
        //             $(".bg-popup").css("background-image", "url(" + bgPopupImg + ")");
        //             $(".bg-popup").show();
        //             if ($("#popin_clm .wrapper-bg-popup .del-current-bg").length == 0) {
        //                 $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter("#popin_clm .bg-popup");
        //             }
        //         }.bind(this));
        //     }
        // });
        // $(document).on("click", ".wrapper-bg-popup .del-current-bg a", function(e) {
        //     e.preventDefault();
        //     bgPopupImg = "";
        //     if ($('.popin.present').size() == 0) {
        //         $(this).parent(".del-current-bg").remove();
        //         $(".bg-popup").removeAttr("style").css("display", "none");
        //     }
        // });

        // $(document).off("click", "#bg_ref_upload").on("click", "#bg_ref_upload", function() {
        //     //console.log("change");
        //     // $(".slide-option.background-image").trigger("click");
        //     // $(".sl-popup").css("z-index", "40000");
        //     // $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function() {
        //     //     bgRefImg = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
        //     //     $(".bg-ref").css("background-image", "url(" + bgRefImg + ")");
        //     //     $(".bg-ref").show();
        //     //     if ($(".wrapper-bg-ref .del-current-bg").length == 0) {
        //     //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-ref");
        //     //     }
        //     //     $(".reveal div .BlockRef").css({
        //     //         backgroundImage: "url(" + bgRefImg + ")"
        //     //     });
        //     // });
        //     var currentSlide = Reveal.getCurrentSlide(),
        //         t = Reveal.getIndices(currentSlide),
        //         i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
        //             select: SL.models.Media.IMAGE
        //         });
        //     i.selected.addOnce(function(i) {
        //         bgRefImg = i.data.url;
        //         $(".bg-ref").css("background-image", "url(" + bgRefImg + ")");
        //         $(".bg-ref").show();
        //         if ($(".wrapper-bg-ref .del-current-bg").length == 0) {
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-ref");
        //         }
        //         $(".reveal div .BlockRef").css({
        //             backgroundImage: "url(" + bgRefImg + ")"
        //         });
        //     }.bind(this));
        // });
        // $(document).on("click", ".wrapper-bg-ref .del-current-bg a", function(e) {
        //     e.preventDefault();
        //     bgRefImg = "";
        //     $(this).parent(".del-current-bg").remove();
        //     $(".bg-ref").removeAttr("style").css("display", "none");
        //     $(".reveal div .BlockRef").css({
        //         backgroundImage: "none"
        //     });
        // });
        // $(document).off("click", "#bg_btn_close").on("click", "#bg_btn_close", function() {
        //     //console.log("change");
        //     // $(".slide-option.background-image").trigger("click");
        //     // $(".sl-popup").css("z-index", "40000");
        //     // $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function() {
        //     //     bgBtnClose = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
        //     //     $(".bg-btn-close").css("background-image", "url(" + bgBtnClose + ")");
        //     //     $(".bg-btn-close").show();
        //     //     if ($(".wrapper-bg-btn-close .del-current-bg").length == 0) {
        //     //         $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-btn-close");
        //     //     }
        //     //     $(".reveal div .BlockRef .ref-close-btn").css({
        //     //         "background-image": "url(" + bgBtnClose + ")"
        //     //         /*,
        //     //          "background-color": "transparent",
        //     //          "font-size": "0",
        //     //          "border-radius": "0"*/
        //     //     });
        //     // });
        //     var currentSlide = Reveal.getCurrentSlide(),
        //         t = Reveal.getIndices(currentSlide),
        //         i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
        //             select: SL.models.Media.IMAGE
        //         });
        //     i.selected.addOnce(function(i) {
        //         bgBtnClose = i.data.url;
        //         $(".bg-btn-close").css("background-image", "url(" + bgBtnClose + ")");
        //         $(".bg-btn-close").show();
        //         if ($(".wrapper-bg-btn-close .del-current-bg").length == 0) {
        //             $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".bg-btn-close");
        //         }
        //         $(".reveal div .BlockRef .ref-close-btn").css({
        //             "background-image": "url(" + bgBtnClose + ")"
        //             /*,
        //              "background-color": "transparent",
        //              "font-size": "0",
        //              "border-radius": "0"*/
        //         });
        //     }.bind(this));
        // });
        // $(document).on("click", ".wrapper-bg-btn-close .del-current-bg a", function(e) {
        //     e.preventDefault();
        //     bgBtnClose = "";
        //     $(this).parent(".del-current-bg").remove();
        //     $(".bg-btn-close").removeAttr("style").css("display", "none");
        //     $(".reveal div .BlockRef .ref-close-btn").css({
        //         "background-image": "url(/img/close_ref.png)"
        //         /*,
        //          "background-color": "grey",
        //          "font-size": "24px",
        //          "border-radius": "50%"*/
        //     });
        // });
    });

    /* Template item duplicate screeen background */
    // $(document).off("click", ".add-vertical-slide, .add-horizontal-slide").on("click", ".add-vertical-slide, .add-horizontal-slide", function() {
    //     var getLastMenuID = SL.editor.controllers.Markup.getCurrentSlide().attr("data-id");
    //     //console.log("getLastMenuID: " + getLastMenuID);
    //     setTimeout(function () {
    //         $(".template-item .duplicate-template-item-params").parent(".slides").find("section.present").attr({
    //             "data-background-color"     : $(".template-item .duplicate-template-item-params").attr("data-template-item-bgcolor"),
    //             "data-background-size"      : $(".template-item .duplicate-template-item-params").attr("data-template-item-bgsize"),
    //             "data-background-image"     : $(".template-item .duplicate-template-item-params").attr("data-template-item-bgimg") != undefined ?$(".template-item .duplicate-template-item-params").attr("data-template-item-bgimg") : "",
    //             "data-background-repeat"    : "no-repeat",
    //             "data-background-position"  : "center center"
    //
    //         });
    //     }, 5);
    //
    //     $(document).off("click", ".sl-templates-inner .template-item").on("click", ".sl-templates-inner .template-item", function(){
    //         /*console.log(bgPresImg);*/
    //         $(".add-vertical-slide, .add-horizontal-slide").css("pointer-events", "none");
    //
    //         /* Menu update */
    //         setTimeout(function(){
    //             updateCreatedMenu();
    //         }, 5);
    //         /***************************************************************************************************************************************/
    //
    //         if($(this).find(".duplicate-template-item-params").length == 0){
    //             //console.log("duplicate-template-item-params: no");
    //             var duplicateInterval = setInterval(function(){
    //                 if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-id") != getLastMenuID && SL.editor.controllers.Markup.getCurrentSlide().attr("data-id") != $("[data-id=" + getLastMenuID + "]").parent(".stack").find("section:first-of-type").attr("data-id")){
    //                     // SL.editor.controllers.Markup.getCurrentSlide().css({
    //                     //     backgroundColor: projector.attr("data-bg-pres-color") != "" ? projector.attr("data-bg-pres-color") : "transparent",
    //                     //     backgroundImage: projector.attr("data-bg-pres-img") != "" ? "url("+ projector.attr("data-bg-pres-img") +")" : "none",
    //                     //     backgroundSize: "contain",
    //                     //     backgroundRepeat: "no-repeat",
    //                     //     backgroundPosition: "center center"
    //                     // }).promise().done(function(){
    //                     //     $(".add-vertical-slide, .add-horizontal-slide").css("pointer-events", "all");
    //                     // });
    //                     SL.editor.controllers.Markup.getCurrentSlide().attr({
    //                         'data-background-color'     : SL.editor.controllers.Appearence.bgPresColor != "" && SL.editor.controllers.Appearence.bgPresColor != undefined ? SL.editor.controllers.Appearence.bgPresColor  : "transparent",
    //                         'data-background-image'     :  SL.editor.controllers.Appearence.bgPresImg  != undefined  ? SL.editor.controllers.Appearence.bgPresImg  : "",
    //                         'data-background-repeat'    : "no-repeat",
    //                         'data-background-size'      : SL.editor.controllers.Appearence.bgPresSize,
    //                         'data-background-position'  : "center center"
    //                     }).promise().done(function(){
    //                         $(".add-vertical-slide, .add-horizontal-slide").css("pointer-events", "all");
    //                         Reveal.sync();
    //                     });
    //                     clearInterval(duplicateInterval);
    //                     //console.log("Loaded ! / " + $("[data-id=" + getLastMenuID + "]").parent(".stack").find("section:first-of-type").attr("data-id"));
    //                     //console.log("New Id: " + SL.editor.controllers.Markup.getCurrentSlide().find(".menu").attr("id"));
    //                 }
    //                 else{
    //                     //console.log("Rebelote !");
    //                     //console.log("Old Id: " + SL.editor.controllers.Markup.getCurrentSlide().find(".menu").attr("id"));
    //                 }
    //             }, 1);
    //         }
    //         else{
    //             console.log("duplicate-template-item-params: yes");
    //             var duplicateTemplateItemELm = $(this).find(".duplicate-template-item-params"),
    //                 currentBgSizeScreen = SL.editor.controllers.Markup.getCurrentSlide().attr('data-background-size');
    //
    //             var createSlideInterval = setInterval(function(){
    //                 if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-id") != getLastMenuID && SL.editor.controllers.Markup.getCurrentSlide().attr("data-id") != $("[data-id=" + getLastMenuID + "]").parent(".stack").find("section:first-of-type").attr("data-id")){
    //                     var sectionPresent = SL.editor.controllers.Markup.getCurrentSlide();
    //                     SL.editor.controllers.Markup.getCurrentSlide().attr({
    //                         'data-background-color'     : duplicateTemplateItemELm.attr("data-template-item-bgcolor"),
    //                         'data-background-image'     : duplicateTemplateItemELm.attr("data-template-item-bgimg") != undefined ? "url(" + duplicateTemplateItemELm.attr("data-template-item-bgimg") +")": "",
    //                         'data-background-size'      : duplicateTemplateItemELm.attr('data-template-item-bgsize'),
    //                         'data-background-repeat'    : "no-repeat",
    //                         'data-background-position'  : "center center"
    //                     }).promise().done(function(){
    //                         $(".add-vertical-slide, .add-horizontal-slide").css("pointer-events", "all");
    //                         Reveal.sync();
    //                     });
    //
    //
    //                     /*   switch(duplicateTemplateItemELm.attr("data-template-item-navbarappearance")){
    //                            case "standard":
    //                                SL.editor.controllers.Markup.getCurrentSlide().find(".hide-menu").each(function(index, elm){
    //                                    if($(this).is(".hide-menu")){
    //                                        $(this).removeClass("hide-menu");
    //                                    }
    //                                });
    //                                break;
    //                            case "Hide-all":
    //                                SL.editor.controllers.Markup.getCurrentSlide().find("#wrapperMenuScroll, .wrapper-submenu, .menu").addClass("hide-menu");
    //                                break;
    //                            case "Hide-chapters":
    //                                SL.editor.controllers.Markup.getCurrentSlide().find("#wrapperMenuScroll").is(".hide-menu") ? SL.editor.controllers.Markup.getCurrentSlide().find("#wrapperMenuScroll").removeClass("hide-menu") : null;
    //                                SL.editor.controllers.Markup.getCurrentSlide().find(".menu").is(".hide-menu") == false ? SL.editor.controllers.Markup.getCurrentSlide().find(".menu").addClass("hide-menu") : null;
    //                                SL.editor.controllers.Markup.getCurrentSlide().find(".wrapper-submenu").is(".hide-menu") == false ? SL.editor.controllers.Markup.getCurrentSlide().find(".wrapper-submenu").addClass("hide-menu") : null;
    //                                break;
    //                        }*/
    //                     switch(duplicateTemplateItemELm.attr("data-template-item-navbarappearance")){
    //                         case "standard":
    //                             $(".hide-menu").each(function(index, elm){
    //                                 if($(this).is(".hide-menu")){
    //                                     $(this).removeClass("hide-menu");
    //                                 }
    //                             });
    //                             break;
    //                         case "Hide-all":
    //                             $("#wrapperMenuScroll, .wrapper-submenu, .menu").addClass("hide-menu");
    //                             break;
    //                         case "Hide-chapters":
    //                             $("#wrapperMenuScroll").is(".hide-menu") ? $("#wrapperMenuScroll").removeClass("hide-menu") : null;
    //                             $(".menu").is(".hide-menu") == false ? $(".menu").addClass("hide-menu") : null;
    //                             $(".wrapper-submenu").is(".hide-menu") == false ? $(".wrapper-submenu").addClass("hide-menu") : null;
    //                             break;
    //                     }
    //                     if(duplicateTemplateItemELm.attr("data-set-screen-img") == "true"){
    //                         //console.log(duplicateTemplateItemELm.attr("data-template-item-bgimg"));
    //                         sectionPresent.attr({
    //                             "data-bg-screen-img": duplicateTemplateItemELm.attr("data-template-item-bgimg") != "none" ? duplicateTemplateItemELm.attr("data-template-item-bgimg") : ""
    //                         });
    //                     }
    //                     if(duplicateTemplateItemELm.attr("data-set-screen-color") == "true"){
    //                         //console.log(duplicateTemplateItemELm.attr("data-template-item-bgcolor"));
    //                         sectionPresent.attr({
    //                             "data-bg-screen-color": duplicateTemplateItemELm.attr("data-template-item-bgcolor")
    //                         });
    //                     }
    //                     if(duplicateTemplateItemELm.attr("data-set-custom-navbarappearance") == "true"){
    //                         //console.log(duplicateTemplateItemELm.attr("data-template-item-navbarappearance"));
    //                         sectionPresent.attr({
    //                             "data-custom-navbar-appearance": duplicateTemplateItemELm.attr("data-template-item-navbarappearance")
    //                         });
    //                     }
    //                     $(".duplicate-template-item-params").remove();
    //
    //                     clearInterval(createSlideInterval);
    //                     //console.log("Loaded ! / " + $("[data-id=" + getLastMenuID + "]").parent(".stack").find("section:first-of-type").attr("data-id"));
    //                 }
    //                 else{
    //                     //console.log("Rebelote !");
    //                 }
    //             }, 1);
    //         }
    //     });
    // });
    //Script Aimation tap Objects
    /*******************************************Button_Animation_Tap**********************************************************/
    $(document).on("click", ".Block-Cliquable", function (){
        var temps;var temps2;
        if($(this).is(":checked")) {
            $(".sl-block.is-focused").attr("data-block-anim","tap");
            var TDuration = $(".sl-block.is-focused").find((".sl-block-content")).css("transition-duration") ;
            var Tdelay =  $(".sl-block.is-focused").find((".sl-block-content")).css("transition-delay");
            var str1 = TDuration ;
            var res1 = str1.split("s");
            var res11 = res1[0].split(".");
            var str2 = Tdelay  ;
            var res2 = str2.split("s");
            var res22 = res2[0].split(".");
            temps=parseInt(res11[0])*1000;
            temps2=parseInt(res22[0])*1000;
            if($.isNumeric( parseInt(res11[0])))
            {
                temps= temps +parseInt(res11[1])*100;
                if(!$.isNumeric(temps))
                {
                    temps= parseInt(res11[0])*1000;
                }
            }
            if($.isNumeric( parseInt(res22[0])))
            {
                temps2= temps2 +parseInt(res22[1])*100;
                if(!$.isNumeric(temps2))
                {
                    temps2= parseInt(res22[0])*1000;
                }
            }
            $(".sl-block.is-focused").find(".sl-block-content").attr("data-delay-tap",temps2);
            $(".sl-block.is-focused").find(".sl-block-content").attr("data-duration-tap",temps);

        }
        else
        {
            $(".sl-block.is-focused").attr("data-block-anim","");
            $(".sl-block.is-focused").find(".sl-block-content").attr( "data-delay-tap" ,'' );
            $(".sl-block.is-focused").find(".sl-block-content").attr( "data-duration-tap" ,'' );
        }

    });
    /*******************************************End_button_Animation_Tap**********************************************************/

    /* Scroll active menu swiping */

    Reveal.addEventListener( 'slidechanged', function( event ) {

        /***************  *********************/
        /************** manage current item  **************/
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

       // $(".edit-pres-wrap .slides .menu .maxMenu .menu-level1.slide-menu-item.current:first-child");

        // $(".edit-pres-wrap .slides .menu .maxMenu li.current > a, .edit-pres-wrap .slides .wrapper-submenu ul li.current > a").css({
        //     "color": projector.attr("data-current-item-color") != "" ? projector.attr("data-current-item-color") : "#3e8787"
        // });

        // $(".edit-pres-wrap .slides .menu, .edit-pres-wrap .slides .wrapper-submenu ul").css({
        //     // "font-family": projector.attr("data-menu-font") != "" ? projector.attr("data-menu-font") : "Montserrat",
        //     "font-size": projector.attr("data-font-size-select") != "" ? projector.attr("data-font-size-select") + "px" : "15px"
        // });
        /*************** *************************/

      
    } );

    /*** get all line height without px ****/

    /*** get all line height without px ****/

});

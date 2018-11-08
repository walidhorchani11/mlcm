function svgAttributesCanvas(elm) {
    if (elm) {
        var svgHeight = $(elm).closest('.sl-block').height(),
            svgWidth = $(elm).closest('.sl-block').width();

        $(elm).attr({
            'height': svgHeight,
            'width': svgWidth
        });
    }
}
function sendthumb(img) {
    var idRev = $('.slides').attr('data-idRev');
    var idPres = $('.slides').attr('data-idPres');

    if (img !== '' && idPres && idRev) {
        $.ajax({
            method: 'POST',
            url: Routing.generate('thumbnails', {idPres: idPres, idRev: idRev}),
            dataType: 'image/png',
            data: {'thumb': img}
        })
    }
}
function generateThumb() {
    var $slideContent = $('.slides section').first(),
        sizes = ['200x150', '1024x768'],
        that = this;

    _.each($slideContent.find('svg'), function(value) {
        svgAttributesCanvas(value);
    });
    $slideContent.find('.sl-block-transform.editing-ui').hide();
    $slideContent.find('.ui-rotatable-handle.ui-draggable').hide();

    html2canvas($slideContent,
        {
            timeout: 1000,
            logging: false,
            taintTest: true,
            background: '#fff',
            allowTaint: false,
            useCORS: true,
            letterRendering: true
        }).then(function (canvas) {
        if (canvas !== '') {
            sendthumb(canvas.toDataURL('image/png'));
        }
    }),
    $slideContent.find('.sl-block-transform.editing-ui').show();
    $slideContent.find('.ui-rotatable-handle.ui-draggable').show();
}
function generateThumbAction() {
    var idRev       = $('.slides').attr('data-idRev');
    var idPres      = $('.slides').attr('data-idPres');
    var thumburl    = window.location.protocol + '//' + window.location.host + '/en/my-clm-presentations/'+ idRev +'/preview-pdf#/';

    if (idPres && idRev) {
        $.ajax({
            method      : 'POST',
            url         : Routing.generate('thumbnails_generate', { idPres: idPres, idRev: idRev, action: 'presentation_thumb' }),
            data        : JSON.stringify({
                'previewurl'    : thumburl,
                'size'          : 'width: 200, height: 150',
                'fileName'      : 'thumb-'+idPres+'.png',
                'jsfile'        : 'thumb.js',
                'dbSave'        : true
            })
        }).done(function() {
            console.log('thumb created with success');
        })
        .fail(function() {
            console.log('error creating thumb');
        })
    }
}
function generateSlidesThumbsAction() {
    var idRev       = $('.slides').attr('data-idRev');
    var idPres      = $('.slides').attr('data-idPres');
    var thumburl    = window.location.protocol + '//' + window.location.host + '/en/my-clm-presentations/'+ idRev +'/preview-pdf#/';

    var sectionsList    = $('.slides > section').not(".popin-overview");
    urls = '';
    _.each(sectionsList, function(value, key) {
        let childIndex      = 0,
            sectionId       = $(value).attr('data-id');

        urls += thumburl + key + ' ';

        if ($(value).hasClass('stack')) {
            let childs = $(value).find('section');

            _.each(childs, function(childvalue, childkey) {
                let childsectionId       = $(childvalue).attr('data-id');

                if (childkey > 0) {
                    urls += thumburl + key +'/'+ childkey;
                }
            }.bind(this));
            return;
        }
    }.bind(this));

    if (idPres && idRev && urls !== '') {
        $.ajax({
            method      : 'POST',
            url         : Routing.generate('presentation_thumbnails', { idPres: idPres, idRev: idRev }),
            data        : JSON.stringify({
                'urls'         : urls,
                'model'        : TWIG.phantomjsmodels+'render_multi_url.js'
            })
        }).done(function() {
            console.log('thumb created with success');
        })
        .fail(function() {
            console.log('error creating thumb');
        })
    }
}
$('#save_pres').on('click', function () {
    SL.editor.controllers.Blocks.blur();
    var data = $.parseHTML($('.slides').html());

    /********************** Begin Fetch exists Fonts  ******************************/
    var slidesContent = document.querySelectorAll(".slides *");
    const defaultFontListArray = {
        "fonts":[
            {"name":"Merck", "url":"/fonts/Merck.ttf"},
            {"name":"FuturaStd-CondensedLight", "url":"/fonts/FuturaStd-CondensedLight.otf"},
            {"name":"ProximaNova", "url":"/fonts/ProximaNova-Regular.otf"},
            {"name":"ProximaNovaBold", "url":"/fonts/ProximaNova-Bold.ttf"},
            {"name":"ProximaNovaSemibold", "url":"/fonts/ProximaNova-Semibold.otf"},
            {"name":"MerckPro", "url":"/fonts/MerckSansSerifPro.ttf"},
            {"name":"MerckBold", "url":"/fonts/MerckSansSerifPro-Bold.ttf"},
            {"name":"Montserrat", "url":"/fonts/Montserrat-Regular.otf"},
            {"name":"OpenSans", "url":"/fonts/OpenSans-Regular.ttf"},
            {"name":"Lato", "url":"/fonts/Lato-Regular.ttf"},
            {"name":"Asul", "url":"/fonts/asul-regular.eot"},
            {"name":"JosefinSans", "url":"/fonts/JosefinSans-Regular.ttf"},
            {"name":"LeagueGothic", "url":"/fonts/LeagueGothic-Regular.otf"},
            {"name":"MerriweatherSans", "url":"/fonts/MerriweatherSans-Regular.otf"},
            {"name":"Overpass", "url":"/fonts/overpass-regular.otf"},
            {"name":"CabinSketch", "url":"/fonts/cabinsketch-regular.eot"},
            {"name":"NewsCycle", "url":"/fonts/NewsCycle-Regular.ttf"},
            {"name":"Oxygen", "url":"/fonts/Oxygen.otf"},
            {"name":"RajdhaniBold", "url": "/fonts/Rajdhani-Bold.ttf"},
            {"name":"RajdhaniLight", "url": "/fonts/Rajdhani-Light.ttf"},
            {"name":"RajdhaniMedium", "url": "/fonts/Rajdhani-Medium.ttf"},
            {"name":"RajdhaniRegular", "url": "/fonts/Rajdhani-Regular.ttf"},
            {"name":"RajdhaniSemiBold", "url": "/fonts/Rajdhani-SemiBold.ttf"},
            {"name":"FontAwesome", "url": "/font-awesome/css/font-awesome.css"}
        ]
    };
    var j , d;
    var fontList ={
        data:[]
    };
    for (j = 0; j < slidesContent.length; j++) {
        $(slidesContent[j]).each(function() {
            var font =  $(this).css('font-family').replace('"', '');
            if (font.indexOf("Open Sans") == -1 ){
                fontList.data.push(font);
            }else {
                fontList.data.push("OpenSans");
            }
        });
    }
    var uniqFontList = _.uniq( _.collect( fontList.data, function( x ){
        return  x ;
    }));
    var existFont= []; // This is the last output of font Exist
    for (j = 0; j < uniqFontList.length; j++) {

       var object =  uniqFontList[j];
        for (d = 0 ; d < defaultFontListArray.fonts.length ; d++){
            if (object == defaultFontListArray.fonts[d].name){
               existFont.push({ "name" : object ,"url" : defaultFontListArray.fonts[d].url })
            }
        }
    }
    var attribute = "";
    for (j = 0; j < existFont.length; j++) {
        var that = existFont[j].url;
        if (attribute != ""){
            attribute = attribute +','+ that;
        }
        else {
            attribute =that;
        }
    }
    document.getElementById('params_clm_edidtor').setAttribute('data-font-url-exist',attribute);
    /********************** End Fetch exists Fonts  ******************************/

    var outSection = "";
    var objToSend = {};
    for (var i = 0; i < data.length; i++) {

        if (typeof data[i] != 'undefined' && data[i].nodeName === 'SECTION') {
            var section = $(data[i].outerHTML);
            var outerHTML = ( data[i] ).outerHTML;
            var parent = "";
            var beginStack = "";
            var nbrChild = '';
            if (section.hasClass("stack")) {
                beginStack = $(section).clone().children().remove().end()[0].outerHTML;
                beginStack = beginStack.replace("</section>", "");
                nbrChild = section.find('section').length;
                section.find('section').each(function (index) {
                    linkedChild = getAllReferences($(this));
                    content = sortLinkRefPrev(linkedChild);
                    if (index == 0) {
                        parent = "index" + i + index;
                        getObjToSendBySection(objToSend, content, outerHTML, null, i, index, 1, beginStack);
                    } else {
                        if(index == nbrChild - 1){
                            getObjToSendBySection(objToSend, content, outerHTML, parent, i, index, 1, "</section>");
                        }else{
                            getObjToSendBySection(objToSend, content, outerHTML, parent, i, index, 1, null);
                        }
                    }
                });
            } else {
                linkedParent = getAllReferences(section);
                section = sortLinkRefPrev(linkedParent);
                outerHtml = section[0].outerHTML;
                getObjToSendBySection(objToSend, section, outerHtml, null, i, 0, 0);
            }
        }
    }
    var listeMediaUrl = [];
    $(".sl-block-content img").each(function () {
        listeMediaUrl.push($(this).attr('src'));
    });
    var logoPres = $(".logo-pres").css("background-image");
    if (typeof logoPres !== typeof undefined && logoPres !== false) {
        logoPres = logoPres.replace('url("', '').replace('")', '');
        listeMediaUrl.push(logoPres);
    }
    var bgBtnClose = $(".bg-btn-close").css("background-image");
    if (typeof bgBtnClose !== typeof undefined && bgBtnClose !== false) {
        bgBtnClose = bgBtnClose.replace('url("', '').replace('")', '');
        listeMediaUrl.push(bgBtnClose);
    }
    var bgPres = $(".bg-pres").css("background-image");
    if (typeof bgPres !== typeof undefined && bgPres !== false) {
        bgPres = bgPres.replace('url("', '').replace('")', '');
        listeMediaUrl.push(bgPres);
    }
    var bgPopup = $(".bg-popup").css("background-image");
    if (typeof bgPopup !== typeof undefined && bgPopup !== false) {
        bgPopup = bgPopup.replace('url("', '').replace('")', '');
        listeMediaUrl.push(bgPopup);
    }
    var bgRef = $(".bg-ref").css("background-image");
    if (typeof bgRef !== typeof undefined && bgRef !== false) {
        bgRef = bgRef.replace('url("', '').replace('")', '');
        listeMediaUrl.push(bgRef);
    }
    var menu = {};
    menu = isNotEmpty(menu);
    objToSend['mediasLinked'] = listeMediaUrl;
    objToSend['menu'] = menu;
    objToSend['parameters'] = $("#params_clm_edidtor")[0].outerHTML;
    objToSend['popin'] = $('.slidespop').html();
    objToSend['state'] = $("#saveForm").find("select[name='state']").val();
    objToSend['linkedPdf'] = getLinkedPfd();
    console.log(objToSend);
    console.log('--------------------------------------------------');
    saveSlides(objToSend);

    function saveSlides(dataToSave) {
        var l = Ladda.create(document.querySelector('.ladda-button-save'));
        l.start();
        $.ajax({
            type: "POST",
            url: TWIG.savePresUrl,
            data: dataToSave,
            error : function(x, t, m) {
                l.stop();
                $('#modal_save_presentation').modal('hide');
                toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    showMethod: 'slideDown',
                    preventDuplicates: true
                };
                if(t==="timeout"){
                    console.log('request timeout');
                    toastr.error("Your presentation has not been saved. ['"+t+"']  Please contact our support team through  support-mcmbuilder@argolife.fr");
                }else{
                    toastr.error("Your presentation has not been saved. ['"+t+"']  Please contact our support team through  support-mcmbuilder@argolife.fr");
                }
            }
        }).done(function (data) {
            l.stop();
            $('#modal_save_presentation').modal('hide');
            toastr.options = {
                closeButton: true,
                progressBar: true,
                showMethod: 'slideDown',
                preventDuplicates: true,
                timeOut: 5000
            };
            toastr.success('Your presentation has been successfully saved.');
            $('.saveBtn button.save').attr('data-saved', true);
            console.log(SLConfig);
            SLConfig.deck.data = SL.editor.controllers.Serialize.getDeckAsString();
            SLConfig.deck.dirty = !0;
            generateThumbAction();
            //generateSlidesThumbsAction();
        });
    }

    function isNotEmpty(menu) {
        menu.menuColor = null;
        menu.itemColor = null;
        menu.fontColor = null;
        menu.highlight = "no";
        menu.fonts = null;
        menu.data = null;

        var menuColor = $('div#wrapperMenuScroll').attr('style');
        if (menuColor) {
            menu.menuColor = menuColor;
        }
        var itemColor = $(".edit-pres-wrap .slides .menu  li.current > a").attr('style');
        if (itemColor) {
            menu.itemColor = itemColor;
        }
        var fontColor = $(".edit-pres-wrap .slides .menu .maxMenu > li").not(".current").children("a").attr('style');
        if (fontColor) {
            menu.fontColor = fontColor;
        }
        var section = Reveal.getCurrentSlide();
        var highlight = $("#wrapperMenuScroll .menu .maxMenu li.current").css('background-image');
        if (highlight) {
            if (highlight != "none" && highlight.indexOf("selected.png") !== -1 || highlight.indexOf("picto-home-active.png") !== -1) {
                menu.highlight = "highlight";
            }
        }
        var fonts = $('#wrapperMenuScroll .menu').attr('style');
        if (fonts) {
            menu.fonts = fonts;
        }
        var data = $('#wrapperMenuScroll').prop('outerHTML');
        if (data) {

            var dataCompressed =  btoa(RawDeflate.deflate(data));
            menu.data = dataCompressed;
        }
        if (menu.menuColor == null && menu.itemColor == null && menu.fontColor == null && menu.highlight == "no" && menu.fonts == null) {
            return null;
        }

        return menu;
    }
});
function getLinkedPfd() {
    var pdf = [];
    $('#tab-21 .item-pdf span.pdf-title2, #tab-21 .item-pdf span.pdf-title').each(function () {
        var id = $(this).data('id');
        if (id !== undefined) {
            pdf.push(id);
        }
    });

    if (pdf.length > 0) {
        return pdf;
    }

    return null;
}
function getReferences(ref, section) {
    section.find('.item-ref-wrapper').each(function () {
        var refCode = $(this).find('.codeRef')[0].outerHTML;
        var description = $(this).find('.descRef > p').html();
        var obj = {};

        if (typeof refCode == 'undefined' || typeof description == 'undefined') {
            obj = null;
        } else {
            obj = {
                "codeRef": refCode,
                "description": description
            };
            ref.push(obj);
        }
    });
    var additText = section.find('.block-AdditionalText').html();
    if (additText == undefined) {
        additText = "";
    } else {
        var objAdd = {};
        objAdd = {
            "codeRef": "",
            "description": additText
        };
        ref.push(objAdd);

    }
    if (ref.length <= 0) {
        return null;
    }

    return ref;
}
function getSurvey(survey, tables, section) {
    $.each(tables, function (type, table) {
        section.find(table).each(function () {
     //       console.log($($(this)).text());
       //     console.log($(this).attr('id'));

            var surveyCode = $(this).attr('id');
            var question = $($(this)).text();

            if (surveyCode == 'Id_selectQuestion') {
                surveyCode = $(this).parent().next().children().first().attr('id');
            }

            var obj = {};

            if (/*typeof surveyCode == 'undefined' ||*/ typeof question == 'undefined') {
                obj = null;
            } else {
                obj = {
                    "surveyCode": surveyCode,
                    "question": $.trim(question),
                    "type": "TEXT"
                };
                survey.push(obj);
            }

        });
    });

    if (survey.length <= 0) {
        return null;
    }

    return survey;
}
function sortLinkRefPrev(section, additionalText) {
    section.find('.wrapper-refs').each(function () {
        var block = $(this);
        var alpha = [];
        var number = [];
        block.find('.item-ref-wrapper').each(function () {
            var alphaArr = [];
            var numArr = [];
            if ($.isNumeric($(this).find(".codeRef").text()) == false) {

                alphaArr.push($(this).find(".codeRef").text());
                alphaArr.push($(this));
                alpha.push(alphaArr);
                alpha.sort();

            }
            else {
                numArr.push($(this).find(".codeRef").text());
                numArr.push($(this));
                number.push(numArr);
                number.sort(function sortEm(a, b) {
                    return parseInt(a) > parseInt(b) ? 1 : -1;
                });
            }
        });
        for (var i = 0; i < alpha.length; i++) {
            block.append(alpha[i][1]);
        }
        for (var i = 0; i < number.length; i++) {
            block.append(number[i][1]);
        }
        var additionalText = section.find('.block-AdditionalText').html();
        if (additionalText == undefined) {
            additionalText = "";
        }
        block.append(additionalText);
    });
    return section;
}
function getAllReferences(section) {
    var ref_pushed = [];
    var index = "";
    section.find('.wrapper-refs').empty();
    //section.find('.BlockRef').append("<div class='wrapper-refs'></div>");
    section.find('.ref').each(function () {
        var inputvalueref = $(this).html();
        index = $(this);
        var titleRef = "";
        var descRef = "";
        if ($("#tab-1 .item-ref span.ref-title").length >= 1) {
            $("#tab-1 .sheet").each(function () {
                var idreflinked = index.attr('id');
                if ($(this).attr('id') == index.attr('id')) {
                    titleRef = $(this).find('.ref-title').html();
                    descRef = $(this).find('.ref-desc').html();
                    var element = $(this).find('.ref-desc p span');
                    var  color =[] , ftSize=[] , ftFamily;
                    $(element).each(function(tap) {

                        if ($(this).css('color') != "rgb(221, 221, 221)"){
                           color.push($(this).css('color'));
                        }
                        if($(this).css('font-size') != "12.6px"){
                            ftSize.push($(this).css('font-size'));
                        }
                        if(($(this).css('font-family') !='"Lucida Sans Unicode", "Lucida Grande", sans-serif') ){
                            ftFamily = $(this).css('font-family');
                        }
                    });

                    if (($.inArray(index.attr('id'), ref_pushed) == -1)) {
                        section.find('.BlockRef .wrapper-refs').append("<div class='item-ref-wrapper'><div  class='row-ref'><div class='hide color-hidden'>"+color[0]+"</div><div class='hide font-family-hidden'>"+ftFamily+"</div><div class='hide fontsize-hidden'>"+ftSize[0]+"</div><span  class='codeRef' >" + inputvalueref + ". </span><span class='descRef'>" + descRef + "</span></div></div>");
                        ref_pushed.push(index.attr('id'));
                    }
                    section.find('.BlockRef .wrapper-refs .row-ref').each(function () {
                        var setColor , setFontSize ,setFontFamily;
                        if( $(this).find('.color-hidden').text() != "undefined")
                        {
                            setColor = $(this).find('.color-hidden').text()
                        }
                        if( $(this).find('.fontsize-hidden').text() != "undefined")
                        {
                            setFontSize = $(this).find('.fontsize-hidden').text()
                        }
                        if( $(this).find('.font-family-hidden').text() != "undefined")
                        {
                            setFontFamily = $(this).find('.font-family-hidden').text()
                        }

                        $(this).children('.codeRef').css({
                            'color' : setColor,
                            'font-size' : setFontSize,
                            'font-family' : setFontFamily
                        });
                    });

                    //<div class='hide color-hidden'>"+color+"</div><div class='hide fontsize-hidden'>"+fontSizeCodeRef+"</div>

                }
            });
        }
    });
    return section;
}
function getObjToSendBySection(objToSend, section, outerHTML, parent, i, index, flag, tagParent) {
    if (flag == 1) {
        outerHTML = section[0].outerHTML;
    }
    var screenName = isNotUndefined(section.data("screen-name"));
    var chapterName = isNotUndefined(section.data("chapter-name"));
    var sectionDataId = isNotUndefined(section.data("id"));
    var screenId = isNotUndefined(section.data("screen-id"));
    var keyMsg = isNotUndefined(section.data("key-msg"));
    var assetDescription = isNotUndefined(section.data("screen-description"));

    var SurveyTable = {
        'check_box': ".table-survey > tbody > tr > th",
        'radio': ".table-survey-radio > tbody > tr > th",
        'input_text': ".text-field-output > .sl-block-content > div",
        'dropdown': ".select-survey-output > .sl-block-content > div"
    };

    var ref = [];
    var survey = [];
    ref = getReferences(ref, section);
    survey = getSurvey(survey, SurveyTable, section);
    outerHTML =  btoa(RawDeflate.deflate(outerHTML));
    objToSend["index" + i + index] = {
        "section": outerHTML,
        "tagParent": tagParent,
        "screenName": screenName,
        "chapterName": chapterName,
        "screenId": screenId,
        "keyMsg": keyMsg,
        "assetDescription": assetDescription,
        "linkedRef": ref,
        "dataId": sectionDataId,
        "parent": parent,
        "survey": survey
    };
}
function isNotUndefined(obj) {
    if (typeof obj != 'undefined') {
        return obj;
    }
    return null;
}

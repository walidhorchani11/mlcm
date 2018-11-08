/***********************Add Slides***********************/
Reveal.addEventListener('ready', function () {
    Reveal.slide(0,0,0);
    var tabChecked = TWIG.tabChecked;    // get all sections
    var section = $('.slides section');
    var imgClosePopin = TWIG.btClosePopin;
    if (imgClosePopin === '/') {
        imgClosePopin = "/img/close_ref.png";
    }
    if (section != undefined && section !== false) {
        // duplicate each sections / slide
        section.each(function () {
            var $slide = $(this);
            if (!$slide.hasClass('stack')) {
                if ($slide.attr('class') == '') {
                    $slide.attr('class', 'future');
                }

                //Add Slide RCP
                if (tabChecked.indexOf("rcp-popup") > -1) {
                    if ($slide.is($('.slides section').last()) === true) {
                        if ($('#textRcp').find('a').length > 1) {
                            var newSlide = cloneSlide($slide);
                            $slide.after(newSlide);
                        }
                    }
                }

                //Add Slides Popin
                if (tabChecked.indexOf("popin") > -1) {
                    addSlidePopin($slide, imgClosePopin);
                }

                //Add Slide References
                if (tabChecked.indexOf("ref-popup") > -1) {
                    if ($('.refSection[id="' + $slide.attr('data-id') + '"]').html() != undefined) {
                        var newSlide = cloneSlide($slide);
                        newSlide.attr('reference-page', '1');
                        $slide.after(newSlide);
                    }
                }

                //Add Slides Annimation
                if (tabChecked.indexOf("annimation-slide") > -1) {
                var annimation = occurrenceAnnimation($slide);
                if (annimation === 1) {
                    opacityAnnimationSlide($slide);}
                }
            }
        });
    }
    var $currentSlide = $('.slides section:eq(0)');
    if ($('section:eq(0)').hasClass('stack')) {
        $currentSlide = $('section:eq(1)');
    }
    intValueDiv($currentSlide, tabChecked);
    duplicateSlideNotes($currentSlide);
    initvideos();
});
/******************************End Add Slide*********************/

/******************************clone Slide*********************/
function cloneSlide($slide) {
    var newSlide = $slide.clone();
    newSlide.attr({'class': 'future', 'duplicateSlide': '1', 'new-slide': '1'});
    return newSlide;
}
/******************************End clone Slide*********************/

/******************************Get occurrence annimation in Slide*********************/
function occurrenceAnnimation($slide) {
    var annimation = 0;
    $slide.find('.sl-block-content').each(function () {
        if ($(this).attr('data-animation-type') != null) {
            annimation = 1;
            $(this).css('opacity', '0');
        }
    });
    return annimation;
}
/******************************End get occurrence annimation in Slide*********************/

/******************************Find opacity annimation object in Slide*********************/
function opacityAnnimationSlide($slide) {
    var newSlide1 = cloneSlide($slide);
    var newSlide2 = cloneSlide($slide);
    $slide.find('.sl-block-content').each(function () {
        if ($(this).attr('data-animation-type') != null) {
            newSlide2.find('.sl-block-content')
                .addClass('first-annim')
                .css({'opacity': '1', 'transition-duration': '0', 'transition-delay': '0'});
            newSlide1.find('[data-animation-type]').css('opacity', '0.5');
        }
    });
    $slide.after(newSlide1);
    newSlide1.after(newSlide2);
}
/******************************End find opacity annimation object in Slide*********************/

/******************************Add Slide Popin*********************/
function addSlidePopin($slide, imgClosePopin) {
    var tablePopin = [];
    var idxTablePopin = 1;
    $slide.find('.sl-block[data-popup]').each(function () {
        var dataIdPop = $(this).attr('data-popup');
        var occurencePopin = 0;
        $.each(tablePopin, function (key, value) {
            if (dataIdPop === value) {
                occurencePopin = 1;
            }
        });
        if (occurencePopin === 0) {
            tablePopin[idxTablePopin] = dataIdPop;
            idxTablePopin++;
            var newSlide = $('.slidespop').find('section[data-id=' + dataIdPop + ']').clone();
            newSlide.append('<span class="closePopinPdf"><img src="' + imgClosePopin + '" style="width:' +
                ' 50px;height: 50px; "></span>');
            newSlide.attr({'class': 'future', 'popin-page': '1', 'popin-id': dataIdPop});
            $slide.after(newSlide);

            //Add Slide annimation popin
            var annimation = occurrenceAnnimation(newSlide);
            if (annimation === 1) {
                opacityAnnimationSlide(newSlide);
            }
        }
    });
}
/******************************End add slide popin*********************/

/*************************** Init value Div Functions *****************************/
function intValueDiv($currentSlide, tabChecked) {
    var popinPage = 0;
    if ($currentSlide.attr('popin-page')) {
        popinPage = 1;
    }
    if (popinPage === 0) {
        if (tabChecked.indexOf("name-screen") > -1) {
            appendElement($currentSlide, 'data-screen-name', 'Screen Name:', $('#screen-name'));}
        if (tabChecked.indexOf("title-screen-name") > -1) {
        appendElement($currentSlide, 'data-screen-name', 'Screen Name:', $('#title-screen-name'));}
        if (tabChecked.indexOf("chapter-name") > -1) {
        appendElement($currentSlide, 'data-chapter-name', 'Chapter Name:', $('#chapter-name'));}
        if (TWIG.plateform === 'mi') {
            if (tabChecked.indexOf("page-id") > -1) {
            appendElement($currentSlide, 'data-screen-description', 'Page ID:', $('#screen-page-id'));}
        } else {
            if (tabChecked.indexOf("key-message") > -1) {
            appendElement($currentSlide, 'data-key-msg', 'Key Message:', $('#key-message'));}
        }
    } else {
        var namePopin = $currentSlide.attr('data-popin-name');
        if (tabChecked.indexOf("popin") > -1) {
        $('#screen-name').append('<strong class="title">Popin Name: </strong>' + namePopin);
        $('#title-page-id').append('Popin page');}
    }
    var idNote = $('.note');
    if (tabChecked.indexOf("link-pdf") > -1) {
    appendDiv(idNote, "link-pdf");
    getLinkToPdf($currentSlide);}
    if (tabChecked.indexOf("animations") > -1) {
    appendDiv(idNote, "animations");
    getAnnimation($currentSlide);}
    if (popinPage === 0) {
        if (tabChecked.indexOf("link-popin") > -1) {
        appendDiv(idNote, "link-popin");
        getLinkToPopin($currentSlide);}
        if (tabChecked.indexOf("link-screen") > -1) {
        appendDiv(idNote, "link-screen");
        getLinkToScreen($currentSlide);}
        if (tabChecked.indexOf("references") > -1) {
        appendDiv(idNote, "references");
        getNoteRef($currentSlide);}
        showRCPIcn();
    }
    if (tabChecked.indexOf("scrollable-txt") > -1) {
    appendDiv(idNote, "scrollable-txt");
    getScrollableTxt($currentSlide);}

}
/*************************** End Init value Div Functions *****************************/

/********* Append div ****************/
function appendDiv(idNote, idDiv) {
    idNote.append('<div class="note-item" id="' + idDiv + '"></div>');
}
/*********End Append div****************/

/********* showRCPIcn ****************/
function showRCPIcn() {
    if ($('#textRcp').find('a').length === 0) {
        $('.rcp-link-eadv').css("opacity", "0.5");
    } else {
        $('.rcp-link-eadv').css("opacity", "1");
    }
}
/*********End showRCPIcn****************/

/********* Append information element ****************/
function appendElement($currentSlide, attrelem, title, idElement) {
    var dataElement = $currentSlide.attr(attrelem);
    var txtElement = '<strong class="title">' + title + ' </strong>';
    if ((dataElement != null) && (dataElement != '')) {
        if($('#title-screen-name')[0] == $(idElement)[0]){
            idElement.append(txtElement + '<span>' + dataElement + '</span>');
        }else {
            idElement.append(txtElement + dataElement);
        }
    } else {
        idElement.append(txtElement + '<span> N/A</span>');
    }
}
/*********End Append information element ****************/

/********* Reference ****************/
function getNoteRef($currentSlide) {
    var ref = 0;
    var idxRef = 1;
    var orderRef;
    var occurence = 0;
    var styleItalic = 0;
    var idRef = $('#references');
    if (getOccurenceTxt($currentSlide, '#link-animations') && getOccurenceTxt($currentSlide, '#popin-link') &&
        getOccurenceTxt($currentSlide, '#pdf-link') && getOccurenceTxt($currentSlide, '#screen-link')) {
        occurence = 1;
    }
    $('#tempReferences').find('.refSection[id="' + $currentSlide.attr('data-id') + '"]').find('.row-ref').each(function () {
        var $slBlock = $(this);
        var textHtml = '';
        var txtLinkEleme;
        var occurenceLink = 1;
        var descRef = $slBlock.find('.descRef').clone();
        descRef.each(function () {
            $(this).parent().removeAttr('style');

            $(this).find('*').each(function () {
                if ($(this).attr('style') != undefined) {
                    if ($(this).attr('style').indexOf("italic") !== -1) {
                        $(this).removeAttr('style');
                        $(this).addClass('txt-italic');
                    } else {
                        $(this).removeAttr('style');
                    }
                }
            });
            $(this).find('br').remove();
            $(this).html($(this).html().replace('&nbsp;', ''));
        });
        descRef = getSubString(descRef.html());

        var txtRef = $slBlock.find('.codeRef').text();

        $.each(descRef, function (index, value) {
            orderRef = $currentSlide.find('.sub-notes #ref-link').text();
            if (index === 0) {
                txtLinkEleme = str_insert(value, '<p>', txtRef);
            } else {
                txtLinkEleme = value;
            }
            idxRef = getObjectLink($currentSlide, txtLinkEleme, idRef, 1, idxRef, 'data-idx-ref', 'ref-link', occurence);
        });
    });

    ref = 1;
        //Description References
        var txtRefWrapper = $('#tempReferences').find('.refSection[id="' + $currentSlide.attr('data-id') + '"]').find('.row-ref:last').nextAll();
        var descriptionRef = '';
        txtRefWrapper.each(function () {
            var descRef = $(this).clone();
            $(descRef).find('*[style]').removeAttr('style');
            $(descRef).find('br').remove();
            if ($(descRef).html() === '&nbsp;') {
                $(descRef).html($(descRef).html().replace('&nbsp;', ''));
            }
            $('p:empty').remove();

            descriptionRef = descriptionRef + '<p>' + $(descRef).html() + '</p>';
        });
        descriptionRef = getSubString(descriptionRef);
        if (txtRefWrapper.text() != '') {
            $.each(descriptionRef, function (index, value) {
                orderRef = $currentSlide.find('.sub-notes #ref-link').text();
                if (occurence === 0 && orderRef == undefined) {
                    occurenceLink = 0;
                }
                idxRef = getObjectLink($currentSlide, value, idRef, 1, idxRef, 'data-idx-ref', 'ref-link', occurence);
            });
        }
    // });
    addTitle(ref, idRef, '#references', 'References:', 'references');
    if (ref === 0) {
        $('.ref-link').css("opacity", "0.5");
    } else {
        $('.ref-link').css("opacity", "1");
    }

}
String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
}
function str_insert($str, $search, $insert) {
    $index = $str.indexOf($search);
    if ($index < 0) {
        return $search + $str;
    } else {
        return $str.insertAt($index + 3, $insert);
    }
}
/*********End Reference****************/

/********* get object linked  ****************/
function getObjectLink($currentSlide, txtLink, idObjectlink, opacityObject, idObject, elem, linkobject, occurenceLink) {
    var textHtml = $('<p>' + txtLink + '</p>');
    var txtLinkObject = '<div class="sub-notes" hidden="true"><div id="' + linkobject + '" opacity="' + opacityObject + '"'
        + elem + '="' + idObject + '"> <p>' + txtLink + '</p></div></div>';
    var orderLink = $currentSlide.find('.sub-notes #' + linkobject).text();
    if (occurenceLink === 0 && orderLink == undefined) {
        occurenceLink = 0;
    }
    if (occurenceLink === 1) {
        $currentSlide.append(txtLinkObject);
        idObject = idObject + 1;
    } else {
        idObjectlink.append(textHtml);
        getResolution(idObjectlink.find(textHtml), opacityObject);
        var noteHeight = $(".note").height();
        if (parseInt(noteHeight) > 370) {
            $currentSlide.append(txtLinkObject);
            idObjectlink.find(textHtml).remove();
            idObject = idObject + 1;
        }
    }
    return idObject;
}
/*********End get object linked ****************/

/********* Add title  ****************/
function addTitle(LinkToObject, idObjectLink, id, title, elem) {
    if (LinkToObject === 1) {
        if (idObjectLink.html() != '') {
            idObjectLink.prepend('<strong class="title">' + title + ' </strong><br>');
        }
    } else {
        $('.note').find(id).remove();
        $('#key-message').after('<div class="note-item" id="' + elem + '"><strong' +
            ' class="title">' + title + '</strong> N/A</div>');
    }
}
/*********End Add title ****************/

/********* Add title  ****************/
function getTextLinked($txtLinked) {
    if ($txtLinked.find('.ref-container').text() != '') {
        $txtLinked.find('.ref-container').remove();
    }
    return getSubString($txtLinked.text());
}
/*********End Add title ****************/

/*********SCROLLABLE TEXT*****************/
function getScrollableTxt($currentSlide) {
    var occurenceScrollable = 0;
    var idxScrollable = 0;
    var orderScrollable;
    var txtScrollable;
    var idScrollable = $('#scrollable-txt');
    var occurenceLink = 0;
    if (getOccurenceTxt($currentSlide, '#link-animations') && getOccurenceTxt($currentSlide, '#popin-link') &&
        getOccurenceTxt($currentSlide, '#pdf-link') && getOccurenceTxt($currentSlide, '#screen-link')
        && getOccurenceTxt($currentSlide, '#ref-link')) {
        occurenceLink = 1;
    }
    $currentSlide.find('.sl-block[data-block-type="scrollabletext"]').each(function () {
        var slBlock = $(this).clone();
        txtScrollable = getSubString($.trim(slBlock.text()));
        $.each(txtScrollable, function (index, value) {
            orderScrollable = $currentSlide.find('.sub-notes #scrollable-txt').text();
            if (occurenceLink === 0 && orderScrollable == undefined) {
                occurenceLink = 0;
            }
            idxScrollable = getObjectLink($currentSlide, value, idScrollable, 1, idxScrollable,
                'data-idx-scrollable-txt', 'txt-scrollable-link', occurenceLink);
        });
        occurenceScrollable = 1;
    });
    addTitle(occurenceScrollable, idScrollable, '#scrollable-txt', 'SCROLLABLE TEXT:', 'scrollable-txt');
}
/*********End SCROLLABLE TEXT****************/

/*********Link to pdf*****************/
function getLinkToPdf($currentSlide) {
    var LinkToPdf = 0;
    var textPdf = '<strong class="title">Link to pdf </strong>';
    var idPdf = 1;
    var idPdfLink = $('#link-pdf');
    $currentSlide.find('.sl-block').each(function () {
        var $slBlock = $(this);
        var opacityObject = $slBlock.find('.block-style').css('opacity');
        if ($slBlock.attr('pdf-link') != null) {
            var dataLink = $slBlock.attr("data-pdf-name");
            var txtpdfLink = ' ' + textPdf + dataLink;
            if ($slBlock.attr('data-block-type') === 'text') {
                var txtLink = getTextLinked($slBlock.find('.sl-block-content'));
                var txtPdf;
                var txtLength = txtLink.length - 1;
                $.each(txtLink, function (index, value) {
                    if (txtLength == index) {
                        txtPdf = value + ' ' + txtpdfLink + '<br>';
                    } else {
                        txtPdf = value + '<br>';
                    }
                    idPdf = getObjectLink($currentSlide, txtPdf, idPdfLink, opacityObject, idPdf, 'data-idx-pdf', 'pdf-link');
                });
            } else {
                var txtLink = $slBlock.find('.block-style').children().html() + ' ' + txtpdfLink + '<br>';
                idPdf = getObjectLink($currentSlide, txtLink, idPdfLink, opacityObject, idPdf, 'data-idx-pdf', 'pdf-link');
            }
            LinkToPdf = 1;
        }
    });
    addTitle(LinkToPdf, idPdfLink, '#link-pdf', 'Link to pdf:', 'link-pdf');
}
/*********End Link to pdf****************/

/*********Link to Popin*****************/
function getLinkToPopin($currentSlide) {
    var linkToPopin = 0;
    var textPopin = '<strong class="title">Link to Popin </strong>';
    var idPopin = 0;
    var idLinkPopin = $('#link-popin');
    var occurenceLink = 0;
    if (getOccurenceTxt($currentSlide, '#pdf-link') && getOccurenceTxt($currentSlide, '#link-animations')) {
        occurenceLink = 1;
    }
    $currentSlide.find('.sl-block').each(function () {
        var $slBlock = $(this);
        var opacityObject = $slBlock.find('.block-style').css('opacity');
        if ($(this).attr('data-popup') != null) {
            var txtPopin = textPopin + $('.slidespop').find('section[data-id=' + $slBlock.attr('data-popup') +']').attr('data-popin-name')
            if ($slBlock.attr('data-block-type') === 'text') {
                var txtLink = getTextLinked($slBlock.find('.sl-block-content'));
                var txtelem;
                $.each(txtLink, function (index, value) {
                    if (txtLink.length - 1 == index) {
                        txtelem = value + ' ' + txtPopin + '<br>';
                    } else {
                        txtelem = value + '<br>';
                    }
                    idPopin = getObjectLink($currentSlide, txtelem, idLinkPopin, opacityObject, idPopin,
                        'data-idx-popin', 'popin-link', occurenceLink);
                });
            } else {
                var txtLinkPopin = $slBlock.find('.block-style').children().html() + ' ' + txtPopin + '<br>';
                idPopin = getObjectLink($currentSlide, txtLinkPopin, idLinkPopin, opacityObject, idPopin,
                    'data-idx-popin', 'popin-link', occurenceLink);
            }
            linkToPopin = 1;
        }
    });
    addTitle(linkToPopin, idLinkPopin, '#link-popin', 'Link to popin:', 'link-popin');
}
/*********End Link to Popin****************/

/*********Link to Screen *****************/
function getLinkToScreen($currentSlide) {
    var LinkToScreen = 0;
    var idScreen = 1;
    var occurrencePopin = 0;
    var idLinkScreen = $('#link-screen');
    if (getOccurenceTxt($currentSlide, '#popin-link') && getOccurenceTxt($currentSlide, '#pdf-link') &&
        getOccurenceTxt($currentSlide, '#link-animations')) {
        occurrencePopin = 1;
    }
    var textScreen = '<strong class="title">Link to screen </strong>';
    $currentSlide.find('.sl-block').each(function () {
        var $slBlock = $(this);
        var datalink = $slBlock.attr('data-link');
        var dataLinkT = $slBlock.attr('data-block-type');
        var opacityObject = $slBlock.find('.block-style').css('opacity');
        var SlideName = null;
        if (datalink != null) {
            $('.menu-level1').each(function () {
                if (parseInt($(this).attr('data-item')) === parseInt(datalink) + 1) {
                    SlideName = $(this).text();
                }
            });
            if (SlideName === null) {
                $('.wrapper-submenu').find('ul').find('li').each(function () {
                    if (parseInt($(this).attr('data-item')) === parseInt(datalink) + 1) {
                        SlideName = $(this).text();
                    }
                });
            }
            if (SlideName != null) {
                if (dataLinkT === 'text') {
                    var txtLink = getTextLinked($slBlock.find('.sl-block-content'));
                    var txtelem;
                    $.each(txtLink, function (index, value) {
                        if (txtLink.length - 1 == index) {
                            txtelem = value + ' ' + textScreen + SlideName + '<br>';
                        } else {
                            txtelem = value + '<br>';
                        }
                        idScreen = getObjectLink($currentSlide, txtelem, idLinkScreen, opacityObject, idScreen,
                            'data-idx-screen', 'screen-link', occurrencePopin);
                    });
                } else {
                    var txtLinkScreen = $slBlock.find('.block-style').children().html() + ' ' + textScreen +
                        SlideName + '<br>';
                    idScreen = getObjectLink($currentSlide, txtLinkScreen, idLinkScreen, opacityObject, idScreen,
                        'data-idx-screen', 'screen-link', occurrencePopin);
                }
                LinkToScreen = 1;
                idScreen = idScreen + 1;
            }
        }
    });
    addTitle(LinkToScreen, idLinkScreen, '#link-screen', 'Link to screen:', 'link-screen');
}
/*********End Link to Screen****************/

/*********Annimation*****************/
function getAnnimation($currentSlide) {
    var annimation = 0;
    var attrText = '';
    var idAnnimation = 1;
    var annimationType;
    var idLinkAnnimation = $('#animations');
    var occurrenceLink = 0;
    if (getOccurenceTxt($currentSlide, '#pdf-link')) {
        occurrenceLink = 1;
    }
    $currentSlide.find('.sl-block-content').each(function () {
        var $slBlock = $(this);
        var opacityObject = $slBlock.parent().css('opacity');
        if ($slBlock.attr('data-animation-type') != null) {
            annimationType = $slBlock.parent().parent().attr('data-block-anim');
            if (annimationType === undefined) {
                annimationType = ' Autoplay';
            } else {
                annimationType = ' By Tap';
            }
            attrText = $slBlock.parent().parent().attr('data-block-type');
            var txtLinkAnnimation = '';
            annimation = 1;
            var textAnnimation = $('<p><strong class="title">Effect: </strong></p>');
            var dataAnnimation = $('<p>' + $slBlock.attr('data-animation-type') + annimationType + '</p>');
            if (attrText === 'text') {
                var txtLink = getTextLinked($slBlock);
                var txtelem;
                $.each(txtLink, function (index, value) {
                    if (txtLink.length - 1 == index) {
                        txtelem = value + ' ' + textAnnimation.text() + dataAnnimation.text() ;
                    } else {
                        txtelem = value ;
                    }
                    idAnnimation = getObjectLink($currentSlide, txtelem, idLinkAnnimation, opacityObject, idAnnimation,
                        'data-idx-annim', 'link-animations', occurrenceLink);
                });
            } else {
                txtLinkAnnimation = $slBlock.html() + ' ' + textAnnimation.text() + dataAnnimation.text() ;
                idAnnimation = getObjectLink($currentSlide, txtLinkAnnimation, idLinkAnnimation, opacityObject, idAnnimation,
                    'data-idx-annim', 'link-animations', occurrenceLink);
            }
            attrText = "";
        }
    });
    addTitle(annimation, idLinkAnnimation, '#animations', 'Animation:', 'animations');
}
/*********End Annimation ****************/

/*************************** Get occurrence text duplicated Functions *****************************/
function getOccurenceTxt(currentSlide, txtSelector) {
    return currentSlide.find('.sub-notes').find(txtSelector).text() != undefined
        && currentSlide.find('.sub-notes').find(txtSelector).text() != '';
}
/*************************** End occurrence txt text duplicated Functions *****************************/

/*********Resolution img or shape ****************/
function getResolution(blockResol, styleLink) {
    if ((parseInt(blockResol.find('svg').attr('data-natural-width')) > 30)
        || (parseInt(blockResol.find('svg').attr('data-natural-height')) > 30)
        || (parseInt(blockResol.find('svg').attr('width')) > 30)
        || (parseInt(blockResol.find('svg').attr('width')) > 30)) {
        blockResol.find('svg').attr({'width': '30px', 'height': '30px'});
    }
    if (blockResol.find('table').text().length === 0) {
        blockResol.find('table').css({'width': '40%', 'min-height': '50px'});
    }
    var attrShape = blockResol.find('svg').find('rect').attr('fill');
    if (attrShape === "rgba(0, 0, 0, 0)" || attrShape === "rgb(255, 255, 255)") {
        var svg = blockResol.find('svg').html();
        var img = '<img src="' + TWIG.img + '" width="30px" height="30px">';
        blockResol.find('svg').replaceWith(img);
    }
    if (parseInt(styleLink) === 0) {
        var img = '<img src="' + TWIG.img + '" width="30px" height="30px">';
        blockResol.find('svg').replaceWith(img);
    }
    if ((parseInt(blockResol.find('img').attr('data-natural-width')) > 40)
        || (parseInt(blockResol.find('img').attr('data-natural-height')) > 40)
        || (parseInt(blockResol.find('img').attr('width')) > 40)
        || (parseInt(blockResol.find('img').attr('width')) > 40)) {
        blockResol.removeAttr('width height data-natural-height data-natural-width');
        blockResol.find('img').attr({'height': '40px', 'width': '40px'});
    }
}
/*********End Resolution img or shape ****************/

/*********substring text ****************/
function getSubString(txtLink) {
    var table = [];
    var index = 0;
    var nbrElemeTab = Math.ceil(txtLink.length / 900);
    $.each(new Array(nbrElemeTab),
        function () {
            if (txtLink.length > 900) {
                var txtLink1 = txtLink.substring(0, 900);
                var pos = txtLink1.lastIndexOf(' ');
                var txtLinkfirst = txtLink.substring(0, pos);
                txtLink = txtLink.substring(pos + 1, txtLink.length);
                table[index] = txtLinkfirst;
                index += 1;
            } else {
                table[index] = txtLink;
                index += 1;
            }
        });
    return table;
}
/*********End SubString text****************/

/********* Empty div ****************/
function emptyDiv() {
    $('#key-message, #screen-name,  #screen-page-id, #title-page-id, #title-screen-name, #chapter-name').empty();
    $('#references, #link-pdf, #link-screen, #animations, #link-popin, #scrollable-txt ').remove();
}
/*********End Empty div ****************/

/********* prepend Function ****************/
function prepend(selector, value) {
    if ((selector != null) && (selector.html() != "")) {
        selector.prepend('<strong class="title">' + value + '</strong><br>')
    }
}
/********* End prepend Function ****************/

/*********  Form Note In Slide  ****************/
function formNotesSlides($currentSlide) {
    prepend($('#animations'), 'Animation:');
    prepend($('#link-screen'), 'Link to screen:');
    prepend($('#link-pdf'), 'Link to pdf:');
    prepend($('#link-popin'), 'Link to popin:');
    prepend($('#references'), 'References:');
    prepend($('#scrollable-txt'), 'SCROLLABLE TEXT:');
    //Add screen name
    if ($currentSlide.attr('popin-page') === undefined) {
        if (($currentSlide.attr('data-screen-name') != null) && ($currentSlide.attr('data-screen-name') != '')) {
            $('#title-screen-name').append('<strong class="title">Screen Name: </strong><span>'
                + $currentSlide.attr('data-screen-name') + '</span>');
        } else {
            $('#title-screen-name').append('<strong class="title">Screen Name: </strong> <span>N/A</span>');
        }
    }
}
/********* End form Note In Slide ****************/

/*********************  Add object linked  ****************/
function addObjectLinked(objectLinked, idNote, idObject, idItem, idxData) {
    var idxReference = 0;
    var note = $('.note');
    objectLinked.find(idNote).each(function () {
        if (note.find(idObject).length < 1) {
            note.append('<div class="note-item" id="' + idItem + '"></div>');
        }
        getResolution($(this).parent(), $(this).attr('opacity'));
        var dataIdx = parseInt($(this).attr(idxData));
        if (idxReference === 0) {
            $(idObject).append($(this).parent().html());
            var noteHeight = note.height();
            if (parseInt(noteHeight) > 450) {
                idxReference = 1;
                var valueObject = $(idObject).find('[' + idxData + '=' + dataIdx + ']');
                valueObject.remove();
            } else {
                $(this).remove();
            }
        }
    });
}
/************************ End add object linked ****************/

/********* Add Notes In Slide Duplicate ****************/
function addNotesSlides($currentSlide) {
    if ($currentSlide.attr('dublicate-notes')) {
        if ($currentSlide.attr('popin-page')) {
            $('#title-page-id').append('Popin page');
        }
        var subNoteSlide = $currentSlide.find('.sub-notes');
        addObjectLinked(subNoteSlide, '#pdf-link', '#link-pdf', 'link-pdf', 'data-idx-pdf');
        if (!getOccurenceTxt($currentSlide, '#pdf-link')) {
            addObjectLinked(subNoteSlide, '#link-animations', '#animations', 'animations', 'data-idx-annim');
            if (!getOccurenceTxt($currentSlide, '#link-animations')) {
                addObjectLinked(subNoteSlide, '#popin-link', '#link-popin', 'link-popin', 'data-idx-popin');
                if (!getOccurenceTxt($currentSlide, '#popin-link')) {
                    addObjectLinked(subNoteSlide, '#screen-link', '#link-screen', 'link-screen', 'data-idx-screen');
                    if (!getOccurenceTxt($currentSlide, '#screen-link')) {
                        addObjectLinked(subNoteSlide, '#ref-link', '#references', 'references', 'data-idx-ref');
                        if (!getOccurenceTxt($currentSlide, '#ref-link')) {
                            addObjectLinked(subNoteSlide, '#txt-scrollable-link', '#scrollable-txt', 'scrollable-txt', 'data-idx-scrollable-txt');
                        }
                    }
                }
            }
        }
        formNotesSlides($currentSlide);
    }
}
/********* End Clear div Notes is empty ****************/

/********* Clear div Notes is empty ****************/
function clearDivNotes($currentSlide) {
    $currentSlide.find('.sub-notes').each(function () {
        if ($(this).html() === '') {
            $(this).remove();
        }
    });
}
/********* End Clear div Notes is empty ****************/

/********* Duplicate Slide Notes ****************/
function duplicateSlideNotes($currentSlide) {
    if (($currentSlide.find('.sub-notes').html() != undefined)) {
        var newSlide = $currentSlide.clone();
        newSlide.attr({'class': 'future', 'new-slide': '1', 'dublicate-notes': '1'});
        $currentSlide.after(newSlide);
    }
}
/********* End Duplicate Slide Notes ****************/

/********* Show RCP In Slide ****************/
function showRCPPopinInSlide($currentSlide) {
    if ($currentSlide.is($('.slides section').last()) === true) {
        if ($('#textRcp').find('a').length > 1) {
            $('.linked-pdf').attr("style", "display: block;");
            $('.BlockRcpOverlay').attr("style", "display: block;");
        }
    }
}
/********* End  Show RCP In Slide ************/

/********* Show Ref Popin In Slide ****************/
function showRefPopinInSlide($currentSlide) {
    if ($currentSlide.attr('reference-page')) {
        var idSection = $currentSlide.attr('data-id');
        var txtRef = $('.refSection[data-id="' + $currentSlide.attr('data-id') + '"]').html() ;
        $('.wrapper-refs').html($('.refSection[data-id="' + $currentSlide.attr('data-id') + '"]').html() );
        $('.BlockRef').attr("style", "display: block;");
        $('.BlockRcpOverlay').attr("style", "display: block;");
    }
}
/********* End  Show Ref Popin In Slide  ************/

/********* Show img in VD ************/
function initvideos() {
    var $videos = $('.slides').find('.sl-block[data-block-type="video"]');

    if ($videos.length > 0) {
        $videos.find('.video-placeholder').remove();
        $videos.each(function (index, value) {
            var $elm = $(value),
                poster = $elm.attr('data-video-poster'),
                video = $elm.find('video'),
                videoheight = $elm.height(),
                videowidth = $elm.width();

            video.remove();
            $elm.find('.sl-block-content').append('<img src="' + poster + '" height="' + videoheight + '" width="' + videowidth + '" />');
            $elm.append('<div class="video-placeholder"></div>');
        });
    }
}
/********* End Show img in VD ************/

/********* Add Notes To Slide Duplicate in (Annimation, Rcp, Ref)****************/
function duplicatedNotesSlides($currentSlide, tabChecked) {
    if ($currentSlide.attr('duplicateSlide') && !($currentSlide.attr('reference-page'))) {
        intValueDiv($currentSlide, tabChecked);
        $currentSlide.find('.sub-notes').empty();
    }
    if ($currentSlide.attr('reference-page') != null) {
        $('#title-page-id').append('Reference page');
        $('.BlockRef').find('.item-ref-wrapper').append($('.refSection[id="' + $currentSlide.attr('data-id') + '"]').find('.item-ref-wrapper').html());
    }
}
/********* End Add Notes To Slide Duplicate in (Annimation, Rcp, Ref)****************/


Reveal.addEventListener('slidechanged', function (event) {
    Reveal.sync();
    $('.BlockRef').find('.item-ref-wrapper').empty();
        var tabChecked = TWIG.tabChecked;
    $('.reveal').removeClass('ready');
    $('.BlockRef').attr("style", "display: none;");
    $('.BlockRcpOverlay').attr("style", "display: none;");
    var $currentSlide = $(Reveal.getCurrentSlide());
    //Add Class ready to annimation Slide
    $currentSlide.find('.first-annim').each(function () {
        $('.reveal').addClass('ready');
    });
    emptyDiv();
    if (!$currentSlide.attr('new-slide')) {
        intValueDiv($currentSlide, tabChecked);
    }
    //Duplicate Notes In Slide Duplicate in (Annimation, Rcp, Ref)
    duplicatedNotesSlides($currentSlide, tabChecked);

    //Add Notes In Slide Duplicated
    addNotesSlides($currentSlide);

    // Clear div Notes is empty
    clearDivNotes($currentSlide);

    // Duplicate Slide
    duplicateSlideNotes($currentSlide);

    //Add RCP Popin In last Slide
    if (tabChecked.indexOf("rcp-popup") > -1) {
        showRCPPopinInSlide($currentSlide);
    }

    //Add Refrence Popin In Slide
    showRefPopinInSlide($currentSlide);
});
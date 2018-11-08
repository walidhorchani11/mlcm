/***********************Add Slides***********************/
Reveal.addEventListener('ready', function () {
    Reveal.slide(0,0,0);
    //Remove backgrounds slide
    $('.backgrounds').remove();
    // get all sections
    var tabChecked = TWIG.tabChecked;
    var slide;
    var section = $('.slides section');
    var currentSlide = $('section:first');
    if (currentSlide.hasClass('stack')) {
        currentSlide = $('section:eq(1)');
    }
    var SurveyOcc = 0;
    if (tabChecked.indexOf("survey") > -1) {
        if (section != undefined && section !== false) {
            // duplicate each sections / slide
            section.each(function () {
                slide = $(this);
                if (!slide.hasClass('stack')) {
                    //Get All Survey
                    if (!(slide.find('.sub-notes')) || !(slide.find('.table-survey-radio').html() === undefined)
                        || !(slide.find('.select-survey-output').html() === undefined)
                        || !(slide.find('.table-survey').html() === undefined) || !(slide.find('.text-field-output').html() === undefined)) {
                        SurveyOcc = 1;
                        getSurvey(slide, currentSlide);
                    }
                }
            });
        }
    }
    var slideParent;
    initRefRCP(currentSlide, SurveyOcc, tabChecked);
    section.each(function () {
        slide = $(this);
        slideParent = $('section:first');
        if (!slide.is(slideParent) && !slide.is(currentSlide)) {
            if (!(slide.attr('new-slide'))) {
                slide.remove();
            }
        }
    });
});
/******************************End Add Slide*********************/

/******************************Init Reference and RCP*********************/
function initRefRCP(currentSlide, SurveyOcc, tabChecked) {
    var $idrefNote = $('#ref-note');
    var reftitle = 'REFERENCES LIST:';
    var $idSurvey = $('#survey-title');
    var surveyTitle = 'SURVEY:';
    var $idRCP = $('#rcp');
    var rcpTitle = 'PDF LIST:';

    if ((SurveyOcc === 0) && (($('#arcp').text()).length == 0) && (($('#aref').text()).length == 0 )) {
        addTitleNA('ref-note', reftitle);
        addTitleNA('survey-title', surveyTitle);
        addTitleNA('rcp', rcpTitle);
    } else {
        //Add Ref list
        if (tabChecked.indexOf("list-ref") > -1) {
            getRef(currentSlide);
            if ($idrefNote.html() != "") {
                addTitle($idrefNote, reftitle);
            } else if (($('#aref').text()).length == 0) {
                addTitleNA('ref-note', reftitle);
            }
        }
        //Add survey title
        if (tabChecked.indexOf("survey") > -1) {
            if ((SurveyOcc === 0)) {
                addTitleNA('survey-title', surveyTitle);
            } else {
                addTitle($idSurvey, surveyTitle);
            }
        }
        //Add Rcp list
        if (tabChecked.indexOf("list-rcp") > -1) {
            showRCPSlide(currentSlide);
            if ($idRCP.html() != "") {
                addTitle($idRCP, rcpTitle);
            } else if (($('#arcp').text()).length == 0) {
                addTitleNA('rcp', rcpTitle);
            }
        }
        duplicateSlideNotes(currentSlide);
        clearDivNotes(currentSlide);
    }
}
/******************************End Remove empty Slide*********************/

/******************************Add title element*********************/
function addTitle($id, title) {
    $id.prepend('<strong class="title">' + title + ' </strong><br>');
}
function addTitleNA(id, title) {
    var $note = $('.note');
    $('#' + id).remove();
    $note.prepend('<div class="note-item" id="' + id + '"></div>');
    addTitle($('#' + id), title + 'N/A');
}
/******************************End add title element*********************/

/********* get object linked  ****************/
function getObjectLink(currentSlide, txtLink, classObject, occurence, idNote) {
    var textHtml = $('<p>' + txtLink + '</p>');
    var txtObejctLinked = '<div class="sub-notes" hidden="true"><div id="' + idNote + '" >' + txtLink + '</div></div>';
    var orderLink = currentSlide.find('.sub-notes #' + idNote).text();
    if (occurence === 1 || orderLink.length > 0) {
        occurence = 1;
    }
    if (occurence === 1) {
        currentSlide.append(txtObejctLinked);
    } else {
        classObject.append(textHtml);
        if (parseInt($(".note").height()) > 350) {
            currentSlide.append(txtObejctLinked);
            classObject.find(textHtml).remove();
        }
    }
}
/*********End get object linked ****************/

/********* Show RCP In Slide ****************/
function showRCPSlide(currentSlide) {
    var idRCP = $('#rcp');
    var textHtml;
    var occurence = getOccurenceTxt(currentSlide, '#note-survey-select') && getOccurenceTxt(currentSlide, '#note-survey-radio')
        && getOccurenceTxt(currentSlide, '#note-survey-select') && getOccurenceTxt(currentSlide, '#note-survey-input')
        || getOccurenceTxt(currentSlide, '#note-ref');
    if (occurence) {
        occurence = 1;
    } else {
        occurence = 0;
    }
    var indx = 0;
    //Rcp list
    if ($('#textRcp').find('a').html() != null) {
        $('#textRcp').find('a').each(function () {
            indx = indx + 1;
            textHtml = 'PDF ' + indx + ' :' + $(this).html() + '<br> ';
            getObjectLink(currentSlide, textHtml, idRCP, occurence, 'link-note-rcp');
        });
    }
    //List pdf Linked
    var tabPDF = ['null'];
    $('section > div').each(function () {
        if ($(this).attr('pdf-link') != undefined && $('#textRcp').find('a[href="' + $(this).attr("pdf-link") + '"]').length < 1
            && tabPDF.indexOf($(this).attr("pdf-link")) === -1 ) {
            indx = indx + 1;
            tabPDF.push($(this).attr("pdf-link"));
            textHtml = 'PDF ' + indx + ' :' + $(this).attr('data-pdf-name') + '<br>';
            getObjectLink(currentSlide, textHtml, idRCP, occurence, 'link-note-rcp');
        }
    })
}
/********* End  Show RCP In Slide Add ************/

/*************************** Get References Functions *****************************/
function getRef(currentSlide) {
    var classRef = $('#ref-note');
    var occurence = getOccurenceTxt(currentSlide, '#note-survey-select') && getOccurenceTxt(currentSlide, '#note-survey-radio')
        && getOccurenceTxt(currentSlide, '#note-survey-select') && getOccurenceTxt(currentSlide, '#note-survey-input');
    if (occurence) {
        occurence = 1;
    } else {
        occurence = 0;
    }
    var textHtml = '';
    var txtRefLink;
    var title;
    var descRef;
    $('#textRef').find('div').each(function () {
        descRef = $(this).find('.title-desc-lst').clone();
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

        title = $(this).find('.title-ref-lst').text();
        $.each(descRef, function (index, value) {
            if (index === 0) {
                txtRefLink = str_insert(value, '<p>', title);
                ;
            } else {
                txtRefLink = value;
            }
            getObjectLink(currentSlide, txtRefLink, classRef, occurence, 'note-ref');
        });
    });
    var descriptionRef = '';
    // txtRefWrapper.nextAll()
    $('#tempReferences').find('.refSection').find('.item-ref-wrapper').each(function () {
        var descRef = $(this).find('.row-ref:last').nextAll();
        if(descRef.text().length) {
            $(descRef).find('*[style]').removeAttr('style');
            $(descRef).find('br').remove();
            $(descRef).find('p').each(function () {
                var $this = $(this);
                if ($this.html().replace(/\s|&nbsp;/g, '').length == 0)
                    $this.remove();
            });
            $('p:empty').remove();

            descRef = getSubString($(descRef).html());
            $.each(descRef, function (index, value) {
                getObjectLink(currentSlide, value, classRef, occurence, 'note-ref');
            });
        }
    });
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
/*************************** End Get References Functions *****************************/

/*************************** Get occurrence text duplicated Functions *****************************/
function getOccurenceTxt(currentSlide, txtSelector) {
    return currentSlide.find('.sub-notes').find(txtSelector).text() != undefined
        && currentSlide.find('.sub-notes').find(txtSelector).text() != '';
}
/*************************** End occurrence txt text duplicated Functions *****************************/

var indxSelectSurv = 0;
var indxRadioSurv = 0;
var indxCheckSurv = 0;
var indxTxtSurv = 0;
/*********Survey*****************/
function getSurvey(slide, currentSlide) {
    var survey = 0;
    var idSurveySelect = $('.note #survey-select');
    var idSurveyRadio = $('.note #survey-radio');
    var idSurveyCheck = $('.note #survey-check');
    var idSurveyInput = $('.note #survey-input');
    var txtSlelect ;
    slide.find('.select-survey-output').each(function () {
        survey = 1;
        var answer = '';
        $(this).find('.select-survey-wrapper > select > option').each(function () {
            answer += '<li> ' + $(this).text() + '</li>';
        });
        indxSelectSurv = indxSelectSurv + 1;
        txtSlelect = 'Question ' + indxSelectSurv + ': DROPDOWN LIST  '
            + $(this).find('#Id_selectQuestion').text() + ' ' + answer + '<br>';
        getObjectLink(currentSlide, txtSlelect, idSurveySelect, false, 'note-survey-select');
    });
    slide.find('.table-survey-radio  > tbody ').each(function () {
        survey = 1;
        var question = '';
        var answer = '';
        $(this).find('tr').each(function () {
            if ($(this).find('th').text()) {
                question = $(this).text();
            }
            else {
                answer += '<li>';
                answer += $(this).text();
                answer += '</li>';
            }
        });
        indxRadioSurv = indxRadioSurv + 1;
        var txtSurveyradio = 'Question ' + indxRadioSurv + ': RADIO BUTTON: ' + question + '<p>' + answer + '</p>';
        getObjectLink(currentSlide, txtSurveyradio, idSurveyRadio, false, 'note-survey-radio');
    });
    slide.find('.table-survey  > tbody ').each(function () {
        survey = 1;
        var question = '';
        var answer = '';
        $(this).find('tr').each(function () {
            if ($(this).find('th').text()) {
                question = $(this).text();
            }
            else {
                answer += '<li>' + $(this).text() + '</li>';
            }
        });
        indxCheckSurv = indxCheckSurv + 1;
        var txtSurveyCheck = 'Question ' + indxCheckSurv + ': CHECK BOX: ' + question + '<p>' + answer + '</p>';
        getObjectLink(currentSlide, txtSurveyCheck, idSurveyCheck, false, 'note-survey-check');
    });
    slide.find('.text-field-output').each(function () {
        survey = 1;
        indxTxtSurv = indxTxtSurv + 1;
        var txtSurveyInput = 'Question ' + indxTxtSurv + ': INPUT FIELD: ' + $(this).text() + '<br>';
        getObjectLink(currentSlide, txtSurveyInput, idSurveyInput, false, 'note-survey-input');
    });
}
/*********End Survey****************/

/********* Empty div ****************/
function emptyDiv() {
    $('#survey-radio, #survey-select, #survey-title, #survey-input, #survey-check, #rcp, #ref-note').empty();

}
/*********End Empty div ****************/

/********* Duplicate Note In Slide Function ****************/
function duplicatedNotes(value, idNote, idObject, occurence) {
    value.find(idObject).each(function () {
        if (occurence === 0) {
            var noteHeight = $(".note").height();
            var textHtml = $(value.html());
            idNote.append(textHtml);
            if (idNote.find(textHtml).height() + parseInt(noteHeight) > 380) {
                idNote.find(textHtml).remove();
                occurence = 1;
            } else {
                value.remove();
            }
        }
    });
    return occurence;
}
/********* End Duplicate Note In Slide Function ****************/

/********* Duplicate Slide Notes ****************/
function duplicateSlideNotes(curentS) {
    if ((curentS.find('.sub-notes').html() != undefined)) {
        var newSlide = $('<section new-slide="1"  dublicate-notes="1"></section>');
        newSlide.html(curentS.html());
        curentS.after(newSlide);
    }
}
/********* End Duplicate Slide Notes ****************/

/*********  Form Note In Slide  ****************/
function formNotesSlides() {
    //Add Ref title
    var idRef = $('#ref-note');
    if (idRef.html() != "" && idRef.text() != 'REFERENCES LIST:N/A ') {
        addTitle(idRef, 'REFERENCES LIST:');
    }
    //Add survey title
    var idSurvey = $('#survey-title');
    if ((idSurvey.text() != 'SURVEY:N/A') && (($('#survey-input').html() != "") || ($('#survey-check').html() != "")
        || ($('#survey-select').html() != "") || ($('#survey-radio').html() != ""))) {
        addTitle(idSurvey, 'SURVEY:');
    }
    //Add Rcp title
    var idRCP = $('#rcp');
    if (idRCP.html() != "" && idRCP.text() != 'PDF LIST:N/A ') {
        addTitle(idRCP, 'PDF LIST:');
    }
}
/********* End form Note In Slide ****************/

/********* Add Notes In Slide Duplicate ****************/
function addNotesSlides(curentS) {
    var occurenceRef = 0;
    var occurenceRCP = 0;
    var occurenceSurvey = 0;
    var $subNote ;
    if (curentS.find('.sub-notes')) {
        curentS.find('.sub-notes').each(function () {
            $subNote = $(this);
            //Add Survey List
            occurenceSurvey = duplicatedNotes($subNote, $('#survey-select'), '#note-survey-select', occurenceSurvey === 0);
            occurenceSurvey = duplicatedNotes($subNote, $('#survey-check'), '#note-survey-check', occurenceSurvey === 0);
            occurenceSurvey = duplicatedNotes($subNote, $('#survey-radio'), '#note-survey-radio', occurenceSurvey === 0);
            occurenceSurvey = duplicatedNotes($subNote, $('#survey-input'), '#note-survey-input', occurenceSurvey === 0);
            //Add Ref List
            if ((!getOccurenceTxt(curentS, '#note-survey-select') || !getOccurenceTxt(curentS, '#note-survey-radio')
                || !getOccurenceTxt(curentS, '#note-survey-check') || !getOccurenceTxt(curentS, '#note-survey-input') && occurenceRef === 0)) {
                occurenceRef = duplicatedNotes($subNote, $('#ref-note'), '#note-ref', occurenceRef);
                //Add RCP List
                if (!getOccurenceTxt(curentS, '#note-ref') && occurenceRCP === 0) {
                    occurenceRCP = duplicatedNotes($subNote, $('#rcp'), '#link-note-rcp', occurenceRCP);
                }
            }
        });
    }
}
/********* End Add Notes In Slide Duplicated ****************/

/********* Clear div Notes is empty ****************/
function clearDivNotes(curentS) {
    curentS.find('.sub-notes').each(function () {
        if ($(this).html() === '') {
            $(this).remove();
        }
    });
}
/********* End Clear div Notes is empty ****************/

/*********substring text ****************/
function getSubString(txtLink) {
    var table = [];
    var index = 0;
    var txtLink1;
    var pos;
    var txtLinkfirst;
    var nbrElemeTab = Math.ceil(txtLink.length / 1100);
    $.each(new Array(nbrElemeTab),
        function () {
            if (txtLink.length > 1100) {
                txtLink1 = txtLink.substring(0, 1100);
                pos = txtLink1.lastIndexOf(' ');
                txtLinkfirst = txtLink.substring(0, pos);
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

/******** SlideChange ******/
Reveal.addEventListener('slidechanged', function (event) {
    emptyDiv();
    var curentS = $(Reveal.getCurrentSlide());

    //Add Notes In Slide Duplicated
    addNotesSlides(curentS);

    // Clear div Notes is empty
    clearDivNotes(curentS);

    // Duplicate Slide
    duplicateSlideNotes(curentS);
    formNotesSlides();
});
/*********** EndSlideChange**********/
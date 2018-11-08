//surveyObject: survey definition will be stored in this object and used by different functions (Adapted, validate, submit)
var surveyObject = {};

// dummyObject: dummy survey object for offline testing

/* OFline browser test
var dummyObject = {
    "ID": "a1wf0000000RlePAAS",
    "Name": "KonaTestSurvey",
    "Frequency": "Recurring",
    "Survey_Target_vod__c": "FA62DF0F-74F3-4486-A5A4-C4CA8B8EF757",
    "Status_vod__c": "Saved_vod",
    "Questions": [{
        "ID": "a1uf0000000lO3wAAE",
        "Text_vod__c": "DL=?",
        "Order_vod__c": "0",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000000RNjLAAW",
        "RecordTypeName": "Picklist",
        "Answer_Choice_vod__c": "a;0;b;0;",
        "Answer_Choice_vod__c_ToArray": ["a", "b"],
        "Response": {
            "ID": "CEB2643F-6FA7-4DFA-8601-19670DB8609F",
            "Response_vod__c": "a"
        }
    }, {
        "ID": "a1uf0000000lO5wAAE",
        "Text_vod__c": "DL2=?",
        "Order_vod__c": "0",
        "Required_vod__c": 1,
        "RecordTypeID": "012i00i9900RNjLAAW",
        "RecordTypeName": "Picklist",
        "Answer_Choice_vod__c": "a1;0;b1;0;",
        "Answer_Choice_vod__c_ToArray": ["a1", "b1"],
        "Response": {
            "ID": "CEB2643F-6FA7-4DiA-8601-19670DB8609F",
            "Response_vod__c": "a1"
        }
    }, {
        "ID": "a1uf0000000lO41AAE",
        "Text_vod__c": "QT=?",
        "Order_vod__c": "1",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000000RNjNAAW",
        "RecordTypeName": "Text",
        "Answer_Choice_vod__c": "",
        "Answer_Choice_vod__c_ToArray": [],
        "Response": {
            "ID": "49927828-6436-4D09-83A2-78BFA764ECCB",
            "Text_vod__c": "Sample text"
        }
    }, {
        "ID": "a1uf0000022lO41AAE",
        "Text_vod__c": "QT2=?",
        "Order_vod__c": "1",
        "Required_vod__c": 1,
        "RecordTypeID": "012i2200000RNjNAAW",
        "RecordTypeName": "Text",
        "Answer_Choice_vod__c": "",
        "Answer_Choice_vod__c_ToArray": [],
        "Response": {
            "ID": "49927828-6436-4D09-83A2-78BFB864ECCB",
            "Text_vod__c": "Sample text"
        }
    }, {
        "ID": "a1uf0000000lO46AAE",
        "Text_vod__c": "qr=?",
        "Order_vod__c": "2",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000000RNjMAAW",
        "RecordTypeName": "Radio",
        "Answer_Choice_vod__c": "rd1;0;rd2;0",
        "Answer_Choice_vod__c_ToArray": ["rd1", "rd2"],
        "Response": {
            "ID": "B0D69FA1-57B7-4D75-966E-8A77C9252143",
            "Response_vod__c": "rd2"
        }
    }, {
        "ID": "a1uf0000000lO46BBE",
        "Text_vod__c": "qr2=?",
        "Order_vod__c": "2",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000011RNjMAAW",
        "RecordTypeName": "Radio",
        "Answer_Choice_vod__c": "rd21;0;rd22;0",
        "Answer_Choice_vod__c_ToArray": ["rd21", "rd22"],
        "Response": {
            "ID": "B0D69FA1-57B7-4D55-966E-8A77C9252143",
            "Response_vod__c": "rd22"
        }
    }, {
        "ID": "a1uf0000000lO4BAAU",
        "Text_vod__c": "qch=?",
        "Order_vod__c": "3",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000000RNjJAAW",
        "RecordTypeName": "Multiselect",
        "Answer_Choice_vod__c": "ch1;0;ch2;0;",
        "Answer_Choice_vod__c_ToArray": ["ch1", "ch2"],
        "Response": {
            "ID": "07BDE3DA-EB8F-4DCB-99D4-945BA5912951",
            "Response_vod__c": "ch1"
        }
    }, {
        "ID": "a1uf0000000lO4BVAU",
        "Text_vod__c": "qch2=?",
        "Order_vod__c": "3",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000000RVjJAAW",
        "RecordTypeName": "Multiselect",
        "Answer_Choice_vod__c": "ch21;0;ch22;0;",
        "Answer_Choice_vod__c_ToArray": ["ch21", "ch22"],
        "Response": {
            "ID": "07BDE3DA-EB8F-4DCB-99V4-945BA5912951",
            "Response_vod__c": "ch21"
        }
    }, {
        "ID": "a1uf0000000lO4GAAU",
        "Text_vod__c": "Which number would you enter for this number question?",
        "Order_vod__c": "4",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000000RNjKAAW",
        "RecordTypeName": "Number",
        "Answer_Choice_vod__c": "",
        "Answer_Choice_vod__c_ToArray": [],
        "Response": {
            "ID": "6EF9EE32-F24B-4886-8107-6616C6855E2F",
            "Number_vod__c": "9"
        }
    }, {
        "ID": "a1uf0000000lO4LAAU",
        "Text_vod__c": "Which date would you select for this date question?",
        "Order_vod__c": "5",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000000RNjFAAW",
        "RecordTypeName": "Date",
        "Answer_Choice_vod__c": "",
        "Answer_Choice_vod__c_ToArray": [],
        "Response": {
            "ID": "D15F00EA-734B-4010-A466-B6C69BACF96E",
            "Date_vod__c": "9/25/2015"
        }
    }, {
        "ID": "a1uf0000000lO4QAAU",
        "Text_vod__c": "Which date and time would you select for this datetime question?",
        "Order_vod__c": "6",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000000RNjGAAW",
        "RecordTypeName": "Datetime",
        "Answer_Choice_vod__c": "",
        "Answer_Choice_vod__c_ToArray": [],
        "Response": {
            "ID": "49753095-2DCC-4482-89BC-9A54664CA0FE",
            "Datetime_vod__c": "9/25/2015, 12:27 PM"
        }
    }, {
        "ID": "a1uf0000000lO4VAAU",
        "Text_vod__c": "Which long text would you enter for this long text question?",
        "Order_vod__c": "7",
        "Required_vod__c": 1,
        "RecordTypeID": "012i0000000RNjIAAW",
        "RecordTypeName": "Long Text",
        "Answer_Choice_vod__c": "",
        "Answer_Choice_vod__c_ToArray": [],
        "Response": {
            "ID": "05AD4175-99E1-4248-8846-4D9AC1851E6E",
            "Text_vod__c": "Long text sample"
        }
    }]
};
*/
// AdaptedSurvey

var AdaptedSurvey = function (container, submitButton, saveButton) {

    var options = '';
    var contentHeight = 0;
    var response = '';


    //for each question
    for (var i = 0; i < surveyObject.Questions.length; i++) {

        switch (surveyObject.Questions[i].RecordTypeName) {
            case 'Picklist': {
                //question container
                $(".q-select-question").each(function () {
                    if (surveyObject.Questions[i].Text_vod__c.trim() == $(this).text().trim()) {

                        var Answer_Picklist_Question_ToArray = [];
                        $(this).closest('.sl-block').find('.select-survey-wrapper').find('option').each(function () {
                            var Answer = $(this).text().trim();
                            Answer_Picklist_Question_ToArray.push(Answer);
                        });

                        // Comparer les deux tableaux
                        var Answer_is_same = (Answer_Picklist_Question_ToArray.length == surveyObject.Questions[i].Answer_Choice_vod__c_ToArray.length) && Answer_Picklist_Question_ToArray.every(function (element, index) {
                            return element === surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[index];
                        });
                        if (Answer_is_same) {
                            $(this).attr('class', "questionContainer").attr('id', "container" + surveyObject.Questions[i].ID).children().wrapAll('<label for=' + surveyObject.Questions[i].ID + '></label>');
                            $(this).closest('.sl-block').find("[id^='select_question']").attr('id', surveyObject.Questions[i].ID).attr('name', surveyObject.Questions[i].ID);
                            //saved response
                            response = '';
                            if (!(surveyObject.Questions[i].Response.Response_vod__c === null)) {
                                response = surveyObject.Questions[i].Response.Response_vod__c;
                            }
                            options = '';
                            options = options + '<option value=""></option>';
                            for (var n = 0; n < surveyObject.Questions[i].Answer_Choice_vod__c_ToArray.length; n++) {
                                if (surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] == response) {
                                    options = options + '<option value="' + surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] + '" selected>' + surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] + '</option>';
                                } else {
                                    options = options + '<option value="' + surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] + '">' + surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] + '</option>';
                                }
                            }
                            $("#" + surveyObject.Questions[i].ID).html(options);
                            var contOption = $("#" + surveyObject.Questions[i].ID).closest('div').html();
                            $("<div class='select-survey-wrapper veeva'>" + contOption + "</div>").insertAfter($("#" + surveyObject.Questions[i].ID).closest('.sl-block').find('.questionContainer'));
                            $(".select-survey-wrapper").not(".veeva").remove();
                        }
                    }
                });
            }
                break;
            case 'Text': {
                $("[id^='Id_InputText_']").each(function () {
                    if (surveyObject.Questions[i].Text_vod__c.trim() == $(this).text().trim()) {
                        //question container
                        var contelmtInputText = $(this).html();

                        //saved response
                        response = '';
                        if (!(surveyObject.Questions[i].Response.Text_vod__c === null)) {
                            response = surveyObject.Questions[i].Response.Text_vod__c;
                        }
                        $(this).closest('.sl-block').find('.text-field-wrapper').remove();
                        $(this).replaceWith('<div class="questionContainer" id="container' + surveyObject.Questions[i].ID + '"><label for=' + surveyObject.Questions[i].ID + '>' + contelmtInputText + '</label>' + '<div>' +
                            '<div class="text-field-wrapper"><input type="text" id="' + surveyObject.Questions[i].ID + '" value="' + response + '"></div>' +
                            '</div>' + '</div>');
                    }


                });
            }
                break;
            case 'Radio': {

                $('.table-survey-radio').each(function () {

                    if (surveyObject.Questions[i].Text_vod__c.trim() == $(this).find('th').text().trim()) {
                        //Récupérer les reponses de question
                        var Answer_RdQuestion_ToArray = [];
                        $(this).find(".repRadio").each(function () {
                            var Answer = $(this).find("input").val().trim();
                            Answer_RdQuestion_ToArray.push(Answer);
                        });

                        // Comparer les deux tableaux
                        var Answer_is_same = (Answer_RdQuestion_ToArray.length == surveyObject.Questions[i].Answer_Choice_vod__c_ToArray.length) && Answer_RdQuestion_ToArray.every(function (element, index) {
                            return element === surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[index];
                        });

                        if (Answer_is_same) {
                            var thHtml = $(this).find('th').html();
                            $(this).find('th').replaceWith('<th colspan="3"><label for=' + surveyObject.Questions[i].ID + '>' + thHtml + '</label></th>');
                            $(this).find('td').find('.repRadio').each(function () {
                                var contentLabel = $(this).html();
                                $(this).replaceWith(contentLabel);

                            });

                            response = '';
                            if (!(surveyObject.Questions[i].Response.Response_vod__c === null)) {
                                response = surveyObject.Questions[i].Response.Response_vod__c;
                            }
                            $(this).find('td.QuestionText').each(function () {
                                var option;
                                for (var n = 0; n < surveyObject.Questions[i].Answer_Choice_vod__c_ToArray.length; n++) {
                                    contentHeight = contentHeight + 20;
                                    option = surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n];
                                    if (option == $(this).text().trim()) {
                                        if (surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] == response) {
                                            option = '   <input type="radio" name="' + surveyObject.Questions[i].ID + '" id="' + surveyObject.Questions[i].ID + n + '" value="' + surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] + '" checked/>';

                                        } else {
                                            option = '   <input type="radio" name="' + surveyObject.Questions[i].ID + '" id="' + surveyObject.Questions[i].ID + n + '" value="' + surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] + '" />';

                                        }
                                        $(this).parent("tr").find('td:first-child input').replaceWith(option);

                                    }
                                }
                                /*var contentTd = $(this).html();
                                $(this).replaceWith('<td><label>' + contentTd + '</label></td>');*/
                            });

                            var contentRadio = $(this).find('tbody').html();
                            $(this).replaceWith('<div class="questionContainer" id="container' + surveyObject.Questions[i].ID + '"><table class="table-survey-radio"><tbody>' + contentRadio + '</tbody></table></div>');
                        }
                    }
                });
            }
                break;
            case 'Multiselect': {

                $('.table-survey').each(function () {


                    if (surveyObject.Questions[i].Text_vod__c.trim() == $(this).find('th').text().trim()) {
                        //Récupérer les reponses de question
                        var Answer_ChQuestion_ToArray = [];
                        $(this).find('td').find(".repCheckbox").each(function () {
                            var Answer = $(this).find("input").val().trim();
                            Answer_ChQuestion_ToArray.push(Answer);
                        });
                        /*$(this).find('td').find(".repCheckbox").each(function () {
                            var Answer = $(this).closest('td').text().trim();
                            Answer_ChQuestion_ToArray.push(Answer);

                        });*/
                        // Comparer les deux tableaux
                        var Answer_is_same = (Answer_ChQuestion_ToArray.length == surveyObject.Questions[i].Answer_Choice_vod__c_ToArray.length) && Answer_ChQuestion_ToArray.every(function (element, index) {
                            return element === surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[index];
                        });
                        if (Answer_is_same) {
                            var thHtml = $(this).find('th').html();
                            $(this).find('th').replaceWith('<th colspan="3"><label for=' + surveyObject.Questions[i].ID + '>' + thHtml + '</label></th>');
                            $(this).find('td').find(".repCheckbox").each(function () {
                                var contentLabel = $(this).html();
                                $(this).replaceWith(contentLabel);
                            });
                            /*$(this).find('td').find(".repCheckbox").each(function () {
                                var contentLabel = $(this).html();
                                $(this).replaceWith(contentLabel);

                            });*/
                            //saved response
                            var responsesArray = [];
                            if (!(surveyObject.Questions[i].Response.Response_vod__c === null)) {
                                responsesArray = surveyObject.Questions[i].Response.Response_vod__c.split(';');
                            }
                            $(this).find('td.QuestionText').each(function () {

                                var option;
                                for (var n = 0; n < surveyObject.Questions[i].Answer_Choice_vod__c_ToArray.length; n++) {
                                    contentHeight = contentHeight + 20;
                                    option = surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n];
                                    if (option == $(this).text().trim()) {
                                        if (responsesArray.indexOf(surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n]) >= 0) {
                                            option = '   <input type="checkbox" name="' + surveyObject.Questions[i].ID + '" id="' + surveyObject.Questions[i].ID + n + '" value="' + surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] + '" checked/>'
                                        } else {
                                            option = '   <input type="checkbox" name="' + surveyObject.Questions[i].ID + '" id="' + surveyObject.Questions[i].ID + n + '" value="' + surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[n] + '" />'
                                        }
                                        $(this).parent("tr").find('td:first-child input').replaceWith(option);
                                    }
                                }

                                /*var contentTd = $(this).html();
                                //var contentTd1 = $(this).parent("tr").find('td').first().html();
                                //var contentTd2 = $(this).html();
                                $(this).replaceWith('<td><label>' + contentTd + '</label></td>');*/
                            });

                            var contenStelect = $(this).find('tbody').html();
                            $(this).replaceWith('<div class="questionContainer" id="container' + surveyObject.Questions[i].ID + '"><table class="table-survey"><tbody>' + contenStelect + '</tbody></table></div>');
                        }
                    }


                });

            }
                break;
        }
    }

    //add status div
    container.append(
        '<div class="surveyStatus">' +
        'Status: ' + surveyObject.Status_vod__c +
        ' - Frequency: ' + surveyObject.Frequency +
        '</div>'
    );

    //one time survey already submitted: hide button
    if ((surveyObject.Status_vod__c == 'Submitted_vod') && (surveyObject.Frequency == 'One Time')) {
        $('.surveyStatus').append('<br>Survey button is hidden because this is a one time survey has already been submitted');
        submitButton.hide();
        saveButton.hide();
    } else {
        submitButton.show();
        saveButton.show();
    }
}
// validateSurvey

var validateSurvey = function () {

    var isFormValid = true;
    $('.questionContainer').removeClass('questionError');

    for (var i = 0; i < surveyObject.Questions.length; i++) {
        if (surveyObject.Questions[i].Required_vod__c) {
            switch (surveyObject.Questions[i].RecordTypeName) {
                case 'Radio':
                case 'Multiselect': {
                    $('#stage').find('.questionContainer').each(function () {

                        if (surveyObject.Questions[i].Text_vod__c.trim() == $(this).find('th').text().trim() && $(this).find('td').find(":checkbox").length != 0) {
                            //Récupérer les reponses de question
                            var Answer_ChQuestion_ToArray = [];
                            $(this).find('td').find(":checkbox").each(function () {

                                var Answer = $(this).parents('tr').find(".QuestionText").text().trim();
                                Answer_ChQuestion_ToArray.push(Answer);
                            });

                            // Comparer les deux tableaux
                            var Answer_is_same = (Answer_ChQuestion_ToArray.length == surveyObject.Questions[i].Answer_Choice_vod__c_ToArray.length) && Answer_ChQuestion_ToArray.every(function (element, index) {
                                return element === surveyObject.Questions[i].Answer_Choice_vod__c_ToArray[index];
                            });
                            if (Answer_is_same && $('input[name=' + surveyObject.Questions[i].ID + ']:checked').length == 0) {
                                $('#container' + surveyObject.Questions[i].ID).addClass('questionError');
                                isFormValid = false;
                            }

                        }
                    });
                }
                    break;
                case 'Datetime':
                    if (($('#' + surveyObject.Questions[i].ID + '-date').val() == '') || ($('#' + surveyObject.Questions[i].ID + '-time').val() == '')) {
                        $('#container' + surveyObject.Questions[i].ID).addClass('questionError');
                        isFormValid = false;
                    }
                    break;
                case 'Picklist':
                case 'Text':
                case 'Number':
                case 'Date':
                case 'Long Text':
                    if ($('#' + surveyObject.Questions[i].ID).val() == '') {
                        $('#container' + surveyObject.Questions[i].ID).addClass('questionError');
                        isFormValid = false;
                    }
                    break;
            }
        }
    }

    return isFormValid;
}
// submitSurvey

var submitSurvey = function (action, submitButton, saveButton) {

    for (var i = 0; i < surveyObject.Questions.length; i++) {
        console.log(i);
        switch (surveyObject.Questions[i].RecordTypeName) {
            case 'Picklist': {
                surveyObject.Questions[i].Response.Response_vod__c = $('#' + surveyObject.Questions[i].ID).val();
            }
                break;
            case 'Text': {
                surveyObject.Questions[i].Response.Text_vod__c = $('#' + surveyObject.Questions[i].ID).val();
            }
                break;
            case 'Radio':
                if ($('input[name=' + surveyObject.Questions[i].ID + ']:checked').length == 0) {
                    surveyObject.Questions[i].Response.Response_vod__c = '';

                } else {
                    surveyObject.Questions[i].Response.Response_vod__c = $('input[name=' + surveyObject.Questions[i].ID + ']').filter(':checked').val();
                }
                break;
            case 'Multiselect':
                surveyObject.Questions[i].Response.Response_vod__c = '';
                $('input[name=' + surveyObject.Questions[i].ID + ']').filter(':checked').each(function () {
                    surveyObject.Questions[i].Response.Response_vod__c = surveyObject.Questions[i].Response.Response_vod__c + $(this).val() + ';';
                });
                surveyObject.Questions[i].Response.Response_vod__c = surveyObject.Questions[i].Response.Response_vod__c.substring(0, surveyObject.Questions[i].Response.Response_vod__c.length - 1); //remove last ;
                break;
            case 'Number':
                surveyObject.Questions[i].Response.Number_vod__c = $('#' + surveyObject.Questions[i].ID).val();
                break;
            case 'Date':
                surveyObject.Questions[i].Response.Date_vod__c = $('#' + surveyObject.Questions[i].ID).val();
                break;
            case 'Datetime':
                surveyObject.Questions[i].Response.Datetime_vod__c = '';
                if (($('#' + surveyObject.Questions[i].ID + '-date').val() != '') && ($('#' + surveyObject.Questions[i].ID + '-time').val() != '')) {
                    surveyObject.Questions[i].Response.Datetime_vod__c = $('#' + surveyObject.Questions[i].ID + '-date').val() + 'T' + $('#' + surveyObject.Questions[i].ID + '-time').val() + ':00.000Z';
                }
                break;
            case 'Long Text':
                surveyObject.Questions[i].Response.Text_vod__c = $('#' + surveyObject.Questions[i].ID).val();
                break;
        }
    }

    com.veeva.clm.submitSurvey(
        surveyObject,
        action,
        function () {
            if (action == 'Saved_vod') {
                $('.surveyStatus').html('Survey has been saved');
                submitButton.css('background-color', submitButton.attr('activated-color'));
                submitButton.prop({ disabled: true});
            } else {
                $('.surveyStatus').html('Survey has been submitted');
                submitButton.css('background-color', submitButton.attr('activated-color'));
                submitButton.prop({ disabled: true});
            }
        },
        function (errorMsg) {
            $('#errorDiv').html(errorMsg);
        }
    );
}
$(document).ready(function (e) {

    window.onerror = function (errorMsg, url, lineNumber) {
        $('#errorDiv').html('ERROR: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
    }

    $('#submitButton').on(
        'click',
        function () {
            if (validateSurvey()) {
                submitSurvey('Submitted_vod', $('#submitButton'), $('#saveButton'));
            }
        });

    $('#saveButton').on(
        'click',
        function () {
            if (validateSurvey()) {
                submitSurvey('Saved_vod', $('#submitButton'), $('#saveButton'));
            }
        });

    /*use this code for offline (browser) testing*/
    /* surveyObject = dummyObject;
     AdaptedSurvey($('#surveyContainer'), $('#submitButton'), $('#saveButton'));*/
    /*end of offline testing code*/

    /*use this code for iRep testing*/

    com.veeva.clm.getSurvey_Object(
        function (dataReceived) {
            surveyObject = dataReceived;
            AdaptedSurvey($('#surveyContainer'), $('#submitButton'), $('#saveButton'));

        },
        function (errorMsg) {
            $('#errorDiv').html(errorMsg);
        }
    );

    /*end of iRep testing code*/

});

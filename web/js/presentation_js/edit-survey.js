var counter = 0;
var counter2 = 0;
var counter3 = 0;
var countTextField = 0;
var idQuestion = 0;
function addRow(elmt, value) {
    var tr = document.createElement('tr');
    elmt.appendChild(tr);
    var td = document.createElement('td');
    tr.appendChild(td);
    var tdText = document.createTextNode(value);
    td.appendChild(tdText);
}
function IdTableauChbox() {
    var idTablChBoxFocused;
    if ($(Reveal.getCurrentSlide()).find(".sl-block.is-focused").find('table').find("input[type='checkbox']").length > 0) {
        idTablChBoxFocused = $(Reveal.getCurrentSlide()).find(".sl-block.is-focused").find('table').attr('id');
    }
    return idTablChBoxFocused;
}
function IdTableauRadio() {
    var idTabRadioFocused;
    if ($(Reveal.getCurrentSlide()).find(".sl-block.is-focused").find('table').find("input[type='radio']").length > 0) {
        idTabRadioFocused = $(Reveal.getCurrentSlide()).find(".sl-block.is-focused").find('table').attr('id');
    }
    return idTabRadioFocused;
}

function addCheckbox() {
    var tr = document.createElement('tr');
    $(document.getElementById(IdTableauChbox())).children('tbody').append(tr);
    var td = document.createElement('td');
    tr.appendChild(td);
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "idCheckbox" + counter;
    checkbox.value = $(this).next().html();
    checkbox.id = "idCheckbox" + counter;
    var label = document.createElement('label');
    label.htmlFor = "idCheckbox" + counter;
    label.appendChild(document.createTextNode('Enter your text answer'));
    td.appendChild(checkbox);
    td.appendChild(label);
    counter++;
}

function addRadio() {
    var tr = document.createElement('tr');
    $(document.getElementById(IdTableauRadio())).children('tbody').append(tr);
    var td = document.createElement('td');
    tr.appendChild(td);
    var radio = document.createElement('input');
    radio.type = "radio";
    radio.name = "idradio" + counter2;
    radio.value = $(this).next().html();
    radio.id = "idradio" + counter2;
    var label = document.createElement('label');
    label.htmlFor = "idradio" + counter2;
    label.appendChild(document.createTextNode('Enter your text answer'));
    td.appendChild(radio);
    td.appendChild(label);
    counter2++;
}
function addAnswer(elmt) {
    var tr = document.createElement('tr');
    elmt.appendChild(tr);
    var td = document.createElement('td');
    tr.appendChild(td);
    var input = document.createElement('input');
    input.type = "textbox";
    input.name = input.id = "id" + counter3;
    input.value = "your answer";
    input.id = "id" + counter3;
    td.appendChild(input);
    counter3++;

}
function addElementButtonChbox() {
    $(".survey-sideBar .btn-chbox-container").append("<button id='add_Chbox' class='btn btn-primary" +
        " survey-add-blocChbox' onclick=\"addElementTableChbox(document.getElementById('tableau'));\">" +  TWIG.toolbar.addQuestion +"</button><button  class='btn btn-primary' onclick=\"addCheckbox();\">" + TWIG.toolbar.addResponse + "</button>");
}
function addElementButtonRadio() {
    $(".survey-sideBar .btn-radio-container").append("<button class='btn btn-primary survey-add-blocRad'" +
        " onclick=\"addElementTableRadio(document.getElementById('tableau_radio'));\">" +  TWIG.toolbar.addQuestion +"</button><button class='btn btn-primary' onclick=\"addRadio();\">" + TWIG.toolbar.addResponse + "</button>");
}
function addElementTableChbox() {
    $('.toolbar-add-block-option[data-block-type="survey"]').trigger("click");
    $(".survey-sideBar").addClass("visible");
    $('.sl-block.is-focused .sl-block-content').append("<table class='table-survey'  id='tableau" + idQuestion + "' name='tableau" + idQuestion + "'><tr><th name='IdRadQ'>Enter your Question here?</th></tr><tr><td><input id='checkbox_01' type='checkbox' name='checkbox' value='Enter your text answer'><label>Enter your text answer</label></td></tr></table>");
    idQuestion++;
}
function addElementTableRadio() {
    $('.toolbar-add-block-option[data-block-type="survey"]').trigger("click");
    $(".survey-sideBar").addClass("visible");
    $('.sl-block.is-focused .sl-block-content').append("<table class='table-survey-radio'  id='tableau_radio" + idQuestion + "' name='tableau_radio" + idQuestion + "'><tr><th id='IdChQ'>Enter your Question here?</th></tr><tr><td><input id='radio_01' type='radio' name='radio' value='Enter your text answer'><label>Enter your text answer</label></td></tr></table>");
    idQuestion++;
}
function addElementTextField() {
    $(".survey-sideBar .btn-textField-container").append("<button id='add_Chbox' class='btn btn-primary survey-add-blocChbox' onclick=\"addElementTextInput();\"> " + TWIG.toolbar.addInputField + "</button>");
}
function addElementTextInput() {
    countTextField++;
    $('.toolbar-add-block-option[data-block-type="survey"]').trigger("click");
    SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused').addClass('text-field-output');
    SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused .sl-block-content p').remove();
    $('<div class="text-field-wrapper"></div>').insertAfter(SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused .sl-block-content'));
    SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused.text-field-output .text-field-wrapper").html("");
    $('.sl-block.is-focused .sl-block-content').append("<div id='Id_InputText" + countTextField + "'>Enter your Question here?</div>");
    $("<table id='TextFieled" + idQuestion + "' ><tr><td><input type='text' placeholder='Enter your text here...' id='text_field_" + countTextField + "' /></td></tr></table>"
    ).appendTo(SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused.text-field-output .text-field-wrapper"));
    if ($(".btn-textField-container").find(".forbid-add-survey-elm-alert").length > 0) {
        $(".btn-textField-container").find(".forbid-add-survey-elm-alert").remove();
    }
    $(".survey-sideBar").addClass("visible");
    idQuestion++;
}

$(document).ready(function () {
    $("#btn_text_size").val("16").trigger('change');
    /**btn**/
    setTimeout(function () {
        $(".add-bar.visible >.toolbar-list").append('<div class="toolbar-add-block-option btn-sidebar-chart"><span' +
            ' class="toolbar-add-block-option-icon fa fa-bar-chart-o"></span></div><div' +
            ' class="toolbar-add-block-option btn-screen-code" title="' +TWIG.infoBulle.code+ '"><span' +
        ' class="toolbar-add-block-option-icon fa' +
            ' fa-file-code-o"></span></div><div class="btn-sidebar-survey" title="' +TWIG.infoBulle.survey+ '"><span' +
            ' class="toolbar-add-block-option-icon fa fa-building-o"></span></div>');
    }, 5);


    setTimeout(function () {
        $(".btn-sidebar-survey").click(function () {
            $('#select_survey option:eq(0)').prop('selected', true);
            $('#select_survey option:eq(0)').trigger('change');
            if ($(Reveal.getCurrentSlide()).find('.submit-btn-wrapper').length == 0) {
                $(".remove-Activebg-submit-color").trigger("click");
                $(".remove-bg-submit-color").trigger("click");
                $(".remove-btn-submit-color").trigger("click");
            }
            else {
                UpdateSpectrumSurevey();

            }
            $(".wrapper-select-survey").hide();
            $(".sl-block.is-focused .select-survey-wrapper select").each(function (index, elm) {
                var focusedDropdownElmsIndex = $(this).attr("data-select-link");
                $(".wrapper-select-survey[data-dropdown-link=" + focusedDropdownElmsIndex + "]").show();
            });

            $(".survey-sideBar").toggleClass("visible");
            /*   $(document).on("click",".reveal" , function(e) {
             e.stopPropagation();
             // $(".survey-sideBar").removeClass("visible");
             });*/
            $(".survey-sideBar").find(".forbid-add-survey-elm-alert").remove();
        });
        $(".toolbar-add-block-option").click(function () {
            $(".survey-sideBar").removeClass("visible");
        });
        $(".btn-screen-code").click(function () {
            $('.slide-option.html').trigger("click");
        });
    }, 50);


    $("#select_survey").change(function () {

        if ($("#select_survey option:selected").val() == "Select a survey") {
            $("#add_select_question").hide();
            $(".btn-radio-container button").hide();
            $(".wrapper-select-survey").hide();
            $(".btn-textField-container *").remove();
            $(".btn-chbox-container button").hide();
            if ($(".btn-chbox-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-chbox-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".btn-radio-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-radio-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").remove();
            }
        }

        if ($("#select_survey option:selected").val() == "list_type") {
            $("#add_select_question").show();
            $(".btn-chbox-container button").remove();
            if ($(".slides").find(".select-survey-output").length > 0 && $(".wrapper-select-survey").find(".wrapper-answer-survey").eq(0).find(".select-survey-response").attr("id") != undefined) {
                $(".wrapper-select-survey").hide();
                $(".sl-block.is-focused .select-survey-wrapper select").each(function (index, elm) {
                    var focusedDropdownElmsIndex = $(this).attr("data-select-link");
                    $(".wrapper-select-survey[data-dropdown-link=" + focusedDropdownElmsIndex + "]").show();
                });
            }

            $(".button-survey").hide();
            $(".sl-block.is-focused .select-survey-wrapper select").each(function (index, elm) {
                var focusedDropdownElmsIndex = $(this).attr("data-select-link");
                $(".wrapper-select-survey[data-dropdown-link=" + focusedDropdownElmsIndex + "]").show();
            });
            $(".btn-textField-container *").remove();
            if ($(".btn-chbox-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-chbox-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".btn-radio-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-radio-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").remove();
            }

        }

        if ($("#select_survey option:selected").val() == "checkbox") {
            $(".btn-chbox-container button").show();
            if ($(".survey-sideBar .btn-chbox-container").has(".btn").length == 0) {
                addElementButtonChbox();
                $(".button-survey").show();
                $("#add_select_question").hide();
                $(".btn-radio-container button").remove();
                $(".btn-textField-container *").remove();
                $(".wrapper-select-survey").hide();
            }
            if ($(".btn-chbox-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-chbox-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".btn-radio-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-radio-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").remove();
            }
        }

        if ($("#select_survey option:selected").val() == "radio_type") {
            //addElementButton()
            $(".btn-radio-container button").show();
            if ($(".survey-sideBar .btn-radio-container").has(".btn").length == 0) {
                $(".button-survey").show();
                $(".btn-chbox-container button").remove();
                $("#add_select_question").hide();
                $(".btn-textField-container *").remove();
                $(".wrapper-select-survey").hide();
                addElementButtonRadio();
            }
            if ($(".btn-chbox-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-chbox-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".btn-radio-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-radio-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").remove();
            }
        }

        if ($("#select_survey option:selected").val() == "input_text") {
            addElementTextField();
            $(".button-survey").show();
            $("#add_select_question").hide();
            $(".btn-radio-container button").remove();
            $(".btn-chbox-container button").remove();
            $(".wrapper-select-survey").hide();
            if ($(".btn-chbox-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-chbox-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".btn-radio-container").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".btn-radio-container").find(".forbid-add-survey-elm-alert").remove();
            }
            if ($(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").length > 0) {
                $(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").remove();
            }
        }
    });


    /* Submit button settings */

    var bgBtnSubmitColor,
        bgFontSubmitColor,
        bgButtonSubmitImg,
        submitBtnPreview = "button.submit-btn-preview";
    var bgActivatedSubmitColor;
    setTimeout(function () {
        $("#bg-btn-submit-color").spectrum({
            showAlpha: true,
            color: "#4a5667",
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                bgBtnSubmitColor = color.toRgbString();
                $("#bg-btn-submit-color").spectrum("option", "color", bgBtnSubmitColor);
                SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).css("background-color", bgBtnSubmitColor);
                $("#survey_sideBar").find(submitBtnPreview).css("background-color", bgBtnSubmitColor);
                if ($(".survey-sideBar .remove-btn-submit-color").css("display") == "none") {
                    $(".survey-sideBar .remove-btn-submit-color").css("display", "block");
                }
            },
            change: function (color) {
                bgBtnSubmitColor = color.toRgbString();
                $("#bg-btn-submit-color").spectrum("option", "color", bgBtnSubmitColor);
                SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).css("background-color", bgBtnSubmitColor);
                $("#survey_sideBar").find(submitBtnPreview).css("background-color", bgBtnSubmitColor);
                if ($(".survey-sideBar .remove-btn-submit-color").css("display") == "none") {
                    $(".survey-sideBar .remove-btn-submit-color").css("display", "block");
                }
            }
        });
        $("#bg-font-submit-color").spectrum({
            showAlpha: true,
            color: "#ffffff",
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                bgFontSubmitColor = color.toRgbString();
                $("#bg-font-submit-color").spectrum("option", "color", bgFontSubmitColor);
                SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).css("color", bgFontSubmitColor);
                $("#survey_sideBar").find(submitBtnPreview).css("color", bgFontSubmitColor);
                if ($(".survey-sideBar .remove-bg-submit-color").css("display") == "none") {
                    $(".survey-sideBar .remove-bg-submit-color").css("display", "block");
                }
            },
            change: function (color) {
                bgFontSubmitColor = color.toRgbString();
                $("#bg-font-submit-color").spectrum("option", "color", bgFontSubmitColor);
                SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).css("color", bgFontSubmitColor);
                $("#survey_sideBar").find(submitBtnPreview).css("color", bgFontSubmitColor);
                if ($(".survey-sideBar .remove-bg-submit-color").css("display") == "none") {
                    $(".survey-sideBar .remove-bg-submit-color").css("display", "block");
                }
            }
        });
        /******************************Activated color ************************/
        $("#bg-font-Activated-submit-color").spectrum({
            showAlpha: true,
            color: "#4a5667",
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                bgActivatedSubmitColor = color.toRgbString();
                $("#bg-font-Activated-submit-color").spectrum("option", "color", bgActivatedSubmitColor);
                SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).attr("Activated-color", bgActivatedSubmitColor);
                $("#survey_sideBar").find(submitBtnPreview).attr("Activated-color", bgActivatedSubmitColor);
                if ($(".survey-sideBar .remove-Activebg-submit-color").css("display") == "none") {
                    $(".survey-sideBar .remove-Activebg-submit-color").css("display", "block");
                }
            },
            change: function (color) {
                bgActivatedSubmitColor = color.toRgbString();
                $("#bg-font-Activated-submit-color").spectrum("option", "color", bgActivatedSubmitColor);
                SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).attr("Activated-color", bgActivatedSubmitColor);
                $("#survey_sideBar").find(submitBtnPreview).attr("Activated-color", bgActivatedSubmitColor);
                if ($(".survey-sideBar .remove-Activebg-submit-color").css("display") == "none") {
                    $(".survey-sideBar .remove-Activebg-submit-color").css("display", "block");
                }
            }
        });
        $(document).off("click", ".remove-Activebg-submit-color").on("click", ".remove-Activebg-submit-color", function () {
            SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).attr("Activated-color", "#4a5667");
            $("#survey_sideBar").find(submitBtnPreview).attr("Activated-color", "#4a5667");
            $(this).css("display", "none");
            $("#bg-font-Activated-submit-color").spectrum("option", "color", "#4a5667");
            $("#bg-font-Activated-submit-color").spectrum("set", "#4a5667");
        });

        /******************************End_Activated color ************************/
        $(document).off("click", ".remove-bg-submit-color").on("click", ".remove-bg-submit-color", function () {
            SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).css("color", "#ffffff");
            $("#survey_sideBar").find(submitBtnPreview).css("color", "#ffffff");
            $(this).css("display", "none");
            $("#bg-font-submit-color").spectrum("option", "color", "#ffffff");
            $("#bg-font-submit-color").spectrum("set", "#ffffff");
        });

        $(document).off("click", ".remove-btn-submit-color").on("click", ".remove-btn-submit-color", function () {
            SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).css("background-color", "#4a5667");
            $("#survey_sideBar").find(submitBtnPreview).css("background-color", "#4a5667");
            $(this).css("display", "none");
            $("#bg-btn-submit-color").spectrum("option", "color", "#4a5667");
            $("#bg-btn-submit-color").spectrum("set", "#4a5667");
        });
    }, 50);


    $(document).off("click", "#bg_button_submit_upload").on("click", "#bg_button_submit_upload", function () {
        $(".slide-option.background-image").trigger("click");
        $(".sl-popup").css("z-index", "40000");
        $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function () {
            bgButtonSubmitImg = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
            SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).css({
                "background-image": "url('" + bgButtonSubmitImg + "')",
                "background-repeat": "no-repeat",
                "background-position": "center center",
                "background-size": "contain"
            });
            $("#survey_sideBar").find(submitBtnPreview).css({
                "background-image": "url('" + bgButtonSubmitImg + "')",
                "background-repeat": "no-repeat",
                "background-position": "center center",
                "background-size": "contain"
            });
        });

        if ($(".wrapper-button-submit-upload .del-current-bg").length == 0) {
            $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>" + TWIG.toolbar.deleteBackground + "</a></div>").insertAfter("#bg_button_submit_upload");
        }
    });

    $(document).on("click", ".wrapper-button-submit-upload .del-current-bg a", function (e) {
        e.preventDefault();
        bgButtonSubmitImg = "";
        $(this).parent(".del-current-bg").remove();
        SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).css("background-image", "none");
        $("#survey_sideBar").find(submitBtnPreview).css("background-image", "none");
    });

    $(document).off("keyup", "#submit_color_name").on("keyup", "#submit_color_name", function () {
        if ($(this).val() == "") {
            SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).html("Send");
            $("#survey_sideBar").find(submitBtnPreview).html("Send");
        }
        else {
            SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).html($(this).val());
            $("#survey_sideBar").find(submitBtnPreview).html($(this).val());
        }
    });

    $(document).off("change", "#btn_text_size").on("change", "#btn_text_size", function () {
        var testSize = $(this).find("option:selected").val();
        SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(submitBtnPreview).css("font-size", testSize + "px");
        $("#survey_sideBar").find(submitBtnPreview).css("font-size", testSize + "px");
    });

    $(document).off("click", ".submit-append-btn").on("click", ".submit-append-btn", function (e) {
        e.preventDefault();
        if (SL.editor.controllers.Markup.getCurrentSlide().find(".submit-btn-output").length == 0) {
            var submitAppendBtn = $("#survey_sideBar button.submit-btn-preview").clone();

            $('.toolbar-add-block-option[data-block-type="survey"]').trigger("click");
            SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused').addClass('submit-btn-output');
            SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused .sl-block-content p').remove();
            $('<div class="submit-btn-wrapper"></div>').insertAfter(SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused .sl-block-content'));
            SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused.submit-btn-output .submit-btn-wrapper").html("");
            submitAppendBtn.appendTo(SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused.submit-btn-output .submit-btn-wrapper"));

            if ($(this).parent(".add-btn").find(".forbid-add-survey-elm-alert").length > 0) {
                $(this).parent(".add-btn").find(".forbid-add-survey-elm-alert").remove();
            }
        }
        else {
            if ($(this).parent(".add-btn").find(".forbid-add-survey-elm-alert").length == 0) {
                $(this).parent(".add-btn").append("<div class='forbid-add-survey-elm-alert' style='transition: all 0.3s ease;'>You can add only one submit button by slide</div>").promise().done(function () {
                    var this_ = $(this);
                    setTimeout(function () {
                        this_.find(".forbid-add-survey-elm-alert").css({
                            "opacity": "1"
                        });
                    }, 50);
                });
            }
        }
        $(".survey-sideBar").addClass("visible");
    });


    /* Select survey settings */

    var counterQues = projector.attr("data-question-counter") != undefined && projector.attr("data-question-counter") != "" ? parseInt(projector.attr("data-question-counter")) : 0,
        counterResp = projector.attr("data-resp-counter") != undefined && projector.attr("data-resp-counter") != "" ? parseInt(projector.attr("data-resp-counter")) : 1,
        wrapperSelectSurvey = $(".wrapper-select-survey").clone(),
        answerCloneElm = $(".wrapper-answer-survey").clone(),
        placeholderText = "You answer here...";

    if ($(".sl-block .select-survey-wrapper").length > 0) {

        $(".sl-block .select-survey-wrapper").each(function (indexSelect, elmSelect) {
            var wrapperSelectGeneratedIndex = $(this).find("select").attr("data-select-link"),
                this_ = $(this);
            if (indexSelect === 0) {
                $(".wrapper-select-survey").attr("id", "wrapper_select_survey" + wrapperSelectGeneratedIndex).attr("data-dropdown-link", wrapperSelectGeneratedIndex).show();
            }
            else {
                wrapperSelectSurvey.clone().insertAfter($(".wrapper-select-survey").last()).attr("id", "wrapper_select_survey" + wrapperSelectGeneratedIndex).attr("data-dropdown-link", wrapperSelectGeneratedIndex).show();
            }

            this_.find("select option").each(function (index, elm) {

                if (index === 0) {
                    $("#wrapper_select_survey" + wrapperSelectGeneratedIndex).find(".select-survey-response").eq(0).attr({
                        "id": "select_survey_response" + $(elm).attr("data-resp-link"),
                        "name": "select_survey_response" + $(elm).attr("data-resp-link")
                    }).val($(elm).val() != placeholderText ? $(elm).val() : null);
                    $("#wrapper_select_survey" + wrapperSelectGeneratedIndex).find(".wrapper-answer-survey label").text("Answer 1:");
                }
                else {
                    $('<div class="wrapper-answer-survey"><label class="label-survey-response">Answer ' + (index + 1) + ':</label><input type="text" class="select-survey-response" placeholder="' + placeholderText + '" id="select_survey_response' + $(elm).attr("data-resp-link") + '" name="select_survey_response' + $(elm).attr("data-resp-link") + '"><a class="pull-right remove-answer"><i class="fa fa-times"></i></a></div>').insertAfter($("#wrapper_select_survey" + wrapperSelectGeneratedIndex).find(".wrapper-answer-survey").last());
                    $("#wrapper_select_survey" + wrapperSelectGeneratedIndex).find(".wrapper-answer-survey").eq(index).find(".select-survey-response").val($(elm).val() != placeholderText ? $(elm).val() : null);
                }
            });
        });
    }

    $(document).off("click", "#add_select_question").on("click", "#add_select_question", function (e) {
        e.preventDefault();
        counterQues++;

        if ($(".wrapper-select-survey").find(".wrapper-answer-survey").eq(0).find(".select-survey-response").attr("id") == undefined) {
            counterResp = 1;
        }
        else {
            counterResp++;
        }

        if ($(".wrapper-select-survey").attr("id") == undefined) {
            $(".wrapper-select-survey").attr("id", "wrapper_select_survey" + counterQues).attr("data-dropdown-link", counterQues).show();
        }
        else {
            $(".wrapper-select-survey").each(function (index, elm) {
                $(this).hide();
            });
            wrapperSelectSurvey.clone().insertAfter($(".wrapper-select-survey").last()).attr("id", "wrapper_select_survey" + counterQues).attr("data-dropdown-link", counterQues).show();
        }


        $(".wrapper-select-survey").last().find(".select-survey-response").attr({
            'id': 'select_survey_response' + counterResp,
            'name': 'select_survey_response' + counterResp
        });
        var selectSurveyName = $(".wrapper-select-survey").find("#select_survey_response" + counterResp).val() != "" ? $(".wrapper-select-survey").find("#select_survey_response" + counterResp).val() : $(".wrapper-select-survey").find("#select_survey_response" + counterResp).attr("placeholder");

        var selectInstanceId = 'select_question' + counterQues,
            selectInstanceLink = counterQues,
            optionInstanceLink = counterResp,
            optionInstanceId = 'question' + counterQues + '_resp' + counterResp,
            selectSurveyAppend = '<div class="select-survey-wrapper">' +
                '<select name="' + selectInstanceId + '" id="' + selectInstanceId + '" data-select-link="' + selectInstanceLink + '">' +
                '<option id="' + optionInstanceId + '" value="' + selectSurveyName + '" data-resp-link="' + optionInstanceLink + '">' + selectSurveyName + '</option>' +
                '</select>' +
                '</div>';

        $('.toolbar-add-block-option[data-block-type="survey"]').trigger("click");
        $('.sl-block.is-focused .sl-block-content').append("<div id='Id_selectQuestion'>Enter your Question here?</div>");
        $(selectSurveyAppend).insertAfter('.sl-block.is-focused .sl-block-content');
        $(".select-survey-wrapper").parents(".sl-block").addClass('select-survey-output');

        $(".wrapper-answer-survey").parents("#wrapper_select_survey" + counterQues).find(".label-survey-response").eq(0).html("Answer 1:");
        if ($(this).parent(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").length > 0) {
            $(this).parent(".add-select-question-wrapper").find(".forbid-add-survey-elm-alert").remove();
        }

        projector.attr("data-resp-counter", counterResp);
        projector.attr("data-question-counter", counterQues);
        $(".survey-sideBar").addClass("visible");
    });

    $(document).off("click", ".add-answer").on("click", ".add-answer", function () {
        answerCloneElm.clone().insertAfter($(this).parents(".wrapper-select-survey").find(".wrapper-answer-survey").last());
        $(this).parents(".wrapper-select-survey").find(".wrapper-answer-survey").last().find(".select-survey-response").attr({
            'id': 'select_survey_response' + (counterResp + 1),
            'name': 'select_survey_response' + (counterResp + 1)
        });
        optionInstanceId = 'question' + $(this).parents(".wrapper-select-survey").attr("data-dropdown-link") + '_resp' + (counterResp + 1);
        selectSurveyName = $(this).parents(".wrapper-select-survey").find(".select-survey-response").last().val() != "" ? $(this).parents(".wrapper-select-survey").find(".select-survey-response").last().val() : $(this).parents(".wrapper-select-survey").find(".select-survey-response").last().attr("placeholder");
        var focusedSelect = $(this).parents(".wrapper-select-survey").attr("data-dropdown-link");
        $(".select-survey-wrapper select[data-select-link=" + focusedSelect + "]").append('<option id="' + optionInstanceId + '" value="' + selectSurveyName + '" data-resp-link="' + (counterResp + 1) + '">' + selectSurveyName + '</option>');
        $(this).parents(".wrapper-select-survey").find(".wrapper-answer-survey").last().find(".label-survey-response").html("Answer " + ($(this).parents(".wrapper-select-survey").find(".wrapper-answer-survey").last().index() + 1) + ":");
        counterResp++;
        projector.attr("data-resp-counter", counterResp);
    });

    $(document).off("keyup", ".select-survey-response").on("keyup", ".select-survey-response", function () {
        var focusedSelect = $(this).parents(".wrapper-select-survey").attr("data-dropdown-link"),
            focusedOptionIndex = $(".wrapper-select-survey").index($(this).parents(".wrapper-select-survey"));
        focusedOptionIndex = $(".wrapper-select-survey").eq(focusedOptionIndex).find("input[type=text]").index($(this));
        if ($(this).val() == "") {
            $(".select-survey-wrapper select[data-select-link=" + focusedSelect + "]").find("option").eq(focusedOptionIndex).html($(this).attr("placeholder")).attr("value", $(this).attr("placeholder"));
        }
        else {
            $(".select-survey-wrapper select[data-select-link=" + focusedSelect + "]").find("option").eq(focusedOptionIndex).html($(this).val()).attr("value", $(this).val());
        }
    });

    $(document).off("click", ".remove-answer").on("click", ".remove-answer", function () {
        if ($(this).parents(".wrapper-select-survey").find(".wrapper-answer-survey").length > 1) {
            var deletedSelectIndex = $(this).parents(".wrapper-select-survey").attr("data-dropdown-link"),
                deletedOptionIndex = $(".wrapper-select-survey").index($(this).parents(".wrapper-select-survey")),
                deletedLabelParentIndex = $(this).parents(".wrapper-select-survey");
            deletedOptionIndex = $(".wrapper-select-survey").eq(deletedOptionIndex).find(".remove-answer").index($(this));
            $(this).parent(".wrapper-answer-survey").remove();
            $(".select-survey-wrapper select[data-select-link=" + deletedSelectIndex + "]").find("option").eq(deletedOptionIndex).remove();
            deletedLabelParentIndex.find(".wrapper-answer-survey").each(function (index, elm) {
                $(this).find(".label-survey-response").html("Answer " + (index + 1) + ":");
            });
        }
    });
});
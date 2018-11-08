
export const controllerSurvey = {
    init: function (e) {
        this.editor = e,
        this.slidesChanged = new signals.Signal,
        this.counter = $("[data-block-type=survey] .repCheckbox").length > 0 ? this.initInputCounter({elm: $("[data-block-type=survey] .repCheckbox input"), separator: "_", index: 1, increment: 1}) : 0,
        this.counter2 = $("[data-block-type=survey] .repRadio").length > 0 ? this.initInputCounter({elm: $("[data-block-type=survey] .repRadio input"), separator: "_", index: 1, increment: 1}) : 0,
        this.counter3 = 0,
        this.countTextField = $(".text-field-output").length > 0 ? this.initInputCounter({elm: $(".text-field-wrapper input"), separator: "_", index: 2}) : 0,
        this.idQuestion = $("[data-block-type=survey] .q-checkbox, [data-block-type=survey] .q-radio").length > 0 ? this.initInputCounter({elm: $("[data-block-type=survey] .q-checkbox, [data-block-type=survey] .q-radio"), separator: "_", index: 1, increment: 1}) : 0,
        this.toolbar = ".toolbar.second-bar.visible",
        this.addBlocRadClick = this.toolbar + " .survey-add-blocRad",
        this.AddRadResponseClick = this.toolbar + " .survey-add-radResponse",
        this.addBlocChboxClick = this.toolbar + " .survey-add-blocChbox",
        this.addChboxResponseClick = this.toolbar + " .survey-add-ChboxResponse",
        this.addBlocInputField = this.toolbar + " .survey-add-blocInputField",
        this.selectSurvey = "#select_survey";
        this.bgButtonSubmitImg,
        this.submitBtnPreview = "button.submit-btn-preview",
        this.counterQues = TWIG.parameters.dataQuestionCounter != undefined && TWIG.parameters.dataQuestionCounter != "" ? parseInt(TWIG.parameters.dataQuestionCounter) : 0,
        this.counterResp = TWIG.parameters.dataRespCounter != undefined && TWIG.parameters.dataRespCounter != "" ? parseInt(TWIG.parameters.dataRespCounter) : 0,
        this.wrapperSelectSurvey,
        this.answerCloneElm,
        this.placeholderText = "Your answer here...",
        this.btnSubmitPlaceholderText = "Send",
        this.updateOldPresentationsSurvey()/*,
        this.setup()*/
    },
    setup :function(){
        //console.log("Setup Survey !");
        //$(document).ready(function(){
            let $this = this;
            $this.wrapperSelectSurvey = $(".wrapper-select-survey").clone();
            $this.answerCloneElm = $(".wrapper-answer-survey").clone();
            $this.resetSurveySidebar();

            /****** Submit button settings ******/
            
            /* Set submit button background image */
            $this.bgButtonSubmitImg = $this.openMediaLibrary({
                elm: "#bg_button_submit_upload",
                wrapperBtnSubmitUpload: ".wrapper-button-submit-upload"
            });

            /* Remove submit button background image */
            $(document).on("vclick", ".wrapper-button-submit-upload .del-current-bg a", function (e) {
                e.preventDefault();
                $this.resetBgButtonSubmitImg($(this));
            });

            /* Set submit button text */
            $(document).off("keyup", "#submit_color_name").on("keyup", "#submit_color_name", function () {
                $this.liveRenderText({
                    input: $(this),
                    output: [SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find($this.submitBtnPreview), $($this.toolbar).find($this.submitBtnPreview)],
                    defaut: this.btnSubmitPlaceholderText,
                });
            });

            /* Set submit button text size */
            $(document).off("change", "#btn_text_size").on("change", "#btn_text_size", function () {
                $this.renderBtnTextSize($(this));
            });

            /* Add submit button */
            $(document).off("vclick", ".submit-append-btn").on("vclick", ".submit-append-btn", function (e) {
                e.preventDefault();
                if (SL.editor.controllers.Markup.getCurrentSlide().find(".submit-btn-output").length == 0) {
                    $this.addSubmitButton();
                    $this.removeForbidAddSurveyAlert({
                        removeAll: false,
                        elm: $(this).parent(".add-btn")
                    });
                }
                else {
                    if ($(this).parent(".add-btn").find(".forbid-add-survey-elm-alert").length == 0) {
                        $this.forbidAddSurveyAlert($(this));
                    }
                }
            });

            /* Choose a survey type */
            $(document).off("change", $this.selectSurvey).on("change", $this.selectSurvey, function () {
                switch($($this.selectSurvey).find("option:selected").val()){
                    case "Select a survey":
                        $this.resetSurveyTypeSelect();
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".btn-chbox-container")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".btn-radio-container")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".add-select-question-wrapper")
                        });
                        break;

                    case "list_type":
                        $this.selectListType();
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".btn-chbox-container")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".btn-radio-container")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".add-select-question-wrapper")
                        });
                        break;

                    case "checkbox":
                        $this.selectCheckbox();
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".btn-chbox-container")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".btn-radio-container")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".add-select-question-wrapper")
                        });
                        break;

                    case "radio_type":
                        $this.selectRadio();
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".btn-chbox-container")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".btn-radio-container")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".add-select-question-wrapper")
                        });
                        break;

                    case "input_text":
                        $this.selectInputText();
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".add-select-question-wrapper")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".btn-radio-container")
                        });
                        $this.removeForbidAddSurveyAlert({
                            removeAll: false,
                            elm: $(".add-select-question-wrapper")
                        });
                        break;
                }
            });

            /****** Select survey settings *****/

            /* Get existing select survey */
            $this.getExistingSelectSurvey();

            /* Add select survey */
            $(document).off("vclick", "#add_select_question").on("vclick", "#add_select_question", function (e) {
                e.preventDefault();
                $this.addSelectQuestion();
            });

            /* Add answer for select survey */
            $(document).off("vclick", ".add-answer").on("vclick", ".add-answer", $this.addAnswer.bind(this));

            /* Remove answer from select survey */
            $(document).off("vclick", ".remove-answer").on("vclick", ".remove-answer", $this.removeAnswer.bind(this));

            /* Customize answer for select survey */
            $(document).off("keyup", ".select-survey-response").on("keyup", ".select-survey-response", function () {
                var focusedSelect = $(this).parents(".wrapper-select-survey").attr("data-dropdown-link"),
                    focusedOptionIndex = $(".wrapper-select-survey").index($(this).parents(".wrapper-select-survey"));
                focusedOptionIndex = $(".wrapper-select-survey").eq(focusedOptionIndex).find("input[type=text]").index($(this));

                $this.liveRenderText({
                    input: $(this),
                    output: [$(".select-survey-wrapper select[data-select-link=" + focusedSelect + "]").find("option").eq(focusedOptionIndex)],
                    defaut: $(this).attr("placeholder"),
                });
            });

            /* Remove radio & checkbox answer */
            $(document).off("vclick", ".reveal [data-block-type='survey'] .removeAnswerTR").on("vclick", ".reveal [data-block-type='survey'] .removeAnswerTR", function (e) {
                $this.removeRadioChechboxAnswer($(this));
            });
        //}.bind(this));
    },
    resetBgButtonSubmitImg :function(e){
        if(e != undefined){
            this.bgButtonSubmitImg = "";
            e.parent(".del-current-bg").remove();
            SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(this.submitBtnPreview).css("background-image", "none");
            $(this.toolbar).find(this.submitBtnPreview).css("background-image", "none");
        }
    },
    setSubmitButtonColor :function(){
        var $this = this;
        setTimeout(function(){
            this.spectrumSetup({
                elm: "#bg-btn-submit-color",
                defaultColor: "rgb(74, 86, 103)",
                chosenColor: $(Reveal.getCurrentSlide()).find($this.submitBtnPreview).length > 0 ? $(Reveal.getCurrentSlide()).find($this.submitBtnPreview).css("background-color") : "rgb(74, 86, 103)",
                cssProperty: "background-color",
                removeIcon: ".remove-btn-submit-color"

            });
            this.spectrumSetup({
                elm: "#bg-font-submit-color",
                defaultColor: "rgb(255, 255, 255)",
                chosenColor: $(Reveal.getCurrentSlide()).find($this.submitBtnPreview).length > 0 ? $(Reveal.getCurrentSlide()).find($this.submitBtnPreview).css("color") : "rgb(255, 255, 255)",
                cssProperty: "color",
                removeIcon: ".remove-bg-submit-color"

            });
            this.spectrumSetup({
                elm: "#bg-font-Activated-submit-color",
                defaultColor: "rgb(74, 86, 103)",
                chosenColor: $(Reveal.getCurrentSlide()).find($this.submitBtnPreview).length > 0 && ($(Reveal.getCurrentSlide()).find($this.submitBtnPreview).attr('activated-color') != undefined && $(Reveal.getCurrentSlide()).find($this.submitBtnPreview).attr('activated-color') != "") ? $(Reveal.getCurrentSlide()).find($this.submitBtnPreview).attr('activated-color') : "rgb(74, 86, 103)",
                attr: "Activated-color",
                removeIcon: ".remove-Activebg-submit-color"

            });
        }.bind(this), 50);
    },
    spectrumSetup :function(e){
        var $this = this,
        pickedColor;
        if($(Reveal.getCurrentSlide()).find($this.submitBtnPreview).length > 0){
            if(e.chosenColor != e.defaultColor && $($this.toolbar).find(e.removeIcon).css("display") == "none"){
                $($this.toolbar).find(e.removeIcon).css("display", "block");
            }
        }
        $(e.elm).spectrum({
            showAlpha: true,
            color: e.chosenColor,
            flat: !1,
            showInput: !0,
            showButtons: !0,
            showInitial: !0,
            showPalette: !1,
            showSelectionPalette: !1,
            preferredFormat: "hex",
            move: function (color) {
                pickedColor = color.toRgbString();
                $("#bg-btn-submit-color").spectrum("option", "color", pickedColor);
                if(e.attr != undefined){
                    SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find($this.submitBtnPreview).attr(e.attr, pickedColor);
                    $($this.toolbar).find($this.submitBtnPreview).attr(e.attr, pickedColor);
                }
                if(e.cssProperty != undefined){
                    SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find($this.submitBtnPreview).css(e.cssProperty, pickedColor);
                    $($this.toolbar).find($this.submitBtnPreview).css(e.cssProperty, pickedColor);
                }
                if ($($this.toolbar).find(e.removeIcon).css("display") == "none") {
                    $($this.toolbar).find(e.removeIcon).css("display", "block");
                }
            },
            change: function (color) {
                pickedColor = color.toRgbString();
                $("#bg-btn-submit-color").spectrum("option", "color", pickedColor);
                if(e.attr != undefined){
                    SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find($this.submitBtnPreview).attr(e.attr, pickedColor);
                    $($this.toolbar).find($this.submitBtnPreview).attr(e.attr, pickedColor);
                }
                if(e.cssProperty != undefined){
                    SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find($this.submitBtnPreview).css(e.cssProperty, pickedColor);
                    $($this.toolbar).find($this.submitBtnPreview).css(e.cssProperty, pickedColor);
                }
                if ($($this.toolbar).find(e.removeIcon).css("display") == "none") {
                    $($this.toolbar).find(e.removeIcon).css("display", "block");
                }
            }
        });
    },
    resetSubmitColors :function(){
        this.resetColor({
            elm: "#bg-font-Activated-submit-color",
            defaultColor: "rgb(74, 86, 103)",
            attr: "Activated-color",
            removeIcon: ".remove-Activebg-submit-color"
        });
        this.resetColor({
            elm: "#bg-font-submit-color",
            defaultColor: "rgb(255, 255, 255)",
            cssProperty: "color",
            removeIcon: ".remove-bg-submit-color"
        });
        this.resetColor({
            elm: "#bg-btn-submit-color",
            defaultColor: "rgb(74, 86, 103)",
            cssProperty: "background-color",
            removeIcon: ".remove-btn-submit-color"
        });
    },
    resetColor :function(e){
        var $this = this;
        $(document).off("vclick", e.removeIcon).on("vclick", e.removeIcon, function () {
            if(e.attr != undefined){
                SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find($this.submitBtnPreview).attr(e.attr, e.defaultColor);
                $($this.toolbar).find($this.submitBtnPreview).attr(e.attr, e.defaultColor);
            }
            if(e.cssProperty != undefined){
                SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find($this.submitBtnPreview).css(e.cssProperty, e.defaultColor);
                $($this.toolbar).find($this.submitBtnPreview).css(e.cssProperty, e.defaultColor);
            }
            $($this.toolbar).find(e.removeIcon).css("display", "none");
            $(e.elm).spectrum("option", "color", e.defaultColor);
            $(e.elm).spectrum("set", e.defaultColor);
        }.bind(this));
    },
    forbidAddSurveyAlert :function(e){
        e.parent(".add-btn").append("<div class='forbid-add-survey-elm-alert' style='transition: all 0.3s ease;'>You can add only one submit button by slide</div>").promise().done(function () {
            var this_ = $(this);
            setTimeout(function () {
                this_.find(".forbid-add-survey-elm-alert").css({
                    "opacity": "1"
                });
            }, 50);
        });
    },
    removeForbidAddSurveyAlert :function(e){
        if(e.removeAll == true){
            if ($(this.toolbar).find(".forbid-add-survey-elm-alert").length > 0) {
                $(this.toolbar).find(".forbid-add-survey-elm-alert").remove();
            }
            else {
                return false;
            }
        }
        else if((e.removeAll == undefined || e.removeAll == false) && e.elm != undefined && e.elm != ""){
            if (e.elm.find(".forbid-add-survey-elm-alert").length > 0) {
                e.elm.find(".forbid-add-survey-elm-alert").remove();
            }
            else {
                return false;
            }
        }
    },
    openMediaLibrary :function(e){
        $(document).on('vclick', e.elm, function () {
            let t = Reveal.getIndices(this.currentSlide),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function (i) {
                this.bgButtonSubmitImg = i.data.url;
                if ($(e.wrapperBtnSubmitUpload).find(".del-current-bg").length == 0) {
                    $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter("#bg_button_submit_upload");
                }
                this.renderBtnSubmitBg(this.bgButtonSubmitImg);
            }.bind(this));
        }.bind(this));
    },
    renderBtnSubmitBg :function(url){
        var $this = this;
        if(url != undefined && url != ""){
            SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find($this.submitBtnPreview).css({
                "background-image": "url('" + url + "')",
                "background-repeat": "no-repeat",
                "background-position": "center center",
                "background-size": "contain"
            });
            $($this.toolbar).find($this.submitBtnPreview).css({
                "background-image": "url('" + url + "')",
                "background-repeat": "no-repeat",
                "background-position": "center center",
                "background-size": "contain"
            });
        }
        else{
            return false
        }
    },
    renderBtnTextSize :function(e){
        var testSize = e.find("option:selected").val();
        SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused").find(this.submitBtnPreview).css("font-size", testSize + "px");
        $(this.toolbar).find(this.submitBtnPreview).css("font-size", testSize + "px");
    },
    addSubmitButton :function(){
        var submitAppendBtn = $(this.toolbar + " button.submit-btn-preview").clone();

        SL.editor.controllers.Blocks.add({
            type: "survey"
        });
        SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused').addClass('submit-btn-output');
        SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused .sl-block-content p').remove();
        $('<div class="submit-btn-wrapper"></div>').insertAfter(SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused .sl-block-content'));
        SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused.submit-btn-output .submit-btn-wrapper").html("");
        submitAppendBtn.appendTo(SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused.submit-btn-output .submit-btn-wrapper"));
    },
    resetSurveyTypeSelect :function(){
        $("#add_select_question").hide();
        $(".btn-radio-container button").hide();
        $(".wrapper-select-survey").hide();
        $(".btn-textField-container *").remove();
        $(".btn-chbox-container button").hide();
    },
    selectListType :function(){
        $("#add_select_question").show();
        $(".btn-chbox-container button").remove();
        if ($(".slides").find(".select-survey-output").length > 0 && $(".wrapper-select-survey").find(".wrapper-answer-survey").eq(0).find(".select-survey-response").attr("id") != undefined) {
            $(".wrapper-select-survey").hide();
            this.showFocusedDropdownlistParameters();
        }
        $(".button-survey").hide();
        $(".btn-textField-container *").remove();
    },
    selectCheckbox :function(){
        $(".btn-chbox-container button").show();
        if ($(this.toolbar + " .btn-chbox-container").has(".btn").length == 0) {
            this.addElementButtonChbox();
            $(".button-survey").show();
            $("#add_select_question").hide();
            $(".btn-radio-container button").remove();
            $(".btn-textField-container *").remove();
            $(".wrapper-select-survey").hide();
        }
    },
    selectRadio :function(){
        $(".btn-radio-container button").show();
        if ($(this.toolbar + " .btn-radio-container").has(".btn").length == 0) {
            $(".button-survey").show();
            $(".btn-chbox-container button").remove();
            $("#add_select_question").hide();
            $(".btn-textField-container *").remove();
            $(".wrapper-select-survey").hide();
            this.addElementButtonRadio();
        }
    },selectInputText :function(){
        this.addElementTextField();
        $(".button-survey").show();
        $("#add_select_question").hide();
        $(".btn-radio-container button").remove();
        $(".btn-chbox-container button").remove();
        $(".wrapper-select-survey").hide();
    },
    liveRenderText :function(e){
        if (e.input.val() == "") {
            for (var key in e.output){
                if(e.output[key].is("option")){
                    e.output[key].html(e.input.attr("placeholder")).attr("value", e.input.attr("placeholder"));
                }
                else{
                    e.output[key].html(this.btnSubmitPlaceholderText);
                }
            }
        }
        else {
            for (var key in e.output){
                if(e.output[key].is("option")){
                    e.output[key].html(e.input.val()).attr("value", e.input.val());
                }
                else{
                    e.output[key].html(e.input.val());
                }
            }
        }
    },
    addRow :function (e) {
        var tr = $('<tr>'),
        td = e.type == "q" ? $('<th colspan ="3" id="' + (e.qType == "radio" ? "idRadioQ_" : "idCheckboxQ_") + this.idQuestion + '" class="surveyIDs ' + (e.qType == "radio" ? "q-radio" : "q-checkbox") + '"></th>') : $('<td width="35"></td>,<td class="QuestionText"></td>, <td class="removeAnswerTR"></td>'),
        tdText = e.value;
        e.type == "r" ? td.eq(0).append($(tdText).eq(0)) : td.append(tdText);
        e.type == "r" ? td.eq(1).append($(tdText).eq(1)) : null;
        tr.append(td);
        e.elm.append(tr);
    },
    IdTableauChbox :function () {
        var idTablChBoxFocused;
        if ($(Reveal.getCurrentSlide()).find(".sl-block.is-focused").find('table').find("input[type='checkbox']").length > 0) {
            idTablChBoxFocused = $(Reveal.getCurrentSlide()).find(".sl-block.is-focused").find('table').attr('id');
        }
        return idTablChBoxFocused;
    },
    IdTableauRadio :function () {
        var idTabRadioFocused;
        if ($(Reveal.getCurrentSlide()).find(".sl-block.is-focused").find('table').find("input[type='radio']").length > 0) {
            idTabRadioFocused = $(Reveal.getCurrentSlide()).find(".sl-block.is-focused").find('table').attr('id');
        }
        return idTabRadioFocused;
    },
    addCheckbox :function() {
        var rowInner = "<label class='repCheckbox' for='idCheckbox_" + this.counter + "'><input type='checkbox' id='idCheckbox_" + this.counter + "' name='idCheckbox_" + this.counter + "' value='Enter your text answer' /></label>" +
                       "<span>Enter your text answer</span>";

        this.addRow({
            elm: $("#" + this.IdTableauChbox()).find('tbody'),
            value: rowInner,
            type: "r"
                    });
        this.counter++;
    },
    addElementButtonChbox: function() {
        $(this.toolbar + " .btn-chbox-container").append("<button id='add_Chbox' class='btn btn-primary survey-add-blocChbox'>" +  TWIG.toolbar.addQuestion +"</button><button  class='btn btn-primary survey-add-ChboxResponse'>" + TWIG.toolbar.addResponse + "</button>");
        $(document).off("vclick", this.addBlocChboxClick).on("vclick", this.addBlocChboxClick, function(){
            this.addElementTableChbox();
        }.bind(this));
        $(document).off("vclick", this.addChboxResponseClick).on("vclick", this.addChboxResponseClick, function(){
            this.addCheckbox();
        }.bind(this));
    },
    addRadio :function() {
        var rowInner = "<label class='repRadio' for='idRadio_" + this.counter2 + "'><input type='radio' id='idRadio_" + this.counter2 + "' name='idRadio_" + this.counter2 + "' value='Enter your text answer' /></label>" +
                       "<span>Enter your text answer</span>";
        this.addRow({
            elm: $("#" + this.IdTableauRadio()).find('tbody'),
            value: rowInner,
            type: "r"
        });
        this.counter2++;
    },
    addElementButtonRadio :function() {
        $(this.toolbar + " .btn-radio-container").append("<button class='btn btn-primary survey-add-blocRad'>Add question</button><button class='btn btn-primary survey-add-radResponse'>Add response</button>");
        $(document).off("vclick", this.addBlocRadClick).on("vclick", this.addBlocRadClick, function(){
            this.addElementTableRadio();
        }.bind(this));

        $(document).off("vclick", this.AddRadResponseClick).on("vclick", this.AddRadResponseClick, function(){
            this.addRadio();
        }.bind(this));
    },
    addElementTableChbox :function() {
        //console.log("CounterQ: " + this.idQuestion);
        var thTxt = "Enter your Question here?",
        tabElm = "<table class='table-survey' id='table_checkbox_" + this.idQuestion + "'></table>",
        rowInner = "<label class='repCheckbox' for='idCheckbox_" + this.counter + "'><input type='checkbox' id='idCheckbox_" + this.counter + "' name='idCheckbox_" + this.counter + "' value='Enter your text answer' /></label>" +
                   "<span>Enter your text answer</span>";

        SL.editor.controllers.Blocks.add({
            type: "survey"
        });
        $('.sl-block.is-focused .sl-block-content').append(tabElm);

        var tbodyElm = $("#table_checkbox_" + this.idQuestion);
        this.addRow({
            elm: tbodyElm,
            value: thTxt,
            type: "q",
            qType: "checkbox"
        });
        this.addRow({
            elm: tbodyElm,
            value: rowInner,
            type: "r"
        });
        this.idQuestion++;
        this.counter++;
    },
    addElementTableRadio :function() {
        //console.log("Counter: " + this.idQuestion);
        var thTxt = "Enter your Question here?",
        tabElm = "<table class='table-survey-radio' id='table_radio_" + this.idQuestion + "'></table>",
        rowInner = "<label class='repRadio' for='idRadio_" + this.counter2 + "'><input type='radio' id='idRadio_" + this.counter2 + "' name='idRadio_" + this.counter2 + "' value='Enter your text answer' /></label>" +
                   "<span>Enter your text answer</span>";
        
        SL.editor.controllers.Blocks.add({
            type: "survey"
        });
        $('.sl-block.is-focused .sl-block-content').append(tabElm);

        var tbodyElm = $("#table_radio_" + this.idQuestion);
        this.addRow({
            elm: tbodyElm,
            value: thTxt,
            type: "q",
            qType: "radio"
        });
        this.addRow({
            elm: tbodyElm,
            value: rowInner,
            type: "r"
        });
        this.idQuestion++;
        this.counter2++;
    },
    addElementTextField :function() {
        $(this.toolbar + " .btn-textField-container").append("<button id='add_Chbox' class='btn btn-primary survey-add-blocInputField'> Add an Input Field</button>");
        $(document).off("vclick", this.addBlocInputField).on("vclick", this.addBlocInputField, function(){
            this.addElementTextInput();
        }.bind(this));
    },
    addElementTextInput :function(r) {
        this.countTextField++;
        if(r != undefined){
            SL.editor.controllers.Blocks.add({
                type: "survey"
            }).move(r.x, r.y);
        }
        else{
            SL.editor.controllers.Blocks.add({
                type: "survey"
            });
        }
        SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused').addClass('text-field-output');
        SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused .sl-block-content p').remove();
        $('<div class="text-field-wrapper"></div>').insertAfter(SL.editor.controllers.Markup.getCurrentSlide().find('.sl-block.is-focused .sl-block-content'));
        SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused.text-field-output .text-field-wrapper").html("");
        $('.sl-block.is-focused .sl-block-content').append("<div class='q-textField surveyIDs' id='Id_InputText_" + this.countTextField + "'>Enter your Question here?</div>");
        $("<table><tr><td><input type='text' placeholder='Enter your text here...' id='text_field_" + this.countTextField + "' /></td></tr></table>"
        ).appendTo(SL.editor.controllers.Markup.getCurrentSlide().find(".sl-block.is-focused.text-field-output .text-field-wrapper"));
        this.removeForbidAddSurveyAlert({
            removeAll: false,
            elm: $(".btn-textField-container")
        });
        this.idQuestion++;
    },
    removeRadioChechboxAnswer: function(e){
        var focusedSurveyElm = SL.editor.controllers.Blocks.getFocusedBlocks()[0]/*,
        elmIndex = focusedSurveyElm.domElement.find("tr").index(e.parent("tr"))*/;
        /*SL.editor.controllers.Blocks.blur();
        console.log("Index TR: " + elmIndex);*/
        if(focusedSurveyElm.domElement.find("tr").length > 2){
            /*focusedSurveyElm.domElement.find("tr").eq(elmIndex).remove();*/
            e.parent("tr").remove();
        }
        else{
            //focusedSurveyElm.destroy();
            if(e.parents("table").is(".table-survey")){
                this.addCheckbox();
            }
            else if(e.parents("table").is(".table-survey-radio")){
                this.addRadio();
            }
            e.parent("tr").remove();
        }
        /*SL.editor.controllers.Blocks.focus(focusedSurveyElm);*/
    },
    addSelectQuestion: function(r){
        var $this = this;
        $this.counterQues++;

        // if ($(".wrapper-select-survey").find(".wrapper-answer-survey").eq(0).find(".select-survey-response").attr("id") == undefined) {
        //     $this.counterResp = 1;
        // }
        // else {
            $this.counterResp++;
        // }
        $this.addSelectInfosToSidebar();


        var selectSurveyName = $this.selectSurveyName($(".wrapper-select-survey").find("#select_survey_response" + $this.counterResp));

        var selectInstanceId = 'select_question' + $this.counterQues,
            selectInstanceLink = $this.counterQues,
            optionInstanceLink = $this.counterResp,
            optionInstanceId = 'question' + $this.counterQues + '_resp' + $this.counterResp,
            selectSurveyAppend = '<div class="select-survey-wrapper">' +
                '<select name="' + selectInstanceId + '" class="q-select" id="' + selectInstanceId + '" data-select-link="' + selectInstanceLink + '">' +
                '<option id="' + optionInstanceId + '" value="' + selectSurveyName + '" data-resp-link="' + optionInstanceLink + '">' + selectSurveyName + '</option>' +
                '</select>' +
                '</div>';
        if(r != undefined){
            SL.editor.controllers.Blocks.add({
                type: "survey"
            }).move(r.x, r.y);
        }
        else {
            SL.editor.controllers.Blocks.add({
                type: "survey"
            });
        }
        $this.addSelectToStage(selectSurveyAppend);

        $this.removeForbidAddSurveyAlert({
            removeAll: false,
            elm: $("#add_select_question").parent(".add-select-question-wrapper")
        });
        $this.saveToProjector({
            dataRespCounter: $this.counterResp,
            dataQuestionCounter: $this.counterQues
        });
    },
    getExistingSelectSurvey :function(){
        var $this = this;
        if ($(".sl-block .select-survey-wrapper").length > 0) {
            $(".sl-block .select-survey-wrapper").each(function (indexSelect, elmSelect) {
            var wrapperSelectGeneratedIndex = $this.getDataSelectLink($(this).find("select"));
                $this.setExistingSelectValues({
                    index: indexSelect,
                    dataSelectLink: wrapperSelectGeneratedIndex
                });

                $this.setExistingSelectOptions({
                    elm: $(this),
                    dataSelectLink: wrapperSelectGeneratedIndex
                });
            });
        }
    },
    setExistingSelectValues :function(e){
        if (e.index === 0) {
            $(".wrapper-select-survey").attr({
                "id": "wrapper_select_survey" + e.dataSelectLink,
                "data-dropdown-link": e.dataSelectLink
            })/*.show()*/;
        }
        else {
            this.wrapperSelectSurvey.clone().insertAfter($(".wrapper-select-survey").last()).attr({
                "id": "wrapper_select_survey" + e.dataSelectLink,
                "data-dropdown-link": e.dataSelectLink
            })/*.show()*/;
        }
    },
    setExistingSelectOptions :function(e){
        var $this = this;
        e.elm.find("select option").each(function (index, elm) {
            var dataRespLink = $this.getDataRespLink($(elm));
            if (index === 0) {
                $("#wrapper_select_survey" + e.dataSelectLink).find(".select-survey-response").eq(0).attr({
                    "id": "select_survey_response" + dataRespLink,
                    "name": "select_survey_response" + dataRespLink
                }).attr("placeholder", $this.placeholderText).val($(elm).val() != $this.placeholderText ? $(elm).val() : null);
                $("#wrapper_select_survey" + e.dataSelectLink).find(".wrapper-answer-survey label").text("Answer 1:");
            }
            else {
                $('<div class="wrapper-answer-survey"><label class="label-survey-response">Answer ' + (index + 1) +
                ':</label><input type="text" class="select-survey-response" placeholder="' + $this.placeholderText +
                '" id="select_survey_response' + dataRespLink + '" name="select_survey_response' + dataRespLink +
                '"><a class="pull-right remove-answer"><i class="fa fa-times"></i></a></div>').insertAfter($("#wrapper_select_survey" + e.dataSelectLink).find(".wrapper-answer-survey").last());
                $("#wrapper_select_survey" + e.dataSelectLink).find(".wrapper-answer-survey").eq(index).find(".select-survey-response").attr("placeholder", $this.placeholderText).val($(elm).val() != $this.placeholderText ? $(elm).val() : null);
            }
        });
    },
    getDataSelectLink :function(e){
        return e.attr("data-select-link");
    },
    getDataRespLink :function(e){
        return e.attr("data-resp-link");
    },
    addSelectInfosToSidebar :function(){
        var $this = this;
        if ($(".wrapper-select-survey").attr("id") == undefined) {
            $(".wrapper-select-survey").attr("id", "wrapper_select_survey" + $this.counterQues).attr("data-dropdown-link", $this.counterQues).show();
        }
        else {
            $(".wrapper-select-survey").each(function (index, elm) {
                $(this).hide();
            });
            $this.wrapperSelectSurvey.clone().insertAfter($(".wrapper-select-survey").last()).attr("id", "wrapper_select_survey" + $this.counterQues).attr("data-dropdown-link", $this.counterQues).show();
        }
        $(".wrapper-select-survey").last().find(".select-survey-response").attr({
            'id': 'select_survey_response' + $this.counterResp,
            'name': 'select_survey_response' + $this.counterResp
        });
        $(".wrapper-answer-survey").parents("#wrapper_select_survey" + $this.counterQues).find(".label-survey-response").eq(0).html("Answer 1:");
    },
    selectSurveyName :function(e){
        return e.val() != "" ? e.val() : e.attr("placeholder")
    },
    addSelectToStage :function(html){
        var IDSelect = $(html).find("select").attr("id");
        //console.log(IDSelect);
        $('.sl-block.is-focused .sl-block-content').append("<div class='q-select-question surveyIDs' id='ID" + IDSelect + "'>Enter your Question here?</div>");
        $(html).insertAfter('.sl-block.is-focused .sl-block-content');
        $(".select-survey-wrapper").parents(".sl-block").addClass('select-survey-output');
    },
    addAnswer :function(e){
        var target = e.target != undefined ? $(e.target) : e;
        if(target != undefined && typeof(target) != "number"){
            this.answerCloneElm.clone().insertAfter(target.parents(".wrapper-select-survey").find(".wrapper-answer-survey").last());
            target.parents(".wrapper-select-survey").find(".wrapper-answer-survey").last().find(".select-survey-response").attr({
                'id': 'select_survey_response' + (this.counterResp + 1),
                'name': 'select_survey_response' + (this.counterResp + 1)
            });
        }

        var optionInstanceId = 'question' + (target != undefined && typeof(target) != "number" ? target.parents(".wrapper-select-survey").attr("data-dropdown-link") : target) + '_resp' + (this.counterResp + 1),
        selectSurveyName = target != undefined && typeof(target) != "number" ? this.selectSurveyName(target.parents(".wrapper-select-survey").find(".select-survey-response").last()) : null;
        var focusedSelect = target != undefined && typeof(target) != "number" ? target.parents(".wrapper-select-survey").attr("data-dropdown-link") : target;

        $(".select-survey-wrapper select[data-select-link=" + focusedSelect + "]").append('<option id="' + optionInstanceId + '" value="' + selectSurveyName + '" data-resp-link="' + (this.counterResp + 1) + '">' + selectSurveyName + '</option>');
        if(target != undefined && typeof(target) != "number"){
            target.parents(".wrapper-select-survey").find(".wrapper-answer-survey").last().find(".label-survey-response").html("Answer " + (target.parents(".wrapper-select-survey").find(".wrapper-answer-survey").last().index() + 1) + ":");
        }

        this.counterResp++;
        this.saveToProjector({
            dataRespCounter: this.counterResp
        });
    },
    removeAnswer :function(e){
        if ($(e.currentTarget).parents(".wrapper-select-survey").find(".wrapper-answer-survey").length > 1) {
            var deletedSelectIndex = $(e.currentTarget).parents(".wrapper-select-survey").attr("data-dropdown-link"),
                deletedOptionIndex = $(".wrapper-select-survey").index($(e.currentTarget).parents(".wrapper-select-survey")),
                deletedLabelParentIndex = $(e.currentTarget).parents(".wrapper-select-survey");
            deletedOptionIndex = $(".wrapper-select-survey").eq(deletedOptionIndex).find(".remove-answer").index($(e.currentTarget));
            $(e.currentTarget).parent(".wrapper-answer-survey").remove();
            $(".select-survey-wrapper select[data-select-link=" + deletedSelectIndex + "]").find("option").eq(deletedOptionIndex).remove();
            deletedLabelParentIndex.find(".wrapper-answer-survey").each(function (index, elm) {
                $(elm).find(".label-survey-response").html("Answer " + (index + 1) + ":");
            });
        }
    },
    updateDuplicatedSurvey: function(i){
        var $this = this;
        if(i.find("[data-block-type=survey]").length > 0){
            //console.log("There is a survey !");
            var nextSelectQuestionId = parseInt(TWIG.parameters.dataQuestionCounter),
            nextSelectResponseId = parseInt(TWIG.parameters.dataRespCounter);

            if(i.find(".text-field-output").length > 0){
                i.find(".text-field-output").each(function(index, elm){
                    $this.countTextField++;
                    $(this).find(".q-textField").attr("id", "Id_InputText_" + $this.countTextField);
                    $(this).find("input[type=text]").attr("id", "text_field_" + $this.countTextField);
                    //console.log("------------------");
                });
            }

            if(i.find(".table-survey, .table-survey-radio").length > 0){
                var tableID = "",
                    questionID = "",
                    answerID = "";
                i.find(".table-survey, .table-survey-radio").each(function(index, elm){
                    tableID = $(this).find(".surveyIDs").is(".q-checkbox") ? "table_checkbox_" : "table_radio_";
                    questionID = $(this).find(".surveyIDs").is(".q-checkbox") ? "idCheckboxQ_" : "idRadioQ_";

                    $(this).attr("id", (tableID + $this.idQuestion));
                    $(this).find(".surveyIDs").attr("id", (questionID + $this.idQuestion));
                    //console.log("------------------");
                    //console.log(nextIdCounter);
                    $this.idQuestion++;
                    answerID = "";
                    $(this).find("label").each(function(){
                        answerID = $(this).is(".repCheckbox") ? "idCheckbox_" + $this.counter : "idRadio_" + $this.counter2;
                        $(this).attr("for", (answerID + $this.counter));
                        $(this).find("input").attr("id", answerID);
                        $(this).find("input").attr("name", answerID);
                        $(this).is(".repCheckbox") ? $this.counter++ : $this.counter2++;
                    });
                });
                //console.log("radio / checkbox");
            }
            if(i.find(".select-survey-wrapper").length > 0){
                i.find(".select-survey-wrapper").each(function(index, elm){
                    nextSelectQuestionId++;
                    $(this).find("select").attr("id", "select_question" + nextSelectQuestionId);
                    $(this).parents(".select-survey-output").find(".q-select-question").attr("id", "IDselect_question" + nextSelectQuestionId);
                    $(this).find("select").attr("name", "select_question" + nextSelectQuestionId);
                    $(this).find("select").attr("data-select-link", nextSelectQuestionId);

                    $(this).find("select option").each(function(){
                        nextSelectResponseId++;
                        $(this).attr("id", "question" + nextSelectQuestionId + "_resp" + nextSelectResponseId);
                        $(this).attr("data-resp-link", nextSelectResponseId);
                    });
                    //console.log("------------------");
                    //console.log(nextSelectQuestionId);
                });
                SL.editor.controllers.Survey.saveToProjector({
                    dataRespCounter: nextSelectResponseId,
                    dataQuestionCounter: nextSelectQuestionId
                });
                SL.editor.controllers.Survey.counterQues = nextSelectQuestionId;
                SL.editor.controllers.Survey.counterResp = nextSelectResponseId;
            }
        }
        else{
            //console.log("There is NOT a survey !");
        }
    },
    initInputCounter: function(e){
        var maxIdCounter = [];
        e.elm.each(function(index, elm){
            maxIdCounter.push(parseInt($(this).attr("id").split(e.separator)[e.index]));
            //console.log("maxIdCounter: " + maxIdCounter);
        });
        var nextIdCouter = Math.max(...maxIdCounter) + (e.increment != undefined && e.increment != "" && typeof(e.increment) === "number" ? e.increment : 0);
        //console.log("nextIdCouter: " + nextIdCouter);
        return nextIdCouter
    },
    updateDuplicatedBlocks: function(e, r){
        //console.log(e);
        if(e.is("[data-block-type=survey]")){
            SL.editor.controllers.Blocks.disableAddSurveyToolbar = true;
            //console.log("radio / checkbox");
            if(e.find("table").is(".table-survey")){
                e.find(".table-survey tr").each(function(index, elm){
                    if($(elm).find("th").length > 0){
                        var elmQuestion = $(elm).find("th").first(),
                        elmTable = $(elm).parents("table"),
                        elmID = "idCheckboxQ_",
                        tableID = "table_checkbox_",
                        updatedElmID = elmID + this.idQuestion,
                        updatedTableID = tableID + this.idQuestion;

                        elmQuestion.attr("id", updatedElmID);
                        elmTable.attr("id", updatedTableID);

                        //console.log("Updated IDs: " + updatedElmID + " / " + updatedTableID);
                        this.idQuestion++;
                    }
                    else{
                        var elmInput = $(elm).find(".repCheckbox"),
                        elmID = "idCheckbox_";
                        elmInput.attr("for", elmID + this.counter);
                        elmInput.find("input").attr({id: elmID + this.counter, name: elmID + this.counter});
                        this.counter++;
                    }
                }.bind(this));
            }
            else if(e.find("table").is(".table-survey-radio")){
                e.find(".table-survey-radio tr").each(function(index, elm){
                    if($(elm).find("th").length > 0){
                        var elmQuestion = $(elm).find("th").first(),
                        elmTable = $(elm).parents("table"),
                        elmID = "idRadioQ_",
                        tableID = "table_radio_",
                        updatedElmID = elmID + this.idQuestion,
                        updatedTableID = tableID + this.idQuestion;

                        elmQuestion.attr("id", updatedElmID);
                        elmTable.attr("id", updatedTableID);

                        //console.log("Updated IDs: " + updatedElmID + " / " + updatedTableID);
                        this.idQuestion++;
                    }
                    else{
                        var elmInput = $(elm).find(".repRadio"),
                        elmID = "idRadio_";
                        elmInput.attr("for", elmID + this.counter2);
                        elmInput.find("input").attr({id: elmID + this.counter2, name: elmID + this.counter2});
                        this.counter2++;
                    }
                }.bind(this));
            }
            else if(e.is(".submit-btn-output")){
                $(".submit-append-btn").parent(".add-btn").append("<div class='forbid-add-survey-elm-alert' style='transition: all 0.3s ease;'>You can add only one submit button by slide</div>").promise().done(function(){
                    var this_ = $(this);
                    setTimeout(function(){
                        this_.find(".forbid-add-survey-elm-alert").css({
                            "opacity": "1"
                        });
                    }, 50);
                });
            }
            else if(e.is(".text-field-output")){
                var $this = this;
                this.addElementTextInput((r != undefined ? r : null));
                $(".text-field-output input[type=text][id=text_field_" + $this.countTextField + "]").val(e.find("input[type=text]").val());
                $(".text-field-output .q-textField[id=Id_InputText_" + $this.countTextField + "]").text(e.find(".sl-block-content > div").text());
            }
            else if(e.is(".select-survey-output")){
                var $this = this;
                //console.log("is select-survey-output ! " + e.find("option").length);
                this.addSelectQuestion(r);
                e.find("option").each(function(index, elm){
                    $(".select-survey-output .q-select-question[id=IDselect_question" + $this.counterQues + "]").text(e.find(".sl-block-content > div").text());
                    if(index === 0){
                        //console.log("zero");
                        $(".select-survey-output select[data-select-link=" + $this.counterQues + "] option").eq(0).val(e.find("option").eq(0).text()).text(e.find("option").eq(0).text());
                    }
                    else{
                        //$this.addAnswer($(".wrapper-select-survey[data-dropdown-link=" + $this.counterQues + "] .add-answer"));
                        $this.addAnswer($this.counterQues);
                        $(".select-survey-output select[data-select-link=" + $this.counterQues + "] option").eq(index).val(e.find("option").eq(index).text()).text(e.find("option").eq(index).text());
                    }
                });
            }
        }
        else{
            return false
        }
    },
    updateOldPresentationsSurvey: function(){
        $(".table-survey-radio > tbody > tr > th, .table-survey > tbody > tr > th, .text-field-output .sl-block-content > div, .select-survey-output .sl-block-content > div, .select-survey-output select").each(function(index, elm){
            if(!$(this).is(".surveyIDs")){
                $(this).addClass("surveyIDs");
            }
        });
        $(".table-survey-radio > tbody > tr > th").each(function(index, elm){
            if(!$(this).is(".q-radio")){
                $(this).addClass("q-radio");
            }
        });
        $(".table-survey > tbody > tr > th").each(function(index, elm){
            if(!$(this).is(".q-checkbox")){
                $(this).addClass("q-checkbox");
            }
        });
        $(".text-field-output .sl-block-content > div").each(function(index, elm){
            if(!$(this).is(".q-textField")){
                $(this).addClass("q-textField");
            }
        });
        $(".select-survey-output .sl-block-content > div").each(function(index, elm){
            if(!$(this).is(".q-select-question")){
                $(this).addClass("q-select-question");
            }
        });
        $(".select-survey-output select").each(function(index, elm){
            if(!$(this).is(".q-select")){
                $(this).addClass("q-select");
            }
        });
    },
    UpdateSpectrumSurevey: function(){
        var $this = this,
        button = $(Reveal.getCurrentSlide()).find($this.submitBtnPreview),
        submitColorName = $("#submit_color_name"),
        previewBtn =  $(".preview-submit-btn").find($this.submitBtnPreview);
        if ($(Reveal.getCurrentSlide()).find('.submit-btn-preview').length != 0) {
            var styleProps = button.css([
                "color", "background-image", "background-repeat", "background-position", "background-size", "background-color", "font-size"
            ]);
            var FontColor;
            var BackgroundColor;
            $('.edit-all-font').each(function () {
                if ($(this).text().indexOf("Font color") != -1) {
                    FontColor = $(this);
                }
                else if ($(this).text().indexOf("Background color") != -1) {
                    BackgroundColor = $(this);
                }

            });
            $.each(styleProps, function (prop, value) {
                if (prop == "color") {
                    previewBtn.css("color", value);
                }
                if (prop == "background-color") {
                    previewBtn.css("background-color", value);
                }
                if (prop == "background-size") {
                    previewBtn.css("background-size", value);
                }
                if (prop == "background-image") {
                    previewBtn.css("background-image", value);
                }
                if (prop == "background-position") {
                    previewBtn.css("background-position", value);
                }
                if (prop == "background-repeat") {
                    previewBtn.css("background-repeat", value);
                }
                if (prop == "font-size") {
                    previewBtn.css("font-size", value);
                    $('#btn_text_size').val(parseInt(value));
                }

            });
            submitColorName.val("");
            previewBtn.text("");
            submitColorName.val($(button).text());
            previewBtn.text($(button).text());
        }
    },
    toolbarSurveyVisibility: function (elm) {
        setTimeout(function(){
            if (elm.find(".select-survey-wrapper")[0] != null || elm.find("[id^='table_checkbox_']")[0] != null || elm.find("[id^='table_radio_']")[0] != null || elm.find(".text-field-wrapper")[0] != null || elm.find(".submit-btn-preview")[0] != null) {

                if (elm.find(".select-survey-wrapper")[0] != null) {
                    $(this.selectSurvey).find('option:eq(3)').prop('selected', true);
                    $(this.selectSurvey).find('option:eq(3)').trigger('change');

                }
                else if (elm.find("[id^='table_radio_']")[0] != null) {

                    $(this.selectSurvey).find('option:eq(2)').prop('selected', true);
                    $(this.selectSurvey).find('option:eq(2)').trigger('change');
                }
                else if (elm.find("[id^='table_checkbox_']")[0] != null) {
                    $(this.selectSurvey).find('option:eq(1)').prop('selected', true);
                    $(this.selectSurvey).find('option:eq(1)').trigger('change');

                }
                else if (elm.find(".text-field-wrapper")[0] != null) {
                    $(this.selectSurvey).find('option:eq(0)').prop('selected', true);
                    $(this.selectSurvey).find('option:eq(0)').trigger('change');
                    $(this.selectSurvey).find('option:eq(4)').prop('selected', true);
                    $(this.selectSurvey).find('option:eq(4)').trigger('change');

                }
                else if (elm.find(".submit-btn-preview")[0] != null) {
                    $(this.selectSurvey).find('option:eq(0)').prop('selected', true);
                    $(this.selectSurvey).find('option:eq(0)').trigger('change');
                }
            }
        }.bind(this), 50);
    },
    resetSurveySidebar :function(){
        $(this.selectSurvey).find('option:eq(0)').prop('selected', true);

        /* Init Font color, Background color, and Activated color */
        this.setSubmitButtonColor();
        this.resetSubmitColors();

        if ($(Reveal.getCurrentSlide()).find('.submit-btn-wrapper').length == 0) {
            /* Init submit button text size */
            $("#btn_text_size").val("16").trigger('change');
        }
        else {
            setTimeout(function(){
                this.UpdateSpectrumSurevey()
            }.bind(this), 10);
        }
        $(".wrapper-select-survey").hide();
        this.showFocusedDropdownlistParameters();
        this.removeForbidAddSurveyAlert({
            removeAll: true
        });
    },
    showFocusedDropdownlistParameters :function(){
        var $this = this;
        $(".sl-block.is-focused .select-survey-wrapper select").each(function (index, elm) {
            var focusedDropdownElmsIndex = $this.getDataSelectLink($(this));
            $(".wrapper-select-survey[data-dropdown-link=" + focusedDropdownElmsIndex + "]").show();
        });
    },
    saveToProjector :function(e){
        //projector.attr(e);
        if(e.dataQuestionCounter != undefined){
            TWIG.parameters.dataQuestionCounter = e.dataQuestionCounter;
        }
        if(e.dataRespCounter != undefined){
            TWIG.parameters.dataRespCounter = e.dataRespCounter;
        }
    }
}

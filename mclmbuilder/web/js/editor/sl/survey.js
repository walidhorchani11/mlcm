'use strict';

export const survey = {
    init: function(e) {
        this._super("survey", $.extend({
            verticalResizing: !1,
            placeholderTag: "p",
            placeholderText: ""
        }, e)), this.plug(SL.editor.blocks.plugin.HTML), this.readDefaultContent(), this.injectDefaultContent()
    },
    bind: function() {
        this._super(), this.onEditingKeyUp = this.onEditingKeyUp.bind(this), this.onEditingKeyDown = this.onEditingKeyDown.bind(this), this.onEditingInput = this.onEditingInput.bind(this), this.onEditingFocusOut = this.onEditingFocusOut.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    blur: function() {
        this._super(), this.isEditingText() && this.disableEditing(), SL.view.toolbars.domElement.removeClass("survey-sideBar").removeAttr("id")
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: SL.editor.blocks.Text.DEFAULT_WIDTH
        });

        this.domElement.find('.sl-block-content').addClass('intialP');
        this.domElement.find('.sl-block-content').find('p:first-child').html("<span style='font-size:25px;color:rgb(0,0,0);font-weight:400;font-style:normal;'></span>");

    },
    readDefaultContent: function() {
        this.contentElement.attr("data-placeholder-tag") ? this.options.placeholderTag = this.contentElement.attr("data-placeholder-tag") : this.contentElement.attr("data-placeholder-tag", this.options.placeholderTag), this.contentElement.attr("data-placeholder-text") ? this.options.placeholderText = this.contentElement.attr("data-placeholder-text") : this.contentElement.attr("data-placeholder-text", this.options.placeholderText)
    },
    injectDefaultContent: function() {
        var e = this.getDefaultContent();
        "" === this.contentElement.text().trim() && e && (this.hasPlugin(SL.editor.blocks.plugin.HTML) && this.hasCustomHTML() || this.contentElement.html(e))
    },
    clearDefaultContent: function() {
        this.contentElement.html().trim() === this.getDefaultContent() && this.contentElement.html(this.getDefaultContent(!0))
    },
    getDefaultContent: function(e) {
        return this.options.placeholderTag && this.options.placeholderText ? e ? "<" + this.options.placeholderTag + ">&nbsp;</" + this.options.placeholderTag + ">" : "<" + this.options.placeholderTag + ">" + this.options.placeholderText + "</" + this.options.placeholderTag + ">" : ""
    },
    externalizeLinks: function() {
        SL.util.openLinksInTabs(this.contentElement)
    },
    resize: function() {
        this._super.apply(this, arguments), this.syncPairs(), this.syncOverflow()
    },
    getToolbarOptions: function() {
        return [SL.editor.components.toolbars.options.SurveyTypes, SL.editor.components.toolbars.options.SurveyTextButton, SL.editor.components.toolbars.options.SurveyTextSizeButton, SL.editor.components.toolbars.options.SurveyTextSizeButtonColors, SL.editor.components.toolbars.options.SurveyBgButton, SL.editor.components.toolbars.options.SurveyPreviewButton, SL.editor.components.toolbars.options.SurveyAddButton].concat(this._super())
    },
    focus: function() {
        this._super(), SL.editor.controllers.Blocks.discoverBlockPairs(), this.syncOverflow(), SL.editor.controllers.Survey.setup(), SL.view.toolbars.domElement.addClass("survey-sideBar").attr("id", "survey_sideBar"), SL.editor.controllers.Survey.toolbarSurveyVisibility(this.domElement)/*, SL.editor.controllers.Blocks.lastFocusedElm = this*/
    },
    enableEditing: function() {

        if (!this.isEditingText()) {
            this.contentElement.attr("contenteditable", ""), this.domElement.addClass("is-editing"), this.contentElement.on("keyup", this.onEditingKeyUp), this.contentElement.on("keydown", this.onEditingKeyDown), this.contentElement.on("input", this.onEditingInput), this.contentElement.on("focusout", this.onEditingFocusOut), this.clearDefaultContent();
            var e = {};
            /*SL.editor.controllers.Capabilities.isTouchEditor() && (this.contentElement.focus(), e.toolbar = [
                ["Format"],
                ["NumberedList", "BulletedList", "-", "Blockquote"]
            ],
            window.scrollTo(0, Math.max(this.contentElement.offset().top - 60, 0))),*/
            this.hasPlugin(SL.editor.blocks.plugin.HTML) && this.hasCustomHTML() && (e.allowedContent = !0), e.contentsLangDirection = SLConfig.deck.rtl === !0 ? "rtl" : "ui";
            var t = SL.view.getCurrentTheme();
            if (t && t.hasPalette()) {
                var i = t.get("palette");
                i = i.join(","), i = i.replace(/#/g, ""), e.colorButton_colors = i
            }
            this.editor = CKEDITOR.inline(this.contentElement.get(0), e), this.editor.on("instanceReady", function() {
                this.contentElement.html(this.contentElement.html().trim()), this.editor.focus();
                var e = this.editor.createRange();
                e.moveToElementEditEnd(this.editor.editable()), e.select()
            }.bind(this))
        }
    },
    disableEditing: function() {
        this.contentElement.removeAttr("contenteditable").blur(), this.domElement.removeClass("is-editing"), this.contentElement.off("keyup", this.onEditingKeyUp), this.contentElement.off("keydown", this.onEditingKeyDown), this.contentElement.off("input", this.onEditingInput), this.contentElement.off("focusout", this.onEditingFocusOut), this.externalizeLinks(), this.injectDefaultContent(), this.editor && (this.editor.destroy(), this.editor = null), SL.editor.controllers.Blocks.afterBlockTextSaved(this.contentElement)
    },
    syncPairs: function() {
        if (!this.destroyed) {
            var e = this.measure();
            this.pairings.forEach(function(t) {
                "bottom" === t.direction && t.block.move(null, e.bottom)
            }), this._super()
        }
    },
    syncOverflow: function() {
        this.domElement.toggleClass("is-text-overflowing", this.contentElement.prop("scrollHeight") > SL.view.getSlideSize().height)
    },
    isEditingText: function() {
        return this.domElement.hasClass("is-editing")

    },
    toggleAttributeWhen: function(e, t) {
        t ? this.contentElement.attr(e, "") : this.contentElement.removeAttr(e)
    },
    onDoubleClick: function(e) {
        this._super(e), SL.view.isEditing() && this.enableEditing()
    },
    onKeyDown: function(e) {
        this._super(e), 13 === e.keyCode ? this.isEditingText() || SL.util.isTypingEvent(e) ? e.metaKey && this.disableEditing() : (e.preventDefault(), this.enableEditing()) : 27 === e.keyCode && (e.preventDefault(), this.disableEditing())
    },
    onEditingKeyUp: function(e) {
        //console.log(e);
        if($(e.target.innerHTML).is(".table-survey, .table-survey-radio")){
            $(e.target.innerHTML).find("tr").each(function(index, elm){
                if($(elm).find(".repCheckbox input, .repRadio input").length > 0 && $(elm).find(".repCheckbox input, .repRadio input").val() != $(elm).find(".QuestionText").text()){
                    var elmID = "#" + $(elm).find(".repCheckbox input, .repRadio input").attr("id");
                    $(elmID).val($(elm).find(".QuestionText").text());
                    //console.log($(elmID));
                    //console.log("Val td: " + $(elm).find(".QuestionText").text());
                    //console.log("Val input: " + $(elmID).val());
                }
            });
        }
        this.syncPairs(), this.syncOverflow(), SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingKeyDown: function() {
        SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingInput: function() {
        setTimeout(function() {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, 1)
    },
    onEditingFocusOut: function() {
        /*SL.editor.controllers.Capabilities.isTouchEditor() && setTimeout(function() {
            this.isEditingText() && 0 === $(document.activeElement).closest(".cke").length && this.disableEditing()
        }.bind(this), 1)*/
    },
    onPropertyChanged: function(e) {
        -1 !== e.indexOf("style.letter-spacing") && this.toggleAttributeWhen("data-has-letter-spacing", this.isset("style.letter-spacing")), -1 !== e.indexOf("style.line-height") && this.toggleAttributeWhen("data-has-line-height", this.isset("style.line-height")), this.syncPairs(), this.syncOverflow()
    }
};

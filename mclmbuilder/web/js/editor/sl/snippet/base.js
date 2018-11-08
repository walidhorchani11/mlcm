'use strict';

export const snippetBase = {
    init: function(e) {
        this._super("snippet", $.extend({}, e)), this.plug(SL.editor.blocks.plugin.HTML)
    },
    bind: function() {
        this._super(), this.onEditingKeyUp = this.onEditingKeyUp.bind(this), this.onEditingKeyDown = this.onEditingKeyDown.bind(this), this.onEditingInput = this.onEditingInput.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    blur: function() {
        this._super(), this.disableEditing()
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: SL.editor.blocks.Snippet.DEFAULT_WIDTH,
            height: SL.editor.blocks.Snippet.DEFAULT_HEIGHT
        })
    },
    resizeToFitContent: function() {
        this.domElement.css("width", "auto");
        var e = Math.min(this.domElement.outerWidth(), SL.view.getSlideSize().width);
        (0 === e || isNaN(e)) && (e = SL.editor.blocks.Snippet.DEFAULT_WIDTH), this.domElement.css("width", e), this.domElement.css("height", "auto");
        var t = Math.min(this.domElement.outerHeight(), SL.view.getSlideSize().height);
        (0 === t || isNaN(t)) && (t = SL.editor.blocks.Snippet.DEFAULT_HEIGHT), this.domElement.css("height", t)
    },
    getToolbarOptions: function() {
        return [SL.editor.components.toolbars.options.TextAlign, SL.editor.components.toolbars.options.TextSize, SL.editor.components.toolbars.options.LineHeight, SL.editor.components.toolbars.options.LetterSpacing, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.TextColor, SL.editor.components.toolbars.options.BackgroundColor, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Padding, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
    },
    enableEditing: function() {
        this.isEditingText() || (this.contentElement.attr("contenteditable", ""), this.domElement.addClass("is-editing"), this.contentElement.on("keyup", this.onEditingKeyUp), this.contentElement.on("keydown", this.onEditingKeyDown), this.contentElement.on("input", this.onEditingInput), this.editor = CKEDITOR.inline(this.contentElement.get(0), {
            allowedContent: !0
        }), this.editor.on("instanceReady", function() {
            this.editor.focus();
            var e = this.editor.createRange();
            e.moveToElementEditEnd(this.editor.editable()), e.select()
        }.bind(this)))
    },
    disableEditing: function() {
        this.contentElement.removeAttr("contenteditable").blur(), this.domElement.removeClass("is-editing"), this.contentElement.off("keyup", this.onEditingKeyUp), this.contentElement.off("keydown", this.onEditingKeyDown), this.contentElement.off("input", this.onEditingInput), this.editor && (this.editor.destroy(), this.editor = null), SL.editor.controllers.Blocks.afterBlockTextSaved(this.contentElement)
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
    onEditingKeyUp: function() {
        SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingKeyDown: function() {
        SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingInput: function() {
        setTimeout(function() {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, 1)
    },
    onPropertyChanged: function(e) {
        -1 !== e.indexOf("style.letter-spacing") && this.toggleAttributeWhen("data-has-letter-spacing", this.isset("style.letter-spacing")), -1 !== e.indexOf("style.line-height") && this.toggleAttributeWhen("data-has-line-height", this.isset("style.line-height"))
    }
};

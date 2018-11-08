'use strict';

export const scrollabletext = {
    init: function(e) {
        this._super("scrollabletext", $.extend({
            verticalResizing: !0,
            placeholderTag: "p",
            placeholderText: "Scrollable Text"
        }, e)), this.plug(SL.editor.blocks.plugin.HTML), this.readDefaultContent(), this.injectDefaultContent()
    },
    bind: function() {
        this._super(), this.onEditingKeyUp = this.onEditingKeyUp.bind(this), this.onEditingKeyDown = this.onEditingKeyDown.bind(this), this.onEditingInput = this.onEditingInput.bind(this), this.onEditingFocusOut = this.onEditingFocusOut.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    blur: function() {
        this._super(), this.isEditingText() && this.disableEditing()
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: SL.editor.blocks.ScrollableText.DEFAULT_WIDTH,
            height: SL.editor.blocks.ScrollableText.DEFAULT_HEIGHT
        });

        this.domElement.find('.sl-block-content').addClass('intialP');
        this.domElement.find('.sl-block-content').find('p:first-child').html("<span style='font-size:25px;color:rgb(0,0,0);font-weight:400;font-style:normal;'>Text</span>");
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
        let blockHeight = this.domElement.height();

        this._super.apply(this, arguments),
        this.syncPairs(),
        this.domElement.find('.sl-block-content').css({
            "overflow"    : "auto",
            "max-height"  : blockHeight,
            "height"      : blockHeight
        });
    },
    getToolbarOptions: function() {
        let toolbarsLinktoElements = [
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.Reference
        ];

        if (SL.editor.controllers.Popin.isPopin()) {
            toolbarsLinktoElements = []
        }

        return [
            SL.editor.components.toolbars.options.TextAlign,
            SL.editor.components.toolbars.options.TextSize,
            SL.editor.components.toolbars.options.LineHeight,
            SL.editor.components.toolbars.options.LetterSpacing,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.TextColor,
            SL.editor.components.toolbars.options.BackgroundColor,
            SL.editor.components.toolbars.options.Opacity,
            SL.editor.components.toolbars.options.Padding,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.groups.BorderCSS,
            SL.editor.components.toolbars.groups.Animation,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.BlockDepth,
            SL.editor.components.toolbars.options.BlockActions
        ].concat(toolbarsLinktoElements).concat(this._super())
    },
    focus: function() {
        this._super(), SL.editor.controllers.Blocks.discoverBlockPairs()
    },
    enableEditing: function() {
        if (!this.isEditingText()) {
            this.contentElement.attr("contenteditable", ""), this.domElement.addClass("is-editing"), this.contentElement.on("keyup", this.onEditingKeyUp), this.contentElement.on("keydown", this.onEditingKeyDown), this.contentElement.on("input", this.onEditingInput), this.contentElement.on("focusout", this.onEditingFocusOut), this.clearDefaultContent();
            var e = {};
            // SL.editor.controllers.Capabilities.isTouchEditor() && (this.contentElement.focus(), e.toolbar = [
            //     ["Format"],
            //     ["NumberedList", "BulletedList", "-", "Blockquote"]
            // ],
            // window.scrollTo(0, Math.max(this.contentElement.offset().top - 60, 0))),
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
            this.domElement.find('.sl-block-content').css({
                "overflow-x" : "hidden",
                "height"     : this.domElement.height(),
                "max-height" : '100%'
            });
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
        this.syncPairs(),
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
    onEditingFocusOut: function() {
        // SL.editor.controllers.Capabilities.isTouchEditor() && setTimeout(function() {
        //     this.isEditingText() && 0 === $(document.activeElement).closest(".cke").length && this.disableEditing()
        // }.bind(this), 1)
    },
    onPropertyChanged: function(e) {
        -1 !== e.indexOf("style.letter-spacing") &&
        this.toggleAttributeWhen("data-has-letter-spacing",this.isset("style.letter-spacing")),
        -1 !== e.indexOf("style.line-height") &&
        this.toggleAttributeWhen("data-has-line-height", this.isset("style.line-height")),
        this.syncPairs()
    }
};

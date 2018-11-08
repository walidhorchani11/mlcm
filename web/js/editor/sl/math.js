'use strict';

export const math = {
    init: function(e) {
        this._super("math", $.extend(e, {
            horizontalResizing: !1,
            verticalResizing: !1
        })), this.editingRequested = new signals.Signal
    },
    setup: function() {
        this._super(), this.properties.math = {
            value: {
                setter: this.setValue.bind(this),
                getter: this.getValue.bind(this)
            }
        }
    },
    paint: function() {
        if (this.domElement.find(".sl-block-placeholder, .sl-block-content-preview, .sl-block-overlay-warning").remove(), this.isEmpty()) this.domElement.addClass("is-empty"), this.showPlaceholder(), this.getMathOutputElement().empty();
        else try {
            this.domElement.removeClass("is-empty"), katex.render(this.getMathInputElement().text(), this.getMathOutputElement().get(0))
        } catch (e) {
            this.domElement.addClass("is-empty"), this.domElement.append(['<div class="editing-ui sl-block-overlay sl-block-overlay-warning vcenter">', '<div class="vcenter-target">', '<span class="icon i-info" data-tooltip="' + e.message + '" data-tooltip-maxwidth="500"></span>', "An error occurred while parsing your equation.", "</div>", "</div>"].join(""))
        }
        this.syncZ()
    },
    setDefaults: function() {
        this._super()
    },
    setValue: function(e) {
        this.getMathInputElement().html(e), this.paint()
    },
    getValue: function() {
        return this.getMathInputElement().text()
    },
    getMathInputElement: function() {
        var e = this.contentElement.find(".math-input");
        return 0 === e.length && (e = $('<div class="math-input"></div>').appendTo(this.contentElement)), e
    },
    getMathOutputElement: function() {
        this.contentElement.find(".math-output:gt(0)").remove();
        var e = this.contentElement.find(".math-output");
        return 0 === e.length && (e = $('<div class="math-output"></div>').appendTo(this.contentElement)), e
    },
    getToolbarOptions: function() {
        return [SL.editor.components.toolbars.options.MathInput, SL.editor.components.toolbars.options.MathSize, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.MathColor, SL.editor.components.toolbars.options.BackgroundColor, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Padding, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
    },
    isEmpty: function() {
        return !this.isset("math.value")
    },
    onDoubleClick: function(e) {
        this._super(e), this.editingRequested.dispatch()
    },
    onKeyDown: function(e) {
        this._super(e), 13 !== e.keyCode || SL.util.isTypingEvent(e) || (this.editingRequested.dispatch(), e.preventDefault())
    }
};

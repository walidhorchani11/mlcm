'use strict';

export const toolbarsoptionsiframesrc = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "iframe-src",
            label: "Iframe Source",
            property: "iframe.src",
            placeholder: "URL or <iframe>...",
            multiline: !0,
            maxlength: 2e3
        }, t))
    },
    bind: function() {
        this._super(), this.block && (this.onEditingRequested = this.onEditingRequested.bind(this), this.block.editingRequested.add(this.onEditingRequested))
    },
    destroy: function() {
        this.block && this.block.editingRequested.remove(this.onEditingRequested), this._super()
    },
    writeToBlock: function() {
        var e = this.getValue().trim();
        SL.util.string.URL_REGEX.test(e) ? this.block.set(this.config.property, e) : this.block.set(this.config.property, "")
    },
    onInputChange: function() {
        var e = this.getValue();
        if (/<iframe/gi.test(e)) try {
            this.setValue($(e).attr("src"))
        } catch (t) {}
        this.writeToBlock()
    },
    onEditingRequested: function() {
        this.focus()
    }
};

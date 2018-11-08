'use strict';

export const toolbarsoptionscode = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "code",
            label: "Code",
            property: "code.value",
            placeholder: "Paste code to syntax highlight...",
            multiline: !0,
            expandable: !0,
            maxlength: 1e7
        }, t))
    },
    bind: function() {
        this._super(), this.block && (this.onEditingRequested = this.onEditingRequested.bind(this), this.block.editingRequested.add(this.onEditingRequested))
    },
    destroy: function() {
        this.block && this.block.editingRequested.remove(this.onEditingRequested), this._super()
    },
    onEditingRequested: function() {
        this.expand()
    }
};

'use strict';

export const toolbarsoptionsmathinput = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "math",
            label: 'Math <span style="text-transform: none;">(TeX)</span>',
            property: "math.value",
            placeholder: "Paste or type TeX...",
            helpTooltip: "This block is used to display math formulae. Math is written using TeX. Click for more info.",
            helpTooltipLink: "",
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
}

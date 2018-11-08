'use strict';

export const toolbarsoptionstablebordercolor = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "table-border-color",
            label: TWIG.toolbar.options.borderColor,
            property: "attribute.data-table-border-color",
            alpha: !0
        }, t))
    },
    getTriggerColor: function() {
        return this.block.getTableBorderColor()
    }
};

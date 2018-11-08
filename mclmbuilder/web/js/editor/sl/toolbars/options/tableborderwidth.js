'use strict';

export const toolbarsoptionstableborderwidth = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "table-border-width",
            label: TWIG.toolbar.options.borderWidth,
            property: "attribute.data-table-border-width"
        }, t))
    }
};

'use strict';

export const toolbarsoptionstablepadding = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "table-padding",
            label: TWIG.toolbar.options.cellPadding,
            property: "attribute.data-table-padding"
        }, t))
    }
};

'use strict';

export const toolbarsoptionstablehasheader ={
    init: function(e, t) {
        this._super(e, $.extend({
            type: "table-has-header",
            label: TWIG.toolbar.options.header,
            property: "attribute.data-table-has-header",
            tooltip: "The first table row is a header."
        }, t))
    }
};

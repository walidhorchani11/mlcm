'use strict';

export const toolbarsoptionslinewidth = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "line-width",
            label: "Thickness",
            property: "attribute.data-line-width"
        }, t))
    }
};

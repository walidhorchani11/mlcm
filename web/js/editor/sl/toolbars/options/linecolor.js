'use strict';

export const toolbarsoptionslinecolor = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "line-color",
            label: "Color",
            property: "attribute.data-line-color"
        }, t))
    }
};

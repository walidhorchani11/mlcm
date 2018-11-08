'use strict';

export const toolbarsoptionsmathcolor = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "math-color",
            label: "Color",
            property: "style.color"
        }, t))
    }
};

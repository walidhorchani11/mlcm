'use strict';

export const toolbarsoptionsborderstyle = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "border-style",
            label: "Style",
            property: "style.border-style",
            items: e.getPropertySettings("style.border-style").options
        }, t))
    }
};

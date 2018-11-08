'use strict';

export const toolbarsoptionsborderwidth = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "border-width",
            label: "Width",
            property: "style.border-width"
        }, t))
    }
};

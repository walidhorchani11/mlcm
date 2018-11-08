'use strict';

export const toolbarsoptionsbordercolor = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "border-color",
            label: "Color",
            property: "style.border-color"
        }, t))
    }
};

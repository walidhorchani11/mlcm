'use strict';

export const toolbarsoptionsborderradius = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "border-radius",
            label: "Radius",
            property: "style.border-radius"
        }, t))
    }
};

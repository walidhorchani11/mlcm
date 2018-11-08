'use strict';

export const toolbarsoptionsshapestretch = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "shape-stretch",
            label: "Stretch to Fill",
            property: "attribute.data-shape-stretch"
        }, t))
    }
};

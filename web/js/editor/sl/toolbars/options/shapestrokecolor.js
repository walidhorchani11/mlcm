'use strict';

export const toolbarsoptionsshapestrokecolor = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "shape-stroke-color",
            label: "Color",
            property: "attribute.data-shape-stroke-color"
        }, t))
    }
};

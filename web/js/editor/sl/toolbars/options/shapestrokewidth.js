'use strict';

export const toolbarsoptionsshapestrokewidth = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "shape-stroke-width",
            label: "Width",
            property: "attribute.data-shape-stroke-width"
        }, t))
    }
};

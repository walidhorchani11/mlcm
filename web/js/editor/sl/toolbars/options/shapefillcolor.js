'use strict';

export const toolbarsoptionsshapefillcolor = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "shape-fill-color",
            label: TWIG.toolbar.options.shapeColor,
            property: "attribute.data-shape-fill-color",
            alpha: !0
        }, t))
    }
};

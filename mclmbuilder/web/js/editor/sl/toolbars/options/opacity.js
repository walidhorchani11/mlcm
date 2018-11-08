'use strict';

export const toolbarsoptionsopacity = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "Opacity",
            label: TWIG.toolbar.options.opacity,
            property: "style.ValOpacity"
        }, t))
    }
};

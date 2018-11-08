'use strict';

export const toolbarsoptionsdivider = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "divider"
        }, t)), this.domElement.addClass("toolbar-divider")
    }
};

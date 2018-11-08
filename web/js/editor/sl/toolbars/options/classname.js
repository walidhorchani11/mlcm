'use strict';

export const toolbarsoptionsclassname = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "class-name",
            label: "Class name",
            property: "attribute.class",
            helpTooltip: "Adds a class name to the underlying HTML element. Useful when trying to target elements with custom CSS."
        }, t))
    }
};

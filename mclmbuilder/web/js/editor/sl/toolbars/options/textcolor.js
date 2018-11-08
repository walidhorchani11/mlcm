'use strict';

export const toolbarsoptionstextcolor = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "text-color",
            label: "Text Color",
            property: "style.color"
        }, t))
    }
};

'use strict';

export const toolbarsoptionstextalign = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "text-align",
            label: "Text Alignment",
            property: "style.text-align",
            items: e.getPropertySettings("style.text-align").options
        }, t))
    }
};

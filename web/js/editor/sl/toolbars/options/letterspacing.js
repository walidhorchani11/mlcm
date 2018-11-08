'use strict';

export const toolbarsoptionsletterspacing = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "letter-spacing",
            label: "&nbsp;",
            property: "style.letter-spacing",
            progressbar: !1
        }, t))
    }
};

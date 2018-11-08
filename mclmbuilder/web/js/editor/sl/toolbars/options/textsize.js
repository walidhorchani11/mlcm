'use strict';

export const toolbarsoptionstextsize = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "text-size",
            label: "&nbsp;",
            property: "style.font-size",
            progressbar: !1
        }, t))
    }
};

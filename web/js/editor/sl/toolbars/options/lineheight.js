'use strict';

export const toolbarsoptionslineheight = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "line-height",
            label: "&nbsp;",
            property: "style.line-height",
            progressbar: !1
        }, t))
    }
};

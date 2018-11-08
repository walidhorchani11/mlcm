'use strict';

export const toolbarsoptionscodelanguage = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "code-language",
            label: "Language",
            property: "code.language",
            items: e.getPropertySettings("code.language").options,
            panelMaxHeight: 400
        }, t))
    }
};

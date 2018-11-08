'use strict';

export const toolbarsoptionscodetheme = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "code-theme",
            label: "Theme",
            property: "code.theme",
            items: e.getPropertySettings("code.theme").options,
            panelType: "code-theme",
            panelWidth: 180,
            panelMaxHeight: 500
        }, t))
    }
};

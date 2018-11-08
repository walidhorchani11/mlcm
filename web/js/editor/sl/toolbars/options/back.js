'use strict';

export const toolbarsoptionsback = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "back",
            icon: "arrow-up",
            tooltip: "Go back"
        }, t))
    },
    onClicked: function(e) {
        this._super(e), SL.view.toolbars.pop()
    }
};

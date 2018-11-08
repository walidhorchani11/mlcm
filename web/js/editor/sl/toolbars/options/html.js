'use strict';

export const toolbarsoptionshtml = {
    init: function(e, t) {
        this._super(e, $.extend({
            title: "Edit HTML",
            property: "html.value"
        }, t))
    },
    onClicked: function(e) {
        this._super(e), this.block.editHTML()
    }
};

'use strict';

export const toolbarsoptionslineendtype = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "line-end-type",
            panelType: "line-end-type",
            label: "End",
            property: "attribute.data-line-end-type",
            items: e.getPropertySettings("attribute.data-line-end-type").options
        }, t))
    }
};

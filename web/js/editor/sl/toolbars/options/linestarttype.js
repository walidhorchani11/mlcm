'use strict';

export const toolbarsoptionslinestarttype = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "line-start-type",
            panelType: "line-start-type",
            label: "Start",
            property: "attribute.data-line-start-type",
            items: e.getPropertySettings("attribute.data-line-start-type").options
        }, t))
    }
};

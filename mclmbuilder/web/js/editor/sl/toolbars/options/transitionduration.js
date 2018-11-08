'use strict';

export const toolbarsoptionstransitionduration = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "transition-duration",
            label: TWIG.toolbar.options.duration,
            property: "style.transition-duration"
        }, t))
    }
};

'use strict';

export const toolbarsoptionstransitiondelay = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "transition-delay",
            label: TWIG.toolbar.options.delay,
            property: "style.transition-delay"
        }, t))
    }
};

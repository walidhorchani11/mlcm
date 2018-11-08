'use strict';

export const toolbarsoptionsblockalignhorizontal = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "block-align-horizontal",
            label: "Alignment",
            items: [{
                value: "left",
                icon: "alignleftedges"
            }, {
                value: "horizontal-center",
                icon: "alignhorizontalcenters"
            }, {
                value: "right",
                icon: "alignrightedges"
            }]
        }, t))
    },
    trigger: function(e) {
        this._super(e), SL.editor.controllers.Blocks.align(SL.editor.controllers.Blocks.getFocusedBlocks(), e)
    }
};

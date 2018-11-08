'use strict';

export const toolbarsoptionsblockalignvertical = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "block-align-vertical",
            items: [{
                value: "top",
                icon: "aligntopedges"
            }, {
                value: "vertical-center",
                icon: "alignverticalcenters"
            }, {
                value: "bottom",
                icon: "alignbottomedges"
            }]
        }, t))
    },
    trigger: function(e) {
        this._super(e), SL.editor.controllers.Blocks.align(SL.editor.controllers.Blocks.getFocusedBlocks(), e)
    }
};

'use strict';

export const toolbarsoptionsblockactions = {
    init: function(e, t) {
        var i = [{
            value: "duplicate",
            icon: "new-window",
            tooltip: TWIG.toolbar.options.duplicate
        }, {
            value: "delete",
            icon: "trash-fill",
            tooltip: TWIG.toolbar.options.remove
        }];
        /* Actions : disabled options expand / edit html */
        // e && e.options.horizontalResizing && e.options.verticalResizing && i.unshift({
        //     value: "expand",
        //     icon: "fullscreen",
        //     tooltip: "Maximize"
        // }),
        // e && e.hasPlugin(SL.editor.blocks.plugin.HTML) && i.unshift({
        //     value: "html",
        //     icon: "file-xml",
        //     tooltip: "Edit HTML"
        // }),
        this._super(e, $.extend({
            type: "block-actions",
            label: "Actions",
            items: i
        }, t))
    },
    trigger: function(e) {
        var t = SL.editor.controllers.Blocks.getFocusedBlocks();
        "html" === e ? (t[0].editHTML(), SL.analytics.trackEditor("Toolbar: Edit HTML")) : "expand" === e ? (t.forEach(function(e) {
            e.resize({
                width: SL.config.SLIDE_WIDTH,
                height: SL.config.SLIDE_HEIGHT
            }), e.moveToCenter()
        }),
        SL.analytics.trackEditor("Toolbar: Expand block")) : "duplicate" === e ? (SL.editor.controllers.Blocks.copy(), SL.editor.controllers.Blocks.paste(), SL.analytics.trackEditor("Toolbar: Duplicate block")) : "delete" === e && (t.forEach(function(e) {
            e.destroy()
        }),
        SL.analytics.trackEditor("Toolbar: Delete block"))
    }
};

'use strict';

export const toolbarsedit = {
    init: function(e) {
        this.block = e,
        this.options = [],
        this._super()
    },
    render: function() {
        var that        = this,
            link_screen = '.toolbars select#screen',
            link_popin  = '.toolbars select#popinlink';

        function show_sidebar_actions(actions) {
            that._super();
            that.domElement.attr("data-type", "edit");
            that.domElement.addClass("second-bar spec-toolbar");

            let block = SL.editor.controllers.Blocks.getFocusedBlocks();
            /***FIX RFA BUG 22-12-2016***/

            setTimeout(function(){
                $(".toolbars.visible").removeClass("open-sideBar");
            }, 2);

            //if(block[0].type !== 'survey'){
                that.block.getToolbarOptions().forEach(that.renderOption.bind(that));
            //}
            block[0].type === "survey" ? setTimeout(function(){SL.editor.controllers.Survey.setup()}, 10) : null

            SL.util.user.canUseCustomCSS()
            // && SL.view.isDeveloperMode()
            && that.renderOption(SL.editor.components.toolbars.options.ClassName);
            // if callback exist execute it
            actions && actions();
        }
        show_sidebar_actions();
    },
    renderOption: function(e) {
        var t = new e(this.block);
        t.appendTo(this.listElement), t.changed && t.changed.add(this.sync.bind(this)), this.options.push(t)
    },
    appendTo: function() {
        let Typeblock = SL.editor.controllers.Blocks.getFocusedBlocks();
        //if(Typeblock[0].type !== 'survey'){
            this._super.apply(this, arguments), this.sync()
        //}
    },
    destroy: function() {
        for (; this.options.length;) this.options.pop().destroy();
        this._super()
    }
};
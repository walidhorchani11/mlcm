'use strict';

export const toolbarsoptionsSurveyAddButton = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "survey"
        }, t))
    },
    render: function() {
        let block = SL.editor.controllers.Blocks.getFocusedBlocks();

        this._super(),
        this.domElement.append(`
        <div class="addButton add-btn">
            <i class="fa fa-plus"></i> <span class="submit-append-btn">Add this button</span>
        </div>`)
    }
};
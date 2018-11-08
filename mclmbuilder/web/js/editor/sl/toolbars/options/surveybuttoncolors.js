'use strict';

export const toolbarsoptionsSurveyButtonColors = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "survey"
        }, t))
    },
    render: function() {
        let block = SL.editor.controllers.Blocks.getFocusedBlocks();

        this._super(),
        this.domElement.append(`
        <div class="edit-all-font">
            <label>Font color</label>
            <input type="text" name="bg-font-submit-color" id="bg-font-submit-color" /><a class="pull-right remove-bg-submit-color"><i class="fa fa-times"></i></a>
        </div>
        <div class="edit-all-font">
            <label>Background color</label>
            <input type="text" name="bg-btn-submit-color" id="bg-btn-submit-color" /><a class="pull-right remove-btn-submit-color"><i class="fa fa-times"></i></a>
        </div>
        <div class="edit-all-font">
            <label>Activated color</label>
            <input type="text" name="bg-font-Activated-submit-color" id="bg-font-Activated-submit-color" /><a class="pull-right remove-Activebg-submit-color"><i class="fa fa-times"></i></a>
        </div>`)
    }
};
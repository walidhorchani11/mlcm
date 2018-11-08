'use strict';

export const toolbarsoptionsSurveyPreviewButton = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "survey"
        }, t))
    },
    render: function() {
        let block = SL.editor.controllers.Blocks.getFocusedBlocks();

        this._super(),
        this.domElement.append(`
        <h4>Button preview</h4>
        <div class="preview-submit-btn">
            <button id="submitButton" type="button" class="submit-btn-preview">Send</button>
        </div>`)
    }
};
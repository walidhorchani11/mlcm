'use strict';

export const toolbarsoptionsSurveyTextButton = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "survey"
        }, t))
    },
    render: function() {
        let block = SL.editor.controllers.Blocks.getFocusedBlocks();

        this._super(),
        this.domElement.append(`
        <h4>Customize submit button:</h4>
        <div>
            <label>Text button</label><br />
            <input type="text" name="submit_color_name" id="submit_color_name" Placeholder="Button name..."/>
        </div>`)
    }
};
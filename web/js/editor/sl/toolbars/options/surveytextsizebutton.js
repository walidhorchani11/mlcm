'use strict';

export const toolbarsoptionsSurveyTextSizeButton = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "survey"
        }, t))
    },
    render: function() {
        let block = SL.editor.controllers.Blocks.getFocusedBlocks();

        this._super(),
        this.domElement.append(`
        <div class="label-blc">
            <label class="text-size-bg">&nbsp;</label><br />
            <select class="form-control" name="btn_text_size" id="btn_text_size">
                <option>8</option>
                <option>10</option>
                <option>12</option>
                <option>14</option>
                <option>16</option>
                <option>18</option>
                <option>22</option>
                <option>24</option>
                <option>26</option>
                <option>28</option>
                <option>36</option>
                <option>46</option>
                <option>72</option>
            </select>
        </div>`)
    }
};
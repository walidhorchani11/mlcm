'use strict';

export const toolbarsoptionsSurveyTypes = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "survey"
        }, t))
    },
    render: function() {
        let block = SL.editor.controllers.Blocks.getFocusedBlocks();

        this._super(),
        this.domElement.append(`
        <h4>Select a survey type:</h4>
        <select class="form-control m-b" id="select_survey">
            <option>Select a survey</option>
            <option value="checkbox">Check box</option>
            <option value="radio_type">Radio button</option>
            <option value="list_type">Dropdown list</option>
            <option value="input_text">Input field</option>
        </select>
        <div class="button-survey btn-chbox-container"></div>
        <div class="button-survey btn-radio-container"></div>
        <div class="button-survey btn-textField-container"></div>
        <div class="add-select-question-wrapper">
            <button class="btn btn-primary" id="add_select_question">Add list</button>
        </div>
        <div class="wrapper-select-survey">

            <div class="wrapper-answer-survey">
                <label class="label-survey-response"></label>
                <input type="text" class="select-survey-response" placeholder="Your answer here..." />
                <a class="pull-right remove-answer"><i class="fa fa-times"></i></a>
            </div>

            <div class="button add-answer-list">
                <span class="add-answer">Add a new answer</span>
            </div>
        </div>`)
    }
};
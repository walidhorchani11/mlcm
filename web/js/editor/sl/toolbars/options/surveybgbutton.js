'use strict';

export const toolbarsoptionsSurveyBgButton = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "survey"
        }, t))
    },
    render: function() {
        let block = SL.editor.controllers.Blocks.getFocusedBlocks();

        this._super(),
        this.domElement.append(`
        <label class="hidden">Background image</label>
        <div class="wrapper-button-submit-upload">
            <div class="media-library-uploader" id="bg_button_submit_upload">
                <div class="media-library-uploader-button">
                    Background button
                    <span class="upload-icon"><img src="/img/images/icons/download-b.png" alt="Upload Background Button"  title="Upload Background Button" class="img-circle" /></span>
                    <span class="icon i-cloud-upload2"></span>
                </div>
                <div class="media-library-uploader-list"></div>
            </div>
        </div>`)
    }
};
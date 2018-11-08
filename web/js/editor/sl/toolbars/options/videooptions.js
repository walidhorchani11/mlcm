'use strict';

export const toolbarsoptionsVideoOption = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "video"
        }, t))
    },
    render: function() {
        this._super(),
        this.domElement.append(`
            <div class="toolbar-option" id="video-options">
            <h4 class="toolbar-option-label">Video Actions</h4>
            <div class="video-options">
            <div class="checkbox"><label><input type="checkbox" id="default_poster">Default Poster</label></div>
            <div class="checkbox"><label><input type="checkbox" id="default_autoplay">Video Autoplay</label></div>
            </div>
            </div><div><button id="videoposter" class="btn btn-primary btn-block" type="button"><i class="fa fa-video-camera"></i> Upload Video Poster</button>
            </div><div id="previewposter"><img /></div>`);
        setTimeout(function() {
            let block = SL.editor.controllers.Blocks.getFocusedBlocks();

            $('#video-options').closest('.toolbar-option').unwrap(),
            SL.editor.controllers.Blocks.checkVideoOptions(block[0]);
        }, 50);
    }
};

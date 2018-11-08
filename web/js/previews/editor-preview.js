'use strict';

var templateContent     = require("./views/preview-editor.ejs"),
    templatePopins      = require("./views/preview-editor-popins.ejs"),
    templateReferences  = require("./views/partials/references.ejs"),
    commonsFunctions    = require('./common');

const editorPreviewTemplate = {
    init: function() {
        this.generatePreviewtemplate(),
        this.generatePreviewReferencesTemplate(),
        this.generatePreviewPopinsTemplate()
    },
    generatePreviewtemplate: function() {
        $('.slides').prepend(templateContent({ slides : data.slides }));
    },
    generatePreviewPopinsTemplate: function() {
        $('.slidespop').prepend(templatePopins({ popins : data.popins }));
    },
    generatePreviewReferencesTemplate: function() {
        $('#tempReferences').prepend(templateReferences({ refs : data.linkedRef }));
    },
    editorInit: function() {
        Reveal.initialize({
            controls                : true,
            progress                : true,
            history                 : true,
            showNotes               : SLConfig.deck.share_notes,
            slideNumber             : SLConfig.deck.slide_number,
            autoSlide               : SLConfig.deck.auto_slide_interval || 0,
            autoSlideStoppable      : true,
            rollingLinks            : false,
            center                  : SLConfig.deck.center || false,
            loop                    : SLConfig.deck.should_loop || false,
            rtl                     : SLConfig.deck.rtl || false,
            transition              : SLConfig.deck.transition,
            backgroundTransition    : SLConfig.deck.background_transition,
            width                   : 1024,
            height                  : 768,
            minScale                : 1,
            maxScale                : 1
        }),
        Reveal.sync(),
        Reveal.slide(0, undefined);
    }
}

$(function() {
    editorPreviewTemplate.init(),
    editorPreviewTemplate.editorInit(),
    commonsFunctions.initEditorPreview()
});
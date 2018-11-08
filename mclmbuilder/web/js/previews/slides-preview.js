'use strict';

var templateContent     = require("./views/slide.ejs"),
    commonsFunctions    = require('./common');

const slidePreviewTemplate = {
    generatePreviewtemplate: function() {
        $('.slides').prepend(templateContent({ slides : data.slides }));
    },
    editorInit: function() {
        Reveal.initialize({
            controls    : false,
            progress    : false,
            width       : 1024,
            height      : 768,
            margin      : 0,
            minScale    : 0,
            maxScale    : 1,
            history     : true,
            mouseWheel  : true
        })
    }
}

$(function() {
    slidePreviewTemplate.generatePreviewtemplate(),
    slidePreviewTemplate.editorInit(),
    commonsFunctions.initSlidesPreview(),
    Reveal.addEventListener('ready', function () {
        var index = Reveal.getIndices();
        Reveal.slide(index.h, index.v);
    });
    $('.reveal > .slides').append($('.reveal > .backgrounds'));
});
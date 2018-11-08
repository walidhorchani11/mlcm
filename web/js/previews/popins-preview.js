'use strict';

var templateContent     = require("./views/slide-popin.ejs"),
    _                   = require('lodash'),
    commonsFunctions    = require('./common');

let dataPopin = _.find(popinContent, function(element) { return element.attributes['data-id'] === String(popinId) });

const popinPreviewTemplate = {
    generatePopinPreviewtemplate: function() {
        $('.slides').prepend(templateContent({ slide : dataPopin }));
    },
    editorInit: function() {
        Reveal.initialize({
            controls    : false,
            progress    : false,
            width       : popinWidth,
            height      : popinHeight,
            margin      : 0,
            minScale    : 1,
            maxScale    : 1,
            history     : true,
            mouseWheel  : true
        })
    }
}

$(function() {
    popinPreviewTemplate.generatePopinPreviewtemplate(),
    popinPreviewTemplate.editorInit(),
    commonsFunctions.initPopinsPreview(),
    Reveal.addEventListener('ready', function () {
        var index = Reveal.getIndices();
        Reveal.slide(index.h, index.v);
    });
});
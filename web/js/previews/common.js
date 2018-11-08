'use strict';

module.exports = {
    initSlidesPreview: function() {
        this.disableanimation(),
        this.initvideos(),
        this.wrapBlockStyle(),
        this.syncBackgroundsData()
    },
    initPopinsPreview: function() {
        this.disableanimation(),
        this.initvideos()
    },
    initEditorPreview: function() {
        Reveal.addEventListener('ready', function(event) {
            this.initVideosEditor(event)
        }.bind(this)),
        Reveal.addEventListener('slidechanged', function (event) {
            this.initVideosEditor(event)
        }.bind(this)),
        this.wrapBlockStyle(),
        this.syncBackgroundsData()
    },
    disableanimation: function() {
        let $blocks = $('section.present .sl-block .sl-block-content');

        $blocks.each(function(index, blockvalue) {
            let $obj        = $(blockvalue);

            if ($obj.attr('data-animation-type') != null) {
                let annimation = 1;
            }
            $obj.css('opacity', '1');
            $obj.css('transition-duration', '0');
            $obj.css('transition-delay', '0');
        });
    },
    initvideos: function() {
        let $videos = $('.slides').find('.sl-block[data-block-type="video"]');

        if ($videos.length > 0) {
            $videos.find('.video-placeholder').remove();
            $videos.each(function(index, value) {
                let $elm        = $(value),
                    poster      = $elm.attr('data-video-poster'),
                    autoplay    = $elm.attr('data-video-autoplay'),
                    video       = $elm.find('video'),
                    videoheight = $elm.height(),
                    videowidth  = $elm.width();

                $elm.find('video').remove(),
                $elm.find('.sl-block-content').append('<img src="'+ poster +'" height="' + videoheight + '" width="' + videowidth + '" />'),
                $elm.append('<div class="video-placeholder"></div>')
            });
        }
    },
    initVideosEditor: function(event) {
        let $videos = $(event.currentSlide).find('.sl-block[data-block-type="video"]');

        if ($videos.length > 0) {
            $videos.find('.video-placeholder').remove();
            $videos.each(function(index, value) {
                let $elm        = $(value),
                    poster      = $elm.attr('data-video-poster'),
                    autoplay    = $elm.attr('data-video-autoplay'),
                    video       = $elm.find('video');

                video[0].currentTime = 0;
                video[0].load();
                $elm.append('<div class="video-placeholder"></div>');
                if (typeof poster !== 'undefined' && poster !== '') {
                    video.attr('poster', poster);
                    video.removeAttr('controls');
                }
                if (typeof autoplay !== 'undefined' && autoplay === 'true') {
                    $elm.find('.video-placeholder').remove();
                    video[0].play();
                    video.attr('controls', 'controls');
                }
            });
        }
    },
    wrapBlockStyle: function() {
        $(".sl-block").each(function() {
            let $SLblock        = $(this),
                $slBlockContent = $SLblock.find('.sl-block-content');

            if ($slBlockContent.closest('.block-style').length == 0) {
                var z_index = $SLblock.find('.sl-block-content')[0].style.zIndex;

                $slBlockContent.wrapAll("<div class='block-style'></div>");
            }
            $SLblock.find(".block-style").css("z-index", z_index);
        });
    },
    syncBackgroundsData: function() {
        $('.slides section:not(.stack)').each(function () {
            var slide     = $(this),
                screenImg = slide.attr("data-bg-screen-img"),
                screenColor = slide.attr("data-bg-screen-color");
            if (screenImg != undefined){
                slide.attr('data-background-image', screenImg);
                Reveal.sync();
            }
            if (screenColor != undefined){
                slide.attr('data-background-color', screenColor);
                Reveal.sync();
            }
        });
    }
}
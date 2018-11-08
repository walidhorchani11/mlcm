'use strict';

export const toolbarsoptionsVideo = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "video",
            label: "Video"
        }, t))
        this.syncUI(),
        this.optionsListener()
    },
    render: function() {
        this._super(),
        this.domElement.addClass("toolbar-image"),
        this.innerElement       = $('<div class="toolbar-image-inner">').appendTo(this.domElement),
        this.videoElement       = $('<video width="100%" height="100%"><source src="">Your browser does not support the video tag.</video>').appendTo(this.innerElement),
        this.placeholderElement = $('<div class="toolbar-video-placeholder">').appendTo(this.innerElement),
        this.labelElement       = $('<div class="toolbar-image-label">Select</div>').appendTo(this.innerElement),
        this.urlElement         = $('<div class="toolbar-image-url icon i-link"></div>').appendTo(this.innerElement),
        this.spinnerElement     = $(['<div class="toolbar-image-progress">', '<span class="spinner centered"></span>', "</div>"].join("")).appendTo(this.innerElement)
    },
    bind: function() {
        this._super(),
        this.onMediaLibrarySelection = this.onMediaLibrarySelection.bind(this),
        this.syncUI = this.syncUI.bind(this),
        this.block.videoStateChanged.add(this.syncUI),
        this.innerElement.on("vclick", function(e) {
            if (0 === $(e.target).closest(".toolbar-image-url").length) {
                var t = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.VIDEO
                });
                t.selected.addOnce(this.onMediaLibrarySelection)
            } else this.onEditURLClicked(e)
        }.bind(this))
    },
    syncUI: function() {
        if (this.block.hasVideo()) {
            var e = this.block.get('source.src');
            this.innerElement.find('source').attr('src', e),
            this.placeholderElement.hide()
        } else {
            this.innerElement.find('source').attr('src', ''),
            this.placeholderElement.show()
        }
        this.innerElement.find('video').load(),
        this.urlElement.show()
        this.block.isLoading() || this.block.isUploading() ? (this.spinnerElement.show(), SL.util.html.generateSpinners()) : this.spinnerElement.hide()
    },
    onEditURLClicked: function(e) {
        e.preventDefault();
        var t = SL.prompt({
            anchor: this.urlElement,
            title: "Image URL",
            type: "input",
            confirmLabel: "Save",
            alignment: "r",
            data: {
                value: window.location.protocol + "//" + window.location.host + this.block.get("source.src"),
                placeholder: "http://...",
                width: 400
            }
        });
        t.confirmed.add(function(e) {
            this.block.set("source.src", e)
            this.syncUI()
        }.bind(this))
    },
    optionsListener: function() {
        $(document)
            .off('click', '#video-options input#default_poster[type="checkbox"]')
            .on('click', '#video-options input#default_poster[type="checkbox"]', function(e) {

            let videoSelected   = SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement,
                videoId         = videoSelected.attr('data-video-id'),
                basicPath       = `${window.location.protocol}//${window.location.host}`,
                idRev           = TWIG.idRev,
                idPres          = TWIG.idPres,
                imageUrl        = (process.env.ISPROD === true) ? `https://s3-${process.env.REGION}.amazonaws.com/${process.env.ENV_BUCKET}/${TWIG.companyParentName.replace(/\s/g, '-')}/thumbs/video/videothumb-${videoId}.jpg` : `/${TWIG.thumbUrl}/videothumb-${videoId}.jpg`,
                defaultposter   = `/img/video-poster.jpg`;

            if (e.target.checked === true) {
                videoSelected.attr('data-video-poster', defaultposter),
                $('.toolbars #videoposter').hide();
                $('#previewposter img').attr('src', defaultposter);
            } else {
                videoSelected.attr('data-video-poster', imageUrl),
                $('.toolbars #videoposter').show();
                $('#previewposter img').attr('src', imageUrl);
            }
        })
        $(document)
            .off('click', '#video-options input#default_autoplay[type="checkbox"]')
            .on('click', '#video-options input#default_autoplay[type="checkbox"]', function(e) {

            let videoSelected   = SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement;

            if (e.target.checked === true) {
                videoSelected.attr('data-video-autoplay', true)
            } else {
                videoSelected.attr('data-video-autoplay', false)
            }
        })
        $(document)
            .off('click', '#videoposter')
            .on('click', '#videoposter', function(e) {
                let videoSelected  = SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement,
                current = Reveal.getCurrentSlide(),
                t = Reveal.getIndices(current),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function(i) {
                let imgUrl      = i.data.url,
                    imgThumb    = i.data.thumb_url,
                    imgSize     = i.data.size,
                    imgLabel    = i.data.label_media;

                videoSelected.attr('data-video-poster', imgUrl);
                $('#video-options input#default_poster[type="checkbox"]').attr('checked', false);
                $('#previewposter img').attr('src', imgUrl);
            });
        })
    },
    onMediaLibrarySelection: function(e) {
        this.block.setVideoModel(e),
        this.syncUI()
    },
    destroy: function() {
        this.block.videoStateChanged && this.block.videoStateChanged.remove(this.syncUI), this._super()
    }
};

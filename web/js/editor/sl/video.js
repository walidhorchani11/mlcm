'use strict';

export const video = {
    init: function(e) {
        this._super("video", e),
        this.options.minWidth = 200;
        this.options.minHeight = 200;
        this.plug(SL.editor.blocks.plugin.Link),
        this.videoURLChanged = new signals.Signal,
        this.videoStateChanged = new signals.Signal
    },
    setup: function() {
        this._super(),
        this.properties.source = {
            src: {
                setter: this.setVideoURL.bind(this),
                getter: this.getVideoURL.bind(this)
            }
        }, this.properties.attribute["data-inline-svg"] = {
            defaultValue: !1
        }
    },
    bind: function() {
        this._super(),
        this.onUploadCompleted = this.onUploadCompleted.bind(this),
        this.onUploadFailed = this.onUploadFailed.bind(this),
        this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    setDefaults: function() {
        this._super(),
        this.resize({
            width: 360,
            height: 300
        }),
        this.options.insertedFromToolbar && (this.options.introDelay = 300, this.browse())
    },
    getToolbarOptions: function() {
        return [
            SL.editor.components.toolbars.options.Video,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.BlockDepth,
            SL.editor.components.toolbars.options.BlockActions,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.VideoOptions
        ].concat(this._super())
    },
    setVideoURL: function(e) {
        if (e !== this.getVideoURL()) {
            let basicPath       = `${window.location.protocol}//${window.location.host}`,
                idRev           = TWIG.idRev,
                idPres          = TWIG.idPres,
                videoId         = this.contentElement.closest('.sl-block').attr('data-video-id'),
                imageUrl        = (process.env.ISPROD === true) ? `https://s3-${process.env.REGION}.amazonaws.com/${process.env.ENV_BUCKET}/${TWIG.companyParentName.replace(/\s/g, '-')}/thumbs/video/videothumb-${videoId}.jpg` : `/${TWIG.thumbUrl}/videothumb-${videoId}.jpg`,
                defaultposter   = `/img/video-poster.jpg`;

            this.loading = !0,
            this.paint(),
            this.videoURLChanged.dispatch();
            $(this.contentElement).closest('.sl-block').attr({ 'data-video-autoplay' : false, 'data-video-poster' : imageUrl });
            var t = this.contentElement.find("video");
            0 === t.length ? (
                t = $(`<video id="video" width="100%" height="100%"><source src="${e}">Your browser does not support the video tag.</video>`),
                t.css("visibility", "hidden"),
                t.appendTo(this.contentElement)
            ) : t.find('source').attr("src", e),
                t.css("visibility", ""),
                this.loading = !1,
                this.syncAspectRatio(),
                this.paint(),
                this.videoURLChanged.dispatch(),
                this.paintInlineSVG(),
            this.videoURLChanged.dispatch(e)
        }
    },
    getVideoURL: function() {
        return this.contentElement.find("source").attr("src")
    },
    setVideoModel: function(e) {
        if (typeof e.data.url && e.data.url !== '') {
            let videoSelected = SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement;

            videoSelected.attr({ 'data-video' : e.data.url, 'data-video-id' : e.data.id });
        }
        e.isSVG() && this.set("attribute.data-inline-svg", e.get("inline")),
        this.intermediateModel = e,
        this.intermediateModel.isUploaded() ? this.onUploadCompleted() : (this.paint(), this.videoURLChanged.dispatch(), this.intermediateModel.uploadCompleted.add(this.onUploadCompleted), this.intermediateModel.uploadFailed.add(this.onUploadFailed))
    },
    isLoading: function() {
        return !!this.loading || !!this.loadingSVG
    },
    isUploading: function() {
        return !(!this.intermediateModel || !this.intermediateModel.isWaitingToUpload() && !this.intermediateModel.isUploading())
    },
    hasVideo: function() {
        var e = this.get("source.src");
        return !!("string" == typeof e && e.length > 0)
    },
    isLoaded: function() {
        var e = this.getNaturalSize(!0);
        return e && e.width > 0 && e.height > 0
    },
    isSVG: function() {
        return this.hasVideo() && /^svg/i.test(this.get("source.src").split(".").pop())
    },
    getNaturalSize: function(e) {
        var t = this.contentElement.find("video#video");
        if (t.length) {
            var i = {};
            if (!e && (i.width = parseInt(t.attr("data-natural-width"), 10), i.height = parseInt(t.attr("data-natural-height"), 10), i.width && i.height)) return i;
            if (i.width = t.get(0).videoWidth, i.height = t.get(0).videoHeight, i.width && i.height) return t.attr({
                "data-natural-width": i.width,
                "data-natural-height": i.height
            }), i
        }
        return null
    },
    getAspectRatio: function(e) {
        var t = this.getNaturalSize(e);
        return t ? t.width / t.height : this._super()
    },
    syncAspectRatio: function(e) {
        this.domElement.find('video#video').bind("loadedmetadata", function(elm) {
            let width = elm.currentTarget.videoWidth;
            let height = elm.currentTarget.videoHeight;

            if (width > 600 || height > 400) {
                width   = width / 2;
                height  = height / 2;
            }

            this.resize({
                width: width,
                height: height,
                center: !0
            })
        }.bind(this));
    },
    paint: function() {
        this.domElement.find(".sl-block-placeholder, .image-progress").remove(),
        this.isLoading() || this.isUploading() ? (this.domElement.append(['<div class="editing-ui sl-block-overlay image-progress">', '<span class="spinner centered"></span>', "</div>"].join("")), SL.util.html.generateSpinners()) : this.hasVideo() || this.showPlaceholder();
        var e = this.contentElement.find("video");
        1 === e.length && "none" === e.css("display") && e.css("display", ""), this.syncZ()
    },
    paintInlineSVG: function() {
        this.isSVG() && this.get("attribute.data-inline-svg") ? (this.loadingSVG = !0, this.paint(), $.ajax({
            url: this.getVideoURL() + "?t=" + Date.now(),
            type: "GET",
            dataType: "xml",
            context: this
        }).done(function(e) {
            var t = $(e).find("svg").first().get(0);
            if (t) {
                if (t.setAttribute("preserveAspectRatio", "xMidYMid meet"), !t.hasAttribute("viewBox")) {
                    var i = this.getNaturalSize();
                    i && t.setAttribute("viewBox", "0 0 " + i.width + " " + i.height)
                }
                this.contentElement.find("img").css("display", "none"), this.contentElement.find("svg").remove(), this.contentElement.append(t)
            }
        }).always(function() {
            this.loadingSVG = !1, this.paint(), this.videoURLChanged.dispatch()
        })) : (this.contentElement.find("img").css("display", ""), this.contentElement.find("svg").remove())
    },
    clear: function() {
        this.contentElement.find("video").remove(), this.paint(), this.videoURLChanged.dispatch()
    },
    browse: function() {
        var e = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
            select: SL.models.Media.VIDEO
        });
        e.selected.addOnce(this.setVideoModel.bind(this))
    },
    destroy: function() {
        this.intermediateModel && (
            this.intermediateModel.uploadCompleted.remove(this.onUploadCompleted),
            this.intermediateModel.uploadFailed.remove(this.onUploadFailed),
            this.intermediateModel = null
        ),
        this.videoURLChanged.dispose(),
        this.videoURLChanged = null,
        this._super()
    },
    onUploadCompleted: function() {
        var e = this.intermediateModel.get("url"),
            size = this.intermediateModel.get('size');
        this.intermediateModel = null,
        this.set("source.src", e),
        this.domElement.find('video').attr({
            'data-natural-width'    : '',
            'data-natural-height'   : '',
            'data-size'             : size
        }),
        this.domElement.find('video').load(),
        this.videoStateChanged.dispatch()
    },
    onUploadFailed: function() {
        this.intermediateModel = null, this.paint(), this.videoStateChanged.dispatch()
    },
    onDoubleClick: function() {
        this.browse()
    },
    onPropertyChanged: function(e) {
        "attribute.data-inline-svg" === e[0] && this.paintInlineSVG()
    }
};
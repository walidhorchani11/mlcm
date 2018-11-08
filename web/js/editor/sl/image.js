'use strict';

export const image = {
    init: function(e) {
        this._super("image", e), this.plug(SL.editor.blocks.plugin.Link), this.imageURLChanged = new signals.Signal, this.imageStateChanged = new signals.Signal
    },
    setup: function() {
        this._super(), this.properties.image = {
            src: {
                setter: this.setImageURL.bind(this),
                getter: this.getImageURL.bind(this)
            }
        }, this.properties.attribute["data-inline-svg"] = {
            defaultValue: !1
        }
    },
    bind: function() {
        this._super(), this.onUploadCompleted = this.onUploadCompleted.bind(this), this.onUploadFailed = this.onUploadFailed.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: 360,
            height: 300
        }), this.options.insertedFromToolbar && (this.options.introDelay = 300, this.browse())
    },
    getToolbarOptions: function() {
        let toolbarsLinktoElements = [
            SL.editor.components.toolbars.options.LinkToPopin,
            SL.editor.components.toolbars.options.LinkToScreen,
            SL.editor.components.toolbars.options.Reference,
            SL.editor.components.toolbars.options.LinkToPdf
        ];

        if (SL.editor.controllers.Popin.isPopin()) {
            toolbarsLinktoElements = [SL.editor.components.toolbars.options.LinkToPdf]
        }

        return [
            SL.editor.components.toolbars.options.Image,
            SL.editor.components.toolbars.options.ImageInlineSVG,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.Opacity,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.groups.BorderCSS,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.groups.Link,
            SL.editor.components.toolbars.groups.Animation,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.BlockDepth,
            SL.editor.components.toolbars.options.BlockActions,
            SL.editor.components.toolbars.options.Divider
        ].concat(toolbarsLinktoElements).concat(this._super())
    },
    setImageURL: function(e) {
        if (e !== this.getImageURL()) {
            this.loading = !0, this.paint(), this.imageStateChanged.dispatch();
            var t = this.contentElement.find("img");
            0 === t.length ? (t = $('<img src="' + e + '">'), t.css("visibility", "hidden"), t.appendTo(this.contentElement)) : t.attr("src", e), t.off("load").on("load", function() {
                t.css("visibility", ""), this.loading = !1, this.syncAspectRatio(), this.paint(), this.imageStateChanged.dispatch(), this.paintInlineSVG()
            }.bind(this)), this.imageURLChanged.dispatch(e)
        }
    },
    getImageURL: function() {
        return this.contentElement.find("img").attr("src")
    },
    setImageModel: function(e) {
        e.isSVG() && this.set("attribute.data-inline-svg", e.get("inline")), this.intermediateModel = e, this.intermediateModel.isUploaded() ? this.onUploadCompleted() : (this.paint(), this.imageStateChanged.dispatch(), this.intermediateModel.uploadCompleted.add(this.onUploadCompleted), this.intermediateModel.uploadFailed.add(this.onUploadFailed))
    },
    isLoading: function() {
        return !!this.loading || !!this.loadingSVG
    },
    isUploading: function() {
        return !(!this.intermediateModel || !this.intermediateModel.isWaitingToUpload() && !this.intermediateModel.isUploading())
    },
    hasImage: function() {
        var e = this.get("image.src");
        return !!("string" == typeof e && e.length > 0)
    },
    isLoaded: function() {
        var e = this.getNaturalSize(!0);
        return e && e.width > 0 && e.height > 0
    },
    isSVG: function() {
        return this.hasImage() && /^svg/i.test(this.get("image.src").split(".").pop())
    },
    getNaturalSize: function(e) {
        var t = this.contentElement.find("img");
        if (t.length) {
            var i = {};
            if (!e && (i.width = parseInt(t.attr("data-natural-width"), 10), i.height = parseInt(t.attr("data-natural-height"), 10), i.width && i.height)) return i;
            if (i.width = t.get(0).naturalWidth, i.height = t.get(0).naturalHeight, i.width && i.height) return t.attr({
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
        "undefined" == typeof e && (e = !0);
        var t = this.getNaturalSize(e);
        if (t) {
            var i = this.measure();
            this.resize({
                width: i.width,
                height: i.height,
                center: !0
            })
        }
    },
    paint: function() {
        this.domElement.find(".sl-block-placeholder, .image-progress").remove(), this.isLoading() || this.isUploading() ? (this.domElement.append(['<div class="editing-ui sl-block-overlay image-progress">', '<span class="spinner centered"></span>', "</div>"].join("")), SL.util.html.generateSpinners()) : this.hasImage() || this.showPlaceholder();
        var e = this.contentElement.find("img");
        1 === e.length && "none" === e.css("display") && e.css("display", ""), this.syncZ()
    },
    paintInlineSVG: function() {
        this.isSVG() && this.get("attribute.data-inline-svg") ? (this.loadingSVG = !0, this.paint(), $.ajax({
            url: this.getImageURL() + "?t=" + Date.now(),
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
            this.loadingSVG = !1, this.paint(), this.imageStateChanged.dispatch()
        })) : (this.contentElement.find("img").css("display", ""), this.contentElement.find("svg").remove())
    },
    clear: function() {
        this.contentElement.find("img").remove(), this.paint(), this.imageStateChanged.dispatch()
    },
    browse: function() {
        var e = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
            select: SL.models.Media.IMAGE
        });
        e.selected.addOnce(this.setImageModel.bind(this))
    },
    destroy: function() {
        this.intermediateModel && (
            this.intermediateModel.uploadCompleted.remove(this.onUploadCompleted),
            this.intermediateModel.uploadFailed.remove(this.onUploadFailed),
            this.intermediateModel = null
        ),
        this.imageStateChanged.dispose(),
        this.imageStateChanged = null,
        this._super()
    },
    onUploadCompleted: function() {
        var e = this.intermediateModel.get("url"),
            size = this.intermediateModel.get('size');

        this.intermediateModel = null, this.set("image.src", e), this.contentElement.find("img").attr('data-size', size ), this.imageStateChanged.dispatch()
    },
    onUploadFailed: function() {
        this.intermediateModel = null, this.paint(), this.imageStateChanged.dispatch()
    },
    onDoubleClick: function() {
        this.browse()
    },
    onPropertyChanged: function(e) {
        "attribute.data-inline-svg" === e[0] && this.paintInlineSVG()
    }
};
'use strict';

export const toolbarsoptionsImage = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "image",
            label: "Image"
        }, t))
        this.syncUI()
    },
    render: function() {
        this._super(),
        this.domElement.addClass("toolbar-image"),
        this.innerElement       = $('<div class="toolbar-image-inner">').appendTo(this.domElement),
        this.placeholderElement = $('<div class="toolbar-image-placeholder">').appendTo(this.innerElement),
        this.labelElement       = $('<div class="toolbar-image-label">Select</div>').appendTo(this.innerElement),
        this.urlElement         = $('<div class="toolbar-image-url icon i-link"></div>').appendTo(this.innerElement),
        this.spinnerElement     = $(['<div class="toolbar-image-progress">', '<span class="spinner centered"></span>', "</div>"].join("")).appendTo(this.innerElement)
    },
    bind: function() {
        this._super(),
        this.onMediaLibrarySelection = this.onMediaLibrarySelection.bind(this),
        this.syncUI = this.syncUI.bind(this),
        this.block.imageStateChanged.add(this.syncUI),
        this.innerElement.on("vclick", function(e) {
            if (0 === $(e.target).closest(".toolbar-image-url").length) {
                var t = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
                t.selected.addOnce(this.onMediaLibrarySelection)
            } else this.onEditURLClicked(e)
        }.bind(this))
    },
    syncUI: function() {
        if (this.block.hasImage()) {
            var e = this.block.get("image.src");
            this.innerElement.css("background-image", 'url("' + e + '")', ""),
            this.placeholderElement.hide();
            //,this.urlElement.toggle(0 !== e.search(SL.config.S3_HOST))
        } else this.innerElement.css("background-image", ""),
        this.placeholderElement.show(),
        this.urlElement.show();
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
                value: this.block.get("image.src"),
                placeholder: "http://...",
                width: 400
            }
        });
        t.confirmed.add(function(e) {
            this.block.set("image.src", e)
            this.syncUI()
        }.bind(this))
    },
    onMediaLibrarySelection: function(e) {
        this.block.setImageModel(e)
        this.syncUI()
    },
    destroy: function() {
        this.block.imageStateChanged && this.block.imageStateChanged.remove(this.syncUI), this._super()
    }
};

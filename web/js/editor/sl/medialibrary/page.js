'use strict';

export const mediapage = {
    init: function(e, t, i) {
        this.media = e,
        this.media.loadCompleted.add(this.onMediaLoaded.bind(this)),
        this.media.loadFailed.add(this.onMediaFailed.bind(this)),
        this.tags = t;
        this.tags.loadCompleted.add(this.onTagsLoaded.bind(this)),
        this.tags.loadFailed.add(this.onTagsFailed.bind(this)),
        this.tags.changed.add(this.onTagsChanged.bind(this)),
        this.options = $.extend({
            editable: !0,
            selectAfterUpload: !0
        }, i),
        this.selected = new signals.Signal,
        this.render(),
        this.setupDragAndDrop()
    },
    load: function() {
        this.mediaLoaded = !1,
        this.tagsLoaded = !1,
        this.loadStatus && this.loadStatus.remove(),
        this.loadStatus = $('<div class="media-library-load-status">').appendTo(this.domElement),
        this.loadStatus.html("Loading..."),
        this.media.load(),
        this.tags.load()
    },
    onMediaLoaded: function() {
        this.mediaLoaded = !0,
        this.tagsLoaded && this.onMediaAndTagsLoaded()
    },
    onMediaFailed: function() {
        SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), this.loadStatus.html('Failed to load media <button class="button outline retry">Try again</button>'), this.loadStatus.find(".retry").on("click", this.load.bind(this))
    },
    onTagsLoaded: function() {
        this.tagsLoaded = !0,
        this.mediaLoaded && this.onMediaAndTagsLoaded()
    },
    onTagsFailed: function() {
        SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), this.loadStatus.html('Failed to load tags <button class="button outline retry">Try again</button>'), this.loadStatus.find(".retry").on("click", this.load.bind(this))
    },
    onMediaAndTagsLoaded: function() {
        this.renderFilters(),
        this.renderUploader(),
        this.renderList(),
        this.refresh(),
        this.sidebarElement.addClass("visible"),
        this.contentElement.addClass("visible"),
        this.scrollShadow = new SL.components.ScrollShadow({
            parentElement: this.filters.domElement,
            contentElement: this.filters.innerElement,
            shadowSize: 6,
            resizeContent: !1
        }),
        this.loadStatus.remove()
    },
    render: function() {
        this.domElement = $('<div class="media-library-page"></div>'),
        this.sidebarElement = $('<div class="media-library-sidebar">').appendTo(this.domElement), this.contentElement = $('<div class="media-library-content">').appendTo(this.domElement)
    },
    renderFilters: function() {
        this.filters = new SL.editor.components.medialibrary.Filters(this.media, this.tags, {
            editable            : this.isEditable(),
            filters             : this.filtersStatus(),
            filtersSearch       : this.filtersSearch(),
            hideFilesList       : this.hideFilesList(),
            filtersSelected     : this.options.filtersSelected
        }),
        this.filters.filterChanged.add(this.onFilterChanged.bind(this)),
        this.filters.appendTo(this.sidebarElement)
    },
    renderUploader: function() {
        this.isEditable() && (this.uploader = new SL.editor.components.medialibrary.Uploader(this.media), this.uploader.uploadEnqueued.add(this.onUploadEnqueued.bind(this)), this.uploader.uploadStarted.add(this.onUploadStarted.bind(this)), this.uploader.uploadCompleted.add(this.onUploadCompleted.bind(this)), this.uploader.appendTo(this.sidebarElement))
    },
    renderList: function() {
        this.list = new SL.editor.components.medialibrary.List(this.media, this.tags, {
            editable        : this.isEditable(),
            hideFilesList   : this.hideFilesList()
        }),
        this.list.itemSelected.add(this.select.bind(this)),
        this.list.appendTo(this.contentElement)
    },
    setupDragAndDrop: function() {
        this.dragAndDropInstructions = $(['<div class="media-library-drag-instructions">', '<div class="inner">', "Drop to upload media", "</div>", "</div>"].join("")), this.dragAndDropListener = {
            onDragOver: function() {
                this.dragAndDropInstructions.appendTo(this.domElement)
            }.bind(this),
            onDragOut: function() {
                this.dragAndDropInstructions.remove()
            }.bind(this),
            onDrop: function(e) {
                this.dragAndDropInstructions.remove();
                var t = e.originalEvent.dataTransfer.files;
                if (this.isSelecting()) this.uploader.enqueue(t[0]);
                else
                    for (var i = 0; i < t.length; i++) this.uploader.enqueue(t[i]);
                SL.analytics.trackEditor("Media: Upload file", "drop from desktop")
            }.bind(this)
        }
    },
    show: function(e) {
        this.domElement.appendTo(e), this.domElement.removeClass("visible"), clearTimeout(this.showTimeout), this.showTimeout = setTimeout(function() {
            this.domElement.addClass("visible")
        }.bind(this), 1), this.bind()
    },
    hide: function() {
        this.unbind(), clearTimeout(this.showTimeout), this.domElement.detach()
    },
    bind: function() {
        SL.draganddrop.subscribe(this.dragAndDropListener)
    },
    unbind: function() {
        this.dragAndDropInstructions.remove(),
        SL.draganddrop.unsubscribe(this.dragAndDropListener)
    },
    configure: function(e) {
        this.options = $.extend(this.options, e),
        this.refresh()
    },
    refresh: function() {
        this.media && this.media.isLoaded() && (
            this.list.clearSelection(), this.uploader && this.uploader.configure({
                multiple: !this.isSelecting() || !this.options.selectAfterUpload
            }),
            this.isSelecting() ? (
                this.list.setPrimaryFilter(this.options.select.filter),
                this.list.clearSecondaryFilter(),
                this.filters.hideAllTypesExcept(this.options.select.id),
                this.filters.selectFilter(this.options.select.id)
            ) : (
                this.filters.showAllTypes(),
                this.list.clearPrimaryFilter(),
                this.filters.selectDefaultFilter()
            ),
            this.scrollShadow && this.scrollShadow.sync()
        )
    },
    layout: function() {
        var e = this.sidebarElement.width();
        this.contentElement.css({
            width: this.domElement.width() - e,
            left: e,
            paddingLeft: 0
        }), this.list && this.list.layout()
    },
    select: function(e) {
        this.selected.dispatch(e)
    },
    isSelecting: function() {
        return !!this.options.select
    },
    isEditable: function() {
        return !!this.options.editable
    },
    filtersStatus: function() {
        return !!this.options.filters
    },
    filtersSearch: function() {
        return !!this.options.filtersSearch
    },
    hideFilesList: function() {
        return !!this.options.hideFilesList
    },
    onFilterChanged: function(e, t) {
        this.list.setSecondaryFilter(e, t)
    },
    onUploadEnqueued: function(e) {
        var t = this.filters.getSelectedFilterData();
        t.type === SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG && e.uploadCompleted.add(function() {
            this.tags.addTagTo(t.tag, [e])
        }.bind(this))
    },
    onUploadStarted: function(e) {
        this.isSelecting() && this.options.selectAfterUpload && this.select(e)
    },
    onUploadCompleted: function(e) {
        this.media.push(e)
    },
    onTagsChanged: function() {
        this.scrollShadow && this.scrollShadow.sync()
    }
};

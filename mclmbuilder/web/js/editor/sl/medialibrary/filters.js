'use strict';

export const filters = {
    init: function(e, t, i) {
        this.filtersSelected = i.filtersSelected,
        this.options = $.extend({
            editable: !0
        }, i),
        this.media = e,
        this.media.changed.add(this.onMediaChanged.bind(this)),
        this.tags = t,
        this.tags.changed.add(this.onTagsChanged.bind(this)),
        this.tags.associationChanged.add(this.onTagAssociationChanged.bind(this)),
        this.filterChanged = new signals.Signal,
        this.onSearchInput = $.throttle(this.onSearchInput, 300),
        this.render(),
        this.recount();
        if (this.options.filtersSelected === '') {
            this.selectDefaultFilter(!0)
        }
    },
    render: function() {
        this.options.editable = false,
        this.domElement = $('<div class="media-library-filters">'),
        this.domElement.toggleClass("editable", this.options.editable),
        this.innerElement = $('<div class="media-library-filters-inner">').appendTo(this.domElement),
        this.scrollElement = this.innerElement;
        if (this.options.filterAllTypes) {
            this.renderTypes();
        }
        if (this.options.filtersSearch) {
            this.renderSearch();
        }
        if (this.options.filters) {
            this.renderTags();
        }
    },
    renderTypes: function() {
        this.renderType(SL.models.Media.IMAGE.id, function() {
            return !0
        }, "All Files", "All Files")
    },
    renderType: function(e, t, i, n) {
        var r = $([`<div class="media-library-filter media-library-type-filter">`, `<span class="label">${i}</span>`, `<span class="count"></span>`, "</div>"].join(""));
        return r.attr({
            "data-id": e,
            "data-label": i,
            "data-exclusive-label": n
        }),
        r.on("vclick", this.onFilterClicked.bind(this)),
        r.data("filter", t),
        r.appendTo(this.innerElement),
        r
    },
    renderTags: function() {
        this.tagsElement = $(['<div class="media-library-tags media-drop-area">', '<div class="tags-list"></div>', "</div>"].join("")),
        this.tagsElement.appendTo(this.innerElement),
        this.tagsList = this.tagsElement.find(".tags-list"),
        this.options.editable && (this.tagsElement.append(['<div class="tags-create">', '<div class="tags-create-inner ladda-button" data-style="expand-right" data-spinner-color="#666" data-spinner-size="28">New tag</div>', "</div>"].join("")),
        this.tagsElement.find(".tags-create").on("vclick", this.onCreateTagClicked.bind(this)),
        this.tagsCreateLoader = Ladda.create(this.tagsElement.find(".tags-create-inner").get(0)));
        this.tags.forEach(this.renderTag.bind(this)),
        this.sortTags()
    },
    renderTag: function(e) {

        let filterStatusClass   = '',
            showCounterClass    = '',
            filterValue         = this.options.filtersSelected;

        if (typeof filterValue !== 'undefined' && filterValue !== '') {
            e.data.name.toLowerCase() === filterValue.toLowerCase() ? this.selectFilter(e.data.id, 1) : filterStatusClass = ' hide';
        }
        if (this.options.hideFilesList) {
            showCounterClass = ' hide';
        }
        var t = $(['<div class="media-library-filter media-drop-target' + filterStatusClass + '" data-name="' + e.data.name + '" data-id="' + e.get("id") + '">', '<div class="front">', '<span class="label-output">' + e.get("name") + "</span>", '<div class="controls-out">', `<span class="a count${showCounterClass}"></span>`, "</div>", "</div>", "</div>", "</div>"].join(""));
        return t.on("vclick", this.onTagClicked.bind(this)), t.data({
            model: e,
            filter: e.createFilter()
        }),
        this.options.editable ? (t.find(".front").append(['<div class="controls-over">', '<span class="controls-button edit-button">Edit</span>', "</div>"].join("")), t.append(['<div class="back">', '<input class="label-input" value="' + e.get("name") + '" type="text">', '<div class="controls">', '<span class="controls-button delete-button negative icon i-trash-stroke"></span>', '<span class="controls-button save-button">Save</span>', "</div>", "</div>"].join("")),
        t.data("dropReceiver", function(t) {
            this.tags.addTagTo(e, t)
        }.bind(this))) : t.find(".controls-out").removeClass("controls-out").addClass("controls-permanent"), t.appendTo(this.tagsList), t
    },
    renderSearch: function() {
        this.searchElement = $(['<div class="media-library-filter media-library-search-filter" data-id="search">', '<input class="search-input" type="text" placeholder="' + TWIG.mediaLibrary.searchInput + '..." maxlength="50" />', "</div>"].join("")),
        this.searchElement.on("vclick", this.onSearchClicked.bind(this)), this.searchElement.data("filter", function() {
            return !1
        }),
        this.searchElement.appendTo(this.innerElement),
        this.searchInput = this.searchElement.find(".search-input"),
        this.searchInput.on("input", this.onSearchInput.bind(this))
    },
    recount: function(e) {
        e = e || this.domElement.find(".media-library-filter"),
        e.each(function(e, t) {
            var i = $(t),
                n = i.find(".count");
            n.length && n.text(this.media.filter(i.data("filter")).length)
        }.bind(this))
    },
    appendTo: function(e) {
        this.domElement.appendTo(e)
    },
    selectFilter: function(e, t) {
        this.domElement.attr('filter-type', e),
        this.domElement.find(".is-selected").removeClass("is-selected");
        var i = this.domElement.find('.media-library-filter[data-name="' + e + '"]');

        i.addClass("is-selected"),
        this.selectedFilter = i.data("filter"),
        this.selectedFilterData = {},
        i.closest(this.tagsList).length ? (
            this.selectedFilterData.type = SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG,
            this.selectedFilterData.tag = i.data("model"),
            this.selectedFilterData.placeholder = TWIG.mediaLibrary.noTagMsg,
            this.options.editable && (this.selectedFilterData.placeholder = "This tag is empty. To add media, drag and drop it onto the tag in the sidebar.")
        ) : (
            this.selectedFilterData.type = SL.editor.components.medialibrary.Filters.FILTER_TYPE_MEDIA,
            this.selectedFilterData.placeholder = TWIG.mediaLibrary.noTypeMsg
        ),
        t || this.filterChanged.dispatch(this.selectedFilter, this.selectedFilterData)
    },
    selectDefaultFilter: function(e) {
        this.selectFilter(this.domElement.find(".media-library-filter:not(.media-library-search-filter)").first().attr("data-name"), e)
    },
    showAllTypes: function() {
        this.domElement.find(".media-library-type-filter").each(function() {
            var e = $(this);
            e.css("display", ""), e.find(".label").text(e.attr("data-label"))
        })
    },
    hideAllTypesExcept: function(e) {
        this.domElement.find(".media-library-type-filter").each(function() {
            var t = $(this);
            t.attr("data-id") === e ? (t.css("display", ""), t.find(".label").text(t.attr("data-exclusive-label"))) : (t.css("display", "none"), t.find(".label").text(t.attr("data-label")))
        })
    },
    startEditingTag: function(e, t) {
        if (this.tagsList.find(".is-editing").length) return !1;
        var i = (e.data("model"), e.find(".label-input"));
        this.domElement.addClass("is-editing"), t === !0 && (e.addClass("collapsed"), e.find(".label-output").empty(), setTimeout(function() {
            e.removeClass("collapsed")
        }, 1), this.scrollElement.animate({
            scrollTop: e.prop("offsetTop") + 80 - this.scrollElement.height()
        }, 300)), e.addClass("is-editing");
        var n = this.scrollElement.prop("scrollTop");
        i.focus().select(), this.scrollElement.prop("scrollTop", n), i.on("keydown", function(t) {
            13 === t.keyCode && (t.preventDefault(), this.stopEditingTag(e))
        }.bind(this))
    },
    stopEditingTag: function(e, t) {
        var i = e.data("model"),
            n = e.find(".label-input"),
            r = e.find(".label-output");
        this.domElement.removeClass("is-editing");
        var o = n.val();
        o && !t && (i.set("name", o), i.save(["name"])), r.text(i.get("name")), n.off("keydown"), setTimeout(function() {
            e.removeClass("is-editing")
        }, 1)
    },
    sortTags: function() {
        var e = this.tagsList.find(".media-library-filter").toArray();
        e.sort(function(e, t) {
            return e = $(e).data("model").get("name").toLowerCase(), t = $(t).data("model").get("name").toLowerCase(), t > e ? -1 : e > t ? 1 : 0
        }), e.forEach(function(e) {
            $(e).appendTo(this.tagsList)
        }.bind(this))
    },
    getTagElementByID: function(e) {
        return this.tagsList.find('.media-library-filter[data-id="' + e + '"]')
    },
    confirmTagRemoval: function(e) {
        var t = e.data("model");
        SL.prompt({
            anchor: e.find(".delete-button"),
            title: SL.locale.get("MEDIA_TAG_DELETE_CONFIRM"),
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Delete</h3>",
                selected: !0,
                className: "negative",
                callback: function() {
                    SL.analytics.trackEditor("Media: Delete tag"), t.destroy().done(function() {
                        this.domElement.removeClass("is-editing"), this.tags.remove(t), SL.notify(SL.locale.get("MEDIA_TAG_DELETE_SUCCESS"))
                    }.bind(this)).fail(function() {
                        SL.notify(SL.locale.get("MEDIA_TAG_DELETE_ERROR"), "negative")
                    }.bind(this))
                }.bind(this)
            }]
        })
    },
    getSelectedFilterData: function() {
        return this.selectedFilterData
    },
    destroy: function() {
        this.filterChanged.dispose(),
        this.domElement.remove()
    },
    onMediaChanged: function() {
        this.recount()
    },
    onTagsChanged: function(e, t) {
        e && e.length && e.forEach(function(e) {
            this.startEditingTag(this.renderTag(e), !0)
        }.bind(this)), t && t.length && t.forEach(function(e) {
            var t = this.tagsElement.find('[data-id="' + e.get("id") + '"]');
            this.stopEditingTag(t, !0), t.css({
                height: 0,
                padding: 0,
                opacity: 0
            }), setTimeout(function() {
                t.remove()
            }, 300), t.hasClass("is-selected") && this.selectDefaultFilter()
        }.bind(this))
    },
    onTagAssociationChanged: function(e) {
        this.recount(this.getTagElementByID(e.get("id")))
    },
    onFilterClicked: function(e) {
        this.selectFilter($(e.currentTarget).attr("data-name"))
    },
    onCreateTagClicked: function() {
        this.tagsCreateLoader.start(), this.tags.create().then(function(e) {
            this.recount(this.getTagElementByID(e.get("id"))), this.tagsCreateLoader.stop()
        }.bind(this), function() {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), this.tagsCreateLoader.stop()
        }.bind(this)), SL.analytics.trackEditor("Media: Create tag")
    },
    onTagClicked: function(e) {
        var t = $(e.target),
            i = t.closest(".media-library-filter");
        i.length && (t.closest(".edit-button").length ? this.startEditingTag(i) : t.closest(".save-button").length ? this.stopEditingTag(i) : t.closest(".delete-button").length ? this.confirmTagRemoval(i) : i.hasClass("is-editing") || this.onFilterClicked(e))
    },
    onSearchClicked: function() {
        this.selectFilter(this.searchElement.attr("data-id"), !0),
        this.searchInput.focus(),
        this.onSearchInput(),
        SL.analytics.trackEditor("Media: Search clicked")
    },
    onSearchInput: function() {
        var e = this.searchInput.val();

        this.selectedFilter = this.media.createSearchFilter(e),
        this.selectedFilterData = {
            type: SL.editor.components.medialibrary.Filters.FILTER_TYPE_SEARCH,
            placeholder: TWIG.mediaLibrary.searchMsg
        },
        this.searchElement.data("filter", this.selectedFilter),
        e.length > 0 && (this.selectedFilterData.placeholder = TWIG.mediaLibrary.noResultMsg + '"' + e + '"'),
        this.filterChanged.dispatch(this.selectedFilter, this.selectedFilterData)

        // $('.media-library-list-item').each(function( index ) {
        //     var url  = $(this).css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
        //     url = url.replace(document.location.origin+'/uploads/','').replace(/\.[^/.]+$/, "").toLowerCase();
        //     console.log('*********** Ben Macha **********************');
        //     //console.log(url);
        //     //console.log(url.indexOf(value));
        //
        //     if(url.indexOf(e) != -1){
        //         console.log($(this).css('display'));
        //         $(this).css('display','block');
        //         console.log($(this).css('display'));
        //     }else
        //         $(this).css('display','none');
        // });

    }
};

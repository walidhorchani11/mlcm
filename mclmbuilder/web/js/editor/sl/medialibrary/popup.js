'use strict';

export const mediapopup = {
    TYPE: "media-library",
    init: function(e) {
        this.selectedFilter     = '',
        this.filterAllTypes     = false,
        this.filterList         = true,
        this.filterSearch       = true,
        this.hideFilesList      = false;

        if (typeof e !== 'undefined') {
            if (typeof e.select.id !== 'undefined') {
                this.filtersSelected = e.select.id;
            }
            if (typeof e.filtersList !== 'undefined') {
                this.filterList = e.filtersList
            }
            if (typeof e.filterSearch !== 'undefined') {
                this.filterSearch = e.filtersSearch
            }
            if (typeof e.filterAllTypes !== 'undefined') {
                this.filterAllTypes = e.filterAllTypes
            }
            if (typeof e.hideFilesList !== 'undefined') {
                this.hideFilesList = e.hidesFileList
            }
        }
        this._super($.extend({
            title: TWIG.mediaLibrary.header,
            width: 1010,
            height: 660,
            singleton: !0
        }, e)),
        this.selected = new signals.Signal
    },
    render: function() {
        if (this._super(),
            this.innerElement.addClass("media-library"),
            this.userPage = new SL.editor.components.medialibrary.MediaLibraryPage(new SL.collections.Media, new SL.collections.MediaTags, {
                filters         : this.filterList,
                filtersSearch   : this.filterSearch,
                filtersSelected : this.filtersSelected,
                filterAllTypes  : this.filterAllTypes,
                hideFilesList   : this.hideFilesList
            }),
            this.userPage.selected.add(this.onMediaSelected.bind(this)),
            this.userPage.load(),
            SL.current_user.isEnterprise()
        ) {
            var e = new SL.collections.TeamMedia;
            this.headerTabs = $(['<div class="media-library-header-tabs">', '<div class="media-library-header-tab user-tab">Your Media</div>', '<div class="media-library-header-tab team-tab" data-tooltip-alignment="r">Team Media</div>', "</div>"].join("")), this.userTab = this.headerTabs.find(".user-tab"), this.teamTab = this.headerTabs.find(".team-tab"), this.userTab.on("vclick", this.showUserPage.bind(this)), this.teamTab.on("vclick", this.showTeamPage.bind(this)), this.innerElement.addClass("has-header-tabs"), this.headerTitleElement.replaceWith(this.headerTabs), e.loadCompleted.add(function() {
                !SL.current_user.isEnterpriseManager() && e.isEmpty() && (this.teamTab.addClass("is-disabled"), this.teamTab.attr("data-tooltip", "Your team doesn't have any shared media yet.<br>Only admins can upload team media."))
            }.bind(this)), e.loadFailed.add(function() {
                this.teamTab.attr("data-tooltip", "Failed to load")
            }.bind(this)),
            this.teamPage = new SL.editor.components.medialibrary.MediaLibraryPage(e, new SL.collections.TeamMediaTags, {
                editable            : SL.current_user.isEnterpriseManager(),
                selectAfterUpload   : !1,
                filters             : this.filterList,
                filtersSearch       : this.filterSearch,
                filtersSelected     : this.filtersSelected,
                filterAllTypes      : this.filterAllTypes,
                hideFilesList       : this.hideFilesList
            }),
            this.teamPage.selected.add(this.onMediaSelected.bind(this)),
            this.teamPage.load()
        }
        this.showUserPage()
    },
    showUserPage: function() {
        this.currentPage = this.userPage,
        this.teamPage && (this.teamPage.hide(), this.teamTab.removeClass("is-selected"), this.userTab.addClass("is-selected")),
        this.userPage.show(this.bodyElement),
        this.userPage.configure(this.options),
        this.refresh(),
        this.layout(),
        this.refreshFilters(this.options)
    },
    showTeamPage: function() {
        this.currentPage = this.teamPage,
        this.userPage.hide(),
        this.userTab.removeClass("is-selected"),
        this.teamPage.show(this.bodyElement),
        this.teamPage.configure(this.options),
        this.teamTab.addClass("is-selected"),
        this.refresh(),
        this.layout()
    },
    open: function(e) {
        e = $.extend({
            select: null
        }, e),
        this._super(e),
        this.currentPage.configure(e),
        this.currentPage.bind(),
        this.refresh(),
        this.layout(),
        this.refreshFilters(e)
    },
    close: function() {
        this._super.apply(this, arguments),
        this.selected.removeAll(),
        this.currentPage.unbind()
    },
    layout: function() {
        this._super.apply(this, arguments),
        this.currentPage.layout()
    },
    refresh: function() {
        this.currentPage.refresh()
    },
    isSelecting: function() {
        return !!this.options.select
    },
    refreshFilters: function(e) {
        let filters = $('.media-library-page .tags-list .media-library-filter');

        filters.removeClass('hide is-selected');
        _.each(filters, function(value, key) {
            $(value).attr('data-name').toLowerCase() !== e.select.id.toLowerCase() ? $(value).addClass('hide') : $(value).addClass('is-selected');
        });
    },
    onMediaSelected: function(e) {
        this.isSelecting() ? this.selected.dispatch(e) : SL.editor.controllers.Blocks.add({
            type: "image",
            afterInit: function(t) {
                t.setImageModel(e)
            }
        }), this.close();
    }
};

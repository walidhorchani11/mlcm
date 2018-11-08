'use strict';

export const list = {
    init: function(e, t, i) {
        this.options = $.extend({
            editable: !0
        }, i),
        this.media = e,
        this.media.changed.add(this.onMediaChanged.bind(this)),
        this.tags = t,
        this.tags.associationChanged.add(this.onTagAssociationChanged.bind(this)),
        this.items = [],
        this.filteredItems = [],
        this.selectedItems = new SL.collections.Collection,
        this.overlayPool = [],
        this.itemSelected = new signals.Signal,
        this.drag = new SL.editor.components.medialibrary.ListDrag,
        this.render(),
        this.bind()
    },
    render: function() {
        this.domElement = $('<div class="media-library-list">'),
        this.trayElement = $(['<div class="media-library-tray">', '<div class="status"></div>', '<div class="button negative delete-button">Delete</div>', '<div class="button outline white untag-button">Remove tag</div>', '<div class="button outline white clear-button">Clear selection</div>', "</div>"].join("")),
        this.placeholderElement = $(['<div class="media-library-list-placeholder">', "Empty", "</div>"].join(""));
        if (!this.options.hideFilesList) {
            this.media.forEach(this.addItem.bind(this)),
            this.filteredItems = this.items
        }
    },
    bind: function() {
        if (this.loadItemsInView = $.throttle(this.loadItemsInView, 200),
            this.onMouseMove = this.onMouseMove.bind(this),
            this.onMouseUp = this.onMouseUp.bind(this), this.domElement.on("scroll", this.onListScrolled.bind(this)),
            this.trayElement.find(".delete-button").on("vclick", this.onDeleteSelectionClicked.bind(this)),
            this.trayElement.find(".untag-button").on("vclick", this.onUntagSelectionClicked.bind(this)),
            this.trayElement.find(".clear-button").on("vclick", this.onClearSelectionClicked.bind(this))
            // SL.util.device.IS_PHONE || SL.util.device.IS_TABLET
        ) {
                var e = new Hammer(this.domElement.get(0));
                e.on("tap", this.onMouseUp), e.on("press", function(e) {
                    var t = $(e.target).closest(".media-library-list-item").data("item");
                    t && (this.lastSelectedItem = t, this.toggleSelection(t)), e.preventDefault()
                }.bind(this))
        } else this.domElement.on("vmousedown", this.onMouseDown.bind(this))
    },
    layout: function() {
        var e = $(".media-library-list-item").first();
        this.cellWidth = e.outerWidth(!0), this.cellHeight = e.outerHeight(!0), this.columnCount = Math.floor(this.domElement.outerWidth() / this.cellWidth)
    },
    appendTo: function(e) {
        this.domElement.appendTo(e),
        this.trayElement.appendTo(e),
        this.placeholderElement.appendTo(e),
        this.layout(),
        this.loadItemsInView()
    },
    addItem: function(e, t, i) {
        if(typeof e.data.created === 'undefined') {
            e.data.created = new Date(Date.now()).toLocaleDateString()
        }
        if(typeof e.data.title === 'undefined') {
            e.data.title = e.data.label_media
        }
        let fileType = e.data.content_type;

        var n = $('<div class="media-library-list-item" data-type="' + fileType + '" data-db-id="'+ e.data.id +'"></div>'),
            r = {
                model: e,
                element: n,
                elementNode: n.get(0),
                selected: !1,
                visible: !0
            };
        n.data("item", r),
        n.append(`<div class="mediaLabel">${r.model.data.title}</div>`),
        t === !0 ? (n.prependTo(this.domElement), this.items.unshift(r)) : (n.appendTo(this.domElement),
        this.items.push(r)), i === !0 && (n.addClass("has-intro hidden"),
        setTimeout(function() {
            n.removeClass("hidden")
        }, 1))
    },
    removeItem: function(e) {
        for (var t = this.items.length; --t >= 0;) {
            var i = this.items[t];
            i.model === e && (i.model = null, i.element.remove(), this.items.splice(t, 1))
        }
    },
    setPrimaryFilter: function(e) {
        this.filterA = e,
        this.applyFilter()
    },
    clearPrimaryFilter: function() {
        this.filterA = null,
        this.applyFilter()
    },
    setSecondaryFilter: function(e, t) {
        this.clearSelection(),
        this.filterB = e,
        this.filterBData = t,
        this.applyFilter(),
        this.setPlaceholderContent(t.placeholder),
        this.afterSelectionChange()
    },
    clearSecondaryFilter: function() {
        this.filterB = null, this.filterBData = null, this.applyFilter(), this.setPlaceholderContent("Empty")
    },
    applyFilter: function() {
        this.filteredItems = [];
        for (var e = 0, t = this.items.length; t > e; e++) {
            var i = this.items[e];
            this.filterA && !this.filterA(i.model) || this.filterB && !this.filterB(i.model) ? (i.elementNode.style.display = "none", i.visible = !1, this.detachOverlay(i)) : (this.filteredItems.push(i), i.visible = !0, i.elementNode.style.display = "")
        }
        this.domElement.scrollTop(0),
        this.loadItemsInView(),
        this.placeholderElement.toggleClass("visible", 0 === this.filteredItems.length)
    },
    loadItemsInView: function() {
        if (this.filteredItems.length)
            for (var e, t, i = this.domElement.scrollTop(), n = 100, r = this.domElement.outerHeight(), o = 0, s = this.filteredItems.length; s > o; o++) {
                e = this.filteredItems[o];
                switch(true) {
                    case (e.model.data.content_type.match(/video.*/) !== null) :
                        e.model.data.thumb_url = '/img/video.png';
                        e.proportional = !0;
                    break;
                    case (e.model.data.content_type.match(/application\/pdf/) !== null) :
                        e.model.data.thumb_url = '/img/pdf.png';
                    break;
                }
                t = Math.floor(o / this.columnCount) * this.cellHeight, t + this.cellHeight - i > -n && r + n > t - i ?
                    (e.overlay || this.attachOverlay(e), e.elementNode.hasAttribute("data-thumb-loaded") ||
                    (e.elementNode.style.backgroundImage = 'url("' + e.model.get("thumb_url") + '")', e.elementNode.setAttribute("data-thumb-loaded", "true"))
                ) : e.overlay && !e.selected && this.detachOverlay(e)
            }

    },
    setPlaceholderContent: function(e) {
        this.placeholderElement.html(this.media.isEmpty() ? this.options.editable ? "You haven't uploaded any media yet.<br>Use the upload button to the left or drag media from your desktop." : "No media has been uploaded yet." : e || "Empty")
    },
    attachOverlay: function(e) {
        return e.overlay || !this.options.editable ? !1 : (0 === this.overlayPool.length && this.overlayPool.push($(['<div class="info-overlay">', '<span class="info-overlay-action inline-button icon i-embed" data-tooltip="Insert SVG inline"></span>', '<span class="info-overlay-action label-button icon i-type"></span>', /*'<span class="info-overlay-action select-button" data-tooltip="Select">', '<span class="icon i-checkmark checkmark"></span>', "</span>"*/,"</div>"].join(""))), e.overlay = this.overlayPool.pop(), e.overlay.appendTo(e.element), void this.refreshOverlay(e))
    },
    refreshOverlay: function(e) {
        if (e.overlay) {
            var t = e.model.get("label_media");
            t && "" !== t || (t = "Label"), e.overlay.find(".label-button").attr("data-tooltip", t), e.model.isSVG() ? (e.overlay.addClass("has-inline-option"), e.overlay.find(".inline-button").toggleClass("is-on", !!e.model.get("inline"))) : e.overlay.removeClass("has-inline-option")
        }
    },
    detachOverlay: function(e) {
        e && e.overlay && (this.overlayPool.push(e.overlay), e.overlay = null)
    },
    toggleSelection: function(e, t) {
        e.visible && (e.selected = "boolean" == typeof t ? t : !e.selected, e.selected ? (e.element.addClass("is-selected"), this.selectedItems.push(e)) : (e.element.removeClass("is-selected"), this.selectedItems.remove(e)), this.afterSelectionChange())
    },
    toggleSelectionThrough: function(e) {
        if (this.lastSelectedItem) {
            var t = !e.selected,
                i = this.lastSelectedItem.element.index(),
                n = e.element.index();
            if (n > i)
                for (var r = i + 1; n >= r; r++) this.toggleSelection(this.items[r], t);
            else if (i > n)
                for (var r = n; i > r; r++) this.toggleSelection(this.items[r], t)
        }
    },
    clearSelection: function() {
        this.selectedItems.forEach(function(e) {
            e.selected = !1, e.element.removeClass("is-selected")
        }.bind(this)), this.selectedItems.clear(), this.lastSelectedItem = null, this.afterSelectionChange()
    },
    afterSelectionChange: function() {
        var e = this.selectedItems.size();
        this.domElement.toggleClass("is-selecting", e > 0), this.trayElement.toggleClass("visible", e > 0), this.trayElement.find(".status").text(e + " " + SL.util.string.pluralize("item", "s", 1 !== e) + " selected"), this.filterBData && this.filterBData.type === SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG ? this.trayElement.find(".untag-button").show() : this.trayElement.find(".untag-button").hide()
    },
    deleteSelection: function() {
        var e = "Do you want to permanently delete this media from all existing presentations or remove it from the library?";
        this.selectedItems.size() > 1 && (e = "Do you want to permanently delete these items from all existing presentations or remove them from the library?"), SL.prompt({
                anchor: this.trayElement.find(".delete-button"),
                title: e,
                type: "select",
                data: [{
                    html: "<h3>Cancel</h3>"
                }, {
                    html: "<h3>Remove from library</h3>",
                    callback: function() {
                        this.selectedItems.forEach(function(e) {
                            e.model.set("hidden", !0), e.model.save(["hidden"]).fail(function() {
                                SL.notify("An error occurred, media was not removed", "negative")
                            }.bind(this)), this.media.remove(e.model)
                        }.bind(this)), this.clearSelection()
                    }.bind(this)
                }, {
                    html: "<h3>Delete permanently</h3>",
                    selected: !0,
                    className: "negative",
                    callback: function() {

                        this.selectedItems.forEach(function(e) {
                            e.model.destroy().fail(function() {
                                SL.notify("An error occurred, media was not deleted", "negative")
                            }.bind(this)), this.media.remove(e.model)
                        }.bind(this)), this.clearSelection()
                    }.bind(this)
                }]
            }),
            SL.analytics.trackEditor("Media: Delete items")
    },
    editLabel: function(e) {
        let thumbUrl        = '',
            timer           = '',
            that            = this,
            isImage         = false,
            isVideo         = false,
            isPdf           = false,
            imageSwall      = false,
            classHidden     = 'hidden',
            pdfPreviewWidth = 900,
            idMedia         = e.model.data.id;

        if (e.model.data.title === undefined || e.model.data.title === null) {
            e.model.data.title = "";
        }
        if (e.model.data.legend === undefined || e.model.data.legend === null) {
            e.model.data.legend = "";
        }
        switch(true) {
            case (e.model.data.content_type.match(/image.*/) !== null) :
                thumbUrl        = e.model.data.url;
                imageSwall      = thumbUrl;
                isImage         = true;
                classHidden     = '';
            break;
            case (e.model.data.content_type.match(/video.*/) !== null) :
                thumbUrl        = '/img/video.png';
                isVideo         = true;
            break;
            case (e.model.data.content_type.match(/application\/pdf/) !== null) :
                thumbUrl        = '/img/loading.gif';
                imageSwall      = thumbUrl;
                isPdf           = true;
            break;
        }

        var mediaSize       = (e.model.data.size / 1000000).toFixed(2),
            popinHeight     = ($(window).innerHeight()/2)-50,
            modalContent    = '';

        if (isVideo) {
            modalContent += `<div style="height:300px"><video id="html5player" width="400" controls><source src="${e.model.data.url}" type="video/mp4">Your browser does not support HTML5 video.</video></div>`
        } else if (isPdf) {
            modalContent += `<div id="pdf-preview"></div>`;
        }
        modalContent += `<div class="row" id="formMedia">
                            <div class="col-md-7">
                                <div class="row">
                                    <div class="media-infos-row clearfix">
                                        <div class="col-md-3 media-title text-right">${TWIG.mediaLibrary.title} :</div>
                                        <div class="col-md-9 text-left">${decodeURIComponent(e.model.data.label_media)}</div>
                                    </div>
                                    <div class="media-infos-row clearfix">
                                        <div class="col-md-3 media-title text-right">${TWIG.mediaLibrary.creationDate} :</div>
                                        <div class="col-md-9 text-left">${e.model.data.created}</div>
                                    </div>
                                    <div class="media-infos-row clearfix">
                                        <div class="col-md-3 media-title text-right">${TWIG.mediaLibrary.size} :</div>
                                        <div class="col-md-9 text-left">${mediaSize} MB</div>
                                    </div>
                                    <div class="media-infos-row clearfix ${classHidden}">
                                        <div class="col-md-3 media-title text-right">${TWIG.mediaLibrary.resolution} :</div>
                                        <div class="col-md-9 text-left">${e.model.data.width}x${e.model.data.height} px</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <form class='form-horizontal mediapopin-details' data-toggle='validator' id='formEdit' method='post' action="${TWIG.UrlUpdateMediaEditor}?type=${e.model.data.content_type}&id=${idMedia}">
                                    <div class="form-group">
                                        <label for="mediatitle" class="col-sm-3 control-label media-title text-left">${TWIG.mediaLibrary.title} :</label>
                                        <div class="col-sm-9">
                                            <input type="text" value="${e.model.data.title}" class="form-control" id="mediatitle" placeholder="Title">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-3 control-label media-title text-left">${TWIG.mediaLibrary.legend} :</label>
                                        <div class="col-sm-9">
                                            <textarea class="form-control" rows="3" id="LegendTextarea">${e.model.data.legend}</textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>`;

        let imagePreviewWidth   = 400,
            imagePreviewHeight  = (e.model.data.height / e.model.data.width) * imagePreviewWidth;

        if (e.model.data.width < 400) {
            imagePreviewWidth = e.model.data.width;
            imagePreviewHeight = e.model.data.height;
        }

        if (isPdf) { imagePreviewWidth = pdfPreviewWidth; imagePreviewHeight = popinHeight }

        var t = swal({
                title               : "",
                text                : modalContent,
                html                : true,
                imageUrl            : imageSwall,
                imageSize           : `${imagePreviewWidth}x${imagePreviewHeight}`,
                customClass         : 'swal-wide',
                showCancelButton    : true,
                cancelButtonText    : TWIG.mediaLibrary.cancel,
                confirmButtonColor  : "#DD6B55",
                confirmButtonText   : TWIG.mediaLibrary.save,
                closeOnConfirm      : false,
                closeOnCancel       : true
            },
            function (isConfirm) {
                if (isConfirm) {
                    var urlForm         = $('#formEdit').attr('action'),
                        $inputTitle     = $('input#mediatitle'),
                        $legend         = $('#LegendTextarea'),
                        mediaObj        = e.model.data;

                    if ($inputTitle.val().length > 0 && $inputTitle.val() !== '' && $inputTitle.val() !== 'undefined') {
                        $.post(urlForm, {inputTitle : $inputTitle.val(), LegendTextarea : $legend.val()}, function() {
                            var container   = document.getElementsByClassName("sl-popup-body"),
                                content     = container.innerHTML;

                            mediaObj.title  = $inputTitle.val();
                            mediaObj.legend = $legend.val();
                            $inputTitle.closest('.form-group').removeClass('has-error');
                            //container.innerHTML= content;
                            $(`#slpop .media-library-list-item[data-db-id="${idMedia}"] .mediaLabel`).text($inputTitle.val());
                            swal.close();
                        })
                    } else {
                        $inputTitle.closest('.form-group').addClass('has-error');
                    }
                } else {
                    let videos = $('.sweet-alert').find('video');

                    if (videos.length > 0) {
                        videos.each(function() {
                            this.pause();
                            this.currentTime = 0;
                        });
                    }
                    swal.close();
                }
            }
        );

        $('#pdf-preview').remove();
        $(document).on('keyup', 'input#mediatitle', function(e) {
            let title = e.target.value;
            clearTimeout(timer);
            timer = setTimeout(function() {
                if (title.length > 0) {
                    $('input#mediatitle').closest('.form-group').removeClass('has-error');
                }
            }.bind(this), 300);
        });

        if (e.model.data.content_type.match(/application\/pdf/) !== null) {
            if (typeof e.model.data.url !== 'undefined' && e.model.data.url !== '') {
                $('.sa-custom').css('background-image', 'none').append('<div id="pdf-preview"></div>');
                $('#pdf-preview').css({
                    'max-height' : popinHeight,
                    'height'     : popinHeight,
                    'overflow'   : 'auto'
                }).children().remove()
                SL.editor.controllers.Pdf.pdfPreview(e.model.data.url, 'pdf-preview', pdfPreviewWidth);
            }
        }
    },
    toggleInline: function(e) {
        e.model.set("inline", !e.model.get("inline")), e.model.save(["inline"]), this.refreshOverlay(e), SL.analytics.trackEditor("Media: Toggle inline SVG")
    },
    onMediaChanged: function(e, t) {
        e && e.length && (e.forEach(function(e) {
            this.addItem(e, !0, !0)
        }.bind(this)),
        this.applyFilter()), t && t.length && (t.forEach(this.removeItem.bind(this)), this.media.isEmpty() ? this.applyFilter() : this.loadItemsInView())
    },
    onTagAssociationChanged: function(e) {
        var t = this.filterBData && this.filterBData.type === SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG && this.filterBData.tag.get("id") === e.get("id");
        t && this.applyFilter()
    },
    onMouseDown: function(e) {
        2 !== e.button && (this.mouseDownTarget = $(e.target),
        this.mouseDownX = e.clientX, this.mouseDownY = e.clientY,
        this.domElement.on("vmousemove", this.onMouseMove),
        this.domElement.on("vmouseup", this.onMouseUp))
    },
    onMouseMove: function(e) {
        var t = SL.util.trig.distanceBetween({
            x: this.mouseDownX,
            y: this.mouseDownY
        }, {
            x: e.clientX,
            y: e.clientY
        });
        if (t > 10 && this.options.editable) {
            var i = this.mouseDownTarget.closest(".media-library-list-item").data("item");
            if (i) {
                this.domElement.off("vmousemove", this.onMouseMove), this.domElement.off("vmouseup", this.onMouseUp);
                var n = [i.model];
                this.selectedItems.size() > 0 && i.selected && (n = this.selectedItems.map(function(e) {
                    return e.model
                })),
                this.drag.startDrag(e, i.element, n), SL.analytics.trackEditor("Media: Start drag", n.length > 1 ? "multiple" : "single")
            }
        }
        e.preventDefault()
    },
    onMouseUp: function(e) {
        var t = $(e.target),
            i = t.closest(".media-library-list-item").data("item");
        i && (
            this.selectedItems.size() > 0 || t.closest(".select-button").length ?
            e.shiftKey ? this.toggleSelectionThrough(i) : (this.lastSelectedItem = i, this.toggleSelection(i)) :
            t.closest(".label-button").length ? this.editLabel(i) :
            t.closest(".inline-button").length ? this.toggleInline(i) :
            this.itemSelected.dispatch(i.model)
        ),
        this.domElement.off("vmousemove", this.onMouseMove),
        this.domElement.off("vmouseup", this.onMouseUp),
        e.preventDefault()
    },
    onListScrolled: function() {
        this.loadItemsInView()
    },
    onDeleteSelectionClicked: function() {
        this.deleteSelection()
    },
    onUntagSelectionClicked: function() {
        if (this.filterBData && this.filterBData.type === SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG) {
            var e = this.selectedItems.map(function(e) {
                return e.model
            });
            this.tags.removeTagFrom(this.filterBData.tag, e), this.applyFilter(), this.clearSelection()
        }
    },
    onClearSelectionClicked: function() {
        this.clearSelection()
    }
};

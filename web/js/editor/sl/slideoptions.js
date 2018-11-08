'use strict';

export const slideoptions = {
    init: function(e, t) {
        this.editor = e, this.options = $.extend({
            removeSlide: !0,
            backgroundColor: !0,
            backgroundImage: !0,
            customClasses: !0,
            fragment: !0,
            notes: !0,
            html: !0
        }, t), this.render(),
        this.bind()
    },
    render: function() {
        this.domElement = $('<div class="slide-options"></div>').appendTo($(".projector")),
        this.listElement = $("<ul></ul>").appendTo(this.domElement),
        this.renderOptions()
    },
    configure: function(e) {
        this.options = $.extend(this.options, e),
        this.renderOptions()
    },
    renderOptions: function() {
        this.removeSlideElement && this.removeSlideElement.remove(),
        this.backgroundColorElement && this.backgroundColorElement.remove(),
        this.backgroundImageElement && this.backgroundImageElement.remove(),
        this.backgroundImageMenu && this.backgroundImageMenu.remove(),
        this.customClassesElement && this.customClassesElement.remove(),
        // this.fragmentElement && this.fragmentElement.remove(),
        // this.notesElement && this.notesElement.remove(),
        this.htmlElement && this.htmlElement.remove(),
        this.options.removeSlide && (this.removeSlideElement = this.renderOption("remove-slide", "i-trash-stroke", "Remove current slide"),
        this.removeSlideElement.on("vclick", this.onRemoveSlideClicked.bind(this))),
        this.options.backgroundColor && (this.backgroundColorElement = this.renderOption("background", "i-droplet", "Slide background color"),
        this.backgroundColorElement.on("vclick", this.onBackgroundColorClicked.bind(this))),
        this.options.backgroundImage && (this.backgroundImageElement = this.renderOption("background-image", "i-picture", "Slide background image"),
        this.renderBackgroundImageMenu(), this.backgroundImageElement.on("vclick", this.onBackgroundImageClicked.bind(this)),
        this.backgroundImageMenu.find(".background-size").on("change", this.onBackgroundImageSizeChanged.bind(this)),
        this.backgroundImageMenu.find(".remove-background").on("click", this.onBackgroundImageRemoveClicked.bind(this))),
        this.options.customClasses && (this.customClassesElement = this.renderOption("custom-classes", "i-star", "Slide classes"),
        this.customClassesElement.on("vclick", this.onCustomClassesClicked.bind(this)),
        this.syncCustomClasses()),
        // this.options.fragment && (this.fragmentElement = this.renderOption("fragment", "i-bolt", "Create fragments<br>(SHIFT + ALT + F)"),
        // this.fragmentElement.on("vclick", this.onFragmentClicked.bind(this))),
        // this.options.notes && (this.notesElement = this.renderOption("notes", "i-book-alt2", "Speaker notes<br>(SHIFT + ALT + N)"),
        // this.notesElement.on("vclick", this.onNotesClicked.bind(this))),
        this.options.html && (this.htmlElement = this.renderOption("html", "i-file-xml", "Edit HTML<br>(SHIFT + ALT + H)"),
        this.htmlElement.on("vclick", this.onHTMLClicked.bind(this)))
    },
    renderOption: function(e, t, i) {
        var n = $('<li><span class="icon ' + t + '"></span></li>');
        return n.attr({
            "class": "slide-option " + e,
            "data-tooltip": i,
            "data-tooltip-alignment": "l"
        }), n.appendTo(this.listElement), n
    },
    renderBackgroundImageMenu: function() {
        this.backgroundImageMenu = $('<div class="background-image-menu">').appendTo(this.domElement), this.backgroundImageInner = $('<div class="inner"></div>').appendTo(this.backgroundImageMenu);
        var e = $('<div class="upload-progress"></div>').appendTo(this.backgroundImageInner);
        e.append('<span class="spinner centered"></span>'), e.append('<span class="label">Uploading...</span>'), SL.util.html.generateSpinners();
        var t = $('<div class="upload-output"></div>').appendTo(this.backgroundImageInner);
        t.append('<div class="thumbnail"></div>');
        var i = $('<div class="background-image-options"></div>').appendTo(t);
        i.append(['<select class="sl-select white background-size">', '<option value="cover">Stretch</option>', '<option value="contain">Fit</option>', '<option value="initial">Original</option>', "</select>"].join("")), i.append('<button class="button remove-background">Remove</button>')
    },
    bind: function() {
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this), $(document).on("mousedown touchstart", this.onDocumentMouseDown), SL.editor.controllers.Markup.slidesChanged.add(this.syncRemoveSlide.bind(this))
    },
    collapse: function() {
        this.hideOpenPanels()
    },
    hideOpenPanels: function() {
        this.backgroundColorMenu && this.hideBackgroundColorMenu(), this.backgroundImageMenu && this.hideBackgroundImageMenu()
    },
    hasOpenPanel: function() {
        return this.backgroundColorMenu && this.backgroundColorMenu.hasClass("show") || this.backgroundImageMenu && this.backgroundImageMenu.hasClass("show")
    },
    showOverflowWarning: function() {
        this.overflowWarning ||
        //SL.editor.controllers.Capabilities.isTouchEditor() ||
        (this.overflowWarning = $('<div class="overflow-warning"><span class="icon i-info"></span></div>'),
        this.overflowWarning.attr({
            "class": "overflow-warning",
            "data-tooltip": "Please keep content inside of the dotted outline. Content placed outside may not be visible on all display sizes.",
            "data-tooltip-maxwidth": 300,
            "data-tooltip-alignment": "l"
        })),
        this.overflowWarning && 0 === this.overflowWarning.parent().length && this.overflowWarning.appendTo(this.domElement)
    },
    hideOverflowWarning: function() {
        this.overflowWarning && this.overflowWarning.remove()
    },
    syncRemoveSlide: function() {
        this.removeSlideElement && this.removeSlideElement.toggleClass("disabled", $(".reveal .slides section").length < 2)
    },
    syncCustomClasses: function() {
        var e = this.editor.getCurrentTheme();
        if (e) {
            var t = SL.util.string.getCustomClassesFromLESS(e.get("less"));
            this.customClassesElement.toggleClass("disabled", 0 === t.length)
        }
    },
    syncBackgroundImageMenu: function() {
        var e = $(Reveal.getCurrentSlide()),
            t = e.attr("data-background-image"),
            i = e.attr("data-background-size"),
            n = this.backgroundImageMenu.find(".upload-output .thumbnail"),
            r = this.backgroundImageMenu.find(".upload-output .background-size");
        "string" == typeof t && t.length ? (n.css({
            "background-image": 'url("' + t + '")',
            "background-repeat": "no-repeat",
            "background-size": "cover"
        }),
        r.val(i || "cover"),
        this.backgroundImageMenu.attr("data-state", "uploaded"),
        this.backgroundImageMenu.addClass("show")) : this.backgroundImageModel ? (n.css("background-image", "none"),
        this.backgroundImageMenu.attr("data-state", "uploading"),
        this.backgroundImageMenu.addClass("show")) : (n.css("background-image", "none"),
        this.backgroundImageMenu.attr("data-state", ""),
        this.backgroundImageMenu.removeClass("show"))
    },
    // triggerNotes: function() {
    //     if (!this.notesPrompt) {
    //         SL.util.deck.afterSlidesChanged();
    //         var e = $(Reveal.getCurrentSlide()).attr("data-id"),
    //             t = "",
    //             i = "http://help.slides.com/knowledgebase/articles/729753-sharing-decks-with-speaker-notes";
    //         t = SLConfig.deck.share_notes === !0 ? 'Your notes are <a href="' + i + '" target="_blank">publicly visible</a>.' : 'Your notes are private, learn how to <a href="' + i + '" target="_blank">share them</a>.', this.notesPrompt = SL.prompt({
    //             anchor: this.notesElement,
    //             alignment: this.getPopoverAlignment(),
    //             title: "Speaker Notes",
    //             subtitle: t,
    //             type: "input",
    //             confirmLabel: "Save",
    //             data: {
    //                 value: SLConfig.deck.notes[e],
    //                 placeholder: "Enter notes in plain text...",
    //                 multiline: !0,
    //                 maxlength: SL.config.SPEAKER_NOTES_MAXLENGTH,
    //                 maxlengthHidden: !0,
    //                 confirmBeforeDiscard: !0
    //             }
    //         }), this.notesPrompt.confirmed.add(function(t) {
    //             SLConfig.deck.notes[e] = t, SLConfig.deck.dirty = !0, SL.analytics.trackEditor("Saved notes")
    //         }), this.notesPrompt.destroyed.add(function() {
    //             this.notesPrompt = null
    //         }.bind(this))
    //     }
    // },
    triggerHTML: function() {
        var e = SL.popup.open(SL.components.popup.EditSlideHTML, {
            slide: Reveal.getCurrentSlide()
        });
        e.saved.add(function(e) {
            SL.editor.controllers.Markup.writeHTMLToCurrentSlide(e), $(Reveal.getCurrentSlide()).find("style").each(function() {
                SL.util.prefixSelectorsInStyle(this, ".reveal ")
            }), Reveal.sync()
        }.bind(this)), SL.analytics.trackEditor("Edit per-slide HTML")
    },
    triggerCustomClasses: function() {
        if (!this.customClassesPrompt) {
            var e = this.editor.getCurrentTheme();
            if (e) {
                var t = SL.util.string.getCustomClassesFromLESS(e.get("less"));
                if (t.length) {
                    var i = $(Reveal.getCurrentSlide()),
                        n = t.map(function(e) {
                            return {
                                value: e,
                                selected: i.hasClass(e),
                                callback: function(e) {
                                    i.toggleClass(e), Reveal.sync()
                                }
                            }
                        });
                    this.customClassesPrompt = SL.prompt({
                        anchor: this.customClassesElement,
                        alignment: this.getPopoverAlignment(),
                        title: "Slide classes",
                        type: "list",
                        data: n,
                        multiselect: !0,
                        optional: !0
                    }), this.customClassesPrompt.destroyed.add(function() {
                        this.customClassesPrompt = null
                    }.bind(this))
                }
            }
        }
    },
    triggerBackgroundImageBrowser: function() {
        var e = Reveal.getCurrentSlide(),
            t = Reveal.getIndices(e),
            i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                select: SL.models.Media.IMAGE
            });
        i.selected.addOnce(function(i) {
            this.backgroundImageModel = i,
            this.syncBackgroundImageMenu(),
            i.isUploaded() ? this.onBackgroundImageUploadSuccess(e, t) : (i.uploadCompleted.add(function() {
                this.onBackgroundImageUploadSuccess(e, t)
            }.bind(this)), i.uploadFailed.add(this.onBackgroundImageUploadError.bind(this)))
        }.bind(this))
    },
    hideBackgroundColorMenu: function() {
        SL.view.colorpicker.hide()
    },
    hideBackgroundImageMenu: function() {
        this.backgroundImageMenu.removeClass("show")
    },
    setBackgroundColor: function(e) {
        Reveal.getCurrentSlide().setAttribute("data-background-color", e), Reveal.sync(), SL.editor.controllers.Contrast.sync()
    },
    clearBackgroundColor: function() {
        Reveal.getCurrentSlide().removeAttribute("data-background-color"), Reveal.sync(), SL.editor.controllers.Contrast.sync()
    },
    setAlignment: function(e) {
        this.alignment !== e && (this.alignment = e, this.domElement.attr("data-alignment", e), this.domElement.find(".slide-option[data-tooltip]").attr("data-tooltip-alignment", this.getPopoverAlignment()))
    },
    getPopoverAlignment: function() {
        return "l" === this.domElement.attr("data-alignment") ? "r" : "l"
    },
    getWidth: function() {
        return this.width || (this.width = this.domElement.width()), this.width
    },
    onRemoveSlideClicked: function(e) {
        SL.editor.controllers.Blocks.blur(), SL.prompt({
            anchor: $(e.currentTarget),
            title: SL.locale.get("DECK_DELETE_SLIDE_CONFIRM"),
            alignment: this.getPopoverAlignment(),
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Remove</h3>",
                selected: !0,
                className: "negative",
                callback: function() {
                    SL.editor.controllers.Markup.removeCurrentSlide()
                }.bind(this)
            }]
        }), e.preventDefault()
    },
    // onFragmentClicked: function(e) {
    //     e.preventDefault(), SL.editor.controllers.Mode.change("fragment")
    // },
    onBackgroundColorClicked: function(e) {
        e.preventDefault(), this.hideBackgroundImageMenu();
        var t = {
                anchor: this.backgroundColorElement,
                alignment: this.getPopoverAlignment(),
                alpha: !1,
                changeCallback: this.setBackgroundColor.bind(this),
                resetCallback: this.clearBackgroundColor.bind(this)
            },
            i = Reveal.getCurrentSlide();
        i.hasAttribute("data-background-color") && (t.color = i.getAttribute("data-background-color")), SL.view.colorpicker.toggle(t), SL.analytics.trackEditor("Toggle background color menu")
    },
    onBackgroundImageClicked: function(e) {
        e.preventDefault(), this.syncBackgroundImageMenu(), this.hideBackgroundColorMenu();
        var t = 144,
            i = 36;
        this.backgroundImageMenu.addClass("immediate"), this.backgroundImageMenu.css("top", this.backgroundImageElement.position().top - (t - i) / 2), setTimeout(function() {
            this.backgroundImageMenu.removeClass("immediate")
        }.bind(this), 1), "" === this.backgroundImageMenu.attr("data-state") && this.triggerBackgroundImageBrowser(), SL.analytics.trackEditor("Toggle background image menu")
    },
    onBackgroundImageRemoveClicked: function(e) {
        Reveal.getCurrentSlide().removeAttribute("data-background-image"), Reveal.sync(), this.syncBackgroundImageMenu(), SL.analytics.trackEditor("Remove background image"), e.preventDefault()
    },
    onBackgroundImageSizeChanged: function() {
        var e = this.backgroundImageMenu.find(".background-size");
        Reveal.getCurrentSlide().setAttribute("data-background-size", e.val()), Reveal.sync(), this.syncBackgroundImageMenu()
    },
    onBackgroundImageUploadSuccess: function(e, t) {
        var i = this.backgroundImageModel.get("url");
        e.setAttribute("data-bg-img", i), /*e.setAttribute("data-background-image", i), Reveal.sync(),*/ t && 0 === t.h && 0 === t.v && SL.editor.controllers.Thumbnail.generate(), SL.util.color.getImageColor(i).then(function(t) {
            e.hasAttribute("data-background-image") && t.a > .95 && e.setAttribute("data-background-color", "rgb(" + t.r + "," + t.g + "," + t.b + ")"), Reveal.sync()
        }, function() {}), this.backgroundImageModel = null, this.syncBackgroundImageMenu()
    },
    onBackgroundImageUploadError: function() {
        this.backgroundImageModel = null, this.syncBackgroundImageMenu()
    },
    onHTMLClicked: function(e) {
        e.preventDefault(), SL.editor.controllers.Blocks.blur(), this.triggerHTML()
    },
    onNotesClicked: function(e) {
        e.preventDefault(), this.triggerNotes()
    },
    onCustomClassesClicked: function(e) {
        e.preventDefault(), this.triggerCustomClasses()
    },
    onDocumentMouseDown: function(e) {
        var t = $(e.target);
        0 === t.parents(".slide-options, .sl-popup").length && this.collapse()
    }
};

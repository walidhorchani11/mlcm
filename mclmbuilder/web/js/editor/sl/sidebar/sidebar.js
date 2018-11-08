'use strict';

export const sidebar = {
    init: function(e) {
        this.options = e || {}, this.sidebarElement = $(".sidebar"),
        this.sidebarPrimary = this.sidebarElement.find(".primary"),
        this.sidebarSecondary = this.sidebarElement.find(".secondary"),
        this.sidebarHeader = this.sidebarElement.find(".global-header"),
        this.sidebarScrollShadowTop = this.sidebarElement.find(".scroll-shadow-top"),
        this.sidebarScrollShadowBottom = this.sidebarElement.find(".scroll-shadow-bottom"),
        this.panelElement = $(".sidebar-panel"),
        this.saveButton = this.sidebarElement.find(".button.save"),
        this.previewButton = this.sidebarElement.find(".button.preview"),
        this.undoButton = this.sidebarElement.find(".button.undo"),
        this.exportButton = this.sidebarElement.find(".button.export"),
        this.importButton = this.sidebarElement.find(".button.import"),
        this.publishButton = this.sidebarElement.find(".button.publish"),
        this.settingsButton = this.sidebarElement.find(".button.settings"),
        this.revisionsButton = this.sidebarElement.find(".button.revisions"),
        this.popinButton = this.sidebarElement.find(".button.popin"),
        this.referenceButton = this.sidebarElement.find(".button.parameters-popin-list"),
        this.medialibraryButton = this.sidebarElement.find(".button.medialibrary"),
        this.arrangeButton = this.sidebarElement.find(".button.arrange"),
        this.styleButton = this.sidebarElement.find(".button.style"),
        this.shareButton = this.sidebarElement.find(".button.share"),
        this.presentButton = this.sidebarElement.find(".button.present"),
        // this.previewButton && this.previewButton.attr("data-tooltip", "Preview (" + SL.util.getMetaKeyName() + " + F)"),
        // this.undoButton && this.undoButton.attr("data-tooltip", "Undo (" + SL.util.getMetaKeyName() + " + Z)"),
        this.savePresentationSettings = this.panelElement.find(".button.save"),
        this.cancelPresentationSettings = this.panelElement.find(".button.cancel"),
        this.currentPanel = null,
        this.createSignals(),
        this.render(),
        this.bind(),
        this.layout(),
        this.updatePublishButton(),
        //this.updateUndoButton(),
        this.updatePresentButton()
        // SL.editor.controllers.Capabilities.canExport() || this.exportButton.hide(),
        // SL.editor.controllers.Capabilities.canPresent() || this.presentButton.hide(),
        // SL.editor.controllers.Capabilities.canShareDeck() || this.shareButton.hide(),
        // SL.editor.controllers.Capabilities.canChangeStyles() || this.styleButton.hide(),
        // SL.editor.controllers.Capabilities.canSetVisibility() || this.publishButton.hide()
    },
    bind: function() {
        this.saveButton.on("vclick", this.onSaveClicked.bind(this)),
        this.previewButton && this.previewButton.on("vclick", this.onPreviewClicked.bind(this)),
        this.undoButton && this.undoButton.on("vclick", this.onUndoClicked.bind(this)),
        this.exportButton && this.exportButton.on("vclick", this.onExportClicked.bind(this)),
        this.importButton && this.importButton.on("vclick", this.onImportClicked.bind(this)),
        this.settingsButton.on("vclick", this.onSettingsClicked.bind(this)),
        this.revisionsButton.on("vclick", this.onRevisionsClicked.bind(this)),
        this.popinButton.on("vclick", this.onPopinClicked.bind(this)),
        this.referenceButton.on("vclick", this.onReferenceClicked.bind(this)),
        this.medialibraryButton.on("vclick", this.onMediaLibraryClicked.bind(this)),
        this.publishButton.on("vclick", this.onPublishClicked.bind(this)),
        this.arrangeButton.on("vclick", this.onArrangeClicked.bind(this)),
        this.styleButton.on("vclick", this.onStyleClicked.bind(this)),
        this.shareButton.on("vclick", this.onShareClicked.bind(this)),
        this.presentButton.on("vclick", this.onPresentClicked.bind(this)),
        this.panelElement.on("vclick", this.onPanelElementClicked.bind(this)),
        this.sidebarSecondary.on("scroll", this.layout.bind(this)),
        this.settingsPanel.onclose.add(this.close.bind(this)),
        this.exportPanel.onclose.add(this.close.bind(this)),
        this.importPanel.onclose.add(this.close.bind(this)),
        this.revisionsPanel.onclose.add(this.close.bind(this)),
        this.referencePanel.onclose.add(this.close.bind(this)),
        this.stylePanel.onclose.add(this.close.bind(this)),
        this.popinPanel.onclose.add(this.close.bind(this)),
        $(window).on("resize", this.layout.bind(this)),
        SL.editor.controllers.History.changed.add(this.updateUndoButton.bind(this)),
        SL.editor.controllers.URL.changed.add(this.updatePresentButton.bind(this))
    },
    createSignals: function() {
        this.saveClicked    = new signals.Signal,
        this.previewClicked = new signals.Signal
    },
    render: function() {
        this.referencePanel = new SL.editor.components.sidebar.reference,
        this.popinPanel     = new SL.editor.components.sidebar.popin,
        this.revisionsPanel = new SL.editor.components.sidebar.Revisions,
        this.settingsPanel  = new SL.editor.components.sidebar.Settings,
        this.exportPanel    = new SL.editor.components.sidebar.Export,
        this.importPanel    = new SL.editor.components.sidebar.Import,
        this.stylePanel     = new SL.editor.components.sidebar.Style
        //this.renderMoreOptions()
    },
    // renderMoreOptions: function() {
    //     var e = [{
    //         label: "Help & feedback",
    //         icon: "question-mark",
    //         url: "",
    //         urlTarget: "_blank"
    //     }, {
    //         label: "Make a copy of this deck",
    //         icon: "fork",
    //         callback: function() {
    //             SL.analytics.trackEditor("Sidebar: Duplicate deck"), SL.editor.controllers.API.forkDeck()
    //         }.bind(this)
    //     }];
    //     SL.editor.controllers.Capabilities.canDeleteDeck() && e.push({
    //         label: "Delete deck",
    //         icon: "trash-fill",
    //         callback: function() {
    //             SL.analytics.trackEditor("Sidebar: Delete deck"), SL.editor.controllers.API.deleteDeck()
    //         }.bind(this)
    //     }),
    //     this.moreOptionsElement = this.sidebarElement.find(".more-options"), this.moreOptions = new SL.components.Menu({
    //         anchor: this.moreOptionsElement,
    //         anchorSpacing: 10,
    //         alignment: "r",
    //         showOnHover: !0,
    //         options: e
    //     })
    // },
    layout: function() {
        var e = window.innerHeight - (this.sidebarPrimary.outerHeight(!0) + this.sidebarHeader.outerHeight(!0));
        this.sidebarSecondary.css("max-height", e);
        var t = this.sidebarSecondary.scrollTop(),
            i = this.sidebarSecondary.prop("scrollHeight"),
            n = this.sidebarSecondary.outerHeight(),
            r = i > n,
            o = t / (i - n);
        this.sidebarScrollShadowBottom.css({
            opacity: r ? 1 - o : 0,
            bottom: this.sidebarHeader.outerHeight()
        }), this.sidebarScrollShadowTop.css({
            opacity: r ? o : 0,
            top: this.sidebarSecondary.offset().top
        })
    },
    open: function(e) {
        switch (this.currentPanel && this.currentPanel.close(), SL.editor.controllers.Mode.clear(), e) {
            case "settings":
                this.currentPanel = this.settingsPanel;
                SL.editor.controllers.Blocks.blur();
                break;
            case "export":
                this.currentPanel = this.exportPanel;
                break;
            case "import":
                this.currentPanel = this.importPanel;
                break;
            case "style":
                this.currentPanel = this.stylePanel;
                break;
            case "revisions":
                this.currentPanel = this.revisionsPanel;
                break;
            case "parameters-popin-list":
                this.currentPanel = this.referencePanel;
                break;
            case "popin":
                this.currentPanel = this.popinPanel;
                break;
        }
        this.setActiveButton(e),
        this.currentPanel.open(),
        this.panelElement.addClass("visible"),
        SL.analytics.trackEditor("Open panel", e)
    },
    close: function(e) {
        this.currentPanel && (e === !0 && this.currentPanel.save(), this.currentPanel.close()),
        this.setActiveButton(null),
        this.panelElement.removeClass("visible")
    },
    toggle: function(e) {
        this.isExpanded(e) ? this.close() : this.open(e)
    },
    setActiveButton: function(e) {
        e ? (
            this.sidebarElement.addClass("has-active-panel"),
            this.sidebarSecondary.addClass('forbidden-click'),
            this.sidebarSecondary.find(".active").removeClass("active"),
            this.sidebarSecondary.find(".button." + e).addClass("active")
        ) : (
            this.sidebarElement.removeClass("has-active-panel"),
            this.sidebarSecondary.removeClass('forbidden-click'),
            this.sidebarSecondary.find(".active").removeClass("active")
        )
    },
    isExpanded: function(e) {
        return e ? this.panelElement.find("." + e).hasClass("visible") : this.panelElement.hasClass("visible")
    },
    updateSaveButton: function(e, t) {
        this.saveButton.attr({
            "class": "button save " + (e || ""),
            "data-tooltip": t || ""
        })
    },
    updateSaveButtonStatus: function(e, t) {
        this.saveButton
            .attr({
                "disabled": e
            })
            .closest('.saveBtn').attr({
                'data-tooltip': t || ""
            })
    },
    updatePublishButton: function() {
        var e = this.publishButton.find(".icon");
        SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF ? e.removeClass("i-unlock-stroke").addClass("i-lock-stroke") : SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_TEAM ? e.removeClass("i-lock-stroke").addClass("i-unlock-stroke") : SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_ALL && e.removeClass("i-lock-stroke").addClass("i-unlock-stroke"), SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF || SL.util.user.isPro() ? this.publishButton.attr("data-tooltip", "Visibility") : this.publishButton.attr("data-tooltip", "<strong>This presentation is public.</strong><br>You need a Pro account to save <br>privately. Click to learn more.")
    },
    updateArrangeButton: function(e) {
        this.setActiveButton("arranging" === e ? "arrange" : null)
    },
    updateUndoButton: function() {
        this.undoButton && this.undoButton.toggleClass("disabled", !SL.editor.controllers.History.canUndo())
    },
    updatePresentButton: function() {
        this.presentButton && SLConfig.deck.slug && this.presentButton.attr("href", SL.routes.DECK_LIVE(SLConfig.deck.user.username, SLConfig.deck.slug))
    },
    onSaveClicked: function(e) {
        e.preventDefault(),
        this.saveClicked.dispatch()
        if (!$(e).attr('disabled')) {
            $(e).closest('.saveBtn').tooltip('show');
        }
    },
    onPreviewClicked: function(e) {
        //e.preventDefault(), this.previewClicked.dispatch()
    },
    onUndoClicked: function(e) {
        e.preventDefault(), SL.editor.controllers.History.undo({
            ignoreMode: !0
        }),
        SL.analytics.trackEditor("Undo clicked")
    },
    onExportClicked: function() {
        var e = $(".reveal .slides").children().map(function() {
            var e = $(this).clone();
            return e.find("section").add(e).each(function() {
                var e = $.map(this.attributes, function(e) {
                        return e.name
                    }),
                    t = $(this);
                $.each(e, function(e, i) {
                    t.removeAttr(i)
                })
            }), e.wrap("<div>").parent().html()
        }).toArray().join("");
        return e = '<div class="slides">' + e + "</div>", $(".sidebar .export textarea").text(SL.util.html.indent(e)), this.toggle("export"), !1
    },
    onImportClicked: function() {
        return this.toggle("import"), !1
    },
    onArrangeClicked: function() {
        return this.close(),
        SL.editor.controllers.Mode.toggle("arrange"),
        !1
        //$('button.btn-clm-map.arrange').removeClass('active')
    },
    onSettingsClicked: function() {
        return this.toggle("settings"), !1
    },
    onRevisionsClicked: function() {
        return this.toggle("revisions"), !1
    },
    onReferenceClicked: function() {
        return this.toggle("parameters-popin-list"), !1
    },
    onPopinClicked: function() {
        return this.toggle("popin"), !1
    },
    onMediaLibraryClicked: function() {
        return SL.popup.open(SL.editor.components.medialibrary.MediaLibrary), !1
    },
    onStyleClicked: function() {
        return this.toggle("style"), !1
    },
    onShareClicked: function() {
        /*return SL.popup.open(SL.components.decksharer.DeckSharer, {
         deck: SL.current_deck
         }), !1*/

        return this.toggle("share"), !1
    },
    onPresentClicked: function() {
        SL.analytics.trackEditor("Sidebar: Present")
    },
    onPublishClicked: function(e) {
        if (e.preventDefault(), SL.util.user.isPro() || SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF) {
            var t = [];
            t.push({
                html: SL.locale.get("DECK_VISIBILITY_CHANGE_SELF"),
                selected: SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF,
                callback: function() {
                    SLConfig.deck.visibility = SL.models.Deck.VISIBILITY_SELF, SL.view.saveVisibility(), this.updatePublishButton(), SL.analytics.trackEditor("Visibility changed", "self")
                }.bind(this)
            }),
                SL.current_user.isEnterprise() && t.push({
                html: SL.locale.get("DECK_VISIBILITY_CHANGE_TEAM"),
                selected: SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_TEAM,
                className: "divider",
                callback: function() {
                    SLConfig.deck.visibility = SL.models.Deck.VISIBILITY_TEAM, SL.view.saveVisibility(), this.updatePublishButton(), SL.analytics.trackEditor("Visibility changed", "team")
                }.bind(this)
            }), t.push({
                html: SL.locale.get("DECK_VISIBILITY_CHANGE_ALL"),
                selected: SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_ALL,
                callback: function() {
                    SLConfig.deck.visibility = SL.models.Deck.VISIBILITY_ALL, SL.view.saveVisibility(), this.updatePublishButton(), SL.analytics.trackEditor("Visibility changed", "all")
                }.bind(this)
            }),
            SL.prompt({
                anchor: this.publishButton,
                alignment: "r",
                type: "select",
                className: "sl-visibility-prompt",
                data: t
            }),
            SL.analytics.trackEditor("Visibility menu opened", SLConfig.deck.visibility)
        } else window.open("/pricing"), SL.analytics.trackEditor("Click upgrade link", "visibility button")
    },
    onPanelElementClicked: function(e) {
        //e.target == this.panelElement.get(0) && this.close()
    }
};

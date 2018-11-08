'use strict';

export const panel = {
    init: function(e) {
        this.options = e || {},
        this.panelElements = $(".sidebar"),
        this.sidebarPrimary = this.panelElements.find(".primary"),
        this.sidebarSecondary = this.panelElements.find(".secondary"),
        this.sidebarHeader = this.panelElements.find(".global-header"),
        this.sidebarScrollShadowTop = this.panelElements.find(".scroll-shadow-top"),
        this.sidebarScrollShadowBottom = this.panelElements.find(".scroll-shadow-bottom"),
        this.panelElementContent = $(".sidebar-panel"),
        // Panels : declarations
        this.saveButton = this.panelElements.find(".button.save"),
        this.previewButton = this.panelElements.find(".button.preview"),
        this.undoButton = this.panelElements.find(".button.undo"),
        this.presentationSettingsButton = $('.button.presentation-settings'),
        this.arrangeButton = this.panelElements.find(".button.arrange"),
        this.screenSettingsButton = this.panelElements.find(".button.screen-settings"),
        this.rcpListButton = this.panelElements.find(".button.rcp-list"),

        this.exportButton = this.panelElements.find(".button.export"),
        this.importButton = this.panelElements.find(".button.import"),
        this.publishButton = this.panelElements.find(".button.publish"),
        this.settingsButton = this.panelElements.find(".button.settings"),

        this.revisionsButton = this.panelElements.find(".button.revisions"),
        this.popinButton = this.panelElements.find(".button.popin"),
        this.referenceButton = this.panelElements.find(".button.parameters-popin-list"),
        this.medialibraryButton = this.panelElements.find(".button.medialibrary"),
        // this.shareButton = this.panelElements.find(".button.share"),
        this.presentButton = this.panelElements.find(".button.present"),
        // this.previewButton && this.previewButton.attr("data-tooltip", "Preview (" + SL.util.getMetaKeyName() + " + F)"),
        // this.undoButton && this.undoButton.attr("data-tooltip", "Undo (" + SL.util.getMetaKeyName() + " + Z)"),
        // this.savePresentationSettings = this.panelElementContent.find(".button.save"),
        // this.cancelPresentationSettings = this.panelElementContent.find(".button.cancel"),
        this.currentPanel = null,
        this.createSignals(),
        this.render(),
        this.bind(),
        this.layout(),
        //this.updatePublishButton(),
        //this.updateUndoButton(),
        this.updatePresentButton()
    },
    bind: function() {
        this.saveButton.on("vclick", this.onSaveClicked.bind(this)),
        this.previewButton && this.previewButton.on("vclick", this.onPreviewClicked.bind(this)),
        this.undoButton && this.undoButton.on("vclick", this.onUndoClicked.bind(this)),
        this.presentationSettingsButton.on("vclick", this.onPresentationSettingsClicked.bind(this)),
        this.screenSettingsButton.on("vclick", this.onSettingsClicked.bind(this)),
        this.rcpListButton.on("vclick", this.onRcpListClicked.bind(this)),

        this.exportButton && this.exportButton.on("vclick", this.onExportClicked.bind(this)),
        this.importButton && this.importButton.on("vclick", this.onImportClicked.bind(this)),

        this.revisionsButton.on("vclick", this.onRevisionsClicked.bind(this)),
        this.popinButton.on("vclick", this.onPopinClicked.bind(this)),
        this.referenceButton.on("vclick", this.onReferenceClicked.bind(this)),
        this.medialibraryButton.on("vclick", this.onMediaLibraryClicked.bind(this)),
        this.publishButton.on("vclick", this.onPublishClicked.bind(this)),
        this.arrangeButton.on("vclick", this.onArrangeClicked.bind(this)),
        // this.shareButton.on("vclick", this.onShareClicked.bind(this)),
        this.presentButton.on("vclick", this.onPresentClicked.bind(this)),
        this.panelElementContent.on("vclick", this.onPanelElementClicked.bind(this)),
        this.sidebarSecondary.on("scroll", this.layout.bind(this)),

        // this.exportPanel.onclose.add(this.close.bind(this)),
        // this.importPanel.onclose.add(this.close.bind(this)),
        // this.revisionsPanel.onclose.add(this.close.bind(this)),
        // this.referencePanel.onclose.add(this.close.bind(this)),
        this.presenationSettingsPanel.onclose.add(this.close.bind(this)),
        this.screenSettingsPanel.onclose.add(this.close.bind(this)),
        this.rcpListPanel.onclose.add(this.close.bind(this)),
        // this.popinPanel.onclose.add(this.close.bind(this)),
        $(window).on("resize", this.layout.bind(this)),
        SL.editor.controllers.History.changed.add(this.updateUndoButton.bind(this)),
        SL.editor.controllers.URL.changed.add(this.updatePresentButton.bind(this))
    },
    createSignals: function() {
        this.saveClicked    = new signals.Signal,
        this.previewClicked = new signals.Signal
    },
    render: function() {
        this.presenationSettingsPanel   = new SL.editor.components.panel.Presentationsettings,
        this.screenSettingsPanel        = new SL.editor.components.panel.Screensettings,
        this.rcpListPanel               = new SL.editor.components.panel.Rcplist
        // this.referencePanel             = new SL.editor.components.panel.reference,
        // this.popinPanel                 = new SL.editor.components.panel.popin,
        // this.revisionsPanel             = new SL.editor.components.panel.Revisions,
        // this.exportPanel                = new SL.editor.components.panel.Export,
        // this.importPanel                = new SL.editor.components.panel.Import,
        // this.stylePanel                 = new SL.editor.components.panel.Style
        //this.renderMoreOptions()
    },
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
        console.log(e);
        switch (this.currentPanel && this.currentPanel.close(), SL.editor.controllers.Mode.clear(), e) {
            case "presentation-settings":
                this.currentPanel = this.presenationSettingsPanel;
                SL.editor.controllers.Blocks.blur();
                break;
            case "screen-settings":
                this.currentPanel = this.screenSettingsPanel;
                break;
            case "rcp-list":
                this.currentPanel = this.rcpListPanel;
                break;
            // case "export":
            //     this.currentPanel = this.exportPanel;
            //     break;
            // case "import":
            //     this.currentPanel = this.importPanel;
            //     break;
            // case "style":
            //     this.currentPanel = this.stylePanel;
            //     break;
            // case "revisions":
            //     this.currentPanel = this.revisionsPanel;
            //     break;
            // case "parameters-popin-list":
            //     this.currentPanel = this.referencePanel;
            //     break;
            // case "popin":
            //     this.currentPanel = this.popinPanel;
            //     break;
        }
        this.setActiveButton(e),
        this.currentPanel.open(),
        this.panelElementContent.addClass("visible"),
        SL.analytics.trackEditor("Open panel", e)
    },
    close: function(e) {
        this.currentPanel && (e === !0 && this.currentPanel.save(), this.currentPanel.close()),
        this.setActiveButton(null),
        this.panelElementContent.removeClass("visible")
    },
    toggle: function(e) {
        this.isExpanded(e) ? this.close() : this.open(e)
    },
    setActiveButton: function(e) {
        e ? (
            this.panelElements.addClass("has-active-panel"),
            this.sidebarSecondary.addClass('forbidden-click'),
            this.sidebarSecondary.find(".active").removeClass("active"),
            this.sidebarSecondary.find(".button." + e).addClass("active")
        ) : (
            this.panelElements.removeClass("has-active-panel"),
            this.sidebarSecondary.removeClass('forbidden-click'),
            this.sidebarSecondary.find(".active").removeClass("active")
        )
    },
    isExpanded: function(e) {
        return e ? this.panelElementContent.find("." + e).hasClass("visible") : this.panelElementContent.hasClass("visible")
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
        return this.toggle("screen-settings"), !1
    },
    onRcpListClicked: function() {
        return this.toggle("rcp-list"), !1
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
    onPresentationSettingsClicked: function() {
        return this.toggle("presentation-settings"), !1
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

'use strict';

export const popinsSettingsPanel = {
    init: function() {
        this.init_param_popup_w     = 600,
        this.init_param_popup_w_min = 300,
        this.init_param_popup_w_max = 1024,
        this.init_param_popup_h     = 400,
        this.init_param_popup_h_min = 300,
        this.init_param_popup_h_max = 768,
        this.domElement = $(".sidebar-panel .export"),
        this.bodyElement = this.domElement.find(".panel-body"),
        // this.htmlOutputElement = this.domElement.find(".deck-html-contents"),
        // this.cssOutputElement = this.domElement.find(".deck-css-contents"),
        // this.downloadRevealElement = this.domElement.find(".section.download-reveal"),
        // this.downloadHTMLButton = this.domElement.find(".download-html-button"),
        // this.downloadPDFElement = this.domElement.find(".section.download-pdf"),
        // this.downloadZIPElement = this.domElement.find(".section.download-zip"),
        // this.downloadPDFElement.length && (this.pdf = new SL.editor.components.sidebar.Export.PDF(this.downloadPDFElement),
        // this.pdf.heightChanged.add(this.layout.bind(this))),
        // this.downloadZIPElement.length && (this.zip = new SL.editor.components.sidebar.Export.ZIP(this.downloadZIPElement),
        // this.zip.heightChanged.add(this.layout.bind(this))),
        this._super()
    },
    // setupDropbox: function() {
    //     this.dropboxElement = this.domElement.find(".section.dropbox"), this.dropboxContents = this.dropboxElement.find(".contents"), this.dropboxPollGoal = null, this.onDropboxPoll = this.onDropboxPoll.bind(this), this.onDropboxPollTimeout = this.onDropboxPollTimeout.bind(this), this.dropboxPollJob = new SL.helpers.PollJob({
    //         interval: 2e3,
    //         timeout: 3e5
    //     }), this.dropboxPollJob.polled.add(this.onDropboxPoll), this.dropboxPollJob.ended.add(this.onDropboxPollTimeout)
    // },
    bind: function() {
        this._super()
        // this.downloadHTMLButton && this.downloadHTMLButton.on("click", this.onDownloadHTMLClicked.bind(this)),
        // this.htmlOutputElement && this.htmlOutputElement.on("click", this.onHTMLOutputClicked.bind(this)),
        // this.cssOutputElement && this.cssOutputElement.on("click", this.onCSSOutputClicked.bind(this)),
        // this.domElement.find(".upgrade-button").on("click", function() {
        //     SL.analytics.trackEditor("Click upgrade link", "export panel")
        // })
    },
    open: function() {
        this._super(),
        // this.syncRevealExport(),
        // this.checkDropboxStatus(),
        // this.checkOnlineContent(),
        this.bodyElement.find('.bg-popup').css('display', 'none'),
        this.dimensionsparam(),
        this.getpopinname(),
        this.popinStyle(),
        this.bodyElement.find('.popin_name').closest('.form-group').removeClass('has-error')
    },
    close: function() {
        this._super(),
        // this.dropboxStatusXHR && this.dropboxStatusXHR.abort(),
        // this.dropboxPollJob.stop(),
        // this.dropboxPollGoal = null,
        this.addpopinname()
    },
    popinStyle: function() {
        $(document)
            .off('change', '#popin_style')
            .on('change', '#popin_style', function(e) {
                let currSlide   = SL.editor.controllers.Markup.getCurrentSlide(),
                    style       = $('#popin_style option:selected').attr('data-type');

                if (typeof style !== 'undefined' && style !== '') {
                    let withoutclip = currSlide.attr('class').replace(/polygon-clip.*/, '');
                    currSlide.attr('class', withoutclip);
                    currSlide.addClass(style);
                }
            });
    },
    addpopinname: function() {
        if ($(".popin_name").val() != "") {
            $('.slides .popin.present').attr('data-popin-name', $(".popin_name").val());
        } else {
            $('.slides .popin.present').attr('data-popin-name', '');
        }
    },
    getpopinname: function() {
        if ($('.slides .popin.present').attr('data-popin-name') != "undefined") {
            $('.fields-wrapper input.popin_name').val($('.slides .popin.present').attr('data-popin-name'));
        } else {
            $('.slides .popin.present').attr('data-popin-name', '');
        }
    },
    dimensionsparam: function() {
        let popinContent = $('.slides section.popin.present');


        if(popinContent.length > 0) {
            $('#screen_popup_width').stepper({
                selectorProgressBar : '.stepper-progress',
                selectorInputNumber : '.stepper-number',
                classNameChanging   : 'is-changing',
                decimals            : 0,
                unit                : 'px',
                initialValue        : this.init_param_popup_w,
                min                 : this.init_param_popup_w_min,
                max                 : this.init_param_popup_w_max,
                stepSize            : 1
            });
            $('#screen_popup_height').stepper({
                selectorProgressBar : '.stepper-progress',
                selectorInputNumber : '.stepper-number',
                classNameChanging   : 'is-changing',
                decimals            : 0,
                unit                : 'px',
                initialValue        : this.init_param_popup_h,
                min                 : this.init_param_popup_h_min,
                max                 : this.init_param_popup_h_max,
                stepSize            : 1
            });
            if (typeof(popinContent.css('width')) != "undefined") {
                $('#screen_popup_width input').val(popinContent.css('width'));
            }
            if (typeof(popinContent.css('height')) != "undefined") {
                $('#screen_popup_height input').val(popinContent.css('height'));
            }
            if (typeof(popinContent.css('background-color')) != "undefined") {
                var bg_value    = popinContent.css('background-color');
                var bg_pop      = 'rgb(255, 255, 255)';

                if (bg_value != '' && bg_value !== 'undefined') {
                    bg_pop = bg_value;
                }
                $('#bg_popup_screen_color2').spectrum({
                    color: bg_pop,
                    showAlpha: true,
                    move: function (color) {
                        popinContent.css('background-color', color.toRgbString());
                    }
                });
            }
            if (typeof(popinContent.css('background-image')) !== 'undefined' && popinContent.css('background-image') !== 'none' && popinContent.css('background-image') !== '') {
                this.bodyElement.find('.bg-popup').show().css("background-image", popinContent.css('background-image'));
                this.bodyElement.find('.del-bg-popup').removeClass('hide');
            }
        }
    },
    checkOnlineContent: function() {
        this.bodyElement.find(".section.online-content-warning").remove(), $('.reveal .slides [data-block-type="iframe"]').length && this.bodyElement.prepend(['<div class="section online-content-warning">', "Looks like there are iframes in this presentation. Note that since iframes load content from other servers they won't work without an internet connection.", "</div>"].join(""))
    },
    syncRevealExport: function() {
        if (SL.view.isDeveloperMode()) {
            if (this.downloadRevealElement.show(), this.htmlOutputElement.length) {
                var e = SL.view.getCurrentTheme(),
                    t = "theme-font-" + e.get("font"),
                    i = "theme-color-" + e.get("color"),
                    n = ['<div class="' + t + " " + i + '" style="width: 100%; height: 100%;">', '<div class="reveal">', '<div class="slides">', SL.editor.controllers.Serialize.getDeckAsString({
                        removeSlideIds: !0,
                        removeBlockIds: !0,
                        removeTextPlaceholders: !0
                    }), "</div>", "</div>", "</div>"].join("");
                this.htmlOutputElement.val(SL.util.html.indent(n))
            }
            this.cssOutputElement.length && (this.cssOutputElement.val("Loading..."), $.ajax({
                url: SL.config.ASSET_URLS["offline-v2.css"],
                context: this
            }).fail(function() {
                this.cssOutputElement.val("Failed to load CSS...")
            }).done(function(e) {
                var t = $("#user-css-output").html() || "",
                    i = $("#theme-css-output").html() || "";
                this.cssOutputElement.val(["<style>", e, i, t, "</style>"].join("\n"))
            }))
        } else this.downloadRevealElement.hide()
    },
    checkDropboxStatus: function() {
        0 !== this.dropboxElement.length && (this.dropboxStatusXHR && this.dropboxStatusXHR.abort(), this.dropboxStatusXHR = $.get(SL.config.AJAX_SERVICES_USER).done(function(e) {
            var t = "string" == typeof this.dropboxPollGoal;
            e && e.dropbox_connected ? (this.dropboxContents.html('<p>Your changes are automatically saved to Dropbox. <a href="http://help.slides.com/knowledgebase/articles/229620" target="_blank">Learn more.</a></p><button class="button negative disconnect-dropbox l">Disconnect</button>'), this.dropboxContents.find(".disconnect-dropbox").on("click", this.onDropboxDisconnectClicked.bind(this)), t && "connected" === this.dropboxPollGoal ? (this.dropboxPollJob.stop(), this.dropboxPollGoal = null, $.ajax({
                type: "POST",
                url: SL.config.AJAX_DROPBOX_SYNC_DECK(SLConfig.deck.id),
                data: {}
            })) : SL.view.hasSavedThisSession() || (this.dropboxContents.append('<button class="button outline sync-dropbox l">Sync now</button>'), this.dropboxContents.find(".sync-dropbox").on("click", this.onDropboxSyncClicked.bind(this))), this.layout()) : (this.dropboxContents.html('<p>Connect with Dropbox to automatically sync your work. Decks in your Dropbox folder can be viewed offline. <a href="http://help.slides.com/knowledgebase/articles/229620" target="_blank">Learn more.</a></p><button class="button connect-dropbox l">Connect Dropbox</button>'), this.dropboxContents.find("button").on("click", this.onDropboxConnectClicked.bind(this)), t && "disconnected" === this.dropboxPollGoal && (this.dropboxPollJob.stop(), this.dropboxPollGoal = null), this.layout()), this.dropboxStatusXHR = null
        }.bind(this)))
    },
    onDropboxConnectClicked: function() {
        this.dropboxPollGoal = "connected", this.dropboxPollJob.start(), SL.util.openPopupWindow(SL.config.AJAX_DROPBOX_CONNECT, "Sync with Dropbox", 1024, 650)
    },
    onDropboxDisconnectClicked: function() {
        this.dropboxPollGoal = "disconnected", this.dropboxPollJob.start(), window.open(SL.config.AJAX_DROPBOX_DISCONNECT)
    },
    onDropboxSyncClicked: function() {
        $.ajax({
            type: "POST",
            url: SL.config.AJAX_DROPBOX_SYNC_DECK(SLConfig.deck.id),
            data: {}
        }).done(function() {
            SL.notify("Dropbox sync started")
        }).fail(function() {
            SL.notify("Dropbox sync failed", "negative")
        })
    },
    onDropboxPoll: function() {
        this.checkDropboxStatus()
    },
    onDropboxPollTimeout: function() {},
    onDownloadHTMLClicked: function() {
        window.open(SL.config.AJAX_EXPORT_DECK(SLConfig.deck.user.username, SLConfig.deck.slug || SLConfig.deck.id)), SL.analytics.trackEditor("Download as HTML")
    },
    onHTMLOutputClicked: function() {
        this.htmlOutputElement.select()
    },
    onCSSOutputClicked: function() {
        this.cssOutputElement.select()
    }
};

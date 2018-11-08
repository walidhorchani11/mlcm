'use strict';

export const sidebarzip = {
    init: function(e) {
        this.domElement = e, this.downloadButton = this.domElement.find(".download-zip-button"), this.downloadButton.on("click", this.onDownloadClicked.bind(this)), this.downloadButtonLabel = this.domElement.find(".download-zip-button .label"), this.downloadButtonLoader = Ladda.create(this.downloadButton.get(0)), this.onPoll = this.onPoll.bind(this), this.onPollTimeout = this.onPollTimeout.bind(this), this.exportID = null, this.pollJob = new SL.helpers.PollJob({
            interval: 1e3,
            timeout: 18e4
        }), this.pollJob.polled.add(this.onPoll), this.pollJob.ended.add(this.onPollTimeout), this.heightChanged = new signals.Signal, this.setIsLoading(!1)
    },
    startExport: function() {
        this.exportXHR && this.exportXHR.abort(), this.exportXHR = $.ajax({
            url: SL.config.AJAX_EXPORT_START(SLConfig.deck.id),
            type: "POST",
            context: this,
            data: {
                "export": {
                    export_type: "zip"
                }
            }
        }).done(function(e) {
            this.exportID = e.id, this.exportXHR = null, this.pollJob.start()
        }.bind(this)).fail(function() {
            this.setIsLoading(!1), SL.notify(SL.locale.get("EXPORT_ZIP_ERROR"), "negative")
        }.bind(this))
    },
    setIsLoading: function(e) {
        e ? (this.downloadButtonLabel.text(SL.locale.get("EXPORT_ZIP_BUTTON_WORKING")), this.downloadButtonLoader && this.downloadButtonLoader.start()) : (this.downloadButtonLabel.text(SL.locale.get("EXPORT_ZIP_BUTTON")), this.downloadButtonLoader && this.downloadButtonLoader.stop())
    },
    showPreviousExport: function(e) {
        if ("string" == typeof e && e.length) {
            this.previousExport && (this.previousExport.remove(), this.previousExport = null);
            var t = (SLConfig.deck.slug || "deck") + ".zip";
            this.previousExport = $('<p class="previous-zip">Recent: <a href="' + e + '" download="' + t + '" target="_blank">' + t + "</a></p>").appendTo(this.domElement), $("html").addClass("editor-exported-zip-successfully"), this.heightChanged.dispatch()
        }
    },
    onDownloadClicked: function() {
        this.setIsLoading(!0), this.startExport(), SL.analytics.trackEditor("Download as ZIP")
    },
    onPoll: function() {
        this.zipStatusXHR && this.zipStatusXHR.abort(), this.zipStatusXHR = $.get(SL.config.AJAX_EXPORT_STATUS(SLConfig.deck.id, this.exportID)).done(function(e) {
            if ("string" == typeof e.url && e.url.length) {
                var t = $('<iframe style="display: none;">');
                t.appendTo(document.body), t.attr("src", e.url), setTimeout(t.remove, 1e3), this.showPreviousExport(e.url), this.setIsLoading(!1), this.pollJob.stop()
            }
        }.bind(this))
    },
    onPollTimeout: function() {
        this.setIsLoading(!1), SL.notify(SL.locale.get("EXPORT_ZIP_ERROR"), "negative")
    }
};

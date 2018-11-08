'use strict';

export const iframe = {
    init: function(e) {
        this._super("iframe", e), this.editingRequested = new signals.Signal, this.iframeSourceChanged = new signals.Signal, this.paint()
    },
    setup: function() {
        this._super(), this.setIframeURL = this.setIframeURL.bind(this), this.getIframeURL = this.getIframeURL.bind(this), this.setIframeAutoplay = this.setIframeAutoplay.bind(this), this.getIframeAutoplay = this.getIframeAutoplay.bind(this), this.setIframeURL = $.debounce(this.setIframeURL, 400), this.properties.iframe = {
            src: {
                setter: this.setIframeURL,
                getter: this.getIframeURL
            },
            autoplay: {
                defaultValue: !1,
                setter: this.setIframeAutoplay,
                getter: this.getIframeAutoplay
            }
        }
    },
    paint: function() {
        this._super.apply(this, arguments);
        var e = this.getIframeURL(),
            t = window.location.protocol;
        "https:" === t && e && /^http:/gi.test(e) ? 0 === this.domElement.find(".sl-block-overlay-message").length && this.domElement.append(['<div class="editing-ui sl-block-overlay sl-block-overlay-message below-content vcenter">', '<div class="vcenter-target">Cannot display non-HTTPS iframe while in the editor.</div>', "</div>"].join("")) : this.domElement.find(".sl-block-overlay-message").remove()
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: 360,
            height: 300
        })
    },
    getIframeURL: function() {
        return this.getIframeElement().attr("src") || this.getIframeElement().attr("data-src")
    },
    setIframeURL: function(e) {
        e !== this.get("iframe.src") && (this.getIframeElement().attr({
            src: e,
            "data-src": e
        }), this.iframeSourceChanged.dispatch(e)), this.paint()
    },
    getIframeAutoplay: function() {
        return this.getIframeElement().get(0).hasAttribute("data-autoplay")
    },
    setIframeAutoplay: function(e) {
        e === !0 ? this.getIframeElement().attr("data-autoplay", "") : this.getIframeElement().removeAttr("data-autoplay")
    },
    getToolbarOptions: function() {
        return [SL.editor.components.toolbars.options.IframeSRC, SL.editor.components.toolbars.options.IframeAutoplay, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Padding, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
    },
    getIframeElement: function() {
        var e = this.contentElement.find("iframe");
        return 0 === e.length && (e = $("<iframe>").appendTo(this.contentElement)), e.attr({
            webkitallowfullscreen: "",
            mozallowfullscreen: "",
            allowfullscreen: "",
            sandbox: "allow-forms allow-scripts allow-popups allow-same-origin allow-pointer-lock"
        }), e
    },
    isEmpty: function() {
        return !this.isset("iframe.src")
    },
    destroy: function() {
        this.iframeSourceChanged.dispose(), this._super()
    },
    onDoubleClick: function(e) {
        this._super(e), this.editingRequested.dispatch()
    },
    onKeyDown: function(e) {
        this._super(e), 13 !== e.keyCode || SL.util.isTypingEvent(e) || (this.editingRequested.dispatch(), e.preventDefault())
    }
};

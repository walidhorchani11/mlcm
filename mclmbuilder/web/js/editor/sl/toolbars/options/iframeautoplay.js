'use strict';

export const toolbarsoptionsiframeautoplay = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "iframe-autoplay",
            label: "Autoplay",
            property: "iframe.autoplay"
        }, t)), this.updateVisibility()
    },
    bind: function() {
        this._super(), this.block && (this.updateVisibility = this.updateVisibility.bind(this), this.block.iframeSourceChanged.add(this.updateVisibility))
    },
    setValue: function(e, t) {
        this._super(e, t)
    },
    updateVisibility: function() {
        var e = this.block.get("iframe.src");
        e && (/^.*(youtube\.com\/embed\/)/.test(e) || /^.*(player\.vimeo.com\/)/.test(e)) ? this.domElement.show() : this.domElement.hide()
    },
    destroy: function() {
        this.block && !this.block.destroyed && this.block.iframeSourceChanged.remove(this.updateVisibility), this._super()
    }
};

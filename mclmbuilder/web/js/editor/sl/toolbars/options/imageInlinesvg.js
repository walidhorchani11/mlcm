'use strict';

export const toolbarsoptionsimageInlinesvg = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "image-inline-svg",
            label: "Inline SVG",
            property: "attribute.data-inline-svg"
        }, t)), this.sync = this.sync.bind(this), e.imageURLChanged.add(this.sync)
    },
    sync: function() {
        this.block.isSVG() ? this.domElement.show() : this.domElement.hide()
    },
    destroy: function() {
        this.block.imageURLChanged && this.block.imageURLChanged.remove(this.sync), this._super()
    }
};

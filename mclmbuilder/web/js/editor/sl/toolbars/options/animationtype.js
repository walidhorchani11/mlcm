'use strict';

export const toolbarsoptionsanimationtype = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "animation-type",
            label: TWIG.toolbar.options.effect,
            property: "attribute.data-animation-type",
            items: e.getPropertySettings("attribute.data-animation-type").options
        }, t))
    },
    renderPanel: function() {
        this._super.apply(this, arguments), this.previewElement = $('<div class="animation-preview"></div>'), this.previewElement.appendTo(this.panel.domElement), this.previewInnerElement = $('<div class="animation-preview-inner"></div>'), this.previewInnerElement.appendTo(this.previewElement), this.panel.getContentElement().on("mouseleave", this.onPanelMouseOut.bind(this)), this.getListElements().on("mouseenter", this.onItemMouseOver.bind(this))
    },
    onItemMouseOver: function(e) {
        var t = $(e.currentTarget).attr("data-value");
        t && (this.previewElement.addClass("visible"), this.previewInnerElement.attr("data-animation-type", t).css("transition-duration", "").removeClass("animate"), setTimeout(function() {
            this.previewInnerElement.css("transition-duration", this.block.get("style.transition-duration") + "s").addClass("animate")
        }.bind(this), 100))
    },
    onPanelMouseOut: function() {
        this.previewElement.removeClass("visible")
    }
};

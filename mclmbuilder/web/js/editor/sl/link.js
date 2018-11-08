'use strict';

export const slLink = {
    init: function(e) {
        this.block = e, this.block.setLinkURL = function(e) {
            "string" == typeof e ? (this.isLinked() === !1 && this.changeContentElementType("a"), this.contentElement.attr("href", e), this.contentElement.attr("target", "_blank"), /^#\/\d/.test(e) && this.contentElement.removeAttr("target")) : (this.contentElement.removeAttr("target"), this.changeContentElementType(this.options.contentElementType))
        }.bind(e), this.block.getLinkURL = function() {
            return this.contentElement.attr("href")
        }.bind(e), this.block.isLinked = function() {
            return this.contentElement.is("a")
        }.bind(e), this.block.properties.link = {
            href: {
                setter: this.block.setLinkURL,
                getter: this.block.getLinkURL,
                checker: this.block.isLinked
            }
        }
    },
    destroy: function() {
        delete this.block.properties.link, delete this.block.setLinkURL, delete this.block.getLinkURL, delete this.block.isLinked
    }
};

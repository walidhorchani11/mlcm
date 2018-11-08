'use strict';

export const slHtml = {
    init: function(e) {
        this.block = e, this.block.editHTML = function() {
            var e = SL.popup.open(SL.components.popup.EditHTML, {
                html: this.contentElement.html()
            });
            e.saved.add(function(e) {
                this.setCustomHTML(e)
            }.bind(this))
        }.bind(e), this.block.setCustomHTML = function(e) {
            this.contentElement.attr("data-has-custom-html", ""), this.contentElement.html(e)
        }.bind(e), this.block.setHTML = function(e) {
            this.contentElement.html(e)
        }.bind(e), this.block.hasCustomHTML = function() {
            return this.contentElement.get(0).hasAttribute("data-has-custom-html")
        }.bind(e)
    },
    destroy: function() {
        delete this.block.editHTML, delete this.block.setCustomHTML, delete this.block.hasCustomHTML
    }
};

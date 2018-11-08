'use strict';

export const controllerthumbnail = {
    init: function() {
        this.invalidated = !1
    },
    generate: function() {
        $.ajax({
            type: "POST",
            url: SL.config.AJAX_THUMBNAIL_DECK(SLConfig.deck.id)
        }), this.invalidated = !1
    },
    invalidate: function() {
        this.invalidated = !0
    },
    isInvalidated: function() {
        return this.invalidated
    }
};

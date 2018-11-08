'use strict';

export const toolbarsoptionsanimationpreview = {
    init: function(e, t) {
        this._super(e, $.extend({
            title: "Preview"
        }, t))
    },
    onClicked: function(e) {
        this._super(e);
        var t = $(Reveal.getCurrentSlide());
        t.addClass("no-transition").removeClass("present"), SL.util.dom.calculateStyle(t), t.removeClass("no-transition").addClass("present")
    }
};

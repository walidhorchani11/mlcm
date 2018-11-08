'use strict';

export const toolbarsoptionsbackgroundcolor = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "background-color",
            label: "Background Color",
            property: "style.background-color",
            alpha: !0
        }, t))
    },
    getColorpickerConfig: function() {
        var e = this._super.apply(this, arguments),
            t = tinycolor(this.getValue()).toRgb();
        return 0 === t.r && 0 === t.g && 0 === t.b && 0 === t.a && (e.color = "#000000"), e
    }
};

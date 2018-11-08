'use strict';

export const toolbarsoptionsmathsize = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "text-size",
            label: "Scale",
            property: "style.font-size"
        }, t))
    },
    setValue: function() {
        if (this._super.apply(this, arguments), this.measurementsBeforeResize) {
            var e = this.block.measure(),
                t = this.measurementsBeforeResize.x + (this.measurementsBeforeResize.width - e.width) / 2,
                i = this.measurementsBeforeResize.y + (this.measurementsBeforeResize.height - e.height) / 2;
            isNaN(t) || isNaN(i) || this.block.move(t, i)
        }
    },
    onChangeStart: function() {
        this.measurementsBeforeResize = this.block.measure(), this._super.apply(this, arguments)
    },
    onChangeEnd: function() {
        this.measurementsBeforeResize = null, this._super.apply(this, arguments)
    }
};

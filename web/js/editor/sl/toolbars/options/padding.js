'use strict';

export const toolbarsoptionspadding = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "padding",
            label: "&nbsp;",
            property: "style.padding"
        }, t))
    },
    syncPaddingHint: function() {
        this.isChanging() ? this.block.showPaddingHint() : this.block.hidePaddingHint()
    },
    writeToBlock: function() {
        this._super.apply(this, arguments), this.syncPaddingHint()
    },
    onMouseMove: function() {
        this._super.apply(this, arguments), this.syncPaddingHint()
    },
    onMouseUp: function() {
        this._super.apply(this, arguments), this.syncPaddingHint()
    },
    onInputFocused: function() {
        this._super.apply(this, arguments), this.syncPaddingHint()
    },
    onInputBlurred: function() {
        this._super.apply(this, arguments), this.syncPaddingHint()
    }
};

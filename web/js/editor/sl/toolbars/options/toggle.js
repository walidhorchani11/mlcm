'use strict';

export const toolbarsoptionstoggle = {
    init: function(e, t) {
        this._super(e, t)
    },
    render: function() {
        this._super(), this.domElement.addClass("toolbar-toggle")
    },
    bind: function() {
        this._super()
    },
    setValue: function(e, t) {
        this.domElement.attr("data-value", e), this._super(e, t)
    },
    onClicked: function(e) {
        e.preventDefault(), this.setValue(!this.getValue(), !0)
    }
};

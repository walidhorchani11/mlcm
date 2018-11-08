'use strict';

export const panelRcpList = {
    init: function() {
        this.domElement = $(".sidebar-panel .recplist"),
        this._super()
    },
    bind: function() {
        this._super()
    },
    open: function() {
        this._super()
    },
    close: function() {
        this._super(),
        SL.editor.controllers.Rcp.resetItems()
    }
};

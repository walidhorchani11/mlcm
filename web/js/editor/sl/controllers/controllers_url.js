'use strict';

export const controllerurl = {
    init: function() {
        this.changed = new signals.Signal, setTimeout(this.read.bind(this), 1)
    },
    read: function() {
        var e = SL.util.getQuery();
        "settings" === e.l ? SL.view.sidebar.open("settings") : "comments" === e.l && SL.view.collaboration && SL.view.collaboration.expand()
    },
    write: function() {
        window.history && "function" == typeof window.history.replaceState && window.history.replaceState(null, SLConfig.deck.title, SL.routes.DECK_EDIT(SLConfig.deck.user.username, SLConfig.deck.slug)), this.changed.dispatch()
    }
};

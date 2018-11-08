'use strict';

export const controllersapi = {
    forkDeck: function() {
        SL.helpers.PageLoader.show({
            message: "Duplicating..."
        }), $.ajax({
            type: "POST",
            url: SL.config.AJAX_FORK_DECK(SLConfig.deck.id),
            context: this
        }).done(function(e) {
            e && e.deck && "string" == typeof e.deck.slug ? window.location = SL.routes.DECK_EDIT(SL.current_user.get("username"), e.deck.slug) : (SL.helpers.PageLoader.hide(), SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"))
        }).fail(function() {
            SL.helpers.PageLoader.hide(), SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
        })
    },
    deleteDeck: function() {
        SL.prompt({
            title: "You are permanently deleting the entire presentation.",
            subtitle: "Are you absolutely sure you want to do this?",
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Delete my presentation</h3>",
                selected: !0,
                className: "negative",
                callback: function() {
                    SL.helpers.PageLoader.show({
                        message: "Deleting..."
                    }), $.ajax({
                        type: "DELETE",
                        url: SL.config.AJAX_UPDATE_DECK(SLConfig.deck.id),
                        data: {},
                        context: this
                    }).done(function() {
                        window.location = SL.current_user.getProfileURL()
                    }).fail(function() {
                        SL.notify(SL.locale.get("DECK_DELETE_ERROR"), "negative"), SL.helpers.PageLoader.hide()
                    })
                }.bind(this)
            }]
        })
    }
};

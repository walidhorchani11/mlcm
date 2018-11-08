'use strict';

export const modespreview = {
    init: function(e) {
        this._super(e, "preview"), SL.editor.controllers.Capabilities.canPresent() ? $(".preview-controls-external").on("click", function() {
            SL.analytics.trackEditor("Open external preview")
        }) : $(".preview-controls-external").remove()
    },
    activate: function() {
        Reveal.isOverview() && Reveal.toggleOverview(!1), this.editor.disableEditing(), this.editor.sidebar.close(), SL.util.openLinksInTabs($(".reveal .slides")), SL.analytics.trackEditor("Preview mode"), this._super(), Reveal.configure({
            progress: !0,
            overview: !1,
            touch: !0,
            fragments: !0,
            center: !1,
            autoSlide: SLConfig.deck.auto_slide_interval || 0
        });
        var e = Reveal.getIndices();
        Reveal.slide(e.h, e.v, -1), $(document.activeElement).blur(), "string" == typeof SLConfig.deck.slug && SLConfig.deck.slug.length > 0 ? $(".preview-controls-external").show().attr("href", SL.routes.DECK_LIVE(SLConfig.deck.user.username, SLConfig.deck.slug)) : $(".preview-controls-external").hide()
    },
    deactivate: function() {
        this.editor.syncPageBackground(), this.editor.enableEditing(), this._super(), Reveal.configure({
            progress: !1,
            overview: !0,
            touch: !1,
            center: !1,
            fragments: !1,
            autoSlide: 0
        }),
        SL.util.layoutReveal(500)
    }
};

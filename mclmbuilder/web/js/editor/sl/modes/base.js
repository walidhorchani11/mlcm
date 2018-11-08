'use strict';

export const modesbase = {
    init: function(e, t) {
        this.id = t, this.editor = e, this.active = !1, this.activated = new signals.Signal, this.deactivated = new signals.Signal, this.onSlideChanged = this.onSlideChanged.bind(this), this.render(), this.bind()
    },
    bind: function() {},
    render: function() {},
    activate: function() {
        this.active = !0, $("html").attr("data-mode", this.id).addClass("hide-projector-overlays"), this.deactivateOnSlideChange && Reveal.addEventListener("slidechanged", this.onSlideChanged), this.activated.dispatch()
    },
    deactivate: function() {
        this.active = !1, $("html").removeAttr("data-mode").removeClass("hide-projector-overlays"), this.deactivateOnSlideChange && Reveal.removeEventListener("slidechanged", this.onSlideChanged), this.deactivated.dispatch()
    },
    toggle: function() {
        this.isActive() ? this.deactivate() : this.activate()
    },
    isActive: function() {
        return this.active
    },
    getID: function() {
        return this.id
    },
    onSlideChanged: function() {
        this.deactivate()
    }
};

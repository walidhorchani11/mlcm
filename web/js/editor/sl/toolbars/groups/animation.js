'use strict';

export const toolbarsgroupsanimation = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "animation",
            label: "Animation",
            items: [SL.editor.components.toolbars.options.AnimationType, SL.editor.components.toolbars.options.TransitionDuration, SL.editor.components.toolbars.options.TransitionDelay, SL.editor.components.toolbars.options.AnimationPreview]
        }, t))
    },
    sync: function() {
        this.block.isset("attribute.data-animation-type") ? this.expand() : this.collapse()
    },
    trigger: function() {
        if (this.block.isset("attribute.data-animation-type")) /*$(".Block-Cliquable").trigger("click")*/$(".Block-Cliquable").prop('checked', false), this.block.unset("attribute.data-animation-type"), this.block.unset("style.transition-duration"), this.block.unset("style.transition-delay"), this.block.domElement.attr("data-block-anim", null), this.block.domElement.find(".sl-block-content").attr("data-delay-tap", null), this.block.domElement.find(".sl-block-content").attr("data-duration-tap", null);
        else {
            this.block.set("attribute.data-animation-type", this.block.getPropertySettings("attribute.data-animation-type").options[0].value);
            var e = SL.config.DEFAULT_SLIDE_TRANSITION_DURATION / 1e3 * .75,
                t = SL.config.DEFAULT_SLIDE_TRANSITION_DURATION / 1e3 * .75;
            console.log(e+"     "+t);
            /^(none|fade)$/gi.test(SL.current_deck.get("transition")) && (t = 0), this.block.isset("style.transition-duration") || this.block.set("style.transition-duration", e), this.block.isset("style.transition-delay") || this.block.set("style.transition-delay", t), this.block.isFragment() && this.block.removeFragment(), SL.analytics.trackEditor("Toolbar: Add animation")
        }
        this.sync()
    }
};

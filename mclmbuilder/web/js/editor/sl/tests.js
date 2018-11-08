'use strict';

export const editortests = {
    run: function() {
        var e = this.testOnboarding(),
            t = this.testBlocks();
        e && t && $("html").addClass("editor-tested-successfully");
        console.log('hello')
    },
    testOnboarding: function() {s
        for (; SL.editor.controllers.Onboarding.tutorial.hasNextStep();) SL.editor.controllers.Onboarding.tutorial.next();
        return SL.editor.controllers.Onboarding.tutorial.next(), !0
    },
    testBlocks: function() {
        var e = SL.editor.controllers.Blocks.add({
            type: "text"
        });
        e.destroy();
        var t = SL.editor.controllers.Blocks.add({
            type: "image"
        });
        t.destroy();
        var i = SL.editor.controllers.Blocks.add({
            type: "shape"
        });
        return i.move(100, 100), i.resize({
            width: 100,
            height: 100
        }), i.destroy(), !0
    }
};

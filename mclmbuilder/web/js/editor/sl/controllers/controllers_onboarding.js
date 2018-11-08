'use strict';

export const controlleronboarding = {
    init: function(e) {
        this.onTutorialSkipped = this.onTutorialSkipped.bind(this), this.onTutorialFinished = this.onTutorialFinished.bind(this), SL.util.getQuery().tutorial ? this.start() : SL.current_user.get("editor_tutorial_completed") || !e.isNewDeck() || SL.util.device.IS_PHONE || SL.util.device.IS_TABLET || this.start()
    },
    start: function() {
        var e = [this.step0, this.step1, this.step2];
        this.hasTextBlock() && e.push(this.step3, this.step4), e.push(this.step5, this.step6, this.step7, this.step8), this.tutorial = new SL.components.Tutorial({
            context: this,
            steps: e
        }), this.tutorial.skipped.add(this.onTutorialSkipped.bind(this)), this.tutorial.finished.add(this.onTutorialFinished.bind(this)), this.tutorial.step(0), $("html").addClass("onboarding-open")
    },
    stop: function() {
        $.ajax({
            url: SL.config.AJAX_UPDATE_USER,
            type: "PUT",
            context: this,
            data: {
                user: {
                    editor_tutorial_completed: !0
                }
            }
        }), this.tutorial.destroy(), $("html").removeClass("onboarding-open")
    },
    getTextBlock: function() {
        return $(Reveal.getCurrentSlide()).find('.sl-block[data-block-type="text"]').first()
    },
    hasTextBlock: function() {
        return this.getTextBlock().length > 0
    },
    onTutorialSkipped: function() {
        this.stop(), SL.analytics.trackEditor("Onboarding skipped")
    },
    onTutorialFinished: function() {
        var e = $(".sl-templates");
        e.length && e.data("instance") && (e.css("background", ""), e.data("instance").hide()), this.stop(), SL.analytics.trackEditor("Onboarding finished")
    },
    step0: {
        forwards: function() {
            var e = "<h3>Meet the Slides editor</h3><p>Click <b>Next</b> to take a quick tour.</p>";
            this.tutorial.message(e, {
                anchor: $(".sl-tutorial-controls-inner"),
                alignment: "t",
                maxWidth: 450
            })
        }
    },
    step1: {
        forwards: function() {
            var e;
            e = SL.current_user.isPro() || SL.current_user.isEnterprise() ? "<h3>Top Level Options</h3><p>Set the <b>presentation title, privacy, theme and arrange slides</b> from here. You can also manage importing and exporting</p>" : "<h3>Top Level Options</h3><p>Set the <b>presentation title, privacy, theme and arrange slides</b> from here.</p>", this.tutorial.cutout($(".sidebar")), this.tutorial.message(e, {
                anchor: $(".sidebar"),
                alignment: "r"
            })
        },
        backwards: function() {
            this.tutorial.clearCutout(), this.tutorial.clearMessage()
        }
    },
    step2: {
        forwards: function() {
            this.tutorial.cutout($(".toolbars")), this.tutorial.message("<h3>Add New Content</h3><p>Click on any of these to add a <b>block</b> of content to the current slide.</p>", {
                anchor: $(".toolbars"),
                alignment: "r"
            })
        },
        backwards: function() {
            this.tutorial.clearCutout(), this.tutorial.clearMessage()
        }
    },
    step3: {
        forwards: function() {
            this.tutorial.cutout(this.getTextBlock()), this.tutorial.message("<h3>Example Text Block</h3><p>Single-click to focus or double-click to edit text.</p>", {
                anchor: this.getTextBlock(),
                alignment: "b"
            })
        },
        backwards: function() {
            this.tutorial.clearCutout(), this.tutorial.clearMessage()
        }
    },
    step4: {
        forwards: function() {
            this.tutorial.cutout($(".toolbars")), this.tutorial.message("<h3>Block Options</h3><p>Options for the selected block. For text blocks this includes <b>alignment, color, size</b> and more.</p>", {
                anchor: $(".toolbars"),
                alignment: "r"
            }),
            SL.editor.controllers.Blocks.focus(SL.editor.controllers.Blocks.getCurrentBlocks()[0])
        },
        backwards: function() {
            this.tutorial.clearCutout(), this.tutorial.clearMessage(), SL.editor.controllers.Blocks.blur()
        }
    },
    step5: {
        forwards: function() {
            SL.editor.controllers.Blocks.blur(), this.tutorial.cutout($(".slide-options"), {
                padding: 4
            }), this.tutorial.message("<h3>Slide Options</h3><p>Options for the current slide, such as <b>background color/image and speaker notes</b>.</p>", {
                anchor: $(".slide-options"),
                alignment: $(".slide-options").offset().left < window.innerWidth / 2 ? "r" : "l"
            })
        },
        backwards: function() {
            this.tutorial.clearCutout(), this.tutorial.clearMessage()
        }
    },
    step6: {
        forwards: function() {
            this.tutorial.cutout($(".add-horizontal-slide"), {
                padding: 4
            }), this.tutorial.message("<h3>Adding a Slide</h3><p>Click the plus button to add a new slide.</p>", {
                anchor: $(".add-horizontal-slide"),
                alignment: "l"
            })
        },
        backwards: function() {
            this.tutorial.clearCutout(), this.tutorial.clearMessage()
        }
    },
    step7: {
        forwards: function() {
            $(".add-horizontal-slide").click(), $(".sl-templates").css("background", "transparent"), this.tutorial.cutout($(".sl-templates-inner")), this.tutorial.message('<h3>Choose a Template</h3><p>When adding a new slide you get to choose from templates. You can save your own templates in the "Yours" tab.</p>', {
                anchor: $(".sl-templates-inner"),
                alignment: "l"
            })
        },
        backwards: function() {
            var e = $(".sl-templates");
            e.length && (e.css("background", ""), e.data("instance").hide()), this.tutorial.clearCutout(), this.tutorial.clearMessage()
        }
    },
    step8: {
        forwards: function() {
            var e = $(".sl-templates");
            e.length && (e.css("background", ""), e.data("instance").hide());
            var t = $(".sl-collab-menu-item:visible").first();
            this.tutorial.cutout(t, {
                padding: 4
            }), this.tutorial.message("<h3>Collaborate</h3><p>Invite others to edit or leave feedback on your presentation.</p>", {
                anchor: t,
                alignment: "tl"
            })
        },
        backwards: function() {
            this.tutorial.clearCutout(), this.tutorial.clearMessage()
        }
    }
};

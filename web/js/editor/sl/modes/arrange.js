'use strict';

export const modesarrange = {
    init: function(e) {
        this._super(e, "arrange"),
        this.arrangeFlowDiagramListener(),
        this.validateFlowDiagramListener()
    },
    bind: function() {
        Reveal.addEventListener("overviewshown", this.onRevealOverviewShown.bind(this)),
        Reveal.addEventListener("overviewhidden", this.onRevealOverviewHidden.bind(this))
    },
    activate: function(e) {
        this.active = !0, e || Reveal.toggleOverview(!0), this.editor.disableEditing(), this.editor.sidebar.updateArrangeButton("arranging");
        var t = ['<div class="arrange-controls editing-ui">', '<div class="arrange-control move-left i-arrow-left-alt1"></div>', '<div class="arrange-control remove-current-slide"><span class="picto-trash"></span> </div>', '<div class="arrange-control move-right i-arrow-right-alt1"></div>', '<div class="arrange-control move-up i-arrow-up-alt1"></div>', '<div class="arrange-control move-down i-arrow-down-alt1"></div>', '<div class="arrange-control merge-left i-previous" data-tooltip-delay="500"></div>', '<div class="arrange-control merge-right i-next" data-tooltip-delay="500"></div>', "</div>"].join("");
        $(".reveal .slides section:not(.stack, .sousblanck)").append(t).addClass("disabled"), $(".reveal .slides section.stack").each(function(e, t) {
            0 === $(t).find(".present").length && $(t).find("section").first().addClass("present")
        }),
        $(".reveal .slides section .arrange-controls").on("click", this.onControlsClicked.bind(this)),
        $(".reveal .slides section .move-left").on("click", this.onMoveSlideLeft.bind(this)),
        $(".reveal .slides section .remove-current-slide").on("click", this.onRemoveSlide.bind(this)),
        $(".reveal .slides section .move-right").on("click", this.onMoveSlideRight.bind(this)),
        $(".reveal .slides section .move-up").on("click", this.onMoveSlideUp.bind(this)),
        $(".reveal .slides section .move-down").on("click", this.onMoveSlideDown.bind(this)),
        $(".reveal .slides section .merge-left").on("click", this.onMergeLeft.bind(this)),
        $(".reveal .slides section .merge-right").on("click", this.onMergeRight.bind(this)),
        SL.analytics.trackEditor("Arrange mode"),
        $(document.activeElement).blur(),
        this._super()
        /*$('.slides section .arrange-control').not('.remove-current-slide').hide();*/
        $('.slides section .arrange-control').not('.remove-current-slide').css("visibility", "hidden");
        $('.slides section .arrange-control.remove-current-slide').addClass('hide');
    },
    deactivate: function(e) {
        this.active = !1, e || Reveal.toggleOverview(!1),
        this.editor.enableEditing(),
        this.editor.sidebar.updateArrangeButton(),
        $(".reveal .slides section:not(.stack)").removeClass("disabled"),
        $(".reveal .slides section .arrange-controls").remove(),
        this._super()
    },
    afterSlidesChanged: function() {
        SL.editor.controllers.Markup.afterSlidesChanged()
    },
    onRevealOverviewShownArrange: function() {
        $('.arrangediag').show();
        Reveal.toggleOverview(true),
        Reveal.sync()
        //this.disableEnterKeydown()
        //$('.sidebar button.arrange').removeClass('active')
    },
    onRevealOverviewShown: function() {
        this.currentSlide = Reveal.getIndices();
        this.isActive() || (SL.editor.controllers.Mode.clear(), this.activate(!0)),
        $('.slides section').removeClass('present');
        this.generateBackgroundImage();
        Reveal.sync();
        //SL.editor.controllers.Popin.createPopinView();
        $('.arrangediag').show()
        //this.disableEnterKeydown()
    },
    onRevealOverviewHidden: function() {
        this.isActive() && this.deactivate(!0)
        Reveal.sync();
        // if (this.currentSlide) {
        //     Reveal.slide(this.currentSlide.h, this.currentSlide.v);
        // }
        //$(document).find('section.popin-overview').remove();
        SL.editor.controllers.Markup.unwrapEmptyStacks();
        SL.editor.controllers.Markup.afterSlidesChanged();
        $('#arrangediag').hide(),
        $('#validatearrange').hide()
    },
    onControlsClicked: function(e) {
        $(e.target).hasClass("arrange-controls") && $(e.target).parent("section").removeClass("disabled").trigger("click")
    },
    onMoveSlideLeft: function(e) {
        var t = $(e.target).parents("section").first();
        t.parents("section.stack").length && (t = t.parents("section.stack"));
        var i = t.prev();
        t.length && i.length && (t.after(i),this.generateBackgroundImage(), Reveal.sync(), Reveal.slide(t.index()), this.afterSlidesChanged())
            /* Menu update */
        setTimeout(function() {
            SL.editor.controllers.Menu.updateCreatedMenu();
        }, 5);
    },
    onRemoveSlide: function(e) {
        //console.log("______test________");
        var t = $(e.target).closest("section");
        var dataIdSection = t.attr("data-id");
        //t.onRemoveSlideClicked()
        // $('.slide-option.remove-slide').trigger("click");
        SL.editor.controllers.Blocks.blur(), SL.prompt({
            anchor: $(e.currentTarget),
            title: SL.locale.get("DECK_DELETE_SLIDE_CONFIRM"),
            ///alignment: this.getPopoverAlignment(),
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3 data-id='"+dataIdSection+"'>Remove</h3>",
                selected: !0,
                className: "negative",
                callback: function() {
                    let $slideToRemoveId    = SL.editor.controllers.Markup.getCurrentSlide().attr('data-id'),
                        linksToremove       = $('.slides section').find('.sl-block #linkedscreen:contains('+ $slideToRemoveId +')');

                    _.each(linksToremove, function(value, key) {
                        $(value).closest('.sl-block').removeAttr('data-link');
                        $(value).remove();
                    });

                    SL.editor.controllers.Markup.removeCurrentSlide()
                        // t.remove()
                        /* Menu update */
                    setTimeout(function() {
                        SL.editor.controllers.Menu.updateCreatedMenu();
                    }, 5);

                }.bind(this)
            }]
        }), e.preventDefault()
    },
    onMoveSlideRight: function(e) {

        var t = $(e.target).parents("section").first();
        t.parents("section.stack").length && (t = t.parents("section.stack"));
        var i = t.next();
        t.length && i.length && (t.before(i),this.generateBackgroundImage(), Reveal.sync(), Reveal.slide(t.index()), this.afterSlidesChanged())
            /* Menu update */
        setTimeout(function() {
            SL.editor.controllers.Menu.updateCreatedMenu();
        }, 5);
    },
    onMoveSlideUp: function(e) {

        var t = $(e.target).parents("section").first(),
            i = t.prev();
        t.length && i.length && (t.after(i),this.generateBackgroundImage(), Reveal.sync(), Reveal.slide(t.parents("section.stack").index(), t.index()), this.afterSlidesChanged())
            /* Menu update */
        setTimeout(function() {
            SL.editor.controllers.Menu.updateCreatedMenu();
        }, 5);
    },
    onMoveSlideDown: function(e) {

        var t = $(e.target).parents("section").first(),
            i = t.next();
        t.length && i.length && (t.before(i),this.generateBackgroundImage(), Reveal.sync(), Reveal.slide(t.parents("section.stack").index(), t.index()), this.afterSlidesChanged())
            /* Menu update */
        setTimeout(function() {
            SL.editor.controllers.Menu.updateCreatedMenu();
        }, 5);
    },
    onMergeLeft: function(e) {
        var t = $(e.target).parents("section").first(),
            i = t.prev();
        if (t.parents("section.stack").prev().length && (i = t.parents("section.stack").prev()), t.length) {
            t.parents("section.stack").length ? t.insertBefore(t.parents("section.stack")) : i.is("section.stack") ? i.prepend(t) : SL.editor.controllers.Markup.mergeHorizontalSlides(i, t), SL.editor.controllers.Markup.unwrapEmptyStacks();
            var n = Reveal.getIndices(t.get(0));
            this.generateBackgroundImage(),
            Reveal.sync(), Reveal.slide(n.h, n.v), this.afterSlidesChanged()

        }
        /* Menu update */
        setTimeout(function() {
            SL.editor.controllers.Menu.updateCreatedMenu();
        }, 5);
    },
    onMergeRight: function(e) {
        var t = $(e.target).parents("section").first(),
            i = t.next();
        if (t.parents("section.stack").next().length && (i = t.parents("section.stack").next()), t.length) {
            t.parents("section.stack").length ? t.insertAfter(t.parents("section.stack")) : i.is("section.stack") ? i.prepend(t) : SL.editor.controllers.Markup.mergeHorizontalSlides(i, t), SL.editor.controllers.Markup.unwrapEmptyStacks();
            var n = Reveal.getIndices(t.get(0));
            this.generateBackgroundImage(),
            Reveal.sync(), Reveal.slide(n.h, n.v), this.afterSlidesChanged()
        }
        /* Menu update */
        setTimeout(function() {
            SL.editor.controllers.Menu.updateCreatedMenu();
        }, 5);
    },
    arrangeFlowDiagramListener: function() {
        let that = this;

        $('#arrangediag')
            .off('click')
            .on('click', function() {
                that.arrangeFlowDiagram()
            });
    },
    arrangeFlowDiagram: function() {
        let sectionsList    = $('.slides section').not(".popin-overview");

        $('.slides section.popin-overview').remove();
        SL.editor.controllers.Markup.unwrapEmptyStacks();
        SL.editor.controllers.Markup.afterSlidesChanged();
        sectionsList.find('.arrange-controls .arrange-control').not('.remove-current-slide').css("visibility", "visible");
        sectionsList.find('.arrange-controls .remove-current-slide').removeClass('hide');
        this.generateBackgroundImage();
        Reveal.sync();
        $('#arrangediag').hide();
        $('#validatearrange').show();
        Reveal.sync();
        Reveal.slide(0, 0);
    },
    generateBackgroundImage: function () {
        let sectionsList    = $('.slides section');
        sectionsList.each(function (value, index) {
          let screen_image = $(index).attr('data-bg-screen-img'),
              screen_color = $(index).attr('data-bg-screen-color');
          if (typeof screen_image != 'undefined'){
              $(index).attr('data-background-image', screen_image)
          }
          if (typeof screen_color != 'undefined'){
              $(index).attr('data-background-color', screen_color)
          }
        })
    },
    validateFlowDiagramListener: function() {
        let that = this;

        $('#validatearrange')
            .off('click')
            .on('click', function() {
                setTimeout(function() {
                    that.validateFlowDiagram()
                }, 50);
            });
    },
    validateFlowDiagram: function() {
        let sectionsList    = $('.slides section').not(".popin-overview");

        $('#arrangediag').show(),
        $('#validatearrange').hide(),
        sectionsList.find('.arrange-controls .arrange-control').not('.remove-current-slide').css("visibility", "hidden"),
        sectionsList.find('.arrange-controls .remove-current-slide').removeClass('hide'),
        Reveal.slide(0, 0),
        this.onRevealOverviewShown()
    },
    disableEnterKeydown: function() {
        $(document).on('keydown', function(e) {
            if ((e.which || e.keyCode) === 13) {
                setTimeout(function() {
                    Reveal.sync();
                    Reveal.slide(0, 0);
                }, 50);
            }
        })
    }
};

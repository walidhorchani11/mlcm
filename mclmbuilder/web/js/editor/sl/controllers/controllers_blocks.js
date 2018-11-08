'use strict';

export const controllerblocks = {
    init: function(e) {
        this.editor = e,
        this.clipboard = [],
        this.clipboardAction = null,
        this.focusChanged = new signals.Signal,
        this.textSaved = new signals.Signal,
        this.lastFocusedElm,
        this.disableAddSurveyToolbar = false,
        this.bind()
    },
    bind: function() {
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this),
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this),
        this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this),
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this),
        this.onTextEditingTouchMove = this.onTextEditingTouchMove.bind(this),
        this.onTextEditingTouchEnd = this.onTextEditingTouchEnd.bind(this),
        this.afterBlockTextInput = $.throttle(this.afterBlockTextInput.bind(this), 250),
        $(document).on("vmousedown", this.onDocumentMouseDown),
        $(document).on("keydown", this.onDocumentKeyDown)
    },
    sync: function(e) {
        $(e || Reveal.getCurrentSlide()).find(".sl-block").each(function(e, t) {
            var i = $(t);
            i.data("block-instance") || this.add({
                type: i.attr("data-block-type"),
                element: i
            })
        }.bind(this))
    },
    add: function(e) {
         "undefined" == typeof e.slide && (e.slide = Reveal.getCurrentSlide()), "undefined" == typeof e.silent && (e.silent = !1), "undefined" == typeof e.center && (e.center = !0);
        var t = SL.config.BLOCKS.getByProperties({
            type: e.type
        });
        if (t) {
            var i;
            return e.element ? (i = new SL.editor.blocks[t.factory]({
                element: e.element
            }), e.element.data("block-instance", i), 0 === e.element.parent().length && i.appendTo(e.slide)) : (i = new SL.editor.blocks[t.factory](e.blockOptions), i.appendTo(e.slide), i.setDefaults(), e.afterInit && "function" == typeof e.afterInit && e.afterInit(i), e.width && i.resize({
                width: e.width
            }), e.height && i.resize({
                height: e.height
            }), this.place(i, {
                skipIntro: e.silent,
                center: e.center
            }), ("number" == typeof e.x || "number" == typeof e.y) && i.move(e.x, e.y), e.silent || SL.editor.controllers.Blocks.focus(i)), i.hasID() === !1 && i.setID(this.generateID(i)), i.removed.add(function() {
                i.isFocused() && SL.editor.controllers.Blocks.blur()
            }), i
        }
    },
    generateID: function(e) {
        return this.uniqueBlockCount = this.uniqueBlockCount ? this.uniqueBlockCount + 1 : 1, CryptoJS.MD5("block-" + e.getType() + "-" + this.uniqueBlockCount + "-" + Date.now() + "-" + Math.round(1e9 * Math.random())).toString()
    },
    place: function(e, t) {
        t = t || {},
        SL.editor.controllers.Blocks.moveBlocksToDepth([e], Number.MAX_VALUE), t.center && e.moveToCenter(), t.skipIntro || e.runIntro()
    },
    focus: function(e, t, i) {
        $(e.domElement[0]).closest('section').attr('data-thumb-saved', false)
        "undefined" == typeof t && (t = !1),
        "undefined" == typeof i && (i = !0),
        e && e.nodeName && (e = $(e).data("block-instance")),
        e && "function" == typeof e.focus && (t ? e.isFocused() ? e.isFocused() && i && e.blur() : e.focus() : e.isFocused() || (this.blur(), e.focus()), this.afterFocusChange())
        SL.editor.controllers.Pdf.getLinkedPdf(e),
        SL.editor.controllers.Popin.selectedPopinList(e),
        SL.editor.controllers.Popin.selectedScreenList(e)
    },
    blur: function(e) {
        (e || this.getFocusedBlocks()).forEach(function(e) {
            e.blur()
        }), this.afterFocusChange()
    },
    blurBlocksBySlide: function(e) {
        $(e).find(".sl-block").each(function() {
            var e = $(this).data("block-instance");
            e && e.blur()
        }), this.afterFocusChange()
    },
    afterFocusChange: function() {
        var e = this.getFocusedBlocks();
        1 === e.length && e[0].getToolbarOptions().length && this.disableAddSurveyToolbar == false ? this.editor.toolbars.get().block !== e[0] && this.editor.toolbars.push(new SL.editor.components.toolbars.Edit(e[0])) : e.length > 1 ? this.editor.toolbars.get() instanceof SL.editor.components.toolbars.EditMultiple || (this.editor.toolbars.clear(), this.editor.toolbars.push(new SL.editor.components.toolbars.EditMultiple)) : this.editor.toolbars.clear(), this.focusChanged.dispatch()
    },
    afterBlockTextInput: function() {
        $(".reveal-viewport").scrollLeft(0).scrollTop(0)
    },
    afterBlockTextSaved: function(e) {
        this.textSaved.dispatch(e)
    },
    copy: function() {
        this.clipboardAction = "copy";
        var e = this.getFocusedBlocks();
        e.length && (this.clipboard.length = 0, e.forEach(function(e) {
            this.clipboard.push({
                block: e,
                measurements: e.measure()
            })
        }.bind(this)), SL.analytics.trackEditor("Copy block"))
    },
    cut: function() {
        this.clipboardAction = "cut";
        var e = this.getFocusedBlocks();
        e.length && (this.clipboard.length = 0, e.forEach(function(e) {
            this.clipboard.push({
                block: e,
                measurements: e.measure()
            }), e.blur(), e.detach()
        }.bind(this)), SL.editor.controllers.Blocks.blur(), SL.analytics.trackEditor("Cut block"))
    },
    paste: function() {
        var e = $(Reveal.getCurrentSlide()),
            t = 15;
        if (this.clipboard.length && e.length) {
            var i = [];
            this.clipboard.forEach(function(e) {
                var n = e.block.domElement.clone(),
                    r = JSON.parse(JSON.stringify(e.measurements));
                    /*****************-------------------- Mis à jour le 09-01-2017 -------------------------***************************/
                    if(n.hasClass("select-survey-output") == false && n.hasClass("text-field-output") == false){
                        if(n.hasClass("submit-btn-output") == true && SL.editor.controllers.Markup.getCurrentSlide().find(".submit-btn-output").length > 0){
                            this.blur();
                            SL.editor.controllers.Survey.updateDuplicatedBlocks(n);
                        }
                        else{
                            this.blur();
                            if (n.removeAttr("data-block-id"), n.find(">.editing-ui").remove(), "copy" === this.clipboardAction)
                                for (; this.getBlocksByMeasurements(r).length;) r.x += t, r.y += t, r.right && (r.right += t), r.bottom && (r.bottom += t);
                            var o = this.add({
                                type: n.attr("data-block-type"),
                                element: n
                            });
                            if(o.domElement.find(".ref-container").length > 0){
                                o.domElement.find(".ref-container").remove();
                            }
                            o.move(r.x, r.y), this.focus(o, !0), i.push(o), SL.editor.controllers.Survey.updateDuplicatedBlocks(n)
                        }
                    }
                    else if(n.hasClass("select-survey-output") == true){
                        this.blur();
                        if (n.removeAttr("data-block-id"), n.find(">.editing-ui").remove(), "copy" === this.clipboardAction)
                            for (; this.getBlocksByMeasurements(r).length;) r.x += t, r.y += t, r.right && (r.right += t), r.bottom && (r.bottom += t);
                        SL.editor.controllers.Survey.updateDuplicatedBlocks(n, r);
                    }
                    else if(n.hasClass("text-field-output") == true){
                        this.blur();
                        if (n.removeAttr("data-block-id"), n.find(">.editing-ui").remove(), "copy" === this.clipboardAction)
                            for (; this.getBlocksByMeasurements(r).length;) r.x += t, r.y += t, r.right && (r.right += t), r.bottom && (r.bottom += t);
                        SL.editor.controllers.Survey.updateDuplicatedBlocks(n, r);
                    }
                    /*****************-------------------- End mis à jour le 09-01-2017 -------------------------***************************/
            }.bind(this)), i.sort(function(e, t) {
                return e.get("style.z-index") - t.get("style.z-index")
            }), i.forEach(function(e) {
                SL.editor.controllers.Blocks.moveBlocksToDepth([e], Number.MAX_VALUE)
            }), SL.analytics.trackEditor("Paste block"), Reveal.sync()
        }
        this.disableAddSurveyToolbar = false;
    },
    getClipboard: function() {
        return this.clipboard
    },
    align: function(e, t) {
        var i = this.getCombinedBounds(e);
        "left" === t ? e.forEach(function(e) {
            e.move(i.x)
        }) : "horizontal-center" === t ? e.forEach(function(e) {
            e.move(i.x + (i.width - e.measure().width) / 2)
        }) : "right" === t ? e.forEach(function(e) {
            e.move(i.right - e.measure().width)
        }) : "top" === t ? e.forEach(function(e) {
            e.move(null, i.y)
        }) : "vertical-center" === t ? e.forEach(function(e) {
            e.move(null, i.y + (i.height - e.measure().height) / 2)
        }) : "bottom" === t && e.forEach(function(e) {
            e.move(null, i.bottom - e.measure().height)
        })
    },
    layout: function(e, t) {
        var i = 10,
            n = 0,
            r = 0,
            o = e.map(function(e) {
                var t = e.measure();
                return n += t.width + i, r += t.height + i, {
                    block: e,
                    measurements: t
                }
            });
        if ("column" === t) {
            var s = SL.config.SLIDE_HEIGHT / 2 - r / 2;
            o.forEach(function(e) {
                e.block.move(SL.config.SLIDE_WIDTH / 2 - e.measurements.width / 2, s), s += e.measurements.height + i
            })
        } else if ("row" === t) {
            var a = SL.config.SLIDE_WIDTH / 2 - n / 2;
            o.forEach(function(e) {
                e.block.move(a, SL.config.SLIDE_HEIGHT / 2 - e.measurements.height / 2), a += e.measurements.width + i
            })
        }
    },
    discoverBlockPairs: function() {
        var e = this.getCurrentBlocks(),
            t = SL.editor.controllers.Blocks.getAdjacentBlocks(e);
        e.forEach(function(e) {
            e.unpair()
        }), t.forEach(function(e) {
            "bottom" !== e.relationship || "text" !== e.blockA.type && "html" !== e.blockA.type || e.blockA.pair(e.blockB, "bottom")
        })
    },
    moveBlocksToDepth: function(e, t) {
        var i = this.getCurrentBlocks();
        i.sort(function(e, t) {
            return e.get("style.z-index") - t.get("style.z-index")
        });
        var n = 10;
        t = Math.min(Math.max(t, 0), i.length + n), i.forEach(function(e) {
            n === t && (n += 1), /*e.set("style.z-index", n)*/e.domElement.find(".block-style, .sl-block-content").css("z-index", n), n += 1
        }), e.forEach(function(e) {
            /*e.set("style.z-index", t)*/
            e.domElement.find(".block-style, .sl-block-content").css("z-index", t)
        })
    },
    getCombinedBounds: function(e) {
        var t = {
            y: Number.MAX_VALUE,
            right: 0,
            bottom: 0,
            x: Number.MAX_VALUE
        };
        return e.forEach(function(e) {
            var i = e.measure();
            t.x = Math.min(t.x, i.x), t.y = Math.min(t.y, i.y), t.right = Math.max(t.right, i.right), t.bottom = Math.max(t.bottom, i.bottom)
        }.bind(this)), t.width = t.right - t.x, t.height = t.bottom - t.y, t
    },
    getFocusedBlocks: function() {
        var e = [];
        return this.getCurrentBlocks().forEach(function(t) {
            t.isFocused() && e.push(t)
        }), e
    },
    getCurrentBlocks: function() {
        return this.getBlocksBySlide(Reveal.getCurrentSlide())
    },
    getBlocksBySlide: function(e) {
        SL.editor.controllers.Blocks.sync(e);
        var t = [];
        return $(e).find(".sl-block").each(function() {
            var e = $(this).data("block-instance");
            e && t.push(e)
        }), t
    },
    getBlocksByMeasurements: function(e) {
        var t = [];
        return this.getCurrentBlocks().forEach(function(i) {
            var n = i.measure(),
                r = !0;
            for (var o in e) e.hasOwnProperty(o) && e[o] !== n[o] && (r = !1);
            r && t.push(i)
        }), t
    },
    getAdjacentBlocks: function(e) {
        var t = [],
            e = e || this.getCurrentBlocks();
        return e.forEach(function(i) {
            t = t.concat(SL.editor.controllers.Blocks.getAdjacentBlocksTo(i, e))
        }), t
    },
    getAdjacentBlocksTo: function(e, t) {
        var i = 4,
            n = [],
            t = t || this.getCurrentBlocks(),
            r = e.measure();
        return t.forEach(function(t) {
            var o = t.measure(),
                s = SL.util.trig.intersection(r, o);
            s.height > 0 && (Math.abs(r.x - o.right) < i ? n.push({
                relationship: "left",
                blockA: e,
                blockB: t
            }) : Math.abs(r.right - o.x) < i && n.push({
                relationship: "right",
                blockA: e,
                blockB: t
            })), s.width > 0 && (Math.abs(r.y - o.bottom) < i ? n.push({
                relationship: "top",
                blockA: e,
                blockB: t
            }) : Math.abs(r.bottom - o.y) < i && n.push({
                relationship: "bottom",
                blockA: e,
                blockB: t
            }))
        }), n
    },
    onDocumentMouseDown: function(e) {
        if (SL.view.isEditing() === !1) return !0;
        var t = $(e.target).closest(".reveal").length > 0;
        var isRevealControls    = '',
            isBlock             = '',
            isToolbar           = '';

        if (isRevealControls = $(e.target).closest(".reveal .controls").length > 0, isBlock = $(e.target).closest(".sl-block").length > 0, isToolbar = $(e.target).closest(".toolbars").length > 0, !t || isBlock || isRevealControls) isToolbar && this.getFocusedBlocks().forEach(function(e) {
            "function" == typeof e.disableEditing && e.disableEditing()
        });
        else {
            // if (SL.editor.controllers.Capabilities.isTouchEditor()) {
            //     var i = this.getFocusedBlocks().some(function(e) {
            //         return e.isEditingText()
            //     });
            //     if (i) return this.touchMouseStart = {
            //         x: e.clientX,
            //         y: e.clientY
            //     }, this.touchMouseMoved = !1, $(document).on("vmousemove", this.onTextEditingTouchMove), $(document).on("vmouseup", this.onTextEditingTouchEnd), !0
            // }
            e.shiftKey || (SL.editor.controllers.Blocks.blur(), $(document.activeElement).blur()), e.preventDefault(), SL.editor.controllers.Selection.start(e.clientX, e.clientY), $(document).on("vmousemove", this.onDocumentMouseMove), $(document).on("vmouseup", this.onDocumentMouseUp)
        }
    },
    onDocumentMouseMove: function(e) {
        SL.editor.controllers.Selection.sync(e.clientX, e.clientY)
    },
    onDocumentMouseUp: function() {
        /*console.log("getFocusedBlocks: " + this.getFocusedBlocks().length);
        if(this.getFocusedBlocks().length > 1){

            for(var key in this.getFocusedBlocks()){
                if(this.getFocusedBlocks()[key].type == "survey"){
                    console.log("survey.....................................");
                    var blockIndex = this.getFocusedBlocks().indexOf(this.lastFocusedElm),
                    blockElm = this.getFocusedBlocks()[blockIndex].domElement;
                    console.log("blockIndex: " + blockIndex);
                    console.log(this.getFocusedBlocks()[blockIndex]);
                    this.editor.toolbars.push(new SL.editor.components.toolbars.Edit(this.getFocusedBlocks()[blockIndex]));
                    SL.editor.controllers.Survey.setup();
                    SL.editor.controllers.Survey.toolbarSurveyVisibility(this.lastFocusedElm.domElement);
                    break;
                }
            }
        }*/
        SL.editor.controllers.Selection.stop(), $(document).off("vmousemove", this.onDocumentMouseMove), $(document).off("vmouseup", this.onDocumentMouseUp)
    },
    onTextEditingTouchMove: function(e) {
        (e.clientX !== this.touchMouseStart.x || e.clientY !== this.touchMouseStart.y) && (this.touchMouseMoved = !0)
    },
    onTextEditingTouchEnd: function() {
        this.touchMouseMoved || SL.editor.controllers.Blocks.blur(), $(document).off("vmousemove", this.onTextEditingTouchMove), $(document).off("vmouseup", this.onTextEditingTouchEnd)
    },
    onDocumentKeyDown: function(e) {
        if (SL.view.isEditing() === !1) return !0;
        if (SL.util.isTypingEvent(e)) return !0;
        var t = this.editor.sidebar.isExpanded();
        if (!t) {
            var i = e.metaKey || e.ctrlKey,
                n = this.getFocusedBlocks();
            if (37 === e.keyCode || 38 === e.keyCode || 39 === e.keyCode || 40 === e.keyCode && n.length) {
                var r = e.shiftKey ? 10 : 1,
                    o = 0,
                    s = 0;
                switch (e.keyCode) {
                    case 37:
                        o = -r;
                        break;
                    case 39:
                        o = r;
                        break;
                    case 38:
                        s = -r;
                        break;
                    case 40:
                        s = r
                }
                n.forEach(function(e) {
                    e.move(o, s, {
                        isOffset: !0
                    })
                })
            } else 8 !== e.keyCode && 46 !== e.keyCode || !n.length ? i && !e.shiftKey && 65 === e.keyCode ? (this.getCurrentBlocks().forEach(function(e) {
                SL.editor.controllers.Blocks.focus(e, !0, !1)
            }), e.preventDefault()) : i && !e.shiftKey && 67 === e.keyCode && n.length ? (SL.editor.controllers.Blocks.copy(), e.preventDefault()) :
            i && !e.shiftKey && 88 === e.keyCode && n.length ? (SL.editor.controllers.Blocks.cut(), e.preventDefault()) :
            i && !e.shiftKey && 86 === e.keyCode && SL.editor.controllers.Blocks.getClipboard().length > 0 && (SL.editor.controllers.Blocks.paste(), e.preventDefault()) :
            (n.forEach(function(e) {
                e.destroy()
            }),
            e.preventDefault())
        }
    },
    checkVideoOptions: function(e) {

        let videoSelected   = e.domElement,
            videoId         = videoSelected.attr('data-video-id'),
            idRev           = TWIG.idRev,
            idPres          = TWIG.idPres,
            imageUrl        = (process.env.ISPROD === true) ? `https://s3-${process.env.REGION}.amazonaws.com/${process.env.ENV_BUCKET}/${TWIG.companyParentName.replace(/\s/g, '-')}/thumbs/video/videothumb-${videoId}.jpg` : `/${TWIG.thumbUrl}/videothumb-${videoId}.jpg`,
            defaultposter   = `/img/video-poster.jpg`,
            poster          = videoSelected.attr('data-video-poster');

        if (poster !== '' && typeof poster !== 'undefined') {
            switch(poster) {
                case defaultposter:
                    $('#video-options input#default_poster[type="checkbox"]').attr('checked', true);
                    $('.toolbars #videoposter').hide();
                    $('#previewposter img').attr('src', defaultposter);
                    break;
                case imageUrl:
                    $('.toolbars #videoposter').show();
                    $('#previewposter img').attr('src', imageUrl);
                    break;
                default:
                    $('.toolbars #videoposter').show();
                    $('#previewposter img').attr('src', poster);
            }
        }
        if (videoSelected.attr('data-video-autoplay') === 'true') {
            $('#video-options input#default_autoplay[type="checkbox"]').attr('checked', true)
        }
    }
};

'use strict';

export const toolbarsadd = {
    init: function() {
        this._super()
    },
    render: function() {
        this._super(),
        this.domElement.attr("data-type", "add"),
        this.domElement.addClass("add-bar"),
        SL.config.BLOCKS.forEach(function(e) {
            if (!e.hidden) {
                if(e.type !== "survey" && e.type !== "html"){
                    var t = $(['<div class="toolbar-add-block-option" data-block-type="' + e.type + '" title="' + e.title + '">', '<span' +
                    ' class="toolbar-add-block-option-icon icon i-' + e.icon + '"></span>', '<span class="toolbar-add-block-option-label">' + e.label + "</span>", "</div>"].join(""));
                }
                else{
                    var t = $(['<div class="toolbar-add-block-option" data-block-type="' + e.type + '" title="' + e.title + '">', '<span' +
                    ' class="toolbar-add-block-option-icon icon fa-' + e.icon + '"></span>', '<span class="toolbar-add-block-option-label">' + e.label + "</span>", "</div>"].join(""));
                }
                this.bindOption(t, e),
                    t.appendTo(this.listElement)
                // this.bindOption(t, e), t.appendTo("#wrapper .button-edit-clm .toolbar-list")
            }
        }.bind(this)), this.renderSnippets()
    },
    renderSnippets: function() {
        this.snippetsOptions = $(['<div class="toolbar-add-block-option">', '<span class="toolbar-add-block-option-icon icon i-document-alt-stroke"></span>', '<span class="toolbar-add-block-option-label">Snippet</span>', "</div>"].join("")), this.snippetsOptions.on("vclick", function() {
            SL.view.toolbars.push(new SL.editor.components.toolbars.AddSnippet)
        }.bind(this))
    },
    sync: function() {
        this._super();
        var e = SL.view.getCurrentTheme();
        e && e.get("snippets") && !e.get("snippets").isEmpty() ? this.snippetsOptions.appendTo(this.listElement) : this.snippetsOptions.detach()
    },
    bindOption: function(e, t) {
        function i() {
            l || (SL.editor.controllers.Blocks.add({
                type: t.type,
                blockOptions: {
                    insertedFromToolbar: !0
                }
            }),
            SL.analytics.trackEditor("Insert block", t.type)), t.type === "survey" ? SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement.remove() && SL.view.toolbars.domElement.addClass("survey-sideBar").attr("id", "survey_sideBar") : null
        }

        function n(e) {
            a = !0, l = !1, s = e.clientX, $(document).on("mousemove", r), $(document).on("mouseup", o), e.preventDefault()
        }

        function r(e) {
            if (a && !l && e.clientX - s > 10) {
                l = !0;
                var i = SL.editor.controllers.Blocks.add({
                        type: t.type,
                        silent: !0,
                        center: !1
                    }),
                    n = $(".reveal .slides").offset(),
                    r = i.measure();
                i.move(e.clientX - n.left - r.width / 2, e.clientY - n.top - r.height / 2), i.onMouseDown(e), SL.analytics.trackEditor("Insert block via drag", t.type)
            }
            e.preventDefault()
        }

        function o() {
            $(document).off("mousemove", r), $(document).off("mouseup", o), a = !1, l = !1
        }
        var s = 0,
            a = !1,
            l = !1;
        e.on("vclick", i),
        //SL.editor.controllers.Capabilities.isTouchEditor() ||
        e.on("mousedown", n)
    }
};

'use strict';

import * as slbase from './base';

export default slbase.extend({
    init: function(e) {
        this._super("snippet", $.extend({}, e)), this.plug(SL.editor.blocks.plugin.HTML)
    },
    bind: function() {
        this._super(), this.onEditingKeyUp = this.onEditingKeyUp.bind(this), this.onEditingKeyDown = this.onEditingKeyDown.bind(this), this.onEditingInput = this.onEditingInput.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    blur: function() {
        this._super(), this.disableEditing()
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: SL.editor.blocks.Snippet.DEFAULT_WIDTH,
            height: SL.editor.blocks.Snippet.DEFAULT_HEIGHT
        })
    },
    resizeToFitContent: function() {
        this.domElement.css("width", "auto");
        var e = Math.min(this.domElement.outerWidth(), SL.view.getSlideSize().width);
        (0 === e || isNaN(e)) && (e = SL.editor.blocks.Snippet.DEFAULT_WIDTH), this.domElement.css("width", e), this.domElement.css("height", "auto");
        var t = Math.min(this.domElement.outerHeight(), SL.view.getSlideSize().height);
        (0 === t || isNaN(t)) && (t = SL.editor.blocks.Snippet.DEFAULT_HEIGHT), this.domElement.css("height", t)
    },
    getToolbarOptions: function() {
        return [SL.editor.components.toolbars.options.TextAlign, SL.editor.components.toolbars.options.TextSize, SL.editor.components.toolbars.options.LineHeight, SL.editor.components.toolbars.options.LetterSpacing, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.TextColor, SL.editor.components.toolbars.options.BackgroundColor, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Padding, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
    },
    enableEditing: function() {
        this.isEditingText() || (this.contentElement.attr("contenteditable", ""), this.domElement.addClass("is-editing"), this.contentElement.on("keyup", this.onEditingKeyUp), this.contentElement.on("keydown", this.onEditingKeyDown), this.contentElement.on("input", this.onEditingInput), this.editor = CKEDITOR.inline(this.contentElement.get(0), {
            allowedContent: !0
        }), this.editor.on("instanceReady", function() {
            this.editor.focus();
            var e = this.editor.createRange();
            e.moveToElementEditEnd(this.editor.editable()), e.select()
        }.bind(this)))
    },
    disableEditing: function() {
        this.contentElement.removeAttr("contenteditable").blur(), this.domElement.removeClass("is-editing"), this.contentElement.off("keyup", this.onEditingKeyUp), this.contentElement.off("keydown", this.onEditingKeyDown), this.contentElement.off("input", this.onEditingInput), this.editor && (this.editor.destroy(), this.editor = null), SL.editor.controllers.Blocks.afterBlockTextSaved(this.contentElement)
    },
    isEditingText: function() {
        return this.domElement.hasClass("is-editing")
    },
    toggleAttributeWhen: function(e, t) {
        t ? this.contentElement.attr(e, "") : this.contentElement.removeAttr(e)
    },
    onDoubleClick: function(e) {
        this._super(e), SL.view.isEditing() && this.enableEditing()
    },
    onKeyDown: function(e) {
        this._super(e), 13 === e.keyCode ? this.isEditingText() || SL.util.isTypingEvent(e) ? e.metaKey && this.disableEditing() : (e.preventDefault(), this.enableEditing()) : 27 === e.keyCode && (e.preventDefault(), this.disableEditing())
    },
    onEditingKeyUp: function() {
        SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingKeyDown: function() {
        SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingInput: function() {
        setTimeout(function() {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, 1)
    },
    onPropertyChanged: function(e) {
        -1 !== e.indexOf("style.letter-spacing") && this.toggleAttributeWhen("data-has-letter-spacing", this.isset("style.letter-spacing")), -1 !== e.indexOf("style.line-height") && this.toggleAttributeWhen("data-has-line-height", this.isset("style.line-height"))
    }
});
export const snippet_default_width = SL.editor.blocks.Snippet.DEFAULT_WIDTH = 300;
export const snippet_default_height = SL.editor.blocks.Snippet.DEFAULT_HEIGHT = 300;
export const snippet_table = SL("editor.blocks").Table = SL.editor.blocks.Base.extend({
    init: function(e) {
        this._super("table", $.extend({
            minWidth: 100,
            verticalResizing: !1
        }, e)), e.rows && this.setRows(e.rows), this.setupContextMenu()
    },
    setup: function() {
        this._super(), this.tableSizeChanged = new signals.Signal, this.tableHeaderChanged = new signals.Signal, this.properties.attribute["data-table-cols"] = {
            type: "number",
            decimals: 0,
            minValue: 1,
            maxValue: 10,
            defaultValue: 3
        }, this.properties.attribute["data-table-rows"] = {
            type: "number",
            decimals: 0,
            minValue: 1,
            maxValue: 18,
            defaultValue: 3
        }, this.properties.attribute["data-table-padding"] = {
            type: "number",
            unit: "px",
            decimals: 0,
            minValue: 0,
            maxValue: 30,
            defaultValue: 5
        }, this.properties.attribute["data-table-has-header"] = {
            defaultValue: !0
        }, this.properties.attribute["data-table-border-width"] = {
            type: "number",
            unit: "px",
            decimals: 0,
            minValue: 0,
            maxValue: 20,
            defaultValue: 1
        }, this.properties.attribute["data-table-border-color"] = {}, this.repaintProperties = ["attribute.data-table-cols", "attribute.data-table-rows", "attribute.data-table-padding", "attribute.data-table-has-header", "attribute.data-table-border-width", "attribute.data-table-border-color"]
    },
    setupContextMenu: function() {
        this.contextMenu = new SL.components.ContextMenu({
            anchor: this.contentElement,
            options: [{
                label: "Insert row above",
                callback: this.onInsertRowAbove.bind(this),
                filter: function() {
                    return this.getTableRowCount() < this.getPropertySettings("attribute.data-table-rows").maxValue
                }.bind(this)
            }, {
                label: "Insert row below",
                callback: this.onInsertRowBelow.bind(this),
                filter: function() {
                    return this.getTableRowCount() < this.getPropertySettings("attribute.data-table-rows").maxValue
                }.bind(this)
            }, {
                label: "Insert column left",
                callback: this.onInsertColLeft.bind(this),
                filter: function() {
                    return this.getTableColCount() < this.getPropertySettings("attribute.data-table-cols").maxValue
                }.bind(this)
            }, {
                label: "Insert column right",
                callback: this.onInsertColRight.bind(this),
                filter: function() {
                    return this.getTableColCount() < this.getPropertySettings("attribute.data-table-cols").maxValue
                }.bind(this)
            }, {
                type: "divider"
            }, {
                label: "Delete row",
                callback: this.onDeleteRow.bind(this),
                filter: function() {
                    return this.getTableRowCount() > this.getPropertySettings("attribute.data-table-rows").minValue
                }.bind(this)
            }, {
                label: "Delete column",
                callback: this.onDeleteCol.bind(this),
                filter: function() {
                    return this.getTableColCount() > this.getPropertySettings("attribute.data-table-cols").minValue
                }.bind(this)
            }]
        }), this.contextMenu.shown.add(this.onContextMenuShown.bind(this)), this.contextMenu.hidden.add(this.onContextMenuHidden.bind(this)), this.contextMenu.destroyed.add(this.onContextMenuHidden.bind(this))
    },
    bind: function() {
        this._super(), this.onEditingKeyUp = this.onEditingKeyUp.bind(this), this.onEditingKeyDown = this.onEditingKeyDown.bind(this), this.onEditingInput = this.onEditingInput.bind(this), this.onCellFocused = this.onCellFocused.bind(this), this.onCellMouseOver = this.onCellMouseOver.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    blur: function() {
        this._super(), this.isEditingText() && this.disableEditing()
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: SL.editor.blocks.Table.DEFAULT_WIDTH,
            height: SL.editor.blocks.Table.DEFAULT_HEIGHT
        })
    },
    getToolbarOptions: function() {
        return [SL.editor.components.toolbars.groups.TableSize, SL.editor.components.toolbars.options.TableHasHeader, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.TablePadding, SL.editor.components.toolbars.options.TableBorderWidth, SL.editor.components.toolbars.options.TableBorderColor, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.TextAlign, SL.editor.components.toolbars.options.TextSize, SL.editor.components.toolbars.options.TextColor, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.BackgroundColor, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.Animation].concat(this._super())
    },
    getTableElement: function() {
        var e = this.contentElement.find("table");
        0 === e.length && (e = $("<table>").appendTo(this.contentElement));
        var t = e.find("tbody");
        return 0 === t.length && (t = $("<tbody>").appendTo(e)), e
    },
    getTableRowCount: function() {
        return this.getTableElement().find("tr").length
    },
    getTableColCount: function() {
        return this.getTableElement().find("tr").first().find("td, th").length
    },
    getTableBorderColor: function() {
        return this.getTableElement().find("td, th").css("border-top-color")
    },
    resize: function() {
        this._super.apply(this, arguments), this.paint()
    },
    paint: function() {
        this._super.apply(this, arguments);
        var e = this.getTableElement(),
            t = this.get("attribute.data-table-rows"),
            i = this.get("attribute.data-table-cols"),
            n = t - e.find("tr").length;
        if (n > 0)
            for (var r = 0; n > r; r++) e.append("<tr></tr>");
        else 0 > n && e.find("tr:gt(" + (t - 1) + ")").remove();
        e.find("tr").each(function(e, t) {
            var n = $(t),
                r = i - n.find("td, th").length;
            if (r > 0)
                for (var o = 0; r > o; o++) this.backfill($("<td></td>").appendTo(n));
            else if (0 > r) {
                var s = i - 1;
                n.find("td:gt(" + s + "), th:gt(" + s + ")").remove()
            }
        }.bind(this)), this.get("attribute.data-table-has-header") ? e.find("tr").first().find("td").changeElementType("th") : e.find("tr").first().find("th").changeElementType("td"), e.find("td, th").css({
            padding: this.isset("attribute.data-table-padding") ? this.get("attribute.data-table-padding") : "",
            "border-width": this.isset("attribute.data-table-border-width") ? this.get("attribute.data-table-border-width") : "",
            "border-color": this.isset("attribute.data-table-border-color") ? this.get("attribute.data-table-border-color") : ""
        }), e.find("td:last-child, th:last-child").css("width", ""), this.refreshMinWidth(), this.paintResizeHandles()
    },
    paintResizeHandles: function() {
        var e = [],
            t = this.getTableElement(),
            i = Math.floor(this.get("attribute.data-table-border-width") / 2);
        t.find("tr").first().find("td:not(:last), th:not(:last)").each(function(t, n) {
            var r = this.contentElement.find('.sl-table-column-resizer[data-column-index="' + t + '"]');
            0 === r.length && (r = $('<div class="editing-ui sl-table-column-resizer" data-column-index="' + t + '"></div>'), r.on("vmousedown", this.onResizeHandleMouseDOwn.bind(this)), r.on("dblclick", this.onResizeHandleDoubleClick.bind(this)), r.appendTo(this.contentElement)), r.css("left", n.offsetLeft + n.offsetWidth + i), e.push(t)
        }.bind(this)), this.contentElement.find(".sl-table-column-resizer").each(function() {
            -1 === e.indexOf(parseInt(this.getAttribute("data-column-index"), 10)) && $(this).remove()
        })
    },
    onResizeHandleMouseDOwn: function(e) {
        e.preventDefault();
        var t = this.getTableElement(),
            i = $(e.currentTarget),
            n = parseInt(i.attr("data-column-index"), 10),
            r = t.find("td:eq(" + n + "), th:eq(" + n + ")").first(),
            o = this.domElement.offset().left,
            s = r.position().left,
            a = s + SL.editor.blocks.Table.MIN_COL_WIDTH,
            l = this.measure().width;
        i.addClass("is-dragging"), l -= this.getMinWidthFromCells(t.find("tr:first-child td:gt(" + n + "), th:gt(" + n + ")"));
        var c = function(e) {
                var i = n + 1;
                t.find("td:nth-child(" + i + "), th:nth-child(" + i + ")").css({
                    width: Math.round(Math.max(Math.min(e.clientX - o, l), a) - s)
                }), this.paintResizeHandles()
            }.bind(this),
            d = function() {
                i.removeClass("is-dragging"), $(document).off("vmousemove", c), $(document).off("vmouseup", d)
            }.bind(this);
        $(document).on("vmousemove", c), $(document).on("vmouseup", d)
    },
    onResizeHandleDoubleClick: function(e) {
        var t = parseInt($(e.currentTarget).attr("data-column-index"), 10);
        this.getTableElement().find("td:eq(" + t + "), th:eq(" + t + ")").css("width", ""), this.paintResizeHandles()
    },
    enableEditing: function(e) {
        if (!this.isEditingText()) {
            this.domElement.addClass("is-editing"), this.contentElement.on("keyup", this.onEditingKeyUp), this.contentElement.on("keydown", this.onEditingKeyDown), this.contentElement.on("input", this.onEditingInput);
            var t = this.contentElement.find("td, th");
            t.wrapInner("<div contenteditable>"), t.find("[contenteditable]").on("mouseover", this.onCellMouseOver).on("focus", this.onCellFocused), e = e || this.contentElement.find("td, th").first(), this.enableEditingOfCell(e, !0), e.find(">[contenteditable]").focus()
        }
        this.paint()
    },
    enableEditingOfCell: function(e, t) {
        if (e) {
            var i = e.find(">[contenteditable]").first(),
                n = i.data("ckeditor");
            n || (n = CKEDITOR.inline(i.get(0), this.getEditorOptions(e)), i.data("ckeditor", n), t && n.on("instanceReady", function() {
                SL.util.selection.moveCursorToEnd(i.get(0))
            }.bind(this)), SL.editor.controllers.Capabilities.isTouchEditor() && window.scrollTo(0, Math.max(e.offset().top - 100, 0)))
        }
    },
    disableEditing: function() {
        this.domElement.removeClass("is-editing"), this.contentElement.off("keyup", this.onEditingKeyUp), this.contentElement.off("keydown", this.onEditingKeyDown), this.contentElement.off("input", this.onEditingInput), this.getTableElement().find("td>[contenteditable], th>[contenteditable]").each(function(e, t) {
            var i = $(t);
            i.data("ckeditor") && (i.data("ckeditor").destroy(), i.data("ckeditor", "")), t.parentNode.innerHTML = t.innerHTML
        }), this.contentElement.find("td, th").off("mouseover", this.onCellMouseOver).off("focus", this.onCellFocused).blur(), SL.util.selection.clear(), this.paint(), SL.editor.controllers.Blocks.afterBlockTextSaved(this.contentElement)
    },
    isEditingText: function() {
        return this.domElement.hasClass("is-editing")
    },
    enableBackfill: function() {
        this.backfillData = [], this.getTableElement().find("tr").each(function(e, t) {
            $(t).find("td, th").each(function(t, i) {
                this.backfillData[t] = this.backfillData[t] || [], this.backfillData[t][e] = i.innerHTML
            }.bind(this))
        }.bind(this))
    },
    disableBackfill: function() {
        this.backfillData = null
    },
    backfill: function(e) {
        if (this.backfillData && this.backfillData.length) {
            var t = e.index(),
                i = e.parent().index();
            if (this.backfillData[t]) {
                var n = this.backfillData[t][i];
                n && e.html(n)
            }
        }
    },
    setRows: function(e) {
        var t = 0;
        e.forEach(function(e) {
            t = Math.max(e.length, t)
        }), this.set("attribute.data-table-rows", e.length), this.set("attribute.data-table-cols", t), this.getTableElement().find("tr").each(function(t) {
            $(this).find("th, td").each(function(i) {
                $(this).text(e[t][i] || "")
            })
        })
    },
    getCellAtPoint: function(e, t) {
        var i;
        return this.contentElement.find("td, th").each(function(n, r) {
            var o = r.getBoundingClientRect();
            e > o.left && e < o.right && t > o.top && t < o.bottom && (i = r)
        }.bind(this)), i
    },
    getRowAtPoint: function(e, t) {
        return $(this.getCellAtPoint(e, t)).parents("tr").get(0)
    },
    getEditorOptions: function(e) {
        var t = {
            enterMode: CKEDITOR.ENTER_BR,
            autoParagraph: !1,
            allowedContent: {
                "strong em u s del ins": {
                    styles: "text-align"
                }
            },
            floatSpaceDockedOffsetX: -this.get("attribute.data-table-padding"),
            floatSpaceDockedOffsetY: this.get("attribute.data-table-padding")
        };
        return t.toolbar = e.is("th") ? [
            ["Italic", "underline", "Strike"]
        ] : [
            ["Bold", "Italic", "Underline", "Strike"]
        ], t
    },
    propagateDOMTableSize: function() {
        this.set({
            "attribute.data-table-rows": this.getTableElement().find("tr").length,
            "attribute.data-table-cols": this.getTableElement().find("tr").first().find("td, th").length
        }), this.tableSizeChanged.dispatch()
    },
    refreshMinWidth: function() {
        this.options.minWidth = this.getMinWidthFromCells(this.getTableElement().find("tr:first-child td, tr:first-child th"))
    },
    getMinWidthFromCells: function(e) {
        var t = 0;
        return e.each(function() {
            t += "string" == typeof this.style.width && this.style.width.length ? parseInt(this.style.width, 10) : SL.editor.blocks.Table.MIN_COL_WIDTH
        }), t
    },
    destroy: function() {
        this.isEditingText() && this.disableEditing(), this.contextMenu.destroy(), this.tableSizeChanged.dispose(), this.tableSizeChanged = null, this.tableHeaderChanged.dispose(), this.tableHeaderChanged = null, this._super()
    },
    onDoubleClick: function(e) {
        this._super(e), SL.view.isEditing() && this.enableEditing($(this.getCellAtPoint(e.clientX, e.clientY)))
    },
    onCellMouseOver: function(e) {
        var t = $(e.currentTarget).parent();
        t.length && this.enableEditingOfCell(t)
    },
    onCellFocused: function(e) {
        var t = $(e.currentTarget).parent();
        if (t.length) {
            var i = "number" == typeof this.lastTabTime && Date.now() - this.lastTabTime < 100;
            this.enableEditingOfCell(t, i)
        }
    },
    onKeyDown: function(e) {
        this._super(e), 13 === e.keyCode ? this.isEditingText() || SL.util.isTypingEvent(e) ? e.metaKey && this.disableEditing() : (e.preventDefault(), this.enableEditing()) : 27 === e.keyCode ? (e.preventDefault(), this.disableEditing()) : 9 === e.keyCode && (this.lastTabTime = Date.now())
    },
    onEditingKeyUp: function() {
        SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingKeyDown: function() {
        SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingInput: function() {
        setTimeout(function() {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, 1)
    },
    onPropertyChanged: function(e) {
        var t = e.some(function(e) {
            return -1 !== this.repaintProperties.indexOf(e)
        }.bind(this));
        if (t && this.paint(), -1 !== e.indexOf("style.color")) {
            var i = this.contentElement.get(0);
            i.style.display = "none", i.offsetHeight, i.style.display = ""
        } - 1 !== e.indexOf("attribute.data-table-has-header") && this.tableHeaderChanged.dispatch()
    },
    onContextMenuShown: function(e) {
        var t = $(this.getCellAtPoint(e.clientX, e.clientY));
        t.length && (t.addClass("context-menu-is-open"), this.isEditingText() && this.disableEditing())
    },
    onContextMenuHidden: function() {
        this.getTableElement().find(".context-menu-is-open").removeClass("context-menu-is-open")
    },
    onInsertRowAbove: function(e) {
        var t = $(this.getRowAtPoint(e.clientX, e.clientY));
        if (t.length) {
            var i = t.clone();
            i.children().empty(), 0 === t.index() && (t.find("th").changeElementType("td"), i.find("td").changeElementType("th")), t.before(i), this.propagateDOMTableSize()
        }
    },
    onInsertRowBelow: function(e) {
        var t = $(this.getRowAtPoint(e.clientX, e.clientY));
        t.length && (t.after("<tr>"), this.propagateDOMTableSize())
    },
    onDeleteRow: function(e) {
        var t = $(this.getRowAtPoint(e.clientX, e.clientY));
        t.length && (t.remove(), this.propagateDOMTableSize())
    },
    onInsertColLeft: function(e) {
        var t = $(this.getCellAtPoint(e.clientX, e.clientY));
        if (t.length) {
            var i = t.index(); - 1 !== i && (this.getTableElement().find("td:nth-child(" + (i + 1) + ")").before("<td>"), this.getTableElement().find("th:nth-child(" + (i + 1) + ")").before("<th>"), this.propagateDOMTableSize())
        }
    },
    onInsertColRight: function(e) {
        var t = $(this.getCellAtPoint(e.clientX, e.clientY));
        if (t.length) {
            var i = t.index(); - 1 !== i && (this.getTableElement().find("td:nth-child(" + (i + 1) + ")").after("<td>"), this.getTableElement().find("th:nth-child(" + (i + 1) + ")").after("<th>"), this.propagateDOMTableSize())
        }
    },
    onDeleteCol: function(e) {
        var t = $(this.getCellAtPoint(e.clientX, e.clientY));
        if (t.length) {
            var i = t.index(); - 1 !== i && (this.getTableElement().find("td:nth-child(" + (i + 1) + "), th:nth-child(" + (i + 1) + ")").remove(), this.propagateDOMTableSize())
        }
    }
});
export const snippet_table_default_width = SL.editor.blocks.Table.DEFAULT_WIDTH = 800;
export const snippet_table_default_height = SL.editor.blocks.Table.DEFAULT_HEIGHT = 400;
export const snippet_table_min_col_width = SL.editor.blocks.Table.MIN_COL_WIDTH = 40;
export const snippet_text = SL("editor.blocks").Text = SL.editor.blocks.Base.extend({
    init: function(e) {
        this._super("text", $.extend({
            verticalResizing: !1,
            placeholderTag: "p",
            placeholderText: "Text"
        }, e)), this.plug(SL.editor.blocks.plugin.HTML), this.readDefaultContent(), this.injectDefaultContent()
    },
    bind: function() {
        this._super(), this.onEditingKeyUp = this.onEditingKeyUp.bind(this), this.onEditingKeyDown = this.onEditingKeyDown.bind(this), this.onEditingInput = this.onEditingInput.bind(this), this.onEditingFocusOut = this.onEditingFocusOut.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    blur: function() {
        this._super(), this.isEditingText() && this.disableEditing()
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: SL.editor.blocks.Text.DEFAULT_WIDTH
        })
    },
    readDefaultContent: function() {
        this.contentElement.attr("data-placeholder-tag") ? this.options.placeholderTag = this.contentElement.attr("data-placeholder-tag") : this.contentElement.attr("data-placeholder-tag", this.options.placeholderTag), this.contentElement.attr("data-placeholder-text") ? this.options.placeholderText = this.contentElement.attr("data-placeholder-text") : this.contentElement.attr("data-placeholder-text", this.options.placeholderText)
    },
    injectDefaultContent: function() {
        var e = this.getDefaultContent();
        "" === this.contentElement.text().trim() && e && (this.hasPlugin(SL.editor.blocks.plugin.HTML) && this.hasCustomHTML() || this.contentElement.html(e))
    },
    clearDefaultContent: function() {
        this.contentElement.html().trim() === this.getDefaultContent() && this.contentElement.html(this.getDefaultContent(!0))
    },
    getDefaultContent: function(e) {
        return this.options.placeholderTag && this.options.placeholderText ? e ? "<" + this.options.placeholderTag + ">&nbsp;</" + this.options.placeholderTag + ">" : "<" + this.options.placeholderTag + ">" + this.options.placeholderText + "</" + this.options.placeholderTag + ">" : ""
    },
    externalizeLinks: function() {
        SL.util.openLinksInTabs(this.contentElement)
    },
    resize: function() {
        this._super.apply(this, arguments), this.syncPairs(), this.syncOverflow()
    },
    getToolbarOptions: function() {
        return [SL.editor.components.toolbars.options.TextAlign, SL.editor.components.toolbars.options.TextSize, SL.editor.components.toolbars.options.LineHeight, SL.editor.components.toolbars.options.LetterSpacing, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.TextColor, SL.editor.components.toolbars.options.BackgroundColor, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Padding, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
    },
    focus: function() {
        this._super(), SL.editor.controllers.Blocks.discoverBlockPairs(), this.syncOverflow()
    },
    enableEditing: function() {
        if (!this.isEditingText()) {
            this.contentElement.attr("contenteditable", ""), this.domElement.addClass("is-editing"), this.contentElement.on("keyup", this.onEditingKeyUp), this.contentElement.on("keydown", this.onEditingKeyDown), this.contentElement.on("input", this.onEditingInput), this.contentElement.on("focusout", this.onEditingFocusOut), this.clearDefaultContent();
            var e = {};
            SL.editor.controllers.Capabilities.isTouchEditor() && (this.contentElement.focus(), e.toolbar = [
                    ["Format"],
                    ["NumberedList", "BulletedList", "-", "Blockquote"]
                ],
                window.scrollTo(0, Math.max(this.contentElement.offset().top - 60, 0))), this.hasPlugin(SL.editor.blocks.plugin.HTML) && this.hasCustomHTML() && (e.allowedContent = !0), e.contentsLangDirection = SLConfig.deck.rtl === !0 ? "rtl" : "ui";
            var t = SL.view.getCurrentTheme();
            if (t && t.hasPalette()) {
                var i = t.get("palette");
                i = i.join(","), i = i.replace(/#/g, ""), e.colorButton_colors = i
            }
            this.editor = CKEDITOR.inline(this.contentElement.get(0), e), this.editor.on("instanceReady", function() {
                this.contentElement.html(this.contentElement.html().trim()), this.editor.focus();
                var e = this.editor.createRange();
                e.moveToElementEditEnd(this.editor.editable()), e.select()
            }.bind(this))
        }
    },
    disableEditing: function() {
        this.contentElement.removeAttr("contenteditable").blur(), this.domElement.removeClass("is-editing"), this.contentElement.off("keyup", this.onEditingKeyUp), this.contentElement.off("keydown", this.onEditingKeyDown), this.contentElement.off("input", this.onEditingInput), this.contentElement.off("focusout", this.onEditingFocusOut), this.externalizeLinks(), this.injectDefaultContent(), this.editor && (this.editor.destroy(), this.editor = null), SL.editor.controllers.Blocks.afterBlockTextSaved(this.contentElement)
    },
    syncPairs: function() {
        if (!this.destroyed) {
            var e = this.measure();
            this.pairings.forEach(function(t) {
                "bottom" === t.direction && t.block.move(null, e.bottom)
            }), this._super()
        }
    },
    syncOverflow: function() {
        this.domElement.toggleClass("is-text-overflowing", this.contentElement.prop("scrollHeight") > SL.view.getSlideSize().height)
    },
    isEditingText: function() {
        return this.domElement.hasClass("is-editing")
    },
    toggleAttributeWhen: function(e, t) {
        t ? this.contentElement.attr(e, "") : this.contentElement.removeAttr(e)
    },
    onDoubleClick: function(e) {
        this._super(e), SL.view.isEditing() && this.enableEditing()
    },
    onKeyDown: function(e) {
        this._super(e), 13 === e.keyCode ? this.isEditingText() || SL.util.isTypingEvent(e) ? e.metaKey && this.disableEditing() : (e.preventDefault(), this.enableEditing()) : 27 === e.keyCode && (e.preventDefault(), this.disableEditing())
    },
    onEditingKeyUp: function() {
        this.syncPairs(), this.syncOverflow(), SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingKeyDown: function() {
        SL.editor.controllers.Blocks.afterBlockTextInput()
    },
    onEditingInput: function() {
        setTimeout(function() {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, 1)
    },
    onEditingFocusOut: function() {
        SL.editor.controllers.Capabilities.isTouchEditor() && setTimeout(function() {
            this.isEditingText() && 0 === $(document.activeElement).closest(".cke").length && this.disableEditing()
        }.bind(this), 1)
    },
    onPropertyChanged: function(e) {
        -1 !== e.indexOf("style.letter-spacing") && this.toggleAttributeWhen("data-has-letter-spacing", this.isset("style.letter-spacing")), -1 !== e.indexOf("style.line-height") && this.toggleAttributeWhen("data-has-line-height", this.isset("style.line-height")), this.syncPairs(), this.syncOverflow()
    }
});
export const snippet_text_default_width = SL.editor.blocks.Text.DEFAULT_WIDTH = 600;
export const snippet_colorpicker = SL("editor.components").Colorpicker = Class.extend({
    init: function(e) {
        this.editor = e, this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="sl-colorpicker">'), this.arrowElement = $('<div class="sl-colorpicker-arrow">').appendTo(this.domElement), this.apiElement = $('<div class="sl-colorpicker-api">').appendTo(this.domElement)
    },
    bind: function() {
        this.onChooseClicked = this.onChooseClicked.bind(this), this.onResetClicked = this.onResetClicked.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this)
    },
    renderColorpicker: function() {
        this.hasRenderedColorPicker || (this.hasRenderedColorPicker = !0, this.apiElement.spectrum({
            flat: !0,
            showInput: !0,
            showButtons: !1,
            showInitial: !0,
            showPalette: !0,
            showPaletteOnly: !0,
            togglePaletteOnly: !0,
            showSelectionPalette: !0,
            hideAfterPaletteSelect: !0,
            maxSelectionSize: 10,
            togglePaletteMoreText: "More options",
            togglePaletteLessText: "Fewer options",
            preferredFormat: "hex",
            localStorageKey: "sl-colors",
            className: "sl-colorpicker-spectrum",
            move: function(e) {
                this.config.changeCallback(this.config.alpha ? e.toRgbString() : e.toHexString(), !0)
            }.bind(this),
            change: function(e) {
                this.config.changeCallback(this.config.alpha ? e.toRgbString() : e.toHexString(), !0)
            }.bind(this),
            hide: function() {
                this.hide()
            }.bind(this)
        }), this.domElement.find(".sp-palette-toggle").on("mouseup", this.onMoreLessToggleClicked.bind(this))), this.domElement.find(".sl-colorpicker-buttons").remove(), this.domElement.append(['<div class="sl-colorpicker-buttons">', '<button class="sl-colorpicker-reset button s outline">' + this.config.resetText + "</button>", '<button class="sl-colorpicker-choose button s grey">' + this.config.chooseText + "</button>", "</div>"].join("")), this.domElement.find(".sl-colorpicker-reset").on("click", this.onResetClicked), this.domElement.find(".sl-colorpicker-choose").on("click", this.onChooseClicked), this.apiElement.spectrum("option", "palette", this.getColorPalettePresets(this.config.alpha)), this.apiElement.spectrum("option", "showAlpha", !!this.config.alpha), this.apiElement.spectrum("option", "cancelText", this.config.cancelText), this.apiElement.spectrum("option", "cancelClassName", this.config.cancelClassName), this.apiElement.spectrum("option", "chooseText", this.config.chooseText), this.apiElement.spectrum("option", "chooseClassName", this.config.chooseClassName), this.config.color && this.apiElement.spectrum("set", this.config.color), this.apiElement.spectrum("reflow")
    },
    layout: function() {
        var e = 10,
            t = 6,
            i = this.domElement.outerWidth(),
            n = this.domElement.outerHeight(),
            r = this.config.anchor.offset(),
            o = this.config.anchor.outerWidth(),
            s = this.config.anchor.outerHeight(),
            a = r.left + this.config.offsetX,
            l = r.top + this.config.offsetY;
        switch (this.config.alignment) {
            case "t":
                a += (o - i) / 2, l -= n + e;
                break;
            case "b":
                a += (o - i) / 2, l += s + e;
                break;
            case "l":
                a -= i + e, l += (s - n) / 2;
                break;
            case "r":
                a += o + e, l += (s - n) / 2
        }
        switch (a = Math.min(Math.max(a, e), window.innerWidth - i - e), l = Math.min(Math.max(l, e), window.innerHeight - n - e), this.config.alignment) {
            case "t":
                var arrowX = r.left - a + o / 2, arrowY = n;
                break;
            case "b":
                var arrowX = r.left - a + o / 2, arrowY = -t;
                break;
            case "l":
                var arrowX = i, arrowY = r.top - l + s / 2;
                break;
            case "r":
                var arrowX = -t, arrowY = r.top - l + s / 2
        }
        this.domElement.css({
            left: a,
            top: l
        }), this.arrowElement.css({
            left: arrowX,
            top: arrowY
        }), this.domElement.attr("data-alignment", this.config.alignment)
    },
    show: function(e) {
        if (!e.anchor) throw "Can not show color picker without anchor.";
        this.domElement.appendTo(document.body), this.config = $.extend({
            alignment: "l",
            offsetX: 0,
            offsetY: 0,
            alpha: !1,
            resetText: "Use default",
            chooseText: "Done",
            resetCallback: function() {},
            changeCallback: function() {},
            hiddenCallback: function() {}
        }, e), this.renderColorpicker(), this.layout(), $(window).on("resize", this.onWindowResize), $(document).on("mousedown", this.onDocumentMouseDown)
    },
    hide: function() {
        this.saveCurrentColorToPalette(), this.domElement.detach(), $(window).off("resize", this.onWindowResize), $(document).off("mousedown", this.onDocumentMouseDown)
    },
    toggle: function(e) {
        this.isVisible() ? this.hide() : this.show(e)
    },
    isVisible: function() {
        return this.domElement.parent().length > 0
    },
    setColor: function(e) {
        this.apiElement.spectrum("set", e), this.apiElement.spectrum("reflow")
    },
    getColor: function() {
        return this.apiElement.spectrum("get")
    },
    saveCurrentColorToPalette: function() {
        this.apiElement.spectrum("set")
    },
    getColorPalettePresets: function(e) {
        if (this.hasCustomPalette()) return [SL.view.getCurrentTheme().get("palette")];
        var t = ["rgb(0, 0, 0)", "rgb(34, 34, 34)", "rgb(68, 68, 68)", "rgb(102, 102, 102)", "rgb(136, 136, 136)", "rgb(170, 170, 170)", "rgb(204, 204, 204)", "rgb(238, 238, 238)", "rgb(255, 255, 255)"],
            i = ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(168, 39, 107)"],
            n = ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"];
        return e && t.push("transparent"), [t, i, n]
    },
    hasCustomPalette: function() {
        var e = SL.view.getCurrentTheme();
        return e && e.hasPalette()
    },
    destroy: function() {
        this.domElement.remove()
    },
    onResetClicked: function(e) {
        this.config.resetCallback(), this.hide(), e.preventDefault()
    },
    onChooseClicked: function(e) {
        this.saveCurrentColorToPalette(), this.hide(), e.preventDefault()
    },
    onMoreLessToggleClicked: function() {
        setTimeout(function() {
            this.layout()
        }.bind(this), 1)
    },
    onDocumentMouseDown: function(e) {
        var t = $(e.target);
        0 === t.closest(this.domElement).length && 0 === t.closest(this.config.anchor).length && this.hide()
    },
    onWindowResize: function() {
        this.layout()
    }
});

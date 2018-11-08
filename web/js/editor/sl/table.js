'use strict';

export const table = {
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
        return [
            SL.editor.components.toolbars.groups.TableSize,
            SL.editor.components.toolbars.options.TableHasHeader,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.TablePadding,
            SL.editor.components.toolbars.options.TableBorderWidth,
            SL.editor.components.toolbars.options.TableBorderColor,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.TextAlign,
            SL.editor.components.toolbars.options.TextSize,
            SL.editor.components.toolbars.options.TextColor,
            SL.editor.components.toolbars.options.BackgroundColor,
            SL.editor.components.toolbars.options.Opacity,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.groups.Animation,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.BlockDepth,
            SL.editor.components.toolbars.options.BlockActions
        ].concat(this._super())
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
               // SL.util.selection.moveCursorToEnd(i.get(0))
            }.bind(this))/*, SL.editor.controllers.Capabilities.isTouchEditor() && window.scrollTo(0, Math.max(e.offset().top - 100, 0))*/)
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
            enterMode: CKEDITOR.ENTER_P,
           /* autoParagraph: !1,*/
            shiftEnterMode : CKEDITOR.ENTER_P,
            allowedContent: true,
            floatSpaceDockedOffsetX: -this.get("attribute.data-table-padding"),
            floatSpaceDockedOffsetY: this.get("attribute.data-table-padding")
        };
        return t.toolbar = e.is("th") ? [
            [ 'Format', 'FontSize', 'TextColor', 'BGColor' ],
            [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat' ],
            [ 'NumberedList', 'BulletedList', '-', 'Blockquote' ],
            [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ]
            //[ 'Link', 'Unlink' ]
            // { name: 'basicstyles', groups: [ 'basicstyles'], items: ['Italic', 'Underline', 'Strike'] },
            // { name: 'paragraph',   groups: ['paragraph'], items : [ 'list', 'indent', 'align' ] },
            // { name: 'styles', items: [ 'Styles', 'Font', 'FontSize' ] },
            // { name: 'colors', items: [ 'TextColor', 'BGColor' ] }
        ] : [
            [ 'Format', 'FontSize', 'TextColor', 'BGColor' ],
            [ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat' ],
            [ 'NumberedList', 'BulletedList', '-', 'Blockquote' ],
            [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ]
           // [ 'Link', 'Unlink' ]
           // ["Bold", "Italic", "Underline", "Strike"]
           //  { name: 'basicstyles', groups: [ 'basicstyles'], items: ['Italic', 'Underline', 'Strike'] },
           //  { name: 'paragraph',   groups: [ 'list', 'indent', 'align' ] },
           //  { name: 'styles', items: [ 'Styles', 'Font', 'FontSize' ] },
           //  { name: 'colors', items: [ 'TextColor', 'BGColor' ] }
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
};

'use strict';

export const transformLine = {
    ANCHOR_SIZE: 16,
    init: function(e) {
        this.block = e, this.state = {
            direction: null,
            originalCursorPosition: {
                x: 0,
                y: 0
            },
            originalPoint: {
                x: 0,
                y: 0
            }
        }, this.render(), this.bind(), this.layout()
    },
    render: function() {
        this.domElement = $('<div class="sl-block-transform editing-ui">'), this.anchors = {}, this.anchors.p1 = $('<div class="anchor" data-direction="p1">').appendTo(this.domElement), this.anchors.p2 = $('<div class="anchor" data-direction="p2">').appendTo(this.domElement)
    },
    bind: function() {
        this.onMouseDown = this.onMouseDown.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.transformStarted = new signals.Signal, this.transformEnded = new signals.Signal;
        for (var e in this.anchors) this.anchors[e].on("vmousedown", this.onMouseDown)
    },
    layout: function() {
        var e = this.block.getViewBox();
        this.anchors.p1.css({
            left: this.block.get("attribute.data-line-x1") - e.x - 1,
            top: this.block.get("attribute.data-line-y1") - e.y - 1
        }), this.anchors.p2.css({
            left: this.block.get("attribute.data-line-x2") - e.x - 1,
            top: this.block.get("attribute.data-line-y2") - e.y - 1
        })
    },
    show: function() {
        0 === this.domElement.parent().length && (this.domElement.appendTo(this.block.domElement), this.domElement.addClass("visible"))
    },
    hide: function() {
        this.domElement.detach(), this.domElement.removeClass("visible")
    },
    destroy: function() {
        $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp), this.transformStarted.dispose(), this.transformEnded.dispose(), this.domElement.remove()
    },
    isResizing: function() {
        return !!this.state.direction
    },
    isResizingCentered: function() {
        return this.isResizing() && this.state.centered
    },
    isResizingProportionally: function() {
        return this.isResizing() && this.state.proportional
    },
    getState: function() {
        return this.state
    },
    onMouseDown: function(e) {
        e.preventDefault(), this.state.direction = $(e.currentTarget).attr("data-direction"), this.state.direction && ($(document).on("vmousemove", this.onMouseMove), $(document).on("vmouseup", this.onMouseUp), this.moved = !1, this.state.originalCursorPosition.x = e.clientX, this.state.originalCursorPosition.y = e.clientY, this.state.direction === SL.editor.blocks.Line.POINT_1 ? (this.state.originalPoint.x = this.block.get("attribute.data-line-x1"), this.state.originalPoint.y = this.block.get("attribute.data-line-y1")) : (this.state.originalPoint.x = this.block.get("attribute.data-line-x2"), this.state.originalPoint.y = this.block.get("attribute.data-line-y2")))
    },
    onMouseMove: function(e) {
        e.preventDefault(), this.moved || (this.transformStarted.dispatch(this), SL.editor.controllers.Guides.start([this.block], {
            action: "line-anchor",
            direction: this.state.direction
        })), this.moved = !0;
        var t = e.clientX - this.state.originalCursorPosition.x,
            i = e.clientY - this.state.originalCursorPosition.y,
            n = this.state.originalPoint.x + t,
            r = this.state.originalPoint.y + i;
        this.block.set(this.state.direction === SL.editor.blocks.Line.POINT_1 ? {
            "attribute.data-line-x1": n,
            "attribute.data-line-y1": r
        } : {
            "attribute.data-line-x2": n,
            "attribute.data-line-y2": r
        }), SL.editor.controllers.Guides.sync()
    },
    onMouseUp: function(e) {
        e.preventDefault(), $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp), SL.editor.controllers.Guides.stop(), this.moved && this.transformEnded.dispatch(this), this.state.direction = null
    }
};

'use strict';

export const transform = {
    ANCHOR_SIZE: 16,
    init: function(e) {
        this.block = e, this.state = {
            direction: null,
            centered: !1,
            proportional: !1,
            originalMeasurements: null,
            originalCursorPosition: {
                x: 0,
                y: 0
            }
        }, this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="sl-block-transform editing-ui">'), this.domElement.attr({
            "data-horizontal": this.block.options.horizontalResizing,
            "data-vertical": this.block.options.verticalResizing
        }), this.anchors = {}, this.anchors.n = $('<div class="anchor" data-direction="n">').appendTo(this.domElement),
        this.anchors.e = $('<div class="anchor" data-direction="e">').appendTo(this.domElement), this.anchors.s = $('<div class="anchor" data-direction="s">').appendTo(this.domElement), this.anchors.w = $('<div class="anchor" data-direction="w">').appendTo(this.domElement), this.anchors.nw = $('<div class="anchor" data-direction="nw">').appendTo(this.domElement), this.anchors.ne = $('<div class="anchor" data-direction="ne">').appendTo(this.domElement), this.anchors.se = $('<div class="anchor" data-direction="se">').appendTo(this.domElement), this.anchors.sw = $('<div class="anchor" data-direction="sw">').appendTo(this.domElement)
    },
    bind: function() {
        this.onMouseDown = this.onMouseDown.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.transformStarted = new signals.Signal, this.transformEnded = new signals.Signal;
        for (var e in this.anchors) this.anchors[e].on("vmousedown", this.onMouseDown)
    },
    show: function() {
        0 === this.domElement.parent().length && (this.domElement.appendTo(this.block.domElement), this.domElement.addClass("visible"))
    },
    hide: function() {
        this.domElement.detach(), this.domElement.removeClass("visible")
    },
    destroy: function() {
        this.domElement.remove()
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
        e.preventDefault(), this.state.direction = $(e.currentTarget).attr("data-direction"), this.state.direction && ($(document).on("vmousemove", this.onMouseMove), $(document).on("vmouseup", this.onMouseUp), this.moved = !1, this.state.originalCursorPosition.x = e.clientX, this.state.originalCursorPosition.y = e.clientY, this.state.originalMeasurements = this.block.measure(!0))
    },
    onMouseMove: function(e) {
        e.preventDefault(), this.moved || (this.transformStarted.dispatch(this), SL.editor.controllers.Guides.start([this.block], {
            action: "resize",
            direction: this.state.direction
        })), this.moved = !0;
        var t = e.clientX - this.state.originalCursorPosition.x,
            i = e.clientY - this.state.originalCursorPosition.y;
        e.altKey && (t *= 2, i *= 2);
        var n = "",
            r = "";
        switch (this.state.direction) {
            case "e":
                n = Math.max(this.state.originalMeasurements.width + t, 1);
                break;
            case "w":
                n = Math.max(this.state.originalMeasurements.width - t, 1);
                break;
            case "s":
                r = Math.max(this.state.originalMeasurements.height + i, 1);
                break;
            case "n":
                r = Math.max(this.state.originalMeasurements.height - i, 1);
                break;
            case "nw":
                n = Math.max(this.state.originalMeasurements.width - t, 1), r = Math.max(this.state.originalMeasurements.height - i, 1);
                break;
            case "ne":
                n = Math.max(this.state.originalMeasurements.width + t, 1), r = Math.max(this.state.originalMeasurements.height - i, 1);
                break;
            case "se":
                n = Math.max(this.state.originalMeasurements.width + t, 1), r = Math.max(this.state.originalMeasurements.height + i, 1);
                break;
            case "sw":
                n = Math.max(this.state.originalMeasurements.width - t, 1), r = Math.max(this.state.originalMeasurements.height + i, 1)
        }
        this.block.hasAspectRatio() ? ("" === n && (n = this.state.originalMeasurements.width * (r / this.state.originalMeasurements.height)), "" === r && (r = this.state.originalMeasurements.height * (n / this.state.originalMeasurements.width))) : ("" === n && (n = this.state.originalMeasurements.width), "" === r && (r = this.state.originalMeasurements.height)), this.state.centered = e.altKey, this.state.proportional = e.shiftKey, this.block.resize({
            width: n,
            height: r,
            direction: this.state.direction
        }), SL.editor.controllers.Guides.sync()
    },
    onMouseUp: function(e) {
        e.preventDefault(), $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp), SL.editor.controllers.Guides.stop(), this.moved && this.transformEnded.dispatch(this), this.state.direction = null, this.state.centered = null, this.state.proportional = null
    }
};

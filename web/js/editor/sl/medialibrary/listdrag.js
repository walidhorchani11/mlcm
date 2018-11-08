'use strict';

export const listdrag = {
    init: function() {
        this.items = [], this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this)
    },
    reset: function() {
        this.items = [], this.ghostElement && this.ghostElement.remove(), this.currentDropTarget = null, $(".media-drop-target").removeClass("drag-over"), $(".media-drop-area").removeClass("media-drop-area-active"), $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp)
    },
    startDrag: function(e, t, i) {
        this.items = i;
        var n = t.offset();
        this.ghostOffset = {
            x: n.left - e.clientX,
            y: n.top - e.clientY
        }, this.ghostWidth = t.width(), this.ghostHeight = t.height(), this.ghostElement = $('<div class="media-library-drag-ghost">'), this.ghostElement.css({
            border: t.css("border"),
            backgroundImage: t.css("background-image"),
            backgroundSize: t.css("background-size"),
            backgroundPosition: t.css("background-position"),
            width: this.ghostWidth,
            height: this.ghostHeight,
            marginLeft: this.ghostOffset.x,
            marginTop: this.ghostOffset.y
        }), this.ghostElement.appendTo(document.body), i.length > 1 && (this.ghostElement.append('<span class="count">' + i.length + "</span>"), this.ghostElement.attr("data-depth", Math.min(i.length, 3))), this.dropTargets = $(".media-drop-target"), $(".media-drop-area").addClass("media-drop-area-active"), $(document).on("vmousemove", this.onMouseMove), $(document).on("vmouseup", this.onMouseUp)
    },
    stopDrag: function() {
        this.reset()
    },
    onMouseMove: function(e) {
        e.preventDefault();
        var t = e.clientX,
            i = e.clientY,
            n = "translate(" + t + "px," + i + "px)";
        this.ghostElement.css({
            webkitTransform: n,
            transform: n
        }), this.currentDropTarget = null, this.dropTargets.each(function(e, n) {
            var r = $(n),
                o = n.getBoundingClientRect();
            t > o.left && t < o.right && i > o.top && i < o.bottom ? (r.addClass("drag-over"), this.currentDropTarget = r) : r.removeClass("drag-over")
        }.bind(this))
    },
    onMouseUp: function(e) {
        if (e.preventDefault(), this.currentDropTarget) {
            this.currentDropTarget.data("dropReceiver").call(null, this.items), SL.analytics.trackEditor("Media: Drop items on tag");
            var t = this.ghostElement,
                i = this.currentDropTarget.get(0).getBoundingClientRect(),
                n = i.left + (i.width - this.ghostWidth) / 2 - this.ghostOffset.x,
                r = i.top + (i.height - this.ghostHeight) / 2 - this.ghostOffset.y,
                o = "translate(" + n + "px," + r + "px) scale(0.2)";
            t.css({
                webkitTransition: "all 0.2s ease",
                transition: "all 0.2s ease",
                webkitTransform: o,
                transform: o,
                opacity: 0
            }), setTimeout(function() {
                t.remove()
            }, 500), this.ghostElement = null
        }
        this.stopDrag()
    }
};

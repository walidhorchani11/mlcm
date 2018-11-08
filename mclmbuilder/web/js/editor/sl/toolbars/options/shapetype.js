'use strict';

export const toolbarsoptionsshapetype = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "shape-type",
            panelType: "shape-type",
            panelWidth: 246,
            panelMaxHeight: 430,
            label: TWIG.toolbar.options.shape,
            property: "attribute.data-shape-type",
            items: e.getPropertySettings("attribute.data-shape-type").options
        }, t))
    },
    renderPanel: function() {
        this._super.apply(this, arguments), this.renderAttribution()
    },
    renderItem: function(e) {
        var t = 32,
            i = 32,
            n = document.createElementNS(SL.util.svg.NAMESPACE, "svg");
        n.setAttribute("xmlns", SL.util.svg.NAMESPACE), n.setAttribute("version", "1.1"), n.setAttribute("width", t), n.setAttribute("height", i), n.setAttribute("preserveAspectRatio", "xMidYMid");
        var r = SL.editor.blocks.Shape.shapeFromType(e.value);
        r.setAttribute("fill", "#333333"), n.appendChild(r);
        var o = $('<div class="toolbar-select-item" data-value="' + e.value + '">');
        o.append(n), o.appendTo(this.panel.contentElement);
        var s = SL.util.svg.boundingBox(r);
        n.setAttribute("viewBox", [Math.round(s.x) || 0, Math.round(s.y) || 0, Math.round(s.width) || 32, Math.round(s.height) || 32].join(" "))
    },
    renderAttribution: function() {
        var e = $('<div class="toolbar-select-attribution">');
        e.html('<a href="/about#credits" target="_blank">Icons from IcoMoon</a>'), e.appendTo(this.panel.contentElement)
    },
    displaySelectedValue: function() {
        var e = 32,
            t = 32,
            i = document.createElementNS(SL.util.svg.NAMESPACE, "svg");
        i.setAttribute("xmlns", SL.util.svg.NAMESPACE), i.setAttribute("version", "1.1"), i.setAttribute("width", e), i.setAttribute("height", t), i.setAttribute("preserveAspectRatio", "xMidYMid");
        var n = SL.editor.blocks.Shape.shapeFromType(this.value, e, t);
        n.setAttribute("fill", "#ffffff"), i.appendChild(n), this.triggerElement.find("svg").remove(), this.triggerElement.append(i);
        var r = SL.util.svg.boundingBox(n);
        i.setAttribute("viewBox", [Math.round(r.x) || 0, Math.round(r.y) || 0, Math.round(r.width) || 32, Math.round(r.height) || 32].join(" "))
    }
};

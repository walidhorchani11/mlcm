'use strict';

export default function(e, t) {
    t = $.extend({
        color: SL.editor.blocks.Line.DEFAULT_COLOR,
        width: SL.editor.blocks.Line.DEFAULT_LINE_WIDTH,
        interactive: !0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    }, t);
    var i;
    t.interactive && t.width < 15 && (i = document.createElementNS(SL.util.svg.NAMESPACE, "line"), i.setAttribute("stroke", "rgba(0,0,0,0)"), i.setAttribute("stroke-width", 15), e.appendChild(i));
    var n = {
            x: t.x1,
            y: t.y1
        },
        r = {
            x: t.x2,
            y: t.y2
        },
        o = Math.max(SL.util.trig.distanceBetween(n, r), 1),
        s = 180 * (Math.atan2(r.y - n.y, r.x - n.x) + Math.PI / 2) / Math.PI;
    s = SL.util.math.limitDecimals(s, 3);
    var a = document.createElementNS(SL.util.svg.NAMESPACE, "line");
    if (a.setAttribute("stroke", t.color), a.setAttribute("stroke-width", t.width), e.appendChild(a), "dotted" === t.style) {
        var l = 2 * t.width;
        if (o > 2 * l) {
            var c = o / l;
            l *= c / Math.ceil(c)
        }
        a.setAttribute("stroke-dasharray", "0 " + l), a.setAttribute("stroke-linecap", "round")
    } else if ("dashed" === t.style) {
        var d = 3 * t.width,
            h = 3 * t.width;
        if (o > 2 * (d + h)) {
            var u = (o - h) / (d + h),
                p = u / Math.ceil(u);
            d *= p, h *= p
        }
        a.setAttribute("stroke-dasharray", d + " " + h), a.removeAttribute("stroke-linecap")
    } else a.removeAttribute("stroke-dasharray"), a.removeAttribute("stroke-linecap");
    var m, g, f = 3 * t.width,
        b = f / 2,
        v = Math.max(f, 8),
        C = v / 2;
    "line-arrow" === t.startType && (n.x += (r.x - n.x) * (.25 * v / o), n.y += (r.y - n.y) * (.25 * v / o), SL.editor.blocks.Line.roundPoints(n, r), m = document.createElementNS(SL.util.svg.NAMESPACE, "path"), m.setAttribute("style", "fill: rgba(0,0,0,0);"), m.setAttribute("stroke", t.color), m.setAttribute("stroke-width", t.width), m.setAttribute("transform", "translate(" + n.x + "," + n.y + ") rotate(" + s + ")"), m.setAttribute("d", ["M", .75 * -v, .75 * -v, "L", 0, 0, "L", .75 * v, .75 * -v].join(" ")), e.appendChild(m)), "line-arrow" === t.endType && (r.x += (n.x - r.x) * (.25 * v / o), r.y += (n.y - r.y) * (.25 * v / o), SL.editor.blocks.Line.roundPoints(n, r), g = document.createElementNS(SL.util.svg.NAMESPACE, "path"), g.setAttribute("style", "fill: rgba(0,0,0,0);"), g.setAttribute("stroke", t.color), g.setAttribute("stroke-width", t.width), g.setAttribute("transform", "translate(" + r.x + "," + r.y + ") rotate(" + s + ")"), g.setAttribute("d", ["M", .75 * v, .75 * v, "L", 0, 0, "L", .75 * -v, .75 * v].join(" ")), e.appendChild(g)), "arrow" === t.startType && (n.x += (r.x - n.x) * (C / o), n.y += (r.y - n.y) * (C / o), SL.editor.blocks.Line.roundPoints(n, r), m = document.createElementNS(SL.util.svg.NAMESPACE, "polygon"), m.setAttribute("fill", t.color), m.setAttribute("transform", "translate(" + n.x + "," + n.y + ") rotate(" + s + ")"), m.setAttribute("points", SL.util.svg.pointsToPolygon([0, C, C, -C, -C, -C])), e.appendChild(m)), "arrow" === t.endType && (r.x += (n.x - r.x) * (C / o), r.y += (n.y - r.y) * (C / o), SL.editor.blocks.Line.roundPoints(n, r), g = document.createElementNS(SL.util.svg.NAMESPACE, "polygon"), g.setAttribute("fill", t.color), g.setAttribute("transform", "translate(" + r.x + "," + r.y + ") rotate(" + s + ")"), g.setAttribute("points", SL.util.svg.pointsToPolygon([0, -C, C, C, -C, C])), e.appendChild(g)), "circle" === t.startType && (n.x += (r.x - n.x) * (b / o), n.y += (r.y - n.y) * (b / o), SL.editor.blocks.Line.roundPoints(n, r), m = SL.util.svg.ellipse(f, f), m.setAttribute("cx", n.x), m.setAttribute("cy", n.y), m.setAttribute("fill", t.color), e.appendChild(m)), "circle" === t.endType && (r.x += (n.x - r.x) * (b / o), r.y += (n.y - r.y) * (b / o), SL.editor.blocks.Line.roundPoints(n, r), g = SL.util.svg.ellipse(f, f), g.setAttribute("cx", r.x), g.setAttribute("cy", r.y), g.setAttribute("fill", t.color), e.appendChild(g)), "square" === t.startType && (n.x += (r.x - n.x) * (b / o), n.y += (r.y - n.y) * (b / o), SL.editor.blocks.Line.roundPoints(n, r), m = SL.util.svg.rect(f, f), m.setAttribute("fill", t.color), m.setAttribute("x", -b), m.setAttribute("y", -b), m.setAttribute("transform", "translate(" + n.x + "," + n.y + ") rotate(" + s + ")"), e.appendChild(m)), "square" === t.endType && (r.x += (n.x - r.x) * (b / o), r.y += (n.y - r.y) * (b / o), SL.editor.blocks.Line.roundPoints(n, r), g = SL.util.svg.rect(f, f), g.setAttribute("fill", t.color), g.setAttribute("x", -b), g.setAttribute("y", -b), g.setAttribute("transform", "translate(" + r.x + "," + r.y + ") rotate(" + s + ")"), e.appendChild(g)), SL.editor.blocks.Line.roundPoints(n, r), t.width % 2 === 1 && (n.x += .5, n.y += .5, r.x += .5, r.y += .5), a.setAttribute("x1", n.x), a.setAttribute("y1", n.y), a.setAttribute("x2", r.x), a.setAttribute("y2", r.y), i && (i.setAttribute("x1", n.x), i.setAttribute("y1", n.y), i.setAttribute("x2", r.x), i.setAttribute("y2", r.y))
};

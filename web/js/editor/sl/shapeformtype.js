'use strict';

export default function(e, t, i) {
    return t = t || 32, i = i || 32, /^symbol\-/.test(e) ? SL.util.svg.symbol(e.replace(/^symbol\-/, "")) : "rect" === e ? SL.util.svg.rect(t, i) : "circle" === e ? SL.util.svg.ellipse(t, i) : "diamond" === e ? SL.util.svg.polygon(t, i, 4) : "octagon" === e ? SL.util.svg.polygon(t, i, 8) : "triangle-up" === e ? SL.util.svg.triangleUp(t, i) : "triangle-down" === e ? SL.util.svg.triangleDown(t, i) : "triangle-left" === e ? SL.util.svg.triangleLeft(t, i) : "triangle-right" === e ? SL.util.svg.triangleRight(t, i) : "arrow-up" === e ? SL.util.svg.arrowUp(t, i) : "arrow-down" === e ? SL.util.svg.arrowDown(t, i) : "arrow-left" === e ? SL.util.svg.arrowLeft(t, i) : "arrow-right" === e ? SL.util.svg.arrowRight(t, i) : void 0
};

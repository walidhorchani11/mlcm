'use strict';

export const slline = {
    init: function(e) {
        this._super("line", $.extend({
            minWidth: 1,
            minHeight: 1,
            horizontalResizing: !1,
            verticalResizing: !1
        }, e)), this.transform.destroy(), this.transform = new SL.editor.blocks.behavior.TransformLine(this), this.transform.transformStarted.add(this.onTransformStarted.bind(this)), this.transform.transformEnded.add(this.onTransformEnded.bind(this)), this.plug(SL.editor.blocks.plugin.Link)
    },
    setup: function() {
        this._super(), this.properties.attribute["data-line-style"] = {
            defaultValue: "solid",
            options: [{
                value: "solid"
            }, {
                value: "dotted"
            }, {
                value: "dashed"
            }]
        }, this.properties.attribute["data-line-start-type"] = {
            defaultValue: "none",
            options: [{
                value: "none"
            }, {
                value: "line-arrow"
            }, {
                value: "arrow"
            }, {
                value: "circle"
            }, {
                value: "square"
            }]
        }, this.properties.attribute["data-line-end-type"] = {
            defaultValue: "none",
            options: [{
                value: "none"
            }, {
                value: "line-arrow"
            }, {
                value: "arrow"
            }, {
                value: "circle"
            }, {
                value: "square"
            }]
        }, this.properties.attribute["data-line-width"] = {
            unit: "px",
            type: "number",
            minValue: 1,
            maxValue: 50,
            defaultValue: SL.editor.blocks.Line.DEFAULT_LINE_WIDTH
        }, this.properties.attribute["data-line-color"] = {
            defaultValue: SL.editor.blocks.Line.DEFAULT_COLOR
        }, this.properties.attribute["data-line-x1"] = {
            type: "number",
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            defaultValue: 0
        }, this.properties.attribute["data-line-y1"] = {
            type: "number",
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            defaultValue: 0
        }, this.properties.attribute["data-line-x2"] = {
            type: "number",
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            defaultValue: 0
        }, this.properties.attribute["data-line-y2"] = {
            type: "number",
            minValue: 0,
            maxValue: Number.MAX_VALUE,
            defaultValue: 0
        }
    },
    bind: function() {
        this._super(), this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    setDefaults: function() {
        this._super(), this.set({
            "attribute.data-line-x1": 0,
            "attribute.data-line-y1": 200,
            "attribute.data-line-x2": 200,
            "attribute.data-line-y2": 0,
            "attribute.data-line-color": this.getPropertyDefault("attribute.data-line-color"),
            "attribute.data-line-start-type": this.getPropertyDefault("attribute.data-line-start-type"),
            "attribute.data-line-end-type": this.getPropertyDefault("attribute.data-line-end-type")
        })
    },
    paint: function() {
        var e = this.getSVGElement();
        e.setAttribute("preserveAspectRatio", "xMidYMid"), e.innerHTML = "", SL.editor.blocks.Line.generate(e, {
            startType: this.get("attribute.data-line-start-type"),
            endType: this.get("attribute.data-line-end-type"),
            style: this.get("attribute.data-line-style"),
            color: this.get("attribute.data-line-color"),
            width: this.get("attribute.data-line-width"),
            x1: this.get("attribute.data-line-x1"),
            y1: this.get("attribute.data-line-y1"),
            x2: this.get("attribute.data-line-x2"),
            y2: this.get("attribute.data-line-y2")
        });
        var t = this.getViewBox();
        if (e.setAttribute("width", t.width), e.setAttribute("height", t.height), e.setAttribute("viewBox", [t.x, t.y, t.width, t.height].join(" ")), this.measurementsBeforeTransform) {
            var i = t.x - this.viewBoxBeforeTransform.x,
                n = t.y - this.viewBoxBeforeTransform.y;
            this.move(this.measurementsBeforeTransform.x + i, this.measurementsBeforeTransform.y + n)
        }
        this.transform && this.transform.layout()
    },
    resize: function() {
        this._super.apply(this, arguments), this.paint()
    },
    hitTest: function(e) {
        var t = this.getGlobalLinePoint(SL.editor.blocks.Line.POINT_1),
            i = this.getGlobalLinePoint(SL.editor.blocks.Line.POINT_2),
            n = SL.util.trig.isPointWithinRect(t.x, t.y, e) && SL.util.trig.isPointWithinRect(i.x, i.y, e);
        if (n) return !0;
        var r = [
            [{
                x: e.x,
                y: e.y
            }, {
                x: e.x + e.width,
                y: e.y
            }],
            [{
                x: e.x + e.width,
                y: e.y
            }, {
                x: e.x + e.width,
                y: e.y + e.height
            }],
            [{
                x: e.x,
                y: e.y + e.height
            }, {
                x: e.x + e.width,
                y: e.y + e.height
            }],
            [{
                x: e.x,
                y: e.y
            }, {
                x: e.x,
                y: e.y + e.height
            }]
        ];
        return r.some(function(e) {
            return !!SL.util.trig.findLineIntersection(t, i, e[0], e[1])
        })
    },
    setGlobalLinePoint: function(e, t, i) {
        var n = this.getViewBox(),
            r = this.measure();
        e === SL.editor.blocks.Line.POINT_1 ? ("number" == typeof t && this.set("attribute.data-line-x1", t - (r.x - n.x)), "number" == typeof i && this.set("attribute.data-line-y1", i - (r.y - n.y))) : e === SL.editor.blocks.Line.POINT_2 && ("number" == typeof t && this.set("attribute.data-line-x2", t - (r.x - n.x)), "number" == typeof i && this.set("attribute.data-line-y2", i - (r.y - n.y)))
    },
    getGlobalLinePoint: function(e) {
        var t = this.getViewBox(),
            i = this.measure();
        return e === SL.editor.blocks.Line.POINT_1 ? {
            x: i.x - t.x + this.get("attribute.data-line-x1"),
            y: i.y - t.y + this.get("attribute.data-line-y1")
        } : e === SL.editor.blocks.Line.POINT_2 ? {
            x: i.x - t.x + this.get("attribute.data-line-x2"),
            y: i.y - t.y + this.get("attribute.data-line-y2")
        } : void 0
    },
    getOppositePointID: function(e) {
        return e === SL.editor.blocks.Line.POINT_1 ? SL.editor.blocks.Line.POINT_2 : SL.editor.blocks.Line.POINT_1
    },
    getViewBox: function() {
        var e = this.get("attribute.data-line-x1"),
            t = this.get("attribute.data-line-y1"),
            i = this.get("attribute.data-line-x2"),
            n = this.get("attribute.data-line-y2"),
            r = {
                x: Math.round(Math.min(e, i)),
                y: Math.round(Math.min(t, n))
            };
        return r.width = Math.max(Math.round(Math.max(e, i) - r.x), 1), r.height = Math.max(Math.round(Math.max(t, n) - r.y), 1), r
    },
    getSVGElement: function() {
        var e = this.contentElement.find("svg").get(0);
        return e || (e = document.createElementNS(SL.util.svg.NAMESPACE, "svg"), e.setAttribute("xmlns", SL.util.svg.NAMESPACE), e.setAttribute("version", "1.1"), this.contentElement.append(e)), e
    },
    getLineElement: function() {
        var e = this.getSVGElement(),
            t = e.querySelector("line");
        return t || (t = document.createElementNS(SL.util.svg.NAMESPACE, "line"), e.appendChild(t)), t
    },
    getToolbarOptions: function() {
        return [SL.editor.components.toolbars.groups.LineType, SL.editor.components.toolbars.options.LineStyle, SL.editor.components.toolbars.options.LineWidth, SL.editor.components.toolbars.options.LineColor, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.Link, SL.editor.components.toolbars.groups.Animation].concat(this._super())
    },
    onPropertyChanged: function() {
        this.paint()
    },
    onTransformStarted: function() {
        this.measurementsBeforeTransform = this.measure(), this.viewBoxBeforeTransform = this.getViewBox()
    },
    onTransformEnded: function() {
        this.measurementsBeforeTransform = null, this.viewBoxBeforeTransform = null
    }
};

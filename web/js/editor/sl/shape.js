'use strict';

export const slShape = {
    init: function(e) {
        this._super("shape", $.extend({
            minWidth: 4,
            minHeight: 4
        }, e)), this.plug(SL.editor.blocks.plugin.Link)
    },
    setup: function() {
        this._super(), this.properties.attribute["data-shape-type"] = {
            defaultValue: "rect",
            options: [{
                value: "rect"
            }, {
                value: "circle"
            }, {
                value: "diamond"
            }, {
                value: "octagon"
            }, {
                value: "triangle-up"
            }, {
                value: "triangle-down"
            }, {
                value: "triangle-left"
            }, {
                value: "triangle-right"
            }, {
                value: "arrow-up"
            }, {
                value: "arrow-down"
            }, {
                value: "arrow-left"
            }, {
                value: "arrow-right"
            }]
        };
        for (var e in SL.util.svg.SYMBOLS) this.properties.attribute["data-shape-type"].options.push({
            value: "symbol-" + e
        });
        this.properties.attribute["data-shape-stretch"] = {
            defaultValue: !0
        }, this.properties.attribute["data-shape-fill-color"] = {
            defaultValue: "#000000"
        }, this.properties.attribute["data-shape-stroke-color"] = {}, this.properties.attribute["data-shape-stroke-width"] = {
            type: "number",
            decimals: 0,
            minValue: 1,
            maxValue: 50,
            defaultValue: 0
        }
    },
    bind: function() {
        this._super(), this.propertyChanged.add(this.onPropertyChanged.bind(this))
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: 300,
            height: 300
        }),
        this.set("attribute.data-shape-type",
        this.getPropertyDefault("attribute.data-shape-type")),
        this.set("attribute.data-shape-fill-color",
        this.getPropertyDefault("attribute.data-shape-fill-color")),
        this.set("attribute.data-shape-stretch",
        this.getPropertyDefault("attribute.data-shape-stretch"))
    },
    paint: function() {
        var e = this.get("attribute.data-shape-type"),
            t = this.get("attribute.data-shape-fill-color"),
            i = this.get("attribute.data-shape-stroke-color"),
            n = this.get("attribute.data-shape-stroke-width"),
            r = this.get("attribute.data-shape-stretch"),
            o = this.domElement.width(),
            s = this.domElement.height();
        r || (o = s = Math.min(o, s));
        var a = SL.editor.blocks.Shape.shapeFromType(e, o, s);
        if (a) {
            var l = this.hasStroke(),
                c = this.supportsStroke(a),
                d = this.getSVGElement();
            if (d.setAttribute("width", "100%"), d.setAttribute("height", "100%"), d.setAttribute("preserveAspectRatio", r ? "none" : "xMidYMid"), d.innerHTML = "", c && l) {
                var h = SL.util.string.uniqueID("shape-mask-"),
                    u = document.createElementNS(SL.util.svg.NAMESPACE, "defs"),
                    p = document.createElementNS(SL.util.svg.NAMESPACE, "clipPath");
                p.setAttribute("id", h), p.appendChild($(a).clone().get(0)), u.appendChild(p), d.appendChild(u), a.setAttribute("clip-path", "url(#" + h + ")")
            }
            a.setAttribute("class", "shape-element"), t && a.setAttribute("fill", t), c && i && a.setAttribute("stroke", i), c && n && a.setAttribute("stroke-width", 2 * n), d.appendChild(a);
            var m = SL.util.svg.boundingBox(a);
            d.setAttribute("viewBox", [Math.round(m.x) || 0, Math.round(m.y) || 0, Math.round(m.width) || 32, Math.round(m.height) || 32].join(" "))
        }
    },
    resize: function() {
        this._super.apply(this, arguments), this.paint()
    },
    toggleStroke: function() {
        this.hasStroke() ? this.unset(["attribute.data-shape-stroke-color", "attribute.data-shape-stroke-width"]) : this.set({
            "attribute.data-shape-stroke-color": "#000000",
            "attribute.data-shape-stroke-width": 1
        }), this.paint()
    },
    hasStroke: function() {
        return this.isset("attribute.data-shape-stroke-color") || this.isset("attribute.data-shape-stroke-width")
    },
    supportsStroke: function(e) {
        return $(e || this.getSVGShapeElement()).is("rect, circle, ellipse, polygon")
    },
    getSVGElement: function() {
        var e = this.contentElement.find("svg").get(0);
        return e || (e = document.createElementNS(SL.util.svg.NAMESPACE, "svg"), e.setAttribute("xmlns", SL.util.svg.NAMESPACE), e.setAttribute("version", "1.1"), this.contentElement.append(e)), e
    },
    getSVGShapeElement: function() {
        return $(this.getSVGElement().querySelector(".shape-element"))
    },
    getToolbarOptions: function() {
        let toolbarsLinktoElements = [
            SL.editor.components.toolbars.options.LinkToPopin,
            SL.editor.components.toolbars.options.LinkToScreen,
            SL.editor.components.toolbars.options.Reference,
            SL.editor.components.toolbars.options.LinkToPdf
        ];

        if (SL.editor.controllers.Popin.isPopin()) {
            toolbarsLinktoElements = [SL.editor.components.toolbars.options.LinkToPdf]
        }

        return [
            SL.editor.components.toolbars.options.ShapeType,
            SL.editor.components.toolbars.options.ShapeStretch,
            SL.editor.components.toolbars.options.ShapeFillColor,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.Opacity,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.groups.BorderSVG,
            SL.editor.components.toolbars.groups.Link,
            SL.editor.components.toolbars.groups.Animation,
            SL.editor.components.toolbars.options.Divider,
            SL.editor.components.toolbars.options.BlockDepth,
            SL.editor.components.toolbars.options.BlockActions,
            SL.editor.components.toolbars.options.Divider
        ].concat(toolbarsLinktoElements).concat(this._super())
    },
    onPropertyChanged: function() {
        this.paint()
    }
};

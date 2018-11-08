(function() {
    var e = function(t, i) {
        var n = t.nodeType;
        if (3 == n) i.push(t.textContent.replace(/&/, "&amp;").replace(/</, "&lt;").replace(">", "&gt;"));
        else if (1 == n) {
            if (i.push("<", t.tagName), t.hasAttributes())
                for (var r = t.attributes, o = 0, s = r.length; s > o; ++o) {
                    var a = r.item(o);
                    i.push(" ", a.name, "='", a.value, "'")
                }
            if (t.hasChildNodes()) {
                i.push(">");
                for (var l = t.childNodes, o = 0, s = l.length; s > o; ++o) e(l.item(o), i);
                i.push("</", t.tagName, ">")
            } else i.push("/>")
        } else {
            if (8 != n) throw "Error serializing XML. Unhandled node of type: " + n;
            i.push("<!--", t.nodeValue, "-->")
        }
    };
    Object.defineProperty(SVGElement.prototype, "innerHTML", {
        get: function() {
            for (var t = [], i = this.firstChild; i;) e(i, t), i = i.nextSibling;
            return t.join("")
        },
        set: function(e) {
            for (; this.firstChild;) this.removeChild(this.firstChild);
            try {
                var t = new DOMParser;
                t.async = !1, sXML = "<svg xmlns='http://www.w3.org/2000/svg'>" + e + "</svg>";
                for (var i = t.parseFromString(sXML, "text/xml").documentElement, n = i.firstChild; n;) this.appendChild(this.ownerDocument.importNode(n, !0)), n = n.nextSibling
            } catch (r) {
                throw new Error("Error parsing XML string")
            }
        }
    }), Object.defineProperty(SVGElement.prototype, "innerSVG", {
        get: function() {
            return this.innerHTML
        },
        set: function(e) {
            this.innerHTML = e
        }
    })
}());

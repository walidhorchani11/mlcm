'use strict';

// const svginnerhtml = (function(SVGElement) {
//   if (!SVGElement || 'innerHTML' in SVGElement.prototype) {
//     return;
//   }
//   var serializeXML = function(node, output) {
//     var nodeType = node.nodeType;
//     if (nodeType == 3) { // TEXT nodes.
//       // Replace special XML characters with their entities.
//       output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
//     } else if (nodeType == 1) { // ELEMENT nodes.
//       // Serialize Element nodes.
//       output.push('<', node.tagName);
//       if (node.hasAttributes()) {
//         var attrMap = node.attributes;
//         for (var i = 0, len = attrMap.length; i < len; ++i) {
//           var attrNode = attrMap.item(i);
//           output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
//         }
//       }
//       if (node.hasChildNodes()) {
//         output.push('>');
//         var childNodes = node.childNodes;
//         for (var i = 0, len = childNodes.length; i < len; ++i) {
//           serializeXML(childNodes.item(i), output);
//         }
//         output.push('</', node.tagName, '>');
//       } else {
//         output.push('/>');
//       }
//     } else if (nodeType == 8) {
//       // TODO(codedread): Replace special characters with XML entities?
//       output.push('<!--', node.nodeValue, '-->');
//     } else {
//       // TODO: Handle CDATA nodes.
//       // TODO: Handle ENTITY nodes.
//       // TODO: Handle DOCUMENT nodes.
//       throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
//     }
//   }
//   // The innerHTML DOM property for SVGElement.
//   Object.defineProperty(SVGElement.prototype, 'innerHTML', {
//     get: function() {
//       var output = [];
//       var childNode = this.firstChild;
//       while (childNode) {
//         serializeXML(childNode, output);
//         childNode = childNode.nextSibling;
//       }
//       return output.join('');
//     },
//     set: function(markupText) {
//       // Wipe out the current contents of the element.
//       while (this.firstChild) {
//         this.removeChild(this.firstChild);
//       }
//
//       try {
//         // Parse the markup into valid nodes.
//         var dXML = new DOMParser();
//         dXML.async = false;
//         // Wrap the markup into a SVG node to ensure parsing works.
//         sXML = '<svg xmlns=\'http://www.w3.org/2000/svg\'>' + markupText + '</svg>';
//         var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;
//
//         // Now take each node, import it and append to this element.
//         var childNode = svgDocElement.firstChild;
//         while(childNode) {
//           this.appendChild(this.ownerDocument.importNode(childNode, true));
//           childNode = childNode.nextSibling;
//         }
//       } catch(e) {
//         throw new Error('Error parsing XML string');
//       };
//     }
//   });
// })((1, eval)('this').SVGElement);
//
// module.exports = { svginnerhtml };

export default (function() {
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

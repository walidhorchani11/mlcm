'use strict';

const katex = function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var t;
        t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.katex = e()
    }
}(function() {
    return function e(t, i, n) {
        function r(s, a) {
            if (!i[s]) {
                if (!t[s]) {
                    var l = "function" == typeof require && require;
                    if (!a && l) return l(s, !0);
                    if (o) return o(s, !0);
                    var c = new Error("Cannot find module '" + s + "'");
                    throw c.code = "MODULE_NOT_FOUND", c
                }
                var d = i[s] = {
                    exports: {}
                };
                t[s][0].call(d.exports, function(e) {
                    var i = t[s][1][e];
                    return r(i ? i : e)
                }, d, d.exports, e, t, i, n)
            }
            return i[s].exports
        }
        for (var o = "function" == typeof require && require, s = 0; s < n.length; s++) r(n[s]);
        return r
    }({
        1: [function(e, t) {
            var i = e("./src/ParseError"),
                n = e("./src/Settings"),
                r = e("./src/buildTree"),
                o = e("./src/parseTree"),
                s = e("./src/utils"),
                a = function(e, t, i) {
                    s.clearNode(t);
                    var a = new n(i),
                        l = o(e, a),
                        c = r(l, e, a).toNode();
                    t.appendChild(c)
                };
            "undefined" != typeof document && "CSS1Compat" !== document.compatMode && ("undefined" != typeof console && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."), a = function() {
                throw new i("KaTeX doesn't work in quirks mode.")
            });
            var l = function(e, t) {
                    var i = new n(t),
                        s = o(e, i);
                    return r(s, e, i).toMarkup()
                },
                c = function(e, t) {
                    var i = new n(t);
                    return o(e, i)
                };
            t.exports = {
                render: a,
                renderToString: l,
                __parse: c,
                ParseError: i
            }
        }, {
            "./src/ParseError": 5,
            "./src/Settings": 7,
            "./src/buildTree": 12,
            "./src/parseTree": 21,
            "./src/utils": 23
        }],
        2: [function(e, t) {
            "use strict";

            function i(e) {
                if (!e.__matchAtRelocatable) {
                    var t = e.source + "|()",
                        i = "g" + (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.unicode ? "u" : "");
                    e.__matchAtRelocatable = new RegExp(t, i)
                }
                return e.__matchAtRelocatable
            }

            function n(e, t, n) {
                if (e.global || e.sticky) throw new Error("matchAt(...): Only non-global regexes are supported");
                var r = i(e);
                r.lastIndex = n;
                var o = r.exec(t);
                return null == o[o.length - 1] ? (o.length = o.length - 1, o) : null
            }
            t.exports = n
        }, {}],
        3: [function(e, t) {
            function i(e) {
                this._input = e
            }

            function n(e, t, i) {
                this.text = e, this.data = t, this.position = i
            }
            var r = e("match-at"),
                o = e("./ParseError"),
                s = [/[/|@.""`0-9a-zA-Z]/, /[*+-]/, /[=<>:]/, /[,;]/, /['\^_{}]/, /[(\[]/, /[)\]?!]/, /~/, /&/, /\\\\/],
                a = [/[a-zA-Z0-9`!@*()-=+\[\]'";:?\/.,]/, /[{}]/, /~/, /&/, /\\\\/],
                l = /\s*/,
                c = / +|\\  +/,
                d = /\\(?:[a-zA-Z]+|.)/;
            i.prototype._innerLex = function(e, t, i) {
                var s, a = this._input;
                if (i) s = r(l, a, e)[0], e += s.length;
                else if (s = r(c, a, e), null !== s) return new n(" ", null, e + s[0].length);
                if (e === a.length) return new n("EOF", null, e);
                var h;
                if (h = r(d, a, e)) return new n(h[0], null, e + h[0].length);
                for (var u = 0; u < t.length; u++) {
                    var p = t[u];
                    if (h = r(p, a, e)) return new n(h[0], null, e + h[0].length)
                }
                throw new o("Unexpected character: '" + a[e] + "'", this, e)
            };
            var h = /#[a-z0-9]+|[a-z]+/i;
            i.prototype._innerLexColor = function(e) {
                var t = this._input,
                    i = r(l, t, e)[0];
                e += i.length;
                var s;
                if (s = r(h, t, e)) return new n(s[0], null, e + s[0].length);
                throw new o("Invalid color", this, e)
            };
            var u = /(-?)\s*(\d+(?:\.\d*)?|\.\d+)\s*([a-z]{2})/;
            i.prototype._innerLexSize = function(e) {
                var t = this._input,
                    i = r(l, t, e)[0];
                e += i.length;
                var s;
                if (s = r(u, t, e)) {
                    var a = s[3];
                    if ("em" !== a && "ex" !== a) throw new o("Invalid unit: '" + a + "'", this, e);
                    return new n(s[0], {
                        number: +(s[1] + s[2]),
                        unit: a
                    }, e + s[0].length)
                }
                throw new o("Invalid size", this, e)
            }, i.prototype._innerLexWhitespace = function(e) {
                var t = this._input,
                    i = r(l, t, e)[0];
                return e += i.length, new n(i[0], null, e)
            }, i.prototype.lex = function(e, t) {
                return "math" === t ? this._innerLex(e, s, !0) : "text" === t ? this._innerLex(e, a, !1) : "color" === t ? this._innerLexColor(e) : "size" === t ? this._innerLexSize(e) : "whitespace" === t ? this._innerLexWhitespace(e) : void 0
            }, t.exports = i
        }, {
            "./ParseError": 5,
            "match-at": 2
        }],
        4: [function(e, t) {
            function i(e) {
                this.style = e.style, this.color = e.color, this.size = e.size, this.phantom = e.phantom, this.font = e.font, this.parentStyle = void 0 === e.parentStyle ? e.style : e.parentStyle, this.parentSize = void 0 === e.parentSize ? e.size : e.parentSize
            }
            i.prototype.extend = function(e) {
                var t = {
                    style: this.style,
                    size: this.size,
                    color: this.color,
                    parentStyle: this.style,
                    parentSize: this.size,
                    phantom: this.phantom,
                    font: this.font
                };
                for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                return new i(t)
            }, i.prototype.withStyle = function(e) {
                return this.extend({
                    style: e
                })
            }, i.prototype.withSize = function(e) {
                return this.extend({
                    size: e
                })
            }, i.prototype.withColor = function(e) {
                return this.extend({
                    color: e
                })
            }, i.prototype.withPhantom = function() {
                return this.extend({
                    phantom: !0
                })
            }, i.prototype.withFont = function(e) {
                return this.extend({
                    font: e
                })
            }, i.prototype.reset = function() {
                return this.extend({})
            };
            var n = {
                "katex-blue": "#6495ed",
                "katex-orange": "#ffa500",
                "katex-pink": "#ff00af",
                "katex-red": "#df0030",
                "katex-green": "#28ae7b",
                "katex-gray": "gray",
                "katex-purple": "#9d38bd",
                "katex-blueA": "#c7e9f1",
                "katex-blueB": "#9cdceb",
                "katex-blueC": "#58c4dd",
                "katex-blueD": "#29abca",
                "katex-blueE": "#1c758a",
                "katex-tealA": "#acead7",
                "katex-tealB": "#76ddc0",
                "katex-tealC": "#5cd0b3",
                "katex-tealD": "#55c1a7",
                "katex-tealE": "#49a88f",
                "katex-greenA": "#c9e2ae",
                "katex-greenB": "#a6cf8c",
                "katex-greenC": "#83c167",
                "katex-greenD": "#77b05d",
                "katex-greenE": "#699c52",
                "katex-goldA": "#f7c797",
                "katex-goldB": "#f9b775",
                "katex-goldC": "#f0ac5f",
                "katex-goldD": "#e1a158",
                "katex-goldE": "#c78d46",
                "katex-redA": "#f7a1a3",
                "katex-redB": "#ff8080",
                "katex-redC": "#fc6255",
                "katex-redD": "#e65a4c",
                "katex-redE": "#cf5044",
                "katex-maroonA": "#ecabc1",
                "katex-maroonB": "#ec92ab",
                "katex-maroonC": "#c55f73",
                "katex-maroonD": "#a24d61",
                "katex-maroonE": "#94424f",
                "katex-purpleA": "#caa3e8",
                "katex-purpleB": "#b189c6",
                "katex-purpleC": "#9a72ac",
                "katex-purpleD": "#715582",
                "katex-purpleE": "#644172",
                "katex-mintA": "#f5f9e8",
                "katex-mintB": "#edf2df",
                "katex-mintC": "#e0e5cc",
                "katex-grayA": "#fdfdfd",
                "katex-grayB": "#f7f7f7",
                "katex-grayC": "#eeeeee",
                "katex-grayD": "#dddddd",
                "katex-grayE": "#cccccc",
                "katex-grayF": "#aaaaaa",
                "katex-grayG": "#999999",
                "katex-grayH": "#555555",
                "katex-grayI": "#333333",
                "katex-kaBlue": "#314453",
                "katex-kaGreen": "#639b24"
            };
            i.prototype.getColor = function() {
                return this.phantom ? "transparent" : n[this.color] || this.color
            }, t.exports = i
        }, {}],
        5: [function(e, t) {
            function i(e, t, n) {
                var r = "KaTeX parse error: " + e;
                if (void 0 !== t && void 0 !== n) {
                    r += " at position " + n + ": ";
                    var o = t._input;
                    o = o.slice(0, n) + "\u0332" + o.slice(n);
                    var s = Math.max(0, n - 15),
                        a = n + 15;
                    r += o.slice(s, a)
                }
                var l = new Error(r);
                return l.name = "ParseError", l.__proto__ = i.prototype, l.position = n, l
            }
            i.prototype.__proto__ = Error.prototype, t.exports = i
        }, {}],
        6: [function(e, t) {
            function i(e, t) {
                this.lexer = new s(e), this.settings = t
            }

            function n(e, t) {
                this.result = e, this.isFunction = t
            }
            var r = e("./functions"),
                o = e("./environments"),
                s = e("./Lexer"),
                a = e("./symbols"),
                l = e("./utils"),
                c = e("./parseData"),
                d = e("./ParseError"),
                h = c.ParseNode,
                u = c.ParseResult;
            i.prototype.expect = function(e, t) {
                if (e.text !== t) throw new d("Expected '" + t + "', got '" + e.text + "'", this.lexer, e.position)
            }, i.prototype.parse = function() {
                var e = this.parseInput(0, "math");
                return e.result
            }, i.prototype.parseInput = function(e, t) {
                var i = this.parseExpression(e, t, !1);
                return this.expect(i.peek, "EOF"), i
            };
            var p = ["}", "\\end", "\\right", "&", "\\\\", "\\cr"];
            i.prototype.parseExpression = function(e, t, i, n) {
                for (var r = [], o = null;;) {
                    if (o = this.lexer.lex(e, t), -1 !== p.indexOf(o.text)) break;
                    if (n && o.text === n) break;
                    var s = this.parseAtom(e, t);
                    if (!s) {
                        if (!this.settings.throwOnError && "\\" === o.text[0]) {
                            var a = this.handleUnsupportedCmd(o.text, t);
                            r.push(a), e = o.position;
                            continue
                        }
                        break
                    }
                    if (i && "infix" === s.result.type) break;
                    r.push(s.result), e = s.position
                }
                var l = new u(this.handleInfixNodes(r, t), e);
                return l.peek = o, l
            }, i.prototype.handleInfixNodes = function(e, t) {
                for (var i, n, o = -1, s = 0; s < e.length; s++) {
                    var a = e[s];
                    if ("infix" === a.type) {
                        if (-1 !== o) throw new d("only one infix operator per group", this.lexer, -1);
                        o = s, n = a.value.replaceWith, i = r.funcs[n]
                    }
                }
                if (-1 !== o) {
                    var l, c, u = e.slice(0, o),
                        p = e.slice(o + 1);
                    l = 1 === u.length && "ordgroup" === u[0].type ? u[0] : new h("ordgroup", u, t), c = 1 === p.length && "ordgroup" === p[0].type ? p[0] : new h("ordgroup", p, t);
                    var m = i.handler(n, l, c);
                    return [new h(m.type, m, t)]
                }
                return e
            };
            var m = 1;
            i.prototype.handleSupSubscript = function(e, t, i, n) {
                var o = this.parseGroup(e, t);
                if (o) {
                    if (o.isFunction) {
                        var s = r.funcs[o.result.result].greediness;
                        if (s > m) return this.parseFunction(e, t);
                        throw new d("Got function '" + o.result.result + "' with no arguments as " + n, this.lexer, e)
                    }
                    return o.result
                }
                var a = this.lexer.lex(e, t);
                if (this.settings.throwOnError || "\\" !== a.text[0]) throw new d("Expected group after '" + i + "'", this.lexer, e);
                return new u(this.handleUnsupportedCmd(a.text, t), a.position)
            }, i.prototype.handleUnsupportedCmd = function(e, t) {
                for (var i = [], n = 0; n < e.length; n++) i.push(new h("textord", e[n], "text"));
                var r = new h("text", {
                        body: i,
                        type: "text"
                    }, t),
                    o = new h("color", {
                        color: this.settings.errorColor,
                        value: [r],
                        type: "color"
                    }, t);
                return o
            }, i.prototype.parseAtom = function(e, t) {
                var i = this.parseImplicitGroup(e, t);
                if ("text" === t) return i;
                var n;
                i ? n = i.position : (n = e, i = void 0);
                for (var r, o, s;;) {
                    var a = this.lexer.lex(n, t);
                    if ("\\limits" === a.text || "\\nolimits" === a.text) {
                        if (!i || "op" !== i.result.type) throw new d("Limit controls must follow a math operator", this.lexer, n);
                        var l = "\\limits" === a.text;
                        i.result.value.limits = l, i.result.value.alwaysHandleSupSub = !0, n = a.position
                    } else if ("^" === a.text) {
                        if (r) throw new d("Double superscript", this.lexer, n);
                        s = this.handleSupSubscript(a.position, t, a.text, "superscript"), n = s.position, r = s.result
                    } else if ("_" === a.text) {
                        if (o) throw new d("Double subscript", this.lexer, n);
                        s = this.handleSupSubscript(a.position, t, a.text, "subscript"), n = s.position, o = s.result
                    } else {
                        if ("'" !== a.text) break;
                        var c = new h("textord", "\\prime", t),
                            p = [c];
                        for (n = a.position;
                             "'" === (a = this.lexer.lex(n, t)).text;) p.push(c), n = a.position;
                        r = new h("ordgroup", p, t)
                    }
                }
                return r || o ? new u(new h("supsub", {
                    base: i && i.result,
                    sup: r,
                    sub: o
                }, t), n) : i
            };
            var g = ["\\tiny", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"],
                f = ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"];
            i.prototype.parseImplicitGroup = function(e, t) {
                var i = this.parseSymbol(e, t);
                if (!i || !i.result) return this.parseFunction(e, t);
                var n, r = i.result.result;
                if ("\\left" === r) {
                    var s = this.parseFunction(e, t);
                    n = this.parseExpression(s.position, t, !1), this.expect(n.peek, "\\right");
                    var a = this.parseFunction(n.position, t);
                    return new u(new h("leftright", {
                        body: n.result,
                        left: s.result.value.value,
                        right: a.result.value.value
                    }, t), a.position)
                }
                if ("\\begin" === r) {
                    var c = this.parseFunction(e, t),
                        p = c.result.value.name;
                    if (!o.hasOwnProperty(p)) throw new d("No such environment: " + p, this.lexer, c.result.value.namepos);
                    var m = o[p],
                        b = [null, t, p],
                        v = this.parseArguments(c.position, t, "\\begin{" + p + "}", m, b);
                    b[0] = v;
                    var C = m.handler.apply(this, b),
                        y = this.lexer.lex(C.position, t);
                    this.expect(y, "\\end");
                    var w = this.parseFunction(C.position, t);
                    if (w.result.value.name !== p) throw new d("Mismatch: \\begin{" + p + "} matched by \\end{" + w.result.value.name + "}", this.lexer, w.namepos);
                    return C.position = w.position, C
                }
                return l.contains(g, r) ? (n = this.parseExpression(i.result.position, t, !1), new u(new h("sizing", {
                    size: "size" + (l.indexOf(g, r) + 1),
                    value: n.result
                }, t), n.position)) : l.contains(f, r) ? (n = this.parseExpression(i.result.position, t, !0), new u(new h("styling", {
                    style: r.slice(1, r.length - 5),
                    value: n.result
                }, t), n.position)) : this.parseFunction(e, t)
            }, i.prototype.parseFunction = function(e, t) {
                var i = this.parseGroup(e, t);
                if (i) {
                    if (i.isFunction) {
                        var n = i.result.result,
                            o = r.funcs[n];
                        if ("text" === t && !o.allowedInText) throw new d("Can't use function '" + n + "' in text mode", this.lexer, i.position);
                        var s = [n],
                            a = this.parseArguments(i.result.position, t, n, o, s),
                            l = r.funcs[n].handler.apply(this, s);
                        return new u(new h(l.type, l, t), a)
                    }
                    return i.result
                }
                return null
            }, i.prototype.parseArguments = function(e, t, i, o, s) {
                var a = o.numArgs + o.numOptionalArgs;
                if (0 === a) return e;
                for (var l = e, c = o.greediness, h = [l], p = 0; a > p; p++) {
                    var m, g = o.argTypes && o.argTypes[p];
                    if (p < o.numOptionalArgs) {
                        if (m = g ? this.parseSpecialGroup(l, g, t, !0) : this.parseOptionalGroup(l, t), !m) {
                            s.push(null), h.push(l);
                            continue
                        }
                    } else if (m = g ? this.parseSpecialGroup(l, g, t) : this.parseGroup(l, t), !m) {
                        var f = this.lexer.lex(l, t);
                        if (this.settings.throwOnError || "\\" !== f.text[0]) throw new d("Expected group after '" + i + "'", this.lexer, e);
                        m = new n(new u(this.handleUnsupportedCmd(f.text, t), f.position), !1)
                    }
                    var b;
                    if (m.isFunction) {
                        var v = r.funcs[m.result.result].greediness;
                        if (!(v > c)) throw new d("Got function '" + m.result.result + "' as argument to '" + i + "'", this.lexer, m.result.position - 1);
                        b = this.parseFunction(l, t)
                    } else b = m.result;
                    s.push(b.result), h.push(b.position), l = b.position
                }
                return s.push(h), l
            }, i.prototype.parseSpecialGroup = function(e, t, i, r) {
                if ("original" === t && (t = i), "color" === t || "size" === t) {
                    var o = this.lexer.lex(e, i);
                    if (r && "[" !== o.text) return null;
                    this.expect(o, r ? "[" : "{");
                    var s, a = this.lexer.lex(o.position, t);
                    s = "color" === t ? a.text : a.data;
                    var l = this.lexer.lex(a.position, i);
                    return this.expect(l, r ? "]" : "}"), new n(new u(new h(t, s, i), l.position), !1)
                }
                if ("text" === t) {
                    var c = this.lexer.lex(e, "whitespace");
                    e = c.position
                }
                return r ? this.parseOptionalGroup(e, t) : this.parseGroup(e, t)
            }, i.prototype.parseGroup = function(e, t) {
                var i = this.lexer.lex(e, t);
                if ("{" === i.text) {
                    var r = this.parseExpression(i.position, t, !1),
                        o = this.lexer.lex(r.position, t);
                    return this.expect(o, "}"), new n(new u(new h("ordgroup", r.result, t), o.position), !1)
                }
                return this.parseSymbol(e, t)
            }, i.prototype.parseOptionalGroup = function(e, t) {
                var i = this.lexer.lex(e, t);
                if ("[" === i.text) {
                    var r = this.parseExpression(i.position, t, !1, "]"),
                        o = this.lexer.lex(r.position, t);
                    return this.expect(o, "]"), new n(new u(new h("ordgroup", r.result, t), o.position), !1)
                }
                return null
            }, i.prototype.parseSymbol = function(e, t) {
                var i = this.lexer.lex(e, t);
                return r.funcs[i.text] ? new n(new u(i.text, i.position), !0) : a[t][i.text] ? new n(new u(new h(a[t][i.text].group, i.text, t), i.position), !1) : null
            }, i.prototype.ParseNode = h, t.exports = i
        }, {
            "./Lexer": 3,
            "./ParseError": 5,
            "./environments": 15,
            "./functions": 18,
            "./parseData": 20,
            "./symbols": 22,
            "./utils": 23
        }],
        7: [function(e, t) {
            function i(e, t) {
                return void 0 === e ? t : e
            }

            function n(e) {
                e = e || {}, this.displayMode = i(e.displayMode, !1), this.throwOnError = i(e.throwOnError, !0), this.errorColor = i(e.errorColor, "#cc0000")
            }
            t.exports = n
        }, {}],
        8: [function(e, t) {
            function i(e, t, i, n) {
                this.id = e, this.size = t, this.cramped = n, this.sizeMultiplier = i
            }
            i.prototype.sup = function() {
                return p[m[this.id]]
            }, i.prototype.sub = function() {
                return p[g[this.id]]
            }, i.prototype.fracNum = function() {
                return p[f[this.id]]
            }, i.prototype.fracDen = function() {
                return p[b[this.id]]
            }, i.prototype.cramp = function() {
                return p[v[this.id]]
            }, i.prototype.cls = function() {
                return h[this.size] + (this.cramped ? " cramped" : " uncramped")
            }, i.prototype.reset = function() {
                return u[this.size]
            };
            var n = 0,
                r = 1,
                o = 2,
                s = 3,
                a = 4,
                l = 5,
                c = 6,
                d = 7,
                h = ["displaystyle textstyle", "textstyle", "scriptstyle", "scriptscriptstyle"],
                u = ["reset-textstyle", "reset-textstyle", "reset-scriptstyle", "reset-scriptscriptstyle"],
                p = [new i(n, 0, 1, !1), new i(r, 0, 1, !0), new i(o, 1, 1, !1), new i(s, 1, 1, !0), new i(a, 2, .7, !1), new i(l, 2, .7, !0), new i(c, 3, .5, !1), new i(d, 3, .5, !0)],
                m = [a, l, a, l, c, d, c, d],
                g = [l, l, l, l, d, d, d, d],
                f = [o, s, a, l, c, d, c, d],
                b = [s, s, l, l, d, d, d, d],
                v = [r, r, s, s, l, l, d, d];
            t.exports = {
                DISPLAY: p[n],
                TEXT: p[o],
                SCRIPT: p[a],
                SCRIPTSCRIPT: p[c]
            }
        }, {}],
        9: [function(e, t) {
            var i = e("./domTree"),
                n = e("./fontMetrics"),
                r = e("./symbols"),
                o = e("./utils"),
                s = ["\\Gamma", "\\Delta", "\\Theta", "\\Lambda", "\\Xi", "\\Pi", "\\Sigma", "\\Upsilon", "\\Phi", "\\Psi", "\\Omega"],
                a = ["\u0131", "\u0237"],
                l = function(e, t, o, s, a) {
                    r[o][e] && r[o][e].replace && (e = r[o][e].replace);
                    var l, c = n.getCharacterMetrics(e, t);
                    return c ? l = new i.symbolNode(e, c.height, c.depth, c.italic, c.skew, a) : ("undefined" != typeof console && console.warn("No character metrics for '" + e + "' in style '" + t + "'"), l = new i.symbolNode(e, 0, 0, 0, 0, a)), s && (l.style.color = s), l
                },
                c = function(e, t, i, n) {
                    return "\\" === e || "main" === r[t][e].font ? l(e, "Main-Regular", t, i, n) : l(e, "AMS-Regular", t, i, n.concat(["amsrm"]))
                },
                d = function(e, t, i, n, r) {
                    if ("mathord" === r) return h(e, t, i, n);
                    if ("textord" === r) return l(e, "Main-Regular", t, i, n.concat(["mathrm"]));
                    throw new Error("unexpected type: " + r + " in mathDefault")
                },
                h = function(e, t, i, n) {
                    return /[0-9]/.test(e.charAt(0)) || o.contains(a, e) || o.contains(s, e) ? l(e, "Main-Italic", t, i, n.concat(["mainit"])) : l(e, "Math-Italic", t, i, n.concat(["mathit"]))
                },
                u = function(e, t, i) {
                    var s = e.mode,
                        c = e.value;
                    r[s][c] && r[s][c].replace && (c = r[s][c].replace);
                    var u = ["mord"],
                        p = t.getColor(),
                        m = t.font;
                    if (m) {
                        if ("mathit" === m || o.contains(a, c)) return h(c, s, p, u);
                        var g = y[m].fontName;
                        return n.getCharacterMetrics(c, g) ? l(c, g, s, p, u.concat([m])) : d(c, s, p, u, i)
                    }
                    return d(c, s, p, u, i)
                },
                p = function(e) {
                    var t = 0,
                        i = 0,
                        n = 0;
                    if (e.children)
                        for (var r = 0; r < e.children.length; r++) e.children[r].height > t && (t = e.children[r].height), e.children[r].depth > i && (i = e.children[r].depth), e.children[r].maxFontSize > n && (n = e.children[r].maxFontSize);
                    e.height = t, e.depth = i, e.maxFontSize = n
                },
                m = function(e, t, n) {
                    var r = new i.span(e, t);
                    return p(r), n && (r.style.color = n), r
                },
                g = function(e) {
                    var t = new i.documentFragment(e);
                    return p(t), t
                },
                f = function(e, t) {
                    var n = m([], [new i.symbolNode("\u200b")]);
                    n.style.fontSize = t / e.style.sizeMultiplier + "em";
                    var r = m(["fontsize-ensurer", "reset-" + e.size, "size5"], [n]);
                    return r
                },
                b = function(e, t, n, r) {
                    var o, s, a;
                    if ("individualShift" === t) {
                        var l = e;
                        for (e = [l[0]], o = -l[0].shift - l[0].elem.depth, s = o, a = 1; a < l.length; a++) {
                            var c = -l[a].shift - s - l[a].elem.depth,
                                d = c - (l[a - 1].elem.height + l[a - 1].elem.depth);
                            s += c, e.push({
                                type: "kern",
                                size: d
                            }), e.push(l[a])
                        }
                    } else if ("top" === t) {
                        var h = n;
                        for (a = 0; a < e.length; a++) h -= "kern" === e[a].type ? e[a].size : e[a].elem.height + e[a].elem.depth;
                        o = h
                    } else o = "bottom" === t ? -n : "shift" === t ? -e[0].elem.depth - n : "firstBaseline" === t ? -e[0].elem.depth : 0;
                    var u = 0;
                    for (a = 0; a < e.length; a++) "elem" === e[a].type && (u = Math.max(u, e[a].elem.maxFontSize));
                    var p = f(r, u),
                        g = [];
                    for (s = o, a = 0; a < e.length; a++)
                        if ("kern" === e[a].type) s += e[a].size;
                        else {
                            var b = e[a].elem,
                                v = -b.depth - s;
                            s += b.height + b.depth;
                            var C = m([], [p, b]);
                            C.height -= v, C.depth += v, C.style.top = v + "em", g.push(C)
                        }
                    var y = m(["baseline-fix"], [p, new i.symbolNode("\u200b")]);
                    g.push(y);
                    var w = m(["vlist"], g);
                    return w.height = Math.max(s, w.height), w.depth = Math.max(-o, w.depth), w
                },
                v = {
                    size1: .5,
                    size2: .7,
                    size3: .8,
                    size4: .9,
                    size5: 1,
                    size6: 1.2,
                    size7: 1.44,
                    size8: 1.73,
                    size9: 2.07,
                    size10: 2.49
                },
                C = {
                    "\\qquad": {
                        size: "2em",
                        className: "qquad"
                    },
                    "\\quad": {
                        size: "1em",
                        className: "quad"
                    },
                    "\\enspace": {
                        size: "0.5em",
                        className: "enspace"
                    },
                    "\\;": {
                        size: "0.277778em",
                        className: "thickspace"
                    },
                    "\\:": {
                        size: "0.22222em",
                        className: "mediumspace"
                    },
                    "\\,": {
                        size: "0.16667em",
                        className: "thinspace"
                    },
                    "\\!": {
                        size: "-0.16667em",
                        className: "negativethinspace"
                    }
                },
                y = {
                    mathbf: {
                        variant: "bold",
                        fontName: "Main-Bold"
                    },
                    mathrm: {
                        variant: "normal",
                        fontName: "Main-Regular"
                    },
                    mathbb: {
                        variant: "double-struck",
                        fontName: "AMS-Regular"
                    },
                    mathcal: {
                        variant: "script",
                        fontName: "Caligraphic-Regular"
                    },
                    mathfrak: {
                        variant: "fraktur",
                        fontName: "Fraktur-Regular"
                    },
                    mathscr: {
                        variant: "script",
                        fontName: "Script-Regular"
                    },
                    mathsf: {
                        variant: "sans-serif",
                        fontName: "SansSerif-Regular"
                    },
                    mathtt: {
                        variant: "monospace",
                        fontName: "Typewriter-Regular"
                    }
                };
            t.exports = {
                fontMap: y,
                makeSymbol: l,
                mathsym: c,
                makeSpan: m,
                makeFragment: g,
                makeVList: b,
                makeOrd: u,
                sizingMultiplier: v,
                spacingFunctions: C
            }
        }, {
            "./domTree": 14,
            "./fontMetrics": 16,
            "./symbols": 22,
            "./utils": 23
        }],
        10: [function(e, t) {
            var i = e("./ParseError"),
                n = e("./Style"),
                r = e("./buildCommon"),
                o = e("./delimiter"),
                s = e("./domTree"),
                a = e("./fontMetrics"),
                l = e("./utils"),
                c = r.makeSpan,
                d = function(e, t, i) {
                    for (var n = [], r = 0; r < e.length; r++) {
                        var o = e[r];
                        n.push(v(o, t, i)), i = o
                    }
                    return n
                },
                h = {
                    mathord: "mord",
                    textord: "mord",
                    bin: "mbin",
                    rel: "mrel",
                    text: "mord",
                    open: "mopen",
                    close: "mclose",
                    inner: "minner",
                    genfrac: "mord",
                    array: "mord",
                    spacing: "mord",
                    punct: "mpunct",
                    ordgroup: "mord",
                    op: "mop",
                    katex: "mord",
                    overline: "mord",
                    rule: "mord",
                    leftright: "minner",
                    sqrt: "mord",
                    accent: "mord"
                },
                u = function(e) {
                    return null == e ? h.mathord : "supsub" === e.type ? u(e.value.base) : "llap" === e.type || "rlap" === e.type ? u(e.value) : "color" === e.type ? u(e.value.value) : "sizing" === e.type ? u(e.value.value) : "styling" === e.type ? u(e.value.value) : "delimsizing" === e.type ? h[e.value.delimType] : h[e.type]
                },
                p = function(e, t) {
                    return e ? "op" === e.type ? e.value.limits && (t.style.size === n.DISPLAY.size || e.value.alwaysHandleSupSub) : "accent" === e.type ? g(e.value.base) : null : !1
                },
                m = function(e) {
                    return e ? "ordgroup" === e.type ? 1 === e.value.length ? m(e.value[0]) : e : "color" === e.type && 1 === e.value.value.length ? m(e.value.value[0]) : e : !1
                },
                g = function(e) {
                    var t = m(e);
                    return "mathord" === t.type || "textord" === t.type || "bin" === t.type || "rel" === t.type || "inner" === t.type || "open" === t.type || "close" === t.type || "punct" === t.type
                },
                f = function(e) {
                    return c(["sizing", "reset-" + e.size, "size5", e.style.reset(), n.TEXT.cls(), "nulldelimiter"])
                },
                b = {
                    mathord: function(e, t) {
                        return r.makeOrd(e, t, "mathord")
                    },
                    textord: function(e, t) {
                        return r.makeOrd(e, t, "textord")
                    },
                    bin: function(e, t, i) {
                        for (var n = "mbin", o = i; o && "color" === o.type;) {
                            var s = o.value.value;
                            o = s[s.length - 1]
                        }
                        return (!i || l.contains(["mbin", "mopen", "mrel", "mop", "mpunct"], u(o))) && (e.type = "textord", n = "mord"), r.mathsym(e.value, e.mode, t.getColor(), [n])
                    },
                    rel: function(e, t) {
                        return r.mathsym(e.value, e.mode, t.getColor(), ["mrel"])
                    },
                    open: function(e, t) {
                        return r.mathsym(e.value, e.mode, t.getColor(), ["mopen"])
                    },
                    close: function(e, t) {
                        return r.mathsym(e.value, e.mode, t.getColor(), ["mclose"])
                    },
                    inner: function(e, t) {
                        return r.mathsym(e.value, e.mode, t.getColor(), ["minner"])
                    },
                    punct: function(e, t) {
                        return r.mathsym(e.value, e.mode, t.getColor(), ["mpunct"])
                    },
                    ordgroup: function(e, t) {
                        return c(["mord", t.style.cls()], d(e.value, t.reset()))
                    },
                    text: function(e, t) {
                        return c(["text", "mord", t.style.cls()], d(e.value.body, t.reset()))
                    },
                    color: function(e, t, i) {
                        var n = d(e.value.value, t.withColor(e.value.color), i);
                        return new r.makeFragment(n)
                    },
                    supsub: function(e, t, i) {
                        if (p(e.value.base, t)) return b[e.value.base.type](e, t, i);
                        var o, l, d, h, m = v(e.value.base, t.reset());
                        e.value.sup && (d = v(e.value.sup, t.withStyle(t.style.sup())), o = c([t.style.reset(), t.style.sup().cls()], [d])), e.value.sub && (h = v(e.value.sub, t.withStyle(t.style.sub())), l = c([t.style.reset(), t.style.sub().cls()], [h]));
                        var f, C;
                        g(e.value.base) ? (f = 0, C = 0) : (f = m.height - a.metrics.supDrop, C = m.depth + a.metrics.subDrop);
                        var y;
                        y = t.style === n.DISPLAY ? a.metrics.sup1 : t.style.cramped ? a.metrics.sup3 : a.metrics.sup2;
                        var w, S = n.TEXT.sizeMultiplier * t.style.sizeMultiplier,
                            _ = .5 / a.metrics.ptPerEm / S + "em";
                        if (e.value.sup)
                            if (e.value.sub) {
                                f = Math.max(f, y, d.depth + .25 * a.metrics.xHeight), C = Math.max(C, a.metrics.sub2);
                                var k = a.metrics.defaultRuleThickness;
                                if (f - d.depth - (h.height - C) < 4 * k) {
                                    C = 4 * k - (f - d.depth) + h.height;
                                    var E = .8 * a.metrics.xHeight - (f - d.depth);
                                    E > 0 && (f += E, C -= E)
                                }
                                w = r.makeVList([{
                                    type: "elem",
                                    elem: l,
                                    shift: C
                                }, {
                                    type: "elem",
                                    elem: o,
                                    shift: -f
                                }], "individualShift", null, t), m instanceof s.symbolNode && (w.children[0].style.marginLeft = -m.italic + "em"), w.children[0].style.marginRight = _, w.children[1].style.marginRight = _
                            } else f = Math.max(f, y, d.depth + .25 * a.metrics.xHeight), w = r.makeVList([{
                                type: "elem",
                                elem: o
                            }], "shift", -f, t), w.children[0].style.marginRight = _;
                        else C = Math.max(C, a.metrics.sub1, h.height - .8 * a.metrics.xHeight), w = r.makeVList([{
                            type: "elem",
                            elem: l
                        }], "shift", C, t), w.children[0].style.marginRight = _, m instanceof s.symbolNode && (w.children[0].style.marginLeft = -m.italic + "em");
                        return c([u(e.value.base)], [m, w])
                    },
                    genfrac: function(e, t) {
                        var i = t.style;
                        "display" === e.value.size ? i = n.DISPLAY : "text" === e.value.size && (i = n.TEXT);
                        var s, l = i.fracNum(),
                            d = i.fracDen(),
                            h = v(e.value.numer, t.withStyle(l)),
                            u = c([i.reset(), l.cls()], [h]),
                            p = v(e.value.denom, t.withStyle(d)),
                            m = c([i.reset(), d.cls()], [p]);
                        s = e.value.hasBarLine ? a.metrics.defaultRuleThickness / t.style.sizeMultiplier : 0;
                        var g, b, C;
                        i.size === n.DISPLAY.size ? (g = a.metrics.num1, b = s > 0 ? 3 * s : 7 * a.metrics.defaultRuleThickness, C = a.metrics.denom1) : (s > 0 ? (g = a.metrics.num2, b = s) : (g = a.metrics.num3, b = 3 * a.metrics.defaultRuleThickness), C = a.metrics.denom2);
                        var y;
                        if (0 === s) {
                            var w = g - h.depth - (p.height - C);
                            b > w && (g += .5 * (b - w), C += .5 * (b - w)), y = r.makeVList([{
                                type: "elem",
                                elem: m,
                                shift: C
                            }, {
                                type: "elem",
                                elem: u,
                                shift: -g
                            }], "individualShift", null, t)
                        } else {
                            var S = a.metrics.axisHeight;
                            g - h.depth - (S + .5 * s) < b && (g += b - (g - h.depth - (S + .5 * s))), S - .5 * s - (p.height - C) < b && (C += b - (S - .5 * s - (p.height - C)));
                            var _ = c([t.style.reset(), n.TEXT.cls(), "frac-line"]);
                            _.height = s;
                            var k = -(S - .5 * s);
                            y = r.makeVList([{
                                type: "elem",
                                elem: m,
                                shift: C
                            }, {
                                type: "elem",
                                elem: _,
                                shift: k
                            }, {
                                type: "elem",
                                elem: u,
                                shift: -g
                            }], "individualShift", null, t)
                        }
                        y.height *= i.sizeMultiplier / t.style.sizeMultiplier, y.depth *= i.sizeMultiplier / t.style.sizeMultiplier;
                        var E;
                        E = i.size === n.DISPLAY.size ? a.metrics.delim1 : a.metrics.getDelim2(i);
                        var A, x;
                        return A = null == e.value.leftDelim ? f(t) : o.customSizedDelim(e.value.leftDelim, E, !0, t.withStyle(i), e.mode), x = null == e.value.rightDelim ? f(t) : o.customSizedDelim(e.value.rightDelim, E, !0, t.withStyle(i), e.mode), c(["mord", t.style.reset(), i.cls()], [A, c(["mfrac"], [y]), x], t.getColor())
                    },
                    array: function(e, t) {
                        var n, o, s = e.value.body.length,
                            d = 0,
                            h = new Array(s),
                            u = 1 / a.metrics.ptPerEm,
                            p = 5 * u,
                            m = 12 * u,
                            g = l.deflt(e.value.arraystretch, 1),
                            f = g * m,
                            b = .7 * f,
                            C = .3 * f,
                            y = 0;
                        for (n = 0; n < e.value.body.length; ++n) {
                            var w = e.value.body[n],
                                S = b,
                                _ = C;
                            d < w.length && (d = w.length);
                            var k = new Array(w.length);
                            for (o = 0; o < w.length; ++o) {
                                var E = v(w[o], t);
                                _ < E.depth && (_ = E.depth), S < E.height && (S = E.height), k[o] = E
                            }
                            var A = 0;
                            if (e.value.rowGaps[n]) {
                                switch (A = e.value.rowGaps[n].value, A.unit) {
                                    case "em":
                                        A = A.number;
                                        break;
                                    case "ex":
                                        A = A.number * a.metrics.emPerEx;
                                        break;
                                    default:
                                        console.error("Can't handle unit " + A.unit), A = 0
                                }
                                A > 0 && (A += C, A > _ && (_ = A), A = 0)
                            }
                            k.height = S, k.depth = _, y += S, k.pos = y, y += _ + A, h[n] = k
                        }
                        var x, I, D = y / 2 + a.metrics.axisHeight,
                            L = e.value.cols || [],
                            T = [];
                        for (o = 0, I = 0; d > o || I < L.length; ++o, ++I) {
                            for (var F = L[I] || {}, B = !0;
                                 "separator" === F.type;) {
                                if (B || (x = c(["arraycolsep"], []), x.style.width = a.metrics.doubleRuleSep + "em", T.push(x)), "|" !== F.separator) throw new i("Invalid separator type: " + F.separator);
                                var P = c(["vertical-separator"], []);
                                P.style.height = y + "em", P.style.verticalAlign = -(y - D) + "em", T.push(P), I++, F = L[I] || {}, B = !1
                            }
                            if (!(o >= d)) {
                                var M;
                                (o > 0 || e.value.hskipBeforeAndAfter) && (M = l.deflt(F.pregap, p), 0 !== M && (x = c(["arraycolsep"], []), x.style.width = M + "em", T.push(x)));
                                var R = [];
                                for (n = 0; s > n; ++n) {
                                    var G = h[n],
                                        N = G[o];
                                    if (N) {
                                        var U = G.pos - D;
                                        N.depth = G.depth, N.height = G.height, R.push({
                                            type: "elem",
                                            elem: N,
                                            shift: U
                                        })
                                    }
                                }
                                R = r.makeVList(R, "individualShift", null, t), R = c(["col-align-" + (F.align || "c")], [R]), T.push(R), (d - 1 > o || e.value.hskipBeforeAndAfter) && (M = l.deflt(F.postgap, p), 0 !== M && (x = c(["arraycolsep"], []), x.style.width = M + "em", T.push(x)))
                            }
                        }
                        return h = c(["mtable"], T), c(["mord"], [h], t.getColor())
                    },
                    spacing: function(e) {
                        return "\\ " === e.value || "\\space" === e.value || " " === e.value || "~" === e.value ? c(["mord", "mspace"], [r.mathsym(e.value, e.mode)]) : c(["mord", "mspace", r.spacingFunctions[e.value].className])
                    },
                    llap: function(e, t) {
                        var i = c(["inner"], [v(e.value.body, t.reset())]),
                            n = c(["fix"], []);
                        return c(["llap", t.style.cls()], [i, n])
                    },
                    rlap: function(e, t) {
                        var i = c(["inner"], [v(e.value.body, t.reset())]),
                            n = c(["fix"], []);
                        return c(["rlap", t.style.cls()], [i, n])
                    },
                    op: function(e, t) {
                        var i, o, s = !1;
                        "supsub" === e.type && (i = e.value.sup, o = e.value.sub, e = e.value.base, s = !0);
                        var d = ["\\smallint"],
                            h = !1;
                        t.style.size === n.DISPLAY.size && e.value.symbol && !l.contains(d, e.value.body) && (h = !0);
                        var u, p = 0,
                            m = 0;
                        if (e.value.symbol) {
                            var g = h ? "Size2-Regular" : "Size1-Regular";
                            u = r.makeSymbol(e.value.body, g, "math", t.getColor(), ["op-symbol", h ? "large-op" : "small-op", "mop"]), p = (u.height - u.depth) / 2 - a.metrics.axisHeight * t.style.sizeMultiplier, m = u.italic
                        } else {
                            for (var f = [], b = 1; b < e.value.body.length; b++) f.push(r.mathsym(e.value.body[b], e.mode));
                            u = c(["mop"], f, t.getColor())
                        }
                        if (s) {
                            u = c([], [u]);
                            var C, y, w, S;
                            if (i) {
                                var _ = v(i, t.withStyle(t.style.sup()));
                                C = c([t.style.reset(), t.style.sup().cls()], [_]), y = Math.max(a.metrics.bigOpSpacing1, a.metrics.bigOpSpacing3 - _.depth)
                            }
                            if (o) {
                                var k = v(o, t.withStyle(t.style.sub()));
                                w = c([t.style.reset(), t.style.sub().cls()], [k]), S = Math.max(a.metrics.bigOpSpacing2, a.metrics.bigOpSpacing4 - k.height)
                            }
                            var E, A, x;
                            if (i)
                                if (o) {
                                    if (!i && !o) return u;
                                    x = a.metrics.bigOpSpacing5 + w.height + w.depth + S + u.depth + p, E = r.makeVList([{
                                        type: "kern",
                                        size: a.metrics.bigOpSpacing5
                                    }, {
                                        type: "elem",
                                        elem: w
                                    }, {
                                        type: "kern",
                                        size: S
                                    }, {
                                        type: "elem",
                                        elem: u
                                    }, {
                                        type: "kern",
                                        size: y
                                    }, {
                                        type: "elem",
                                        elem: C
                                    }, {
                                        type: "kern",
                                        size: a.metrics.bigOpSpacing5
                                    }], "bottom", x, t), E.children[0].style.marginLeft = -m + "em", E.children[2].style.marginLeft = m + "em"
                                } else x = u.depth + p, E = r.makeVList([{
                                    type: "elem",
                                    elem: u
                                }, {
                                    type: "kern",
                                    size: y
                                }, {
                                    type: "elem",
                                    elem: C
                                }, {
                                    type: "kern",
                                    size: a.metrics.bigOpSpacing5
                                }], "bottom", x, t), E.children[1].style.marginLeft = m + "em";
                            else A = u.height - p, E = r.makeVList([{
                                type: "kern",
                                size: a.metrics.bigOpSpacing5
                            }, {
                                type: "elem",
                                elem: w
                            }, {
                                type: "kern",
                                size: S
                            }, {
                                type: "elem",
                                elem: u
                            }], "top", A, t), E.children[0].style.marginLeft = -m + "em";
                            return c(["mop", "op-limits"], [E])
                        }
                        return e.value.symbol && (u.style.top = p + "em"), u
                    },
                    katex: function(e, t) {
                        var i = c(["k"], [r.mathsym("K", e.mode)]),
                            n = c(["a"], [r.mathsym("A", e.mode)]);
                        n.height = .75 * (n.height + .2), n.depth = .75 * (n.height - .2);
                        var o = c(["t"], [r.mathsym("T", e.mode)]),
                            s = c(["e"], [r.mathsym("E", e.mode)]);
                        s.height = s.height - .2155, s.depth = s.depth + .2155;
                        var a = c(["x"], [r.mathsym("X", e.mode)]);
                        return c(["katex-logo", "mord"], [i, n, o, s, a], t.getColor())
                    },
                    overline: function(e, t) {
                        var i = v(e.value.body, t.withStyle(t.style.cramp())),
                            o = a.metrics.defaultRuleThickness / t.style.sizeMultiplier,
                            s = c([t.style.reset(), n.TEXT.cls(), "overline-line"]);
                        s.height = o, s.maxFontSize = 1;
                        var l = r.makeVList([{
                            type: "elem",
                            elem: i
                        }, {
                            type: "kern",
                            size: 3 * o
                        }, {
                            type: "elem",
                            elem: s
                        }, {
                            type: "kern",
                            size: o
                        }], "firstBaseline", null, t);
                        return c(["overline", "mord"], [l], t.getColor())
                    },
                    sqrt: function(e, t) {
                        var i = v(e.value.body, t.withStyle(t.style.cramp())),
                            s = a.metrics.defaultRuleThickness / t.style.sizeMultiplier,
                            l = c([t.style.reset(), n.TEXT.cls(), "sqrt-line"], [], t.getColor());
                        l.height = s, l.maxFontSize = 1;
                        var d = s;
                        t.style.id < n.TEXT.id && (d = a.metrics.xHeight);
                        var h = s + d / 4,
                            u = (i.height + i.depth) * t.style.sizeMultiplier,
                            p = u + h + s,
                            m = c(["sqrt-sign"], [o.customSizedDelim("\\surd", p, !1, t, e.mode)], t.getColor()),
                            g = m.height + m.depth - s;
                        g > i.height + i.depth + h && (h = (h + g - i.height - i.depth) / 2);
                        var f = -(i.height + h + s) + m.height;
                        m.style.top = f + "em", m.height -= f, m.depth += f;
                        var b;
                        if (b = 0 === i.height && 0 === i.depth ? c() : r.makeVList([{
                                type: "elem",
                                elem: i
                            }, {
                                type: "kern",
                                size: h
                            }, {
                                type: "elem",
                                elem: l
                            }, {
                                type: "kern",
                                size: s
                            }], "firstBaseline", null, t), e.value.index) {
                            var C = v(e.value.index, t.withStyle(n.SCRIPTSCRIPT)),
                                y = c([t.style.reset(), n.SCRIPTSCRIPT.cls()], [C]),
                                w = Math.max(m.height, b.height),
                                S = Math.max(m.depth, b.depth),
                                _ = .6 * (w - S),
                                k = r.makeVList([{
                                    type: "elem",
                                    elem: y
                                }], "shift", -_, t),
                                E = c(["root"], [k]);
                            return c(["sqrt", "mord"], [E, m, b])
                        }
                        return c(["sqrt", "mord"], [m, b])
                    },
                    sizing: function(e, t, i) {
                        var n = d(e.value.value, t.withSize(e.value.size), i),
                            o = c(["mord"], [c(["sizing", "reset-" + t.size, e.value.size, t.style.cls()], n)]),
                            s = r.sizingMultiplier[e.value.size];
                        return o.maxFontSize = s * t.style.sizeMultiplier, o
                    },
                    styling: function(e, t, i) {
                        var r = {
                                display: n.DISPLAY,
                                text: n.TEXT,
                                script: n.SCRIPT,
                                scriptscript: n.SCRIPTSCRIPT
                            },
                            o = r[e.value.style],
                            s = d(e.value.value, t.withStyle(o), i);
                        return c([t.style.reset(), o.cls()], s)
                    },
                    font: function(e, t, i) {
                        var n = e.value.font;
                        return v(e.value.body, t.withFont(n), i)
                    },
                    delimsizing: function(e, t) {
                        var i = e.value.value;
                        return "." === i ? c([h[e.value.delimType]]) : c([h[e.value.delimType]], [o.sizedDelim(i, e.value.size, t, e.mode)])
                    },
                    leftright: function(e, t) {
                        for (var i = d(e.value.body, t.reset()), n = 0, r = 0, s = 0; s < i.length; s++) n = Math.max(i[s].height, n), r = Math.max(i[s].depth, r);
                        n *= t.style.sizeMultiplier, r *= t.style.sizeMultiplier;
                        var a;
                        a = "." === e.value.left ? f(t) : o.leftRightDelim(e.value.left, n, r, t, e.mode), i.unshift(a);
                        var l;
                        return l = "." === e.value.right ? f(t) : o.leftRightDelim(e.value.right, n, r, t, e.mode), i.push(l), c(["minner", t.style.cls()], i, t.getColor())
                    },
                    rule: function(e, t) {
                        var i = c(["mord", "rule"], [], t.getColor()),
                            n = 0;
                        e.value.shift && (n = e.value.shift.number, "ex" === e.value.shift.unit && (n *= a.metrics.xHeight));
                        var r = e.value.width.number;
                        "ex" === e.value.width.unit && (r *= a.metrics.xHeight);
                        var o = e.value.height.number;
                        return "ex" === e.value.height.unit && (o *= a.metrics.xHeight), n /= t.style.sizeMultiplier, r /= t.style.sizeMultiplier, o /= t.style.sizeMultiplier, i.style.borderRightWidth = r + "em", i.style.borderTopWidth = o + "em", i.style.bottom = n + "em", i.width = r, i.height = o + n, i.depth = -n, i
                    },
                    accent: function(e, t, i) {
                        var n, o = e.value.base;
                        if ("supsub" === e.type) {
                            var s = e;
                            e = s.value.base, o = e.value.base, s.value.base = o, n = v(s, t.reset(), i)
                        }
                        var l, d = v(o, t.withStyle(t.style.cramp()));
                        if (g(o)) {
                            var h = m(o),
                                u = v(h, t.withStyle(t.style.cramp()));
                            l = u.skew
                        } else l = 0;
                        var p = Math.min(d.height, a.metrics.xHeight),
                            f = r.makeSymbol(e.value.accent, "Main-Regular", "math", t.getColor());
                        f.italic = 0;
                        var b = "\\vec" === e.value.accent ? "accent-vec" : null,
                            C = c(["accent-body", b], [c([], [f])]);
                        C = r.makeVList([{
                            type: "elem",
                            elem: d
                        }, {
                            type: "kern",
                            size: -p
                        }, {
                            type: "elem",
                            elem: C
                        }], "firstBaseline", null, t), C.children[1].style.marginLeft = 2 * l + "em";
                        var y = c(["mord", "accent"], [C]);
                        return n ? (n.children[0] = y, n.height = Math.max(y.height, n.height), n.classes[0] = "mord", n) : y
                    },
                    phantom: function(e, t, i) {
                        var n = d(e.value.value, t.withPhantom(), i);
                        return new r.makeFragment(n)
                    }
                },
                v = function(e, t, n) {
                    if (!e) return c();
                    if (b[e.type]) {
                        var o, s = b[e.type](e, t, n);
                        return t.style !== t.parentStyle && (o = t.style.sizeMultiplier / t.parentStyle.sizeMultiplier, s.height *= o, s.depth *= o), t.size !== t.parentSize && (o = r.sizingMultiplier[t.size] / r.sizingMultiplier[t.parentSize], s.height *= o, s.depth *= o), s
                    }
                    throw new i("Got group of unknown type: '" + e.type + "'")
                },
                C = function(e, t) {
                    e = JSON.parse(JSON.stringify(e));
                    var i = d(e, t),
                        n = c(["base", t.style.cls()], i),
                        r = c(["strut"]),
                        o = c(["strut", "bottom"]);
                    r.style.height = n.height + "em", o.style.height = n.height + n.depth + "em", o.style.verticalAlign = -n.depth + "em";
                    var s = c(["katex-html"], [r, o, n]);
                    return s.setAttribute("aria-hidden", "true"), s
                };
            t.exports = C
        }, {
            "./ParseError": 5,
            "./Style": 8,
            "./buildCommon": 9,
            "./delimiter": 13,
            "./domTree": 14,
            "./fontMetrics": 16,
            "./utils": 23
        }],
        11: [function(e, t) {
            var i = e("./buildCommon"),
                n = e("./fontMetrics"),
                r = e("./mathMLTree"),
                o = e("./ParseError"),
                s = e("./symbols"),
                a = e("./utils"),
                l = i.makeSpan,
                c = i.fontMap,
                d = function(e, t) {
                    return s[t][e] && s[t][e].replace && (e = s[t][e].replace), new r.TextNode(e)
                },
                h = function(e, t) {
                    var i = t.font;
                    if (!i) return null;
                    var r = e.mode;
                    if ("mathit" === i) return "italic";
                    var o = e.value;
                    if (a.contains(["\\imath", "\\jmath"], o)) return null;
                    s[r][o] && s[r][o].replace && (o = s[r][o].replace);
                    var l = c[i].fontName;
                    return n.getCharacterMetrics(o, l) ? c[t.font].variant : null
                },
                u = {
                    mathord: function(e, t) {
                        var i = new r.MathNode("mi", [d(e.value, e.mode)]),
                            n = h(e, t);
                        return n && i.setAttribute("mathvariant", n), i
                    },
                    textord: function(e, t) {
                        var i, n = d(e.value, e.mode),
                            o = h(e, t) || "normal";
                        return /[0-9]/.test(e.value) ? (i = new r.MathNode("mn", [n]), t.font && i.setAttribute("mathvariant", o)) : (i = new r.MathNode("mi", [n]), i.setAttribute("mathvariant", o)), i
                    },
                    bin: function(e) {
                        var t = new r.MathNode("mo", [d(e.value, e.mode)]);
                        return t
                    },
                    rel: function(e) {
                        var t = new r.MathNode("mo", [d(e.value, e.mode)]);
                        return t
                    },
                    open: function(e) {
                        var t = new r.MathNode("mo", [d(e.value, e.mode)]);
                        return t
                    },
                    close: function(e) {
                        var t = new r.MathNode("mo", [d(e.value, e.mode)]);
                        return t
                    },
                    inner: function(e) {
                        var t = new r.MathNode("mo", [d(e.value, e.mode)]);
                        return t
                    },
                    punct: function(e) {
                        var t = new r.MathNode("mo", [d(e.value, e.mode)]);
                        return t.setAttribute("separator", "true"), t
                    },
                    ordgroup: function(e, t) {
                        var i = p(e.value, t),
                            n = new r.MathNode("mrow", i);
                        return n
                    },
                    text: function(e, t) {
                        var i = p(e.value.body, t),
                            n = new r.MathNode("mtext", i);
                        return n
                    },
                    color: function(e, t) {
                        var i = p(e.value.value, t),
                            n = new r.MathNode("mstyle", i);
                        return n.setAttribute("mathcolor", e.value.color), n
                    },
                    supsub: function(e, t) {
                        var i = [m(e.value.base, t)];
                        e.value.sub && i.push(m(e.value.sub, t)), e.value.sup && i.push(m(e.value.sup, t));
                        var n;
                        n = e.value.sub ? e.value.sup ? "msubsup" : "msub" : "msup";
                        var o = new r.MathNode(n, i);
                        return o
                    },
                    genfrac: function(e, t) {
                        var i = new r.MathNode("mfrac", [m(e.value.numer, t), m(e.value.denom, t)]);
                        if (e.value.hasBarLine || i.setAttribute("linethickness", "0px"), null != e.value.leftDelim || null != e.value.rightDelim) {
                            var n = [];
                            if (null != e.value.leftDelim) {
                                var o = new r.MathNode("mo", [new r.TextNode(e.value.leftDelim)]);
                                o.setAttribute("fence", "true"), n.push(o)
                            }
                            if (n.push(i), null != e.value.rightDelim) {
                                var s = new r.MathNode("mo", [new r.TextNode(e.value.rightDelim)]);
                                s.setAttribute("fence", "true"), n.push(s)
                            }
                            var a = new r.MathNode("mrow", n);
                            return a
                        }
                        return i
                    },
                    array: function(e, t) {
                        return new r.MathNode("mtable", e.value.body.map(function(e) {
                            return new r.MathNode("mtr", e.map(function(e) {
                                return new r.MathNode("mtd", [m(e, t)])
                            }))
                        }))
                    },
                    sqrt: function(e, t) {
                        var i;
                        return i = e.value.index ? new r.MathNode("mroot", [m(e.value.body, t), m(e.value.index, t)]) : new r.MathNode("msqrt", [m(e.value.body, t)])
                    },
                    leftright: function(e, t) {
                        var i = p(e.value.body, t);
                        if ("." !== e.value.left) {
                            var n = new r.MathNode("mo", [d(e.value.left, e.mode)]);
                            n.setAttribute("fence", "true"), i.unshift(n)
                        }
                        if ("." !== e.value.right) {
                            var o = new r.MathNode("mo", [d(e.value.right, e.mode)]);
                            o.setAttribute("fence", "true"), i.push(o)
                        }
                        var s = new r.MathNode("mrow", i);
                        return s
                    },
                    accent: function(e, t) {
                        var i = new r.MathNode("mo", [d(e.value.accent, e.mode)]),
                            n = new r.MathNode("mover", [m(e.value.base, t), i]);
                        return n.setAttribute("accent", "true"), n
                    },
                    spacing: function(e) {
                        var t;
                        return "\\ " === e.value || "\\space" === e.value || " " === e.value || "~" === e.value ? t = new r.MathNode("mtext", [new r.TextNode("\xa0")]) : (t = new r.MathNode("mspace"), t.setAttribute("width", i.spacingFunctions[e.value].size)), t
                    },
                    op: function(e) {
                        var t;
                        return t = e.value.symbol ? new r.MathNode("mo", [d(e.value.body, e.mode)]) : new r.MathNode("mi", [new r.TextNode(e.value.body.slice(1))])
                    },
                    katex: function() {
                        var e = new r.MathNode("mtext", [new r.TextNode("KaTeX")]);
                        return e
                    },
                    font: function(e, t) {
                        var i = e.value.font;
                        return m(e.value.body, t.withFont(i))
                    },
                    delimsizing: function(e) {
                        var t = [];
                        "." !== e.value.value && t.push(d(e.value.value, e.mode));
                        var i = new r.MathNode("mo", t);
                        return "open" === e.value.delimType || "close" === e.value.delimType ? i.setAttribute("fence", "true") : i.setAttribute("fence", "false"), i
                    },
                    styling: function(e, t) {
                        var i = p(e.value.value, t),
                            n = new r.MathNode("mstyle", i),
                            o = {
                                display: ["0", "true"],
                                text: ["0", "false"],
                                script: ["1", "false"],
                                scriptscript: ["2", "false"]
                            },
                            s = o[e.value.style];
                        return n.setAttribute("scriptlevel", s[0]), n.setAttribute("displaystyle", s[1]), n
                    },
                    sizing: function(e, t) {
                        var n = p(e.value.value, t),
                            o = new r.MathNode("mstyle", n);
                        return o.setAttribute("mathsize", i.sizingMultiplier[e.value.size] + "em"), o
                    },
                    overline: function(e, t) {
                        var i = new r.MathNode("mo", [new r.TextNode("\u203e")]);
                        i.setAttribute("stretchy", "true");
                        var n = new r.MathNode("mover", [m(e.value.body, t), i]);
                        return n.setAttribute("accent", "true"), n
                    },
                    rule: function() {
                        var e = new r.MathNode("mrow");
                        return e
                    },
                    llap: function(e, t) {
                        var i = new r.MathNode("mpadded", [m(e.value.body, t)]);
                        return i.setAttribute("lspace", "-1width"), i.setAttribute("width", "0px"), i
                    },
                    rlap: function(e, t) {
                        var i = new r.MathNode("mpadded", [m(e.value.body, t)]);
                        return i.setAttribute("width", "0px"), i
                    },
                    phantom: function(e, t) {
                        var i = p(e.value.value, t);
                        return new r.MathNode("mphantom", i)
                    }
                },
                p = function(e, t) {
                    for (var i = [], n = 0; n < e.length; n++) {
                        var r = e[n];
                        i.push(m(r, t))
                    }
                    return i
                },
                m = function(e, t) {
                    if (!e) return new r.MathNode("mrow");
                    if (u[e.type]) return u[e.type](e, t);
                    throw new o("Got group of unknown type: '" + e.type + "'")
                },
                g = function(e, t, i) {
                    var n = p(e, i),
                        o = new r.MathNode("mrow", n),
                        s = new r.MathNode("annotation", [new r.TextNode(t)]);
                    s.setAttribute("encoding", "application/x-tex");
                    var a = new r.MathNode("semantics", [o, s]),
                        c = new r.MathNode("math", [a]);
                    return l(["katex-mathml"], [c])
                };
            t.exports = g
        }, {
            "./ParseError": 5,
            "./buildCommon": 9,
            "./fontMetrics": 16,
            "./mathMLTree": 19,
            "./symbols": 22,
            "./utils": 23
        }],
        12: [function(e, t) {
            var i = e("./buildHTML"),
                n = e("./buildMathML"),
                r = e("./buildCommon"),
                o = e("./Options"),
                s = e("./Settings"),
                a = e("./Style"),
                l = r.makeSpan,
                c = function(e, t, r) {
                    r = r || new s({});
                    var c = a.TEXT;
                    r.displayMode && (c = a.DISPLAY);
                    var d = new o({
                            style: c,
                            size: "size5"
                        }),
                        h = n(e, t, d),
                        u = i(e, d),
                        p = l(["katex"], [h, u]);
                    return r.displayMode ? l(["katex-display"], [p]) : p
                };
            t.exports = c
        }, {
            "./Options": 4,
            "./Settings": 7,
            "./Style": 8,
            "./buildCommon": 9,
            "./buildHTML": 10,
            "./buildMathML": 11
        }],
        13: [function(e, t) {
            var i = e("./ParseError"),
                n = e("./Style"),
                r = e("./buildCommon"),
                o = e("./fontMetrics"),
                s = e("./symbols"),
                a = e("./utils"),
                l = r.makeSpan,
                c = function(e, t) {
                    return s.math[e] && s.math[e].replace ? o.getCharacterMetrics(s.math[e].replace, t) : o.getCharacterMetrics(e, t)
                },
                d = function(e, t, i) {
                    return r.makeSymbol(e, "Size" + t + "-Regular", i)
                },
                h = function(e, t, i) {
                    var n = l(["style-wrap", i.style.reset(), t.cls()], [e]),
                        r = t.sizeMultiplier / i.style.sizeMultiplier;
                    return n.height *= r, n.depth *= r, n.maxFontSize = t.sizeMultiplier, n
                },
                u = function(e, t, i, n, s) {
                    var a = r.makeSymbol(e, "Main-Regular", s),
                        l = h(a, t, n);
                    if (i) {
                        var c = (1 - n.style.sizeMultiplier / t.sizeMultiplier) * o.metrics.axisHeight;
                        l.style.top = c + "em", l.height -= c, l.depth += c
                    }
                    return l
                },
                p = function(e, t, i, r, s) {
                    var a = d(e, t, s),
                        c = h(l(["delimsizing", "size" + t], [a], r.getColor()), n.TEXT, r);
                    if (i) {
                        var u = (1 - r.style.sizeMultiplier) * o.metrics.axisHeight;
                        c.style.top = u + "em", c.height -= u, c.depth += u
                    }
                    return c
                },
                m = function(e, t, i) {
                    var n;
                    "Size1-Regular" === t ? n = "delim-size1" : "Size4-Regular" === t && (n = "delim-size4");
                    var o = l(["delimsizinginner", n], [l([], [r.makeSymbol(e, t, i)])]);
                    return {
                        type: "elem",
                        elem: o
                    }
                },
                g = function(e, t, i, s, a) {
                    var d, u, p, g;
                    d = p = g = e, u = null;
                    var f = "Size1-Regular";
                    "\\uparrow" === e ? p = g = "\u23d0" : "\\Uparrow" === e ? p = g = "\u2016" : "\\downarrow" === e ? d = p = "\u23d0" : "\\Downarrow" === e ? d = p = "\u2016" : "\\updownarrow" === e ? (d = "\\uparrow", p = "\u23d0", g = "\\downarrow") : "\\Updownarrow" === e ? (d = "\\Uparrow", p = "\u2016", g = "\\Downarrow") : "[" === e || "\\lbrack" === e ? (d = "\u23a1", p = "\u23a2", g = "\u23a3", f = "Size4-Regular") : "]" === e || "\\rbrack" === e ? (d = "\u23a4", p = "\u23a5", g = "\u23a6", f = "Size4-Regular") : "\\lfloor" === e ? (p = d = "\u23a2", g = "\u23a3", f = "Size4-Regular") : "\\lceil" === e ? (d = "\u23a1", p = g = "\u23a2", f = "Size4-Regular") : "\\rfloor" === e ? (p = d = "\u23a5", g = "\u23a6", f = "Size4-Regular") : "\\rceil" === e ? (d = "\u23a4", p = g = "\u23a5", f = "Size4-Regular") : "(" === e ? (d = "\u239b", p = "\u239c", g = "\u239d", f = "Size4-Regular") : ")" === e ? (d = "\u239e", p = "\u239f", g = "\u23a0", f = "Size4-Regular") : "\\{" === e || "\\lbrace" === e ? (d = "\u23a7", u = "\u23a8", g = "\u23a9", p = "\u23aa", f = "Size4-Regular") : "\\}" === e || "\\rbrace" === e ? (d = "\u23ab", u = "\u23ac", g = "\u23ad", p = "\u23aa", f = "Size4-Regular") : "\\lgroup" === e ? (d = "\u23a7", g = "\u23a9", p = "\u23aa", f = "Size4-Regular") : "\\rgroup" === e ? (d = "\u23ab", g = "\u23ad", p = "\u23aa", f = "Size4-Regular") : "\\lmoustache" === e ? (d = "\u23a7", g = "\u23ad", p = "\u23aa", f = "Size4-Regular") : "\\rmoustache" === e ? (d = "\u23ab", g = "\u23a9", p = "\u23aa", f = "Size4-Regular") : "\\surd" === e && (d = "\ue001", g = "\u23b7", p = "\ue000", f = "Size4-Regular");
                    var b = c(d, f),
                        v = b.height + b.depth,
                        C = c(p, f),
                        y = C.height + C.depth,
                        w = c(g, f),
                        S = w.height + w.depth,
                        _ = 0,
                        k = 1;
                    if (null !== u) {
                        var E = c(u, f);
                        _ = E.height + E.depth, k = 2
                    }
                    var A = v + S + _,
                        x = Math.ceil((t - A) / (k * y)),
                        I = A + x * k * y,
                        D = o.metrics.axisHeight;
                    i && (D *= s.style.sizeMultiplier);
                    var L = I / 2 - D,
                        T = [];
                    T.push(m(g, f, a));
                    var F;
                    if (null === u)
                        for (F = 0; x > F; F++) T.push(m(p, f, a));
                    else {
                        for (F = 0; x > F; F++) T.push(m(p, f, a));
                        for (T.push(m(u, f, a)), F = 0; x > F; F++) T.push(m(p, f, a))
                    }
                    T.push(m(d, f, a));
                    var B = r.makeVList(T, "bottom", L, s);
                    return h(l(["delimsizing", "mult"], [B], s.getColor()), n.TEXT, s)
                },
                f = ["(", ")", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\\lceil", "\\rceil", "\\surd"],
                b = ["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\\lmoustache", "\\rmoustache"],
                v = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash"],
                C = [0, 1.2, 1.8, 2.4, 3],
                y = function(e, t, n, r) {
                    if ("<" === e ? e = "\\langle" : ">" === e && (e = "\\rangle"), a.contains(f, e) || a.contains(v, e)) return p(e, t, !1, n, r);
                    if (a.contains(b, e)) return g(e, C[t], !1, n, r);
                    throw new i("Illegal delimiter: '" + e + "'")
                },
                w = [{
                    type: "small",
                    style: n.SCRIPTSCRIPT
                }, {
                    type: "small",
                    style: n.SCRIPT
                }, {
                    type: "small",
                    style: n.TEXT
                }, {
                    type: "large",
                    size: 1
                }, {
                    type: "large",
                    size: 2
                }, {
                    type: "large",
                    size: 3
                }, {
                    type: "large",
                    size: 4
                }],
                S = [{
                    type: "small",
                    style: n.SCRIPTSCRIPT
                }, {
                    type: "small",
                    style: n.SCRIPT
                }, {
                    type: "small",
                    style: n.TEXT
                }, {
                    type: "stack"
                }],
                _ = [{
                    type: "small",
                    style: n.SCRIPTSCRIPT
                }, {
                    type: "small",
                    style: n.SCRIPT
                }, {
                    type: "small",
                    style: n.TEXT
                }, {
                    type: "large",
                    size: 1
                }, {
                    type: "large",
                    size: 2
                }, {
                    type: "large",
                    size: 3
                }, {
                    type: "large",
                    size: 4
                }, {
                    type: "stack"
                }],
                k = function(e) {
                    return "small" === e.type ? "Main-Regular" : "large" === e.type ? "Size" + e.size + "-Regular" : "stack" === e.type ? "Size4-Regular" : void 0
                },
                E = function(e, t, i, n) {
                    for (var r = Math.min(2, 3 - n.style.size), o = r; o < i.length && "stack" !== i[o].type; o++) {
                        var s = c(e, k(i[o])),
                            a = s.height + s.depth;
                        if ("small" === i[o].type && (a *= i[o].style.sizeMultiplier), a > t) return i[o]
                    }
                    return i[i.length - 1]
                },
                A = function(e, t, i, n, r) {
                    "<" === e ? e = "\\langle" : ">" === e && (e = "\\rangle");
                    var o;
                    o = a.contains(v, e) ? w : a.contains(f, e) ? _ : S;
                    var s = E(e, t, o, n);
                    return "small" === s.type ? u(e, s.style, i, n, r) : "large" === s.type ? p(e, s.size, i, n, r) : "stack" === s.type ? g(e, t, i, n, r) : void 0
                },
                x = function(e, t, i, n, r) {
                    var s = o.metrics.axisHeight * n.style.sizeMultiplier,
                        a = 901,
                        l = 5 / o.metrics.ptPerEm,
                        c = Math.max(t - s, i + s),
                        d = Math.max(c / 500 * a, 2 * c - l);
                    return A(e, d, !0, n, r)
                };
            t.exports = {
                sizedDelim: y,
                customSizedDelim: A,
                leftRightDelim: x
            }
        }, {
            "./ParseError": 5,
            "./Style": 8,
            "./buildCommon": 9,
            "./fontMetrics": 16,
            "./symbols": 22,
            "./utils": 23
        }],
        14: [function(e, t) {
            function i(e, t, i, n, r, o) {
                this.classes = e || [], this.children = t || [], this.height = i || 0, this.depth = n || 0, this.maxFontSize = r || 0, this.style = o || {}, this.attributes = {}
            }

            function n(e, t, i, n) {
                this.children = e || [], this.height = t || 0, this.depth = i || 0, this.maxFontSize = n || 0
            }

            function r(e, t, i, n, r, o, s) {
                this.value = e || "", this.height = t || 0, this.depth = i || 0, this.italic = n || 0, this.skew = r || 0, this.classes = o || [], this.style = s || {}, this.maxFontSize = 0
            }
            var o = e("./utils"),
                s = function(e) {
                    e = e.slice();
                    for (var t = e.length - 1; t >= 0; t--) e[t] || e.splice(t, 1);
                    return e.join(" ")
                };
            i.prototype.setAttribute = function(e, t) {
                this.attributes[e] = t
            }, i.prototype.toNode = function() {
                var e = document.createElement("span");
                e.className = s(this.classes);
                for (var t in this.style) Object.prototype.hasOwnProperty.call(this.style, t) && (e.style[t] = this.style[t]);
                for (var i in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, i) && e.setAttribute(i, this.attributes[i]);
                for (var n = 0; n < this.children.length; n++) e.appendChild(this.children[n].toNode());
                return e
            }, i.prototype.toMarkup = function() {
                var e = "<span";
                this.classes.length && (e += ' class="', e += o.escape(s(this.classes)), e += '"');
                var t = "";
                for (var i in this.style) this.style.hasOwnProperty(i) && (t += o.hyphenate(i) + ":" + this.style[i] + ";");
                t && (e += ' style="' + o.escape(t) + '"');
                for (var n in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, n) && (e += " " + n + '="', e += o.escape(this.attributes[n]), e += '"');
                e += ">";
                for (var r = 0; r < this.children.length; r++) e += this.children[r].toMarkup();
                return e += "</span>"
            }, n.prototype.toNode = function() {
                for (var e = document.createDocumentFragment(), t = 0; t < this.children.length; t++) e.appendChild(this.children[t].toNode());
                return e
            }, n.prototype.toMarkup = function() {
                for (var e = "", t = 0; t < this.children.length; t++) e += this.children[t].toMarkup();
                return e
            }, r.prototype.toNode = function() {
                var e = document.createTextNode(this.value),
                    t = null;
                this.italic > 0 && (t = document.createElement("span"), t.style.marginRight = this.italic + "em"), this.classes.length > 0 && (t = t || document.createElement("span"), t.className = s(this.classes));
                for (var i in this.style) this.style.hasOwnProperty(i) && (t = t || document.createElement("span"), t.style[i] = this.style[i]);
                return t ? (t.appendChild(e), t) : e
            }, r.prototype.toMarkup = function() {
                var e = !1,
                    t = "<span";
                this.classes.length && (e = !0, t += ' class="', t += o.escape(s(this.classes)), t += '"');
                var i = "";
                this.italic > 0 && (i += "margin-right:" + this.italic + "em;");
                for (var n in this.style) this.style.hasOwnProperty(n) && (i += o.hyphenate(n) + ":" + this.style[n] + ";");
                i && (e = !0, t += ' style="' + o.escape(i) + '"');
                var r = o.escape(this.value);
                return e ? (t += ">", t += r, t += "</span>") : r
            }, t.exports = {
                span: i,
                documentFragment: n,
                symbolNode: r
            }
        }, {
            "./utils": 23
        }],
        15: [function(e, t) {
            function i(e, t, i, n) {
                for (var r = [], l = [r], c = [];;) {
                    var d = e.parseExpression(t, i, !1, null);
                    r.push(new s("ordgroup", d.result, i)), t = d.position;
                    var h = d.peek.text;
                    if ("&" === h) t = d.peek.position;
                    else {
                        if ("\\end" === h) break;
                        if ("\\\\" !== h && "\\cr" !== h) throw new o("Expected & or \\\\ or \\end", e.lexer, d.peek.position);
                        var u = e.parseFunction(t, i);
                        c.push(u.result.value.size), t = u.position, r = [], l.push(r)
                    }
                }
                return n.body = l, n.rowGaps = c, new a(new s(n.type, n, i), t)
            }
            var n = e("./fontMetrics"),
                r = e("./parseData"),
                o = e("./ParseError"),
                s = r.ParseNode,
                a = r.ParseResult,
                l = [{
                    names: ["array"],
                    numArgs: 1,
                    handler: function(e, t, n, r, s) {
                        var a = this;
                        r = r.value.map ? r.value : [r];
                        var l = r.map(function(e) {
                                var t = e.value;
                                if (-1 !== "lcr".indexOf(t)) return {
                                    type: "align",
                                    align: t
                                };
                                if ("|" === t) return {
                                    type: "separator",
                                    separator: "|"
                                };
                                throw new o("Unknown column alignment: " + e.value, a.lexer, s[1])
                            }),
                            c = {
                                type: "array",
                                cols: l,
                                hskipBeforeAndAfter: !0
                            };
                        return c = i(a, e, t, c)
                    }
                }, {
                    names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix"],
                    handler: function(e, t, n) {
                        var r = {
                                matrix: null,
                                pmatrix: ["(", ")"],
                                bmatrix: ["[", "]"],
                                Bmatrix: ["\\{", "\\}"],
                                vmatrix: ["|", "|"],
                                Vmatrix: ["\\Vert", "\\Vert"]
                            }[n],
                            o = {
                                type: "array",
                                hskipBeforeAndAfter: !1
                            };
                        return o = i(this, e, t, o), r && (o.result = new s("leftright", {
                            body: [o.result],
                            left: r[0],
                            right: r[1]
                        }, t)), o
                    }
                }, {
                    names: ["cases"],
                    handler: function(e, t) {
                        var r = {
                            type: "array",
                            arraystretch: 1.2,
                            cols: [{
                                type: "align",
                                align: "l",
                                pregap: 0,
                                postgap: n.metrics.quad
                            }, {
                                type: "align",
                                align: "l",
                                pregap: 0,
                                postgap: 0
                            }]
                        };
                        return r = i(this, e, t, r), r.result = new s("leftright", {
                            body: [r.result],
                            left: "\\{",
                            right: "."
                        }, t), r
                    }
                }];
            t.exports = function() {
                for (var e = {}, t = 0; t < l.length; ++t) {
                    var i = l[t];
                    i.greediness = 1, i.allowedInText = !!i.allowedInText, i.numArgs = i.numArgs || 0, i.numOptionalArgs = i.numOptionalArgs || 0;
                    for (var n = 0; n < i.names.length; ++n) e[i.names[n]] = i
                }
                return e
            }()
        }, {
            "./ParseError": 5,
            "./fontMetrics": 16,
            "./parseData": 20
        }],
        16: [function(e, t) {
            var i = e("./Style"),
                n = .431,
                r = 1,
                o = .677,
                s = .394,
                a = .444,
                l = .686,
                c = .345,
                d = .413,
                h = .363,
                u = .289,
                p = .15,
                m = .247,
                g = .386,
                f = .05,
                b = 2.39,
                v = 1.01,
                C = .81,
                y = .71,
                w = .25,
                S = .04,
                _ = .111,
                k = .166,
                E = .2,
                A = .6,
                x = .1,
                I = 10,
                D = 2 / I,
                L = {
                    xHeight: n,
                    quad: r,
                    num1: o,
                    num2: s,
                    num3: a,
                    denom1: l,
                    denom2: c,
                    sup1: d,
                    sup2: h,
                    sup3: u,
                    sub1: p,
                    sub2: m,
                    supDrop: g,
                    subDrop: f,
                    axisHeight: w,
                    defaultRuleThickness: S,
                    bigOpSpacing1: _,
                    bigOpSpacing2: k,
                    bigOpSpacing3: E,
                    bigOpSpacing4: A,
                    bigOpSpacing5: x,
                    ptPerEm: I,
                    emPerEx: n / r,
                    doubleRuleSep: D,
                    delim1: b,
                    getDelim2: function(e) {
                        if (e.size === i.TEXT.size) return v;
                        if (e.size === i.SCRIPT.size) return C;
                        if (e.size === i.SCRIPTSCRIPT.size) return y;
                        throw new Error("Unexpected style size: " + e.size)
                    }
                },
                T = e("./fontMetricsData"),
                F = function(e, t) {
                    return T[t][e.charCodeAt(0)]
                };
            t.exports = {
                metrics: L,
                getCharacterMetrics: F
            }
        }, {
            "./Style": 8,
            "./fontMetricsData": 17
        }],
        17: [function(e, t) {
            t.exports = {
                "AMS-Regular": {
                    65: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: .16667,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: .16667,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .16667,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    165: {
                        depth: 0,
                        height: .675,
                        italic: .025,
                        skew: 0
                    },
                    174: {
                        depth: .15559,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    240: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    295: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    989: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    1008: {
                        depth: 0,
                        height: .43056,
                        italic: .04028,
                        skew: 0
                    },
                    8245: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8487: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8498: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8502: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8503: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8504: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8513: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8592: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8594: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8602: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8603: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8606: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8608: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8610: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8611: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8619: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8620: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8621: {
                        depth: -.13313,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    8622: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8624: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8625: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8630: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8631: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8634: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8635: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8638: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8639: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8642: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8643: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8644: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8646: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8647: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8648: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8649: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8650: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8651: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8652: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8653: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8654: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8655: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8666: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8667: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8669: {
                        depth: -.13313,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    8672: {
                        depth: -.064,
                        height: .437,
                        italic: 0,
                        skew: 0
                    },
                    8674: {
                        depth: -.064,
                        height: .437,
                        italic: 0,
                        skew: 0
                    },
                    8705: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    8708: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8709: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8717: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8722: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8724: {
                        depth: .08198,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8726: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8733: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8736: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8737: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8738: {
                        depth: .03517,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8740: {
                        depth: .25142,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8742: {
                        depth: .25142,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8756: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8757: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8764: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8765: {
                        depth: -.13313,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    8769: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8770: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8774: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8776: {
                        depth: -.01688,
                        height: .48312,
                        italic: 0,
                        skew: 0
                    },
                    8778: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8782: {
                        depth: .06062,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8783: {
                        depth: .06062,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8785: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8786: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8787: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8790: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8791: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8796: {
                        depth: .08198,
                        height: .91667,
                        italic: 0,
                        skew: 0
                    },
                    8806: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    8807: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    8808: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    8809: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    8812: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    8814: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8815: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8816: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8817: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8818: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8819: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8822: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8823: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8828: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8829: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8830: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8831: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8832: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8833: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8840: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8841: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8842: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8843: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8847: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8848: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8858: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8859: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8861: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8862: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8863: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8864: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8865: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8872: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8873: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8874: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8876: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8877: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8878: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8879: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8882: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8883: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8884: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8885: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8888: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8890: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8891: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8892: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8901: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8903: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8905: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8906: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8907: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8908: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8909: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8910: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8911: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8912: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8913: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8914: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8915: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8916: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8918: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8919: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8920: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8921: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8922: {
                        depth: .38569,
                        height: .88569,
                        italic: 0,
                        skew: 0
                    },
                    8923: {
                        depth: .38569,
                        height: .88569,
                        italic: 0,
                        skew: 0
                    },
                    8926: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8927: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8928: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8929: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8934: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8935: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8936: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8937: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8938: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8939: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8940: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8941: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8994: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8995: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9416: {
                        depth: .15559,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9484: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9488: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9492: {
                        depth: 0,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    9496: {
                        depth: 0,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    9585: {
                        depth: .19444,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    9586: {
                        depth: .19444,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    9632: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    9633: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    9650: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9651: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9654: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9660: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9661: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9664: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9674: {
                        depth: .11111,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9733: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10003: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10016: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10731: {
                        depth: .11111,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10846: {
                        depth: .19444,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10877: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10878: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10885: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10886: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10887: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    10888: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    10889: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10890: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10891: {
                        depth: .48256,
                        height: .98256,
                        italic: 0,
                        skew: 0
                    },
                    10892: {
                        depth: .48256,
                        height: .98256,
                        italic: 0,
                        skew: 0
                    },
                    10901: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10902: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10933: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10934: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10935: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10936: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10937: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10938: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10949: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10950: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10955: {
                        depth: .28481,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    10956: {
                        depth: .28481,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    57350: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    57351: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    57352: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    57353: {
                        depth: 0,
                        height: .43056,
                        italic: .04028,
                        skew: 0
                    },
                    57356: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57357: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57358: {
                        depth: .41951,
                        height: .91951,
                        italic: 0,
                        skew: 0
                    },
                    57359: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    57360: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    57361: {
                        depth: .41951,
                        height: .91951,
                        italic: 0,
                        skew: 0
                    },
                    57366: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57367: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57368: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57369: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57370: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    57371: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    }
                },
                "Caligraphic-Regular": {
                    48: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .19445
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .03041,
                        skew: .13889
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .05834,
                        skew: .13889
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .08944,
                        skew: .11111
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .09931,
                        skew: .11111
                    },
                    71: {
                        depth: .09722,
                        height: .68333,
                        italic: .0593,
                        skew: .11111
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .00965,
                        skew: .11111
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .07382,
                        skew: 0
                    },
                    74: {
                        depth: .09722,
                        height: .68333,
                        italic: .18472,
                        skew: .16667
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .01445,
                        skew: .05556
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .14736,
                        skew: .08334
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .11111
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .08222,
                        skew: .08334
                    },
                    81: {
                        depth: .09722,
                        height: .68333,
                        italic: 0,
                        skew: .11111
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .075,
                        skew: .13889
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .25417,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .09931,
                        skew: .08334
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .08222,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .08222,
                        skew: .08334
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .14643,
                        skew: .13889
                    },
                    89: {
                        depth: .09722,
                        height: .68333,
                        italic: .08222,
                        skew: .08334
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .07944,
                        skew: .13889
                    }
                },
                "Fraktur-Regular": {
                    33: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .08319,
                        height: .58283,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: 0,
                        height: .10803,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: .08319,
                        height: .58283,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .10803,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .12604,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.13099,
                        height: .36866,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: .12604,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: .06302,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: .12604,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .03781,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    90: {
                        depth: .12604,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    103: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    104: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .18906,
                        height: .52396,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .52396,
                        italic: 0,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .52396,
                        italic: 0,
                        skew: 0
                    },
                    120: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    122: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    58112: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    58113: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    58114: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    58115: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    58116: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    58117: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    58118: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    58119: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    }
                },
                "Main-Bold": {
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .19444,
                        height: .15556,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .15556,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    60: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    62: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68611,
                        italic: .01597,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68611,
                        italic: .01597,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68611,
                        italic: .02875,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .31,
                        height: .13444,
                        italic: .03194,
                        skew: 0
                    },
                    96: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .69444,
                        italic: .10903,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .63492,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    124: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .34444,
                        italic: 0,
                        skew: 0
                    },
                    168: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    172: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    175: {
                        depth: 0,
                        height: .59611,
                        italic: 0,
                        skew: 0
                    },
                    176: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    177: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    180: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    215: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    247: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    711: {
                        depth: 0,
                        height: .63194,
                        italic: 0,
                        skew: 0
                    },
                    713: {
                        depth: 0,
                        height: .59611,
                        italic: 0,
                        skew: 0
                    },
                    714: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    715: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    728: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    729: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    730: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .59611,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .63194,
                        italic: 0,
                        skew: 0
                    },
                    824: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8224: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8225: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8242: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8407: {
                        depth: 0,
                        height: .72444,
                        italic: .15486,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8465: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8467: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8472: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    8476: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8501: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8592: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8593: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8594: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8595: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8596: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8597: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8598: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8599: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8600: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8601: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8636: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8637: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8640: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8641: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8656: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8657: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8658: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8659: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8660: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8661: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8704: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8706: {
                        depth: 0,
                        height: .69444,
                        italic: .06389,
                        skew: 0
                    },
                    8707: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8709: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8711: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    8712: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8715: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8722: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8723: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8725: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8726: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8727: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    8728: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8729: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .18,
                        height: .82,
                        italic: 0,
                        skew: 0
                    },
                    8733: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    8734: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    8736: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8743: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8744: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8745: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8746: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .19444,
                        height: .69444,
                        italic: .12778,
                        skew: 0
                    },
                    8764: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8768: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8771: {
                        depth: .00222,
                        height: .50222,
                        italic: 0,
                        skew: 0
                    },
                    8776: {
                        depth: .02444,
                        height: .52444,
                        italic: 0,
                        skew: 0
                    },
                    8781: {
                        depth: .00222,
                        height: .50222,
                        italic: 0,
                        skew: 0
                    },
                    8801: {
                        depth: .00222,
                        height: .50222,
                        italic: 0,
                        skew: 0
                    },
                    8804: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8805: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8810: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8811: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8826: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8827: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8834: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8835: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8838: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8839: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8846: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8849: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8850: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8851: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8852: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8853: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8854: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8855: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8856: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8857: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8866: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8867: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8868: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8869: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8900: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8901: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8902: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8994: {
                        depth: -.13889,
                        height: .36111,
                        italic: 0,
                        skew: 0
                    },
                    8995: {
                        depth: -.13889,
                        height: .36111,
                        italic: 0,
                        skew: 0
                    },
                    9651: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9657: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    9661: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9667: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    9711: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9824: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9825: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9826: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9827: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9837: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    9838: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9839: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10815: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    10927: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    10928: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    }
                },
                "Main-Italic": {
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: .06961,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: .06616,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: .13639,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: .09694,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: .16194,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: .03694,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: .14917,
                        skew: 0
                    },
                    43: {
                        depth: .05667,
                        height: .56167,
                        italic: .03694,
                        skew: 0
                    },
                    44: {
                        depth: .19444,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .43056,
                        italic: .02826,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: .16194,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    52: {
                        depth: .19444,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    55: {
                        depth: .19444,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .43056,
                        italic: .0582,
                        skew: 0
                    },
                    59: {
                        depth: .19444,
                        height: .43056,
                        italic: .0582,
                        skew: 0
                    },
                    61: {
                        depth: -.13313,
                        height: .36687,
                        italic: .06616,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: .1225,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: .09597,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .10257,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .14528,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .12028,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .13305,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: .08722,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .15806,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: .14028,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .14528,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .10257,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: .03868,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .11972,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .13305,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .18361,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .18361,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .15806,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .19383,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .14528,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: .1875,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: .10528,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: .06646,
                        skew: 0
                    },
                    95: {
                        depth: .31,
                        height: .12056,
                        italic: .09208,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: .06312,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: .05653,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: .10333,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: .07514,
                        skew: 0
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .21194,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .08847,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: .07671,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .65536,
                        italic: .1019,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .65536,
                        italic: .14467,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .10764,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .10333,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: .06312,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: .06312,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: .08847,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: .10764,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: .08208,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: .09486,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .10764,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .10764,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: .12042,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .08847,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: .12292,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .31786,
                        italic: .11585,
                        skew: 0
                    },
                    163: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    567: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: .09694,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: .06646,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .66786,
                        italic: .11585,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .56167,
                        italic: .10333,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: .10806,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .66786,
                        italic: .11752,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .66786,
                        italic: .10474,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: .1225,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .62847,
                        italic: .08295,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: .13305,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: .15294,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: .12028,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: .11111,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: .05986,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: .11111,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: .10257,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .43056,
                        italic: .09208,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .43056,
                        italic: .09208,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: .1685,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: .06961,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    }
                },
                "Main-Regular": {
                    32: {
                        depth: 0,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .19444,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    60: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    62: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .01389,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .01389,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .025,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .31,
                        height: .12056,
                        italic: .02778,
                        skew: 0
                    },
                    96: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .69444,
                        italic: .07778,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    124: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .31786,
                        italic: 0,
                        skew: 0
                    },
                    160: {
                        depth: 0,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    168: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    172: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    175: {
                        depth: 0,
                        height: .56778,
                        italic: 0,
                        skew: 0
                    },
                    176: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    177: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    180: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    215: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    247: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    711: {
                        depth: 0,
                        height: .62847,
                        italic: 0,
                        skew: 0
                    },
                    713: {
                        depth: 0,
                        height: .56778,
                        italic: 0,
                        skew: 0
                    },
                    714: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    715: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    728: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    729: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    730: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .56778,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .62847,
                        italic: 0,
                        skew: 0
                    },
                    824: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8224: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8225: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8230: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    8242: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8407: {
                        depth: 0,
                        height: .71444,
                        italic: .15382,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8465: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8467: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .11111
                    },
                    8472: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .11111
                    },
                    8476: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8501: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8592: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8593: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8594: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8595: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8596: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8597: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8598: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8599: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8600: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8601: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8614: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    8617: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    8618: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    8636: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8637: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8640: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8641: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8652: {
                        depth: .011,
                        height: .671,
                        italic: 0,
                        skew: 0
                    },
                    8656: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8657: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8658: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8659: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8660: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8661: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8704: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8706: {
                        depth: 0,
                        height: .69444,
                        italic: .05556,
                        skew: .08334
                    },
                    8707: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8709: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8711: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    8712: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8715: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8722: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8723: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8725: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8726: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8727: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    8728: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8729: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .2,
                        height: .8,
                        italic: 0,
                        skew: 0
                    },
                    8733: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8734: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8736: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8743: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8744: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8745: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8746: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .19444,
                        height: .69444,
                        italic: .11111,
                        skew: 0
                    },
                    8764: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8768: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8771: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8773: {
                        depth: -.022,
                        height: .589,
                        italic: 0,
                        skew: 0
                    },
                    8776: {
                        depth: -.01688,
                        height: .48312,
                        italic: 0,
                        skew: 0
                    },
                    8781: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8784: {
                        depth: -.133,
                        height: .67,
                        italic: 0,
                        skew: 0
                    },
                    8800: {
                        depth: .215,
                        height: .716,
                        italic: 0,
                        skew: 0
                    },
                    8801: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8804: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8805: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8810: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8811: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8826: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8827: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8834: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8835: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8838: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8839: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8846: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8849: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8850: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8851: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8852: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8853: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8854: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8855: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8856: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8857: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8866: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8867: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8868: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8869: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8872: {
                        depth: .249,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8900: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8901: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8902: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    8904: {
                        depth: .005,
                        height: .505,
                        italic: 0,
                        skew: 0
                    },
                    8942: {
                        depth: .03,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    8943: {
                        depth: -.19,
                        height: .31,
                        italic: 0,
                        skew: 0
                    },
                    8945: {
                        depth: -.1,
                        height: .82,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8994: {
                        depth: -.14236,
                        height: .35764,
                        italic: 0,
                        skew: 0
                    },
                    8995: {
                        depth: -.14236,
                        height: .35764,
                        italic: 0,
                        skew: 0
                    },
                    9136: {
                        depth: .244,
                        height: .744,
                        italic: 0,
                        skew: 0
                    },
                    9137: {
                        depth: .244,
                        height: .744,
                        italic: 0,
                        skew: 0
                    },
                    9651: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9657: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    9661: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9667: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    9711: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9824: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9825: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9826: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9827: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9837: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    9838: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9839: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10222: {
                        depth: .244,
                        height: .744,
                        italic: 0,
                        skew: 0
                    },
                    10223: {
                        depth: .244,
                        height: .744,
                        italic: 0,
                        skew: 0
                    },
                    10229: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    10230: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    10231: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    10232: {
                        depth: .024,
                        height: .525,
                        italic: 0,
                        skew: 0
                    },
                    10233: {
                        depth: .024,
                        height: .525,
                        italic: 0,
                        skew: 0
                    },
                    10234: {
                        depth: .024,
                        height: .525,
                        italic: 0,
                        skew: 0
                    },
                    10236: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    10815: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    10927: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    10928: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    }
                },
                "Math-BoldItalic": {
                    47: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68611,
                        italic: .04835,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68611,
                        italic: .06979,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68611,
                        italic: .03194,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68611,
                        italic: .05451,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68611,
                        italic: .08229,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68611,
                        italic: .07778,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68611,
                        italic: .10069,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68611,
                        italic: .06979,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68611,
                        italic: .11424,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68611,
                        italic: .11424,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68611,
                        italic: .03194,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68611,
                        italic: .00421,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68611,
                        italic: .05382,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68611,
                        italic: .11424,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68611,
                        italic: .25555,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68611,
                        italic: .07778,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68611,
                        italic: .25555,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68611,
                        italic: .06979,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .11042,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .69326,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .69326,
                        italic: .0622,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .01852,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .0088,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .63492,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .44444,
                        italic: .02778,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .44444,
                        italic: .04213,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68611,
                        italic: .03194,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68611,
                        italic: .07458,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68611,
                        italic: .08229,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68611,
                        italic: .05451,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68611,
                        italic: .11653,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68611,
                        italic: .04835,
                        skew: 0
                    },
                    945: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    946: {
                        depth: .19444,
                        height: .69444,
                        italic: .03403,
                        skew: 0
                    },
                    947: {
                        depth: .19444,
                        height: .44444,
                        italic: .06389,
                        skew: 0
                    },
                    948: {
                        depth: 0,
                        height: .69444,
                        italic: .03819,
                        skew: 0
                    },
                    949: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    950: {
                        depth: .19444,
                        height: .69444,
                        italic: .06215,
                        skew: 0
                    },
                    951: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    952: {
                        depth: 0,
                        height: .69444,
                        italic: .03194,
                        skew: 0
                    },
                    953: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    954: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    955: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    956: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    957: {
                        depth: 0,
                        height: .44444,
                        italic: .06898,
                        skew: 0
                    },
                    958: {
                        depth: .19444,
                        height: .69444,
                        italic: .03021,
                        skew: 0
                    },
                    959: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    960: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    961: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    962: {
                        depth: .09722,
                        height: .44444,
                        italic: .07917,
                        skew: 0
                    },
                    963: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    964: {
                        depth: 0,
                        height: .44444,
                        italic: .13472,
                        skew: 0
                    },
                    965: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    966: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    967: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    968: {
                        depth: .19444,
                        height: .69444,
                        italic: .03704,
                        skew: 0
                    },
                    969: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    977: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    981: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    982: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    1009: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    1013: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    }
                },
                "Math-Italic": {
                    47: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .05556
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .11111
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: .09618,
                        skew: .16667
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .05556
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .02778
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: .00773,
                        skew: .08334
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .02778
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .08334
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .16667
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .10764,
                        skew: .16667
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .65952,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .65952,
                        italic: .05724,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .03148,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .01968,
                        skew: .08334
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .08334
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: .05556
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: 0,
                        skew: .08334
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .02691,
                        skew: .08334
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: .04398,
                        skew: .05556
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: .07569,
                        skew: .08334
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .05556
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: .11,
                        skew: .05556
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    945: {
                        depth: 0,
                        height: .43056,
                        italic: .0037,
                        skew: .02778
                    },
                    946: {
                        depth: .19444,
                        height: .69444,
                        italic: .05278,
                        skew: .08334
                    },
                    947: {
                        depth: .19444,
                        height: .43056,
                        italic: .05556,
                        skew: 0
                    },
                    948: {
                        depth: 0,
                        height: .69444,
                        italic: .03785,
                        skew: .05556
                    },
                    949: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    950: {
                        depth: .19444,
                        height: .69444,
                        italic: .07378,
                        skew: .08334
                    },
                    951: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    952: {
                        depth: 0,
                        height: .69444,
                        italic: .02778,
                        skew: .08334
                    },
                    953: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    954: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    955: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    956: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    957: {
                        depth: 0,
                        height: .43056,
                        italic: .06366,
                        skew: .02778
                    },
                    958: {
                        depth: .19444,
                        height: .69444,
                        italic: .04601,
                        skew: .11111
                    },
                    959: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    960: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    961: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    962: {
                        depth: .09722,
                        height: .43056,
                        italic: .07986,
                        skew: .08334
                    },
                    963: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    964: {
                        depth: 0,
                        height: .43056,
                        italic: .1132,
                        skew: .02778
                    },
                    965: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    966: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    967: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    968: {
                        depth: .19444,
                        height: .69444,
                        italic: .03588,
                        skew: .11111
                    },
                    969: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    977: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    981: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    982: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    1009: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    1013: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    }
                },
                "Math-Regular": {
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .05556
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .11111
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: .09618,
                        skew: .16667
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .05556
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .02778
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: .00773,
                        skew: .08334
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .02778
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .08334
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .16667
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .10764,
                        skew: .16667
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .65952,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .65952,
                        italic: .05724,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .03148,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .01968,
                        skew: .08334
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .08334
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: .05556
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: 0,
                        skew: .08334
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .02691,
                        skew: .08334
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: .04398,
                        skew: .05556
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: .07569,
                        skew: .08334
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .05556
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: .11,
                        skew: .05556
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    945: {
                        depth: 0,
                        height: .43056,
                        italic: .0037,
                        skew: .02778
                    },
                    946: {
                        depth: .19444,
                        height: .69444,
                        italic: .05278,
                        skew: .08334
                    },
                    947: {
                        depth: .19444,
                        height: .43056,
                        italic: .05556,
                        skew: 0
                    },
                    948: {
                        depth: 0,
                        height: .69444,
                        italic: .03785,
                        skew: .05556
                    },
                    949: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    950: {
                        depth: .19444,
                        height: .69444,
                        italic: .07378,
                        skew: .08334
                    },
                    951: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    952: {
                        depth: 0,
                        height: .69444,
                        italic: .02778,
                        skew: .08334
                    },
                    953: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    954: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    955: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    956: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    957: {
                        depth: 0,
                        height: .43056,
                        italic: .06366,
                        skew: .02778
                    },
                    958: {
                        depth: .19444,
                        height: .69444,
                        italic: .04601,
                        skew: .11111
                    },
                    959: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    960: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    961: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    962: {
                        depth: .09722,
                        height: .43056,
                        italic: .07986,
                        skew: .08334
                    },
                    963: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    964: {
                        depth: 0,
                        height: .43056,
                        italic: .1132,
                        skew: .02778
                    },
                    965: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    966: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    967: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    968: {
                        depth: .19444,
                        height: .69444,
                        italic: .03588,
                        skew: .11111
                    },
                    969: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    977: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    981: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    982: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    1009: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    1013: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    }
                },
                "SansSerif-Regular": {
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .125,
                        height: .08333,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .08333,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .125,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.13,
                        height: .37,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .125,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .69444,
                        italic: .01389,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .69444,
                        italic: .01389,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .69444,
                        italic: .025,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .35,
                        height: .09444,
                        italic: .02778,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .69444,
                        italic: .06944,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .67937,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .67937,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .57143,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .32659,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .67659,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .60889,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .67937,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .67937,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .63194,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .44444,
                        italic: .02778,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .44444,
                        italic: .02778,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    }
                },
                "Script-Regular": {
                    65: {
                        depth: 0,
                        height: .7,
                        italic: .22925,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .7,
                        italic: .04087,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .7,
                        italic: .1689,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .7,
                        italic: .09371,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .7,
                        italic: .18583,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .7,
                        italic: .13634,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .7,
                        italic: .17322,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .7,
                        italic: .29694,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .7,
                        italic: .19189,
                        skew: 0
                    },
                    74: {
                        depth: .27778,
                        height: .7,
                        italic: .19189,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .7,
                        italic: .31259,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .7,
                        italic: .19189,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .7,
                        italic: .15981,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .7,
                        italic: .3525,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .7,
                        italic: .08078,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .7,
                        italic: .08078,
                        skew: 0
                    },
                    81: {
                        depth: 0,
                        height: .7,
                        italic: .03305,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .7,
                        italic: .06259,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .7,
                        italic: .19189,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .7,
                        italic: .29087,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .7,
                        italic: .25815,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .7,
                        italic: .27523,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .7,
                        italic: .27523,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .7,
                        italic: .26006,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .7,
                        italic: .2939,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .7,
                        italic: .24037,
                        skew: 0
                    }
                },
                "Size1-Regular": {
                    40: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    8214: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    8593: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8595: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8657: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8659: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8719: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8720: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8721: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: -.00599,
                        height: .606,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: -.00599,
                        height: .606,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .30612,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8748: {
                        depth: .306,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8749: {
                        depth: .306,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8750: {
                        depth: .30612,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8896: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8897: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8898: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8899: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    9168: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    10752: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10753: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10754: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10756: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10758: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    }
                },
                "Size2-Regular": {
                    40: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8719: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8720: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8721: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .86225,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8748: {
                        depth: .862,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8749: {
                        depth: .862,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8750: {
                        depth: .86225,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8896: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8897: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8898: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8899: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    10752: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10753: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10754: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10756: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10758: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    }
                },
                "Size3-Regular": {
                    40: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    }
                },
                "Size4-Regular": {
                    40: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    9115: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9116: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    9117: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9118: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9119: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    9120: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9121: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9122: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    9123: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9124: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9125: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    9126: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9127: {
                        depth: 1e-5,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    9128: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    9129: {
                        depth: .90001,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    9130: {
                        depth: 0,
                        height: .3,
                        italic: 0,
                        skew: 0
                    },
                    9131: {
                        depth: 1e-5,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    9132: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    9133: {
                        depth: .90001,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    9143: {
                        depth: .88502,
                        height: .915,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    57344: {
                        depth: -.00499,
                        height: .605,
                        italic: 0,
                        skew: 0
                    },
                    57345: {
                        depth: -.00499,
                        height: .605,
                        italic: 0,
                        skew: 0
                    },
                    57680: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    57681: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    57682: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    57683: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    }
                },
                "Typewriter-Regular": {
                    33: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .52083,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: -.08056,
                        height: .53055,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .13889,
                        height: .125,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: -.08056,
                        height: .53055,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .125,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .13889,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    60: {
                        depth: -.05556,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.19549,
                        height: .41562,
                        italic: 0,
                        skew: 0
                    },
                    62: {
                        depth: -.05556,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .13889,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .09514,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    96: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    103: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .22222,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .55358,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    124: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    127: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .56555,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .56597,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    2018: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    2019: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    8242: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    }
                }
            }
        }, {}],
        18: [function(e, t) {
            for (var i = e("./utils"), n = e("./ParseError"), r = {
                "\\sqrt": {
                    numArgs: 1,
                    numOptionalArgs: 1,
                    handler: function(e, t, i) {
                        return {
                            type: "sqrt",
                            body: i,
                            index: t
                        }
                    }
                },
                "\\text": {
                    numArgs: 1,
                    argTypes: ["text"],
                    greediness: 2,
                    handler: function(e, t) {
                        var i;
                        return i = "ordgroup" === t.type ? t.value : [t], {
                            type: "text",
                            body: i
                        }
                    }
                },
                "\\color": {
                    numArgs: 2,
                    allowedInText: !0,
                    greediness: 3,
                    argTypes: ["color", "original"],
                    handler: function(e, t, i) {
                        var n;
                        return n = "ordgroup" === i.type ? i.value : [i], {
                            type: "color",
                            color: t.value,
                            value: n
                        }
                    }
                },
                "\\overline": {
                    numArgs: 1,
                    handler: function(e, t) {
                        return {
                            type: "overline",
                            body: t
                        }
                    }
                },
                "\\rule": {
                    numArgs: 2,
                    numOptionalArgs: 1,
                    argTypes: ["size", "size", "size"],
                    handler: function(e, t, i, n) {
                        return {
                            type: "rule",
                            shift: t && t.value,
                            width: i.value,
                            height: n.value
                        }
                    }
                },
                "\\KaTeX": {
                    numArgs: 0,
                    handler: function() {
                        return {
                            type: "katex"
                        }
                    }
                },
                "\\phantom": {
                    numArgs: 1,
                    handler: function(e, t) {
                        var i;
                        return i = "ordgroup" === t.type ? t.value : [t], {
                            type: "phantom",
                            value: i
                        }
                    }
                }
            }, o = {
                "\\bigl": {
                    type: "open",
                    size: 1
                },
                "\\Bigl": {
                    type: "open",
                    size: 2
                },
                "\\biggl": {
                    type: "open",
                    size: 3
                },
                "\\Biggl": {
                    type: "open",
                    size: 4
                },
                "\\bigr": {
                    type: "close",
                    size: 1
                },
                "\\Bigr": {
                    type: "close",
                    size: 2
                },
                "\\biggr": {
                    type: "close",
                    size: 3
                },
                "\\Biggr": {
                    type: "close",
                    size: 4
                },
                "\\bigm": {
                    type: "rel",
                    size: 1
                },
                "\\Bigm": {
                    type: "rel",
                    size: 2
                },
                "\\biggm": {
                    type: "rel",
                    size: 3
                },
                "\\Biggm": {
                    type: "rel",
                    size: 4
                },
                "\\big": {
                    type: "textord",
                    size: 1
                },
                "\\Big": {
                    type: "textord",
                    size: 2
                },
                "\\bigg": {
                    type: "textord",
                    size: 3
                },
                "\\Bigg": {
                    type: "textord",
                    size: 4
                }
            }, s = ["(", ")", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\\lceil", "\\rceil", "<", ">", "\\langle", "\\rangle", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\\lmoustache", "\\rmoustache", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."], a = {
                "\\Bbb": "\\mathbb",
                "\\bold": "\\mathbf",
                "\\frak": "\\mathfrak"
            }, l = ([{
                funcs: ["\\blue", "\\orange", "\\pink", "\\red", "\\green", "\\gray", "\\purple", "\\blueA", "\\blueB", "\\blueC", "\\blueD", "\\blueE", "\\tealA", "\\tealB", "\\tealC", "\\tealD", "\\tealE", "\\greenA", "\\greenB", "\\greenC", "\\greenD", "\\greenE", "\\goldA", "\\goldB", "\\goldC", "\\goldD", "\\goldE", "\\redA", "\\redB", "\\redC", "\\redD", "\\redE", "\\maroonA", "\\maroonB", "\\maroonC", "\\maroonD", "\\maroonE", "\\purpleA", "\\purpleB", "\\purpleC", "\\purpleD", "\\purpleE", "\\mintA", "\\mintB", "\\mintC", "\\grayA", "\\grayB", "\\grayC", "\\grayD", "\\grayE", "\\grayF", "\\grayG", "\\grayH", "\\grayI", "\\kaBlue", "\\kaGreen"],
                data: {
                    numArgs: 1,
                    allowedInText: !0,
                    greediness: 3,
                    handler: function(e, t) {
                        var i;
                        return i = "ordgroup" === t.type ? t.value : [t], {
                            type: "color",
                            color: "katex-" + e.slice(1),
                            value: i
                        }
                    }
                }
            }, {
                funcs: ["\\arcsin", "\\arccos", "\\arctan", "\\arg", "\\cos", "\\cosh", "\\cot", "\\coth", "\\csc", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\tan", "\\tanh"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: !1,
                            symbol: !1,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\det", "\\gcd", "\\inf", "\\lim", "\\liminf", "\\limsup", "\\max", "\\min", "\\Pr", "\\sup"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: !0,
                            symbol: !1,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\int", "\\iint", "\\iiint", "\\oint"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: !1,
                            symbol: !0,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: !0,
                            symbol: !0,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\dfrac", "\\frac", "\\tfrac", "\\dbinom", "\\binom", "\\tbinom"],
                data: {
                    numArgs: 2,
                    greediness: 2,
                    handler: function(e, t, i) {
                        var n, r = null,
                            o = null,
                            s = "auto";
                        switch (e) {
                            case "\\dfrac":
                            case "\\frac":
                            case "\\tfrac":
                                n = !0;
                                break;
                            case "\\dbinom":
                            case "\\binom":
                            case "\\tbinom":
                                n = !1, r = "(", o = ")";
                                break;
                            default:
                                throw new Error("Unrecognized genfrac command")
                        }
                        switch (e) {
                            case "\\dfrac":
                            case "\\dbinom":
                                s = "display";
                                break;
                            case "\\tfrac":
                            case "\\tbinom":
                                s = "text"
                        }
                        return {
                            type: "genfrac",
                            numer: t,
                            denom: i,
                            hasBarLine: n,
                            leftDelim: r,
                            rightDelim: o,
                            size: s
                        }
                    }
                }
            }, {
                funcs: ["\\llap", "\\rlap"],
                data: {
                    numArgs: 1,
                    allowedInText: !0,
                    handler: function(e, t) {
                        return {
                            type: e.slice(1),
                            body: t
                        }
                    }
                }
            }, {
                funcs: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg", "\\left", "\\right"],
                data: {
                    numArgs: 1,
                    handler: function(e, t, r) {
                        if (!i.contains(s, t.value)) throw new n("Invalid delimiter: '" + t.value + "' after '" + e + "'", this.lexer, r[1]);
                        return "\\left" === e || "\\right" === e ? {
                            type: "leftright",
                            value: t.value
                        } : {
                            type: "delimsizing",
                            size: o[e].size,
                            delimType: o[e].type,
                            value: t.value
                        }
                    }
                }
            }, {
                funcs: ["\\tiny", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"],
                data: {
                    numArgs: 0
                }
            }, {
                funcs: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
                data: {
                    numArgs: 0
                }
            }, {
                funcs: ["\\mathrm", "\\mathit", "\\mathbf", "\\mathbb", "\\mathcal", "\\mathfrak", "\\mathscr", "\\mathsf", "\\mathtt", "\\Bbb", "\\bold", "\\frak"],
                data: {
                    numArgs: 1,
                    handler: function(e, t) {
                        return e in a && (e = a[e]), {
                            type: "font",
                            font: e.slice(1),
                            body: t
                        }
                    }
                }
            }, {
                funcs: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot"],
                data: {
                    numArgs: 1,
                    handler: function(e, t) {
                        return {
                            type: "accent",
                            accent: e,
                            base: t
                        }
                    }
                }
            }, {
                funcs: ["\\over", "\\choose"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        var t;
                        switch (e) {
                            case "\\over":
                                t = "\\frac";
                                break;
                            case "\\choose":
                                t = "\\binom";
                                break;
                            default:
                                throw new Error("Unrecognized infix genfrac command")
                        }
                        return {
                            type: "infix",
                            replaceWith: t
                        }
                    }
                }
            }, {
                funcs: ["\\\\", "\\cr"],
                data: {
                    numArgs: 0,
                    numOptionalArgs: 1,
                    argTypes: ["size"],
                    handler: function(e, t) {
                        return {
                            type: "cr",
                            size: t
                        }
                    }
                }
            }, {
                funcs: ["\\begin", "\\end"],
                data: {
                    numArgs: 1,
                    argTypes: ["text"],
                    handler: function(e, t, i) {
                        if ("ordgroup" !== t.type) throw new n("Invalid environment name", this.lexer, i[1]);
                        for (var r = "", o = 0; o < t.value.length; ++o) r += t.value[o].value;
                        return {
                            type: "environment",
                            name: r,
                            namepos: i[1]
                        }
                    }
                }
            }]), c = function(e, t) {
                for (var i = 0; i < e.length; i++) r[e[i]] = t
            }, d = 0; d < l.length; d++) c(l[d].funcs, l[d].data);
            for (var h in r)
                if (r.hasOwnProperty(h)) {
                    var u = r[h];
                    r[h] = {
                        numArgs: u.numArgs,
                        argTypes: u.argTypes,
                        greediness: void 0 === u.greediness ? 1 : u.greediness,
                        allowedInText: u.allowedInText ? u.allowedInText : !1,
                        numOptionalArgs: void 0 === u.numOptionalArgs ? 0 : u.numOptionalArgs,
                        handler: u.handler
                    }
                }
            t.exports = {
                funcs: r
            }
        }, {
            "./ParseError": 5,
            "./utils": 23
        }],
        19: [function(e, t) {
            function i(e, t) {
                this.type = e, this.attributes = {}, this.children = t || []
            }

            function n(e) {
                this.text = e
            }
            var r = e("./utils");
            i.prototype.setAttribute = function(e, t) {
                this.attributes[e] = t
            }, i.prototype.toNode = function() {
                var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
                for (var t in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
                for (var i = 0; i < this.children.length; i++) e.appendChild(this.children[i].toNode());
                return e
            }, i.prototype.toMarkup = function() {
                var e = "<" + this.type;
                for (var t in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + '="', e += r.escape(this.attributes[t]), e += '"');
                e += ">";
                for (var i = 0; i < this.children.length; i++) e += this.children[i].toMarkup();
                return e += "</" + this.type + ">"
            }, n.prototype.toNode = function() {
                return document.createTextNode(this.text)
            }, n.prototype.toMarkup = function() {
                return r.escape(this.text)
            }, t.exports = {
                MathNode: i,
                TextNode: n
            }
        }, {
            "./utils": 23
        }],
        20: [function(e, t) {
            function i(e, t, i) {
                this.type = e, this.value = t, this.mode = i
            }

            function n(e, t) {
                this.result = e, this.position = t
            }
            t.exports = {
                ParseNode: i,
                ParseResult: n
            }
        }, {}],
        21: [function(e, t) {
            var i = e("./Parser"),
                n = function(e, t) {
                    var n = new i(e, t);
                    return n.parse()
                };
            t.exports = n
        }, {
            "./Parser": 6
        }],
        22: [function(e, t) {
            for (var i = {
                math: {
                    "\\equiv": {
                        font: "main",
                        group: "rel",
                        replace: "\u2261"
                    },
                    "\\prec": {
                        font: "main",
                        group: "rel",
                        replace: "\u227a"
                    },
                    "\\succ": {
                        font: "main",
                        group: "rel",
                        replace: "\u227b"
                    },
                    "\\sim": {
                        font: "main",
                        group: "rel",
                        replace: "\u223c"
                    },
                    "\\perp": {
                        font: "main",
                        group: "rel",
                        replace: "\u22a5"
                    },
                    "\\preceq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2aaf"
                    },
                    "\\succeq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2ab0"
                    },
                    "\\simeq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2243"
                    },
                    "\\mid": {
                        font: "main",
                        group: "rel",
                        replace: "\u2223"
                    },
                    "\\ll": {
                        font: "main",
                        group: "rel",
                        replace: "\u226a"
                    },
                    "\\gg": {
                        font: "main",
                        group: "rel",
                        replace: "\u226b"
                    },
                    "\\asymp": {
                        font: "main",
                        group: "rel",
                        replace: "\u224d"
                    },
                    "\\parallel": {
                        font: "main",
                        group: "rel",
                        replace: "\u2225"
                    },
                    "\\bowtie": {
                        font: "main",
                        group: "rel",
                        replace: "\u22c8"
                    },
                    "\\smile": {
                        font: "main",
                        group: "rel",
                        replace: "\u2323"
                    },
                    "\\sqsubseteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2291"
                    },
                    "\\sqsupseteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2292"
                    },
                    "\\doteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2250"
                    },
                    "\\frown": {
                        font: "main",
                        group: "rel",
                        replace: "\u2322"
                    },
                    "\\ni": {
                        font: "main",
                        group: "rel",
                        replace: "\u220b"
                    },
                    "\\propto": {
                        font: "main",
                        group: "rel",
                        replace: "\u221d"
                    },
                    "\\vdash": {
                        font: "main",
                        group: "rel",
                        replace: "\u22a2"
                    },
                    "\\dashv": {
                        font: "main",
                        group: "rel",
                        replace: "\u22a3"
                    },
                    "\\owns": {
                        font: "main",
                        group: "rel",
                        replace: "\u220b"
                    },
                    "\\ldotp": {
                        font: "main",
                        group: "punct",
                        replace: "."
                    },
                    "\\cdotp": {
                        font: "main",
                        group: "punct",
                        replace: "\u22c5"
                    },
                    "\\#": {
                        font: "main",
                        group: "textord",
                        replace: "#"
                    },
                    "\\&": {
                        font: "main",
                        group: "textord",
                        replace: "&"
                    },
                    "\\aleph": {
                        font: "main",
                        group: "textord",
                        replace: "\u2135"
                    },
                    "\\forall": {
                        font: "main",
                        group: "textord",
                        replace: "\u2200"
                    },
                    "\\hbar": {
                        font: "main",
                        group: "textord",
                        replace: "\u210f"
                    },
                    "\\exists": {
                        font: "main",
                        group: "textord",
                        replace: "\u2203"
                    },
                    "\\nabla": {
                        font: "main",
                        group: "textord",
                        replace: "\u2207"
                    },
                    "\\flat": {
                        font: "main",
                        group: "textord",
                        replace: "\u266d"
                    },
                    "\\ell": {
                        font: "main",
                        group: "textord",
                        replace: "\u2113"
                    },
                    "\\natural": {
                        font: "main",
                        group: "textord",
                        replace: "\u266e"
                    },
                    "\\clubsuit": {
                        font: "main",
                        group: "textord",
                        replace: "\u2663"
                    },
                    "\\wp": {
                        font: "main",
                        group: "textord",
                        replace: "\u2118"
                    },
                    "\\sharp": {
                        font: "main",
                        group: "textord",
                        replace: "\u266f"
                    },
                    "\\diamondsuit": {
                        font: "main",
                        group: "textord",
                        replace: "\u2662"
                    },
                    "\\Re": {
                        font: "main",
                        group: "textord",
                        replace: "\u211c"
                    },
                    "\\heartsuit": {
                        font: "main",
                        group: "textord",
                        replace: "\u2661"
                    },
                    "\\Im": {
                        font: "main",
                        group: "textord",
                        replace: "\u2111"
                    },
                    "\\spadesuit": {
                        font: "main",
                        group: "textord",
                        replace: "\u2660"
                    },
                    "\\dag": {
                        font: "main",
                        group: "textord",
                        replace: "\u2020"
                    },
                    "\\ddag": {
                        font: "main",
                        group: "textord",
                        replace: "\u2021"
                    },
                    "\\rmoustache": {
                        font: "main",
                        group: "close",
                        replace: "\u23b1"
                    },
                    "\\lmoustache": {
                        font: "main",
                        group: "open",
                        replace: "\u23b0"
                    },
                    "\\rgroup": {
                        font: "main",
                        group: "close",
                        replace: "\u27ef"
                    },
                    "\\lgroup": {
                        font: "main",
                        group: "open",
                        replace: "\u27ee"
                    },
                    "\\mp": {
                        font: "main",
                        group: "bin",
                        replace: "\u2213"
                    },
                    "\\ominus": {
                        font: "main",
                        group: "bin",
                        replace: "\u2296"
                    },
                    "\\uplus": {
                        font: "main",
                        group: "bin",
                        replace: "\u228e"
                    },
                    "\\sqcap": {
                        font: "main",
                        group: "bin",
                        replace: "\u2293"
                    },
                    "\\ast": {
                        font: "main",
                        group: "bin",
                        replace: "\u2217"
                    },
                    "\\sqcup": {
                        font: "main",
                        group: "bin",
                        replace: "\u2294"
                    },
                    "\\bigcirc": {
                        font: "main",
                        group: "bin",
                        replace: "\u25ef"
                    },
                    "\\bullet": {
                        font: "main",
                        group: "bin",
                        replace: "\u2219"
                    },
                    "\\ddagger": {
                        font: "main",
                        group: "bin",
                        replace: "\u2021"
                    },
                    "\\wr": {
                        font: "main",
                        group: "bin",
                        replace: "\u2240"
                    },
                    "\\amalg": {
                        font: "main",
                        group: "bin",
                        replace: "\u2a3f"
                    },
                    "\\longleftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f5"
                    },
                    "\\Leftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d0"
                    },
                    "\\Longleftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f8"
                    },
                    "\\longrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f6"
                    },
                    "\\Rightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d2"
                    },
                    "\\Longrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f9"
                    },
                    "\\leftrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2194"
                    },
                    "\\longleftrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f7"
                    },
                    "\\Leftrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d4"
                    },
                    "\\Longleftrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27fa"
                    },
                    "\\mapsto": {
                        font: "main",
                        group: "rel",
                        replace: "\u21a6"
                    },
                    "\\longmapsto": {
                        font: "main",
                        group: "rel",
                        replace: "\u27fc"
                    },
                    "\\nearrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2197"
                    },
                    "\\hookleftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21a9"
                    },
                    "\\hookrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21aa"
                    },
                    "\\searrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2198"
                    },
                    "\\leftharpoonup": {
                        font: "main",
                        group: "rel",
                        replace: "\u21bc"
                    },
                    "\\rightharpoonup": {
                        font: "main",
                        group: "rel",
                        replace: "\u21c0"
                    },
                    "\\swarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2199"
                    },
                    "\\leftharpoondown": {
                        font: "main",
                        group: "rel",
                        replace: "\u21bd"
                    },
                    "\\rightharpoondown": {
                        font: "main",
                        group: "rel",
                        replace: "\u21c1"
                    },
                    "\\nwarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2196"
                    },
                    "\\rightleftharpoons": {
                        font: "main",
                        group: "rel",
                        replace: "\u21cc"
                    },
                    "\\nless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u226e"
                    },
                    "\\nleqslant": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue010"
                    },
                    "\\nleqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue011"
                    },
                    "\\lneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a87"
                    },
                    "\\lneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2268"
                    },
                    "\\lvertneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue00c"
                    },
                    "\\lnsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e6"
                    },
                    "\\lnapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a89"
                    },
                    "\\nprec": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2280"
                    },
                    "\\npreceq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e0"
                    },
                    "\\precnsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e8"
                    },
                    "\\precnapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab9"
                    },
                    "\\nsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2241"
                    },
                    "\\nshortmid": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue006"
                    },
                    "\\nmid": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2224"
                    },
                    "\\nvdash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ac"
                    },
                    "\\nvDash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ad"
                    },
                    "\\ntriangleleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ea"
                    },
                    "\\ntrianglelefteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ec"
                    },
                    "\\subsetneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u228a"
                    },
                    "\\varsubsetneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue01a"
                    },
                    "\\subsetneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2acb"
                    },
                    "\\varsubsetneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue017"
                    },
                    "\\ngtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u226f"
                    },
                    "\\ngeqslant": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue00f"
                    },
                    "\\ngeqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue00e"
                    },
                    "\\gneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a88"
                    },
                    "\\gneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2269"
                    },
                    "\\gvertneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue00d"
                    },
                    "\\gnsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e7"
                    },
                    "\\gnapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a8a"
                    },
                    "\\nsucc": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2281"
                    },
                    "\\nsucceq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e1"
                    },
                    "\\succnsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e9"
                    },
                    "\\succnapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2aba"
                    },
                    "\\ncong": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2246"
                    },
                    "\\nshortparallel": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue007"
                    },
                    "\\nparallel": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2226"
                    },
                    "\\nVDash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22af"
                    },
                    "\\ntriangleright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22eb"
                    },
                    "\\ntrianglerighteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ed"
                    },
                    "\\nsupseteqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue018"
                    },
                    "\\supsetneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u228b"
                    },
                    "\\varsupsetneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue01b"
                    },
                    "\\supsetneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2acc"
                    },
                    "\\varsupsetneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue019"
                    },
                    "\\nVdash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ae"
                    },
                    "\\precneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab5"
                    },
                    "\\succneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab6"
                    },
                    "\\nsubseteqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue016"
                    },
                    "\\unlhd": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22b4"
                    },
                    "\\unrhd": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22b5"
                    },
                    "\\nleftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u219a"
                    },
                    "\\nrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u219b"
                    },
                    "\\nLeftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21cd"
                    },
                    "\\nRightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21cf"
                    },
                    "\\nleftrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ae"
                    },
                    "\\nLeftrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ce"
                    },
                    "\\vartriangle": {
                        font: "ams",
                        group: "rel",
                        replace: "\u25b3"
                    },
                    "\\hslash": {
                        font: "ams",
                        group: "textord",
                        replace: "\u210f"
                    },
                    "\\triangledown": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25bd"
                    },
                    "\\lozenge": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25ca"
                    },
                    "\\circledS": {
                        font: "ams",
                        group: "textord",
                        replace: "\u24c8"
                    },
                    "\\circledR": {
                        font: "ams",
                        group: "textord",
                        replace: "\xae"
                    },
                    "\\measuredangle": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2221"
                    },
                    "\\nexists": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2204"
                    },
                    "\\mho": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2127"
                    },
                    "\\Finv": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2132"
                    },
                    "\\Game": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2141"
                    },
                    "\\Bbbk": {
                        font: "ams",
                        group: "textord",
                        replace: "k"
                    },
                    "\\backprime": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2035"
                    },
                    "\\blacktriangle": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25b2"
                    },
                    "\\blacktriangledown": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25bc"
                    },
                    "\\blacksquare": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25a0"
                    },
                    "\\blacklozenge": {
                        font: "ams",
                        group: "textord",
                        replace: "\u29eb"
                    },
                    "\\bigstar": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2605"
                    },
                    "\\sphericalangle": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2222"
                    },
                    "\\complement": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2201"
                    },
                    "\\eth": {
                        font: "ams",
                        group: "textord",
                        replace: "\xf0"
                    },
                    "\\diagup": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2571"
                    },
                    "\\diagdown": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2572"
                    },
                    "\\square": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25a1"
                    },
                    "\\Box": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25a1"
                    },
                    "\\Diamond": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25ca"
                    },
                    "\\yen": {
                        font: "ams",
                        group: "textord",
                        replace: "\xa5"
                    },
                    "\\checkmark": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2713"
                    },
                    "\\beth": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2136"
                    },
                    "\\daleth": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2138"
                    },
                    "\\gimel": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2137"
                    },
                    "\\digamma": {
                        font: "ams",
                        group: "textord",
                        replace: "\u03dd"
                    },
                    "\\varkappa": {
                        font: "ams",
                        group: "textord",
                        replace: "\u03f0"
                    },
                    "\\ulcorner": {
                        font: "ams",
                        group: "open",
                        replace: "\u250c"
                    },
                    "\\urcorner": {
                        font: "ams",
                        group: "close",
                        replace: "\u2510"
                    },
                    "\\llcorner": {
                        font: "ams",
                        group: "open",
                        replace: "\u2514"
                    },
                    "\\lrcorner": {
                        font: "ams",
                        group: "close",
                        replace: "\u2518"
                    },
                    "\\leqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2266"
                    },
                    "\\leqslant": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a7d"
                    },
                    "\\eqslantless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a95"
                    },
                    "\\lesssim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2272"
                    },
                    "\\lessapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a85"
                    },
                    "\\approxeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u224a"
                    },
                    "\\lessdot": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d6"
                    },
                    "\\lll": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d8"
                    },
                    "\\lessgtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2276"
                    },
                    "\\lesseqgtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22da"
                    },
                    "\\lesseqqgtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a8b"
                    },
                    "\\doteqdot": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2251"
                    },
                    "\\risingdotseq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2253"
                    },
                    "\\fallingdotseq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2252"
                    },
                    "\\backsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u223d"
                    },
                    "\\backsimeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22cd"
                    },
                    "\\subseteqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ac5"
                    },
                    "\\Subset": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d0"
                    },
                    "\\sqsubset": {
                        font: "ams",
                        group: "rel",
                        replace: "\u228f"
                    },
                    "\\preccurlyeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u227c"
                    },
                    "\\curlyeqprec": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22de"
                    },
                    "\\precsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u227e"
                    },
                    "\\precapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab7"
                    },
                    "\\vartriangleleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b2"
                    },
                    "\\trianglelefteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b4"
                    },
                    "\\vDash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22a8"
                    },
                    "\\Vvdash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22aa"
                    },
                    "\\smallsmile": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2323"
                    },
                    "\\smallfrown": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2322"
                    },
                    "\\bumpeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u224f"
                    },
                    "\\Bumpeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u224e"
                    },
                    "\\geqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2267"
                    },
                    "\\geqslant": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a7e"
                    },
                    "\\eqslantgtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a96"
                    },
                    "\\gtrsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2273"
                    },
                    "\\gtrapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a86"
                    },
                    "\\gtrdot": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d7"
                    },
                    "\\ggg": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d9"
                    },
                    "\\gtrless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2277"
                    },
                    "\\gtreqless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22db"
                    },
                    "\\gtreqqless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a8c"
                    },
                    "\\eqcirc": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2256"
                    },
                    "\\circeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2257"
                    },
                    "\\triangleq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u225c"
                    },
                    "\\thicksim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u223c"
                    },
                    "\\thickapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2248"
                    },
                    "\\supseteqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ac6"
                    },
                    "\\Supset": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d1"
                    },
                    "\\sqsupset": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2290"
                    },
                    "\\succcurlyeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u227d"
                    },
                    "\\curlyeqsucc": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22df"
                    },
                    "\\succsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u227f"
                    },
                    "\\succapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab8"
                    },
                    "\\vartriangleright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b3"
                    },
                    "\\trianglerighteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b5"
                    },
                    "\\Vdash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22a9"
                    },
                    "\\shortmid": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2223"
                    },
                    "\\shortparallel": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2225"
                    },
                    "\\between": {
                        font: "ams",
                        group: "rel",
                        replace: "\u226c"
                    },
                    "\\pitchfork": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d4"
                    },
                    "\\varpropto": {
                        font: "ams",
                        group: "rel",
                        replace: "\u221d"
                    },
                    "\\blacktriangleleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u25c0"
                    },
                    "\\therefore": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2234"
                    },
                    "\\backepsilon": {
                        font: "ams",
                        group: "rel",
                        replace: "\u220d"
                    },
                    "\\blacktriangleright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u25b6"
                    },
                    "\\because": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2235"
                    },
                    "\\llless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d8"
                    },
                    "\\gggtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d9"
                    },
                    "\\lhd": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22b2"
                    },
                    "\\rhd": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22b3"
                    },
                    "\\eqsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2242"
                    },
                    "\\Join": {
                        font: "main",
                        group: "rel",
                        replace: "\u22c8"
                    },
                    "\\Doteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2251"
                    },
                    "\\dotplus": {
                        font: "ams",
                        group: "bin",
                        replace: "\u2214"
                    },
                    "\\smallsetminus": {
                        font: "ams",
                        group: "bin",
                        replace: "\u2216"
                    },
                    "\\Cap": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d2"
                    },
                    "\\Cup": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d3"
                    },
                    "\\doublebarwedge": {
                        font: "ams",
                        group: "bin",
                        replace: "\u2a5e"
                    },
                    "\\boxminus": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229f"
                    },
                    "\\boxplus": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229e"
                    },
                    "\\divideontimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22c7"
                    },
                    "\\ltimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22c9"
                    },
                    "\\rtimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22ca"
                    },
                    "\\leftthreetimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22cb"
                    },
                    "\\rightthreetimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22cc"
                    },
                    "\\curlywedge": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22cf"
                    },
                    "\\curlyvee": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22ce"
                    },
                    "\\circleddash": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229d"
                    },
                    "\\circledast": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229b"
                    },
                    "\\centerdot": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22c5"
                    },
                    "\\intercal": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22ba"
                    },
                    "\\doublecap": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d2"
                    },
                    "\\doublecup": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d3"
                    },
                    "\\boxtimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22a0"
                    },
                    "\\dashrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21e2"
                    },
                    "\\dashleftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21e0"
                    },
                    "\\leftleftarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c7"
                    },
                    "\\leftrightarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c6"
                    },
                    "\\Lleftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21da"
                    },
                    "\\twoheadleftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u219e"
                    },
                    "\\leftarrowtail": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21a2"
                    },
                    "\\looparrowleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ab"
                    },
                    "\\leftrightharpoons": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21cb"
                    },
                    "\\curvearrowleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21b6"
                    },
                    "\\circlearrowleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ba"
                    },
                    "\\Lsh": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21b0"
                    },
                    "\\upuparrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c8"
                    },
                    "\\upharpoonleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21bf"
                    },
                    "\\downharpoonleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c3"
                    },
                    "\\multimap": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b8"
                    },
                    "\\leftrightsquigarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ad"
                    },
                    "\\rightrightarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c9"
                    },
                    "\\rightleftarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c4"
                    },
                    "\\twoheadrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21a0"
                    },
                    "\\rightarrowtail": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21a3"
                    },
                    "\\looparrowright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ac"
                    },
                    "\\curvearrowright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21b7"
                    },
                    "\\circlearrowright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21bb"
                    },
                    "\\Rsh": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21b1"
                    },
                    "\\downdownarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ca"
                    },
                    "\\upharpoonright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21be"
                    },
                    "\\downharpoonright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c2"
                    },
                    "\\rightsquigarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21dd"
                    },
                    "\\leadsto": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21dd"
                    },
                    "\\Rrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21db"
                    },
                    "\\restriction": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21be"
                    },
                    "`": {
                        font: "main",
                        group: "textord",
                        replace: "\u2018"
                    },
                    "\\$": {
                        font: "main",
                        group: "textord",
                        replace: "$"
                    },
                    "\\%": {
                        font: "main",
                        group: "textord",
                        replace: "%"
                    },
                    "\\_": {
                        font: "main",
                        group: "textord",
                        replace: "_"
                    },
                    "\\angle": {
                        font: "main",
                        group: "textord",
                        replace: "\u2220"
                    },
                    "\\infty": {
                        font: "main",
                        group: "textord",
                        replace: "\u221e"
                    },
                    "\\prime": {
                        font: "main",
                        group: "textord",
                        replace: "\u2032"
                    },
                    "\\triangle": {
                        font: "main",
                        group: "textord",
                        replace: "\u25b3"
                    },
                    "\\Gamma": {
                        font: "main",
                        group: "textord",
                        replace: "\u0393"
                    },
                    "\\Delta": {
                        font: "main",
                        group: "textord",
                        replace: "\u0394"
                    },
                    "\\Theta": {
                        font: "main",
                        group: "textord",
                        replace: "\u0398"
                    },
                    "\\Lambda": {
                        font: "main",
                        group: "textord",
                        replace: "\u039b"
                    },
                    "\\Xi": {
                        font: "main",
                        group: "textord",
                        replace: "\u039e"
                    },
                    "\\Pi": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a0"
                    },
                    "\\Sigma": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a3"
                    },
                    "\\Upsilon": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a5"
                    },
                    "\\Phi": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a6"
                    },
                    "\\Psi": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a8"
                    },
                    "\\Omega": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a9"
                    },
                    "\\neg": {
                        font: "main",
                        group: "textord",
                        replace: "\xac"
                    },
                    "\\lnot": {
                        font: "main",
                        group: "textord",
                        replace: "\xac"
                    },
                    "\\top": {
                        font: "main",
                        group: "textord",
                        replace: "\u22a4"
                    },
                    "\\bot": {
                        font: "main",
                        group: "textord",
                        replace: "\u22a5"
                    },
                    "\\emptyset": {
                        font: "main",
                        group: "textord",
                        replace: "\u2205"
                    },
                    "\\varnothing": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2205"
                    },
                    "\\alpha": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b1"
                    },
                    "\\beta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b2"
                    },
                    "\\gamma": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b3"
                    },
                    "\\delta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b4"
                    },
                    "\\epsilon": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03f5"
                    },
                    "\\zeta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b6"
                    },
                    "\\eta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b7"
                    },
                    "\\theta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b8"
                    },
                    "\\iota": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b9"
                    },
                    "\\kappa": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03ba"
                    },
                    "\\lambda": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03bb"
                    },
                    "\\mu": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03bc"
                    },
                    "\\nu": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03bd"
                    },
                    "\\xi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03be"
                    },
                    "\\omicron": {
                        font: "main",
                        group: "mathord",
                        replace: "o"
                    },
                    "\\pi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c0"
                    },
                    "\\rho": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c1"
                    },
                    "\\sigma": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c3"
                    },
                    "\\tau": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c4"
                    },
                    "\\upsilon": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c5"
                    },
                    "\\phi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03d5"
                    },
                    "\\chi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c7"
                    },
                    "\\psi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c8"
                    },
                    "\\omega": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c9"
                    },
                    "\\varepsilon": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b5"
                    },
                    "\\vartheta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03d1"
                    },
                    "\\varpi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03d6"
                    },
                    "\\varrho": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03f1"
                    },
                    "\\varsigma": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c2"
                    },
                    "\\varphi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c6"
                    },
                    "*": {
                        font: "main",
                        group: "bin",
                        replace: "\u2217"
                    },
                    "+": {
                        font: "main",
                        group: "bin"
                    },
                    "-": {
                        font: "main",
                        group: "bin",
                        replace: "\u2212"
                    },
                    "\\cdot": {
                        font: "main",
                        group: "bin",
                        replace: "\u22c5"
                    },
                    "\\circ": {
                        font: "main",
                        group: "bin",
                        replace: "\u2218"
                    },
                    "\\div": {
                        font: "main",
                        group: "bin",
                        replace: "\xf7"
                    },
                    "\\pm": {
                        font: "main",
                        group: "bin",
                        replace: "\xb1"
                    },
                    "\\times": {
                        font: "main",
                        group: "bin",
                        replace: "\xd7"
                    },
                    "\\cap": {
                        font: "main",
                        group: "bin",
                        replace: "\u2229"
                    },
                    "\\cup": {
                        font: "main",
                        group: "bin",
                        replace: "\u222a"
                    },
                    "\\setminus": {
                        font: "main",
                        group: "bin",
                        replace: "\u2216"
                    },
                    "\\land": {
                        font: "main",
                        group: "bin",
                        replace: "\u2227"
                    },
                    "\\lor": {
                        font: "main",
                        group: "bin",
                        replace: "\u2228"
                    },
                    "\\wedge": {
                        font: "main",
                        group: "bin",
                        replace: "\u2227"
                    },
                    "\\vee": {
                        font: "main",
                        group: "bin",
                        replace: "\u2228"
                    },
                    "\\surd": {
                        font: "main",
                        group: "textord",
                        replace: "\u221a"
                    },
                    "(": {
                        font: "main",
                        group: "open"
                    },
                    "[": {
                        font: "main",
                        group: "open"
                    },
                    "\\langle": {
                        font: "main",
                        group: "open",
                        replace: "\u27e8"
                    },
                    "\\lvert": {
                        font: "main",
                        group: "open",
                        replace: "\u2223"
                    },
                    "\\lVert": {
                        font: "main",
                        group: "open",
                        replace: "\u2225"
                    },
                    ")": {
                        font: "main",
                        group: "close"
                    },
                    "]": {
                        font: "main",
                        group: "close"
                    },
                    "?": {
                        font: "main",
                        group: "close"
                    },
                    "!": {
                        font: "main",
                        group: "close"
                    },
                    "\\rangle": {
                        font: "main",
                        group: "close",
                        replace: "\u27e9"
                    },
                    "\\rvert": {
                        font: "main",
                        group: "close",
                        replace: "\u2223"
                    },
                    "\\rVert": {
                        font: "main",
                        group: "close",
                        replace: "\u2225"
                    },
                    "=": {
                        font: "main",
                        group: "rel"
                    },
                    "<": {
                        font: "main",
                        group: "rel"
                    },
                    ">": {
                        font: "main",
                        group: "rel"
                    },
                    ":": {
                        font: "main",
                        group: "rel"
                    },
                    "\\approx": {
                        font: "main",
                        group: "rel",
                        replace: "\u2248"
                    },
                    "\\cong": {
                        font: "main",
                        group: "rel",
                        replace: "\u2245"
                    },
                    "\\ge": {
                        font: "main",
                        group: "rel",
                        replace: "\u2265"
                    },
                    "\\geq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2265"
                    },
                    "\\gets": {
                        font: "main",
                        group: "rel",
                        replace: "\u2190"
                    },
                    "\\in": {
                        font: "main",
                        group: "rel",
                        replace: "\u2208"
                    },
                    "\\notin": {
                        font: "main",
                        group: "rel",
                        replace: "\u2209"
                    },
                    "\\subset": {
                        font: "main",
                        group: "rel",
                        replace: "\u2282"
                    },
                    "\\supset": {
                        font: "main",
                        group: "rel",
                        replace: "\u2283"
                    },
                    "\\subseteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2286"
                    },
                    "\\supseteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2287"
                    },
                    "\\nsubseteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2288"
                    },
                    "\\nsupseteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2289"
                    },
                    "\\models": {
                        font: "main",
                        group: "rel",
                        replace: "\u22a8"
                    },
                    "\\leftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2190"
                    },
                    "\\le": {
                        font: "main",
                        group: "rel",
                        replace: "\u2264"
                    },
                    "\\leq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2264"
                    },
                    "\\ne": {
                        font: "main",
                        group: "rel",
                        replace: "\u2260"
                    },
                    "\\neq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2260"
                    },
                    "\\rightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2192"
                    },
                    "\\to": {
                        font: "main",
                        group: "rel",
                        replace: "\u2192"
                    },
                    "\\ngeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2271"
                    },
                    "\\nleq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2270"
                    },
                    "\\!": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\ ": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    "~": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    "\\,": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\:": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\;": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\enspace": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\qquad": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\quad": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\space": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    ",": {
                        font: "main",
                        group: "punct"
                    },
                    ";": {
                        font: "main",
                        group: "punct"
                    },
                    "\\colon": {
                        font: "main",
                        group: "punct",
                        replace: ":"
                    },
                    "\\barwedge": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22bc"
                    },
                    "\\veebar": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22bb"
                    },
                    "\\odot": {
                        font: "main",
                        group: "bin",
                        replace: "\u2299"
                    },
                    "\\oplus": {
                        font: "main",
                        group: "bin",
                        replace: "\u2295"
                    },
                    "\\otimes": {
                        font: "main",
                        group: "bin",
                        replace: "\u2297"
                    },
                    "\\partial": {
                        font: "main",
                        group: "textord",
                        replace: "\u2202"
                    },
                    "\\oslash": {
                        font: "main",
                        group: "bin",
                        replace: "\u2298"
                    },
                    "\\circledcirc": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229a"
                    },
                    "\\boxdot": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22a1"
                    },
                    "\\bigtriangleup": {
                        font: "main",
                        group: "bin",
                        replace: "\u25b3"
                    },
                    "\\bigtriangledown": {
                        font: "main",
                        group: "bin",
                        replace: "\u25bd"
                    },
                    "\\dagger": {
                        font: "main",
                        group: "bin",
                        replace: "\u2020"
                    },
                    "\\diamond": {
                        font: "main",
                        group: "bin",
                        replace: "\u22c4"
                    },
                    "\\star": {
                        font: "main",
                        group: "bin",
                        replace: "\u22c6"
                    },
                    "\\triangleleft": {
                        font: "main",
                        group: "bin",
                        replace: "\u25c3"
                    },
                    "\\triangleright": {
                        font: "main",
                        group: "bin",
                        replace: "\u25b9"
                    },
                    "\\{": {
                        font: "main",
                        group: "open",
                        replace: "{"
                    },
                    "\\}": {
                        font: "main",
                        group: "close",
                        replace: "}"
                    },
                    "\\lbrace": {
                        font: "main",
                        group: "open",
                        replace: "{"
                    },
                    "\\rbrace": {
                        font: "main",
                        group: "close",
                        replace: "}"
                    },
                    "\\lbrack": {
                        font: "main",
                        group: "open",
                        replace: "["
                    },
                    "\\rbrack": {
                        font: "main",
                        group: "close",
                        replace: "]"
                    },
                    "\\lfloor": {
                        font: "main",
                        group: "open",
                        replace: "\u230a"
                    },
                    "\\rfloor": {
                        font: "main",
                        group: "close",
                        replace: "\u230b"
                    },
                    "\\lceil": {
                        font: "main",
                        group: "open",
                        replace: "\u2308"
                    },
                    "\\rceil": {
                        font: "main",
                        group: "close",
                        replace: "\u2309"
                    },
                    "\\backslash": {
                        font: "main",
                        group: "textord",
                        replace: "\\"
                    },
                    "|": {
                        font: "main",
                        group: "textord",
                        replace: "\u2223"
                    },
                    "\\vert": {
                        font: "main",
                        group: "textord",
                        replace: "\u2223"
                    },
                    "\\|": {
                        font: "main",
                        group: "textord",
                        replace: "\u2225"
                    },
                    "\\Vert": {
                        font: "main",
                        group: "textord",
                        replace: "\u2225"
                    },
                    "\\uparrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2191"
                    },
                    "\\Uparrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d1"
                    },
                    "\\downarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2193"
                    },
                    "\\Downarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d3"
                    },
                    "\\updownarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2195"
                    },
                    "\\Updownarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d5"
                    },
                    "\\coprod": {
                        font: "math",
                        group: "op",
                        replace: "\u2210"
                    },
                    "\\bigvee": {
                        font: "math",
                        group: "op",
                        replace: "\u22c1"
                    },
                    "\\bigwedge": {
                        font: "math",
                        group: "op",
                        replace: "\u22c0"
                    },
                    "\\biguplus": {
                        font: "math",
                        group: "op",
                        replace: "\u2a04"
                    },
                    "\\bigcap": {
                        font: "math",
                        group: "op",
                        replace: "\u22c2"
                    },
                    "\\bigcup": {
                        font: "math",
                        group: "op",
                        replace: "\u22c3"
                    },
                    "\\int": {
                        font: "math",
                        group: "op",
                        replace: "\u222b"
                    },
                    "\\intop": {
                        font: "math",
                        group: "op",
                        replace: "\u222b"
                    },
                    "\\iint": {
                        font: "math",
                        group: "op",
                        replace: "\u222c"
                    },
                    "\\iiint": {
                        font: "math",
                        group: "op",
                        replace: "\u222d"
                    },
                    "\\prod": {
                        font: "math",
                        group: "op",
                        replace: "\u220f"
                    },
                    "\\sum": {
                        font: "math",
                        group: "op",
                        replace: "\u2211"
                    },
                    "\\bigotimes": {
                        font: "math",
                        group: "op",
                        replace: "\u2a02"
                    },
                    "\\bigoplus": {
                        font: "math",
                        group: "op",
                        replace: "\u2a01"
                    },
                    "\\bigodot": {
                        font: "math",
                        group: "op",
                        replace: "\u2a00"
                    },
                    "\\oint": {
                        font: "math",
                        group: "op",
                        replace: "\u222e"
                    },
                    "\\bigsqcup": {
                        font: "math",
                        group: "op",
                        replace: "\u2a06"
                    },
                    "\\smallint": {
                        font: "math",
                        group: "op",
                        replace: "\u222b"
                    },
                    "\\ldots": {
                        font: "main",
                        group: "inner",
                        replace: "\u2026"
                    },
                    "\\cdots": {
                        font: "main",
                        group: "inner",
                        replace: "\u22ef"
                    },
                    "\\ddots": {
                        font: "main",
                        group: "inner",
                        replace: "\u22f1"
                    },
                    "\\vdots": {
                        font: "main",
                        group: "textord",
                        replace: "\u22ee"
                    },
                    "\\acute": {
                        font: "main",
                        group: "accent",
                        replace: "\xb4"
                    },
                    "\\grave": {
                        font: "main",
                        group: "accent",
                        replace: "`"
                    },
                    "\\ddot": {
                        font: "main",
                        group: "accent",
                        replace: "\xa8"
                    },
                    "\\tilde": {
                        font: "main",
                        group: "accent",
                        replace: "~"
                    },
                    "\\bar": {
                        font: "main",
                        group: "accent",
                        replace: "\xaf"
                    },
                    "\\breve": {
                        font: "main",
                        group: "accent",
                        replace: "\u02d8"
                    },
                    "\\check": {
                        font: "main",
                        group: "accent",
                        replace: "\u02c7"
                    },
                    "\\hat": {
                        font: "main",
                        group: "accent",
                        replace: "^"
                    },
                    "\\vec": {
                        font: "main",
                        group: "accent",
                        replace: "\u20d7"
                    },
                    "\\dot": {
                        font: "main",
                        group: "accent",
                        replace: "\u02d9"
                    },
                    "\\imath": {
                        font: "main",
                        group: "mathord",
                        replace: "\u0131"
                    },
                    "\\jmath": {
                        font: "main",
                        group: "mathord",
                        replace: "\u0237"
                    }
                },
                text: {
                    "\\ ": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    " ": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    "~": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    }
                }
            }, n = '0123456789/@."', r = 0; r < n.length; r++) {
                var o = n.charAt(r);
                i.math[o] = {
                    font: "main",
                    group: "textord"
                }
            }
            for (var s = "0123456789`!@*()-=+[]'\";:?/.,", r = 0; r < s.length; r++) {
                var o = s.charAt(r);
                i.text[o] = {
                    font: "main",
                    group: "textord"
                }
            }
            for (var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", r = 0; r < a.length; r++) {
                var o = a.charAt(r);
                i.math[o] = {
                    font: "main",
                    group: "mathord"
                }, i.text[o] = {
                    font: "main",
                    group: "textord"
                }
            }
            t.exports = i
        }, {}],
        23: [function(e, t) {
            function i(e) {
                return u[e]
            }

            function n(e) {
                return ("" + e).replace(p, i)
            }

            function r(e) {
                o(e, "")
            }
            var o, s = Array.prototype.indexOf,
                a = function(e, t) {
                    if (null == e) return -1;
                    if (s && e.indexOf === s) return e.indexOf(t);
                    for (var i = 0, n = e.length; n > i; i++)
                        if (e[i] === t) return i;
                    return -1
                },
                l = function(e, t) {
                    return -1 !== a(e, t)
                },
                c = function(e, t) {
                    return void 0 === e ? t : e
                },
                d = /([A-Z])/g,
                h = function(e) {
                    return e.replace(d, "-$1").toLowerCase()
                },
                u = {
                    "&": "&amp;",
                    ">": "&gt;",
                    "<": "&lt;",
                    '"': "&quot;",
                    "'": "&#x27;"
                },
                p = /[&><"']/g;
            if ("undefined" != typeof document) {
                var m = document.createElement("span");
                o = "textContent" in m ? function(e, t) {
                    e.textContent = t
                } : function(e, t) {
                    e.innerText = t
                }
            }
            t.exports = {
                contains: l,
                deflt: c,
                escape: n,
                hyphenate: h,
                indexOf: a,
                setTextContent: o,
                clearNode: r
            }
        }, {}]
    }, {}, [1])(1)
});

module.exports = { katex };

'use strict';

const less = function(e) {
    function t(t) {
        return e.less[t.split("/")[1]]
    }

    function i() {
        "development" === g.env ? (g.optimization = 0, g.watchTimer = setInterval(function() {
            g.watchMode && r(function(e, t, i, n, r) {
                t && c(t.toCSS(), n, r.lastModified)
            })
        }, g.poll)) : g.optimization = 3
    }

    function n() {
        for (var e = document.getElementsByTagName("style"), t = 0; t < e.length; t++) e[t].type.match(_) && new g.Parser({
            filename: document.location.href.replace(/#.*$/, ""),
            dumpLineNumbers: g.dumpLineNumbers
        }).parse(e[t].innerHTML || "", function(i, n) {
            var r = n.toCSS(),
                o = e[t];
            o.type = "text/css", o.styleSheet ? o.styleSheet.cssText = r : o.innerHTML = r
        })
    }

    function r(e, t) {
        for (var i = 0; i < g.sheets.length; i++) a(g.sheets[i], e, t, g.sheets.length - (i + 1))
    }

    function o(e, t) {
        var i, n, r, o, a = s(e),
            l = s(t),
            c = "";
        if (a.hostPart !== l.hostPart) return "";
        for (n = Math.max(l.directories.length, a.directories.length), i = 0; n > i && l.directories[i] === a.directories[i]; i++);
        for (o = l.directories.slice(i), r = a.directories.slice(i), i = 0; i < o.length - 1; i++) c += "../";
        for (i = 0; i < r.length - 1; i++) c += r[i] + "/";
        return c
    }

    function s(e, t) {
        var i, n, r = /^((?:[a-z-]+:)?\/\/(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/,
            o = e.match(r),
            s = {},
            a = [];
        if (!o) throw new Error("Could not parse sheet href - '" + e + "'");
        if (!o[1] || o[2]) {
            if (n = t.match(r), !n) throw new Error("Could not parse page url - '" + t + "'");
            o[1] = n[1], o[2] || (o[3] = n[3] + o[3])
        }
        if (o[3])
            for (a = o[3].replace("\\", "/").split("/"), i = 0; i < a.length; i++) ".." === a[i] && i > 0 && (a.splice(i - 1, 2), i -= 2);
        return s.hostPart = o[1], s.directories = a, s.path = o[1] + a.join("/"), s.fileUrl = s.path + (o[4] || ""), s.url = s.fileUrl + (o[5] || ""), s
    }

    function a(t, i, n, r) {
        var a, h = t.contents || {},
            p = t.files || {},
            f = s(t.href, e.location.href),
            b = f.url,
            v = y && y.getItem(b),
            C = y && y.getItem(b + ":timestamp"),
            w = {
                css: v,
                timestamp: C
            };
        a = g.relativeUrls ? g.rootpath ? t.entryPath ? s(g.rootpath + o(f.path, t.entryPath)).path : g.rootpath : f.path : g.rootpath ? g.rootpath : t.entryPath ? t.entryPath : f.path, d(b, t.type, function(e, o) {
            if (E += e.replace(/@import .+?;/gi, ""), !n && w && o && new Date(o).valueOf() === new Date(w.timestamp).valueOf()) c(w.css, t), i(null, null, e, t, {
                local: !0,
                remaining: r
            }, b);
            else try {
                h[b] = e, new g.Parser({
                    optimization: g.optimization,
                    paths: [f.path],
                    entryPath: t.entryPath || f.path,
                    mime: t.type,
                    filename: b,
                    rootpath: a,
                    relativeUrls: t.relativeUrls,
                    contents: h,
                    files: p,
                    dumpLineNumbers: g.dumpLineNumbers
                }).parse(e, function(n, s) {
                    if (n) return m(n, b);
                    try {
                        i(n, s, e, t, {
                            local: !1,
                            lastModified: o,
                            remaining: r
                        }, b), u(document.getElementById("less-error-message:" + l(b)))
                    } catch (n) {
                        m(n, b)
                    }
                })
            } catch (s) {
                m(s, b)
            }
        }, function(e, t) {
            throw new Error("Couldn't load " + t + " (" + e + ")")
        })
    }

    function l(e) {
        return e.replace(/^[a-z]+:\/\/?[^\/]+/, "").replace(/^\//, "").replace(/\.[a-zA-Z]+$/, "").replace(/[^\.\w-]+/g, "-").replace(/\./g, ":")
    }

    function c(e, t, i) {
        var n, r = t.href || "",
            o = "less:" + (t.title || l(r));
        if (null === (n = document.getElementById(o))) {
            n = document.createElement("style"), n.type = "text/css", t.media && (n.media = t.media), n.id = o;
            var s = t && t.nextSibling || null;
            (s || document.getElementsByTagName("head")[0]).parentNode.insertBefore(n, s)
        }
        if (n.styleSheet) try {
            n.styleSheet.cssText = e
        } catch (a) {
            throw new Error("Couldn't reassign styleSheet.cssText.")
        } else(function(e) {
            n.childNodes.length > 0 ? n.firstChild.nodeValue !== e.nodeValue && n.replaceChild(e, n.firstChild) : n.appendChild(e)
        })(document.createTextNode(e));
        if (i && y) {
            p("saving " + r + " to cache.");
            try {
                y.setItem(r, e), y.setItem(r + ":timestamp", i)
            } catch (a) {
                p("failed to save")
            }
        }
    }

    function d(e, t, i, n) {
        function r(t, i, n) {
            t.status >= 200 && t.status < 300 ? i(t.responseText, t.getResponseHeader("Last-Modified")) : "function" == typeof n && n(t.status, e)
        }
        var o = h(),
            s = b ? g.fileAsync : g.async;
        "function" == typeof o.overrideMimeType && o.overrideMimeType("text/css"), o.open("GET", e, s), o.setRequestHeader("Accept", t || "text/x-less, text/css; q=0.9, */*; q=0.5"), o.send(null), b && !g.fileAsync ? 0 === o.status || o.status >= 200 && o.status < 300 ? i(o.responseText) : n(o.status, e) : s ? o.onreadystatechange = function() {
            4 == o.readyState && r(o, i, n)
        } : r(o, i, n)
    }

    function h() {
        if (e.XMLHttpRequest) return new XMLHttpRequest;
        try {
            return new ActiveXObject("MSXML2.XMLHTTP.3.0")
        } catch (t) {
            return p("browser doesn't support AJAX."), null
        }
    }

    function u(e) {
        return e && e.parentNode.removeChild(e)
    }

    function p(e) {
        "development" == g.env && "undefined" != typeof console && console.log("less: " + e)
    }

    function m(e, t) {
        var i, n, r = "less-error-message:" + l(t),
            o = '<li><label>{line}</label><pre class="{class}">{content}</pre></li>',
            s = document.createElement("div"),
            a = [],
            d = e.filename || t,
            h = d.match(/([^\/]+(\?.*)?)$/)[1];
        s.id = r, s.className = "less-error-message", n = "<h3>" + (e.message || "There is an error in your .less file") + '</h3><p>in <a href="' + d + '">' + h + "</a> ";
        var u = function(e, t, i) {
            e.extract[t] && a.push(o.replace(/\{line\}/, parseInt(e.line) + (t - 1)).replace(/\{class\}/, i).replace(/\{content\}/, e.extract[t]))
        };
        e.stack ? n += "<br/>" + e.stack.split("\n").slice(1).join("<br/>") : e.extract && (u(e, 0, ""), u(e, 1, "line"), u(e, 2, ""), n += "on line " + e.line + ", column " + (e.column + 1) + ":</p><ul>" + a.join("") + "</ul>"), s.innerHTML = n, c([".less-error-message ul, .less-error-message li {", "list-style-type: none;", "margin-right: 15px;", "padding: 4px 0;", "margin: 0;", "}", ".less-error-message label {", "font-size: 12px;", "margin-right: 15px;", "padding: 4px 0;", "color: #cc7777;", "}", ".less-error-message pre {", "color: #dd6666;", "padding: 4px 0;", "margin: 0;", "display: inline-block;", "}", ".less-error-message pre.line {", "color: #ff0000;", "}", ".less-error-message h3 {", "font-size: 20px;", "font-weight: bold;", "padding: 15px 0 5px 0;", "margin: 0;", "}", ".less-error-message a {", "color: #10a", "}", ".less-error-message .error {", "color: red;", "font-weight: bold;", "padding-bottom: 2px;", "border-bottom: 1px dashed red;", "}"].join("\n"), {
            title: "error-message"
        }), s.style.cssText = ["font-family: Arial, sans-serif", "border: 1px solid #e00", "background-color: #eee", "border-radius: 5px", "-webkit-border-radius: 5px", "-moz-border-radius: 5px", "color: #e00", "padding: 15px", "margin-bottom: 15px"].join(";"), "development" == g.env && (i = setInterval(function() {
            document.body && (document.getElementById(r) ? document.body.replaceChild(s, document.getElementById(r)) : document.body.insertBefore(s, document.body.firstChild), clearInterval(i))
        }, 10))
    }
    Array.isArray || (Array.isArray = function(e) {
        return "[object Array]" === Object.prototype.toString.call(e) || e instanceof Array
    }), Array.prototype.forEach || (Array.prototype.forEach = function(e, t) {
        for (var i = this.length >>> 0, n = 0; i > n; n++) n in this && e.call(t, this[n], n, this)
    }), Array.prototype.map || (Array.prototype.map = function(e) {
        for (var t = this.length >>> 0, i = new Array(t), n = arguments[1], r = 0; t > r; r++) r in this && (i[r] = e.call(n, this[r], r, this));
        return i
    }), Array.prototype.filter || (Array.prototype.filter = function(e) {
        for (var t = [], i = arguments[1], n = 0; n < this.length; n++) e.call(i, this[n]) && t.push(this[n]);
        return t
    }), Array.prototype.reduce || (Array.prototype.reduce = function(e) {
        var t = this.length >>> 0,
            i = 0;
        if (0 === t && 1 === arguments.length) throw new TypeError;
        if (arguments.length >= 2) var n = arguments[1];
        else
            for (;;) {
                if (i in this) {
                    n = this[i++];
                    break
                }
                if (++i >= t) throw new TypeError
            }
        for (; t > i; i++) i in this && (n = e.call(null, n, this[i], i, this));
        return n
    }), Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
        var t = this.length,
            i = arguments[1] || 0;
        if (!t) return -1;
        if (i >= t) return -1;
        for (0 > i && (i += t); t > i; i++)
            if (Object.prototype.hasOwnProperty.call(this, i) && e === this[i]) return i;
        return -1
    }), Object.keys || (Object.keys = function(e) {
        var t = [];
        for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && t.push(i);
        return t
    }), String.prototype.trim || (String.prototype.trim = function() {
        return String(this).replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    });
    var g, f;
    "object" == typeof environment && "[object Environment]" === {}.toString.call(environment) ? (g = "undefined" == typeof e ? {} : e.less = {}, f = g.tree = {}, g.mode = "rhino") : "undefined" == typeof e ? (g = exports, f = t("./tree"), g.mode = "node") : ("undefined" == typeof e.less && (e.less = {}), g = e.less, f = e.less.tree = {}, g.mode = "browser"), g.Parser = function(e) {
        function i() {
            w = k[y], S = C, E = C
        }

        function n() {
            k[y] = w, C = S, E = C
        }

        function r() {
            C > E && (k[y] = k[y].slice(C - E), E = C)
        }

        function o(e) {
            var t = e.charCodeAt(0);
            return 32 === t || 10 === t || 9 === t
        }

        function s(e) {
            var t, i;
            if (e instanceof Function) return e.call(A.parsers);
            if ("string" == typeof e) t = v.charAt(C) === e ? e : null, i = 1, r();
            else {
                if (r(), !(t = e.exec(k[y]))) return null;
                i = t[0].length
            }
            return t ? (a(i), "string" == typeof t ? t : 1 === t.length ? t[0] : t) : void 0
        }

        function a(e) {
            for (var t = C, i = y, n = C + k[y].length, r = C += e; n > C && o(v.charAt(C));) C++;
            return k[y] = k[y].slice(e + (C - r)), E = C, 0 === k[y].length && y < k.length - 1 && y++, t !== C || i !== y
        }

        function l(e, t) {
            var i = s(e);
            return i ? i : void c(t || ("string" == typeof e ? "expected '" + e + "' got '" + v.charAt(C) + "'" : "unexpected token"))
        }

        function c(e, t) {
            var i = new Error(e);
            throw i.index = C, i.type = t || "Syntax", i
        }

        function d(e) {
            return "string" == typeof e ? v.charAt(C) === e : e.test(k[y]) ? !0 : !1
        }

        function h(e, t) {
            return e.filename && t.filename && e.filename !== t.filename ? A.imports.contents[e.filename] : v
        }

        function u(e, t) {
            for (var i = e, n = -1; i >= 0 && "\n" !== t.charAt(i); i--) n++;
            return {
                line: "number" == typeof e ? (t.slice(0, e).match(/\n/g) || "").length : null,
                column: n
            }
        }

        function p(e) {
            return "browser" === g.mode || "rhino" === g.mode ? e.filename : t("path").resolve(e.filename)
        }

        function m(e, t, i) {
            return {
                lineNumber: u(e, t).line + 1,
                fileName: p(i)
            }
        }

        function b(e, t) {
            var i = h(e, t),
                n = u(e.index, i),
                r = n.line,
                o = n.column,
                s = i.split("\n");
            this.type = e.type || "Syntax", this.message = e.message, this.filename = e.filename || t.filename, this.index = e.index, this.line = "number" == typeof r ? r + 1 : null, this.callLine = e.call && u(e.call, i).line + 1, this.callExtract = s[u(e.call, i).line], this.stack = e.stack, this.column = o, this.extract = [s[r - 1], s[r], s[r + 1]]
        }
        var v, C, y, w, S, _, k, E, A, e = e || {};
        e.contents || (e.contents = {}), e.rootpath = e.rootpath || "", e.files || (e.files = {});
        var x = function() {},
            I = this.imports = {
                paths: e.paths || [],
                queue: [],
                files: e.files,
                contents: e.contents,
                mime: e.mime,
                error: null,
                push: function(t, i) {
                    var n = this;
                    this.queue.push(t), g.Parser.importer(t, this.paths, function(e, r, o) {
                        n.queue.splice(n.queue.indexOf(t), 1);
                        var s = o in n.files;
                        n.files[o] = r, e && !n.error && (n.error = e), i(e, r, s), 0 === n.queue.length && x(n.error)
                    }, e)
                }
            };
        return this.env = e = e || {}, this.optimization = "optimization" in this.env ? this.env.optimization : 1, this.env.filename = this.env.filename || null, A = {
            imports: I,
            parse: function(i, n) {
                var r, o, a, l = null;
                if (C = y = E = _ = 0, v = i.replace(/\r\n/g, "\n"), v = v.replace(/^\uFEFF/, ""), k = function(t) {
                        for (var i, n, r, o, s = 0, a = /(?:@\{[\w-]+\}|[^"'`\{\}\/\(\)\\])+/g, c = /\/\*(?:[^*]|\*+[^\/*])*\*+\/|\/\/.*/g, d = /"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'|`((?:[^`]|\\.)*)`/g, h = 0, u = t[0], p = 0; p < v.length;)
                            if (a.lastIndex = p, (i = a.exec(v)) && i.index === p && (p += i[0].length, u.push(i[0])), r = v.charAt(p), c.lastIndex = d.lastIndex = p, (i = d.exec(v)) && i.index === p) p += i[0].length, u.push(i[0]);
                            else if (n || "/" !== r || (o = v.charAt(p + 1), "/" !== o && "*" !== o || !(i = c.exec(v)) || i.index !== p)) {
                                switch (r) {
                                    case "{":
                                        if (!n) {
                                            h++, u.push(r);
                                            break
                                        }
                                    case "}":
                                        if (!n) {
                                            h--, u.push(r), t[++s] = u = [];
                                            break
                                        }
                                    case "(":
                                        if (!n) {
                                            n = !0, u.push(r);
                                            break
                                        }
                                    case ")":
                                        if (n) {
                                            n = !1, u.push(r);
                                            break
                                        }
                                    default:
                                        u.push(r)
                                }
                                p++
                            } else p += i[0].length, u.push(i[0]);
                        return 0 != h && (l = new b({
                            index: p - 1,
                            type: "Parse",
                            message: h > 0 ? "missing closing `}`" : "missing opening `{`",
                            filename: e.filename
                        }, e)), t.map(function(e) {
                            return e.join("")
                        })
                    }([
                        []
                    ]), l) return n(l, e);
                try {
                    r = new f.Ruleset([], s(this.parsers.primary)), r.root = !0
                } catch (c) {
                    return n(new b(c, e))
                }
                if (r.toCSS = function(i) {
                        return function(n, r) {
                            var o, s = [];
                            n = n || {}, "object" == typeof r && !Array.isArray(r) && (r = Object.keys(r).map(function(e) {
                                var t = r[e];
                                return t instanceof f.Value || (t instanceof f.Expression || (t = new f.Expression([t])), t = new f.Value([t])), new f.Rule("@" + e, t, !1, 0)
                            }), s = [new f.Ruleset(null, r)]);
                            try {
                                var a = i.call(this, {
                                    frames: s
                                }).toCSS([], {
                                    compress: n.compress || !1,
                                    dumpLineNumbers: e.dumpLineNumbers
                                })
                            } catch (l) {
                                throw new b(l, e)
                            }
                            if (o = A.imports.error) throw o instanceof b ? o : new b(o, e);
                            return n.yuicompress && "node" === g.mode ? t("ycssmin").cssmin(a) : n.compress ? a.replace(/(\s)+/g, "$1") : a
                        }
                    }(r.eval), C < v.length - 1) {
                    C = _, a = v.split("\n"), o = (v.slice(0, C).match(/\n/g) || "").length + 1;
                    for (var d = C, h = -1; d >= 0 && "\n" !== v.charAt(d); d--) h++;
                    l = {
                        type: "Parse",
                        message: "Syntax Error on line " + o,
                        index: C,
                        filename: e.filename,
                        line: o,
                        column: h,
                        extract: [a[o - 2], a[o - 1], a[o]]
                    }
                }
                this.imports.queue.length > 0 ? x = function(e) {
                    e = l || e, e ? n(e) : n(null, r)
                } : n(l, r)
            },
            parsers: {
                primary: function() {
                    for (var e, t = [];
                         (e = s(this.mixin.definition) || s(this.rule) || s(this.ruleset) || s(this.mixin.call) || s(this.comment) || s(this.directive)) || s(/^[\s\n]+/) || s(/^;+/);) e && t.push(e);
                    return t
                },
                comment: function() {
                    var e;
                    if ("/" === v.charAt(C)) return "/" === v.charAt(C + 1) ? new f.Comment(s(/^\/\/.*/), !0) : (e = s(/^\/\*(?:[^*]|\*+[^\/*])*\*+\/\n?/)) ? new f.Comment(e) : void 0
                },
                entities: {
                    quoted: function() {
                        var e, t, i = C;
                        return "~" === v.charAt(i) && (i++, t = !0), '"' === v.charAt(i) || "'" === v.charAt(i) ? (t && s("~"), (e = s(/^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/)) ? new f.Quoted(e[0], e[1] || e[2], t) : void 0) : void 0
                    },
                    keyword: function() {
                        var e;
                        return (e = s(/^[_A-Za-z-][_A-Za-z0-9-]*/)) ? f.colors.hasOwnProperty(e) ? new f.Color(f.colors[e].slice(1)) : new f.Keyword(e) : void 0
                    },
                    call: function() {
                        var t, i, n, r, o = C;
                        if (t = /^([\w-]+|%|progid:[\w\.]+)\(/.exec(k[y])) {
                            if (t = t[1], i = t.toLowerCase(), "url" === i) return null;
                            if (C += t.length, "alpha" === i && (r = s(this.alpha), "undefined" != typeof r)) return r;
                            if (s("("), n = s(this.entities.arguments), s(")")) return t ? new f.Call(t, n, o, e.filename) : void 0
                        }
                    },
                    arguments: function() {
                        for (var e, t = [];
                             (e = s(this.entities.assignment) || s(this.expression)) && (t.push(e), s(",")););
                        return t
                    },
                    literal: function() {
                        return s(this.entities.ratio) || s(this.entities.dimension) || s(this.entities.color) || s(this.entities.quoted) || s(this.entities.unicodeDescriptor)
                    },
                    assignment: function() {
                        var e, t;
                        return (e = s(/^\w+(?=\s?=)/i)) && s("=") && (t = s(this.entity)) ? new f.Assignment(e, t) : void 0
                    },
                    url: function() {
                        var t;
                        if ("u" === v.charAt(C) && s(/^url\(/)) return t = s(this.entities.quoted) || s(this.entities.variable) || s(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/) || "", l(")"), new f.URL(null != t.value || t instanceof f.Variable ? t : new f.Anonymous(t), e.rootpath)
                    },
                    variable: function() {
                        var t, i = C;
                        return "@" === v.charAt(C) && (t = s(/^@@?[\w-]+/)) ? new f.Variable(t, i, e.filename) : void 0
                    },
                    variableCurly: function() {
                        var t, i = C;
                        return "@" === v.charAt(C) && (t = s(/^@\{([\w-]+)\}/)) ? new f.Variable("@" + t[1], i, e.filename) : void 0
                    },
                    color: function() {
                        var e;
                        return "#" === v.charAt(C) && (e = s(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/)) ? new f.Color(e[1]) : void 0
                    },
                    dimension: function() {
                        var e, t = v.charCodeAt(C);
                        if (!(t > 57 || 43 > t || 47 === t || 44 == t)) return (e = s(/^([+-]?\d*\.?\d+)(px|%|em|pc|ex|in|deg|s|ms|pt|cm|mm|rad|grad|turn|dpi|dpcm|dppx|rem|vw|vh|vmin|vm|ch)?/)) ? new f.Dimension(e[1], e[2]) : void 0
                    },
                    ratio: function() {
                        var e, t = v.charCodeAt(C);
                        if (!(t > 57 || 48 > t)) return (e = s(/^(\d+\/\d+)/)) ? new f.Ratio(e[1]) : void 0
                    },
                    unicodeDescriptor: function() {
                        var e;
                        return (e = s(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/)) ? new f.UnicodeDescriptor(e[0]) : void 0
                    },
                    javascript: function() {
                        var e, t, i = C;
                        return "~" === v.charAt(i) && (i++, t = !0), "`" === v.charAt(i) ? (t && s("~"), (e = s(/^`([^`]*)`/)) ? new f.JavaScript(e[1], C, t) : void 0) : void 0
                    }
                },
                variable: function() {
                    var e;
                    return "@" === v.charAt(C) && (e = s(/^(@[\w-]+)\s*:/)) ? e[1] : void 0
                },
                shorthand: function() {
                    var e, t;
                    if (d(/^[@\w.%-]+\/[@\w.-]+/)) return i(), (e = s(this.entity)) && s("/") && (t = s(this.entity)) ? new f.Shorthand(e, t) : void n()
                },
                mixin: {
                    call: function() {
                        var t, r, o, a, h, u, p, m, g, b, y = [],
                            w = [],
                            S = [],
                            _ = C,
                            k = v.charAt(C),
                            E = !1;
                        if ("." === k || "#" === k) {
                            for (i(); t = s(/^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/);) y.push(new f.Element(r, t, C)), r = s(">");
                            if (s("(")) {
                                for (u = []; a = s(this.expression);) {
                                    if (h = null, b = a, 1 == a.value.length) {
                                        var A = a.value[0];
                                        A instanceof f.Variable && s(":") && (u.length > 0 && (p && c("Cannot mix ; and , as delimiter types"), m = !0), b = l(this.expression), h = g = A.name)
                                    }
                                    u.push(b), S.push({
                                        name: h,
                                        value: b
                                    }), s(",") || (s(";") || p) && (m && c("Cannot mix ; and , as delimiter types"), p = !0, u.length > 1 && (b = new f.Value(u)), w.push({
                                        name: g,
                                        value: b
                                    }), g = null, u = [], m = !1)
                                }
                                l(")")
                            }
                            return o = p ? w : S, s(this.important) && (E = !0), y.length > 0 && (s(";") || d("}")) ? new f.mixin.Call(y, o, _, e.filename, E) : void n()
                        }
                    },
                    definition: function() {
                        var e, t, r, o, a, c, h = [],
                            u = !1;
                        if (!("." !== v.charAt(C) && "#" !== v.charAt(C) || d(/^[^{]*\}/)) && (i(), t = s(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/))) {
                            e = t[1];
                            do {
                                if (s(this.comment), "." === v.charAt(C) && s(/^\.{3}/)) {
                                    u = !0, h.push({
                                        variadic: !0
                                    });
                                    break
                                }
                                if (!(o = s(this.entities.variable) || s(this.entities.literal) || s(this.entities.keyword))) break;
                                if (o instanceof f.Variable)
                                    if (s(":")) a = l(this.expression, "expected expression"), h.push({
                                        name: o.name,
                                        value: a
                                    });
                                    else {
                                        if (s(/^\.{3}/)) {
                                            h.push({
                                                name: o.name,
                                                variadic: !0
                                            }), u = !0;
                                            break
                                        }
                                        h.push({
                                            name: o.name
                                        })
                                    }
                                else h.push({
                                    value: o
                                })
                            } while (s(",") || s(";"));
                            if (s(")") || (_ = C, n()), s(this.comment), s(/^when/) && (c = l(this.conditions, "expected condition")), r = s(this.block), r) return new f.mixin.Definition(e, h, r, c, u);
                            n()
                        }
                    }
                },
                entity: function() {
                    return s(this.entities.literal) || s(this.entities.variable) || s(this.entities.url) || s(this.entities.call) || s(this.entities.keyword) || s(this.entities.javascript) || s(this.comment)
                },
                end: function() {
                    return s(";") || d("}")
                },
                alpha: function() {
                    var e;
                    if (s(/^\(opacity=/i)) return (e = s(/^\d+/) || s(this.entities.variable)) ? (l(")"), new f.Alpha(e)) : void 0
                },
                element: function() {
                    var e, t, i;
                    return t = s(this.combinator), e = s(/^(?:\d+\.\d+|\d+)%/) || s(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/) || s("*") || s("&") || s(this.attribute) || s(/^\([^()@]+\)/) || s(/^[\.#](?=@)/) || s(this.entities.variableCurly), e || s("(") && (i = s(this.entities.variableCurly) || s(this.entities.variable) || s(this.selector)) && s(")") && (e = new f.Paren(i)), e ? new f.Element(t, e, C) : void 0
                },
                combinator: function() {
                    var e = v.charAt(C);
                    if (">" === e || "+" === e || "~" === e || "|" === e) {
                        for (C++; v.charAt(C).match(/\s/);) C++;
                        return new f.Combinator(e)
                    }
                    return new f.Combinator(v.charAt(C - 1).match(/\s/) ? " " : null)
                },
                selector: function() {
                    var e, t, i, n = [];
                    if (s("(")) return e = s(this.entity), s(")") ? new f.Selector([new f.Element("", e, C)]) : null;
                    for (;
                        (t = s(this.element)) && (i = v.charAt(C), n.push(t), "{" !== i && "}" !== i && ";" !== i && "," !== i && ")" !== i););
                    return n.length > 0 ? new f.Selector(n) : void 0
                },
                attribute: function() {
                    var e, t, i, n = "";
                    if (s("[") && ((e = s(/^(?:[_A-Za-z0-9-]|\\.)+/) || s(this.entities.quoted)) && (n = (i = s(/^[|~*$^]?=/)) && (t = s(this.entities.quoted) || s(/^[\w-]+/)) ? [e, i, t.toCSS ? t.toCSS() : t].join("") : e), s("]"))) return n ? "[" + n + "]" : void 0
                },
                block: function() {
                    var e;
                    return s("{") && (e = s(this.primary)) && s("}") ? e : void 0
                },
                ruleset: function() {
                    var t, r, o, a = [];
                    for (i(), e.dumpLineNumbers && (o = m(C, v, e));
                         (t = s(this.selector)) && (a.push(t), s(this.comment), s(","));) s(this.comment);
                    if (a.length > 0 && (r = s(this.block))) {
                        var l = new f.Ruleset(a, r, e.strictImports);
                        return e.dumpLineNumbers && (l.debugInfo = o), l
                    }
                    _ = C, n()
                },
                rule: function() {
                    var e, t, r, o, a = v.charAt(C);
                    if (i(), "." !== a && "#" !== a && "&" !== a && (e = s(this.variable) || s(this.property))) {
                        if ("@" != e.charAt(0) && (o = /^([^@+\/'"*`(;{}-]*);/.exec(k[y])) ? (C += o[0].length - 1, t = new f.Anonymous(o[1])) : t = s("font" === e ? this.font : this.value), r = s(this.important), t && s(this.end)) return new f.Rule(e, t, r, S);
                        _ = C, n()
                    }
                },
                "import": function() {
                    var t, r, o = C;
                    i();
                    var a = s(/^@import(?:-(once))?\s+/);
                    return a && (t = s(this.entities.quoted) || s(this.entities.url)) && (r = s(this.mediaFeatures), s(";")) ? new f.Import(t, I, r, "once" === a[1], o, e.rootpath) : void n()
                },
                mediaFeature: function() {
                    var e, t, i = [];
                    do
                        if (e = s(this.entities.keyword)) i.push(e);
                        else if (s("(")) {
                            if (t = s(this.property), e = s(this.entity), !s(")")) return null;
                            if (t && e) i.push(new f.Paren(new f.Rule(t, e, null, C, !0)));
                            else {
                                if (!e) return null;
                                i.push(new f.Paren(e))
                            }
                        } while (e);
                    return i.length > 0 ? new f.Expression(i) : void 0
                },
                mediaFeatures: function() {
                    var e, t = [];
                    do
                        if (e = s(this.mediaFeature)) {
                            if (t.push(e), !s(",")) break
                        } else if ((e = s(this.entities.variable)) && (t.push(e), !s(","))) break; while (e);
                    return t.length > 0 ? t : null
                },
                media: function() {
                    var t, i, n, r;
                    return e.dumpLineNumbers && (r = m(C, v, e)), s(/^@media/) && (t = s(this.mediaFeatures), i = s(this.block)) ? (n = new f.Media(i, t), e.dumpLineNumbers && (n.debugInfo = r), n) : void 0
                },
                directive: function() {
                    var t, r, o, a, l, c, d;
                    if ("@" === v.charAt(C)) {
                        if (r = s(this["import"]) || s(this.media)) return r;
                        if (i(), t = s(/^@[a-z-]+/)) {
                            switch (a = t, "-" == t.charAt(1) && t.indexOf("-", 2) > 0 && (a = "@" + t.slice(t.indexOf("-", 2) + 1)), a) {
                                case "@font-face":
                                    l = !0;
                                    break;
                                case "@viewport":
                                case "@top-left":
                                case "@top-left-corner":
                                case "@top-center":
                                case "@top-right":
                                case "@top-right-corner":
                                case "@bottom-left":
                                case "@bottom-left-corner":
                                case "@bottom-center":
                                case "@bottom-right":
                                case "@bottom-right-corner":
                                case "@left-top":
                                case "@left-middle":
                                case "@left-bottom":
                                case "@right-top":
                                case "@right-middle":
                                case "@right-bottom":
                                    l = !0;
                                    break;
                                case "@page":
                                case "@document":
                                case "@supports":
                                case "@keyframes":
                                    l = !0, c = !0;
                                    break;
                                case "@namespace":
                                    d = !0
                            }
                            if (c && (t += " " + (s(/^[^{]+/) || "").trim()), l) {
                                if (o = s(this.block)) return new f.Directive(t, o)
                            } else if ((r = s(d ? this.expression : this.entity)) && s(";")) {
                                var h = new f.Directive(t, r);
                                return e.dumpLineNumbers && (h.debugInfo = m(C, v, e)), h
                            }
                            n()
                        }
                    }
                },
                font: function() {
                    for (var e, t = [], i = []; e = s(this.shorthand) || s(this.entity);) i.push(e);
                    if (t.push(new f.Expression(i)), s(","))
                        for (;
                            (e = s(this.expression)) && (t.push(e), s(",")););
                    return new f.Value(t)
                },
                value: function() {
                    for (var e, t = [];
                         (e = s(this.expression)) && (t.push(e), s(",")););
                    return t.length > 0 ? new f.Value(t) : void 0
                },
                important: function() {
                    return "!" === v.charAt(C) ? s(/^! *important/) : void 0
                },
                sub: function() {
                    var e;
                    return s("(") && (e = s(this.expression)) && s(")") ? e : void 0
                },
                multiplication: function() {
                    var e, t, i, n;
                    if (e = s(this.operand)) {
                        for (; !d(/^\/[*\/]/) && (i = s("/") || s("*")) && (t = s(this.operand));) n = new f.Operation(i, [n || e, t]);
                        return n || e
                    }
                },
                addition: function() {
                    var e, t, i, n;
                    if (e = s(this.multiplication)) {
                        for (;
                            (i = s(/^[-+]\s+/) || !o(v.charAt(C - 1)) && (s("+") || s("-"))) && (t = s(this.multiplication));) n = new f.Operation(i, [n || e, t]);
                        return n || e
                    }
                },
                conditions: function() {
                    var e, t, i, n = C;
                    if (e = s(this.condition)) {
                        for (; s(",") && (t = s(this.condition));) i = new f.Condition("or", i || e, t, n);
                        return i || e
                    }
                },
                condition: function() {
                    var e, t, i, n, r = C,
                        o = !1;
                    return s(/^not/) && (o = !0), l("("), (e = s(this.addition) || s(this.entities.keyword) || s(this.entities.quoted)) ? ((n = s(/^(?:>=|=<|[<=>])/)) ? (t = s(this.addition) || s(this.entities.keyword) || s(this.entities.quoted)) ? i = new f.Condition(n, e, t, r, o) : c("expected expression") : i = new f.Condition("=", e, new f.Keyword("true"), r, o), l(")"), s(/^and/) ? new f.Condition("and", i, s(this.condition)) : i) : void 0
                },
                operand: function() {
                    var e, t = v.charAt(C + 1);
                    "-" === v.charAt(C) && ("@" === t || "(" === t) && (e = s("-"));
                    var i = s(this.sub) || s(this.entities.dimension) || s(this.entities.color) || s(this.entities.variable) || s(this.entities.call);
                    return e ? new f.Operation("*", [new f.Dimension(-1), i]) : i
                },
                expression: function() {
                    for (var e, t = []; e = s(this.addition) || s(this.entity);) t.push(e);
                    return t.length > 0 ? new f.Expression(t) : void 0
                },
                property: function() {
                    var e;
                    return (e = s(/^(\*?-?[_a-z0-9-]+)\s*:/)) ? e[1] : void 0
                }
            }
        }
    }, ("browser" === g.mode || "rhino" === g.mode) && (g.Parser.importer = function(e, t, i, n) {
        !/^([a-z-]+:)?\//.test(e) && t.length > 0 && (e = t[0] + e), a({
            href: e,
            title: e,
            type: n.mime,
            contents: n.contents,
            files: n.files,
            rootpath: n.rootpath,
            entryPath: n.entryPath,
            relativeUrls: n.relativeUrls
        }, function(e, r, o, s, a, l) {
            e && "function" == typeof n.errback ? n.errback.call(null, l, t, i, n) : i.call(null, e, r, l)
        }, !0)
    }),
        function(e) {
            function t(t) {
                return e.functions.hsla(t.h, t.s, t.l, t.a)
            }

            function i(t, i) {
                return t instanceof e.Dimension && "%" == t.unit ? parseFloat(t.value * i / 100) : n(t)
            }

            function n(t) {
                if (t instanceof e.Dimension) return parseFloat("%" == t.unit ? t.value / 100 : t.value);
                if ("number" == typeof t) return t;
                throw {
                    error: "RuntimeError",
                    message: "color functions take numbers as parameters"
                }
            }

            function r(e) {
                return Math.min(1, Math.max(0, e))
            }
            e.functions = {
                rgb: function(e, t, i) {
                    return this.rgba(e, t, i, 1)
                },
                rgba: function(t, r, o, s) {
                    var a = [t, r, o].map(function(e) {
                        return i(e, 256)
                    });
                    return s = n(s), new e.Color(a, s)
                },
                hsl: function(e, t, i) {
                    return this.hsla(e, t, i, 1)
                },
                hsla: function(e, t, i, r) {
                    function o(e) {
                        return e = 0 > e ? e + 1 : e > 1 ? e - 1 : e, 1 > 6 * e ? a + (s - a) * e * 6 : 1 > 2 * e ? s : 2 > 3 * e ? a + (s - a) * (2 / 3 - e) * 6 : a
                    }
                    e = n(e) % 360 / 360, t = n(t), i = n(i), r = n(r);
                    var s = .5 >= i ? i * (t + 1) : i + t - i * t,
                        a = 2 * i - s;
                    return this.rgba(255 * o(e + 1 / 3), 255 * o(e), 255 * o(e - 1 / 3), r)
                },
                hsv: function(e, t, i) {
                    return this.hsva(e, t, i, 1)
                },
                hsva: function(e, t, i, r) {
                    e = n(e) % 360 / 360 * 360, t = n(t), i = n(i), r = n(r);
                    var o, s;
                    o = Math.floor(e / 60 % 6), s = e / 60 - o;
                    var a = [i, i * (1 - t), i * (1 - s * t), i * (1 - (1 - s) * t)],
                        l = [
                            [0, 3, 1],
                            [2, 0, 1],
                            [1, 0, 3],
                            [1, 2, 0],
                            [3, 1, 0],
                            [0, 1, 2]
                        ];
                    return this.rgba(255 * a[l[o][0]], 255 * a[l[o][1]], 255 * a[l[o][2]], r)
                },
                hue: function(t) {
                    return new e.Dimension(Math.round(t.toHSL().h))
                },
                saturation: function(t) {
                    return new e.Dimension(Math.round(100 * t.toHSL().s), "%")
                },
                lightness: function(t) {
                    return new e.Dimension(Math.round(100 * t.toHSL().l), "%")
                },
                red: function(t) {
                    return new e.Dimension(t.rgb[0])
                },
                green: function(t) {
                    return new e.Dimension(t.rgb[1])
                },
                blue: function(t) {
                    return new e.Dimension(t.rgb[2])
                },
                alpha: function(t) {
                    return new e.Dimension(t.toHSL().a)
                },
                luma: function(t) {
                    return new e.Dimension(Math.round((.2126 * (t.rgb[0] / 255) + .7152 * (t.rgb[1] / 255) + .0722 * (t.rgb[2] / 255)) * t.alpha * 100), "%")
                },
                saturate: function(e, i) {
                    var n = e.toHSL();
                    return n.s += i.value / 100, n.s = r(n.s), t(n)
                },
                desaturate: function(e, i) {
                    var n = e.toHSL();
                    return n.s -= i.value / 100, n.s = r(n.s), t(n)
                },
                lighten: function(e, i) {
                    var n = e.toHSL();
                    return n.l += i.value / 100, n.l = r(n.l), t(n)
                },
                darken: function(e, i) {
                    var n = e.toHSL();
                    return n.l -= i.value / 100, n.l = r(n.l), t(n)
                },
                fadein: function(e, i) {
                    var n = e.toHSL();
                    return n.a += i.value / 100, n.a = r(n.a), t(n)
                },
                fadeout: function(e, i) {
                    var n = e.toHSL();
                    return n.a -= i.value / 100, n.a = r(n.a), t(n)
                },
                fade: function(e, i) {
                    var n = e.toHSL();
                    return n.a = i.value / 100, n.a = r(n.a), t(n)
                },
                spin: function(e, i) {
                    var n = e.toHSL(),
                        r = (n.h + i.value) % 360;
                    return n.h = 0 > r ? 360 + r : r, t(n)
                },
                mix: function(t, i, n) {
                    n || (n = new e.Dimension(50));
                    var r = n.value / 100,
                        o = 2 * r - 1,
                        s = t.toHSL().a - i.toHSL().a,
                        a = ((o * s == -1 ? o : (o + s) / (1 + o * s)) + 1) / 2,
                        l = 1 - a,
                        c = [t.rgb[0] * a + i.rgb[0] * l, t.rgb[1] * a + i.rgb[1] * l, t.rgb[2] * a + i.rgb[2] * l],
                        d = t.alpha * r + i.alpha * (1 - r);
                    return new e.Color(c, d)
                },
                greyscale: function(t) {
                    return this.desaturate(t, new e.Dimension(100))
                },
                contrast: function(e, t, i, n) {
                    return e.rgb ? ("undefined" == typeof i && (i = this.rgba(255, 255, 255, 1)), "undefined" == typeof t && (t = this.rgba(0, 0, 0, 1)), n = "undefined" == typeof n ? .43 : n.value, (.2126 * (e.rgb[0] / 255) + .7152 * (e.rgb[1] / 255) + .0722 * (e.rgb[2] / 255)) * e.alpha < n ? i : t) : null
                },
                e: function(t) {
                    return new e.Anonymous(t instanceof e.JavaScript ? t.evaluated : t)
                },
                escape: function(t) {
                    return new e.Anonymous(encodeURI(t.value).replace(/=/g, "%3D").replace(/:/g, "%3A").replace(/#/g, "%23").replace(/;/g, "%3B").replace(/\(/g, "%28").replace(/\)/g, "%29"))
                },
                "%": function(t) {
                    for (var i = Array.prototype.slice.call(arguments, 1), n = t.value, r = 0; r < i.length; r++) n = n.replace(/%[sda]/i, function(e) {
                        var t = e.match(/s/i) ? i[r].value : i[r].toCSS();
                        return e.match(/[A-Z]$/) ? encodeURIComponent(t) : t
                    });
                    return n = n.replace(/%%/g, "%"), new e.Quoted('"' + n + '"', n)
                },
                unit: function(t, i) {
                    return new e.Dimension(t.value, i ? i.toCSS() : "")
                },
                round: function(e, t) {
                    var i = "undefined" == typeof t ? 0 : t.value;
                    return this._math(function(e) {
                        return e.toFixed(i)
                    }, e)
                },
                ceil: function(e) {
                    return this._math(Math.ceil, e)
                },
                floor: function(e) {
                    return this._math(Math.floor, e)
                },
                _math: function(t, i) {
                    if (i instanceof e.Dimension) return new e.Dimension(t(parseFloat(i.value)), i.unit);
                    if ("number" == typeof i) return t(i);
                    throw {
                        type: "Argument",
                        message: "argument must be a number"
                    }
                },
                argb: function(t) {
                    return new e.Anonymous(t.toARGB())
                },
                percentage: function(t) {
                    return new e.Dimension(100 * t.value, "%")
                },
                color: function(t) {
                    if (t instanceof e.Quoted) return new e.Color(t.value.slice(1));
                    throw {
                        type: "Argument",
                        message: "argument must be a string"
                    }
                },
                iscolor: function(t) {
                    return this._isa(t, e.Color)
                },
                isnumber: function(t) {
                    return this._isa(t, e.Dimension)
                },
                isstring: function(t) {
                    return this._isa(t, e.Quoted)
                },
                iskeyword: function(t) {
                    return this._isa(t, e.Keyword)
                },
                isurl: function(t) {
                    return this._isa(t, e.URL)
                },
                ispixel: function(t) {
                    return t instanceof e.Dimension && "px" === t.unit ? e.True : e.False
                },
                ispercentage: function(t) {
                    return t instanceof e.Dimension && "%" === t.unit ? e.True : e.False
                },
                isem: function(t) {
                    return t instanceof e.Dimension && "em" === t.unit ? e.True : e.False
                },
                _isa: function(t, i) {
                    return t instanceof i ? e.True : e.False
                },
                multiply: function(e, t) {
                    var i = e.rgb[0] * t.rgb[0] / 255,
                        n = e.rgb[1] * t.rgb[1] / 255,
                        r = e.rgb[2] * t.rgb[2] / 255;
                    return this.rgb(i, n, r)
                },
                screen: function(e, t) {
                    var i = 255 - (255 - e.rgb[0]) * (255 - t.rgb[0]) / 255,
                        n = 255 - (255 - e.rgb[1]) * (255 - t.rgb[1]) / 255,
                        r = 255 - (255 - e.rgb[2]) * (255 - t.rgb[2]) / 255;
                    return this.rgb(i, n, r)
                },
                overlay: function(e, t) {
                    var i = e.rgb[0] < 128 ? 2 * e.rgb[0] * t.rgb[0] / 255 : 255 - 2 * (255 - e.rgb[0]) * (255 - t.rgb[0]) / 255,
                        n = e.rgb[1] < 128 ? 2 * e.rgb[1] * t.rgb[1] / 255 : 255 - 2 * (255 - e.rgb[1]) * (255 - t.rgb[1]) / 255,
                        r = e.rgb[2] < 128 ? 2 * e.rgb[2] * t.rgb[2] / 255 : 255 - 2 * (255 - e.rgb[2]) * (255 - t.rgb[2]) / 255;
                    return this.rgb(i, n, r)
                },
                softlight: function(e, t) {
                    var i = t.rgb[0] * e.rgb[0] / 255,
                        n = i + e.rgb[0] * (255 - (255 - e.rgb[0]) * (255 - t.rgb[0]) / 255 - i) / 255;
                    i = t.rgb[1] * e.rgb[1] / 255;
                    var r = i + e.rgb[1] * (255 - (255 - e.rgb[1]) * (255 - t.rgb[1]) / 255 - i) / 255;
                    i = t.rgb[2] * e.rgb[2] / 255;
                    var o = i + e.rgb[2] * (255 - (255 - e.rgb[2]) * (255 - t.rgb[2]) / 255 - i) / 255;
                    return this.rgb(n, r, o)
                },
                hardlight: function(e, t) {
                    var i = t.rgb[0] < 128 ? 2 * t.rgb[0] * e.rgb[0] / 255 : 255 - 2 * (255 - t.rgb[0]) * (255 - e.rgb[0]) / 255,
                        n = t.rgb[1] < 128 ? 2 * t.rgb[1] * e.rgb[1] / 255 : 255 - 2 * (255 - t.rgb[1]) * (255 - e.rgb[1]) / 255,
                        r = t.rgb[2] < 128 ? 2 * t.rgb[2] * e.rgb[2] / 255 : 255 - 2 * (255 - t.rgb[2]) * (255 - e.rgb[2]) / 255;
                    return this.rgb(i, n, r)
                },
                difference: function(e, t) {
                    var i = Math.abs(e.rgb[0] - t.rgb[0]),
                        n = Math.abs(e.rgb[1] - t.rgb[1]),
                        r = Math.abs(e.rgb[2] - t.rgb[2]);
                    return this.rgb(i, n, r)
                },
                exclusion: function(e, t) {
                    var i = e.rgb[0] + t.rgb[0] * (255 - e.rgb[0] - e.rgb[0]) / 255,
                        n = e.rgb[1] + t.rgb[1] * (255 - e.rgb[1] - e.rgb[1]) / 255,
                        r = e.rgb[2] + t.rgb[2] * (255 - e.rgb[2] - e.rgb[2]) / 255;
                    return this.rgb(i, n, r)
                },
                average: function(e, t) {
                    var i = (e.rgb[0] + t.rgb[0]) / 2,
                        n = (e.rgb[1] + t.rgb[1]) / 2,
                        r = (e.rgb[2] + t.rgb[2]) / 2;
                    return this.rgb(i, n, r)
                },
                negation: function(e, t) {
                    var i = 255 - Math.abs(255 - t.rgb[0] - e.rgb[0]),
                        n = 255 - Math.abs(255 - t.rgb[1] - e.rgb[1]),
                        r = 255 - Math.abs(255 - t.rgb[2] - e.rgb[2]);
                    return this.rgb(i, n, r)
                },
                tint: function(e, t) {
                    return this.mix(this.rgb(255, 255, 255), e, t)
                },
                shade: function(e, t) {
                    return this.mix(this.rgb(0, 0, 0), e, t)
                }
            }
        }(t("./tree")),
        function(e) {
            e.colors = {
                aliceblue: "#f0f8ff",
                antiquewhite: "#faebd7",
                aqua: "#00ffff",
                aquamarine: "#7fffd4",
                azure: "#f0ffff",
                beige: "#f5f5dc",
                bisque: "#ffe4c4",
                black: "#000000",
                blanchedalmond: "#ffebcd",
                blue: "#0000ff",
                blueviolet: "#8a2be2",
                brown: "#a52a2a",
                burlywood: "#deb887",
                cadetblue: "#5f9ea0",
                chartreuse: "#7fff00",
                chocolate: "#d2691e",
                coral: "#ff7f50",
                cornflowerblue: "#6495ed",
                cornsilk: "#fff8dc",
                crimson: "#dc143c",
                cyan: "#00ffff",
                darkblue: "#00008b",
                darkcyan: "#008b8b",
                darkgoldenrod: "#b8860b",
                darkgray: "#a9a9a9",
                darkgrey: "#a9a9a9",
                darkgreen: "#006400",
                darkkhaki: "#bdb76b",
                darkmagenta: "#8b008b",
                darkolivegreen: "#556b2f",
                darkorange: "#ff8c00",
                darkorchid: "#9932cc",
                darkred: "#8b0000",
                darksalmon: "#e9967a",
                darkseagreen: "#8fbc8f",
                darkslateblue: "#483d8b",
                darkslategray: "#2f4f4f",
                darkslategrey: "#2f4f4f",
                darkturquoise: "#00ced1",
                darkviolet: "#9400d3",
                deeppink: "#ff1493",
                deepskyblue: "#00bfff",
                dimgray: "#696969",
                dimgrey: "#696969",
                dodgerblue: "#1e90ff",
                firebrick: "#b22222",
                floralwhite: "#fffaf0",
                forestgreen: "#228b22",
                fuchsia: "#ff00ff",
                gainsboro: "#dcdcdc",
                ghostwhite: "#f8f8ff",
                gold: "#ffd700",
                goldenrod: "#daa520",
                gray: "#808080",
                grey: "#808080",
                green: "#008000",
                greenyellow: "#adff2f",
                honeydew: "#f0fff0",
                hotpink: "#ff69b4",
                indianred: "#cd5c5c",
                indigo: "#4b0082",
                ivory: "#fffff0",
                khaki: "#f0e68c",
                lavender: "#e6e6fa",
                lavenderblush: "#fff0f5",
                lawngreen: "#7cfc00",
                lemonchiffon: "#fffacd",
                lightblue: "#add8e6",
                lightcoral: "#f08080",
                lightcyan: "#e0ffff",
                lightgoldenrodyellow: "#fafad2",
                lightgray: "#d3d3d3",
                lightgrey: "#d3d3d3",
                lightgreen: "#90ee90",
                lightpink: "#ffb6c1",
                lightsalmon: "#ffa07a",
                lightseagreen: "#20b2aa",
                lightskyblue: "#87cefa",
                lightslategray: "#778899",
                lightslategrey: "#778899",
                lightsteelblue: "#b0c4de",
                lightyellow: "#ffffe0",
                lime: "#00ff00",
                limegreen: "#32cd32",
                linen: "#faf0e6",
                magenta: "#ff00ff",
                maroon: "#800000",
                mediumaquamarine: "#66cdaa",
                mediumblue: "#0000cd",
                mediumorchid: "#ba55d3",
                mediumpurple: "#9370d8",
                mediumseagreen: "#3cb371",
                mediumslateblue: "#7b68ee",
                mediumspringgreen: "#00fa9a",
                mediumturquoise: "#48d1cc",
                mediumvioletred: "#c71585",
                midnightblue: "#191970",
                mintcream: "#f5fffa",
                mistyrose: "#ffe4e1",
                moccasin: "#ffe4b5",
                navajowhite: "#ffdead",
                navy: "#000080",
                oldlace: "#fdf5e6",
                olive: "#808000",
                olivedrab: "#6b8e23",
                orange: "#ffa500",
                orangered: "#ff4500",
                orchid: "#da70d6",
                palegoldenrod: "#eee8aa",
                palegreen: "#98fb98",
                paleturquoise: "#afeeee",
                palevioletred: "#d87093",
                papayawhip: "#ffefd5",
                peachpuff: "#ffdab9",
                peru: "#cd853f",
                pink: "#ffc0cb",
                plum: "#dda0dd",
                powderblue: "#b0e0e6",
                purple: "#800080",
                red: "#ff0000",
                rosybrown: "#bc8f8f",
                royalblue: "#4169e1",
                saddlebrown: "#8b4513",
                salmon: "#fa8072",
                sandybrown: "#f4a460",
                seagreen: "#2e8b57",
                seashell: "#fff5ee",
                sienna: "#a0522d",
                silver: "#c0c0c0",
                skyblue: "#87ceeb",
                slateblue: "#6a5acd",
                slategray: "#708090",
                slategrey: "#708090",
                snow: "#fffafa",
                springgreen: "#00ff7f",
                steelblue: "#4682b4",
                tan: "#d2b48c",
                teal: "#008080",
                thistle: "#d8bfd8",
                tomato: "#ff6347",
                turquoise: "#40e0d0",
                violet: "#ee82ee",
                wheat: "#f5deb3",
                white: "#ffffff",
                whitesmoke: "#f5f5f5",
                yellow: "#ffff00",
                yellowgreen: "#9acd32"
            }
        }(t("./tree")),
        function(e) {
            e.Alpha = function(e) {
                this.value = e
            }, e.Alpha.prototype = {
                toCSS: function() {
                    return "alpha(opacity=" + (this.value.toCSS ? this.value.toCSS() : this.value) + ")"
                },
                eval: function(e) {
                    return this.value.eval && (this.value = this.value.eval(e)), this
                }
            }
        }(t("../tree")),
        function(e) {
            e.Anonymous = function(e) {
                this.value = e.value || e
            }, e.Anonymous.prototype = {
                toCSS: function() {
                    return this.value
                },
                eval: function() {
                    return this
                },
                compare: function(e) {
                    if (!e.toCSS) return -1;
                    var t = this.toCSS(),
                        i = e.toCSS();
                    return t === i ? 0 : i > t ? -1 : 1
                }
            }
        }(t("../tree")),
        function(e) {
            e.Assignment = function(e, t) {
                this.key = e, this.value = t
            }, e.Assignment.prototype = {
                toCSS: function() {
                    return this.key + "=" + (this.value.toCSS ? this.value.toCSS() : this.value)
                },
                eval: function(t) {
                    return this.value.eval ? new e.Assignment(this.key, this.value.eval(t)) : this
                }
            }
        }(t("../tree")),
        function(e) {
            e.Call = function(e, t, i, n) {
                this.name = e, this.args = t, this.index = i, this.filename = n
            }, e.Call.prototype = {
                eval: function(t) {
                    var i, n = this.args.map(function(e) {
                        return e.eval(t)
                    });
                    if (this.name in e.functions) try {
                        if (i = e.functions[this.name].apply(e.functions, n), null != i) return i
                    } catch (r) {
                        throw {
                            type: r.type || "Runtime",
                            message: "error evaluating function `" + this.name + "`" + (r.message ? ": " + r.message : ""),
                            index: this.index,
                            filename: this.filename
                        }
                    }
                    return new e.Anonymous(this.name + "(" + n.map(function(e) {
                            return e.toCSS(t)
                        }).join(", ") + ")")
                },
                toCSS: function(e) {
                    return this.eval(e).toCSS()
                }
            }
        }(t("../tree")),
        function(e) {
            e.Color = function(e, t) {
                this.rgb = Array.isArray(e) ? e : 6 == e.length ? e.match(/.{2}/g).map(function(e) {
                    return parseInt(e, 16)
                }) : e.split("").map(function(e) {
                    return parseInt(e + e, 16)
                }), this.alpha = "number" == typeof t ? t : 1
            }, e.Color.prototype = {
                eval: function() {
                    return this
                },
                toCSS: function() {
                    return this.alpha < 1 ? "rgba(" + this.rgb.map(function(e) {
                        return Math.round(e)
                    }).concat(this.alpha).join(", ") + ")" : "#" + this.rgb.map(function(e) {
                        return e = Math.round(e), e = (e > 255 ? 255 : 0 > e ? 0 : e).toString(16), 1 === e.length ? "0" + e : e
                    }).join("")
                },
                operate: function(t, i) {
                    var n = [];
                    i instanceof e.Color || (i = i.toColor());
                    for (var r = 0; 3 > r; r++) n[r] = e.operate(t, this.rgb[r], i.rgb[r]);
                    return new e.Color(n, this.alpha + i.alpha)
                },
                toHSL: function() {
                    var e, t, i = this.rgb[0] / 255,
                        n = this.rgb[1] / 255,
                        r = this.rgb[2] / 255,
                        o = this.alpha,
                        s = Math.max(i, n, r),
                        a = Math.min(i, n, r),
                        l = (s + a) / 2,
                        c = s - a;
                    if (s === a) e = t = 0;
                    else {
                        switch (t = l > .5 ? c / (2 - s - a) : c / (s + a), s) {
                            case i:
                                e = (n - r) / c + (r > n ? 6 : 0);
                                break;
                            case n:
                                e = (r - i) / c + 2;
                                break;
                            case r:
                                e = (i - n) / c + 4
                        }
                        e /= 6
                    }
                    return {
                        h: 360 * e,
                        s: t,
                        l: l,
                        a: o
                    }
                },
                toARGB: function() {
                    var e = [Math.round(255 * this.alpha)].concat(this.rgb);
                    return "#" + e.map(function(e) {
                            return e = Math.round(e), e = (e > 255 ? 255 : 0 > e ? 0 : e).toString(16), 1 === e.length ? "0" + e : e
                        }).join("")
                },
                compare: function(e) {
                    return e.rgb && e.rgb[0] === this.rgb[0] && e.rgb[1] === this.rgb[1] && e.rgb[2] === this.rgb[2] && e.alpha === this.alpha ? 0 : -1
                }
            }
        }(t("../tree")),
        function(e) {
            e.Comment = function(e, t) {
                this.value = e, this.silent = !!t
            }, e.Comment.prototype = {
                toCSS: function(e) {
                    return e.compress ? "" : this.value
                },
                eval: function() {
                    return this
                }
            }
        }(t("../tree")),
        function(e) {
            e.Condition = function(e, t, i, n, r) {
                this.op = e.trim(), this.lvalue = t, this.rvalue = i, this.index = n, this.negate = r
            }, e.Condition.prototype.eval = function(e) {
                var t, i = this.lvalue.eval(e),
                    n = this.rvalue.eval(e),
                    r = this.index,
                    t = function(e) {
                        switch (e) {
                            case "and":
                                return i && n;
                            case "or":
                                return i || n;
                            default:
                                if (i.compare) t = i.compare(n);
                                else {
                                    if (!n.compare) throw {
                                        type: "Type",
                                        message: "Unable to perform comparison",
                                        index: r
                                    };
                                    t = n.compare(i)
                                }
                                switch (t) {
                                    case -1:
                                        return "<" === e || "=<" === e;
                                    case 0:
                                        return "=" === e || ">=" === e || "=<" === e;
                                    case 1:
                                        return ">" === e || ">=" === e
                                }
                        }
                    }(this.op);
                return this.negate ? !t : t
            }
        }(t("../tree")),
        function(e) {
            e.Dimension = function(e, t) {
                this.value = parseFloat(e), this.unit = t || null
            }, e.Dimension.prototype = {
                eval: function() {
                    return this
                },
                toColor: function() {
                    return new e.Color([this.value, this.value, this.value])
                },
                toCSS: function() {
                    var e = this.value + this.unit;
                    return e
                },
                operate: function(t, i) {
                    return new e.Dimension(e.operate(t, this.value, i.value), this.unit || i.unit)
                },
                compare: function(t) {
                    return t instanceof e.Dimension ? t.value > this.value ? -1 : t.value < this.value ? 1 : t.unit && this.unit !== t.unit ? -1 : 0 : -1
                }
            }
        }(t("../tree")),
        function(e) {
            e.Directive = function(t, i) {
                this.name = t, Array.isArray(i) ? (this.ruleset = new e.Ruleset([], i), this.ruleset.allowImports = !0) : this.value = i
            }, e.Directive.prototype = {
                toCSS: function(e, t) {
                    return this.ruleset ? (this.ruleset.root = !0, this.name + (t.compress ? "{" : " {\n  ") + this.ruleset.toCSS(e, t).trim().replace(/\n/g, "\n  ") + (t.compress ? "}" : "\n}\n")) : this.name + " " + this.value.toCSS() + ";\n"
                },
                eval: function(t) {
                    var i = this;
                    return this.ruleset && (t.frames.unshift(this), i = new e.Directive(this.name), i.ruleset = this.ruleset.eval(t), t.frames.shift()), i
                },
                variable: function(t) {
                    return e.Ruleset.prototype.variable.call(this.ruleset, t)
                },
                find: function() {
                    return e.Ruleset.prototype.find.apply(this.ruleset, arguments)
                },
                rulesets: function() {
                    return e.Ruleset.prototype.rulesets.apply(this.ruleset)
                }
            }
        }(t("../tree")),
        function(e) {
            e.Element = function(t, i, n) {
                this.combinator = t instanceof e.Combinator ? t : new e.Combinator(t), this.value = "string" == typeof i ? i.trim() : i ? i : "", this.index = n
            }, e.Element.prototype.eval = function(t) {
                return new e.Element(this.combinator, this.value.eval ? this.value.eval(t) : this.value, this.index)
            }, e.Element.prototype.toCSS = function(e) {
                var t = this.value.toCSS ? this.value.toCSS(e) : this.value;
                return "" == t && "&" == this.combinator.value.charAt(0) ? "" : this.combinator.toCSS(e || {}) + t
            }, e.Combinator = function(e) {
                this.value = " " === e ? " " : e ? e.trim() : ""
            }, e.Combinator.prototype.toCSS = function(e) {
                return {
                    "": "",
                    " ": " ",
                    ":": " :",
                    "+": e.compress ? "+" : " + ",
                    "~": e.compress ? "~" : " ~ ",
                    ">": e.compress ? ">" : " > ",
                    "|": e.compress ? "|" : " | "
                }[this.value]
            }
        }(t("../tree")),
        function(e) {
            e.Expression = function(e) {
                this.value = e
            }, e.Expression.prototype = {
                eval: function(t) {
                    return this.value.length > 1 ? new e.Expression(this.value.map(function(e) {
                        return e.eval(t)
                    })) : 1 === this.value.length ? this.value[0].eval(t) : this
                },
                toCSS: function(e) {
                    return this.value.map(function(t) {
                        return t.toCSS ? t.toCSS(e) : ""
                    }).join(" ")
                }
            }
        }(t("../tree")),
        function(e) {
            e.Import = function(t, i, n, r, o, s) {
                var a = this;
                this.once = r, this.index = o, this._path = t, this.features = n && new e.Value(n), this.rootpath = s, this.path = t instanceof e.Quoted ? /(\.[a-z]*$)|([\?;].*)$/.test(t.value) ? t.value : t.value + ".less" : t.value.value || t.value, this.css = /css([\?;].*)?$/.test(this.path), this.css || i.push(this.path, function(t, i, n) {
                    t && (t.index = o), n && a.once && (a.skip = n), a.root = i || new e.Ruleset([], [])
                })
            }, e.Import.prototype = {
                toCSS: function(e) {
                    var t = this.features ? " " + this.features.toCSS(e) : "";
                    return this.css ? ("string" == typeof this._path.value && !/^(?:[a-z-]+:|\/)/.test(this._path.value) && (this._path.value = this.rootpath + this._path.value), "@import " + this._path.toCSS() + t + ";\n") : ""
                },
                eval: function(t) {
                    {
                        var i;
                        this.features && this.features.eval(t)
                    }
                    return this.skip ? [] : this.css ? this : (i = new e.Ruleset([], this.root.rules.slice(0)), i.evalImports(t), this.features ? new e.Media(i.rules, this.features.value) : i.rules)
                }
            }
        }(t("../tree")),
        function(e) {
            e.JavaScript = function(e, t, i) {
                this.escaped = i, this.expression = e, this.index = t
            }, e.JavaScript.prototype = {
                eval: function(t) {
                    var i, n = this,
                        r = {},
                        o = this.expression.replace(/@\{([\w-]+)\}/g, function(i, r) {
                            return e.jsify(new e.Variable("@" + r, n.index).eval(t))
                        });
                    try {
                        o = new Function("return (" + o + ")")
                    } catch (s) {
                        throw {
                            message: "JavaScript evaluation error: `" + o + "`",
                            index: this.index
                        }
                    }
                    for (var a in t.frames[0].variables()) r[a.slice(1)] = {
                        value: t.frames[0].variables()[a].value,
                        toJS: function() {
                            return this.value.eval(t).toCSS()
                        }
                    };
                    try {
                        i = o.call(r)
                    } catch (s) {
                        throw {
                            message: "JavaScript evaluation error: '" + s.name + ": " + s.message + "'",
                            index: this.index
                        }
                    }
                    return "string" == typeof i ? new e.Quoted('"' + i + '"', i, this.escaped, this.index) : new e.Anonymous(Array.isArray(i) ? i.join(", ") : i)
                }
            }
        }(t("../tree")),
        function(e) {
            e.Keyword = function(e) {
                this.value = e
            }, e.Keyword.prototype = {
                eval: function() {
                    return this
                },
                toCSS: function() {
                    return this.value
                },
                compare: function(t) {
                    return t instanceof e.Keyword ? t.value === this.value ? 0 : 1 : -1
                }
            }, e.True = new e.Keyword("true"), e.False = new e.Keyword("false")
        }(t("../tree")),
        function(e) {
            e.Media = function(t, i) {
                var n = this.emptySelectors();
                this.features = new e.Value(i), this.ruleset = new e.Ruleset(n, t), this.ruleset.allowImports = !0
            }, e.Media.prototype = {
                toCSS: function(e, t) {
                    var i = this.features.toCSS(t);
                    return this.ruleset.root = 0 === e.length || e[0].multiMedia, "@media " + i + (t.compress ? "{" : " {\n  ") + this.ruleset.toCSS(e, t).trim().replace(/\n/g, "\n  ") + (t.compress ? "}" : "\n}\n")
                },
                eval: function(t) {
                    t.mediaBlocks || (t.mediaBlocks = [], t.mediaPath = []);
                    var i = new e.Media([], []);
                    return this.debugInfo && (this.ruleset.debugInfo = this.debugInfo, i.debugInfo = this.debugInfo), i.features = this.features.eval(t), t.mediaPath.push(i), t.mediaBlocks.push(i), t.frames.unshift(this.ruleset), i.ruleset = this.ruleset.eval(t), t.frames.shift(), t.mediaPath.pop(), 0 === t.mediaPath.length ? i.evalTop(t) : i.evalNested(t)
                },
                variable: function(t) {
                    return e.Ruleset.prototype.variable.call(this.ruleset, t)
                },
                find: function() {
                    return e.Ruleset.prototype.find.apply(this.ruleset, arguments)
                },
                rulesets: function() {
                    return e.Ruleset.prototype.rulesets.apply(this.ruleset)
                },
                emptySelectors: function() {
                    var t = new e.Element("", "&", 0);
                    return [new e.Selector([t])]
                },
                evalTop: function(t) {
                    var i = this;
                    if (t.mediaBlocks.length > 1) {
                        var n = this.emptySelectors();
                        i = new e.Ruleset(n, t.mediaBlocks), i.multiMedia = !0
                    }
                    return delete t.mediaBlocks, delete t.mediaPath, i
                },
                evalNested: function(t) {
                    var i, n, r = t.mediaPath.concat([this]);
                    for (i = 0; i < r.length; i++) n = r[i].features instanceof e.Value ? r[i].features.value : r[i].features, r[i] = Array.isArray(n) ? n : [n];
                    return this.features = new e.Value(this.permute(r).map(function(t) {
                        for (t = t.map(function(t) {
                            return t.toCSS ? t : new e.Anonymous(t)
                        }), i = t.length - 1; i > 0; i--) t.splice(i, 0, new e.Anonymous("and"));
                        return new e.Expression(t)
                    })), new e.Ruleset([], [])
                },
                permute: function(e) {
                    if (0 === e.length) return [];
                    if (1 === e.length) return e[0];
                    for (var t = [], i = this.permute(e.slice(1)), n = 0; n < i.length; n++)
                        for (var r = 0; r < e[0].length; r++) t.push([e[0][r]].concat(i[n]));
                    return t
                },
                bubbleSelectors: function(t) {
                    this.ruleset = new e.Ruleset(t.slice(0), [this.ruleset])
                }
            }
        }(t("../tree")),
        function(e) {
            e.mixin = {}, e.mixin.Call = function(t, i, n, r, o) {
                this.selector = new e.Selector(t), this.arguments = i, this.index = n, this.filename = r, this.important = o
            }, e.mixin.Call.prototype = {
                eval: function(t) {
                    var i, n, r, o, s, a, l, c, d = [],
                        h = !1;
                    for (r = this.arguments && this.arguments.map(function(e) {
                            return {
                                name: e.name,
                                value: e.value.eval(t)
                            }
                        }), o = 0; o < t.frames.length; o++)
                        if ((i = t.frames[o].find(this.selector)).length > 0) {
                            for (c = !0, s = 0; s < i.length; s++) {
                                for (n = i[s], l = !1, a = 0; a < t.frames.length; a++)
                                    if (!(n instanceof e.mixin.Definition) && n === (t.frames[a].originalRuleset || t.frames[a])) {
                                        l = !0;
                                        break
                                    }
                                if (!l && n.matchArgs(r, t)) {
                                    if (!n.matchCondition || n.matchCondition(r, t)) try {
                                        Array.prototype.push.apply(d, n.eval(t, r, this.important).rules)
                                    } catch (u) {
                                        throw {
                                            message: u.message,
                                            index: this.index,
                                            filename: this.filename,
                                            stack: u.stack
                                        }
                                    }
                                    h = !0
                                }
                            }
                            if (h) return d
                        }
                    throw c ? {
                        type: "Runtime",
                        message: "No matching definition was found for `" + this.selector.toCSS().trim() + "(" + (r ? r.map(function(e) {
                            var t = "";
                            return e.name && (t += e.name + ":"), t += e.value.toCSS ? e.value.toCSS() : "???"
                        }).join(", ") : "") + ")`",
                        index: this.index,
                        filename: this.filename
                    } : {
                        type: "Name",
                        message: this.selector.toCSS().trim() + " is undefined",
                        index: this.index,
                        filename: this.filename
                    }
                }
            }, e.mixin.Definition = function(t, i, n, r, o) {
                this.name = t, this.selectors = [new e.Selector([new e.Element(null, t)])], this.params = i, this.condition = r, this.variadic = o, this.arity = i.length, this.rules = n, this._lookups = {}, this.required = i.reduce(function(e, t) {
                    return !t.name || t.name && !t.value ? e + 1 : e
                }, 0), this.parent = e.Ruleset.prototype, this.frames = []
            }, e.mixin.Definition.prototype = {
                toCSS: function() {
                    return ""
                },
                variable: function(e) {
                    return this.parent.variable.call(this, e)
                },
                variables: function() {
                    return this.parent.variables.call(this)
                },
                find: function() {
                    return this.parent.find.apply(this, arguments)
                },
                rulesets: function() {
                    return this.parent.rulesets.apply(this)
                },
                evalParams: function(t, i, n, r) {
                    var o, s, a, l, c, d, h, u, p = new e.Ruleset(null, []),
                        m = this.params.slice(0);
                    if (n)
                        for (n = n.slice(0), a = 0; a < n.length; a++)
                            if (s = n[a], d = s && s.name) {
                                for (h = !1, l = 0; l < m.length; l++)
                                    if (!r[l] && d === m[l].name) {
                                        r[l] = s.value.eval(t), p.rules.unshift(new e.Rule(d, s.value.eval(t))), h = !0;
                                        break
                                    }
                                if (h) {
                                    n.splice(a, 1), a--;
                                    continue
                                }
                                throw {
                                    type: "Runtime",
                                    message: "Named argument for " + this.name + " " + n[a].name + " not found"
                                }
                            }
                    for (u = 0, a = 0; a < m.length; a++)
                        if (!r[a]) {
                            if (s = n && n[u], d = m[a].name)
                                if (m[a].variadic && n) {
                                    for (o = [], l = u; l < n.length; l++) o.push(n[l].value.eval(t));
                                    p.rules.unshift(new e.Rule(d, new e.Expression(o).eval(t)))
                                } else {
                                    if (c = s && s.value) c = c.eval(t);
                                    else {
                                        if (!m[a].value) throw {
                                            type: "Runtime",
                                            message: "wrong number of arguments for " + this.name + " (" + n.length + " for " + this.arity + ")"
                                        };
                                        c = m[a].value.eval(i)
                                    }
                                    p.rules.unshift(new e.Rule(d, c)), r[a] = c
                                }
                            if (m[a].variadic && n)
                                for (l = u; l < n.length; l++) r[l] = n[l].value.eval(t);
                            u++
                        }
                    return p
                },
                eval: function(t, i, n) {
                    var r, o, s = [],
                        a = this.frames.concat(t.frames),
                        l = this.evalParams(t, {
                            frames: a
                        }, i, s);
                    return l.rules.unshift(new e.Rule("@arguments", new e.Expression(s).eval(t))), r = n ? this.parent.makeImportant.apply(this).rules : this.rules.slice(0), o = new e.Ruleset(null, r).eval({
                        frames: [this, l].concat(a)
                    }), o.originalRuleset = this, o
                },
                matchCondition: function(e, t) {
                    return this.condition && !this.condition.eval({
                        frames: [this.evalParams(t, {
                            frames: this.frames.concat(t.frames)
                        }, e, [])].concat(t.frames)
                    }) ? !1 : !0
                },
                matchArgs: function(e, t) {
                    var i, n = e && e.length || 0;
                    if (!this.variadic) {
                        if (n < this.required) return !1;
                        if (n > this.params.length) return !1;
                        if (this.required > 0 && n > this.params.length) return !1
                    }
                    i = Math.min(n, this.arity);
                    for (var r = 0; i > r; r++)
                        if (!this.params[r].name && !this.params[r].variadic && e[r].value.eval(t).toCSS() != this.params[r].value.eval(t).toCSS()) return !1;
                    return !0
                }
            }
        }(t("../tree")),
        function(e) {
            e.Operation = function(e, t) {
                this.op = e.trim(), this.operands = t
            }, e.Operation.prototype.eval = function(t) {
                var i, n = this.operands[0].eval(t),
                    r = this.operands[1].eval(t);
                if (n instanceof e.Dimension && r instanceof e.Color) {
                    if ("*" !== this.op && "+" !== this.op) throw {
                        name: "OperationError",
                        message: "Can't substract or divide a color from a number"
                    };
                    i = r, r = n, n = i
                }
                if (!n.operate) throw {
                    name: "OperationError",
                    message: "Operation on an invalid type"
                };
                return n.operate(this.op, r)
            }, e.operate = function(e, t, i) {
                switch (e) {
                    case "+":
                        return t + i;
                    case "-":
                        return t - i;
                    case "*":
                        return t * i;
                    case "/":
                        return t / i
                }
            }
        }(t("../tree")),
        function(e) {
            e.Paren = function(e) {
                this.value = e
            }, e.Paren.prototype = {
                toCSS: function(e) {
                    return "(" + this.value.toCSS(e) + ")"
                },
                eval: function(t) {
                    return new e.Paren(this.value.eval(t))
                }
            }
        }(t("../tree")),
        function(e) {
            e.Quoted = function(e, t, i, n) {
                this.escaped = i, this.value = t || "", this.quote = e.charAt(0), this.index = n
            }, e.Quoted.prototype = {
                toCSS: function() {
                    return this.escaped ? this.value : this.quote + this.value + this.quote
                },
                eval: function(t) {
                    var i = this,
                        n = this.value.replace(/`([^`]+)`/g, function(n, r) {
                            return new e.JavaScript(r, i.index, !0).eval(t).value
                        }).replace(/@\{([\w-]+)\}/g, function(n, r) {
                            var o = new e.Variable("@" + r, i.index).eval(t);
                            return o instanceof e.Quoted ? o.value : o.toCSS()
                        });
                    return new e.Quoted(this.quote + n + this.quote, n, this.escaped, this.index)
                },
                compare: function(e) {
                    if (!e.toCSS) return -1;
                    var t = this.toCSS(),
                        i = e.toCSS();
                    return t === i ? 0 : i > t ? -1 : 1
                }
            }
        }(t("../tree")),
        function(e) {
            e.Ratio = function(e) {
                this.value = e
            }, e.Ratio.prototype = {
                toCSS: function() {
                    return this.value
                },
                eval: function() {
                    return this
                }
            }
        }(t("../tree")),
        function(e) {
            e.Rule = function(t, i, n, r, o) {
                this.name = t, this.value = i instanceof e.Value ? i : new e.Value([i]), this.important = n ? " " + n.trim() : "", this.index = r, this.inline = o || !1, this.variable = "@" === t.charAt(0) ? !0 : !1
            }, e.Rule.prototype.toCSS = function(e) {
                return this.variable ? "" : this.name + (e.compress ? ":" : ": ") + this.value.toCSS(e) + this.important + (this.inline ? "" : ";")
            }, e.Rule.prototype.eval = function(t) {
                return new e.Rule(this.name, this.value.eval(t), this.important, this.index, this.inline)
            }, e.Rule.prototype.makeImportant = function() {
                return new e.Rule(this.name, this.value, "!important", this.index, this.inline)
            }, e.Shorthand = function(e, t) {
                this.a = e, this.b = t
            }, e.Shorthand.prototype = {
                toCSS: function(e) {
                    return this.a.toCSS(e) + "/" + this.b.toCSS(e)
                },
                eval: function() {
                    return this
                }
            }
        }(t("../tree")),
        function(e) {
            e.Ruleset = function(e, t, i) {
                this.selectors = e, this.rules = t, this._lookups = {}, this.strictImports = i
            }, e.Ruleset.prototype = {
                eval: function(t) {
                    var i, n = this.selectors && this.selectors.map(function(e) {
                                return e.eval(t)
                            }),
                        r = new e.Ruleset(n, this.rules.slice(0), this.strictImports);
                    r.originalRuleset = this, r.root = this.root, r.allowImports = this.allowImports, this.debugInfo && (r.debugInfo = this.debugInfo), t.frames.unshift(r), (r.root || r.allowImports || !r.strictImports) && r.evalImports(t);
                    for (var o = 0; o < r.rules.length; o++) r.rules[o] instanceof e.mixin.Definition && (r.rules[o].frames = t.frames.slice(0));
                    for (var s = t.mediaBlocks && t.mediaBlocks.length || 0, o = 0; o < r.rules.length; o++) r.rules[o] instanceof e.mixin.Call && (i = r.rules[o].eval(t), r.rules.splice.apply(r.rules, [o, 1].concat(i)), o += i.length - 1, r.resetCache());
                    for (var a, o = 0; o < r.rules.length; o++) a = r.rules[o], a instanceof e.mixin.Definition || (r.rules[o] = a.eval ? a.eval(t) : a);
                    if (t.frames.shift(), t.mediaBlocks)
                        for (var o = s; o < t.mediaBlocks.length; o++) t.mediaBlocks[o].bubbleSelectors(n);
                    return r
                },
                evalImports: function(t) {
                    var i, n;
                    for (i = 0; i < this.rules.length; i++) this.rules[i] instanceof e.Import && (n = this.rules[i].eval(t), "number" == typeof n.length ? (this.rules.splice.apply(this.rules, [i, 1].concat(n)), i += n.length - 1) : this.rules.splice(i, 1, n), this.resetCache())
                },
                makeImportant: function() {
                    return new e.Ruleset(this.selectors, this.rules.map(function(e) {
                        return e.makeImportant ? e.makeImportant() : e
                    }), this.strictImports)
                },
                matchArgs: function(e) {
                    return !e || 0 === e.length
                },
                resetCache: function() {
                    this._rulesets = null, this._variables = null, this._lookups = {}
                },
                variables: function() {
                    return this._variables ? this._variables : this._variables = this.rules.reduce(function(t, i) {
                        return i instanceof e.Rule && i.variable === !0 && (t[i.name] = i), t
                    }, {})
                },
                variable: function(e) {
                    return this.variables()[e]
                },
                rulesets: function() {
                    return this._rulesets ? this._rulesets : this._rulesets = this.rules.filter(function(t) {
                        return t instanceof e.Ruleset || t instanceof e.mixin.Definition
                    })
                },
                find: function(t, i) {
                    i = i || this;
                    var n, r = [],
                        o = t.toCSS();
                    return o in this._lookups ? this._lookups[o] : (this.rulesets().forEach(function(o) {
                        if (o !== i)
                            for (var s = 0; s < o.selectors.length; s++)
                                if (n = t.match(o.selectors[s])) {
                                    t.elements.length > o.selectors[s].elements.length ? Array.prototype.push.apply(r, o.find(new e.Selector(t.elements.slice(1)), i)) : r.push(o);
                                    break
                                }
                    }), this._lookups[o] = r)
                },
                toCSS: function(t, i) {
                    var n, r, o, s = [],
                        a = [],
                        l = [],
                        c = [],
                        d = [];
                    this.root || this.joinSelectors(d, t, this.selectors);
                    for (var h = 0; h < this.rules.length; h++)
                        if (o = this.rules[h], o.rules || o instanceof e.Media) c.push(o.toCSS(d, i));
                        else if (o instanceof e.Directive) {
                            var u = o.toCSS(d, i);
                            if ("@charset" === o.name) {
                                if (i.charset) {
                                    o.debugInfo && (c.push(e.debugInfo(i, o)), c.push(new e.Comment("/* " + u.replace(/\n/g, "") + " */\n").toCSS(i)));
                                    continue
                                }
                                i.charset = !0
                            }
                            c.push(u)
                        } else o instanceof e.Comment ? o.silent || (this.root ? c.push(o.toCSS(i)) : a.push(o.toCSS(i))) : o.toCSS && !o.variable ? a.push(o.toCSS(i)) : o.value && !o.variable && a.push(o.value.toString());
                    if (c = c.join(""), this.root) s.push(a.join(i.compress ? "" : "\n"));
                    else if (a.length > 0) {
                        r = e.debugInfo(i, this), n = d.map(function(e) {
                            return e.map(function(e) {
                                return e.toCSS(i)
                            }).join("").trim()
                        }).join(i.compress ? "," : ",\n");
                        for (var h = a.length - 1; h >= 0; h--) - 1 === l.indexOf(a[h]) && l.unshift(a[h]);
                        a = l, s.push(r + n + (i.compress ? "{" : " {\n  ") + a.join(i.compress ? "" : "\n  ") + (i.compress ? "}" : "\n}\n"))
                    }
                    return s.push(c), s.join("") + (i.compress ? "\n" : "")
                },
                joinSelectors: function(e, t, i) {
                    for (var n = 0; n < i.length; n++) this.joinSelector(e, t, i[n])
                },
                joinSelector: function(t, i, n) {
                    var r, o, s, a, l, c, d, h, u, p, m, g, f, b, v;
                    for (r = 0; r < n.elements.length; r++) c = n.elements[r], "&" === c.value && (a = !0);
                    if (a) {
                        for (b = [], l = [
                            []
                        ], r = 0; r < n.elements.length; r++)
                            if (c = n.elements[r], "&" !== c.value) b.push(c);
                            else {
                                for (v = [], b.length > 0 && this.mergeElementsOnToSelectors(b, l), o = 0; o < l.length; o++)
                                    if (d = l[o], 0 == i.length) d.length > 0 && (d[0].elements = d[0].elements.slice(0), d[0].elements.push(new e.Element(c.combinator, "", 0))), v.push(d);
                                    else
                                        for (s = 0; s < i.length; s++) h = i[s], u = [], p = [], g = !0, d.length > 0 ? (u = d.slice(0), f = u.pop(), m = new e.Selector(f.elements.slice(0)), g = !1) : m = new e.Selector([]), h.length > 1 && (p = p.concat(h.slice(1))), h.length > 0 && (g = !1, m.elements.push(new e.Element(c.combinator, h[0].elements[0].value, 0)), m.elements = m.elements.concat(h[0].elements.slice(1))), g || u.push(m), u = u.concat(p), v.push(u);
                                l = v, b = []
                            }
                        for (b.length > 0 && this.mergeElementsOnToSelectors(b, l), r = 0; r < l.length; r++) t.push(l[r])
                    } else if (i.length > 0)
                        for (r = 0; r < i.length; r++) t.push(i[r].concat(n));
                    else t.push([n])
                },
                mergeElementsOnToSelectors: function(t, i) {
                    var n, r;
                    if (0 == i.length) return void i.push([new e.Selector(t)]);
                    for (n = 0; n < i.length; n++) r = i[n], r.length > 0 ? r[r.length - 1] = new e.Selector(r[r.length - 1].elements.concat(t)) : r.push(new e.Selector(t))
                }
            }
        }(t("../tree")),
        function(e) {
            e.Selector = function(e) {
                this.elements = e
            }, e.Selector.prototype.match = function(e) {
                var t, i, n, r, o = this.elements,
                    s = o.length;
                if (t = e.elements.slice(e.elements.length && "&" === e.elements[0].value ? 1 : 0), i = t.length, n = Math.min(s, i), 0 === i || i > s) return !1;
                for (r = 0; n > r; r++)
                    if (o[r].value !== t[r].value) return !1;
                return !0
            }, e.Selector.prototype.eval = function(t) {
                return new e.Selector(this.elements.map(function(e) {
                    return e.eval(t)
                }))
            }, e.Selector.prototype.toCSS = function(e) {
                return this._css ? this._css : (this._css = "" === this.elements[0].combinator.value ? " " : "", this._css += this.elements.map(function(t) {
                    return "string" == typeof t ? " " + t.trim() : t.toCSS(e)
                }).join(""), this._css)
            }
        }(t("../tree")),
        function(e) {
            e.UnicodeDescriptor = function(e) {
                this.value = e
            }, e.UnicodeDescriptor.prototype = {
                toCSS: function() {
                    return this.value
                },
                eval: function() {
                    return this
                }
            }
        }(t("../tree")),
        function(e) {
            e.URL = function(e, t) {
                this.value = e, this.rootpath = t
            }, e.URL.prototype = {
                toCSS: function() {
                    return "url(" + this.value.toCSS() + ")"
                },
                eval: function(t) {
                    var i, n = this.value.eval(t);
                    return "string" == typeof n.value && !/^(?:[a-z-]+:|\/)/.test(n.value) && (i = this.rootpath, n.quote || (i = i.replace(/[\(\)'"\s]/g, function(e) {
                        return "\\" + e
                    })), n.value = i + n.value), new e.URL(n, this.rootpath)
                }
            }
        }(t("../tree")),
        function(e) {
            e.Value = function(e) {
                this.value = e, this.is = "value"
            }, e.Value.prototype = {
                eval: function(t) {
                    return 1 === this.value.length ? this.value[0].eval(t) : new e.Value(this.value.map(function(e) {
                        return e.eval(t)
                    }))
                },
                toCSS: function(e) {
                    return this.value.map(function(t) {
                        return t.toCSS(e)
                    }).join(e.compress ? "," : ", ")
                }
            }
        }(t("../tree")),
        function(e) {
            e.Variable = function(e, t, i) {
                this.name = e, this.index = t, this.file = i
            }, e.Variable.prototype = {
                eval: function(t) {
                    var i, n, r = this.name;
                    if (0 == r.indexOf("@@") && (r = "@" + new e.Variable(r.slice(1)).eval(t).value), this.evaluating) throw {
                        type: "Name",
                        message: "Recursive variable definition for " + r,
                        filename: this.file,
                        index: this.index
                    };
                    if (this.evaluating = !0, i = e.find(t.frames, function(e) {
                            return (n = e.variable(r)) ? n.value.eval(t) : void 0
                        })) return this.evaluating = !1, i;
                    throw {
                        type: "Name",
                        message: "variable " + r + " is undefined",
                        filename: this.file,
                        index: this.index
                    }
                }
            }
        }(t("../tree")),
        function(e) {
            e.debugInfo = function(t, i) {
                var n = "";
                if (t.dumpLineNumbers && !t.compress) switch (t.dumpLineNumbers) {
                    case "comments":
                        n = e.debugInfo.asComment(i);
                        break;
                    case "mediaquery":
                        n = e.debugInfo.asMediaQuery(i);
                        break;
                    case "all":
                        n = e.debugInfo.asComment(i) + e.debugInfo.asMediaQuery(i)
                }
                return n
            }, e.debugInfo.asComment = function(e) {
                return "/* line " + e.debugInfo.lineNumber + ", " + e.debugInfo.fileName + " */\n"
            }, e.debugInfo.asMediaQuery = function(e) {
                return "@media -sass-debug-info{filename{font-family:" + ("file://" + e.debugInfo.fileName).replace(/[\/:.]/g, "\\$&") + "}line{font-family:\\00003" + e.debugInfo.lineNumber + "}}\n"
            }, e.find = function(e, t) {
                for (var i, n = 0; n < e.length; n++)
                    if (i = t.call(e, e[n])) return i;
                return null
            }, e.jsify = function(e) {
                return Array.isArray(e.value) && e.value.length > 1 ? "[" + e.value.map(function(e) {
                    return e.toCSS(!1)
                }).join(", ") + "]" : e.toCSS(!1)
            }
        }(t("./tree"));
    var b = /^(file|chrome(-extension)?|resource|qrc|app):/.test(location.protocol);
    if (g.env = g.env || ("127.0.0.1" == location.hostname || "0.0.0.0" == location.hostname || "localhost" == location.hostname || location.port.length > 0 || b ? "development" : "production"), g.async = g.async || !1, g.fileAsync = g.fileAsync || !1, g.poll = g.poll || (b ? 1e3 : 1500), g.functions)
        for (var v in g.functions) g.tree.functions[v] = g.functions[v];
    var C = /!dumpLineNumbers:(comments|mediaquery|all)/.exec(location.hash);
    C && (g.dumpLineNumbers = C[1]), g.watch = function() {
        return g.watchMode || (g.env = "development", i()), this.watchMode = !0
    }, g.unwatch = function() {
        return clearInterval(g.watchTimer), this.watchMode = !1
    }, /!watch/.test(location.hash) && g.watch();
    var y = null;
    if ("development" != g.env) try {
        y = "undefined" == typeof e.localStorage ? null : e.localStorage
    } catch (w) {}
    var S = document.getElementsByTagName("link"),
        _ = /^text\/(x-)?less$/;
    g.sheets = [];
    for (var k = 0; k < S.length; k++)("stylesheet/less" === S[k].rel || S[k].rel.match(/stylesheet/) && S[k].type.match(_)) && g.sheets.push(S[k]);
    var E = "";
    g.modifyVars = function(e) {
        var t = E;
        for (name in e) t += ("@" === name.slice(0, 1) ? "" : "@") + name + ": " + (";" === e[name].slice(-1) ? e[name] : e[name] + ";");
        (new g.Parser).parse(t, function(e, t) {
            c(t.toCSS(), g.sheets[g.sheets.length - 1])
        })
    }, g.refresh = function(e) {
        var t, i;
        t = i = new Date, r(function(e, n, r, o, s) {
            s.local ? p("loading " + o.href + " from cache.") : (p("parsed " + o.href + " successfully."), c(n.toCSS(), o, s.lastModified)), p("css for " + o.href + " generated in " + (new Date - i) + "ms"), 0 === s.remaining && p("css generated in " + (new Date - t) + "ms"), i = new Date
        }, e), n()
    }, g.refreshStyles = n, g.refresh("development" === g.env), "function" == typeof define && define.amd && define("less", [], function() {
        return g
    })
}(window);

module.exports = { less };

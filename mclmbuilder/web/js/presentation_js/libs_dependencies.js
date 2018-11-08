/********************************** start modernizr.min.js *****************************/
! function(t, e, i) {
    function n(t, e) {
        return typeof t === e
    }

    function s() {
        var t, e, i, s, o, a, r;
        for (var l in b) {
            if (t = [], e = b[l], e.name && (t.push(e.name.toLowerCase()), e.options && e.options.aliases && e.options.aliases.length))
                for (i = 0; i < e.options.aliases.length; i++) t.push(e.options.aliases[i].toLowerCase());
            for (s = n(e.fn, "function") ? e.fn() : e.fn, o = 0; o < t.length; o++) a = t[o], r = a.split("."), 1 === r.length ? y[r[0]] = s : 2 === r.length && (!y[r[0]] || y[r[0]] instanceof Boolean || (y[r[0]] = new Boolean(y[r[0]])), y[r[0]][r[1]] = s), v.push((s ? "" : "no-") + r.join("-"))
        }
    }

    function o(t) {
        var e = T.className,
            i = y._config.classPrefix || "",
            n = new RegExp("(^|\\s)" + i + "no-js(\\s|$)");
        e = e.replace(n, "$1" + i + "js$2"), y._config.enableClasses && (e += " " + i + t.join(" " + i), T.className = e)
    }

    function a() {
        var t = e.body;
        return t || (t = w("body"), t.fake = !0), t
    }

    function r(t, e, i, n) {
        var s, o, r, l, c = "modernizr",
            d = w("div"),
            h = a();
        if (parseInt(i, 10))
            for (; i--;) r = w("div"), r.id = n ? n[i] : c + (i + 1), d.appendChild(r);
        return s = ["\xad", '<style id="s', c, '">', t, "</style>"].join(""), d.id = c, (h.fake ? h : d).innerHTML += s, h.appendChild(d), h.fake && (h.style.background = "", h.style.overflow = "hidden", l = T.style.overflow, T.style.overflow = "hidden", T.appendChild(h)), o = e(d, t), h.fake ? (h.parentNode.removeChild(h), T.style.overflow = l, T.offsetHeight) : d.parentNode.removeChild(d), !!o
    }

    function l(t, e) {
        return !!~("" + t).indexOf(e)
    }

    function c(t) {
        return t.replace(/([a-z])-([a-z])/g, function(t, e, i) {
            return e + i.toUpperCase()
        }).replace(/^-/, "")
    }

    function d(t) {
        return t.replace(/([A-Z])/g, function(t, e) {
            return "-" + e.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }

    function h(e, n) {
        var s = e.length;
        if ("CSS" in t && "supports" in t.CSS) {
            for (; s--;)
                if (t.CSS.supports(d(e[s]), n)) return !0;
            return !1
        }
        if ("CSSSupportsRule" in t) {
            for (var o = []; s--;) o.push("(" + d(e[s]) + ":" + n + ")");
            return o = o.join(" or "), r("@supports (" + o + ") { #modernizr { position: absolute; } }", function(e) {
                return "absolute" == (t.getComputedStyle ? getComputedStyle(e, null) : e.currentStyle).position
            })
        }
        return i
    }

    function u(t, e, s, o) {
        function a() {
            c && (delete x.style, delete x.modElem)
        }
        if (o = n(o, "undefined") ? !1 : o, !n(s, "undefined")) {
            var r = h(t, s);
            if (!n(r, "undefined")) return r
        }
        var c, d, u, p;
        x.style || (c = !0, x.modElem = w("modernizr"), x.style = x.modElem.style);
        for (d in t)
            if (u = t[d], p = x.style[u], !l(u, "-") && x.style[u] !== i) {
                if (o || n(s, "undefined")) return a(), "pfx" == e ? u : !0;
                try {
                    x.style[u] = s
                } catch (f) {}
                if (x.style[u] != p) return a(), "pfx" == e ? u : !0
            }
        return a(), !1
    }

    function p(t, e) {
        return function() {
            return t.apply(e, arguments)
        }
    }

    function f(t, e, i) {
        var s;
        for (var o in t)
            if (t[o] in e) return i === !1 ? t[o] : (s = e[t[o]], n(s, "function") ? p(s, i || e) : s);
        return !1
    }

    function m(t, e, i, s, o) {
        var a = t.charAt(0).toUpperCase() + t.slice(1),
            r = (t + " " + C.join(a + " ") + a).split(" ");
        return n(e, "string") || n(e, "undefined") ? u(r, e, s, o) : (r = (t + " " + _.join(a + " ") + a).split(" "), f(r, e, i))
    }

    function g(t, e, n) {
        return m(t, i, i, e, n)
    }
    var v = [],
        b = [],
        S = {
            _version: "v3.0.0pre",
            _config: {
                classPrefix: "mz-",
                enableClasses: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function(t, e) {
                setTimeout(function() {
                    e(this[t])
                }, 0)
            },
            addTest: function(t, e, i) {
                b.push({
                    name: t,
                    fn: e,
                    options: i
                })
            },
            addAsyncTest: function(t) {
                b.push({
                    name: null,
                    fn: t
                })
            }
        },
        y = function() {};
    y.prototype = S, y = new y, y.addTest("applicationcache", "applicationCache" in t), y.addTest("history", function() {
        var e = navigator.userAgent;
        return -1 === e.indexOf("Android 2.") && -1 === e.indexOf("Android 4.0") || -1 === e.indexOf("Mobile Safari") || -1 !== e.indexOf("Chrome") ? t.history && "pushState" in t.history : !1
    }), y.addTest("localstorage", function() {
        var t = "modernizr";
        try {
            return localStorage.setItem(t, t), localStorage.removeItem(t), !0
        } catch (e) {
            return !1
        }
    }), y.addTest("svg", !!e.createElementNS && !!e.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect);
    var E = S._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
    S._prefixes = E;
    var T = e.documentElement,
        L = "Webkit Moz O ms",
        _ = S._config.usePrefixes ? L.toLowerCase().split(" ") : [];
    S._domPrefixes = _;
    var w = function() {
        return e.createElement.apply(e, arguments)
    };
    y.addTest("opacity", function() {
        var t = w("div"),
            e = t.style;
        return e.cssText = E.join("opacity:.55;"), /^0.55$/.test(e.opacity)
    }), y.addTest("rgba", function() {
        var t = w("div"),
            e = t.style;
        return e.cssText = "background-color:rgba(150,255,150,.5)", ("" + e.backgroundColor).indexOf("rgba") > -1
    });
    var k = S.testStyles = r,
        C = S._config.usePrefixes ? L.split(" ") : [];
    S._cssomPrefixes = C;
    var A = {
        elem: w("modernizr")
    };
    y._q.push(function() {
        delete A.elem
    });
    var x = {
        style: A.elem.style
    };
    y._q.unshift(function() {
        delete x.style
    });
    S.testProp = function(t, e, n) {
        return u([t], i, e, n)
    };
    S.testAllProps = m, S.testAllProps = g, y.addTest("backgroundsize", g("backgroundSize", "100%", !0)), y.addTest("cssanimations", g("animationName", "a", !0)), y.addTest("csstransforms", g("transform", "scale(1)", !0)), y.addTest("csstransforms3d", function() {
        var t = !!g("perspective", "1px", !0),
            e = y._config.usePrefixes;
        if (t && (!e || "webkitPerspective" in T.style)) {
            var i = "@media (transform-3d)";
            e && (i += ",(-webkit-transform-3d)"), i += "{#modernizr{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}", k(i, function(e) {
                t = 9 === e.offsetLeft && 5 === e.offsetHeight
            })
        }
        return t
    }), y.addTest("csstransitions", g("transition", "all", !0)), y.addTest("flexbox", g("flexBasis", "1px", !0)), y.addTest("flexboxlegacy", g("boxDirection", "reverse", !0));
    var D = S.prefixed = function(t, e, i) {
        return -1 != t.indexOf("-") && (t = c(t)), e ? m(t, e, i) : m(t, "pfx")
    };
    y.addTest("fullscreen", !(!D("exitFullscreen", e, !1) && !D("cancelFullScreen", e, !1))), s(), o(v), delete S.addTest, delete S.addAsyncTest;
    for (var I = 0; I < y._q.length; I++) y._q[I]();
    t.Modernizr = y
}(this, document),
/********************************** end modernizr.min.js *****************************/

/********************************** start jquery 1.10.2 *****************************/

/********************************** end jquery 1.10.2 *****************************/

/********************************** start rails.js  *****************************/
    function(t, e) {
        t.rails !== e && t.error("jquery-ujs has already been loaded!");
        var i, n = t(document);
        t.rails = i = {
            linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with], a[data-disable]",
            buttonClickSelector: "button[data-remote]:not(form button), button[data-confirm]:not(form button)",
            inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
            formSubmitSelector: "form",
            formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
            disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
            enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
            requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
            fileInputSelector: "input[type=file]",
            linkDisableSelector: "a[data-disable-with], a[data-disable]",
            buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
            CSRFProtection: function(e) {
                var i = t('meta[name="csrf-token"]').attr("content");
                i && e.setRequestHeader("X-CSRF-Token", i)
            },
            refreshCSRFTokens: function() {
                var e = t("meta[name=csrf-token]").attr("content"),
                    i = t("meta[name=csrf-param]").attr("content");
                t('form input[name="' + i + '"]').val(e)
            },
            fire: function(e, i, n) {
                var s = t.Event(i);
                return e.trigger(s, n), s.result !== !1
            },
            confirm: function(t) {
                return confirm(t)
            },
            ajax: function(e) {
                return t.ajax(e)
            },
            href: function(t) {
                return t.attr("href")
            },
            handleRemote: function(n) {
                var s, o, a, r, l, c, d, h;
                if (i.fire(n, "ajax:before")) {
                    if (r = n.data("cross-domain"), l = r === e ? null : r, c = n.data("with-credentials") || null, d = n.data("type") || t.ajaxSettings && t.ajaxSettings.dataType, n.is("form")) {
                        s = n.attr("method"), o = n.attr("action"), a = n.serializeArray();
                        var u = n.data("ujs:submit-button");
                        u && (a.push(u), n.data("ujs:submit-button", null))
                    } else n.is(i.inputChangeSelector) ? (s = n.data("method"), o = n.data("url"), a = n.serialize(), n.data("params") && (a = a + "&" + n.data("params"))) : n.is(i.buttonClickSelector) ? (s = n.data("method") || "get", o = n.data("url"), a = n.serialize(), n.data("params") && (a = a + "&" + n.data("params"))) : (s = n.data("method"), o = i.href(n), a = n.data("params") || null);
                    return h = {
                        type: s || "GET",
                        data: a,
                        dataType: d,
                        beforeSend: function(t, s) {
                            return s.dataType === e && t.setRequestHeader("accept", "*/*;q=0.5, " + s.accepts.script), i.fire(n, "ajax:beforeSend", [t, s]) ? void n.trigger("ajax:send", t) : !1
                        },
                        success: function(t, e, i) {
                            n.trigger("ajax:success", [t, e, i])
                        },
                        complete: function(t, e) {
                            n.trigger("ajax:complete", [t, e])
                        },
                        error: function(t, e, i) {
                            n.trigger("ajax:error", [t, e, i])
                        },
                        crossDomain: l
                    }, c && (h.xhrFields = {
                        withCredentials: c
                    }), o && (h.url = o), i.ajax(h)
                }
                return !1
            },
            handleMethod: function(n) {
                var s = i.href(n),
                    o = n.data("method"),
                    a = n.attr("target"),
                    r = t("meta[name=csrf-token]").attr("content"),
                    l = t("meta[name=csrf-param]").attr("content"),
                    c = t('<form method="post" action="' + s + '"></form>'),
                    d = '<input name="_method" value="' + o + '" type="hidden" />';
                l !== e && r !== e && (d += '<input name="' + l + '" value="' + r + '" type="hidden" />'), a && c.attr("target", a), c.hide().append(d).appendTo("body"), c.submit()
            },
            formElements: function(e, i) {
                return e.is("form") ? t(e[0].elements).filter(i) : e.find(i)
            },
            disableFormElements: function(e) {
                i.formElements(e, i.disableSelector).each(function() {
                    i.disableFormElement(t(this))
                })
            },
            disableFormElement: function(t) {
                var i, n;
                i = t.is("button") ? "html" : "val", n = t.data("disable-with"), t.data("ujs:enable-with", t[i]()), n !== e && t[i](n), t.prop("disabled", !0)
            },
            enableFormElements: function(e) {
                i.formElements(e, i.enableSelector).each(function() {
                    i.enableFormElement(t(this))
                })
            },
            enableFormElement: function(t) {
                var e = t.is("button") ? "html" : "val";
                t.data("ujs:enable-with") && t[e](t.data("ujs:enable-with")), t.prop("disabled", !1)
            },
            allowAction: function(t) {
                var e, n = t.data("confirm"),
                    s = !1;
                return n ? (i.fire(t, "confirm") && (s = i.confirm(n), e = i.fire(t, "confirm:complete", [s])), s && e) : !0
            },
            blankInputs: function(e, i, n) {
                var s, o, a = t(),
                    r = i || "input,textarea",
                    l = e.find(r);
                return l.each(function() {
                    if (s = t(this), o = s.is("input[type=checkbox],input[type=radio]") ? s.is(":checked") : s.val(), !o == !n) {
                        if (s.is("input[type=radio]") && l.filter('input[type=radio]:checked[name="' + s.attr("name") + '"]').length) return !0;
                        a = a.add(s)
                    }
                }), a.length ? a : !1
            },
            nonBlankInputs: function(t, e) {
                return i.blankInputs(t, e, !0)
            },
            stopEverything: function(e) {
                return t(e.target).trigger("ujs:everythingStopped"), e.stopImmediatePropagation(), !1
            },
            disableElement: function(t) {
                var n = t.data("disable-with");
                t.data("ujs:enable-with", t.html()), n !== e && t.html(n), t.bind("click.railsDisable", function(t) {
                    return i.stopEverything(t)
                })
            },
            enableElement: function(t) {
                t.data("ujs:enable-with") !== e && (t.html(t.data("ujs:enable-with")), t.removeData("ujs:enable-with")), t.unbind("click.railsDisable")
            }
        }, i.fire(n, "rails:attachBindings") && (t.ajaxPrefilter(function(t, e, n) {
            t.crossDomain || i.CSRFProtection(n)
        }), n.delegate(i.linkDisableSelector, "ajax:complete", function() {
            i.enableElement(t(this))
        }), n.delegate(i.buttonDisableSelector, "ajax:complete", function() {
            i.enableFormElement(t(this))
        }), n.delegate(i.linkClickSelector, "click.rails", function(n) {
            var s = t(this),
                o = s.data("method"),
                a = s.data("params"),
                r = n.metaKey || n.ctrlKey;
            if (!i.allowAction(s)) return i.stopEverything(n);
            if (!r && s.is(i.linkDisableSelector) && i.disableElement(s), s.data("remote") !== e) {
                if (r && (!o || "GET" === o) && !a) return !0;
                var l = i.handleRemote(s);
                return l === !1 ? i.enableElement(s) : l.error(function() {
                    i.enableElement(s)
                }), !1
            }
            return s.data("method") ? (i.handleMethod(s), !1) : void 0
        }), n.delegate(i.buttonClickSelector, "click.rails", function(e) {
            var n = t(this);
            if (!i.allowAction(n)) return i.stopEverything(e);
            n.is(i.buttonDisableSelector) && i.disableFormElement(n);
            var s = i.handleRemote(n);
            return s === !1 ? i.enableFormElement(n) : s.error(function() {
                i.enableFormElement(n)
            }), !1
        }), n.delegate(i.inputChangeSelector, "change.rails", function(e) {
            var n = t(this);
            return i.allowAction(n) ? (i.handleRemote(n), !1) : i.stopEverything(e)
        }), n.delegate(i.formSubmitSelector, "submit.rails", function(n) {
            var s, o, a = t(this),
                r = a.data("remote") !== e;
            if (!i.allowAction(a)) return i.stopEverything(n);
            if (a.attr("novalidate") == e && (s = i.blankInputs(a, i.requiredInputSelector), s && i.fire(a, "ajax:aborted:required", [s]))) return i.stopEverything(n);
            if (r) {
                if (o = i.nonBlankInputs(a, i.fileInputSelector)) {
                    setTimeout(function() {
                        i.disableFormElements(a)
                    }, 13);
                    var l = i.fire(a, "ajax:aborted:file", [o]);
                    return l || setTimeout(function() {
                        i.enableFormElements(a)
                    }, 13), l
                }
                return i.handleRemote(a), !1
            }
            setTimeout(function() {
                i.disableFormElements(a)
            }, 13)
        }), n.delegate(i.formInputClickSelector, "click.rails", function(e) {
            var n = t(this);
            if (!i.allowAction(n)) return i.stopEverything(e);
            var s = n.attr("name"),
                o = s ? {
                    name: s,
                    value: n.val()
                } : null;
            n.closest("form").data("ujs:submit-button", o)
        }), n.delegate(i.formSubmitSelector, "ajax:send.rails", function(e) {
            this == e.target && i.disableFormElements(t(this))
        }), n.delegate(i.formSubmitSelector, "ajax:complete.rails", function(e) {
            this == e.target && i.enableFormElements(t(this))
        }), t(function() {
            i.refreshCSRFTokens()
        }))
    }(jQuery),
/********************************** end rails.js  *****************************/

/********************************** start easing  *****************************/
    function(t) {
        t.extend({
            debounce: function(t, e, i, n) {
                3 == arguments.length && "boolean" != typeof i && (n = i, i = !1);
                var s;
                return function() {
                    var o = arguments;
                    n = n || this, i && !s && t.apply(n, o), clearTimeout(s), s = setTimeout(function() {
                        i || t.apply(n, o), s = null
                    }, e)
                }
            },
            throttle: function(t, e, i) {
                var n, s, o;
                return function() {
                    s = arguments, o = !0, i = i || this, n || function() {
                        o ? (t.apply(i, s), o = !1, n = setTimeout(arguments.callee, e)) : n = null
                    }()
                }
            }
        })
    }(jQuery),
    jQuery.easing.jswing = jQuery.easing.swing,
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(t, e, i, n, s) {
        return jQuery.easing[jQuery.easing.def](t, e, i, n, s)
    },
    easeInQuad: function(t, e, i, n, s) {
        return n * (e /= s) * e + i
    },
    easeOutQuad: function(t, e, i, n, s) {
        return -n * (e /= s) * (e - 2) + i
    },
    easeInOutQuad: function(t, e, i, n, s) {
        return (e /= s / 2) < 1 ? n / 2 * e * e + i : -n / 2 * (--e * (e - 2) - 1) + i
    },
    easeInCubic: function(t, e, i, n, s) {
        return n * (e /= s) * e * e + i
    },
    easeOutCubic: function(t, e, i, n, s) {
        return n * ((e = e / s - 1) * e * e + 1) + i
    },
    easeInOutCubic: function(t, e, i, n, s) {
        return (e /= s / 2) < 1 ? n / 2 * e * e * e + i : n / 2 * ((e -= 2) * e * e + 2) + i
    },
    easeInQuart: function(t, e, i, n, s) {
        return n * (e /= s) * e * e * e + i
    },
    easeOutQuart: function(t, e, i, n, s) {
        return -n * ((e = e / s - 1) * e * e * e - 1) + i
    },
    easeInOutQuart: function(t, e, i, n, s) {
        return (e /= s / 2) < 1 ? n / 2 * e * e * e * e + i : -n / 2 * ((e -= 2) * e * e * e - 2) + i
    },
    easeInQuint: function(t, e, i, n, s) {
        return n * (e /= s) * e * e * e * e + i
    },
    easeOutQuint: function(t, e, i, n, s) {
        return n * ((e = e / s - 1) * e * e * e * e + 1) + i
    },
    easeInOutQuint: function(t, e, i, n, s) {
        return (e /= s / 2) < 1 ? n / 2 * e * e * e * e * e + i : n / 2 * ((e -= 2) * e * e * e * e + 2) + i
    },
    easeInSine: function(t, e, i, n, s) {
        return -n * Math.cos(e / s * (Math.PI / 2)) + n + i
    },
    easeOutSine: function(t, e, i, n, s) {
        return n * Math.sin(e / s * (Math.PI / 2)) + i
    },
    easeInOutSine: function(t, e, i, n, s) {
        return -n / 2 * (Math.cos(Math.PI * e / s) - 1) + i
    },
    easeInExpo: function(t, e, i, n, s) {
        return 0 == e ? i : n * Math.pow(2, 10 * (e / s - 1)) + i
    },
    easeOutExpo: function(t, e, i, n, s) {
        return e == s ? i + n : n * (-Math.pow(2, -10 * e / s) + 1) + i
    },
    easeInOutExpo: function(t, e, i, n, s) {
        return 0 == e ? i : e == s ? i + n : (e /= s / 2) < 1 ? n / 2 * Math.pow(2, 10 * (e - 1)) + i : n / 2 * (-Math.pow(2, -10 * --e) + 2) + i
    },
    easeInCirc: function(t, e, i, n, s) {
        return -n * (Math.sqrt(1 - (e /= s) * e) - 1) + i
    },
    easeOutCirc: function(t, e, i, n, s) {
        return n * Math.sqrt(1 - (e = e / s - 1) * e) + i
    },
    easeInOutCirc: function(t, e, i, n, s) {
        return (e /= s / 2) < 1 ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + i : n / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + i
    },
    easeInElastic: function(t, e, i, n, s) {
        var o = 1.70158,
            a = 0,
            r = n;
        if (0 == e) return i;
        if (1 == (e /= s)) return i + n;
        if (a || (a = .3 * s), r < Math.abs(n)) {
            r = n;
            var o = a / 4
        } else var o = a / (2 * Math.PI) * Math.asin(n / r);
        return -(r * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e * s - o) * Math.PI / a)) + i
    },
    easeOutElastic: function(t, e, i, n, s) {
        var o = 1.70158,
            a = 0,
            r = n;
        if (0 == e) return i;
        if (1 == (e /= s)) return i + n;
        if (a || (a = .3 * s), r < Math.abs(n)) {
            r = n;
            var o = a / 4
        } else var o = a / (2 * Math.PI) * Math.asin(n / r);
        return r * Math.pow(2, -10 * e) * Math.sin(2 * (e * s - o) * Math.PI / a) + n + i
    },
    easeInOutElastic: function(t, e, i, n, s) {
        var o = 1.70158,
            a = 0,
            r = n;
        if (0 == e) return i;
        if (2 == (e /= s / 2)) return i + n;
        if (a || (a = .3 * s * 1.5), r < Math.abs(n)) {
            r = n;
            var o = a / 4
        } else var o = a / (2 * Math.PI) * Math.asin(n / r);
        return 1 > e ? -.5 * r * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e * s - o) * Math.PI / a) + i : r * Math.pow(2, -10 * (e -= 1)) * Math.sin(2 * (e * s - o) * Math.PI / a) * .5 + n + i
    },
    easeInBack: function(t, e, i, n, s, o) {
        return void 0 == o && (o = 1.70158), n * (e /= s) * e * ((o + 1) * e - o) + i
    },
    easeOutBack: function(t, e, i, n, s, o) {
        return void 0 == o && (o = 1.70158), n * ((e = e / s - 1) * e * ((o + 1) * e + o) + 1) + i
    },
    easeInOutBack: function(t, e, i, n, s, o) {
        return void 0 == o && (o = 1.70158), (e /= s / 2) < 1 ? n / 2 * e * e * (((o *= 1.525) + 1) * e - o) + i : n / 2 * ((e -= 2) * e * (((o *= 1.525) + 1) * e + o) + 2) + i
    },
    easeInBounce: function(t, e, i, n, s) {
        return n - jQuery.easing.easeOutBounce(t, s - e, 0, n, s) + i
    },
    easeOutBounce: function(t, e, i, n, s) {
        return (e /= s) < 1 / 2.75 ? 7.5625 * n * e * e + i : 2 / 2.75 > e ? n * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + i : 2.5 / 2.75 > e ? n * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + i : n * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + i
    },
    easeInOutBounce: function(t, e, i, n, s) {
        return s / 2 > e ? .5 * jQuery.easing.easeInBounce(t, 2 * e, 0, n, s) + i : .5 * jQuery.easing.easeOutBounce(t, 2 * e - s, 0, n, s) + .5 * n + i
    }
}),
/********************************** end easing  *****************************/
    function() {
        var t, e, i, n, s, o, a, r, l, c, d, h, u, p, f, m, g, v, b, S = [].slice,
            y = [].indexOf || function(t) {
                    for (var e = 0, i = this.length; i > e; e++)
                        if (e in this && this[e] === t) return e;
                    return -1
                };
        t = jQuery, t.payment = {}, t.payment.fn = {}, t.fn.payment = function() {
            var e, i;
            return i = arguments[0], e = 2 <= arguments.length ? S.call(arguments, 1) : [], t.payment.fn[i].apply(this, e)
        }, s = /(\d{1,4})/g, n = [{
            type: "maestro",
            pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
            format: s,
            length: [12, 13, 14, 15, 16, 17, 18, 19],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "dinersclub",
            pattern: /^(36|38|30[0-5])/,
            format: s,
            length: [14],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "laser",
            pattern: /^(6706|6771|6709)/,
            format: s,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "jcb",
            pattern: /^35/,
            format: s,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "unionpay",
            pattern: /^62/,
            format: s,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: !1
        }, {
            type: "discover",
            pattern: /^(6011|65|64[4-9]|622)/,
            format: s,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "mastercard",
            pattern: /^5[1-5]/,
            format: s,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "amex",
            pattern: /^3[47]/,
            format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
            length: [15],
            cvcLength: [3, 4],
            luhn: !0
        }, {
            type: "visa",
            pattern: /^4/,
            format: s,
            length: [13, 14, 15, 16],
            cvcLength: [3],
            luhn: !0
        }], e = function(t) {
            var e, i, s;
            for (t = (t + "").replace(/\D/g, ""), i = 0, s = n.length; s > i; i++)
                if (e = n[i], e.pattern.test(t)) return e
        }, i = function(t) {
            var e, i, s;
            for (i = 0, s = n.length; s > i; i++)
                if (e = n[i], e.type === t) return e
        }, u = function(t) {
            var e, i, n, s, o, a;
            for (n = !0, s = 0, i = (t + "").split("").reverse(), o = 0, a = i.length; a > o; o++) e = i[o], e = parseInt(e, 10), (n = !n) && (e *= 2), e > 9 && (e -= 9), s += e;
            return s % 10 === 0
        }, h = function(t) {
            var e;
            return null != t.prop("selectionStart") && t.prop("selectionStart") !== t.prop("selectionEnd") ? !0 : ("undefined" != typeof document && null !== document && null != (e = document.selection) && "function" == typeof e.createRange ? e.createRange().text : void 0) ? !0 : !1
        }, p = function(e) {
            return setTimeout(function() {
                var i, n;
                return i = t(e.currentTarget), n = i.val(), n = t.payment.formatCardNumber(n), i.val(n)
            })
        }, r = function(i) {
            var n, s, o, a, r, l, c;
            return o = String.fromCharCode(i.which), !/^\d+$/.test(o) || (n = t(i.currentTarget), c = n.val(), s = e(c + o), a = (c.replace(/\D/g, "") + o).length, l = 16, s && (l = s.length[s.length.length - 1]), a >= l || null != n.prop("selectionStart") && n.prop("selectionStart") !== c.length) ? void 0 : (r = s && "amex" === s.type ? /^(\d{4}|\d{4}\s\d{6})$/ : /(?:^|\s)(\d{4})$/, r.test(c) ? (i.preventDefault(), n.val(c + " " + o)) : r.test(c + o) ? (i.preventDefault(), n.val(c + o + " ")) : void 0)
        }, o = function(e) {
            var i, n;
            return i = t(e.currentTarget), n = i.val(), e.meta || null != i.prop("selectionStart") && i.prop("selectionStart") !== n.length ? void 0 : 8 === e.which && /\s\d?$/.test(n) ? (e.preventDefault(), i.val(n.replace(/\s\d?$/, ""))) : void 0
        }, l = function(e) {
            var i, n, s;
            return n = String.fromCharCode(e.which), /^\d+$/.test(n) ? (i = t(e.currentTarget), s = i.val() + n, /^\d$/.test(s) && "0" !== s && "1" !== s ? (e.preventDefault(), i.val("0" + s + " / ")) : /^\d\d$/.test(s) ? (e.preventDefault(), i.val("" + s + " / ")) : void 0) : void 0
        }, c = function(e) {
            var i, n, s;
            return n = String.fromCharCode(e.which), /^\d+$/.test(n) ? (i = t(e.currentTarget), s = i.val(), /^\d\d$/.test(s) ? i.val("" + s + " / ") : void 0) : void 0
        }, d = function(e) {
            var i, n, s;
            return n = String.fromCharCode(e.which), "/" === n ? (i = t(e.currentTarget), s = i.val(), /^\d$/.test(s) && "0" !== s ? i.val("0" + s + " / ") : void 0) : void 0
        }, a = function(e) {
            var i, n;
            if (!e.meta && (i = t(e.currentTarget), n = i.val(), 8 === e.which && (null == i.prop("selectionStart") || i.prop("selectionStart") === n.length))) return /\s\/\s?\d?$/.test(n) ? (e.preventDefault(), i.val(n.replace(/\s\/\s?\d?$/, ""))) : void 0
        }, v = function(t) {
            var e;
            return t.metaKey || t.ctrlKey ? !0 : 32 === t.which ? !1 : 0 === t.which ? !0 : t.which < 33 ? !0 : (e = String.fromCharCode(t.which), !!/[\d\s]/.test(e))
        }, m = function(i) {
            var n, s, o, a;
            return n = t(i.currentTarget), o = String.fromCharCode(i.which), /^\d+$/.test(o) && !h(n) ? (a = (n.val() + o).replace(/\D/g, ""), s = e(a), s ? a.length <= s.length[s.length.length - 1] : a.length <= 16) : void 0
        }, g = function(e) {
            var i, n, s;
            return i = t(e.currentTarget), n = String.fromCharCode(e.which), /^\d+$/.test(n) && !h(i) ? (s = i.val() + n, s = s.replace(/\D/g, ""), s.length > 6 ? !1 : void 0) : void 0
        }, f = function(e) {
            var i, n, s;
            return i = t(e.currentTarget), n = String.fromCharCode(e.which), /^\d+$/.test(n) ? (s = i.val() + n, s.length <= 4) : void 0
        }, b = function(e) {
            var i, s, o, a, r;
            return i = t(e.currentTarget), r = i.val(), a = t.payment.cardType(r) || "unknown", i.hasClass(a) ? void 0 : (s = function() {
                var t, e, i;
                for (i = [], t = 0, e = n.length; e > t; t++) o = n[t], i.push(o.type);
                return i
            }(), i.removeClass("unknown"), i.removeClass(s.join(" ")), i.addClass(a), i.toggleClass("identified", "unknown" !== a), i.trigger("payment.cardType", a))
        }, t.payment.fn.formatCardCVC = function() {
            return this.payment("restrictNumeric"), this.on("keypress", f), this
        }, t.payment.fn.formatCardExpiry = function() {
            return this.payment("restrictNumeric"), this.on("keypress", g), this.on("keypress", l), this.on("keypress", d), this.on("keypress", c), this.on("keydown", a), this
        }, t.payment.fn.formatCardNumber = function() {
            return this.payment("restrictNumeric"), this.on("keypress", m), this.on("keypress", r), this.on("keydown", o), this.on("keyup", b), this.on("paste", p), this
        }, t.payment.fn.restrictNumeric = function() {
            return this.on("keypress", v), this
        }, t.payment.fn.cardExpiryVal = function() {
            return t.payment.cardExpiryVal(t(this).val())
        }, t.payment.cardExpiryVal = function(t) {
            var e, i, n, s;
            return t = t.replace(/\s/g, ""), s = t.split("/", 2), e = s[0], n = s[1], 2 === (null != n ? n.length : void 0) && /^\d+$/.test(n) && (i = (new Date).getFullYear(), i = i.toString().slice(0, 2), n = i + n), e = parseInt(e, 10), n = parseInt(n, 10), {
                month: e,
                year: n
            }
        }, t.payment.validateCardNumber = function(t) {
            var i, n;
            return t = (t + "").replace(/\s+|-/g, ""), /^\d+$/.test(t) ? (i = e(t), i ? (n = t.length, y.call(i.length, n) >= 0 && (i.luhn === !1 || u(t))) : !1) : !1
        }, t.payment.validateCardExpiry = function(e, i) {
            var n, s, o, a;
            return "object" == typeof e && "month" in e && (a = e, e = a.month, i = a.year), e && i ? (e = t.trim(e), i = t.trim(i), /^\d+$/.test(e) && /^\d+$/.test(i) && parseInt(e, 10) <= 12 ? (2 === i.length && (o = (new Date).getFullYear(), o = o.toString().slice(0, 2), i = o + i), s = new Date(i, e), n = new Date, s.setMonth(s.getMonth() - 1), s.setMonth(s.getMonth() + 1, 1), s > n) : !1) : !1
        }, t.payment.validateCardCVC = function(e, n) {
            var s, o;
            return e = t.trim(e), /^\d+$/.test(e) ? n ? (s = e.length, y.call(null != (o = i(n)) ? o.cvcLength : void 0, s) >= 0) : e.length >= 3 && e.length <= 4 : !1
        }, t.payment.cardType = function(t) {
            var i;
            return t ? (null != (i = e(t)) ? i.type : void 0) || null : null
        }, t.payment.formatCardNumber = function(t) {
            var i, n, s, o;
            return (i = e(t)) ? (s = i.length[i.length.length - 1], t = t.replace(/\D/g, ""), t = t.slice(0, +s + 1 || 9e9), i.format.global ? null != (o = t.match(i.format)) ? o.join(" ") : void 0 : (n = i.format.exec(t), null != n && n.shift(), null != n ? n.join(" ") : void 0)) : t
        }
    }.call(this),
    function(t) {
        t.fn.changeElementType = function(e) {
            this.each(function(i, n) {
                var s = {};
                t.each(n.attributes, function(t, e) {
                    s[e.nodeName] = e.nodeValue
                });
                var o = t("<" + e + "/>", s).append(t(n).contents());
                return t(n).replaceWith(o), o
            })
        }
    }(jQuery),
    function(t, e, i) {
        "function" == typeof define && define.amd ? define(["jquery"], function(n) {
            return i(n, t, e), n.mobile
        }) : i(t.jQuery, t, e)
    }(this, document, function(t, e, i) {
        ! function(t, e, i, n) {
            function s(t) {
                for (; t && "undefined" != typeof t.originalEvent;) t = t.originalEvent;
                return t
            }

            function o(e, i) {
                var o, a, r, l, c, d, h, u, p, f = e.type;
                if (e = t.Event(e), e.type = i, o = e.originalEvent, a = t.event.props, f.search(/^(mouse|click)/) > -1 && (a = D), o)
                    for (h = a.length, l; h;) l = a[--h], e[l] = o[l];
                if (f.search(/mouse(down|up)|click/) > -1 && !e.which && (e.which = 1), -1 !== f.search(/^touch/) && (r = s(o), f = r.touches, c = r.changedTouches, d = f && f.length ? f[0] : c && c.length ? c[0] : n))
                    for (u = 0, p = A.length; p > u; u++) l = A[u], e[l] = d[l];
                return e
            }

            function a(e) {
                for (var i, n, s = {}; e;) {
                    i = t.data(e, w);
                    for (n in i) i[n] && (s[n] = s.hasVirtualBinding = !0);
                    e = e.parentNode
                }
                return s
            }

            function r(e, i) {
                for (var n; e;) {
                    if (n = t.data(e, w), n && (!i || n[i])) return e;
                    e = e.parentNode
                }
                return null
            }

            function l() {
                U = !1
            }

            function c() {
                U = !0
            }

            function d() {
                H = 0, P.length = 0, $ = !1, c()
            }

            function h() {
                l()
            }

            function u() {
                p(), M = setTimeout(function() {
                    M = 0, d()
                }, t.vmouse.resetTimerDuration)
            }

            function p() {
                M && (clearTimeout(M), M = 0)
            }

            function f(e, i, n) {
                var s;
                return (n && n[e] || !n && r(i.target, e)) && (s = o(i, e), t(i.target).trigger(s)), s
            }

            function m(e) {
                var i, n = t.data(e.target, k);
                $ || H && H === n || (i = f("v" + e.type, e), i && (i.isDefaultPrevented() && e.preventDefault(), i.isPropagationStopped() && e.stopPropagation(), i.isImmediatePropagationStopped() && e.stopImmediatePropagation()))
            }

            function g(e) {
                var i, n, o, r = s(e).touches;
                r && 1 === r.length && (i = e.target, n = a(i), n.hasVirtualBinding && (H = j++, t.data(i, k, H), p(), h(), N = !1, o = s(e).touches[0], R = o.pageX, O = o.pageY, f("vmouseover", e, n), f("vmousedown", e, n)))
            }

            function v(t) {
                U || (N || f("vmousecancel", t, a(t.target)), N = !0, u())
            }

            function b(e) {
                if (!U) {
                    var i = s(e).touches[0],
                        n = N,
                        o = t.vmouse.moveDistanceThreshold,
                        r = a(e.target);
                    N = N || Math.abs(i.pageX - R) > o || Math.abs(i.pageY - O) > o, N && !n && f("vmousecancel", e, r), f("vmousemove", e, r), u()
                }
            }

            function S(t) {
                if (!U) {
                    c();
                    var e, i, n = a(t.target);
                    f("vmouseup", t, n), N || (e = f("vclick", t, n), e && e.isDefaultPrevented() && (i = s(t).changedTouches[0], P.push({
                        touchID: H,
                        x: i.clientX,
                        y: i.clientY
                    }), $ = !0)), f("vmouseout", t, n), N = !1, u()
                }
            }

            function y(e) {
                var i, n = t.data(e, w);
                if (n)
                    for (i in n)
                        if (n[i]) return !0;
                return !1
            }

            function E() {}

            function T(e) {
                var i = e.substr(1);
                return {
                    setup: function() {
                        y(this) || t.data(this, w, {});
                        var n = t.data(this, w);
                        n[e] = !0, I[e] = (I[e] || 0) + 1, 1 === I[e] && F.bind(i, m), t(this).bind(i, E), B && (I.touchstart = (I.touchstart || 0) + 1, 1 === I.touchstart && F.bind("touchstart", g).bind("touchend", S).bind("touchmove", b).bind("scroll", v))
                    },
                    teardown: function() {
                        --I[e], I[e] || F.unbind(i, m), B && (--I.touchstart, I.touchstart || F.unbind("touchstart", g).unbind("touchmove", b).unbind("touchend", S).unbind("scroll", v));
                        var n = t(this),
                            s = t.data(this, w);
                        s && (s[e] = !1), n.unbind(i, E), y(this) || n.removeData(w)
                    }
                }
            }
            var L, _, w = "virtualMouseBindings",
                k = "virtualTouchID",
                C = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
                A = "clientX clientY pageX pageY screenX screenY".split(" "),
                x = t.event.mouseHooks ? t.event.mouseHooks.props : [],
                D = t.event.props.concat(x),
                I = {},
                M = 0,
                R = 0,
                O = 0,
                N = !1,
                P = [],
                $ = !1,
                U = !1,
                B = "addEventListener" in i,
                F = t(i),
                j = 1,
                H = 0;
            for (t.vmouse = {
                moveDistanceThreshold: 10,
                clickDistanceThreshold: 10,
                resetTimerDuration: 1500
            }, _ = 0; _ < C.length; _++) t.event.special[C[_]] = T(C[_]);
            B && i.addEventListener("click", function(e) {
                var i, n, s, o, a, r, l = P.length,
                    c = e.target;
                if (l)
                    for (i = e.clientX, n = e.clientY, L = t.vmouse.clickDistanceThreshold, s = c; s;) {
                        for (o = 0; l > o; o++)
                            if (a = P[o], r = 0, s === c && Math.abs(a.x - i) < L && Math.abs(a.y - n) < L || t.data(s, k) === a.touchID) return e.preventDefault(), void e.stopPropagation();
                        s = s.parentNode
                    }
            }, !0)
        }(t, e, i)
    }), jQuery.extend({
    highlight: function(t, e, i, n) {
        if (3 === t.nodeType) {
            var s = t.data.match(e);
            if (s) {
                var o = document.createElement(i || "span");
                o.className = n || "highlight";
                var a = t.splitText(s.index);
                a.splitText(s[0].length);
                var r = a.cloneNode(!0);
                return o.appendChild(r), a.parentNode.replaceChild(o, a), 1
            }
        } else if (1 === t.nodeType && t.childNodes && !/(script|style)/i.test(t.tagName) && (t.tagName !== i.toUpperCase() || t.className !== n))
            for (var l = 0; l < t.childNodes.length; l++) l += jQuery.highlight(t.childNodes[l], e, i, n);
        return 0
    }
}), jQuery.fn.unhighlight = function(t) {
    var e = {
        className: "highlight",
        element: "span"
    };
    return jQuery.extend(e, t), this.find(e.element + "." + e.className).each(function() {
        var t = this.parentNode;
        t.replaceChild(this.firstChild, this), t.normalize()
    }).end()
}, jQuery.fn.highlight = function(t, e) {
    var i = {
        className: "highlight",
        element: "span",
        caseSensitive: !1,
        wordsOnly: !1
    };
    if (jQuery.extend(i, e), t.constructor === String && (t = [t]), t = jQuery.grep(t, function(t) {
            return "" != t
        }), t = jQuery.map(t, function(t) {
            return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
        }), 0 == t.length) return this;
    var n = i.caseSensitive ? "" : "i",
        s = "(" + t.join("|") + ")";
    i.wordsOnly && (s = "\\b" + s + "\\b");
    var o = new RegExp(s, n);
    return this.each(function() {
        jQuery.highlight(this, o, i.element, i.className)
    })
},
    function() {
        var t = !1,
            e = /xyz/.test(function() {}) ? /\b_super\b/ : /.*/;
        this.Class = function() {}, Class.extend = function(i) {
            function n() {
                !t && this.init && this.init.apply(this, arguments)
            }
            var s = this.prototype;
            t = !0;
            var o = new this;
            t = !1;
            for (var a in i) o[a] = "function" == typeof i[a] && "function" == typeof s[a] && e.test(i[a]) ? function(t, e) {
                return function() {
                    var i = this._super;
                    this._super = s[t];
                    var n = e.apply(this, arguments);
                    return this._super = i, n
                }
            }(a, i[a]) : i[a];
            return n.prototype = o, n.constructor = n, n.extend = arguments.callee, n
        }
    }(),
    function(t) {
        "function" == typeof define ? define(function() {
            t()
        }) : t()
    }(function(t) {
        if (!Function.prototype.bind) {
            var e = Array.prototype.slice;
            Function.prototype.bind = function() {
                function t() {
                    if (this instanceof t) {
                        var s = Object.create(i.prototype);
                        return i.apply(s, n.concat(e.call(arguments))), s
                    }
                    return i.call.apply(i, n.concat(e.call(arguments)))
                }
                var i = this;
                if ("function" != typeof i.apply || "function" != typeof i.call) return new TypeError;
                var n = e.call(arguments);
                return t.length = "function" == typeof i ? Math.max(i.length - n.length, 0) : 0, t
            }
        }
        var i, n, s, o, a, r = Function.prototype.call,
            l = Object.prototype,
            c = r.bind(l.hasOwnProperty);
        (a = c(l, "__defineGetter__")) && (i = r.bind(l.__defineGetter__), n = r.bind(l.__defineSetter__), s = r.bind(l.__lookupGetter__), o = r.bind(l.__lookupSetter__)), Array.isArray || (Array.isArray = function(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }), Array.prototype.forEach || (Array.prototype.forEach = function(t, e) {
            for (var i = +this.length, n = 0; i > n; n++) n in this && t.call(e, this[n], n, this)
        }), Array.prototype.map || (Array.prototype.map = function(t, e) {
            var i = +this.length;
            if ("function" != typeof t) throw new TypeError;
            for (var n = Array(i), s = 0; i > s; s++) s in this && (n[s] = t.call(e, this[s], s, this));
            return n
        }), Array.prototype.filter || (Array.prototype.filter = function(t, e) {
            for (var i = [], n = 0; n < this.length; n++) t.call(e, this[n]) && i.push(this[n]);
            return i
        }), Array.prototype.every || (Array.prototype.every = function(t, e) {
            for (var i = 0; i < this.length; i++)
                if (!t.call(e, this[i])) return !1;
            return !0
        }), Array.prototype.some || (Array.prototype.some = function(t, e) {
            for (var i = 0; i < this.length; i++)
                if (t.call(e, this[i])) return !0;
            return !1
        }), Array.prototype.reduce || (Array.prototype.reduce = function(t) {
            var e = +this.length;
            if ("function" != typeof t) throw new TypeError;
            if (0 === e && 1 === arguments.length) throw new TypeError;
            var i = 0;
            if (arguments.length >= 2) var n = arguments[1];
            else
                for (;;) {
                    if (i in this) {
                        n = this[i++];
                        break
                    }
                    if (++i >= e) throw new TypeError
                }
            for (; e > i; i++) i in this && (n = t.call(null, n, this[i], i, this));
            return n
        }), Array.prototype.reduceRight || (Array.prototype.reduceRight = function(t) {
            var e = +this.length;
            if ("function" != typeof t) throw new TypeError;
            if (0 === e && 1 === arguments.length) throw new TypeError;
            var i;
            if (e -= 1, arguments.length >= 2) i = arguments[1];
            else
                for (;;) {
                    if (e in this) {
                        i = this[e--];
                        break
                    }
                    if (--e < 0) throw new TypeError
                }
            for (; e >= 0; e--) e in this && (i = t.call(null, i, this[e], e, this));
            return i
        }), Array.prototype.indexOf || (Array.prototype.indexOf = function(t, e) {
            var i = this.length;
            if (!i) return -1;
            var n = e || 0;
            if (n >= i) return -1;
            for (0 > n && (n += i); i > n; n++)
                if (n in this && t === this[n]) return n;
            return -1
        }), Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function(t, e) {
            var i = this.length;
            if (!i) return -1;
            var n = e || i;
            for (0 > n && (n += i), n = Math.min(n, i - 1); n >= 0; n--)
                if (n in this && t === this[n]) return n;
            return -1
        }), Object.getPrototypeOf || (Object.getPrototypeOf = function(t) {
            return t.__proto__ || t.constructor.prototype
        }), Object.getOwnPropertyDescriptor || (Object.getOwnPropertyDescriptor = function(e, i) {
            if ("object" != typeof e && "function" != typeof e || null === e) throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object: " + e);
            if (!c(e, i)) return t;
            var n, r, d;
            if (n = {
                    enumerable: !0,
                    configurable: !0
                }, a) {
                var h = e.__proto__;
                if (e.__proto__ = l, r = s(e, i), d = o(e, i), e.__proto__ = h, r || d) return r && (n.get = r), d && (n.set = d), n
            }
            return n.value = e[i], n
        }), Object.getOwnPropertyNames || (Object.getOwnPropertyNames = function(t) {
            return Object.keys(t)
        }), Object.create || (Object.create = function(t, e) {
            var i;
            if (null === t) i = {
                __proto__: null
            };
            else {
                if ("object" != typeof t) throw new TypeError("typeof prototype[" + typeof t + "] != 'object'");
                i = function() {}, i.prototype = t, i = new i, i.__proto__ = t
            }
            return "undefined" != typeof e && Object.defineProperties(i, e), i
        }), Object.defineProperty || (Object.defineProperty = function(t, e, r) {
            if ("object" != typeof t && "function" != typeof t) throw new TypeError("Object.defineProperty called on non-object: " + t);
            if ("object" != typeof r || null === r) throw new TypeError("Property description must be an object: " + r);
            if (c(r, "value")) a && (s(t, e) || o(t, e)) && (t.__proto__ = l, delete t[e]), t[e] = r.value;
            else {
                if (!a) throw new TypeError("getters & setters can not be defined on this javascript engine");
                c(r, "get") && i(t, e, r.get), c(r, "set") && n(t, e, r.set)
            }
            return t
        }), Object.defineProperties || (Object.defineProperties = function(t, e) {
            for (var i in e) c(e, i) && Object.defineProperty(t, i, e[i]);
            return t
        }), Object.seal || (Object.seal = function(t) {
            return t
        }), Object.freeze || (Object.freeze = function(t) {
            return t
        });
        try {
            Object.freeze(function() {})
        } catch (d) {
            Object.freeze = function(t) {
                return function(e) {
                    return "function" == typeof e ? e : t(e)
                }
            }(Object.freeze)
        }
        if (Object.preventExtensions || (Object.preventExtensions = function(t) {
                return t
            }), Object.isSealed || (Object.isSealed = function() {
                return !1
            }), Object.isFrozen || (Object.isFrozen = function() {
                return !1
            }), Object.isExtensible || (Object.isExtensible = function() {
                return !0
            }), !Object.keys) {
            var h, u = !0,
                p = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
                f = p.length;
            for (h in {
                toString: null
            }) u = !1;
            Object.keys = function v(t) {
                if ("object" != typeof t && "function" != typeof t || null === t) throw new TypeError("Object.keys called on a non-object");
                var e, v = [];
                for (e in t) c(t, e) && v.push(e);
                if (u)
                    for (e = 0; f > e; e++) {
                        var i = p[e];
                        c(t, i) && v.push(i)
                    }
                return v
            }
        }
        if (Date.prototype.toISOString || (Date.prototype.toISOString = function() {
                return this.getUTCFullYear() + "-" + (this.getUTCMonth() + 1) + "-" + this.getUTCDate() + "T" + this.getUTCHours() + ":" + this.getUTCMinutes() + ":" + this.getUTCSeconds() + "Z"
            }), Date.now || (Date.now = function() {
                return (new Date).getTime()
            }), Date.prototype.toJSON || (Date.prototype.toJSON = function() {
                if ("function" != typeof this.toISOString) throw new TypeError;
                return this.toISOString()
            }), isNaN(Date.parse("T00:00")) && (Date = function(e) {
                var i, n = function(t, i, s, o, a, r, l) {
                        var c = arguments.length;
                        return this instanceof e ? (c = 1 === c && String(t) === t ? new e(n.parse(t)) : c >= 7 ? new e(t, i, s, o, a, r, l) : c >= 6 ? new e(t, i, s, o, a, r) : c >= 5 ? new e(t, i, s, o, a) : c >= 4 ? new e(t, i, s, o) : c >= 3 ? new e(t, i, s) : c >= 2 ? new e(t, i) : c >= 1 ? new e(t) : new e, c.constructor = n, c) : e.apply(this, arguments)
                    },
                    s = RegExp("^(?:((?:[+-]\\d\\d)?\\d\\d\\d\\d)(?:-(\\d\\d)(?:-(\\d\\d))?)?)?(?:T(\\d\\d):(\\d\\d)(?::(\\d\\d)(?:\\.(\\d\\d\\d))?)?)?(?:Z|([+-])(\\d\\d):(\\d\\d))?$");
                for (i in e) n[i] = e[i];
                return n.now = e.now, n.UTC = e.UTC, n.prototype = e.prototype, n.prototype.constructor = n, n.parse = function(i) {
                    var n = s.exec(i);
                    if (n) {
                        n.shift();
                        for (var o = n[0] === t, a = 0; 10 > a; a++) 7 !== a && (n[a] = +(n[a] || (3 > a ? 1 : 0)), 1 === a && n[a]--);
                        return o ? 1e3 * (60 * (60 * n[3] + n[4]) + n[5]) + n[6] : (o = 6e4 * (60 * n[8] + n[9]), "-" === n[6] && (o = -o), e.UTC.apply(this, n.slice(0, 7)) + o)
                    }
                    return e.parse.apply(this, arguments)
                }, n
            }(Date)), !String.prototype.trim) {
            var m = /^\s\s*/,
                g = /\s\s*$/;
            String.prototype.trim = function() {
                return String(this).replace(m, "").replace(g, "")
            }
        }
    }), "undefined" == typeof document || "classList" in document.createElement("a") || ! function(t) {
    var e = "classList",
        i = "prototype",
        n = (t.HTMLElement || t.Element)[i],
        s = Object,
        o = String[i].trim || function() {
                return this.replace(/^\s+|\s+$/g, "")
            },
        a = Array[i].indexOf || function(t) {
                for (var e = 0, i = this.length; i > e; e++)
                    if (e in this && this[e] === t) return e;
                return -1
            },
        r = function(t, e) {
            this.name = t, this.code = DOMException[t], this.message = e
        },
        l = function(t, e) {
            if ("" === e) throw new r("SYNTAX_ERR", "An invalid or illegal string was specified");
            if (/\s/.test(e)) throw new r("INVALID_CHARACTER_ERR", "String contains an invalid character");
            return a.call(t, e)
        },
        c = function(t) {
            for (var e = o.call(t.className), i = e ? e.split(/\s+/) : [], n = 0, s = i.length; s > n; n++) this.push(i[n]);
            this._updateClassName = function() {
                t.className = this.toString()
            }
        },
        d = c[i] = [],
        h = function() {
            return new c(this)
        };
    if (r[i] = Error[i], d.item = function(t) {
            return this[t] || null
        }, d.contains = function(t) {
            return t += "", -1 !== l(this, t)
        }, d.add = function(t) {
            t += "", -1 === l(this, t) && (this.push(t), this._updateClassName())
        }, d.remove = function(t) {
            t += "";
            var e = l(this, t); - 1 !== e && (this.splice(e, 1), this._updateClassName())
        }, d.toggle = function(t) {
            t += "", -1 === l(this, t) ? this.add(t) : this.remove(t)
        }, d.toString = function() {
            return this.join(" ")
        }, s.defineProperty) {
        var u = {
            get: h,
            enumerable: !0,
            configurable: !0
        };
        try {
            s.defineProperty(n, e, u)
        } catch (p) {
            -2146823252 === p.number && (u.enumerable = !1, s.defineProperty(n, e, u))
        }
    } else s[i].__defineGetter__ && n.__defineGetter__(e, h)
}(self),
    function(t) {
        function e() {
            p || (p = !0, l(m, function(t) {
                h(t)
            }))
        }

        function i(e, i) {
            var n = t.createElement("script");
            n.type = "text/" + (e.type || "javascript"), n.src = e.src || e, n.async = !1, n.onreadystatechange = n.onload = function() {
                var t = n.readyState;
                !i.done && (!t || /loaded|complete/.test(t)) && (i.done = !0, i())
            }, (t.body || f).appendChild(n)
        }

        function n(t, e) {
            return t.state == w ? e && e() : t.state == _ ? E.ready(t.name, e) : t.state == L ? t.onpreload.push(function() {
                n(t, e)
            }) : (t.state = _, void i(t.url, function() {
                t.state = w, e && e(), l(v[t.name], function(t) {
                    h(t)
                }), a() && p && l(v.ALL, function(t) {
                    h(t)
                })
            }))
        }

        function s(t) {
            void 0 === t.state && (t.state = L, t.onpreload = [], i({
                src: t.url,
                type: "cache"
            }, function() {
                o(t)
            }))
        }

        function o(t) {
            t.state = T, l(t.onpreload, function(t) {
                t.call()
            })
        }

        function a(t) {
            t = t || b;
            var e;
            for (var i in t) {
                if (t.hasOwnProperty(i) && t[i].state != w) return !1;
                e = !0
            }
            return e
        }

        function r(t) {
            return "[object Function]" == Object.prototype.toString.call(t)
        }

        function l(t, e) {
            if (t) {
                "object" == typeof t && (t = [].slice.call(t));
                for (var i = 0; i < t.length; i++) e.call(t, t[i], i)
            }
        }

        function c(t) {
            var e;
            if ("object" == typeof t)
                for (var i in t) t[i] && (e = {
                    name: i,
                    url: t[i]
                });
            else e = {
                name: d(t),
                url: t
            };
            var n = b[e.name];
            return n && n.url === e.url ? n : (b[e.name] = e, e)
        }

        function d(t) {
            var e = t.split("/"),
                i = e[e.length - 1],
                n = i.indexOf("?");
            return -1 != n ? i.substring(0, n) : i
        }

        function h(t) {
            t._done || (t(), t._done = 1)
        }
        var u, p, f = t.documentElement,
            m = [],
            g = [],
            v = {},
            b = {},
            S = t.createElement("script").async === !0 || "MozAppearance" in t.documentElement.style || window.opera,
            y = window.head_conf && head_conf.head || "head",
            E = window[y] = window[y] || function() {
                    E.ready.apply(null, arguments)
                },
            T = 1,
            L = 2,
            _ = 3,
            w = 4;
        if (E.js = S ? function() {
                var t = arguments,
                    e = t[t.length - 1],
                    i = {};
                return r(e) || (e = null), l(t, function(s, o) {
                    s != e && (s = c(s), i[s.name] = s, n(s, e && o == t.length - 2 ? function() {
                        a(i) && h(e)
                    } : null))
                }), E
            } : function() {
                var t = arguments,
                    e = [].slice.call(t, 1),
                    i = e[0];
                return u ? (i ? (l(e, function(t) {
                    r(t) || s(c(t))
                }), n(c(t[0]), r(i) ? i : function() {
                    E.js.apply(null, e)
                })) : n(c(t[0])), E) : (g.push(function() {
                    E.js.apply(null, t)
                }), E)
            }, E.ready = function(e, i) {
                if (e == t) return p ? h(i) : m.push(i), E;
                if (r(e) && (i = e, e = "ALL"), "string" != typeof e || !r(i)) return E;
                var n = b[e];
                if (n && n.state == w || "ALL" == e && a() && p) return h(i), E;
                var s = v[e];
                return s ? s.push(i) : s = v[e] = [i], E
            }, E.ready(t, function() {
                a() && l(v.ALL, function(t) {
                    h(t)
                }), E.feature && E.feature("domloaded", !0)
            }), window.addEventListener) t.addEventListener("DOMContentLoaded", e, !1), window.addEventListener("load", e, !1);
        else if (window.attachEvent) {
            t.attachEvent("onreadystatechange", function() {
                "complete" === t.readyState && e()
            });
            var k = 1;
            try {
                k = window.frameElement
            } catch (C) {}!k && f.doScroll && function() {
                try {
                    f.doScroll("left"), e()
                } catch (t) {
                    return void setTimeout(arguments.callee, 1)
                }
            }(), window.attachEvent("onload", e)
        }!t.readyState && t.addEventListener && (t.readyState = "loading", t.addEventListener("DOMContentLoaded", handler = function() {
            t.removeEventListener("DOMContentLoaded", handler, !1), t.readyState = "complete"
        }, !1)), setTimeout(function() {
            u = !0, l(g, function(t) {
                t()
            })
        }, 300)
    }(document),
    function(t) {
        function e(t, e, i, n, s) {
            this._listener = e, this._isOnce = i, this.context = n, this._signal = t, this._priority = s || 0
        }
        var i = {
            VERSION: "0.6.1"
        };
        e.prototype = {
            active: !0,
            execute: function(t) {
                var e;
                return this.active && (e = this._listener.apply(this.context, t), this._isOnce && this.detach()), e
            },
            detach: function() {
                return this._signal.remove(this._listener)
            },
            getListener: function() {
                return this._listener
            },
            dispose: function() {
                this.detach(), this._destroy()
            },
            _destroy: function() {
                delete this._signal, delete this._isOnce, delete this._listener, delete this.context
            },
            isOnce: function() {
                return this._isOnce
            },
            toString: function() {
                return "[SignalBinding isOnce: " + this._isOnce + ", active: " + this.active + "]"
            }
        }, i.Signal = function() {
            this._bindings = []
        }, i.Signal.prototype = {
            _shouldPropagate: !0,
            active: !0,
            _registerListener: function(t, i, n, s) {
                if ("function" != typeof t) throw new Error("listener is a required param of add() and addOnce() and should be a Function.");
                var o, a = this._indexOfListener(t);
                if (-1 !== a) {
                    if (o = this._bindings[a], o.isOnce() !== i) throw new Error("You cannot add" + (i ? "" : "Once") + "() then add" + (i ? "Once" : "") + "() the same listener without removing the relationship first.")
                } else o = new e(this, t, i, n, s), this._addBinding(o);
                return o
            },
            _addBinding: function(t) {
                var e = this._bindings.length;
                do --e; while (this._bindings[e] && t._priority <= this._bindings[e]._priority);
                this._bindings.splice(e + 1, 0, t)
            },
            _indexOfListener: function(t) {
                for (var e = this._bindings.length; e--;)
                    if (this._bindings[e]._listener === t) return e;
                return -1
            },
            add: function(t, e, i) {
                return this._registerListener(t, !1, e, i)
            },
            addOnce: function(t, e, i) {
                return this._registerListener(t, !0, e, i)
            },
            remove: function(t) {
                if ("function" != typeof t) throw new Error("listener is a required param of remove() and should be a Function.");
                var e = this._indexOfListener(t);
                return -1 !== e && (this._bindings[e]._destroy(), this._bindings.splice(e, 1)), t
            },
            removeAll: function() {
                for (var t = this._bindings.length; t--;) this._bindings[t]._destroy();
                this._bindings.length = 0
            },
            getNumListeners: function() {
                return this._bindings.length
            },
            halt: function() {
                this._shouldPropagate = !1
            },
            dispatch: function() {
                //todo BenMacha: je suis bloque
                //console.log('dispash3');
                //console.log(arguments);
                if (this.active) {
                    var t = Array.prototype.slice.call(arguments),
                        e = this._bindings.slice(),
                        i = this._bindings.length;
                    //console.log(t);
                    //console.log(e);
                    //console.log(i);

                    this._shouldPropagate = !0;
                    do i--; while (e[i] && /*this._shouldPropagate && */e[i].execute(t) !== !1)
                }
            },
            dispose: function() {
                this.removeAll(), delete this._bindings
            },
            toString: function() {
                return "[Signal active: " + this.active + " numListeners: " + this.getNumListeners() + "]"
            }
        }, t.signals = i
    }(window || global || this);
var JSON;
JSON || (JSON = {}),
    function() {
        "use strict";

        function f(t) {
            return 10 > t ? "0" + t : t
        }

        function quote(t) {
            return escapable.lastIndex = 0, escapable.test(t) ? '"' + t.replace(escapable, function(t) {
                var e = meta[t];
                return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + t + '"'
        }

        function str(t, e) {
            var i, n, s, o, a, r = gap,
                l = e[t];
            switch (l && "object" == typeof l && "function" == typeof l.toJSON && (l = l.toJSON(t)), "function" == typeof rep && (l = rep.call(e, t, l)), typeof l) {
                case "string":
                    return quote(l);
                case "number":
                    return isFinite(l) ? String(l) : "null";
                case "boolean":
                case "null":
                    return String(l);
                case "object":
                    if (!l) return "null";
                    if (gap += indent, a = [], "[object Array]" === Object.prototype.toString.apply(l)) {
                        for (o = l.length, i = 0; o > i; i += 1) a[i] = str(i, l) || "null";
                        return s = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + r + "]" : "[" + a.join(",") + "]", gap = r, s
                    }
                    if (rep && "object" == typeof rep)
                        for (o = rep.length, i = 0; o > i; i += 1) "string" == typeof rep[i] && (n = rep[i], s = str(n, l), s && a.push(quote(n) + (gap ? ": " : ":") + s));
                    else
                        for (n in l) Object.prototype.hasOwnProperty.call(l, n) && (s = str(n, l), s && a.push(quote(n) + (gap ? ": " : ":") + s));
                    return s = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + r + "}" : "{" + a.join(",") + "}", gap = r, s
            }
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        });
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                "\b": "\\b",
                "	": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;
        "function" != typeof JSON.stringify && (JSON.stringify = function(t, e, i) {
            var n;
            if (gap = "", indent = "", "number" == typeof i)
                for (n = 0; i > n; n += 1) indent += " ";
            else "string" == typeof i && (indent = i);
            if (rep = e, e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify");
            return str("", {
                "": t
            })
        }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
            function walk(t, e) {
                var i, n, s = t[e];
                if (s && "object" == typeof s)
                    for (i in s) Object.prototype.hasOwnProperty.call(s, i) && (n = walk(s, i), void 0 !== n ? s[i] = n : delete s[i]);
                return reviver.call(t, e, s)
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(t) {
                    return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    }(),
    function(t) {
        function e(t, e) {
            return function(i) {
                return l(t.call(this, i), e)
            }
        }

        function i(t, e) {
            return function(i) {
                return this.lang().ordinal(t.call(this, i), e)
            }
        }

        function n() {}

        function s(t) {
            a(this, t)
        }

        function o(t) {
            var e = t.years || t.year || t.y || 0,
                i = t.months || t.month || t.M || 0,
                n = t.weeks || t.week || t.w || 0,
                s = t.days || t.day || t.d || 0,
                o = t.hours || t.hour || t.h || 0,
                a = t.minutes || t.minute || t.m || 0,
                r = t.seconds || t.second || t.s || 0,
                l = t.milliseconds || t.millisecond || t.ms || 0;
            this._input = t, this._milliseconds = +l + 1e3 * r + 6e4 * a + 36e5 * o, this._days = +s + 7 * n, this._months = +i + 12 * e, this._data = {}, this._bubble()
        }

        function a(t, e) {
            for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            return t
        }

        function r(t) {
            return 0 > t ? Math.ceil(t) : Math.floor(t)
        }

        function l(t, e) {
            for (var i = t + ""; i.length < e;) i = "0" + i;
            return i
        }

        function c(t, e, i, n) {
            var s, o, a = e._milliseconds,
                r = e._days,
                l = e._months;
            a && t._d.setTime(+t._d + a * i), (r || l) && (s = t.minute(), o = t.hour()), r && t.date(t.date() + r * i), l && t.month(t.month() + l * i), a && !n && $.updateOffset(t), (r || l) && (t.minute(s), t.hour(o))
        }

        function d(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }

        function h(t, e) {
            var i, n = Math.min(t.length, e.length),
                s = Math.abs(t.length - e.length),
                o = 0;
            for (i = 0; n > i; i++) ~~t[i] !== ~~e[i] && o++;
            return o + s
        }

        function u(t) {
            return t ? le[t] || t.toLowerCase().replace(/(.)s$/, "$1") : t
        }

        function p(t, e) {
            return e.abbr = t, j[t] || (j[t] = new n), j[t].set(e), j[t]
        }

        function f(t) {
            delete j[t]
        }

        function m(t) {
            if (!t) return $.fn._lang;
            if (!j[t] && H) try {
                require("./lang/" + t)
            } catch (e) {
                return $.fn._lang
            }
            return j[t] || $.fn._lang
        }

        function g(t) {
            return t.match(/\[.*\]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "")
        }

        function v(t) {
            var e, i, n = t.match(Y);
            for (e = 0, i = n.length; i > e; e++) n[e] = ue[n[e]] ? ue[n[e]] : g(n[e]);
            return function(s) {
                var o = "";
                for (e = 0; i > e; e++) o += n[e] instanceof Function ? n[e].call(s, t) : n[e];
                return o
            }
        }

        function b(t, e) {
            return e = S(e, t.lang()), ce[e] || (ce[e] = v(e)), ce[e](t)
        }

        function S(t, e) {
            function i(t) {
                return e.longDateFormat(t) || t
            }
            for (var n = 5; n-- && (X.lastIndex = 0, X.test(t));) t = t.replace(X, i);
            return t
        }

        function y(t, e) {
            switch (t) {
                case "DDDD":
                    return J;
                case "YYYY":
                    return K;
                case "YYYYY":
                    return q;
                case "S":
                case "SS":
                case "SSS":
                case "DDD":
                    return G;
                case "MMM":
                case "MMMM":
                case "dd":
                case "ddd":
                case "dddd":
                    return Q;
                case "a":
                case "A":
                    return m(e._l)._meridiemParse;
                case "X":
                    return ee;
                case "Z":
                case "ZZ":
                    return Z;
                case "T":
                    return te;
                case "MM":
                case "DD":
                case "YY":
                case "HH":
                case "hh":
                case "mm":
                case "ss":
                case "M":
                case "D":
                case "d":
                case "H":
                case "h":
                case "m":
                case "s":
                    return W;
                default:
                    return new RegExp(t.replace("\\", ""))
            }
        }

        function E(t) {
            var e = (Z.exec(t) || [])[0],
                i = (e + "").match(oe) || ["-", 0, 0],
                n = +(60 * i[1]) + ~~i[2];
            return "+" === i[0] ? -n : n
        }

        function T(t, e, i) {
            var n, s = i._a;
            switch (t) {
                case "M":
                case "MM":
                    null != e && (s[1] = ~~e - 1);
                    break;
                case "MMM":
                case "MMMM":
                    n = m(i._l).monthsParse(e), null != n ? s[1] = n : i._isValid = !1;
                    break;
                case "D":
                case "DD":
                    null != e && (s[2] = ~~e);
                    break;
                case "DDD":
                case "DDDD":
                    null != e && (s[1] = 0, s[2] = ~~e);
                    break;
                case "YY":
                    s[0] = ~~e + (~~e > 68 ? 1900 : 2e3);
                    break;
                case "YYYY":
                case "YYYYY":
                    s[0] = ~~e;
                    break;
                case "a":
                case "A":
                    i._isPm = m(i._l).isPM(e);
                    break;
                case "H":
                case "HH":
                case "h":
                case "hh":
                    s[3] = ~~e;
                    break;
                case "m":
                case "mm":
                    s[4] = ~~e;
                    break;
                case "s":
                case "ss":
                    s[5] = ~~e;
                    break;
                case "S":
                case "SS":
                case "SSS":
                    s[6] = ~~(1e3 * ("0." + e));
                    break;
                case "X":
                    i._d = new Date(1e3 * parseFloat(e));
                    break;
                case "Z":
                case "ZZ":
                    i._useUTC = !0, i._tzm = E(e)
            }
            null == e && (i._isValid = !1)
        }

        function L(t) {
            var e, i, n, s = [];
            if (!t._d) {
                for (n = w(t), e = 0; 3 > e && null == t._a[e]; ++e) t._a[e] = s[e] = n[e];
                for (; 7 > e; e++) t._a[e] = s[e] = null == t._a[e] ? 2 === e ? 1 : 0 : t._a[e];
                s[3] += ~~((t._tzm || 0) / 60), s[4] += ~~((t._tzm || 0) % 60), i = new Date(0), t._useUTC ? (i.setUTCFullYear(s[0], s[1], s[2]), i.setUTCHours(s[3], s[4], s[5], s[6])) : (i.setFullYear(s[0], s[1], s[2]), i.setHours(s[3], s[4], s[5], s[6])), t._d = i
            }
        }

        function _(t) {
            var e = t._i;
            t._d || (t._a = [e.years || e.year || e.y, e.months || e.month || e.M, e.days || e.day || e.d, e.hours || e.hour || e.h, e.minutes || e.minute || e.m, e.seconds || e.second || e.s, e.milliseconds || e.millisecond || e.ms], L(t))
        }

        function w(t) {
            var e = new Date;
            return t._useUTC ? [e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()] : [e.getFullYear(), e.getMonth(), e.getDate()]
        }

        function k(t) {
            var e, i, n, s = m(t._l),
                o = "" + t._i;
            for (n = S(t._f, s).match(Y), t._a = [], e = 0; e < n.length; e++) i = (y(n[e], t).exec(o) || [])[0], i && (o = o.slice(o.indexOf(i) + i.length)), ue[n[e]] && T(n[e], i, t);
            o && (t._il = o), t._isPm && t._a[3] < 12 && (t._a[3] += 12), t._isPm === !1 && 12 === t._a[3] && (t._a[3] = 0), L(t)
        }

        function C(t) {
            var e, i, n, o, r, l = 99;
            for (o = 0; o < t._f.length; o++) e = a({}, t), e._f = t._f[o], k(e), i = new s(e), r = h(e._a, i.toArray()), i._il && (r += i._il.length), l > r && (l = r, n = i);
            a(t, n)
        }

        function A(t) {
            var e, i = t._i,
                n = ie.exec(i);
            if (n) {
                for (t._f = "YYYY-MM-DD" + (n[2] || " "), e = 0; 4 > e; e++)
                    if (se[e][1].exec(i)) {
                        t._f += se[e][0];
                        break
                    }
                Z.exec(i) && (t._f += " Z"), k(t)
            } else t._d = new Date(i)
        }

        function x(e) {
            var i = e._i,
                n = z.exec(i);
            i === t ? e._d = new Date : n ? e._d = new Date(+n[1]) : "string" == typeof i ? A(e) : d(i) ? (e._a = i.slice(0), L(e)) : i instanceof Date ? e._d = new Date(+i) : "object" == typeof i ? _(e) : e._d = new Date(i)
        }

        function D(t, e, i, n, s) {
            return s.relativeTime(e || 1, !!i, t, n)
        }

        function I(t, e, i) {
            var n = F(Math.abs(t) / 1e3),
                s = F(n / 60),
                o = F(s / 60),
                a = F(o / 24),
                r = F(a / 365),
                l = 45 > n && ["s", n] || 1 === s && ["m"] || 45 > s && ["mm", s] || 1 === o && ["h"] || 22 > o && ["hh", o] || 1 === a && ["d"] || 25 >= a && ["dd", a] || 45 >= a && ["M"] || 345 > a && ["MM", F(a / 30)] || 1 === r && ["y"] || ["yy", r];
            return l[2] = e, l[3] = t > 0, l[4] = i, D.apply({}, l)
        }

        function M(t, e, i) {
            var n, s = i - e,
                o = i - t.day();
            return o > s && (o -= 7), s - 7 > o && (o += 7), n = $(t).add("d", o), {
                week: Math.ceil(n.dayOfYear() / 7),
                year: n.year()
            }
        }

        function R(t) {
            var e = t._i,
                i = t._f;
            return null === e || "" === e ? null : ("string" == typeof e && (t._i = e = m().preparse(e)), $.isMoment(e) ? (t = a({}, e), t._d = new Date(+e._d)) : i ? d(i) ? C(t) : k(t) : x(t), new s(t))
        }

        function O(t, e) {
            $.fn[t] = $.fn[t + "s"] = function(t) {
                var i = this._isUTC ? "UTC" : "";
                return null != t ? (this._d["set" + i + e](t), $.updateOffset(this), this) : this._d["get" + i + e]()
            }
        }

        function N(t) {
            $.duration.fn[t] = function() {
                return this._data[t]
            }
        }

        function P(t, e) {
            $.duration.fn["as" + t] = function() {
                return +this / e
            }
        }
        for (var $, U, B = "2.2.1", F = Math.round, j = {}, H = "undefined" != typeof module && module.exports, z = /^\/?Date\((\-?\d+)/i, V = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)\:(\d+)\.?(\d{3})?/, Y = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g, X = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, W = /\d\d?/, G = /\d{1,3}/, J = /\d{3}/, K = /\d{1,4}/, q = /[+\-]?\d{1,6}/, Q = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Z = /Z|[\+\-]\d\d:?\d\d/i, te = /T/i, ee = /[\+\-]?\d+(\.\d{1,3})?/, ie = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, ne = "YYYY-MM-DDTHH:mm:ssZ", se = [
            ["HH:mm:ss.S", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
            ["HH:mm", /(T| )\d\d:\d\d/],
            ["HH", /(T| )\d\d/]
        ], oe = /([\+\-]|\d\d)/gi, ae = "Date|Hours|Minutes|Seconds|Milliseconds".split("|"), re = {
            Milliseconds: 1,
            Seconds: 1e3,
            Minutes: 6e4,
            Hours: 36e5,
            Days: 864e5,
            Months: 2592e6,
            Years: 31536e6
        }, le = {
            ms: "millisecond",
            s: "second",
            m: "minute",
            h: "hour",
            d: "day",
            w: "week",
            W: "isoweek",
            M: "month",
            y: "year"
        }, ce = {}, de = "DDD w W M D d".split(" "), he = "M D H h m s w W".split(" "), ue = {
            M: function() {
                return this.month() + 1
            },
            MMM: function(t) {
                return this.lang().monthsShort(this, t)
            },
            MMMM: function(t) {
                return this.lang().months(this, t)
            },
            D: function() {
                return this.date()
            },
            DDD: function() {
                return this.dayOfYear()
            },
            d: function() {
                return this.day()
            },
            dd: function(t) {
                return this.lang().weekdaysMin(this, t)
            },
            ddd: function(t) {
                return this.lang().weekdaysShort(this, t)
            },
            dddd: function(t) {
                return this.lang().weekdays(this, t)
            },
            w: function() {
                return this.week()
            },
            W: function() {
                return this.isoWeek()
            },
            YY: function() {
                return l(this.year() % 100, 2)
            },
            YYYY: function() {
                return l(this.year(), 4)
            },
            YYYYY: function() {
                return l(this.year(), 5)
            },
            gg: function() {
                return l(this.weekYear() % 100, 2)
            },
            gggg: function() {
                return this.weekYear()
            },
            ggggg: function() {
                return l(this.weekYear(), 5)
            },
            GG: function() {
                return l(this.isoWeekYear() % 100, 2)
            },
            GGGG: function() {
                return this.isoWeekYear()
            },
            GGGGG: function() {
                return l(this.isoWeekYear(), 5)
            },
            e: function() {
                return this.weekday()
            },
            E: function() {
                return this.isoWeekday()
            },
            a: function() {
                return this.lang().meridiem(this.hours(), this.minutes(), !0)
            },
            A: function() {
                return this.lang().meridiem(this.hours(), this.minutes(), !1)
            },
            H: function() {
                return this.hours()
            },
            h: function() {
                return this.hours() % 12 || 12
            },
            m: function() {
                return this.minutes()
            },
            s: function() {
                return this.seconds()
            },
            S: function() {
                return ~~(this.milliseconds() / 100)
            },
            SS: function() {
                return l(~~(this.milliseconds() / 10), 2)
            },
            SSS: function() {
                return l(this.milliseconds(), 3)
            },
            Z: function() {
                var t = -this.zone(),
                    e = "+";
                return 0 > t && (t = -t, e = "-"), e + l(~~(t / 60), 2) + ":" + l(~~t % 60, 2)
            },
            ZZ: function() {
                var t = -this.zone(),
                    e = "+";
                return 0 > t && (t = -t, e = "-"), e + l(~~(10 * t / 6), 4)
            },
            z: function() {
                return this.zoneAbbr()
            },
            zz: function() {
                return this.zoneName()
            },
            X: function() {
                return this.unix()
            }
        }; de.length;) U = de.pop(), ue[U + "o"] = i(ue[U], U);
        for (; he.length;) U = he.pop(), ue[U + U] = e(ue[U], 2);
        for (ue.DDDD = e(ue.DDD, 3), a(n.prototype, {
            set: function(t) {
                var e, i;
                for (i in t) e = t[i], "function" == typeof e ? this[i] = e : this["_" + i] = e
            },
            _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            months: function(t) {
                return this._months[t.month()]
            },
            _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            monthsShort: function(t) {
                return this._monthsShort[t.month()]
            },
            monthsParse: function(t) {
                var e, i, n;
                for (this._monthsParse || (this._monthsParse = []), e = 0; 12 > e; e++)
                    if (this._monthsParse[e] || (i = $.utc([2e3, e]), n = "^" + this.months(i, "") + "|^" + this.monthsShort(i, ""), this._monthsParse[e] = new RegExp(n.replace(".", ""), "i")), this._monthsParse[e].test(t)) return e
            },
            _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdays: function(t) {
                return this._weekdays[t.day()]
            },
            _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysShort: function(t) {
                return this._weekdaysShort[t.day()]
            },
            _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            weekdaysMin: function(t) {
                return this._weekdaysMin[t.day()]
            },
            weekdaysParse: function(t) {
                var e, i, n;
                for (this._weekdaysParse || (this._weekdaysParse = []), e = 0; 7 > e; e++)
                    if (this._weekdaysParse[e] || (i = $([2e3, 1]).day(e), n = "^" + this.weekdays(i, "") + "|^" + this.weekdaysShort(i, "") + "|^" + this.weekdaysMin(i, ""), this._weekdaysParse[e] = new RegExp(n.replace(".", ""), "i")), this._weekdaysParse[e].test(t)) return e
            },
            _longDateFormat: {
                LT: "h:mm A",
                L: "MM/DD/YYYY",
                LL: "MMMM D YYYY",
                LLL: "MMMM D YYYY LT",
                LLLL: "dddd, MMMM D YYYY LT"
            },
            longDateFormat: function(t) {
                var e = this._longDateFormat[t];
                return !e && this._longDateFormat[t.toUpperCase()] && (e = this._longDateFormat[t.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(t) {
                    return t.slice(1)
                }), this._longDateFormat[t] = e), e
            },
            isPM: function(t) {
                return "p" === (t + "").toLowerCase().charAt(0)
            },
            _meridiemParse: /[ap]\.?m?\.?/i,
            meridiem: function(t, e, i) {
                return t > 11 ? i ? "pm" : "PM" : i ? "am" : "AM"
            },
            _calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            calendar: function(t, e) {
                var i = this._calendar[t];
                return "function" == typeof i ? i.apply(e) : i
            },
            _relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            relativeTime: function(t, e, i, n) {
                var s = this._relativeTime[i];
                return "function" == typeof s ? s(t, e, i, n) : s.replace(/%d/i, t)
            },
            pastFuture: function(t, e) {
                var i = this._relativeTime[t > 0 ? "future" : "past"];
                return "function" == typeof i ? i(e) : i.replace(/%s/i, e)
            },
            ordinal: function(t) {
                return this._ordinal.replace("%d", t)
            },
            _ordinal: "%d",
            preparse: function(t) {
                return t
            },
            postformat: function(t) {
                return t
            },
            week: function(t) {
                return M(t, this._week.dow, this._week.doy).week
            },
            _week: {
                dow: 0,
                doy: 6
            }
        }), $ = function(t, e, i) {
            return R({
                _i: t,
                _f: e,
                _l: i,
                _isUTC: !1
            })
        }, $.utc = function(t, e, i) {
            return R({
                _useUTC: !0,
                _isUTC: !0,
                _l: i,
                _i: t,
                _f: e
            }).utc()
        }, $.unix = function(t) {
            return $(1e3 * t)
        }, $.duration = function(t, e) {
            var i, n, s = $.isDuration(t),
                a = "number" == typeof t,
                r = s ? t._input : a ? {} : t,
                l = V.exec(t);
            return a ? e ? r[e] = t : r.milliseconds = t : l && (i = "-" === l[1] ? -1 : 1, r = {
                y: 0,
                d: ~~l[2] * i,
                h: ~~l[3] * i,
                m: ~~l[4] * i,
                s: ~~l[5] * i,
                ms: ~~l[6] * i
            }), n = new o(r), s && t.hasOwnProperty("_lang") && (n._lang = t._lang), n
        }, $.version = B, $.defaultFormat = ne, $.updateOffset = function() {}, $.lang = function(t, e) {
            return t ? (t = t.toLowerCase(), t = t.replace("_", "-"), e ? p(t, e) : null === e ? (f(t), t = "en") : j[t] || m(t), void($.duration.fn._lang = $.fn._lang = m(t))) : $.fn._lang._abbr
        }, $.langData = function(t) {
            return t && t._lang && t._lang._abbr && (t = t._lang._abbr), m(t)
        }, $.isMoment = function(t) {
            return t instanceof s
        }, $.isDuration = function(t) {
            return t instanceof o
        }, a($.fn = s.prototype, {
            clone: function() {
                return $(this)
            },
            valueOf: function() {
                return +this._d + 6e4 * (this._offset || 0)
            },
            unix: function() {
                return Math.floor(+this / 1e3)
            },
            toString: function() {
                return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
            },
            toDate: function() {
                return this._offset ? new Date(+this) : this._d
            },
            toISOString: function() {
                return b($(this).utc(), "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
            },
            toArray: function() {
                var t = this;
                return [t.year(), t.month(), t.date(), t.hours(), t.minutes(), t.seconds(), t.milliseconds()]
            },
            isValid: function() {
                return null == this._isValid && (this._isValid = this._a ? !h(this._a, (this._isUTC ? $.utc(this._a) : $(this._a)).toArray()) : !isNaN(this._d.getTime())), !!this._isValid
            },
            invalidAt: function() {
                var t, e = this._a,
                    i = (this._isUTC ? $.utc(this._a) : $(this._a)).toArray();
                for (t = 6; t >= 0 && e[t] === i[t]; --t);
                return t
            },
            utc: function() {
                return this.zone(0)
            },
            local: function() {
                return this.zone(0), this._isUTC = !1, this
            },
            format: function(t) {
                var e = b(this, t || $.defaultFormat);
                return this.lang().postformat(e)
            },
            add: function(t, e) {
                var i;
                return i = "string" == typeof t ? $.duration(+e, t) : $.duration(t, e), c(this, i, 1), this
            },
            subtract: function(t, e) {
                var i;
                return i = "string" == typeof t ? $.duration(+e, t) : $.duration(t, e), c(this, i, -1), this
            },
            diff: function(t, e, i) {
                var n, s, o = this._isUTC ? $(t).zone(this._offset || 0) : $(t).local(),
                    a = 6e4 * (this.zone() - o.zone());
                return e = u(e), "year" === e || "month" === e ? (n = 432e5 * (this.daysInMonth() + o.daysInMonth()), s = 12 * (this.year() - o.year()) + (this.month() - o.month()), s += (this - $(this).startOf("month") - (o - $(o).startOf("month"))) / n, s -= 6e4 * (this.zone() - $(this).startOf("month").zone() - (o.zone() - $(o).startOf("month").zone())) / n, "year" === e && (s /= 12)) : (n = this - o, s = "second" === e ? n / 1e3 : "minute" === e ? n / 6e4 : "hour" === e ? n / 36e5 : "day" === e ? (n - a) / 864e5 : "week" === e ? (n - a) / 6048e5 : n), i ? s : r(s)
            },
            from: function(t, e) {
                return $.duration(this.diff(t)).lang(this.lang()._abbr).humanize(!e)
            },
            fromNow: function(t) {
                return this.from($(), t)
            },
            calendar: function() {
                var t = this.diff($().zone(this.zone()).startOf("day"), "days", !0),
                    e = -6 > t ? "sameElse" : -1 > t ? "lastWeek" : 0 > t ? "lastDay" : 1 > t ? "sameDay" : 2 > t ? "nextDay" : 7 > t ? "nextWeek" : "sameElse";
                return this.format(this.lang().calendar(e, this))
            },
            isLeapYear: function() {
                var t = this.year();
                return 0 === t % 4 && 0 !== t % 100 || 0 === t % 400
            },
            isDST: function() {
                return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone()
            },
            day: function(t) {
                var e = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                return null != t ? "string" == typeof t && (t = this.lang().weekdaysParse(t), "number" != typeof t) ? this : this.add({
                    d: t - e
                }) : e
            },
            month: function(t) {
                var e, i = this._isUTC ? "UTC" : "";
                return null != t ? "string" == typeof t && (t = this.lang().monthsParse(t), "number" != typeof t) ? this : (e = this.date(), this.date(1), this._d["set" + i + "Month"](t), this.date(Math.min(e, this.daysInMonth())), $.updateOffset(this), this) : this._d["get" + i + "Month"]()
            },
            startOf: function(t) {
                switch (t = u(t)) {
                    case "year":
                        this.month(0);
                    case "month":
                        this.date(1);
                    case "week":
                    case "isoweek":
                    case "day":
                        this.hours(0);
                    case "hour":
                        this.minutes(0);
                    case "minute":
                        this.seconds(0);
                    case "second":
                        this.milliseconds(0)
                }
                return "week" === t ? this.weekday(0) : "isoweek" === t && this.isoWeekday(1), this
            },
            endOf: function(t) {
                return t = u(t), this.startOf(t).add("isoweek" === t ? "week" : t, 1).subtract("ms", 1)
            },
            isAfter: function(t, e) {
                return e = "undefined" != typeof e ? e : "millisecond", +this.clone().startOf(e) > +$(t).startOf(e)
            },
            isBefore: function(t, e) {
                return e = "undefined" != typeof e ? e : "millisecond", +this.clone().startOf(e) < +$(t).startOf(e)
            },
            isSame: function(t, e) {
                return e = "undefined" != typeof e ? e : "millisecond", +this.clone().startOf(e) === +$(t).startOf(e)
            },
            min: function(t) {
                return t = $.apply(null, arguments), this > t ? this : t
            },
            max: function(t) {
                return t = $.apply(null, arguments), t > this ? this : t
            },
            zone: function(t) {
                var e = this._offset || 0;
                return null == t ? this._isUTC ? e : this._d.getTimezoneOffset() : ("string" == typeof t && (t = E(t)), Math.abs(t) < 16 && (t = 60 * t), this._offset = t, this._isUTC = !0, e !== t && c(this, $.duration(e - t, "m"), 1, !0), this)
            },
            zoneAbbr: function() {
                return this._isUTC ? "UTC" : ""
            },
            zoneName: function() {
                return this._isUTC ? "Coordinated Universal Time" : ""
            },
            hasAlignedHourOffset: function(t) {
                return t = t ? $(t).zone() : 0, 0 === (this.zone() - t) % 60
            },
            daysInMonth: function() {
                return $.utc([this.year(), this.month() + 1, 0]).date()
            },
            dayOfYear: function(t) {
                var e = F(($(this).startOf("day") - $(this).startOf("year")) / 864e5) + 1;
                return null == t ? e : this.add("d", t - e)
            },
            weekYear: function(t) {
                var e = M(this, this.lang()._week.dow, this.lang()._week.doy).year;
                return null == t ? e : this.add("y", t - e)
            },
            isoWeekYear: function(t) {
                var e = M(this, 1, 4).year;
                return null == t ? e : this.add("y", t - e)
            },
            week: function(t) {
                var e = this.lang().week(this);
                return null == t ? e : this.add("d", 7 * (t - e))
            },
            isoWeek: function(t) {
                var e = M(this, 1, 4).week;
                return null == t ? e : this.add("d", 7 * (t - e))
            },
            weekday: function(t) {
                var e = (this._d.getDay() + 7 - this.lang()._week.dow) % 7;
                return null == t ? e : this.add("d", t - e)
            },
            isoWeekday: function(t) {
                return null == t ? this.day() || 7 : this.day(this.day() % 7 ? t : t - 7)
            },
            get: function(t) {
                return t = u(t), this[t.toLowerCase()]()
            },
            set: function(t, e) {
                t = u(t), this[t.toLowerCase()](e)
            },
            lang: function(e) {
                return e === t ? this._lang : (this._lang = m(e), this)
            }
        }), U = 0; U < ae.length; U++) O(ae[U].toLowerCase().replace(/s$/, ""), ae[U]);
        O("year", "FullYear"), $.fn.days = $.fn.day, $.fn.months = $.fn.month, $.fn.weeks = $.fn.week, $.fn.isoWeeks = $.fn.isoWeek, $.fn.toJSON = $.fn.toISOString, a($.duration.fn = o.prototype, {
            _bubble: function() {
                var t, e, i, n, s = this._milliseconds,
                    o = this._days,
                    a = this._months,
                    l = this._data;
                l.milliseconds = s % 1e3, t = r(s / 1e3), l.seconds = t % 60, e = r(t / 60), l.minutes = e % 60, i = r(e / 60), l.hours = i % 24, o += r(i / 24), l.days = o % 30, a += r(o / 30), l.months = a % 12, n = r(a / 12), l.years = n
            },
            weeks: function() {
                return r(this.days() / 7)
            },
            valueOf: function() {
                return this._milliseconds + 864e5 * this._days + 2592e6 * (this._months % 12) + 31536e6 * ~~(this._months / 12)
            },
            humanize: function(t) {
                var e = +this,
                    i = I(e, !t, this.lang());
                return t && (i = this.lang().pastFuture(e, i)), this.lang().postformat(i)
            },
            add: function(t, e) {
                var i = $.duration(t, e);
                return this._milliseconds += i._milliseconds, this._days += i._days, this._months += i._months, this._bubble(), this
            },
            subtract: function(t, e) {
                var i = $.duration(t, e);
                return this._milliseconds -= i._milliseconds, this._days -= i._days, this._months -= i._months, this._bubble(), this
            },
            get: function(t) {
                return t = u(t), this[t.toLowerCase() + "s"]()
            },
            as: function(t) {
                return t = u(t), this["as" + t.charAt(0).toUpperCase() + t.slice(1) + "s"]()
            },
            lang: $.fn.lang
        });
        for (U in re) re.hasOwnProperty(U) && (P(U, re[U]), N(U.toLowerCase()));
        P("Weeks", 6048e5), $.duration.fn.asMonths = function() {
            return (+this - 31536e6 * this.years()) / 2592e6 + 12 * this.years()
        }, $.lang("en", {
            ordinal: function(t) {
                var e = t % 10,
                    i = 1 === ~~(t % 100 / 10) ? "th" : 1 === e ? "st" : 2 === e ? "nd" : 3 === e ? "rd" : "th";
                return t + i
            }
        }), H && (module.exports = $), "undefined" == typeof ender && (this.moment = $), "function" == typeof define && define.amd && define("moment", [], function() {
            return $
        })
    }.call(this),
    function(t, e) {
        "object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Spinner = e()
    }(this, function() {
        "use strict";

        function t(t, e) {
            var i, n = document.createElement(t || "div");
            for (i in e) n[i] = e[i];
            return n
        }

        function e(t) {
            for (var e = 1, i = arguments.length; i > e; e++) t.appendChild(arguments[e]);
            return t
        }

        function i(t, e, i, n) {
            var s = ["opacity", e, ~~(100 * t), i, n].join("-"),
                o = .01 + i / n * 100,
                a = Math.max(1 - (1 - t) / e * (100 - o), t),
                r = c.substring(0, c.indexOf("Animation")).toLowerCase(),
                l = r && "-" + r + "-" || "";
            return h[s] || (u.insertRule("@" + l + "keyframes " + s + "{0%{opacity:" + a + "}" + o + "%{opacity:" + t + "}" + (o + .01) + "%{opacity:1}" + (o + e) % 100 + "%{opacity:" + t + "}100%{opacity:" + a + "}}", u.cssRules.length), h[s] = 1), s
        }

        function n(t, e) {
            var i, n, s = t.style;
            if (void 0 !== s[e]) return e;
            for (e = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < d.length; n++)
                if (i = d[n] + e, void 0 !== s[i]) return i
        }

        function s(t, e) {
            for (var i in e) t.style[n(t, i) || i] = e[i];
            return t
        }

        function o(t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var n in i) void 0 === t[n] && (t[n] = i[n])
            }
            return t
        }

        function a(t) {
            for (var e = {
                x: t.offsetLeft,
                y: t.offsetTop
            }; t = t.offsetParent;) e.x += t.offsetLeft, e.y += t.offsetTop;
            return e
        }

        function r(t) {
            return "undefined" == typeof this ? new r(t) : void(this.opts = o(t || {}, r.defaults, p))
        }

        function l() {
            function i(e, i) {
                return t("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', i)
            }
            u.addRule(".spin-vml", "behavior:url(#default#VML)"), r.prototype.lines = function(t, n) {
                function o() {
                    return s(i("group", {
                        coordsize: c + " " + c,
                        coordorigin: -l + " " + -l
                    }), {
                        width: c,
                        height: c
                    })
                }

                function a(t, a, r) {
                    e(h, e(s(o(), {
                        rotation: 360 / n.lines * t + "deg",
                        left: ~~a
                    }), e(s(i("roundrect", {
                        arcsize: n.corners
                    }), {
                        width: l,
                        height: n.width,
                        left: n.radius,
                        top: -n.width >> 1,
                        filter: r
                    }), i("fill", {
                        color: n.color,
                        opacity: n.opacity
                    }), i("stroke", {
                        opacity: 0
                    }))))
                }
                var r, l = n.length + n.width,
                    c = 2 * l,
                    d = 2 * -(n.width + n.length) + "px",
                    h = s(o(), {
                        position: "absolute",
                        top: d,
                        left: d
                    });
                if (n.shadow)
                    for (r = 1; r <= n.lines; r++) a(r, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
                for (r = 1; r <= n.lines; r++) a(r);
                return e(t, h)
            }, r.prototype.opacity = function(t, e, i, n) {
                var s = t.firstChild;
                n = n.shadow && n.lines || 0, s && e + n < s.childNodes.length && (s = s.childNodes[e + n], s = s && s.firstChild, s = s && s.firstChild, s && (s.opacity = i))
            }
        }
        var c, d = ["webkit", "Moz", "ms", "O"],
            h = {},
            u = function() {
                var i = t("style", {
                    type: "text/css"
                });
                return e(document.getElementsByTagName("head")[0], i), i.sheet || i.styleSheet
            }(),
            p = {
                lines: 12,
                length: 7,
                width: 5,
                radius: 10,
                rotate: 0,
                corners: 1,
                color: "#000",
                direction: 1,
                speed: 1,
                trail: 100,
                opacity: .25,
                fps: 20,
                zIndex: 2e9,
                className: "spinner",
                top: "auto",
                left: "auto",
                position: "relative"
            };
        r.defaults = {}, o(r.prototype, {
            spin: function(e) {
                this.stop();
                var i, n, o = this,
                    r = o.opts,
                    l = o.el = s(t(0, {
                        className: r.className
                    }), {
                        position: r.position,
                        width: 0,
                        zIndex: r.zIndex
                    }),
                    d = r.radius + r.length + r.width;
                if (e && (e.insertBefore(l, e.firstChild || null), n = a(e), i = a(l), s(l, {
                        left: ("auto" == r.left ? n.x - i.x + (e.offsetWidth >> 1) : parseInt(r.left, 10) + d) + "px",
                        top: ("auto" == r.top ? n.y - i.y + (e.offsetHeight >> 1) : parseInt(r.top, 10) + d) + "px"
                    })), l.setAttribute("role", "progressbar"), o.lines(l, o.opts), !c) {
                    var h, u = 0,
                        p = (r.lines - 1) * (1 - r.direction) / 2,
                        f = r.fps,
                        m = f / r.speed,
                        g = (1 - r.opacity) / (m * r.trail / 100),
                        v = m / r.lines;
                    ! function b() {
                        u++;
                        for (var t = 0; t < r.lines; t++) h = Math.max(1 - (u + (r.lines - t) * v) % m * g, r.opacity), o.opacity(l, t * r.direction + p, h, r);
                        o.timeout = o.el && setTimeout(b, ~~(1e3 / f))
                    }()
                }
                return o
            },
            stop: function() {
                var t = this.el;
                return t && (clearTimeout(this.timeout), t.parentNode && t.parentNode.removeChild(t), this.el = void 0), this
            },
            lines: function(n, o) {
                function a(e, i) {
                    return s(t(), {
                        position: "absolute",
                        width: o.length + o.width + "px",
                        height: o.width + "px",
                        background: e,
                        boxShadow: i,
                        transformOrigin: "left",
                        transform: "rotate(" + ~~(360 / o.lines * l + o.rotate) + "deg) translate(" + o.radius + "px,0)",
                        borderRadius: (o.corners * o.width >> 1) + "px"
                    })
                }
                for (var r, l = 0, d = (o.lines - 1) * (1 - o.direction) / 2; l < o.lines; l++) r = s(t(), {
                    position: "absolute",
                    top: 1 + ~(o.width / 2) + "px",
                    transform: o.hwaccel ? "translate3d(0,0,0)" : "",
                    opacity: o.opacity,
                    animation: c && i(o.opacity, o.trail, d + l * o.direction, o.lines) + " " + 1 / o.speed + "s linear infinite"
                }), o.shadow && e(r, s(a("#000", "0 0 4px #000"), {
                    top: "2px"
                })), e(n, e(r, a(o.color, "0 0 1px rgba(0,0,0,.1)")));
                return n
            },
            opacity: function(t, e, i) {
                e < t.childNodes.length && (t.childNodes[e].style.opacity = i)
            }
        });
        var f = s(t("group"), {
            behavior: "url(#default#VML)"
        });
        return !n(f, "transform") && f.adj ? l() : c = n(f, "animation"), r
    }),
/*** debut ladda ***/

/*** fin ladda ***/
    function(t, e) {
        function i(t, e, i) {
            return t.addEventListener ? void t.addEventListener(e, i, !1) : void t.attachEvent("on" + e, i)
        }

        function n(t) {
            if ("keypress" == t.type) {
                var e = String.fromCharCode(t.which);
                return t.shiftKey || (e = e.toLowerCase()), e
            }
            return _[t.which] ? _[t.which] : w[t.which] ? w[t.which] : String.fromCharCode(t.which).toLowerCase()
        }

        function s(t, e) {
            return t.sort().join(",") === e.sort().join(",")
        }

        function o(t) {
            t = t || {};
            var e, i = !1;
            for (e in D) t[e] ? i = !0 : D[e] = 0;
            i || (R = !1)
        }

        function a(t, e, i, n, o, a) {
            var r, l, c = [],
                d = i.type;
            if (!A[t]) return [];
            for ("keyup" == d && p(t) && (e = [t]), r = 0; r < A[t].length; ++r)
                if (l = A[t][r], (n || !l.seq || D[l.seq] == l.level) && d == l.action && ("keypress" == d && !i.metaKey && !i.ctrlKey || s(e, l.modifiers))) {
                    var h = !n && l.combo == o,
                        u = n && l.seq == n && l.level == a;
                    (h || u) && A[t].splice(r, 1), c.push(l)
                }
            return c
        }

        function r(t) {
            var e = [];
            return t.shiftKey && e.push("shift"), t.altKey && e.push("alt"), t.ctrlKey && e.push("ctrl"), t.metaKey && e.push("meta"), e
        }

        function l(t) {
            return t.preventDefault ? void t.preventDefault() : void(t.returnValue = !1)
        }

        function c(t) {
            return t.stopPropagation ? void t.stopPropagation() : void(t.cancelBubble = !0)
        }

        function d(t, e, i, n) {
            N.stopCallback(e, e.target || e.srcElement, i, n) || t(e, i) === !1 && (l(e), c(e))
        }

        function h(t, e, i) {
            var n, s = a(t, e, i),
                r = {},
                l = 0,
                c = !1;
            for (n = 0; n < s.length; ++n) s[n].seq && (l = Math.max(l, s[n].level));
            for (n = 0; n < s.length; ++n)
                if (s[n].seq) {
                    if (s[n].level != l) continue;
                    c = !0, r[s[n].seq] = 1, d(s[n].callback, i, s[n].combo, s[n].seq)
                } else c || d(s[n].callback, i, s[n].combo);
            var h = "keypress" == i.type && M;
            i.type != R || p(t) || h || o(r), M = c && "keydown" == i.type
        }

        function u(t) {
            "number" != typeof t.which && (t.which = t.keyCode);
            var e = n(t);
            if (e) return "keyup" == t.type && I === e ? void(I = !1) : void N.handleKey(e, r(t), t)
        }

        function p(t) {
            return "shift" == t || "ctrl" == t || "alt" == t || "meta" == t
        }

        function f() {
            clearTimeout(L), L = setTimeout(o, 1e3)
        }

        function m() {
            if (!T) {
                T = {};
                for (var t in _) t > 95 && 112 > t || _.hasOwnProperty(t) && (T[_[t]] = t)
            }
            return T
        }

        function g(t, e, i) {
            return i || (i = m()[t] ? "keydown" : "keypress"), "keypress" == i && e.length && (i = "keydown"), i
        }

        function v(t, e, i, s) {
            function a(e) {
                return function() {
                    R = e, ++D[t], f()
                }
            }

            function r(e) {
                d(i, e, t), "keyup" !== s && (I = n(e)), setTimeout(o, 10)
            }
            D[t] = 0;
            for (var l = 0; l < e.length; ++l) {
                var c = l + 1 === e.length,
                    h = c ? r : a(s || S(e[l + 1]).action);
                y(e[l], h, s, t, l)
            }
        }

        function b(t) {
            return "+" === t ? ["+"] : t.split("+")
        }

        function S(t, e) {
            var i, n, s, o = [];
            for (i = b(t), s = 0; s < i.length; ++s) n = i[s], C[n] && (n = C[n]), e && "keypress" != e && k[n] && (n = k[n], o.push("shift")), p(n) && o.push(n);
            return e = g(n, o, e), {
                key: n,
                modifiers: o,
                action: e
            }
        }

        function y(t, e, i, n, s) {
            x[t + ":" + i] = e, t = t.replace(/\s+/g, " ");
            var o, r = t.split(" ");
            return r.length > 1 ? void v(t, r, e, i) : (o = S(t, i), A[o.key] = A[o.key] || [], a(o.key, o.modifiers, {
                type: o.action
            }, n, t, s), void A[o.key][n ? "unshift" : "push"]({
                callback: e,
                modifiers: o.modifiers,
                action: o.action,
                seq: n,
                level: s,
                combo: t
            }))
        }

        function E(t, e, i) {
            for (var n = 0; n < t.length; ++n) y(t[n], e, i)
        }
        for (var T, L, _ = {
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "ins",
            46: "del",
            91: "meta",
            93: "meta",
            224: "meta"
        }, w = {
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        }, k = {
            "~": "`",
            "!": "1",
            "@": "2",
            "#": "3",
            $: "4",
            "%": "5",
            "^": "6",
            "&": "7",
            "*": "8",
            "(": "9",
            ")": "0",
            _: "-",
            "+": "=",
            ":": ";",
            '"': "'",
            "<": ",",
            ">": ".",
            "?": "/",
            "|": "\\"
        }, C = {
            option: "alt",
            command: "meta",
            "return": "enter",
            escape: "esc",
            mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
        }, A = {}, x = {}, D = {}, I = !1, M = !1, R = !1, O = 1; 20 > O; ++O) _[111 + O] = "f" + O;
        for (O = 0; 9 >= O; ++O) _[O + 96] = O;
        i(e, "keypress", u), i(e, "keydown", u), i(e, "keyup", u);
        var N = {
            bind: function(t, e, i) {
                return t = t instanceof Array ? t : [t], E(t, e, i), this
            },
            unbind: function(t, e) {
                return N.bind(t, function() {}, e)
            },
            trigger: function(t, e) {
                return x[t + ":" + e] && x[t + ":" + e]({}, t), this
            },
            reset: function() {
                return A = {}, x = {}, this
            },
            stopCallback: function(t, e) {
                return (" " + e.className + " ").indexOf(" mousetrap ") > -1 ? !1 : "INPUT" == e.tagName || "SELECT" == e.tagName || "TEXTAREA" == e.tagName || e.isContentEditable
            },
            handleKey: h
        };
        t.Mousetrap = N, "function" == typeof define && define.amd && define(N)
    }(window, document),
    function(t, e, i, n) {
        "use strict";

        function s(t, e, i) {
            return setTimeout(d(t, i), e)
        }

        function o(t, e, i) {
            return Array.isArray(t) ? (a(t, i[e], i), !0) : !1
        }

        function a(t, e, i) {
            var s;
            if (t)
                if (t.forEach) t.forEach(e, i);
                else if (t.length !== n)
                    for (s = 0; s < t.length;) e.call(i, t[s], s, t), s++;
                else
                    for (s in t) t.hasOwnProperty(s) && e.call(i, t[s], s, t)
        }

        function r(t, e, i) {
            for (var s = Object.keys(e), o = 0; o < s.length;)(!i || i && t[s[o]] === n) && (t[s[o]] = e[s[o]]), o++;
            return t
        }

        function l(t, e) {
            return r(t, e, !0)
        }

        function c(t, e, i) {
            var n, s = e.prototype;
            n = t.prototype = Object.create(s), n.constructor = t, n._super = s, i && r(n, i)
        }

        function d(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        }

        function h(t, e) {
            return typeof t == de ? t.apply(e ? e[0] || n : n, e) : t
        }

        function u(t, e) {
            return t === n ? e : t
        }

        function p(t, e, i) {
            a(v(e), function(e) {
                t.addEventListener(e, i, !1)
            })
        }

        function f(t, e, i) {
            a(v(e), function(e) {
                t.removeEventListener(e, i, !1)
            })
        }

        function m(t, e) {
            for (; t;) {
                if (t == e) return !0;
                t = t.parentNode
            }
            return !1
        }

        function g(t, e) {
            return t.indexOf(e) > -1
        }

        function v(t) {
            return t.trim().split(/\s+/g)
        }

        function b(t, e, i) {
            if (t.indexOf && !i) return t.indexOf(e);
            for (var n = 0; n < t.length;) {
                if (i && t[n][i] == e || !i && t[n] === e) return n;
                n++
            }
            return -1
        }

        function S(t) {
            return Array.prototype.slice.call(t, 0)
        }

        function y(t, e, i) {
            for (var n = [], s = [], o = 0; o < t.length;) {
                var a = e ? t[o][e] : t[o];
                b(s, a) < 0 && n.push(t[o]), s[o] = a, o++
            }
            return i && (n = e ? n.sort(function(t, i) {
                return t[e] > i[e]
            }) : n.sort()), n
        }

        function E(t, e) {
            for (var i, s, o = e[0].toUpperCase() + e.slice(1), a = 0; a < le.length;) {
                if (i = le[a], s = i ? i + o : e, s in t) return s;
                a++
            }
            return n
        }

        function T() {
            return fe++
        }

        function L(t) {
            var e = t.ownerDocument;
            return e.defaultView || e.parentWindow
        }

        function _(t, e) {
            var i = this;
            this.manager = t, this.callback = e, this.element = t.element, this.target = t.options.inputTarget, this.domHandler = function(e) {
                h(t.options.enable, [t]) && i.handler(e)
            }, this.init()
        }

        function w(t) {
            var e, i = t.options.inputClass;
            return new(e = i ? i : ve ? B : be ? H : ge ? V : U)(t, k)
        }

        function k(t, e, i) {
            var n = i.pointers.length,
                s = i.changedPointers.length,
                o = e & _e && n - s === 0,
                a = e & (ke | Ce) && n - s === 0;
            i.isFirst = !!o, i.isFinal = !!a, o && (t.session = {}), i.eventType = e, C(t, i), t.emit("hammer.input", i), t.recognize(i), t.session.prevInput = i
        }

        function C(t, e) {
            var i = t.session,
                n = e.pointers,
                s = n.length;
            i.firstInput || (i.firstInput = D(e)), s > 1 && !i.firstMultiple ? i.firstMultiple = D(e) : 1 === s && (i.firstMultiple = !1);
            var o = i.firstInput,
                a = i.firstMultiple,
                r = a ? a.center : o.center,
                l = e.center = I(n);
            e.timeStamp = pe(), e.deltaTime = e.timeStamp - o.timeStamp, e.angle = N(r, l), e.distance = O(r, l), A(i, e), e.offsetDirection = R(e.deltaX, e.deltaY), e.scale = a ? $(a.pointers, n) : 1, e.rotation = a ? P(a.pointers, n) : 0, x(i, e);
            var c = t.element;
            m(e.srcEvent.target, c) && (c = e.srcEvent.target), e.target = c
        }

        function A(t, e) {
            var i = e.center,
                n = t.offsetDelta || {},
                s = t.prevDelta || {},
                o = t.prevInput || {};
            (e.eventType === _e || o.eventType === ke) && (s = t.prevDelta = {
                x: o.deltaX || 0,
                y: o.deltaY || 0
            }, n = t.offsetDelta = {
                x: i.x,
                y: i.y
            }), e.deltaX = s.x + (i.x - n.x), e.deltaY = s.y + (i.y - n.y)
        }

        function x(t, e) {
            var i, s, o, a, r = t.lastInterval || e,
                l = e.timeStamp - r.timeStamp;
            if (e.eventType != Ce && (l > Le || r.velocity === n)) {
                var c = r.deltaX - e.deltaX,
                    d = r.deltaY - e.deltaY,
                    h = M(l, c, d);
                s = h.x, o = h.y, i = ue(h.x) > ue(h.y) ? h.x : h.y, a = R(c, d), t.lastInterval = e
            } else i = r.velocity, s = r.velocityX, o = r.velocityY, a = r.direction;
            e.velocity = i, e.velocityX = s, e.velocityY = o, e.direction = a
        }

        function D(t) {
            for (var e = [], i = 0; i < t.pointers.length;) e[i] = {
                clientX: he(t.pointers[i].clientX),
                clientY: he(t.pointers[i].clientY)
            }, i++;
            return {
                timeStamp: pe(),
                pointers: e,
                center: I(e),
                deltaX: t.deltaX,
                deltaY: t.deltaY
            }
        }

        function I(t) {
            var e = t.length;
            if (1 === e) return {
                x: he(t[0].clientX),
                y: he(t[0].clientY)
            };
            for (var i = 0, n = 0, s = 0; e > s;) i += t[s].clientX, n += t[s].clientY, s++;
            return {
                x: he(i / e),
                y: he(n / e)
            }
        }

        function M(t, e, i) {
            return {
                x: e / t || 0,
                y: i / t || 0
            }
        }

        function R(t, e) {
            return t === e ? Ae : ue(t) >= ue(e) ? t > 0 ? xe : De : e > 0 ? Ie : Me
        }

        function O(t, e, i) {
            i || (i = Pe);
            var n = e[i[0]] - t[i[0]],
                s = e[i[1]] - t[i[1]];
            return Math.sqrt(n * n + s * s)
        }

        function N(t, e, i) {
            i || (i = Pe);
            var n = e[i[0]] - t[i[0]],
                s = e[i[1]] - t[i[1]];
            return 180 * Math.atan2(s, n) / Math.PI
        }

        function P(t, e) {
            return N(e[1], e[0], $e) - N(t[1], t[0], $e)
        }

        function $(t, e) {
            return O(e[0], e[1], $e) / O(t[0], t[1], $e)
        }

        function U() {
            this.evEl = Be, this.evWin = Fe, this.allow = !0, this.pressed = !1, _.apply(this, arguments)
        }

        function B() {
            this.evEl = ze, this.evWin = Ve, _.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
        }

        function F() {
            this.evTarget = Xe, this.evWin = We, this.started = !1, _.apply(this, arguments)
        }

        function j(t, e) {
            var i = S(t.touches),
                n = S(t.changedTouches);
            return e & (ke | Ce) && (i = y(i.concat(n), "identifier", !0)), [i, n]
        }

        function H() {
            this.evTarget = Je, this.targetIds = {}, _.apply(this, arguments)
        }

        function z(t, e) {
            var i = S(t.touches),
                n = this.targetIds;
            if (e & (_e | we) && 1 === i.length) return n[i[0].identifier] = !0, [i, i];
            var s, o, a = S(t.changedTouches),
                r = [],
                l = this.target;
            if (o = i.filter(function(t) {
                    return m(t.target, l)
                }), e === _e)
                for (s = 0; s < o.length;) n[o[s].identifier] = !0, s++;
            for (s = 0; s < a.length;) n[a[s].identifier] && r.push(a[s]), e & (ke | Ce) && delete n[a[s].identifier], s++;
            return r.length ? [y(o.concat(r), "identifier", !0), r] : void 0
        }

        function V() {
            _.apply(this, arguments);
            var t = d(this.handler, this);
            this.touch = new H(this.manager, t), this.mouse = new U(this.manager, t)
        }

        function Y(t, e) {
            this.manager = t, this.set(e)
        }

        function X(t) {
            if (g(t, ei)) return ei;
            var e = g(t, ii),
                i = g(t, ni);
            return e && i ? ii + " " + ni : e || i ? e ? ii : ni : g(t, ti) ? ti : Ze
        }

        function W(t) {
            this.id = T(), this.manager = null, this.options = l(t || {}, this.defaults), this.options.enable = u(this.options.enable, !0), this.state = si, this.simultaneous = {}, this.requireFail = []
        }

        function G(t) {
            return t & ci ? "cancel" : t & ri ? "end" : t & ai ? "move" : t & oi ? "start" : ""
        }

        function J(t) {
            return t == Me ? "down" : t == Ie ? "up" : t == xe ? "left" : t == De ? "right" : ""
        }

        function K(t, e) {
            var i = e.manager;
            return i ? i.get(t) : t
        }

        function q() {
            W.apply(this, arguments)
        }

        function Q() {
            q.apply(this, arguments), this.pX = null, this.pY = null
        }

        function Z() {
            q.apply(this, arguments)
        }

        function te() {
            W.apply(this, arguments), this._timer = null, this._input = null
        }

        function ee() {
            q.apply(this, arguments)
        }

        function ie() {
            q.apply(this, arguments)
        }

        function ne() {
            W.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
        }

        function se(t, e) {
            return e = e || {}, e.recognizers = u(e.recognizers, se.defaults.preset), new oe(t, e)
        }

        function oe(t, e) {
            e = e || {}, this.options = l(e, se.defaults), this.options.inputTarget = this.options.inputTarget || t, this.handlers = {}, this.session = {}, this.recognizers = [], this.element = t, this.input = w(this), this.touchAction = new Y(this, this.options.touchAction), ae(this, !0), a(e.recognizers, function(t) {
                var e = this.add(new t[0](t[1]));
                t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3])
            }, this)
        }

        function ae(t, e) {
            var i = t.element;
            a(t.options.cssProps, function(t, n) {
                i.style[E(i.style, n)] = e ? t : ""
            })
        }

        function re(t, i) {
            var n = e.createEvent("Event");
            n.initEvent(t, !0, !0), n.gesture = i, i.target.dispatchEvent(n)
        }
        var le = ["", "webkit", "moz", "MS", "ms", "o"],
            ce = e.createElement("div"),
            de = "function",
            he = Math.round,
            ue = Math.abs,
            pe = Date.now,
            fe = 1,
            me = /mobile|tablet|ip(ad|hone|od)|android/i,
            ge = "ontouchstart" in t,
            ve = E(t, "PointerEvent") !== n,
            be = ge && me.test(navigator.userAgent),
            Se = "touch",
            ye = "pen",
            Ee = "mouse",
            Te = "kinect",
            Le = 25,
            _e = 1,
            we = 2,
            ke = 4,
            Ce = 8,
            Ae = 1,
            xe = 2,
            De = 4,
            Ie = 8,
            Me = 16,
            Re = xe | De,
            Oe = Ie | Me,
            Ne = Re | Oe,
            Pe = ["x", "y"],
            $e = ["clientX", "clientY"];
        _.prototype = {
            handler: function() {},
            init: function() {
                this.evEl && p(this.element, this.evEl, this.domHandler), this.evTarget && p(this.target, this.evTarget, this.domHandler), this.evWin && p(L(this.element), this.evWin, this.domHandler)
            },
            destroy: function() {
                this.evEl && f(this.element, this.evEl, this.domHandler), this.evTarget && f(this.target, this.evTarget, this.domHandler), this.evWin && f(L(this.element), this.evWin, this.domHandler)
            }
        };
        var Ue = {
                mousedown: _e,
                mousemove: we,
                mouseup: ke
            },
            Be = "mousedown",
            Fe = "mousemove mouseup";
        c(U, _, {
            handler: function(t) {
                var e = Ue[t.type];
                e & _e && 0 === t.button && (this.pressed = !0), e & we && 1 !== t.which && (e = ke), this.pressed && this.allow && (e & ke && (this.pressed = !1), this.callback(this.manager, e, {
                    pointers: [t],
                    changedPointers: [t],
                    pointerType: Ee,
                    srcEvent: t
                }))
            }
        });
        var je = {
                pointerdown: _e,
                pointermove: we,
                pointerup: ke,
                pointercancel: Ce,
                pointerout: Ce
            },
            He = {
                2: Se,
                3: ye,
                4: Ee,
                5: Te
            },
            ze = "pointerdown",
            Ve = "pointermove pointerup pointercancel";
        t.MSPointerEvent && (ze = "MSPointerDown", Ve = "MSPointerMove MSPointerUp MSPointerCancel"), c(B, _, {
            handler: function(t) {
                var e = this.store,
                    i = !1,
                    n = t.type.toLowerCase().replace("ms", ""),
                    s = je[n],
                    o = He[t.pointerType] || t.pointerType,
                    a = o == Se,
                    r = b(e, t.pointerId, "pointerId");
                s & _e && (0 === t.button || a) ? 0 > r && (e.push(t), r = e.length - 1) : s & (ke | Ce) && (i = !0), 0 > r || (e[r] = t, this.callback(this.manager, s, {
                    pointers: e,
                    changedPointers: [t],
                    pointerType: o,
                    srcEvent: t
                }), i && e.splice(r, 1))
            }
        });
        var Ye = {
                touchstart: _e,
                touchmove: we,
                touchend: ke,
                touchcancel: Ce
            },
            Xe = "touchstart",
            We = "touchstart touchmove touchend touchcancel";
        c(F, _, {
            handler: function(t) {
                var e = Ye[t.type];
                if (e === _e && (this.started = !0), this.started) {
                    var i = j.call(this, t, e);
                    e & (ke | Ce) && i[0].length - i[1].length === 0 && (this.started = !1), this.callback(this.manager, e, {
                        pointers: i[0],
                        changedPointers: i[1],
                        pointerType: Se,
                        srcEvent: t
                    })
                }
            }
        });
        var Ge = {
                touchstart: _e,
                touchmove: we,
                touchend: ke,
                touchcancel: Ce
            },
            Je = "touchstart touchmove touchend touchcancel";
        c(H, _, {
            handler: function(t) {
                var e = Ge[t.type],
                    i = z.call(this, t, e);
                i && this.callback(this.manager, e, {
                    pointers: i[0],
                    changedPointers: i[1],
                    pointerType: Se,
                    srcEvent: t
                })
            }
        }), c(V, _, {
            handler: function(t, e, i) {
                var n = i.pointerType == Se,
                    s = i.pointerType == Ee;
                if (n) this.mouse.allow = !1;
                else if (s && !this.mouse.allow) return;
                e & (ke | Ce) && (this.mouse.allow = !0), this.callback(t, e, i)
            },
            destroy: function() {
                this.touch.destroy(), this.mouse.destroy()
            }
        });
        var Ke = E(ce.style, "touchAction"),
            qe = Ke !== n,
            Qe = "compute",
            Ze = "auto",
            ti = "manipulation",
            ei = "none",
            ii = "pan-x",
            ni = "pan-y";
        Y.prototype = {
            set: function(t) {
                t == Qe && (t = this.compute()), qe && (this.manager.element.style[Ke] = t), this.actions = t.toLowerCase().trim()
            },
            update: function() {
                this.set(this.manager.options.touchAction)
            },
            compute: function() {
                var t = [];
                return a(this.manager.recognizers, function(e) {
                    h(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
                }), X(t.join(" "))
            },
            preventDefaults: function(t) {
                if (!qe) {
                    var e = t.srcEvent,
                        i = t.offsetDirection;
                    if (this.manager.session.prevented) return void e.preventDefault();
                    var n = this.actions,
                        s = g(n, ei),
                        o = g(n, ni),
                        a = g(n, ii);
                    return s || o && i & Re || a && i & Oe ? this.preventSrc(e) : void 0
                }
            },
            preventSrc: function(t) {
                this.manager.session.prevented = !0, t.preventDefault()
            }
        };
        var si = 1,
            oi = 2,
            ai = 4,
            ri = 8,
            li = ri,
            ci = 16,
            di = 32;
        W.prototype = {
            defaults: {},
            set: function(t) {
                return r(this.options, t), this.manager && this.manager.touchAction.update(), this
            },
            recognizeWith: function(t) {
                if (o(t, "recognizeWith", this)) return this;
                var e = this.simultaneous;
                return t = K(t, this), e[t.id] || (e[t.id] = t, t.recognizeWith(this)), this
            },
            dropRecognizeWith: function(t) {
                return o(t, "dropRecognizeWith", this) ? this : (t = K(t, this), delete this.simultaneous[t.id], this)
            },
            requireFailure: function(t) {
                if (o(t, "requireFailure", this)) return this;
                var e = this.requireFail;
                return t = K(t, this), -1 === b(e, t) && (e.push(t), t.requireFailure(this)), this
            },
            dropRequireFailure: function(t) {
                if (o(t, "dropRequireFailure", this)) return this;
                t = K(t, this);
                var e = b(this.requireFail, t);
                return e > -1 && this.requireFail.splice(e, 1), this
            },
            hasRequireFailures: function() {
                return this.requireFail.length > 0
            },
            canRecognizeWith: function(t) {
                return !!this.simultaneous[t.id]
            },
            emit: function(t) {
                function e(e) {
                    i.manager.emit(i.options.event + (e ? G(n) : ""), t)
                }
                var i = this,
                    n = this.state;
                ri > n && e(!0), e(), n >= ri && e(!0)
            },
            tryEmit: function(t) {
                return this.canEmit() ? this.emit(t) : void(this.state = di)
            },
            canEmit: function() {
                for (var t = 0; t < this.requireFail.length;) {
                    if (!(this.requireFail[t].state & (di | si))) return !1;
                    t++
                }
                return !0
            },
            recognize: function(t) {
                var e = r({}, t);
                return h(this.options.enable, [this, e]) ? (this.state & (li | ci | di) && (this.state = si), this.state = this.process(e), void(this.state & (oi | ai | ri | ci) && this.tryEmit(e))) : (this.reset(), void(this.state = di))
            },
            process: function() {},
            getTouchAction: function() {},
            reset: function() {}
        }, c(q, W, {
            defaults: {
                pointers: 1
            },
            attrTest: function(t) {
                var e = this.options.pointers;
                return 0 === e || t.pointers.length === e
            },
            process: function(t) {
                var e = this.state,
                    i = t.eventType,
                    n = e & (oi | ai),
                    s = this.attrTest(t);
                return n && (i & Ce || !s) ? e | ci : n || s ? i & ke ? e | ri : e & oi ? e | ai : oi : di
            }
        }), c(Q, q, {
            defaults: {
                event: "pan",
                threshold: 10,
                pointers: 1,
                direction: Ne
            },
            getTouchAction: function() {
                var t = this.options.direction,
                    e = [];
                return t & Re && e.push(ni), t & Oe && e.push(ii), e
            },
            directionTest: function(t) {
                var e = this.options,
                    i = !0,
                    n = t.distance,
                    s = t.direction,
                    o = t.deltaX,
                    a = t.deltaY;
                return s & e.direction || (e.direction & Re ? (s = 0 === o ? Ae : 0 > o ? xe : De, i = o != this.pX, n = Math.abs(t.deltaX)) : (s = 0 === a ? Ae : 0 > a ? Ie : Me, i = a != this.pY, n = Math.abs(t.deltaY))), t.direction = s, i && n > e.threshold && s & e.direction
            },
            attrTest: function(t) {
                return q.prototype.attrTest.call(this, t) && (this.state & oi || !(this.state & oi) && this.directionTest(t))
            },
            emit: function(t) {
                this.pX = t.deltaX, this.pY = t.deltaY;
                var e = J(t.direction);
                e && this.manager.emit(this.options.event + e, t), this._super.emit.call(this, t)
            }
        }), c(Z, q, {
            defaults: {
                event: "pinch",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [ei]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || this.state & oi)
            },
            emit: function(t) {
                if (this._super.emit.call(this, t), 1 !== t.scale) {
                    var e = t.scale < 1 ? "in" : "out";
                    this.manager.emit(this.options.event + e, t)
                }
            }
        }), c(te, W, {
            defaults: {
                event: "press",
                pointers: 1,
                time: 500,
                threshold: 5
            },
            getTouchAction: function() {
                return [Ze]
            },
            process: function(t) {
                var e = this.options,
                    i = t.pointers.length === e.pointers,
                    n = t.distance < e.threshold,
                    o = t.deltaTime > e.time;
                if (this._input = t, !n || !i || t.eventType & (ke | Ce) && !o) this.reset();
                else if (t.eventType & _e) this.reset(), this._timer = s(function() {
                    this.state = li, this.tryEmit()
                }, e.time, this);
                else if (t.eventType & ke) return li;
                return di
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function(t) {
                this.state === li && (t && t.eventType & ke ? this.manager.emit(this.options.event + "up", t) : (this._input.timeStamp = pe(), this.manager.emit(this.options.event, this._input)))
            }
        }), c(ee, q, {
            defaults: {
                event: "rotate",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [ei]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || this.state & oi)
            }
        }), c(ie, q, {
            defaults: {
                event: "swipe",
                threshold: 10,
                velocity: .65,
                direction: Re | Oe,
                pointers: 1
            },
            getTouchAction: function() {
                return Q.prototype.getTouchAction.call(this)
            },
            attrTest: function(t) {
                var e, i = this.options.direction;
                return i & (Re | Oe) ? e = t.velocity : i & Re ? e = t.velocityX : i & Oe && (e = t.velocityY), this._super.attrTest.call(this, t) && i & t.direction && t.distance > this.options.threshold && ue(e) > this.options.velocity && t.eventType & ke
            },
            emit: function(t) {
                var e = J(t.direction);
                e && this.manager.emit(this.options.event + e, t), this.manager.emit(this.options.event, t)
            }
        }), c(ne, W, {
            defaults: {
                event: "tap",
                pointers: 1,
                taps: 1,
                interval: 300,
                time: 250,
                threshold: 2,
                posThreshold: 10
            },
            getTouchAction: function() {
                return [ti]
            },
            process: function(t) {
                var e = this.options,
                    i = t.pointers.length === e.pointers,
                    n = t.distance < e.threshold,
                    o = t.deltaTime < e.time;
                if (this.reset(), t.eventType & _e && 0 === this.count) return this.failTimeout();
                if (n && o && i) {
                    if (t.eventType != ke) return this.failTimeout();
                    var a = this.pTime ? t.timeStamp - this.pTime < e.interval : !0,
                        r = !this.pCenter || O(this.pCenter, t.center) < e.posThreshold;
                    this.pTime = t.timeStamp, this.pCenter = t.center, r && a ? this.count += 1 : this.count = 1, this._input = t;
                    var l = this.count % e.taps;
                    if (0 === l) return this.hasRequireFailures() ? (this._timer = s(function() {
                        this.state = li, this.tryEmit()
                    }, e.interval, this), oi) : li
                }
                return di
            },
            failTimeout: function() {
                return this._timer = s(function() {
                    this.state = di
                }, this.options.interval, this), di
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function() {
                this.state == li && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
            }
        }), se.VERSION = "2.0.4", se.defaults = {
            domEvents: !1,
            touchAction: Qe,
            enable: !0,
            inputTarget: null,
            inputClass: null,
            preset: [
                [ee, {
                    enable: !1
                }],
                [Z, {
                    enable: !1
                },
                    ["rotate"]
                ],
                [ie, {
                    direction: Re
                }],
                [Q, {
                    direction: Re
                },
                    ["swipe"]
                ],
                [ne],
                [ne, {
                    event: "doubletap",
                    taps: 2
                },
                    ["tap"]
                ],
                [te]
            ],
            cssProps: {
                userSelect: "none",
                touchSelect: "none",
                touchCallout: "none",
                contentZooming: "none",
                userDrag: "none",
                tapHighlightColor: "rgba(0,0,0,0)"
            }
        };
        var hi = 1,
            ui = 2;
        oe.prototype = {
            set: function(t) {
                return r(this.options, t), t.touchAction && this.touchAction.update(), t.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this.input.init()), this
            },
            stop: function(t) {
                this.session.stopped = t ? ui : hi
            },
            recognize: function(t) {
                var e = this.session;
                if (!e.stopped) {
                    this.touchAction.preventDefaults(t);
                    var i, n = this.recognizers,
                        s = e.curRecognizer;
                    (!s || s && s.state & li) && (s = e.curRecognizer = null);
                    for (var o = 0; o < n.length;) i = n[o], e.stopped === ui || s && i != s && !i.canRecognizeWith(s) ? i.reset() : i.recognize(t), !s && i.state & (oi | ai | ri) && (s = e.curRecognizer = i), o++
                }
            },
            get: function(t) {
                if (t instanceof W) return t;
                for (var e = this.recognizers, i = 0; i < e.length; i++)
                    if (e[i].options.event == t) return e[i];
                return null
            },
            add: function(t) {
                if (o(t, "add", this)) return this;
                var e = this.get(t.options.event);
                return e && this.remove(e), this.recognizers.push(t), t.manager = this, this.touchAction.update(), t
            },
            remove: function(t) {
                if (o(t, "remove", this)) return this;
                var e = this.recognizers;
                return t = this.get(t), e.splice(b(e, t), 1), this.touchAction.update(), this
            },
            on: function(t, e) {
                var i = this.handlers;
                return a(v(t), function(t) {
                    i[t] = i[t] || [], i[t].push(e)
                }), this
            },
            off: function(t, e) {
                var i = this.handlers;
                return a(v(t), function(t) {
                    e ? i[t].splice(b(i[t], e), 1) : delete i[t]
                }), this
            },
            emit: function(t, e) {
                this.options.domEvents && re(t, e);
                var i = this.handlers[t] && this.handlers[t].slice();
                if (i && i.length) {
                    e.type = t, e.preventDefault = function() {
                        e.srcEvent.preventDefault()
                    };
                    for (var n = 0; n < i.length;) i[n](e), n++
                }
            },
            destroy: function() {
                this.element && ae(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
            }
        }, r(se, {
            INPUT_START: _e,
            INPUT_MOVE: we,
            INPUT_END: ke,
            INPUT_CANCEL: Ce,
            STATE_POSSIBLE: si,
            STATE_BEGAN: oi,
            STATE_CHANGED: ai,
            STATE_ENDED: ri,
            STATE_RECOGNIZED: li,
            STATE_CANCELLED: ci,
            STATE_FAILED: di,
            DIRECTION_NONE: Ae,
            DIRECTION_LEFT: xe,
            DIRECTION_RIGHT: De,
            DIRECTION_UP: Ie,
            DIRECTION_DOWN: Me,
            DIRECTION_HORIZONTAL: Re,
            DIRECTION_VERTICAL: Oe,
            DIRECTION_ALL: Ne,
            Manager: oe,
            Input: _,
            TouchAction: Y,
            TouchInput: H,
            MouseInput: U,
            PointerEventInput: B,
            TouchMouseInput: V,
            SingleTouchInput: F,
            Recognizer: W,
            AttrRecognizer: q,
            Tap: ne,
            Pan: Q,
            Swipe: ie,
            Pinch: Z,
            Rotate: ee,
            Press: te,
            on: p,
            off: f,
            each: a,
            merge: l,
            extend: r,
            inherit: c,
            bindFn: d,
            prefixed: E
        }), typeof define == de && define.amd ? define(function() {
            return se
        }) : "undefined" != typeof module && module.exports ? module.exports = se : t[i] = se
    }(window, document, "Hammer");

var CryptoJS = CryptoJS || function(t, e) {
        var i = {},
            n = i.lib = {},
            s = function() {},
            o = n.Base = {
                extend: function(t) {
                    s.prototype = this;
                    var e = new s;
                    return t && e.mixIn(t), e.hasOwnProperty("init") || (e.init = function() {
                        e.$super.init.apply(this, arguments)
                    }), e.init.prototype = e, e.$super = this, e
                },
                create: function() {
                    var t = this.extend();
                    return t.init.apply(t, arguments), t
                },
                init: function() {},
                mixIn: function(t) {
                    for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
                    t.hasOwnProperty("toString") && (this.toString = t.toString)
                },
                clone: function() {
                    return this.init.prototype.extend(this)
                }
            },
            a = n.WordArray = o.extend({
                init: function(t, i) {
                    t = this.words = t || [], this.sigBytes = i != e ? i : 4 * t.length
                },
                toString: function(t) {
                    return (t || l).stringify(this)
                },
                concat: function(t) {
                    var e = this.words,
                        i = t.words,
                        n = this.sigBytes;
                    if (t = t.sigBytes, this.clamp(), n % 4)
                        for (var s = 0; t > s; s++) e[n + s >>> 2] |= (i[s >>> 2] >>> 24 - 8 * (s % 4) & 255) << 24 - 8 * ((n + s) % 4);
                    else if (65535 < i.length)
                        for (s = 0; t > s; s += 4) e[n + s >>> 2] = i[s >>> 2];
                    else e.push.apply(e, i);
                    return this.sigBytes += t, this
                },
                clamp: function() {
                    var e = this.words,
                        i = this.sigBytes;
                    e[i >>> 2] &= 4294967295 << 32 - 8 * (i % 4), e.length = t.ceil(i / 4)
                },
                clone: function() {
                    var t = o.clone.call(this);
                    return t.words = this.words.slice(0), t
                },
                random: function(e) {
                    for (var i = [], n = 0; e > n; n += 4) i.push(4294967296 * t.random() | 0);
                    return new a.init(i, e)
                }
            }),
            r = i.enc = {},
            l = r.Hex = {
                stringify: function(t) {
                    var e = t.words;
                    t = t.sigBytes;
                    for (var i = [], n = 0; t > n; n++) {
                        var s = e[n >>> 2] >>> 24 - 8 * (n % 4) & 255;
                        i.push((s >>> 4).toString(16)), i.push((15 & s).toString(16))
                    }
                    return i.join("")
                },
                parse: function(t) {
                    for (var e = t.length, i = [], n = 0; e > n; n += 2) i[n >>> 3] |= parseInt(t.substr(n, 2), 16) << 24 - 4 * (n % 8);
                    return new a.init(i, e / 2)
                }
            },
            c = r.Latin1 = {
                stringify: function(t) {
                    var e = t.words;
                    t = t.sigBytes;
                    for (var i = [], n = 0; t > n; n++) i.push(String.fromCharCode(e[n >>> 2] >>> 24 - 8 * (n % 4) & 255));
                    return i.join("")
                },
                parse: function(t) {
                    for (var e = t.length, i = [], n = 0; e > n; n++) i[n >>> 2] |= (255 & t.charCodeAt(n)) << 24 - 8 * (n % 4);
                    return new a.init(i, e)
                }
            },
            d = r.Utf8 = {
                stringify: function(t) {
                    try {
                        return decodeURIComponent(escape(c.stringify(t)))
                    } catch (e) {
                        throw Error("Malformed UTF-8 data")
                    }
                },
                parse: function(t) {
                    return c.parse(unescape(encodeURIComponent(t)))
                }
            },
            h = n.BufferedBlockAlgorithm = o.extend({
                reset: function() {
                    this._data = new a.init, this._nDataBytes = 0
                },
                _append: function(t) {
                    "string" == typeof t && (t = d.parse(t)), this._data.concat(t), this._nDataBytes += t.sigBytes
                },
                _process: function(e) {
                    var i = this._data,
                        n = i.words,
                        s = i.sigBytes,
                        o = this.blockSize,
                        r = s / (4 * o),
                        r = e ? t.ceil(r) : t.max((0 | r) - this._minBufferSize, 0);
                    if (e = r * o, s = t.min(4 * e, s), e) {
                        for (var l = 0; e > l; l += o) this._doProcessBlock(n, l);
                        l = n.splice(0, e), i.sigBytes -= s
                    }
                    return new a.init(l, s)
                },
                clone: function() {
                    var t = o.clone.call(this);
                    return t._data = this._data.clone(), t
                },
                _minBufferSize: 0
            });
        n.Hasher = h.extend({
            cfg: o.extend(),
            init: function(t) {
                this.cfg = this.cfg.extend(t), this.reset()
            },
            reset: function() {
                h.reset.call(this), this._doReset()
            },
            update: function(t) {
                return this._append(t), this._process(), this
            },
            finalize: function(t) {
                return t && this._append(t), this._doFinalize()
            },
            blockSize: 16,
            _createHelper: function(t) {
                return function(e, i) {
                    return new t.init(i).finalize(e)
                }
            },
            _createHmacHelper: function(t) {
                return function(e, i) {
                    return new u.HMAC.init(t, i).finalize(e)
                }
            }
        });
        var u = i.algo = {};
        return i
    }(Math);
! function(t) {
    function e(t, e, i, n, s, o, a) {
        return t = t + (e & i | ~e & n) + s + a, (t << o | t >>> 32 - o) + e
    }

    function i(t, e, i, n, s, o, a) {
        return t = t + (e & n | i & ~n) + s + a, (t << o | t >>> 32 - o) + e
    }

    function n(t, e, i, n, s, o, a) {
        return t = t + (e ^ i ^ n) + s + a, (t << o | t >>> 32 - o) + e
    }

    function s(t, e, i, n, s, o, a) {
        return t = t + (i ^ (e | ~n)) + s + a, (t << o | t >>> 32 - o) + e
    }
    for (var o = CryptoJS, a = o.lib, r = a.WordArray, l = a.Hasher, a = o.algo, c = [], d = 0; 64 > d; d++) c[d] = 4294967296 * t.abs(t.sin(d + 1)) | 0;
    a = a.MD5 = l.extend({
        _doReset: function() {
            this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878])
        },
        _doProcessBlock: function(t, o) {
            for (var a = 0; 16 > a; a++) {
                var r = o + a,
                    l = t[r];
                t[r] = 16711935 & (l << 8 | l >>> 24) | 4278255360 & (l << 24 | l >>> 8)
            }
            var a = this._hash.words,
                r = t[o + 0],
                l = t[o + 1],
                d = t[o + 2],
                h = t[o + 3],
                u = t[o + 4],
                p = t[o + 5],
                f = t[o + 6],
                m = t[o + 7],
                g = t[o + 8],
                v = t[o + 9],
                b = t[o + 10],
                S = t[o + 11],
                y = t[o + 12],
                E = t[o + 13],
                T = t[o + 14],
                L = t[o + 15],
                _ = a[0],
                w = a[1],
                k = a[2],
                C = a[3],
                _ = e(_, w, k, C, r, 7, c[0]),
                C = e(C, _, w, k, l, 12, c[1]),
                k = e(k, C, _, w, d, 17, c[2]),
                w = e(w, k, C, _, h, 22, c[3]),
                _ = e(_, w, k, C, u, 7, c[4]),
                C = e(C, _, w, k, p, 12, c[5]),
                k = e(k, C, _, w, f, 17, c[6]),
                w = e(w, k, C, _, m, 22, c[7]),
                _ = e(_, w, k, C, g, 7, c[8]),
                C = e(C, _, w, k, v, 12, c[9]),
                k = e(k, C, _, w, b, 17, c[10]),
                w = e(w, k, C, _, S, 22, c[11]),
                _ = e(_, w, k, C, y, 7, c[12]),
                C = e(C, _, w, k, E, 12, c[13]),
                k = e(k, C, _, w, T, 17, c[14]),
                w = e(w, k, C, _, L, 22, c[15]),
                _ = i(_, w, k, C, l, 5, c[16]),
                C = i(C, _, w, k, f, 9, c[17]),
                k = i(k, C, _, w, S, 14, c[18]),
                w = i(w, k, C, _, r, 20, c[19]),
                _ = i(_, w, k, C, p, 5, c[20]),
                C = i(C, _, w, k, b, 9, c[21]),
                k = i(k, C, _, w, L, 14, c[22]),
                w = i(w, k, C, _, u, 20, c[23]),
                _ = i(_, w, k, C, v, 5, c[24]),
                C = i(C, _, w, k, T, 9, c[25]),
                k = i(k, C, _, w, h, 14, c[26]),
                w = i(w, k, C, _, g, 20, c[27]),
                _ = i(_, w, k, C, E, 5, c[28]),
                C = i(C, _, w, k, d, 9, c[29]),
                k = i(k, C, _, w, m, 14, c[30]),
                w = i(w, k, C, _, y, 20, c[31]),
                _ = n(_, w, k, C, p, 4, c[32]),
                C = n(C, _, w, k, g, 11, c[33]),
                k = n(k, C, _, w, S, 16, c[34]),
                w = n(w, k, C, _, T, 23, c[35]),
                _ = n(_, w, k, C, l, 4, c[36]),
                C = n(C, _, w, k, u, 11, c[37]),
                k = n(k, C, _, w, m, 16, c[38]),
                w = n(w, k, C, _, b, 23, c[39]),
                _ = n(_, w, k, C, E, 4, c[40]),
                C = n(C, _, w, k, r, 11, c[41]),
                k = n(k, C, _, w, h, 16, c[42]),
                w = n(w, k, C, _, f, 23, c[43]),
                _ = n(_, w, k, C, v, 4, c[44]),
                C = n(C, _, w, k, y, 11, c[45]),
                k = n(k, C, _, w, L, 16, c[46]),
                w = n(w, k, C, _, d, 23, c[47]),
                _ = s(_, w, k, C, r, 6, c[48]),
                C = s(C, _, w, k, m, 10, c[49]),
                k = s(k, C, _, w, T, 15, c[50]),
                w = s(w, k, C, _, p, 21, c[51]),
                _ = s(_, w, k, C, y, 6, c[52]),
                C = s(C, _, w, k, h, 10, c[53]),
                k = s(k, C, _, w, b, 15, c[54]),
                w = s(w, k, C, _, l, 21, c[55]),
                _ = s(_, w, k, C, g, 6, c[56]),
                C = s(C, _, w, k, L, 10, c[57]),
                k = s(k, C, _, w, f, 15, c[58]),
                w = s(w, k, C, _, E, 21, c[59]),
                _ = s(_, w, k, C, u, 6, c[60]),
                C = s(C, _, w, k, S, 10, c[61]),
                k = s(k, C, _, w, d, 15, c[62]),
                w = s(w, k, C, _, v, 21, c[63]);
            a[0] = a[0] + _ | 0, a[1] = a[1] + w | 0, a[2] = a[2] + k | 0, a[3] = a[3] + C | 0
        },
        _doFinalize: function() {
            var e = this._data,
                i = e.words,
                n = 8 * this._nDataBytes,
                s = 8 * e.sigBytes;
            i[s >>> 5] |= 128 << 24 - s % 32;
            var o = t.floor(n / 4294967296);
            for (i[(s + 64 >>> 9 << 4) + 15] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), i[(s + 64 >>> 9 << 4) + 14] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8), e.sigBytes = 4 * (i.length + 1), this._process(), e = this._hash, i = e.words, n = 0; 4 > n; n++) s = i[n], i[n] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);
            return e
        },
        clone: function() {
            var t = l.clone.call(this);
            return t._hash = this._hash.clone(), t
        }
    }), o.MD5 = l._createHelper(a), o.HmacMD5 = l._createHmacHelper(a)
}(Math),
    function() {
        function t(t) {
            var i = {
                    r: 0,
                    g: 0,
                    b: 0
                },
                s = 1,
                a = !1,
                r = !1;
            return "string" == typeof t && (t = M(t)), "object" == typeof t && (t.hasOwnProperty("r") && t.hasOwnProperty("g") && t.hasOwnProperty("b") ? (i = e(t.r, t.g, t.b), a = !0, r = "%" === String(t.r).substr(-1) ? "prgb" : "rgb") : t.hasOwnProperty("h") && t.hasOwnProperty("s") && t.hasOwnProperty("v") ? (t.s = x(t.s), t.v = x(t.v), i = o(t.h, t.s, t.v), a = !0, r = "hsv") : t.hasOwnProperty("h") && t.hasOwnProperty("s") && t.hasOwnProperty("l") && (t.s = x(t.s), t.l = x(t.l), i = n(t.h, t.s, t.l), a = !0, r = "hsl"), t.hasOwnProperty("a") && (s = t.a)), s = T(s), {
                ok: a,
                format: t.format || r,
                r: U(255, B(i.r, 0)),
                g: U(255, B(i.g, 0)),
                b: U(255, B(i.b, 0)),
                a: s
            }
        }

        function e(t, e, i) {
            return {
                r: 255 * L(t, 255),
                g: 255 * L(e, 255),
                b: 255 * L(i, 255)
            }
        }

        function i(t, e, i) {
            t = L(t, 255), e = L(e, 255), i = L(i, 255);
            var n, s, o = B(t, e, i),
                a = U(t, e, i),
                r = (o + a) / 2;
            if (o == a) n = s = 0;
            else {
                var l = o - a;
                switch (s = r > .5 ? l / (2 - o - a) : l / (o + a), o) {
                    case t:
                        n = (e - i) / l + (i > e ? 6 : 0);
                        break;
                    case e:
                        n = (i - t) / l + 2;
                        break;
                    case i:
                        n = (t - e) / l + 4
                }
                n /= 6
            }
            return {
                h: n,
                s: s,
                l: r
            }
        }

        function n(t, e, i) {
            function n(t, e, i) {
                return 0 > i && (i += 1), i > 1 && (i -= 1), 1 / 6 > i ? t + 6 * (e - t) * i : .5 > i ? e : 2 / 3 > i ? t + (e - t) * (2 / 3 - i) * 6 : t
            }
            var s, o, a;
            if (t = L(t, 360), e = L(e, 100), i = L(i, 100), 0 === e) s = o = a = i;
            else {
                var r = .5 > i ? i * (1 + e) : i + e - i * e,
                    l = 2 * i - r;
                s = n(l, r, t + 1 / 3), o = n(l, r, t), a = n(l, r, t - 1 / 3)
            }
            return {
                r: 255 * s,
                g: 255 * o,
                b: 255 * a
            }
        }

        function s(t, e, i) {
            t = L(t, 255), e = L(e, 255), i = L(i, 255);
            var n, s, o = B(t, e, i),
                a = U(t, e, i),
                r = o,
                l = o - a;
            if (s = 0 === o ? 0 : l / o, o == a) n = 0;
            else {
                switch (o) {
                    case t:
                        n = (e - i) / l + (i > e ? 6 : 0);
                        break;
                    case e:
                        n = (i - t) / l + 2;
                        break;
                    case i:
                        n = (t - e) / l + 4
                }
                n /= 6
            }
            return {
                h: n,
                s: s,
                v: r
            }
        }

        function o(t, e, i) {
            t = 6 * L(t, 360), e = L(e, 100), i = L(i, 100);
            var n = P.floor(t),
                s = t - n,
                o = i * (1 - e),
                a = i * (1 - s * e),
                r = i * (1 - (1 - s) * e),
                l = n % 6,
                c = [i, a, o, o, r, i][l],
                d = [r, i, i, a, o, o][l],
                h = [o, o, r, i, i, a][l];
            return {
                r: 255 * c,
                g: 255 * d,
                b: 255 * h
            }
        }

        function a(t, e, i, n) {
            var s = [A($(t).toString(16)), A($(e).toString(16)), A($(i).toString(16))];
            return n && s[0].charAt(0) == s[0].charAt(1) && s[1].charAt(0) == s[1].charAt(1) && s[2].charAt(0) == s[2].charAt(1) ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0) : s.join("")
        }

        function r(t, e, i, n) {
            var s = [A(D(n)), A($(t).toString(16)), A($(e).toString(16)), A($(i).toString(16))];
            return s.join("")
        }

        function l(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = j(t).toHsl();
            return i.s -= e / 100, i.s = _(i.s), j(i)
        }

        function c(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = j(t).toHsl();
            return i.s += e / 100, i.s = _(i.s), j(i)
        }

        function d(t) {
            return j(t).desaturate(100)
        }

        function h(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = j(t).toHsl();
            return i.l += e / 100, i.l = _(i.l), j(i)
        }

        function u(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = j(t).toRgb();
            return i.r = B(0, U(255, i.r - $(255 * -(e / 100)))), i.g = B(0, U(255, i.g - $(255 * -(e / 100)))), i.b = B(0, U(255, i.b - $(255 * -(e / 100)))), j(i)
        }

        function p(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = j(t).toHsl();
            return i.l -= e / 100, i.l = _(i.l), j(i)
        }

        function f(t, e) {
            var i = j(t).toHsl(),
                n = ($(i.h) + e) % 360;
            return i.h = 0 > n ? 360 + n : n, j(i)
        }

        function m(t) {
            var e = j(t).toHsl();
            return e.h = (e.h + 180) % 360, j(e)
        }

        function g(t) {
            var e = j(t).toHsl(),
                i = e.h;
            return [j(t), j({
                h: (i + 120) % 360,
                s: e.s,
                l: e.l
            }), j({
                h: (i + 240) % 360,
                s: e.s,
                l: e.l
            })]
        }

        function v(t) {
            var e = j(t).toHsl(),
                i = e.h;
            return [j(t), j({
                h: (i + 90) % 360,
                s: e.s,
                l: e.l
            }), j({
                h: (i + 180) % 360,
                s: e.s,
                l: e.l
            }), j({
                h: (i + 270) % 360,
                s: e.s,
                l: e.l
            })]
        }

        function b(t) {
            var e = j(t).toHsl(),
                i = e.h;
            return [j(t), j({
                h: (i + 72) % 360,
                s: e.s,
                l: e.l
            }), j({
                h: (i + 216) % 360,
                s: e.s,
                l: e.l
            })]
        }

        function S(t, e, i) {
            e = e || 6, i = i || 30;
            var n = j(t).toHsl(),
                s = 360 / i,
                o = [j(t)];
            for (n.h = (n.h - (s * e >> 1) + 720) % 360; --e;) n.h = (n.h + s) % 360, o.push(j(n));
            return o
        }

        function y(t, e) {
            e = e || 6;
            for (var i = j(t).toHsv(), n = i.h, s = i.s, o = i.v, a = [], r = 1 / e; e--;) a.push(j({
                h: n,
                s: s,
                v: o
            })), o = (o + r) % 1;
            return a
        }

        function E(t) {
            var e = {};
            for (var i in t) t.hasOwnProperty(i) && (e[t[i]] = i);
            return e
        }

        function T(t) {
            return t = parseFloat(t), (isNaN(t) || 0 > t || t > 1) && (t = 1), t
        }

        function L(t, e) {
            k(t) && (t = "100%");
            var i = C(t);
            return t = U(e, B(0, parseFloat(t))), i && (t = parseInt(t * e, 10) / 100), P.abs(t - e) < 1e-6 ? 1 : t % e / parseFloat(e)
        }

        function _(t) {
            return U(1, B(0, t))
        }

        function w(t) {
            return parseInt(t, 16)
        }

        function k(t) {
            return "string" == typeof t && -1 != t.indexOf(".") && 1 === parseFloat(t)
        }

        function C(t) {
            return "string" == typeof t && -1 != t.indexOf("%")
        }

        function A(t) {
            return 1 == t.length ? "0" + t : "" + t
        }

        function x(t) {
            return 1 >= t && (t = 100 * t + "%"), t
        }

        function D(t) {
            return Math.round(255 * parseFloat(t)).toString(16)
        }

        function I(t) {
            return w(t) / 255
        }

        function M(t) {
            t = t.replace(R, "").replace(O, "").toLowerCase();
            var e = !1;
            if (H[t]) t = H[t], e = !0;
            else if ("transparent" == t) return {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
                format: "name"
            };
            var i;
            return (i = V.rgb.exec(t)) ? {
                r: i[1],
                g: i[2],
                b: i[3]
            } : (i = V.rgba.exec(t)) ? {
                r: i[1],
                g: i[2],
                b: i[3],
                a: i[4]
            } : (i = V.hsl.exec(t)) ? {
                h: i[1],
                s: i[2],
                l: i[3]
            } : (i = V.hsla.exec(t)) ? {
                h: i[1],
                s: i[2],
                l: i[3],
                a: i[4]
            } : (i = V.hsv.exec(t)) ? {
                h: i[1],
                s: i[2],
                v: i[3]
            } : (i = V.hex8.exec(t)) ? {
                a: I(i[1]),
                r: w(i[2]),
                g: w(i[3]),
                b: w(i[4]),
                format: e ? "name" : "hex8"
            } : (i = V.hex6.exec(t)) ? {
                r: w(i[1]),
                g: w(i[2]),
                b: w(i[3]),
                format: e ? "name" : "hex"
            } : (i = V.hex3.exec(t)) ? {
                r: w(i[1] + "" + i[1]),
                g: w(i[2] + "" + i[2]),
                b: w(i[3] + "" + i[3]),
                format: e ? "name" : "hex"
            } : !1
        }
        var R = /^[\s,#]+/,
            O = /\s+$/,
            N = 0,
            P = Math,
            $ = P.round,
            U = P.min,
            B = P.max,
            F = P.random,
            j = function Y(e, i) {
                if (e = e ? e : "", i = i || {}, e instanceof Y) return e;
                if (!(this instanceof Y)) return new Y(e, i);
                var n = t(e);
                this._r = n.r, this._g = n.g, this._b = n.b, this._a = n.a, this._roundA = $(100 * this._a) / 100, this._format = i.format || n.format, this._gradientType = i.gradientType, this._r < 1 && (this._r = $(this._r)), this._g < 1 && (this._g = $(this._g)), this._b < 1 && (this._b = $(this._b)), this._ok = n.ok, this._tc_id = N++
            };
        j.prototype = {
            isDark: function() {
                return this.getBrightness() < 128
            },
            isLight: function() {
                return !this.isDark()
            },
            isValid: function() {
                return this._ok
            },
            getFormat: function() {
                return this._format
            },
            getAlpha: function() {
                return this._a
            },
            getBrightness: function() {
                var t = this.toRgb();
                return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3
            },
            setAlpha: function(t) {
                return this._a = T(t), this._roundA = $(100 * this._a) / 100, this
            },
            toHsv: function() {
                var t = s(this._r, this._g, this._b);
                return {
                    h: 360 * t.h,
                    s: t.s,
                    v: t.v,
                    a: this._a
                }
            },
            toHsvString: function() {
                var t = s(this._r, this._g, this._b),
                    e = $(360 * t.h),
                    i = $(100 * t.s),
                    n = $(100 * t.v);
                return 1 == this._a ? "hsv(" + e + ", " + i + "%, " + n + "%)" : "hsva(" + e + ", " + i + "%, " + n + "%, " + this._roundA + ")"
            },
            toHsl: function() {
                var t = i(this._r, this._g, this._b);
                return {
                    h: 360 * t.h,
                    s: t.s,
                    l: t.l,
                    a: this._a
                }
            },
            toHslString: function() {
                var t = i(this._r, this._g, this._b),
                    e = $(360 * t.h),
                    n = $(100 * t.s),
                    s = $(100 * t.l);
                return 1 == this._a ? "hsl(" + e + ", " + n + "%, " + s + "%)" : "hsla(" + e + ", " + n + "%, " + s + "%, " + this._roundA + ")"
            },
            toHex: function(t) {
                return a(this._r, this._g, this._b, t)
            },
            toHexString: function(t) {
                return "#" + this.toHex(t)
            },
            toHex8: function() {
                return r(this._r, this._g, this._b, this._a)
            },
            toHex8String: function() {
                return "#" + this.toHex8()
            },
            toRgb: function() {
                return {
                    r: $(this._r),
                    g: $(this._g),
                    b: $(this._b),
                    a: this._a
                }
            },
            toRgbString: function() {
                return 1 == this._a ? "rgb(" + $(this._r) + ", " + $(this._g) + ", " + $(this._b) + ")" : "rgba(" + $(this._r) + ", " + $(this._g) + ", " + $(this._b) + ", " + this._roundA + ")"
            },
            toPercentageRgb: function() {
                return {
                    r: $(100 * L(this._r, 255)) + "%",
                    g: $(100 * L(this._g, 255)) + "%",
                    b: $(100 * L(this._b, 255)) + "%",
                    a: this._a
                }
            },
            toPercentageRgbString: function() {
                return 1 == this._a ? "rgb(" + $(100 * L(this._r, 255)) + "%, " + $(100 * L(this._g, 255)) + "%, " + $(100 * L(this._b, 255)) + "%)" : "rgba(" + $(100 * L(this._r, 255)) + "%, " + $(100 * L(this._g, 255)) + "%, " + $(100 * L(this._b, 255)) + "%, " + this._roundA + ")"
            },
            toName: function() {
                return 0 === this._a ? "transparent" : this._a < 1 ? !1 : z[a(this._r, this._g, this._b, !0)] || !1
            },
            toFilter: function(t) {
                var e = "#" + r(this._r, this._g, this._b, this._a),
                    i = e,
                    n = this._gradientType ? "GradientType = 1, " : "";
                if (t) {
                    var s = j(t);
                    i = s.toHex8String()
                }
                return "progid:DXImageTransform.Microsoft.gradient(" + n + "startColorstr=" + e + ",endColorstr=" + i + ")"
            },
            toString: function(t) {
                var e = !!t;
                t = t || this._format;
                var i = !1,
                    n = this._a < 1 && this._a >= 0,
                    s = !e && n && ("hex" === t || "hex6" === t || "hex3" === t || "name" === t);
                return s ? "name" === t && 0 === this._a ? this.toName() : this.toRgbString() : ("rgb" === t && (i = this.toRgbString()), "prgb" === t && (i = this.toPercentageRgbString()), ("hex" === t || "hex6" === t) && (i = this.toHexString()), "hex3" === t && (i = this.toHexString(!0)), "hex8" === t && (i = this.toHex8String()), "name" === t && (i = this.toName()), "hsl" === t && (i = this.toHslString()), "hsv" === t && (i = this.toHsvString()), i || this.toHexString())
            },
            _applyModification: function(t, e) {
                var i = t.apply(null, [this].concat([].slice.call(e)));
                return this._r = i._r, this._g = i._g, this._b = i._b, this.setAlpha(i._a), this
            },
            lighten: function() {
                return this._applyModification(h, arguments)
            },
            brighten: function() {
                return this._applyModification(u, arguments)
            },
            darken: function() {
                return this._applyModification(p, arguments)
            },
            desaturate: function() {
                return this._applyModification(l, arguments)
            },
            saturate: function() {
                return this._applyModification(c, arguments)
            },
            greyscale: function() {
                return this._applyModification(d, arguments)
            },
            spin: function() {
                return this._applyModification(f, arguments)
            },
            _applyCombination: function(t, e) {
                return t.apply(null, [this].concat([].slice.call(e)))
            },
            analogous: function() {
                return this._applyCombination(S, arguments)
            },
            complement: function() {
                return this._applyCombination(m, arguments)
            },
            monochromatic: function() {
                return this._applyCombination(y, arguments)
            },
            splitcomplement: function() {
                return this._applyCombination(b, arguments)
            },
            triad: function() {
                return this._applyCombination(g, arguments)
            },
            tetrad: function() {
                return this._applyCombination(v, arguments)
            }
        }, j.fromRatio = function(t, e) {
            if ("object" == typeof t) {
                var i = {};
                for (var n in t) t.hasOwnProperty(n) && (i[n] = "a" === n ? t[n] : x(t[n]));
                t = i
            }
            return j(t, e)
        }, j.equals = function(t, e) {
            return t && e ? j(t).toRgbString() == j(e).toRgbString() : !1
        }, j.random = function() {
            return j.fromRatio({
                r: F(),
                g: F(),
                b: F()
            })
        }, j.mix = function(t, e, i) {
            i = 0 === i ? 0 : i || 50;
            var n, s = j(t).toRgb(),
                o = j(e).toRgb(),
                a = i / 100,
                r = 2 * a - 1,
                l = o.a - s.a;
            n = r * l == -1 ? r : (r + l) / (1 + r * l), n = (n + 1) / 2;
            var c = 1 - n,
                d = {
                    r: o.r * n + s.r * c,
                    g: o.g * n + s.g * c,
                    b: o.b * n + s.b * c,
                    a: o.a * a + s.a * (1 - a)
                };
            return j(d)
        }, j.readability = function(t, e) {
            var i = j(t),
                n = j(e),
                s = i.toRgb(),
                o = n.toRgb(),
                a = i.getBrightness(),
                r = n.getBrightness(),
                l = Math.max(s.r, o.r) - Math.min(s.r, o.r) + Math.max(s.g, o.g) - Math.min(s.g, o.g) + Math.max(s.b, o.b) - Math.min(s.b, o.b);
            return {
                brightness: Math.abs(a - r),
                color: l
            }
        }, j.isReadable = function(t, e) {
            var i = j.readability(t, e);
            return i.brightness > 125 && i.color > 500
        }, j.mostReadable = function(t, e) {
            for (var i = null, n = 0, s = !1, o = 0; o < e.length; o++) {
                var a = j.readability(t, e[o]),
                    r = a.brightness > 125 && a.color > 500,
                    l = 3 * (a.brightness / 125) + a.color / 500;
                (r && !s || r && s && l > n || !r && !s && l > n) && (s = r, n = l, i = j(e[o]))
            }
            return i
        };
        var H = j.names = {
                aliceblue: "f0f8ff",
                antiquewhite: "faebd7",
                aqua: "0ff",
                aquamarine: "7fffd4",
                azure: "f0ffff",
                beige: "f5f5dc",
                bisque: "ffe4c4",
                black: "000",
                blanchedalmond: "ffebcd",
                blue: "00f",
                blueviolet: "8a2be2",
                brown: "a52a2a",
                burlywood: "deb887",
                burntsienna: "ea7e5d",
                cadetblue: "5f9ea0",
                chartreuse: "7fff00",
                chocolate: "d2691e",
                coral: "ff7f50",
                cornflowerblue: "6495ed",
                cornsilk: "fff8dc",
                crimson: "dc143c",
                cyan: "0ff",
                darkblue: "00008b",
                darkcyan: "008b8b",
                darkgoldenrod: "b8860b",
                darkgray: "a9a9a9",
                darkgreen: "006400",
                darkgrey: "a9a9a9",
                darkkhaki: "bdb76b",
                darkmagenta: "8b008b",
                darkolivegreen: "556b2f",
                darkorange: "ff8c00",
                darkorchid: "9932cc",
                darkred: "8b0000",
                darksalmon: "e9967a",
                darkseagreen: "8fbc8f",
                darkslateblue: "483d8b",
                darkslategray: "2f4f4f",
                darkslategrey: "2f4f4f",
                darkturquoise: "00ced1",
                darkviolet: "9400d3",
                deeppink: "ff1493",
                deepskyblue: "00bfff",
                dimgray: "696969",
                dimgrey: "696969",
                dodgerblue: "1e90ff",
                firebrick: "b22222",
                floralwhite: "fffaf0",
                forestgreen: "228b22",
                fuchsia: "f0f",
                gainsboro: "dcdcdc",
                ghostwhite: "f8f8ff",
                gold: "ffd700",
                goldenrod: "daa520",
                gray: "808080",
                green: "008000",
                greenyellow: "adff2f",
                grey: "808080",
                honeydew: "f0fff0",
                hotpink: "ff69b4",
                indianred: "cd5c5c",
                indigo: "4b0082",
                ivory: "fffff0",
                khaki: "f0e68c",
                lavender: "e6e6fa",
                lavenderblush: "fff0f5",
                lawngreen: "7cfc00",
                lemonchiffon: "fffacd",
                lightblue: "add8e6",
                lightcoral: "f08080",
                lightcyan: "e0ffff",
                lightgoldenrodyellow: "fafad2",
                lightgray: "d3d3d3",
                lightgreen: "90ee90",
                lightgrey: "d3d3d3",
                lightpink: "ffb6c1",
                lightsalmon: "ffa07a",
                lightseagreen: "20b2aa",
                lightskyblue: "87cefa",
                lightslategray: "789",
                lightslategrey: "789",
                lightsteelblue: "b0c4de",
                lightyellow: "ffffe0",
                lime: "0f0",
                limegreen: "32cd32",
                linen: "faf0e6",
                magenta: "f0f",
                maroon: "800000",
                mediumaquamarine: "66cdaa",
                mediumblue: "0000cd",
                mediumorchid: "ba55d3",
                mediumpurple: "9370db",
                mediumseagreen: "3cb371",
                mediumslateblue: "7b68ee",
                mediumspringgreen: "00fa9a",
                mediumturquoise: "48d1cc",
                mediumvioletred: "c71585",
                midnightblue: "191970",
                mintcream: "f5fffa",
                mistyrose: "ffe4e1",
                moccasin: "ffe4b5",
                navajowhite: "ffdead",
                navy: "000080",
                oldlace: "fdf5e6",
                olive: "808000",
                olivedrab: "6b8e23",
                orange: "ffa500",
                orangered: "ff4500",
                orchid: "da70d6",
                palegoldenrod: "eee8aa",
                palegreen: "98fb98",
                paleturquoise: "afeeee",
                palevioletred: "db7093",
                papayawhip: "ffefd5",
                peachpuff: "ffdab9",
                peru: "cd853f",
                pink: "ffc0cb",
                plum: "dda0dd",
                powderblue: "b0e0e6",
                purple: "800080",
                red: "f00",
                rosybrown: "bc8f8f",
                royalblue: "4169e1",
                saddlebrown: "8b4513",
                salmon: "fa8072",
                sandybrown: "f4a460",
                seagreen: "2e8b57",
                seashell: "fff5ee",
                sienna: "a0522d",
                silver: "c0c0c0",
                skyblue: "87ceeb",
                slateblue: "6a5acd",
                slategray: "708090",
                slategrey: "708090",
                snow: "fffafa",
                springgreen: "00ff7f",
                steelblue: "4682b4",
                tan: "d2b48c",
                teal: "008080",
                thistle: "d8bfd8",
                tomato: "ff6347",
                turquoise: "40e0d0",
                violet: "ee82ee",
                wheat: "f5deb3",
                white: "fff",
                whitesmoke: "f5f5f5",
                yellow: "ff0",
                yellowgreen: "9acd32"
            },
            z = j.hexNames = E(H),
            V = function() {
                var t = "[-\\+]?\\d+%?",
                    e = "[-\\+]?\\d*\\.\\d+%?",
                    i = "(?:" + e + ")|(?:" + t + ")",
                    n = "[\\s|\\(]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")\\s*\\)?",
                    s = "[\\s|\\(]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")\\s*\\)?";
                return {
                    rgb: new RegExp("rgb" + n),
                    rgba: new RegExp("rgba" + s),
                    hsl: new RegExp("hsl" + n),
                    hsla: new RegExp("hsla" + s),
                    hsv: new RegExp("hsv" + n),
                    hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                    hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                    hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
                }
            }();
        "undefined" != typeof module && module.exports ? module.exports = j : "function" == typeof define && define.amd ? define(function() {
            return j
        }) : window.tinycolor = j
    }(),
/************************ start vkbeautify.js ********************************/
    function() {
        function t(t) {
            var e = "    ";
            if (isNaN(parseInt(t))) e = t;
            else switch (t) {
                case 1:
                    e = " ";
                    break;
                case 2:
                    e = "  ";
                    break;
                case 3:
                    e = "   ";
                    break;
                case 4:
                    e = "    ";
                    break;
                case 5:
                    e = "     ";
                    break;
                case 6:
                    e = "      ";
                    break;
                case 7:
                    e = "       ";
                    break;
                case 8:
                    e = "        ";
                    break;
                case 9:
                    e = "         ";
                    break;
                case 10:
                    e = "          ";
                    break;
                case 11:
                    e = "           ";
                    break;
                case 12:
                    e = "            "
            }
            var i = ["\n"];
            for (ix = 0; 100 > ix; ix++) i.push(i[ix] + e);
            return i
        }

        function e() {
            this.step = "    ", this.shift = t(this.step)
        }

        function i(t, e) {
            return e - (t.replace(/\(/g, "").length - t.replace(/\)/g, "").length)
        }

        function n(t, e) {
            return t.replace(/\s{1,}/g, " ").replace(/ AND /gi, "~::~" + e + e + "AND ").replace(/ BETWEEN /gi, "~::~" + e + "BETWEEN ").replace(/ CASE /gi, "~::~" + e + "CASE ").replace(/ ELSE /gi, "~::~" + e + "ELSE ").replace(/ END /gi, "~::~" + e + "END ").replace(/ FROM /gi, "~::~FROM ").replace(/ GROUP\s{1,}BY/gi, "~::~GROUP BY ").replace(/ HAVING /gi, "~::~HAVING ").replace(/ IN /gi, " IN ").replace(/ JOIN /gi, "~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /gi, "~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /gi, "~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /gi, "~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /gi, "~::~RIGHT JOIN ").replace(/ ON /gi, "~::~" + e + "ON ").replace(/ OR /gi, "~::~" + e + e + "OR ").replace(/ ORDER\s{1,}BY/gi, "~::~ORDER BY ").replace(/ OVER /gi, "~::~" + e + "OVER ").replace(/\(\s{0,}SELECT /gi, "~::~(SELECT ").replace(/\)\s{0,}SELECT /gi, ")~::~SELECT ").replace(/ THEN /gi, " THEN~::~" + e).replace(/ UNION /gi, "~::~UNION~::~").replace(/ USING /gi, "~::~USING ").replace(/ WHEN /gi, "~::~" + e + "WHEN ").replace(/ WHERE /gi, "~::~WHERE ").replace(/ WITH /gi, "~::~WITH ").replace(/ ALL /gi, " ALL ").replace(/ AS /gi, " AS ").replace(/ ASC /gi, " ASC ").replace(/ DESC /gi, " DESC ").replace(/ DISTINCT /gi, " DISTINCT ").replace(/ EXISTS /gi, " EXISTS ").replace(/ NOT /gi, " NOT ").replace(/ NULL /gi, " NULL ").replace(/ LIKE /gi, " LIKE ").replace(/\s{0,}SELECT /gi, "SELECT ").replace(/\s{0,}UPDATE /gi, "UPDATE ").replace(/ SET /gi, " SET ").replace(/~::~{1,}/g, "~::~").split("~::~")
        }
        e.prototype.xml = function(e, i) {
            var n = e.replace(/>\s{0,}</g, "><").replace(/</g, "~::~<").replace(/\s*xmlns\:/g, "~::~xmlns:").replace(/\s*xmlns\=/g, "~::~xmlns=").split("~::~"),
                s = n.length,
                o = !1,
                a = 0,
                r = "",
                l = 0,
                c = i ? t(i) : this.shift;
            for (l = 0; s > l; l++) n[l].search(/<!/) > -1 ? (r += c[a] + n[l], o = !0, (n[l].search(/-->/) > -1 || n[l].search(/\]>/) > -1 || n[l].search(/!DOCTYPE/) > -1) && (o = !1)) : n[l].search(/-->/) > -1 || n[l].search(/\]>/) > -1 ? (r += n[l], o = !1) : /^<\w/.exec(n[l - 1]) && /^<\/\w/.exec(n[l]) && /^<[\w:\-\.\,]+/.exec(n[l - 1]) == /^<\/[\w:\-\.\,]+/.exec(n[l])[0].replace("/", "") ? (r += n[l], o || a--) : n[l].search(/<\w/) > -1 && -1 == n[l].search(/<\//) && -1 == n[l].search(/\/>/) ? r = r += o ? n[l] : c[a++] + n[l] : n[l].search(/<\w/) > -1 && n[l].search(/<\//) > -1 ? r = r += o ? n[l] : c[a] + n[l] : n[l].search(/<\//) > -1 ? r = r += o ? n[l] : c[--a] + n[l] : n[l].search(/\/>/) > -1 ? r = r += o ? n[l] : c[a] + n[l] : r += n[l].search(/<\?/) > -1 ? c[a] + n[l] : n[l].search(/xmlns\:/) > -1 || n[l].search(/xmlns\=/) > -1 ? c[a] + n[l] : n[l];
            return "\n" == r[0] ? r.slice(1) : r
        }, e.prototype.json = function(t, e) {
            var e = e ? e : this.step;
            return "undefined" == typeof JSON ? t : "string" == typeof t ? JSON.stringify(JSON.parse(t), null, e) : "object" == typeof t ? JSON.stringify(t, null, e) : t
        }, e.prototype.css = function(e, i) {
            var n = e.replace(/\s{1,}/g, " ").replace(/\{/g, "{~::~").replace(/\}/g, "~::~}~::~").replace(/\;/g, ";~::~").replace(/\/\*/g, "~::~/*").replace(/\*\//g, "*/~::~").replace(/~::~\s{0,}~::~/g, "~::~").split("~::~"),
                s = n.length,
                o = 0,
                a = "",
                r = 0,
                l = i ? t(i) : this.shift;
            for (r = 0; s > r; r++) a += /\{/.exec(n[r]) ? l[o++] + n[r] : /\}/.exec(n[r]) ? l[--o] + n[r] : /\*\\/.exec(n[r]) ? l[o] + n[r] : l[o] + n[r];
            return a.replace(/^\n{1,}/, "")
        }, e.prototype.sql = function(e, s) {
            var o = e.replace(/\s{1,}/g, " ").replace(/\'/gi, "~::~'").split("~::~"),
                a = o.length,
                r = [],
                l = 0,
                c = this.step,
                d = 0,
                h = "",
                u = 0,
                p = s ? t(s) : this.shift;
            for (u = 0; a > u; u++) r = r.concat(u % 2 ? o[u] : n(o[u], c));
            for (a = r.length, u = 0; a > u; u++) {
                d = i(r[u], d), /\s{0,}\s{0,}SELECT\s{0,}/.exec(r[u]) && (r[u] = r[u].replace(/\,/g, ",\n" + c + c)), /\s{0,}\s{0,}SET\s{0,}/.exec(r[u]) && (r[u] = r[u].replace(/\,/g, ",\n" + c + c)), /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(r[u]) ? (l++, h += p[l] + r[u]) : /\'/.exec(r[u]) ? (1 > d && l && l--, h += r[u]) : (h += p[l] + r[u], 1 > d && l && l--)
            }
            return h = h.replace(/^\n{1,}/, "").replace(/\n{1,}/g, "\n")
        }, e.prototype.xmlmin = function(t, e) {
            var i = e ? t : t.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g, "").replace(/[ \r\n\t]{1,}xmlns/g, " xmlns");
            return i.replace(/>\s{0,}</g, "><")
        }, e.prototype.jsonmin = function(t) {
            return "undefined" == typeof JSON ? t : JSON.stringify(JSON.parse(t), null, 0)
        }, e.prototype.cssmin = function(t, e) {
            var i = e ? t : t.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, "");
            return i.replace(/\s{1,}/g, " ").replace(/\{\s{1,}/g, "{").replace(/\}\s{1,}/g, "}").replace(/\;\s{1,}/g, ";").replace(/\/\*\s{1,}/g, "/*").replace(/\*\/\s{1,}/g, "*/")
        }, e.prototype.sqlmin = function(t) {
            return t.replace(/\s{1,}/g, " ").replace(/\s{1,}\(/, "(").replace(/\s{1,}\)/, ")")
        }, window.vkbeautify = new e
    }(),
/************************ end vkbeautify.js ********************************/
    function(t, e) {
        function i(t) {
            return t.call.apply(t.bind, arguments)
        }

        function n(t, e) {
            if (!t) throw Error();
            if (2 < arguments.length) {
                var i = Array.prototype.slice.call(arguments, 2);
                return function() {
                    var n = Array.prototype.slice.call(arguments);
                    return Array.prototype.unshift.apply(n, i), t.apply(e, n)
                }
            }
            return function() {
                return t.apply(e, arguments)
            }
        }

        function s() {
            return s = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? i : n, s.apply(null, arguments)
        }

        function o(t, e) {
            this.J = t, this.t = e || t, this.C = this.t.document
        }

        function a(t, i, n) {
            t = t.C.getElementsByTagName(i)[0], t || (t = e.documentElement), t && t.lastChild && t.insertBefore(n, t.lastChild)
        }

        function r(t, e) {
            function i() {
                t.C.body ? e() : setTimeout(i, 0)
            }
            i()
        }

        function l(t, e, i) {
            e = e || [], i = i || [];
            for (var n = t.className.split(/\s+/), s = 0; s < e.length; s += 1) {
                for (var o = !1, a = 0; a < n.length; a += 1)
                    if (e[s] === n[a]) {
                        o = !0;
                        break
                    }
                o || n.push(e[s])
            }
            for (e = [], s = 0; s < n.length; s += 1) {
                for (o = !1, a = 0; a < i.length; a += 1)
                    if (n[s] === i[a]) {
                        o = !0;
                        break
                    }
                o || e.push(n[s])
            }
            t.className = e.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "")
        }

        function c(t, e) {
            for (var i = t.className.split(/\s+/), n = 0, s = i.length; s > n; n++)
                if (i[n] == e) return !0;
            return !1
        }

        function d(t) {
            if ("string" == typeof t.ma) return t.ma;
            var e = t.t.location.protocol;
            return "about:" == e && (e = t.J.location.protocol), "https:" == e ? "https:" : "http:"
        }

        function h(t, e) {
            var i = t.createElement("link", {
                    rel: "stylesheet",
                    href: e
                }),
                n = !1;
            i.onload = function() {
                n || (n = !0)
            }, i.onerror = function() {
                n || (n = !0)
            }, a(t, "head", i)
        }

        function u(e, i, n, s) {
            var o = e.C.getElementsByTagName("head")[0];
            if (o) {
                var a = e.createElement("script", {
                        src: i
                    }),
                    r = !1;
                return a.onload = a.onreadystatechange = function() {
                    r || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (r = !0, n && n(null), a.onload = a.onreadystatechange = null, "HEAD" == a.parentNode.tagName && o.removeChild(a))
                }, o.appendChild(a), t.setTimeout(function() {
                    r || (r = !0, n && n(Error("Script load timeout")))
                }, s || 5e3), a
            }
            return null
        }

        function p(t, e) {
            this.X = t, this.fa = e
        }

        function f(t, e, i, n) {
            this.c = null != t ? t : null, this.g = null != e ? e : null, this.A = null != i ? i : null, this.e = null != n ? n : null
        }

        function m(t) {
            t = q.exec(t);
            var e = null,
                i = null,
                n = null,
                s = null;
            return t && (null !== t[1] && t[1] && (e = parseInt(t[1], 10)), null !== t[2] && t[2] && (i = parseInt(t[2], 10)), null !== t[3] && t[3] && (n = parseInt(t[3], 10)), null !== t[4] && t[4] && (s = /^[0-9]+$/.test(t[4]) ? parseInt(t[4], 10) : t[4])), new f(e, i, n, s)
        }

        function g(t, e, i, n, s, o, a, r) {
            this.M = t, this.k = r
        }

        function v(t) {
            this.a = t
        }

        function b(t) {
            var e = E(t.a, /(iPod|iPad|iPhone|Android|Windows Phone|BB\d{2}|BlackBerry)/, 1);
            return "" != e ? (/BB\d{2}/.test(e) && (e = "BlackBerry"), e) : (t = E(t.a, /(Linux|Mac_PowerPC|Macintosh|Windows|CrOS|PlayStation|CrKey)/, 1), "" != t ? ("Mac_PowerPC" == t ? t = "Macintosh" : "PlayStation" == t && (t = "Linux"), t) : "Unknown")
        }

        function S(t) {
            var e = E(t.a, /(OS X|Windows NT|Android) ([^;)]+)/, 2);
            if (e || (e = E(t.a, /Windows Phone( OS)? ([^;)]+)/, 2)) || (e = E(t.a, /(iPhone )?OS ([\d_]+)/, 2))) return e;
            if (e = E(t.a, /(?:Linux|CrOS|CrKey) ([^;)]+)/, 1))
                for (var e = e.split(/\s/), i = 0; i < e.length; i += 1)
                    if (/^[\d\._]+$/.test(e[i])) return e[i];
            return (t = E(t.a, /(BB\d{2}|BlackBerry).*?Version\/([^\s]*)/, 2)) ? t : "Unknown"
        }

        function y(t) {
            var e = b(t),
                i = m(S(t)),
                n = m(E(t.a, /AppleWeb(?:K|k)it\/([\d\.\+]+)/, 1)),
                s = "Unknown",
                o = new f,
                o = "Unknown",
                a = !1;
            return /OPR\/[\d.]+/.test(t.a) ? s = "Opera" : -1 != t.a.indexOf("Chrome") || -1 != t.a.indexOf("CrMo") || -1 != t.a.indexOf("CriOS") ? s = "Chrome" : /Silk\/\d/.test(t.a) ? s = "Silk" : "BlackBerry" == e || "Android" == e ? s = "BuiltinBrowser" : -1 != t.a.indexOf("PhantomJS") ? s = "PhantomJS" : -1 != t.a.indexOf("Safari") ? s = "Safari" : -1 != t.a.indexOf("AdobeAIR") ? s = "AdobeAIR" : -1 != t.a.indexOf("PlayStation") && (s = "BuiltinBrowser"), "BuiltinBrowser" == s ? o = "Unknown" : "Silk" == s ? o = E(t.a, /Silk\/([\d\._]+)/, 1) : "Chrome" == s ? o = E(t.a, /(Chrome|CrMo|CriOS)\/([\d\.]+)/, 2) : -1 != t.a.indexOf("Version/") ? o = E(t.a, /Version\/([\d\.\w]+)/, 1) : "AdobeAIR" == s ? o = E(t.a, /AdobeAIR\/([\d\.]+)/, 1) : "Opera" == s ? o = E(t.a, /OPR\/([\d.]+)/, 1) : "PhantomJS" == s && (o = E(t.a, /PhantomJS\/([\d.]+)/, 1)), o = m(o), a = "AdobeAIR" == s ? 2 < o.c || 2 == o.c && 5 <= o.g : "BlackBerry" == e ? 10 <= i.c : "Android" == e ? 2 < i.c || 2 == i.c && 1 < i.g : 526 <= n.c || 525 <= n.c && 13 <= n.g, new g(s, 0, 0, 0, 0, 0, 0, new p(a, 536 > n.c || 536 == n.c && 11 > n.g))
        }

        function E(t, e, i) {
            return (t = t.match(e)) && t[i] ? t[i] : ""
        }

        function T(t) {
            this.la = t || "-"
        }

        function L(t, e) {
            this.M = t, this.Y = 4, this.N = "n";
            var i = (e || "n4").match(/^([nio])([1-9])$/i);
            i && (this.N = i[1], this.Y = parseInt(i[2], 10))
        }

        function _(t) {
            return t.N + t.Y
        }

        function w(t) {
            var e = 4,
                i = "n",
                n = null;
            return t && ((n = t.match(/(normal|oblique|italic)/i)) && n[1] && (i = n[1].substr(0, 1).toLowerCase()), (n = t.match(/([1-9]00|normal|bold)/i)) && n[1] && (/bold/i.test(n[1]) ? e = 7 : /[1-9]00/.test(n[1]) && (e = parseInt(n[1].substr(0, 1), 10)))), i + e
        }

        function k(t, e) {
            this.d = t, this.p = t.t.document.documentElement, this.P = e, this.j = "wf", this.h = new T("-"), this.ga = !1 !== e.events, this.B = !1 !== e.classes
        }

        function C(t) {
            if (t.B) {
                var e = c(t.p, t.h.e(t.j, "active")),
                    i = [],
                    n = [t.h.e(t.j, "loading")];
                e || i.push(t.h.e(t.j, "inactive")), l(t.p, i, n)
            }
            A(t, "inactive")
        }

        function A(t, e, i) {
            t.ga && t.P[e] && (i ? t.P[e](i.getName(), _(i)) : t.P[e]())
        }

        function x() {
            this.w = {}
        }

        function D(t, e) {
            this.d = t, this.G = e, this.m = this.d.createElement("span", {
                "aria-hidden": "true"
            }, this.G)
        }

        function I(t) {
            a(t.d, "body", t.m)
        }

        function M(t) {
            var e;
            e = [];
            for (var i = t.M.split(/,\s*/), n = 0; n < i.length; n++) {
                var s = i[n].replace(/['"]/g, "");
                e.push(-1 == s.indexOf(" ") ? s : "'" + s + "'")
            }
            return e = e.join(","), i = "normal", "o" === t.N ? i = "oblique" : "i" === t.N && (i = "italic"), "display:block;position:absolute;top:-999px;left:-999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" + e + ";" + ("font-style:" + i + ";font-weight:" + (t.Y + "00") + ";")
        }

        function R(t, e, i, n, s, o, a, r) {
            this.Z = t, this.ja = e, this.d = i, this.s = n, this.G = r || "BESbswy", this.k = s, this.I = {}, this.W = o || 3e3, this.ba = a || null, this.F = this.D = null, t = new D(this.d, this.G), I(t);
            for (var l in Z) Z.hasOwnProperty(l) && (e = new L(Z[l], _(this.s)), e = M(e), t.m.style.cssText = e, this.I[Z[l]] = t.m.offsetWidth);
            t.remove()
        }

        function O(t, e, i) {
            for (var n in Z)
                if (Z.hasOwnProperty(n) && e === t.I[Z[n]] && i === t.I[Z[n]]) return !0;
            return !1
        }

        function N(t) {
            var e = t.D.m.offsetWidth,
                i = t.F.m.offsetWidth;
            e === t.I.serif && i === t.I["sans-serif"] || t.k.fa && O(t, e, i) ? K() - t.na >= t.W ? t.k.fa && O(t, e, i) && (null === t.ba || t.ba.hasOwnProperty(t.s.getName())) ? $(t, t.Z) : $(t, t.ja) : P(t) : $(t, t.Z)
        }

        function P(t) {
            setTimeout(s(function() {
                N(this)
            }, t), 25)
        }

        function $(t, e) {
            t.D.remove(), t.F.remove(), e(t.s)
        }

        function U(t, e, i, n) {
            this.d = e, this.u = i, this.R = 0, this.da = this.aa = !1, this.W = n, this.k = t.k
        }

        function B(t, e, i, n, o) {
            if (i = i || {}, 0 === e.length && o) C(t.u);
            else
                for (t.R += e.length, o && (t.aa = o), o = 0; o < e.length; o++) {
                    var a = e[o],
                        r = i[a.getName()],
                        c = t.u,
                        d = a;
                    c.B && l(c.p, [c.h.e(c.j, d.getName(), _(d).toString(), "loading")]), A(c, "fontloading", d), c = null, c = new R(s(t.ha, t), s(t.ia, t), t.d, a, t.k, t.W, n, r), c.start()
                }
        }

        function F(t) {
            0 == --t.R && t.aa && (t.da ? (t = t.u, t.B && l(t.p, [t.h.e(t.j, "active")], [t.h.e(t.j, "loading"), t.h.e(t.j, "inactive")]), A(t, "active")) : C(t.u))
        }

        function j(t) {
            this.J = t, this.v = new x, this.oa = new v(t.navigator.userAgent), this.a = this.oa.parse(), this.T = this.U = 0, this.Q = this.S = !0
        }

        function H(t, e, i, n, s) {
            var o = 0 == --t.U;
            (t.Q || t.S) && setTimeout(function() {
                B(e, i, n || null, s || null, o)
            }, 0)
        }

        function z(t, e, i) {
            this.O = t ? t : e + te, this.q = [], this.V = [], this.ea = i || ""
        }

        function V(t) {
            this.q = t, this.ca = [], this.L = {}
        }

        function Y(t, e) {
            this.a = new v(navigator.userAgent).parse(), this.d = t, this.f = e
        }

        function X(t, e) {
            this.d = t, this.f = e, this.o = []
        }

        function W(t, e) {
            this.d = t, this.f = e, this.o = []
        }

        function G(t, e) {
            this.d = t, this.f = e, this.o = []
        }

        function J(t, e) {
            this.d = t, this.f = e
        }
        var K = Date.now || function() {
                return +new Date
            };
        o.prototype.createElement = function(t, e, i) {
            if (t = this.C.createElement(t), e)
                for (var n in e) e.hasOwnProperty(n) && ("style" == n ? t.style.cssText = e[n] : t.setAttribute(n, e[n]));
            return i && t.appendChild(this.C.createTextNode(i)), t
        };
        var q = /^([0-9]+)(?:[\._-]([0-9]+))?(?:[\._-]([0-9]+))?(?:[\._+-]?(.*))?$/;
        f.prototype.compare = function(t) {
            return this.c > t.c || this.c === t.c && this.g > t.g || this.c === t.c && this.g === t.g && this.A > t.A ? 1 : this.c < t.c || this.c === t.c && this.g < t.g || this.c === t.c && this.g === t.g && this.A < t.A ? -1 : 0
        }, f.prototype.toString = function() {
            return [this.c, this.g || "", this.A || "", this.e || ""].join("")
        }, g.prototype.getName = function() {
            return this.M
        };
        var Q = new g("Unknown", 0, 0, 0, 0, 0, 0, new p(!1, !1));
        v.prototype.parse = function() {
            var t;
            if (-1 != this.a.indexOf("MSIE") || -1 != this.a.indexOf("Trident/")) {
                t = b(this);
                var e = m(S(this)),
                    i = null,
                    n = E(this.a, /Trident\/([\d\w\.]+)/, 1),
                    i = m(-1 != this.a.indexOf("MSIE") ? E(this.a, /MSIE ([\d\w\.]+)/, 1) : E(this.a, /rv:([\d\w\.]+)/, 1));
                "" != n && m(n), t = new g("MSIE", 0, 0, 0, 0, 0, 0, new p("Windows" == t && 6 <= i.c || "Windows Phone" == t && 8 <= e.c, !1))
            } else if (-1 != this.a.indexOf("Opera")) t: if (t = m(E(this.a, /Presto\/([\d\w\.]+)/, 1)), m(S(this)), null !== t.c || m(E(this.a, /rv:([^\)]+)/, 1)), -1 != this.a.indexOf("Opera Mini/")) t = m(E(this.a, /Opera Mini\/([\d\.]+)/, 1)), t = new g("OperaMini", 0, 0, 0, b(this), 0, 0, new p(!1, !1));
            else {
                if (-1 != this.a.indexOf("Version/") && (t = m(E(this.a, /Version\/([\d\.]+)/, 1)), null !== t.c)) {
                    t = new g("Opera", 0, 0, 0, b(this), 0, 0, new p(10 <= t.c, !1));
                    break t
                }
                t = m(E(this.a, /Opera[\/ ]([\d\.]+)/, 1)), t = null !== t.c ? new g("Opera", 0, 0, 0, b(this), 0, 0, new p(10 <= t.c, !1)) : new g("Opera", 0, 0, 0, b(this), 0, 0, new p(!1, !1))
            } else /OPR\/[\d.]+/.test(this.a) ? t = y(this) : /AppleWeb(K|k)it/.test(this.a) ? t = y(this) : -1 != this.a.indexOf("Gecko") ? (t = "Unknown", e = new f, m(S(this)), e = !1, -1 != this.a.indexOf("Firefox") ? (t = "Firefox", e = m(E(this.a, /Firefox\/([\d\w\.]+)/, 1)), e = 3 <= e.c && 5 <= e.g) : -1 != this.a.indexOf("Mozilla") && (t = "Mozilla"), i = m(E(this.a, /rv:([^\)]+)/, 1)), e || (e = 1 < i.c || 1 == i.c && 9 < i.g || 1 == i.c && 9 == i.g && 2 <= i.A), t = new g(t, 0, 0, 0, b(this), 0, 0, new p(e, !1))) : t = Q;
            return t
        }, T.prototype.e = function() {
            for (var t = [], e = 0; e < arguments.length; e++) t.push(arguments[e].replace(/[\W_]+/g, "").toLowerCase());
            return t.join(this.la)
        }, L.prototype.getName = function() {
            return this.M
        }, D.prototype.remove = function() {
            var t = this.m;
            t.parentNode && t.parentNode.removeChild(t)
        };
        var Z = {
            ra: "serif",
            qa: "sans-serif",
            pa: "monospace"
        };
        R.prototype.start = function() {
            this.D = new D(this.d, this.G), I(this.D), this.F = new D(this.d, this.G), I(this.F), this.na = K();
            var t = new L(this.s.getName() + ",serif", _(this.s)),
                t = M(t);
            this.D.m.style.cssText = t, t = new L(this.s.getName() + ",sans-serif", _(this.s)), t = M(t), this.F.m.style.cssText = t, N(this)
        }, U.prototype.ha = function(t) {
            var e = this.u;
            e.B && l(e.p, [e.h.e(e.j, t.getName(), _(t).toString(), "active")], [e.h.e(e.j, t.getName(), _(t).toString(), "loading"), e.h.e(e.j, t.getName(), _(t).toString(), "inactive")]), A(e, "fontactive", t), this.da = !0, F(this)
        }, U.prototype.ia = function(t) {
            var e = this.u;
            if (e.B) {
                var i = c(e.p, e.h.e(e.j, t.getName(), _(t).toString(), "active")),
                    n = [],
                    s = [e.h.e(e.j, t.getName(), _(t).toString(), "loading")];
                i || n.push(e.h.e(e.j, t.getName(), _(t).toString(), "inactive")), l(e.p, n, s)
            }
            A(e, "fontinactive", t), F(this)
        }, j.prototype.load = function(t) {
            this.d = new o(this.J, t.context || this.J), this.S = !1 !== t.events, this.Q = !1 !== t.classes;
            var e = new k(this.d, t),
                i = [],
                n = t.timeout;
            e.B && l(e.p, [e.h.e(e.j, "loading")]), A(e, "loading");
            var a, i = this.v,
                r = this.d,
                c = [];
            for (a in t)
                if (t.hasOwnProperty(a)) {
                    var d = i.w[a];
                    d && c.push(d(t[a], r))
                }
            for (i = c, this.T = this.U = i.length, t = new U(this.a, this.d, e, n), n = 0, a = i.length; a > n; n++) r = i[n], r.K(this.a, s(this.ka, this, r, e, t))
        }, j.prototype.ka = function(t, e, i, n) {
            var s = this;
            n ? t.load(function(t, e, n) {
                H(s, i, t, e, n)
            }) : (t = 0 == --this.U, this.T--, t && 0 == this.T ? C(e) : (this.Q || this.S) && B(i, [], {}, null, t))
        };
        var te = "//fonts.googleapis.com/css";
        z.prototype.e = function() {
            if (0 == this.q.length) throw Error("No fonts to load!");
            if (-1 != this.O.indexOf("kit=")) return this.O;
            for (var t = this.q.length, e = [], i = 0; t > i; i++) e.push(this.q[i].replace(/ /g, "+"));
            return t = this.O + "?family=" + e.join("%7C"), 0 < this.V.length && (t += "&subset=" + this.V.join(",")), 0 < this.ea.length && (t += "&text=" + encodeURIComponent(this.ea)), t
        };
        var ee = {
                latin: "BESbswy",
                cyrillic: "&#1081;&#1103;&#1046;",
                greek: "&#945;&#946;&#931;",
                khmer: "&#x1780;&#x1781;&#x1782;",
                Hanuman: "&#x1780;&#x1781;&#x1782;"
            },
            ie = {
                thin: "1",
                extralight: "2",
                "extra-light": "2",
                ultralight: "2",
                "ultra-light": "2",
                light: "3",
                regular: "4",
                book: "4",
                medium: "5",
                "semi-bold": "6",
                semibold: "6",
                "demi-bold": "6",
                demibold: "6",
                bold: "7",
                "extra-bold": "8",
                extrabold: "8",
                "ultra-bold": "8",
                ultrabold: "8",
                black: "9",
                heavy: "9",
                l: "3",
                r: "4",
                b: "7"
            },
            ne = {
                i: "i",
                italic: "i",
                n: "n",
                normal: "n"
            },
            se = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
        V.prototype.parse = function() {
            for (var t = this.q.length, e = 0; t > e; e++) {
                var i = this.q[e].split(":"),
                    n = i[0].replace(/\+/g, " "),
                    s = ["n4"];
                if (2 <= i.length) {
                    var o, a = i[1];
                    if (o = [], a)
                        for (var a = a.split(","), r = a.length, l = 0; r > l; l++) {
                            var c;
                            if (c = a[l], c.match(/^[\w-]+$/)) {
                                c = se.exec(c.toLowerCase());
                                var d = void 0;
                                if (null == c) d = "";
                                else {
                                    if (d = void 0, d = c[1], null == d || "" == d) d = "4";
                                    else var h = ie[d],
                                        d = h ? h : isNaN(d) ? "4" : d.substr(0, 1);
                                    c = c[2], d = [null == c || "" == c ? "n" : ne[c], d].join("")
                                }
                                c = d
                            } else c = "";
                            c && o.push(c)
                        }
                    0 < o.length && (s = o), 3 == i.length && (i = i[2], o = [], i = i ? i.split(",") : o, 0 < i.length && (i = ee[i[0]]) && (this.L[n] = i))
                }
                for (this.L[n] || (i = ee[n]) && (this.L[n] = i), i = 0; i < s.length; i += 1) this.ca.push(new L(n, s[i]))
            }
        };
        var oe = {
            Arimo: !0,
            Cousine: !0,
            Tinos: !0
        };
        Y.prototype.K = function(t, e) {
            e(t.k.X)
        }, Y.prototype.load = function(t) {
            var e = this.d;
            "MSIE" == this.a.getName() && 1 != this.f.blocking ? r(e, s(this.$, this, t)) : this.$(t)
        }, Y.prototype.$ = function(t) {
            for (var e = this.d, i = new z(this.f.api, d(e), this.f.text), n = this.f.families, s = n.length, o = 0; s > o; o++) {
                var a = n[o].split(":");
                3 == a.length && i.V.push(a.pop());
                var r = "";
                2 == a.length && "" != a[1] && (r = ":"), i.q.push(a.join(r))
            }
            n = new V(n), n.parse(), h(e, i.e()), t(n.ca, n.L, oe)
        }, X.prototype.H = function(t) {
            var e = this.d;
            return d(this.d) + (this.f.api || "//f.fontdeck.com/s/css/js/") + (e.t.location.hostname || e.J.location.hostname) + "/" + t + ".js"
        }, X.prototype.K = function(t, e) {
            var i = this.f.id,
                n = this.d.t,
                s = this;
            i ? (n.__webfontfontdeckmodule__ || (n.__webfontfontdeckmodule__ = {}), n.__webfontfontdeckmodule__[i] = function(t, i) {
                for (var n = 0, o = i.fonts.length; o > n; ++n) {
                    var a = i.fonts[n];
                    s.o.push(new L(a.name, w("font-weight:" + a.weight + ";font-style:" + a.style)))
                }
                e(t)
            }, u(this.d, this.H(i), function(t) {
                t && e(!1)
            })) : e(!1)
        }, X.prototype.load = function(t) {
            t(this.o)
        }, W.prototype.H = function(t) {
            var e = d(this.d);
            return (this.f.api || e + "//use.typekit.net") + "/" + t + ".js"
        }, W.prototype.K = function(t, e) {
            var i = this.f.id,
                n = this.d.t,
                s = this;
            i ? u(this.d, this.H(i), function(t) {
                if (t) e(!1);
                else {
                    if (n.Typekit && n.Typekit.config && n.Typekit.config.fn) {
                        t = n.Typekit.config.fn;
                        for (var i = 0; i < t.length; i += 2)
                            for (var o = t[i], a = t[i + 1], r = 0; r < a.length; r++) s.o.push(new L(o, a[r]));
                        try {
                            n.Typekit.load({
                                events: !1,
                                classes: !1
                            })
                        } catch (l) {}
                    }
                    e(!0)
                }
            }, 2e3) : e(!1)
        }, W.prototype.load = function(t) {
            t(this.o)
        }, G.prototype.K = function(t, e) {
            var i = this,
                n = i.f.projectId,
                s = i.f.version;
            if (n) {
                var o = i.d.t;
                u(this.d, i.H(n, s), function(s) {
                    if (s) e(!1);
                    else {
                        if (o["__mti_fntLst" + n] && (s = o["__mti_fntLst" + n]()))
                            for (var a = 0; a < s.length; a++) i.o.push(new L(s[a].fontfamily));
                        e(t.k.X)
                    }
                }).id = "__MonotypeAPIScript__" + n
            } else e(!1)
        }, G.prototype.H = function(t, e) {
            var i = d(this.d),
                n = (this.f.api || "fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/, "");
            return i + "//" + n + "/" + t + ".js" + (e ? "?v=" + e : "")
        }, G.prototype.load = function(t) {
            t(this.o)
        }, J.prototype.load = function(t) {
            var e, i, n = this.f.urls || [],
                s = this.f.families || [],
                o = this.f.testStrings || {};
            for (e = 0, i = n.length; i > e; e++) h(this.d, n[e]);
            for (n = [], e = 0, i = s.length; i > e; e++) {
                var a = s[e].split(":");
                if (a[1])
                    for (var r = a[1].split(","), l = 0; l < r.length; l += 1) n.push(new L(a[0], r[l]));
                else n.push(new L(a[0]))
            }
            t(n, o)
        }, J.prototype.K = function(t, e) {
            return e(t.k.X)
        };
        var ae = new j(this);
        ae.v.w.custom = function(t, e) {
            return new J(e, t)
        }, ae.v.w.fontdeck = function(t, e) {
            return new X(e, t)
        }, ae.v.w.monotype = function(t, e) {
            return new G(e, t)
        }, ae.v.w.typekit = function(t, e) {
            return new W(e, t)
        }, ae.v.w.google = function(t, e) {
            return new Y(e, t)
        }, this.WebFont || (this.WebFont = {}, this.WebFont.load = s(ae.load, ae), this.WebFontConfig && ae.load(this.WebFontConfig))
    }(this, document),
    function(t, e, i) {
        e[t] = e[t] || i(), "undefined" != typeof module && module.exports ? module.exports = e[t] : "function" == typeof define && define.amd && define(function() {
            return e[t]
        })
    }("Promise", "undefined" != typeof global ? global : this, function() {
        "use strict";

        function t(t, e) {
            u.add(t, e), h || (h = f(u.drain))
        }

        function e(t) {
            var e, i = typeof t;
            return null == t || "object" != i && "function" != i || (e = t.then), "function" == typeof e ? e : !1
        }

        function i() {
            for (var t = 0; t < this.chain.length; t++) n(this, 1 === this.state ? this.chain[t].success : this.chain[t].failure, this.chain[t]);
            this.chain.length = 0
        }

        function n(t, i, n) {
            var s, o;
            try {
                i === !1 ? n.reject(t.msg) : (s = i === !0 ? t.msg : i.call(void 0, t.msg), s === n.promise ? n.reject(TypeError("Promise-chain cycle")) : (o = e(s)) ? o.call(s, n.resolve, n.reject) : n.resolve(s))
            } catch (a) {
                n.reject(a)
            }
        }

        function s(n) {
            var a, l = this;
            if (!l.triggered) {
                l.triggered = !0, l.def && (l = l.def);
                try {
                    (a = e(n)) ? t(function() {
                        var t = new r(l);
                        try {
                            a.call(n, function() {
                                s.apply(t, arguments)
                            }, function() {
                                o.apply(t, arguments)
                            })
                        } catch (e) {
                            o.call(t, e)
                        }
                    }): (l.msg = n, l.state = 1, l.chain.length > 0 && t(i, l))
                } catch (c) {
                    o.call(new r(l), c)
                }
            }
        }

        function o(e) {
            var n = this;
            n.triggered || (n.triggered = !0, n.def && (n = n.def), n.msg = e, n.state = 2, n.chain.length > 0 && t(i, n))
        }

        function a(t, e, i, n) {
            for (var s = 0; s < e.length; s++) ! function(s) {
                t.resolve(e[s]).then(function(t) {
                    i(s, t)
                }, n)
            }(s)
        }

        function r(t) {
            this.def = t, this.triggered = !1
        }

        function l(t) {
            this.promise = t, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0
        }

        function c(e) {
            if ("function" != typeof e) throw TypeError("Not a function");
            if (0 !== this.__NPO__) throw TypeError("Not a promise");
            this.__NPO__ = 1;
            var n = new l(this);
            this.then = function(e, s) {
                var o = {
                    success: "function" == typeof e ? e : !0,
                    failure: "function" == typeof s ? s : !1
                };
                return o.promise = new this.constructor(function(t, e) {
                    if ("function" != typeof t || "function" != typeof e) throw TypeError("Not a function");
                    o.resolve = t, o.reject = e
                }), n.chain.push(o), 0 !== n.state && t(i, n), o.promise
            }, this["catch"] = function(t) {
                return this.then(void 0, t)
            };
            try {
                e.call(void 0, function(t) {
                    s.call(n, t)
                }, function(t) {
                    o.call(n, t)
                })
            } catch (a) {
                o.call(n, a)
            }
        }
        var d, h, u, p = Object.prototype.toString,
            f = "undefined" != typeof setImmediate ? function(t) {
                return setImmediate(t)
            } : setTimeout;
        try {
            Object.defineProperty({}, "x", {}), d = function(t, e, i, n) {
                return Object.defineProperty(t, e, {
                    value: i,
                    writable: !0,
                    configurable: n !== !1
                })
            }
        } catch (m) {
            d = function(t, e, i) {
                return t[e] = i, t
            }
        }
        u = function() {
            function t(t, e) {
                this.fn = t, this.self = e, this.next = void 0
            }
            var e, i, n;
            return {
                add: function(s, o) {
                    n = new t(s, o), i ? i.next = n : e = n, i = n, n = void 0
                },
                drain: function() {
                    var t = e;
                    for (e = i = h = void 0; t;) t.fn.call(t.self), t = t.next
                }
            }
        }();
        var g = d({}, "constructor", c, !1);
        return c.prototype = g, d(g, "__NPO__", 0, !1), d(c, "resolve", function(t) {
            var e = this;
            return t && "object" == typeof t && 1 === t.__NPO__ ? t : new e(function(e, i) {
                if ("function" != typeof e || "function" != typeof i) throw TypeError("Not a function");
                e(t)
            })
        }), d(c, "reject", function(t) {
            return new this(function(e, i) {
                if ("function" != typeof e || "function" != typeof i) throw TypeError("Not a function");
                i(t)
            })
        }), d(c, "all", function(t) {
            var e = this;
            return "[object Array]" != p.call(t) ? e.reject(TypeError("Not an array")) : 0 === t.length ? e.resolve([]) : new e(function(i, n) {
                if ("function" != typeof i || "function" != typeof n) throw TypeError("Not a function");
                var s = t.length,
                    o = Array(s),
                    r = 0;
                a(e, t, function(t, e) {
                    o[t] = e, ++r === s && i(o)
                }, n)
            })
        }), d(c, "race", function(t) {
            var e = this;
            return "[object Array]" != p.call(t) ? e.reject(TypeError("Not an array")) : new e(function(i, n) {
                if ("function" != typeof i || "function" != typeof n) throw TypeError("Not a function");
                a(e, t, function(t, e) {
                    i(e)
                }, n)
            })
        }), c
    });


!function (e, t) {
    "function" == typeof define && define.amd ? define(function () {
        return e.Reveal = t(), e.Reveal
    }) : "object" == typeof exports ? module.exports = t() : e.Reveal = t()
}(this, function () {
    "use strict";
    function e(e) {
        if (zr !== !0)if (zr = !0, t(), Ur.transforms2d || Ur.transforms3d) {
            Vr.wrapper = document.querySelector(".reveal"), Vr.slides = document.querySelector(".reveal .slides"), window.addEventListener("load", z, !1);
            var n = kr.getQueryHash();
            "undefined" != typeof n.dependencies && delete n.dependencies, h(Br, e), h(Br, n), q(), r()
        } else {
            document.body.setAttribute("class", "no-transforms");
            for (var a = g(document.getElementsByTagName("img")), i = g(document.getElementsByTagName("iframe")), o = a.concat(i), s = 0, l = o.length; l > s; s++) {
                var c = o[s];
                c.getAttribute("data-src") && (c.setAttribute("src", c.getAttribute("data-src")), c.removeAttribute("data-src"))
            }
        }
    }

    function t() {
        qr = /(iphone|ipod|ipad|android)/gi.test(Dr), Nr = /chrome/i.test(Dr) && !/edge/i.test(Dr);
        var e = document.createElement("div");
        Ur.transforms3d = "WebkitPerspective" in e.style || "MozPerspective" in e.style || "msPerspective" in e.style || "OPerspective" in e.style || "perspective" in e.style, Ur.transforms2d = "WebkitTransform" in e.style || "MozTransform" in e.style || "msTransform" in e.style || "OTransform" in e.style || "transform" in e.style, Ur.requestAnimationFrameMethod = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame, Ur.requestAnimationFrame = "function" == typeof Ur.requestAnimationFrameMethod, Ur.canvas = !!document.createElement("canvas").getContext, Ur.overviewTransitions = !/Version\/[\d\.]+.*Safari/.test(Dr), Ur.zoom = "zoom" in e.style && !qr && (Nr || /Version\/[\d\.]+.*Safari/.test(Dr))
    }

    function r() {
        function e() {
            a.length && head.js.apply(null, a), n()
        }

        function t(t) {
            head.ready(t.src.match(/([\w\d_\-]*)\.?js$|[^\\\/]*$/i)[0], function () {
                "function" == typeof t.callback && t.callback.apply(this), 0 === --i && e()
            })
        }

        for (var r = [], a = [], i = 0, o = 0, s = Br.dependencies.length; s > o; o++) {
            var l = Br.dependencies[o];
            (!l.condition || l.condition()) && (l.async ? a.push(l.src) : r.push(l.src), t(l))
        }
        r.length ? (i = r.length, head.js.apply(null, r)) : e()
    }

    function n() {
        a(), u(), s(), at(), p(), qt(), vt(!0), setTimeout(function () {
            Vr.slides.classList.remove("no-transition"), Rr = !0, /*Vr.wrapper.classList.add("ready"),*/ M("ready", {
                indexh: Ar,
                indexv: Lr,
                currentSlide: Sr
            })
        }, 1), x() && (v(), "complete" === document.readyState ? o() : window.addEventListener("load", o))
    }

    function a() {
        Vr.slides.classList.add("no-transition"), Vr.background = l(Vr.wrapper, "div", "backgrounds", null), Vr.progress = l(Vr.wrapper, "div", "progress", "<span></span>"), Vr.progressbar = Vr.progress.querySelector("span"), l(Vr.wrapper, "aside", "controls", '<button class="navigate-left" aria-label="previous slide"></button><button class="navigate-right" aria-label="next slide"></button><button class="navigate-up" aria-label="above slide"></button><button class="navigate-down" aria-label="below slide"></button>'), Vr.slideNumber = l(Vr.wrapper, "div", "slide-number", ""), Vr.speakerNotes = l(Vr.wrapper, "div", "speaker-notes", null), Vr.speakerNotes.setAttribute("data-prevent-swipe", ""), Vr.speakerNotes.setAttribute("tabindex", "0"), l(Vr.wrapper, "div", "pause-overlay", null), Vr.controls = document.querySelector(".reveal .controls"), Vr.wrapper.setAttribute("role", "application"), Vr.controlsLeft = g(document.querySelectorAll(".navigate-left")), Vr.controlsRight = g(document.querySelectorAll(".navigate-right")), Vr.controlsUp = g(document.querySelectorAll(".navigate-up")), Vr.controlsDown = g(document.querySelectorAll(".navigate-down")), Vr.controlsPrev = g(document.querySelectorAll(".navigate-prev")), Vr.controlsNext = g(document.querySelectorAll(".navigate-next")), Vr.statusDiv = i()
    }

    function i() {
        var e = document.getElementById("aria-status-div");
        return e || (e = document.createElement("div"), e.style.position = "absolute", e.style.height = "1px", e.style.width = "1px", e.style.overflow = "hidden", e.style.clip = "rect( 1px, 1px, 1px, 1px )", e.setAttribute("id", "aria-status-div"), e.setAttribute("aria-live", "polite"), e.setAttribute("aria-atomic", "true"), Vr.wrapper.appendChild(e)), e
    }

    function o() {
        var e = W(window.innerWidth, window.innerHeight), t = Math.floor(e.width * (1 + Br.margin)), r = Math.floor(e.height * (1 + Br.margin)), n = e.width, a = e.height;
        k("@page{size:" + t + "px " + r + "px; margin: 0;}"), k(".reveal section>img, .reveal section>video, .reveal section>iframe{max-width: " + n + "px; max-height:" + a + "px}"), document.body.classList.add("print-pdf"), document.body.style.width = t + "px", document.body.style.height = r + "px", g(Vr.wrapper.querySelectorAll(Cr)).forEach(function (e, t) {
            e.setAttribute("data-index-h", t), e.classList.contains("stack") && g(e.querySelectorAll("section")).forEach(function (e, r) {
                e.setAttribute("data-index-h", t), e.setAttribute("data-index-v", r)
            })
        }), g(Vr.wrapper.querySelectorAll(Ir)).forEach(function (e) {
            if (e.classList.contains("stack") === !1) {
                var i = (t - n) / 2, o = (r - a) / 2, s = e.scrollHeight, l = Math.max(Math.ceil(s / r), 1);
                l = Math.min(l, Br.pdfMaxPagesPerSlide), (1 === l && Br.center || e.classList.contains("center")) && (o = Math.max((r - s) / 2, 0));
                var c = document.createElement("div");
                if (c.className = "pdf-page", c.style.height = r * l + "px", e.parentNode.insertBefore(c, e), c.appendChild(e), e.style.left = i + "px", e.style.top = o + "px", e.style.width = n + "px", e.slideBackgroundElement && c.insertBefore(e.slideBackgroundElement, e), Br.showNotes) {
                    var d = Pt(e);
                    if (d) {
                        var u = 8, p = "string" == typeof Br.showNotes ? Br.showNotes : "inline", f = document.createElement("div");
                        f.classList.add("speaker-notes"), f.classList.add("speaker-notes-pdf"), f.setAttribute("data-layout", p), f.innerHTML = d, "separate-page" === p ? c.parentNode.insertBefore(f, c.nextSibling) : (f.style.left = u + "px", f.style.bottom = u + "px", f.style.width = t - 2 * u + "px", c.appendChild(f))
                    }
                }
                if (Br.slideNumber) {
                    var v = parseInt(e.getAttribute("data-index-h"), 10) + 1, h = parseInt(e.getAttribute("data-index-v"), 10) + 1, g = document.createElement("div");
                    g.classList.add("slide-number"), g.classList.add("slide-number-pdf"), g.innerHTML = pt(v, ".", h), c.appendChild(g)
                }
            }
        }), g(Vr.wrapper.querySelectorAll(Ir + " .fragment")).forEach(function (e) {
            e.classList.add("visible")
        })
    }

    function s() {
        setInterval(function () {
            (0 !== Vr.wrapper.scrollTop || 0 !== Vr.wrapper.scrollLeft) && (Vr.wrapper.scrollTop = 0, Vr.wrapper.scrollLeft = 0)
        }, 1e3)
    }

    function l(e, t, r, n) {
        for (var a = e.querySelectorAll("." + r), i = 0; i < a.length; i++) {
            var o = a[i];
            if (o.parentNode === e)return o
        }
        var s = document.createElement(t);
        return s.classList.add(r), "string" == typeof n && (s.innerHTML = n), e.appendChild(s), s
    }

    function c() {
        x();
        Vr.background.innerHTML = "", Vr.background.classList.add("no-transition"), g(Vr.wrapper.querySelectorAll(Cr)).forEach(function (e) {
            var t = d(e, Vr.background);
            g(e.querySelectorAll("section")).forEach(function (e) {
                d(e, t), t.classList.add("stack")
            })
        }), Br.parallaxBackgroundImage ? (Vr.background.style.backgroundImage = 'url("' + Br.parallaxBackgroundImage + '")', Vr.background.style.backgroundSize = Br.parallaxBackgroundSize, setTimeout(function () {
            Vr.wrapper.classList.add("has-parallax-background")
        }, 1)) : (Vr.background.style.backgroundImage = "", Vr.wrapper.classList.remove("has-parallax-background"))
    }

    function d(e, t) {
        var r = {
            background: e.getAttribute("data-background"),
            backgroundSize: e.getAttribute("data-background-size"),
            backgroundImage: e.getAttribute("data-background-image"),
            backgroundVideo: e.getAttribute("data-background-video"),
            backgroundIframe: e.getAttribute("data-background-iframe"),
            backgroundColor: e.getAttribute("data-background-color"),
            backgroundRepeat: e.getAttribute("data-background-repeat"),
            backgroundPosition: e.getAttribute("data-background-position"),
            backgroundTransition: e.getAttribute("data-background-transition")
        }, n = document.createElement("div");
        n.className = "slide-background " + e.className.replace(/present|past|future/, ""), r.background && (/^(http|file|\/\/)/gi.test(r.background) || /\.(svg|png|jpg|jpeg|gif|bmp)$/gi.test(r.background) ? e.setAttribute("data-background-image", r.background) : n.style.background = r.background), (r.background || r.backgroundColor || r.backgroundImage || r.backgroundVideo || r.backgroundIframe) && n.setAttribute("data-background-hash", r.background + r.backgroundSize + r.backgroundImage + r.backgroundVideo + r.backgroundIframe + r.backgroundColor + r.backgroundRepeat + r.backgroundPosition + r.backgroundTransition), r.backgroundSize && (n.style.backgroundSize = r.backgroundSize), r.backgroundColor && (n.style.backgroundColor = r.backgroundColor), r.backgroundRepeat && (n.style.backgroundRepeat = r.backgroundRepeat), r.backgroundPosition && (n.style.backgroundPosition = r.backgroundPosition), r.backgroundTransition && n.setAttribute("data-background-transition", r.backgroundTransition), t.appendChild(n), e.classList.remove("has-dark-background"), e.classList.remove("has-light-background"), e.slideBackgroundElement = n;
        var a = window.getComputedStyle(n);
        if (a && a.backgroundColor) {
            var i = L(a.backgroundColor);
            i && 0 !== i.a && e.classList.add(E(a.backgroundColor) < 128 ? "has-dark-background" : "has-light-background")
        }
        return n
    }

    function u() {
        Br.postMessage && window.addEventListener("message", function (e) {
            var t = e.data;
            "string" == typeof t && "{" === t.charAt(0) && "}" === t.charAt(t.length - 1) && (t = JSON.parse(t), t.method && "function" == typeof kr[t.method] && kr[t.method].apply(kr, t.args))
        }, !1)
    }

    function p(e) {
        var t = Vr.wrapper.querySelectorAll(Ir).length;
        Vr.wrapper.classList.remove(Br.transition), "object" == typeof e && h(Br, e), Ur.transforms3d === !1 && (Br.transition = "linear"), Vr.wrapper.classList.add(Br.transition), Vr.wrapper.setAttribute("data-transition-speed", Br.transitionSpeed), Vr.wrapper.setAttribute("data-background-transition", Br.backgroundTransition), Vr.controls.style.display = Br.controls ? "block" : "none", Vr.progress.style.display = Br.progress ? "block" : "none", Vr.slideNumber.style.display = Br.slideNumber && !x() ? "block" : "none", Br.shuffle && ot(), Br.rtl ? Vr.wrapper.classList.add("rtl") : Vr.wrapper.classList.remove("rtl"), Br.center ? Vr.wrapper.classList.add("center") : Vr.wrapper.classList.remove("center"), Br.pause === !1 && J(), Br.showNotes ? (Vr.speakerNotes.classList.add("visible"), Vr.speakerNotes.setAttribute("data-layout", "string" == typeof Br.showNotes ? Br.showNotes : "inline")) : Vr.speakerNotes.classList.remove("visible"), Br.mouseWheel ? (document.addEventListener("DOMMouseScroll", or, !1), document.addEventListener("mousewheel", or, !1)) : (document.removeEventListener("DOMMouseScroll", or, !1), document.removeEventListener("mousewheel", or, !1)), Br.rollingLinks ? T() : I(), Br.previewLinks ? C() : (P(), C("[data-preview-link]")), Mr && (Mr.destroy(), Mr = null), t > 1 && Br.autoSlide && Br.autoSlideStoppable && Ur.canvas && Ur.requestAnimationFrame && (Mr = new wr(Vr.wrapper, function () {
            return Math.min(Math.max((Date.now() - Qr) / Zr, 0), 1)
        }), Mr.on("click", yr), Gr = !1), Br.fragments === !1 && g(Vr.slides.querySelectorAll(".fragment")).forEach(function (e) {
            e.classList.add("visible"), e.classList.remove("current-fragment")
        }), nt()
    }

    function f() {
        if (Kr = !0, window.addEventListener("hashchange", vr, !1), window.addEventListener("resize", hr, !1), Br.touch && (Vr.wrapper.addEventListener("touchstart", er, !1), Vr.wrapper.addEventListener("touchmove", tr, !1), Vr.wrapper.addEventListener("touchend", rr, !1), window.navigator.pointerEnabled ? (Vr.wrapper.addEventListener("pointerdown", nr, !1), Vr.wrapper.addEventListener("pointermove", ar, !1), Vr.wrapper.addEventListener("pointerup", ir, !1)) : window.navigator.msPointerEnabled && (Vr.wrapper.addEventListener("MSPointerDown", nr, !1), Vr.wrapper.addEventListener("MSPointerMove", ar, !1), Vr.wrapper.addEventListener("MSPointerUp", ir, !1))), Br.keyboard && (document.addEventListener("keydown", Gt, !1), document.addEventListener("keypress", Qt, !1)), Br.progress && Vr.progress && Vr.progress.addEventListener("click", sr, !1), Br.focusBodyOnPageVisibilityChange) {
            var e;
            "hidden" in document ? e = "visibilitychange" : "msHidden" in document ? e = "msvisibilitychange" : "webkitHidden" in document && (e = "webkitvisibilitychange"), e && document.addEventListener(e, gr, !1)
        }
        var t = ["touchstart", "click"];
        Dr.match(/android/gi) && (t = ["touchstart"]), t.forEach(function (e) {
            Vr.controlsLeft.forEach(function (t) {
                t.addEventListener(e, lr, !1)
            }), Vr.controlsRight.forEach(function (t) {
                t.addEventListener(e, cr, !1)
            }), Vr.controlsUp.forEach(function (t) {
                t.addEventListener(e, dr, !1)
            }), Vr.controlsDown.forEach(function (t) {
                t.addEventListener(e, ur, !1)
            }), Vr.controlsPrev.forEach(function (t) {
                t.addEventListener(e, pr, !1)
            }), Vr.controlsNext.forEach(function (t) {
                t.addEventListener(e, fr, !1)
            })
        })
    }

    function v() {
        Kr = !1, document.removeEventListener("keydown", Gt, !1), document.removeEventListener("keypress", Qt, !1), window.removeEventListener("hashchange", vr, !1), window.removeEventListener("resize", hr, !1), Vr.wrapper.removeEventListener("touchstart", er, !1), Vr.wrapper.removeEventListener("touchmove", tr, !1), Vr.wrapper.removeEventListener("touchend", rr, !1), window.navigator.pointerEnabled ? (Vr.wrapper.removeEventListener("pointerdown", nr, !1), Vr.wrapper.removeEventListener("pointermove", ar, !1), Vr.wrapper.removeEventListener("pointerup", ir, !1)) : window.navigator.msPointerEnabled && (Vr.wrapper.removeEventListener("MSPointerDown", nr, !1), Vr.wrapper.removeEventListener("MSPointerMove", ar, !1), Vr.wrapper.removeEventListener("MSPointerUp", ir, !1)), Br.progress && Vr.progress && Vr.progress.removeEventListener("click", sr, !1), ["touchstart", "click"].forEach(function (e) {
            Vr.controlsLeft.forEach(function (t) {
                t.removeEventListener(e, lr, !1)
            }), Vr.controlsRight.forEach(function (t) {
                t.removeEventListener(e, cr, !1)
            }), Vr.controlsUp.forEach(function (t) {
                t.removeEventListener(e, dr, !1)
            }), Vr.controlsDown.forEach(function (t) {
                t.removeEventListener(e, ur, !1)
            }), Vr.controlsPrev.forEach(function (t) {
                t.removeEventListener(e, pr, !1)
            }), Vr.controlsNext.forEach(function (t) {
                t.removeEventListener(e, fr, !1)
            })
        })
    }

    function h(e, t) {
        for (var r in t)e[r] = t[r]
    }

    function g(e) {
        return Array.prototype.slice.call(e)
    }

    function m(e) {
        if ("string" == typeof e) {
            if ("null" === e)return null;
            if ("true" === e)return !0;
            if ("false" === e)return !1;
            if (e.match(/^\d+$/))return parseFloat(e)
        }
        return e
    }

    function b(e, t) {
        var r = e.x - t.x, n = e.y - t.y;
        return Math.sqrt(r * r + n * n)
    }

    function y(e, t) {
        e.style.WebkitTransform = t, e.style.MozTransform = t, e.style.msTransform = t, e.style.transform = t
    }

    function w(e) {
        "string" == typeof e.layout && (jr.layout = e.layout), "string" == typeof e.overview && (jr.overview = e.overview), jr.layout ? y(Vr.slides, jr.layout + " " + jr.overview) : y(Vr.slides, jr.overview)
    }

    function k(e) {
        var t = document.createElement("style");
        t.type = "text/css", t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t)
    }

    function A(e, t) {
        for (var r = e.parentNode; r;) {
            var n = r.matches || r.matchesSelector || r.msMatchesSelector;
            if (n && n.call(r, t))return r;
            r = r.parentNode
        }
        return null
    }

    function L(e) {
        var t = e.match(/^#([0-9a-f]{3})$/i);
        if (t && t[1])return t = t[1], {
            r: 17 * parseInt(t.charAt(0), 16),
            g: 17 * parseInt(t.charAt(1), 16),
            b: 17 * parseInt(t.charAt(2), 16)
        };
        var r = e.match(/^#([0-9a-f]{6})$/i);
        if (r && r[1])return r = r[1], {
            r: parseInt(r.substr(0, 2), 16),
            g: parseInt(r.substr(2, 2), 16),
            b: parseInt(r.substr(4, 2), 16)
        };
        var n = e.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (n)return {r: parseInt(n[1], 10), g: parseInt(n[2], 10), b: parseInt(n[3], 10)};
        var a = e.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i);
        return a ? {r: parseInt(a[1], 10), g: parseInt(a[2], 10), b: parseInt(a[3], 10), a: parseFloat(a[4])} : null
    }

    function E(e) {
        return "string" == typeof e && (e = L(e)), e ? (299 * e.r + 587 * e.g + 114 * e.b) / 1e3 : null
    }

    function S(e, t) {
        if (t = t || 0, e) {
            var r, n = e.style.height;
            return e.style.height = "0px", r = t - e.parentNode.offsetHeight, e.style.height = n + "px", r
        }
        return t
    }

    function x() {
        return /print-pdf/gi.test(window.location.search)
    }

    function q() {
        Br.hideAddressBar && qr && (window.addEventListener("load", N, !1), window.addEventListener("orientationchange", N, !1))
    }

    function N() {
        setTimeout(function () {
            window.scrollTo(0, 1)
        }, 10)
    }

    function M(e, t) {
        var r = document.createEvent("HTMLEvents", 1, 2);
        r.initEvent(e, !0, !0), h(r, t), Vr.wrapper.dispatchEvent(r), Br.postMessageEvents && window.parent !== window.self && window.parent.postMessage(JSON.stringify({
            namespace: "reveal",
            eventName: e,
            state: Ht()
        }), "*")
    }

    function T() {
        if (Ur.transforms3d && !("msPerspective" in document.body.style))for (var e = Vr.wrapper.querySelectorAll(Ir + " a"), t = 0, r = e.length; r > t; t++) {
            var n = e[t];
            if (!(!n.textContent || n.querySelector("*") || n.className && n.classList.contains(n, "roll"))) {
                var a = document.createElement("span");
                a.setAttribute("data-title", n.text), a.innerHTML = n.innerHTML, n.classList.add("roll"), n.innerHTML = "", n.appendChild(a)
            }
        }
    }

    function I() {
        for (var e = Vr.wrapper.querySelectorAll(Ir + " a.roll"), t = 0, r = e.length; r > t; t++) {
            var n = e[t], a = n.querySelector("span");
            a && (n.classList.remove("roll"), n.innerHTML = a.innerHTML)
        }
    }

    function C(e) {
        var t = g(document.querySelectorAll(e ? e : "a"));
        t.forEach(function (e) {
            /^(http|www)/gi.test(e.getAttribute("href")) && e.addEventListener("click", br, !1)
        })
    }

    function P() {
        var e = g(document.querySelectorAll("a"));
        e.forEach(function (e) {
            /^(http|www)/gi.test(e.getAttribute("href")) && e.removeEventListener("click", br, !1)
        })
    }

    function H(e) {
        B(), Vr.overlay = document.createElement("div"), Vr.overlay.classList.add("overlay"), Vr.overlay.classList.add("overlay-preview"), Vr.wrapper.appendChild(Vr.overlay), Vr.overlay.innerHTML = ["<header>", '<a class="close" href="#"><span class="icon"></span></a>', '<a class="external" href="' + e + '" target="_blank"><span class="icon"></span></a>', "</header>", '<div class="spinner"></div>', '<div class="viewport">', '<iframe src="' + e + '"></iframe>', "</div>"].join(""), Vr.overlay.querySelector("iframe").addEventListener("load", function () {
            Vr.overlay.classList.add("loaded")
        }, !1), Vr.overlay.querySelector(".close").addEventListener("click", function (e) {
            B(), e.preventDefault()
        }, !1), Vr.overlay.querySelector(".external").addEventListener("click", function () {
            B()
        }, !1), setTimeout(function () {
            Vr.overlay.classList.add("visible")
        }, 1)
    }

    function D() {
        if (Br.help) {
            B(), Vr.overlay = document.createElement("div"), Vr.overlay.classList.add("overlay"), Vr.overlay.classList.add("overlay-help"), Vr.wrapper.appendChild(Vr.overlay);
            var e = '<p class="title">Keyboard Shortcuts</p><br/>';
            e += "<table><th>KEY</th><th>ACTION</th>";
            for (var t in tn)e += "<tr><td>" + t + "</td><td>" + tn[t] + "</td></tr>";
            e += "</table>", Vr.overlay.innerHTML = ["<header>", '<a class="close" href="#"><span class="icon"></span></a>', "</header>", '<div class="viewport">', '<div class="viewport-inner">' + e + "</div>", "</div>"].join(""), Vr.overlay.querySelector(".close").addEventListener("click", function (e) {
                B(), e.preventDefault()
            }, !1), setTimeout(function () {
                Vr.overlay.classList.add("visible")
            }, 1)
        }
    }

    function B() {
        Vr.overlay && (Vr.overlay.parentNode.removeChild(Vr.overlay), Vr.overlay = null)
    }

    function z() {
        if (Vr.wrapper && !x()) {
            var e = W();
            R(Br.width, Br.height), Vr.slides.style.width = e.width + "px", Vr.slides.style.height = e.height + "px", Xr = Math.min(e.presentationWidth / e.width, e.presentationHeight / e.height), Xr = Math.max(Xr, Br.minScale), Xr = Math.min(Xr, Br.maxScale), 1 === Xr ? (Vr.slides.style.zoom = "", Vr.slides.style.left = "", Vr.slides.style.top = "", Vr.slides.style.bottom = "", Vr.slides.style.right = "", w({layout: ""})) : Xr > 1 && Ur.zoom ? (Vr.slides.style.zoom = Xr, Vr.slides.style.left = "", Vr.slides.style.top = "", Vr.slides.style.bottom = "", Vr.slides.style.right = "", w({layout: ""})) : (Vr.slides.style.zoom = "", Vr.slides.style.left = "50%", Vr.slides.style.top = "50%", Vr.slides.style.bottom = "auto", Vr.slides.style.right = "auto", w({layout: "translate(-50%, -50%) scale(" + Xr + ")"}));
            for (var t = g(Vr.wrapper.querySelectorAll(Ir)), r = 0, n = t.length; n > r; r++) {
                var a = t[r];
                "none" !== a.style.display && (a.style.top = Br.center || a.classList.contains("center") ? a.classList.contains("stack") ? 0 : Math.max((e.height - a.scrollHeight) / 2, 0) + "px" : "")
            }
            dt(), ht()
        }
    }

    function R(e, t) {
        g(Vr.slides.querySelectorAll("section > .stretch")).forEach(function (r) {
            var n = S(r, t);
            if (/(img|video)/gi.test(r.nodeName)) {
                var a = r.naturalWidth || r.videoWidth, i = r.naturalHeight || r.videoHeight, o = Math.min(e / a, n / i);
                r.style.width = a * o + "px", r.style.height = i * o + "px"
            } else r.style.width = e + "px", r.style.height = n + "px"
        })
    }

    function W(e, t) {
        var r = {
            width: Br.width,
            height: Br.height,
            presentationWidth: e || Vr.wrapper.offsetWidth,
            presentationHeight: t || Vr.wrapper.offsetHeight
        };
        return r.presentationWidth -= r.presentationWidth * Br.margin, r.presentationHeight -= r.presentationHeight * Br.margin, "string" == typeof r.width && /%$/.test(r.width) && (r.width = parseInt(r.width, 10) / 100 * r.presentationWidth), "string" == typeof r.height && /%$/.test(r.height) && (r.height = parseInt(r.height, 10) / 100 * r.presentationHeight), r
    }

    function O(e, t) {
        "object" == typeof e && "function" == typeof e.setAttribute && e.setAttribute("data-previous-indexv", t || 0)
    }

    function F(e) {
        if ("object" == typeof e && "function" == typeof e.setAttribute && e.classList.contains("stack")) {
            var t = e.hasAttribute("data-start-indexv") ? "data-start-indexv" : "data-previous-indexv";
            return parseInt(e.getAttribute(t) || 0, 10)
        }
        return 0
    }

    function Y() {
        if (Br.overview && !$()) {
            Wr = !0, Vr.wrapper.classList.add("overview"), Vr.wrapper.classList.remove("overview-deactivating"), Ur.overviewTransitions && setTimeout(function () {
                Vr.wrapper.classList.add("overview-animated")
            }, 1), Ft(), Vr.slides.appendChild(Vr.background), g(Vr.wrapper.querySelectorAll(Ir)).forEach(function (e) {
                e.classList.contains("stack") || e.addEventListener("click", mr, !0)
            });
            var e = 70, t = W();
            Or = t.width + e, Fr = t.height + e, Br.rtl && (Or = -Or), lt(), X(), j(), z(), M("overviewshown", {
                indexh: Ar,
                indexv: Lr,
                currentSlide: Sr
            })
        }
    }

    function X() {
        g(Vr.wrapper.querySelectorAll(Cr)).forEach(function (e, t) {
            e.setAttribute("data-index-h", t), y(e, "translate3d(" + t * Or + "px, 0, 0)"), e.classList.contains("stack") && g(e.querySelectorAll("section")).forEach(function (e, r) {
                e.setAttribute("data-index-h", t), e.setAttribute("data-index-v", r), y(e, "translate3d(0, " + r * Fr + "px, 0)")
            })
        }), g(Vr.background.childNodes).forEach(function (e, t) {
            y(e, "translate3d(" + t * Or + "px, 0, 0)"), g(e.querySelectorAll(".slide-background")).forEach(function (e, t) {
                y(e, "translate3d(0, " + t * Fr + "px, 0)")
            })
        })
    }

    function j() {
        w({overview: ["translateX(" + -Ar * Or + "px)", "translateY(" + -Lr * Fr + "px)", "translateZ(" + (window.innerWidth < 400 ? -1e3 : -2500) + "px)"].join(" ")})
    }

    function V() {
        Br.overview && (Wr = !1, Vr.wrapper.classList.remove("overview"), Vr.wrapper.classList.remove("overview-animated"), Vr.wrapper.classList.add("overview-deactivating"), setTimeout(function () {
            Vr.wrapper.classList.remove("overview-deactivating")
        }, 1), Vr.wrapper.appendChild(Vr.background), g(Vr.wrapper.querySelectorAll(Ir)).forEach(function (e) {
            y(e, ""), e.removeEventListener("click", mr, !0)
        }), g(Vr.background.querySelectorAll(".slide-background")).forEach(function (e) {
            y(e, "")
        }), w({overview: ""}), rt(Ar, Lr), z(), Ot(), M("overviewhidden", {
            indexh: Ar,
            indexv: Lr,
            currentSlide: Sr
        }))
    }

    function U(e) {
        "boolean" == typeof e ? e ? Y() : V() : $() ? V() : Y()
    }

    function $() {
        return Wr
    }

    function _(e) {
        return e = e ? e : Sr, e && e.parentNode && !!e.parentNode.nodeName.match(/section/i)
    }

    function K() {
        var e = document.documentElement, t = e.requestFullscreen || e.webkitRequestFullscreen || e.webkitRequestFullScreen || e.mozRequestFullScreen || e.msRequestFullscreen;
        t && t.apply(e)
    }

    function Z() {
        if (Br.pause) {
            var e = Vr.wrapper.classList.contains("paused");
            Ft(), Vr.wrapper.classList.add("paused"), e === !1 && M("paused")
        }
    }

    function J() {
        var e = Vr.wrapper.classList.contains("paused");
        Vr.wrapper.classList.remove("paused"), Ot(), e && M("resumed")
    }

    function Q(e) {
        "boolean" == typeof e ? e ? Z() : J() : G() ? J() : Z()
    }

    function G() {
        return Vr.wrapper.classList.contains("paused")
    }

    function et(e) {
        "boolean" == typeof e ? e ? Xt() : Yt() : Gr ? Xt() : Yt()
    }

    function tt() {
        return !(!Zr || Gr)
    }

    function rt(e, t, r, n) {
        Er = Sr;
        var a = Vr.wrapper.querySelectorAll(Cr);
        void 0 !== t || $() || (t = F(a[e])), Er && Er.parentNode && Er.parentNode.classList.contains("stack") && O(Er.parentNode, Lr);
        var i = Yr.concat();
        Yr.length = 0;
        var o = Ar || 0, s = Lr || 0;
        Ar = st(Cr, void 0 === e ? Ar : e), Lr = st(Pr, void 0 === t ? Lr : t), lt(), z();
        e:for (var l = 0, c = Yr.length; c > l; l++) {
            for (var d = 0; d < i.length; d++)if (i[d] === Yr[l]) {
                i.splice(d, 1);
                continue e
            }
            document.documentElement.classList.add(Yr[l]), M(Yr[l])
        }
        for (; i.length;)document.documentElement.classList.remove(i.pop());
        $() && j();
        var u = a[Ar], p = u.querySelectorAll("section");
        Sr = p[Lr] || u, "undefined" != typeof r && zt(r);
        var f = Ar !== o || Lr !== s;
        f ? M("slidechanged", {
            indexh: Ar,
            indexv: Lr,
            previousSlide: Er,
            currentSlide: Sr,
            origin: n
        }) : Er = null, Er && (Er.classList.remove("present"), Er.setAttribute("aria-hidden", "true"), Vr.wrapper.querySelector(Hr).classList.contains("present") && setTimeout(function () {
            var e, t = g(Vr.wrapper.querySelectorAll(Cr + ".stack"));
            for (e in t)t[e] && O(t[e], 0)
        }, 0)), (f || !Er) && (Lt(Er), kt(Sr)), Vr.statusDiv.textContent = Sr.textContent, ft(), dt(), vt(), ht(), ut(), ct(), Nt(), Ot()
    }

    function nt() {
        v(), f(), z(), Zr = Br.autoSlide, Ot(), c(), Nt(), it(), ft(), dt(), vt(!0), ut(), lt(), ct(), wt(), kt(Sr), $() && X()
    }

    function at() {
        var e = g(Vr.wrapper.querySelectorAll(Cr));
        e.forEach(function (e) {
            var t = g(e.querySelectorAll("section"));
            t.forEach(function (e, t) {
                t > 0 && (e.classList.remove("present"), e.classList.remove("past"), e.classList.add("future"), e.setAttribute("aria-hidden", "true"))
            })
        })
    }

    function it() {
        var e = g(Vr.wrapper.querySelectorAll(Cr));
        e.forEach(function (e) {
            var t = g(e.querySelectorAll("section"));
            t.forEach(function (e) {
                Bt(e.querySelectorAll(".fragment"))
            }), 0 === t.length && Bt(e.querySelectorAll(".fragment"))
        })
    }

    function ot() {
        var e = g(Vr.wrapper.querySelectorAll(Cr));
        e.forEach(function (t) {
            Vr.slides.insertBefore(t, e[Math.floor(Math.random() * e.length)])
        })
    }

    function st(e, t) {
        var r = g(Vr.wrapper.querySelectorAll(e)), n = r.length, a = x();
        if (n) {
            Br.loop && (t %= n, 0 > t && (t = n + t)), t = Math.max(Math.min(t, n - 1), 0);
            for (var i = 0; n > i; i++) {
                var o = r[i], s = Br.rtl && !_(o);
                if (o.classList.remove("past"), o.classList.remove("present"), o.classList.remove("future"), o.setAttribute("hidden", ""), o.setAttribute("aria-hidden", "true"), o.querySelector("section") && o.classList.add("stack"), a)o.classList.add("present"); else if (t > i) {
                    if (o.classList.add(s ? "future" : "past"), Br.fragments)for (var l = g(o.querySelectorAll(".fragment")); l.length;) {
                        var c = l.pop();
                        c.classList.add("visible"), c.classList.remove("current-fragment")
                    }
                } else if (i > t && (o.classList.add(s ? "past" : "future"), Br.fragments))for (var d = g(o.querySelectorAll(".fragment.visible")); d.length;) {
                    var u = d.pop();
                    u.classList.remove("visible"), u.classList.remove("current-fragment")
                }
            }
            r[t].classList.add("present"), r[t].removeAttribute("hidden"), r[t].removeAttribute("aria-hidden");
            var p = r[t].getAttribute("data-state");
            p && (Yr = Yr.concat(p.split(" ")))
        } else t = 0;
        return t
    }

    function lt() {
        var e, t, r = g(Vr.wrapper.querySelectorAll(Cr)), n = r.length;
        if (n && "undefined" != typeof Ar) {
            var a = $() ? 10 : Br.viewDistance;
            qr && (a = $() ? 6 : 2), x() && (a = Number.MAX_VALUE);
            for (var i = 0; n > i; i++) {
                var o = r[i], s = g(o.querySelectorAll("section")), l = s.length;
                if (e = Math.abs((Ar || 0) - i) || 0, Br.loop && (e = Math.abs(((Ar || 0) - i) % (n - a)) || 0), a > e ? gt(o) : mt(o), l)for (var c = F(o), d = 0; l > d; d++) {
                    var u = s[d];
                    t = Math.abs(i === (Ar || 0) ? (Lr || 0) - d : d - c), a > e + t ? gt(u) : mt(u)
                }
            }
        }
    }

    function ct() {
        Br.showNotes && Vr.speakerNotes && Sr && !x() && (Vr.speakerNotes.innerHTML = Pt() || "")
    }

    function dt() {
        Br.progress && Vr.progressbar && (Vr.progressbar.style.width = St() * Vr.wrapper.offsetWidth + "px")
    }

    function ut() {
        if (Br.slideNumber && Vr.slideNumber) {
            var e = [], t = "h.v";
            switch ("string" == typeof Br.slideNumber && (t = Br.slideNumber), t) {
                case"c":
                    e.push(Et() + 1);
                    break;
                case"c/t":
                    e.push(Et() + 1, "/", Tt());
                    break;
                case"h/v":
                    e.push(Ar + 1), _() && e.push("/", Lr + 1);
                    break;
                default:
                    e.push(Ar + 1), _() && e.push(".", Lr + 1)
            }
            Vr.slideNumber.innerHTML = pt(e[0], e[1], e[2])
        }
    }

    function pt(e, t, r) {
        return "number" != typeof r || isNaN(r) ? '<span class="slide-number-a">' + e + "</span>" : '<span class="slide-number-a">' + e + '</span><span class="slide-number-delimiter">' + t + '</span><span class="slide-number-b">' + r + "</span>"
    }

    function ft() {
        var e = bt(), t = yt();
        Vr.controlsLeft.concat(Vr.controlsRight).concat(Vr.controlsUp).concat(Vr.controlsDown).concat(Vr.controlsPrev).concat(Vr.controlsNext).forEach(function (e) {
            e.classList.remove("enabled"), e.classList.remove("fragmented"), e.setAttribute("disabled", "disabled")
        }), e.left && Vr.controlsLeft.forEach(function (e) {
            e.classList.add("enabled"), e.removeAttribute("disabled")
        }), e.right && Vr.controlsRight.forEach(function (e) {
            e.classList.add("enabled"), e.removeAttribute("disabled")
        }), e.up && Vr.controlsUp.forEach(function (e) {
            e.classList.add("enabled"), e.removeAttribute("disabled")
        }), e.down && Vr.controlsDown.forEach(function (e) {
            e.classList.add("enabled"), e.removeAttribute("disabled")
        }), (e.left || e.up) && Vr.controlsPrev.forEach(function (e) {
            e.classList.add("enabled"), e.removeAttribute("disabled")
        }), (e.right || e.down) && Vr.controlsNext.forEach(function (e) {
            e.classList.add("enabled"), e.removeAttribute("disabled")
        }), Sr && (t.prev && Vr.controlsPrev.forEach(function (e) {
            e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled")
        }), t.next && Vr.controlsNext.forEach(function (e) {
            e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled")
        }), _(Sr) ? (t.prev && Vr.controlsUp.forEach(function (e) {
            e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled")
        }), t.next && Vr.controlsDown.forEach(function (e) {
            e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled")
        })) : (t.prev && Vr.controlsLeft.forEach(function (e) {
            e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled")
        }), t.next && Vr.controlsRight.forEach(function (e) {
            e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled")
        })))
    }

    function vt(e) {
        var t = null, r = Br.rtl ? "future" : "past", n = Br.rtl ? "past" : "future";
        if (g(Vr.background.childNodes).forEach(function (a, i) {
                a.classList.remove("past"), a.classList.remove("present"), a.classList.remove("future"), Ar > i ? a.classList.add(r) : i > Ar ? a.classList.add(n) : (a.classList.add("present"), t = a), (e || i === Ar) && g(a.querySelectorAll(".slide-background")).forEach(function (e, r) {
                    e.classList.remove("past"), e.classList.remove("present"), e.classList.remove("future"), Lr > r ? e.classList.add("past") : r > Lr ? e.classList.add("future") : (e.classList.add("present"), i === Ar && (t = e))
                })
            }), xr) {
            var a = xr.querySelector("video");
            a && a.pause()
        }
        if (t) {
            var i = t.querySelector("video");
            if (i) {
                var o = function () {
                    i.currentTime = 0, i.play(), i.removeEventListener("loadeddata", o)
                };
                i.readyState > 1 ? o() : i.addEventListener("loadeddata", o)
            }
            var s = t.style.backgroundImage || "";
            /\.gif/i.test(s) && (t.style.backgroundImage = "", window.getComputedStyle(t).opacity, t.style.backgroundImage = s);
            var l = xr ? xr.getAttribute("data-background-hash") : null, c = t.getAttribute("data-background-hash");
            c && c === l && t !== xr && Vr.background.classList.add("no-transition"), xr = t
        }
        Sr && ["has-light-background", "has-dark-background"].forEach(function (e) {
            Sr.classList.contains(e) ? Vr.wrapper.classList.add(e) : Vr.wrapper.classList.remove(e)
        }), setTimeout(function () {
            Vr.background.classList.remove("no-transition")
        }, 1)
    }

    function ht() {
        if (Br.parallaxBackgroundImage) {
            var e, t, r = Vr.wrapper.querySelectorAll(Cr), n = Vr.wrapper.querySelectorAll(Pr), a = Vr.background.style.backgroundSize.split(" ");
            1 === a.length ? e = t = parseInt(a[0], 10) : (e = parseInt(a[0], 10), t = parseInt(a[1], 10));
            var i, o, s = Vr.background.offsetWidth, l = r.length;
            i = "number" == typeof Br.parallaxBackgroundHorizontal ? Br.parallaxBackgroundHorizontal : l > 1 ? (e - s) / (l - 1) : 0, o = i * Ar * -1;
            var c, d, u = Vr.background.offsetHeight, p = n.length;
            c = "number" == typeof Br.parallaxBackgroundVertical ? Br.parallaxBackgroundVertical : (t - u) / (p - 1), d = p > 0 ? c * Lr * 1 : 0, Vr.background.style.backgroundPosition = o + "px " + -d + "px"
        }
    }

    function gt(e) {
        e.style.display = "block", g(e.querySelectorAll("img[data-src], video[data-src], audio[data-src]")).forEach(function (e) {
            e.setAttribute("src", e.getAttribute("data-src")), e.removeAttribute("data-src")
        }), g(e.querySelectorAll("video, audio")).forEach(function (e) {
            var t = 0;
            g(e.querySelectorAll("source[data-src]")).forEach(function (e) {
                e.setAttribute("src", e.getAttribute("data-src")), e.removeAttribute("data-src"), t += 1
            }), t > 0 && e.load()
        });
        var t = Mt(e), r = Ct(t.h, t.v);
        if (r && (r.style.display = "block", r.hasAttribute("data-loaded") === !1)) {
            r.setAttribute("data-loaded", "true");
            var n = e.getAttribute("data-background-image"), a = e.getAttribute("data-background-video"), i = e.hasAttribute("data-background-video-loop"), o = e.hasAttribute("data-background-video-muted"), s = e.getAttribute("data-background-iframe");
            if (n)r.style.backgroundImage = "url(" + n + ")"; else if (a && !xt()) {
                var l = document.createElement("video");
                i && l.setAttribute("loop", ""), o && (l.muted = !0), a.split(",").forEach(function (e) {
                    l.innerHTML += '<source src="' + e + '">'
                }), r.appendChild(l)
            } else if (s) {
                var c = document.createElement("iframe");
                c.setAttribute("src", s), c.style.width = "100%", c.style.height = "100%", c.style.maxHeight = "100%", c.style.maxWidth = "100%", r.appendChild(c)
            }
        }
    }

    function mt(e) {
        e.style.display = "none";
        var t = Mt(e), r = Ct(t.h, t.v);
        r && (r.style.display = "none")
    }

    function bt() {
        var e = Vr.wrapper.querySelectorAll(Cr), t = Vr.wrapper.querySelectorAll(Pr), r = {
            left: Ar > 0 || Br.loop,
            right: Ar < e.length - 1 || Br.loop,
            up: Lr > 0,
            down: Lr < t.length - 1
        };
        if (Br.rtl) {
            var n = r.left;
            r.left = r.right, r.right = n
        }
        return r
    }

    function yt() {
        if (Sr && Br.fragments) {
            var e = Sr.querySelectorAll(".fragment"), t = Sr.querySelectorAll(".fragment:not(.visible)");
            return {prev: e.length - t.length > 0, next: !!t.length}
        }
        return {prev: !1, next: !1}
    }

    function wt() {
        var e = function (e, t, r) {
            g(Vr.slides.querySelectorAll("iframe[" + e + '*="' + t + '"]')).forEach(function (t) {
                var n = t.getAttribute(e);
                n && -1 === n.indexOf(r) && t.setAttribute(e, n + (/\?/.test(n) ? "&" : "?") + r)
            })
        };
        e("src", "youtube.com/embed/", "enablejsapi=1"), e("data-src", "youtube.com/embed/", "enablejsapi=1"), e("src", "player.vimeo.com/", "api=1"), e("data-src", "player.vimeo.com/", "api=1")
    }

    function kt(e) {
        e && !xt() && (g(e.querySelectorAll('img[src$=".gif"]')).forEach(function (e) {
            e.setAttribute("src", e.getAttribute("src"))
        }), g(e.querySelectorAll("video, audio")).forEach(function (e) {
            (!A(e, ".fragment") || A(e, ".fragment.visible")) && e.hasAttribute("data-autoplay") && "function" == typeof e.play && e.play()
        }), g(e.querySelectorAll("iframe[src]")).forEach(function (e) {
            (!A(e, ".fragment") || A(e, ".fragment.visible")) && At({target: e})
        }), g(e.querySelectorAll("iframe[data-src]")).forEach(function (e) {
            (!A(e, ".fragment") || A(e, ".fragment.visible")) && e.getAttribute("src") !== e.getAttribute("data-src") && (e.removeEventListener("load", At), e.addEventListener("load", At), e.setAttribute("src", e.getAttribute("data-src")))
        }))
    }

    function At(e) {
        var t = e.target;
        t && t.contentWindow && (/youtube\.com\/embed\//.test(t.getAttribute("src")) && t.hasAttribute("data-autoplay") ? t.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*") : /player\.vimeo\.com\//.test(t.getAttribute("src")) && t.hasAttribute("data-autoplay") ? t.contentWindow.postMessage('{"method":"play"}', "*") : t.contentWindow.postMessage("slide:start", "*"))
    }

    function Lt(e) {
        e && e.parentNode && (g(e.querySelectorAll("video, audio")).forEach(function (e) {
            e.hasAttribute("data-ignore") || "function" != typeof e.pause || e.pause()
        }), g(e.querySelectorAll("iframe")).forEach(function (e) {
            e.contentWindow.postMessage("slide:stop", "*"), e.removeEventListener("load", At)
        }), g(e.querySelectorAll('iframe[src*="youtube.com/embed/"]')).forEach(function (e) {
            e.hasAttribute("data-ignore") || "function" != typeof e.contentWindow.postMessage || e.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
        }), g(e.querySelectorAll('iframe[src*="player.vimeo.com/"]')).forEach(function (e) {
            e.hasAttribute("data-ignore") || "function" != typeof e.contentWindow.postMessage || e.contentWindow.postMessage('{"method":"pause"}', "*")
        }), g(e.querySelectorAll("iframe[data-src]")).forEach(function (e) {
            e.setAttribute("src", "about:blank"), e.removeAttribute("src")
        }))
    }

    function Et() {
        var e = g(Vr.wrapper.querySelectorAll(Cr)), t = 0;
        e:for (var r = 0; r < e.length; r++) {
            for (var n = e[r], a = g(n.querySelectorAll("section")), i = 0; i < a.length; i++) {
                if (a[i].classList.contains("present"))break e;
                t++
            }
            if (n.classList.contains("present"))break;
            n.classList.contains("stack") === !1 && t++
        }
        return t
    }

    function St() {
        var e = Tt(), t = Et();
        if (Sr) {
            var r = Sr.querySelectorAll(".fragment");
            if (r.length > 0) {
                var n = Sr.querySelectorAll(".fragment.visible"), a = .9;
                t += n.length / r.length * a
            }
        }
        return t / (e - 1)
    }

    function xt() {
        return !!window.location.search.match(/receiver/gi)
    }

    function qt() {
        var e = window.location.hash, t = e.slice(2).split("/"), r = e.replace(/#|\//gi, "");
        if (isNaN(parseInt(t[0], 10)) && r.length) {
            var n;
            if (/^[a-zA-Z][\w:.-]*$/.test(r) && (n = document.getElementById(r)), n) {
                var a = kr.getIndices(n);
                rt(a.h, a.v)
            } else rt(Ar || 0, Lr || 0)
        } else {
            var i = parseInt(t[0], 10) || 0, o = parseInt(t[1], 10) || 0;
            (i !== Ar || o !== Lr) && rt(i, o)
        }
    }

    function Nt(e) {
        if (Br.history)if (clearTimeout(_r), "number" == typeof e)_r = setTimeout(Nt, e); else if (Sr) {
            var t = "/", r = Sr.getAttribute("id");
            r && (r = r.replace(/[^a-zA-Z0-9\-\_\:\.]/g, "")), "string" == typeof r && r.length ? t = "/" + r : ((Ar > 0 || Lr > 0) && (t += Ar), Lr > 0 && (t += "/" + Lr)), window.location.hash = t
        }
    }

    function Mt(e) {
        var t, r = Ar, n = Lr;
        if (e) {
            var a = _(e), i = a ? e.parentNode : e, o = g(Vr.wrapper.querySelectorAll(Cr));
            r = Math.max(o.indexOf(i), 0), n = void 0, a && (n = Math.max(g(e.parentNode.querySelectorAll("section")).indexOf(e), 0))
        }
        if (!e && Sr) {
            var s = Sr.querySelectorAll(".fragment").length > 0;
            if (s) {
                var l = Sr.querySelector(".current-fragment");
                t = l && l.hasAttribute("data-fragment-index") ? parseInt(l.getAttribute("data-fragment-index"), 10) : Sr.querySelectorAll(".fragment.visible").length - 1
            }
        }
        return {h: r, v: n, f: t}
    }

    function Tt() {
        return Vr.wrapper.querySelectorAll(Ir + ":not(.stack)").length
    }

    function It(e, t) {
        var r = Vr.wrapper.querySelectorAll(Cr)[e], n = r && r.querySelectorAll("section");
        return n && n.length && "number" == typeof t ? n ? n[t] : void 0 : r
    }

    function Ct(e, t) {
        if (x()) {
            var r = It(e, t);
            return r ? r.slideBackgroundElement : void 0
        }
        var n = Vr.wrapper.querySelectorAll(".backgrounds>.slide-background")[e], a = n && n.querySelectorAll(".slide-background");
        return a && a.length && "number" == typeof t ? a ? a[t] : void 0 : n
    }

    function Pt(e) {
        if (e = e || Sr, e.hasAttribute("data-notes"))return e.getAttribute("data-notes");
        var t = e.querySelector("aside.notes");
        return t ? t.innerHTML : null
    }

    function Ht() {
        var e = Mt();
        return {indexh: e.h, indexv: e.v, indexf: e.f, paused: G(), overview: $()}
    }

    function Dt(e) {
        if ("object" == typeof e) {
            rt(m(e.indexh), m(e.indexv), m(e.indexf));
            var t = m(e.paused), r = m(e.overview);
            "boolean" == typeof t && t !== G() && Q(t), "boolean" == typeof r && r !== $() && U(r)
        }
    }

    function Bt(e) {
        e = g(e);
        var t = [], r = [], n = [];
        e.forEach(function (e) {
            if (e.hasAttribute("data-fragment-index")) {
                var n = parseInt(e.getAttribute("data-fragment-index"), 10);
                t[n] || (t[n] = []), t[n].push(e)
            } else r.push([e])
        }), t = t.concat(r);
        var a = 0;
        return t.forEach(function (e) {
            e.forEach(function (e) {
                n.push(e), e.setAttribute("data-fragment-index", a)
            }), a++
        }), n
    }

    function zt(e, t) {
        if (Sr && Br.fragments) {
            var r = Bt(Sr.querySelectorAll(".fragment"));
            if (r.length) {
                if ("number" != typeof e) {
                    var n = Bt(Sr.querySelectorAll(".fragment.visible")).pop();
                    e = n ? parseInt(n.getAttribute("data-fragment-index") || 0, 10) : -1
                }
                "number" == typeof t && (e += t);
                var a = [], i = [];
                return g(r).forEach(function (t, r) {
                    t.hasAttribute("data-fragment-index") && (r = parseInt(t.getAttribute("data-fragment-index"), 10)), e >= r ? (t.classList.contains("visible") || a.push(t), t.classList.add("visible"), t.classList.remove("current-fragment"), Vr.statusDiv.textContent = t.textContent, r === e && (t.classList.add("current-fragment"), kt(t))) : (t.classList.contains("visible") && i.push(t), t.classList.remove("visible"), t.classList.remove("current-fragment"))
                }), i.length && M("fragmenthidden", {
                    fragment: i[0],
                    fragments: i
                }), a.length && M("fragmentshown", {
                    fragment: a[0],
                    fragments: a
                }), ft(), dt(), !(!a.length && !i.length)
            }
        }
        return !1
    }

    function Rt() {
        return zt(null, 1)
    }

    function Wt() {
        return zt(null, -1)
    }

    function Ot() {
        if (Ft(), Sr) {
            var e = Sr.querySelector(".current-fragment");
            e || (e = Sr.querySelector(".fragment"));
            var t = e ? e.getAttribute("data-autoslide") : null, r = Sr.parentNode ? Sr.parentNode.getAttribute("data-autoslide") : null, n = Sr.getAttribute("data-autoslide");
            Zr = t ? parseInt(t, 10) : n ? parseInt(n, 10) : r ? parseInt(r, 10) : Br.autoSlide, 0 === Sr.querySelectorAll(".fragment").length && g(Sr.querySelectorAll("video, audio")).forEach(function (e) {
                e.hasAttribute("data-autoplay") && Zr && 1e3 * e.duration > Zr && (Zr = 1e3 * e.duration + 1e3)
            }), !Zr || Gr || G() || $() || kr.isLastSlide() && !yt().next && Br.loop !== !0 || (Jr = setTimeout(function () {
                "function" == typeof Br.autoSlideMethod ? Br.autoSlideMethod() : Kt(), Ot()
            }, Zr), Qr = Date.now()), Mr && Mr.setPlaying(-1 !== Jr)
        }
    }

    function Ft() {
        clearTimeout(Jr), Jr = -1
    }

    function Yt() {
        Zr && !Gr && (Gr = !0, M("autoslidepaused"), clearTimeout(Jr), Mr && Mr.setPlaying(!1))
    }

    function Xt() {
        Zr && Gr && (Gr = !1, M("autoslideresumed"), Ot())
    }

    function jt() {
        Br.rtl ? ($() || Rt() === !1) && bt().left && rt(Ar + 1) : ($() || Wt() === !1) && bt().left && rt(Ar - 1)
    }

    function Vt() {
        Br.rtl ? ($() || Wt() === !1) && bt().right && rt(Ar - 1) : ($() || Rt() === !1) && bt().right && rt(Ar + 1)
    }

    function Ut() {
        ($() || Wt() === !1) && bt().up && rt(Ar, Lr - 1)
    }

    function $t() {
        ($() || Rt() === !1) && bt().down && rt(Ar, Lr + 1)
    }

    function _t() {
        if (Wt() === !1)if (bt().up)Ut(); else {
            var e;
            if (e = Br.rtl ? g(Vr.wrapper.querySelectorAll(Cr + ".future")).pop() : g(Vr.wrapper.querySelectorAll(Cr + ".past")).pop()) {
                var t = e.querySelectorAll("section").length - 1 || void 0, r = Ar - 1;
                rt(r, t)
            }
        }
    }

    function Kt() {
        Rt() === !1 && (bt().down ? $t() : Br.rtl ? jt() : Vt())
    }

    function Zt(e) {
        for (; e && "function" == typeof e.hasAttribute;) {
            if (e.hasAttribute("data-prevent-swipe"))return !0;
            e = e.parentNode
        }
        return !1
    }

    function Jt() {
        Br.autoSlideStoppable && Yt()
    }

    function Qt(e) {
        e.shiftKey && 63 === e.charCode && (Vr.overlay ? B() : D(!0))
    }

    function Gt(e) {
        if ("function" == typeof Br.keyboardCondition && Br.keyboardCondition() === !1)return !0;
        var t = Gr;
        Jt(e);
        var r = document.activeElement && "inherit" !== document.activeElement.contentEditable, n = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName), a = document.activeElement && document.activeElement.className && /speaker-notes/i.test(document.activeElement.className);
        if (!(r || n || a || e.shiftKey && 32 !== e.keyCode || e.altKey || e.ctrlKey || e.metaKey)) {
            var i, o = [66, 190, 191];
            if ("object" == typeof Br.keyboard)for (i in Br.keyboard)"togglePause" === Br.keyboard[i] && o.push(parseInt(i, 10));
            if (G() && -1 === o.indexOf(e.keyCode))return !1;
            var s = !1;
            if ("object" == typeof Br.keyboard)for (i in Br.keyboard)if (parseInt(i, 10) === e.keyCode) {
                var l = Br.keyboard[i];
                "function" == typeof l ? l.apply(null, [e]) : "string" == typeof l && "function" == typeof kr[l] && kr[l].call(), s = !0
            }
            if (s === !1)switch (s = !0, e.keyCode) {
                case 80:
                case 33:
                    _t();
                    break;
                case 78:
                case 34:
                    Kt();
                    break;
                case 72:
                case 37:
                    jt();
                    break;
                case 76:
                case 39:
                    Vt();
                    break;
                case 75:
                case 38:
                    Ut();
                    break;
                case 74:
                case 40:
                    $t();
                    break;
                case 36:
                    rt(0);
                    break;
                case 35:
                    rt(Number.MAX_VALUE);
                    break;
                case 32:
                    $() ? V() : e.shiftKey ? _t() : Kt();
                    break;
                case 13:
                    $() ? V() : s = !1;
                    break;
                case 58:
                case 59:
                case 66:
                case 190:
                case 191:
                    Q();
                    break;
                case 70:
                    K();
                    break;
                case 65:
                    Br.autoSlideStoppable && et(t);
                    break;
                default:
                    s = !1
            }
            s ? e.preventDefault && e.preventDefault() : 27 !== e.keyCode && 79 !== e.keyCode || !Ur.transforms3d || (Vr.overlay ? B() : U(), e.preventDefault && e.preventDefault()), Ot()
        }
    }

    function er(e) {
        return Zt(e.target) ? !0 : (en.startX = e.touches[0].clientX, en.startY = e.touches[0].clientY, en.startCount = e.touches.length, void(2 === e.touches.length && Br.overview && (en.startSpan = b({
            x: e.touches[1].clientX,
            y: e.touches[1].clientY
        }, {x: en.startX, y: en.startY}))))
    }

    function tr(e) {
        if (Zt(e.target))return !0;
        if (en.captured)Dr.match(/android/gi) && e.preventDefault(); else {
            Jt(e);
            var t = e.touches[0].clientX, r = e.touches[0].clientY;
            if (2 === e.touches.length && 2 === en.startCount && Br.overview) {
                var n = b({x: e.touches[1].clientX, y: e.touches[1].clientY}, {x: en.startX, y: en.startY});
                Math.abs(en.startSpan - n) > en.threshold && (en.captured = !0, n < en.startSpan ? Y() : V()), e.preventDefault()
            } else if (1 === e.touches.length && 2 !== en.startCount) {
                var a = t - en.startX, i = r - en.startY;
                a > en.threshold && Math.abs(a) > Math.abs(i) ? (en.captured = !0, jt()) : a < -en.threshold && Math.abs(a) > Math.abs(i) ? (en.captured = !0, Vt()) : i > en.threshold ? (en.captured = !0, Ut()) : i < -en.threshold && (en.captured = !0, $t()), Br.embedded ? (en.captured || _(Sr)) && e.preventDefault() : e.preventDefault()
            }
        }
    }

    function rr() {
        en.captured = !1
    }

    function nr(e) {
        (e.pointerType === e.MSPOINTER_TYPE_TOUCH || "touch" === e.pointerType) && (e.touches = [{
            clientX: e.clientX,
            clientY: e.clientY
        }], er(e))
    }

    function ar(e) {
        (e.pointerType === e.MSPOINTER_TYPE_TOUCH || "touch" === e.pointerType) && (e.touches = [{
            clientX: e.clientX,
            clientY: e.clientY
        }], tr(e))
    }

    function ir(e) {
        (e.pointerType === e.MSPOINTER_TYPE_TOUCH || "touch" === e.pointerType) && (e.touches = [{
            clientX: e.clientX,
            clientY: e.clientY
        }], rr(e))
    }

    function or(e) {
        if (Date.now() - $r > 600) {
            $r = Date.now();
            var t = e.detail || -e.wheelDelta;
            t > 0 ? Kt() : _t()
        }
    }

    function sr(e) {
        Jt(e), e.preventDefault();
        var t = g(Vr.wrapper.querySelectorAll(Cr)).length, r = Math.floor(e.clientX / Vr.wrapper.offsetWidth * t);
        Br.rtl && (r = t - r), rt(r)
    }

    function lr(e) {
        e.preventDefault(), Jt(), jt()
    }

    function cr(e) {
        e.preventDefault(), Jt(), Vt()
    }

    function dr(e) {
        e.preventDefault(), Jt(), Ut()
    }

    function ur(e) {
        e.preventDefault(), Jt(), $t()
    }

    function pr(e) {
        e.preventDefault(), Jt(), _t()
    }

    function fr(e) {
        e.preventDefault(), Jt(), Kt()
    }

    function vr() {
        qt()
    }

    function hr() {
        z()
    }

    function gr() {
        var e = document.webkitHidden || document.msHidden || document.hidden;
        e === !1 && document.activeElement !== document.body && ("function" == typeof document.activeElement.blur && document.activeElement.blur(), document.body.focus())
    }

    function mr(e) {
        if (Kr && $()) {
            e.preventDefault();
            for (var t = e.target; t && !t.nodeName.match(/section/gi);)t = t.parentNode;
            if (t && !t.classList.contains("disabled") && (V(), t.nodeName.match(/section/gi))) {
                var r = parseInt(t.getAttribute("data-index-h"), 10), n = parseInt(t.getAttribute("data-index-v"), 10);
                rt(r, n)
            }
        }
    }

    function br(e) {
        if (e.currentTarget && e.currentTarget.hasAttribute("href")) {
            var t = e.currentTarget.getAttribute("href");
            t && (H(t), e.preventDefault())
        }
    }

    function yr() {
        kr.isLastSlide() && Br.loop === !1 ? (rt(0, 0), Xt()) : Gr ? Xt() : Yt()
    }

    function wr(e, t) {
        this.diameter = 100, this.diameter2 = this.diameter / 2, this.thickness = 6, this.playing = !1, this.progress = 0, this.progressOffset = 1, this.container = e, this.progressCheck = t, this.canvas = document.createElement("canvas"), this.canvas.className = "playback", this.canvas.width = this.diameter, this.canvas.height = this.diameter, this.canvas.style.width = this.diameter2 + "px", this.canvas.style.height = this.diameter2 + "px", this.context = this.canvas.getContext("2d"), this.container.appendChild(this.canvas), this.render()
    }

    var kr, Ar, Lr, Er, Sr, xr, qr, Nr, Mr, Tr = "3.3.0", Ir = ".slides section", Cr = ".slides>section", Pr = ".slides>section.present>section", Hr = ".slides>section:first-of-type", Dr = navigator.userAgent, Br = {
        width: 1024,
        height: 768,
        margin: .1,
        minScale: .2,
        maxScale: 2,
        controls: !0,
        progress: !0,
        slideNumber: !1,
        history: !1,
        keyboard: !0,
        keyboardCondition: null,
        overview: !0,
        center: !0,
        touch: !0,
        loop: !1,
        rtl: !1,
        shuffle: !1,
        fragments: !0,
        embedded: !1,
        help: !0,
        pause: !0,
        showNotes: !1,
        autoSlide: 0,
        autoSlideStoppable: !0,
        autoSlideMethod: null,
        mouseWheel: !1,
        rollingLinks: !1,
        hideAddressBar: !0,
        previewLinks: !1,
        postMessage: !0,
        postMessageEvents: !1,
        focusBodyOnPageVisibilityChange: !0,
        transition: "default",
        transitionSpeed: "default",
        backgroundTransition: "default",
        parallaxBackgroundImage: "",
        parallaxBackgroundSize: "",
        parallaxBackgroundHorizontal: null,
        parallaxBackgroundVertical: null,
        pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,
        viewDistance: 3,
        dependencies: []
    }, zr = !1, Rr = !1, Wr = !1, Or = null, Fr = null, Yr = [], Xr = 1, jr = {
        layout: "",
        overview: ""
    }, Vr = {}, Ur = {}, $r = 0, _r = 0, Kr = !1, Zr = 0, Jr = 0, Qr = -1, Gr = !1, en = {
        startX: 0,
        startY: 0,
        startSpan: 0,
        startCount: 0,
        captured: !1,
        threshold: 40
    }, tn = {
        "N  ,  SPACE": "Next slide",
        P: "Previous slide",
        "&#8592;  ,  H": "Navigate left",
        "&#8594;  ,  L": "Navigate right",
        "&#8593;  ,  K": "Navigate up",
        "&#8595;  ,  J": "Navigate down",
        Home: "First slide",
        End: "Last slide",
        "B  ,  .": "Pause",
        F: "Fullscreen",
        "ESC, O": "Slide overview"
    };
    return wr.prototype.setPlaying = function (e) {
        var t = this.playing;
        this.playing = e, !t && this.playing ? this.animate() : this.render()
    }, wr.prototype.animate = function () {
        var e = this.progress;
        this.progress = this.progressCheck(), e > .8 && this.progress < .2 && (this.progressOffset = this.progress), this.render(), this.playing && Ur.requestAnimationFrameMethod.call(window, this.animate.bind(this))
    }, wr.prototype.render = function () {
        var e = this.playing ? this.progress : 0, t = this.diameter2 - this.thickness, r = this.diameter2, n = this.diameter2, a = 28;
        this.progressOffset += .1 * (1 - this.progressOffset);
        var i = -Math.PI / 2 + 2 * e * Math.PI, o = -Math.PI / 2 + 2 * this.progressOffset * Math.PI;
        this.context.save(), this.context.clearRect(0, 0, this.diameter, this.diameter), this.context.beginPath(), this.context.arc(r, n, t + 4, 0, 2 * Math.PI, !1), this.context.fillStyle = "rgba( 0, 0, 0, 0.4 )", this.context.fill(), this.context.beginPath(), this.context.arc(r, n, t, 0, 2 * Math.PI, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "#666", this.context.stroke(), this.playing && (this.context.beginPath(), this.context.arc(r, n, t, o, i, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "#fff", this.context.stroke()), this.context.translate(r - a / 2, n - a / 2), this.playing ? (this.context.fillStyle = "#fff", this.context.fillRect(0, 0, a / 2 - 4, a), this.context.fillRect(a / 2 + 4, 0, a / 2 - 4, a)) : (this.context.beginPath(), this.context.translate(4, 0), this.context.moveTo(0, 0), this.context.lineTo(a - 4, a / 2), this.context.lineTo(0, a), this.context.fillStyle = "#fff", this.context.fill()), this.context.restore()
    }, wr.prototype.on = function (e, t) {
        this.canvas.addEventListener(e, t, !1)
    }, wr.prototype.off = function (e, t) {
        this.canvas.removeEventListener(e, t, !1)
    }, wr.prototype.destroy = function () {
        this.playing = !1, this.canvas.parentNode && this.container.removeChild(this.canvas)
    }, kr = {
        VERSION: Tr,
        initialize: e,
        configure: p,
        sync: nt,
        slide: rt,
        left: jt,
        right: Vt,
        up: Ut,
        down: $t,
        prev: _t,
        next: Kt,
        navigateFragment: zt,
        prevFragment: Wt,
        nextFragment: Rt,
        navigateTo: rt,
        navigateLeft: jt,
        navigateRight: Vt,
        navigateUp: Ut,
        navigateDown: $t,
        navigatePrev: _t,
        navigateNext: Kt,
        showHelp: D,
        layout: z,
        shuffle: ot,
        availableRoutes: bt,
        availableFragments: yt,
        toggleOverview: U,
        togglePause: Q,
        toggleAutoSlide: et,
        isOverview: $,
        isPaused: G,
        isAutoSliding: tt,
        addEventListeners: f,
        removeEventListeners: v,
        getState: Ht,
        setState: Dt,
        getProgress: St,
        getIndices: Mt,
        getTotalSlides: Tt,
        getSlide: It,
        getSlideBackground: Ct,
        getSlideNotes: Pt,
        getPreviousSlide: function () {
            return Er
        },
        getCurrentSlide: function () {
            return Sr
        },
        getScale: function () {
            return Xr
        },
        getConfig: function () {
            return Br
        },
        getQueryHash: function () {
            var e = {};
            location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, function (t) {
                e[t.split("=").shift()] = t.split("=").pop()
            });
            for (var t in e) {
                var r = e[t];
                e[t] = m(unescape(r))
            }
            return e
        },
        isFirstSlide: function () {
            return 0 === Ar && 0 === Lr
        },
        isLastSlide: function () {
            return Sr ? Sr.nextElementSibling ? !1 : _(Sr) && Sr.parentNode.nextElementSibling ? !1 : !0 : !1
        },
        isReady: function () {
            return Rr
        },
        addEventListener: function (e, t, r) {
            "addEventListener" in window && (Vr.wrapper || document.querySelector(".reveal")).addEventListener(e, t, r)
        },
        removeEventListener: function (e, t, r) {
            "addEventListener" in window && (Vr.wrapper || document.querySelector(".reveal")).removeEventListener(e, t, r)
        },
        triggerKey: function (e) {
            Gt({keyCode: e})
        },
        registerKeyboardShortcut: function (e, t) {
            tn[e] = t
        }
    }
});
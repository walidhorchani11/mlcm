'use strict';

const classList = "undefined" == typeof document || "classList" in document.createElement("a") || ! function(e) {
    var t = "classList",
        i = "prototype",
        n = (e.HTMLElement || e.Element)[i],
        r = Object,
        o = String[i].trim || function() {
                return this.replace(/^\s+|\s+$/g, "")
            },
        s = Array[i].indexOf || function(e) {
                for (var t = 0, i = this.length; i > t; t++)
                    if (t in this && this[t] === e) return t;
                return -1
            },
        a = function(e, t) {
            this.name = e, this.code = DOMException[e], this.message = t
        },
        l = function(e, t) {
            if ("" === t) throw new a("SYNTAX_ERR", "An invalid or illegal string was specified");
            if (/\s/.test(t)) throw new a("INVALID_CHARACTER_ERR", "String contains an invalid character");
            return s.call(e, t)
        },
        c = function(e) {
            for (var t = o.call(e.className), i = t ? t.split(/\s+/) : [], n = 0, r = i.length; r > n; n++) this.push(i[n]);
            this._updateClassName = function() {
                e.className = this.toString()
            }
        },
        d = c[i] = [],
        h = function() {
            return new c(this)
        };
    if (a[i] = Error[i], d.item = function(e) {
            return this[e] || null
        }, d.contains = function(e) {
            return e += "", -1 !== l(this, e)
        }, d.add = function(e) {
            e += "", -1 === l(this, e) && (this.push(e), this._updateClassName())
        }, d.remove = function(e) {
            e += "";
            var t = l(this, e); - 1 !== t && (this.splice(t, 1), this._updateClassName())
        }, d.toggle = function(e) {
            e += "", -1 === l(this, e) ? this.add(e) : this.remove(e)
        }, d.toString = function() {
            return this.join(" ")
        }, r.defineProperty) {
        var u = {
            get: h,
            enumerable: !0,
            configurable: !0
        };
        try {
            r.defineProperty(n, t, u)
        } catch (p) {
            -2146823252 === p.number && (u.enumerable = !1, r.defineProperty(n, t, u))
        }
    } else r[i].__defineGetter__ && n.__defineGetter__(t, h)
}(self);

module.exports = { classList };

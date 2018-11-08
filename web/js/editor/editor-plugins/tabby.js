'use strict';

const tabby = function() {
    e.fn.tabby = function(i) {
        var n = e.extend({}, e.fn.tabby.defaults, i),
            r = e.fn.tabby.pressed;
        return this.each(function() {
            $this = e(this);
            var i = e.meta ? e.extend({}, n, $this.data()) : n;
            $this.bind("keydown", function(n) {
                var o = e.fn.tabby.catch_kc(n);
                return 16 == o && (r.shft = !0), 17 == o && (r.ctrl = !0, setTimeout(function() {
                    e.fn.tabby.pressed.ctrl = !1
                }, 1e3)), 18 == o && (r.alt = !0, setTimeout(function() {
                    e.fn.tabby.pressed.alt = !1
                }, 1e3)), 9 != o || r.ctrl || r.alt ? void 0 : (n.preventDefault, r.last = o, setTimeout(function() {
                    e.fn.tabby.pressed.last = null
                }, 0), t(e(n.target).get(0), r.shft, i), !1)
            }).bind("keyup", function(t) {
                16 == e.fn.tabby.catch_kc(t) && (r.shft = !1)
            }).bind("blur", function(t) {
                9 == r.last && e(t.target).one("focus", function() {
                    r.last = null
                }).get(0).focus()
            })
        })
    }, e.fn.tabby.catch_kc = function(e) {
        return e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which
    }, e.fn.tabby.pressed = {
        shft: !1,
        ctrl: !1,
        alt: !1,
        last: null
    }, e.fn.tabby.defaults = {
        tabString: String.fromCharCode(9)
    }
};

module.exports = { tabby };

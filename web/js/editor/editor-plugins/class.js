'use strict';

const classPlugin = function() {
    var e = !1,
        t = /xyz/.test(function() {}) ? /\b_super\b/ : /.*/;
    this.Class = function() {}, Class.extend = function(i) {
        function n() {
            !e && this.init && this.init.apply(this, arguments)
        }
        var r = this.prototype;
        e = !0;
        var o = new this;
        e = !1;
        for (var s in i) o[s] = "function" == typeof i[s] && "function" == typeof r[s] && t.test(i[s]) ? function(e, t) {
            return function() {
                var i = this._super;
                this._super = r[e];
                var n = t.apply(this, arguments);
                return this._super = i, n
            }
        }(s, i[s]) : i[s];
        return n.prototype = o, n.constructor = n, n.extend = arguments.callee, n
    }
}();

module.exports = { classPlugin };

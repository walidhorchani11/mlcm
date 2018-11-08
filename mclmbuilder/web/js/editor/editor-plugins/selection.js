'use strict';

import { tabby } from './tabby';

const selection = function(e) {
    function t(e, t, r) {
        var o = e.scrollTop;
        e.setSelectionRange ? i(e, t, r) : document.selection && n(e, t, r), e.scrollTop = o
    }

    function i(e, t, i) {
        var n = e.selectionStart,
            r = e.selectionEnd;
        if (n == r) t ? n - i.tabString == e.value.substring(n - i.tabString.length, n) ? (e.value = e.value.substring(0, n - i.tabString.length) + e.value.substring(n), e.focus(), e.setSelectionRange(n - i.tabString.length, n - i.tabString.length)) : n - i.tabString == e.value.substring(n, n + i.tabString.length) && (e.value = e.value.substring(0, n) + e.value.substring(n + i.tabString.length), e.focus(), e.setSelectionRange(n, n)) : (e.value = e.value.substring(0, n) + i.tabString + e.value.substring(n), e.focus(), e.setSelectionRange(n + i.tabString.length, n + i.tabString.length));
        else {
            for (; n < e.value.length && e.value.charAt(n).match(/[ \t]/);) n++;
            var o = e.value.split("\n"),
                s = new Array,
                a = 0,
                l = 0;
            for (var c in o) l = a + o[c].length, s.push({
                start: a,
                end: l,
                selected: n >= a && l > n || l >= r && r > a || a > n && r > l
            }), a = l + 1;
            var d = 0;
            for (var c in s)
                if (s[c].selected) {
                    var h = s[c].start + d;
                    t && i.tabString == e.value.substring(h, h + i.tabString.length) ? (e.value = e.value.substring(0, h) + e.value.substring(h + i.tabString.length), d -= i.tabString.length) : t || (e.value = e.value.substring(0, h) + i.tabString + e.value.substring(h), d += i.tabString.length)
                }
            e.focus();
            var u = n + (d > 0 ? i.tabString.length : 0 > d ? -i.tabString.length : 0),
                p = r + d;
            e.setSelectionRange(u, p)
        }
    }

    tabby
}(jQuery);

module.exports = { selection };

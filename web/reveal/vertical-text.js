if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}
$(function () {
    var slBlockSt = $('.sl-block').find('.block-style');
    if (typeof slBlockSt !== 'undefined') {
        slBlockSt.each(function () {
            var _style = $(this).attr('style');
            if (typeof _style !== typeof undefined && _style !== false) {
                if (_style.includes('transform')) {
                    _style = _style.replace('transform', '-webkit-transform');
                    $(this).attr('style', _style);
                }
            }
        });
    }
    var slBlock = $('.sl-block');
    if (typeof slBlock !== 'undefined') {
        slBlock.each(function () {
            var _style = $(this).attr('style');
            if (typeof _style !== typeof undefined && _style !== false) {
                if (_style.includes('transform')) {
                    _style = _style.replace('transform', '-webkit-transform');
                    $(this).attr('style', _style);
                }
            } else {
                console.log("error in vertical text slBlock style attribute is undefined");
            }
        });
    } else {
        console.log("error in vertical text slBlock is undefined");
    }
})
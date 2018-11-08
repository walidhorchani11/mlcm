'use strict';

export const toolbarsoptionslinkurl = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "link-url",
            property: "link.href",
            placeholder: "http://"
        }, t))
    },
    writeToBlock: function() {
        var e = this.getValue().trim();
        SL.util.string.URL_REGEX.test(e) || /^#\/\d/.test(e) ? this.block.set(this.config.property, e) : this.block.set(this.config.property, "")
    }
};

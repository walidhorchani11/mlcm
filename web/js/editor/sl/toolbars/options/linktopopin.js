'use strict';

export const toolbarsoptionslinktopopin = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "linktopopin"
        }, t))
    },
    render: function() {
        this._super(),
        this.domElement.append(`<div class="select-group"><select id="popinlink" class="form-control m-b">${this.linkToPopinList()}</select></div>`),
        SL.editor.controllers.Popin.linkToPopinListener()
    },
    linkToPopinList: function() {
        let defaultOption   = '<option id="opt_default" selected disabled>Link to Popin</option>',
            nbrPopins       = $('.slidespop section').size();

        if (nbrPopins > 0) { defaultOption = defaultOption + '<option value="unlink">Unlink</option>'; }
        _.each($('.slidespop section'), function(value, key) {
            let popId       = $(value).attr('data-id'),
                popinName   = $(value).attr('data-popin-name');

            defaultOption = defaultOption + '<option value="' + popId + '">Popin ' + popinName + '</option>';
        });

        return defaultOption;
    }
};

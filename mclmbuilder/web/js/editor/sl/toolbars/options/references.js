'use strict';

export const toolbarsoptionsreferences = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "references"
        }, t))
    },
    render: function() {
        this._super(),
        this.domElement.append(`<div class="select-group spec-select"><select class="selectpicker form-control m-b reference-select" multiple>${this.linkToReferenceList()}</select></div>`)
        SL.editor.controllers.References.linkToReferenceListner();
    },
    linkToReferenceList: function() {
        let defaultOption   = '',
            nbrReferences       = $("#tab-1 .item-ref span.ref-title").size();

        if (nbrReferences  > 0) {
            _.each($('#tab-1 span.ref-title'), function(value, key) {
                var refcode=$(value).parent().attr('id');
                var reftitle = $(value).html();
                var refId = $(value).parent().attr('id');
                defaultOption = defaultOption + '<option class="' + refcode + '" value="' + refId + '">' + reftitle + '</option>';
            });

        }
        return defaultOption;
    }
};

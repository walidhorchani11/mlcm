'use strict';

export const toolbarsoptionslinktopdf = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "linktopdf"
        }, t))
    },
    render: function() {
        this._super(),
        this.domElement.append(`<div id="linkedpdf" class="select-group spec-select"><div class="pdfactions">
             <div class="toolbar-option toolbar-multi" data-number-of-items="2"><h4 class="toolbar-option-label">Linked pdf</h4><div class="toolbar-multi-inner">
             <div class="toolbar-multi-item" data-tooltip="Unlink" id="unlinkpdf"><i class="fa fa-trash"></i></div>
             <div class="toolbar-multi-item" data-tooltip="Show Pdf" id="pdfpreview"><i class="fa fa-eye"></i></div></div>
             <div class="pdflabel"><span class="label label-primary" id="pdflabel"></span></div></div></div>
             <button id="pdflink" class="btn btn-primary pdf-link btn-block" type="button">
             <i class="fa fa-file-pdf-o"></i> Link to PDF</button>
             </div>`)
        SL.editor.controllers.Pdf.pdfLinkListener(this)
    }
};

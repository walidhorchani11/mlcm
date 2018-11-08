'use strict';

export const controllerpdf = {
    TYPE: "pdf-popup",
    init: function(e) {
        this.editor = e
    },
    pdfLinkListener: function(sidebar) {
        let btnPdfLink = sidebar.domElement.find('#pdflink');

        if (btnPdfLink.length > 0) {
            $(document)
                .off('click', '#pdflink')
                .on('click', '#pdflink', function() {
                    var e = Reveal.getCurrentSlide(),
                        t = Reveal.getIndices(e),
                        i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                            select: SL.models.Media.PDF
                        });
                    i.selected.addOnce(function(i) {
                        let selectedBlock   = SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement,
                            pdfUrl          = i.data.url,
                            pdfLabel        = i.data.label_media,
                            pdfSize         = i.data.size;

                        if (typeof pdfUrl  !== 'undefined' &&  typeof selectedBlock !== 'undefined') {
                            selectedBlock
                                .attr('data-pdf-name', pdfLabel)
                                .attr('data-pdf-link', pdfUrl)
                                .attr('data-size', pdfSize);
                            this.getLinkedPdf(SL.editor.controllers.Blocks.getFocusedBlocks()[0]);
                        }
                    }.bind(this));
                }.bind(this));
        }
    },
    getLinkedPdf: function(blockItem) {
        let sidebar         = this.editor.toolbars.domElement,
            linkedPdf       = blockItem.domElement.attr('data-pdf-link'),
            pdfLabel        = blockItem.domElement.attr('data-pdf-name'),
            screenList      = sidebar.find('select#linktoscreen'),
            popinList       = sidebar.find('select#popinlink');

        if (typeof linkedPdf !== 'undefined' && linkedPdf !== '') {
            screenList.prop('disabled', true);
            popinList.prop('disabled', true);
            sidebar.find('#linkedpdf #pdflink').hide();
            sidebar.find('#linkedpdf #pdflabel').text(pdfLabel);
            sidebar.find('#linkedpdf .pdfactions')
                .show()
                .find('.toolbar-multi-item:first-child').attr('data-tooltip', 'Unlink ' + pdfLabel);
            this.unlinkPdfListener();
            this.pdfPreviewListener(linkedPdf, pdfLabel);
            return;
        }
        sidebar.find('#linkedpdf #pdflink').show();
        sidebar.find('#linkedpdf .pdfactions').hide();
        screenList.prop('disabled', false);
        popinList.prop('disabled', false);
    },
    unlinkPdfListener: function() {
        $(document)
            .off('click', '#unlinkpdf')
            .on('click', '#unlinkpdf', function() {
                this.unlinkPdf();
            }.bind(this));
    },
    unlinkPdf: function() {
        let selectedBlock   = SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement;

        if (selectedBlock.attr('data-pdf-link') !== '') {
            selectedBlock.removeAttr('data-pdf-link data-pdf-name data-size');
            this.editor.toolbars.domElement.find('#linkedpdf #pdflink').show();
            this.editor.toolbars.domElement.find('#linkedpdf .pdfactions').hide();
        }
    },
    pdfPreviewListener: function(pdfurl, pdfname) {
        $(document)
            .off('click', '#pdfpreview')
            .on('click', '#pdfpreview', function() {
                SL.popup.open(SL.components.popup.Popup, {
                    title               : `PDF : ${pdfname}`,
                    width               : 1074,
                    height              : $(window).innerHeight()-200,
                    closeOnEscape       : !0,
                    closeOnClickOutside : !0,
                    bodycontent         : !0,
                    contentHTML         : '<div id="loader_pdf"><img class="displayLoader" src="'+ window.location.protocol + '//' + window.location.host +'/img/gear.svg" /><p class="loadertext text-center"><span>Generating PDF ...</span></p></div>'
                });
                $('#slpop').css({ 'padding' : 15 });
                this.pdfPreview(pdfurl, 'slpop')
            }.bind(this));
    },
    pdfPreview: function(pdfurl, targetId, previewWidth = 1024) {
        if (typeof targetId !== 'undefined' && targetId !== '') {
            let $container = $(`#${targetId}`);

            $container.append('<img id="loaderpdf" class="displayLoader" src="/img/loading.gif" />');
            this.popinBodyContent = document.getElementById(targetId);
            this.renderPDF(pdfurl, this.popinBodyContent, previewWidth);
        }
    },
    renderPDF: function(url, canvasContainer, screenWidth) {
        function renderPage(page) {
            let desiredWidth = screenWidth,
                viewport = page.getViewport(1),
                scale = desiredWidth / viewport.width,
                scaledViewport = page.getViewport(scale),
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            let renderContext = {
                canvasContext: ctx,
                viewport: scaledViewport
            };

            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;
            canvasContainer.appendChild(canvas);

            page.render(renderContext);
        }

        function renderPages(pdfDoc) {
            $('img#loaderpdf').remove();
            for (var num = 1; num <= pdfDoc.numPages; num++) {
                pdfDoc.getPage(num).then(renderPage);
                if (num === pdfDoc.numPages) {
                    $(document).find('#slpop #loader_pdf').remove();
                }
            }
        }
        PDFJS.disableWorker = false;
        PDFJS.getDocument(url).then(renderPages);
    }
}
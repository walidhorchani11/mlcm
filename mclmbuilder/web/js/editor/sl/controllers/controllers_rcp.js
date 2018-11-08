'use strict';

export const controllerRcp = {
    init: function(e) {
        this.editor     = e,
        this.rcpPannel  = this.editor.sidebar.revisionsPanel.domElement,
        this.uploadRcpListener(),
        this.searchRcpItems(),
        this.removeLinkedRcpListener(),
        this.rcpFileActionsListener()
    },
    uploadRcpListener: function() {
        let uploadBtn = this.rcpPannel.find('button#uploadRcpFile');

        uploadBtn
            .off('click')
            .on('click', function() {
                let i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                        select: SL.models.Media.PDF
                    });

                i.selected.addOnce(function(obj) {
                    if ($(`#linked-rcp .item-pdf[id="${obj.data.id}"]`).length > 0) {
                        SL.prompt({
                            title: '',
                            type: 'select',
                            html: `<h2 style="color:#f4bc6c !important">Rcp already linked !</h2><p style="font-size: 18px;">The PDF named "${obj.data.title}" is already linked to the actual presentation</p>`,
                            data: [{
                                html: "Close"
                            }]
                        });
                        return;
                    }
                    let rcpItemHtml = this.pdfRcpItemHtml(obj.data);

                    this.rcpPannel.find('div.slimScrollDiv .linked-pdf').prepend(rcpItemHtml),
                    this.removeNoResultMsg(),
                    this.rcpPannel.find('.msgPDF').hide(),
                    this.resetItems();
                }.bind(this));
            }.bind(this));
    },
    pdfRcpItemHtml: function(item) {
        return `<div class="item-pdf" id="${item.id}">
                    <div class="pull-left left-rcp-details">
                        <span class="icon-list"><img src="http://${process.env.BUCKET}.s3-website-${process.env.REGION}.amazonaws.com/img/images/icons/icon-pdf.png" title="" alt="" /></span>
                        <span class="title pdf-title2" data-size="${item.size}" data-id="${item.id}" id="pdf_title">${item.title}</span>
                        <span class="title pdf-title">${item.label_media}</span>
                    </div>
                    <div class="icon-rcp pull-right">
                        <a class="ref-link edit-pdf-title"><i class="fa fa-edit"></i></a>
                        <a class="ref-link cancel-pdf-title hidden"><i class="fa fa-close"></i></a>
                        <a class="ref-link save-pdf-title hidden"><i class="fa fa-save"></i></a>
                        <a href="${item.url}" class="btn btn-sm" target="_blank" title="View"><i class="p-view-icon"></i></a>
                        <a class="PDF_Presentation pull-right linkedpdf" id="${item.id}"><i class="fa fa-link" aria-hidden="true"></i></a>
                    </div>
                </div>`;
    },
    searchRcpItems: function() {
        let searchInput = this.rcpPannel.find('input#search-pdf-list'),
            timer;

        searchInput.on('keyup', function(e) {
            let searchText      = e.target.value,
                items           = this.rcpPannel.find('#linked-rcp .item-pdf');

            if (searchText.length > 0) {
                this.toggleUploadBtn(true);
            } else {
                this.toggleUploadBtn(false);
            }

            if (items.length > 0) {
                this.resetItems();
                clearTimeout(timer);
                timer = setTimeout(function() {
                    let reg = new RegExp(searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');

                    this.removeNoResultMsg();
                    items.css('display', 'block');
                    _.each(items, function(value, key, list) {
                        if (!$(value).find('#pdf_title').text().match(reg)) {
                            $(value).css('display', 'none');
                        }
                    });
                    let visibleItems = this.rcpPannel.find('#linked-rcp .item-pdf:visible');

                    if (visibleItems.length === 0) {
                        this.addNoResultMsg();
                    }
                }.bind(this), 500);
            }
        }.bind(this));
    },
    rcpFileActionsListener: function() {
        let context = this;

        $(document)
            .off('click', '.item-pdf .edit-pdf-title')
            .on('click', '.item-pdf .edit-pdf-title', function() {
                context.resetItems();

                let $element    = $(this),
                    icons       = $element.closest('.icon-rcp'),
                    rcpDetails  = $element.closest('.item-pdf').find('.left-rcp-details'),
                    rcpTitle    = rcpDetails.find('#pdf_title').text();

                icons.find('a').not('.cancel-pdf-title, .save-pdf-title').hide();
                icons.find('a').filter(':hidden').removeClass('hidden');

                rcpDetails.append(context.editRcpFilename(rcpTitle)).find('span.title').hide();
            });

        $(document)
            .off('click', '.item-pdf .cancel-pdf-title')
            .on('click', '.item-pdf .cancel-pdf-title', function() {
                context.resetItems();
            });

        $(document)
            .off('click', '.item-pdf .save-pdf-title')
            .on('click', '.item-pdf .save-pdf-title', function() {
                let rcpId = $(this).closest('.item-pdf').attr('id');

                context.validateFilename(rcpId);
                context.resetItems();
            });
    },
    validateFilename: function(id) {
        if (typeof id !== 'undefined') {
            let $item = $(`.item-pdf#${id}`),
                title = $item.find('input.title-pdf-new').val();

            $item.find('#pdf_title').text(title);
            $.post(TWIG.UrlUpload, {idPdf: id, title: title, value: 1},
                function() {
                    console.log('request finished');
                }).done(function() {
                    console.log('change name success');
                }).fail(function() {
                    console.log("error");
                })
        }
    },
    editRcpFilename: function(title) {
        return `<input class="title-pdf-new" type="text" style="width:280px" value="${title}" placeholder="Rcp Filename">`;
    },
    addNoResultMsg: function(emptyMsg) {
        if (emptyMsg === true) {
            this.rcpPannel.find('.slimScrollDiv').prepend(`<div id="no-res">No PDF files linked to your presentation</div>`);
            return;
        }
        this.rcpPannel.find('.slimScrollDiv').prepend(`<div id="no-res">No results matching your search</div>`);
    },
    removeNoResultMsg: function() {
        this.rcpPannel.find('#no-res').remove();
    },
    toggleUploadBtn: function(status) {
        let uploadBtn = this.rcpPannel.find('#uploadRcpFile');

        if (status === true) {
            uploadBtn.hide();
            return;
        }
        uploadBtn.show();
    },
    removeLinkedRcpListener: function() {
        let context = this;

        $(document)
            .off('click', '#linked-rcp .item-pdf .icon-rcp > .linkedpdf')
            .on('click', '#linked-rcp .item-pdf .icon-rcp > .linkedpdf', function(e) {
                let itemId = $(this).closest('.item-pdf').attr('id');

                context.removeRcpFileFromList(itemId);
            });
    },
    removeRcpFileFromList: function(id) {
        let currentPannel   = this.rcpPannel,
            itemToRemove    = currentPannel.find(`#linked-rcp .item-pdf[id="${id}"]`);

        itemToRemove.remove();
        let items = currentPannel.find('#linked-rcp .item-pdf');

        if (items.length === 0) {
            this.addNoResultMsg(true);
        }
    },
    resetItems: function() {
        let icons           = this.rcpPannel.find('.icon-rcp'),
            itemsRcpDetails = this.rcpPannel.find('.item-pdf .left-rcp-details');

        icons.find('a').not('.cancel-pdf-title, .save-pdf-title').show(),
        icons.find('a').filter('.cancel-pdf-title, .save-pdf-title').addClass('hidden'),
        itemsRcpDetails.find('span.title').show(),
        itemsRcpDetails.find('input.title-pdf-new').remove()
    }
}
'use strict';

export const controllerpopin = {
    init: function(e) {
        this.editor                 = e,
        this.slidesChanged          = new signals.Signal,
        this.init_param_popup_w     = 600,
        this.init_param_popup_h     = 400,
        this.init_param_popup_w_min = 300,
        this.init_param_popup_w_max = 1024,
        this.init_param_popup_h_min = 300,
        this.init_param_popup_h_max = 768,
        this.initPopinBgColor       = 'rgb(255, 255, 255)',
        this.initPopinBgImage       = '',
        this.popinSaveBtn           = '',
        this.parameters             = TWIG.parameters,
        this.totalSlides            = parseInt($('div.sl-block #linkedpopin').length + $('.slides section').not(".popin-overview").not(".stack").length),
        this.bgImageSize            = ''
    },
    isPopin: function() {
        return $(SL.editor.controllers.Markup.getCurrentSlide()[0]).hasClass('popin');
    },
    toastrConfig: function() {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            positionClass: "toast-top-center",
            preventDuplicates: true,
            timeOut: 5000
        }
    },
    toastrDuplicateConfig: function() {
        toastr.options = {
            closeButton: true,
            progressBar: false,
            showMethod: 'slideDown',
            positionClass: "toast-top-center",
            preventDuplicates: true,
            timeOut: 0
        }
    },
    getDefaultPopinParams: function() {
        let init_value_w = this.parameters.dataPopupWidth;
        if (init_value_w !== '' && init_value_w !== 'undefined') {
            let pos_w               = init_value_w.indexOf('px');
            this.init_param_popup_w = init_value_w.slice(0, pos_w);
        }
        let init_value_h = this.parameters.dataPopupHeight;
        if (init_value_h !== '' && init_value_h !== 'undefined') {
            let pos_h               = init_value_h.indexOf('px');
            this.init_param_popup_h = init_value_h.slice(0, pos_h);
        }
        let init_bg_value = this.parameters.dataBgPopupColor;
        if (init_bg_value !== '' && init_bg_value !== 'undefined') {
            this.initPopinBgColor = init_bg_value;
        }
        let init_bgimage_value = this.parameters.dataBgPopupImg;
        if (init_bgimage_value !== '' && init_bgimage_value !== 'undefined') {
            this.initPopinBgImage = init_bgimage_value;
        }
    },
    setActiveMenu: function(menu) {
        this.editor.sidebar.sidebarElement.addClass("has-active-panel"),
        this.editor.sidebar.sidebarSecondary.addClass('forbidden-click'),
        this.editor.sidebar.sidebarSecondary.find(".active").removeClass("active"),
        this.editor.sidebar.sidebarSecondary.find(".button." + menu).addClass("active").css('pointer-events', 'auto')
    },
    linkToPopinListener: function() {
        setTimeout(function() {
            $('select#popinlink')
                .off('change')
                .on('change', function(e) {
                    let screenList      = $('select#linktoscreen'),
                        popinList       = $('select#popinlink'),
                        pdbutton        = $('#linkedpdf #pdflink'),
                        selectedPopinId = this.value,
                        selectedBlock   = SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement;

                    if (selectedPopinId !== 'unlink') {
                        popinList.find('option').removeAttr('selected');
                        popinList.val(selectedPopinId);
                        selectedBlock.find('#linkedpopin').remove();
                        selectedBlock.attr('data-popup', selectedPopinId);
                        selectedBlock.append('<div id="linkedpopin" class="hide '+ selectedPopinId +'">' + selectedPopinId + '</div>');
                        screenList.prop('disabled', true);
                        pdbutton.prop('disabled', true);
                        return;
                    }
                    selectedBlock.find('#linkedpopin').remove();
                    selectedBlock.removeAttr('data-popup');
                    popinList.find('option#opt_default').attr('selected', true);
                    screenList.prop('disabled', false);
                    pdbutton.prop('disabled', false);
                });
        }, 2);
    },
    linkToScreenListener: function() {
        setTimeout(function() {
            $('select#linktoscreen')
                .off('change')
                .on('change', function(e) {
                    let screenList          = $('select#linktoscreen'),
                        popinList           = $('select#popinlink'),
                        pdbutton            = $('#linkedpdf #pdflink'),
                        selectedScreenId    = this.value,
                        selectedBlock       = SL.editor.controllers.Blocks.getFocusedBlocks()[0].domElement;

                    if (selectedScreenId !== 'unlink') {
                        let screenNbr = e.currentTarget.selectedOptions[0].attributes['data-id'].value;

                        screenList.find('option').removeAttr('selected');
                        screenList.val(selectedScreenId);
                        selectedBlock.find('#linkedscreen').remove();
                        selectedBlock.append('<div id="linkedscreen" class="hide">' + selectedScreenId + '</div>');
                        selectedBlock.attr('data-link', screenNbr);
                        popinList.prop('disabled', true);
                        pdbutton.prop('disabled', true);
                        return;
                    }
                    selectedBlock.find('#linkedscreen').remove();
                    selectedBlock.removeAttr('data-link');
                    screenList.find('option#opt_default').attr('selected', true);
                    popinList.prop('disabled', false);
                    pdbutton.prop('disabled', false);
                });
        }, 2);
    },
    selectedPopinList: function(blockItem) {
        let linkedPopin     = blockItem.domElement.find('#linkedpopin'),
            selectedId      = linkedPopin.text(),
            selectList      = $('select#popinlink'),
            screenList      = $('select#linktoscreen'),
            pdbutton        = $('#linkedpdf #pdflink'),
            selectedDefault = selectList.find('option:selected').val();

        if (linkedPopin.length > 0) {
            selectList.find('option').removeAttr('selected');
            $('select#popinlink option[value="' + selectedId + '"]').attr('selected', true);
            selectList.val(selectedId);
            screenList.prop('disabled', true);
            pdbutton.prop('disabled', true);
            return;
        }
    },
    selectedScreenList: function(blockItem) {
        let linkedScreen    = blockItem.domElement.find('#linkedscreen'),
            selectedId      = linkedScreen.text(),
            selectList      = $('select#popinlink'),
            screenList      = $('select#linktoscreen'),
            pdbutton        = $('#linkedpdf #pdflink'),
            selectedDefault = screenList.find('option:selected').val();

        if (linkedScreen.length > 0) {
            screenList.find('option').removeAttr('selected');
            $('select#linktoscreen option[value="' + selectedId + '"]').attr('selected', true);
            screenList.val(selectedId);
            selectList.prop('disabled', true);
            pdbutton.prop('disabled', true);
            return;
        }
    },
    addPopinTrigger: function() {
        let selector    = this.editor.sidebar.currentPanel.bodyElement[0],
            $selector   = $(selector).find('div.addpopin');

        if ($selector.length > 0) {
            $selector.off('click').on('click', () => {
                this.addPopin();
            });
        }
    },
    addPopin: function() {
        $('#wrapperMenuScroll').hide();
        let currentSection  = Reveal.getIndices();

        this.toastrConfig(),
        this.getDefaultPopinParams(),
        this.editor.sidebar.close('popin'),
        this.editor.sidebar.open('export'),
        this.editor.addHorizontalSlideButton.removeClass('show'),
        this.editor.addVerticalSlideButton.removeClass('show'),
        this.editor.sidebar.exportButton.show(),
        this.editor.sidebar.sidebarElement.find('button.save, .container-saideBarbtn').hide();
        if (typeof(Storage) !== "undefined") {
            if(currentSection) {
                localStorage.setItem('lastcurrentsection', JSON.stringify({ 'h' : currentSection.h, 'v' : currentSection.v }));
            }
        };
        Reveal.configure({ controls: false, keyboard: false, overview: false }),
        $.when(SL.editor.controllers.Markup
            .addHorizontalSlide('<section class="present popin newpop" style="display: block; "></section>')
        ).then(function(popin) {
            let currSlide = SL.editor.controllers.Markup.getCurrentSlide(),
                block = currSlide.offset();
            setTimeout(function() {
                SL.editor.controllers.Blocks.add({
                    type    : 'text',
                    width   : 300,
                    x       : 0,
                    y       : 0
                });
            }, 10);
            this.setPopInitDimensions(popin),
            this.getEditPopinPanelParams(popin)
        }.bind(this));
        this.saveButtonListener('add'),
        this.togglePopinSettings(),
        this.uploadBgImage(),
        this.closePanelListener(),
        this.deletePopinBgListener()
    },
    editPopin: function(sectionId) {
        $('#wrapperMenuScroll').hide();
        let popinContent    = $('.slidespop section.popin[data-id='+ sectionId +']').clone(),
            currentSection  = Reveal.getIndices();

        this.editor.addHorizontalSlideButton.removeClass('show'),
        this.editor.addVerticalSlideButton.removeClass('show'),
        this.editor.sidebar.sidebarElement.find('.sidebar button.savepop').show(),
        this.editor.sidebar.sidebarElement.find('button.save, .container-saideBarbtn').hide(),
        this.toastrConfig(),
        this.saveButtonListener('edit'),
        this.closePanelListener(),
        this.uploadBgImage(),
        this.getEditPopinPanelParams(popinContent),
        this.deletePopinBgListener(),
        this.togglePopinSettings();
        if (typeof(Storage) !== "undefined") {
            if(currentSection) {
                localStorage.setItem('lastcurrentsection', JSON.stringify({ 'h' : currentSection.h, 'v' : currentSection.v }));
            }
        };
        Reveal.configure({ controls: false, keyboard: false, overview: false }),
        SL.editor.controllers.Markup.addHorizontalSlide(popinContent);
        this.editor.sidebar.close('popin'),
        this.editor.sidebar.exportButton.show(),
        this.setActiveMenu('export')
    },
    duplicatePopin: function(sectionId) {
        let popinContent    = $('.slidespop section.popin[data-id='+ sectionId +']').clone(),
            currentSection  = Reveal.getIndices();

        popinContent.removeAttr('data-id');
        popinContent.attr('class', 'popin');
        this.editor.addHorizontalSlideButton.removeClass('show'),
        this.editor.addVerticalSlideButton.removeClass('show'),
        this.editor.sidebar.sidebarElement.find('.sidebar button.savepop').show(),
        this.editor.sidebar.sidebarElement.find('button.save, .container-saideBarbtn').hide(),
        this.toastrDuplicateConfig(),
        this.saveButtonListener('add'),
        this.uploadBgImage(),
        this.closePanelListener(),
        this.deletePopinBgListener(),
        this.editor.sidebar.close('popin'),
        this.editor.sidebar.open('export'),
        this.getEditPopinPanelParams(popinContent),
        this.togglePopinSettings();
        if (typeof(Storage) !== "undefined") {
            if(currentSection) {
                localStorage.setItem('lastcurrentsection', JSON.stringify({ 'h' : currentSection.h, 'v' : currentSection.v }));
            }
        };
        Reveal.configure({ controls: false, keyboard: false, overview: false }),
        SL.editor.controllers.Markup.addHorizontalSlide(popinContent);
        this.editor.sidebar.exportButton.show(),
        this.editor.sidebar.exportPanel.domElement.find('input.popin_name').val(''),
        toastr.warning('Please enter the name of the duplicated popin', 'Popin Duplication !');
    },
    deletePopin: function(sectionId) {
        this.sendDeletePopinThumb(sectionId);
        _.each($('.slides section'), function(value, key) {
            let $elm = $(value);

            $elm.find('div.sl-block #linkedpopin:contains("' + sectionId + '")').remove();
            $elm.find('div.sl-block[data-popup="' + sectionId + '"]').removeAttr('data-popup');
        });
        $('.slidespop').find('section.popin[data-id="' + sectionId + '"]').remove();
        $(this.editor.sidebar.popinPanel.bodyElement[0]).find('.item-pop#' + sectionId).remove();
        $(this.editor.toolbars.domElement[0]).find('#popinlink option[value="' + sectionId + '"]').remove();
        SL.editor.controllers.Blocks.blur();
    },
    seachPopin: function() {
        $(this.editor.sidebar.popinPanel.bodyElement[0]).find('.popin-form-custom input').keyup(function() {
            $('.item-pop').show();
            $('.section.items-pop > #no_res').remove();
            var chfind = $('.popin-form-custom input').val();
            _.each($('.items-pop > .item-pop div.popname'), function(value, index) {
                if($(value).text().toLowerCase().indexOf(chfind.toLowerCase()) === -1) {
                    $(value).closest('.item-pop').hide();
                }
            });
            if ($('.items-pop > .item-pop:hidden').size() === $('.items-pop > .item-pop').size()) {
                $('.section.items-pop').append('<div id="no_res"><b>No results match your search</b></div>')
            }
        });
    },
    getDefaultPopinPanelParams: function() {
        this.initDimensionsPanel(),
        this.initBgColorPanel()
    },
    getEditPopinPanelParams: function(popinContent) {
        let popin           = popinContent,
            editorSidebar   = this.editor.sidebar;

        this.initDimensionsPanel();
        if (popin.attr('data-popin-name') != "undefined") {
            $('.fields-wrapper input.popin_name').val(popin.attr('data-popin-name'));
        } else {
            popin.attr('data-popin-name', '');
        }
        if (typeof(popin.css('width')) != "undefined") {
            $('#screen_popup_width input').val(popin.css('width'));
        }
        if (typeof(popin.css('height')) != "undefined") {
            $('#screen_popup_height input').val(popin.css('height'));
        }
        if (typeof(popin.css('background-color')) != "undefined") {
            var bg_value    = popin.css('background-color');
            var bg_pop      = 'rgb(255, 255, 255)';

            if (bg_value != '' && bg_value !== 'undefined') {
                bg_pop = bg_value;
            }
            $('#bg_popup_screen_color2').spectrum({
                color: bg_pop,
                flat: !1,
                showInput: !0,
                showButtons: !0,
                showInitial: !0,
                showPalette: !1,
                showSelectionPalette: !1,
                preferredFormat: "hex",
                showAlpha: true,
                move: function (color) {
                    popin.css('background-color', color.toRgbString());
                },
                change: function (color) {
                    popin.css('background-color', color.toRgbString());
                }
            });
        }

        editorSidebar.exportPanel.domElement.find('.del-bg-popup').addClass('hide');
        if (typeof(popin.css('background-image')) != 'undefined' && popin.css('background-image') != 'none' && popin.css('background-image') != '') {
            editorSidebar.exportPanel.domElement.find('.bg-popup').show().css("background-image", popin.css('background-image'));
            editorSidebar.exportPanel.domElement.find('.del-bg-popup').removeClass('hide');
        }
    },
    setPopInitDimensions: function(popinSection) {
        popinSection.css({
            width               : this.init_param_popup_w,
            height              : this.init_param_popup_h,
            backgroundImage     : this.initPopinBgImage!= '' ? 'url(' + this.initPopinBgImage + ')' : 'none',
            backgroundColor     : this.initPopinBgColor,
            backgroundSize      : 'contain',
            backgroundRepeat    : 'no-repeat',
            backgroundPosition  : 'center center'
        }),
        popinSection.attr('data-bg-image', this.initPopinBgImage);

        return popinSection;
    },
    initDimensionsPanel: function() {
        $('#screen_popup_width').stepper({
            selectorProgressBar : '.stepper-progress',
            selectorInputNumber : '.stepper-number',
            classNameChanging   : 'is-changing',
            decimals            : 0,
            unit                : 'px',
            initialValue        : this.init_param_popup_w,
            min                 : this.init_param_popup_w_min,
            max                 : this.init_param_popup_w_max,
            stepSize            : 1
        });
        $('#screen_popup_height').stepper({
            selectorProgressBar : '.stepper-progress',
            selectorInputNumber : '.stepper-number',
            classNameChanging   : 'is-changing',
            decimals            : 0,
            unit                : 'px',
            initialValue        : this.init_param_popup_h,
            min                 : this.init_param_popup_h_min,
            max                 : this.init_param_popup_h_max,
            stepSize            : 1
        });
    },
    initBgColorPanel: function() {
        $('#bg_popup_screen_color2').spectrum({
            color: this.initPopinBgColor,
            showAlpha: true,
            move: function (color) {
                SL.editor.controllers.Markup.getCurrentSlide().css('background-color', color.toRgbString());
            }
        });
    },
    saveButtonListener: function(actionCase) {
        this.editor.sidebar.sidebarElement.find('.savepop')
            .off('click')
            .on('click', function() {
                this.savePopin(actionCase)
            }.bind(this)).show()
    },
    closePanelListener: function() {
        let exportpanel     = this.editor.sidebar.exportPanel,
            editor          = this.editor;

        editor.sidebar.exportButton.css('pointer-events', 'none');
        if (exportpanel.bodyElement.find('#savePopin').length > 0) {
            exportpanel.bodyElement.find('#savePopin')
                .off('click')
                .on('click', function() {
                    let popinName = exportpanel.domElement.find('input.popin_name');
                    if (popinName.val() !== '') {
                        SL.editor.controllers.Markup.getCurrentSlide().attr('data-size',this.bgImageSize);
                        popinName.closest('.form-group').removeClass('has-error'),
                        exportpanel.close(),
                        editor.sidebar.exportButton.css('pointer-events', 'auto'),
                        editor.sidebar.panelElement.removeClass('visible');
                        return;
                    }
                    popinName.closest('.form-group').addClass('has-error'),
                    toastr.error('Please enter the popin name', 'field required !')
                }.bind(this));
        }
    },
    togglePopinSettings: function() {
        let exportpanel     = this.editor.sidebar.exportPanel,
            sidebar         = this.editor.sidebar;

        sidebar.exportButton
            .off('click')
            .on('click', function() {
                setTimeout(function() {
                    sidebar.sidebarElement.addClass("has-active-panel"),
                    sidebar.sidebarSecondary.addClass('forbidden-click'),
                    sidebar.sidebarSecondary.find(".active").removeClass("active"),
                    sidebar.sidebarSecondary.find(".button.export").addClass("active")
                }, 10)
            });
    },
    savePopin: function(action) {
        let editor          = this.editor,
            exportpanel     = editor.sidebar.exportPanel,
            popinName       = exportpanel.domElement.find('input.popin_name'),
            sectionId       = SL.editor.controllers.Markup.getCurrentSlide().attr('data-id');

        if (popinName.val() !== '') {
            SL.editor.controllers.Blocks.blur();
            //this.generateThumbPopin();
            editor.addHorizontalSlideButton.addClass('show'),
            editor.addVerticalSlideButton.addClass('show'),
            editor.sidebar.sidebarElement.find('.savepop').hide(),
            editor.sidebar.close('export'),
            SL.editor.controllers.Markup.getCurrentSlide().addClass(sectionId).removeClass('newpop').attr('thumb-tosave', true);
            SL.editor.controllers.Markup.getCurrentSlide().attr('data-size',this.bgImageSize);
            if (action === 'add') {
                $('.reveal .slidespop').append(SL.editor.controllers.Markup.getCurrentSlide());
                $('.reveal .slidespop').children('section').removeClass('present');
            }
            if (action === 'edit') {
                $('.slidespop section.popin[data-id='+ sectionId +']').replaceWith(SL.editor.controllers.Markup.getCurrentSlide());
                $('.reveal .slidespop').children('section').removeClass('present');
            }
            SL.editor.controllers.Markup.removeCurrentSlide(),
            this.editor.sidebar.exportButton.hide(),
            this.detachDeletePopinBgListener(),
            $('.reveal .slidespop section.popin').css('display', 'none');
            $('.reveal .slidespop').hide();
            $('.slides').remove('section.popin');
            $('#wrapperMenuScroll').show();
            this.editor.sidebar.sidebarElement.find('button.save, .container-saideBarbtn').show();
            Reveal.configure({ controls: true, keyboard: true, overview: true }),
            toastr.clear();
            if (typeof(Storage) !== "undefined") {
                let sectionIndex =  JSON.parse(localStorage.getItem('lastcurrentsection'));

                if (sectionIndex != '') {
                    setTimeout(function() { Reveal.slide(sectionIndex.h, sectionIndex.v); }, 10);
                    SL.editor.controllers.Markup.getCurrentSlide().attr('data-thumb-saved', false);
                }
            };
            return;
        }
        popinName.closest('.form-group').addClass('has-error'),
        toastr.clear(),
        this.toastrConfig(),
        toastr.error('Please enter the popin name', 'Field required !');
        if (!editor.sidebar.isExpanded('export')) {
            editor.sidebar.open('export')
        }
    },
    svgAttributesCanvas: function(elm) {
        if (elm) {
            let svgHeight   = elm.height.animVal.value,
                svgWidth    = elm.width.animVal.value;

            $(elm).attr({
                'height' : svgHeight,
                'width' : svgWidth
            });
        }
    },
    generateThumbPopin: function() {
        let   slideContent  = SL.editor.controllers.Markup.getCurrentSlide(),
              popinId       = slideContent.attr('data-id'),
              height        = slideContent.height(),
              width         = slideContent.width();

        SL.editor.controllers.Blocks.blur();

        this.sendSavePopinThumb(popinId, height, width);
    },
    sendPopinThumb: function(img, idPop) {
        let idRev       = TWIG.idRev,
            idPres      = TWIG.idPres;

        if (img !== '' && idPop !== '' && idPres && idRev) {
            $.ajax({
                method      : 'POST',
                url         : Routing.generate('thumbnails_popin', { idPres: idPres, idRev: idRev, idPop: idPop }),
                dataType    : 'image/png',
                data        : { 'popin' : img }
            })
        }
    },
    sendSavePopinThumb: function(popinId, height, width) {
        let idRev       = TWIG.idRev,
            idPres      = TWIG.idPres,
            thumburl    = `${window.location.protocol}//${window.location.host}${TWIG.phantom_preview}/en/my-clm-presentations/${idRev}/${popinId}/${height}/${width}/popin#/`;

        if (popinId !== '' && thumburl !== '' && idPres && idRev) {
            $.ajax({
                method      : 'POST',
                url         : Routing.generate('thumbnail_popin_action', { idPres: idPres, idRev: idRev, idPop: popinId }),
                async       : true,
                data        : JSON.stringify({
                    'id'        : popinId,
                    'thumburl'  : thumburl,
                    'jsfile'    : 'popinthumb.js',
                    'fileName'  : `popin-${idPres}-${idRev}-${popinId}.png`,
                    'height'    : height,
                    'width'     : width
                })
            }).done(function() {
                console.log('popin thumb created with success');
            })
            .fail(function() {
                console.log('error creating popin thumb');
            })
        }
    },
    generateSavedPopinsThumbMultiple: function(popinsList) {
        let idRev       = TWIG.idRev,
            idPres      = TWIG.idPres,
            urls        = '';

        _.each(popinsList, function(value, key) {
            urls += `${window.location.protocol}//${window.location.host}${TWIG.phantom_preview}/en/my-clm-presentations/${idRev}/${value.id}/${value.height}/${value.width}/popin#/ `;
        }.bind(this));

        if (idPres && idRev && urls !== '') {
            $.ajax({
                method      : 'POST',
                url         : Routing.generate('popins_list_thumbnails', { idPres: idPres, idRev: idRev }),
                data        : JSON.stringify({
                    'urls'         : urls,
                    'modelPath'    : `${TWIG.phantomjsmodels}render_multi_url_popin.js`,
                    'model'        : 'render_multi_url_popin.js'
                })
            }).done(function() {
                console.log('popins thumbnails created with success');
            })
            .fail(function() {
                console.log('error creating thumb');
            })
        }
    },
    sendDeletePopinThumb: function(idPop) {
        let idRev       = TWIG.idRev,
            idPres      = TWIG.idPres,
            popinThumb  = 'popin-'+ idPres + '-' + idRev + '-' + idPop +'.png';

        if (popinThumb !== '' && idRev !== '' && idPres !== '' && idPop !== '') {
            $.ajax({
                method      : 'POST',
                url         : Routing.generate('delete_thumbnails_popin', { idPres: idPres, idRev: idRev, imageName: popinThumb }),
                dataType    : 'text'
            })
        }
    },
    uploadBgImage: function() {
        let editorSidebar = this.editor.sidebar;

        $('.bg_popup_upload2').off('click').on('click', function () {
            var e = Reveal.getCurrentSlide(),
                t = Reveal.getIndices(e),
                i = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
                    select: SL.models.Media.IMAGE
                });
            i.selected.addOnce(function(i) {
                let imgUrl      = i.data.url,
                    imgThumb    = i.data.thumb_url,
                    imgSize     = i.data.size,
                    imgLabel    = i.data.label_media;

                if (imgSize > 0 && imgLabel !== '' && imgUrl !== '') {
                    let currentSlide = SL.editor.controllers.Markup.getCurrentSlide();
                    this.bgImageSize = imgSize;
                    currentSlide.css({
                        backgroundImage     : "url(" + imgUrl + ")",
                        backgroundSize      : "contain",
                        backgroundRepeat    : "no-repeat",
                        backgroundPosition  : "center center"
                    }).attr('data-bg-image', imgUrl),
                    editorSidebar.exportPanel.domElement.find('.bg-popup').show().css("background-image", "url(" + imgThumb + ")"),
                    editorSidebar.exportPanel.domElement.find('.del-bg-popup').removeClass('hide')
                }
            }.bind(this));
        }.bind(this));
    },
    deletePopinBgListener: function() {
        let deleteButton    = this.editor.sidebar.exportPanel.domElement.find('.del-bg-popup');

        deleteButton.off('click')
            .on('click', function(e) {
                this.deletePopinBg()
            }.bind(this))
    },
    detachDeletePopinBgListener: function() {
        $('.bg_popup_upload2').unbind()
    },
    deletePopinBg: function() {
        let editorSidebar = this.editor.sidebar;

        SL.editor.controllers.Markup.getCurrentSlide().css({
            backgroundImage : 'none'
        });
        editorSidebar.exportPanel.domElement.find('.bg-popup').css('background-image', 'none');
        editorSidebar.exportPanel.domElement.find('.bg-popup').hide();
        editorSidebar.exportPanel.domElement.find('.del-bg-popup').addClass('hide');
        this.bgImageSize ="";
    },
    createPopinView: function() {
        $('section.popin-overview').remove();
        $('.slides section .arrange-control').not('.remove-current-slide').hide();
        $('.slides section .arrange-control.remove-current-slide').addClass('hide');
        //$('.sidebar button.btn-clm-map.arrange').removeClass('active');

        let sectionsList    = $('.slides > section').not(".popin-overview");

        _.each(sectionsList, function(value, key) {
            let childIndex      = 0,
                sectionId       = $(value).attr('data-id');

            $(value).find('.arrange-controls').children('.arrange-control').not('.remove-current-slide').hide();
            if ($(value).hasClass('stack')) {
                let childs = $(value).find('section');

                _.each(childs, function(childvalue, childkey) {
                    let childsectionId       = $(childvalue).attr('data-id');

                    $(childvalue).find('.arrange-controls').children('.arrange-control').not('.remove-current-slide').hide();
                    if (childkey === 0) {
                        this.addPopiOverview(childsectionId, 'vertical', childkey)
                    } else {
                        this.addPopiOverview(childsectionId, 'vertical', childkey)
                    }
                    if (childs.size()-1 === childkey) {
                        setTimeout(function(){ Reveal.slide(0, 0); }, 2);
                    }
                }.bind(this));
                return;
            }
            this.addPopiOverview(sectionId, 'vertical', childIndex);
            if (sectionsList.size()-1 === key) {
                setTimeout(function(){ Reveal.slide(0, 0); }, 2);
            }
        }.bind(this));
    },
    addPopiOverview: function(sectionId, direction, childIndex) {
        var tots            = this.totalSlides;
        let $section        = $('section[data-id="'+ sectionId +'"]'),
            linkedPopin     = $section.find('div.sl-block #linkedpopin'),
            popinContent    = $section.html(),
            bgColor         = $section.css('background-color'),
            bgImage         = $section.css('background-image'),
            dataindexh      = $section.attr('data-index-h'),
            dataindexv      = $section.attr('data-index-v'),
            idRev           = TWIG.idRev,
            idPres          = TWIG.idPres;

        if (linkedPopin.length > 0) {
            _.each(linkedPopin, function(popinLink, key) {
                let popinId     = $(popinLink).text(),
                    popinThumb  = idPres + '-' + idRev + '/popin-'+ idPres + '-' + idRev + '-' + popinId +'.png',
                    popinWidth  = $('.slidespop .popin[data-id="' + popinId + '"]').css('width'),
                    popinHeight = $('.slidespop .popin[data-id="' + popinId + '"]').css('height');

                function imageExists(url, callback) {
                    var img = new Image();
                    img.onload = function() {
                        callback(true);
                    };
                    img.onerror = function() {
                        callback(false);
                    };
                    img.src = url;
                }

                if (popinId !== '') {
                    let popinaction     = '',
                        basicPath       = window.location.protocol + '//' + window.location.host,
                        imageUrl        = basicPath + '/' + TWIG.thumbUrl + '/' + popinThumb,
                        content         = '<section class="popin-overview future disabled" style="background-color:' + bgColor + ';background-image:'+ bgImage.replace(/"/g , "") +';">' + popinContent +
                                          '<div class="popin_overflow"></div>'+
                                          '<div class="verticalcenterpopin"><img alt="image" data-id="' + popinId + '" class="img-responsive popin-flowdiag" style="width: '+popinWidth+'; height: '+popinHeight+';" src="'+ basicPath +'/img/images/screen.jpg"><div>'+
                                          '</section>';

                    // if (childIndex === 0) {
                    //     Reveal.slide(dataindexh);
                    // } else {
                    //     Reveal.slide(dataindexh, dataindexv);
                    // }
                    if (direction === 'horizontal') {
                        popinaction = SL.editor.controllers.Markup.addHorizontalSlide(content)
                    } else {
                        popinaction = SL.editor.controllers.Markup.addVerticalSlide(content)
                    }

                    $.when(popinaction)
                        .then(function() {
                            let total       = parseInt($('div.sl-block #linkedpopin').length) + parseInt($('.slides section').not(".popin-overview, .stack").length),
                                totSlides   = parseInt($('.slides section').not(".stack").length);

                            if (tots === Reveal.getTotalSlides()) {
                                setTimeout(function() {
                                    $('.sidebar button.arrange').addClass('active')
                                }, 2000);
                            }
                            imageExists(imageUrl, function(exists) {
                                if (exists) {
                                    $('img.popin-flowdiag[data-id="' + popinId + '"]').attr('src', imageUrl);
                                }
                            })
                        });
                    Reveal.sync();
                }
            });
        }
    }
};

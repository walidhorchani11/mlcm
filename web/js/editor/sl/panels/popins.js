'use strict';

export const panelpopins = {
    init: function() {
        this.domElement = $(".sidebar-panel .popin"),
        this.bodyElement = this.domElement.find(".panel-body"),
        this._super()
    },
    bind: function() {
        this._super(),
        this.downloadHTMLButton && this.downloadHTMLButton.on("click", this.onDownloadHTMLClicked.bind(this)),
        this.htmlOutputElement && this.htmlOutputElement.on("click", this.onHTMLOutputClicked.bind(this)),
        this.cssOutputElement && this.cssOutputElement.on("click", this.onCSSOutputClicked.bind(this)),
        this.domElement.find(".upgrade-button").on("click", function() {
            SL.analytics.trackEditor("Click upgrade link", "popin panel")
        })
    },
    open: function() {
        this._super(),
        this.listpopin(),
        this.addPopinListener(),
        this.editPopinListener(),
        this.deletePopinListener(),
        this.duplicatePopinListener(),
        this.seachPopinListener(),
        // $('.button.popin.no-arrow').addClass('active'),
        $('.popreview img').addClass('img-responsive')
    },
    close: function() {
        this._super()
        // $('.button.popin.no-arrow').removeClass('active'),
        // $('.sidebar').removeClass('has-active-panel'),
        // $('.sidebar-panel').removeClass('visible'),
        // $('.secondary').css('pointer-events', 'auto')
    },
    addPopinThumbPath: function(popId, imageUrl) {
        $(`.section.items-pop .item-pop#${popId} img`).replaceWith(`<img class="img-responsive" src="${imageUrl}">`);
    },
    listpopin: function() {
        let count_popin = $('.slidespop section').size(),
            idRev       = TWIG.idRev,
            idPres      = TWIG.idPres,
            compnayName = TWIG.companyName;

        compnayName = compnayName.toLowerCase().replace(/\s/g, '-');

        $('.items-pop .item-pop').remove();
        _.each($('.slidespop section'), function(value, key) {
            let srcPopin    = '/img/images/screen.jpg',
                popId       = $(value).attr('data-id'),
                popinName   = $(value).attr('data-popin-name'),
                popinThumb  = `${idPres}-${idRev}/popin-${popId}.png`,
                basicPath   = `${window.location.protocol}//${window.location.host}`,
                imageUrl    = `${basicPath}/${TWIG.thumbUrl}/${popinThumb}`;

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

            if (process.env.ISPROD) {
                imageUrl = `https://s3-${process.env.REGION}.amazonaws.com/${process.env.COMPANYBUCKET}/${compnayName}/${popinThumb}`;
            }

            $('.section.items-pop').append('<div class="popin-additems"></div> <div id="' + popId + '" class="item-pop row" style="max-height: 200px;">'+
                '<div class="popreview col-md-4 col-lg-4 col-sm-4" ><img alt="image" class="img-circle m-t-xs img-responsive" src="'+ srcPopin +'"></div>'+
                '<div class="popname">' + popinName + '</div>' +
                '<div class="editAdd-pop">'+
                '<a class="pop-link pop-del pull-right edit-trash"><i class="fa fa-trash"></i></a>' +
                '<a class="pop-link pop-edit pull-right"><i class="fa fa-edit"></i></a>' +
                '<a class="pop-link pop-duplicate pull-right"><i class="fa fa-copy"></i></a>'+
                '</div></div>');

            if (!process.env.ISPROD) {
                imageExists(imageUrl, function(exists) {
                    if (exists) {
                        this.addPopinThumbPath(popId, imageUrl);
                    }
                }.bind(this));
                return;
            }
            this.addPopinThumbPath(popId, imageUrl);
        }.bind(this));
    },
    seachPopinListener: function() {
        SL.editor.controllers.Popin.seachPopin()
    },
    addPopinListener: function() {
        SL.editor.controllers.Popin.addPopinTrigger()
    },
    deletePopinListener: function() {
        $('.item-pop .pop-del')
            .off('click')
            .on('click', function(e) {
                let sectionPopinId = $(e.currentTarget).closest('.item-pop').attr('id');

                if (sectionPopinId != '') {
                    SL.editor.controllers.Popin.deletePopin(sectionPopinId)
                }
            });
    },
    editPopinListener: function() {
        $('.item-pop .pop-edit')
            .off('click')
            .on('click', function(e) {
                let sectionPopinId = $(e.currentTarget).closest('.item-pop').attr('id');

                if (sectionPopinId != '') {
                    SL.editor.controllers.Popin.editPopin(sectionPopinId)
                }
            });
    },
    duplicatePopinListener: function() {
        $('.item-pop .pop-duplicate')
            .off('click')
            .on('click', function(e) {
                let sectionPopinId = $(e.currentTarget).closest('.item-pop').attr('id');

                if (sectionPopinId != '') {
                    SL.editor.controllers.Popin.duplicatePopin(sectionPopinId)
                }
            });
    },
    onHTMLOutputClicked: function() {
        this.htmlOutputElement.select()
    },
    onCSSOutputClicked: function() {
        this.cssOutputElement.select()
    }
};

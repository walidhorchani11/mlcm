'use strict';

var _ = require('underscore'),
    defaultFontListArray = require('./font-list'),
    deckSize = {
        getSize: function sizeZip() {
        var slidesContent = document.querySelectorAll(".slides *"),
            popinContent = document.querySelectorAll(".slidespop *"),
            j, d,
            fontReference = TWIG.parameters.dataMenuFontTitleRef,
            classZipLimit = $(".zipLimit"),
            classZipLimitIcon = $(".zipLimit i"),
            idMessageAlert = $("#hoverLimitZipAlert"),
            fontList = {
                data: []
            };

        //check font Reference
        fontList.data.push(fontReference);

        featchFontsOnPres(slidesContent, fontList);
        featchFontsOnPres(popinContent, fontList);

        var uniqFontList = _.uniq(_.collect(fontList.data, function (x) {
            return x;
        }));
        var sizeFonts = sizeFonts(uniqFontList);

        var max_size_zip = Route.maxSizeZip,
            max_size_zipe75 = (max_size_zip * 75) / 100,
            maxSizePercentage = max_size_zip / 100;
        $('#shared_size_val, #shared_max_size_val, #screen_size_val, #screen_max_size_val,' +
            ' #presentation_size_val, #presentation_max_size_val').empty();
        var mediaSettingsSize = claculateSizeSettings() /( 1024 * 1024) ;


        /*--------Shared size--------*/
        var sizeSHared = sizeFonts + 10 + mediaSettingsSize ;
        var $idSaredSize = $('#shared_size_val'),
            $idSharedMaxSize = $('#shared_max_size_val'),
            $classProgressBarShared = $('.shared-size-progressbar div div');
        AddClassProgressBar($idSaredSize, $idSharedMaxSize, $classProgressBarShared, sizeSHared, max_size_zip, maxSizePercentage,
            max_size_zipe75, 1);
        /*-----End Shared size--------*/

        /*----Section size------------*/
        var sizeSection = 10;
        var sizeMediaBySection = 0;
        $('.present [data-size]').each(function(){
            sizeMediaBySection = sizeMediaBySection + parseFloat($(this).attr("data-size"));
        });
        sizeMediaBySection = sizeMediaBySection /( 1024 * 1024 );
        var $idScreenMaxSize = $('#screen_max_size_val'),
            $idScreenSize = $('#screen_size_val'),
            $classProgressBarScreen = $('.screen-size-progressbar div div');
        AddClassProgressBar($idScreenSize, $idScreenMaxSize, $classProgressBarScreen, sizeSection + sizeMediaBySection, max_size_zip, maxSizePercentage,
            max_size_zipe75, 1);
        /*----- End Section size ---------*/;

        /*----- Total Slides ----------*/
        var sizeMediaAllSection = 0,
            dataSizeElement = 0;
        $('*[data-size]').each(function(){
            dataSizeElement = parseFloat($(this).attr("data-size"));
            if(dataSizeElement != null ){
                sizeMediaAllSection = sizeMediaAllSection + dataSizeElement;
            }
        });
        sizeMediaAllSection = sizeMediaAllSection /( 1024 * 1024);
        var sizeRevision = sizeFonts + 10 + mediaSettingsSize + sizeMediaAllSection ,
            $idRevisionSize = $('#presentation_size_val'),
            $idRevisionMaxSize = $('#presentation_max_size_val'),
            $classProgressBarRevision = $('.presentation-size-progressbar div div');
        AddClassProgressBar($idRevisionSize, $idRevisionMaxSize, $classProgressBarRevision, sizeRevision, max_size_zip, maxSizePercentage,
            max_size_zipe75, 0);
        /*-----End Total Slides--------*/

        function AddClassProgressBar($idScreenSize, $idMaxSize, $classProgressBar, sizeValue, max_size_zip,
                                     maxSizePercentage, max_size_zipe75, val) {
            $idScreenSize.append(Math.round(sizeValue));
            $idMaxSize.append(max_size_zip);
            var sizePercentage = Math.round(sizeValue / maxSizePercentage);
            $classProgressBar.width(sizePercentage + "%");
            $classProgressBar.removeClass();
            if (sizePercentage < max_size_zipe75) {
                $classProgressBar.addClass("progress-bar progress-bar-default");
                styleBt("button zipLimit", Route.alertStatus);
            } else if (sizePercentage > max_size_zipe75 && sizePercentage < max_size_zip) {
                $classProgressBar.addClass("progress-bar progress-bar-warning");
                styleBt("button zipLimit sizeLimit", Route.alertStatusWarning);
            }

            if(sizePercentage >= max_size_zip){
                styleBt("button zipLimit sizeLimit2", Route.alertStatusDangerous);
                $classProgressBar.addClass("progress-bar progress-bar-danger");
                if(val == 0 ){
                    $(".saveBtn button").attr("disabled","disabled");
                }else {
                    $('#modal_download_zip #clm option[value="veeva"]').prop('selected', true);
                    $('#modal_download_zip #clm option[value="mi"]').attr('disabled', 'disabled');
                }
            }
        }

        function styleBt(valueBtZip, messageValue) {
            classZipLimit.removeClass();
            classZipLimit.addClass(valueBtZip);
            idMessageAlert.empty();
            idMessageAlert.append(messageValue);
        }

        function featchFontsOnPres(selector, fontListUrl) {
            for (j = 0; j < selector.length; j++) {
                $(selector[j]).each(function () {
                    var font = $(this).css('font-family').replace('"', '');
                    if (font.indexOf("OpenSans, Helvetica, sans-serif") == -1) {
                        fontListUrl.data.push(font);
                    } else {
                        fontListUrl.data.push("OpenSans");
                    }
                });
            }
            return fontListUrl;
        }

        function sizeFonts(uniqFontList) {
            var sizeFonts = 0;
            for (j = 0; j < uniqFontList.length; j++) {
                var object = uniqFontList[j];
                for (d = 0; d < defaultFontListArray.fonts.length; d++) {
                    if (object == defaultFontListArray.fonts[d].name) {
                        sizeFonts = sizeFonts + parseFloat(defaultFontListArray.fonts[d].size);
                    }
                }
            }
            return sizeFonts;
        };

        function claculateSizeSettings() {
            var mediaSettingsSize = 0;
            mediaSettingsSize = calculateValue(TWIG.parameters.dataBgCloseSize) + calculateValue(TWIG.parameters.dataBgPopupSize)
                + calculateValue(TWIG.parameters.dataBgRefSize) + calculateValue(TWIG.parameters.dataLogoHomeSize)
                + calculateValue(TWIG.parameters.dataLogoPresSize) + calculateValue(TWIG.parameters.dataLogoRefrsSize)
                + calculateValue(TWIG.parameters.dataBgPresSize) + calculateValue(TWIG.parameters.dataLogoRcpSize) ;
                return mediaSettingsSize;
        };

        function calculateValue(val) {
            var result = val;
            if(val == ""){
                result = 0;
            }
            return result ;
        }
    }
    };

    //Size Zip
    $( document ).on( "click", ".zipLimit", function(e) {
        deckSize.getSize();
    });

module.exports = deckSize;
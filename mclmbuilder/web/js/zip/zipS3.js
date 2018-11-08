'use strict';
    /*function cloneSource(source) {
        return new Promise(function (resolve, reject) {
            let params = {
                Bucket: process.env.BUCKET,
                Prefix: source
            };

            s3.listObjects(params, function (err, data) {
                if (err) console.log(err, err.stack);
                else {
                    let dataLength = data.Contents.length;
                    async.map(data.Contents, function (f, callback) {
                        let name = f.Key.split("/");
                        name.shift();
                        name.shift();
                        name = name.join("/");
                        let param = {
                            Bucket: process.env.BUCKET,
                            CopySource: `${process.env.BUCKET}/${f.Key}`,
                            Key: `${destination}/testCopy/${name}`
                        };
                        s3.copyObject(param, function (err, data) {
                            if (err) console.log(err, err.stack); // an error occurred
                            else console.log(data); // successful response
                        });
                    })
                }
            });
        });
    }
    function generateZip(type) {
        let AWS         = require('aws-sdk'),
            source      = "",
            destination = "",
            async       = require('async'),
            s3          = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.REGION
            });
        if (type === "mi") {
            source = process.env.FRAMEWORK_MI_DEEP;
            destination = process.env.ZIP_OUTPUT_MI_DEEP;
        } else {
            source = process.env.FRAMEWORK_VEEVA_WIDE;
            destination = process.env.ZIP_OUTPUT_MI_DEEP;
        }
        cloneSource().then(function (result) {

        });

    }/**/


$(document).ready(function () {
    function getSlideIndicesFromIdentifier(t) {
        var e = $('.reveal .slides section[data-id="' + t + '"]');
        return e.length ? Reveal.getIndices(e.get(0)) : null
    }

    function verifSurvey() {
        var SlidePopinLinked = [];
        var nombeButtInSldPopLink = 0;
        var nbrButtonInSlides = 0;
        var nbrTolalButton = 0;
        $('.sl-block > #linkedpopin').each(function () {
            var $idLinkedpopin = $(this).text();
            if (jQuery.inArray($idLinkedpopin, SlidePopinLinked) == -1) {
                SlidePopinLinked.push($idLinkedpopin);
            }
        });
        $('.popin').each(function () {
            if (jQuery.inArray($(this).attr('data-id'), SlidePopinLinked) != -1) {
                var $nombreButtonSlidePopin = $(this).find('#submitButton').length;
                if ($nombreButtonSlidePopin >= 1) {
                    nombeButtInSldPopLink = nombeButtInSldPopLink + 1;
                }

            }
        });
        $('.slide').find('section:not(".popin"):not(".stack")').each(function () {
            nbrButtonInSlides = nbrButtonInSlides + $(this).find('#submitButton').length;
        });

        nbrTolalButton = nbrButtonInSlides + nombeButtInSldPopLink;
        if (nbrTolalButton > 1) {
            return true;
        } else {
            return false;
        }
    }
    $('#download_zip').click(function () {
        var clm = $('#clm').val();
        var stat = false;
        var type_convert = $('input[name="type_convert"]:checked').val();
        if (clm == "veeva") {
            console.log(verifSurvey());
            if( verifSurvey() == true) {
                swal(
                    'Notification',
                    '“You have more than one survey screen. To download a Veeva CLM zip file, please keep just one survey screen in your presentation.”',
                    'info'
                );
                $('#modal_download_zip').modal('hide');

                stat = true;
            } else {
                var idRev       = $('.slides').attr('data-idRev'),
                    idPres      = $('.slides').attr('data-idPres'),
                    thumburl    = window.location.protocol + '//' + window.location.host + '/en/my-clm-presentations/'+ idRev +'/preview-pdf#/',
                    urls        = '',
                    slidesList  = [];

                _.each($('.slides section:not(".popin")'), function(value, key) {
                    var sectionAttr = getSlideIndicesFromIdentifier($(value).attr('data-id'));

                    sectionAttr.id = $(value).attr('data-id');
                    slidesList.push(sectionAttr);
                });
                _.each(slidesList, function(value, key) {
                    if (typeof value.h === 'undefined') {
                        value.h = 0;
                    }
                    if (typeof value.v === 'undefined') {
                        value.v = 0;
                    }
                    urls += thumburl + value.h + '/' + value.v + '/' + value.id +' ';
                }.bind(this));
                console.log(urls);
                if (idPres && idRev && urls !== '') {
                    $.ajax({
                        method      : 'POST',
                        url         : Routing.generate('presentation_thumbnails', { idPres: idPres, idRev: idRev }),
                        data        : JSON.stringify({
                            'urls'         : urls,
                            'modelPath'    : TWIG.phantomjsmodels+'render_multi_url_veeva.js',
                            'model'        : 'render_multi_url_veeva.js'

                        })
                    }).done(function() {
                        console.log('thumb created with success');
                    })
                        .fail(function() {
                            console.log('error creating thumb');
                        })
                }
            }
        }
        if (!stat) {
            $('#modal_download_zip').modal('hide');
            //generateZip(clm);
            var urlZip =  Routing.generate('presentation_download_zip', {_locale: TWIG.currentLanguage, idRev: +
               TWIG.idRev, clm: 'clmV', type: 'typeC'}, true);
             var route = urlZip;
             route = route.replace("clmV", clm);
             route = route.replace("typeC", type_convert);
            toastr.options = {
                closeButton: true,
                progressBar: true,
                showMethod: 'slideDown',
                preventDuplicates: true,
                timeOut: 0,
                extendedTimeOut: 0
            };
            toastr.success(TWIG.zipMsg);
             $.get(route,function(data){
                var response = jQuery.parseJSON(data);
                if(response.success){
                    toastr.success("zip generated successfully");
                } else {
                    toastr.error('zip failed');
                }
             });

        }
    });
});
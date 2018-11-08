'use strict';

var green           = $('#alertPDF'),
    red             = $('#alertDangerPDF'),
    pdf             = $('#printPdf'),
    redJobTimeEnd   = new Date('2017', '07', '24', '08', '30', '00', '00'), // at this time jobRed end!
    CronJob         = require('cron').CronJob,
    jobGreen        = new CronJob({
        cronTime: '00 59 00-05 * * 1-4', // at this time jobGreen start!
        onTick: function() {
            if (typeof Cookies.get('green-cookie') === "undefined") {
                green.removeClass('hide');

                $('#alertPDF > button.close').on('click', function () {
                    Cookies.set('green-cookie', TWIG.userid, { expires: 7 });
                });
            }
        }
    }),
    jobRed = new CronJob({
        cronTime: '00 00 06-09 * * 4', // at this time jobRed start!
        onTick: function() {
            if (typeof Cookies.get('red-cookie') === "undefined") {
                green.addClass('hide');
                red.removeClass('hide');
                pdf.css({'cursor' : 'not-allowed', 'pointer-events' : 'none'}).children('.button').attr('disabled', true);

                $('#modal_download_pdf').attr("id", "modalHide");

                $('#alertDangerPDF > button.close').on('click', function () {
                    Cookies.set('red-cookie', TWIG.userid, { expires: 7 });
                });
            }

            jobGreen.stop();
            var now =  new Date();

            if (redJobTimeEnd.getTime() <= now.getTime()) {
                jobRed.stop();
            }
        },
        onComplete: function() {
            red.addClass('hide');
            green.addClass('hide');
            pdf.css({'cursor' : 'auto', 'pointer-events' : 'auto'}).children('.button').attr('disabled', false);
            $("#modalHide").attr('id', "modal_download_pdf");
            Cookies.remove('green-cookie');
            Cookies.remove('red-cookie');
        }
    });

jobGreen.start();
jobRed.start();

/*$(document).on(ARGO.options.events, ".doc", function (e) {
    if (window.parent.PDFHelper) {
        window.parent.PDFHelper.OpenPDF('media/pdf/pdf-test.pdf', window, true);
    }
    else {
        window.open('media/pdf/pdf-test.pdf');
    }
});*/

$(document).ready(function() {
    setTimeout(function() {
        $("#menu").attr('style', 'overflow: visible !important');
    }, 50);
});


/**RCP**/

$(document.body).ready(function(){

    /***RCP LINK TO***/
    $(document).off('touchstart', '.sl-block[data-pdf]').on('touchstart', '.sl-block[data-pdf]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var pdfUrl = "media/pdf/"+$(this).attr('data-pdf');
        //testTeme = ARGO.options.flow[0].theme;
        //console.log(testTeme);
        /*if (testTeme.substr(6,3) != "-MI") {
         $('.pdfRCP').html('').append($('<iframe frameborder="0"/>').attr('src', pdfUrl));
         }
         else {*/
        window.parent.PDFHelper.OpenPDF(pdfUrl, window, true);
        /*}*/
    });


    /**rcp pdf**/
    $(document).off('touchstart', '.menu-ml.showRcp[data-pdf]').on('touchstart', '.menu-ml.showRcp[data-pdf]', function (e) {

        var Rcpelm = flows[ARGO.options.currentFlow][0].rcp,
            RcpNumber = Rcpelm.match(/<li/g);
        //console.log(RcpNumber.length);
        if(Rcpelm == ""){
            e.preventDefault();
            e.stopPropagation();
            var pdfUrl = "media/pdf/"+$(this).attr('data-pdf'),
                testTeme = ARGO.options.flow[0].theme;
            //console.log(pdfUrl);
            //console.log(testTeme);
            /*if (testTeme.substr(6,3) != "-MI") {
                $('.pdfRCP1').html('').append($('<iframe frameborder="0"/>').attr('src', pdfUrl));
                //console.log("pdfUrl: " + pdfUrl);
            }
            else {*/
                window.parent.PDFHelper.OpenPDF(pdfUrl, window, true);
            /*}*/
        }
    });

    $(document).off('touchend', '#textRcp li').on('touchend', '#textRcp li', function (e) {
        if(ARGO.options.canClick == 1){
            e.preventDefault();
            e.stopPropagation();
            var pdfUrl = "media/pdf/"+$(this).attr('data-pdf'),
                testTeme = ARGO.options.flow[0].theme;
            //console.log(testTeme);
            /*if (testTeme.substr(6,3) != "-MI") {
             $('.pdfRCP').html('').append($('<iframe frameborder="0"/>').attr('src', pdfUrl));
             }
             else {*/
            window.parent.PDFHelper.OpenPDF(pdfUrl, window, true);
            /*}*/
        }
    });

    $(document.body).on('touchstart', '.closePdf', function (e) {
        e.preventDefault();
        $('#popupMentions').removeClass('actif');
        $('.pdfRCP').removeClass('actif');
        $('.pdfRCP').html('');
    });

});
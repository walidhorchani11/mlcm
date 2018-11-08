function refresh_save(e) {
    if ((e.which || e.keyCode) == 116) {
        // if(!$('.sidebar .save').hasClass('is-saved')) {
        //     $('#modal_save_presentation').modal('show');
        // }
        // e.preventDefault();
    }
};

function clickEventsMainMenu(e) {
    if ((e.which || e.keyCode) == 27) {
        if ($('.slides section.popin').hasClass('present') === false) {
            var $sidebar = $('.sidebar');
            $sidebar.find('.secondary').removeClass('forbidden-click').css('pointer-events', 'visible');
            $sidebar.find('.button.savepop').hide();
        }
    }
}

function pdf(imgData, elmSize, currSlide) {
    var doc     = new jsPDF('landscape');
    var tabimgData = [];
    var images = [];

    tabimgData = _.sortBy(imgData, 'orderid');

    _.map(tabimgData, function(item, index) {
        var width       = doc.internal.pageSize.width;
        var height      = doc.internal.pageSize.height;
        doc.addImage(item.content, 'JPEG', 0, 0, width, height);
        if (index + 1 < elmSize) {
            doc.addPage();
        }
    });
    doc.save("download.pdf");
    Reveal.slide(currSlide.h, currSlide.v);
    $('.slides').css({'opacity' : 1, 'margin' : 'auto'});
    Reveal.configure({ controls: true });
}

function generatePdf(imgData, elmSize, currSlide) {
    Reveal.slide(0);
    var tabimgData  = [];
    var images      = [];

    tabimgData = _.sortBy(imgData, 'orderid');
    // someData has to be an array
    _.map(tabimgData, function(item, index) {
        var pageBreakvalue = '';
        if (index + 1 === elmSize) {
            pageBreakvalue = 'after'
        }
        images.push({
            image           : item.content,
            width           : 800,
            height          : 612,
            pageBreakvalue  : 'after'
        });
    });
    var docDefinition = {
        pageSize        : 'LETTER',
        pageOrientation : 'landscape',
        content         : images,
        pageMargins     : [ 0, 0 ]
    };
    pdfMake.createPdf(docDefinition).download('presentation.pdf');
    Reveal.slide(currSlide.h, currSlide.v);
    setTimeout(function() {
        $('.reveal-viewport div#lodaer_pdf').remove();
        $('.slides').css({'opacity' : 1, 'margin' : 'auto'});
        $('.toolbars-scroller').show();
    }, 1000);
    Reveal.configure({ controls: true });
};

function getimage(id , key, child, hasChild) {
    var promise     = $.Deferred();
    var imageGen    = new Image();
    var selector    = '';

    if (hasChild === true) {
        Reveal.slide(key, child);
        selector    = Reveal.getCurrentSlide();
    } else {
        Reveal.slide(key);
        selector    = Reveal.getCurrentSlide();
    }

    _.each($(selector).find('svg'), function(elm) {
        if (elm) {
            var svgHeight   = elm.height.animVal.value,
                svgWidth    = elm.width.animVal.value;

            $(elm).attr({
                'height'    : svgHeight,
                'width'     : svgWidth
            });
        }
    });

    var scaleFactor = 2;
    // Save original size of element
    var originalWidth = selector.offsetWidth;
    var originalHeight = selector.offsetHeight;
    // Force px size (no %, EMs, etc)
    selector.style.width = originalWidth + "px";
    selector.style.height = originalHeight + "px";
    var scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = originalWidth * scaleFactor;
    scaledCanvas.height = originalHeight * scaleFactor;
    scaledCanvas.style.width = originalWidth + 'px';
    scaledCanvas.style.height = originalHeight + 'px';
    var context = scaledCanvas.getContext('2d');
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.scale(scaleFactor, scaleFactor);

    $('.slides section').removeClass('present');
    $(selector).removeClass('present');
    html2canvas(selector,
        {
            logging         : false,
            taintTest       : true,
            background      : '#fff',
            allowTaint      : false,
            useCORS         : true,
            letterRendering : true,
            canvas          : scaledCanvas
        }).then(function(canvas) {
        if (canvas !== '') {
            var convertedImage = canvas.toDataURL('image/jpeg');
            imageGen.onload = function() {
                // here loading is done, resolve our promise
                // pass the loaded image along with the promise
                promise.resolve(convertedImage, id);
                selector.style.position = 'absolute !important';
                selector.style.top = '0';
                selector.style.left = '0';
            };
            imageGen.src = convertedImage;
        }
    });

    return promise;
}

function getStepperWidthValue(popin) {
    if ($('section.popin.present').length) {
        $('section.popin.present').css('width', popin.value);
    }
}

function getStepperHeightValue(popin) {
    if ($('section.popin.present').length) {
        $('section.popin.present').css('height', popin.value);
    }
}

$(document).ready(function() {
    $(document).on('keydown', function(e) {
        refresh_save(e);
        clickEventsMainMenu(e);
    });
    $(document).on('click', '#pdfgen', function() {
        Reveal.initialize();
        $('.toolbars-scroller').hide();
        $('.reveal-viewport').prepend('<div id="lodaer_pdf"><img class="displayLoader" src="'+ window.location.protocol + '//' + window.location.host +'/img/gear.svg" /><p class="loadertext text-center"><span>Generating PDF ...</span></p></div>');

        $('.reveal-viewport #lodaer_pdf').css('height', $('.reveal-viewport').css('height'));
        $('.reveal-viewport #lodaer_pdf').css('width', $('.reveal-viewport').css('width'));
        var navbarLeftvalue = $('.navbar-static-side').outerWidth();

        $('.slides').css({'margin-left' : -(navbarLeftvalue+10), 'margin-top' : -(navbarLeftvalue-3)});
        if(Reveal.isOverview()) {
            Reveal.toggleOverview();
        }
        Reveal.configure({ controls: false, transitionSpeed: 'slow' });
        $('.slides').css('opacity', 0);
        var currSlide = Reveal.getIndices();
        Reveal.slide(0);
        var tabSlidesDataId = [];
        var tabids          = [];
        var imgData         = [];
        var position        = 0;
        var cpt             = 0;

        _.each($('.slides > section'), function(value, key) {
            tabSlidesDataId.push($(value).attr('data-id'));
        });

        _.each(tabSlidesDataId, function(value, key) {
            var $currentSection = $('.slides > section[data-id="' + value + '"]');
            if($currentSection.hasClass('stack') === false) {
                var section         = getimage(key, key, '', false);

                $.when(section).done(function(image, id) {
                    //  promise is resolved, image is loaded and can be used
                    imgData.push({
                        orderid     : parseFloat(id),
                        content     : image
                    });
                    cpt++;
                    if(cpt === Reveal.getTotalSlides()) {
                        generatePdf(imgData, Reveal.getTotalSlides(), currSlide);
                    }
                });
            }
            if($currentSection.hasClass('stack')) {
                _.each($currentSection.children('section'), function(valuechild, keychild) {
                    var sectionChild = getimage(parseFloat(key + '.' + keychild), key, keychild, true);

                    $.when(sectionChild).done(function(image, id) {
                        //  promise is resolved, image is loaded and can be used
                        imgData.push({
                            orderid     : id,
                            content     : image
                        });
                        cpt++;
                        if(cpt === Reveal.getTotalSlides()) {
                            generatePdf(imgData, Reveal.getTotalSlides(), currSlide);
                        }
                    });
                });
            }
        });
    });
});
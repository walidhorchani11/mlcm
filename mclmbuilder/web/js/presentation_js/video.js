$('document').ready(function() {
    var $poster = $('.sl-block[data-block-type="video"]');

    $poster.each(function(index, value) {
        var $elm        = $(value);
            poster      = $elm.attr('data-video-poster'),
            autoplay    = $elm.attr('data-video-autoplay');

        $elm.append('<div class="video-placeholder"></div>');
        if (typeof poster !== 'undefined' && poster !== '') {
            $elm.find('video').attr('poster', poster);
        }
        if (typeof autoplay !== 'undefined' && autoplay === true) {
            $elm.find('video').attr('autoplay', autoplay);
        }
    });
});
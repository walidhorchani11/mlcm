$(document).ready(function () {

    var fc = fontColor.slice(7, -1);
    var ic = itemColor.slice(7, -1);

    /* init menu */
    highlightCurrentSlide();

    /* slide change */
    Reveal.addEventListener('slidechanged', highlightCurrentSlide);

    function highlightCurrentSlide() {
        var state = Reveal.getState();
        $('li.slide-menu-item, li.slide-menu-item-vertical')
            .removeClass('past active future current')
            .css('background-image', '');

        $('li.slide-menu-item a, li.slide-menu-item-vertical a').css('color', fc);
        $('li.slide-menu-item, li.slide-menu-item-vertical').each(function (e) {
            var h   = $(this).data('slide-h');
            var v   = $(this).data('slide-v');
            var sh  = h;
            h--;
            $(".sousMenu-" + sh).removeClass('has-levelSecond');
            if (h === state.indexh) {
                if (v === state.indexv) {
                    $(this).addClass('active');
                    $(this).addClass('current');
                    $(this).children('a').css('color', ic);
                    if (highlight != 'no') {
                        $(this).css('background-image', 'url("' + imgHighlight + '")');
                    }
                }
                h++;
                $(".sousMenu-" + sh).addClass('has-levelSecond');
            }
            else {
                $(this).addClass('future');
            }
        });
    }
});

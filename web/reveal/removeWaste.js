// functions declaration
function removeData(element, attrToRemove) {
    var data = $(element).attr(attrToRemove);
    if (typeof data !== 'undefined' && data !== false) {
        $(element).removeAttr(attrToRemove);
    }
}
function removeClass(element, classToRemove) {
    if ($(element).hasClass(classToRemove)) {
        $(element).removeClass(classToRemove);
    }
}

Reveal.addEventListener('ready', function () {
    var $sections = $('section');
    $sections.each(function () {
        removeData(this, 'data-previous-indexv');
        removeData(this, 'data-index-h');
        removeData(this, 'data-index-v');

        // no need to remove class present
        removeClass(this, 'past');
        removeClass(this, 'future');
    });
});

/* function to move div 'backgrounds' under reveal 'slides' div */
$(function() {
    $('.reveal').prepend($('.reveal .backgrounds'));
});

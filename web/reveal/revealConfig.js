
// Expose speaker notes in case we're printing with share_notes
if (SLConfig.deck.notes) {
    [].forEach.call(document.querySelectorAll('.reveal .slides section'), function (slide) {
        var value = SLConfig.deck.notes[slide.getAttribute('data-id')];
        if (value && typeof value === 'string') {
            slide.setAttribute('data-notes', value);
        }
    });

}

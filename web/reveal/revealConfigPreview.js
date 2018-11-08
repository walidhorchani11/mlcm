
// Expose speaker notes in case we're printing with share_notes
if (SLConfig.deck.notes) {
    [].forEach.call(document.querySelectorAll('.reveal .slides section'), function (slide) {
        var value = SLConfig.deck.notes[slide.getAttribute('data-id')];
        if (value && typeof value === 'string') {
            slide.setAttribute('data-notes', value);
        }
    });
}

Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    mouseWheel: true,
    showNotes: SLConfig.deck.share_notes,
    slideNumber: SLConfig.deck.slide_number,

    autoSlide: SLConfig.deck.auto_slide_interval || 0,
    autoSlideStoppable: true,

    rollingLinks: false,
    center: SLConfig.deck.center || false,
    loop: SLConfig.deck.should_loop || false,
    rtl: SLConfig.deck.rtl || false,

    transition: SLConfig.deck.transition,
    backgroundTransition: SLConfig.deck.background_transition,

    pdfMaxPagesPerSlide: 1,
    menu: {
        side: 'left',
        numbers: false,
        titleSelector: 'span',
        hideMissingTitles: false,
        markers: false,
        transitions: false,
        openButton: false,
        openSlideNumber: false,
        keyboard: true,
        themes: false
    },
    dependencies: [
        {
            src: urlMenuJs
        },
    ]

});


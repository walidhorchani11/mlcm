'use strict';

export const toolbarsoptionslinktoscreen = {
    init: function(e, t) {
        this._super(e, $.extend({
            type: "linktoscreen"
        }, t))
    },
    render: function() {
        this._super(),
        this.domElement.append(`<div class="select-group"><select id="linktoscreen" class="form-control m-b">${this.linkToScreenList()}</select></div>`),
        SL.editor.controllers.Popin.linkToScreenListener()
    },
    linkToScreenList: function() {
        let default_option_screen   = '<option id="opt_default" selected disabled>Link to Screen</option>',
            nbrScreens              = $('.slides section').size();

        var parentId                = '',
            parentNbr               = '',
            stackId                 = '',
            cpt                     = 1;

        if (nbrScreens > 0) { default_option_screen = default_option_screen + '<option value="unlink">Unlink</option>'; }

        _.each($('.slides section:not(.stack)'), function(value, key) {
            let screenNbr       = key + 1,
                childNbr        = '',
                childName       = '',
                parentName      = '',
                sectionId       = $(value).attr('data-id'),
                screenName      = $(value).attr('data-screen-name'),
                chapterName     = $(value).attr('data-chapter-name'),
                screenNameList  = `Slide ${cpt}`;

            if (typeof screenName !== 'undefined' && screenName !== '') {
                screenNameList = screenName;
            }
            if (typeof chapterName !== 'undefined' && chapterName !== '') {
                screenNameList = `${chapterName} - ${screenNameList}`;
            }
            if ($(value).parents('section').hasClass('stack')) {
                if ($(value).is(":first-child")) {
                    parentNbr   = cpt;
                    childName   = `Slide ${cpt}.1`;
                    parentId    = sectionId;
                    stackId     = $(value).closest('section.stack').attr('data-id');
                    cpt++;

                    if (typeof screenName !== 'undefined' && screenName !== '') {
                        childName  = ` - ${screenNameList}`;
                    }
                    if (typeof stackChapterName !== 'undefined' && stackChapterName !== '') {
                        childName   = `Slide ${cpt}.2`;
                    }
                } else {
                    let $stackElm           = $(value).closest('.stack').find('section:first-child'),
                        stackScreenName     = $stackElm.attr('data-screen-name'),
                        stackChapterName    = $stackElm.attr('data-chapter-name');

                    childNbr    = $(`section.stack[data-id="${stackId}"] > section`).index($(`section[data-id="${sectionId}"]`));
                    parentName  = `Slide ${parentNbr}`,
                    childName   = `- ${parentName}.${childNbr}`;
                    if (typeof stackChapterName !== 'undefined' && stackChapterName !== '') {
                        stackScreenName = stackChapterName;
                        childName   = `- ${parentName}.${childNbr+1}`;
                    }
                    if (typeof screenName !== 'undefined' && screenName !== '') {
                        childName  = ` - ${screenNameList}`;
                    }
                    screenNameList  = `${parentName} ${childName}`;
                    if (typeof stackScreenName !== 'undefined' && stackScreenName !== '') {
                        screenNameList  = `${stackScreenName} ${childName}`;
                    }
                }
            } else {
                cpt++;
            }
            default_option_screen = default_option_screen + '<option value="' + sectionId + '" data-id="' + key + '">' + screenNameList + '</option>';
        });

        return default_option_screen;
    }
};

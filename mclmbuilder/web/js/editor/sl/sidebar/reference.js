'use strict';

export const sidebarreference = {
    init: function() {
        this.domElement = $(".sidebar-panel .popin"), this._super()
    },
    open: function() {
        this._super(),
        this.listpopin()
    },
    close: function() {
        this._super()
    },
    listpopin: function(){
        let count_popin = $('.slidespop section').size();
        $('.items-pop .item-pop').remove();
        for(var i = 0; i < count_popin; i++){
            let chpreivew = $('.slidespop section:nth('+i+')').text();
            let popin_name = $('.slidespop section:nth('+i+')').attr('data-popin-name');
            if (typeof(popin_name) == "undefined" || popin_name == " ") {
                popin_name = "";
            }
            $('.section.items-pop').append('<div id="' + i + '" class="item-pop"><div class="popreview">'+chpreivew+'</div>'+popin_name   +
                '<a class="pop-link pull-right" onclick="removepopin('+i+')"><i class="fa fa-trash"></i></a>' +
                '<a class="pop-link pop-edit pull-right" onclick="editpopin('+i+')"><i class="fa fa-edit"></i></a>' +
                '<a class="pop-link pop-edit pull-right" onclick="duplicatepopin('+i+')"><i class="fa fa-copy"></i></a>')
            $('.item-pop .sl-block').attr('style','');
        }
    }
};

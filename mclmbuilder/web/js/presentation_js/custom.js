// /**
//  * Created by argo on 03/10/16.
//  */
// function openModalSettings() {
//     $('.export').click();
//     Reveal.configure({ controls: false, keyboard: false, overview: false });
// }
//
// function select_link_to_screen() {
//     var screen_selected = $('article.projector .sl-block.is-focused .sl-block-content > div.link').attr('class'),
//         screen_id       = '',
//         option_screen   = '';
//
//     if(screen_selected && screen_selected != 'undefined') {
//         screen_id = screen_selected.split(' ');
//         if(screen_id[0] && screen_id[0] != 'undefined') {
//             option_screen = screen_id[0];
//         }
//     }
//     return option_screen;
// }
// //--------debut add action link to screen
// function caddscreen() {
//     var screen_number           = $('#screen').val(),
//         screen_section_number   = $('#screen > option:selected').attr('data-screen-nbr'),
//         ch                      = '';
//
//     if (screen_number === "unlink") {
//         if (typeof($('.sl-block.is-focused .sl-block-content div.link').html()) != "undefined") {
//             ch = $('.sl-block.is-focused .sl-block-content div').html();
//             $('.sl-block.is-focused .sl-block-content div').remove();
//             $('.sl-block.is-focused .sl-block-content').html(ch);
//         }
//     } else {
//         var number = $('.sl-block.is-focused .sl-block-content').attr("class");
//         ch = $('.sl-block.is-focused .sl-block-content div').html();
//         if (typeof(ch) == "undefined") {
//             ch = $('.sl-block.is-focused .sl-block-content').html();
//         }
//
//         $('.sl-block.is-focused .sl-block-content').children().remove();
//         $('.sl-block.is-focused .sl-block-content').html('<div class="' + screen_number + ' link" data-id="' + screen_section_number + '">' + ch + '</div>');
//         cgotoscrenn();
//     }
// }
// //--------fin add action link to screen
// //--------debut link to screen add option
// function caddoption() {
//     var selected_status     = '',
//         selected_default    = '';
//
//     length_slide = $('.slides section').size();
//     if(select_link_to_screen() !== '') {
//         selected_default = 'selected';
//     }
//     var section_content = '<option id="opt_default" ' + selected_default + ' disabled>' +
//         'Link to Screen</option>' +
//         '<option value="unlink">unlink</option>';
//
//     $('#screen option').remove();
//     for (var i = 0; i < length_slide; i++) {
//         data_id = $('.slides section:nth(' + i + ')').attr('data-id');
//         if (data_id === select_link_to_screen()) {
//             selected_status = "selected";
//         }
//         section_content = section_content + '<option value="' + data_id + '" ' + selected_status + ' data-screen-nbr="' + i + '">Screen ' + i + '</option>';
//         selected_status = '';
//     }
//     $('#screen').html(section_content);
// }
// //--------fin link to screen add option
// //--------debut navigate to screen by link
// function cgotoscrenn() {
//     $('body > .reveal .sl-block .sl-block-content .link').on('click', function () {
//         numberslide = $(this).attr("class");
//         slide_index = numberslide.indexOf(" ");
//         slide_to = numberslide.substring(0, slide_index);
//         var indices = Reveal.getIndices(document.querySelector('[data-id="' + slide_to + '"]'));
//         Reveal.slide(indices.h, indices.v);
//     })
// }
//
// function getPopinDefaultBg() {
//     var bg_value    = $('.parameters #params_clm_edidtor').data('bg-popup-color');
//     var bg_pop      = 'rgb(255, 255, 255)';
//
//     if (bg_value != '' && bg_value !== 'undefined') {
//         bg_pop = bg_value;
//     }
//     if (bg_pop !== '') {
//         setTimeout(function () {
//             $('#bg_popup_screen_color2').spectrum({
//                 color: bg_pop,
//                 move: function (color) {
//                     $(".slides section.popin.present").css("background-color", color.toRgbString());
//                 }
//             });
//         }, 10);
//     }
//     $('.slides section.popin.present').css('background-color', bg_pop);
// }
//
// //--------fin navigate to screen by link
// //--------debut create new popin
// function addpopin() {
//     $('html.decks.edit .sidebar .secondary .button.btn-popin-params').show();
//     Reveal.configure({ controls: false, keyboard: false, overview: false });
//     var currentSection = Reveal.getIndices();
//     if (typeof(Storage) !== "undefined") {
//         if(currentSection) {
//             localStorage.setItem('lastcurrentsection', JSON.stringify({ 'h' : currentSection.h, 'v' : currentSection.h }));
//         }
//     }
//     $('article.projector > div.icon').removeClass('show');
//     $('.popin').removeClass("visible");
//     $('button.popin ').removeClass("active");
//     $('.sidebar').removeClass("has-active-panel");
//     $('.sidebar-panel').removeClass("visible");
//     $('.fields-wrapper input.popin_name').closest('.form-group').removeClass('has-error');
//     default_bg_image = $('.bg-popup:nth(0)').css('background-image');
//     if (default_bg_image == "undefined") {
//         default_bg_image = '';
//     }
//
//     SL("editor.controllers").Markup.addHorizontalSlide('<section class="overflowing present popin" style="display: block; ">' +
//         '<div class="sl-block" data-block-type="text" style="width: 800px; left: 214px; top: 140px; height: auto;" >' +
//         '<div class="sl-block-content" data-placeholder-tag="h3" data-placeholder-text="Title Text" ' +
//         'style="position: relative; z-index: 11;" dir="ui"><h3></h3></div></div>' +
//         '</section>');
//
//     setTimeout(function () {
//         if ($('.popin.present').size() != 0) {
//             SL.editor.controllers.Markup.getCurrentSlide().css({
//                 backgroundImage: default_bg_image,
//                 backgroundColor: '#fff',
//                 backgroundSize: "contain",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center center"
//             });
//             getPopinDefaultBg();
//             popparam();
//         }
//     }, 50);
//     $('.button.export.no-arrow').click();
//     $('.button.savepop').show();
//     $('.secondary').css('pointer-events', 'none');
//     $('.secondary .button.export.no-arrow').css('pointer-events', 'auto');
//     $('.fields-wrapper input.popin_name').val('');
//     $('.secondary .button.references-list').addClass('active').css('pointer-events', 'auto');
//
//     $('.button.savepop').on('click', function () {
//         $('.fields-wrapper input.popin_name').closest('.form-control').removeClass('has-error');
//         var popinSectionContent = Reveal.getCurrentSlide();
//         if ($('.fields-wrapper input.popin_name').val() !== '') {
//             $('html.decks.edit .sidebar .secondary .button.btn-popin-params').hide();
//             $('.slides .popin.present').attr('data-popin-name', $(".popin_name").val());
//             $('.reveal .slidespop').append($('.slides section.popin'));
//             $('.reveal .slidespop section.popin').css('display', 'none');
//             $('.reveal .slidespop section.popin').removeClass('overflowing');
//             $('.reveal .slidespop').hide();
//             $('.slides').remove('section.popin');
//             $('.button.savepop ').hide();
//             $('.secondary').css('pointer-events', 'auto');
//             $('#screen_popup_width input').val('');
//             $('#screen_popup_height input').val('');
//             Reveal.navigatePrev();
//             Reveal.configure({ controls: true, keyboard: true, overview: true });
//             $('article.projector > div.icon').addClass('show');
//             $('.sidebar').removeClass('has-active-panel');
//             $('.sidebar-panel').removeClass('visible');
//             $('.export').removeClass('visible');
//             $('.fields-wrapper input.popin_name').closest('.form-control').removeClass('has-error');
//             return;
//         }
//         $('.sidebar').addClass('has-active-panel');
//         $('.sidebar-panel').addClass('visible');
//         $('.export').addClass('visible');
//         $('.fields-wrapper input.popin_name').closest('.form-group').addClass('has-error');
//     })
// }
// //--------fin create new popin
// //--------debut popin param config background color + image
// function popparam() {
//     console.log('testttttt');
//     $('.bg_popup_upload2').on("click", function () {
//         $(".slide-option.background-image").trigger("click");
//         $(".sl-popup").css("z-index", "40000");
//         $(document).off("click", ".media-library-list .media-library-list-item").on("click", ".media-library-list .media-library-list-item", function () {
//             bgPresImg = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-img");
//             if ($('.popin.present').size() != 0) {
//                 $(".export.visible .bg-popup").css("background-image", "url(" + bgPresImg + ")");
//                 $(".export.visible .bg-popup").show();
//                 if ($(".export.visible .del-current-bg").length == 0) {
//                     $("<div class='del-current-bg'><a href=''><i class='fa fa-trash'></i>Delete this background</a></div>").insertAfter(".export.visible .bg-popup");
//                 }
//             }
//             setTimeout(function () {
//                 if ($('.popin.present').size() != 0) {
//                     SL.editor.controllers.Markup.getCurrentSlide().css({
//                         backgroundImage: "url(" + bgPresImg + ")",
//                         backgroundSize: "contain",
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "center center"
//                     });
//                 }
//             }, 50);
//
//         });
//     });
//     $(document).on("click", ".export.visible .del-current-bg a", function (e) {
//         e.preventDefault();
//         if ($('.popin.present').size() != 0) {
//             $(this).parent(".del-current-bg").remove();
//             $(".export.visible .bg-popup").removeAttr("style").css("display", "none");
//             $(".export.visible .bg-popup").removeAttr("style");
//             SL.editor.controllers.Markup.getCurrentSlide().css("background-image", "none");
//         }
//     });
//
//     var param_popup_w = 600;
//     var init_value_w = $('.parameters #params_clm_edidtor').attr('data-popup-width');
//     if(init_value_w !== '' && init_value_w !== 'undefined') {
//         console.log('test width');
//         var pos_w = init_value_w.indexOf('px');
//         param_popup_w = init_value_w.slice(0, pos_w);
//     }
//     console.log(init_value_w);
//     $('.popin.present').css('width', param_popup_w);
//     $('#screen_popup_width').stepper({
//         selectorProgressBar: '.stepper-progress',
//         selectorInputNumber: '.stepper-number',
//         classNameChanging: 'is-changing',
//         decimals: 0,
//         unit: 'px',
//         initialValue: param_popup_w,
//         min: 300,
//         max: 900,
//         stepSize: 1
//     });
//     // $('#screen_popup_width input').val(init_value_w);
//     var param_popup_h = 400;
//     var init_value_h = $('.parameters #params_clm_edidtor').attr('data-popup-height');
//     if(init_value_h !== '' && init_value_h !== 'undefined') {
//         console.log('test height');
//         var pos_h = init_value_h.indexOf('px');
//         param_popup_h = init_value_h.slice(0, pos_h);
//     }
//     console.log(init_value_h);
//     $('.popin.present').css('height', param_popup_h);
//     $('#screen_popup_height').stepper({
//         selectorProgressBar: '.stepper-progress',
//         selectorInputNumber: '.stepper-number',
//         classNameChanging: 'is-changing',
//         decimals: 0,
//         unit: 'px',
//         initialValue: param_popup_h,
//         min: 300,
//         max: 600,
//         stepSize: 1
//     });
//     // $('#screen_popup_height input').val(init_value_h);
// }
// //--------finpopin param config background color + image
// //--------debut action save and quit
// function savepop() {
//     $('.slides .savepop').on('click', function () {
//         $('.sidebar .secondary .button.btn-popin-params').hide();
//         $('.reveal .slides section.popin').hide();
//         if (typeof($('.reveal .slidespop section').html()) != "undefined") {
//             $('.reveal .slidespop').append($('.slides section.popin'));
//         }
//         $('.reveal .slidespop section.popin').removeClass('overflowing');
//         $('.reveal .slidespop section.popin').hide();
//         $('.reveal .slidespop').hide();
//         $('.reveal .slides section.popin').hide();
//         $('html.decks.edit .sidebar .secondary .button.btn-popin-params').hide();
//         $('.slides').remove('section.popin');
//         Reveal.navigatePrev();
//     })
// }
// //--------fin action save and quit
// function cseparateslidepopin() {
//     $('.reveal .slides section.popin').hide();
//     $('.reveal .slidespop').append($('.slides section.popin'));
//     $('.reveal .slidespop').hide();
//     $('.slides').remove('section.popin');
//     $('.reveal .slidespop section.popin').removeClass('overflowing');
// }
// //--------debut action remove popin from popin list
// function removepopin(popid) {
//     link_id = $('.slidespop section:nth('+popid+')').attr('data-id');
//     links_to_remove = $('.'+link_id+'');
//     count_link = links_to_remove.size();
//     for (var i = 0; i < count_link; i++) {
//         $('.'+link_id+'').parent().html($('.'+link_id+'').html());
//     }
//     $('.slidespop section')[popid].remove();
//     count_popin = $('.slidespop section').size();
//     $('.items-pop .item-pop').remove();
//     $('.section.items-pop .item-pop').remove();
//     for (var i = 0; i < count_popin; i++) {
//         chpreivew = $('.slidespop section:nth(' + i + ')').html();
//         popin_name = $('.slidespop section:nth(' + i + ')').attr('data-popin-name');
//         if (typeof(popin_name) == "undefined") {
//             popin_name = "";
//         }
//
//         $('.section.items-pop').append('<div id="' + i + '" class="item-pop row"><div class="popreview col-md-4 col-lg-4 col-sm-4" ><img alt="image" class="img-circle m-t-xs img-responsive" src="/img/images/screen.jpg"></div><div class="popname">' + popin_name +
//             '</div><div class="editAdd-pop"><a class="pop-link  pull-right edit-trash" onclick="removepopin(' + i + ')"><i class="fa fa-trash"></i></a>' +
//             '<a class="pop-link pop-edit pull-right" onclick="editpopin(' + i + ')"><i class="fa fa-edit"></i></a>' +
//             '<a class="pop-link pop-edit pull-right" onclick="duplicatepopin(' + i + ')"><i class="fa fa-copy"></i></a></div>');
//     }
//
// }
// //--------fin action remove popin from popin list
// //--------debut action edit popin from popin list
// function editpopin(popid) {
//     $('html.decks.edit .sidebar .secondary .button.btn-popin-params').show();
//     Reveal.configure({ controls: false, keyboard: false, overview: false });
//     SL("editor.controllers").Markup.addHorizontalSlide($('.reveal .slidespop section')[popid]);
//     $('.popin').removeClass("visible");
//     $('button.popin').removeClass("active");
//     $('.sidebar').removeClass("has-active-panel");
//     $('.button.savepop').show();
//     $('.sidebar-panel').removeClass("visible");
//     $('.secondary').css('pointer-events', 'none');
//     $('.secondary .button.export.no-arrow').css('pointer-events', 'auto');
//     $('article.projector > div.icon').removeClass('show');
//     getPopinDefaultBg();
//     popparam();
//     $('.button.savepop').off('click').on('click', function () {
//         openModalSettings();
//         $('.popin.present').data('popin-name', $('input.popin_name').val());
//         $('.fields-wrapper input.popin_name').closest('.form-group').removeClass('has-error');
//         if ($('.fields-wrapper input.popin_name').val() !== '') {
//             $('html.decks.edit .sidebar .secondary .button.btn-popin-params').hide();
//             $('.reveal .slidespop').append($('.slides section.popin'));
//             $('.reveal .slidespop section.popin').css('display', 'none');
//             $('.reveal .slidespop section.popin').removeClass('overflowing');
//             $('.reveal .slidespop').hide();
//             $('.slides').remove('section.popin');
//             $('.button.savepop').hide();
//             $('.sidebar').removeClass('has-active-panel');
//             $('.sidebar-panel').removeClass('visible');
//             $('.secondary').removeClass('forbidden-click').css('pointer-events', 'auto');
//             $('#screen_popup_width input').val('');
//             $('#screen_popup_height input').val('');
//             Reveal.navigatePrev();
//             Reveal.configure({ controls: true, keyboard: true, overview: true });
//             $('article.projector > div.icon').addClass('show');
//             $('.fields-wrapper input.popin_name').closest('.form-control').removeClass('has-error');
//             return;
//         }
//         $('.sidebar').addClass('has-active-panel');
//         $('.sidebar-panel').addClass('visible');
//         $('.export').addClass('visible');
//         $('.fields-wrapper input.popin_name').closest('.form-group').addClass('has-error');
//     });
// }
// //--------fin action edit popin from popin list
// //--------debut action duplicate popin from popin list
// function duplicatepopin(popid) {
//     $('html.decks.edit .sidebar .secondary .button.btn-popin-params').show();
//     $('.popin').removeClass("visible");
//     $('button.popin ').removeClass("active");
//     $('.sidebar').removeClass("has-active-panel");
//     chpopduplicate = $('.slidespop section:nth(' + popid + ')').html();
//     default_bg_image = $('.slidespop section:nth(' + popid + ')').css('background-image');
//     duplicate_width = $('.slidespop section:nth(' + popid + ')').css('width');
//     default_bg_height = $('.slidespop section:nth(' + popid + ')').css('height');
//     duplicate_bg_color = $('.slidespop section:nth(' + popid + ')').css('background-color');
//     $('.sidebar-panel').click();
//     $('.slidespop section:nth(' + popid + ') div').removeAttr('data-block-id');
//     $('.slidespop section:nth(' + popid + ')').removeAttr('data-block-id');
//     $('.slidespop section:nth(' + popid + ')').removeAttr('data-id');
//     var duplicate_popin_name = $('.slidespop section:nth(' + popid + ')').attr('data-popin-name');
//     if (typeof(duplicate_popin_name) == "undefined" || duplicate_popin_name === '') {
//         duplicate_popin_name = '';
//     }
//     SL("editor.controllers").Markup.addHorizontalSlide('<section class="overflowing present popin" style="display: block;" data-popin-name="'+duplicate_popin_name+'">' + $('.slidespop section:nth(' + popid + ')').html() + '</section>');
//     setTimeout(function () {
//         if ($('.popin.present').size() != 0) {
//             $('.popin.present').data('popin-name', duplicate_popin_name);
//             SL.editor.controllers.Markup.getCurrentSlide().css({
//                 width: duplicate_width,
//                 height: default_bg_height,
//                 backgroundColor: duplicate_bg_color,
//                 backgroundImage: default_bg_image,
//                 backgroundSize: "contain",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center center"
//             });
//             openModalSettings();
//         }
//     }, 50);
//     $('.secondary').css('pointer-events', 'none');
//     $('.secondary .button.export.no-arrow').css('pointer-events', 'auto');
//     $('.button.savepop').show();
//     popparam();
//     $('.button.savepop').on('click', function () {
//         if ($('.fields-wrapper input.popin_name').val() !== '') {
//             $('html.decks.edit .sidebar .secondary .button.btn-popin-params').hide();
//             $('.slides .popin.present').attr('data-popin-name', $(".popin_name").val());
//             $('.reveal .slidespop').append($('.slides section.popin'));
//             $('.reveal .slidespop section.popin').css('display', 'none');
//             $('.reveal .slidespop section.popin').removeClass('overflowing');
//             $('.reveal .slidespop').hide();
//             $('.slides').remove('section.popin');
//             $('.button.savepop').hide();
//             $('.sidebar').removeClass('has-active-panel');
//             $('.sidebar-panel').removeClass('visible');
//             $('.secondary').css('pointer-events', 'auto');
//             Reveal.navigatePrev();
//             Reveal.configure({ controls: true, keyboard: true, overview: true });
//             $('article.projector > div.icon').addClass('show');
//             $('.fields-wrapper input.popin_name').closest('.form-control').removeClass('has-error');
//             return;
//         }
//         $('.sidebar').addClass('has-active-panel');
//         $('.sidebar-panel').addClass('visible');
//         $('.export').addClass('visible');
//         $('.fields-wrapper input.popin_name').closest('.form-group').addClass('has-error');
//     })
// }
// //--------fin action duplicate popin from popin list
// //--------debut action link to popin
// function caddpopin() {
//     var popin_number = $('#popinlink').val();
//     if (popin_number == "unlink") {
//         if (typeof($('.sl-block.is-focused .sl-block-content div.linkpopin').html()) != "undefined") {
//             ch = $('.sl-block.is-focused .sl-block-content div').html();
//             $('.sl-block.is-focused .sl-block-content div').remove();
//             $('.sl-block.is-focused .sl-block-content').html(ch);
//         }
//     } else {
//         var number = $('.sl-block.is-focused .sl-block-content').attr("class");
//         ch = $('.sl-block.is-focused .sl-block-content div').html();
//         if (typeof(ch) == "undefined") {
//             ch = $('.sl-block.is-focused .sl-block-content').html();
//         }
//
//         $('.sl-block.is-focused .sl-block-content').children().remove();
//         $('.sl-block.is-focused .sl-block-content').html('<div id="list-pop" class="' + popin_number + ' linkpopin methodology">' + ch + '</div>');
//     }
//
// }
// //--------fin action link to popin
// //--------debut add option link to popin
// function caddoptionpopin() {
//     length_slide = $('.slidespop section').size();
//     var section_content = '<option selected disabled>' +
//         'Link to Popin</option>' +
//         '<option value="unlink">unlink</option>';
//     $('#popinlink option').remove();
//     for (var i = 0; i < length_slide; i++) {
//         data_id = $('.slidespop section:nth(' + i + ')').attr('data-id');
//         data_popin_name = $('.slidespop section:nth(' + i + ')').attr('data-popin-name');
//         section_content = section_content + '<option value="' + data_id + '">Popin ' + data_popin_name + '</option>';
//     }
//     $('#popinlink').html(section_content);
// }
// //--------fin add option link topopin
//
// $(document).ready(function () {
//     popparam();
// //------------- remove popin from  slides
//     $('.reveal .slides section.popin').hide();
//     $('.reveal .slidespop').append($('.slides section.popin'));
//     $('.reveal .slidespop').hide();
//     $('.slides').remove('section.popin');
//     $('.reveal .slidespop section.popin').removeClass('overflowing');
// //-------------- fin remove popin from di slides
// //-----------------Debut popin list search by name
//         var delay = (function() {
//             var timer = 0;
//             return function(callback, ms) {
//                 clearTimeout(timer);
//                 timer = setTimeout(callback, ms);
//             };
//         })();
//
//
//     $('.popin-form-custom input').keyup(function() {
//         delay(function() {
//             $('.item-pop').show();
//             $('.section.items-pop > #no_res').remove();
//             var chfind = $('.popin-form-custom input').val();
//             _.each($('.items-pop > .item-pop div.popname'), function(value, index) {
//                 if($(value).text().toLowerCase().indexOf(chfind.toLowerCase()) === -1) {
//                     $(value).closest('.item-pop').hide();
//                 }
//             });
//             if ($('.items-pop > .item-pop:hidden').size() === $('.items-pop > .item-pop').size()) {
//                 $('.section.items-pop').append('<div id="no_res"><b>No results match your search</b></div>')
//             }
//         }, 500);
//     });
//     $('.popin-form-custom input').on('blur', function () {
//         if ($('.popin-form-custom input').val() == "") {
//             $('.item-pop').show();
//             $('.section.items-pop > #no_res').remove();
//         }
//     })
// //------------------Fin popin list search by name
// //------------------debut popin clm map
//     var contentedit = [];
//     Reveal.addEventListener('overviewshown', function () {
//         contentedit[0] = $('.reveal .slides').html();
//         contentedit[1] = false;
//         if ($('.linkpopin').size() > 0) {
//             contentedit[1] = true;
//         }
//
//         for (var i = 0; i < $('.linkpopin').size(); i++) {
//             if (!$('.linkpopin:nth(' + i + ')').parent().parent().parent().parent().hasClass('stack')) {
//                 c = $('.linkpopin:nth(' + i + ')').closest("section");
//                 c.attr('class', 'stack blanck');
//                 c.html('<section class="disable" >' + c.html() + '</section>'
//                     + '<section class="future sousblanck" >'
//                     + '<div><img alt="image" class="img-responsive" src="/img/screen.png" style="width: 90%;"></div>'
//                     + '</section>');
//             } else {
//                 $('.linkpopin:nth(' + i + ')').closest("section").after('<section class="future sousblanck" >'
//                     + '<div><img alt="image" class="img-responsive" src="/img/screen.png" style="width: 90%;"></div>'
//                     + '</section>');
//             }
//         }
//         Reveal.sync();
//     });
//     Reveal.addEventListener('overviewhidden', function () {
//         $('.sousblanck').remove();
//         if (contentedit[1]) {
//             $('.sousblanck').remove();
//             for (var i = 0; i < $('.blanck').size(); i++) {
//                 v = $('.blanck:nth(' + i + ')');
//                 $('.blanck:nth(' + i + ')').html($('.blanck:nth(' + i + ')').children().html());
//                 v.attr('class', 'blanck present');
//                 v.removeClass('stack');
//             }
//             $('.reveal .slides section').removeClass('blanck');
//             Reveal.navigateTo(0);
//         }
//     });
// //------------------fin popin clm map
// })

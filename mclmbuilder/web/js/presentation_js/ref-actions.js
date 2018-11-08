// /* Edit references */
// var pSave,
//     spanSave,
//     textFieldSave,
//     refId,
//     textFieldSaveinput,
//     ckeditor_config = {
//         height: '80px',
//         entities: true,
//         basicEntities: true,
//         toolbarGroups: [
//             { name: 'basicstyles', groups: [ 'Bold', 'Italic', 'Underline' ] },
//             { name: 'paragraph',   groups: [ 'list', 'indent', 'align' ] },
//             { name: 'links' },
//             { name: 'styles', item: [ 'Styles' ]  },
//             { name: 'colors' }
//         ],
//         on: {
//             change: function(evt) {
//                 this.updateElement();
//             },
//             instanceReady : function(evt){
//               let id =$(this.container).attr('id');
//               $('#'+id).find('.cke_top').find('.cke_combo.cke_combo__styles.cke_combo_off').remove();
//               $('#'+id).find('.cke_top').find('.cke_combo.cke_combo__format.cke_combo_off').remove();
//             }
//         }
//     };
//
// $(document).ready(function() {
//     $('#reference_description').ckeditor(ckeditor_config);
// });
//
// $(document).off("click", ".ref-edit").on("click", ".ref-edit", function () {
//     var _this = $(this);
//
//     $(this).parent(".item-ref").find(".ref-save").show();
//     $(this).parent(".item-ref").find(".cancel-link").show();
//     $(this).parent(".item-ref").find(".ref-edit").hide();
//     $(this).parent(".item-ref").find(".close-link").hide();
//     //$(this).parent(".item-ref").find(".close-link").show();
//     $(".references-ok").hide();
//     $(".item-ref").addClass("disabled");
//     _this.parent(".item-ref").removeClass("disabled");
//     pSave = _this.parent(".item-ref").find(".ref-desc").html();
//     spanSave = _this.parent(".item-ref").find("span.title").html();
//     if(_this.parent(".item-ref").find(".ref-desc").parents(".import-from-reveal").length == 0){
//         _this.parent(".item-ref").find(".ref-desc").replaceWith("<div class='import-from-reveal'><textarea id='edit-ref' name='edit-ref' class='import-input'>" + pSave + "</textarea></div>");
//     }
//     else{
//         _this.parent(".item-ref").find(".import-from-reveal").html("<textarea id='edit-ref' name='edit-ref' class='import-input'>" + pSave + "</textarea>");
//     }
//     _this.parent(".item-ref").find("span.title").replaceWith("<input id='ref-popt' class='title-ref' value='" + spanSave + "' />");
//
//     $(this).closest('.item-ref').find('#edit-ref').ckeditor(ckeditor_config);
//     $(document).off("click", ".ref-save").on("click", ".ref-save", function(){
//
//         $(this).parent(".item-ref").find(".ref-save").hide();
//         $(this).parent(".item-ref").find(".cancel-link").hide();
//         $(this).parent(".item-ref").find(".ref-edit").show();
//         $(this).parent(".item-ref").find(".close-link").show();
//         $(".references-ok").show();
//         $(".item-ref").removeClass("disabled");
//         refId = _this.parent(".item-ref").find(".refId").val();
//         var idReference = _this.parent(".item-ref").attr('id');
//         textFieldSave = _this.parent(".item-ref").find("textarea").val();
//         $(this).closest('.item-ref').find('#edit-ref').ckeditor().editor.destroy();
//         _this.parent(".item-ref").find("textarea").replaceWith("<div class='ref-desc'>" + textFieldSave + "</div>");
//         if(_this.parent(".item-ref").find(".ref-desc").parent().is(".import-from-reveal")){
//             _this.parent(".item-ref").find(".ref-desc").unwrap();
//         }
//         textFieldSaveinput = _this.parent(".item-ref").find("input.title-ref").val();
//         _this.parent(".item-ref").find("input.title-ref").replaceWith("<span class='title ref-title'>" + textFieldSaveinput + "</span>");
//
//         if( $( "#tab-2 .item-ref#" + idReference).length != 0)
//         {
//             /*var NewDescRef = $( "#tab-2 .item-ref#" + refId).find("p").first();
//              NewDescRef.html("");
//              NewDescRef.append(textFieldSave);*/
//             $( "#tab-2 .item-ref#" + idReference).find("p").html("");
//             $( "#tab-2 .item-ref#" + idReference).find("p").first().replaceWith(textFieldSave);
//             $( "#tab-2 .item-ref#" + idReference).find("span").first().html(textFieldSaveinput);
//
//         }
//       /*  var valRefEdit ='';
//         var descripRefEdit ='';
//         $(Reveal.getCurrentSlide()).find('.wrapper-refs').remove();
//         //$(Reveal.getCurrentSlide()).append("<div class='BlockRef' style='display: none'></div>");
//         $(Reveal.getCurrentSlide()).find('.BlockRef').append("<div class='wrapper-refs'></div>");
//         $('#tab-2 .linked-ref').find('.item-ref').each(function(){
//             console.log("yes");
//             valRefEdit = $(this).find('.ref-code').val();
//             descripRefEdit = $(this).find('p').html();
//             $(Reveal.getCurrentSlide()).find('.BlockRef .wrapper-refs').append("<div class='item-ref-wrapper'><div class='row-ref'><span class='codeRef'>"+valRefEdit+". </span><span class='descRef'>"+descripRefEdit+"</span></div></div>" );
//
//         })*/
//         $.ajax({
//             type: "POST",
//             data : {
//                 title       : textFieldSaveinput,
//                 description : textFieldSave,
//                 refId       : refId
//             },
//             dataType: "html",
//             url:TWIG.updateREF,
//             cache:false,
//             success: function(){
//             }
//         });
//     });
//     $(document).off("click", ".cancel-link").on("click", ".cancel-link", function(){
//
//         $(".references-ok").show();
//         $(".item-ref").removeClass("disabled");
//         $(this).parent(".item-ref").find(".ref-save").hide();
//         $(this).parent(".item-ref").find(".cancel-link").hide();
//         $(this).parent(".item-ref").find(".ref-edit").show();
//         $(this).parent(".item-ref").find(".close-link").show();
//         $(this).closest('.item-ref').find('#edit-ref').ckeditor().editor.destroy();
//         _this.parent(".item-ref").find("textarea").replaceWith("<div class='ref-desc'>" + pSave + "</div>");
//         if(_this.parent(".item-ref").find(".ref-desc").parent().is(".import-from-reveal")){
//             _this.parent(".item-ref").find(".ref-desc").unwrap();
//         }
//         _this.parent(".item-ref").find("input.title-ref").replaceWith("<span class='title ref-title'>" + spanSave + "</span>");
//     });
// });

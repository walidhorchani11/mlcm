/**
 * Created by argo on 26/12/16.
 */
$(document).ready(function () {
    //Test if pdf is linked to presentation
    $(document).on('click','.btn-pdf-list', function () {
        $("#tab-11").find(".item-pdf").each(function() {
            var idtab11 = $(this).find('.PDF_Present').attr('id');
            var pdfPers = $(this).find('.PDF_Present');
            $("#tab-21").find(".item-pdf").find('.linkedpdf').each(function() {
                if($(this).attr('id') == idtab11){
                    pdfPers.closest(".item-pdf").addClass("Is-linked");
                    pdfPers.attr('disabled', 'disabled');
                    pdfPers.find('.fa-check').css('color','green');
                }
            })
        })
    });

//search in pdf list
     $(document).on('input','#search-pdf-list', function () {
               var value = $(this).val().toLowerCase();
               $('#filter-pdf-list  .item-pdf  .left-rcp-details .pdf-title2').each(function( index ) {
               if($(this).text().toLowerCase().indexOf(value) != -1){
                      $(this).parents(".item-pdf").show();
                        }else{
                  $(this).parents(".item-pdf").hide();
               }
           })
    });

    //link pdf to presentation
    $(document).on('click','.PDF_Present', function () {
        var id = $(this).attr('id');
        var disabled = $(this).attr('disabled');
        if (disabled != 'disabled') {
            if($(this).closest(".item-pdf").has('Is-linked')) {
                var htmlcode = $(this).closest(".item-pdf").html();
                htmlcode = htmlcode.replace('fa-check','fa-link').replace('PDF_Present','PDF_Presentation linkedpdf').replace('class="ref-link edit-pdf-title pull-right" hidden','class="ref-link edit-pdf-title pull-right"');
               $("#tab-21").find(".linked-pdf").append("<div class=\"item-pdf\">" + htmlcode + "</div>");
               var htmledit = "<a class=\"ref-link edit-pdf-title \" ><i class=\"fa fa-edit\"></i></a>"+
                   "<a class=\"ref-link cancel-pdf-title \" hidden ><i class=\"fa fa-close\"></i></a>"+
                   "<a class=\"ref-link save-pdf-title \" hidden><i class=\"fa fa-save\"></i></a>";
                $(".msgPDF").hide();
                $("#tab-21").find('[data-id=' + id + ']').parent().parent().find('.icon-rcp').prepend(htmledit);
                $(this).closest(".item-pdf").addClass("Is-linked");
                $(this).attr('disabled', 'disabled');
                $(this).find('.fa-check').css('color','green');
            }
        }
    })
//Inverse link
    $(document).on('click','.PDF_Presentation', function () {
        var id = $(this).attr('id');
        $("#tab-11").find("#"+id).find('.fa-check').css('color','');
        $("#tab-11").find("#"+id).find(".PDF_Present").removeAttr('disabled');
        $("#tab-11").find("#"+id).parent().find(".edit-pdf-title").remove();
        $("#tab-11").find("#"+id).parent().find(".cancel-pdf-title").remove();
        $("#tab-11").find("#"+id).parent().find(".save-pdf-title").remove();
        $(this).parent().parent().remove();
    }) ;

  //Add object open pdf in modal PresentationModalPdf
    $(document).ready(function(){
        $(document).on('click', '.addModal', function(){
            var url = $(this).attr('data-url');
            var blockId = "object-"+$(this).attr('data-id');
            $(document).find("#"+blockId).html(' <object data="'+url+'" type="application/pdf" style="width: 100%;' +
                ' height:' +
                ' 400px;"></object>');
        });
        $(document).on('click', '.addVideo', function(){
            var url = $(this).attr('data-url');
            var videoId = "object-"+$(this).attr('data-id');
            $(document).find("#"+videoId).html('<video width="320" height="240" controls><source src="' + url + '" type="video/mp4"></video>');
        })
    })
});

/**************************************edit PDF title****************/
$(document).off("click", ".edit-pdf-title").on("click", ".edit-pdf-title", function () {
    var _this = $(this);

    var idPdf= $(this).parent().parent().find(".PDF_Presentation").attr('id');
    $(this).parent().find(".save-pdf-title").show();
    $(this).parent().find(".cancel-pdf-title").show();
    $(this).parent().find(".edit-pdf-title").hide();
    $(this).parent().parent().find(".pdf-title2").hide();
    $(this).parent().find(".PDF_Presentation ").hide();
    $(this).parent().find(".btn-sm").hide();
    $(this).parent().parent().find(".title").hide();
    $(this).parent().parent().find(".icon-list").hide();

    var title= _this.parent().parent().find('[data-id='+idPdf+']').html();
    var html = '<input class="title-pdf-new" value="'+title+'">';
    _this.parent().parent().find('.left-rcp-details').append(html);

    $(document).off("click", ".save-pdf-title").on("click", ".save-pdf-title", function(){

        $(this).parent().find(".save-pdf-title").hide();
        $(this).parent().find(".cancel-pdf-title").hide();
        $(this).parent().find(".edit-pdf-title").show();
        $(this).parent().parent().find(".pdf-title2").show();
        $(this).parent().find(".PDF_Presentation ").show();
        $(this).parent().find(".btn-sm").show();
        $(this).parent().parent().find(".title").show();
        $(this).parent().parent().find(".icon-list").show();
        var idPdf= $(this).parent().parent().find(".PDF_Presentation").attr('id');
        var title= $(this).parent().parent().find(".title-pdf-new").val();

        $(this).parent().parent().find('[data-id='+idPdf+']').text(title);
        var tt =  $("#tab-11").find('[data-id='+idPdf+']').text(title);
        $.post(TWIG.UrlUpload, {idPdf: idPdf, title: title, value:1},
            function (data) {

            });

        $(this).parent().parent().find(".title-pdf-new").remove();
    });
    $(document).off("click", ".cancel-pdf-title").on("click", ".cancel-pdf-title", function(){

        $(this).parent().find(".save-pdf-title").hide();
        $(this).parent().find(".cancel-pdf-title").hide();
        $(this).parent().find(".edit-pdf-title").show();
        $(this).parent().parent().find(".pdf-title2").show();
        $(this).parent().parent().find(".PDF_Presentation ").show();
        $(this).parent().find(".btn-sm").show();
        $(this).parent().find(".title").show();
        $(this).parent().parent().find(".icon-list").show();
        $(this).parent().parent().find(".title-pdf-new").remove();

    });
});
/**************************************end edit PDF title****************/
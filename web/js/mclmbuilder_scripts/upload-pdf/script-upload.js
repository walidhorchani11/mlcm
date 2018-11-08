/**
 * Created by user on 04/10/2016.
 */

$(document).ready(function () {
    var i =0;
    var settings = {
        url: TWIG.UrlUpload,
        dragDrop: true,
        dragDropStr: "<span><b>" + TWIG.upload.dragAndDrop + "</b></span>",
        returnType: "json",
        showDelete: true,
        uploadStr: TWIG.upload.text,
        statusBarWidth:600,
        dragdropWidth:600,
        method: "POST",
        acceptFiles:".pdf",
        fileName: "myfile",
        multiple: true,
        extraHTML:function()
        {
            var html = "<div class='"+i+"' style='display:none'><b>Title: </b><input class='tags-pdf' type='text' id='tags' value='' /> " +
                "<button class='ajax-file-upload-green btAddPdf'>"+TWIG.btAddPdfName+"</button><br/>";
            html += "</div>";
            return html;

        },
        deleteCallback: function (data, pd) {
           // for (var i = 0; i < data.length; i++) {
            i = i-1;
                $.post(TWIG.UrlDeletePdf, {idPdf:$(this).parent().find('.btAddPdf').attr('id'),idPres:TWIG.idPres},
                    function (resp,textStatus, jqXHR) {
                    });
            //}
           pd.statusbar.hide(); //You choice.

        },

        onSuccess:function(files,data,xhr)
        {
            var html ="<div><b>Title: </b><input class='tags-pdf' type='text' id='tags' value='' /> " +
                "<button class='ajax-file-upload-green btAddPdf' id=" + data.id + ">"+TWIG.btAddPdfName+"</button><br/>";
            html += "</div>";
            $(".extrahtml:eq("+i+")").html(html);

            i=i+1;
        },
        onError: function(files,status,errMsg)
        {
            $("#status").html("<font color='red'>Upload is Failed</font>");
        }
    }
    $("#mulitplefileuploader").uploadFile(settings);

    //update pdf
    $(document).on('click','.btAddPdf', function () {
        $(".msgPDF").hide();
        var idPdf =$(this).attr('id');
        var title = $(this).parent().find('#tags').val();
        $.post(TWIG.UrlUpload, {idPdf: idPdf, title: title, value:1},
            function (data) {
                $("#status").html("<font color='green'>Upload is success</font>");
                // var url = TWIG.UrlShowUrlPdf;
                // url = url.replace("id", data.id);
                //Add pdf in tab11
                $("#tab-11").find("#filter-pdf-list").append('<div class="item-pdf" id="'+data.id+'">' +
                    '<div class="pull-left left-rcp-details"><span class="icon-list"><img src="'+TWIG.ImgPdf+'" /></span>' +
                    '<span class="title pdf-title2" data-id="'+data.id+'">'+data.title+'</span>' +
                    '<span class="title pdf-title" >'+data.labelMedia+'</span></div>' +
                    '<div class="icon-rcp pull-right"><a href="'+data.url+'" class="btn btn-sm" target="_blank" title="View">'+
                    // '<div class="icon-rcp pull-right"><a href="'+url+'" class="btn btn-sm" target="_blank" title="View">' +
                    '<i class="p-view-icon"></i> </a>' +
                    '<a class="PDF_Presentation linkedpdf" id="'+data.id+'">' +
                    '<i class="fa fa-check" style="color: green;" aria-hidden="false" ></i></a></div></div>');
                //Add pdf in tab12
                $("#tab-21").find(".linked-pdf").append('<div class=\"item-pdf\" id="'+data.id+'">' +
                    '<div class="pull-left left-rcp-details"><span class="icon-list"><img src="'+TWIG.ImgPdf+'" /></span>' +
                    '<span class="title pdf-title2" data-id="'+data.id+'">'+data.title+'</span>'+
                    '<span class="title pdf-title">'+data.labelMedia+'</span></div>' +
                    '<div class="icon-rcp pull-right"><a class="ref-link edit-pdf-title"><i class="fa fa-edit"></i></a>'+
                    '<a class="ref-link cancel-pdf-title" hidden ><i class="fa fa-close"></i></a>'+
                    '<a class="ref-link save-pdf-title" hidden><i class="fa fa-save"></i></a>' +
                    '<a href="'+data.url+'" class="btn btn-sm" target="_blank" title="View">' +
                    // '<a href="'+url+'" class="btn btn-sm" target="_blank" title="View">' +
                    '<i class="p-view-icon"></i> </a>' +
                    '<a class="PDF_Presentation linkedpdf" id="'+data.id+'">' +
                    '<i class="fa fa-link" aria-hidden="false" ></i> </a></div></div>');
            });
        $(this).parent().parent().parent().remove();
        i = i -1;
    }) ;
});
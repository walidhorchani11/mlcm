$(document).ready(function () {
    var _actionToDropZone = $("#my-awesome-dropzone").attr('action');
    var sended = false;
    var files = null;
    Dropzone.autoDiscover = false;

    var myDropzone = new Dropzone("#my-awesome-dropzone", {
            url: _actionToDropZone,
            autoProcessQueue: false,
            uploadMultiple: false,
            parallelUploads: 100,
            maxFiles: 100,
            acceptedFiles: "image/jpeg,image/png,application/pdf,video/mp4",
            init: function () {
                this.on("error", function (file) {
                    if (!file.accepted) ;
                    $('#addMedia').modal('hide');
                });
                this.on("processing", function (file) {

                });
                this.on("addedfile", function (file) {
                    var FileSize;
                    var FileType = (file.type).split("/");
                    switch (FileType[0]) {
                        case "application":
                            FileSize = (TWIG.pdf_size)*1000000;
                            break;
                        case "image":
                            FileSize = (TWIG.image_size)*1000000;
                            break;
                        case "video":
                            FileSize = (TWIG.video_size)*1000000;
                            break;

                    }
                    if (file.size > FileSize) {
                        myDropzone.removeFile(file);
                        swal("File Size", TWIG.size_message,"warning");
                        if (myDropzone.files.length == 0) {
                            $('#addMedia').modal('hide');
                        }
                    }
                    if (myDropzone.files.length > 1) {
                        $('#addMediaTitle').prop("disabled", true);
                    }
                    sended = false;
                    files = file;
                    $("#addMediaPresentation").val("");
                    $("#addMediaProject").val("");
                    $('#addMedia').modal('show');

                    $('#sendMedia').click(function () {
                        sended = true;
                        $('#addMedia').modal('hide');
                        myDropzone.processQueue();
                    });

                    $('.cancelMediaAdd').click(function () {
                        myDropzone.removeFile(files);
                        $('#addMedia').modal('hide');
                    });
                    if (myDropzone.files.length == 0) {
                        $('#addMedia').modal('hide');
                    }
                    $('#addMedia').on("hidden.bs.modal", function () {
                        //myDropzone.removeAllFiles(true);
                    });
                });

                this.on("complete", function (file, response) {
                    if(file.accepted == false){
                        swal({   title: "Warning!",   text: "You are allowed to upload only jpg, png, pdf or mp4 files."});
                        myDropzone.removeFile(file);
                    }else {
                        setTimeout(function () {
                            myDropzone.removeFile(file);
                            location.reload();
                        }, 1000);
                    }
                });

                this.on("drop", function (file) {

                });
                this.on('sending', function (file, xhr, formData) {
                    formData.append('presentation', $("#addMediaPresentation").val());
                    if ($("#addMediaTitle").val() == "") {
                        formData.append('title', "");
                    }
                    else {
                        formData.append('title', $("#addMediaTitle").val());
                    }
                });
                this.on("sendingmultiple", function (file, xhr, formData) {
                    formData.append('presentation', $("#addMediaPresentation").val());
                    if ($("#addMediaTitle").val() == "") {
                        formData.append('title', "");
                    }
                    else {
                        formData.append('title', $("#addMediaTitle").val());
                    }
                });
                this.on("successmultiple", function (files, response) {
                });
                this.on("errormultiple", function (files, response) {
                });
            }

        }
    );
    $("#addMediaProject").change(function () {
        var idProject = $(this).val();
        $("#addMediaPresentation").find('option').remove().end();
        $.get(TWIG.urlgetproject, {idProject: idProject}, function (Response) {
            for (var i = 0; i < Response.data.length; i++) {

                $("#addMediaPresentation").append('<option value=' + Response.data[i].id + '>' + Response.data[i].nom + '</option>');


            }
            //  console.log(Response.data[0]);


        });
    });
});

Reveal.addEventListener('ready', function () {
    //Check All list
    $("#check-all").click(function(){
        $('#checkboxes').find("input:checkbox").prop('checked', $(this).prop("checked"));
    });
    //select viva or mi
    $('.bt_pdf_mi').click(function()
    {
        if($('#bt-pdf-mi-viva:checked').val() === "veeva"){
            $('.page_id').attr('hidden',true);
            $('.key_message').removeAttr('hidden');
            $('.key_message').find("input").prop('checked', false);
        }else{
            $('.page_id').removeAttr('hidden');
            $('.key_message').attr('hidden',true);
            $('.page_id').find("input").prop('checked', false);
        }
    });
    $('#download_pdf_note').on('click', function () {
        $('#msg-generate-pdf').removeAttr('hidden');
        var valChecked = $('#bt-pdf-mi-viva:checked').val();
        $('.note-duplicate').remove();

        var tabChecked = ['null'];
        $('#checkboxes input:checked').each(function() {
            tabChecked.push($(this).attr('value'));
        });
        console.log(tabChecked);

        var l = Ladda.create(document.querySelector('.ladda-button-pdf'));
        l.start();

        $.ajax({
         url : Routing.generate('presentations_preview_pdf_decktape', {
             'idPres': Route.idPres,
            'idRev': Route.idRev,
            'plateform': valChecked,
            'tabChecked': tabChecked
         }),
         error : function(x, t) {
             l.stop();
             $('#msg-generate-pdf').attr('hidden','true');
             $('#modal_download_pdf').modal('hide');
                $('#modal_save_presentation').modal('hide');
                toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    showMethod: 'slideDown',
                    preventDuplicates: true
                };
                    toastr.error("Your PDF has not been generated. Please contact our support team through" +
                        "support-mcmbuilder@argolife.fr");
            },
         success : function (data) {
             l.stop();
             $('#msg-generate-pdf').attr('hidden','true');
             $('#modal_download_pdf').modal('hide');

         toastr['success']('Your PDF is generated with success! Url: <p><a' +
             ' href="'+data['pdfURL']+'" target="_blank">'+data['pdfName']+'.pdf</a></p>',
         'Generate PDF');
         }
         });

    });
});
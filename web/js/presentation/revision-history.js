Reveal.addEventListener('ready', function () {
    //Check All list
    $('#versionLabel').click(function (e) {
        e.preventDefault();
        $('#modal_version_history').modal('show');
    });
    // Cancel save new version revision
    $('#cancel-new-version').click(function (e) {
        e.preventDefault();
        $('#modal_upload_new_version_history').modal('hide');
        $('#modal_version_history').modal('show');
    });

    // Upload version revision
    $('#save-new-version').click(function (e) {
        var idRev = $('#modal_upload_new_version_history').find('.idRevSave').text();
        $.ajax({
            url : Routing.generate('presentation_save_new_revision', {
                'idPres': Route.idPres,
                'idRev': idRev
            }),
            error : function(x, t) {
                toastr.options = {
                    closeButton: true,
                    progressBar: true,
                    showMethod: 'slideDown',
                    preventDuplicates: true
                };
                toastr.error("Your Revision has not been generated. Please contact our support team through" +
                    "support-mcmbuilder@argolife.fr");
            },
            success : function (data) {
               window.location.reload();
            }


    });
    });

    //New version
    $( document ).on( "click", ".upload-new-version", function(e) {
        e.preventDefault();
        $('#modal_version_history').modal('hide');
        $('#modal_upload_new_version_history').modal('show');
        var idSelectRevision = $(this).attr('id') ;
        $('#modal_upload_new_version_history').find('.idRevSave').append(idSelectRevision);

        var listRevision = $('#list-revision');
        var versionSelectRevision = listRevision.find('tr[id="'+ idSelectRevision +'"]').find('.version-revision').text();
        var $oldVersion =  $('#modal_upload_new_version_history').find('.old-version');
        $oldVersion.empty();
        $oldVersion.append('"' + versionSelectRevision + '"');

        var lastRevisionVersion = listRevision.find('tr').last().find('.version-revision').text();
        var index = lastRevisionVersion.indexOf('.') ;
        var newlastVersion = parseInt(lastRevisionVersion.substring(index + 1 )) + 1 ;
        var firstValueVersion = lastRevisionVersion.substring(0, index + 1 ) ;
        var $newVersion = $('#modal_upload_new_version_history').find('.new-version');
        $newVersion.empty();
        $newVersion.append(' "' + firstValueVersion + newlastVersion +'"');
    });

});
var status = true;
var cpt = 0;

function refresh_approve(e) {
    if ((e.which || e.keyCode) === 116) {
            $('#modal_approve_presentation').modal('show');
        e.preventDefault();
    }
}
toastr.options = {
    closeButton: true,
    progressBar: true,
    showMethod: 'slideDown',
    preventDuplicates: true,
    timeOut: 3500
};
$(document).on('click', '.approvedList', function() {

    var obj = $(this);
    var url = $(this).attr('data-href');
    var id = $(this).attr('data-id');
    var masterName = $(this).attr('data-name');
    $.get(urlGetLocalisations, {
        idMaster: id
    }, function(data) {
        approve(data.list, obj);
    });

    function approve(list, obj) {
        swal({
                title: TWIG.approvedpres,
                text: TWIG.approvedpres,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, approve it!",
                closeOnConfirm: true
            },
            function() {
                obj.replaceWith('<img src="' + waitPath + '" style="width: 46px;"/>');
                $(document).on('keydown', function(e) {
                    refresh_approve(e);
                });

                for (var i = 0; i < list.length; i++) {
                        sendRequest(i, url, id, list[i].id, list[i].name, list.length + 1, function(Resp, i) {

                            if (status === 'true' && i === list.length -1) {
                                sendRequest(i, url, id, null, masterName, list.length + 1, function(Resp) {
                                    location.reload(true);
                                });
                            }
                            if(i === list.length -1){
                                location.reload(true);
                            }
                        });
                }
                if(list.length === 0){
                    sendRequest(i, url, id, null, masterName, list.length + 1, function(Resp) {
                        location.reload(true);
                    });
                }

            });
    }
});

function sendRequest(i, url, idMaster, idLoc, name, l, callback) {
    if(cpt > l ){
        cpt = 1;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: {
            idLoc: idLoc,
            idMaster: idMaster
        },
        success: function(data) {
            cpt ++;
            toastr.success('the presentation ' + cpt + '/' + l + ' ' + data.presentation + ' has been successfully' +
                ' approved.');
            return callback("true", i);
        },
        error: function(data) {
            toastr.error('the presentation ' + name + ' is failed .');
            status = false;
            return callback("false", i);
        }
    });

}
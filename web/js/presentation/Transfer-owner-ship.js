$(document).ready(function() {


    $('#newowner-custom').autocomplete({
        autoFocus: true,
        source: users,
        select: function(event, ui) {

            $('#newowner-custom').attr('data-id', ui.item.id);
            $('#newowner-custom').attr('data-role', ui.item.role);
            $('#newowner-custom').val(ui.item.value);
            return false;
        }
    });
    $('#newowner').autocomplete({
        autoFocus: true,
        source: users,
        select: function(event, ui) {

            $('#newowner').attr('data-id', ui.item.id);
            $('#newowner').attr('data-role', ui.item.role);
            $('#newowner').val(ui.item.value);
            return false;
        }
    });

    var tableResult = [];
    $("#owner-all").click(function(event) {
        $('.transfert-owner-all').show();
        $('.transfert-owner-custom').hide();
    });
    $("#owner-custom").click(function(event) {
        $('.transfert-owner-all').hide();
        $('.transfert-owner-custom').show();
    });
    $("#owner-all-form").submit(function(event) {
        event.preventDefault();
        if ( $('#newowner').attr('data-id') ) {
            $.ajax({
                type: "POST",
                url: AjaxTransferUser,
                data: {
                    ajaxType: 'transferOwner',
                    userOldId: userId,
                    userNewId: $('#newowner').attr('data-id')
                },
                beforeSend: function() {},
                success: function(data) {
                    swal({
                            title: "Transfert complet",
                            text: "All project and presentation was affected to the new Owner!",
                            type: "success",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function() {
                            window.location.href = usersListPath
                        });
                }
            });
        }
    });
    $("#owner-custom-form").submit(function(event) {
            var isChecked = false;
            event.preventDefault();
        if ( $("#newowner-custom").attr('data-id') ) {
            $(".user-result-table > tbody > tr:visible").each(function (key, value) {
                if ($('#input' + $(this).data('id')).is(':checked')) {
                    isChecked = true;
                    tableResult[$(this).data('id')] = {
                        type: $(this).children()[1].innerText,
                        id: $(this).children()[3].innerText,
                        name: $(this).children()[2].innerText,
                        oldOwnerId: userId,
                        newOwnerId: $("#newowner-custom").attr('data-id'),
                        newOwnerName: $("#newowner-custom").val(),
                        newOwnerRole: $("#newowner-custom").attr('data-role'),
                        colonId: $(this).data('id')
                    };
                    $(this).hide();
                }
            });

            $("#newowner-custom").val("");
            $("#newowner-custom").attr("data-id", '');
            if (isChecked == true) {

                $(".message-table").hide();
                $(".user-result-table-custom").show();

                var table = "";
                for (key in tableResult) {
                    var affect = tableResult[key];
                    table += '<tr>';
                    table += '<td><input type="checkbox" checked class="i-checks"></td>';
                    table += '<td>' + affect["type"] + '</td>';
                    table += '<td>' + affect["name"] + '</td>';
                    table += '<td>' + affect["newOwnerName"] + '</td>';
                    table += '<td>' + affect["newOwnerRole"] + '</td>';
                    table += '<td><a href="javascript:void(0)" id="' + affect["colonId"] + '" class="btn delete-affected-owner" data-toggle="tooltip" data-original-title="Delete" ><i class="fa fa-times" aria-hidden="true"></i></a></td>';
                    table += '</tr>'
                }
                $("#skeleton-table").html(table)
            } else {
                swal({
                    title: "you must choose a presentation!",
                    animation: "slide-from-top",
                    timer: 1200,
                    showConfirmButton: false
                });
            }
        }
    });
    $('.button-transfert').click(function(event) {
        if ($('#table_liste >tbody >tr:visible').length > 0) {
            swal({
                title: "you must transfer all projects and presentaions",
                text: "you must transfer all projects and presentaions!",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: false,
                closeOnCancel: false
            });
        } else {

            $.ajax({
                type: "POST",
                url: AjaxTransferUser,
                data: {
                    ajaxType: 'transferOwnerCustom',
                    data: tableResult,
                    user: userId
                },
                beforeSend: function() {},
                success: function(data) {
                    swal({
                            title: "Transfert complet",
                            text: "All project and presentation was affected to the new Owner list!",
                            type: "success",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function() {
                            window.location.href = usersListPath
                        });
                }
            });
        }
    });
    $(document).on('click', '.delete-affected-owner', function() {
        var idTr = $(this).attr('id');
        $("[data-id='" + idTr + "']").show();
        $("[data-id='" + idTr + "'] > td input").prop('checked', false);
        $(this).parent().parent().remove();
        tableResult.splice(idTr);

        if ($('.user-result-table-custom >tbody >tr').length == 0) {
            $(".user-result-table-custom").hide();

        }
    })
});
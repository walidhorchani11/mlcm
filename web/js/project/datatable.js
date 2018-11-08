var languages = {
    'fr': {
        "sProcessing": "Traitement en cours...",
        "sSearch": "Rechercher&nbsp;:",
        "sLengthMenu": "Afficher _MENU_ &eacute;l&eacute;ments",
        "sInfo": "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        "sInfoEmpty": "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
        "sInfoFiltered": "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        "sInfoPostFix": "",
        "sLoadingRecords": "Chargement en cours...",
        "sZeroRecords": "Aucun &eacute;l&eacute;ment &agrave; afficher",
        "sEmptyTable": "Aucune donn&eacute;e disponible dans le tableau",
        "oPaginate": {
            "sFirst": "Premier",
            "sPrevious": "Pr&eacute;c&eacute;dent",
            "sNext": "Suivant",
            "sLast": "Dernier"
        },
        "oAria": {
            "sSortAscending": ": activer pour trier la colonne par ordre croissant",
            "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
        }
    },
    'en': {
        "sEmptyTable": "No data available in table",
        "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
        "sInfoEmpty": "Showing 0 to 0 of 0 entries",
        "sInfoFiltered": "(filtered from _MAX_ total entries)",
        "sInfoPostFix": "",
        "sInfoThousands": ",",
        "sLengthMenu": "Show _MENU_ entries",
        "sLoadingRecords": "Loading...",
        "sProcessing": "Processing...",
        "sSearch": "Search:",
        "sZeroRecords": "No matching records found",
        "oPaginate": {
            "sFirst": "First",
            "sLast": "Last",
            "sNext": "Next",
            "sPrevious": "Previous"
        },
        "oAria": {
            "sSortAscending": ": activate to sort column ascending",
            "sSortDescending": ": activate to sort column descending"
        }
    }
};

$(document).ready(function() {

    /**************js datatable companies search******************/

    $('.dataTables-companies').DataTable({
        language: languages[TWIG.currentLanguage],
        "columnDefs": [{
            "orderable": false,
            "targets": 3
        } // Disable ordering for column 2
        ]
    });

    /**************js datatable reference******************/

    $('.dataTables-reference').DataTable({
        language: languages[TWIG.currentLanguage],

    });

    /**************js datatable users search******************/

    var table_users = $("#dataTables_users").DataTable({
        language: languages[TWIG.currentLanguage],
        "order": [
            [0, "asc"]
        ],
        "columnDefs": [{
            "orderable": false,
            "targets": 4
        } // Disable ordering for column 2
        ]
    });

    $(".dataTables-project .text-columns").each(function(i) {

        var i = $(this).attr("data-column");

        var text = $('<div class="col-md-4"><input type="text" placeholder="' + TWIG.territoriesproject + '" class="form-control"/></div>');
        text.appendTo($('.form-inputs'));
        text.find('input').on('keyup change', function() {
            table_project.column(i)
                .search($(this).val())
                .draw();
        });


    });

    /**************js Project search by select******************/

    $(".dataTables-project .select-columns").each(function(i) {

        var i = $(this).attr("data-column");
        var label = $(this).text();
        var select = $('<div class="col-md-4"><select class="form-control col-md-4"><option value="">' + TWIG.chooseproject + ' ' + label + '</option></select></div>')
        select.appendTo($('.form-inputs'));
        select.find('select').on('change', function() {
            table_project.column(i)
                .search($(this).val())
                .draw();
        });

        table_project.column(i).data().unique().sort().each(function(d, j) {
            select.find('select').append('<option value="' + d + '">' + d + '</option>')
        });

    });

    /**************js users search by text name******************/

    $("#dataTables_users .text-columns").each(function(i) {

        var i = $(this).attr("data-column");
        var title = $(this).text();

        var text = $('<div class="col-md-4"><label>' + title + '</label><input type="text" placeholder="' + TWIG.usernamesearch + '" class="form-control"/></div>');
        text.appendTo($('.form-inputs'));
        text.find('input').on('keyup change', function() {
            table_users.column(i)
                .search($(this).val())
                .draw();
        });


    });
    $('.function-input').on('keyup change', function() {
        var i = $('.popup-columns').attr("data-column");
        table_users.column(i)
            .search($(this).val())
            .draw();
    });

    /**************js users search by select******************/

    $("#dataTables_users .select-columns").each(function(i) {

        var i = $(this).attr("data-column");
        var title = $(this).text();

        var select = $('<div class="col-md-4"><label>' + title + '</label><select class="form-control col-md-4"><option value="">Choose</option></select></div>')
        select.appendTo($('.form-inputs'));
        select.find('select').on('change', function() {
            table_users.column(i)
                .search($(this).val())
                .draw();
        });

        table_users.column(i).data().unique().sort().each(function(d, j) {
            select.find('select').append('<option value="' + d + '">' + d + '</option>')
        });

    });

    /**************js confirm delete user******************/
    $('#dataTables_users tbody').on('click', 'td.action .delete-user', function() {
        var url = $(this).attr('data-href');
        swal({
                title: TWIG.deleteuser,
                text: TWIG.deleteusertext,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function() {
                document.location.href = url;
            });
    });
    /**************js confirm transfert user owner ******************/
 /**************js Waiting terms validations******************/
    $('#dataTables_users tbody').on('click', 'td.action .waiting-terms', function() {
        swal(
            'Notification',
            '“You can’t edit the user when his status is “waiting for terms validation. Please contact the support if necessary”.',
            'info'
        )

    });
    /**************js Waiting terms validations ******************/

    $('#dataTables_users tbody').on('click', 'td.action .delete-user-owner', function() {
        var url = $(this).attr('data-href');
        swal({
                title: 'Are you sure you want to delete this User ?',
                text: 'To delete this user you have first transfer all the projects and the presentations that  he owns to another user.',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, transfer the ownership!",
                closeOnConfirm: false
            },
            function() {
                document.location.href = url;
            });
    });

    $('.dataTables-companies tbody').on('click', 'td.action .delete-company', function() {
        var url = $(this).attr('data-href');

        swal({
                title: TWIGCompany.deletecompanytext,
                text: TWIGCompany.deletecompany,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function() {
                document.location.href = url;
            });
    });
});
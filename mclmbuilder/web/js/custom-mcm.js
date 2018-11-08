
$(document).ready(function(){


    //Ajout bloc filter sura la table de recherche
    $( ".dataTables_length" ).clone(true, true).insertAfter( "#DataTables_Table_0_paginate" );

    //Ajout bloc de pagination sur la table
    $( ".dataTables_paginate" ).clone(true, true).insertAfter("#DataTables_Table_0_length" );



    /*users paginations*/
    $( "#dataTables_users_length" ).clone(true, true).insertBefore( "#dataTables_users_paginate" );
    $('#dataTables_users_wrapper > div.row:first-child').addClass('firstNumPagination');
    $( "#dataTables_users_paginate" ).clone(true, true).insertAfter( '.firstNumPagination #dataTables_users_length' );
    /*fin users Pagination*/



    /*presentaion pagination*/

   // $("#presentation_table_length").clone(true, true).insertBefore("#presentation_table_paginate");

    //$('#presentation_table_wrapper > div.row:first-child').addClass('firstNumPagination');

   // $("#presentation_table_paginate").clone(true, true).insertAfter("#presentation_table_length");


   /* var data = {a: 'foo', b: 'bar'};
    console.log(data);
    alert(data);*/

    //Ajout de class sur le bloc recherche

    $( ".ibox-tools" ).addClass( "btn-creation" );

    $( "#DataTables_Table_0_filter" ).addClass( "inner-blc" );
    $( ".ibox-tools" ).addClass( "inner-blc" );

    $( ".inner-blc" ).wrapAll( "<div class='new-blc' />");

    $( "#dataTables_users_filter" ).insertBefore( ".inner-blc");

    //deplacement de bloc search et bouton cretion dans un meme bloc
    $(".new-blc").prependTo('.ibox-content');


    $('#create_presentation > div').addClass('form-group');

    $('#create_project > div').addClass('form-group');

    $('#fos_user_change_password_form > div').addClass('form-group');
    $('#fos_user_resetting_form > div').addClass('form-group');


    /*correction bloc container de pagination*/
    $(function() {
        $('.dataTables_wrapper > .row > div').attr('class', 'col-md-12');
    });







});/*fin script*/


// check if an element exists into an array
Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

// return unique values
Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
};

var actives_projects_table,
    $ownerName = $('#ownerName'),
    $startDate = $('#startDate'),
    $companyName = $('#companyName');

$(document).ready(function () {
    var ownerName = '',
        startDate = '',
        companyName = '';

    actives_projects_table = $('.projects-status-table').DataTable({
        language: languages[TWIG.currentLanguage],
        "searching": true,
        "processing": true,
        "serverSide": true,
        "pageLength": 20,
        "columnDefs": [
            { "orderable": false, "targets": 4 },
        ],
        "order": [],
        "sAjaxDataProp": "data",
        "ajax": {
            "url": Routing.generate(TWIG.route),
            "data": {
                "twigParent": TWIG.twigParent,
                "companyName": function () {
                    $('#companyName').on('change', function () {
                        companyName = this.value;
                    });
                    return companyName;
                },
                "ownerName": function () {
                    $('#ownerName').on('keyup', function () {
                        ownerName = this.value;
                    });
                    return ownerName;
                },
                "startDate": function () {
                    $('#startDate').on('change', function () {
                        startDate = this.value;
                    });
                    return startDate;
                }
            }
        },
        "columns": [
            {"data": "projectName"},
            {"data": "company"},
            {"data": "owner"},
            {"data": "startDate"},
            {"data": "actions"}
        ]
    });
    $ownerName.on('keyup', function () {
        actives_projects_table
            .search(this.value)
            .column(0)
            .draw();
    });

    /*$startDate.on('change', function () {
        actives_projects_table
            .search(this.value)
            .column(3)
            .draw();
    });*/
    $startDate.on('change', function () {
        var data =this.value;
         $('#search-date-pick').unbind('click').bind('click', function () {
            actives_projects_table
                .search(data)
                .column(3)
                .draw();
        });
    });

    $companyName.on('change', function () {
        actives_projects_table
            .search(this.value)
            .column(1)
            .draw();
    });

    actives_projects_table.one( 'xhr', function () {
        var json = actives_projects_table.ajax.json(),
            startDatesArray = [],
            companiesArray  = [];

        for (var i = 0; i < json.data.length; i ++) {
            startDatesArray.push(json.data[i].startDate);
            //companiesArray.push(json.data[i].company);
        }

        startDatesArray = startDatesArray.unique();
        companiesArray   = companiesArray.unique();
        for ( var i = 0; i < json.filter.length; i ++) {
            companiesArray.push(json.filter[i].companyName);
        }
        companiesArray = companiesArray.unique();
      /*  var starts = '';
        for (i = 0; i < startDatesArray.length; i++) {
            starts +=  '<option value="' + startDatesArray[i] + '">' + startDatesArray[i]+ '</option>';
        }
        $startDate.html( '<option value="" selected>' + "start date" +'</option>' + starts );*/


        var companies = '';
        for (i = 0; i < companiesArray.length; i++) {
            companies +=  '<option value="' + companiesArray[i] + '">' + companiesArray[i]+ '</option>';
        }
        $companyName.append( companies );

    });

    $('div.dataTables_wrapper div.dataTables_filter').css('display', 'none');

    $(".projects-status-table").closest('.row').addClass('table-responsive');
});


$( document ).ajaxSuccess(function () {

    var data = actives_projects_table.ajax.json().data;
    var userRole = actives_projects_table.ajax.json().userRole;
    var userId = actives_projects_table.ajax.json().userId;
    var listCompanyUser = actives_projects_table.ajax.json().listCompUser;
    var actions = $( "a.actions" );
    actions.each(function (j) {
        var companyId = data[j].companyId;
        var parent      = $(this).parent();
        var aEdit       = insertLink(data[j].editUrl, "p-edit-icon", TWIG.LabelEdit );
        var aView       = insertLink(data[j].viewUrl, "fa fa-eye", TWIG.LabelView );
        var aDelete     = insertLink("#", "p-trash-icon", TWIG.LabelDelete , data[j].deleteUrl, 'delete-project' );
        if( jQuery.inArray('ROLE_MANAGER', userRole) == -1 && jQuery.inArray('ROLE_ADMIN', userRole) == -1 && jQuery.inArray('ROLE_SUPER_ADMIN', userRole) == -1) {

            parent.html("");
        }
        if( jQuery.inArray('ROLE_MANAGER', userRole) != -1 || jQuery.inArray('ROLE_ADMIN', userRole) != -1 || jQuery.inArray('ROLE_SUPER_ADMIN', userRole) != -1 || jQuery.inArray(userId, data[j].basicUsersPres ) != -1 ) {
            parent.prepend(aView);
        }
        if( ((jQuery.inArray('ROLE_MANAGER', userRole) != -1 || jQuery.inArray('ROLE_ADMIN', userRole) != -1) && jQuery.inArray(companyId, listCompanyUser) != -1) || jQuery.inArray('ROLE_SUPER_ADMIN', userRole) != -1 || userId ==  data[j].ownerId ) {
             aEdit.insertAfter(aView);

            if (TWIG.twigParent === 'active') {
                var aDuplicate  = insertLink("#", "fa fa-copy", TWIG.LabelDuplicate , data[j].urlDuplicate, 'duplicate-project');
                parent.append(aDuplicate);
            }
            if(data[j].ownerId == userId ||  jQuery.inArray('ROLE_ADMIN', userRole) != -1 || jQuery.inArray('ROLE_SUPER_ADMIN', userRole) != -1) {
                parent.append(aDelete);
            }
        }else{
            parent.html("");
            parent.append(aView);
        }

    });

    var archiveTwig = $(".archive-project"),
        aArchive = archiveTwig.find( $("a") );

    aArchive.addClass("btn")
        .attr('data-toggle', 'tooltip')
        .attr('data-original-title', 'Active');

    archiveTwig.find( $("span") ).addClass("label label-primary")
        .text(TWIG.activeBtn);

    var activeTwig = $(".active-project"),
        aActive = activeTwig.find( $("a") );

    aActive.addClass("btn")
        .attr('data-toggle', 'tooltip')
        .attr('data-original-title', 'Archive');
    activeTwig.find( $("span") ).addClass("label label-primary")
        .text(TWIG.archiveBtn);

    archiveTwig.on('click', function () {
        var url     = $(this).attr('data-href');
        var params  = {
            title: TWIG.archiveTitle,
            text: TWIG.archiveMessage,
            type: "warning",
            cancelButtonText: TWIG.cancel,
            showCancelButton: true,
            confirmButtonColor: "#f8ac59",
            confirmButtonText: TWIG.archiveBtConf,
            closeOnConfirm: false
        };
        mcmSwal(params, url);

    });

    var deleteProj = $(".delete-project");
    deleteProj.on('click', function () {
        var url     = $(this).attr('data-href');
        var params  = {
            title: TWIG.removeTitle,
            text: TWIG.removeMessage,
            type: "warning",
            cancelButtonText: TWIG.cancel,
            showCancelButton: true,
            confirmButtonColor: "#f8ac59",
            confirmButtonText: TWIG.removeBtnConf,
            closeOnConfirm: false
        };
        mcmSwal(params, url);

    });
    var duplicateProj = $(".duplicate-project");
        duplicateProj.on('click', function () {
            var url     = $(this).attr('data-href');
            var params  = {
                title: TWIG.duplicateTitle,
                text: TWIG.duplicateMessage,
                type: "warning",
                cancelButtonText: TWIG.cancel,
                showCancelButton: true,
                confirmButtonColor: "#f8ac59",
                confirmButtonText: TWIG.duplicateBtConf,
                closeOnConfirm: false
            };
            mcmSwal(params, url);

        });

    activeTwig.on('click', function () {
        var url     = $(this).attr('data-href');
        var params  = {
            title: TWIG.activeTitle,
            text: TWIG.activeMessage,
            type: "warning",
            cancelButtonText: TWIG.cancel,
            showCancelButton: true,
            confirmButtonColor: "#f8ac59",
            confirmButtonText: TWIG.activeBtConf,
            closeOnConfirm: false
        };
        mcmSwal(params, url);
    });

    // functions
    function insertLink(href, icon, title, dataHref, addClass) {
        var a = $( "<a></a>" );
        a.attr('href', href)
            .attr('class', 'btn')
            .attr('title', title)
            .attr('data-toggle', 'tooltip')
            .attr('data-original-title', title)
            .css('display', 'inline')
            .html( '<i class="' + icon + '" aria-hidden="true"></i>');

        dataHref = dataHref || '#';
        if (dataHref !== '#') {
            a.attr('data-href', dataHref);
        }

        addClass = addClass || '';
        if (addClass !== '') {
            a.addClass(addClass);
        }

        return a;
    }
    $('[data-toggle="tooltip"]').tooltip({
        position: {
            my: "center bottom-20",
            at: "center top",
            using: function( position, feedback ) {
                $( this ).css( position );
                $( "<div>" )
                    .addClass( "arrow" )
                    .addClass( feedback.vertical )
                    .addClass( feedback.horizontal )
                    .appendTo( this );
            }
        }
    });



    // swal function
    function mcmSwal(params, url) {
        swal(
            params,
            function () {
                document.location.href = url;
            }
        );
    }

});
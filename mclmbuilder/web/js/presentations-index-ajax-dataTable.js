$(document).ready(function() {

    var presentationName = '';
    var status = '';
    var type = '';
    var product = '';
    var company = '';
    var agency = '';
    var project = '';
    var owner = '';
    var territory = '';
    Array.prototype.contains = function(v) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === v) return true;
        }
        return false;
    };

    Array.prototype.unique = function() {
        var arr = [];
        for (var i = 0; i < this.length; i++) {
            if (!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr;
    };

    var presentation_table = $('#presentation_table').DataTable({

        language: languages[TWIG.currentLanguage],

        "searching": true,
        "processing": true,
        "serverSide": true,
        "pageLength": 10,

        "columnDefs": [
            // { "orderable": false, "targets": 0 },
            // { "orderable": false, "targets": 3 },
            // { "orderable": false, "targets": 8 }
        ],
        "order": [],
        "ajax": {
            "url": Routing.generate(TWIG.route),
            "data": {
                "presentationName": function() {
                    $('#presentationName').on('keyup', function() {
                        presentationName = this.value;
                    });
                    return presentationName;
                },
                "type": function() {
                    $('#clmType').on('change', function() {
                        type = this.value;
                    });
                    return type;
                },
                "status": function() {
                    $('#status').on('change', function() {
                        status = this.value;
                    });
                    return status;
                },
                "product": function() {
                    $('#product').on('change', function() {
                        product = this.value;
                    });
                    return product;
                },
                "company": function() {
                    $('#company').on('change', function() {
                        company = this.value;
                    });
                    return company;
                },
                "agency": function() {
                    $('#agency').on('change', function() {
                        agency = this.value;
                    });
                    return agency;
                },
                "project": function() {
                    $('#project').on('change', function() {
                        project = this.value;
                    });
                    return project;
                },
                "owner": function() {
                    $('#owner').on('change', function() {
                        owner = this.value;
                    });
                    return owner;
                },
                "territory": function() {
                    $('#territory').on('change', function() {
                        territory = this.value;
                    });
                    return territory;
                },
                "twigParent": TWIG.twigParent
            }
        },
        "sAjaxDataProp": "data",
        "columns": [{
            "data": "name"
        },
            {
                "data": "project"
            },
            // {"data": "product"},
            {
                "data": "type"
            },
            {
                "data": "territories"
            },
            {
                "data": "status"
            },
            {
                "data": "version"
            },
            {
                "data": "owner"
            },
            {
                "data": "creationDate"
            },
            {
                "data": "presentation_actions"
            }
        ]
    });

    var colvis = new $.fn.dataTable.ColVis(presentation_table, {
        buttonText: TWIG.presentationbuttonfilter,
        activate: 'click',
        exclude: [0]
    });
    $(colvis.button()).insertBefore('div.dataTables_length');
    $('.ColVis').parent().append('<div class="label-colvis">' + TWIG.presentationbuttontext + ':</div>');

    presentation_table.one('xhr', function() {
        if (presentation_table.ajax.json().data.length > 0) {
            var json = presentation_table.ajax.json();
            var types = [];
            var softwares = [];
            var products = json.productForSearch;
            var companies = [];
            var agencies = [];
            var projects = [];
            var owners = [];
            var territories = [];

            for (var i = 0; i < json.filter.length; i++) {
                types.push(json.filter[i].type);
                softwares.push(json.filter[i].status);
                companies.push(json.filter[i].companyName);
                agencies.push(json.filter[i].agencyName);
                projects.push(json.filter[i].project);
                if (json.filter[i].owner !== null && json.filter[i].owner !== " ") {
                    owners.push(json.filter[i].owner);
                }
                territories.push(json.filter[i].territories);
            }

            types = types.unique();
            softwares = softwares.unique();
            companies = companies.unique();
            agencies = agencies.unique().filter(Boolean);
            projects = projects.unique();
            owners = owners.unique().filter(Boolean);
            territories = territories.unique();
            territories.sort();
            var htmlTypes = '';
            for (i = 0; i < types.length; i++) {
                htmlTypes = htmlTypes + '<option value="' + types[i] + '">' + types[i] + '</option>';

            }
            var selectType = $('#clmType');
            selectType.html('<option value="" selected>' + TWIG.presentationAll + '</option>' + htmlTypes);

            var htmlProducts = '';
            for (i = 0; i < products.length; i++) {
                htmlProducts = htmlProducts + '<option value="' + products[i] + '">' + products[i] + '</option>';

            }
            var selectProduct = $('#product');
            //  selectType.append(htmlTypes);
            selectProduct.html('<option value="" selected>' + TWIG.presentationAll + '</option>' + htmlProducts);

            var htmlSoftwares = '';
            for (i = 0; i < softwares.length; i++) {
                htmlSoftwares = htmlSoftwares + '<option value="' + softwares[i] + '">' + softwares[i] + '</option>';
            }
            var selectSoftwares = $('#status');
            //selectSoftwares.append(htmlSoftwares);
            selectSoftwares.html('<option value="" selected>' + TWIG.presentationAll + '</option>' + htmlSoftwares);

            var htmlCompanies = '';
            for (i = 0; i < companies.length; i++) {
                htmlCompanies = htmlCompanies + '<option value="' + companies[i] + '">' + companies[i] + '</option>';

            }
            var selectCompany = $('#company');
            selectCompany.html('<option value="" selected>' + TWIG.presentationAll + '</option>' + htmlCompanies);

            var htmlAgency = '';
            for (i = 0; i < agencies.length; i++) {
                htmlAgency = htmlAgency + '<option value="' + agencies[i] + '">' + agencies[i] + '</option>';

            }
            var selectAgency = $('#agency');
            selectAgency.html('<option value="" selected>' + TWIG.presentationAll + '</option>' + htmlAgency);

            var htmlProject = '';
            for (i = 0; i < projects.length; i++) {
                htmlProject = htmlProject + '<option value="' + projects[i] + '">' + projects[i] + '</option>';

            }
            var selectProject = $('#project');
            selectProject.html('<option value="" selected>' + TWIG.presentationAll + '</option>' + htmlProject);

            var htmlOwner = '';
            for (i = 0; i < owners.length; i++) {
                htmlOwner = htmlOwner + '<option value="' + owners[i] + '">' + owners[i] + '</option>';

            }
            var selectOwnert = $('#owner');
            selectOwnert.html('<option value="" selected>' + TWIG.presentationAll + '</option>' + htmlOwner);

            var htmlTerritory = '';
            for (i = 0; i < territories.length; i++) {
                htmlTerritory = htmlTerritory + '<option value="' + territories[i] + '">' + territories[i] + '</option>';

            }
            var selectTerritory = $('#territory');
            selectTerritory.html('<option value="" selected>' + TWIG.presentationAll + '</option>' + htmlTerritory);
        }
    });


    $('#presentationName').on('keyup', function() {
        presentation_table
            .search(this.value)
            .column(0)
            .draw();
    });


    $('#status').on('change', function() {
        presentation_table
            .search(this.value)
            .column(5)
            .draw();
    });

    $('#clmType').on('change', function() {
        presentation_table
            .search(this.value)
            .column(3)
            .draw();
    });

    $('#product').on('change', function() {
        presentation_table
            .search(this.value)
            .column(2)
            .draw();
    });

    $('#company').on('change', function() {
        presentation_table
            .search(this.value)
            .column(2)
            .draw();
    });

    $('#agency').on('change', function() {
        presentation_table
            .search(this.value)
            .column(2)
            .draw();
    });

    $('#project').on('change', function() {
        presentation_table
            .search(this.value)
            .column(2)
            .draw();
    });
    $('#owner').on('change', function() {
        presentation_table
            .search(this.value)
            .column(2)
            .draw();
    });
    $('#territory').on('change', function() {
        presentation_table
            .search(this.value)
            .column(2)
            .draw();
    });


    $('#presentation_table_filter label').css('display', 'none');

    $(document).ajaxSuccess(function() {

        var json = presentation_table.ajax.json();
        // add actions
        var actions = $("span.actions");

        actions.each(function(index) {

            var parent = $(this).parent();
            var aEdit = insertEdit(json.data[index].urlEdit, json.data[index].id);
            var aEditForm = insertEditForm(json.data[index].urlEditForm);
            var aDuplicate = insertDuplicate(json.data[index].urlDuplicate, json.data[index].id);
            var aDelete = insertDelete(this, json.data[index].urlDelete);
            var aPlay = insertPLay(json.data[index].urlPreview);

            if (json.data[index].isActive === 20) {

                if (json.data[index].type === 'Standard' || json.data[index].type === 'Master') {

                    if (json.data[index].lock === 10) {
                        if (json.data[index].ownerProjectId === json.userId || json.data[index].ownerId === json.userId ||
                            ((jQuery.inArray('ROLE_MANAGER', json.userRole) !== -1 || jQuery.inArray('ROLE_ADMIN', json.userRole) !== -1) && jQuery.inArray(json.data[index].companyId, json.listCompany) !== -1) ||
                            jQuery.inArray('ROLE_SUPER_ADMIN', json.userRole) !== -1 || jQuery.inArray(json.userId, json.data[index].editors) !== -1) {
                            if (json.data[index].status !== "Approved") {
                                parent.html(aEdit);
                            } else {
                                parent.html("");
                            }
                        } else {
                            parent.html("");
                        }
                        if (json.data[index].ownerProjectId === json.userId || json.data[index].ownerId === json.userId || ((jQuery.inArray('ROLE_MANAGER', json.userRole) !== -1 || jQuery.inArray('ROLE_ADMIN', json.userRole) !== -1) && jQuery.inArray(json.data[index].companyId, json.listCompany) !== -1) || jQuery.inArray('ROLE_SUPER_ADMIN', json.userRole) !== -1) {
                            parent.append(aDuplicate);
                        }
                    } else {
                        if (json.data[index].ownerProjectId === json.userId || json.data[index].ownerId === json.userId || ((jQuery.inArray('ROLE_MANAGER', json.userRole) !== -1 || jQuery.inArray('ROLE_ADMIN', json.userRole) !== -1) && jQuery.inArray(json.data[index].companyId, json.listCompany) !== -1) || jQuery.inArray('ROLE_SUPER_ADMIN', json.userRole) !== -1) {
                            parent.html(aDuplicate);
                        }
                    }
                } else {
                    if (json.data[index].status === "In progress") {
                        parent.html(aEdit);
                    } else {
                        parent.html('');
                    }
                }
                if (json.data[index].ownerProjectId === json.userId || json.data[index].ownerId === json.userId || ((jQuery.inArray('ROLE_MANAGER', json.userRole) !== -1 || jQuery.inArray('ROLE_ADMIN', json.userRole) !== -1) && jQuery.inArray(json.data[index].companyId, json.listCompany) !== -1) || jQuery.inArray('ROLE_SUPER_ADMIN', json.userRole) !== -1 || jQuery.inArray(json.userId, json.data[index].editors) !== -1) {
                    if (json.data[index].status === "In progress") {
                        parent.append(aEditForm);
                    }
                }
                if (json.data[index].type !== "Localisation" || json.data[index].status !== "Wait for master" +
                    " approval") {
                    parent.append(aPlay);
                }
            } else {

                parent.html("");
            }
            if (json.data[index].status !== "Wait for master approval") {
                if (json.data[index].ownerProjectId === json.userId || json.data[index].ownerId === json.userId || ((jQuery.inArray('ROLE_MANAGER', json.userRole) !== -1 || jQuery.inArray('ROLE_ADMIN', json.userRole) !== -1) && jQuery.inArray(json.data[index].companyId, json.listCompany) !== -1) || jQuery.inArray('ROLE_SUPER_ADMIN', json.userRole) !== -1) {
                    parent.append(json.data[index].change);
                }
                // parent.append( aDelete );

            }
            if (json.data[index].ownerProjectId === json.userId || json.data[index].ownerId === json.userId || ((jQuery.inArray('ROLE_ADMIN', json.userRole) !== -1) && jQuery.inArray(json.data[index].companyId, json.listCompany) !== -1) || jQuery.inArray('ROLE_SUPER_ADMIN', json.userRole) !== -1) {
                parent.append(aDelete);
            }



        });


        var activeTwig = $(".active-presentation");
        var aActive = activeTwig.find($("a"));
        aActive.addClass("btn")
            .attr('data-toggle', 'tooltip')
            .attr('data-original-title', 'Archive');

        activeTwig.find($("span")).addClass("label label-warning cccc")
            .text('Archive');

        var archiveTwig = $(".archive-presentation");
        var aArchive = archiveTwig.find($("a"));
        aArchive.addClass("btn")
            .attr('data-toggle', 'tooltip')
            .attr('data-original-title', 'Active');

        archiveTwig.find($("span")).addClass("label label-primary")
            .text('Active');




        activeTwig.on('click', function() {
            var url = $(this).attr('data-href');
            swal({
                    title: TWIG.sweetAlert.title, // GFTIGGGUGH
                    //text: TWIG.sweetAlert.text,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#f8ac59",
                    confirmButtonText: TWIG.sweetAlert.confirmButton,
                    closeOnConfirm: false
                },
                function() {
                    document.location.href = url;
                });
        });
        $(document).on('click', '.delete_pres', function() {
            var url = $(this).attr('data-href');
            swal({
                    title: TWIG.sweetAlert.deleteTitle,
                    text: TWIG.sweetAlert.deleteText,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                },
                function() {
                    $.get(url, function(Response) {
                        location.reload();
                    });
                });
        });


        $(document).on('click', '#moreFilter', function(e) {
            e.preventDefault();
            $('#modal_moreFilter').modal('show');
        });
        var host = presentation_table.ajax.json().host;
        //if(host.indexOf("argolife") >= 0) {
        //  $("table tr th:nth-child(3), table tr td:nth-child(3)").hide();
        //}
    });


    function insertEdit(url, id) {
        var aEdit = $("<a></a>");
        aEdit.attr('data-href', url)
            .attr('data-id', id)
            .attr('class', 'btn edit_pres')
            .attr('title', TWIG.dataTable.edit)
            .attr('data-toggle', 'tooltip')
            .attr('data-original-title', 'Edit')
            .css('display', 'inline')
            .html('<i class="p-edit-icon" aria-hidden="true"></i>');
        //aEdit.appendTo(actions);
        return aEdit;
    }

    function insertEditForm(url) {
        var aEditForm = $("<a></a>");
        aEditForm.attr('href', url)
            .attr('class', 'btn')
            .attr('title', TWIG.dataTable.editForm)
            .attr('data-toggle', 'tooltip')
            .attr('data-original-title', TWIG.dataTable.editForm)
            .css('display', 'inline')
            .html('<i class="fa fa-eye"></i>');
        return aEditForm;
    }

    function insertDelete(node, urlDelete) {

        var aDelete = $("<a></a>");
        aDelete.attr('href', "javascript:void(0)")
            .attr('class', 'btn delete_pres')
            .attr('title', TWIG.dataTable.delete)
            .attr('data-toggle', 'tooltip')
            .attr('data-original-title', 'Edit')
            .attr('data-href', urlDelete)
            .css('display', 'inline')
            .html('<i class="p-trash-icon" aria-hidden="true"></i>');
        //aDelete.appendTo(actions);
        return aDelete;
    }

    function insertDuplicate(urlDuplicate, id) {
        var aDuplicate = $("<a></a>");
        aDuplicate.attr('href', "javascript:void(0)")
            .attr('class', 'btn  pres-duplicate')
            .attr('title', TWIG.dataTable.duplicate)
            .attr('data-toggle', 'tooltip')
            .attr('data-original-title', 'Duplicate')
            .attr('data-href', urlDuplicate)
            .attr('data-id', id)
            .css('display', 'inline')
            .html('<i class="fa fa-copy" aria-hidden="true"></i>');
        return aDuplicate;
    }

    function insertPLay(url) {
        var aPlay = $("<a></a>");
        aPlay.attr('href', url)
            .attr('class', 'btn  pres-play')
            .attr('title', TWIG.dataTable.play)
            .attr('data-toggle', 'tooltip')
            .attr('data-original-title', 'Play')
            .css('display', 'inline')
            .html('<i class="fa fa-play" aria-hidden="true"></i>');
        return aPlay;
    }
});

$(document).ready(function() {
    $(document).on('click', '.archive-presentation', function() {
        var url = $(this).attr('data-href');
        var idPres = $(this).attr('data-id');
        $.get(TWIG.urlIsActiveProject, {
            idPres: idPres
        }, function(R) {
            if (R.success == true) {
                swal({
                        title: "Are you sure, you want to active this presentation?",
                        text: "This CLM presentation will be visible by the others members of the MCM Builder only if you rearchive it",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#f8ac59",
                        confirmButtonText: "Yes, active it!",
                        closeOnConfirm: false
                    },
                    function() {
                        document.location.href = url;
                    });
            } else {
                swal({
                        title: "You cannot activate this MCM presentation?",
                        text: "you should activate the project " + R.projectName + " before",
                        type: "warning"
                    },
                    function() {

                    });
            }
        })

    });

    $("#presentation_table_length").clone(true, true).insertBefore("#presentation_table_paginate");

    $('#presentation_table_wrapper > div.row:first-child').addClass('firstNumPagination');

    $("#presentation_table_paginate").clone(true, true).insertAfter("#presentation_table_length");

    $("#presentation_table").closest('.row').addClass('table-responsive');
});
$('form[name="reference"]').submit(function (e) {
    e.preventDefault();

    var title       = $('#reference_title').val(),
        description = $('#reference_description').val(),
        l           = Ladda.create(document.querySelector('.ladda-button-demo'));

    l.start();

    $.ajax({
        type : "POST",
        data : {
            title       : title,
            description : description,
            idPres      : TWIG.idPres
        },
        dataType : "html",
        url      : TWIG.saveREF,
        cache    : false,

        success : function (data) {
            if (data !== '') {
                $('#tab-1 .section').append(data);
                document.getElementById("reForm").reset();
                for (instance in CKEDITOR.instances) {
                    CKEDITOR.instances[instance].updateElement();
                    CKEDITOR.instances[instance].setData('');
                }
            }
            l.stop();
        }
    });
    e.preventDefault();
    e.stopPropagation();
});
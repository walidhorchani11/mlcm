'use strict';

export const mediaupload = {
    MAX_CONCURRENT_UPLOADS: 2,
    FILE_FORMATS: [{
        validator: /image.png|image.jpeg|image.jpg|image.bmp|image.gif|video.*|application\/pdf/,
        maxSize: SL.config.MAX_IMAGE_UPLOAD_SIZE * 1024
    }],
    init: function(e) {
        this.media = e,
        this.options = {
            multiple: !0
        },
        this.queue = new SL.collections.Collection,
        this.render(),
        this.renderInput(),
        this.bind(),
        SL.editor.controllers.Popin.toastrConfig(),
        toastr.options.timeOut = 7000,
        toastr.options.progressBar = false
    },
    bind: function() {
        this.onUploadCompleted = this.onUploadCompleted.bind(this),
        this.onUploadFailed = this.onUploadFailed.bind(this),
        this.uploadEnqueued = new signals.Signal,
        this.uploadStarted = new signals.Signal,
        this.uploadCompleted = new signals.Signal
    },
    render: function() {
        this.domElement = $('<div class="media-library-uploader">'),
        this.uploadButton = $('<div class="media-library-uploader-button">' + TWIG.mediaLibrary.uploadBtn + ' <span class="icon' +
            ' i-cloud-upload2"></span></div>'),
        this.uploadButton.appendTo(this.domElement),
        this.uploadList = $('<div class="media-library-uploader-list">'),
        this.uploadList.appendTo(this.domElement)
    },
    renderInput: function() {
        this.fileInput && this.fileInput.remove(),
        this.fileInput = $('<input class="file-input" type="file">'),
        this.fileInput.on("change", this.onInputChanged.bind(this)),
        this.fileInput.appendTo(this.uploadButton),
        this.options.multiple ? this.fileInput.attr("multiple", "multiple") : this.fileInput.removeAttr("multiple", "multiple")
    },
    configure: function(e) {
        this.options = $.extend(this.options, e),
        this.options.multiple = true,
        this.renderInput()
    },
    appendTo: function(e) {
        this.domElement.appendTo(e)
    },
    isUploading: function() {
        return this.queue.some(function(e) {
            return e.isUploading()
        })
    },
    validateFile: function(e) {
        let filterType = $('.media-library-filters').attr('filter-type'),
            maximumSize = '';

        if (typeof filterType !== 'undefined' && filterType !== '') {
            switch(filterType.toLowerCase()) {
                case ('images') :
                    this.FILE_FORMATS[0].validator = /image.png|image.jpeg|image.jpg|image.bmp|image.gif/;
                    maximumSize = TWIG.image_size;
                break;
                case ('videos') :
                    this.FILE_FORMATS[0].validator = /video.*/;
                    maximumSize = TWIG.video_size;
                break;
                case ('pdf') :
                    this.FILE_FORMATS[0].validator = /application\/pdf/;
                    maximumSize = TWIG.pdf_size;
                break;
            }
        }
        var t = "number" == typeof e.size ? e.size / 1024 : 0;
        let maxSizeType = '';

        return this.FILE_FORMATS.some(function(i) {
            switch(true) {
                case (e.type.match(/image.*/) !== null) :
                    maxSizeType = TWIG.image_size;
                break;
                case (e.type.match(/video.*/) !== null) :
                    maxSizeType = TWIG.video_size;
                break;
                case (e.type.match(/application\/pdf/) !== null) :
                    maxSizeType = TWIG.pdf_size;
                break;
                default : maxSizeType = 0;
            }

            if (e.type.match(i.validator) === null) {
                setTimeout(function() {
                    toastr.warning(`Please choose a file in <strong>${filterType}</strong> format with maximum size of ${maximumSize} MB`, `File Upload Warning !`);
                }, 500)
            }

            maxSizeType = maxSizeType * 1024;
            return e.type.match(i.validator) ? maxSizeType && t > maxSizeType ? !1 : !0 : !1
        })
    },
    enqueue: function(e) {
        if (this.queue.size() >= 100) return SL.notify("Upload queue is full, please wait", "negative"), !1;
        var t = new SL.models.Media(null, this.media.crud, e);

        t.uploaderElement = $(['<div class="media-library-uploader-item">', '<div class="item-text">', '<span class="status"><span class="icon i-clock"></span></span>', '<span class="filename">' + (e.name || "untitled") + "</span>", "</div>", '<div class="item-progress">', '<span class="bar"></span>', "</div>", "</div>"].join("")),
        t.uploaderElement.appendTo(this.uploadList),
        setTimeout(t.uploaderElement.addClass.bind(t.uploaderElement, "animate-in"), 1),
        t.uploadCompleted.add(this.onUploadCompleted),
        t.uploadFailed.add(this.onUploadFailed),
        t.uploadProgressed.add(function(e) {
            var i = "scaleX(" + e + ")";
            t.uploaderElement.find(".bar").css({
                "-webkit-transform": i,
                "-moz-transform": i,
                transform: i
            })
        }.bind(this)),
        this.queue.push(t),
        this.uploadEnqueued.dispatch(t),
        this.checkQueue()
    },
    dequeue: function(e, t, i) {
        var n = e.uploaderElement;
        n && (e.uploaderElement = null, n.addClass(t), n.find(".status").html(i), setTimeout(function() {
            n.removeClass("animate-in").addClass("animate-out"), setTimeout(n.remove.bind(n), 500)
        }.bind(this), 2e3),this.queue.remove(e), e.isUploaded() && this.uploadCompleted.dispatch(e))
    },
    checkQueue: function() {
        this.queue.forEach(function(e) {
            e.isUploaded() ? this.dequeue(e, "completed", '<span class="icon i-checkmark"></span>') : e.isUploadFailed() && this.dequeue(e, "failed", '<span class="icon i-denied"></span>')
        }.bind(this));
        var e = 0;
        this.queue.forEach(function(t) {
            e < this.MAX_CONCURRENT_UPLOADS && (t.isUploading() ? e += 1 : t.isWaitingToUpload() && (t.upload(), t.uploaderElement.find(".status").html('<div class="upload-spinner"></div>'), e += 1, this.uploadStarted.dispatch(t)))
        }.bind(this)), this.domElement.toggleClass("is-uploading", e > 0)
    },
    onUploadCompleted: function() {
        this.checkQueue()
    },
    onUploadFailed: function(e) {
        SL.notify(e || "An error occurred while uploading your file.", "negative"),
        this.checkQueue()
    },
    onInputChanged: function(e) {
        var t = SL.util.toArray(this.fileInput.get(0).files);

        t = t.filter(this.validateFile.bind(this)),
        t.length ? (
            t.forEach(this.enqueue.bind(this)),
            SL.analytics.trackEditor("Media: Upload file", "file input")
        ) : toastr.error(`Invalid file. We support<br> <strong>IMAGE</strong> : ${TWIG.image_size} MB<br> <strong>PDF</strong> : ${TWIG.pdf_size} MB<br> <strong>MP4</strong> : ${TWIG.video_size} MB`, `File Upload requirement !`),
        //SL.notify("Invalid file. We support<br> <strong>IMAGE</strong> " + SL.config.MAX_IMAGE_UPLOAD_SIZE + " MB<br> <strong>MP4</strong> " + TWIG.video_size + " MB", "negative"),
        this.renderInput(),
        e.preventDefault()
        //t = t.filter(this.validateFile.bind(this)), t.length ? (t.forEach(this.enqueue.bind(this)), SL.analytics.trackEditor("Media: Upload file", "file input")) : SL.notify("Invalid file. We support<br> <strong>PNG</strong>, <strong>JPG</strong>, <strong>GIF</strong> "+TWIG.image_size+" MB<br> <strong>MP4</strong> "+TWIG.video_size+" MB <br>  <strong>PDF</strong> "+TWIG.pdf_size+" MB", "negative"), this.renderInput(), e.preventDefault()
    },
    destroy: function() {
        this.queue = null,
        this.uploadStarted.dispose(),
        this.uploadCompleted.dispose()
    }
};

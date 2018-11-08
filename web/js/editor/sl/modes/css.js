'use strict';

export const modescss = {
    init: function(e) {
        this.userCSSInput = $("#user-css-input"), this.userCSSOutput = $("#user-css-output"), this.parseTimeout = -1, this.userCSSInput.length && (SLConfig.deck.css_input = this.userCSSInput.html() || void 0), this.userCSSOutput.length && (SLConfig.deck.css_output = this.userCSSOutput.html() || void 0), this._super(e, "css")
    },
    render: function() {
        this.domElement = $('<div class="css-editor">').appendTo(document.body), this.headerElement = $("<header>").appendTo(this.domElement), this.headerElement.append(""), this.headerElement.append(''), this.insertImageButton = this.headerElement.find(".insert-image"), this.contentsElement = $(''), this.errorElement = $('<div class="error">').appendTo(this.contentsElement), this.footerElement = $("<footer>").appendTo(this.domElement), this.cancelButton = $('').appendTo(this.footerElement), this.saveButton = $('').appendTo(this.footerElement)
    },
    renderEditor: function() {
        if (!this.cssEditor) {
            try {
                this.cssEditor = ace.edit("ace-less"), this.cssEditor.setTheme("ace/theme/monokai"), this.cssEditor.setDisplayIndentGuides(!0), this.cssEditor.setShowPrintMargin(!1), this.cssEditor.getSession().setMode("ace/mode/less")
            } catch (e) {
                console.log("An error occurred while initializing the Ace editor.")
            }
            this.cssEditor.env.editor.on("change", this.onInputChange.bind(this))
        }
    },
    bind: function() {
        this.insertImageButton.on("click", this.onInsertImageClicked.bind(this)), this.cancelButton.on("click", this.onCancelClicked.bind(this)), this.saveButton.on("click", this.onSaveClicked.bind(this))
    },
    activate: function() {
        this.renderEditor(), this.editor.disableEditing(), this.editor.sidebar.close(!0), this.domElement.addClass("visible"), this.savedCSSInput = SLConfig.deck.css_input, this.savedCSSOutput = SLConfig.deck.css_output, this.currentCSSInput = SLConfig.deck.css_input, this.errorElement.text("").removeClass("visible"), this.cssEditor.env.document.setValue(SLConfig.deck.css_input), clearInterval(this.focusEditorTimeout), this.focusEditorTimeout = setTimeout(function() {
            this.cssEditor.focus()
        }.bind(this), 1e3), Reveal.configure({
            minScale: .4
        }), setTimeout(function() {
            Reveal.layout()
        }, 1), this._super()
    },
    deactivate: function() {
        clearInterval(this.focusEditorTimeout), this.editor.enableEditing(), this.domElement.removeClass("visible"), this._super()
    },
    saveAndClose: function() {
        this.compile(function(e) {
            SLConfig.deck.css_input = this.cssEditor.env.document.getValue(), SLConfig.deck.css_output = e, SLConfig.deck.dirty = !0, SL.editor.controllers.Thumbnail.generate(), this.deactivate()
        }.bind(this), function() {
            SL.notify("Please fix all errors before saving.", "negative")
        }.bind(this))
    },
    compile: function(e, t) {
        this.cssParser || (this.cssParser = new less.Parser);
        var i = this.cssEditor.env.document.getValue();
        this.cssParser.parse(".reveal { " + i + " }", function(i, n) {
            if (i) this.errorElement.addClass("visible"), this.errorElement.html(i.message), t && t.call(null, i), this.cssParser = new less.Parser;
            else {
                this.errorElement.removeClass("visible");
                var r = n.toCSS(),
                    o = "";
                r = r.replace(/@import url\(["'\s]*(http:|https:)?\/\/(.*)\);?/gi, function(e) {
                    return o += e + "\n", ""
                }), r = o + r, this.userCSSOutput.html(r), e && e.call(null, r)
            }
        }.bind(this)), this.currentCSSInput = i
    },
    discard: function() {
        SLConfig.deck.css_input = this.savedCSSInput, SLConfig.deck.css_output = this.savedCSSOutput, this.userCSSOutput.html(SLConfig.deck.css_output || "")
    },
    onInsertImageClicked: function() {
        var e = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {
            select: SL.models.Media.IMAGE
        });
        e.selected.addOnce(function(e) {
            e.isUploaded() ? this.cssEditor.insert(e.get("url")) : e.uploadCompleted.add(function() {
                this.cssEditor.insert(e.get("url"))
            }.bind(this))
        }.bind(this))
    },
    onInputChange: function() {
        clearTimeout(this.parseTimeout), this.parseTimeout = setTimeout(this.compile.bind(this), 500)
    },
    onCancelClicked: function(e) {
        this.currentCSSInput !== this.savedCSSInput ? SL.prompt({
            anchor: $(e.currentTarget),
            title: "You will lose all unsaved changes.",
            alignment: "t",
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Continue</h3>",
                className: "negative",
                callback: function() {
                    this.discard(), this.deactivate()
                }.bind(this)
            }]
        }) : (this.discard(), this.deactivate())
    },
    onSaveClicked: function() {
        this.saveAndClose()
    }
};

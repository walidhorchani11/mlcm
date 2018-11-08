'use strict';

export const code = {
    init: function(e) {
        this._super("code", e), this.editingRequested = new signals.Signal
    },
    setup: function() {
        this._super(), this.properties.code = {
            value: {
                setter: this.setCode.bind(this),
                getter: this.getCode.bind(this)
            },
            language: {
                defaultValue: "none",
                setter: this.setCodeLanguage.bind(this),
                getter: this.getCodeLanguage.bind(this),
                options: [{
                    value: "none",
                    title: "Automatic"
                }, {
                    value: "1c",
                    title: "1C"
                }, {
                    value: "actionscript",
                    title: "ActionScript"
                }, {
                    value: "apache",
                    title: "Apache"
                }, {
                    value: "applescript",
                    title: "AppleScript"
                }, {
                    value: "asciidoc",
                    title: "AsciiDoc"
                }, {
                    value: "bash",
                    title: "Bash"
                }, {
                    value: "clojure",
                    title: "Clojure"
                }, {
                    value: "cmake",
                    title: "CMake"
                }, {
                    value: "coffeescript",
                    title: "CoffeeScript"
                }, {
                    value: "cpp",
                    title: "C++"
                }, {
                    value: "cs",
                    title: "C#"
                }, {
                    value: "css",
                    title: "CSS"
                }, {
                    value: "d",
                    title: "D"
                }, {
                    value: "delphi",
                    title: "Delphi"
                }, {
                    value: "diff",
                    title: "Diff"
                }, {
                    value: "django",
                    title: "Django "
                }, {
                    value: "dos",
                    title: "DOS"
                }, {
                    value: "elixir",
                    title: "Elixir"
                }, {
                    value: "elm",
                    title: "Elm"
                }, {
                    value: "erlang",
                    title: "Erlang"
                }, {
                    value: "fix",
                    title: "FIX"
                }, {
                    value: "fsharp",
                    title: "F#"
                }, {
                    value: "gherkin",
                    title: "gherkin"
                }, {
                    value: "glsl",
                    title: "GLSL"
                }, {
                    value: "go",
                    title: "Go"
                }, {
                    value: "haml",
                    title: "Haml"
                }, {
                    value: "handlebars",
                    title: "Handlebars"
                }, {
                    value: "haskell",
                    title: "Haskell"
                }, {
                    value: "xml",
                    title: "HTML"
                }, {
                    value: "http",
                    title: "HTTP"
                }, {
                    value: "ini",
                    title: "Ini file"
                }, {
                    value: "java",
                    title: "Java"
                }, {
                    value: "javascript",
                    title: "JavaScript"
                }, {
                    value: "json",
                    title: "JSON"
                }, {
                    value: "lasso",
                    title: "Lasso"
                }, {
                    value: "less",
                    title: "LESS"
                }, {
                    value: "lisp",
                    title: "Lisp"
                }, {
                    value: "livecodeserver",
                    title: "LiveCode Server"
                }, {
                    value: "lua",
                    title: "Lua"
                }, {
                    value: "makefile",
                    title: "Makefile"
                }, {
                    value: "markdown",
                    title: "Markdown"
                }, {
                    value: "mathematica",
                    title: "Mathematica"
                }, {
                    value: "matlab",
                    title: "Matlab"
                }, {
                    value: "nginx",
                    title: "nginx"
                }, {
                    value: "objectivec",
                    title: "Objective C"
                }, {
                    value: "perl",
                    title: "Perl"
                }, {
                    value: "php",
                    title: "PHP"
                }, {
                    value: "python",
                    title: "Python"
                }, {
                    value: "r",
                    title: "R"
                }, {
                    value: "ruby",
                    title: "Ruby"
                }, {
                    value: "ruleslanguage",
                    title: "Oracle Rules Language"
                }, {
                    value: "rust",
                    title: "Rust"
                }, {
                    value: "scala",
                    title: "Scala"
                }, {
                    value: "scss",
                    title: "SCSS"
                }, {
                    value: "smalltalk",
                    title: "SmallTalk"
                }, {
                    value: "sql",
                    title: "SQL"
                }, {
                    value: "stylus",
                    title: "Stylus"
                }, {
                    value: "swift",
                    title: "Swift"
                }, {
                    value: "tex",
                    title: "TeX"
                }, {
                    value: "vbnet",
                    title: "VB.NET"
                }, {
                    value: "vbscript",
                    title: "VBScript"
                }, {
                    value: "vim",
                    title: "vim"
                }, {
                    value: "xml",
                    title: "XML"
                }, {
                    value: "yaml",
                    title: "YAML"
                }]
            },
            theme: {
                defaultValue: "zenburn",
                setter: this.setCodeTheme.bind(this),
                getter: this.getCodeTheme.bind(this),
                options: [{
                    value: "zenburn",
                    title: "Zenburn"
                }, {
                    value: "ascetic",
                    title: "Ascetic"
                }, {
                    value: "far",
                    title: "Far"
                }, {
                    value: "github-gist",
                    title: "GitHub Gist"
                }, {
                    value: "ir-black",
                    title: "Ir Black"
                }, {
                    value: "monokai",
                    title: "Monokai"
                }, {
                    value: "obsidian",
                    title: "Obsidian"
                }, {
                    value: "solarized-dark",
                    title: "Solarized Dark"
                }, {
                    value: "solarized-light",
                    title: "Solarized Light"
                }, {
                    value: "tomorrow",
                    title: "Tomorrow"
                }, {
                    value: "xcode",
                    title: "Xcode"
                }]
            }
        }
    },
    paint: function() {
        if (this.domElement.find(".sl-block-placeholder, .sl-block-content-preview").remove(), this.isEmpty()) this.showPlaceholder();
        else {
            var e = $('<div class="editing-ui sl-block-content-preview visible-in-preview">').appendTo(this.contentElement),
                t = this.getPreElement().clone().appendTo(e);
            hljs.highlightBlock(t.get(0))
        }
        this.syncZ()
    },
    setDefaults: function() {
        this._super(), this.resize({
            width: 500,
            height: 300
        });
        var e = this.getDefaultLanguage();
        e && this.setCodeLanguage(e)
    },
    getDefaultLanguage: function() {
        if ("string" == typeof SL.editor.blocks.Code.defaultLanguage) return SL.editor.blocks.Code.defaultLanguage;
        for (var e = $('.reveal .sl-block[data-block-type="code"] pre[class!="none"]').get(), t = 0; t < e.length; t++) {
            var i = this.getCodeLanguageFromPre($(e[t]));
            if (i) return i
        }
        return null
    },
    setCode: function(e) {
        this.getCodeElement().html(SL.util.escapeHTMLEntities(e)), this.paint()
    },
    getCode: function() {
        return SL.util.unescapeHTMLEntities(this.getCodeElement().html())
    },
    setCodeLanguage: function(e) {
        this.getPreElement().attr("class", e), this.paint(), SL.editor.blocks.Code.defaultLanguage = e
    },
    getCodeLanguage: function() {
        return this.getCodeLanguageFromPre(this.getPreElement())
    },
    getCodeLanguageFromPre: function(e) {
        var t = e.attr("class") || "";
        return t = t.replace(/hljs/gi, ""), t = t.trim()
    },
    setCodeTheme: function(e) {
        this.contentElement.attr("data-highlight-theme", e)
    },
    getCodeTheme: function() {
        return this.contentElement.attr("data-highlight-theme")
    },
    getToolbarOptions: function() {
        return [SL.editor.components.toolbars.options.Code, SL.editor.components.toolbars.options.CodeLanguage, SL.editor.components.toolbars.options.CodeTheme, SL.editor.components.toolbars.options.TextSize, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
    },
    getPreElement: function() {
        var e = this.contentElement.find(">pre");
        return 0 === e.length && (e = $("<pre><code></code></pre>").appendTo(this.contentElement)), e
    },
    getCodeElement: function() {
        var e = this.getPreElement(),
            t = e.find(">code");
        return 0 === t.length && (t = $("<code>").appendTo(e)), t
    },
    isEmpty: function() {
        return !this.isset("code.value")
    },
    onDoubleClick: function(e) {
        this._super(e), this.editingRequested.dispatch()
    },
    onKeyDown: function(e) {
        this._super(e), 13 !== e.keyCode || SL.util.isTypingEvent(e) || (this.editingRequested.dispatch(), e.preventDefault())
    }
};

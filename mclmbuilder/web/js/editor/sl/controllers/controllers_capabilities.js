'use strict';

export const controllercapabilities = {
    TOUCH_EDITOR: !1,
    TOUCH_EDITOR_SMALL: !1,
    init: function() {
        if (!SL.util.device.supportedByEditor()) return $(document.body).append('<div class="not-supported"><h2>Not Supported</h2><p>The Slides editor doesn\'t currently support the browser you\'re using. Please consider changing to a different browser, such as <a href="https://www.google.com/chrome">Google Chrome</a> or <a href="https://www.mozilla.org/firefox/">Firefox</a>.</p><a class="skip" href="#">Continue anyway</a></div>'), $(".not-supported .skip").on("click", function() {
            $(".not-supported").remove()
        }), !1;
        SL.editor.controllers.Capabilities.TOUCH_EDITOR = /ipad|iphone|ipod|android/gi.test(navigator.userAgent) && !!("ontouchstart" in window), SL.editor.controllers.Capabilities.TOUCH_EDITOR_SMALL = SL.editor.controllers.Capabilities.TOUCH_EDITOR && window.innerWidth > 0 && window.innerWidth < 1e3, SL.editor.controllers.Capabilities.TOUCH_EDITOR && ($("html").addClass("touch-editor"), SL.editor.controllers.Capabilities.TOUCH_EDITOR_SMALL && $("html").addClass("touch-editor-small"));
        var e = SL.current_user.get("id") === SL.current_deck.get("user").id;
        return this._canExport = e, this._canPresent = e, this._canShareDeck = e || SL.current_deck.isVisibilityAll(), this._canDeleteDeck = e, this._canChangeStyles = e || !SL.current_team || !SL.current_team.hasThemes() || SL.current_user.isMemberOfCurrentTeam(), this._canSetVisibility = e, !0
    },
    isTouchEditor: function() {
        return SL.editor.controllers.Capabilities.TOUCH_EDITOR
    },
    isTouchEditorSmall: function() {
        return SL.editor.controllers.Capabilities.TOUCH_EDITOR_SMALL
    },
    canExport: function() {
        return this._canExport
    },
    canPresent: function() {
        return this._canPresent
    },
    canShareDeck: function() {
        return this._canShareDeck
    },
    canDeleteDeck: function() {
        return this._canDeleteDeck
    },
    canChangeStyles: function() {
        return this._canChangeStyles
    },
    canSetVisibility: function() {
        return this._canSetVisibility
    }
};

'use strict';

global.io = require('socket.io-client');

import { AWS, s3 as awsS3 } from './sl/aws/s3';

let aceEditor           = require('brace'),
    http                = require('http'),
    https               = require('https'),
    aws4                = require('aws4'),
    lambda              = new AWS.Lambda(),
    create_media        = Routing.generate('medias_new', {_locale: TWIG.currentLanguage, _format: 'json'}, true),
    companyNameFolder   = TWIG.companyParentName.replace(/\s/g, '-'),
    companyMediaPath    = `https://s3-${process.env.REGION}.amazonaws.com/${process.env.ENV_BUCKET}/${companyNameFolder}`;

require('brace/mode/html');
require('brace/theme/monokai');

if (process.env.ISPROD) {
    create_media = Routing.generate('medias_news3', {_locale: TWIG.currentLanguage, _format: 'json'}, true);
}

window.SL = function(t) {
    t = t.split(".");
    for (var e = SL; t.length;) {
        var i = t.shift();
        e[i] || (e[i] = {}), e = e[i]
    }
    return e
},
    $(function() {
        function t() {
            e(),
                SL.helpers.PageLoader.hide(),
                SL.settings.init(),
                SL.keyboard.init(),
                SL.pointer.init(),
                SL.warnings.init(),
                SL.draganddrop.init(),
                /*SL.fonts.init(),*/
                SL.visibility.init(),
            "undefined" == typeof SLConfig && (window.SLConfig = {}),
                i(),
                n()
        }

        function e() {
            var t = $("html");

            t.addClass("loaded")
            // SL.util.device.HAS_TOUCH && t.addClass("touch"),
            // SL.util.device.isMac() ? t.addClass("ua-mac") : SL.util.device.isWindows() ? t.addClass("ua-windows") : SL.util.device.isLinux() && t.addClass("ua-linux"),
            // SL.util.device.isChrome() ? t.addClass("ua-chrome") : SL.util.device.isSafari() ? t.addClass("ua-safari") : SL.util.device.isFirefox() ? t.addClass("ua-firefox") : SL.util.device.isIE() && t.addClass("ua-ie"),
            // SL.util.device.getScrollBarWidth() > 0 && t.addClass("has-visible-scrollbars")
        }

        function i() {
            "object" == typeof window.SLConfig && (SLConfig.deck && !SLConfig.deck.notes && (SLConfig.deck.notes = {}),
                SL.current_user = new SL.models.User(SLConfig.current_user),
            "object" == typeof SLConfig.deck && (SL.current_deck = new SL.models.Deck(SLConfig.deck)),
            "object" == typeof SLConfig.team && (SL.current_team = new SL.models.Team(SLConfig.team)))
        }

        function n() {
            var t = $("html");
            // SL.util.hideAddressBar(),
            t.hasClass("home index") && (SL.view = new SL.views.home.Index),
                SL.view = t.hasClass("home explore") ? new SL.views.home.Explore :
                    // t.hasClass("users show") ? new SL.views.users.Show :
                    t.hasClass("decks show") ? new SL.views.decks.Show :
                        t.hasClass("decks edit") ? new SL.editor.Editor :
                            // t.hasClass("decks edit-requires-upgrade") ? new SL.views.decks.EditRequiresUpgrade :
                            t.hasClass("decks embed") ? new SL.views.decks.Embed :
                                // t.is(".decks.live-client") ? new SL.views.decks.LiveClient :
                                // t.is(".decks.live-server") ? new SL.views.decks.LiveServer :
                                // t.hasClass("decks speaker") ? new SL.views.decks.Speaker :
                                t.hasClass("decks export") ? new SL.views.decks.Export :
                                    t.hasClass("decks fullscreen") ? new SL.views.decks.Fullscreen :
                                        t.hasClass("decks review") ? new SL.views.decks.Review :
                                            // t.hasClass("decks password") ? new SL.views.decks.Password :
                                            // t.hasClass("teams-subscriptions-show") ? new SL.views.teams.subscriptions.Show :
                                            // t.hasClass("registrations") && (t.hasClass("edit") || t.hasClass("update")) ? new SL.views.devise.Edit :
                                            // t.hasClass("registrations") || t.hasClass("team_registrations") || t.hasClass("sessions") || t.hasClass("passwords") ||
                                            // t.hasClass("invitations show") ? new SL.views.devise.All :
                                            // t.hasClass("subscriptions new") || t.hasClass("subscriptions edit") ? new SL.views.subscriptions.New :
                                            // t.hasClass("subscriptions show") ? new SL.views.subscriptions.Show :
                                            // t.hasClass("subscriptions edit_period") ? new SL.views.subscriptions.EditPeriod :
                                            t.hasClass("teams-reactivate") ? new SL.views.teams.subscriptions.Reactivate :
                                                t.hasClass("teams-signup") ? new SL.views.teams.New :
                                                    t.hasClass("teams edit") ? new SL.views.teams.teams.Edit :
                                                        t.hasClass("teams edit_members") ? new SL.views.teams.teams.EditMembers :
                                                            t.hasClass("teams show") ? new SL.views.teams.teams.Show :
                                                                // t.hasClass("themes edit") ? new SL.views.themes.Edit :
                                                                // t.hasClass("themes preview") ? new SL.views.themes.Preview :
                                                                t.hasClass("pricing") ? new SL.views.statik.Pricing :
                                                                    t.hasClass("static") ? new SL.views.statik.All :
                                                                        new SL.views.Base,
                Placement.sync()
        }
        setTimeout(t, 1)
    }),
    SL("collections").Collection = Class.extend({
        init: function(t, e, i) {
            this.factory = e, this.crud = i || {}, this.changed = new signals.Signal, this.replaced = new signals.Signal, this.setData(t)
        },
        setData: function(t) {
            var e = !!this.data && "undefined" != typeof this.data;
            if (this.data = t || [], "function" == typeof this.factory) {
                var i = this.data;
                this.data = [];
                for (var n = 0, s = i.length; s > n; n++) {
                    var o = i[n];
                    this.data.push(o instanceof this.factory ? i[n] : this.createModelInstance(i[n]))
                }
            }
            e && this.replaced.dispatch()
        },
        appendData: function(t) {
            var e = this.size();
            return this.setData(this.data.concat(t)), this.data.slice(e)
        },
        prependData: function(t) {
            var e = this.size();
            return this.setData(t.concat(this.data)), this.data.slice(0, e)
        },
        find: function(t) {
            for (var e = 0, i = this.data.length; i > e; e++) {
                var n = this.data[e];
                if (n === t) return e
            }
            return -1
        },
        contains: function(t) {
            return -1 !== this.find(t)
        },
        findByProperties: function(t) {
            for (var e = 0, i = this.data.length; i > e; e++) {
                var n = this.data[e],
                    s = !0;
                for (var o in t) t.hasOwnProperty(o) && ("function" == typeof n.get ? n.get(o) != t[o] && (s = !1) : n[o] != t[o] && (s = !1));
                if (s) return e
            }
            return -1
        },
        getByProperties: function(t) {
            return this.data[this.findByProperties(t)]
        },
        getByID: function(t) {
            return this.getByProperties({
                id: t
            })
        },
        remove: function(t) {
            for (var e, i = 0; i < this.data.length; i++) this.data[i] === t && (e = this.data.splice(i, 1)[0], i--);
            "undefined" != typeof e && this.changed.dispatch(null, [e])
        },
        removeByProperties: function(t) {
            for (var e, i = this.findByProperties(t), n = 0; - 1 !== i && n++ < 1e3;) e = this.data.splice(i, 1)[0], i = this.findByProperties(t);
            "undefined" != typeof e && this.changed.dispatch(null, [e])
        },
        removeByIndex: function(t) {
            var e = this.data.splice(t, 1);
            return "undefined" != typeof e && this.changed.dispatch(null, [e]), e
        },
        create: function(t, e) {
            return new Promise(function(i, n) {

            }.bind(this))
        },
        createModel: function(t, e) {
            if (e = $.extend({
                    prepend: !1
                }, e), "function" == typeof this.factory) {
                var i = this.createModelInstance(t);
                return e.prepend ? this.unshift(i) : this.push(i), i
            }
        },
        createModelInstance: function(t, e) {
            return new this.factory(t, e)
        },
        clear: function() {
            this.data.length = 0, this.changed.dispatch()
        },
        swap: function(t, e) {
            var i = "number" == typeof t && t >= 0 && t < this.size(),
                n = "number" == typeof e && e >= 0 && e < this.size();
            if (i && n) {
                var s = this.data[t],
                    o = this.data[e];
                this.data[t] = o, this.data[e] = s
            }
            this.changed.dispatch()
        },
        shiftLeft: function(t) {
            "number" == typeof t && t > 0 && this.swap(t, t - 1)
        },
        shiftRight: function(t) {
            "number" == typeof t && t < this.size() - 1 && this.swap(t, t + 1)
        },
        at: function(t) {
            return this.data[t]
        },
        first: function() {
            return this.at(0)
        },
        last: function() {
            return this.at(this.size() - 1)
        },
        size: function() {
            return this.data.length
        },
        isEmpty: function() {
            return 0 === this.size()
        },
        getUniqueName: function(t, e, i) {
            for (var n = -1, s = 0, o = this.data.length; o > s; s++) {
                var a = this.data[s],
                    r = "function" == typeof a.get ? a.get(e) : a[e];
                if (r) {
                    var l = r.match(new RegExp("^" + t + "\\s?(\\d+)?$"));
                    l && 2 === l.length && (n = Math.max(l[1] ? parseInt(l[1], 10) : 0, n))
                }
            }
            return -1 === n ? t + (i ? " 1" : "") : t + " " + (n + 1)
        },
        toJSON: function() {
            return this.map(function(t) {
                return "function" == typeof t.toJSON ? t.toJSON() : t
            })
        },
        destroy: function() {
            this.changed.dispose(), this.data = null
        },
        unshift: function(t) {
            var e = this.data.unshift(t);
            return this.changed.dispatch(t), e
        },
        push: function(t) {
            var e = this.data.push(t);
            return this.changed.dispatch([t]), e
        },
        pop: function() {
            var t = this.data.pop();
            return "undefined" != typeof t && this.changed.dispatch(null, [t]), t
        },
        map: function(t, e) {
            return this.data.map(t, e)
        },
        some: function(t, e) {
            return this.data.some(t, e)
        },
        filter: function(t, e) {
            return this.data.filter(t, e)
        },
        forEach: function(t, e) {
            return this.data.forEach(t, e)
        }
    }),
    SL("collections").Loadable = SL.collections.Collection.extend({
        init: function() {
            this._super.apply(this, arguments),
                this.loadStatus = "",
                this.loadStarted = new signals.Signal,
                this.loadCompleted = new signals.Signal,
                this.loadFailed = new signals.Signal
        },
        load: function() {},
        unload: function() {
            this.loadXHR && (this.loadXHR.abort(), this.loadXHR = null),
                this.loadStatus = "", this.clear()
        },
        onLoadStarted: function() {
            this.loadStatus = "loading",
                this.loadStarted.dispatch()
        },
        onLoadCompleted: function() {
            this.loadStatus = "loaded",
                this.loadCompleted.dispatch()
        },
        onLoadFailed: function() {
            this.loadStatus = "failed",
                this.loadFailed.dispatch()
        },
        isLoading: function() {
            return "loading" === this.loadStatus
        },
        isLoaded: function() {
            return "loaded" === this.loadStatus
        },
        destroy: function() {
            this.loadStarted.dispose(),
                this.loadCompleted.dispose(),
                this.loadFailed.dispose(),
                this._super()
        }
    }),
    SL("collections").Paginatable = SL.collections.Loadable.extend({
        init: function() {
            this._super.apply(this, arguments)
        },
        load: function(t) {
            return this.isLoading() ? void 0 : (this.listURL = t || this.crud.list, this.onLoadStarted(), new Promise(function(t, e) {

            }.bind(this)))
        },
        hasNextPage: function() {
            return this.pagesLoaded < this.pagesTotal
        },
        loadNextPage: function() {
            return this.hasNextPage() ? new Promise(function(t, e) {

            }.bind(this)) : Promise.resolve([])
        },
        getTotalResults: function() {
            return this.totalResults
        },
        getLoadedResults: function() {
            return this.size()
        }
    }),
    SL("collections.collab").Comments = SL.collections.Loadable.extend({
        init: function(t, e) {
            this._super(t, e || SL.models.collab.Comment, {
                list: SL.config.AJAX_COMMENTS_LIST(SL.current_deck.get("id")),
                create: SL.config.AJAX_COMMENTS_CREATE(SL.current_deck.get("id")),
                "delete": SL.config.AJAX_COMMENTS_DELETE(SL.current_deck.get("id"))
            })
        },
        load: function(t) {
            return this.isLoading() ? void 0 : (this.url = t || this.crud.list, this.onLoadStarted(), new Promise(function(t, e) {

            }.bind(this)))
        },
        hasNextPage: function() {
            return this.pagesLoaded < this.pagesTotal
        },
        loadNextPage: function() {
            return this.hasNextPage() ? new Promise(function(t, e) {

            }.bind(this)) : Promise.resolve([])
        },
        create: function(t, e) {
            e = $.extend({
                url: this.crud.create
            }, e), e.model ? e.model.setState(SL.models.collab.Comment.STATE_SAVING) : e.model = this.createModel(t.comment);
            var i = JSON.parse(JSON.stringify(t));
            return delete i.comment.user_id, delete i.comment.created_at, this._super(i, e).then(function() {
                e.model.setState(SL.models.collab.Comment.STATE_SAVED)
            }.bind(this), function() {
                e.model.setState(SL.models.collab.Comment.STATE_FAILED)
            }.bind(this)), Promise.resolve(e.model)
        },
        retryCreate: function(t) {
            return this.create({
                comment: t.toJSON()
            }, {
                model: t
            })
        }
    }),
    SL("collections.collab").DeckUsers = SL.collections.Loadable.extend({
        init: function(t, e, i) {
            this._super(t, e || SL.models.collab.DeckUser, i || {
                list: SL.config.AJAX_DECKUSER_LIST(SLConfig.deck.id),
                create: SL.config.AJAX_DECKUSER_CREATE(SLConfig.deck.id)
            })
        },
        load: function() {
            return this.isLoading() ? void 0 : (this.onLoadStarted(), new Promise(function(t, e) {
                $.ajax({
                    type: "GET",
                    url: this.crud.list,
                    context: this
                }).done(function(e) {
                    this.setData(e.results), this.onLoadCompleted(), t()
                }).fail(function() {
                    this.onLoadFailed(), e()
                })
            }.bind(this)))
        },
        hasMoreThanOneEditor: function() {
            return this.getEditors().length > 1
        },
        hasMoreThanOnePresentEditor: function() {
            return this.getPresentEditors().length > 1
        },
        setEditing: function(t) {
            this.forEach(function(e) {
                e.set("editing", e.get("user_id") === t)
            })
        },
        getByUserID: function(t) {
            return this.getByProperties({
                user_id: t
            })
        },
        getEditors: function() {
            return this.filter(function(t) {
                return t.canEdit()
            })
        },
        getPresentEditors: function() {
            return this.filter(function(t) {
                return t.canEdit() && t.isOnline()
            })
        }
    }),
    SL("collections").MediaTags = SL.collections.Loadable.extend({
        init: function(t, e, i) {
            this._super(t, e || SL.models.MediaTag, i || {
                list: SL.config.AJAX_MEDIA_TAG_LIST,
                create: SL.config.AJAX_MEDIA_TAG_CREATE,
                update: SL.config.AJAX_MEDIA_TAG_UPDATE,
                "delete": SL.config.AJAX_MEDIA_TAG_DELETE,
                add_media: SL.config.AJAX_MEDIA_TAG_ADD_MEDIA,
                remove_media: SL.config.AJAX_MEDIA_TAG_REMOVE_MEDIA
            }),
                this.associationChanged = new signals.Signal
        },
        load: function() {
            this.isLoading() || (this.onLoadStarted(), $.ajax({
                type: "GET",
                url: this.crud.list,
                context: this
            }).done(function(t) {
                this.setData(t.results), this.onLoadCompleted()
            }).fail(function() {
                this.onLoadFailed()
            }))
        },
        create: function(t, e) {
            return this._super($.extend({
                tag: {
                    name: this.getUniqueName("Tag", "name", !0)
                }
            }, t), e)
        },
        addTagTo: function(t, e) {
            e.forEach(function(e) {
                t.addMedia(e)
            }),
                this.associationChanged.dispatch(t)
            // ,$.ajax({
            //     type: "POST",
            //     url: this.crud.add_media(t.get("id")),
            //     context: this,
            //     data: {
            //         media_ids: e.map(function(t) {
            //             return t.get("id")
            //         })
            //     }
            // }).fail(function() {
            //     SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
            // })
        },
        removeTagFrom: function(t, e) {
            e.forEach(function(e) {
                t.removeMedia(e)
            }), this.associationChanged.dispatch(t)
            // ,$.ajax({
            //     type: "DELETE",
            //     url: this.crud.remove_media(t.get("id")),
            //     context: this,
            //     data: {
            //         media_ids: e.map(function(t) {
            //             return t.get("id")
            //         })
            //     }
            // }).fail(function() {
            //     SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
            // })
        }
    }),
    SL("collections").Media = SL.collections.Loadable.extend({
        init: function(t, e, i) {
            this._super(t, e || SL.models.Media, i || {
                list: SL.config.AJAX_MEDIA_LIST,
                update: SL.config.AJAX_MEDIA_UPDATE,
                create: SL.config.AJAX_MEDIA_CREATE,
                "delete": SL.config.AJAX_MEDIA_DELETE
            })
        },
        load: function() {
            this.isLoading() || (this.page = 1, this.pagedResults = [], this.onLoadStarted(), this.loadNextPage())
        },
        loadNextPage: function() {
            1 === this.page || this.page <= this.totalPages ? $.ajax({
                type: "GET",
                url: this.crud.list + "?page=" + this.page,
                context: this
            }).done(function(t) {
                this.totalPages || (this.totalPages = Math.ceil(t.total / t.results.length)), this.pagedResults = this.pagedResults.concat(t.results), this.page += 1, this.loadNextPage()
            }).fail(function() {
                this.onLoadFailed()
            }) : (this.setData(this.pagedResults), this.onLoadCompleted())
        },
        createSearchFilter: function(t) {
            if (!t || "" === t) return function() {
                return !1
            };
            var e = new RegExp(t, "i");
            return function(t) {
                return e.test(t.get("title"))
            }
        },
        getImages: function() {
            return this.filter(SL.models.Media.IMAGE.filter)
        },
        getVideos: function() {
            return this.filter(SL.models.Media.VIDEO.filter)
        },
        getPdf: function() {
            return this.filter(SL.models.Media.PDF.filter)
        }
    }),
    SL("collections").TeamInvites = SL.collections.Paginatable.extend({
        init: function(t, e) {
            this._super(t, e || SL.models.Model, {
                list: SL.config.AJAX_TEAM_INVITATIONS_LIST
            })
        }
    }),
    SL("collections").TeamMediaTags = SL.collections.MediaTags.extend({
        init: function(t) {
            this._super(t, SL.models.MediaTag, {
                list: SL.config.AJAX_TEAM_MEDIA_TAG_LIST,
                create: SL.config.AJAX_TEAM_MEDIA_TAG_CREATE,
                update: SL.config.AJAX_TEAM_MEDIA_TAG_UPDATE,
                "delete": SL.config.AJAX_TEAM_MEDIA_TAG_DELETE,
                add_media: SL.config.AJAX_TEAM_MEDIA_TAG_ADD_MEDIA,
                remove_media: SL.config.AJAX_TEAM_MEDIA_TAG_REMOVE_MEDIA
            })
        },
        createModelInstance: function(t) {
            return this._super(t, this.crud)
        }
    }),
    SL("collections").TeamMedia = SL.collections.Media.extend({
        init: function(t) {
            this._super(t, SL.models.Media, {
                list: SL.config.AJAX_TEAM_MEDIA_LIST,
                create: SL.config.AJAX_TEAM_MEDIA_CREATE,
                update: SL.config.AJAX_TEAM_MEDIA_UPDATE,
                "delete": SL.config.AJAX_TEAM_MEDIA_DELETE
            })
        },
        createModelInstance: function(t) {
            return this._super(t, this.crud)
        }
    }),
    SL("collections").TeamMembers = SL.collections.Paginatable.extend({
        init: function(t, e) {
            this._super(t, e || SL.models.User, {
                list: SL.config.AJAX_TEAM_MEMBERS_LIST
            })
        }
    }),
    SL("models").Model = Class.extend({
        init: function(t) {
            this.setData(t)
        },
        setData: function(t) {
            this.data = t || {}
        },
        getData: function() {
            return this.data
        },
        setAll: function(t) {
            for (var e in t) this.set(e, t[e])
        },
        set: function(t, e) {
            this.data[t] = e
        },
        get: function(t) {
            if ("string" == typeof t && /\./.test(t)) {
                for (var e = t.split("."), i = this.data; e.length && i;) t = e.shift(), i = i[t];
                return i
            }
            return this.data[t]
        },
        has: function(t) {
            var e = this.get(t);
            return !!e || e === !1 || 0 === e
        },
        toJSON: function() {
            return JSON.parse(JSON.stringify(this.data))
        }
    }),
    SL("models").AccessToken = SL.models.Model.extend({
        init: function(t) {
            this._super(t)
        },
        save: function(t) {
            var e = {
                access_token: {}
            };
            return t ? t.forEach(function(t) {
                e.access_token[t] = this.get(t)
            }.bind(this)) : e.access_token = this.toJSON(), $.ajax({
                url: SL.config.AJAX_ACCESS_TOKENS_UPDATE(this.get("deck_id"), this.get("id")),
                type: "PUT",
                data: e
            })
        },
        destroy: function() {
            return $.ajax({
                url: SL.config.AJAX_ACCESS_TOKENS_DELETE(this.get("deck_id"), this.get("id")),
                type: "DELETE"
            })
        },
        clone: function() {
            return new SL.models.AccessToken(JSON.parse(JSON.stringify(this.data)))
        }
    }),
    SL("models.collab").Comment = SL.models.Model.extend({
        init: function(t) {
            this._super(t), this.state = this.has("id") ? SL.models.collab.Comment.STATE_SAVED : SL.models.collab.Comment.STATE_SAVING, this.stateChanged = new signals.Signal
        },
        setState: function(t) {
            this.state = t, this.stateChanged.dispatch(this)
        },
        getState: function() {
            return this.state
        },
        getDisplayName: function() {
            return this.get("name") || this.get("username")
        },
        clone: function() {
            return new SL.models.collab.Comment(JSON.parse(JSON.stringify(this.data)))
        },
        save: function(t) {
            var e = {
                comment: {}
            };
            return t ? t.forEach(function(t) {
                e.comment[t] = this.get(t)
            }.bind(this)) : e.comment = this.toJSON(), $.ajax({
                url: SL.config.AJAX_COMMENTS_UPDATE(SL.current_deck.get("id"), this.get("id")),
                type: "PUT",
                data: e
            })
        },
        destroy: function() {
            return $.ajax({
                url: SL.config.AJAX_COMMENTS_DELETE(SL.current_deck.get("id"), this.get("id")),
                type: "DELETE"
            })
        }
    }),
    SL.models.collab.Comment.STATE_SAVED = "saved",
    SL.models.collab.Comment.STATE_SAVING = "saving",
    SL.models.collab.Comment.STATE_FAILED = "failed",
    SL("models.collab").DeckUser = SL.models.Model.extend({
        init: function(t) {
            this._super(t), this.has("status") || this.set("status", SL.models.collab.DeckUser.STATUS_DISCONNECTED)
        },
        getDisplayName: function() {
            return this.get("name") || this.get("username")
        },
        canComment: function() {
            return !0
        },
        canEdit: function() {
            return -1 !== [SL.models.collab.DeckUser.ROLE_OWNER, SL.models.collab.DeckUser.ROLE_ADMIN, SL.models.collab.DeckUser.ROLE_EDITOR].indexOf(this.get("role"))
        },
        isAdmin: function() {
            return -1 !== [SL.models.collab.DeckUser.ROLE_OWNER, SL.models.collab.DeckUser.ROLE_ADMIN].indexOf(this.get("role"))
        },
        isOnline: function() {
            return this.get("status") !== SL.models.collab.DeckUser.STATUS_DISCONNECTED
        },
        isIdle: function() {
            return this.get("status") === SL.models.collab.DeckUser.STATUS_IDLE
        },
        isEditing: function() {
            return this.get("editing") === !0
        },
        isCurrentUser: function() {
            return this.get("user_id") === SL.current_user.get("id")
        },
        clone: function() {
            return new SL.models.collab.DeckUser(JSON.parse(JSON.stringify(this.data)))
        },
        save: function(t) {
            var e = {
                user: {}
            };
            return t ? t.forEach(function(t) {
                e.user[t] = this.get(t)
            }.bind(this)) : e.user = this.toJSON(), $.ajax({
                url: SL.config.AJAX_DECKUSER_UPDATE(SL.current_deck.get("id"), this.get("user_id")),
                type: "PUT",
                data: e
            })
        },
        destroy: function() {
            return $.ajax({
                url: SL.config.AJAX_DECKUSER_DELETE(SL.current_deck.get("id"), this.get("user_id")),
                type: "DELETE"
            })
        }
    }),
    SL.models.collab.DeckUser.ROLE_OWNER = "owner",
    SL.models.collab.DeckUser.ROLE_ADMIN = "admin",
    SL.models.collab.DeckUser.ROLE_EDITOR = "editor",
    SL.models.collab.DeckUser.ROLE_VIEWER = "viewer",
    SL.models.collab.DeckUser.STATUS_DISCONNECTED = "disconnected",
    SL.models.collab.DeckUser.STATUS_VIEWING = "viewing",
    SL.models.collab.DeckUser.STATUS_IDLE = "idle",
    SL("models").Customer = SL.models.Model.extend({
        init: function(t) {
            this._super(t)
        },
        isTrial: function() {
            return "trialing" === this.get("subscription.status")
        },
        hasActiveSubscription: function() {
            return this.has("subscription") && !this.get("subscription.cancel_at_period_end")
        },
        hasCoupon: function() {
            return this.has("subscription") && this.has("subscription.coupon_code")
        },
        getNextInvoiceDate: function() {
            return this.get("next_charge")
        },
        getNextInvoiceSum: function() {
            return (parseFloat(this.get("next_charge_amount")) / 100).toFixed(2)
        },
        clone: function() {
            return new SL.models.Customer(JSON.parse(JSON.stringify(this.data)))
        }
    }),
    SL("models").Deck = SL.models.Model.extend({
        init: function(t) {
            this.data = t || {}, $.extend(this, this.data), this.user = new SL.models.User(this.data.user), this.user_settings = new SL.models.UserSettings(this.data.user.settings)
        },
        isPro: function() {
            return this.data.user ? !!this.data.user.pro : !1
        },
        isVisibilityAll: function() {
            return this.get("visibility") === SL.models.Deck.VISIBILITY_ALL
        },
        isVisibilitySelf: function() {
            return this.get("visibility") === SL.models.Deck.VISIBILITY_SELF
        },
        isVisibilityTeam: function() {
            return this.get("visibility") === SL.models.Deck.VISIBILITY_TEAM
        },
        belongsTo: function(t) {
            return this.get("user.id") === t.get("id")
        },
        getURL: function(t) {
            t = $.extend({
                protocol: document.location.protocol,
                token: null,
                view: null
            }, t);
            var e = this.get("user.username"),
                i = this.get("slug") || this.get("id"),
                n = t.protocol + "//" + document.location.host + SL.routes.DECK(e, i);
            return t.view && (n += "/" + t.view), t.token && (n += "?token=" + t.token.get("token")), n
        },
        clone: function() {
            return new SL.models.Deck(JSON.parse(JSON.stringify(this.data)))
        }
    }),
    SL("models").Deck.VISIBILITY_SELF = "self",
    SL("models").Deck.VISIBILITY_TEAM = "team",
    SL("models").Deck.VISIBILITY_ALL = "all",
    SL("models").MediaTag = SL.models.Model.extend({
        init: function(t, e) {
            this._super(t), this.crud = $.extend({
                update: SL.config.AJAX_MEDIA_TAG_UPDATE,
                "delete": SL.config.AJAX_MEDIA_TAG_DELETE
            }, e)
        },
        createFilter: function() {
            var t = this;
            return function(e) {
                return t.hasMedia(e)
            }
        },
        hasMedia: function(t) {
            return -1 !== this.data.medias.indexOf(t.get("id"))
        },
        addMedia: function(t) {
            this.hasMedia(t) || this.data.medias.push(t.get("id"))
        },
        removeMedia: function(t) {
            for (var e = t.get("id"), i = 0; i < this.data.medias.length; i++) this.data.medias[i] === e && (this.data.medias.splice(i, 1), i--)
        },
        clone: function() {
            return new SL.models.MediaTag(JSON.parse(JSON.stringify(this.data)))
        },
        save: function(t) {
            var e = {
                tag: {}
            };
            return t ? t.forEach(function(t) {
                e.tag[t] = this.get(t)
            }.bind(this)) : e.tag = this.toJSON(), $.ajax({
                url: this.crud.update(this.get("id")),
                type: "PUT",
                data: e
            })
        },
        destroy: function() {
            return $.ajax({
                url: this.crud["delete"](this.get("id")),
                type: "DELETE"
            })
        }
    }),
    SL("models").Media = SL.models.Model.extend({
        uploadStatus: "",
        uploadFile: null,
        nb: null,
        init: function(t, e, i, n) {
            this._super(t),
                this.crud = $.extend({
                    create: SL.config.AJAX_MEDIA_CREATE,
                    update: SL.config.AJAX_MEDIA_UPDATE,
                    "delete": SL.config.AJAX_MEDIA_DELETE
                }, e),
                i ? (this.uploadStatus = SL.models.Media.STATUS_UPLOAD_WAITING,
                        this.uploadFile = i,
                        this.uploadFilename = n
                ) : this.uploadStatus = SL.models.Media.STATUS_UPLOADED,
                this.uploadStarted = new signals.Signal,
                this.uploadProgressed = new signals.Signal,
                this.uploadCompleted = new signals.Signal,
                this.uploadFailed = new signals.Signal
        },
        upload: function() {
            // /\.svg$/i.test(this.uploadFile.name) && window.FileReader ? (
            //     SL.analytics.trackEditor("Media: SVG upload started"),
            //         this.reader = new window.FileReader,
            //         this.reader.addEventListener("abort", this.uploadValidated.bind(this)),
            //         this.reader.addEventListener("error", this.uploadValidated.bind(this)),
            //         this.reader.addEventListener("load", function(t) {
            //             var e = t.target.result;
            //             e && e.length && (e = e.replace(/\<(\?xml|(\!DOCTYPE[^\>\[]+(\[[^\]]+)?))+[^>]+\>/g, ""));
            //             var i = $("<div>" + e + "</div>").find("svg").get(0);
            //             if (i) {
            //                 $(i).parent().find("*").contents().each(function() {
            //                     8 === this.nodeType && $(this).remove()
            //                 }),
            //                     $(i).find("style, script").remove(),
            //                     $(i).removeAttr("content"),
            //                     $(i).find("[unicode]").each(function() {
            //                         this.setAttribute("unicode", SL.util.escapeHTMLEntities(this.getAttribute("unicode")))
            //                     });
            //                 var n = i.getAttribute("width"),
            //                     s = i.getAttribute("height"),
            //                     o = i.hasAttribute("xmlns"),
            //                     a = i.hasAttribute("viewBox");
            //                 if (hasWidthAndHeight = n && s, o || i.setAttribute("xmlns", "http://www.w3.org/2000/svg"), hasWidthAndHeight && (/[^\d]/g.test(n) || /[^\d]/g.test(s)) && (i.setAttribute("width", parseFloat(n)), i.setAttribute("height", parseFloat(s))), !a && hasWidthAndHeight && (i.setAttribute("viewBox", [0, 0, i.getAttribute("width"), i.getAttribute("height")].join(" ")), a = !0), !hasWidthAndHeight && a) {
            //                     var r = i.getAttribute("viewBox").split(" ");
            //                     4 === r.length && (i.setAttribute("width", r[2]), i.setAttribute("height", r[3]), hasWidthAndHeight = !0)
            //                 }
            //                 if (a && hasWidthAndHeight) {
            //                     var l = '<?xml version="1.0"?>\n' + i.parentNode.innerHTML;
            //                     this.uploadFilename = this.uploadFile.name || "image.svg", this.uploadFile = new Blob([l], {
            //                         type: "image/svg+xml"
            //                     }), this.uploadValidated()
            //                 } else this.uploadStatus = SL.models.Media.STATUS_UPLOAD_FAILED, this.uploadFailed.dispatch("SVG error: missing viewBox or width/height"), SL.analytics.trackEditor("Media: SVG upload error", "missing viewBox or w/h")
            //             } else
            //                 this.uploadStatus = SL.models.Media.STATUS_UPLOAD_FAILED,
            //                     this.uploadFailed.dispatch("Invalid SVG: missing &lt;svg&gt; element"),
            //                     SL.analytics.trackEditor("Media: SVG upload error", "missing svg element");
            //             this.reader = null
            //         }.bind(this)),
            //         this.reader.readAsText(this.uploadFile, "UTF-8")
            // ) : this.uploadValidated()
            this.uploadValidated()
        },
        uploadValidated: function() {
            return this.uploader ? !1 : (this.uploader = new SL.helpers.FileUploader({
                file: this.uploadFile,
                filename: this.uploadFilename,
                service: this.crud.create,
                timeout: 300000
            }),
                this.uploader.progressed.add(this.onUploadProgress.bind(this)),
                this.uploader.succeeded.add(this.onUploadSuccess.bind(this)),
                this.uploader.failed.add(this.onUploadError.bind(this)),
                this.uploader.upload(),
                this.uploadStatus = SL.models.Media.STATUS_UPLOADING,
                void this.uploadStarted.dispatch())
        },
        onUploadProgress: function(t) {
            this.uploadProgressed.dispatch(t)
        },
        onUploadSuccess: function(t) {
            this.uploader.destroy(),
                this.uploader = null;
            for (var e in t) this.set(e, t[e]);
            this.uploadStatus = SL.models.Media.STATUS_UPLOADED,
                this.uploadCompleted.dispatch();
        },
        onUploadError: function() {
            this.uploader.destroy(),
                this.uploader = null,
                this.uploadStatus = SL.models.Media.STATUS_UPLOAD_FAILED,
                this.uploadFailed.dispatch()
        },
        isWaitingToUpload: function() {
            return this.uploadStatus === SL.models.Media.STATUS_UPLOAD_WAITING
        },
        isUploading: function() {
            return this.uploadStatus === SL.models.Media.STATUS_UPLOADING
        },
        isUploaded: function() {
            if(this.uploadFile != null){
                this.upload()
                this.nb= 1;
                this.uploadFile = null
            }else{
                return this.uploadStatus === SL.models.Media.STATUS_UPLOADED
            }
        },
        isUploadFailed: function() {
            return this.uploadStatus === SL.models.Media.STATUS_UPLOAD_FAILED
        },
        isImage: function() {
            return /^image\//.test(this.get("content_type"))
        },
        isSVG: function() {
            return /^image\/svg/.test(this.get("content_type"))
        },
        isVideo: function() {
            return /^video\//.test(this.get("content_type"))
        },
        isPdf: function() {
            return /n*\/pdf/.test(this.get("content_type"))
        },
        clone: function() {
            return new SL.models.Media(JSON.parse(JSON.stringify(this.data)))
        },
        save: function(t) {
            var e = {
                media: {}
            };
            return t ? t.forEach(function(t) {
                e.media[t] = this.get(t)
            }.bind(this)) : e.media = this.toJSON(),
                $.ajax({
                    url: this.crud.update(this.get("id")),
                    type: "PUT",
                    data: e
                })
        },
        destroy: function() {
            return this.uploadFile = null, this.uploadStarted && this.uploadStarted.dispose(), this.uploadProgressed && this.uploadProgressed.dispose(), this.uploadCompleted && this.uploadCompleted.dispose(), this.uploadFailed && this.uploadFailed.dispose(), this.uploader && (this.uploader.destroy(), this.uploader = null), $.ajax({
                url: this.crud["delete"](this.get("id")),
                type: "DELETE"
            })
        }
    }),
    SL.models.Media.STATUS_UPLOAD_WAITING = "waiting",
    SL.models.Media.STATUS_UPLOADING = "uploading",
    SL.models.Media.STATUS_UPLOADED = "uploaded",
    SL.models.Media.STATUS_UPLOAD_FAILED = "upload-failed",
    SL.models.Media.IMAGE = {
        id: "Images",
        filter: function(t) {
            return t.isImage()
        }
    },
    SL.models.Media.SVG = {
        id: "svg",
        filter: function(t) {
            return t.isSVG()
        }
    },
    SL.models.Media.VIDEO = {
        id: "Videos",
        filter: function(t) {
            return t.isVideo()
        }
    },
    SL.models.Media.PDF = {
        id: "PDF",
        filter: function(t) {
            return t.isPdf()
        }
    },
    SL("models").Plan = SL.models.Model.extend({
        init: function(t) {
            this._super(t)
        },
        isMonthly: function() {
            return this.get("account_type") === SL.models.Plan.ACCOUNT_TYPE_PRO_7 || this.get("account_type") === SL.models.Plan.ACCOUNT_TYPE_TEAM_14
        },
        isYearly: function() {
            return this.get("account_type") === SL.models.Plan.ACCOUNT_TYPE_PRO_7_YEARLY || this.get("account_type") === SL.models.Plan.ACCOUNT_TYPE_TEAM_14_YEARLY
        },
        getDollarCost: function() {
            switch (this.get("account_type")) {
                case SL.models.Plan.ACCOUNT_TYPE_PRO_7:
                    return 7;
                case SL.models.Plan.ACCOUNT_TYPE_PRO_7_YEARLY:
                    return 70;
                case SL.models.Plan.ACCOUNT_TYPE_TEAM_14:
                    return 14;
                case SL.models.Plan.ACCOUNT_TYPE_TEAM_14_YEARLY:
                    return 140
            }
            return 0
        },
        getDollarCostPerCycle: function() {
            switch (this.get("account_type")) {
                case SL.models.Plan.ACCOUNT_TYPE_PRO_7:
                    return "$7/month";
                case SL.models.Plan.ACCOUNT_TYPE_PRO_7_YEARLY:
                    return "$70/year";
                case SL.models.Plan.ACCOUNT_TYPE_TEAM_14:
                    return "$14/month";
                case SL.models.Plan.ACCOUNT_TYPE_TEAM_14_YEARLY:
                    return "$140/year"
            }
            return null
        },
        clone: function() {
            return new SL.models.Plan(JSON.parse(JSON.stringify(this.data)))
        }
    }),
    SL.models.Plan.ACCOUNT_TYPE_PRO_7 = "pro7",
    SL.models.Plan.ACCOUNT_TYPE_PRO_7_YEARLY = "pro7yearly",
    SL.models.Plan.ACCOUNT_TYPE_TEAM_14 = "team14",
    SL.models.Plan.ACCOUNT_TYPE_TEAM_14_YEARLY = "team14yearly",
    SL.models.Plan.ACCOUNT_COST_PER_CYCLE_PRO_7 = 7,
    SL.models.Plan.ACCOUNT_COST_PER_CYCLE_PRO_7_YEARLY = 70,
    SL.models.Plan.ACCOUNT_COST_PER_CYCLE_TEAM_14 = 14,
    SL.models.Plan.ACCOUNT_COST_PER_CYCLE_TEAM_14_YEARLY = 140,
    SL("models").Team = SL.models.Model.extend({
        init: function(t) {
            if (this._super(t), "object" == typeof this.data.themes)
                for (var e = 0, i = this.data.themes.length; i > e; e++) this.data.themes[e] = new SL.models.Theme(this.data.themes[e]);
            this.set("themes", new SL.collections.Collection(this.data.themes))
        },
        hasThemes: function() {
            var t = this.get("themes");
            return t && t.size() > 0
        },
        getDefaultTheme: function() {
            return this.get("themes").getByProperties({
                id: this.get("default_theme_id")
            })
        },
        getPlan: function() {
            var t = this.get("account_type");
            return t ? new SL.models.Plan({
                account_type: t
            }) : null
        },
        isManuallyUpgraded: function() {
            return !!this.get("manually_upgraded")
        },
        save: function(t) {
            var e = {
                team: {}
            };
            return t ? t.forEach(function(t) {
                e.team[t] = this.get(t)
            }.bind(this)) : e.team = this.toJSON(), $.ajax({
                url: SL.config.AJAX_UPDATE_TEAM,
                type: "PUT",
                data: e
            })
        },
        clone: function() {
            return new SL.models.Team(JSON.parse(JSON.stringify(this.data)))
        }
    }),
    SL("models").Template = SL.models.Model.extend({
        init: function(t) {
            this._super(t)
        },
        isAvailableForTheme: function(t) {
            return t.hasSlideTemplate(this.get("id")) || this.isAvailableForAllThemes()
        },
        isAvailableForAllThemes: function() {
            var t = this.get("id");
            return !SL.current_user.getThemes().some(function(e) {
                return e.hasSlideTemplate(t)
            })
        }
    }),
    SL("models").ThemeSnippet = SL.models.Model.extend({
        init: function(t) {
            this._super(t), this.has("title") || this.set("title", ""), this.has("template") || this.set("template", "")
        },
        templatize: function(t) {
            var e = this.get("template");
            return e && (e = e.split(SL.models.ThemeSnippet.TEMPLATE_SELECTION_TAG).join(""), t.forEach(function(t) {
                e = e.replace(t.string, t.value || t.defaultValue)
            })), e
        },
        getTemplateVariables: function() {
            var t = this.get("template");
            if (t) {
                t = t.split(SL.models.ThemeSnippet.TEMPLATE_SELECTION_TAG).join("");
                var e = t.match(SL.models.ThemeSnippet.TEMPLATE_VARIABLE_REGEX);
                if (e) return e = e.map(function(t) {
                    var e = t.split(SL.models.ThemeSnippet.TEMPLATE_VARIABLE_DIVIDER),
                        i = {
                            string: t,
                            label: e[0] || "",
                            defaultValue: e[1] || ""
                        };
                    return i.label = i.label.trim(), i.defaultValue = i.defaultValue.trim(), i.label = i.label.replace(SL.models.ThemeSnippet.TEMPLATE_VARIABLE_OPENER, ""), i.label = i.label.replace(SL.models.ThemeSnippet.TEMPLATE_VARIABLE_CLOSER, ""), i.defaultValue = i.defaultValue.replace(SL.models.ThemeSnippet.TEMPLATE_VARIABLE_OPENER, ""), i.defaultValue = i.defaultValue.replace(SL.models.ThemeSnippet.TEMPLATE_VARIABLE_CLOSER, ""), i
                })
            }
            return []
        },
        templateHasVariables: function() {
            return this.getTemplateVariables().length > 0
        },
        templateHasSelection: function() {
            var t = this.get("template");
            return t ? t.indexOf(SL.models.ThemeSnippet.TEMPLATE_SELECTION_TAG) > -1 : !1
        },
        isEmpty: function() {
            return !this.get("title") && !this.get("template")
        }
    }),
    SL.models.ThemeSnippet.TEMPLATE_VARIABLE_OPENER = "{{",
    SL.models.ThemeSnippet.TEMPLATE_VARIABLE_CLOSER = "}}",
    SL.models.ThemeSnippet.TEMPLATE_VARIABLE_DIVIDER = "::",
    SL.models.ThemeSnippet.TEMPLATE_VARIABLE_REGEX = /\{\{.*?\}\}/gi,
    SL.models.ThemeSnippet.TEMPLATE_SELECTION_TAG = "{{selection}}",
    SL("models").Theme = SL.models.Model.extend({
        init: function(t) {
            this._super(t), this.formatData(), this.loading = !1
        },
        load: function(t) {
            return this.loading = !0, t = "string" == typeof t ? t : SL.config.AJAX_THEMES_READ(this.get("id")), $.ajax({
                type: "GET",
                url: t,
                context: this
            }).done(function(t) {
                $.extend(this.data, t), this.formatData()
            }).always(function() {
                this.loading = !1
            })
        },
        formatData: function() {
            this.has("name") || this.set("name", "Untitled"), this.has("font") || this.set("font", SL.config.DEFAULT_THEME_FONT), this.has("color") || this.set("color", SL.config.DEFAULT_THEME_COLOR), this.has("transition") || this.set("transition", SL.config.DEFAULT_THEME_TRANSITION), this.has("background_transition") || this.set("background_transition", SL.config.DEFAULT_THEME_BACKGROUND_TRANSITION), this.data.slide_template_ids instanceof SL.collections.Collection || this.set("slide_template_ids", new SL.collections.Collection(this.data.slide_template_ids)), this.data.snippets instanceof SL.collections.Collection || ("string" == typeof this.data.snippets && this.data.snippets.length > 0 && (this.data.snippets = JSON.parse(this.data.snippets)), this.set("snippets", new SL.collections.Collection(this.data.snippets, SL.models.ThemeSnippet))), this.data.palette instanceof Array || ("string" == typeof this.data.palette && this.data.palette.length > 0 ? (this.data.palette = this.data.palette.split(","), this.data.palette = this.data.palette.map(function(t) {
                return t.trim()
            })) : this.data.palette = [])
        },
        hasSlideTemplate: function(t) {
            return this.get("slide_template_ids").contains(t)
        },
        addSlideTemplate: function(t) {
            var e = this.get("slide_template_ids");
            return t.forEach(function(t) {
                e.contains(t) || e.push(t)
            }), $.ajax({
                type: "POST",
                url: SL.config.AJAX_THEME_ADD_SLIDE_TEMPLATE(this.get("id")),
                context: this,
                data: {
                    slide_template_ids: t
                }
            })
        },
        removeSlideTemplate: function(t) {
            var e = this.get("slide_template_ids");
            return t.forEach(function(t) {
                e.remove(t)
            }), $.ajax({
                type: "DELETE",
                url: SL.config.AJAX_THEME_REMOVE_SLIDE_TEMPLATE(this.get("id")),
                context: this,
                data: {
                    slide_template_ids: t
                }
            })
        },
        hasThumbnail: function() {
            return !!this.get("thumbnail_url")
        },
        hasJavaScript: function() {
            return !!this.get("js")
        },
        hasPalette: function() {
            return this.get("palette").length > 0
        },
        isFontDeprecated: function() {
            var t = this.get("font");
            return SL.config.THEME_FONTS.some(function(e) {
                return e.id === t && e.deprecated === !0
            })
        },
        isTransitionDeprecated: function() {
            var t = this.get("transition");
            return SL.config.THEME_TRANSITIONS.some(function(e) {
                return e.id === t && e.deprecated === !0
            })
        },
        isBackgroundTransitionDeprecated: function() {
            var t = this.get("background_transition");
            return SL.config.THEME_BACKGROUND_TRANSITIONS.some(function(e) {
                return e.id === t && e.deprecated === !0
            })
        },
        isLoading: function() {
            return this.loading
        },
        clone: function() {
            return new SL.models.Theme(JSON.parse(JSON.stringify(this.toJSON())))
        },
        toJSON: function() {
            return {
                id: this.get("id"),
                name: this.get("name"),
                center: this.get("center"),
                rolling_links: this.get("rolling_links"),
                font: this.get("font"),
                color: this.get("color"),
                transition: this.get("transition"),
                background_transition: this.get("background_transition"),
                html: this.get("html"),
                less: this.get("less"),
                css: this.get("css"),
                js: this.get("js"),
                snippets: this.has("snippets") ? JSON.stringify(this.get("snippets").toJSON()) : null,
                palette: this.has("palette") ? this.get("palette").join(",") : null
            }
        }
    }),
    SL("models").Theme.fromDeck = function(t) {
        return new SL.models.Theme({
            id: t.theme_id,
            name: "",
            center: t.center,
            rolling_links: t.rolling_links,
            font: t.theme_font,
            color: t.theme_color,
            transition: t.transition,
            background_transition: t.background_transition,
            snippets: "",
            palette: []
        })
    },
    SL("models").UserMembership = SL.models.Model.extend({
        init: function(t) {
            this._super(t)
        },
        isAdmin: function() {
            return this.get("role") === SL.models.UserMembership.ROLE_ADMIN
        },
        isOwner: function() {
            return this.get("role") === SL.models.UserMembership.ROLE_OWNER
        },
        clone: function() {
            return new SL.models.UserMembership(JSON.parse(JSON.stringify(this.data)))
        }
    }),
    SL.models.UserMembership.ROLE_OWNER = "owner",
    SL.models.UserMembership.ROLE_ADMIN = "admin",
    SL.models.UserMembership.ROLE_MEMBER = "member",
    SL("models").UserSettings = SL.models.Model.extend({
        init: function(t) {
            this._super(t), this.has("present_controls") || this.set("present_controls", SL.config.PRESENT_CONTROLS_DEFAULT), this.has("present_upsizing") || this.set("present_upsizing", SL.config.PRESENT_UPSIZING_DEFAULT)
        },
        save: function(t) {
            var e = {
                user_settings: {}
            };
            return t ? t.forEach(function(t) {
                e.user_settings[t] = this.get(t)
            }.bind(this)) : e.user_settings = this.toJSON(), $.ajax({
                url: SL.config.AJAX_UPDATE_USER_SETTINGS,
                type: "PUT",
                data: e
            })
        },
        clone: function() {
            return new SL.models.UserSettings(JSON.parse(JSON.stringify(this.data)))
        }
    }),
    SL("models").User = Class.extend({
        init: function(t) {
            this.data = t || {}, $.extend(this, this.data), this.settings = new SL.models.UserSettings(this.data.settings), this.data.membership && (this.membership = new SL.models.UserMembership(this.data.membership))
        },
        isPro: function() {
            return !!this.pro
        },
        isEnterprise: function() {
            return !!this.enterprise
        },
        isEnterpriseManager: function() {
            return this.hasMembership() && (this.membership.isAdmin() || this.membership.isOwner())
        },
        hasMembership: function() {
            return !!this.membership
        },
        isMemberOfCurrentTeam: function() {
            return SL.current_team && SL.current_team.get("id") === this.get("team_id") ? !0 : !1
        },
        isManuallyUpgraded: function() {
            return !!this.manually_upgraded
        },
        get: function(t) {
            return this[t]
        },
        set: function(t, e) {
            this[t] = e
        },
        has: function(t) {
            var e = this.get(t);
            return !!e || e === !1 || 0 === e
        },
        hasThemes: function() {
            return SL.current_team ? SL.current_team.hasThemes() : void 0
        },
        getThemes: function() {
            return SL.current_team ? SL.current_team.get("themes") : new SL.collections.Collection
        },
        hasDefaultTheme: function() {
            return !!this.getDefaultTheme()
        },
        getDefaultTheme: function() {
            var t = this.getThemes();
            return t.getByProperties(SL.current_team ? {
                id: SL.current_team.get("default_theme_id")
            } : {
                id: this.default_theme_id
            })
        },
        getProfileURL: function() {
            return "/" + this.username
        },
        getProfilePictureURL: function() {
            return this.thumbnail_url
        },
        getNameOrSlug: function() {
            return this.name || this.username
        }
    }),
    SL("data").templates = {
        NEW_DECK_TEMPLATE: {
            html: ["<section>", '<div class="sl-block" data-block-type="text" style="width: 800px; left: 80px; top: 250px;">', '<div class="sl-block-content" data-placeholder-tag="h1" data-placeholder-text="Title Text">', "<h1>Title Text</h1>", "</div>", "</div>", "</section>"].join("")
        },
        DEFAULT_TEMPLATES: [{
            html: ["<section>", '<div class="sl-block" data-block-type="text" style="width: 800px; left: 80px; top: 270px;">', '<div class="sl-block-content" data-placeholder-tag="h1" data-placeholder-text="Title Text">', "<h1>Title Text</h1>", "</div>", "</div>", "</section>"].join("")
        }, {
            html: ["<section>", '<div class="sl-block" data-block-type="text" style="width: 800px; left: 80px; top: 190px;">', '<div class="sl-block-content" data-placeholder-tag="h1" data-placeholder-text="Title Text">', "<h1>Title Text</h1>", "</div>", "</div>", '<div class="sl-block" data-block-type="text" style="width: 800px; left: 80px; top: 255px;" data-layout-method="belowPreviousBlock">', '<div class="sl-block-content" data-placeholder-tag="h2" data-placeholder-text="Subtitle">', "<h2>Subtitle</h2>", "</div>", "</div>", "</section>"].join("")
        }, {
            html: ["<section>", '<div class="sl-block" data-block-type="text" style="width: 800px; left: 80px; top: 190px;">', '<div class="sl-block-content" data-placeholder-tag="h2" data-placeholder-text="Title Text">', "<h2>Title Text</h2>", "</div>", "</div>", '<div class="sl-block" data-block-type="text" style="width: 800px; left: 80px; top: 264px;" data-layout-method="belowPreviousBlock">', '<div class="sl-block-content">', "<ul>", "<li>Bullet One</li>", "<li>Bullet Two</li>", "<li>Bullet Three</li>", "</ul>", "</div>", "</div>", "</section>"].join("")
        }, {
            html: ["<section>", '<div class="sl-block" data-block-type="text" style="width: 410px; left: 49px; top: 106px; height: auto;">', '<div class="sl-block-content" data-placeholder-tag="h2" data-placeholder-text="Title Text" style="text-align: left;">', "<h2>Title Text</h2>", "</div>", "</div>", '<div class="sl-block" data-block-type="text" style="width: 410px; left: 49px; top: 200px; height: auto;">', '<div class="sl-block-content" data-placeholder-tag="p" data-placeholder-text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin urna odio, aliquam vulputate faucibus id, elementum lobortis felis. Mauris urna dolor, placerat ac sagittis quis." style="text-align: left;">', "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin urna odio, aliquam vulputate faucibus id, elementum lobortis felis. Mauris urna dolor, placerat ac sagittis quis.</p>", "</div>", "</div>", '<div class="sl-block" data-block-type="text" style="width: 410px; left: 499px; top: 106px; height: auto;">', '<div class="sl-block-content" data-placeholder-tag="h2" data-placeholder-text="Title Text" style="text-align: left;">', "<h2>Title Text</h2>", "</div>", "</div>", '<div class="sl-block" data-block-type="text" style="width: 410px; left: 499px; top: 200px; height: auto;">', '<div class="sl-block-content" data-placeholder-tag="p" data-placeholder-text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin urna odio, aliquam vulputate faucibus id, elementum lobortis felis. Mauris urna dolor, placerat ac sagittis quis." style="text-align: left;">', "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin urna odio, aliquam vulputate faucibus id, elementum lobortis felis. Mauris urna dolor, placerat ac sagittis quis.</p>", "</div>", "</div>", "</section>"].join("")
        }, {
            html: ["<section>", '<div class="sl-block" data-block-type="text" style="width: 900px; left: 30px; top: 58px; height: auto;">', '<div class="sl-block-content" data-placeholder-tag="h1" style="font-size: 200%; text-align: left;">', "<h1>One<br>Two<br>Three</h1>", "</div>", "</div>", "</section>"].join("")
        }, {
            html: ["<section>", '<div class="sl-block" data-block-type="text" style="width: 800px; left: 79px; top: 50px;">', '<div class="sl-block-content" data-placeholder-tag="h2" data-placeholder-text="Title Text">', "<h2>Title Text</h2>", "</div>", "</div>", '<div class="sl-block" data-block-type="image" style="width: 700px; height: 475px; left: 129px; top: 144px;">', '<div class="sl-block-content">', '<div class="editing-ui sl-block-overlay sl-block-placeholder"></div>', "</div>", "</div>", "</section>"].join("")
        }, {
            html: ["<section>", '<div class="sl-block" data-block-type="text" style="width: 430px; left: 23px; top: 87px;">', '<div class="sl-block-content" data-placeholder-tag="h2" data-placeholder-text="Title Text" style="text-align: left;">', "<h2>Title Text</h2>", "</div>", "</div>", '<div class="sl-block" data-block-type="text" style="width: 430px; left: 23px; top: 161px;" data-layout-method="belowPreviousBlock">', '<div class="sl-block-content" data-placeholder-tag="p" data-placeholder-text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec metus justo. Aliquam erat volutpat." style="z-index: 13; text-align: left;">', "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec metus justo. Aliquam erat volutpat.</p>", "</div>", "</div>", '<div class="sl-block" data-block-type="image" style="width: 454px; height: 641px; left: 479px; top: 29px;">', '<div class="sl-block-content">', '<div class="editing-ui sl-block-overlay sl-block-placeholder"></div>', "</div>", "</div>", "</section>"].join("")
        }, {
            html: ["<section>", '<div class="sl-block" data-block-type="image" style="width: 700px; height: 475px; left: 130px; top: 65px;">', '<div class="sl-block-content">', '<div class="editing-ui sl-block-overlay sl-block-placeholder"></div>', "</div>", "</div>", '<div class="sl-block" data-block-type="text" style="width: 800px; left: 80px; top: 575px;">', '<div class="sl-block-content" data-placeholder-tag="h2" data-placeholder-text="Title Text">', "<h2>Title Text</h2>", "</div>", "</div>", "</section>"].join("")
        }],
        LAYOUT_METHODS: {
            belowPreviousBlock: function(t, e) {
                var i = e.prev().get(0);
                i && e.css("top", i.offsetTop + i.offsetHeight)
            }
        },
        getNewDeckTemplate: function() {
            return new SL.models.Template(SL.data.templates.NEW_DECK_TEMPLATE)
        },
        getDefaultTemplates: function() {
            return new SL.collections.Collection(SL.data.templates.DEFAULT_TEMPLATES, SL.models.Template)
        },
        userTemplatesLoaded: !1,
        userTemplatesLoading: !1,
        userTemplatesCallbacks: [],
        getUserTemplates: function(t) {
            t = t || function() {}, SL.data.templates.userTemplatesLoading === !1 && SL.data.templates.userTemplatesLoaded === !1 ? (SL.data.templates.userTemplatesLoading = !0, SL.data.templates.userTemplatesCallbacks.push(t), $.ajax({
                type: "GET",
                url: SL.config.AJAX_SLIDE_TEMPLATES_LIST,
                context: this
            }).done(function(t) {
                SL.data.templates.userTemplates = new SL.collections.Collection(t.results, SL.models.Template), SL.data.templates.userTemplatesLoaded = !0, SL.data.templates.userTemplatesLoading = !1, SL.data.templates.userTemplatesCallbacks.forEach(function(t) {
                    t.call(null, SL.data.templates.userTemplates)
                }),
                    SL.data.templates.userTemplatesCallbacks.length = 0
            }).fail(function() {
                SL.data.templates.userTemplatesLoading = !1, SL.notify(SL.locale.get("TEMPLATE_LOAD_ERROR"), "negative")
            })) : SL.data.templates.userTemplatesLoading ? SL.data.templates.userTemplatesCallbacks.push(t) : t.call(null, SL.data.templates.userTemplates)
        },
        teamTemplatesLoaded: !1,
        teamTemplatesLoading: !1,
        teamTemplatesCallbacks: [],
        getTeamTemplates: function(t) {
            SL.current_user.isEnterprise() && (t = t || function() {}, SL.data.templates.teamTemplatesLoading === !1 && SL.data.templates.teamTemplatesLoaded === !1 ? (SL.data.templates.teamTemplatesLoading = !0, SL.data.templates.teamTemplatesCallbacks.push(t), $.ajax({
                type: "GET",
                url: SL.config.AJAX_TEAM_SLIDE_TEMPLATES_LIST,
                context: this
            }).done(function(t) {
                SL.data.templates.teamTemplates = new SL.collections.Collection(t.results, SL.models.Template), SL.data.templates.teamTemplatesLoaded = !0, SL.data.templates.teamTemplatesLoading = !1, SL.data.templates.teamTemplatesCallbacks.forEach(function(t) {
                    t.call(null, SL.data.templates.teamTemplates)
                }),
                    SL.data.templates.teamTemplatesCallbacks.length = 0
            }).fail(function() {
                SL.data.templates.teamTemplatesLoading = !1, SL.notify(SL.locale.get("TEMPLATE_LOAD_ERROR"), "negative")
            })) : SL.data.templates.teamTemplatesLoading ? SL.data.templates.teamTemplatesCallbacks.push(t) : t.call(null, SL.data.templates.teamTemplates))
        },
        layoutTemplate: function(t, e) {
            t.find(".sl-block").each(function(i, n) {
                n = $(n);
                var s = n.attr("data-layout-method");
                s && "function" == typeof SL.data.templates.LAYOUT_METHODS[s] && (e || n.removeAttr("data-layout-method"), SL.data.templates.LAYOUT_METHODS[s](t, n))
            })
        },
        templatize: function(t, e) {
            t = $(t), e = $.extend({
                placeholderText: !1,
                zIndex: !0
            }, e);
            var i = SL.editor.controllers.Serialize.getSlideAsString(t, {
                    templatize: !0,
                    inner: !0
                }),
                n = $("<section>" + i + "</section>");
            return n.children().each(function(t, i) {
                i = $(i), i.css({
                    "min-width": "",
                    "min-height": ""
                });
                var n = i.find(".sl-block-content");
                if (e.placeholderText && "text" === i.attr("data-block-type") && 1 === n.children().length) {
                    var s = $(n.children()[0]);
                    s.is("h1, h2") ? (s.html("Title Text"), n.attr("data-placeholder-text", "Title Text")) : s.is("p") && n.attr("data-placeholder-text", s.text().trim())
                }
                e.zIndex === !1 && n.css("z-index", "")
            }), ["class", "data-autoslide", "data-transition", "data-transition-speed", "data-background", "data-background-color", "data-background-image", "data-background-size"].forEach(function(e) {
                t.attr(e) && n.attr(e, t.attr(e))
            }), n.removeClass("past present future"), n.prop("outerHTML").trim()
        },
        generateFullSizeImageBlock: function(t, e, i, n, s) {
            var o = Math.min(n / e, s / i),
                a = e * o,
                r = i * o,
                l = Math.round((SL.config.SLIDE_WIDTH - a) / 2),
                c = Math.round((SL.config.SLIDE_HEIGHT - r) / 2);
            return ['<div class="sl-block" data-block-type="image" style="width: ' + a + "px; height: " + r + "px; left: " + l + "px; top: " + c + 'px;">', '<div class="sl-block-content">', '<img src="' + t + '" style="" data-natural-width="' + e + '" data-natural-height="' + i + '"/>', "</div>", "</div>"].join("")
        }
    },
    SL("data").tokens = {
        get: function(t, e) {
            e = e || {}, this._addCallbacks(t, e.success, e.error), "object" == typeof this.cache[t] ? this._triggerSuccessCallback(t, this.cache[t]) : "loading" !== this.cache[t] && (this.cache[t] = "loading", $.ajax({
                type: "GET",
                context: this,
                url: SL.config.AJAX_ACCESS_TOKENS_LIST(t)
            }).done(function(e) {
                var i = new SL.collections.Collection(e.results, SL.models.AccessToken);
                this.cache[t] = i, this._triggerSuccessCallback(t, i)
            }).fail(function(e) {
                delete this.cache[t], this._triggerErrorCallback(t, e.status)
            }))
        },
        create: function(t) {
            return new Promise(function(e, i) {
                SL.data.tokens.get(t, {
                    success: function(n) {
                        $.ajax({
                            type: "POST",
                            context: this,
                            url: SL.config.AJAX_ACCESS_TOKENS_CREATE(t),
                            data: {
                                access_token: {
                                    name: n.getUniqueName("Link", "name", !0)
                                }
                            }
                        }).done(function(t) {
                            n.create(t).then(e, i)
                        }).fail(i)
                    }.bind(this),
                    error: function() {
                        console.warn("Failed to load token collection for deck " + t), i()
                    }.bind(this)
                })
            }.bind(this))
        },
        cache: {},
        callbacks: {},
        _addCallbacks: function(t, e, i) {
            this.callbacks[t] || (this.callbacks[t] = {
                success: [],
                error: []
            }), e && this.callbacks[t].success.push(e), i && this.callbacks[t].error.push(i)
        },
        _triggerSuccessCallback: function(t, e) {
            var i = this.callbacks[t];
            if (i) {
                for (; i.success.length;) i.success.pop().call(null, e);
                i.success = [], i.error = []
            }
        },
        _triggerErrorCallback: function(t, e) {
            var i = this.callbacks[t];
            if (i) {
                for (; i.error.length;) i.error.pop().call(null, e);
                i.success = [], i.error = []
            }
        }
    },
    SL.util = {
        noop: function() {},
        getQuery: function() {
            var t = {};
            return location.search.replace(/[A-Z0-9\-]+?=([\w%\-]*)/gi, function(e) {
                t[e.split("=").shift()] = unescape(e.split("=").pop())
            }), t
        },
        // getMetaKeyName: function() {
        //     return SL.util.device.isMac() ? "&#8984" : "CTRL"
        // },
        escapeHTMLEntities: function(t) {
            return t = t || "", t = t.split("<").join("&lt;"), t = t.split(">").join("&gt;")
        },
        unescapeHTMLEntities: function(t) {
            return (t || "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&cent;/g, "\xa2").replace(/&pound;/g, "\xa3").replace(/&yen;/g, "\xa5").replace(/&euro;/g, "\u20ac").replace(/&copy;/g, "\xa9").replace(/&reg;/g, "\xae").replace(/&nbsp;/g, " ")
        },
        toArray: function(t) {
            for (var e = [], i = 0, n = t.length; n > i; i++) e.push(t[i]);
            return e
        },
        skipCSSTransitions: function(t, e) {
            t = $(t ? t : "html");
            var i = typeof t.get(0);
            ("undefined" === i || "number" === i) && console.warn("Bad target for skipCSSTransitions."), t.addClass("no-transition"), setTimeout(function() {
                t.removeClass("no-transition")
            }, e || 1)
        },
        setupReveal: function(t) {
            if ("undefined" != typeof Reveal) {
                var e = {
                    controls: !0,
                    progress: !0,
                    history: !1,
                    mouseWheel: !1,
                    margin: .05,
                    autoSlideStoppable: !0,
                    dependencies: [{
                        src: SL.config.ASSET_URLS["reveal-plugins/markdown/marked.js"],
                        condition: function() {
                            return !!document.querySelector(".reveal [data-markdown]")
                        }
                    }, {
                        src: SL.config.ASSET_URLS["reveal-plugins/markdown/markdown.js"],
                        condition: function() {
                            return !!document.querySelector(".reveal [data-markdown]")
                        }
                    }, {
                        src: SL.config.ASSET_URLS["reveal-plugins/highlight/highlight.js"],
                        async: !0,
                        condition: function() {
                            return !!document.querySelector(".reveal pre code")
                        },
                        callback: function() {
                            hljs.initHighlighting(), hljs.initHighlightingOnLoad()
                        }
                    }]
                };
                if (SLConfig && SLConfig.deck && (e.autoSlide = SLConfig.deck.auto_slide_interval || 0, e.rollingLinks = SLConfig.deck.rolling_links, e.center = SLConfig.deck.center, e.loop = SLConfig.deck.should_loop, e.rtl = SLConfig.deck.rtl, e.showNotes = SLConfig.deck.share_notes, e.slideNumber = SLConfig.deck.slide_number, e.transition = SLConfig.deck.transition || "default", e.backgroundTransition = SLConfig.deck.background_transition), $.extend(e, t), SL.util.deck.injectNotes(), Reveal.initialize(e), Reveal.addEventListener("ready", function() {
                        window.STATUS = window.STATUS || {}, window.STATUS.REVEAL_IS_READY = !0, $("html").addClass("reveal-is-ready")
                    }), t && t.openLinksInTabs && this.openLinksInTabs($(".reveal .slides")), t && t.trackEvents) {
                    var i = [];
                    Reveal.addEventListener("slidechanged", function() {
                        var t = Reveal.getProgress();
                        t >= .5 && !i[0] && (i[0] = !0, SL.analytics.trackPresenting("Presentation progress: 50%")), t >= 1 && !i[1] && (i[1] = !0, SL.analytics.trackPresenting("Presentation progress: 100%")), SL.analytics.trackCurrentSlide()
                    })
                }
            }
        },
        openLinksInTabs: function(t) {
            t && t.find("a").each(function() {
                var t = $(this),
                    e = t.attr("href");
                /^#/gi.test(e) === !0 || this.hasAttribute("download") ? t.removeAttr("target") : /http|www/gi.test(e) ? t.attr("target", "_blank") : t.attr("target", "_top")
            })
        },
        openPopupWindow: function(t, e, i, n) {
            var s = window.innerWidth / 2 - i / 2,
                o = window.innerHeight / 2 - n / 2;
            "number" == typeof window.screenX && (s += window.screenX, o += window.screenY);
            var a = window.open(t, e, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + i + ", height=" + n + ", top=" + o + ", left=" + s);
            return a.moveTo(s, o), a
        },
        prefixSelectorsInStyle: function(t, e) {
            var i = [];
            SL.util.toArray(t.sheet.cssRules).forEach(function(t) {
                if (1 === t.type && t.selectorText && t.cssText) {
                    var n = t.cssText;
                    n = n.replace(t.selectorText, ""), n = n.trim(), n = n.slice(1, n.length - 1), n = n.trim(), n = n.split(";").map(function(t) {
                        return t = t.trim(), "" === t ? "" : "\n	" + t
                    }).join(";");
                    var s = t.selectorText.split(",").map(function(t) {
                        return t = t.trim(), 0 === t.indexOf(e) ? t : e + t
                    }).join(", ");
                    i.push(s + " {" + n + "\n}")
                } else 7 === t.type && t.cssText && i.push(t.cssText)
            }), t.innerHTML = "\n" + i.join("\n\n") + "\n"
        },
        layoutReveal: function(t, e) {
            if (clearInterval(this.revealLayoutInterval), clearTimeout(this.revealLayoutTimeout), 1 === arguments.length) this.revealLayoutTimeout = setTimeout(Reveal.layout, t);
            else {
                if (2 !== arguments.length) throw "Illegal arguments, expected (duration[, fps])";
                this.revealLayoutInterval = setInterval(Reveal.layout, e), this.revealLayoutTimeout = setTimeout(function() {
                    clearInterval(this.revealLayoutInterval)
                }.bind(this), t)
            }
        },
        getRevealSlideBounds: function(t, e) {
            t = t || SL.editor.controllers.Markup.getCurrentSlide();
            var i = t.offset(),
                n = Reveal.getScale(),
                s = i.left * n,
                o = i.top * n;
            if (e) {
                var a = $(".projector").offset();
                a && (s -= a.left, o -= a.top)
            }
            return {
                x: s,
                y: o,
                width: t.outerWidth() * n,
                height: t.outerHeight() * n
            }
        },
        getRevealSlidesBounds: function(t) {
            var e = $(".reveal .slides"),
                i = e.offset(),
                n = Reveal.getScale(),
                s = i.left * n,
                o = i.top * n;
            if (t) {
                var a = $(".projector").offset();
                a && (s -= a.left, o -= a.top)
            }
            return {
                x: s,
                y: o,
                width: e.outerWidth() * n,
                height: e.outerHeight() * n
            }
        },
        getRevealElementOffset: function(t, e) {
            t = $(t);
            var i = {
                x: 0,
                y: 0
            };
            if (t.parents("section").length)
                for (; t.length && !t.is("section");) i.x += t.get(0).offsetLeft, i.y += t.get(0).offsetTop, e && (i.x -= parseInt(t.css("margin-left"), 10), i.y -= parseInt(t.css("margin-top"), 10)), t = $(t.get(0).offsetParent);
            return i
        },
        getRevealElementGlobalOffset: function(t) {
            var e = $(t),
                i = e.closest(".reveal"),
                n = {
                    x: 0,
                    y: 0
                };
            if (e.length && i.length) {
                var s = Reveal.getConfig(),
                    o = Reveal.getScale(),
                    a = i.get(0).getBoundingClientRect(),
                    r = {
                        x: a.left + a.width / 2,
                        y: a.top + a.height / 2
                    },
                    l = s.width * o,
                    c = s.height * o;
                n.x = r.x - l / 2, n.y = r.y - c / 2;
                var d = e.closest(".slides section");
                d.length && (n.y -= d.scrollTop() * o);
                var h = SL.util.getRevealElementOffset(e);
                n.x += h.x * o, n.y += h.y * o
            }
            return n
        },
        getRevealCounterScale: function() {
            return window.Reveal ? 2 - Reveal.getScale() : 1
        },
        globalToRevealCoordinate: function(t, e) {
            var i = SL.util.getRevealSlideBounds(),
                n = SL.util.getRevealCounterScale();
            return {
                x: (t - i.x) * n,
                y: (e - i.y) * n
            }
        },
        globalToProjectorCoordinate: function(t, e) {
            var i = {
                    x: t,
                    y: e
                },
                n = $(".projector").offset();
            return n && (i.x -= n.left, i.y -= n.top), i
        },
        // hideAddressBar: function() {
        //     if (SL.util.device.IS_PHONE && !/crios/gi.test(navigator.userAgent)) {
        //         var t = function() {
        //             setTimeout(function() {
        //                 window.scrollTo(0, 1)
        //             }, 10)
        //         };
        //         $(window).on("orientationchange", function() {
        //             t()
        //         }), t()
        //     }
        // },
        callback: function() {
            "function" == typeof arguments[0] && arguments[0].apply(null, [].slice.call(arguments, 1))
        },
        getPlaceholderImage: function(t) {
            var e = "";
            return t && "function" == typeof window.btoa && (e = window.btoa(Math.random().toString()).replace(/=/g, "")), "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" + e
        },
        isTypingEvent: function(t) {
            return $(t.target).is('input:not([type="file"]), textarea, [contenteditable]')
        },
        isTyping: function() {
            var t = document.activeElement && "inherit" !== document.activeElement.contentEditable,
                e = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName);
            return t || e
        }
    },
    SL.util.user = {
        isLoggedIn: function() {
            return "object" == typeof SLConfig && "object" == typeof SLConfig.current_user
        },
        isPro: function() {
            return SL.util.user.isLoggedIn() ? SLConfig.current_user.pro : null
        },
        isEnterprise: function() {
            return SL.util.user.isLoggedIn() ? SLConfig.current_user.enterprise : null
        },
        canUseCustomCSS: function() {
            return this.isLoggedIn() && this.isPro()
        }
    },
    // SL.util.device = {
    //     HAS_TOUCH: !!("ontouchstart" in window),
    //     IS_PHONE: /iphone|ipod|android|windows\sphone/gi.test(navigator.userAgent),
    //     IS_TABLET: /ipad/gi.test(navigator.userAgent),
    //     isMac: function() {
    //         // return /Mac/.test(navigator.platform)
    //     },
    //     isWindows: function() {
    //         //return /Win/g.test(navigator.platform)
    //     },
    //     isLinux: function() {
    //         // return /Linux/g.test(navigator.platform)
    //     },
    //     isIE: function() {
    //         //return /MSIE\s[0-9]/gi.test(navigator.userAgent) || /Trident\/7.0;(.*)rv:\d\d/.test(navigator.userAgent)
    //     },
    //     isChrome: function() {
    //         //return /chrome/gi.test(navigator.userAgent)
    //     },
    //     isSafari: function() {
    //         //return /safari/gi.test(navigator.userAgent) && !SL.util.device.isChrome()
    //     },
    //     isSafariDesktop: function() {
    //         //return SL.util.device.isSafari() && !SL.util.device.isChrome() && !SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET
    //     },
    //     isOpera: function() {
    //         //return !!window.opera
    //     },
    //     isFirefox: function() {
    //         //return /firefox\/\d+\.?\d+/gi.test(navigator.userAgent)
    //     },
    //     isPhantomJS: function() {
    //         return /PhantomJS/gi.test(navigator.userAgent)
    //     },
    //     supportedByEditor: function() {
    //         return Modernizr.history && Modernizr.csstransforms && !SL.util.device.isOpera()
    //     },
    //     getScrollBarWidth: function() {
    //         var t = $("<div>").css({
    //             width: "100px",
    //             height: "100px",
    //             overflow: "scroll",
    //             position: "absolute",
    //             top: "-9999px"
    //         });
    //         t.appendTo(document.body);
    //         var e = t.prop("offsetWidth") - t.prop("clientWidth");
    //         return t.remove(), e
    //     }
    // },
    SL.util.trig = {
        distanceBetween: function(t, e) {
            var i = t.x - e.x,
                n = t.y - e.y;
            return Math.sqrt(i * i + n * n)
        },
        intersection: function(t, e) {
            return {
                width: Math.max(0, Math.min(t.x + t.width, e.x + e.width) - Math.max(t.x, e.x)),
                height: Math.max(0, Math.min(t.y + t.height, e.y + e.height) - Math.max(t.y, e.y))
            }
        },
        intersects: function(t, e, i) {
            "undefined" == typeof i && (i = 0);
            var n = SL.util.trig.intersection(t, e);
            return n.width > t.width * i && n.height > t.height * i
        },
        isPointWithinRect: function(t, e, i) {
            return t > i.x && t < i.x + i.width && e > i.y && e < i.y + i.height
        },
        findLineIntersection: function(t, e, i, n) {
            var s = {
                    x: e.x - t.x,
                    y: e.y - t.y
                },
                o = {
                    x: n.x - i.x,
                    y: n.y - i.y
                },
                a = (-s.y * (t.x - i.x) + s.x * (t.y - i.y)) / (-o.x * s.y + s.x * o.y),
                r = (o.x * (t.y - i.y) - o.y * (t.x - i.x)) / (-o.x * s.y + s.x * o.y);
            return a >= 0 && 1 >= a && r >= 0 && 1 >= r ? {
                x: t.x + r * s.x,
                y: t.y + r * s.y
            } : null
        }
    },
    SL.util.string = {
        URL_REGEX: /((https?\:\/\/)|(www\.)|(\/\/))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i,
        SCRIPT_TAG_REGEX: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        uniqueIDCount: 0,
        uniqueID: function(t) {
            return SL.util.string.uniqueIDCount += 1, (t || "") + SL.util.string.uniqueIDCount + "-" + Date.now()
        },
        slug: function(t) {
            return "string" == typeof t ? (t = SL.util.string.trim(t), t = t.toLowerCase(), t = t.replace(/-/g, " "), t = t.replace(/[^\w\s]/g, ""), t = t.replace(/\s{2,}/g, " "), t = t.replace(/\s/g, "-")) : ""
        },
        trim: function(t) {
            return SL.util.string.trimRight(SL.util.string.trimLeft(t))
        },
        trimLeft: function(t) {
            return "string" == typeof t ? t.replace(/^\s+/, "") : ""
        },
        trimRight: function(t) {
            return "string" == typeof t ? t.replace(/\s+$/, "") : ""
        },
        linkify: function(t) {
            return t && (t = t.replace(/((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi, function(t) {
                var e = t;
                return e.match("^https?://") || (e = "http://" + e), '<a href="' + e + '">' + t + "</a>"
            })), t
        },
        pluralize: function(t, e, i) {
            return i ? t + e : t
        },
        getCustomClassesFromLESS: function(t) {
            var e = (t || "").match(/\/\/=[a-z0-9-_ \t]{2,}(?=\n)?/gi);
            return e ? e.map(function(t) {
                return t = t.replace("//=", ""), t = t.trim(), t = t.toLowerCase(), t = t.replace(/\s/g, "-")
            }) : []
        }
    },
    SL.util.math = {
        limitDecimals: function(t, e) {
            var i = Math.pow(10, e);
            return Math.round(t * i) / i
        }
    },
    SL.util.validate = {
        name: function() {
            return []
        },
        slug: function(t) {
            t = t || "";
            var e = [];
            return t.length < 2 && e.push("At least 2 characters"), /\s/gi.test(t) && e.push("No spaces please"), /^[\w-_]+$/gi.test(t) || e.push("Can only contain: A-Z, 0-9, - and _"), e
        },
        username: function(t) {
            return SL.util.validate.slug(t)
        },
        team_slug: function(t) {
            return SL.util.validate.slug(t)
        },
        password: function(t) {
            t = t || "";
            var e = [];
            return t.length < 6 && e.push("At least 6 characters"), e
        },
        email: function(t) {
            t = t || "";
            var e = [];
            return /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$/gi.test(t) || e.push("Please enter a valid email"), e
        },
        twitterhandle: function(t) {
            t = t || "";
            var e = [];
            return t.length > 15 && e.push("15 characters max"), /\s/gi.test(t) && e.push("No spaces please"), /^[\w-_]+$/gi.test(t) || e.push("Can only contain: A-Z, 0-9 and _"), e
        },
        url: function(t) {
            t = t || "";
            var e = [];
            return t.length < 4 && e.push("Please enter a valid URL"), /\s/gi.test(t) && e.push("No spaces please"), e
        },
        decktitle: function(t) {
            t = t || "";
            var e = [];
            return 0 === t.length && e.push("Can not be empty"), e
        },
        deckslug: function(t) {
            t = t || "";
            var e = [];
            return 0 === t.length && e.push("Can not be empty"), e
        },
        google_analytics_id: function(t) {
            t = t || "";
            var e = [];
            return /\bUA-\d{4,20}-\d{1,10}\b/gi.test(t) || e.push("Please enter a valid ID"), e
        },
        none: function() {
            return []
        }
    },
    SL.util.dom = {
        scrollIntoViewIfNeeded: function(t) {
            t && ("function" == typeof t.scrollIntoViewIfNeeded ? t.scrollIntoViewIfNeeded.apply(t, [].slice.call(arguments, 1)) : "function" == typeof t.scrollIntoView && t.scrollIntoView())
        },
        preventTouchOverflowScrolling: function(t) {
            t = $(t);
            var e, i, n;
            t.get(0).addEventListener("touchstart", function(t) {
                e = this.scrollTop > 0, i = this.scrollTop < this.scrollHeight - this.clientHeight, n = t.pageY
            }), t.get(0).addEventListener("touchmove", function(t) {
                var s = t.pageY > n,
                    o = !s;
                n = t.pageY, s && e || o && i ? t.stopPropagation() : t.preventDefault()
            })
        },
        insertCSRF: function(t, e) {
            "undefined" == typeof e && (e = $('meta[name="csrf-token"]').attr("content")), e && (t.find('input[name="authenticity_token"]').remove(), t.append('<input name="authenticity_token" type="hidden" value="' + e + '" />'))
        },
        calculateStyle: function(t) {
            window.getComputedStyle($(t).get(0)).opacity
        }
    },
    SL.util.html = {
        indent: function(t) {
            t = t.replace(/<br>/gi, "<br/>"), t = t.replace(/(<img("[^"]*"|[^>])+)/gi, "$1/");
            var e = vkbeautify.xml(t);
            return e = e.replace(/<pre>[\n\r\t\s]+<code/gi, "<pre><code"), e = e.replace(/<\/code>[\n\r\t\s]+<\/pre>/gi, "</code></pre>")
        },
        ATTR_SRC_NORMAL: "src",
        ATTR_SRC_SILENCED: "data-silenced-src",
        ATTR_SRC_NORMAL_REGEX: " src=",
        ATTR_SRC_SILENCED_REGEX: " data-silenced-src=",
        muteSources: function(t) {
            return (t || "").replace(new RegExp(SL.util.html.ATTR_SRC_NORMAL_REGEX, "gi"), SL.util.html.ATTR_SRC_SILENCED_REGEX)
        },
        unmuteSources: function(t) {
            return (t || "").replace(new RegExp(SL.util.html.ATTR_SRC_SILENCED_REGEX, "gi"), SL.util.html.ATTR_SRC_NORMAL_REGEX)
        },
        trimCode: function(t) {
            $(t).find("pre code").each(function() {
                var t = $(this).parent("pre"),
                    e = t.html(),
                    i = $.trim(e);
                e !== i && t.html(i)
            })
        },
        removeAttributes: function(t, e) {
            t = $(t);
            var i = $.map(t.get(0).attributes, function(t) {
                return t.name
            });
            "function" == typeof e && (i = i.filter(e)), $.each(i, function(e, i) {
                t.removeAttr(i)
            })
        },
        removeClasses: function(t, e) {
            if (t = $(t), "function" == typeof e) {
                var i = (t.attr("class") || "").split(" ").filter(e);
                t.removeClass(i.join(" "))
            } else t.attr("class", "")
        },
        findScriptTags: function(t) {
            var e = document.createElement("div");
            e.innerHTML = t;
            var i = SL.util.toArray(e.getElementsByTagName("script"));
            return i.map(function(t) {
                return t.outerHTML
            })
        },
        removeScriptTags: function(t) {
            var e = document.createElement("div");
            e.innerHTML = t;
            var i = SL.util.toArray(e.getElementsByTagName("script"));
            return i.forEach(function(t) {
                t.parentNode.removeChild(t)
            }), e.innerHTML
        },
        createSpinner: function(t) {
            return t = $.extend({
                lines: 12,
                radius: 8,
                length: 6,
                width: 3,
                color: "#fff",
                zIndex: "auto",
                left: "0",
                top: "0",
                className: ""
            }, t), new Spinner(t)
        },
        generateSpinners: function() {
            $(".spinner").each(function(t, e) {
                if (e.hasAttribute("data-spinner-state") === !1) {
                    e.setAttribute("data-spinner-state", "spinning");
                    var i = {};
                    e.hasAttribute("data-spinner-color") && (i.color = e.getAttribute("data-spinner-color")), e.hasAttribute("data-spinner-lines") && (i.lines = parseInt(e.getAttribute("data-spinner-lines"), 10)), e.hasAttribute("data-spinner-width") && (i.width = parseInt(e.getAttribute("data-spinner-width"), 10)), e.hasAttribute("data-spinner-radius") && (i.radius = parseInt(e.getAttribute("data-spinner-radius"), 10)), e.hasAttribute("data-spinner-length") && (i.length = parseInt(e.getAttribute("data-spinner-length"), 10));
                    var n = SL.util.html.createSpinner(i);
                    n.spin(e)
                }
            })
        },
        createDeckThumbnail: function(t) {
            var t = {
                    DECK_URL: t.user.username + "/" + t.slug,
                    DECK_VIEWS: "number" == typeof t.view_count ? t.view_count : "N/A",
                    DECK_THUMB_URL: t.thumbnail_url || SL.config.DEFAULT_DECK_THUMBNAIL,
                    USER_URL: "/" + t.user.username,
                    USER_NAME: t.user.name || t.user.username,
                    USER_THUMB_URL: t.user.thumbnail_url || SL.config.DEFAULT_USER_THUMBNAIL
                },
                e = SL.config.DECK_THUMBNAIL_TEMPLATE;
            for (var i in t) e = e.replace("{{" + i + "}}", t[i]);
            return $(e)
        }
    },
    SL.util.deck = {
        idCounter: 1,
        sortInjectedStyles: function() {
            var t = $("head");
            $("#theme-css-output").appendTo(t), $("#user-css-output").appendTo(t)
        },
        afterSlidesChanged: function() {
            this.generateIdentifiers(), this.generateSlideNumbers()
        },
        generateIdentifiers: function(t) {
            $(t || ".reveal .slides section").each(function() {
                (this.hasAttribute("data-id") === !1 || 0 === this.getAttribute("data-id").length) && this.setAttribute("data-id", CryptoJS.MD5(["slide", SL.current_user.get("id"), SL.current_deck.get("id"), Date.now(), SL.util.deck.idCounter++].join("-")).toString())
            }), this.generateSlideNumbers()
        },
        generateSlideNumbers: function() {
            this.slideNumberMap = {}, $(".reveal .slides>section[data-id]").each(function(t, e) {
                t += 1, e = $(e), e.hasClass("stack") ? e.find(">section[data-id]").each(function(e, i) {
                    e += 1, i = $(i), this.slideNumberMap[i.attr("data-id")] = t + (e > 1 ? "." + e : "")
                }.bind(this)) : this.slideNumberMap[e.attr("data-id")] = t
            }.bind(this))
        },
        getSlideNumber: function(t) {
            return this.slideNumberMap || this.generateSlideNumbers(), this.slideNumberMap[this.getSlideID(t)]
        },
        getSlideID: function(t) {
            return "string" == typeof t ? t : t && "function" == typeof t.getAttribute ? t.getAttribute("data-id") : t && "function" == typeof t.attr ? t.attr("data-id") : void 0
        },
        getSlideIndicesFromIdentifier: function(t) {
            var e = $('.reveal .slides section[data-id="' + t + '"]');
            return e.length ? Reveal.getIndices(e.get(0)) : null
        },
        injectNotes: function() {
            SLConfig.deck && SLConfig.deck.notes && [].forEach.call(document.querySelectorAll(".reveal .slides section"), function(t) {
                var e = SLConfig.deck.notes[t.getAttribute("data-id")];
                e && "string" == typeof e && t.setAttribute("data-notes", e)
            })
        },
        getBackgroundColor: function() {
            var t = $(".reveal-viewport");
            if (t.length) {
                var e = t.css("background-color");
                if (window.Reveal && window.Reveal.isReady()) {
                    var i = window.Reveal.getIndices(),
                        n = window.Reveal.getSlideBackground(i.h, i.v);
                    if (n) {
                        var s = n.style.backgroundColor;
                        s && window.tinycolor(s).getAlpha() > 0 && (e = s)
                    }
                }
                if (e) return e
            }
            return "#ffffff"
        },
        getBackgroundContrast: function() {
            return SL.util.color.getContrast(SL.util.deck.getBackgroundColor())
        },
        getBackgroundBrightness: function() {
            return SL.util.color.getBrightness(SL.util.deck.getBackgroundColor())
        },
        navigateToSlide: function(t) {
            if (t) {
                var e = Reveal.getIndices(t);
                Reveal.slide(e.h, e.v)
            }
        },
        replaceHTML: function(t) {
            SL.util.skipCSSTransitions($(".reveal"), 1);
            var e = Reveal.getState();
            $(".reveal .slides").get(0).innerHTML = t, Reveal.setState(e), Reveal.sync(), this.afterSlidesChanged()
        }
    },
    SL.util.color = {
        getContrast: function(t) {
            var e = window.tinycolor(t).toRgb(),
                i = (299 * e.r + 587 * e.g + 114 * e.b) / 1e3;
            return i / 255
        },
        getBrightness: function(t) {
            var e = window.tinycolor(t).toRgb(),
                i = e.r / 255 * .3 + e.g / 255 * .59 + (e.b / 255 + .11);
            return i / 2
        },
        getImageColor: function(t, e) {
            return new Promise(function(i, n) {
                var s = document.createElement("img");
                s.addEventListener("load", function() {
                    var t, o = document.createElement("canvas"),
                        a = o.getContext && o.getContext("2d"),
                        r = {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0
                        };
                    a || n();
                    var l = o.height = s.naturalHeight || s.offsetHeight || s.height,
                        c = o.width = s.naturalWidth || s.offsetWidth || s.width;
                    a.drawImage(s, 0, 0);
                    try {
                        t = a.getImageData(0, 0, c, l)
                    } catch (d) {
                        n()
                    }
                    var h = 4,
                        u = t.data.length,
                        p = 0;
                    if ("number" != typeof e && (e = 8, "number" == typeof u))
                        for (; u / e > 5e4;) e += 8;
                    for (;
                        (h += 4 * e) < u;) ++p, r.r += t.data[h], r.g += t.data[h + 1], r.b += t.data[h + 2], r.a += t.data[h + 3];
                    r.r = ~~(r.r / p), r.g = ~~(r.g / p), r.b = ~~(r.b / p), r.a = ~~(r.a / p), r.a = r.a / 255, i(r)
                }), s.addEventListener("error", function() {
                    n()
                }), s.setAttribute("crossorigin", "anonymous"), s.setAttribute("src", t)
            })
        }
    },
    SL.util.anim = {
        collapseListItem: function(t, e, i) {
            t = $(t), t.addClass("no-transition"), t.css({
                overflow: "hidden"
            }), t.animate({
                opacity: 0,
                height: 0,
                minHeight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0
            }, {
                duration: i || 500,
                complete: e
            })
        }
    },
    SL.util.social = {
        getFacebookShareLink: function(t, e, i, n) {
            return "http://www.facebook.com/sharer.php?s=100&p[title]=" + encodeURIComponent(e) + "&p[summary]=" + encodeURIComponent(i) + "&p[url]=" + t + "&p[images][0]=" + n
        },
        getTwitterShareLink: function(t, e) {
            return "http://twitter.com/share?text=" + encodeURIComponent(e) + "&url=" + encodeURIComponent(t) + "&via=slides"
        },
        getGoogleShareLink: function(t) {
            return "https://plus.google.com/share?url=" + encodeURIComponent(t)
        }
    },
    SL.util.selection = {
        clear: function() {
            window.getSelection && (window.getSelection().empty ? window.getSelection().empty() : window.getSelection().removeAllRanges && window.getSelection().removeAllRanges())
        },
        moveCursorToEnd: function(t) {
            if (t) {
                t.focus();
                var e = document.createRange();
                e.selectNodeContents(t), e.collapse(!1), selection = window.getSelection(), selection.removeAllRanges(), selection.addRange(e)
            }
        },
        selectText: function(t) {
            var e, i;
            document.body.createTextRange ? (e = document.body.createTextRange(), e.moveToElementText(t), e.select()) : window.getSelection && (i = window.getSelection(), e = document.createRange(), e.selectNodeContents(t), i.removeAllRanges(), i.addRange(e))
        },
        getSelectedElement: function() {
            var t = window.getSelection();
            return t && t.anchorNode ? t.anchorNode.parentNode : null
        },
        getSelectedTags: function() {
            var t = SL.util.selection.getSelectedElement(),
                e = [];
            if (t)
                for (; t;) e.push(t.nodeName.toLowerCase()), t = t.parentNode;
            return e
        },
        getSelectedHTML: function() {
            var t;
            if (document.selection && document.selection.createRange) return t = document.selection.createRange(), t.htmlText;
            if (window.getSelection) {
                var e = window.getSelection();
                if (e.rangeCount > 0) {
                    t = e.getRangeAt(0);
                    var i = t.cloneContents(),
                        n = document.createElement("div");
                    return n.appendChild(i), n.innerHTML
                }
            }
            return ""
        }
    }, "undefined" != typeof window.Spinner && "undefined" != typeof SL.util && SL.util.html.generateSpinners(),
    SL.activity = {
        init: function() {
            this.initialized || (this.initialized = !0, this.history = [Date.now()], this.listeners = [], this.bind(), setInterval(this.checkListeners.bind(this), 500))
        },
        bind: function() {
            this.onUserInput = $.throttle(this.onUserInput.bind(this), 100), document.addEventListener("mousedown", this.onUserInput), document.addEventListener("mousemove", this.onUserInput), document.addEventListener("touchstart", this.onUserInput), document.addEventListener("touchmove", this.onUserInput), document.addEventListener("keydown", this.onUserInput), window.addEventListener("scroll", this.onUserInput), window.addEventListener("mousewheel", this.onUserInput)
        },
        checkListeners: function() {
            this.listeners.forEach(function(t) {
                this.hasBeenInactiveFor(t.duration) ? t.active === !0 && (t.active = !1, "function" == typeof t.inactiveCallback && t.inactiveCallback()) : t.active === !1 && (t.active = !0, "function" == typeof t.activeCallback && t.activeCallback())
            }, this)
        },
        hasBeenInactiveFor: function(t) {
            return Date.now() - this.history[0] > t
        },
        register: function(t, e, i) {
            this.initialized || this.init(), this.listeners.push({
                active: !this.hasBeenInactiveFor(t),
                duration: t,
                activeCallback: e,
                inactiveCallback: i
            })
        },
        onUserInput: function() {
            this.history.unshift(Date.now()), this.history.splice(1e3)
        }
    },
    SL.analytics = {
        CATEGORY_OTHER: "other",
        CATEGORY_EDITOR: "editor",
        CATEGORY_THEMING: "theming",
        CATEGORY_PRESENTING: "presenting",
        CATEGORY_COLLABORATION: "collaboration",
        _track: function(t, e, i) {
            "undefined" != typeof window.ga && ga("send", "event", t, e, i)
        },
        _trackPageView: function(t, e) {
            e = e || document.title, "undefined" != typeof window.ga && ga(function() {
                for (var i = ga.getAll(), n = 0; n < i.length; ++n) i[n].send("pageview", {
                    page: t,
                    title: e
                })
            })
        },
        track: function(t, e) {
            this._track(SL.analytics.CATEGORY_OTHER, t, e)
        },
        trackEditor: function(t, e) {
            this._track(SL.analytics.CATEGORY_EDITOR, t, e)
        },
        trackTheming: function(t, e) {
            this._track(SL.analytics.CATEGORY_THEMING, t, e)
        },
        trackPresenting: function(t, e) {
            this._track(SL.analytics.CATEGORY_PRESENTING, t, e)
        },
        trackCollaboration: function(t, e) {
            this._track(SL.analytics.CATEGORY_COLLABORATION, t, e)
        },
        trackCurrentSlide: function(t) {
            if (window.Reveal) {
                var e = window.Reveal.getIndices(),
                    t = window.location.pathname + "/" + e.h;
                "number" == typeof e.v && e.v > 0 && (t += "/" + e.v);
                var i = $(Reveal.getCurrentSlide()).find("h1, h2, h3").first().text().trim();
                (!i || i.length < 2) && (i = "Untitled"), this._trackPageView(t, i)
            }
        }
    },
    SL.config = {
        SLIDE_WIDTH: 1024,
        SLIDE_HEIGHT: 768,
        LOGIN_STATUS_INTERVAL: 6e4,
        UNSAVED_CHANGES_INTERVAL: 1500,
        AUTOSAVE_INTERVAL: 4e3,
        DECK_SAVE_TIMEOUT: 25e3,
        DECK_TITLE_MAXLENGTH: 200,
        MEDIA_LABEL_MAXLENGTH: 200,
        SPEAKER_NOTES_MAXLENGTH: 1e4,
        COLLABORATION_IDLE_TIMEOUT: 24e4,
        COLLABORATION_RESET_WRITING_TIMEOUT: 15e3,
        COLLABORATION_SEND_WRITING_INTERVAL: 5e3,
        COLLABORATION_COMMENT_MAXLENGTH: 1e3,
        MAX_IMAGE_UPLOAD_SIZE: 2.5,
        MAX_IMPORT_UPLOAD_SIZE: 1e5,
        IMPORT_SOCKET_TIMEOUT: 24e4,
        PRESENT_CONTROLS_DEFAULT: !0,
        PRESENT_UPSIZING_DEFAULT: !0,
        PRESENT_UPSIZING_MAX_SCALE: 10,
        DEFAULT_SLIDE_TRANSITION_DURATION: 800,
        DEFAULT_THEME_COLOR: "white-blue",
        DEFAULT_THEME_FONT: "montserrat",
        DEFAULT_THEME_TRANSITION: "slide",
        DEFAULT_THEME_BACKGROUND_TRANSITION: "slide",
        AUTO_SLIDE_OPTIONS: [2, 4, 6, 8, 10, 15, 20, 30, 40],
        RESERVED_SLIDE_CLASSES: ["past", "present", "future", "disabled", "overflowing"],
        FRAGMENT_STYLES: [{
            id: "",
            title: "Fade in"
        }, {
            id: "fade-down",
            title: "Fade in from above"
        }, {
            id: "fade-up",
            title: "Fade in from below"
        }, {
            id: "fade-right",
            title: "Fade in from left"
        }, {
            id: "fade-left",
            title: "Fade in from right"
        }, {
            id: "fade-out",
            title: "Fade out"
        }, {
            id: "current-visible",
            title: "Fade in then out"
        }],
        THEME_COLORS: [{
            id: "white-blue"
        }, {
            id: "sand-blue"
        }, {
            id: "beige-brown"
        }, {
            id: "silver-green"
        }, {
            id: "silver-blue"
        }, {
            id: "sky-blue"
        }, {
            id: "blue-yellow"
        }, {
            id: "cobalt-orange"
        }, {
            id: "asphalt-orange"
        }, {
            id: "forest-yellow"
        }, {
            id: "mint-beige"
        }, {
            id: "sea-yellow"
        }, {
            id: "yellow-black"
        }, {
            id: "coral-blue"
        }, {
            id: "grey-blue"
        }, {
            id: "black-blue"
        }, {
            id: "black-mint"
        }, {
            id: "black-orange"
        }],
        THEME_FONTS: [
            {
                id: "AvenirBlack",
                title: "Avenir Black"
            },{
                id: "AvenirLight",
                title: "Avenir Light"
            },{
                id: "AvenirLightOblique",
                title: "Avenir Light Oblique"
            },{
                id: "AvenirMedium",
                title: "Avenir Medium"
            },{
                id : 'avenirHeavy',
                title : 'Avenir Heavy'
            },{
                id : "Arial",
                title : "Arial"
            },{
                id : 'arialBold',
                title : 'Arial Bold',
            },{
                id : 'arialBoldItalic',
                title: 'Arial Bold Italic'
            },{
                id : 'arialItalic',
                title: 'Arial Italic'
            },{
                id: "asul",
                title: "Asul"
            },{
                id : "cabinsketch",
                title: "cabinsketch"
            },{
                id : "EagleBook",
                title : "EagleBook"
            },{
                id : "futurabdcn",
                title : "FuturaBdCn"
            },{
                id : "futurablackbold",
                title: "FuturaBlackBold"
            },{
                id : "futurabold",
                title : "futuraBold"
            },{
                id : "futurabolditalic",
                title : "futuraBoldItalic"
            },{
                id : "futurabook",
                title : "futuraBook"
            },{
                id : "futurabookitalic",
                title : "futuraBookItalic"
            },{
                id : "futuraextrablack",
                title : "futuraExtraBlack"
            },{
                id :"futuraextrablackitalic",
                title : "futuraExtraBlackItalic"
            },{
                id : "futuraheavy",
                title : "futuraHeavy"
            },{
                id : "futuraheavyitalic",
                title : "futuraHeavyItalic"
            },{
                id : "futuralightbt",
                title : "futuraLightBT"
            },{
                id : "futuralightitalic",
                title : "futuraLightItalic"
            },{
                id : "futuraltcnlight",
                title : "futuraLtCnLight"
            },{
                id : "futuramediumbt",
                title: "FuturaMediumBt"
            },{
                id : "futuramediumitalic",
                title: "FuturaMediumItalic"
            },{
                id : "futuramediummdcn",
                title : "FuturaMediumMdCn"
            },{
                id: "futura",
                title: "FuturaStd-CondensedLight"
            },{
                id : "FuturaBTMediumItalic",
                title : "FuturaBTMediumItalic"
            },{
                id : "FuturaBTMedium",
                title : "FuturaBTMedium"
            },{
                id : "FuturaBTCondMedium",
                title : "FuturaBTCondMedium"
            },{
                id : "Georgia",
                title : "Georgia"
            },{
                id : "GilroySemiBoldItalic",
                title: "GilroySemiBoldItalic"
            },{
                id : "GilroySemiBold",
                title: "GilroySemiBold"
            },{
                id : "GilroyRegularItalic",
                title: "GilroyRegularItalic"
            },{
                id : "GilroyRegular",
                title : "GilroyRegular"
            },{
                id : "GilroyMediumItalic",
                title : "GilroyMediumItalic"
            },{
                id : "GilroyMedium",
                title : "GilroyMedium"
            },{
                id : "GilroyLightItalic",
                title : "GilroyLightItalic"
            },{
                id : "GilroyLight",
                title : "GilroyLight"
            },{
                id: "GilroyBoldItalic",
                title : "GilroyBoldItalic"
            },{
                id: "GilroyBold",
                title : "GilroyBold"
            },{
                id : "Georgia",
                title : "Georgia"
            },{
                id: "josefinsans",
                title: "Josefine"
            },{
                id : "Lucida",
                title : "Lucida"
            },{
                id: "LeagueGothic",
                title: "LeagueGothic"
            },{
                id: "merck",
                title: "Merck"
            },{
                id: "merckbold",
                title: "MerckBold"
            },{
                id: "merckpro",
                title: "MerckPro"
            },{
                id: "merriweather",
                title: "Merriweather"
            },{
                id: "montserrat",
                title: "Montserrat"
            },{
                id: "newscycle",
                title: "NewsCycle"
            },{
                id: "opensans",
                title: "Open Sans"
            },{
                id: "overpass",
                title: "Overpass"
            },{
                id:"proximanova",
                title: "ProximaNova"
            },{
                id: "proximanovabold",
                title: "ProximaNovaBold"
            },{
                id :"proximanovasemibold",
                title: "ProximaNovaSemibold"
            },{
                id: "quicksand",
                title: "Quicksand"
            },{
                id : "rajdhanibold",
                title: "RajdhaniBold"
            },{
                id : "RajdhaniRegular",
                title: "RajdhaniRegular"
            },{
                id : "RajdhaniMedium",
                title: "RajdhaniMedium"
            },{
                id : "RajdhaniSemiBold",
                title: "RajdhaniSemiBold"
            },{
                id : "RajdhaniLight",
                title : "RajdhaniLight"
            },{
                id : "RobotoBlack",
                title : "RobotoBlack"
            },{
                id : "RobotoBlackItalic",
                title : "RobotoBlackItalic"
            },{
                id : "RobotoBold",
                title : "RobotoBold"
            },{
                id : "RobotoBoldCondensed",
                title : "RobotoBoldCondensed"
            },{
                id : "RobotoBoldCondensedItalic",
                title : "RobotoBoldCondensedItalic"
            },{
                id : "RobotoBoldItalic",
                title : "RobotoBoldItalic"
            },{
                id : "RobotoCondensed",
                title : "RobotoCondensed"
            },{
                id : "RobotoCondensedItalic",
                title : "RobotoCondensedItalic"
            },{
                id : "RobotoItalic",
                title : "RobotoItalic"
            },{
                id : "RobotoLight",
                title : "RobotoLight"
            },{
                id : "RobotoLightItalic",
                title : "RobotoLightItalic"
            },{
                id : "RobotoMedium",
                title : "RobotoMedium"
            },{
                id : "RobotoMediumItalic",
                title : "RobotoMediumItalic"
            },{
                id : "RobotoRegular",
                title : "RobotoRegular"
            },{
                id : "RobotoThin",
                title : "RobotoThin"
            },{
                id : "RobotoThinItalic",
                title : "RobotoThinItalic"
            },{
                id : "RotisSansSerifStdBold",
                title:"RotisSansSerifBold"
            },{
                id : "RotisSansSerifStdExtraBold",
                title:"RotisSansSerifExtraBold"
            },{
                id : "RotisSansSerifStdItalic",
                title:"RotisSansSerifItalic"
            },{
                id : "RotisSansSerifStdLight",
                title:"RotisSansSerifLight"
            },{
                id : "RotisSansSerifStdLightItalic",
                title:"RotisSansSerifLightItalic"
            },{
                id : "RotisSansSerifStdRegular",
                title:"RotisSansSerifRegular"
            },{
                id :"SignPainterHouse",
                title : "SignPainterHouse"
            },{
                id : "Tahoma",
                title : "Tahoma"
            },{
                id : "Trebuchet",
                title : "Trebuchet"
            },{
                id : "TimesNewRoman",
                title : "TimesNewRoman"
            },{
                id : "UniversLTStdBoldCn",
                title : "UniversLTSBoldCondensed"
            },{
                id : "Verdana",
                title : "Verdana"
            },{
                id : "WhitneyBold",
                title : "WhitneyBold"
            },{
                id : "WhitneyBoldItalic",
                title : "WhitneyBoldItalic"
            },{
                id : "WhitneyBook",
                title : "WhitneyBook"
            },{
                id : "WhitneyBookItalic",
                title : "WhitneyBookItalic"
            },{
                id : "WhitneyMedium",
                title : "WhitneyMedium"
            },{
                id : "WhitneyMediumItalic",
                title : "WhitneyMediumItalic"
            },{
                id : "WhitneySemiblod",
                title : "WhitneySemiBlod"
            },{
                id : "WhitneySemiboldItalic",
                title : "WhitneySemiBoldItalic"
            }
        ],
        THEME_TRANSITIONS: [{
            id: "slide",
            title: "Slide"
        }, {
            id: "linear",
            title: "Linear",
            deprecated: !0
        }, {
            id: "fade",
            title: "Fade"
        }, {
            id: "none",
            title: "None"
        }, {
            id: "default",
            title: "Convex"
        }, {
            id: "concave",
            title: "Concave"
        }, {
            id: "zoom",
            title: "Zoom"
        }, {
            id: "cube",
            title: "Cube",
            deprecated: !0
        }, {
            id: "page",
            title: "Page",
            deprecated: !0
        }],
        THEME_BACKGROUND_TRANSITIONS: [{
            id: "slide",
            title: "Slide"
        }, {
            id: "fade",
            title: "Fade"
        }, {
            id: "none",
            title: "None"
        }, {
            id: "convex",
            title: "Convex"
        }, {
            id: "concave",
            title: "Concave"
        }, {
            id: "zoom",
            title: "Zoom"
        }],
        BLOCKS: new SL.collections.Collection([{
            type: "text",
            factory: "Text",
            label: "Text",
            icon: "type",
            title: TWIG.infoBulle.text
        }, {
            type    : "scrollabletext",
            factory : "ScrollableText",
            label   : "Scrollable Text",
            icon    : "scrolltext",
            title   : TWIG.toolbar.scrollableText
        }, {
            type: "image",
            factory: "Image",
            label: "Image",
            icon: "picture",
            title: TWIG.infoBulle.image
        }, {
            type: "video",
            factory: "Video",
            label: "Video",
            icon: "video",
            title: TWIG.infoBulle.video
        }, {
            type: "shape",
            factory: "Shape",
            label: "Shape",
            icon: "shapes",
            title: TWIG.infoBulle.shape
        }/*, {
            type: "line",
            factory: "Line",
            label: "Line",
            icon: "",
            title: TWIG.infoBulle.line
        }, {
            type: "iframe",
            factory: "Iframe",
            label: "Iframe",
            icon: "browser",
            title: TWIG.infoBulle.iframe
        }*/, {
            type: "table",
            factory: "Table",
            label: "Table",
            icon: "table",
            title: TWIG.infoBulle.table
        }/*, {
            type: "code",
            factory: "Code",
            label: "Code",
            icon: "file-css",
            title: TWIG.infoBulle.code
        }*/,
            {
                type: "html",
                factory: "HTML",
                label: "HTML",
                icon: "file-code-o",
                title: TWIG.infoBulle.html
            },
            {
                type: "survey",
                factory: "Survey",
                label: "Survey",
                icon: "building-o",
                title: TWIG.infoBulle.survey
            }/*, {
                type: "math",
                factory: "Math",
                label: "Math",
                icon: "divide",
                title: TWIG.infoBulle.math
            }*/, {
                type: "snippet",
                factory: "Snippet",
                label: "snippet",
                icon: "file-xml",
                title: TWIG.infoBulle.snippet,
                hidden: !0
            }]),
        DEFAULT_DECK_THUMBNAIL: "https://s3.amazonaws.com/static.slid.es/images/default-deck-thumbnail.png",
        DEFAULT_USER_THUMBNAIL: "https://s3.amazonaws.com/static.slid.es/images/default-profile-picture.png",
        DECK_THUMBNAIL_TEMPLATE: ['<li class="deck-thumbnail">', '<div class="deck-image" style="background-image: url({{DECK_THUMB_URL}})">', '<a class="deck-link" href="{{DECK_URL}}"></a>', "</div>", '<footer class="deck-details">', '<a class="author" href="{{USER_URL}}">', '<span class="picture" style="background-image: url({{USER_THUMB_URL}})"></span>', '<span class="name">{{USER_NAME}}</span>', "</a>", '<div class="stats">', '<div>{{DECK_VIEWS}}<span class="icon i-eye"></span></div>', "</div>", "</footer>", "</li>"].join(""),
        AJAX_SEARCH: "/api/v1/search.json",
        AJAX_SEARCH_ORGANIZATION: "/api/v1/team/search.json",
        AJAX_CREATE_DECK: function() {
            return Routing.generate('revisions_new', {_locale: TWIG.currentLanguage, _format:'json'}, true)
        },
        AJAX_PUBLISH_DECK: function(t) {
            return "/api/v1/decks/" + t + "/publish.json"
        },
        AJAX_GET_DECK_DATA: function(t) {
            return "/api/v1/decks/" + t + "/data.json"
        },
        AJAX_MAKE_DECK_COLLABORATIVE: function(t) {
            return "/api/v1/decks/" + t + "/make_collaborative.json"
        },
        AJAX_GET_DECK_VERSIONS: function(t) {
            return "/api/v1/decks/" + t + "/revisions.json"
        },
        AJAX_PREVIEW_DECK_VERSION: function(t, e, i) {
            return "/" + t + "/" + e + "/preview?revision=" + i
        },
        AJAX_RESTORE_DECK_VERSION: function(t, e) {
            return "/api/v1/decks/" + t + "/revisions/" + e + "/restore.json"
        },
        AJAX_EXPORT_DECK: function(t, e) {
            return "/" + t + "/" + e + "/export"
        },
        AJAX_THUMBNAIL_DECK: function(t) {
            return Routing.generate('thumbnails', {'idPres': TWIG.idPres, 'idRev': TWIG.idRev}, true);
        },
        AJAX_FORK_DECK: function(t) {
            return "/api/v1/decks/" + t + "/fork.json"
        },
        AJAX_SHARE_DECK_VIA_EMAIL: function(t) {
            return "/api/v1/decks/" + t + "/deck_shares.json"
        },
        AJAX_KUDO_DECK: function(t) {
            return "/api/v1/decks/" + t + "/kudos/kudo.json"
        },
        AJAX_UNKUDO_DECK: function(t) {
            return "/api/v1/decks/" + t + "/kudos/unkudo.json"
        },
        AJAX_EXPORT_START: function(t) {
            return "/api/v1/decks/" + t + "/exports.json"
        },
        AJAX_EXPORT_LIST: function(t) {
            return "/api/v1/decks/" + t + "/exports.json"
        },
        AJAX_EXPORT_STATUS: function(t, e) {
            return "/api/v1/decks/" + t + "/exports/" + e + ".json"
        },
        AJAX_PDF_IMPORT_NEW: "/api/v1/imports.json",
        AJAX_PDF_IMPORT_UPLOADED: function(t) {
            return "/api/v1/imports/" + t + ".json"
        },
        AJAX_DROPBOX_CONNECT: "/settings/dropbox/authorize",
        AJAX_DROPBOX_DISCONNECT: "https://www.dropbox.com/account/security#apps",
        AJAX_DROPBOX_SYNC_DECK: function(t) {
            return "/api/v1/decks/" + t + "/export.json"
        },
        AJAX_UPDATE_TEAM: "/api/v1/team.json",
        AJAX_LOOKUP_TEAM: "/api/v1/team/lookup.json",
        AJAX_TEAM_MEMBER_SEARCH: "/api/v1/team/users/search.json",
        AJAX_TEAM_MEMBERS_LIST: "/api/v1/team/users.json",
        AJAX_TEAM_MEMBER_CREATE: "/api/v1/team/users.json",
        AJAX_TEAM_MEMBER_UPDATE: function(t) {
            return "/api/v1/team/users/" + t + ".json"
        },
        AJAX_TEAM_MEMBER_DELETE: function(t) {
            return "/api/v1/team/users/" + t + ".json"
        },
        AJAX_TEAM_MEMBER_REACTIVATE: function(t) {
            return "/api/v1/team/users/" + t + "/reactivate.json"
        },
        AJAX_TEAM_MEMBER_DEACTIVATE: function(t) {
            return "/api/v1/team/users/" + t + "/deactivate.json"
        },
        AJAX_TEAM_INVITATIONS_LIST: "/api/v1/team/invitations.json",
        AJAX_TEAM_INVITATIONS_CREATE: "/api/v1/team/invitations.json",
        AJAX_TEAM_INVITATIONS_DELETE: function(t) {
            return "/api/v1/team/invitations/" + t + ".json"
        },
        AJAX_TEAM_INVITATIONS_RESEND: function(t) {
            return "/api/v1/team/invitations/" + t + "/resend.json"
        },
        AJAX_THEMES_LIST: "/api/v1/themes.json",
        AJAX_THEMES_CREATE: "/api/v1/themes.json",
        AJAX_THEMES_READ: function(t) {
            return "/api/v1/themes/" + t + ".json"
        },
        AJAX_THEMES_UPDATE: function(t) {
            return "/api/v1/themes/" + t + ".json"
        },
        AJAX_THEMES_DELETE: function(t) {
            return "/api/v1/themes/" + t + ".json"
        },
        AJAX_DECK_THEME: function(t) {
            return "/api/v1/decks/" + t + "/theme.json"
        },
        AJAX_THEME_ADD_SLIDE_TEMPLATE: function(t) {
            return "/api/v1/themes/" + t + "/add_slide_template.json"
        },
        AJAX_THEME_REMOVE_SLIDE_TEMPLATE: function(t) {
            return "/api/v1/themes/" + t + "/remove_slide_template.json"
        },
        AJAX_ACCESS_TOKENS_LIST: function(t) {
            return "/api/v1/decks/" + t + "/access_tokens.json"
        },
        AJAX_ACCESS_TOKENS_CREATE: function(t) {
            return "/api/v1/decks/" + t + "/access_tokens.json"
        },
        AJAX_ACCESS_TOKENS_UPDATE: function(t, e) {
            return "/api/v1/decks/" + t + "/access_tokens/" + e + ".json"
        },
        AJAX_ACCESS_TOKENS_DELETE: function(t, e) {
            return "/api/v1/decks/" + t + "/access_tokens/" + e + ".json"
        },
        AJAX_ACCESS_TOKENS_PASSWORD_AUTH: function(t) {
            return "/access_tokens/" + t + ".json"
        },

        AJAX_SLIDE_TEMPLATES_LIST: Routing.generate('slidetemplate', {_locale: TWIG.currentLanguage}, true),
        AJAX_SLIDE_TEMPLATES_CREATE:  Routing.generate('slidetemplate', {_locale: TWIG.currentLanguage}, true),
        AJAX_SLIDE_TEMPLATES_UPDATE: function(t) {
            return "/api/v1/slide_templates/" + t + ".json"
        },
        AJAX_SLIDE_TEMPLATES_DELETE: function(t) {
            return "/api/v1/slide_templates/" + t + ".json"
        },
        AJAX_TEAM_SLIDE_TEMPLATES_LIST: "/api/v1/team/slide_templates.json",
        AJAX_TEAM_SLIDE_TEMPLATES_CREATE: "/api/v1/team/slide_templates.json",
        AJAX_TEAM_SLIDE_TEMPLATES_UPDATE: function(t) {
            return "/api/v1/team/slide_templates/" + t + ".json"
        },
        AJAX_TEAM_SLIDE_TEMPLATES_DELETE: function(t) {
            return "/api/v1/team/slide_templates/" + t + ".json"
        },
        AJAX_GET_USER: function(t) {
            return "/api/v1/users/" + t + ".json"
        },
        AJAX_LOOKUP_USER: "/api/v1/users/lookup.json",
        AJAX_SERVICES_USER: "/api/v1/users/services.json",
        AJAX_UPDATE_USER: "/users.json",
        AJAX_GET_USER_SETTINGS: "/api/v1/user_settings.json",
        AJAX_UPDATE_USER_SETTINGS: "/api/v1/user_settings.json",
        AJAX_SUBSCRIPTIONS: "/subscriptions",
        AJAX_SUBSCRIPTIONS_STATUS: "/account/details.json",
        AJAX_SUBSCRIPTIONS_PRINT_RECEIPT: function(t) {
            return "/account/receipts/" + t
        },
        AJAX_TEAMS_CREATE: "/teams.json",
        AJAX_TEAMS_REACTIVATE: "/subscriptions/reactivate.json",
        AJAX_CHECK_STATUS: Routing.generate('status', {_locale: TWIG.currentLanguage, idPres: TWIG.idPres}, true),
        AJAX_MEDIA_LIST: Routing.generate('medias', {_locale: TWIG.currentLanguage, idPres: TWIG.idPres,  _format: 'json' }, true),
        AJAX_MEDIA_CREATE: create_media,
        AJAX_MEDIA_UPDATE: function(t) {
            return "/api/v1/media/" + t + ".json"
        },
        AJAX_MEDIA_DELETE: function(t) {
            return Routing.generate('media_delete', {_locale: TWIG.currentLanguage, idPres: TWIG.idPres, t:"t", _format: "json"}, true)
        },
        AJAX_MEDIA_TAG_LIST: Routing.generate('tags', {_locale: TWIG.currentLanguage, idPres: TWIG.idPres, _format: "json"}, true),
        AJAX_MEDIA_TAG_CREATE: "/api/v1/tags.json",
        AJAX_MEDIA_TAG_UPDATE: function(t) {
            return "/api/v1/tags/" + t + ".json"
        },
        AJAX_MEDIA_TAG_DELETE: function(t) {
            return "/api/v1/tags/" + t + ".json"
        },
        AJAX_MEDIA_TAG_ADD_MEDIA: function(t) {
            return "/api/v1/tags/" + t + "/add_media.json"
        },
        AJAX_MEDIA_TAG_REMOVE_MEDIA: function(t) {
            return "/api/v1/tags/" + t + "/remove_media.json"
        },
        AJAX_TEAM_MEDIA_LIST: "/api/v1/team/media.json",
        AJAX_TEAM_MEDIA_CREATE: "/api/v1/team/media.json",
        AJAX_TEAM_MEDIA_UPDATE: function(t) {
            return "/api/v1/team/media/" + t + ".json"
        },
        AJAX_TEAM_MEDIA_DELETE: function(t) {
            return "/api/v1/team/media/" + t + ".json"
        },
        AJAX_TEAM_MEDIA_TAG_LIST: "/api/v1/team/tags.json",
        AJAX_TEAM_MEDIA_TAG_CREATE: "/api/v1/team/tags.json",
        AJAX_TEAM_MEDIA_TAG_UPDATE: function(t) {
            return "/api/v1/team/tags/" + t + ".json"
        },
        AJAX_TEAM_MEDIA_TAG_DELETE: function(t) {
            return "/api/v1/team/tags/" + t + ".json"
        },
        AJAX_TEAM_MEDIA_TAG_ADD_MEDIA: function(t) {
            return "/api/v1/team/tags/" + t + "/add_media.json"
        },
        AJAX_TEAM_MEDIA_TAG_REMOVE_MEDIA: function(t) {
            return "/api/v1/team/tags/" + t + "/remove_media.json"
        },
        AJAX_DECKUSER_LIST: function(t) {
            return "/api/v1/decks/" + t + "/users.json"
        },
        AJAX_DECKUSER_READ: function(t, e) {
            return "/api/v1/decks/" + t + "/users/" + e + ".json"
        },
        AJAX_DECKUSER_CREATE: function(t) {
            return "/api/v1/decks/" + t + "/users/invite.json"
        },
        AJAX_DECKUSER_UPDATE: function(t, e) {
            return "/api/v1/decks/" + t + "/users/" + e + ".json"
        },
        AJAX_DECKUSER_DELETE: function(t, e) {
            return "/api/v1/decks/" + t + "/users/" + e + ".json"
        },
        AJAX_DECKUSER_BECOME_EDITOR: function(t, e) {
            return "/api/v1/decks/" + t + "/users/" + e + "/become_editor.json"
        },
        AJAX_DECKUSER_UPDATE_LAST_SEEN_AT: function(t) {
            return "/api/v1/decks/" + t + "/users/update_last_seen_at.json"
        },
        AJAX_COMMENTS_LIST: function(t, e) {
            return "/api/v1/decks/" + t + "/comments.json" + (e ? "?slide_hash=" + e : "")
        },
        AJAX_COMMENTS_CREATE: function(t) {
            return "/api/v1/decks/" + t + "/comments.json"
        },
        AJAX_COMMENTS_UPDATE: function(t, e) {
            return "/api/v1/decks/" + t + "/comments/" + e + ".json"
        },
        AJAX_COMMENTS_DELETE: function(t, e) {
            return "/api/v1/decks/" + t + "/comments/" + e + ".json"
        },
        STREAM_ENGINE_HOST: window.location.protocol + "//stream2.slides.com",
        STREAM_ENGINE_LIVE_NAMESPACE: "live",
        STREAM_ENGINE_EDITOR_NAMESPACE: "editor",
        APP_HOST: "slides.com",
        S3_HOST: "mcm-media-librairie-dev.s3-website-eu-west-1.amazonaws.com",
        ASSET_URLS: {
            "offline-v2.css": "//assets.slid.es/assets/offline-v2-ca492d04b9e3443dd0405b145c3e57fe.css",
            "homepage-background.jpg": "//assets.slid.es/assets/homepage-background-b002e480a9b1026f07a1a3d066404640.jpg",
            "reveal-plugins/markdown/marked.js": "//assets.slid.es/assets/reveal-plugins/markdown/marked-285d0e546e608bca75e0c8af0d6b44cd.js",
            "reveal-plugins/markdown/markdown.js": "//assets.slid.es/assets/reveal-plugins/markdown/markdown-769f9bfbb5d81257779bf0353cc6ecd4.js",
            "reveal-plugins/highlight/highlight.js": "//assets.slid.es/assets/reveal-plugins/highlight/highlight-9efb98b823ef2e51598faabaa51da5be.js"
        }
    },
    SL.config.V1 = {
        DEFAULT_THEME_COLOR: "grey-blue",
        DEFAULT_THEME_FONT: "league",
        DEFAULT_THEME_TRANSITION: "linear",
        DEFAULT_THEME_BACKGROUND_TRANSITION: "fade",
        THEME_COLORS: [{
            id: "grey-blue"
        }, {
            id: "black-mint"
        }, {
            id: "black-orange"
        }, {
            id: "forest-yellow"
        }, {
            id: "lila-yellow"
        }, {
            id: "asphalt-orange"
        }, {
            id: "sky-blue"
        }, {
            id: "beige-brown"
        }, {
            id: "sand-grey"
        }, {
            id: "silver-green"
        }, {
            id: "silver-blue"
        }, {
            id: "cobalt-orange"
        }, {
            id: "white-blue"
        }, {
            id: "mint-beige"
        }, {
            id: "sea-yellow"
        }, {
            id: "coral-blue"
        }],
        THEME_FONTS: [
            {
                id: "AvenirBlack",
                title: "Avenir Black"
            },{
                id: "AvenirLight",
                title: "Avenir Light"
            },{
                id: "AvenirLightOblique",
                title: "Avenir Light Oblique"
            },{
                id: "AvenirMedium",
                title: "Avenir Medium"
            },{
                id : 'avenirHeavy',
                title : 'Avenir Heavy'
            },{
                id : "Arial",
                title : "Arial"
            },{
                id : 'arialBold',
                title : 'Arial Bold',
            },{
                id : 'arialBoldItalic',
                title: 'Arial Bold Italic'
            },{
                id : 'arialItalic',
                title: 'Arial Italic'
            },{
                id: "asul",
                title: "Asul"
            },{
                id : "cabinsketch",
                title: "cabinsketch"
            },{
                id : "EagleBook",
                title : "EagleBook"
            },{
                id : "futurabdcn",
                title : "FuturaBdCn"
            },{
                id : "futurablackbold",
                title: "FuturaBlackBold"
            },{
                id : "futurabold",
                title : "futuraBold"
            },{
                id : "futurabolditalic",
                title : "futuraBoldItalic"
            },{
                id : "futurabook",
                title : "futuraBook"
            },{
                id : "futurabookitalic",
                title : "futuraBookItalic"
            },{
                id : "futuraextrablack",
                title : "futuraExtraBlack"
            },{
                id :"futuraextrablackitalic",
                title : "futuraExtraBlackItalic"
            },{
                id : "futuraheavy",
                title : "futuraHeavy"
            },{
                id : "futuraheavyitalic",
                title : "futuraHeavyItalic"
            },{
                id : "futuralightbt",
                title : "futuraLightBT"
            },{
                id : "futuralightitalic",
                title : "futuraLightItalic"
            },{
                id : "futuraltcnlight",
                title : "futuraLtCnLight"
            },{
                id : "futuramediumbt",
                title: "FuturaMediumBt"
            },{
                id : "futuramediumitalic",
                title: "FuturaMediumItalic"
            },{
                id : "futuramediummdcn",
                title : "FuturaMediumMdCn"
            },{
                id: "futura",
                title: "FuturaStd-CondensedLight"
            },{
                id : "FuturaBTMediumItalic",
                title : "FuturaBTMediumItalic"
            },{
                id : "FuturaBTMedium",
                title : "FuturaBTMedium"
            },{
                id : "FuturaBTCondMedium",
                title : "FuturaBTCondMedium"
            },{
                id : "Georgia",
                title : "Georgia"
            },{
                id : "GilroySemiBoldItalic",
                title: "GilroySemiBoldItalic"
            },{
                id : "GilroySemiBold",
                title: "GilroySemiBold"
            },{
                id : "GilroyRegularItalic",
                title: "GilroyRegularItalic"
            },{
                id : "GilroyRegular",
                title : "GilroyRegular"
            },{
                id : "GilroyMediumItalic",
                title : "GilroyMediumItalic"
            },{
                id : "GilroyMedium",
                title : "GilroyMedium"
            },{
                id : "GilroyLightItalic",
                title : "GilroyLightItalic"
            },{
                id : "GilroyLight",
                title : "GilroyLight"
            },{
                id: "GilroyBoldItalic",
                title : "GilroyBoldItalic"
            },{
                id: "GilroyBold",
                title : "GilroyBold"
            },{
                id : "Georgia",
                title : "Georgia"
            },{
                id: "josefinsans",
                title: "Josefine"
            },{
                id : "Lucida",
                title : "Lucida"
            },{
                id: "LeagueGothic",
                title: "LeagueGothic"
            },{
                id: "merck",
                title: "Merck"
            },{
                id: "merckbold",
                title: "MerckBold"
            },{
                id: "merckpro",
                title: "MerckPro"
            },{
                id: "merriweather",
                title: "Merriweather"
            },{
                id: "montserrat",
                title: "Montserrat"
            },{
                id: "newscycle",
                title: "NewsCycle"
            },{
                id: "opensans",
                title: "Open Sans"
            },{
                id: "overpass",
                title: "Overpass"
            },{
                id:"proximanova",
                title: "ProximaNova"
            },{
                id: "proximanovabold",
                title: "ProximaNovaBold"
            },{
                id :"proximanovasemibold",
                title: "ProximaNovaSemibold"
            },{
                id: "quicksand",
                title: "Quicksand"
            },{
                id : "rajdhanibold",
                title: "RajdhaniBold"
            },{
                id : "RajdhaniRegular",
                title: "RajdhaniRegular"
            },{
                id : "RajdhaniMedium",
                title: "RajdhaniMedium"
            },{
                id : "RajdhaniSemiBold",
                title: "RajdhaniSemiBold"
            },{
                id : "RajdhaniLight",
                title : "RajdhaniLight"
            },{
                id : "RobotoBlack",
                title : "RobotoBlack"
            },{
                id : "RobotoBlackItalic",
                title : "RobotoBlackItalic"
            },{
                id : "RobotoBold",
                title : "RobotoBold"
            },{
                id : "RobotoBoldCondensed",
                title : "RobotoBoldCondensed"
            },{
                id : "RobotoBoldCondensedItalic",
                title : "RobotoBoldCondensedItalic"
            },{
                id : "RobotoBoldItalic",
                title : "RobotoBoldItalic"
            },{
                id : "RobotoCondensed",
                title : "RobotoCondensed"
            },{
                id : "RobotoCondensedItalic",
                title : "RobotoCondensedItalic"
            },{
                id : "RobotoItalic",
                title : "RobotoItalic"
            },{
                id : "RobotoLight",
                title : "RobotoLight"
            },{
                id : "RobotoLightItalic",
                title : "RobotoLightItalic"
            },{
                id : "RobotoMedium",
                title : "RobotoMedium"
            },{
                id : "RobotoMediumItalic",
                title : "RobotoMediumItalic"
            },{
                id : "RobotoRegular",
                title : "RobotoRegular"
            },{
                id : "RobotoThin",
                title : "RobotoThin"
            },{
                id : "RobotoThinItalic",
                title : "RobotoThinItalic"
            },{
                id : "RotisSansSerifStdBold",
                title:"RotisSansSerifBold"
            },{
                id : "RotisSansSerifStdExtraBold",
                title:"RotisSansSerifExtraBold"
            },{
                id : "RotisSansSerifStdItalic",
                title:"RotisSansSerifItalic"
            },{
                id : "RotisSansSerifStdLight",
                title:"RotisSansSerifLight"
            },{
                id : "RotisSansSerifStdLightItalic",
                title:"RotisSansSerifLightItalic"
            },{
                id : "RotisSansSerifStdRegular",
                title:"RotisSansSerifRegular"
            },{
                id :"SignPainterHouse",
                title : "SignPainterHouse"
            },{
                id : "Tahoma",
                title : "Tahoma"
            },{
                id : "Trebuchet",
                title : "Trebuchet"
            },{
                id : "TimesNewRoman",
                title : "TimesNewRoman"
            },{
                id : "UniversLTStdBoldCn",
                title : "UniversLTSBoldCondensed"
            },{
                id : "Verdana",
                title : "Verdana"
            },{
                id : "WhitneyBold",
                title : "WhitneyBold"
            },{
                id : "WhitneyBoldItalic",
                title : "WhitneyBoldItalic"
            },{
                id : "WhitneyBook",
                title : "WhitneyBook"
            },{
                id : "WhitneyBookItalic",
                title : "WhitneyBookItalic"
            },{
                id : "WhitneyMedium",
                title : "WhitneyMedium"
            },{
                id : "WhitneyMediumItalic",
                title : "WhitneyMediumItalic"
            },{
                id : "WhitneySemiblod",
                title : "WhitneySemiBlod"
            },{
                id : "WhitneySemiboldItalic",
                title : "WhitneySemiBoldItalic"
            }
        ]
    },
    SL.draganddrop = {
        init: function() {
            this.listeners = new SL.collections.Collection, this.onDragStart = this.onDragStart.bind(this), this.onDragOver = this.onDragOver.bind(this), this.onDragOut = this.onDragOut.bind(this), this.onDrop = this.onDrop.bind(this), this.isListening = !1, this.isInternalDrag = !1
        },
        subscribe: function(t) {
            this.listeners.push(t), this.bind()
        },
        unsubscribe: function(t) {
            this.listeners.remove(t), this.listeners.isEmpty() && this.unbind()
        },
        dispatch: function(t, e) {
            var i = this.listeners.last();
            i && i[t](e)
        },
        bind: function() {
            this.isListening === !1 && (this.isListening = !0, $(document.documentElement).on("dragstart", this.onDragStart).on("dragover dragenter", this.onDragOver).on("dragleave", this.onDragOut).on("drop", this.onDrop))
        },
        unbind: function() {
            this.isListening === !0 && (this.isListening = !1, $(document.documentElement).off("dragstart", this.onDragStart).off("dragover dragenter", this.onDragOver).off("dragleave", this.onDragOut).off("drop", this.onDrop))
        },
        onDragStart: function(t) {
            t.preventDefault(), this.isInternalDrag = !0
        },
        onDragOver: function(t) {
            this.isInternalDrag || (t.preventDefault(), this.dispatch("onDragOver", t))
        },
        onDragOut: function(t) {
            this.isInternalDrag || (t.preventDefault(), this.dispatch("onDragOut", t))
        },
        onDrop: function(t) {
            return this.isInternalDrag ? void 0 : (t.stopPropagation(), t.preventDefault(), this.isInternalDrag = !1, this.dispatch("onDrop", t), !1)
        }
    },
    SL.fonts = {
        /*INIT_TIMEOUT: 5e3,
        FONTS_URL: "/fonts/",*/
        FAMILIES: {
            Arial : {
                //id: 'Arial',
                name :  'Arial'
                //path: "../../css/editorfonts.css"
            },
            arialItalic : {
                //id: 'arialItalic',
                name :  'arialItalic'
                //path: "../../css/editorfonts.css"
            },
            arialBoldItalic : {
                //id: 'arialBoldItalic',
                name :  'arialBoldItalic'
                //path: "../../css/editorfonts.css"
            },
            arialBold : {
                // id: 'arialBold',
                name :  'arialBold'
                //path: "../../css/editorfonts.css"
            },
            avenirHeavy : {
                // id: 'avenirHeavy',
                name :  'avenirHeavy'
                //path: "../../css/editorfonts.css"
            },
            Trebuchet : {
                //id: 'Trebuchet',
                name :  'Trebuchet'
                //path: "../../css/editorfonts.css"
            },
            TimesNewRoman : {
                //id: 'TimesNewRoman',
                name :  'Times New Roman'
                //path: "../../css/editorfonts.css"
            },
            Tahoma : {
                //id: 'Tahoma',
                name :  'Tahoma'
                //path: "../../css/editorfonts.css"
            },
            Lucida : {
                //id: 'Lucida',
                name :  'Lucida'
                //path: "../../css/editorfonts.css"
            },
            Georgia : {
                //id: 'Georgia',
                name :  'Georgia'
                //path: "../../css/editorfonts.css"
            },
            Verdana : {
                //id: 'Verdana',
                name :  'Verdana'
                //path: "../../css/editorfonts.css"
            },
            montserrat: {
                //id: "montserrat",
                name: "Montserrat"
                //path: "../../css/editorfonts.css"
            },
            opensans: {
                //id: "opensans",
                name: "OpenSans"
                //path: "../../css/editorfonts.css"
            },
            lato: {
                //id: "lato",
                name: "Lato"
                //path: "../../css/editorfonts.css"
            },
            asul: {
                //id: "asul",
                name: "Asul"
                //path: "../../css/editorfonts.css"
            },
            josefinsans: {
                //id: "josefinsans",
                name: "JosefinSans"
                //path: "../../css/editorfonts.css"
            },
            LeagueGothic: {
                //id: "LeagueGothic",
                name: "LeagueGothic"
                //path: "../../css/editorfonts.css"
            },
            merriweathersans: {
                //id: "merriweathersans",
                name: "MerriweatherSans"
                //path: "../../css/editorfonts.css"
            },
            overpass: {
                //id: "overpass",
                name: "Overpass"
                //path: "../../css/editorfonts.css"
            },
            quicksand: {
                //id: "quicksand",
                name: "Quicksand"
                //path: "../../css/editorfonts.css"
            },
            cabinsketch: {
                //id: "cabinsketch",
                name: "CabinSketch"
                //path: "../../css/editorfonts.css"
            },
            newscycle: {
                //id: "newscycle",
                name: "NewsCycle"
                //path: "../../css/editorfonts.css"
            },
            oxygen: {
                //id: "oxygen",
                name: "Oxygen"
                //path: "../../css/editorfonts.css"
            },
            merck: {
                //id: "merck",
                name: "Merck"
                //path: '../../css/editorfonts.css'
            },
            futura : {
                //id : "futura",
                name: "FuturaStd-CondensedLight"
                //path: '../../css/editorfonts.css'
            },
            proximanova: {
                //id:"proximanova",
                name: "ProximaNova"
                //path: '../../css/editorfonts.css'
            },
            proximanovabold:{
                //id:"proximanovabold",
                name:"ProximaNovaBold"
                //path: '../../css/editorfonts.css'
            },
            proximanovasemibold: {
                //id: "proximanovasemibold",
                name: "ProximaNovaSemibold"
                //path: "../../css/editorfonts.css"
            },
            merckbold: {
                //id:"merckbold",
                name:"MerckBold"
                //path: "../../css/editorfonts.css"
            },
            merckpro : {
                //id: "merckpro",
                name: "MerckPro"
                //path: "../../css/editorfonts.css"
            },
            rajdhanibold: {
                //id : "rajdhanibold",
                name : "RajdhaniBold"
                //path: "../../css/editorfonts.css"
            },
            RajdhaniRegular: {
                //id : "RajdhaniRegular",
                name: "RajdhaniRegular"
                //path: "../../css/editorfonts.css"
            },
            RajdhaniMedium: {
                //id : "RajdhaniMedium",
                name: "RajdhaniMedium"
                //path: "../../css/editorfonts.css"
            },
            RajdhaniSemiBold : {
                //id : "RajdhaniSemiBold",
                name : "RajdhaniSemiBold"
                //path: "../../css/editorfonts.css"
            },
            RajdhaniLight : {
                //id : "RajdhaniLight",
                name : "RajdhaniLight"
                //path: "../../css/editorfonts.css"
            },
            futurabdcn : {
                // id : "futurabdcn",
                name : "futuraBdCn"
                //path: "../../css/editorfonts.css"
            },
            futurablackbold : {
                //id : "futurablackbold",
                name: "futuraBlackBold"
                //path: "../../css/editorfonts.css"
            },
            futurabold : {
                //id : "futurabold",
                name : "futuraBold"
                //path: "../../css/editorfonts.css"
            },
            futurabolditalic :{
                //id : "futurabolditalic",
                name : "futuraBoldItalic"
                //path: "../../css/editorfonts.css"
            },
            futurabook : {
                //id : "futurabook",
                name : "futuraBook"
                //path: "../../css/editorfonts.css"
            },
            futurabookitalic : {
                //id : "futurabookitalic",
                name : "futuraBookItalic"
                //path: "../../css/editorfonts.css"
            },
            futuraextrablack : {
                //id : "futuraextrablack",
                name : "futuraExtraBlack"
                //path: "../../css/editorfonts.css"
            },
            futuraextrablackitalic : {
                //id :"futuraextrablackitalic",
                name : "futuraExtrablackItalic"
                //path: "../../css/editorfonts.css"
            },
            futuraheavy : {
                //id : "futuraheavy",
                name : "futuraHeavy"
                //path: "../../css/editorfonts.css"
            },
            futuraheavyitalic : {
                //id : "futuraheavyitalic",
                name : "futuraHeavyItalic"
                //path: "../../css/editorfonts.css"
            },
            futuralightbt : {
                //id : "futuralightbt",
                name : "futuraLightBt"
                //path: "../../css/editorfonts.css"
            },
            futuralightitalic : {
                //id : "futuralightitalic",
                name : "futuraLightItalic"
                //path: "../../css/editorfonts.css"
            },
            futuraltcnlight :{
                //id : "futuraltcnlight",
                name: "futuraLtCnLight"
                //path: "../../css/editorfonts.css"
            },
            futuramediumbt : {
                //id : "futuramediumbt",
                name : "futuramediumBt"
                //path: "../../css/editorfonts.css"
            },
            futuramediumitalic : {
                //id : "futuramediumitalic",
                name : "futuraMediumItalic"
                //path: "../../css/editorfonts.css"
            },
            futuramediummdcn : {
                //id : "futuramediummdcn",
                name : "futuraMediumMdCn"
                //path: "../../css/editorfonts.css"
            },
            SignPainterHouse : {
                //id : "SignPainterHouse",
                name: "SignPainterHouse"
                //path: "../../css/editorfonts.css"
            },
            GilroySemiBoldItalic: {
                //id : "GilroySemiBoldItalic",
                name: "GilroySemiBoldItalic"
                //path:"../../css/editorfonts.css"
            },
            GilroySemiBold: {
                //id : "GilroySemiBold",
                name: "GilroySemiBold"
                //path:"../../css/editorfonts.css"
            },
            GilroyRegularItalic: {
                //id : "GilroyRegularItalic",
                name: "GilroyRegularItalic"
                //path:"../../css/editorfonts.css"
            },
            GilroyRegular :{
                //id :"GilroyRegular",
                name : "GilroyRegular"
                //path: "../../css/editorfonts.css"
            },
            GilroyMediumItalic :{
                //id :"GilroyMediumItalic",
                name : "GilroyMediumItalic"
                //path: "../../css/editorfonts.css"
            },
            GilroyMedium : {
                //id : "GilroyMedium",
                name: "GilroyMedium"
                //path: "../../css/editorfonts.css"
            },
            GilroyLightItalic : {
                //id : "GilroyLightItalic",
                name: "GilroyLightItalic"
                //path: "../../css/editorfonts.css"
            },
            GilroyLight : {
                //id : "GilroyLight",
                name:"GilroyLight"
                //path: "../../css/editorfonts.css"
            },
            GilroyBoldItalic : {
                //id : "GilroyBoldItalic",
                name: "GilroyBoldItalic"
                //path: "../../css/editorfonts.css"
            },
            GilroyBold : {
                //id : "GilroyBold",
                name: "GilroyBold"
                //path: "../../css/editorfonts.css"
            },
            FuturaBTCondMedium : {
                //id : "FuturaBTCondMedium",
                name : "FuturaBTCondMedium"
                //path: "../../css/editorfonts.css"
            },
            FuturaBTMedium : {
                //id : "FuturaBTMedium",
                name : "FuturaBTMedium"
                //path: "../../css/editorfonts.css"
            },
            FuturaBTMediumItalic : {
                //id : "FuturaBTMediumItalic",
                name : "FuturaBTMediumItalic"
                //path: "../../css/editorfonts.css"
            },
            EagleBook:{
                //id : "EagleBook",
                name : "EagleBook"
                //path: "../../css/editorfonts.css"
            },
            UniversLTStdBoldCn:{
                //id : "UniversLTStdBoldCn",
                name : "UniversLTStdBoldCn"
                //path: "../../css/editorfonts.css"
            },
            WhitneyBold:{
                //id : "WhitneyBold",
                name : "WhitneyBold"
                //path: "../../css/editorfonts.css"
            },
            WhitneyBoldItalic:{
                //id : "WhitneyBoldItalic",
                name : "WhitneyBoldItalic"
                //path: "../../css/editorfonts.css"
            },
            WhitneyBook:{
                //id : "WhitneyBook",
                name : "WhitneyBook"
                //path: "../../css/editorfonts.css"
            },
            WhitneyBookItalic:{
                //id : "WhitneyBookItalic",
                name : "WhitneyBookItalic"
                //path: "../../css/editorfonts.css"
            },
            WhitneyMedium:{
                //id : "WhitneyMedium",
                name : "WhitneyMedium"
                //path: "../../css/editorfonts.css"
            },
            WhitneyMediumItalic:{
                //id : "WhitneyMediumItalic",
                name : "WhitneyMediumItalic"
                //path: "../../css/editorfonts.css"
            },
            WhitneySemiblod:{
                //id : "WhitneySemiblod",
                name : "WhitneySemiblod"
                //path: "../../css/editorfonts.css"
            },
            WhitneySemiboldItalic:{
                //id : "WhitneySemiboldItalic",
                name : "WhitneySemiboldItalic"
                //path: "../../css/editorfonts.css"
            },
            AvenirBlack:{
                //id: "AvenirBlack",
                name: "AvenirBlack"
                //path: "../../css/editorfonts.css"
            },
            AvenirLight:{
                //id: "AvenirLight",
                name: "AvenirLight"
                //path: "../../css/editorfonts.css"
            },
            AvenirLightOblique:{
                //id: "AvenirLightOblique",
                name: "AvenirLightOblique"
                //path: "../../css/editorfonts.css"
            },
            AvenirMedium:{
                //id: "AvenirMedium",
                name: "AvenirMedium"
                //path: "../../css/editorfonts.css"
            },
            RotisSansSerifStdBold:{
                //id: "RotisSansSerifStdBold",
                name: "RotisSansSerifStdBold"
                //path: "../../css/editorfonts.css"
            },
            RotisSansSerifStdExtraBold:{
                //id: "RotisSansSerifStdExtraBold",
                name: "RotisSansSerifStdExtraBold"
                //path: "../../css/editorfonts.css"
            },
            RotisSansSerifStdItalic:{
                //id: "RotisSansSerifStdItalic",
                name: "RotisSansSerifStdItalic"
                //path: "../../css/editorfonts.css"
            },
            RotisSansSerifStdLight:{
                //id: "RotisSansSerifStdLight",
                name: "RotisSansSerifStdLight"
                //path: "../../css/editorfonts.css"
            },
            RotisSansSerifStdLightItalic:{
                //id: "RotisSansSerifStdLightItalic",
                name: "RotisSansSerifStdLightItalic"
                //path: "../../css/editorfonts.css"
            },
            RotisSansSerifStdRegular:{
                //id: "RotisSansSerifStdRegular",
                name: "RotisSansSerifStdRegular"
                //path: "../../css/editorfonts.css"
            },
            RobotoBlack:{
                //id :"RobotoBlack",
                name:"RobotoBlack"
                //path: "../../css/editorfonts.css"
            },
            RobotoBlackItalic:{
                //id :"RobotoBlackItalic",
                name:"RobotoBlackItalic"
                //path: "../../css/editorfonts.css"
            },
            RobotoBold:{
                //id :"RobotoBold",
                name:"RobotoBold"
                //path: "../../css/editorfonts.css"
            },
            RobotoBoldCondensed:{
                //id :"RobotoBoldCondensed",
                name:"RobotoBoldCondensed"
                //path: "../../css/editorfonts.css"
            },
            RobotoBoldCondensedItalic:{
                //id :"RobotoBoldCondensedItalic",
                name:"RobotoBoldCondensedItalic"
                //path: "../../css/editorfonts.css"
            },
            RobotoBoldItalic:{
                //id :"RobotoBoldItalic",
                name:"RobotoBoldItalic"
                //path: "../../css/editorfonts.css"
            },
            RobotoCondensed:{
                //id :"RobotoCondensed",
                name:"RobotoCondensed"
                //path: "../../css/editorfonts.css"
            },
            RobotoCondensedItalic:{
                //id :"RobotoCondensedItalic",
                name:"RobotoCondensedItalic"
                //path: "../../css/editorfonts.css"
            },
            RobotoItalic:{
                //id :"RobotoItalic",
                name:"RobotoItalic"
                //path: "../../css/editorfonts.css"
            },
            RobotoLight:{
                //id :"RobotoLight",
                name:"RobotoLight"
                //path: "../../css/editorfonts.css"
            },
            RobotoLightItalic:{
                //id :"RobotoLightItalic",
                name:"RobotoLightItalic"
                //path: "../../css/editorfonts.css"
            },
            RobotoMedium:{
                //id :"RobotoMedium",
                name:"RobotoMedium"
                //path: "../../css/editorfonts.css"
            },
            RobotoMediumItalic:{
                //id :"RobotoMediumItalic",
                name:"RobotoMediumItalic"
                //path: "../../css/editorfonts.css"
            },
            RobotoRegular:{
                //id :"RobotoRegular",
                name:"RobotoRegular"
                //path: "../../css/editorfonts.css"
            },
            RobotoThin:{
                // id :"RobotoThin",
                name:"RobotoThin"
                // path: "../../css/editorfonts.css"
            },
            RobotoThinItalic:{
                // id :"RobotoThinItalic",
                name:"RobotoThinItalic"
                // path: "../../css/editorfonts.css"
            }

        },
        PACKAGES: {
            Arial:['Arial'],
            TimesNewRoman:['TimesNewRoman'],
            Trebuchet:['Trebuchet'],
            Verdana:['Verdana'],
            Tahoma:['Tahoma'],
            Lucida:['Lucida'],
            Georgia:['Georgia'],
            asul: ["asul"],
            josefinsans: ["josefinsans", "lato"],
            LeagueGothic: ["LeagueGothic", "lato"],
            merriweather: ["merriweathersans", "oxygen"],
            newscycle: ["newscycle", "lato"],
            montserrat: ["montserrat", "opensans"],
            opensans: ["opensans"],
            overpass: ["overpass"],
            quicksand: ["quicksand", "opensans"],
            merck: ["merck"],
            merckbold: ["merckbold"],
            merckpro: ["merckpro"],
            proximanova: ["proximanova"],
            proximanovabold: ["proximanovabold"],
            proximanovasemibold: ["proximanovasemibold"],
            futura: ["futura"],
            rajdhanibold : ["rajdhanibold"],
            RajdhaniRegular: ["RajdhaniRegular"],
            RajdhaniMedium : ["RajdhaniMedium"],
            RajdhaniSemiBold : ["RajdhaniSemiBold"],
            RajdhaniLight : ["RajdhaniLight"],
            futurabdcn : ["futurabdcn"],
            futurablackbold : ["futurablackbold"],
            futurabold : ["futurabold"],
            futurabolditalic : ["futurabolditalic"],
            futurabook : ["futurabook"],
            futurabookitalic : ["futurabookitalic"],
            futuraextrablack : ["futuraextrablack"],
            futuraextrablackitalic : ["futuraextrablackitalic"],
            futuraheavy : ["futuraheavy"],
            futuraheavyitalic : ["futuraheavyitalic"],
            futuralightbt : ["futuralightbt"],
            futuralightitalic : ["futuralightitalic"],
            futuraltcnlight : ["futuraltcnlight"],
            futuramediumbt : ["futuramediumbt"],
            futuramediumitalic : ["futuramediumitalic"],
            futuramediummdcn : ["futuramediummdcn"],
            SignPainterHouse : ["SignPainterHouse"],
            GilroySemiBoldItalic : ["GilroySemiBoldItalic"],
            GilroySemiBold : ["GilroySemiBold"],
            GilroyRegularItalic : ["GilroyRegularItalic"],
            GilroyRegular : ["GilroyRegular"],
            GilroyMediumItalic : ["GilroyMediumItalic"],
            GilroyMedium : ["GilroyMedium"],
            GilroyLightItalic : ["GilroyLightItalic"],
            GilroyLight : ["GilroyLight"],
            GilroyBoldItalic : ["GilroyBoldItalic"],
            GilroyBold : ["GilroyBold"],
            FuturaBTMediumItalic : ["FuturaBTMediumItalic"],
            FuturaBTMedium : ["FuturaBTMedium"],
            FuturaBTCondMedium : ["FuturaBTCondMedium"],
            EagleBook :["EagleBook"],
            UniversLTStdBoldCn :["UniversLTStdBoldCn"],
            WhitneyBold :["WhitneyBold"],
            WhitneyBoldItalic :["WhitneyBoldItalic"],
            WhitneyBook :["WhitneyBook"],
            WhitneyBookItalic :["WhitneyBookItalic"],
            WhitneyMedium :["WhitneyMedium"],
            WhitneyMediumItalic :["WhitneyMediumItalic"],
            WhitneySemiblod :["WhitneySemiblod"],
            WhitneySemiboldItalic :["WhitneySemiboldItalic"],
            AvenirBlack:['AvenirBlack'],
            AvenirLight:['AvenirLight'],
            AvenirLightOblique:['AvenirLightOblique'],
            AvenirMedium:['AvenirMedium'],
            RotisSansSerifStdBold:['RotisSansSerifStdBold'],
            RotisSansSerifStdExtraBold:['RotisSansSerifStdExtraBold'],
            RotisSansSerifStdItalic:['RotisSansSerifStdItalic'],
            RotisSansSerifStdLight:['RotisSansSerifStdLight'],
            RotisSansSerifStdLightItalic:['RotisSansSerifStdLightItalic'],
            RotisSansSerifStdRegular:['RotisSansSerifStdRegular'],
            cabinsketch:['cabinsketch'],
            arialBold:['arialBold'],
            arialBoldItalic:['arialBoldItalic'],
            arialItalic:['arialItalic'],
            avenirHeavy:['avenirHeavy'],
            RobotoBlack:['RobotoBlack'],
            RobotoBlackItalic:['RobotoBlackItalic'],
            RobotoBold:['RobotoBold'],
            RobotoBoldCondensed:["RobotoBoldCondensed"],
            RobotoBoldCondensedItalic:['RobotoBoldCondensedItalic'],
            RobotoBoldItalic:['RobotoBoldItalic'],
            RobotoCondensed:['RobotoCondensed'],
            RobotoCondensedItalic:['RobotoCondensedItalic'],
            RobotoItalic:['RobotoItalic'],
            RobotoLight:['RobotoLight'],
            RobotoLightItalic:['RobotoLightItalic'],
            RobotoMedium:['RobotoMedium'],
            RobotoMediumItalic:['RobotoMediumItalic'],
            RobotoRegular:['RobotoRegular'],
            RobotoThin:['RobotoThin'],
            RobotoThinItalic:['RobotoThinItalic']
        }/*,
        init: function() {
            if (this._isReady = !1, this.ready = new signals.Signal, this.loaded = new signals.Signal, this.debugMode = !!SL.util.getQuery().debug, $("link[data-application-font]").each(function() {
                    var t = $(this).attr("data-application-font");
                    SL.fonts.FAMILIES[t] && (SL.fonts.FAMILIES[t].loaded = !0)
                }), SLConfig && SLConfig.deck) {
                var t = (SLConfig.deck.theme_font, this.loadDeckFont([SLConfig.deck.theme_font || SL.config.DEFAULT_THEME_FONT], {
                    active: this.onWebFontsActive.bind(this),
                    inactive: this.onWebFontsInactive.bind(this)
                }));
                t ? this.initTimeout = setTimeout(function() {
                    this.debugMode && console.log("SL.fonts", "timed out"), this.finishLoading()
                }.bind(this), SL.fonts.INIT_TIMEOUT) : this.finishLoading()
            } else this.finishLoading()
        },
        load: function(t, e) {
            var i = $.extend({
                custom: {
                    families: [],
                    urls: []
                }
            }, e);
            return t.forEach(function(t) {
                var e = SL.fonts.FAMILIES[t];
                e ? e.loaded || (e.loaded = !0, i.custom.families.push(e.name), i.custom.urls.push(SL.fonts.FONTS_URL + e.path)) : console.warn('Could not find font family with id "' + t + '"')
            }), this.debugMode && console.log("SL.fonts.load", i.custom.families), i.custom.families.length ? (WebFont.load(i), !0) : !1
        },
        loadAll: function() {
            var t = [];
            for (var e in SL.fonts.FAMILIES) t.push(e);
            this.load(t)
        },
        loadDeckFont: function(t, e) {
            var i = SL.fonts.PACKAGES[t];
            return i ? SL.fonts.load(i, e) : !1
        },
        unload: function(t) {
            t.forEach(function(t) {
                var e = SL.fonts.FAMILIES[t];
                e && (e.loaded = !1, $('link[href="' + SL.fonts.FONTS_URL + e.path + '"]').remove())
            })
        },
        finishLoading: function() {
            clearTimeout(this.initTimeout), $("html").addClass("fonts-are-ready"), this._isReady === !1 && (this._isReady = !0, this.ready.dispatch()), this.loaded.dispatch()
        },
        isReady: function() {
            return this._isReady
        },
        onWebFontsActive: function() {
            this.finishLoading()
        },
        onWebFontsInactive: function() {
            this.finishLoading()
        }*/
    },
    SL.keyboard = {
        init: function() {
            this.keyupConsumers = new SL.collections.Collection, this.keydownConsumers = new SL.collections.Collection, $(document).on("keydown", this.onDocumentKeyDown.bind(this)), $(document).on("keyup", this.onDocumentKeyUp.bind(this))
        },
        keydown: function(t) {
            this.keydownConsumers.push(t)
        },
        keyup: function(t) {
            this.keyupConsumers.push(t)
        },
        release: function(t) {
            this.keydownConsumers.remove(t), this.keyupConsumers.remove(t)
        },
        onDocumentKeyDown: function(t) {
            for (var e, i = this.keydownConsumers.size(), n = !1; e = this.keydownConsumers.at(--i);)
                if (!e(t)) {
                    n = !0;
                    break
                }
            return n ? (t.preventDefault(), t.stopImmediatePropagation(), !1) : void 0
        },
        onDocumentKeyUp: function(t) {
            for (var e, i = this.keyupConsumers.size(), n = !1; e = this.keyupConsumers.at(--i);)
                if (!e(t)) {
                    n = !0;
                    break
                }
            return n ? (t.preventDefault(), t.stopImmediatePropagation(), !1) : void 0
        }
    },
    SL.locale = {
        GENERIC_ERROR: ["Oops, something went wrong", "We ran into an unexpected error", "Something's wong, can you try that again?"],
        WARN_UNSAVED_CHANGES: "You have unsaved changes, save first?",
        CLOSE: "Close",
        PREVIOUS: "Previous",
        NEXT: "Next",
        DECK_SAVE_SUCCESS: "Saved successfully",
        DECK_SAVE_ERROR: "Failed to save",
        NEW_SLIDE_TITLE: "Title",
        LEAVE_UNSAVED_DECK: "You will lose your unsaved changes.",
        LEAVE_UNSAVED_THEME: "You will lose your unsaved changes.",
        REMOVE_PRO_CONFIRM: "Your account will be downgraded from Pro to the Free plan at the end of the current billing period.",
        REMOVE_PRO_SUCCESS: "Subscription canceled",
        DECK_RESTORE_CONFIRM: "Are you sure you want to revert to this version from {#time}?",
        DECK_DELETE_CONFIRM: 'Are you sure you want to delete "{#title}"?',
        DECK_DELETE_SUCCESS: "Deck deleted",
        DECK_DELETE_ERROR: "Failed to delete",
        DECK_VISIBILITY_CHANGE_SELF: '<div><span class="icon i-lock-stroke"></span></div><h3>Private</h3><p>Only visible to you</p>',
        DECK_VISIBILITY_CHANGE_TEAM: '<div><span class="icon i-users"></span></div><h3>Internal</h3><p>Visible to your team</p>',
        DECK_VISIBILITY_CHANGE_ALL: '<div><span class="icon i-globe"></span></div><h3>Public</h3><p>Visible to the world</p>',
        DECK_VISIBILITY_CHANGED_SELF: "Your deck is now private",
        DECK_VISIBILITY_CHANGED_TEAM: "Your deck is now internal",
        DECK_VISIBILITY_CHANGED_ALL: "Your deck is now public",
        DECK_VISIBILITY_CHANGED_ERROR: "Failed to change visibility",
        DECK_EDIT_INVALID_TITLE: "Please enter a valid title",
        DECK_EDIT_INVALID_SLUG: "Please enter a valid URL",
        DECK_DELETE_SLIDE_CONFIRM: "Are you sure you want to delete this screen ? <br/> <span class='infos'>(If this is the top screen of a vertical flow/column then screens underneath will be deleted as well.)</span>",
        DECK_IMPORT_HTML_CONFIRM: "All existing content will be replaced, continue?",
        EXPORT_PDF_BUTTON: "Download PDF",
        EXPORT_PDF_BUTTON_WORKING: "Creating PDF...",
        EXPORT_PDF_ERROR: "An error occured while exporting your PDF.",
        EXPORT_ZIP_BUTTON: "Download ZIP",
        EXPORT_ZIP_BUTTON_WORKING: "Creating ZIP...",
        EXPORT_ZIP_ERROR: "An error occured while exporting your ZIP.",
        FORM_ERROR_REQUIRED: "Required",
        FORM_ERROR_USERNAME_TAKEN: ["That one's already taken :(", "Sorry, that's taken too"],
        FORM_ERROR_ORGANIZATION_SLUG_TAKEN: ["That one's already taken :(", "Sorry, that's taken too"],
        BILLING_DETAILS_ERROR: "An error occured while fetching your billing details, please try again.",
        BILLING_DETAILS_NOHISTORY: "You haven't made any payments yet.",
        THEME_CREATE: "New theme",
        THEME_CREATE_ERROR: "Failed to create theme",
        THEME_SAVE_SUCCESS: "Theme saved",
        THEME_SAVE_ERROR: "Failed to save theme",
        THEME_REMOVE_CONFIRM: "Are you sure you want to delete this theme?",
        THEME_REMOVE_SUCCESS: "Theme removed successfully",
        THEME_REMOVE_ERROR: "Failed to remove theme",
        THEME_LIST_LOAD_ERROR: "Failed to load themes",
        THEME_LIST_EMPTY: "Once you have created one or more themes they'll be listed here. Click the New Theme button to get started with your first theme.",
        THEME_DEFAULT_SAVE_SUCCESS: "Default theme was changed",
        THEME_DEFAULT_SAVE_ERROR: "Failed to change default theme",
        THEME_DELETE_TOOLTIP: "Delete",
        THEME_EDIT_TOOLTIP: "Edit",
        THEME_MAKE_DEFAULT_TOOLTIP: "Make this the default theme",
        THEME_IS_DEFAULT_TOOLTIP: "This is the default theme",
        THEME_SNIPPET_DELETE_CONFIRM: "Are you sure you want to delete this snippet?",
        TEMPLATE_LOAD_ERROR: "Failed to load slide templates",
        TEMPLATE_CREATE_SUCCESS: "Template saved!",
        TEMPLATE_CREATE_ERROR: "Failed to save template",
        TEMPLATE_DELETE_CONFIRM: "Are you sure you want to delete this template?",
        SEARCH_PAGINATION_PAGE: "Page",
        SEARCH_NO_RESULTS_FOR: 'No results for "{#term}"',
        SEARCH_SERVER_ERROR: "Failed to fetch search results",
        SEARCH_NO_TERM_ERROR: "Please enter a search term",
        MEDIA_TAG_DELETE_CONFIRM: "Are you sure you want to permanently delete this tag?",
        MEDIA_TAG_DELETE_SUCCESS: "Tag deleted",
        MEDIA_TAG_DELETE_ERROR: "Failed to delete",
        COLLABORATOR_REMOVE_CONFIRM: "Are you sure you want to remove this user?",
        counter: {},
        get: function(t, e) {
            var i = SL.locale[t];
            if ("object" == typeof i && i.length && (this.counter[t] = "number" == typeof this.counter[t] ? (this.counter[t] + 1) % i.length : 0, i = i[this.counter[t]]), "object" == typeof e)
                for (var n in e) i = i.replace("{#" + n + "}", e[n]);
            return "string" == typeof i ? i : ""
        }
    },
    function(t) {
        var e = {};
        e.sync = function() {
            $("[data-placement]").each(function() {
                var t = $(this),
                    i = t.attr("data-placement");
                "function" == typeof e[i] ? e[i](t) : console.log('No matching layout found for "' + i + '"')
            })
        }, e.hcenter = function(t) {
            var e = t.parent();
            e && t.css("left", (e.width() - t.outerWidth()) / 2)
        }, e.vcenter = function(t) {
            var e = t.parent();
            e && t.css("top", (e.height() - t.outerHeight()) / 2)
        }, e.center = function(t) {
            var e = t.parent();
            if (e) {
                var i = e.width(),
                    n = e.height(),
                    s = t.outerWidth(),
                    o = t.outerHeight();
                t.css({
                    left: (i - s) / 2,
                    top: (n - o) / 2
                })
            }
        }, e.sync(), $(t).on("resize", e.sync), t.Placement = e
    }(window),
    SL.pointer = {
        down: !1,
        downTimeout: -1,
        init: function() {
            $(document).on("mousedown", this.onMouseDown.bind(this)), $(document).on("mouseleave", this.onMouseLeave.bind(this)), $(document).on("mouseup", this.onMouseUp.bind(this))
        },
        isDown: function() {
            return this.down
        },
        onMouseDown: function() {
            clearTimeout(this.downTimeout), this.down = !0, this.downTimeout = setTimeout(function() {
                this.down = !1
            }.bind(this), 3e4)
        },
        onMouseLeave: function() {
            clearTimeout(this.downTimeout), this.down = !1
        },
        onMouseUp: function() {
            clearTimeout(this.downTimeout), this.down = !1
        }
    },
    SL.routes = {
        PRICING: "/pricing",
        CHANGELOG: "/changelog",
        SIGN_IN: "/users/sign_in",
        SIGN_OUT: "/users/sign_out",
        BRAND_KIT: "/about#logo",
        SUBSCRIPTIONS_NEW: "/account/upgrade",
        SUBSCRIPTIONS_EDIT_CARD: "/account/update_billing",
        SUBSCRIPTIONS_EDIT_PERIOD: "/account/update_billing_period",
        USER: function(t) {
            return "/" + t
        },
        USER_EDIT: "/users/edit",
        DECK: function(t, e) {
            return "/" + t + "/" + e
        },
        DECK_NEW: function(t) {
            return "/" + t + "/new"
        },
        DECK_EDIT: function(t, e) {
            return "http://" + window.location.host + "/app_dev.php/en/my-clm-presentations/" + SL.current_deck.get("id") +"/edit"
        },
        DECK_REVIEW: function(t, e) {
            return "/" + t + "/" + e + "/review"
        },
        DECK_EMBED: function(t, e) {
            return "/" + t + "/" + e + "/embed"
        },
        DECK_LIVE: function(t, e) {
            return "/" + t + "/" + e + "/live"
        },
        THEME_EDITOR: "/themes",
        BILLING_DETAILS: "/account/billing",
        TEAM: function(t) {
            return window.location.protocol + "//" + t.get("slug") + "." + SL.config.APP_HOST
        },
        TEAM_EDIT: function(t) {
            return SL.routes.TEAM(t) + "/edit"
        },
        TEAM_EDIT_MEMBERS: function(t) {
            return SL.routes.TEAM(t) + "/edit_members"
        }
    },
    SL.session = {
        enforce: function() {
            this.enforced || (this.enforced = !0, this.hasLoggedOut = !1, this.loginInterval = setInterval(this.check.bind(this), SL.config.LOGIN_STATUS_INTERVAL))
        },
        check: function() {
            $.get(SL.config.AJAX_CHECK_STATUS).done(function(t) {
                t && t.user_signed_in ? this.onLoggedIn() : this.onLoggedOut()
            }.bind(this))
        },
        onLoggedIn: function() {
            this.hasLoggedOut && (this.hasLoggedOut = !1, SL.popup.close(SL.components.popup.SessionExpired))
        },
        onLoggedOut: function() {
            this.hasLoggedOut || (this.hasLoggedOut = !0, SL.popup.open(SL.components.popup.SessionExpired))
        }
    },
    SL.settings = {
        STORAGE_KEY: "slides-settings",
        STORAGE_VERSION: 1,
        EDITOR_AUTO_HIDE: "editorAutoHide",
        EDITOR_AUTO_SAVE: "editorAutoSave",
        init: function() {
            this.settings = {
                version: this.STORAGE_VERSION
            },
                this.changed = new signals.Signal,
                this.restore()
        },
        setDefaults: function() {
            "undefined" == typeof this.settings[this.EDITOR_AUTO_HIDE] && (this.settings[this.EDITOR_AUTO_HIDE] = !1), "undefined" == typeof this.settings[this.EDITOR_AUTO_SAVE] && (this.settings[this.EDITOR_AUTO_SAVE] = !0)
        },
        setValue: function(t, e) {
            "object" == typeof t ? $.extend(this.settings, t) : this.settings[t] = e, this.save(), this.changed.dispatch([t])
        },
        getValue: function(t) {
            return this.settings[t]
        },
        removeValue: function(t) {
            "object" == typeof t && t.length ? t.forEach(function(t) {
                delete this.settings[t]
            }.bind(this)) : delete this.settings[t], this.save(), this.changed.dispatch([t])
        },
        restore: function() {
            if (Modernizr.localstorage) {
                var t = localStorage.getItem(this.STORAGE_KEY);
                if (t) {
                    var e = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
                    e && e.version === this.STORAGE_VERSION ? (this.settings = e, this.setDefaults(), this.changed.dispatch()) : (this.setDefaults(), this.save())
                }
            }
            this.setDefaults()
        },
        save: function() {
            Modernizr.localstorage && localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings))
        }
    },
    SL.util.svg = {
        NAMESPACE: "http://www.w3.org/2000/svg",
        SYMBOLS: {
            happy: '<path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM16 18.711c3.623 0 7.070-0.963 10-2.654-0.455 5.576-4.785 9.942-10 9.942-5.215 0-9.544-4.371-10-9.947 2.93 1.691 6.377 2.658 10 2.658zM8 11c0-1.657 0.895-3 2-3s2 1.343 2 3c0 1.657-0.895 3-2 3-1.105 0-2-1.343-2-3zM20 11c0-1.657 0.895-3 2-3s2 1.343 2 3c0 1.657-0.895 3-2 3-1.105 0-2-1.343-2-3z"></path>',
            smiley: '<path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM8 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM20 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM22.003 19.602l2.573 1.544c-1.749 2.908-4.935 4.855-8.576 4.855s-6.827-1.946-8.576-4.855l2.573-1.544c1.224 2.036 3.454 3.398 6.003 3.398s4.779-1.362 6.003-3.398z"></path>',
            wondering: '<path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM23.304 18.801l0.703 2.399-13.656 4-0.703-2.399zM8 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM20 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2z"></path>',
            sad: '<path d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM8 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM20 10c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM9.997 24.398l-2.573-1.544c1.749-2.908 4.935-4.855 8.576-4.855 3.641 0 6.827 1.946 8.576 4.855l-2.573 1.544c-1.224-2.036-3.454-3.398-6.003-3.398-2.549 0-4.779 1.362-6.003 3.398z"></path>',
            "checkmark-circle": '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM13.52 23.383l-7.362-7.363 2.828-2.828 4.533 4.535 9.617-9.617 2.828 2.828-12.444 12.445z"></path>',
            "plus-circle": '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM24 18h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z"></path>',
            "minus-circle": '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM24 18h-16v-4h16v4z"></path>',
            "x-circle": '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM23.914 21.086l-2.828 2.828-5.086-5.086-5.086 5.086-2.828-2.828 5.086-5.086-5.086-5.086 2.828-2.828 5.086 5.086 5.086-5.086 2.828 2.828-5.086 5.086 5.086 5.086z"></path>',
            denied: '<path d="M16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16zM16 4c2.59 0 4.973 0.844 6.934 2.242l-16.696 16.688c-1.398-1.961-2.238-4.344-2.238-6.93 0-6.617 5.383-12 12-12zM16 28c-2.59 0-4.973-0.844-6.934-2.242l16.696-16.688c1.398 1.961 2.238 4.344 2.238 6.93 0 6.617-5.383 12-12 12z"></path>',
            clock: '<path d="M16 4c6.617 0 12 5.383 12 12s-5.383 12-12 12-12-5.383-12-12 5.383-12 12-12zM16 0c-8.836 0-16 7.164-16 16s7.164 16 16 16 16-7.164 16-16-7.164-16-16-16v0zM21.422 18.578l-3.422-3.426v-7.152h-4.023v7.992c0 0.602 0.277 1.121 0.695 1.492l3.922 3.922 2.828-2.828z"></path>',
            "heart-stroke": '<path d="M23.113 6c2.457 0 4.492 1.82 4.836 4.188l-11.945 13.718-11.953-13.718c0.344-2.368 2.379-4.188 4.836-4.188 2.016 0 3.855 2.164 3.855 2.164l3.258 3.461 3.258-3.461c0 0 1.84-2.164 3.855-2.164zM23.113 2c-2.984 0-5.5 1.578-7.113 3.844-1.613-2.266-4.129-3.844-7.113-3.844-4.903 0-8.887 3.992-8.887 8.891v0.734l16.008 18.375 15.992-18.375v-0.734c0-4.899-3.984-8.891-8.887-8.891v0z"></path>',
            "heart-fill": '<path d="M16 5.844c-1.613-2.266-4.129-3.844-7.113-3.844-4.903 0-8.887 3.992-8.887 8.891v0.734l16.008 18.375 15.992-18.375v-0.734c0-4.899-3.984-8.891-8.887-8.891-2.984 0-5.5 1.578-7.113 3.844z"></path>',
            home: '<path d="M16 0l-16 16h4v16h24v-16h4l-16-16zM24 28h-6v-6h-4v6h-6v-14.344l8-5.656 8 5.656v14.344z"></path>',
            pin: '<path d="M17.070 2.93c-3.906-3.906-10.234-3.906-14.141 0-3.906 3.904-3.906 10.238 0 14.14 0.001 0 7.071 6.93 7.071 14.93 0-8 7.070-14.93 7.070-14.93 3.907-3.902 3.907-10.236 0-14.14zM10 14c-2.211 0-4-1.789-4-4s1.789-4 4-4 4 1.789 4 4-1.789 4-4 4z"></path>',
            user: '<path d="M12 16c-6.625 0-12 5.375-12 12 0 2.211 1.789 4 4 4h16c2.211 0 4-1.789 4-4 0-6.625-5.375-12-12-12zM6 6c0-3.314 2.686-6 6-6s6 2.686 6 6c0 3.314-2.686 6-6 6-3.314 0-6-2.686-6-6z"></path>',
            mail: '<path d="M15.996 15.457l16.004-7.539v-3.918h-32v3.906zM16.004 19.879l-16.004-7.559v15.68h32v-15.656z"></path>',
            star: '<path d="M22.137 19.625l9.863-7.625h-12l-4-12-4 12h-12l9.875 7.594-3.875 12.406 10.016-7.68 9.992 7.68z"></path>',
            bolt: '<path d="M32 0l-24 16 6 4-14 12 24-12-6-4z"></path>',
            sun: '<path d="M16.001 8c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.418 0 7.999-3.582 7.999-8s-3.581-8-7.999-8v0zM14 2c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM4 6c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM2 14c1.105 0 2 0.895 2 2 0 1.107-0.895 2-2 2s-2-0.893-2-2c0-1.105 0.895-2 2-2zM4 26c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM14 30c0-1.109 0.895-2 2-2 1.108 0 2 0.891 2 2 0 1.102-0.892 2-2 2-1.105 0-2-0.898-2-2zM24 26c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2zM30 18c-1.104 0-2-0.896-2-2 0-1.107 0.896-2 2-2s2 0.893 2 2c0 1.104-0.896 2-2 2zM24 6c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2-1.105 0-2-0.895-2-2z"></path>',
            moon: '<path d="M24.633 22.184c-8.188 0-14.82-6.637-14.82-14.82 0-2.695 0.773-5.188 2.031-7.363-6.824 1.968-11.844 8.187-11.844 15.644 0 9.031 7.32 16.355 16.352 16.355 7.457 0 13.68-5.023 15.648-11.844-2.18 1.254-4.672 2.028-7.367 2.028z"></path>',
            cloud: '<path d="M24 10c-0.379 0-0.738 0.061-1.102 0.111-1.394-2.465-3.972-4.111-6.898-4.111-2.988 0-5.566 1.666-6.941 4.1-0.352-0.047-0.704-0.1-1.059-0.1-4.41 0-8 3.588-8 8 0 4.414 3.59 8 8 8h16c4.41 0 8-3.586 8-8 0-4.412-3.59-8-8-8zM24 22h-16c-2.207 0-4-1.797-4-4 0-2.193 1.941-3.885 4.004-3.945 0.008 0.943 0.172 1.869 0.5 2.744l3.746-1.402c-0.168-0.444-0.25-0.915-0.25-1.397 0-2.205 1.793-4 4-4 1.293 0 2.465 0.641 3.199 1.639-1.929 1.461-3.199 3.756-3.199 6.361h4c0-2.205 1.793-4 4-4s4 1.795 4 4c0 2.203-1.793 4-4 4z"></path>',
            rain: '<path d="M23.998 6c-0.375 0-0.733 0.061-1.103 0.111-1.389-2.465-3.969-4.111-6.895-4.111-2.987 0-5.565 1.666-6.94 4.1-0.353-0.047-0.705-0.1-1.060-0.1-4.41 0-8 3.588-8 8s3.59 8 8 8h15.998c4.414 0 8-3.588 8-8s-3.586-8-8-8zM23.998 18h-15.998c-2.207 0-4-1.795-4-4 0-2.193 1.941-3.885 4.004-3.945 0.009 0.943 0.172 1.869 0.5 2.744l3.746-1.402c-0.168-0.444-0.25-0.915-0.25-1.397 0-2.205 1.793-4 4-4 1.293 0 2.465 0.641 3.199 1.639-1.928 1.461-3.199 3.756-3.199 6.361h4c0-2.205 1.795-4 3.998-4 2.211 0 4 1.795 4 4s-1.789 4-4 4zM3.281 29.438c-0.75 0.75-1.969 0.75-2.719 0s-0.75-1.969 0-2.719 5.438-2.719 5.438-2.719-1.969 4.688-2.719 5.438zM11.285 29.438c-0.75 0.75-1.965 0.75-2.719 0-0.75-0.75-0.75-1.969 0-2.719 0.754-0.75 5.438-2.719 5.438-2.719s-1.965 4.688-2.719 5.438zM19.28 29.438c-0.75 0.75-1.969 0.75-2.719 0s-0.75-1.969 0-2.719 5.437-2.719 5.437-2.719-1.968 4.688-2.718 5.438z"></path>',
            umbrella: '<path d="M16 0c-8.82 0-16 7.178-16 16h4c0-0.826 0.676-1.5 1.5-1.5 0.828 0 1.5 0.674 1.5 1.5h4c0-0.826 0.676-1.5 1.5-1.5 0.828 0 1.5 0.674 1.5 1.5v10c0 1.102-0.895 2-2 2-1.102 0-2-0.898-2-2h-4c0 3.309 2.695 6 6 6 3.312 0 6-2.691 6-6v-10c0-0.826 0.676-1.5 1.5-1.5 0.828 0 1.498 0.674 1.498 1.5h4c0-0.826 0.68-1.5 1.5-1.5 0.828 0 1.5 0.674 1.5 1.5h4c0-8.822-7.172-16-15.998-16z"></path>',
            eye: '<path d="M16 4c-8.836 0-16 11.844-16 11.844s7.164 12.156 16 12.156 16-12.156 16-12.156-7.164-11.844-16-11.844zM16 24c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM12 16c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4-2.209 0-4-1.791-4-4z"></path>',
            ribbon: '<path d="M8 20c-1.41 0-2.742-0.289-4-0.736v12.736l4-4 4 4v-12.736c-1.258 0.447-2.59 0.736-4 0.736zM0 8c0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8-4.418 0-8-3.582-8-8z"></path>',
            iphone: '<path d="M16 0h-8c-4.418 0-8 3.582-8 8v16c0 4.418 3.582 8 8 8h8c4.418 0 8-3.582 8-8v-16c0-4.418-3.582-8-8-8zM12 30.062c-1.139 0-2.062-0.922-2.062-2.062s0.924-2.062 2.062-2.062 2.062 0.922 2.062 2.062-0.923 2.062-2.062 2.062zM20 24h-16v-16c0-2.203 1.795-4 4-4h8c2.203 0 4 1.797 4 4v16z"></path>',
            camera: '<path d="M16 20c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4-2.209 0-4-1.791-4-4zM28 8l-3.289-6.643c-0.27-0.789-1.016-1.357-1.899-1.357h-5.492c-0.893 0-1.646 0.582-1.904 1.385l-3.412 6.615h-8.004c-2.209 0-4 1.791-4 4v20h32v-20c0-2.209-1.789-4-4-4zM6 16c-1.105 0-2-0.895-2-2s0.895-2 2-2 2 0.895 2 2-0.895 2-2 2zM20 28c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path>',
            cog: '<path d="M32 17.969v-4l-4.781-1.992c-0.133-0.375-0.273-0.738-0.445-1.094l1.93-4.805-2.829-2.828-4.762 1.961c-0.363-0.176-0.734-0.324-1.117-0.461l-2.027-4.75h-4l-1.977 4.734c-0.398 0.141-0.781 0.289-1.16 0.469l-4.754-1.91-2.828 2.828 1.938 4.711c-0.188 0.387-0.34 0.781-0.485 1.188l-4.703 2.011v4l4.707 1.961c0.145 0.406 0.301 0.801 0.488 1.188l-1.902 4.742 2.828 2.828 4.723-1.945c0.379 0.18 0.766 0.324 1.164 0.461l2.023 4.734h4l1.98-4.758c0.379-0.141 0.754-0.289 1.113-0.461l4.797 1.922 2.828-2.828-1.969-4.773c0.168-0.359 0.305-0.723 0.438-1.094l4.782-2.039zM15.969 22c-3.312 0-6-2.688-6-6s2.688-6 6-6 6 2.688 6 6-2.688 6-6 6z"></path>',
            lock: '<path d="M14 0c-5.508 0-9.996 4.484-9.996 10v2h-4.004v14c0 3.309 2.691 6 6 6h12c3.309 0 6-2.691 6-6v-16c0-5.516-4.488-10-10-10zM11.996 24c-1.101 0-1.996-0.895-1.996-2s0.895-2 1.996-2c1.105 0 2 0.895 2 2s-0.894 2-2 2zM20 12h-11.996v-2c0-3.309 2.691-6 5.996-6 3.309 0 6 2.691 6 6v2z"></path>',
            unlock: '<path d="M14.004 0c-5.516 0-9.996 4.484-9.996 10h3.996c0-3.309 2.688-6 6-6 3.305 0 5.996 2.691 5.996 6v2h-20v14c0 3.309 2.695 6 6 6h12c3.305 0 6-2.691 6-6v-16c0-5.516-4.488-10-9.996-10zM12 24c-1.102 0-2-0.895-2-2s0.898-2 2-2c1.109 0 2 0.895 2 2s-0.891 2-2 2z"></path>',
            fork: '<path d="M20 0v3.875c0 1.602-0.625 3.109-1.754 4.238l-11.316 11.254c-1.789 1.785-2.774 4.129-2.883 6.633h-4.047l6 6 6-6h-3.957c0.105-1.438 0.684-2.773 1.711-3.805l11.316-11.25c1.891-1.89 2.93-4.398 2.93-7.070v-3.875h-4zM23.953 26c-0.109-2.504-1.098-4.848-2.887-6.641l-2.23-2.215-2.836 2.821 2.242 2.23c1.031 1.027 1.609 2.367 1.715 3.805h-3.957l6 6 6-6h-4.047z"></path>',
            paperclip: '<path d="M17.293 15.292l-2.829-2.829-4 4c-1.953 1.953-1.953 5.119 0 7.071 1.953 1.953 5.118 1.953 7.071 0l10.122-9.879c3.123-3.124 3.123-8.188 0-11.313-3.125-3.124-8.19-3.124-11.313 0l-11.121 10.88c-4.296 4.295-4.296 11.26 0 15.557 4.296 4.296 11.261 4.296 15.556 0l6-6-2.829-2.829-5.999 6c-2.733 2.732-7.166 2.732-9.9 0-2.733-2.732-2.733-7.166 0-9.899l11.121-10.881c1.562-1.562 4.095-1.562 5.656 0 1.563 1.563 1.563 4.097 0 5.657l-10.121 9.879c-0.391 0.391-1.023 0.391-1.414 0s-0.391-1.023 0-1.414l4-4z"></path>',
            facebook: '<path d="M17.996 32h-5.996v-16h-4v-5.514l4-0.002-0.007-3.248c0-4.498 1.22-7.236 6.519-7.236h4.412v5.515h-2.757c-2.064 0-2.163 0.771-2.163 2.209l-0.008 2.76h4.959l-0.584 5.514-4.37 0.002-0.004 16z"></path>',
            twitter: '<path d="M32 6.076c-1.177 0.522-2.443 0.875-3.771 1.034 1.355-0.813 2.396-2.099 2.887-3.632-1.269 0.752-2.674 1.299-4.169 1.593-1.198-1.276-2.904-2.073-4.792-2.073-3.626 0-6.565 2.939-6.565 6.565 0 0.515 0.058 1.016 0.17 1.496-5.456-0.274-10.294-2.888-13.532-6.86-0.565 0.97-0.889 2.097-0.889 3.301 0 2.278 1.159 4.287 2.921 5.465-1.076-0.034-2.088-0.329-2.974-0.821-0.001 0.027-0.001 0.055-0.001 0.083 0 3.181 2.263 5.834 5.266 6.437-0.551 0.15-1.131 0.23-1.73 0.23-0.423 0-0.834-0.041-1.235-0.118 0.835 2.608 3.26 4.506 6.133 4.559-2.247 1.761-5.078 2.81-8.154 2.81-0.53 0-1.052-0.031-1.566-0.092 2.905 1.863 6.356 2.95 10.064 2.95 12.076 0 18.679-10.004 18.679-18.68 0-0.285-0.006-0.568-0.019-0.849 1.283-0.926 2.396-2.082 3.276-3.398z"></path>',
            earth: '<path d="M27.314 4.686c3.022 3.022 4.686 7.040 4.686 11.314s-1.664 8.292-4.686 11.314c-3.022 3.022-7.040 4.686-11.314 4.686s-8.292-1.664-11.314-4.686c-3.022-3.022-4.686-7.040-4.686-11.314s1.664-8.292 4.686-11.314c3.022-3.022 7.040-4.686 11.314-4.686s8.292 1.664 11.314 4.686zM25.899 25.9c1.971-1.971 3.281-4.425 3.821-7.096-0.421 0.62-0.824 0.85-1.073-0.538-0.257-2.262-2.335-0.817-3.641-1.621-1.375 0.927-4.466-1.802-3.941 1.276 0.81 1.388 4.375-1.858 2.598 1.079-1.134 2.050-4.145 6.592-3.753 8.946 0.049 3.43-3.504 0.715-4.729-0.422-0.824-2.279-0.281-6.262-2.434-7.378-2.338-0.102-4.344-0.314-5.25-2.927-0.545-1.87 0.58-4.653 2.584-5.083 2.933-1.843 3.98 2.158 6.731 2.232 0.854-0.894 3.182-1.178 3.375-2.18-1.805-0.318 2.29-1.517-0.173-2.199-1.358 0.16-2.234 1.409-1.512 2.467-2.632 0.614-2.717-3.809-5.247-2.414-0.064 2.206-4.132 0.715-1.407 0.268 0.936-0.409-1.527-1.594-0.196-1.379 0.654-0.036 2.854-0.807 2.259-1.325 1.225-0.761 2.255 1.822 3.454-0.059 0.866-1.446-0.363-1.713-1.448-0.98-0.612-0.685 1.080-2.165 2.573-2.804 0.497-0.213 0.973-0.329 1.336-0.296 0.752 0.868 2.142 1.019 2.215-0.104-1.862-0.892-3.915-1.363-6.040-1.363-3.051 0-5.952 0.969-8.353 2.762 0.645 0.296 1.012 0.664 0.39 1.134-0.483 1.439-2.443 3.371-4.163 3.098-0.893 1.54-1.482 3.238-1.733 5.017 1.441 0.477 1.773 1.42 1.464 1.736-0.734 0.64-1.185 1.548-1.418 2.541 0.469 2.87 1.818 5.515 3.915 7.612 2.644 2.644 6.16 4.1 9.899 4.1s7.255-1.456 9.899-4.1z"></path>',
            globe: '<path d="M15 2c-8.284 0-15 6.716-15 15s6.716 15 15 15c8.284 0 15-6.716 15-15s-6.716-15-15-15zM23.487 22c0.268-1.264 0.437-2.606 0.492-4h3.983c-0.104 1.381-0.426 2.722-0.959 4h-3.516zM6.513 12c-0.268 1.264-0.437 2.606-0.492 4h-3.983c0.104-1.381 0.426-2.722 0.959-4h3.516zM21.439 12c0.3 1.28 0.481 2.62 0.54 4h-5.979v-4h5.439zM16 10v-5.854c0.456 0.133 0.908 0.355 1.351 0.668 0.831 0.586 1.625 1.488 2.298 2.609 0.465 0.775 0.867 1.638 1.203 2.578h-4.852zM10.351 7.422c0.673-1.121 1.467-2.023 2.298-2.609 0.443-0.313 0.895-0.535 1.351-0.668v5.854h-4.852c0.336-0.94 0.738-1.803 1.203-2.578zM14 12v4h-5.979c0.059-1.38 0.24-2.72 0.54-4h5.439zM2.997 22c-0.533-1.278-0.854-2.619-0.959-4h3.983c0.055 1.394 0.224 2.736 0.492 4h-3.516zM8.021 18h5.979v4h-5.439c-0.3-1.28-0.481-2.62-0.54-4zM14 24v5.854c-0.456-0.133-0.908-0.355-1.351-0.668-0.831-0.586-1.625-1.488-2.298-2.609-0.465-0.775-0.867-1.638-1.203-2.578h4.852zM19.649 26.578c-0.673 1.121-1.467 2.023-2.298 2.609-0.443 0.312-0.895 0.535-1.351 0.668v-5.854h4.852c-0.336 0.94-0.738 1.802-1.203 2.578zM16 22v-4h5.979c-0.059 1.38-0.24 2.72-0.54 4h-5.439zM23.98 16c-0.055-1.394-0.224-2.736-0.492-4h3.516c0.533 1.278 0.855 2.619 0.959 4h-3.983zM25.958 10h-2.997c-0.582-1.836-1.387-3.447-2.354-4.732 1.329 0.636 2.533 1.488 3.585 2.54 0.671 0.671 1.261 1.404 1.766 2.192zM5.808 7.808c1.052-1.052 2.256-1.904 3.585-2.54-0.967 1.285-1.771 2.896-2.354 4.732h-2.997c0.504-0.788 1.094-1.521 1.766-2.192zM4.042 24h2.997c0.583 1.836 1.387 3.447 2.354 4.732-1.329-0.636-2.533-1.488-3.585-2.54-0.671-0.671-1.261-1.404-1.766-2.192zM24.192 26.192c-1.052 1.052-2.256 1.904-3.585 2.54 0.967-1.285 1.771-2.896 2.354-4.732h2.997c-0.504 0.788-1.094 1.521-1.766 2.192z"></path>',
            "thin-arrow-up": '<path d="M27.414 12.586l-10-10c-0.781-0.781-2.047-0.781-2.828 0l-10 10c-0.781 0.781-0.781 2.047 0 2.828s2.047 0.781 2.828 0l6.586-6.586v19.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-19.172l6.586 6.586c0.39 0.39 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586c0.781-0.781 0.781-2.047 0-2.828z"></path>',
            "thin-arrow-down": '<path d="M4.586 19.414l10 10c0.781 0.781 2.047 0.781 2.828 0l10-10c0.781-0.781 0.781-2.047 0-2.828s-2.047-0.781-2.828 0l-6.586 6.586v-19.172c0-1.105-0.895-2-2-2s-2 0.895-2 2v19.172l-6.586-6.586c-0.391-0.39-0.902-0.586-1.414-0.586s-1.024 0.195-1.414 0.586c-0.781 0.781-0.781 2.047 0 2.828z"></path>',
            "thin-arrow-up-left": '<path d="M4 18c0 1.105 0.895 2 2 2s2-0.895 2-2v-7.172l16.586 16.586c0.781 0.781 2.047 0.781 2.828 0 0.391-0.391 0.586-0.902 0.586-1.414s-0.195-1.024-0.586-1.414l-16.586-16.586h7.172c1.105 0 2-0.895 2-2s-0.895-2-2-2h-14v14z"></path>',
            "thin-arrow-up-right": '<path d="M26.001 4c-0 0-0.001 0-0.001 0h-11.999c-1.105 0-2 0.895-2 2s0.895 2 2 2h7.172l-16.586 16.586c-0.781 0.781-0.781 2.047 0 2.828 0.391 0.391 0.902 0.586 1.414 0.586s1.024-0.195 1.414-0.586l16.586-16.586v7.172c0 1.105 0.895 2 2 2s2-0.895 2-2v-14h-1.999z"></path>',
            "thin-arrow-left": '<path d="M12.586 4.586l-10 10c-0.781 0.781-0.781 2.047 0 2.828l10 10c0.781 0.781 2.047 0.781 2.828 0s0.781-2.047 0-2.828l-6.586-6.586h19.172c1.105 0 2-0.895 2-2s-0.895-2-2-2h-19.172l6.586-6.586c0.39-0.391 0.586-0.902 0.586-1.414s-0.195-1.024-0.586-1.414c-0.781-0.781-2.047-0.781-2.828 0z"></path>',
            "thin-arrow-right": '<path d="M19.414 27.414l10-10c0.781-0.781 0.781-2.047 0-2.828l-10-10c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l6.586 6.586h-19.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h19.172l-6.586 6.586c-0.39 0.39-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414c0.781 0.781 2.047 0.781 2.828 0z"></path>',
            "thin-arrow-down-left": '<path d="M18 28c1.105 0 2-0.895 2-2s-0.895-2-2-2h-7.172l16.586-16.586c0.781-0.781 0.781-2.047 0-2.828-0.391-0.391-0.902-0.586-1.414-0.586s-1.024 0.195-1.414 0.586l-16.586 16.586v-7.172c0-1.105-0.895-2-2-2s-2 0.895-2 2v14h14z"></path>',
            "thin-arrow-down-right": '<path d="M28 14c0-1.105-0.895-2-2-2s-2 0.895-2 2v7.172l-16.586-16.586c-0.781-0.781-2.047-0.781-2.828 0-0.391 0.391-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414l16.586 16.586h-7.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h14v-14z"></path>'
        },
        boundingBox: function(t) {
            var e;
            if ($(t).parents("body").length) e = t.getBBox();
            else {
                var i = t.parentNode,
                    n = document.createElementNS(SL.util.svg.NAMESPACE, "svg");
                n.setAttribute("width", "0"), n.setAttribute("height", "0"), n.setAttribute("style", "visibility: hidden; position: absolute; left: 0; top: 0;"), n.appendChild(t), document.body.appendChild(n), e = t.getBBox(), i ? i.appendChild(t) : n.removeChild(t), document.body.removeChild(n)
            }
            return e
        },
        pointsToPolygon: function(t) {
            for (var e = []; t.length >= 2;) e.push(t.shift() + "," + t.shift());
            return e.join(" ")
        },
        rect: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "rect");
            return i.setAttribute("width", t), i.setAttribute("height", e), i
        },
        ellipse: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "ellipse");
            return i.setAttribute("rx", t / 2), i.setAttribute("ry", e / 2), i.setAttribute("cx", t / 2), i.setAttribute("cy", e / 2), i
        },
        triangleUp: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "polygon");
            return i.setAttribute("points", SL.util.svg.pointsToPolygon([t / 2, 0, t, e, 0, e])), i
        },
        triangleDown: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "polygon");
            return i.setAttribute("points", SL.util.svg.pointsToPolygon([0, 0, t, 0, t / 2, e])), i
        },
        triangleLeft: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "polygon");
            return i.setAttribute("points", SL.util.svg.pointsToPolygon([0, e / 2, t, 0, t, e])), i
        },
        triangleRight: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "polygon");
            return i.setAttribute("points", SL.util.svg.pointsToPolygon([t, e / 2, 0, e, 0, 0])), i
        },
        arrowUp: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "polygon");
            return i.setAttribute("points", SL.util.svg.pointsToPolygon([.5 * t, 0, t, .5 * e, .7 * t, .5 * e, .7 * t, e, .3 * t, e, .3 * t, .5 * e, 0, .5 * e, .5 * t, 0])), i
        },
        arrowDown: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "polygon");
            return i.setAttribute("points", SL.util.svg.pointsToPolygon([.5 * t, e, t, .5 * e, .7 * t, .5 * e, .7 * t, 0, .3 * t, 0, .3 * t, .5 * e, 0, .5 * e, .5 * t, e])), i
        },
        arrowLeft: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "polygon");
            return i.setAttribute("points", SL.util.svg.pointsToPolygon([t, .3 * e, .5 * t, .3 * e, .5 * t, 0, 0, .5 * e, .5 * t, e, .5 * t, .7 * e, t, .7 * e, t, .3 * e])), i
        },
        arrowRight: function(t, e) {
            var i = document.createElementNS(SL.util.svg.NAMESPACE, "polygon");
            return i.setAttribute("points", SL.util.svg.pointsToPolygon([0, .3 * e, .5 * t, .3 * e, .5 * t, 0, t, .5 * e, .5 * t, e, .5 * t, .7 * e, 0, .7 * e])), i
        },
        polygon: function(t, e, i) {
            var n = document.createElementNS(SL.util.svg.NAMESPACE, "polygon"),
                s = [];
            if (3 === i) s = [t / 2, 0, t, e, 0, e];
            else if (i > 3)
                for (var o = t / 2, a = e / 2, r = 0; i > r; r++) {
                    var l = o + o * Math.cos(2 * Math.PI * r / i),
                        c = a + a * Math.sin(2 * Math.PI * r / i);
                    l = Math.round(10 * l) / 10, c = Math.round(10 * c) / 10, s.push(l), s.push(c)
                }
            return n.setAttribute("points", SL.util.svg.pointsToPolygon(s)), n
        },
        symbol: function(t) {
            var e = document.createElementNS(SL.util.svg.NAMESPACE, "g"),
                i = SL.util.svg.SYMBOLS[t];
            return i && (e.innerSVG = SL.util.svg.SYMBOLS[t]), e
        }
    },
    SL.visibility = {
        init: function() {
            this.changed = new signals.Signal, "undefined" != typeof document.hidden ? (this.hiddenProperty = "hidden", this.visibilityChangeEvent = "visibilitychange") : "undefined" != typeof document.msHidden ? (this.hiddenProperty = "msHidden", this.visibilityChangeEvent = "msvisibilitychange") : "undefined" != typeof document.webkitHidden && (this.hiddenProperty = "webkitHidden", this.visibilityChangeEvent = "webkitvisibilitychange"), this.supported = "boolean" == typeof document[this.hiddenProperty], this.supported && this.bind()
        },
        isVisible: function() {
            return this.supported ? !document[this.hiddenProperty] : !0
        },
        isHidden: function() {
            return this.supported ? document[this.hiddenProperty] : !1
        },
        bind: function() {
            document.addEventListener(this.visibilityChangeEvent, this.onVisibilityChange.bind(this))
        },
        onVisibilityChange: function() {
            this.changed.dispatch()
        }
    },
    SL.warnings = {
        STORAGE_KEY: "slides-last-warning-id",
        MESSAGE_ID: 23,
        init: function() {
            this.showMessage()
        },
        showMessage: function() {
            if (this.hasMessage() && !this.hasExpired() && SL.util.user.isLoggedIn() && Modernizr.localstorage) {
                var t = parseInt(localStorage.getItem(this.STORAGE_KEY), 10) || 0;
                if (t < this.MESSAGE_ID) {
                    var e = SL.notify(this.MESSAGE_TEXT, {
                        optional: !1
                    });
                    e.destroyed.add(this.hideMessage.bind(this))
                }
            }
        },
        hideMessage: function() {
            Modernizr.localstorage && localStorage.setItem(this.STORAGE_KEY, this.MESSAGE_ID)
        },
        hasMessage: function() {
            return !!this.MESSAGE_TEXT
        },
        hasExpired: function() {
            return this.MESSAGE_EXPIRY ? moment().diff(moment(this.MESSAGE_EXPIRY)) > 0 : !1
        }
    },
    SL("helpers").FileUploader = Class.extend({
        init: function(t) {
            if (this.options = $.extend({
                    formdata: !0,
                    contentType: !1,
                    external: !1,
                    method: "POST"
                }, t),
                "undefined" == typeof this.options.file || "undefined" == typeof this.options.service) throw "File and service must be defined for FileUploader task.";
            this.timeout = -1,
                this.uploading = !1,
                this.onUploadSuccess = this.onUploadSuccess.bind(this),
                this.onUploadProgress = this.onUploadProgress.bind(this),
                this.onUploadError = this.onUploadError.bind(this),
                this.failed = new signals.Signal,
                this.succeeded = new signals.Signal,
                this.progressed = new signals.Signal
        },
        upload: function() {
            if (this.options.file.type.match(/video.*/) !== null) {
                this.options.timeout = 1200000;
            }
            if (this.uploading = !0,
                    clearTimeout(this.timeout),
                "number" == typeof this.options.timeout && (this.timeout = setTimeout(this.onUploadError, this.options.timeout)),
                    this.xhr = new XMLHttpRequest,
                    this.xhr.onload = function() {
                        if (this.options.external === !0) this.onUploadSuccess();
                        else if (422 === this.xhr.status || 500 === this.xhr.status) this.onUploadError();
                        else {
                            try {
                                var t = JSON.parse(this.xhr.responseText)
                            } catch (e) {
                                return this.onUploadError()
                            }
                            this.onUploadSuccess(t)
                        }
                    }.bind(this),
                    this.xhr.onerror = this.onUploadError,
                    this.xhr.upload.onprogress = this.onUploadProgress,
                    this.xhr.open(this.options.method, this.options.service, !0),
                    this.options.contentType
            ) {
                var t = "string" == typeof this.options.contentType ? this.options.contentType : this.options.file.type;
                t && this.xhr.setRequestHeader("Content-Type", t)
            }

            if (process.env.ISPROD) {
                this.awsS3Upload()
                return;
            }
            this.localUpload()
        },
        localUpload: function() {
            // upload local Server
            if (this.options.formdata) {
                var e = new FormData;
                this.options.filename ? e.append("file", this.options.file, this.options.filename) : e.append("file", this.options.file);
                var i = this.options.csrf || document.querySelector('meta[name="csrf-token"]');
                i && !this.options.external && e.append("authenticity_token", i.getAttribute("content")),
                    this.xhr.send(e)
            } else {
                this.xhr.send(this.options.file)
            }
        },
        awsS3Upload: function() {
            // AWS S3 server upload
            if (this.options.formdata) {
                let fileType            = this.options.file.name.match(/\.([^.]*)$/),
                    originalFileName    = this.options.file.name.match(/^(.*?)\.[^.]*$/),
                    formatedfileName    = originalFileName[1].replace(/[-\/\\^$*+?.()|[\]{}\s]/g, ''),
                    fileName            = `${formatedfileName}_${Math.floor(Date.now())}.${fileType[1]}`,
                    fileKey             = '';

                switch(true) {
                    case (this.options.file.type.match(/image.*/) !== null) :
                        fileKey = `${companyNameFolder}/image/${fileName}`;
                        break;
                    case (this.options.file.type.match(/video.*/) !== null) :
                        fileKey = `${companyNameFolder}/video/${fileName}`;
                        break;
                    case (this.options.file.type.match(/application\/pdf/) !== null) :
                        fileKey = `${companyNameFolder}/pdf/${fileName}`;
                        break;
                }

                awsS3.upload({
                    Key     : fileKey,
                    Body    : this.options.file,
                    ACL     : 'public-read'
                }, function(err, data) {
                    if (err && err != null) {
                        console.log(err);
                        return alert('There was an error uploading your file: ', err);
                    }
                    let fileRealPath    = data.Location,
                        encodedFileName = encodeURIComponent(fileName),
                        theImage        = new Image(),
                        imageWidth      = '',
                        imageHeight     = '',
                        folderDestName  = `${companyNameFolder}/image`,
                        mediaKey        = `${folderDestName}/${encodedFileName}`;

                    var resize          = false;

                    if (this.options.file.type.match(/image.*/) !== null) {
                        /* To Do : Secure aws beckets files access */
                        // awsS3.getObject({ Bucket : process.env.ENV_BUCKET, Key : fileKey }, function(err, data) {
                        //     if (err) {
                        //         console.log(err, err.stack); // an error occurred
                        //     } else {
                        //         console.log(data); // successful response
                        //     }
                        // }.bind(this));
                        // XHR save Type Image
                        theImage.src    = fileRealPath;
                        theImage.onload = function () {
                            let widthCompare    = 1024;

                            imageWidth  = theImage.width,
                                imageHeight = theImage.height;

                            if (imageWidth > widthCompare) {
                                resize          = true;
                                fileRealPath    = `${companyMediaPath}/image/resize/${widthCompare}/${encodedFileName}`;
                                // fileRealPath    = `${process.env.STATICURL}/${widthCompare}xnull/${encodedFileName}`;

                                /* Invoke lambda resize */
                                let params = {
                                    FunctionName : 'veeva-summit-resize-image', /* required */
                                    Payload      : JSON.stringify({
                                        bucketTarget    : process.env.ENV_BUCKET,
                                        fileKey         : mediaKey,
                                        fileName        : encodedFileName,
                                        folderName      : folderDestName,
                                        widthResize     : widthCompare
                                    })
                                };
                                lambda.invoke(params, function(err, data) {
                                    if (err) {
                                        console.log(err, err.stack); // an error occurred
                                    } else {
                                        console.log(data); // successful response
                                        // Save resized image
                                        this.awsS3Save(fileRealPath, imageWidth, imageHeight, fileName, encodedFileName, resize, mediaKey);
                                    }
                                }.bind(this));
                            } else {
                                // Save no-resized image
                                this.awsS3Save(fileRealPath, imageWidth, imageHeight, fileName, encodedFileName, resize, mediaKey);
                            }
                        }.bind(this)
                    } else {
                        // XHR save Other Types Media
                        this.awsS3Save(fileRealPath, imageWidth, imageHeight, fileName, encodedFileName, resize, mediaKey);
                    }
                }.bind(this));
            } else {
                console.log('not here')
            }
        },
        awsS3Save: function(filepath, width, height, fileName, encodedFileName, resize, mediaKey) {
            let name        = this.options.file.name,
                thumb       = '',
                orginalpath = '';

            if (typeof fileName !== 'undefined' && fileName !== '') {
                name = fileName;
            }
            if (this.options.file.type.match(/image.*/) !== null) {
                thumb       = `${companyMediaPath}/image/${encodedFileName}`;
                orginalpath = thumb;
                if (resize === true) {
                    thumb = `${companyMediaPath}/image/resize/thumb_media/${encodedFileName}`;
                }
            }
            let fileinfos = JSON.stringify({
                files3path  : filepath,
                thumbUrl    : thumb,
                orginalPath : orginalpath,
                filetype    : this.options.file.type,
                s3filename  : encodedFileName,
                filename    : name.replace(/\s/g,''),
                filesize    : this.options.file.size,
                fileHeight  : height,
                fileWidth   : width,
                mediaKey    : mediaKey,
                bucketName  : process.env.ENV_BUCKET
            })
            this.xhr.send(fileinfos);
        },
        isUploading: function() {
            return this.uploading
        },
        onUploadSuccess: function(t) {
            let videourl = `${window.location.protocol}//${window.location.host}${t.url}`;

            if (t.content_type.match(/video.*/) !== null) {
                let context = this;

                if (t.url.match(/http*/) !== null) {
                    videourl = t.url;
                }
                this.videoposterAction(videourl, t.id, context, t);
            } else if (t.content_type.match(/image.*/) !== null) {
                let thumbImage = new Image();

                setTimeout(function() {
                    thumbImage.src      = t.thumb_url;
                    thumbImage.onload   = function() {
                        clearTimeout(this.timeout), this.uploading = !1, this.succeeded.dispatch(t);
                    }.bind(this);
                    thumbImage.onerror  = function() {
                        t.thumb_url = t.url;
                        clearTimeout(this.timeout), this.uploading = !1, this.succeeded.dispatch(t);
                    }.bind(this);
                }.bind(this), 2000);
            } else {
                clearTimeout(this.timeout), this.uploading = !1, this.succeeded.dispatch(t);
            }
        },
        onUploadProgress: function(t) {
            t.lengthComputable && this.progressed.dispatch(t.loaded / t.total)
        },
        onUploadError: function() {
            clearTimeout(this.timeout), this.uploading = !1, this.failed.dispatch()
        },
        destroy: function() {
            if (clearTimeout(this.timeout), this.xhr) {
                var t = function() {};
                this.xhr.onload = t, this.xhr.onerror = t, this.xhr.upload.onprogress = t, this.xhr.abort()
            }
            this.succeeded.dispose(), this.progressed.dispose(), this.failed.dispose()
        },
        videoposterAction: function(url, videoId, context, t) {
            let idRev   = TWIG.idRev,
                idPres  = TWIG.idPres;

            if (url !== '' && idPres && idRev) {
                if (process.env.ISPROD) {
                    /* Invoke lambda create video thumbnail */
                    let params = {
                        FunctionName : 'veeva-summit-video-thumbnail', /* required */
                        Payload      : JSON.stringify({
                            bucketTarget        : process.env.ENV_BUCKET,
                            videoFolderName     : `${companyNameFolder}/video`,
                            folderThumbName     : `${companyNameFolder}/thumbs/video`,
                            videoid             : t.id,
                            videoname           : t.label_media
                        })
                    };
                    lambda.invoke(params, function(err, data) {
                        if (err) {
                            console.log(err, err.stack); // an error occurred
                        } else {
                            console.log(data); // successful response
                            clearTimeout(context.timeout), context.uploading = !1, context.succeeded.dispatch(t)
                        }
                    }.bind(this));
                    return;
                }

                // if (process.env.ISPROD) {
                //
                //     let host            = process.env.APIHOSTVIDEOTHUMB,
                //         apiAction       = '/prod/videothumb',
                //         service         = 'execute-api',
                //         method          = 'GET',
                //         contentType     = 'application/json',
                //         date            = new Date();
                //
                //     let opts = {
                //         method  : `${method}`,
                //         service : `${service}`,
                //         region  : process.env.REGION,
                //         path    : `${apiAction}?videoname=${t.label_media}&videoid=${t.id}`,
                //         headers : {
                //             'Content-Type' : `${contentType}`,
                //             'Host'         : `${host}`,
                //             'X-Amz-Date'   : this.amzLongDate(date)
                //         }
                //     }
                //
                //     aws4.sign(opts);
                //
                //     var settings = {
                //         "async"         : true,
                //         "crossDomain"   : true,
                //         "url"           : `https://${host}${apiAction}?videoname=${t.label_media}&videoid=${t.id}`,
                //         "method"        : opts.method,
                //         "headers"       : opts.headers
                //     }
                //
                //     $.ajax(settings)
                //         .done(function (response) {
                //             clearTimeout(context.timeout), context.uploading = !1, context.succeeded.dispatch(t)
                //         }.bind(this)).fail(function(jqXHR, textStatus, errorThrown) {
                //         console.log("Request failed: " + errorThrown);
                //     }).always(function() {
                //         console.log("execute video thumb request");
                //     });
                //     return;
                // }

                $.ajax({
                    method          : 'POST',
                    url             : Routing.generate('videoposterffmpeg'),
                    dataType        : 'JSON',
                    data            : JSON.stringify({
                        'url'       : url,
                        'idRev'     : idRev,
                        'idPres'    : idPres,
                        'videoId'   : videoId
                    })
                }).done(function(e) {
                    console.log('video upload success');
                    clearTimeout(context.timeout), context.uploading = !1, context.succeeded.dispatch(t)
                });
            } else {
                console.log('missing parameters');
            }
        },
        amzShortDate: function(date) {
            return this.amzLongDate(date).substr(0, 8);
        },
        amzLongDate: function(date) {
            return date.toISOString().replace(/[:\-]|\.\d{3}/g, '').substr(0, 17);
        }
    }),
    SL.helpers.Fullscreen = {
        enter: function(t) {
            t = t || document.body;
            var e = t.requestFullScreen || t.webkitRequestFullscreen || t.webkitRequestFullScreen || t.mozRequestFullScreen || t.msRequestFullscreen;
            e && e.apply(t)
        },
        exit: function() {
            var t = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
            t && t.apply(document)
        },
        toggle: function() {
            SL.helpers.Fullscreen.isActive() ? SL.helpers.Fullscreen.exit() : SL.helpers.Fullscreen.enter()
        },
        isEnabled: function() {
            return !!(document.fullscreenEnabled || document.mozFullscreenEnabled || document.msFullscreenEnabled || document.webkitFullscreenEnabled)
        },
        isActive: function() {
            return !!(document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement)
        }
    },
SL("helpers").ImageUploader = Class.extend({
    init: function(t) {
        this.options = $.extend({
            service: SL.config.AJAX_MEDIA_CREATE,
            timeout: 2500
        }, t),
            this.onUploadSuccess = this.onUploadSuccess.bind(this),
            this.onUploadProgress = this.onUploadProgress.bind(this),
            this.onUploadError = this.onUploadError.bind(this),
            this.progressed = new signals.Signal,
            this.succeeded = new signals.Signal,
            this.failed = new signals.Signal
    },
    upload: function(t, e) {
        return t && t.type.match(/image.*/) ? "number" == typeof t.size && t.size / 1024 > SL.config.MAX_IMAGE_UPLOAD_SIZE.maxsize ? void SL.notify("No more than " + Math.round(MAX_IMAGE_UPLOAD_SIZE / 1e3) + "mb please", "negative") : (this.fileUploader && this.fileUploader.destroy(), this.fileUploader = new SL.helpers.FileUploader({
            file: t,
            filename: e || this.options.filename,
            service: this.options.service,
            timeout: this.options.timeout
        }),
            this.fileUploader.succeeded.add(this.onUploadSuccess),
            this.fileUploader.progressed.add(this.onUploadProgress),
            this.fileUploader.failed.add(this.onUploadError),
            void this.fileUploader.upload()) : void SL.notify("Only image files, please")
    },
    isUploading: function() {
        return !(!this.fileUploader || !this.fileUploader.isUploading())
    },
    onUploadSuccess: function(t) {
        t && "string" == typeof t.url ? this.succeeded.dispatch(t.url) : this.failed.dispatch(), this.fileUploader.destroy(), this.fileUploader = null
    },
    onUploadProgress: function(t) {
        this.progressed.dispatch(t)
    },
    onUploadError: function() {
        this.failed.dispatch(), this.fileUploader.destroy(), this.fileUploader = null
    },
    destroy: function() {
        this.succeeded.dispose(), this.progressed.dispose(), this.failed.dispose(), this.fileUploader && this.fileUploader.destroy()
    }
}),
SL.helpers.PageLoader = {
    show: function(t) {
        t = $.extend({
            style: null,
            message: null
        }, t);
        var e = $(".page-loader");
        0 === e.length && (e = $(['<div class="page-loader">', '<div class="page-loader-inner hidden">', '<p class="page-loader-message"></p>', '<div class="sk-spinner sk-spinner-rotating-plane"></div>', "</div>", "</div>"].join("")).appendTo(document.body), setTimeout(function() {
            e.find(".page-loader-inner").removeClass("hidden")
        }, 0)), t.container && e.appendTo(t.container), t.message && e.find(".page-loader-message").html(t.message), t.style && e.attr("data-style", t.style), clearTimeout(this.hideTimeout), e.removeClass("frozen"), e.addClass("visible")
    },
    hide: function() {
        $(".page-loader").removeClass("visible"), clearTimeout(this.hideTimeout), this.hideTimeout = setTimeout(function() {
            $(".page-loader").addClass("frozen")
        }.bind(this), 1e3)
    }/*,
    waitForFonts: function(t) {
        SL.fonts.isReady() === !1 && (this.show(t), SL.fonts.ready.add(this.hide))
    }*/
},
// SL("helpers").PollJob = Class.extend({
//     init: function(t) {
//         this.options = $.extend({
//             interval: 1e3,
//             timeout: Number.MAX_VALUE,
//             retries: Number.MAX_VALUE
//         }, t), this.interval = -1, this.running = !1, this.poll = this.poll.bind(this), this.ended = new signals.Signal, this.polled = new signals.Signal
//     },
//     start: function() {
//         this.running = !0, this.pollStart = Date.now(), this.pollTimes = 0, clearInterval(this.interval), this.interval = setInterval(this.poll, this.options.interval)
//     },
//     stop: function() {
//         this.running = !1, clearInterval(this.interval)
//     },
//     poll: function() {
//         this.pollTimes++, Date.now() - this.pollStart > this.options.timeout || this.pollTimes > this.options.retries ? (this.stop(), this.ended.dispatch()) : this.polled.dispatch()
//     }
// }),
SL("helpers").StreamEditor = Class.extend({
    init: function(t) {
        this.options = $.extend({}, t), this.statusChanged = new signals.Signal, this.reconnecting = new signals.Signal, this.messageReceived = new signals.Signal, this.debugMode = !!SL.util.getQuery().debug
    },
    connect: function() {
        if (this.socket) this.isConnected() || (this.log("manual reconnect", t), this.socket.io.close(), this.socket.io.open());
        else {
            var t = SL.config.STREAM_ENGINE_HOST + "/" + SL.config.STREAM_ENGINE_EDITOR_NAMESPACE;
            this.log("connecting to", t), this.socket = io.connect(t, {
                reconnectionDelayMax: 1e4
            }), this.socket.on("connect", this.onSocketConnect.bind(this)), this.socket.on("reconnect_attempt", this.onSocketReconnectAttempt.bind(this)), this.socket.on("reconnect_failed", this.onSocketReconnectFailed.bind(this)), this.socket.on("reconnect", this.onSocketReconnect.bind(this)), this.socket.on("disconnect", this.onSocketDisconnect.bind(this)), this.socket.on("message", this.onSocketMessage.bind(this))
        }
        return this.isConnected() ? Promise.resolve() : new Promise(function(t, e) {
            var i = function() {
                    t(), this.socket.removeEventListener("connect", i), this.socket.removeEventListener("connect_error", n)
                }.bind(this),
                n = function() {
                    e(), this.socket.removeEventListener("connect", i), this.socket.removeEventListener("connect_error", n)
                }.bind(this);
            this.socket.on("connect", i), this.socket.on("connect_error", n)
        }.bind(this))
    },
    broadcast: function(t) {
        this.emit("broadcast", JSON.stringify(t))
    },
    emit: function() {
        this.log("emit", arguments), this.socket.emit.apply(this.socket, arguments)
    },
    log: function() {
        if (this.debugMode && "function" == typeof console.log.apply) {
            var t = ["Stream:"].concat(Array.prototype.slice.call(arguments));
            console.log.apply(console, t)
        }
    },
    setStatus: function(t) {
        this.status !== t && (this.status = t, this.statusChanged.dispatch(this.status))
    },
    isConnected: function() {
        return this.socket.connected === !0
    },
    onSocketMessage: function(t) {
        try {
            var e = JSON.parse(t.data)
        } catch (i) {
            this.log("unable to parse streamed socket message as JSON.")
        }
        this.log("message", e), this.messageReceived.dispatch(e)
    },
    onSocketConnect: function() {
        this.log("connected"), this.emit("subscribe", {
            deck_id: this.options.deckID,
            user_id: SL.current_user.get("id"),
            slide_id: this.options.slideID
        }), this.setStatus(SL.helpers.StreamEditor.STATUS_CONNECTED)
    },
    onSocketDisconnect: function() {
        this.log("disconnected"), this.setStatus(SL.helpers.StreamEditor.STATUS_DISCONNECTED)
    },
    onSocketReconnectAttempt: function() {
        this.setStatus(SL.helpers.StreamEditor.STATUS_RECONNECTING), this.reconnecting.dispatch(this.socket.io.backoff.duration())
    },
    onSocketReconnectFailed: function() {
        this.log("reconnect failed"), this.setStatus(SL.helpers.StreamEditor.STATUS_RECONNECT_FAILED)
    },
    onSocketReconnect: function() {
        this.log("reconnected"), this.setStatus(SL.helpers.StreamEditor.STATUS_RECONNECTED)
    }
}),
SL.helpers.StreamEditor.STATUS_CONNECTED = "connected",
SL.helpers.StreamEditor.STATUS_RECONNECTED = "reconnected",
SL.helpers.StreamEditor.STATUS_RECONNECT_FAILED = "reconnect_failed",
SL.helpers.StreamEditor.STATUS_DISCONNECTED = "disconnected",
SL.helpers.StreamEditor.singleton = function() {
    return this._instance || (this._instance = new SL.helpers.StreamEditor({
        deckID: SLConfig.deck.id,
        slideID: SL.util.deck.getSlideID(Reveal.getCurrentSlide())
    })), this._instance
},
SL("helpers").StreamLive = Class.extend({
    init: function(t) {
        this.options = $.extend({
            reveal: window.Reveal,
            showErrors: !0,
            subscriber: !0,
            publisher: !1,
            publisherID: Date.now() + "-" + Math.round(1e6 * Math.random()),
            deckID: SL.current_deck.get("id")
        }, t), this.ready = new signals.Signal, this.stateChanged = new signals.Signal, this.statusChanged = new signals.Signal, this.subscribersChanged = new signals.Signal, this.socketIsDisconnected = !1, this.debugMode = !!SL.util.getQuery().debug
    },
    connect: function() {
        this.options.publisher ? this.setupPublisher() : this.setupSubscriber()
    },
    setupPublisher: function() {
        this.publish = this.publish.bind(this), this.publishable = !0, this.options.reveal.addEventListener("slidechanged", this.publish), this.options.reveal.addEventListener("fragmentshown", this.publish), this.options.reveal.addEventListener("fragmenthidden", this.publish), this.options.reveal.addEventListener("overviewshown", this.publish), this.options.reveal.addEventListener("overviewhidden", this.publish), this.options.reveal.addEventListener("paused", this.publish), this.options.reveal.addEventListener("resumed", this.publish), $.ajax({
            url: "/api/v1/decks/" + this.options.deckID + "/stream.json",
            type: "GET",
            context: this
        }).done(function(t) {
            this.log("found existing stream"), this.setState(JSON.parse(t.state), !0), this.setupSocket(), this.ready.dispatch()
        }).error(function() {
            this.log("no existing stream, publishing state"), this.publish(function() {
                this.setupSocket(), this.ready.dispatch()
            }.bind(this))
        })
    },
    setupSubscriber: function() {
        $.ajax({
            url: "/api/v1/decks/" + this.options.deckID + "/stream.json",
            type: "GET",
            context: this
        }).done(function(t) {
            this.log("found existing stream"), this.setStatus(SL.helpers.StreamLive.STATUS_NONE), this.setState(JSON.parse(t.state), !0), this.setupSocket(), this.ready.dispatch()
        }).error(function() {
            this.retryStartTime = Date.now(), this.setStatus(SL.helpers.StreamLive.STATUS_WAITING_FOR_PUBLISHER), this.log("no existing stream, retrying in " + SL.helpers.StreamLive.CONNECTION_RETRY_INTERVAL / 1e3 + "s"), setTimeout(this.setupSubscriber.bind(this), SL.helpers.StreamLive.CONNECTION_RETRY_INTERVAL)
        })
    },
    setupSocket: function() {
        if (this.options.subscriber) {
            var t = SL.config.STREAM_ENGINE_HOST + "/" + SL.config.STREAM_ENGINE_LIVE_NAMESPACE;
            this.log("socket attempting to connect to", t), this.socket = io.connect(t, {
                reconnectionDelayMax: 1e4
            }), this.socket.on("connect", this.onSocketConnected.bind(this)), this.socket.on("connect_error", this.onSocketDisconnected.bind(this)), this.socket.on("disconnect", this.onSocketDisconnected.bind(this)), this.socket.on("reconnect_attempt", this.onSocketReconnectAttempt.bind(this)), this.socket.on("reconnect_failed", this.onSocketReconnectFailed.bind(this)), this.socket.on("message", this.onSocketStateMessage.bind(this)), this.socket.on("subscribers", this.onSocketSubscribersMessage.bind(this))
        }
    },
    publish: function(t, e) {
        if (this.publishable) {
            var i = this.options.reveal.getState();
            if (i.publisher_id = this.options.publisherID, i = $.extend(i, e), this.socketIsDisconnected === !0) return this.publishAfterReconnect = !0, void this.log("publish stalled while disconnected");
            this.log("publish", i.publisher_id), $.ajax({
                url: "/api/v1/decks/" + this.options.deckID + "/stream.json",
                type: "PUT",
                data: {
                    state: JSON.stringify(i)
                },
                success: t
            })
        }
    },
    log: function() {
        if (this.debugMode && "function" == typeof console.log.apply) {
            var t = "Stream (" + (this.options.publisher ? "publisher" : "subscriber") + "):",
                e = [t].concat(Array.prototype.slice.call(arguments));
            console.log.apply(console, e)
        }
    },
    setState: function(t, e) {
        this.publishable = !1, e && $(".reveal").addClass("no-transition"), this.options.reveal.setState(t), this.stateChanged.dispatch(t), setTimeout(function() {
            this.publishable = !0, e && $(".reveal").removeClass("no-transition")
        }.bind(this), 1)
    },
    setStatus: function(t) {
        this.status !== t && (this.status = t, this.statusChanged.dispatch(this.status))
    },
    getRetryStartTime: function() {
        return this.retryStartTime
    },
    isPublisher: function() {
        return this.options.publisher
    },
    showConnectionError: function() {
        this.disconnectTimeout = setTimeout(function() {
            this.connectionError || (this.connectionError = new SL.components.RetryNotification("Lost connection to server"), this.connectionError.startCountdown(0), this.connectionError.destroyed.add(function() {
                this.connectionError = null
            }.bind(this)), this.connectionError.retryClicked.add(function() {
                this.connectionError.startCountdown(0), this.socket.io.close(), this.socket.io.open()
            }.bind(this)))
        }.bind(this), 1e4)
    },
    hideConnectionError: function() {
        clearTimeout(this.disconnectTimeout), this.connectionError && this.connectionError.hide()
    },
    onSocketStateMessage: function(t) {
        try {
            var e = JSON.parse(t.data);
            e.publisher_id != this.options.publisherID && (this.log("sync", "from: " + e.publisher_id, "to: " + this.options.publisherID), this.setState(e))
        } catch (i) {
            this.log("unable to parse streamed deck state as JSON.")
        }
        this.setStatus(SL.helpers.StreamLive.STATUS_NONE)
    },
    onSocketSubscribersMessage: function(t) {
        this.subscribersChanged.dispatch(t.subscribers)
    },
    onSocketConnected: function() {
        this.log("socket connected"), this.socket.emit("subscribe", {
            deck_id: this.options.deckID,
            publisher: this.options.publisher
        }), this.socketIsDisconnected === !0 && (this.socketIsDisconnected = !1, this.log("socket connection regained"), this.setStatus(SL.helpers.StreamLive.STATUS_NONE), this.publishAfterReconnect === !0 && (this.publishAfterReconnect = !1, this.log("publishing stalled state"), this.publish())), this.hideConnectionError()
    },
    onSocketReconnectAttempt: function() {
        this.connectionError && this.connectionError.startCountdown(this.socket.io.backoff.duration())
    },
    onSocketReconnectFailed: function() {
        this.connectionError && this.connectionError.disableCountdown()
    },
    onSocketDisconnected: function() {
        this.socketIsDisconnected === !1 && (this.socketIsDisconnected = !0, this.log("socket connection lost"), this.setStatus(SL.helpers.StreamLive.STATUS_CONNECTION_LOST), this.options.showErrors && this.showConnectionError())
    }
}),
SL.helpers.StreamLive.CONNECTION_RETRY_INTERVAL = 2e4,
SL.helpers.StreamLive.STATUS_NONE = "",
SL.helpers.StreamLive.STATUS_CONNECTION_LOST = "connection_lost",
SL.helpers.StreamLive.STATUS_WAITING_FOR_PUBLISHER = "waiting_for_publisher",
SL.helpers.ThemeController = {
    paint: function(t, e) {
        e = e || {};
        var i = $(".reveal-viewport");
        if (0 === i.length || "undefined" == typeof window.Reveal) return !1;
        if (this.cleanup(), i.addClass("theme-font-" + t.get("font")), i.addClass("theme-color-" + t.get("color")), Reveal.configure($.extend({
                center: t.get("center"),
                rolling_links: t.get("rolling_links"),
                transition: t.get("transition"),
                backgroundTransition: t.get("background_transition")
            }, e)), t.get("html")) {
            var n = $("#theme-html-output");
            n.length ? n.html(t.get("html")) : $(".reveal").append('<div id="theme-html-output">' + t.get("html") + "</div>")
        } else $("#theme-html-output").remove();
        if ("string" == typeof e.globalCSS)
            if (e.globalCSS.length) {
                var s = $("#global-css-output");
                s.length ? s.html(e.globalCSS) : $("head").append('<style id="global-css-output">' + e.globalCSS + "</style>")
            } else $("#global-css-output").remove();
        if (t.get("css")) {
            var o = $("#theme-css-output");
            o.length ? o.html(t.get("css")) : $("head").append('<style id="theme-css-output">' + t.get("css") + "</style>")
        } else $("#theme-css-output").remove();
        if (e.js !== !1)
            if (t.get("js")) {
                var a = $("#theme-js-output");
                a.text() !== t.get("js") && (a.remove(), $("body").append('<script id="theme-js-output">' + t.get("js") + "</script>"))
            } else $("#theme-js-output").remove();
        SL.util.deck.sortInjectedStyles()/*, SL.fonts.loadDeckFont(t.get("font"))*/
    },
    cleanup: function() {
        var t = $(".reveal-viewport"),
            e = $(".reveal");
        t.attr("class", t.attr("class").replace(/theme\-(font|color)\-([a-z0-9-])*/gi, "")), SL.config.THEME_TRANSITIONS.forEach(function(t) {
            e.removeClass(t.id)
        })
    }
},
SL.popup = {
    items: [],
    singletons: [],
    open: function(t, e) {
        for (var i, n = 0; n < SL.popup.singletons.length; n++)
            if (SL.popup.singletons[n].factory === t) {
                i = SL.popup.singletons[n].instance;
                break
            }
        return i || (i = new t(e), i.isSingleton() && SL.popup.singletons.push({
            factory: t,
            instance: i
        })), i.open(e), SL.popup.items.push({
            instance: i,
            factory: t
        }),
            $("html").addClass("popup-open"), i
    },
    openOne: function(t, e) {
        for (var i = 0; i < SL.popup.items.length; i++)
            if (t === SL.popup.items[i].factory) return SL.popup.items[i].instance;
        return this.open(t, e)
    },
    close: function(t) {
        SL.popup.items.concat().forEach(function(e) {
            t && t !== e.factory || e.instance.close(!0)
        })
    },
    isOpen: function(t) {
        for (var e = 0; e < SL.popup.items.length; e++)
            if (!t || t === SL.popup.items[e].factory) return !0;
        return !1
    },
    unregister: function(t) {
        let removedValue = '';
        for (var e = 0; e < SL.popup.items.length; e++) SL.popup.items[e].instance === t && (removedValue = SL.popup.items.splice(e, 1), e--);
        0 === SL.popup.items.length && $("html").removeClass("popup-open")
    }
},
SL("components.popup").Popup = Class.extend({
    WINDOW_PADDING: .01,
    // USE_ABSOLUTE_POSITIONING: SL.util.device.IS_PHONE || SL.util.device.IS_TABLET,
    init: function(t) {
        this.options = $.extend({
            title: "",
            titleItem: "",
            header: !0,
            bodycontent: !1,
            contentHTML: "",
            headerActions: [{
                label: "Close",
                className: "grey",
                callback: this.close.bind(this)
            }],
            width: "auto",
            height: "auto",
            singleton: !1,
            closeOnEscape: !0,
            closeOnClickOutside: !0
        }, t),
        this.options.additionalHeaderActions && (this.options.headerActions = this.options.additionalHeaderActions.concat(this.options.headerActions)),
            this.render(),
            this.bind(),
            this.layout()
    },
    render: function() {
        this.domElement = $('<div class="sl-popup" data-id="' + this.TYPE + '">'),
            this.domElement.appendTo(document.body),
            this.innerElement = $('<div class="sl-popup-inner">'),
            this.innerElement.appendTo(this.domElement),
        this.options.header && this.renderHeader(),
            this.bodyElement = $('<div class="sl-popup-body" id="slpop">'),
            this.bodyElement.appendTo(this.innerElement),
        this.options.bodycontent && this.renderBodyContent()
    },
    renderBodyContent: function() {
        if (this.options.contentHTML !== '') {
            $('#slpop').append(this.options.contentHTML)
        }
    },
    renderHeader: function() {
        this.headerElement = $(['<header class="sl-popup-header">', '<h3 class="sl-popup-header-title">' + this.options.title + "</h3>", "</header>"].join("")), this.headerElement.appendTo(this.innerElement), this.headerTitleElement = this.headerElement.find(".sl-popup-header-title"), this.options.titleItem && (this.headerTitleElement.append('<span class="sl-popup-header-title-item"></span>'), this.headerTitleElement.find(".sl-popup-header-title-item").text(this.options.titleItem)), this.options.headerActions && this.options.headerActions.length && (this.headerActionsElement = $('<div class="sl-popup-header-actions">').appendTo(this.headerElement), this.options.headerActions.forEach(function(t) {
            "divider" === t.type ? $('<div class="divider"></div>').appendTo(this.headerActionsElement) : $('<button class="button l ' + t.className + '">' + t.label + "</button>").appendTo(this.headerActionsElement).on("vclick", function(e) {
                t.callback(e), e.preventDefault()
            })
        }.bind(this)))
    },
    bind: function() {
        this.onKeyDown = this.onKeyDown.bind(this),
            this.onWindowResize = this.onWindowResize.bind(this),
            this.onBackgroundClicked = this.onBackgroundClicked.bind(this),
            this.domElement.on("vclick", this.onBackgroundClicked)
    },
    layout: function() {
        if (this.innerElement.css({
                width: this.options.width,
                height: this.options.height
            }), this.options.height) {
            var t = this.headerElement ? this.headerElement.outerHeight() : 0;
            this.headerElement && "number" == typeof this.options.height ? this.bodyElement.css("height", this.options.height - t) : this.bodyElement.css("height", "auto");
            var e = window.innerHeight;
            this.bodyElement.css("max-height", e - t - e * this.WINDOW_PADDING * 2)
        }
        if (this.headerElement) {
            var i = this.headerElement.width(),
                n = this.headerActionsElement.outerWidth();
            this.headerTitleElement.css("max-width", i - n - 30)
        }
        if (this.USE_ABSOLUTE_POSITIONING) {
            var s = $(window);
            this.domElement.css({
                position: "absolute",
                height: Math.max($(window).height(), $(document).height())
            }), this.innerElement.css({
                position: "absolute",
                transform: "none",
                top: s.scrollTop() + (s.height() - this.innerElement.outerHeight()) / 2,
                left: s.scrollLeft() + (s.width() - this.innerElement.outerWidth()) / 2,
                maxWidth: s.width() - window.innerWidth * this.WINDOW_PADDING * 2
            })
        }
    },
    open: function(t) {
        this.domElement.appendTo(document.body),
            clearTimeout(this.closeTimeout),
            this.closeTimeout = null, this.options = $.extend(this.options, t),
            SL.keyboard.keydown(this.onKeyDown),
            $(window).on("resize", this.onWindowResize),
            setTimeout(function() {
                this.domElement.addClass("visible")
            }.bind(this), 1)
    },
    close: function(t) {
        this.closeTimeout || (t ? this.closeConfirmed() : this.checkUnsavedChanges(this.closeConfirmed.bind(this)))
    },
    closeConfirmed: function() {
        SL.keyboard.release(this.onKeyDown), $(window).off("resize", this.onWindowResize), this.domElement.removeClass("visible"), SL.popup.unregister(this), this.closeTimeout = setTimeout(function() {
            this.domElement.detach(), this.isSingleton() || this.destroy()
        }.bind(this), 500)
    },
    checkUnsavedChanges: function(t) {
        t()
    },
    isSingleton: function() {
        return this.options.singleton
    },
    onBackgroundClicked: function(t) {
        $(t.target).is(this.domElement) && (this.options.closeOnClickOutside && this.close(), t.preventDefault())
    },
    onWindowResize: function() {
        this.layout()
    },
    onKeyDown: function(t) {
        return 27 === t.keyCode ? (this.options.closeOnEscape && this.close(), !1) : !0
    },
    destroy: function() {
        SL.popup.unregister(this), this.options = null, this.domElement.remove()
    }
}),
SL("components.popup").DeckOutdated = SL.components.popup.Popup.extend({
    TYPE: "deck-outdated",
    init: function(t) {
        this._super($.extend({
            title: "Newer version available",
            width: 500,
            closeOnClickOutside: !1,
            headerActions: [{
                label: "Ignore",
                className: "outline",
                callback: this.close.bind(this)
            }, {
                label: "Reload",
                className: "positive",
                callback: this.onReloadClicked.bind(this)
            }]
        }, t))
    },
    render: function() {
        this._super(), this.bodyElement.html(["<p>A more recent version of this presentation is available on the server. This can happen when the presentation is saved from another browser or device.</p>", "<p>We recommend reloading the page to get the latest version. If you're sure your local changes are the latest, please ignore this message.</p>"].join(""))
    },
    onReloadClicked: function() {
        window.location.reload()
    },
    destroy: function() {
        this._super()
    }
}),
SL("components.popup").EditHTML = SL.components.popup.Popup.extend({
    TYPE: "edit-html",
    init: function(t) {
        this._super($.extend({
            title: TWIG.popupEditHTML.title,
            width: 1200,
            height: 750,
            headerActions: [{
                label: TWIG.popupEditHTML.cancel,
                className: "outline",
                callback: this.close.bind(this)
            }, {
                label: TWIG.popupEditHTML.save,
                className: "positive",
                callback: this.saveAndClose.bind(this)
            }]
        }, t)),
            this.saved = new signals.Signal
    },
    render: function() {
        this._super(),
            this.bodyElement.html('<div id="ace-html" class="editor"></div>'),
        this.editor && "function" == typeof this.editor.destroy && (this.editor.destroy(), this.editor = null);
        try {
            this.editor = ace.edit('ace-html'),
                this.editor.setTheme('ace/theme/monokai'),
                this.editor.$blockScrolling = Infinity,
                this.editor.getSession().setMode('ace/mode/html')
        } catch (t) {
            console.log("An error occurred while initializing the Ace editor.")
        }
        this.editor.env.document.setValue(this.options.html), this.editor.focus()
    },
    saveAndClose: function() {
        this.saved.dispatch(this.getHTML()), this.close(!0)
    },
    checkUnsavedChanges: function(t) {
        this.getHTML() === this.options.html || this.cancelPrompt ? t() : (this.cancelPrompt = SL.prompt({
            title: "Discard unsaved changes?",
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Discard</h3>",
                selected: !0,
                className: "negative",
                callback: t
            }]
        }), this.cancelPrompt.destroyed.add(function() {
            this.cancelPrompt = null
        }.bind(this)))
    },
    getHTML: function() {
        return this.editor.env.document.getValue()
    },
    destroy: function() {
        this.editor && "function" == typeof this.editor.destroy && (this.editor.destroy(), this.editor = null), this.saved && (this.saved.dispose(), this.saved = null), this._super()
    }
}),
SL("components.popup").EditSlideHTML = SL.components.popup.EditHTML.extend({
    TYPE: "edit-slide-html",
    init: function(t) {
        SL.util.user.canUseCustomCSS() && (t.additionalHeaderActions = [{
            label: TWIG.popupEditHTML.slideClasses,
            className: "outline",
            callback: this.onSlideClassesClicked.bind(this)
        }, {
            type: "divider"
        }]), t.html = SL.util.html.indent(SL.editor.controllers.Serialize.getSlideAsString(t.slide, {
            inner: !0,
            lazy: !1,
            exclude: ".math-output"
        })), this._super(t)
    },
    readSlideClasses: function() {
        return this.options.slide.className.split(" ").filter(function(t) {
            return -1 === SL.config.RESERVED_SLIDE_CLASSES.indexOf(t)
        }).join(" ")
    },
    writeSlideClasses: function(t) {
        t = t || "", t = t.trim().replace(/\s{2,}/g, " ");
        var e = this.options.slide.className.split(" ").filter(function(t) {
            return -1 !== SL.config.RESERVED_SLIDE_CLASSES.indexOf(t)
        });
        e = e.concat(t.split(" ")), this.options.slide.className = e.join(" ")
    },
    onSlideClassesClicked: function(t) {
        var e = SL.prompt({
            anchor: t.currentTarget,
            title: "Slide classes",
            subtitle: "Specify class names which will be added to the slide wrapper. Useful for targeting from the CSS editor.",
            type: "input",
            confirmLabel: "Save",
            data: {
                value: this.readSlideClasses(),
                placeholder: "Classes...",
                width: 400,
                confirmBeforeDiscard: !0
            }
        });
        e.confirmed.add(function(t) {
            this.writeSlideClasses(t)
        }.bind(this))
    }
}),
SL("components.popup").InsertSnippet = SL.components.popup.Popup.extend({
    TYPE: "insert-snippet",
    init: function(t) {
        this._super($.extend({
            title: "Insert",
            titleItem: '"' + t.snippet.get("title") + '"',
            width: 500,
            headerActions: [{
                label: "Cancel",
                className: "outline",
                callback: this.close.bind(this)
            }, {
                label: "Insert",
                className: "positive",
                callback: this.insertAndClose.bind(this)
            }]
        }, t)), this.snippetInserted = new signals.Signal
    },
    render: function() {
        this._super(), this.variablesElement = $('<div class="variables sl-form"></div>'), this.variablesElement.appendTo(this.bodyElement), this.variables = this.options.snippet.getTemplateVariables(), this.variables.forEach(function(t) {
            var e = $(['<div class="unit">', "<label>" + t.label + "</label>", '<input type="text" value="' + t.defaultValue + '">', "</div>"].join("")).appendTo(this.variablesElement);
            e.find("input").data("variable", t)
        }.bind(this)), this.variablesElement.find("input").first().focus().select()
    },
    insertAndClose: function() {
        this.variablesElement.find("input").each(function(t, e) {
            e = $(e), e.data("variable").value = e.val()
        }), this.snippetInserted.dispatch(this.options.snippet.templatize(this.variables)), this.close()
    },
    onKeyDown: function(t) {
        return 13 === t.keyCode ? (this.insertAndClose(), !1) : this._super(t)
    },
    destroy: function() {
        this.snippetInserted.dispose(), this._super()
    }
}),
SL("components.popup").Revision = SL.components.popup.Popup.extend({
    TYPE: "revision",
    init: function(t) {
        this._super($.extend({
            revisionURL: null,
            revisionTimeAgo: null,
            title: "Revision",
            titleItem: "from " + t.revisionTimeAgo,
            width: 900,
            height: 700,
            headerActions: [{
                label: "Open in new tab",
                className: "outline",
                callback: this.onOpenExternalClicked.bind(this)
            }, {
                label: "Restore",
                className: "grey",
                callback: this.onRestoreClicked.bind(this)
            }, {
                label: "Close",
                className: "grey",
                callback: this.close.bind(this)
            }]
        }, t)), this.restoreRequested = new signals.Signal, this.externalRequested = new signals.Signal
    },
    render: function() {
        this._super(), this.bodyElement.html(['<div class="spinner centered"></div>', '<div class="deck"></div>'].join("")), this.bodyElement.addClass("loading"), SL.util.html.generateSpinners();
        var t = $("<iframe>", {
            src: this.options.revisionURL,
            load: function() {
                this.bodyElement.removeClass("loading")
            }.bind(this)
        });
        t.appendTo(this.bodyElement.find(".deck"))
    },
    onRestoreClicked: function(t) {
        this.restoreRequested.dispatch(t)
    },
    onOpenExternalClicked: function(t) {
        this.externalRequested.dispatch(t)
    },
    destroy: function() {
        this.bodyElement.find(".deck iframe").attr("src", ""), this.bodyElement.find(".deck").empty(), this.restoreRequested.dispose(), this.externalRequested.dispose(), this._super()
    }
}),
SL("components.popup").SessionExpired = SL.components.popup.Popup.extend({
    TYPE: "session-expired",
    init: function(t) {
        this._super($.extend({
            title:  TWIG.title_session,
            width: 500,
            closeOnEscape: !1,
            closeOnClickOutside: !1,
            headerActions: [{
                //     label: "Ignore",
                //     className: "outline negative",
                //     callback: this.close.bind(this)
                // }, {
                label: "Retry",
                className: "positive",
                callback: this.onRetryClicked.bind(this)
            }]
        }, t))
    },
    render: function() {
        this._super(), this.bodyElement.html(["<p>" +TWIG.message_session+ "</p>", '<a href="' + TWIG.logout+ '" class="button pull-right">Login</a>'].join(""))
    },
    onRetryClicked: function() {
        SL.editor && 1 === SL.editor.Editor.VERSION ? SL.view.checkLogin(!0) : SL.session.check()
    },
    destroy: function() {
        this._super()
    }
}),
SL("components.collab").Collaboration = Class.extend({
    init: function(t) {
        this.options = $.extend({
            container: document.body,
            editor: !1,
            fixed: !1,
            coverPage: !1
        }, t), this.loaded = new signals.Signal, this.enabled = new signals.Signal, this.expanded = new signals.Signal, this.collapsed = new signals.Signal, this.flags = {
            expanded: !1,
            enabled: !1,
            connected: !1
        }, this.commentsWhileHidden = [], this.commentsWhileCollapsed = [], this.bind(), this.render(), this.setEnabled(!!SLConfig.deck.collaborative), this.options.fixed && (SL.util.skipCSSTransitions($(this.domElement), 1), this.domElement.addClass("fixed"), this.expand())
    },
    bind: function() {
        this.onKeyDown = this.onKeyDown.bind(this), this.onSlideChanged = this.onSlideChanged.bind(this), this.onStreamMessage = this.onStreamMessage.bind(this), this.onStreamStatusChanged = this.onStreamStatusChanged.bind(this), this.onSocketReconnecting = this.onSocketReconnecting.bind(this);
        var t = $(".reveal .slides section:not(.stack)").length,
            e = 1e3 * Math.ceil(t / 4);
        this.onStreamDeckContentChanged = $.throttle(this.onStreamDeckContentChanged, e)
    },
    render: function() {
        this.domElement = $('<div class="sl-collab loading">'), this.domElement.appendTo(this.options.container), this.options.coverPage && !this.options.fixed && (this.coverElement = $('<div class="sl-collab-cover">'), this.coverElement.on("vclick", this.collapse.bind(this)), this.coverElement.appendTo(this.domElement)), this.innerElement = $('<div class="sl-collab-inner">'), this.innerElement.appendTo(this.domElement), this.bodyElement = $('<div class="sl-collab-body">'), this.bodyElement.appendTo(this.innerElement), this.overlayElement = $('<div class="sl-collab-overlay">'), this.overlayElement.appendTo(this.innerElement), this.overlayContent = $('<div class="sl-collab-overlay-inner">'), this.overlayContent.appendTo(this.overlayElement), this.menu = new SL.components.collab.Menu(this), this.menu.appendTo(this.domElement)
    },
    load: function() {
        this.usersCollection || (this.showLoadingOverlay(), this.usersCollection = new SL.collections.collab.DeckUsers, this.usersCollection.load().then(this.afterLoad.bind(this), function() {
            this.usersCollection = null, this.showErrorOverlay("Failed to load collaborators", this.load.bind(this))
        }.bind(this)))
    },
    afterLoad: function() {
        return this.usersCollection.isEmpty() ? void this.showErrorOverlay("No collaborators found for this deck.") : (this.usersCollection.replaced.add(function() {
            this.cachedCurrentDeckUser = null
        }.bind(this)), void this.connect())
    },
    connect: function() {
        return this.hasBoundStreamEvents || (this.hasBoundStreamEvents = !0, SL.helpers.StreamEditor.singleton().statusChanged.add(this.onStreamStatusChanged), SL.helpers.StreamEditor.singleton().messageReceived.add(this.onStreamMessage), SL.helpers.StreamEditor.singleton().reconnecting.add(this.onSocketReconnecting)), this.isConnected() ? void 0 : (this.showLoadingOverlay(), SL.helpers.StreamEditor.singleton().connect().then(function() {}, function() {
            this.onSocketConnectionFailed()
        }.bind(this)))
    },
    afterConnect: function() {
        this.isConnected() || (this.flags.connected = !0, this.renderContent(), SL.activity.register(SL.config.COLLABORATION_IDLE_TIMEOUT, this.onUserActive.bind(this), this.onUserInactive.bind(this)), SL.visibility.changed.add(this.onVisibilityChanged.bind(this)), this.hideOverlay(), this.isEnabled() ? this.comments.focus() : (this.setEnabled(!0), this.users.showInvitePrompt(this.menu.getPrimaryButton()), this.users.inviteSent.addOnce(this.expand.bind(this))), this.handover && this.handover.refresh(), this.isInEditor() && this.currentUserIsEditing() ? this.reloadCurrentUser().then(function() {
            this.currentUserIsEditing() ? this.finishLoading() : this.redirectToReview()
        }.bind(this), function() {
            this.finishLoading()
        }.bind(this)) : this.isInEditor() && !this.currentUserIsEditing() ? this.redirectToReview() : this.finishLoading())
    },
    finishLoading: function() {
        this.domElement.removeClass("loading"), this.loaded.dispatch()
    },
    reload: function() {
        this.isConnected() && (this.showLoadingOverlay("Reloading..."), this.usersCollection.load().then(function() {
            this.redirectToReviewUnlessEditor() === !1 && (this.users.renderUsers(), SL.helpers.StreamEditor.singleton().emit("broadcast-all-user-states"), this.comments && this.comments.reload(), this.handover && this.handover.refresh(), this.hideOverlay())
        }.bind(this), function() {
            this.showErrorOverlay("Failed to load collaborators", this.reload.bind(this))
        }.bind(this)))
    },
    reloadCurrentUser: function() {
        return new Promise(function(t, e) {
            $.ajax({
                type: "GET",
                url: SL.config.AJAX_DECKUSER_READ(SL.current_deck.get("id"), SL.current_user.get("id")),
                context: this
            }).done(function(e) {
                var i = this.usersCollection.getByProperties({
                    user_id: e.user_id
                });
                i && i.setAll(e), t()
            }).fail(e)
        }.bind(this))
    },
    renderContent: function() {
        this.users = new SL.components.collab.Users(this, {
            users: this.usersCollection
        }), this.users.appendTo(this.menu.innerElement), this.comments = new SL.components.collab.Comments(this, {
            users: this.usersCollection
        }), this.comments.appendTo(this.bodyElement), this.notifications = new SL.components.collab.Notifications(this, {
            users: this.usersCollection
        }), this.notifications.appendTo(this.domElement), this.isInEditor() || (this.handover = new SL.components.collab.Handover(this, {
            users: this.usersCollection
        }), this.handover.appendTo(this.options.container))
    },
    expand: function() {
        this.flags.expanded = !0, this.domElement.addClass("expanded"), SL.keyboard.keydown(this.onKeyDown), this.expanded.dispatch()
    },
    collapse: function() {
        this.options.fixed || (this.commentsWhileCollapsed.length = 0, this.flags.expanded = !1, this.domElement.removeClass("expanded"), SL.keyboard.release(this.onKeyDown), this.collapsed.dispatch())
    },
    toggle: function() {
        this.isExpanded() ? this.collapse() : this.expand()
    },
    isExpanded: function() {
        return this.flags.expanded
    },
    setEnabled: function(t) {
        this.flags.enabled = t, this.domElement.toggleClass("enabled", t), t ? (Reveal.addEventListener("slidechanged", this.onSlideChanged), this.enabled.dispatch()) : Reveal.removeEventListener("slidechanged", this.onSlideChanged)
    },
    isEnabled: function() {
        return this.flags.enabled
    },
    isConnected: function() {
        return this.flags.connected
    },
    makeDeckCollaborative: function() {
        this.isEnabled() || $.ajax({
            type: "POST",
            url: SL.config.AJAX_MAKE_DECK_COLLABORATIVE(SL.current_deck.get("id")),
            context: this
        }).done(function() {
            SLConfig.deck.collaborative = !0, this.load()
        }).fail(function() {
            this.showErrorOverlay("Failed to enable collaboration", this.makeDeckCollaborative.bind(this))
        })
    },
    showHandoverRequestReceived: function(t) {
        var e = "handover-" + t.get("user_id"),
            i = $(["<div>", "<p><strong>" + t.get("username") + "</strong> would like to edit but only on person can edit at a time.</p>", '<button class="button half-width approve-button grey">Let them edit</button>', '<button class="button half-width deny-button outline">Dismiss</button>', "</div>"].join(""));
        i.find(".approve-button").on("vclick", function() {
            this.becomeEditor(t), this.notifications.hide(e)
        }.bind(this)), i.find(".deny-button").on("vclick", function() {
            SL.helpers.StreamEditor.singleton().broadcast({
                type: "collaboration:handover-denied",
                user_id: t.get("user_id"),
                denied_by_user_id: SL.current_user.get("id")
            }), this.notifications.hide(e)
        }.bind(this)), this.notifications.show(i, {
            id: e,
            optional: !1,
            sender: t
        })
    },
    showHandoverRequestPending: function(t) {
        var e = "handover-pending",
            i = $(["<div>", "<p>You have asked to edit this deck. Waiting to hear back from <strong>" + t.getDisplayName() + "</strong>...</p>", '<button class="button outline cancel-button">Cancel</button>', "</div>"].join(""));
        i.find(".cancel-button").on("vclick", function(t) {
            t.preventDefault(), SL.helpers.StreamEditor.singleton().broadcast({
                type: "collaboration:handover-request-canceled",
                user_id: SL.current_user.get("id")
            }), this.notifications.hide(e)
        }.bind(this)), this.notifications.show(i, {
            id: e,
            optional: !1,
            icon: "i-question-mark"
        })
    },
    showLoadingOverlay: function(t) {
        t = t || "Loading...", this.overlayElement.addClass("visible"), this.overlayContent.empty().html('<p class="message">' + t + "</p>"), this.flashOverlay()
    },
    showErrorOverlay: function(t, e) {
        this.overlayElement.addClass("visible"), this.overlayContent.empty().html(['<div class="exclamation">!</div>', '<p class="message">' + t + "</p>", '<button class="button outline">Try again</button>'].join("")), this.overlayContent.find("button").on("vclick", e), this.flashOverlay()
    },
    flashOverlay: function() {
        clearTimeout(this.flashOverlayTimeout), this.overlayContent.addClass("flash"), this.flashOverlayTimeout = setTimeout(function() {
            this.overlayContent.removeClass("flash")
        }.bind(this), 1e3)
    },
    hideOverlay: function() {
        this.overlayElement.removeClass("visible")
    },
    updatePageTitle: function() {
        var t = "";
        this.commentsWhileHidden.length && (t += "(" + this.commentsWhileHidden.length + ") "), t += this.isInEditor() ? "Edit: " : "Review: ", t += SL.current_deck.get("title"), document.title = t
    },
    currentUserIsEditing: function() {
        var t = this.getCurrentDeckUser();
        return !(!t || !t.isEditing())
    },
    getCurrentDeckUser: function() {
        return !this.cachedCurrentDeckUser && this.usersCollection && (this.cachedCurrentDeckUser = this.usersCollection.getByUserID(SL.current_user.get("id"))), this.cachedCurrentDeckUser
    },
    getCollapsedWidth: function() {
        return 60
    },
    becomeEditor: function(t) {
        return t = t || this.getCurrentDeckUser(), new Promise(function(e, i) {
            $.ajax({
                type: "POST",
                url: SL.config.AJAX_DECKUSER_BECOME_EDITOR(SL.current_deck.get("id"), t.get("user_id")),
                context: this
            }).done(function() {
                this.usersCollection.setEditing(t.get("user_id")), e(), this.currentUserIsEditing() ? this.redirectToEdit() : this.redirectToReview()
            }).fail(function() {
                SL.notify("Failed to change editors"), i()
            })
        }.bind(this))
    },
    isInEditor: function() {
        return this.options.editor
    },
    redirectToEdit: function() {
        this.isInEditor() || (SL.helpers.PageLoader.show({
            message: "Loading"
        }), window.location = SL.routes.DECK_EDIT(SL.current_deck.get("user").username, SL.current_deck.get("slug")))
    },
    redirectToReview: function(t) {
        this.isInEditor() && (SL.helpers.PageLoader.show({
            message: t || "Loading"
        }),
            SL.view.redirect(SL.routes.DECK_REVIEW(SL.current_deck.get("user").username, SL.current_deck.get("slug")), !0))
    },
    redirectToReviewUnlessEditor: function() {
        if (this.isInEditor() && !this.currentUserIsEditing()) {
            var t = 5,
                e = "Someone else started editing.<br>Redirecting in " + t + " seconds...";
            return SL.helpers.PageLoader.show({
                message: e
            }), setTimeout(function() {
                this.redirectToReview(e)
            }.bind(this), 1e3 * t), !0
        }
        return !1
    },
    onKeyDown: function(t) {
        return 27 === t.keyCode ? (this.collapse(), !1) : !0
    },
    onSlideChanged: function(t) {
        var e = Reveal.getCurrentSlide().getAttribute("data-id");
        e && SL.helpers.StreamEditor.singleton().emit("slide-change", e), this.comments && this.isExpanded() && this.comments.onSlideChanged(t), this.users && this.users.layout()
    },
    onStreamStatusChanged: function(t) {
        t === SL.helpers.StreamEditor.STATUS_CONNECTED ? this.onSocketConnected() : t === SL.helpers.StreamEditor.STATUS_DISCONNECTED ? this.onSocketDisconnected() : t === SL.helpers.StreamEditor.STATUS_RECONNECT_FAILED ? this.onSocketReconnectFailed() : t === SL.helpers.StreamEditor.STATUS_RECONNECTED && this.onSocketReconnected()
    },
    onStreamMessage: function(t) {
        if (t) {
            var e = t.type.split(":")[0],
                i = t.type.split(":")[1];
            "collaboration" === e && ("comment-added" === i ? this.onStreamCommentAdded(t) : "comment-updated" === i ? this.onStreamCommentUpdated(t) : "comment-removed" === i ? this.onStreamCommentRemoved(t) : "user-typing" === i ? this.onStreamUserTyping(t) : "user-typing-stopped" === i ? this.onStreamUserTypingStopped(t) : "user-added" === i ? this.onStreamUserAdded(t) : "user-updated" === i ? this.onStreamUserUpdated(t) : "user-removed" === i ? this.onStreamUserRemoved(t) : "presence-changed" === i ? this.onStreamPresenceChanged(t) : "editor-changed" === i ? this.onStreamEditorChanged(t) : "handover-requested" === i ? this.onStreamHandoverRequested(t) : "handover-request-canceled" === i ? this.onStreamHandoverRequestCanceled(t) : "handover-denied" === i ? this.onStreamHandoverDenied(t) : "deck-content-changed" === i ? this.onStreamDeckContentChanged(t) : "deck-settings-changed" === i && this.onStreamDeckSettingsChanged(t)), this.redirectToReviewUnlessEditor()
        }
    },
    onStreamCommentAdded: function(t) {
        this.comments.addCommentFromStream(t.comment) && (this.isExpanded() || (this.commentsWhileCollapsed.push(t.comment.id), this.menu.setUnreadComments(this.commentsWhileCollapsed.length)), SL.visibility.isHidden() && (this.commentsWhileHidden.push(t.comment.id), this.updatePageTitle()))
    },
    onStreamCommentUpdated: function(t) {
        this.comments.updateCommentFromStream(t.comment)
    },
    onStreamCommentRemoved: function(t) {
        this.comments.removeCommentFromStream(t.comment.id);
        var e = this.commentsWhileCollapsed.indexOf(t.comment.id); - 1 !== e && (this.commentsWhileCollapsed.splice(e, 1), this.menu.setUnreadComments(this.commentsWhileCollapsed.length))
    },
    onStreamUserTyping: function(t) {
        var e = this.usersCollection.getByProperties({
            user_id: t.user_id
        });
        e && (e.set("typing", !0), this.comments.refreshTypingIndicators(), clearTimeout(e.typingTimeout), e.typingTimeout = setTimeout(function() {
            e.set("typing", !1), this.comments.refreshTypingIndicators()
        }.bind(this), SL.config.COLLABORATION_RESET_WRITING_TIMEOUT))
    },
    onStreamUserTypingStopped: function(t) {
        var e = this.usersCollection.getByProperties({
            user_id: t.user_id
        });
        e && (e.set("typing", !1), this.comments.refreshTypingIndicators(), clearTimeout(e.typingTimeout))
    },
    onStreamUserAdded: function(t) {
        this.users.addUserFromStream(t.user)
    },
    onStreamUserUpdated: function(t) {
        var e = this.usersCollection.getByProperties({
            user_id: t.user.user_id
        });
        if (e) {
            var i = e.toJSON();
            e.setAll(t.user), i.active || e.get("active") !== !0 || this.users.renderUser(e), e.get("user_id") === SL.current_user.get("id") && (i.role !== e.get("role") && this.reload(), this.handover && this.handover.refresh())
        }
    },
    onStreamUserRemoved: function(t) {
        if (t.user.user_id)
            if (t.user.user_id === SL.current_user.get("id")) {
                var e = 5,
                    i = "You were removed from this deck.<br>Redirecting in " + e + " seconds...";
                SL.helpers.PageLoader.show({
                    message: i
                }), setTimeout(function() {
                    window.location = SL.routes.USER(SL.current_user.get("username"))
                }.bind(this), 1e3 * e)
            } else this.users.removeUserFromStream(t.user.user_id)
    },
    onStreamPresenceChanged: function(t) {
        var e = this.usersCollection.getByProperties({
            user_id: t.user_id
        });
        e && (t.status && e.set("status", t.status), t.slide_id && e.set("slide_id", t.slide_id), this.users.refreshPresence(e), e.isOnline() === !1 && (e.get("typing") && (e.set("typing", !1), this.comments.refreshTypingIndicators()), this.notifications.hide("handover-" + t.user_id), e.isEditing() && this.notifications.hide("handover-pending") && this.becomeEditor()), this.handover && this.handover.refresh())
    },
    onStreamEditorChanged: function(t) {
        t.user.user_id && (this.usersCollection.setEditing(t.user.user_id), this.currentUserIsEditing() ? this.redirectToEdit() : this.redirectToReview())
    },
    onStreamHandoverRequested: function(t) {
        if (this.currentUserIsEditing()) {
            var e = this.usersCollection.getByProperties({
                user_id: t.user_id
            });
            e && this.showHandoverRequestReceived(e)
        }
    },
    onStreamHandoverRequestCanceled: function(t) {
        this.notifications.hide("handover-" + t.user_id)
    },
    onStreamHandoverDenied: function(t) {
        if (SL.current_user.get("id") === t.user_id) {
            var e = this.usersCollection.getByProperties({
                user_id: t.denied_by_user_id
            });
            e && (this.notifications.hide("handover-pending"), this.notifications.show("<strong>" + e.getDisplayName() + "</strong> turned down your request to edit. Try again later.", {
                sender: e
            }))
        }
    },
    onStreamDeckContentChanged: function() {
        this.isInEditor() || (this.reloadDeckContentXHR && this.reloadDeckContentXHR.abort(), this.reloadDeckContentXHR = $.ajax({
            url: SL.config.AJAX_GET_DECK_DATA(SL.current_deck.get("id")),
            type: "GET",
            context: this
        }).done(function(t) {
            var e = t.deck.data;
            this.isInEditor() ? SL.editor.controllers.Markup.replaceHTML(e) : SL.util.deck.replaceHTML(e), this.handover.refreshSlideNumbers(), this.comments.refreshSlideNumbers()
        }.bind(this)).always(function() {
            this.reloadDeckContentXHR = null
        }.bind(this)))
    },
    onStreamDeckSettingsChanged: function() {
        this.isInEditor() || (this.reloadDeckSettingsXHR && this.reloadDeckSettingsXHR.abort(), this.reloadDeckSettingsXHR = $.ajax({
            url: SL.config.AJAX_GET_DECK(SL.current_deck.get("id")),
            type: "GET",
            context: this
        }).done(function(t) {
            var e = JSON.parse(JSON.stringify(SLConfig.deck));
            for (var i in t) "object" == typeof t[i] && delete t[i];
            $.extend(SLConfig.deck, t);
            var n = SL.models.Theme.fromDeck(SLConfig.deck);
            SL.helpers.ThemeController.paint(n, {
                center: !1
            }), Reveal.configure({
                rtl: SLConfig.deck.rtl,
                loop: SLConfig.deck.should_loop,
                slideNumber: SLConfig.deck.slide_number
            }), SLConfig.deck.theme_id !== e.theme_id && console.warn("Theme changed!"), SLConfig.deck.slug !== e.slug && window.history && "function" == typeof window.history.replaceState && window.history.replaceState(null, SLConfig.deck.title, SL.routes.DECK_REVIEW(SLConfig.deck.user.username, SLConfig.deck.slug) + window.location.hash), SLConfig.deck.title !== e.title && this.updatePageTitle()
        }.bind(this)).always(function() {
            this.reloadDeckSettingsXHR = null
        }.bind(this)))
    },
    onUserActive: function() {
        SL.helpers.StreamEditor.singleton().emit("active"), this.notifications.hide("editor-is-idle"), this.notifications.release(), $.post(SL.config.AJAX_DECKUSER_UPDATE_LAST_SEEN_AT(SL.current_deck.get("id")))
    },
    onUserInactive: function() {
        SL.helpers.StreamEditor.singleton().emit("idle"), this.currentUserIsEditing() && this.usersCollection.hasMoreThanOnePresentEditor() && (this.notifications.show("You're idle. While away, collaborators are allowed to take over editing.", {
            id: "editor-is-idle",
            optional: !1,
            icon: "i-clock"
        }), this.notifications.hold())
    },
    onVisibilityChanged: function() {
        SL.visibility.isVisible() && (this.commentsWhileHidden.length = 0, this.updatePageTitle())
    },
    onSocketConnectionFailed: function() {
        this.connectionError || (this.connectionError = new SL.components.RetryNotification('<strong>Sorry, we\u2019re having trouble connecting.</strong><br>If the problem persists, contact us <a href="http://help.slides.com" target="_blank">here</a>.', {
            type: "negative"
        }), this.connectionError.startCountdown(0), this.connectionError.destroyed.add(function() {
            this.connectionError = null
        }.bind(this)), this.connectionError.retryClicked.add(function() {
            this.connectionError.startCountdown(0), SL.helpers.StreamEditor.singleton().connect().then(SL.util.noop, SL.util.noop)
        }.bind(this)))
    },
    onSocketConnected: function() {
        clearTimeout(this.disconnectTimeout), this.connectionError && this.connectionError.destroy(), this.connectionError && this.connectionError.hide(), this.domElement.removeClass("disconnected"), this.isConnected() ? this.reload() : this.afterConnect()
    },
    onSocketDisconnected: function() {
        clearTimeout(this.disconnectTimeout), this.disconnectTimeout = setTimeout(function() {
            this.domElement.addClass("disconnected"), this.comments.blur(), this.users.dismissPrompts(), this.connectionError || (this.connectionError = new SL.components.RetryNotification("Lost connection to server", {
                type: "negative"
            }), this.connectionError.startCountdown(0), this.connectionError.destroyed.add(function() {
                this.connectionError = null
            }.bind(this)), this.connectionError.retryClicked.add(function() {
                this.connectionError.startCountdown(0), SL.helpers.StreamEditor.singleton().connect().then(SL.util.noop, SL.util.noop)
            }.bind(this)))
        }.bind(this), 6e3)
    },
    onSocketReconnecting: function(t) {
        this.connectionError && this.connectionError.startCountdown(t)
    },
    onSocketReconnectFailed: function() {
        this.connectionError && this.connectionError.disableCountdown()
    },
    onSocketReconnected: function() {
        clearTimeout(this.disconnectTimeout)
    },
    destroy: function() {
        this.menu && this.menu.destroy(), this.users && this.users.destroy(), this.comments && this.comments.destroy(), this.handover && this.handover.destroy(), this.options = null, this.domElement.remove()
    }
}),
SL("components.collab").CommentThread = Class.extend({
    init: function(t, e) {
        this.id = t, this.options = e, this.comments = new SL.collections.collab.Comments, this.strings = {
            loadMoreComments: "Load older comments",
            loadingMoreComments: "Loading..."
        }, this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="sl-collab-comment-thread empty"></div>'), this.domElement.attr("data-thread-id", this.id), this.domElement.data("thread", this), this.loadMoreButton = $('<button class="load-more-button">' + this.strings.loadMoreComments + "</button>"), this.loadMoreButton.on("vclick", this.onLoadMoreClicked.bind(this)), this.loadMoreButton.appendTo(this.domElement)
    },
    renderComment: function(t, e) {
        if (e = e || {}, !t.rendered) {
            t.rendered = !0;
            var i = this.options.users.getByUserID(t.get("user_id"));
            "undefined" == typeof i && (i = new SL.models.collab.DeckUser({
                username: "unknown"
            }));
            var n = moment(t.get("created_at")),
                s = n.format("h:mm A"),
                o = n.format("MMM Do") + " at " + n.format("h:mm:ss A"),
                a = $(['<div class="sl-collab-comment">', '<div class="comment-sidebar">', '<div class="avatar" style="background-image: url(\'' + i.get("thumbnail_url") + "')\" />", "</div>", '<div class="comment-body">', '<span class="author">' + (i ? i.get("username") : "N/A") + "</span>", '<div class="meta">', '<span class="meta-time" data-tooltip="' + o + '">' + s + "</span>", "</div>", '<p class="message"></p>', "</div>", "</div>"].join(""));
            a.data("model", t), this.refreshComment(a), this.refreshSlideNumber(a), SL.util.device.IS_PHONE || SL.util.device.IS_TABLET || this.renderCommentOptions(a, t), t.stateChanged.add(this.onCommentStateChanged.bind(this, a)), e.prepend ? this.domElement.prepend(a) : this.domElement.append(a), this.checkOverflow()
        }
    },
    renderCommentOptions: function(t, e) {
        var i = this.getCommentPrivileges(e);
        if (i.canDelete || i.canEdit) {
            var n = $('<button class="button options-button icon disable-when-disconnected"></button>').appendTo(t.find(".comment-sidebar"));
            i.canDelete && i.canEdit ? (n.addClass("i-cog"), n.on("click", this.onCommentOptionsClicked.bind(this, t))) : i.canDelete ? (n.addClass("i-trash-stroke"), n.on("click", this.onDeleteComment.bind(this, t))) : i.canEdit && (n.addClass("i-i-pen-alt2"), n.on("click", this.onEditComment.bind(this, t)))
        }
    },
    refreshComment: function(t) {
        if (t) {
            var e = t.data("model");
            e && (t.find(".message").text(e.get("message")), t.attr("data-id", e.get("id")), t.attr("data-state", e.getState()))
        }
    },
    refreshCommentByID: function(t) {
        this.refreshComment(this.getCommentByID(t))
    },
    refreshSlideNumbers: function() {
        this.options.slideNumbers && this.domElement.find(".sl-collab-comment").each(function(t, e) {
            this.refreshSlideNumber($(e))
        }.bind(this))
    },
    refreshSlideNumber: function(t) {
        if (this.options.slideNumbers) {
            var e = SL.util.deck.getSlideNumber(t.data("model").get("slide_hash"));
            if (e) {
                var i = "slide " + e,
                    n = t.find(".meta-slide-number");
                n.length ? n.text(i) : t.find(".meta").prepend('<button class="meta-slide-number" data-tooltip="Click to view slide">' + i + "</button>")
            } else t.find(".meta-slide-number").remove()
        }
    },
    appendTo: function(t) {
        this.domElement.appendTo(t)
    },
    bind: function() {
        this.comments.loadStarted.add(this.onLoadStarted.bind(this)), this.comments.loadCompleted.add(this.onLoadCompleted.bind(this)), this.comments.loadFailed.add(this.onLoadFailed.bind(this)), this.comments.changed.add(this.onCommentsChanged.bind(this)), this.viewSlideCommentsClicked = new signals.Signal, this.layout = this.layout.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.domElement.delegate(".meta-slide-number", "vclick", this.onSlideNumberClicked.bind(this)), SL.util.dom.preventTouchOverflowScrolling(this.domElement)
    },
    show: function(t) {
        t = t || {}, this.getID() === SL.components.collab.Comments.DECK_THREAD ? this.comments.isLoaded() || this.comments.isLoading() ? (this.refresh(), this.scrollToLatestComment()) : this.load() : this.load(t.slide_hash || Reveal.getCurrentSlide().getAttribute("data-id")), $(window).on("resize", this.onWindowResize)
    },
    hide: function() {
        $(window).off("resize", this.onWindowResize)
    },
    load: function(t) {
        var e = SL.config.AJAX_COMMENTS_LIST(SL.current_deck.get("id"), t);
        this.slideHash = t, this.domElement.find(".sl-collab-comment").remove(), this.comments.unload(), this.domElement.addClass("empty"), this.comments.load(e).then(SL.util.noop, SL.util.noop)
    },
    reload: function() {
        this.getID() === SL.components.collab.Comments.DECK_THREAD ? this.load() : this.load(this.slideHash || Reveal.getCurrentSlide().getAttribute("data-id"))
    },
    refresh: function() {
        this.checkIfEmpty(), this.checkOverflow(), this.checkPagination()
    },
    layout: function() {
        this.checkOverflow()
    },
    checkIfEmpty: function() {
        if (this.comments.isLoaded())
            if (this.comments.isEmpty()) {
                var t = this.getID() === SL.components.collab.Comments.SLIDE_THREAD ? "No comments on this slide" : "Nothing here yet.<br>Be the first to comment.";
                this.getPlaceholder().html('<div class="icon i-comment-stroke"></div><p>' + t + "</p>")
            } else this.hidePlaceholder(), this.domElement.removeClass("empty")
    },
    checkPagination: function() {
        this.loadMoreButton.toggleClass("visible", !this.comments.isLoading() && this.comments.isLoaded() && this.comments.hasNextPage())
    },
    checkOverflow: function() {
        this.domElement.toggleClass("overflowing", this.domElement.prop("scrollHeight") > this.domElement.prop("offsetHeight"))
    },
    hidePlaceholder: function() {
        this.placeholder && (this.placeholder.remove(), this.placeholder = null)
    },
    getCommentPrivileges: function(t) {
        var e = {
                canEdit: !1,
                canDelete: !1
            },
            i = this.options.users.getByUserID(SL.current_user.get("id")),
            n = this.options.users.getByUserID(t.get("user_id"));
        if (n && i) {
            var s = i.get("user_id") === n.get("user_id"),
                o = i.get("role") === SL.models.collab.DeckUser.ROLE_ADMIN || i.get("role") === SL.models.collab.DeckUser.ROLE_OWNER;
            s ? (e.canEdit = !0, e.canDelete = !0) : o && (e.canDelete = !0)
        }
        return e
    },
    scrollToLatestComment: function() {
        this.domElement.scrollTop(this.domElement.prop("scrollHeight"))
    },
    scrollToLatestCommentUnlessScrolled: function() {
        return this.getScrollOffset() < 600 ? (this.scrollToLatestComment(), !0) : !1
    },
    commentExists: function(t) {
        return this.getComments().getByID(t.id) ? !0 : SL.current_user.get("id") === t.user_id ? this.getTemporaryComments().some(function(e) {
            return e.get("user_id") === t.user_id && e.get("message") === t.message
        }) : !1
    },
    getScrollOffset: function() {
        var t = this.domElement.get(0);
        return t.scrollHeight - t.offsetHeight - t.scrollTop
    },
    getPlaceholder: function() {
        return this.placeholder || (this.placeholder = $('<div class="placeholder">'), this.placeholder.appendTo(this.domElement)), this.placeholder
    },
    getComments: function() {
        return this.comments
    },
    getTemporaryComments: function() {
        return this.comments.filter(function(t) {
            return !t.has("id")
        })
    },
    getCommentByID: function(t) {
        return this.domElement.find('.sl-collab-comment[data-id="' + t + '"]')
    },
    getSlideHash: function() {
        return this.slideHash
    },
    getID: function() {
        return this.id
    },
    onLoadStarted: function() {
        this.getPlaceholder().html('<div class="spinner centered" data-spinner-color="#999"></div>'), SL.util.html.generateSpinners()
    },
    onLoadCompleted: function() {
        this.comments.forEach(this.renderComment.bind(this)), this.refresh(), this.scrollToLatestComment()
    },
    onLoadFailed: function() {
        this.getPlaceholder().html('<p class="error">Failed to load comments.</p>')
    },
    onWindowResize: function() {
        this.scrollToLatestComment(), this.layout()
    },
    onCommentsChanged: function(t, e) {
        t && t.length && t.forEach(this.renderComment.bind(this)), e && e.length && e.forEach(function(t) {
            this.getCommentByID(t.get("id")).remove()
        }.bind(this)), this.refresh()
    },
    onCommentStateChanged: function(t, e) {
        var i = e.getState();
        t.attr("data-id", e.get("id")), t.attr("data-state", i), i === SL.models.collab.Comment.STATE_FAILED ? 0 === t.find(".retry").length && (t.append(['<div class="retry">', '<span class="retry-info">Failed to send</span>', '<button class="button outline retry-button">Retry</button>', "</div>"].join("")), t.find(".retry-button").on("click", function() {
            this.comments.retryCreate(e)
        }.bind(this)), this.scrollToLatestCommentUnlessScrolled()) : t.find(".retry").remove()
    },
    onCommentOptionsClicked: function(t) {
        var e = new SL.components.Menu({
            anchor: t.find(".options-button"),
            anchorSpacing: 15,
            alignment: "l",
            destroyOnHide: !0,
            options: [{
                label: "Edit",
                icon: "pen-alt2",
                callback: this.onEditComment.bind(this, t)
            }, {
                label: "Delete",
                icon: "trash-fill",
                callback: this.onDeleteComment.bind(this, t)
            }]
        });
        e.show()
    },
    onEditComment: function(t) {
        var e = t.data("model"),
            i = SL.prompt({
                anchor: t.find(".options-button"),
                alignment: "l",
                title: "Edit comment",
                type: "input",
                confirmLabel: "Save",
                data: {
                    value: e.get("message"),
                    placeholder: "Comment...",
                    multiline: !0
                }
            });
        i.confirmed.add(function(i) {
            "string" == typeof i && i.trim().length > 0 && (e.set("message", i), e.save(["message"]).done(this.refreshComment.bind(this, t)))
        }.bind(this)), SL.analytics.trackCollaboration("Edit comment")
    },
    onDeleteComment: function(t) {
        var e = t.data("model");
        SL.prompt({
            anchor: t.find(".options-button"),
            alignment: "l",
            title: "Are you sure you want to delete this comment?",
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Delete</h3>",
                selected: !0,
                className: "negative",
                callback: function() {
                    this.comments.remove(e), e.destroy()
                }.bind(this)
            }]
        }),
            SL.analytics.trackCollaboration("Delete comment")
    },
    onLoadMoreClicked: function() {
        this.loadMoreButton.prop("disabled", !0).text(this.strings.loadingMoreComments), this.comments.loadNextPage().then(function(t) {
            var e = this.domElement.scrollTop(),
                i = this.domElement.prop("scrollHeight");
            t.reverse().forEach(function(t) {
                this.renderComment(t, {
                    prepend: !0
                })
            }.bind(this));
            var n = this.domElement.prop("scrollHeight");
            this.domElement.scrollTop(n - i + e), this.checkPagination()
        }.bind(this)).catch(function() {
            SL.notify("Failed to load comments", "negative")
        }.bind(this)).then(function() {
            this.loadMoreButton.prop("disabled", !1).text(this.strings.loadMoreComments), this.loadMoreButton.prependTo(this.domElement)
        }.bind(this))
    },
    onSlideNumberClicked: function(t) {
        var e = $(t.target).closest(".sl-collab-comment");
        e.length && e.data("model") && this.viewSlideCommentsClicked.dispatch(e.data("model").get("slide_hash"))
    },
    destroy: function() {
        this.viewSlideCommentsClicked.dispose(), this.domElement.remove()
    }
}),
SL("components.collab").Comments = Class.extend({
    init: function(t, e) {
        this.controller = t, this.options = e, this.render(), this.bind(), this.getCurrentThread() || this.showThread(SL.components.collab.Comments.DECK_THREAD), this.refreshCommentInput(), this.refreshCurrentSlide(), this.getCurrentThread().scrollToLatestComment(), this.layout()
    },
    render: function() {
        this.domElement = $('<div class="sl-collab-page sl-collab-comments"></div>'), this.renderHeader(), this.bodyElement = $('<div class="sl-collab-page-body sl-collab-comments-body">'), this.bodyElement.appendTo(this.domElement), this.footerElement = $('<footer class="sl-collab-page-footer">'), this.footerElement.appendTo(this.domElement), this.renderThreads(), this.renderCommentForm()
    },
    renderHeader: function() {
        this.headerElement = $('<header class="sl-collab-page-header sl-collab-comments-header"></header>'), this.headerElement.appendTo(this.domElement), this.headerElement.html(['<div class="header-tab selected" data-thread-id="deck">All comments</div>', '<div class="header-tab header-tab-slide" data-thread-id="slide">Current slide</div>'].join("")), this.headerElement.find(".header-tab").on("vclick", function(t) {
            this.showThread($(t.currentTarget).attr("data-thread-id")), SL.util.device.IS_PHONE || SL.util.device.IS_TABLET || this.commentInput.focus()
        }.bind(this))
    },
    renderThreads: function() {
        this.threads = {}, this.threads.deck = new SL.components.collab.CommentThread(SL.components.collab.Comments.DECK_THREAD, {
            users: this.options.users,
            slideNumbers: !0
        }), this.threads.deck.viewSlideCommentsClicked.add(this.onViewSlideCommentsClicked.bind(this)), this.threads.deck.appendTo(this.bodyElement), this.threads.slide = new SL.components.collab.CommentThread(SL.components.collab.Comments.SLIDE_THREAD, {
            users: this.options.users
        }), this.threads.slide.appendTo(this.bodyElement)
    },
    renderCommentForm: function() {
        this.commentForm = $('<form action="#" class="sl-collab-comment-form sl-form disable-when-disconnected" novalidate>'), this.commentForm.on("submit", this.onCommentSubmit.bind(this)), this.commentInput = $(SL.util.device.IS_PHONE || SL.util.device.IS_TABLET ? '<input type="text" autocapitalize="sentences" class="comment-input" placeholder="Add a comment..." required maxlength="' + SL.config.COLLABORATION_COMMENT_MAXLENGTH + '" />' : '<textarea class="comment-input" placeholder="Add a comment..." required maxlength="' + SL.config.COLLABORATION_COMMENT_MAXLENGTH + '"></textarea>'), this.commentInput.on("keydown", this.onCommentKeyDown.bind(this)), this.commentInput.on("input", this.onCommentChanged.bind(this)), this.commentInput.on("focus", this.onCommentInputFocus.bind(this)), this.commentInput.appendTo(this.commentForm), this.commentInputFooter = $('<div class="comment-footer"></div>'), this.commentInputFooter.appendTo(this.commentForm), this.commentTyping = $('<div class="comment-typing"></div>'), this.commentTyping.appendTo(this.commentInputFooter), this.commentSubmitButton = $('<input class="comment-submit" type="submit" value="Send" />'), this.commentSubmitButton.on("vclick", this.submitComment.bind(this)), this.commentSubmitButton.appendTo(this.commentInputFooter), this.commentInputFooter.append('<div class="clear"></div>'), this.commentForm.appendTo(this.footerElement)
    },
    bind: function() {
        this.layout = this.layout.bind(this), this.startTyping = this.startTyping.bind(this), this.stopTyping = this.stopTyping.bind(this), $(window).on("resize", this.layout), this.controller.expanded.add(this.onCollaborationExpanded.bind(this)), this.controller.isInEditor() && SL.editor.controllers.Markup.slidesChanged.add(this.refreshSlideNumbers.bind(this))
    },
    appendTo: function(t) {
        this.domElement.appendTo(t)
    },
    layout: function() {
        this.checkOverflow()
    },
    reload: function() {
        this.threads.deck.reload();
        var t = this.getCurrentThread();
        t && t.getID() === SL.components.collab.Comments.SLIDE_THREAD && t.reload()
    },
    focus: function() {
        this.commentInput.focus()
    },
    blur: function() {
        this.commentInput.blur()
    },
    checkOverflow: function() {
        this.domElement.toggleClass("overflowing", this.bodyElement.prop("scrollHeight") > this.bodyElement.prop("offsetHeight"))
    },
    showCommentNotification: function(t) {
        var e = this.options.users.getByUserID(t.get("user_id"));
        if (e && e.get("user_id") !== SL.current_user.get("id")) {
            var i = "<strong>" + e.getDisplayName() + "</strong>",
                n = SL.util.deck.getSlideNumber(t.get("slide_hash"));
            n && (i += '<span class="slide-number">slide ' + n + "</span>"), i += "<br>" + t.get("message"), this.controller.notifications.show(i, {
                sender: e,
                callback: function() {
                    this.showSlideComments(t.get("slide_hash")), this.commentInput.focus()
                }.bind(this)
            })
        }
    },
    showSlideComments: function(t) {
        this.controller.isExpanded() === !1 && this.controller.expand();
        var e = $('.reveal .slides section[data-id="' + t + '"]').get(0);
        SL.util.deck.navigateToSlide(e);
        var i = this.getCurrentThread();
        i && i.getID() !== SL.components.collab.Comments.SLIDE_THREAD && (this.showThread(SL.components.collab.Comments.SLIDE_THREAD, {
            slide_hash: t
        }),
        SL.util.device.IS_PHONE || SL.util.device.IS_TABLET || this.commentInput.focus())
    },
    showThread: function(t, e) {
        var i = this.getCurrentThread(),
            n = this.bodyElement.find('[data-thread-id="' + t + '"]'),
            s = n.data("thread");
        s && (i && i !== s && i.hide(), this.bodyElement.find(".sl-collab-comment-thread").removeClass("visible"), n.addClass("visible"), this.headerElement.find(".header-tab").removeClass("selected"), this.headerElement.find('.header-tab[data-thread-id="' + t + '"]').addClass("selected"), s.show(e))
    },
    getCurrentThread: function() {
        return this.domElement.find(".sl-collab-comment-thread.visible").data("thread")
    },
    addCommentFromStream: function(t) {
        if (t.id || console.warn("Can not insert comment without ID"), !this.threads.deck.commentExists(t)) {
            var e = this.controller.isExpanded(),
                i = this.threads.deck.getComments().createModel(t),
                n = !1;
            return this.getCurrentThread().getID() === SL.components.collab.Comments.DECK_THREAD ? n = this.threads.deck.scrollToLatestCommentUnlessScrolled() : this.getCurrentThread().getID() === SL.components.collab.Comments.SLIDE_THREAD && t.slide_hash && t.slide_hash === this.getCurrentThread().getSlideHash() && !this.getCurrentThread().commentExists(t) && (this.threads.slide.getComments().createModel(t), n = this.threads.slide.scrollToLatestCommentUnlessScrolled()), e && n || this.showCommentNotification(i), !0
        }
        return !1
    },
    updateCommentFromStream: function(t) {
        t.id || console.warn("Can not update comment without ID");
        var e = this.threads.deck.getComments().getByID(t.id);
        if (e) {
            for (var i in t) e.set(i, t[i]);
            this.threads.deck.refreshCommentByID(e.get("id")), this.getCurrentThread().getID() === SL.components.collab.Comments.SLIDE_THREAD && this.threads.slide.refreshCommentByID(e.get("id"))
        }
    },
    removeCommentFromStream: function(t) {
        return this.threads.deck.getComments().removeByProperties({
            id: t
        })
    },
    refreshCommentInput: function() {
        this.commentInput.attr("rows", 2);
        var t = Math.ceil(parseFloat(this.commentInput.css("line-height"))),
            e = this.commentInput.prop("scrollHeight"),
            i = this.commentInput.prop("clientHeight"),
            n = 10;
        e > i && this.commentInput.attr("rows", Math.min(Math.floor(e / t), n)), this.getCurrentThread().scrollToLatestCommentUnlessScrolled(t * n)
    },
    refreshTyping: function() {
        var t = this.commentInput.val();
        t ? this.startTyping() : this.stopTyping()
    },
    startTyping: function() {
        var t = Date.now();
        this.typing = !0, (!this.lastTypingEvent || t - this.lastTypingEvent > SL.config.COLLABORATION_SEND_WRITING_INTERVAL) && (this.lastTypingEvent = t, SL.helpers.StreamEditor.singleton().broadcast({
            type: "collaboration:user-typing",
            user_id: SL.current_user.get("id")
        }))
    },
    stopTyping: function() {
        this.typing && (this.typing = !1, this.lastTypingEvent = null, SL.helpers.StreamEditor.singleton().broadcast({
            type: "collaboration:user-typing-stopped",
            user_id: SL.current_user.get("id")
        }))
    },
    refreshTypingIndicators: function() {
        var t = this.options.users.filter(function(t) {
            return t.get("typing") === !0
        });
        0 === t.length ? this.commentTyping.empty().removeAttr("data-tooltip") : 1 === t.length ? this.commentTyping.html("<strong>" + t[0].getDisplayName() + "</strong> is typing").removeAttr("data-tooltip") : t.length > 1 && (this.commentTyping.html("<strong>" + t.length + " people</strong> are typing"), this.commentTyping.attr("data-tooltip", t.map(function(t) {
            return t.getDisplayName()
        }).join("<br>")))
    },
    refreshCurrentSlide: function() {
        var t = this.getCurrentThread();
        t && t.getID() === SL.components.collab.Comments.SLIDE_THREAD && this.showThread(SL.components.collab.Comments.SLIDE_THREAD, {
            slide_hash: Reveal.getCurrentSlide().getAttribute("data-id")
        });
        var e = SL.util.deck.getSlideNumber(Reveal.getCurrentSlide());
        e && this.headerElement.find(".header-tab-slide").text("Slide " + e)
    },
    refreshSlideNumbers: function() {
        this.threads.deck.refreshSlideNumbers()
    },
    submitComment: function() {
        var t = this.commentInput.val();
        t = t.trim(), t = t.replace(/(\n|\r){3,}/gim, "\n\n"), t.length && (this.getCurrentThread().getComments().create({
            comment: {
                slide_hash: Reveal.getCurrentSlide().getAttribute("data-id"),
                message: t,
                user_id: SL.current_user.get("id"),
                created_at: Date.now()
            }
        }), this.commentInput.val(""), this.stopTyping(), this.refreshCommentInput(), this.getCurrentThread().scrollToLatestComment())
    },
    onCommentSubmit: function(t) {
        this.submitComment(), t.preventDefault()
    },
    onCommentKeyDown: function(t) {
        13 !== t.keyCode || t.shiftKey || (this.submitComment(), t.preventDefault(), t.stopPropagation())
    },
    onCommentChanged: function() {
        this.refreshCommentInput(), this.refreshTyping()
    },
    onCommentInputFocus: function() {
        this.refreshTyping()
    },
    onViewSlideCommentsClicked: function(t) {
        this.showSlideComments(t)
    },
    onSlideChanged: function() {
        this.refreshCurrentSlide()
    },
    onCollaborationExpanded: function() {
        this.refreshCurrentSlide(), setTimeout(this.focus.bind(this), 100)
    },
    destroy: function() {
        this.threads.deck.destroy(), this.threads.slide.destroy(), this.options = null, this.domElement.remove()
    }
}),
SL.components.collab.Comments.DECK_THREAD = "deck",
SL.components.collab.Comments.SLIDE_THREAD = "slide",
SL("components.collab").Handover = Class.extend({
    init: function(t, e) {
        this.controller = t, this.options = e, this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="sl-collab-handover">'), this.editButtonWrapper = $('<div class="edit-button-wrapper">').appendTo(this.domElement), this.editButton = $('<div class="edit-button">'), this.editButton.append('<span class="label">Edit </span><span class="icon i-pen-alt2"></span>'), this.editButton.appendTo(this.editButtonWrapper), this.user = $('<div class="user"></div>'), this.userAvatar = $('<div class="user-avatar"></div>').appendTo(this.user), this.userDescription = $('<div class="user-description"></div>').appendTo(this.user), this.userStatus = $('<div class="user-status"></div>').appendTo(this.userDescription), this.userSlide = $('<div class="user-slide"></div>').appendTo(this.userDescription)
    },
    appendTo: function(t) {
        this.domElement.appendTo(t)
    },
    bind: function() {
        this.editButtonWrapper.on("vclick", this.onEditClicked.bind(this))
    },
    refresh: function() {
        this.controller.getCurrentDeckUser().isEditing() || !this.controller.getCurrentDeckUser().canEdit() ? (this.editButtonWrapper.removeClass("visible"), this.editButtonWrapper.removeAttr("data-tooltip"), this.user.remove()) : (this.editButtonWrapper.addClass("visible"), this.currentEditor = this.options.users.getByProperties({
            editing: !0
        }), this.currentEditor && this.currentEditor.isOnline() ? (this.currentAvatarURL !== this.currentEditor.get("thumbnail_url") && (this.currentAvatarURL = this.currentEditor.get("thumbnail_url"), this.userAvatar.css("background-image", 'url("' + this.currentAvatarURL + '")')), 0 === this.user.parent().length && this.user.appendTo(this.editButtonWrapper), this.refreshSlideNumbers(), this.currentEditor.isIdle() ? (this.editButtonWrapper.attr("data-tooltip", "<strong>" + this.currentEditor.get("username") + "</strong> is editing but has been idle for a while.<br>Click to start editing."), this.userStatus.html('<span class="username">' + this.currentEditor.get("username") + "</span> is idle"), this.user.addClass("idle")) : (this.editButtonWrapper.attr("data-tooltip", "Ask <strong>" + this.currentEditor.get("username") + "</strong> to make you the active editor"), this.userStatus.html('<span class="username">' + this.currentEditor.get("username") + "</span> is editing"), this.user.removeClass("idle"))) : (this.user.remove(), this.editButtonWrapper.removeAttr("data-tooltip")))
    },
    refreshSlideNumbers: function() {
        if (this.currentEditor) {
            var t = SL.util.deck.getSlideNumber(this.currentEditor.get("slide_id"));
            t ? this.userSlide.addClass("visible").html("slide " + t).data("data-slide-id", this.currentEditor.get("slide_id")).attr("data-tooltip", "Click to view slide") : this.userSlide.removeClass("visible")
        }
    },
    onEditClicked: function(t) {
        if ($(t.target).closest(".user-slide").length) {
            var e = this.userSlide.data("data-slide-id"),
                i = $('.reveal .slides section[data-id="' + e + '"]').get(0);
            i && SL.util.deck.navigateToSlide(i)
        } else if (!this.controller.getCurrentDeckUser().isEditing()) {
            var n = this.options.users.getByProperties({
                editing: !0
            });
            n && n.isOnline() && !n.isIdle() ? (SL.helpers.StreamEditor.singleton().broadcast({
                type: "collaboration:handover-requested",
                user_id: SL.current_user.get("id")
            }), this.controller.showHandoverRequestPending(n)) : this.controller.becomeEditor()
        }
    },
    destroy: function() {
        this.domElement.remove()
    }
}),
SL("components.collab").Menu = Class.extend({
    init: function(t, e) {
        this.controller = t, this.options = e, this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="sl-collab-menu">'), this.innerElement = $('<div class="sl-collab-menu-inner">'), this.innerElement.appendTo(this.domElement), this.renderProfile()
    },
    renderProfile: function() {
        this.enableButton = $('<div class="sl-collab-menu-item sl-collab-menu-enable ladda-button" data-style="zoom-in" data-spinner-color="#444" data-tooltip="Add a collaborator" data-tooltip-alignment="l">'), this.enableButton.append('<span class="users-icon icon i-users"></span>'), this.enableButton.appendTo(this.innerElement), this.toggleButton = $('<div class="sl-collab-menu-item sl-collab-menu-toggle">'), this.toggleButton.append('<div class="users-icon icon i-users"></div>'), this.toggleButton.append('<div class="close-icon icon i-x"></div>'), this.toggleButton.appendTo(this.innerElement), this.unreadComments = $('<div class="unread-comments" data-tooltip="Unread comments" data-tooltip-alignment="l">'), this.unreadComments.appendTo(this.toggleButton)
    },
    appendTo: function(t) {
        this.domElement.appendTo(t)
    },
    bind: function() {
        this.onEnableClicked = this.onEnableClicked.bind(this), this.onToggleClicked = this.onToggleClicked.bind(this), this.enableButton.on("vclick", this.onEnableClicked), this.toggleButton.on("vclick", this.onToggleClicked), this.controller.enabled.add(this.onCollaborationEnabled.bind(this)), this.controller.expanded.add(this.onCollaborationExpanded.bind(this))
    },
    setUnreadComments: function(t) {
        0 === t ? this.clearUnreadComments() : this.unreadComments.text(t).addClass("visible")
    },
    clearUnreadComments: function() {
        this.unreadComments.removeClass("visible")
    },
    destroy: function() {
        this.domElement.remove()
    },
    getPrimaryButton: function() {
        return this.toggleButton
    },
    onEnableClicked: function(t) {
        this.enableButton.off("vclick", this.onEnableClicked), this.enableLoader = Ladda.create(this.enableButton.get(0)), this.enableLoader.start(), SL.view.isNewDeck() ? SL.view.save(function() {
            this.controller.makeDeckCollaborative()
        }.bind(this)) : this.controller.makeDeckCollaborative(), t.preventDefault()
    },
    onToggleClicked: function(t) {
        this.controller.toggle(), t.preventDefault()
    },
    onCollaborationEnabled: function() {
        this.enableLoader && (this.enableLoader.stop(), this.enableLoader = null)
    },
    onCollaborationExpanded: function() {
        this.clearUnreadComments()
    }
}),
SL("components.collab").Notifications = Class.extend({
    init: function(t, e) {
        this.controller = t, this.options = e, this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="sl-collab-notifications">')
    },
    bind: function() {
        this.domElement.delegate(".sl-collab-notification.optional", "mouseenter", this.onNotificationMouseEnter.bind(this)), this.domElement.delegate(".sl-collab-notification.optional", "vclick", this.onNotificationClick.bind(this))
    },
    appendTo: function(t) {
        this.domElement.appendTo(t)
    },
    show: function(t, e) {
        e = $.extend({
            optional: !0,
            duration: 5e3
        }, e);
        var i;
        e.id && (i = this.getNotificationByID(e.id)), i && 0 !== i.length || (i = this.addNotification(t, e), e.optional && (this.holding ? i.addClass("on-hold") : this.hideAfter(i, e.duration)))
    },
    hide: function(t) {
        var e = this.getNotificationByID(t);
        return e.length ? (this.removeNotification(e), !0) : !1
    },
    hideAfter: function(t, e) {
        setTimeout(function() {
            t.addClass("hide"), setTimeout(this.removeNotification.bind(this, t), 500)
        }.bind(this), e)
    },
    hold: function() {
        this.holding = !0
    },
    release: function() {
        this.holding = !1;
        var t = this.domElement.find(".sl-collab-notification.on-hold").get().reverse();
        t.forEach(function(t, e) {
            this.hideAfter($(t), 5e3 + 1e3 * e)
        }, this)
    },
    addNotification: function(t, e) {
        var i = $('<div class="sl-collab-notification" />').data("options", e).toggleClass("optional", e.optional).prependTo(this.domElement),
            t = $('<div class="message" />').append(t).appendTo(i);
        return i.toggleClass("multiline", t.height() > 24), e.sender ? $('<div class="status-picture" />').css("background-image", 'url("' + e.sender.get("thumbnail_url") + '")').prependTo(i) : $('<div class="status-icon icon" />').addClass(e.icon || "i-info").prependTo(i), e.id && i.attr("data-id", e.id), this.layout(), setTimeout(function() {
            i.addClass("show")
        }, 1), i
    },
    removeNotification: function(t) {
        t.removeData(), t.remove(), this.layout()
    },
    getNotificationByID: function(t) {
        return this.domElement.find(".sl-collab-notification[data-id=" + t + "]")
    },
    layout: function() {
        var t = 0;
        this.domElement.find(".sl-collab-notification").each(function(e, i) {
            i.style.top = t + "px", t += i.offsetHeight + 10
        })
    },
    destroy: function() {
        this.domElement.remove()
    },
    onNotificationMouseEnter: function(t) {
        var e = $(t.currentTarget);
        0 === e.find(".dismiss").length && $('<div class="dismiss"><span class="icon i-x"></span></div>').appendTo(e)
    },
    onNotificationClick: function(t) {
        var e = $(t.currentTarget);
        if (0 === $(t.target).closest(e.find(".dismiss")).length) {
            var i = e.data("options").callback;
            "function" == typeof i && i.call()
        }
        this.removeNotification(e)
    }
}),
SL("components.collab").Users = Class.extend({
    init: function(t, e) {
        this.controller = t, this.options = e, this.inviteSent = new signals.Signal, this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="sl-collab-users disable-when-disconnected">'), this.userList = $('<div class="sl-collab-users-list">').appendTo(this.domElement), this.slideGroup = $('<div class="sl-collab-users-group">').appendTo(this.userList), this.slideGroup.append('<div class="icon i-eye"></div>'), this.slideGroup.find(".icon").attr({
            "data-tooltip": "People who are viewing the current slide",
            "data-tooltip-alignment": "l"
        }), this.inviteButton = $('<div class="sl-collab-users-invite" data-tooltip="Add a collaborator" data-tooltip-alignment="l"></div>'), this.inviteButton.html('<span class="icon i-plus"></span>'), this.inviteButton.on("vclick", this.onInviteClicked.bind(this)), this.inviteButton.appendTo(this.domElement), this.renderUsers()
    },
    renderUsers: function() {
        this.domElement.toggleClass("admin", this.controller.getCurrentDeckUser().isAdmin()), this.layoutPrevented = !0, this.userList.find(".sl-collab-user").remove(), this.options.users.forEach(this.renderUser.bind(this)), this.layoutPrevented = !1, this.layout()
    },
    renderUser: function(t) {
        if (t.get("user_id") !== SL.current_user.get("id") && t.get("active") !== !1) {
            var e = this.getUserByID(t.get("user_id"));
            return 0 === e.length && (e = $("<div/>", {
                "class": "sl-collab-user",
                "data-user-id": t.get("user_id")
            }), e.html('<div class="picture" style="background-image: url(\'' + t.get("thumbnail_url") + "')\" />"), e.data("model", t), e.on("mouseenter", this.onUserMouseEnter.bind(this)), e.appendTo(this.userList)), this.refreshPresence(t), e
        }
    },
    renderRoleSelector: function() {
        var t = $(['<select class="sl-select role-selector">', '<option value="' + SL.models.collab.DeckUser.ROLE_EDITOR + '">Editor \u2013 Can comment and edit</option>', '<option value="' + SL.models.collab.DeckUser.ROLE_VIEWER + '">Viewer \u2013 Can comment</option>', "</select>"].join(""));
        return SL.current_deck.get("user.enterprise") && t.prepend('<option value="' + SL.models.collab.DeckUser.ROLE_ADMIN + '">Admin \u2013 Can comment, edit and manage users</option>'), t
    },
    renderInviteForm: function() {
        this.inviteForm || (this.inviteForm = $('<div class="sl-collab-invite-form sl-form">'), this.inviteEmail = $('<input class="invite-email" type="text" placeholder="Email address..." />'), this.inviteEmail.on("input", this.onEmailInput.bind(this)), this.inviteEmail.appendTo(this.inviteForm), this.inviteRole = this.renderRoleSelector(), this.inviteRole.appendTo(this.inviteForm), this.inviteOptions = $('<div class="invite-options">'), this.inviteOptions.appendTo(this.inviteForm), this.inviteFooter = $(['<footer class="footer">', '<button class="button l outline cancel-button">Cancel</button>', '<button class="button l confirm-button">Send</button>', "</footer>"].join("")), this.inviteFooter.find(".cancel-button").on("vclick", this.onInviteCancelClicked.bind(this)), this.inviteFooter.find(".confirm-button").on("vclick", this.onInviteConfirmClicked.bind(this)), this.inviteFooter.appendTo(this.inviteForm), SL.current_user.isEnterprise() && (this.inviteEmailAutocomplete = new SL.components.form.Autocomplete(this.inviteEmail, this.searchTeamMembers.bind(this), {
            className: "light-grey",
            offsetY: 1
        }), this.inviteEmailAutocomplete.confirmed.add(this.onEmailInput.bind(this)))), this.inviteEmail.val(""), this.inviteOptions.empty(), this.inviteRole.find("[hidden]").prop("hidden", !1), this.inviteRole.find('[value="' + SL.models.collab.DeckUser.ROLE_EDITOR + '"]').prop("selected", !0), this.inviteRole.prop("disabled", !1);
        var t = SL.current_deck.user;
        if (SL.current_deck.isVisibilityAll() || !t.isPro() || t.isEnterprise()) {
            if (t.isEnterprise() && SL.current_user.isEnterpriseManager()) {
                this.inviteOptions.append("<p>Want this person to be able to access internal presentations and create decks of their own?</p>");
                var e = $(['<div class="unit sl-checkbox outline">', '<input id="team-invite-checkbox" class="team-invite-checkbox" type="checkbox" />', '<label for="team-invite-checkbox">Add to team</label>', "</div>"].join("")).appendTo(this.inviteOptions);
                if (this.inviteToTeamLabel = e.find("label"), this.inviteToTeamInput = e.find("input"), !SL.current_team.isManuallyUpgraded()) {
                    var i = SL.current_team.getPlan();
                    if (i) {
                        var n = i.getDollarCostPerCycle();
                        n && this.inviteToTeamLabel.html("Add to team for " + n)
                    }
                }
            }
        } else {
            var s = this.options.users.getEditors().length - 1,
                o = SL.current_deck.get("deck_user_editor_limit") || 50;
            s >= o ? (this.inviteRole.find('[value="' + SL.models.collab.DeckUser.ROLE_EDITOR + '"]').prop("hidden", !0), this.inviteRole.find('[value="' + SL.models.collab.DeckUser.ROLE_VIEWER + '"]').prop("selected", !0), this.inviteRole.prop("disabled", !0), this.inviteOptions.html("You can't invite any more editors to this deck on your current plan, but you can invite any number of viewers. To invite additional editors please <a href=\"" + SL.routes.PRICING + '" target="_blank">upgrade to the Team plan</a>.')) : this.inviteOptions.html('You have invited <span class="semibold">' + s + "/" + o + "</span> " + SL.util.string.pluralize("editor", "s", o > 1) + ".")
        }
        return this.inviteForm
    },
    renderEditForm: function(t) {
        this.editForm || (this.editForm = $('<div class="sl-collab-edit-form sl-form">'), this.editRole = this.renderRoleSelector(), this.editRole.appendTo(this.editForm), this.editFooter = $(['<footer class="footer">', '<button class="button l negative delete-button" style="float: left;">Remove</button>', '<button class="button l outline cancel-button">Cancel</button>', '<button class="button l confirm-button">Save</button>', "</footer>"].join("")), this.editFooter.find(".delete-button").on("vclick", this.onEditDeleteClicked.bind(this)), this.editFooter.find(".cancel-button").on("vclick", this.onEditCancelClicked.bind(this)), this.editFooter.find(".confirm-button").on("vclick", this.onEditConfirmClicked.bind(this)), this.editFooter.appendTo(this.editForm)), this.editRole.find('[value="' + t.get("role") + '"]').prop("selected", !0), this.editRole.prop("disabled", !1);
        var e = SL.current_deck.user;
        if (!SL.current_deck.isVisibilityAll() && e.isPro() && !e.isEnterprise()) {
            var i = this.options.users.getEditors().length - 1,
                n = SL.current_deck.get("deck_user_editor_limit") || 50;
            i >= n && t.get("role") === SL.models.collab.DeckUser.ROLE_VIEWER && this.editRole.prop("disabled", !0)
        }
        return this.editForm
    },
    bind: function() {
        this.options.users.changed.add(this.onUsersChanged.bind(this)), this.domElement.delegate(".sl-collab-user", "vclick", this.onUserClicked.bind(this)), this.layout = this.layout.bind(this), this.controller.expanded.add(this.layout), this.controller.collapsed.add(this.layout), $(window).on("resize", $.throttle(this.layout, 300))
    },
    appendTo: function(t) {
        this.domElement.appendTo(t)
    },
    refreshPresence: function(t) {
        var e = this.getUserByID(t.get("user_id"));
        e && e.length && (e.removeClass("intro-animation"), e.toggleClass("online", t.isOnline()), e.toggleClass("idle", t.isIdle()), this.layout())
    },
    layout: function() {
        if (this.layoutPrevented) return !1;
        var t = 62;
        this.domElement.css("max-height", window.innerHeight - t);
        var e = this.userList.find(".sl-collab-user.online").get(),
            i = this.userList.find(".sl-collab-user:not(.online)").get(),
            n = 30,
            s = 26,
            o = 16,
            a = 10;
        if (this.slideGroup.removeClass("visible"), e.length) {
            var r = SL.util.deck.getSlideID(Reveal.getCurrentSlide()),
                l = 0,
                c = 4;
            e = e.filter(function(t) {
                return $(t).data("model").get("slide_id") === r ? (t.style.transform = "translateY(" + a + "px)", a += s, l += 1, !1) : !0
            }), l > 0 && (this.slideGroup.css({
                top: c,
                height: a + 2 * c
            }).addClass("visible"), a += o + 6), e.length && (e.forEach(function(t) {
                t.style.transform = "translateY(" + a + "px)", a += s
            }), a += o)
        }
        i.length && (this.controller.isExpanded() ? (i.forEach(function(t) {
            t.style.transform = "translateY(" + a + "px)", a += s
        }), a += o) : i.forEach(function(t) {
            t.style.transform = "translateY(" + a + "px)"
        })), this.inviteButton && (this.inviteButton.get(0).style.transform = "translateY(" + a + "px)", a += n + o), this.userList.css("height", a)
    },
    addUserFromStream: function(t) {
        t.user_id || console.warn("Can not insert collaborator without ID"), this.options.users.getByProperties({
            user_id: t.user_id
        }) || this.options.users.createModel(t)
    },
    removeUserFromStream: function(t) {
        return this.options.users.removeByProperties({
            user_id: t
        })
    },
    getUserByID: function(t) {
        return this.domElement.find('.sl-collab-user[data-user-id="' + t + '"]')
    },
    showInvitePrompt: function(t) {
        this.invitePrompt || (this.invitePrompt = SL.prompt({
            anchor: t || this.inviteButton,
            alignment: "l",
            type: "custom",
            title: "Add a collaborator",
            html: this.renderInviteForm(),
            destroyAfterConfirm: !1,
            confirmOnEnter: !0
        }), this.invitePrompt.confirmed.add(function() {
            this.inviteEmail.blur(), this.confirmInvitePrompt().then(function() {
                this.inviteSent.dispatch(), this.invitePrompt && this.invitePrompt.destroy()
            }.bind(this), function() {})
        }.bind(this)), this.invitePrompt.destroyed.add(function() {
            this.inviteForm.detach(), this.invitePrompt = null
        }.bind(this)), this.inviteEmail.focus())
    },
    confirmInvitePrompt: function() {
        var t = this.inviteEmail.val().trim(),
            e = this.inviteRole.val(),
            i = !(!this.inviteToTeamInput || !this.inviteToTeamInput.val());
        return new Promise(function(n, s) {
            if (/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$/gi.test(t)) {
                this.invitePrompt.showOverlay("neutral", "Inviting " + t, '<div class="spinner" data-spinner-color="#333"></div>'), SL.util.html.generateSpinners();
                var o = {
                    user: {
                        email: t,
                        role: e
                    }
                };
                i && (o.user.add_to_team = !0), this.options.users.create(o, {
                    url: SL.config.AJAX_DECKUSER_CREATE(SLConfig.deck.id),
                    createModel: !1
                }).then(function() {
                    this.invitePrompt.showOverlay("positive", "Invite sent!", '<span class="icon i-checkmark"></span>', 2e3).then(n)
                }.bind(this), function() {
                    this.invitePrompt.showOverlay("negative", "Failed to send invite. Please try again.", '<span class="icon i-x"></span>', 2e3).then(s), this.inviteEmail.focus().select()
                }.bind(this))
            } else SL.notify("Please enter a valid email", "negative"), this.inviteEmail.focus().select(), s()
        }.bind(this))
    },
    showEditPrompt: function(t) {
        if (!this.editPrompt) {
            var e = t.data("model");
            if (e.get("role") === SL.models.collab.DeckUser.ROLE_OWNER) return;
            this.editUserElement = t, this.editUserModel = e, this.editPrompt = SL.prompt({
                anchor: t,
                alignment: "l",
                type: "custom",
                title: e.get("email"),
                html: this.renderEditForm(e),
                destroyAfterConfirm: !1,
                confirmOnEnter: !0
            }), this.editPrompt.confirmed.add(function() {
                this.confirmEditPrompt().then(function() {
                    this.editPrompt && this.editPrompt.destroy()
                }.bind(this))
            }.bind(this)), this.editPrompt.destroyed.add(function() {
                this.editForm.detach(), this.editPrompt = null
            }.bind(this))
        }
    },
    confirmEditPrompt: function() {
        var t = this.editUserModel;
        return new Promise(function(e, i) {
            var n = this.editRole.val();
            n && n !== t.get("role") ? (this.editPrompt.showOverlay("neutral", "Saving", '<div class="spinner" data-spinner-color="#333"></div>'), SL.util.html.generateSpinners(), t.set("role", n), t.save(["role"]).then(function() {
                e()
            }.bind(this), function() {
                this.editPrompt.showOverlay("negative", "Failed to save changes. Please try again.", '<span class="icon i-x"></span>', 2e3).then(i)
            }.bind(this))) : e()
        }.bind(this))
    },
    searchTeamMembers: function(t) {
        return this.searchTeamMembersXHR && this.searchTeamMembersXHR.abort(), this.searchTeamMemberEmailCache || (this.searchTeamMemberEmailCache = {}), new Promise(function(e, i) {
            this.searchTeamMembersXHR = $.ajax({
                type: "POST",
                url: SL.config.AJAX_TEAM_MEMBER_SEARCH,
                context: this,
                data: {
                    q: t
                }
            }).done(function(t) {
                var i = t.results;
                i = i.filter(function(t) {
                    return t.id !== SL.current_user.get("id")
                }), i.forEach(function(t) {
                    this.searchTeamMemberEmailCache[t.email] = !0
                }.bind(this)), i = i.slice(0, 5).map(function(t) {
                    return {
                        value: t.email,
                        label: '<div class="label">' + t.name + '</div><div class="value">' + t.email + "</div>"
                    }
                }), e(i)
            }).fail(i)
        }.bind(this))
    },
    dismissPrompts: function() {
        this.editPrompt && this.editPrompt.destroy(), this.invitePrompt && this.invitePrompt.destroy()
    },
    onUsersChanged: function(t, e) {
        t && t.forEach(function(t) {
            var e = this.renderUser(t);
            e && (setTimeout(function() {
                e.addClass("intro-animation")
            }, 1), this.layout())
        }.bind(this)), e && e.forEach(function(t) {
            var e = $('.sl-collab-user[data-user-id="' + t.get("user_id") + '"]');
            SL.util.anim.collapseListItem(e, function() {
                e.remove(), this.layout()
            }.bind(this), 300)
        }, this)
    },
    onInviteClicked: function(t) {
        t.preventDefault(), this.showInvitePrompt()
    },
    onInviteCancelClicked: function() {
        this.invitePrompt && this.invitePrompt.cancel()
    },
    onInviteConfirmClicked: function() {
        this.invitePrompt && this.invitePrompt.confirm()
    },
    onEditCancelClicked: function() {
        this.editPrompt && this.editPrompt.cancel()
    },
    onEditConfirmClicked: function() {
        this.editPrompt && this.editPrompt.confirm()
    },
    onEditDeleteClicked: function() {
        this.editPrompt && this.editPrompt.destroy();
        var t = this.editUserModel;
        SL.prompt({
            anchor: this.editUserElement,
            title: SL.locale.get("COLLABORATOR_REMOVE_CONFIRM"),
            alignment: "l",
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Remove</h3>",
                selected: !0,
                className: "negative",
                callback: function() {
                    this.options.users.remove(t), t.destroy()
                }.bind(this)
            }]
        })
    },
    onEmailInput: function() {
        this.inviteOptions && this.searchTeamMemberEmailCache && (this.searchTeamMemberEmailCache[this.inviteEmail.val().trim()] ? this.inviteOptions.addClass("disabled") : this.inviteOptions.removeClass("disabled"))
    },
    onUserClicked: function(t) {
        this.controller.getCurrentDeckUser().isAdmin() && this.showEditPrompt($(t.currentTarget)), t.preventDefault()
    },
    onUserMouseEnter: function(t) {
        var e = $(t.currentTarget),
            i = e.data("model");
        if (i) {
            var n = [i.getDisplayName() + '<span class="sl-collab-tooltip-status" data-status="' + i.get("status") + '"></span>', '<span style="opacity: 0.70;">' + i.get("email") + "</span>"].join("<br>");
            SL.tooltip.show(n, {
                alignment: "l",
                anchor: e
            }), e.one("mouseleave", SL.tooltip.hide.bind(SL.tooltip))
        }
    },
    destroy: function() {
        this.inviteEmailAutocomplete && this.inviteEmailAutocomplete.destroy(), this.options = null, this.domElement.remove()
    }
}),
SL("components").ContextMenu = Class.extend({
    init: function(t) {
        this.config = $.extend({
            anchorSpacing: 5,
            minWidth: 0,
            options: []
        }, t), this.config.anchor = $(this.config.anchor), this.show = this.show.bind(this), this.hide = this.hide.bind(this), this.layout = this.layout.bind(this), this.onContextMenu = this.onContextMenu.bind(this), this.onDocumentKeydown = this.onDocumentKeydown.bind(this), this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this), this.shown = new signals.Signal, this.hidden = new signals.Signal, this.destroyed = new signals.Signal, this.domElement = $('<div class="sl-context-menu">'), this.config.anchor.on("contextmenu", this.onContextMenu)
    },
    render: function() {
        this.listElement = $('<div class="sl-context-menu-list">').appendTo(this.domElement), this.listElement.css("minWidth", this.config.minWidth + "px"), this.arrowElement = $('<div class="sl-context-menu-arrow">').appendTo(this.domElement)
    },
    renderList: function() {
        this.config.options.forEach(function(t) {
            if ("divider" === t.type) $('<div class="sl-context-menu-divider">').appendTo(this.listElement);
            else {
                var e;
                e = $("string" == typeof t.url ? '<a class="sl-context-menu-item" href="' + t.url + '">' : '<div class="sl-context-menu-item">'), e.data("item-data", t), e.html('<span class="label">' + t.label + "</span>"), e.appendTo(this.listElement), e.on("click", function(t) {
                    var e = $(t.currentTarget).data("item-data").callback;
                    "function" == typeof e && e.apply(null, [this.contextMenuEvent]), this.hide()
                }.bind(this)), t.icon && e.append('<span class="icon i-' + t.icon + '"></span>'), t.attributes && e.attr(t.attributes)
            }
        }.bind(this))
    },
    bind: function() {
        SL.keyboard.keydown(this.onDocumentKeydown), $(document).on("mousedown touchstart pointerdown", this.onDocumentMouseDown)
    },
    unbind: function() {
        SL.keyboard.release(this.onDocumentKeydown), $(document).off("mousedown touchstart pointerdown", this.onDocumentMouseDown)
    },
    layout: function(t, e) {
        var i = this.config.anchorSpacing,
            n = $(window).scrollLeft(),
            s = $(window).scrollTop(),
            o = this.domElement.outerWidth(),
            a = this.domElement.outerHeight(),
            r = o / 2,
            l = a / 2,
            c = 8,
            d = t,
            h = e - a / 2;
        t + i + c + o < window.innerWidth ? (this.domElement.attr("data-alignment", "r"), d += c + i, r = -c) : (this.domElement.attr("data-alignment", "l"), d -= o + c + i, r = o), d = Math.min(Math.max(d, n + i), window.innerWidth + n - o - i), h = Math.min(Math.max(h, s + i), window.innerHeight + s - a - i), this.domElement.css({
            left: d,
            top: h
        }), this.arrowElement.css({
            left: r,
            top: l
        })
    },
    focus: function(t) {
        var e = this.listElement.find(".focus");
        if (e.length) {
            var i = t > 0 ? e.nextAll(".sl-context-menu-item").first() : e.prevAll(".sl-context-menu-item").first();
            i.length && (e.removeClass("focus"), i.addClass("focus"))
        } else this.listElement.find(".sl-context-menu-item").first().addClass("focus")
    },
    show: function() {
        this.rendered || (this.rendered = !0, this.render(), this.renderList()), this.listElement.find(".sl-context-menu-item").each(function(t, e) {
            var i = $(e),
                n = i.data("item-data");
            i.toggleClass("hidden", "function" == typeof n.filter && !n.filter())
        }.bind(this)), this.listElement.find(".sl-context-menu-item:not(.hidden)").length && (this.domElement.removeClass("visible").appendTo(document.body), setTimeout(function() {
            this.domElement.addClass("visible")
        }.bind(this), 1), this.bind(), this.layout(this.contextMenuEvent.clientX, this.contextMenuEvent.clientY), this.shown.dispatch(this.contextMenuEvent))
    },
    hide: function() {
        this.listElement.find(".focus").removeClass("focus"), this.domElement.detach(), this.unbind(), this.hidden.dispatch()
    },
    isVisible: function() {
        return this.domElement.parent().length > 0
    },
    destroy: function() {
        this.shown.dispose(), this.hidden.dispose(), this.destroyed.dispatch(), this.destroyed.dispose(), this.domElement.remove(), this.unbind(), this.config = null
    },
    onDocumentKeydown: function(t) {
        if (27 === t.keyCode && (this.hide(), t.preventDefault()), 13 === t.keyCode) {
            var e = this.listElement.find(".focus");
            e.length && (e.trigger("click"), t.preventDefault())
        } else 38 === t.keyCode ? (this.focus(-1), t.preventDefault()) : 40 === t.keyCode ? (this.focus(1), t.preventDefault()) : 9 === t.keyCode && t.shiftKey ? (this.focus(-1), t.preventDefault()) : 9 === t.keyCode && (this.focus(1), t.preventDefault())
    },
    onContextMenu: function(t) {
        t.preventDefault(), this.contextMenuEvent = t, this.show()
    },
    onDocumentMouseDown: function(t) {
        var e = $(t.target);
        this.isVisible() && 0 === e.closest(this.domElement).length && this.hide()
    }
}),
SL("components.decksharer").DeckSharer = SL.components.popup.Popup.extend({
    TYPE: "decksharer",
    MODE_PUBLIC: {
        id: "public",
        width: 560,
        height: 380,
        heightEmail: "auto"
    },
    MODE_PRIVATE: {
        id: "private",
        width: 800,
        height: 560,
        heightEmail: 730
    },
    MODE_INTERNAL: {
        id: "internal",
        width: 560,
        height: "auto",
        heightEmail: "auto"
    },
    init: function(t) {
        var e = t.deck,
            i = e.belongsTo(SL.current_user);
        this.mode = i && (e.isVisibilitySelf() || e.isVisibilityTeam()) ? this.MODE_PRIVATE : !i && e.isVisibilityTeam() ? this.MODE_INTERNAL : this.MODE_PUBLIC, this._super($.extend({
            title: "Share",
            titleItem: '"' + e.get("title") + '"',
            width: this.mode.width,
            height: this.mode.height
        }, t))
    },
    render: function() {
        this._super(), this.mode.id === this.MODE_PRIVATE.id ? this.renderPrivate() : this.mode.id === this.MODE_INTERNAL.id ? this.renderInternal() : this.renderPublic()
    },
    renderPublic: function() {
        this.domElement.addClass("is-public"), this.shareOptions = new SL.components.decksharer.ShareOptions(this.options.deck, this.options), this.shareOptions.pageChanged.add(this.layout.bind(this)), this.shareOptions.appendTo(this.bodyElement)
    },
    renderInternal: function() {
        this.domElement.addClass("is-internal"), this.bodyElement.append('<p class="decksharer-share-warning">This deck is internal and can only be shared with and viewed by other team members.</p>'), this.shareOptions = new SL.components.decksharer.ShareOptions(this.options.deck, $.extend(this.options, {
            embedEnabled: !1
        })), this.shareOptions.pageChanged.add(this.layout.bind(this)), this.shareOptions.appendTo(this.bodyElement)
    },
    renderPrivate: function() {
        this.domElement.addClass("is-private"), this.placeholderElement = $(['<div class="decksharer-token-placeholder">', '<div class="decksharer-token-placeholder-inner">', '<div class="spinner" data-spinner-color="#999"></div>', "</div>", "</div>"].join("")), this.placeholderElement.appendTo(this.bodyElement), SL.util.html.generateSpinners(), SL.data.tokens.get(this.options.deck.get("id"), {
            success: function(t) {
                this.tokens = t, this.tokenList = new SL.components.decksharer.TokenList(this.options.deck, this.tokens), this.tokenList.appendTo(this.bodyElement), this.tokenList.tokenSelected.add(this.onTokenSelected.bind(this)), this.tokenList.tokensEmptied.add(this.onTokensEmptied.bind(this)), 0 === this.tokens.size() ? this.renderTokenPlaceholder() : this.tokenList.selectDefault()
            }.bind(this),
            error: function(t) {
                this.destroy(), 401 === t ? SL.notify("It looks like you're no longer signed in to Slides. Please open a new tab and sign in.", "negative") : SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
            }.bind(this)
        })
    },
    layout: function() {
        var t = this.tokenOptions ? this.tokenOptions.shareOptions : this.shareOptions;
        this.options.height = t && t.getPageID() === SL.components.decksharer.ShareOptions.EMAIL_PAGE_ID ? this.mode.heightEmail : this.mode.height, this._super()
    },
    resetContentArea: function() {
        this.tokenOptions && (this.tokenOptions.destroy(), this.tokenOptions = null), this.placeholderElement && (this.placeholderElement.addClass("hidden"), setTimeout(this.placeholderElement.remove.bind(this.placeholderElement), 300), this.placeholderElement = null)
    },
    renderTokenPlaceholder: function() {
        this.domElement.addClass("is-empty"), this.resetContentArea();
        var t = this.options.deck.isVisibilityTeam() ? "This deck is internal" : "This deck is private";
        this.placeholderElement = $(['<div class="decksharer-token-placeholder">', '<div class="decksharer-token-placeholder-inner">', '<div class="lock-icon icon i-lock-stroke"></div>', "<h2>" + t + "</h2>", "<p>To share it you'll need to create a secret link.</p>", '<button class="button create-button xl ladda-button" data-style="zoom-out">Create link</button>', "</div>", "</div>"].join("")), this.placeholderElement.appendTo(this.bodyElement), this.placeholderElement.find(".create-button").on("vclick", function() {
            this.tokenList.create()
        }.bind(this)), Ladda.bind(this.placeholderElement.find(".create-button").get(0)), this.layout()
    },
    renderTokenOptions: function(t) {
        this.domElement.removeClass("is-empty");
        var e = !this.tokenOptions;
        this.resetContentArea(), this.tokenOptions = new SL.components.decksharer.TokenOptions(this.options.deck, t, this.options), this.tokenOptions.appendTo(this.bodyElement, e), this.tokenOptions.tokenRenamed.add(this.tokenList.setTokenLabel.bind(this.tokenList)), this.tokenOptions.shareOptions.pageChanged.add(this.layout.bind(this)), this.layout()
    },
    onTokenSelected: function(t) {
        this.renderTokenOptions(t)
    },
    onTokensEmptied: function() {
        this.renderTokenPlaceholder()
    },
    destroy: function() {
        this.shareOptions && (this.shareOptions.destroy(), this.shareOptions = null), this.tokenList && (this.tokenList.destroy(), this.tokenList = null), this.options.deck = null, this.tokens = null, this._super()
    }
}),
SL("components.decksharer").ShareOptions = Class.extend({
    // USE_READONLY: !SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET,
    init: function(t, e) {
        this.deck = t, this.options = $.extend({
            token: null,
            linkEnabled: !0,
            embedEnabled: !0,
            emailEnabled: !0
        }, e), this.onLinkInputMouseDown = this.onLinkInputMouseDown.bind(this), this.onEmbedOutputMouseDown = this.onEmbedOutputMouseDown.bind(this), this.onEmbedStyleChanged = this.onEmbedStyleChanged.bind(this), this.onEmbedSizeChanged = this.onEmbedSizeChanged.bind(this), this.width = SL.components.decksharer.ShareOptions.DEFAULT_WIDTH, this.height = SL.components.decksharer.ShareOptions.DEFAULT_HEIGHT, this.style = "", this.pageChanged = new signals.Signal, this.render(), this.generate()
    },
    render: function() {
        this.domElement = $('<div class="decksharer-share-options">'), this.tabsElement = $('<div class="decksharer-share-options-tabs">').appendTo(this.domElement), this.pagesElement = $('<div class="decksharer-share-options-pages">').appendTo(this.domElement), this.options.deckView ? (this.tabsElement.hide(), this.renderDeckViewLink(), this.showPage(SL.components.decksharer.ShareOptions.LINK_PAGE_ID)) : (this.options.linkEnabled && this.renderLink(), this.options.embedEnabled && this.renderEmbed(), this.options.emailEnabled && SL.util.user.isLoggedIn() && this.renderEmail(), this.tabsElement.find(".decksharer-share-options-tab").on("vclick", function(t) {
            var e = $(t.currentTarget).attr("data-id");
            this.showPage(e), SL.analytics.track("Decksharer: Tab clicked", e)
        }.bind(this)), this.showPage(this.tabsElement.find(".decksharer-share-options-tab").first().attr("data-id")))
    },
    renderLink: function() {
        this.tabsElement.append('<div class="decksharer-share-options-tab" data-id="' + SL.components.decksharer.ShareOptions.LINK_PAGE_ID + '">Link</div>'), this.pagesElement.append(['<div class="decksharer-share-options-page sl-form" data-id="link">', '<div class="unit link-unit">', "<label>Presentation link</label>", "</div>", '<div class="unit sl-checkbox outline">', '<input id="fullscreen-checkbox" type="checkbox" class="fullscreen-input" />', '<label for="fullscreen-checkbox">Fullscreen</label>', "</div>", "</div>"].join("")), this.renderLinkInput(), this.fullscreenInput = this.pagesElement.find('[data-id="link"] .fullscreen-input'), this.fullscreenInput.on("change", this.onLinkFullscreenToggled.bind(this))
    },
    renderLinkInput: function() {
        this.USE_READONLY ? (this.linkInput = $('<input type="text" class="link-input" readonly="readonly" />'), this.linkInput.on("mousedown", this.onLinkInputMouseDown), this.linkInput.appendTo(this.pagesElement.find('[data-id="link"] .link-unit'))) : (this.linkAnchor = $('<a href="#" class="input-field">'), this.linkAnchor.appendTo(this.pagesElement.find('[data-id="link"] .link-unit')))
    },
    renderDeckViewLink: function() {
        this.pagesElement.append(['<div class="decksharer-share-options-page sl-form" data-id="link">', '<div class="unit link-unit">', "<label>Presentation link</label>", "</div>", "</div>"].join("")), "live" === this.options.deckView && (this.pagesElement.find('[data-id="link"] .link-unit label').text("Live presentation link"), this.pagesElement.find('[data-id="link"] .link-unit').append('<p class="unit-description">This links lets viewers follow the presentation in real-time.</p>')), this.renderLinkInput()
    },
    renderEmbed: function() {
        this.tabsElement.append('<div class="decksharer-share-options-tab" data-id="' + SL.components.decksharer.ShareOptions.EMBED_PAGE_ID + '">Embed</div>');
        var t = '<option value="dark" selected>Dark</option><option value="light">Light</option>';
        SL.current_user.isPro() && (t += '<option value="hidden">Hidden</option>'), this.pagesElement.append(['<div class="decksharer-share-options-page sl-form" data-id="embed">', '<div class="embed-options">', '<div class="unit">', "<label>Width:</label>", '<input type="text" name="width" maxlength="4" />', "</div>", '<div class="unit">', "<label>Height:</label>", '<input type="text" name="height" maxlength="4" />', "</div>", '<div class="unit">', "<label>Footer style:</label>", '<select class="sl-select" name="style">', t, "</select>", "</div>", "</div>", '<textarea name="output"></textarea>', "</div>"].join("")), this.embedElement = this.pagesElement.find('[data-id="embed"]'), this.embedStyleElement = this.embedElement.find("select[name=style]"), this.embedWidthElement = this.embedElement.find("input[name=width]"), this.embedHeightElement = this.embedElement.find("input[name=height]"), this.embedOutputElement = this.embedElement.find("textarea"), this.embedStyleElement.on("change", this.onEmbedStyleChanged), this.embedWidthElement.on("input", this.onEmbedSizeChanged), this.embedHeightElement.on("input", this.onEmbedSizeChanged), this.USE_READONLY ? (this.embedOutputElement.attr("readonly", "readonly"), this.embedOutputElement.on("mousedown", this.onEmbedOutputMouseDown)) : this.embedOutputElement.on("input", this.generate.bind(this)), this.embedWidthElement.val(this.width), this.embedHeightElement.val(this.height)
    },
    renderEmail: function() {
        this.tabsElement.append('<div class="decksharer-share-options-tab" data-id="' + SL.components.decksharer.ShareOptions.EMAIL_PAGE_ID + '">Email</div>'), this.pagesElement.append(['<div class="decksharer-share-options-page" data-id="email">', '<div class="sl-form">', '<div class="unit" data-validate="none" data-required>', "<label>From</label>", '<input type="text" class="email-from" placeholder="Your Name" maxlength="255" />', "</div>", '<div class="unit" data-validate="none" data-required>', "<label>To</label>", '<input type="text" class="email-to" placeholder="john@example.com, jane@example.com" maxlength="2500" />', "</div>", '<div class="unit text" data-validate="none" data-required>', "<label>Message</label>", '<p class="unit-description">A link to the deck is automatically included after the message.</p>', '<textarea class="email-body" rows="3" maxlength="2500"></textarea>', "</div>", '<div class="submit-wrapper">', '<button type="submit" class="button positive l ladda-button email-submit" data-style="zoom-out">Send</button>', "</div>", "</div>", '<div class="email-success">', '<div class="email-success-icon icon i-checkmark"></div>', '<p class="email-success-description">Email sent!</p>', "</div>", "</div>"].join("")), this.emailElement = this.pagesElement.find('[data-id="email"]'), this.emailSuccess = this.emailElement.find(".email-success"), this.emailForm = this.emailElement.find(".sl-form"), this.emailFromElement = this.emailForm.find(".email-from"), this.emailToElement = this.emailForm.find(".email-to"), this.emailBodyElement = this.emailForm.find(".email-body"), this.emailSubmitButton = this.emailForm.find(".email-submit"), this.emailFormUnits = [], this.emailForm.find(".unit[data-validate]").each(function(t, e) {
            this.emailFormUnits.push(new SL.components.FormUnit(e))
        }.bind(this)), this.emailSubmitButton.on("vclick", this.onEmailSubmitClicked.bind(this)), this.emailSubmitLoader = Ladda.create(this.emailSubmitButton.get(0))
    },
    appendTo: function(t) {
        this.domElement.appendTo(t)
    },
    showPage: function(t) {
        this.tabsElement.find(".decksharer-share-options-tab").removeClass("is-selected"), this.pagesElement.find(".decksharer-share-options-page").removeClass("is-selected"), this.tabsElement.find('[data-id="' + t + '"]').addClass("is-selected"), this.pagesElement.find('[data-id="' + t + '"]').addClass("is-selected"), this.pageChanged.dispatch(t)
    },
    getPageID: function() {
        return this.tabsElement.find(".is-selected").attr("data-id")
    },
    generate: function() {
        var t = this.getShareURLs();
        if (this.embedOutputElement) {
            var e = '<iframe src="' + t.embed + '" width="' + this.width + '" height="' + this.height + '" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
            this.embedOutputElement.text(e)
        }
        var i = this.fullscreenInput && this.fullscreenInput.is(":checked") ? t.fullscreen : t.show;
        this.linkInput && this.linkInput.val(i), this.linkAnchor && this.linkAnchor.attr("href", i).text(i), this.emailElement && (SL.current_user && this.emailFromElement.val(SL.current_user.getNameOrSlug()), this.emailBodyElement.val(this.deck.has("title") && "deck" !== this.deck.get("title") ? 'Check out this deck "' + this.deck.get("title") + '"' : "Check out this deck"))
    },
    getShareURLs: function() {
        var t = {
                show: this.deck.getURL({
                    protocol: "http:",
                    view: this.options.deckView
                }),
                fullscreen: this.deck.getURL({
                    protocol: "http:",
                    view: "fullscreen"
                }),
                embed: this.deck.getURL({
                    protocol: "",
                    view: "embed"
                })
            },
            e = [];
        return this.options.token && this.options.token.has("token") && e.push("token=" + this.options.token.get("token")), t.show += e.length ? "?" + e.join("&") : "", t.fullscreen += e.length ? "?" + e.join("&") : "", "string" == typeof this.style && this.style.length > 0 && e.push("style=" + this.style), t.embed += e.length ? "?" + e.join("&") : "", t
    },
    onEmbedOutputMouseDown: function(t) {
        t.preventDefault(), this.embedOutputElement.focus().select(), SL.analytics.track("Decksharer: Embed code selected")
    },
    onLinkInputMouseDown: function(t) {
        t.preventDefault(), $(t.target).focus().select(), SL.analytics.track("Decksharer: URL selected")
    },
    onLinkFullscreenToggled: function() {
        this.generate(), SL.analytics.track("Decksharer: URL fullscreen toggled")
    },
    onEmbedSizeChanged: function() {
        this.width = parseInt(this.embedWidthElement.val(), 10) || 1, this.height = parseInt(this.embedHeightElement.val(), 10) || 1, this.generate()
    },
    onEmbedStyleChanged: function() {
        this.style = this.embedStyleElement.val(), this.generate()
    },
    onEmailSubmitClicked: function(t) {
        var e = this.emailFormUnits.every(function(t) {
            return t.beforeSubmit()
        });
        if (e && !this.emailXHR) {
            SL.analytics.track("Decksharer: Submit email");
            var i = this.emailFromElement.val(),
                n = this.emailToElement.val(),
                s = this.emailBodyElement.val();
            this.emailSubmitLoader.start(), n = n.split(","), n = n.map(function(t) {
                return t.trim()
            }), n = n.join(",");
            var o = {
                deck_share: {
                    emails: n,
                    from: i,
                    body: s
                }
            };
            this.options.token && (o.deck_share.access_token_id = this.options.token.get("id")), this.emailXHR = $.ajax({
                url: SL.config.AJAX_SHARE_DECK_VIA_EMAIL(this.deck.get("id")),
                type: "POST",
                context: this,
                data: o
            }).done(function() {
                this.emailSuccess.addClass("visible"), setTimeout(function() {
                    this.emailSuccess.removeClass("visible"), this.emailToElement.val(""), this.emailBodyElement.val(""), this.generate()
                }.bind(this), 3e3), SL.analytics.track("Decksharer: Submit email success")
            }).fail(function() {
                SL.notify("Failed to send email", "negative"), SL.analytics.track("Decksharer: Submit email error")
            }).always(function() {
                this.emailXHR = null, this.emailSubmitLoader.stop()
            })
        }
        t.preventDefault()
    },
    destroy: function() {
        this.pageChanged.dispose(), this.deck = null, this.domElement.remove()
    }
}),
SL.components.decksharer.ShareOptions.DEFAULT_WIDTH = 576,
SL.components.decksharer.ShareOptions.DEFAULT_HEIGHT = 420,
SL.components.decksharer.ShareOptions.LINK_PAGE_ID = "link",
SL.components.decksharer.ShareOptions.EMBED_PAGE_ID = "embed",
SL.components.decksharer.ShareOptions.EMAIL_PAGE_ID = "email",
SL("components.decksharer").TokenList = Class.extend({
    init: function(t, e) {
        this.deck = t, this.tokens = e, this.tokenSelected = new signals.Signal, this.tokensEmptied = new signals.Signal, this.render()
    },
    render: function() {
        this.domElement = $('<div class="decksharer-token-list">'), this.listItems = $('<div class="decksharer-token-list-items">').appendTo(this.domElement), this.createButton = $(['<div class="decksharer-token-list-create ladda-button" data-style="zoom-out" data-spinner-color="#222">', '<span class="icon i-plus"></span>', "</div>"].join("")), this.createButton.on("vclick", this.create.bind(this)), this.createButton.appendTo(this.domElement), this.createButtonLoader = Ladda.create(this.createButton.get(0)), this.tokens.forEach(this.renderToken.bind(this)), this.scrollShadow = new SL.components.ScrollShadow({
            parentElement: this.domElement,
            contentElement: this.listItems,
            footerElement: this.createButton,
            resizeContent: !1
        })
    },
    renderToken: function(t) {
        var e = t.get("deck_view_count") || 0,
            i = e + " " + SL.util.string.pluralize("view", "s", 1 !== e),
            n = $(['<div class="decksharer-token-list-item" data-id="' + t.get("id") + '">', '<span class="label"></span>', '<div class="meta">', '<span class="views">' + i + "</span>", '<span class="icon i-x delete" data-tooltip="Delete link"></span>', "</div>", "</div>"].join(""));
        n.appendTo(this.listItems), n.on("vclick", function(e) {
            if ($(e.target).closest(".delete").length > 0) {
                SL.prompt({
                    anchor: n,
                    alignment: "r",
                    title: "Are you sure you want to delete this link? It will stop working for anyone you have already shared it with.",
                    type: "select",
                    data: [{
                        html: "<h3>Cancel</h3>"
                    }, {
                        html: "<h3>Delete</h3>",
                        selected: !0,
                        className: "negative",
                        callback: function() {
                            this.remove(t, n)
                        }.bind(this)
                    }]
                })
            } else this.select(t)
        }.bind(this)), this.setTokenLabel(t)
    },
    setTokenLabel: function(t, e) {
        var i = this.listItems.find(".decksharer-token-list-item[data-id=" + t.get("id") + "]");
        i.length && (e || (e = t.get("name") || t.get("token")), i.find(".label").html(e))
    },
    appendTo: function(t) {
        this.domElement.appendTo(t), this.scrollShadow.sync()
    },
    selectDefault: function() {
        this.select(this.tokens.first()), this.scrollShadow.sync()
    },
    select: function(t) {
        if (t && t !== this.selectedToken) {
            var e = this.listItems.find(".decksharer-token-list-item[data-id=" + t.get("id") + "]");
            e.length && (this.listItems.find(".decksharer-token-list-item").removeClass("is-selected"), e.addClass("is-selected"), this.tokenSelected.dispatch(t), this.selectedToken = t)
        }
    },
    create: function(t) {
        var e = 0 === this.tokens.size();
        t && this.createButtonLoader.start(), SL.data.tokens.create(this.deck.get("id")).then(function(t) {
            SL.analytics.track(e ? "Decksharer: Created first token" : "Decksharer: Created additional token"), this.renderToken(t), this.select(t), this.createButtonLoader.stop(), this.scrollShadow.sync()
        }.bind(this), function() {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), this.createButtonLoader.stop()
        }.bind(this))
    },
    remove: function(t, e) {
        t.destroy().fail(function() {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
        }.bind(this)).done(function() {
            SL.util.anim.collapseListItem(e, function() {
                e.remove(), this.scrollShadow.sync()
            }.bind(this), 300), this.tokens.remove(t), this.selectedToken === t && (this.selectedToken = null, this.selectDefault()), 0 === this.tokens.size() && this.tokensEmptied.dispatch(), SL.analytics.track("Decksharer: Deleted token")
        }.bind(this))
    },
    destroy: function() {
        this.createButtonLoader && this.createButtonLoader.stop(), this.scrollShadow && this.scrollShadow.destroy(), this.tokens = null, this.domElement.remove()
    }
}),
SL("components.decksharer").TokenOptions = Class.extend({
    init: function(t, e, i) {
        this.deck = t, this.token = e, this.options = i, this.tokenRenamed = new signals.Signal, this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="decksharer-token-options">'), this.innerElement = $('<div class="sl-form decksharer-token-options-inner">'), this.innerElement.appendTo(this.domElement), this.namePasswordElement = $('<div class="split-units">'), this.namePasswordElement.appendTo(this.innerElement), this.nameUnit = $(['<div class="unit">', '<label class="form-label" for="token-name">Name</label>', '<p class="unit-description">So you can tell your links apart.</p>', '<input class="input-field" type="text" id="token-name" maxlength="255" />', "</div>"].join("")), this.nameUnit.appendTo(this.namePasswordElement), this.nameInput = this.nameUnit.find("input"), this.nameInput.val(this.token.get("name")), this.passwordUnit = $(['<div class="unit">', '<label class="form-label" for="token-password">Password<span class="optional-label">(optional)</span></label>', '<p class="unit-description">Viewers need to enter this.</p>', '<input class="input-field" type="password" id="token-password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;" maxlength="255" />', "</div>"].join("")), this.passwordUnit.appendTo(this.namePasswordElement), this.passwordInput = this.passwordUnit.find("input"), this.passwordInput.val(this.token.get("password")), this.saveWrapper = $(['<div class="save-wrapper">', '<button class="button l save-button ladda-button" data-style="expand-left" data-spinner-size="26">Save changes</button>', "</div>"].join("")), this.saveWrapper.appendTo(this.innerElement), this.saveButton = this.saveWrapper.find(".button"), this.saveButtonLoader = Ladda.create(this.saveButton.get(0)), this.shareOptions = new SL.components.decksharer.ShareOptions(this.deck, $.extend(this.options, {
            token: this.token
        })), this.shareOptions.appendTo(this.domElement)
    },
    bind: function() {
        this.saveChanges = this.saveChanges.bind(this), this.nameInput.on("input", this.onNameInput.bind(this)), this.passwordInput.on("input", this.onPasswordInput.bind(this)), this.saveButton.on("click", this.saveChanges)
    },
    appendTo: function(t, e) {
        this.domElement.appendTo(t), e || SL.util.dom.calculateStyle(this.domElement), this.domElement.addClass("visible")
    },
    checkUnsavedChanges: function() {
        var t = this.token.get("name") || "",
            e = this.token.get("password") || "",
            i = this.nameInput.val(),
            n = this.passwordInput.val(),
            s = n !== e || i !== t;
        this.domElement.toggleClass("is-unsaved", s)
    },
    saveChanges: function() {
        this.nameInput.val() ? (this.token.set("name", this.nameInput.val()), this.token.set("password", this.passwordInput.val()), this.saveButtonLoader.start(), this.token.save(["name", "password"]).fail(function() {
            this.saveButtonLoader.stop(), SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
        }.bind(this)).done(function() {
            this.saveButtonLoader.stop(), this.domElement.removeClass("is-unsaved")
        }.bind(this))) : SL.notify("Please give the link a name", "negative")
    },
    onNameInput: function() {
        this.tokenRenamed.dispatch(this.token, this.nameInput.val()), this.checkUnsavedChanges()
    },
    onPasswordInput: function() {
        this.checkUnsavedChanges()
    },
    destroy: function() {
        this.tokenRenamed.dispatch(this.token), this.tokenRenamed.dispose(), this.shareOptions && (this.shareOptions.destroy(), this.shareOptions = null), this.saveButtonLoader && this.saveButtonLoader.stop(), this.deck = null, this.token = null, this.domElement.addClass("hidden"), setTimeout(this.domElement.remove.bind(this.domElement), 500)
    }
}),
SL("components.form").Autocomplete = Class.extend({
    init: function(t, e, i) {
        this.inputElement = t, this.searchMethod = e, this.confirmed = new signals.Signal, this.config = $.extend({
            offsetY: 0,
            offsetX: 0,
            className: null
        }, i), this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="sl-autocomplete">'), this.config.className && this.domElement.addClass(this.config.className)
    },
    bind: function() {
        this.onDocumentKeydown = this.onDocumentKeydown.bind(this), this.showSuggestions = this.showSuggestions.bind(this), this.hideSuggestions = this.hideSuggestions.bind(this), this.layout = $.throttle(this.layout, 500, this), this.onInput = $.throttle(this.onInput, 500, this), this.inputElement.on("input", this.onInput), this.inputElement.on("focus", this.onInput), this.inputElement.on("blur", this.hideSuggestions), this.domElement.on("mousedown", this.onClick.bind(this))
    },
    layout: function() {
        var t = this.inputElement.get(0).getBoundingClientRect();
        this.domElement.css({
            top: t.bottom + this.config.offsetY,
            left: t.left + this.config.offsetX,
            width: t.width
        })
    },
    showSuggestions: function(t) {
        var e = t.map(function(t, e) {
            var i = "sl-autocomplete-item" + (0 === e ? " focus" : "");
            return "string" == typeof t && (t = {
                value: t,
                label: t
            }), '<div class="' + i + '" data-value="' + t.value + '">' + t.label + "</div>"
        });
        this.domElement.html(e.join("")), this.domElement.appendTo(document.body), this.layout(), $(window).on("resize", this.layout), SL.keyboard.keydown(this.onDocumentKeydown)
    },
    hideSuggestions: function() {
        this.domElement.detach(), $(window).off("resize", this.layout), SL.keyboard.release(this.onDocumentKeydown)
    },
    focus: function(t) {
        var e = this.domElement.find(".focus");
        e.length || (e = this.domElement.find(".sl-autocomplete-item").first(), e.addClass("focus"));
        var i = t > 0 ? e.next(".sl-autocomplete-item") : e.prev(".sl-autocomplete-item");
        i.length && (e.removeClass("focus"), i.addClass("focus"))
    },
    setValue: function(t) {
        this.inputElement.val(t), this.confirmed.dispatch(t)
    },
    getFocusedValue: function() {
        return this.domElement.find(".focus").attr("data-value")
    },
    destroy: function() {
        this.confirmed.dispose(), this.inputElement.off("input", this.onInput), this.hideSuggestions()
    },
    onInput: function() {
        this.searchMethod(this.inputElement.val()).then(function(t) {
            t.length > 0 ? this.inputElement.is(":focus") && this.showSuggestions(t) : this.hideSuggestions()
        }.bind(this), function() {
            this.hideSuggestions()
        }.bind(this))
    },
    onClick: function(t) {
        var e = $(t.target).closest(".sl-autocomplete-item");
        e.length && (this.setValue(e.attr("data-value")), this.hideSuggestions())
    },
    onDocumentKeydown: function(t) {
        return 27 === t.keyCode ? (this.hideSuggestions(), !1) : 13 === t.keyCode || 9 === t.keyCode ? (this.setValue(this.getFocusedValue()), this.hideSuggestions(), !1) : 38 === t.keyCode ? (this.focus(-1), !1) : 40 === t.keyCode ? (this.focus(1), !1) : !0
    }
}),
SL("components.form").Scripts = Class.extend({
    init: function(t) {
        this.domElement = $(t), this.render(), this.readValues(), this.renderList()
    },
    render: function() {
        this.valueElement = this.domElement.find(".value-holder"), this.listElement = $('<ul class="list">'), this.listElement.delegate("li .remove", "click", this.onListItemRemove.bind(this)), this.listElement.appendTo(this.domElement), this.inputWrapper = $('<div class="input-wrapper"></div>').appendTo(this.domElement), this.inputElement = $('<input type="text" placeholder="https://...">'), this.inputElement.on("keyup", this.onInputKeyUp.bind(this)), this.inputElement.appendTo(this.inputWrapper), this.submitElement = $('<div class="button outline">Add</div>'), this.submitElement.on("click", this.submitInput.bind(this)), this.submitElement.appendTo(this.inputWrapper), this.domElement.parents("form").first().on("submit", this.onFormSubmit.bind(this))
    },
    renderList: function() {
        this.listElement.empty(), this.values.forEach(function(t) {
            this.listElement.append(['<li class="list-item" data-value="' + t + '">', t, '<span class="icon i-x remove"></span>', "</li>"].join(""))
        }.bind(this))
    },
    formatValues: function() {
        for (var t = 0; t < this.values.length; t++) this.values[t] = SL.util.string.trim(this.values[t]), "" === this.values[t] && this.values.splice(t, 1)
    },
    readValues: function() {
        this.values = (this.valueElement.val() || "").split(","), this.formatValues()
    },
    writeValues: function() {
        this.formatValues(), this.valueElement.val(this.values.join(","))
    },
    addValue: function(t) {
        return t = t || "", 0 === t.search(/https\:\/\//gi) ? (this.values.push(t), this.renderList(), this.writeValues(), !0) : 0 === t.search(/http\:\/\//gi) ? (SL.notify("Script must be loaded via HTTPS", "negative"), !1) : (SL.notify("Please enter a valid script URL", "negative"), !1)
    },
    removeValue: function(t) {
        if ("string" == typeof t)
            for (var e = 0; e < this.values.length; e++) this.values[e] === t && this.values.splice(e, 1);
        else "number" == typeof t && this.values.splice(t, 1);
        this.renderList(), this.writeValues()
    },
    submitInput: function() {
        this.addValue(this.inputElement.val()) && this.inputElement.val("")
    },
    onListItemRemove: function(t) {
        var e = $(t.target).parent().index();
        "number" == typeof e && this.removeValue(e)
    },
    onInputKeyUp: function(t) {
        13 === t.keyCode && this.submitInput()
    },
    onFormSubmit: function(t) {
        return this.inputElement.is(":focus") ? (t.preventDefault(), !1) : void 0
    }
}),
SL("components").FormUnit = Class.extend({
    init: function(t) {
        this.domElement = $(t), this.inputElement = this.domElement.find("input, textarea").first(), this.errorElement = $('<div class="error">'), this.errorIcon = $('<span class="icon">!</span>').appendTo(this.errorElement), this.errorMessage = $('<p class="message">!</p>').appendTo(this.errorElement), this.validateType = this.domElement.attr("data-validate"), this.validateTimeout = -1, this.originalValue = this.inputElement.val(), this.originalError = this.domElement.attr("data-error-message"), this.asyncValidatedValue = null, this.clientErrors = [], this.serverErrors = [], this.inputElement.on("input", this.onInput.bind(this)), this.inputElement.on("change", this.onInputChange.bind(this)), this.inputElement.on("focus", this.onInputFocus.bind(this)), this.inputElement.on("blur", this.onInputBlur.bind(this)), this.inputElement.on("invalid", this.onInputInvalid.bind(this)), this.domElement.parents("form").first().on("submit", this.onFormSubmit.bind(this)), this.originalError && (this.domElement.removeClass("hidden"), this.validate(), this.inputElement.focus()), this.domElement.data("controller", this)
    },
    validate: function(t) {
        clearTimeout(this.validateTimeout);
        var e = this.inputElement.val();
        if ("string" != typeof e) return this.serverErrors = [], this.clientErrors = [], void this.render();
        if (e === this.originalValue && (this.originalValue || "password" === this.validateType) && this.originalError) this.clientErrors = [this.originalError];
        else if (e.length) {
            var i = SL.util.validate[this.validateType];
            "function" == typeof i ? this.clientErrors = i(e) : console.log('Could not find validation method of type "' + this.validateType + '"')
        } else this.clientErrors = [], t && this.isRequired() && this.clientErrors.push(SL.locale.FORM_ERROR_REQUIRED);
        return this.validateAsync(), this.render(), 0 === this.clientErrors.length && 0 === this.serverErrors.length
    },
    validateAsync: function() {
        if ("username" === this.validateType) {
            var t = SLConfig && SLConfig.current_user ? SLConfig.current_user.username : "",
                e = this.inputElement.val();
            0 === SL.util.validate.username(e).length && (t && e === t ? (this.asyncValidatedValue = t, this.serverErrors = []) : e !== this.asyncValidatedValue && $.ajax({
                url: SL.config.AJAX_LOOKUP_USER,
                type: "GET",
                data: {
                    id: e
                },
                context: this,
                statusCode: {
                    204: function() {
                        this.serverErrors = [SL.locale.get("FORM_ERROR_USERNAME_TAKEN")]
                    },
                    404: function() {
                        this.serverErrors = []
                    }
                }
            }).complete(function() {
                this.render(), this.asyncValidatedValue = e
            }))
        } else if ("team_slug" === this.validateType) {
            var i = SL.current_team ? SL.current_team.get("slug") : "",
                n = this.inputElement.val();
            0 === SL.util.validate.team_slug(n).length && (i && n === i ? (this.asyncValidatedValue = i, this.serverErrors = []) : n !== this.asyncValidatedValue && $.ajax({
                url: SL.config.AJAX_LOOKUP_TEAM,
                type: "GET",
                data: {
                    id: n
                },
                context: this,
                statusCode: {
                    204: function() {
                        this.serverErrors = [SL.locale.get("FORM_ERROR_ORGANIZATION_SLUG_TAKEN")]
                    },
                    404: function() {
                        this.serverErrors = []
                    }
                }
            }).complete(function() {
                this.render(), this.asyncValidatedValue = n
            }))
        }
    },
    render: function() {
        var t = this.serverErrors.concat(this.clientErrors);
        t.length ? (this.domElement.addClass("has-error"), this.errorElement.appendTo(this.domElement), this.errorMessage.text(t[0]), setTimeout(function() {
            this.errorElement.addClass("visible")
        }.bind(this), 1)) : (this.domElement.removeClass("has-error"), this.errorElement.removeClass("visible").remove())
    },
    format: function() {
        if ("username" === this.validateType || "team_slug" === this.validateType) {
            var t = this.inputElement.val();
            t && this.inputElement.val(this.inputElement.val().toLowerCase())
        }
        if ("url" === this.validateType) {
            var t = this.inputElement.val();
            t && t.length > 2 && /^http(s?):\/\//gi.test(t) === !1 && this.inputElement.val("http://" + t)
        }
    },
    focus: function() {
        this.inputElement.focus()
    },
    beforeSubmit: function() {
        return this.validate(!0), this.clientErrors.length > 0 || this.serverErrors.length > 0 ? (this.focus(), !1) : !0
    },
    renderImage: function() {
        var t = this.inputElement.get(0);
        if (t.files && t.files[0]) {
            var e = new FileReader;
            e.onload = function(t) {
                var e = this.domElement.find("img"),
                    i = t.target.result;
                e.length ? e.attr("src", i) : $('<img src="' + i + '">').appendTo(this.domElement.find(".image-uploader"))
            }.bind(this), e.readAsDataURL(t.files[0])
        }
    },
    isRequired: function() {
        return !this.domElement.hasClass("hidden") && this.domElement.is("[data-required]")
    },
    isUnchanged: function() {
        return this.inputElement.val() === this.originalValue
    },
    onInput: function() {
        if (clearTimeout(this.validateTimeout), !SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET) {
            var t = 600;
            (this.clientErrors.length || this.serverErrors.length) && (t = 300), this.validateTimeout = setTimeout(this.validate.bind(this), t)
        }
    },
    onInputChange: function(t) {
        this.domElement.hasClass("image") && this.renderImage(t.target), this.validate()
    },
    onInputFocus: function() {
        this.domElement.addClass("focused")
    },
    onInputBlur: function() {
        this.format(), this.domElement.removeClass("focused")
    },
    onInputInvalid: function() {
        return this.beforeSubmit()
    },
    onFormSubmit: function(t) {
        return this.beforeSubmit() === !1 ? (t.preventDefault(), !1) : void 0
    }
}),
SL("components").Header = Class.extend({
    init: function() {
        this.domElement = $(".global-header"), this.renderLogo(), this.renderDropdown(), this.bind()
    },
    renderLogo: function() {
        if ("/" === window.location.pathname) {
            var t = this.domElement.find(".logo-animation");
            t.length && new SL.components.Menu({
                anchor: t,
                anchorSpacing: 10,
                alignment: "b",
                showOnHover: !0,
                options: [{
                    label: "Download logo",
                    url: SL.routes.BRAND_KIT
                }]
            })
        }
    },
    renderDropdown: function() {
        this.dropdown = SL.components.Header.createMainMenu(this.domElement.find(".profile-button .nav-item-anchor"))
    },
    bind: function() {
        this.domElement.hasClass("show-on-scroll") && ($(document).on("mousemove", this.onDocumentMouseMove.bind(this)), $(window).on("scroll", this.onWindowScroll.bind(this)))
    },
    onWindowScroll: function() {
        this.isScrolledDown = $(window).scrollTop() > 30, this.domElement.toggleClass("show", this.isScrolledDown)
    },
    onDocumentMouseMove: function(t) {
        if (!this.isScrolledDown) {
            var e = t.clientY;
            e > 0 && (20 > e && !this.isMouseOver ? (this.domElement.addClass("show"), this.isMouseOver = !0) : e > 80 && this.isMouseOver && 0 === $(t.target).parents(".global-header").length && (this.domElement.removeClass("show"), this.isMouseOver = !1))
        }
    }
}),
SL.components.Header.createMainMenu = function(t) {
    var e = [{
        label: "Profile",
        icon: "home",
        url: SL.routes.USER(SL.current_user.get("username"))
    }, {
        label: "New deck",
        icon: "plus",
        url: SL.routes.DECK_NEW(SL.current_user.get("username"))
    }];
    if (SL.current_user.isEnterpriseManager()) {
        e.push({
            label: "Themes",
            icon: "brush",
            url: SL.routes.THEME_EDITOR
        });
        var i = {
            label: "Settings",
            icon: "cog",
            url: SL.routes.USER_EDIT
        };
        SL.current_team && (i.submenu = [{
            label: "Account settings",
            url: SL.routes.USER_EDIT
        }, {
            label: "Team settings",
            url: SL.routes.TEAM_EDIT(SL.current_team)
        }, {
            label: "Team members",
            url: SL.routes.TEAM_EDIT_MEMBERS(SL.current_team)
        }], SL.current_team.isManuallyUpgraded() || i.submenu.push({
            label: "Billing details",
            url: SL.routes.BILLING_DETAILS
        })), e.push(i)
    } else e.push({
        label: "Settings",
        icon: "cog",
        url: SL.routes.USER_EDIT
    });
    SL.current_user.isManuallyUpgraded() || SL.current_user.isEnterprise() || e.push(SL.current_user.isPro() ? {
        label: "Billing",
        icon: "credit",
        url: SL.routes.BILLING_DETAILS
    } : {
        label: "Upgrade",
        icon: "star",
        url: SL.routes.PRICING
    });
    var n = $(".global-header .nav-item-changelog");
    return n.length && (e.push({
        label: "What's new",
        url: SL.routes.CHANGELOG,
        iconHTML: '<span class="counter"><span class="counter-inner">' + n.attr("data-unread-count") + "</span></span>"
    }), t.find(".nav-item-burger").append('<span class="changelog-indicator"></span>'), t.one("mouseover", function() {
        $(this).find(".changelog-indicator").remove()
    })), e.push({
        label: "Log out",
        icon: "exit",
        url: SL.routes.SIGN_OUT,
        attributes: {
            rel: "nofollow",
            "data-method": "delete"
        }
    }), new SL.components.Menu({
        anchor: t,
        anchorSpacing: 10,
        alignment: "auto",
        minWidth: 160,
        showOnHover: !0,
        options: e
    })
},
SL("components").Kudos = function() {
    function t() {
        $("[data-kudos-value][data-kudos-id]").each(function(t, e) {
            var i = e.getAttribute("data-kudos-id");
            i && !a[i] && (a[i] = e.getAttribute("data-kudos-value"))
        }.bind(this)), $(".kudos-trigger[data-kudos-id]").on("click", function(t) {
            var n = t.currentTarget;
            "true" === n.getAttribute("data-kudoed-by-user") ? i(n.getAttribute("data-kudos-id")) : e(n.getAttribute("data-kudos-id"))
        }.bind(this))
    }

    function e(t) {
        n(t), $.ajax({
            type: "POST",
            url: SL.config.AJAX_KUDO_DECK(t),
            context: this
        }).fail(function() {
            s(t), SL.notify(SL.locale.get("GENERIC_ERROR"))
        })
    }

    function i(t) {
        s(t), $.ajax({
            type: "DELETE",
            url: SL.config.AJAX_UNKUDO_DECK(t),
            context: this
        }).fail(function() {
            n(t), SL.notify(SL.locale.get("GENERIC_ERROR"))
        })
    }

    function n(t) {
        var e = $('.kudos-trigger[data-kudos-id="' + t + '"]');
        e.attr("data-kudoed-by-user", "true"), a[t]++, o(t, a[t]);
        var i = e.find(".kudos-icon");
        i.length && (i.removeClass("bounce"), setTimeout(function() {
            i.addClass("bounce")
        }, 1))
    }

    function s(t) {
        var e = $('.kudos-trigger[data-kudos-id="' + t + '"]');
        e.attr("data-kudoed-by-user", "false"), a[t]--, o(t, a[t]), e.find(".kudos-icon").removeClass("bounce")
    }

    function o(t, e) {
        "number" == typeof a[t] && ("number" == typeof e && (a[t] = e), e = Math.max(a[t], 0), $("[data-kudos-id][data-kudos-value]").each(function(t, i) {
            i.setAttribute("data-kudos-value", e)
        }))
    }
    var a = {};
    t()
}(),
SL("components").Menu = Class.extend({
    init: function(t) {
        if (this.config = $.extend({
                alignment: "auto",
                anchorSpacing: 10,
                minWidth: 0,
                offsetX: 0,
                offsetY: 0,
                options: [],
                showOnHover: !1,
                destroyOnHide: !1,
                touch: /(iphone|ipod|ipad|android|windows\sphone)/gi.test(navigator.userAgent)
            }, t), this.config.anchor = $(this.config.anchor), this.show = this.show.bind(this), this.hide = this.hide.bind(this), this.layout = this.layout.bind(this), this.toggle = this.toggle.bind(this), this.onMouseOver = this.onMouseOver.bind(this), this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this), this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this), this.onDocumentKeydown = this.onDocumentKeydown.bind(this), this.onAnchorFocus = this.onAnchorFocus.bind(this), this.onAnchorBlur = this.onAnchorBlur.bind(this), this.onAnchorFocusKeyDown = this.onAnchorFocusKeyDown.bind(this), this.submenus = [], this.destroyed = new signals.Signal, this.render(), this.renderList(), this.config.anchor.length)
            if (this.config.touch) this.config.anchor.addClass("menu-show-on-touch"), this.config.anchor.on("touchstart pointerdown", function(t) {
                t.preventDefault(), this.toggle()
            }.bind(this)), this.config.anchor.on("click", function(t) {
                t.preventDefault()
            }.bind(this));
            else {
                if (this.config.showOnHover) {
                    this.config.anchor.on("focus", this.onAnchorFocus), this.config.anchor.on("blur", this.onAnchorBlur), this.config.anchor.on("mouseover", this.onMouseOver);
                    try {
                        this.config.anchor.is(":hover") && this.onMouseOver()
                    } catch (e) {}
                }
                this.config.anchor.on("click", this.toggle)
            }
    },
    render: function() {
        this.domElement = $('<div class="sl-menu">'), this.listElement = $('<div class="sl-menu-list">').appendTo(this.domElement), this.arrowElement = $('<div class="sl-menu-arrow">').appendTo(this.domElement), this.hitareaElement = $('<div class="sl-menu-hitarea">').appendTo(this.domElement), this.listElement.css("minWidth", this.config.minWidth + "px")
    },
    renderList: function() {
        this.config.options.forEach(function(t) {
            var e;
            "string" == typeof t.url ? (e = $('<a class="sl-menu-item" href="' + t.url + '">'), "string" == typeof t.urlTarget && e.attr("target", t.urlTarget)) : e = $('<div class="sl-menu-item">'), e.html('<span class="label">' + t.label + "</span>"), e.data("callback", t.callback), e.appendTo(this.listElement), e.on("click", function(t) {
                var e = $(t.currentTarget),
                    i = e.data("callback");
                "function" == typeof i && i.apply(null), this.hide()
            }.bind(this)), t.icon && e.append('<span class="icon i-' + t.icon + '"></span>'), t.attributes && e.attr(t.attributes), t.iconHTML && e.append(t.iconHTML), t.submenu && !this.config.touch && this.submenus.push(new SL.components.Menu({
                anchor: e,
                anchorSpacing: 10,
                alignment: t.submenuAlignment || "rl",
                minWidth: t.submenuWidth || 160,
                showOnHover: !0,
                options: t.submenu
            }))
        }.bind(this)), this.listElement.find(".sl-menu-item:not(:last-child)").after('<div class="sl-menu-divider">')
    },
    bind: function() {
        SL.keyboard.keydown(this.onDocumentKeydown), $(window).on("resize scroll", this.layout), $(document).on("mousedown touchstart pointerdown", this.onDocumentMouseDown)
    },
    unbind: function() {
        SL.keyboard.release(this.onDocumentKeydown), SL.keyboard.release(this.onAnchorFocusKeyDown), $(window).off("resize scroll", this.layout), $(document).off("mousedown touchstart pointerdown", this.onDocumentMouseDown)
    },
    layout: function() {
        if (this.config.anchor.length) {
            var t = this.config.anchor.offset(),
                e = this.config.anchorSpacing,
                i = this.config.alignment,
                n = $(window).scrollLeft(),
                s = $(window).scrollTop(),
                o = t.left + this.config.offsetX,
                a = t.top + this.config.offsetY,
                r = this.config.anchor.outerWidth(),
                l = this.config.anchor.outerHeight(),
                c = this.domElement.outerWidth(),
                d = this.domElement.outerHeight(),
                h = c / 2,
                u = c / 2,
                p = 8;
            switch ("auto" === i && (i = t.top - (d + e + p) < s ? "b" : "t"), "rl" === i && (i = t.left + r + e + p + c < window.innerWidth ? "r" : "l"), this.domElement.attr("data-alignment", i), i) {
                case "t":
                    o += (r - c) / 2, a -= d + e;
                    break;
                case "b":
                    o += (r - c) / 2, a += l + e;
                    break;
                case "l":
                    o -= c + e, a += (l - d) / 2;
                    break;
                case "r":
                    o += r + e, a += (l - d) / 2
            }
            switch (o = Math.min(Math.max(o, n + e), $(window).width() + n - c - e), a = Math.min(Math.max(a, s + e), window.innerHeight + s - d - e), i) {
                case "t":
                    h = t.left - o + r / 2, u = d;
                    break;
                case "b":
                    h = t.left - o + r / 2, u = -p;
                    break;
                case "l":
                    h = c, u = t.top - a + l / 2;
                    break;
                case "r":
                    h = -p, u = t.top - a + l / 2
            }
            this.domElement.css({
                left: o,
                top: a
            }), this.arrowElement.css({
                left: h,
                top: u
            }), this.hitareaElement.css({
                top: -e,
                right: -e,
                bottom: -e,
                left: -e
            })
        }
    },
    focus: function(t) {
        var e = this.listElement.find(".focus");
        if (e.length) {
            var i = t > 0 ? e.nextAll(".sl-menu-item").first() : e.prevAll(".sl-menu-item").first();
            i.length && (e.removeClass("focus"), i.addClass("focus"))
        } else this.listElement.find(".sl-menu-item").first().addClass("focus")
    },
    show: function() {
        this.domElement.removeClass("visible").appendTo(document.body), setTimeout(function() {
            this.domElement.addClass("visible")
        }.bind(this), 1), this.config.anchor.addClass("menu-is-open"), this.layout(), this.bind()
    },
    hide: function() {
        this.listElement.find(".focus").removeClass("focus"), this.config.anchor.removeClass("menu-is-open"), this.domElement.detach(), this.unbind(), $(document).off("mousemove", this.onDocumentMouseMove), this.isMouseOver = !1, clearTimeout(this.hideTimeout), this.config.destroyOnHide === !0 && this.destroy()
    },
    toggle: function() {
        this.isVisible() ? this.hide() : this.show()
    },
    isVisible: function() {
        return this.domElement.parent().length > 0
    },
    hasSubMenu: function() {
        return this.submenus.length > 0
    },
    destroy: function() {
        this.destroyed.dispatch(), this.destroyed.dispose(), this.domElement.remove(), this.unbind(), this.config.anchor.off("click", this.toggle), this.config.anchor.off("hover", this.toggle), this.submenus.forEach(function(t) {
            t.destroy()
        })
    },
    onDocumentKeydown: function(t) {
        if (27 === t.keyCode && (this.hide(), t.preventDefault()), 13 === t.keyCode) {
            var e = this.listElement.find(".focus");
            e.length && (e.trigger("vclick"), t.preventDefault())
        } else 38 === t.keyCode ? (this.focus(-1), t.preventDefault()) : 40 === t.keyCode ? (this.focus(1), t.preventDefault()) : 9 === t.keyCode && t.shiftKey ? (this.focus(-1), t.preventDefault()) : 9 === t.keyCode && (this.focus(1), t.preventDefault())
    },
    onMouseOver: function() {
        this.isMouseOver || ($(document).on("mousemove", this.onDocumentMouseMove), this.hideTimeout = -1, this.isMouseOver = !0, this.show())
    },
    onDocumentMouseMove: function(t) {
        var e = $(t.target),
            i = 0 === e.closest(this.domElement).length && 0 === e.closest(this.config.anchor).length;
        this.hasSubMenu() && (i = 0 === e.closest(".sl-menu").length && 0 === e.closest(this.config.anchor).length), i ? -1 === this.hideTimeout && (clearTimeout(this.hideTimeout), this.hideTimeout = setTimeout(this.hide, 150)) : this.hideTimeout && (clearTimeout(this.hideTimeout), this.hideTimeout = -1)
    },
    onDocumentMouseDown: function(t) {
        var e = $(t.target);
        this.isVisible() && 0 === e.closest(this.domElement).length && 0 === e.closest(this.config.anchor).length && this.hide()
    },
    onAnchorFocus: function() {
        this.isMouseOver || SL.keyboard.keydown(this.onAnchorFocusKeyDown)
    },
    onAnchorBlur: function() {
        SL.keyboard.release(this.onAnchorFocusKeyDown)
    },
    onAnchorFocusKeyDown: function(t) {
        return this.isMouseOver || 13 !== t.keyCode && 32 !== t.keyCode && 40 !== t.keyCode ? !0 : (this.show(), this.focus(), SL.keyboard.release(this.onAnchorFocusKeyDown), !1)
    }
}),
SL("components").Meter = Class.extend({
    init: function(t) {
        this.domElement = $(t), this.labelElement = $('<div class="label">').appendTo(this.domElement), this.progressElement = $('<div class="progress">').appendTo(this.domElement), this.read(), this.paint(), window.m = this
    },
    read: function() {
        switch (this.unit = "", this.type = this.domElement.attr("data-type"), this.value = parseInt(this.domElement.attr("data-value"), 10) || 0, this.total = parseInt(this.domElement.attr("data-total"), 10) || 0, this.type) {
            case "storage":
                var t = 1024,
                    e = 1024 * t,
                    i = 1024 * e;
                this.value < e && this.total < e && (this.value = Math.round(this.value / t), this.total = Math.round(this.total / t), this.unit = "KB"), this.value < i && this.total < i ? (this.value = Math.round(this.value / e), this.total = Math.round(this.total / e), this.unit = "MB") : (this.value = (this.value / i).toFixed(2), this.total = (this.total / i).toFixed(2), this.unit = "GB")
        }
    },
    paint: function() {
        var t = Math.min(Math.max(this.value / this.total, 0), 1) || 0;
        this.labelElement.text(this.value + " / " + this.total + " " + this.unit), this.progressElement.width(100 * t + "%"), 0 === this.total ? this.domElement.attr("data-state", "invalid") : t > .9 ? this.domElement.attr("data-state", "negative") : t > .7 ? this.domElement.attr("data-state", "warning") : this.domElement.attr("data-state", "positive")
    }
}),
SL("components").Notification = Class.extend({
    init: function(t, e) {
        this.html = t, this.options = $.extend({
            type: "",
            duration: 2500 + 15 * this.html.length,
            optional: !0
        }, e), "negative" === this.options.type && (this.options.duration = 1.5 * this.options.duration), this.destroyed = new signals.Signal, this.hideTimeout = -1, this.render(), this.bind(), this.show(), this.layout()
    },
    render: function() {
        0 === $(".sl-notifications").length && $(document.body).append('<div class="sl-notifications"></div>'), this.domElement = $('<p class="sl-notification">').html(this.html).addClass(this.options.type).appendTo($(".sl-notifications"))
    },
    bind: function() {
        this.hide = this.hide.bind(this), this.destroy = this.destroy.bind(this), this.options.optional && (this.domElement.on("mouseenter", this.stopTimeout.bind(this)), this.domElement.on("mouseleave", this.startTimeout.bind(this)), this.domElement.on("click", this.destroy.bind(this)))
    },
    startTimeout: function() {
        this.stopTimeout(), this.hideTimeout = setTimeout(this.hide, this.options.duration)
    },
    stopTimeout: function() {
        clearTimeout(this.hideTimeout)
    },
    show: function() {
        this.isDestroyed !== !0 && setTimeout(function() {
            this.domElement.addClass("show"), this.options && this.options.optional && this.startTimeout()
        }.bind(this), 1)
    },
    hide: function() {
        this.domElement.addClass("hide"), this.hideTimeout = setTimeout(this.destroy.bind(this), 400), this.layout()
    },
    layout: function() {
        var t = 0;
        $(".sl-notification:not(.hide)").get().reverse().forEach(function(e) {
            t -= $(e).outerHeight() + 10, e.style.top = t + "px"
        })
    },
    destroy: function() {
        clearTimeout(this.hideTimeout), this.isDestroyed = !0, this.options = null, this.domElement.remove(), this.layout(), this.destroyed.dispatch(), this.destroyed.dispose(), this.destroy = function() {}
    }
}),
SL.components.RetryNotification = SL.components.Notification.extend({
    init: function(t, e) {
        e = $.extend({
            optional: !1
        }, e), this._super(t, e), this.retryClicked = new signals.Signal
    },
    render: function() {
        this._super(), this.retryOptions = $('<div class="retry-options"></div>'), this.retryOptions.appendTo(this.domElement), this.retryMessage = $('<div class="retry-countdown"></div>'), this.retryButton = $('<button class="button white retry-button">Retry</button>'), this.retryButton.on("vclick", this.onRetryClicked.bind(this)), this.retryButton.appendTo(this.retryOptions)
    },
    bind: function() {
        this._super(), this.updateCountdown = this.updateCountdown.bind(this)
    },
    startCountdown: function(t) {
        clearInterval(this.updateInterval), this.retryStart = Date.now(), this.retryDuration = t, this.updateInterval = setInterval(this.updateCountdown, 250), this.updateCountdown(), this.retryMessage.prependTo(this.retryOptions), this.layout()
    },
    updateCountdown: function() {
        var t = this.retryDuration - (Date.now() - this.retryStart);
        t /= 1e3, this.retryMessage.text(this.retryDuration < 2e3 || 0 >= t ? "Retrying..." : "Retrying in " + Math.ceil(t) + "s")
    },
    disableCountdown: function() {
        clearInterval(this.updateInterval), this.retryMessage.remove(), this.layout()
    },
    onRetryClicked: function() {
        this.retryClicked.dispatch()
    },
    destroy: function() {
        clearInterval(this.updateInterval), this.retryClicked && (this.retryClicked.dispose(), this.retryClicked = null), this._super()
    }
}),
SL.notify = function(t, e) {
    return $(".sl-notifications .sl-notification").last().html() === t && $(".sl-notifications .sl-notification").last().remove(), "string" == typeof e && (e = {
        type: e
    }), new SL.components.Notification(t, e)
},
SL("components").Prompt = Class.extend({
    init: function(t) {
        this.config = $.extend({
            type: "custom",
            data: null,
            anchor: null,
            title: null,
            subtitle: null,
            optional: !0,
            alignment: "auto",
            offsetX: 0,
            offsetY: 0,
            className: null,
            confirmOnEnter: !0,
            destroyAfterConfirm: !0,
            confirmLabel: "OK",
            cancelLabel: "Cancel",
            confirmButton: null,
            cancelButton: null,
            hoverTarget: null,
            hoverClass: "hover"
        }, t), this.onBackgroundClicked = this.onBackgroundClicked.bind(this), this.onDocumentKeydown = this.onDocumentKeydown.bind(this), this.onPromptCancelClicked = this.onPromptCancelClicked.bind(this), this.onPromptConfirmClicked = this.onPromptConfirmClicked.bind(this), this.checkInputStatus = this.checkInputStatus.bind(this), this.layout = this.layout.bind(this), this.confirmed = new signals.Signal, this.canceled = new signals.Signal, this.destroyed = new signals.Signal, this.render()
    },
    render: function() {
        this.domElement = $('<div class="sl-prompt" data-type="' + this.config.type + '">'), this.innerElement = $('<div class="sl-prompt-inner">').appendTo(this.domElement), this.arrowElement = $('<div class="sl-prompt-arrow">').appendTo(this.innerElement), this.config.title && (this.titleElement = $('<h3 class="title">').html(this.config.title).appendTo(this.innerElement)), this.config.subtitle && (this.subtitleElement = $('<h4 class="subtitle">').html(this.config.subtitle).appendTo(this.innerElement), this.titleElement && this.titleElement.addClass("has-subtitle")), this.config.className && this.domElement.addClass(this.config.className), this.config.html && this.innerElement.append(this.config.html), "select" === this.config.type ? this.renderSelect() : "list" === this.config.type ? (this.renderList(), this.renderButtons(this.config.multiselect, !this.config.multiselect)) : "input" === this.config.type ? (this.renderInput(), this.renderButtons(!0, !0)) : this.renderButtons(this.config.confirmButton, this.config.cancelButton)
    },
    renderSelect: function() {
        this.config.data.forEach(function(t) {
            var e = $('<a class="item button outline l">').html(t.html);
            e.data("callback", t.callback), e.appendTo(this.innerElement), e.on("vclick", function(t) {
                var e = $(t.currentTarget).data("callback");
                "function" == typeof e && e.apply(null), this.destroy(), t.preventDefault()
            }.bind(this)), t.focused === !0 && e.addClass("focus"), t.selected === !0 && e.addClass("selected"), "string" == typeof t.className && (e.addClass(t.className), /(negative|positive)/g.test(t.className) && e.removeClass("outline"))
        }.bind(this)), this.domElement.attr("data-length", this.config.data.length)
    },
    renderList: function() {
        this.listElement = $('<div class="list">').appendTo(this.innerElement), this.config.data.forEach(function(t) {
            var e = $('<div class="item">');
            e.html('<span class="title">' + (t.title ? t.title : t.value) + '</span><span class="checkmark icon i-checkmark"></span>'), e.data({
                callback: t.callback,
                value: t.value
            }), e.appendTo(this.listElement), e.on("click", function(e) {
                var i = $(e.currentTarget),
                    n = i.data("callback"),
                    s = i.data("value");
                this.config.multiselect && (i.toggleClass("selected"), t.exclusive ? (i.addClass("selected"), i.siblings().removeClass("selected")) : i.siblings().filter(".exclusive").removeClass("selected")), "function" == typeof n && n.apply(null, [s, i.hasClass("selected")]), this.config.multiselect || (this.confirmed.dispatch(s), this.destroy())
            }.bind(this)), t.focused === !0 && e.addClass("focus"), t.selected === !0 && e.addClass("selected"), t.exclusive === !0 && e.addClass("exclusive"), "string" == typeof t.className && e.addClass(t.className)
        }.bind(this))
    },
    renderInput: function() {
        this.config.data.multiline === !0 ? this.inputElement = $('<textarea cols="40" rows="8">') : (this.inputElement = $('<input type="text">'), "number" == typeof this.config.data.width && (this.inputElement.css("width", this.config.data.width), this.titleElement && this.titleElement.css("max-width", this.config.data.width), this.subtitleElement && this.subtitleElement.css("max-width", this.config.data.width))), this.config.data.value && this.inputElement.val(this.config.data.value), this.config.data.placeholder && this.inputElement.attr("placeholder", this.config.data.placeholder), this.config.data.maxlength && this.inputElement.attr("maxlength", this.config.data.maxlength), this.inputWrapperElement = $('<div class="input-wrapper">').append(this.inputElement), this.inputWrapperElement.appendTo(this.innerElement)
    },
    renderButtons: function(t, e) {
        var i = [];
        e && this.config.optional && this.config.cancelLabel && i.push('<button class="button l outline prompt-cancel">' + this.config.cancelLabel + "</button>"), t && this.config.confirmLabel && i.push('<button class="button l prompt-confirm">' + this.config.confirmLabel + "</button>"), i.length && (this.footerElement = $('<div class="footer">' + i.join("") + "</div>").appendTo(this.innerElement))
    },
    bind: function() {
        $(window).on("resize", this.layout), this.domElement.on("vclick", this.onBackgroundClicked), SL.keyboard.keydown(this.onDocumentKeydown), "hidden" !== $("html").css("overflow") && $(window).on("scroll", this.layout), this.domElement.find(".prompt-cancel").on("vclick", this.onPromptCancelClicked), this.domElement.find(".prompt-confirm").on("vclick", this.onPromptConfirmClicked), this.inputElement && this.inputElement.on("input", this.checkInputStatus)
    },
    unbind: function() {
        $(window).off("resize scroll", this.layout), this.domElement.off("vclick", this.onBackgroundClicked), SL.keyboard.release(this.onDocumentKeydown), this.domElement.find(".prompt-cancel").off("vclick", this.onPromptCancelClicked), this.domElement.find(".prompt-confirm").off("vclick", this.onPromptConfirmClicked), this.inputElement && this.inputElement.off("input", this.checkInputStatus)
    },
    layout: function() {
        var t = 10,
            e = $(window).width(),
            i = window.innerHeight;
        this.innerElement.css({
            "max-width": e - 2 * t,
            "max-height": i - 2 * t
        });
        var n = this.innerElement.outerWidth(),
            s = this.innerElement.outerHeight(),
            o = $(this.config.anchor);
        if (o.length) {
            var a = o.offset(),
                r = 15,
                l = this.config.alignment,
                c = $(window).scrollLeft(),
                d = $(window).scrollTop(),
                h = a.left - c,
                u = a.top - d;
            h += this.config.offsetX, u += this.config.offsetY;
            var p = o.outerWidth(),
                f = o.outerHeight(),
                m = n / 2,
                g = n / 2,
                v = 10,
                b = !0;
            switch ("auto" === l && (l = a.top - (s + r + v) < d ? "b" : "t"), this.domElement.attr("data-alignment", l), l) {
                case "t":
                    h += (p - n) / 2, u -= s + r;
                    break;
                case "b":
                    h += (p - n) / 2, u += f + r;
                    break;
                case "l":
                    h -= n + r, u += (f - s) / 2;
                    break;
                case "r":
                    h += p + r, u += (f - s) / 2
            }
            var S = u;
            switch (h = Math.max(Math.min(h, e - n - t), t), u = Math.max(Math.min(u, i - s - t), t), h = Math.round(h), u = Math.round(u), "b" === l && -f - v > u - S ? b = !1 : "t" === l && u - S > f + v && (b = !1), l) {
                case "t":
                    m = a.left - h - c + p / 2, m = Math.max(Math.min(m, n - v), v), g = s;
                    break;
                case "b":
                    m = a.left - h - c + p / 2, m = Math.max(Math.min(m, n - v), v), g = -v;
                    break;
                case "l":
                    m = n, g = a.top - u - d + f / 2, g = Math.max(Math.min(g, s - v), v);
                    break;
                case "r":
                    m = -v, g = a.top - u - d + f / 2, g = Math.max(Math.min(g, s - v), v)
            }
            this.innerElement.css({
                left: h,
                top: u
            }), this.arrowElement.css({
                left: m,
                top: g
            }).toggle(b)
        } else this.innerElement.css({
            left: Math.round((e - n) / 2),
            top: Math.round(.4 * (i - s))
        }), this.arrowElement.hide()
    },
    focus: function(t) {
        var e = this.innerElement.find(".focus");
        if (e.length || (e = this.innerElement.find(".selected")), e.length) {
            var i = t > 0 ? e.next(".item") : e.prev(".item");
            i.length && (e.removeClass("focus"), i.addClass("focus"))
        } else this.innerElement.find(".item").first().addClass("focus")
    },
    show: function() {
        var t = $(this.config.anchor);
        t.length && t.addClass("focus"), $(this.config.hoverTarget).addClass(this.config.hoverClass), this.domElement.removeClass("visible").appendTo(document.body), setTimeout(function() {
            this.domElement.addClass("visible")
        }.bind(this), 1), this.layout(), this.bind(), this.inputElement && (this.checkInputStatus(), this.inputElement.focus())
    },
    hide: function() {
        var t = $(this.config.anchor);
        t.length && t.removeClass("focus"), $(this.config.hoverTarget).removeClass(this.config.hoverClass), this.domElement.detach(), this.unbind()
    },
    showOverlay: function(t, e, i, n) {
        return clearTimeout(this.overlayTimeout), this.overlay || (this.overlay = $('<div class="sl-prompt-overlay">')), this.overlay.appendTo(this.innerElement), this.overlay.html(i + "<h3>" + e + "</h3>"), this.overlay.attr("data-status", t || "neutral"), this.overlay.addClass("visible"), new Promise(function(t) {
            n ? this.overlayTimeout = setTimeout(function() {
                this.overlay.removeClass("visible"), t()
            }.bind(this), n) : t()
        }.bind(this))
    },
    getValue: function() {
        var t = void 0;
        return "input" === this.config.type && (t = this.inputElement.val()), t
    },
    getDOMElement: function() {
        return this.domElement
    },
    cancel: function() {
        if ("input" === this.config.type && this.config.data.confirmBeforeDiscard) {
            var t = this.config.data.value || "",
                e = this.getValue() || "";
            e !== t ? SL.prompt({
                title: "Discard unsaved changes?",
                type: "select",
                data: [{
                    html: "<h3>Cancel</h3>"
                }, {
                    html: "<h3>Discard</h3>",
                    selected: !0,
                    className: "negative",
                    callback: function() {
                        this.canceled.dispatch(this.getValue()), this.destroy()
                    }.bind(this)
                }]
            }) : (this.canceled.dispatch(this.getValue()), this.destroy())
        } else this.canceled.dispatch(this.getValue()), this.destroy()
    },
    confirm: function() {
        this.confirmed.dispatch(this.getValue()), this.config.destroyAfterConfirm && this.destroy()
    },
    checkInputStatus: function() {
        if (this.config.data.maxlength && !this.config.data.maxlengthHidden) {
            var t = this.inputWrapperElement.find(".input-status");
            0 === t.length && (t = $('<div class="input-status">').appendTo(this.inputWrapperElement));
            var e = this.inputElement.val().length,
                i = this.config.data.maxlength;
            t.text(e + "/" + i), t.toggleClass("negative", e > .95 * i), this.config.data.multiline || this.inputElement.css("padding-right", t.outerWidth() + 5)
        }
    },
    destroy: function() {
        this.destroyed.dispatch(), this.destroyed.dispose();
        var t = $(this.config.anchor);
        t.length && t.removeClass("focus"), $(this.config.hoverTarget).removeClass(this.config.hoverClass), this.domElement.remove(), this.unbind(), this.confirmed.dispose(), this.canceled.dispose()
    },
    onBackgroundClicked: function(t) {
        this.config.optional && $(t.target).is(this.domElement) && (this.cancel(), t.preventDefault())
    },
    onPromptCancelClicked: function(t) {
        this.cancel(), t.preventDefault()
    },
    onPromptConfirmClicked: function(t) {
        this.confirm(), t.preventDefault()
    },
    onDocumentKeydown: function(t) {
        if (27 === t.keyCode) return this.config.optional && this.cancel(), t.preventDefault(), !1;
        if ("select" === this.config.type || "list" === this.config.type)
            if (13 === t.keyCode) {
                var e = this.innerElement.find(".focus");
                0 === e.length && (e = this.innerElement.find(".selected")), e.length && (e.trigger("click"), t.preventDefault())
            } else 37 === t.keyCode || 38 === t.keyCode ? (this.focus(-1), t.preventDefault()) : 39 === t.keyCode || 40 === t.keyCode ? (this.focus(1), t.preventDefault()) : 9 === t.keyCode && t.shiftKey ? (this.focus(-1), t.preventDefault()) : 9 === t.keyCode && (this.focus(1), t.preventDefault());
        return "input" === this.config.type && (13 !== t.keyCode || this.config.data.multiline || this.onPromptConfirmClicked(t)), "custom" === this.config.type && this.config.confirmOnEnter && 13 === t.keyCode && this.onPromptConfirmClicked(t), !0
    }
}),
SL.prompt = function(t) {
    var e = new SL.components.Prompt(t);
    return e.show(), e
},
SL("components").Resizer = Class.extend({
    init: function(t, e) {
        this.domElement = $(t), this.revealElement = this.domElement.closest(".reveal"), this.options = $.extend({
            padding: 10,
            preserveAspectRatio: !1,
            useOverlay: !1
        }, e), this.mouse = {
            x: 0,
            y: 0
        }, this.mouseStart = {
            x: 0,
            y: 0
        }, this.origin = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }, this.resizing = !1, this.domElement.length ? (this.onAnchorMouseDown = this.onAnchorMouseDown.bind(this), this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this), this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this), this.onElementDrop = this.onElementDrop.bind(this), this.layout = this.layout.bind(this), this.build(), this.bind(), this.layout()) : console.warn("Resizer: invalid resize target.")
    },
    build: function() {
        this.options.useOverlay && (this.overlay = $('<div class="editing-ui resizer-overlay"></div>').appendTo(document.body).hide()), this.anchorN = $('<div class="editing-ui resizer-anchor" data-direction="n"></div>').appendTo(document.body), this.anchorE = $('<div class="editing-ui resizer-anchor" data-direction="e"></div>').appendTo(document.body), this.anchorS = $('<div class="editing-ui resizer-anchor" data-direction="s"></div>').appendTo(document.body), this.anchorW = $('<div class="editing-ui resizer-anchor" data-direction="w"></div>').appendTo(document.body)
    },
    bind: function() {
        this.resizeStarted = new signals.Signal, this.resizeUpdated = new signals.Signal, this.resizeEnded = new signals.Signal, this.getAnchors().on("mousedown", this.onAnchorMouseDown), this.revealElement.on("drop", this.onElementDrop), $(document).on("keyup", this.layout), $(document).on("mouseup", this.layout), $(document).on("mousewheel", this.layout), $(document).on("DOMMouseScroll", this.layout), $(window).on("resize", this.layout)
    },
    layout: function() {
        if (!this.destroyIfDetached()) {
            var t = SL.util.getRevealElementGlobalOffset(this.domElement),
                e = Reveal.getScale(),
                i = parseInt(this.domElement.css("margin-right"), 10);
            marginBottom = parseInt(this.domElement.css("margin-bottom"), 10);
            var n = t.x - this.options.padding,
                s = t.y - this.options.padding,
                o = (this.domElement.width() + i) * e + 2 * this.options.padding;
            height = (this.domElement.height() + marginBottom) * e + 2 * this.options.padding;
            var a = -this.anchorN.outerWidth() / 2;
            this.anchorN.css({
                left: n + o / 2 + a,
                top: s + a
            }), this.anchorE.css({
                left: n + o + a,
                top: s + height / 2 + a
            }), this.anchorS.css({
                left: n + o / 2 + a,
                top: s + height + a
            }), this.anchorW.css({
                left: n + a,
                top: s + height / 2 + a
            }), this.overlay && this.overlay.css({
                left: n,
                top: s,
                width: o,
                height: height
            })
        }
    },
    show: function() {
        this.getAnchors().addClass("visible"), this.layout()
    },
    hide: function() {
        this.getAnchors().removeClass("visible")
    },
    destroyIfDetached: function() {
        return 0 === this.domElement.closest("body").length ? (this.destroy(), !0) : !1
    },
    getOptions: function() {
        return this.options
    },
    getAnchors: function() {
        return this.anchorN.add(this.anchorE).add(this.anchorS).add(this.anchorW)
    },
    isResizing: function() {
        return !!this.resizing
    },
    isDestroyed: function() {
        return !!this.destroyed
    },
    onAnchorMouseDown: function(t) {
        var e = $(t.target).attr("data-direction");
        if (e) {
            t.preventDefault(), this.resizeDirection = e, this.mouseStart.x = t.clientX, this.mouseStart.y = t.clientY;
            var i = SL.util.getRevealElementOffset(this.domElement);
            this.origin.x = i.x, this.origin.y = i.y, this.origin.width = this.domElement.width(), this.origin.height = this.domElement.height(), this.overlay && this.overlay.show(), this.resizing = !0, $(document).on("mousemove", this.onDocumentMouseMove), $(document).on("mouseup", this.onDocumentMouseUp), this.resizeStarted.dispatch()
        }
    },
    onDocumentMouseMove: function(t) {
        if (!this.destroyIfDetached() && (this.mouse.x = t.clientX, this.mouse.y = t.clientY, this.resizing)) {
            var e = Reveal.getScale(),
                i = (this.mouse.x - this.mouseStart.x) / e,
                n = (this.mouse.y - this.mouseStart.y) / e,
                s = "",
                o = "";
            switch (this.resizeDirection) {
                case "e":
                    s = Math.max(this.origin.width + i, 1);
                    break;
                case "w":
                    s = Math.max(this.origin.width - i, 1);
                    break;
                case "s":
                    o = Math.max(this.origin.height + n, 1);
                    break;
                case "n":
                    o = Math.max(this.origin.height - n, 1)
            }
            if (this.options.preserveAspectRatio ? ("" === s && (s = this.origin.width * (o / this.origin.height)), "" === o && (o = this.origin.height * (s / this.origin.width))) : ("" === s && (s = this.domElement.css("width")), "" === o && (o = this.domElement.css("height"))), "absolute" === this.domElement.css("position") && ("n" === this.resizeDirection || "w" === this.resizeDirection)) switch (this.resizeDirection) {
                case "w":
                    this.domElement.css("left", Math.round(this.origin.x + i));
                    break;
                case "n":
                    this.domElement.css("top", Math.round(this.origin.y + n))
            }
            this.domElement.css({
                width: s ? s : "",
                height: o ? o : "",
                maxHeight: "none",
                maxWidth: "none"
            }), this.layout(), this.resizeUpdated.dispatch()
        }
    },
    onDocumentMouseUp: function() {
        this.resizing = !1, $(document).off("mousemove", this.onDocumentMouseMove), $(document).off("mouseup", this.onDocumentMouseUp), this.overlay && this.overlay.hide(), this.resizeEnded.dispatch()
    },
    onElementDrop: function() {
        setTimeout(this.layout, 1)
    },
    destroy: function() {
        this.destroyed || (this.destroyed = !0, this.resizeStarted.dispose(), this.resizeUpdated.dispose(), this.resizeEnded.dispose(), $(document).off("mousemove", this.onDocumentMouseMove), $(document).off("mouseup", this.onDocumentMouseUp), $(document).off("keyup", this.layout), $(document).off("mouseup", this.layout), $(document).off("mousewheel", this.layout), $(document).off("DOMMouseScroll", this.layout), $(window).off("resize", this.layout), this.revealElement.off("drop", this.onElementDrop), this.getAnchors().off("mousedown", this.onAnchorMouseDown), this.anchorN.remove(), this.anchorE.remove(), this.anchorS.remove(), this.anchorW.remove(), this.overlay && this.overlay.remove())
    }
}),
SL.components.Resizer.delegateOnHover = function(t, e, i) {
    function n() {
        c && (c.destroy(), c = null, $(document).off("mousemove", a), $(document).off("mouseup", r))
    }

    function s(t, e) {
        if (c && c.isResizing()) return !1;
        if (c && d && !d.is(t) && n(), !c) {
            var s = {};
            $.extend(s, i), $.extend(s, e), d = $(t), c = new SL.components.Resizer(d, s), c.resizeUpdated.add(l), c.show(), $(document).on("mousemove", a), $(document).on("mouseup", r)
        }
    }

    function o(t) {
        var e = $(t.currentTarget),
            i = null;
        e.data("resizer-options") && (i = e.data("resizer-options")), e.data("target-element") && (e = e.data("target-element")), s(e, i)
    }

    function a(t) {
        if (c)
            if (c.isDestroyed()) n();
            else if (!c.isResizing()) {
                var e = Reveal.getScale(),
                    i = SL.util.getRevealElementGlobalOffset(d),
                    s = 3 * c.getOptions().padding,
                    o = {
                        top: i.y - s,
                        right: i.x + d.outerWidth(!0) * e + s,
                        bottom: i.y + d.outerHeight(!0) * e + s,
                        left: i.x - s
                    };
                (t.clientX < o.left || t.clientX > o.right || t.clientY < o.top || t.clientY > o.bottom) && n()
            }
    }

    function r(t) {
        setTimeout(function() {
            a(t)
        }, 1)
    }

    function l() {
        h.dispatch(d)
    }
    t.delegate(e, "mouseover", o);
    var c = null,
        d = null,
        h = new signals.Signal;
    return {
        show: s,
        updated: h,
        layout: function() {
            c && c.layout()
        },
        destroy: function() {
            n(), h.dispose(), t.undelegate(e, "mouseover", o)
        }
    }
},
SL("components").ScrollShadow = Class.extend({
    init: function(t) {
        this.options = $.extend({
            threshold: 20,
            shadowSize: 10,
            resizeContent: !0
        }, t), this.bind(), this.render(), this.layout()
    },
    bind: function() {
        this.layout = this.layout.bind(this), this.sync = this.sync.bind(this), this.onScroll = $.throttle(this.onScroll.bind(this), 100), $(window).on("resize", this.layout), this.options.contentElement.on("scroll", this.onScroll)
    },
    render: function() {
        this.shadowTop = $('<div class="sl-scroll-shadow-top">').appendTo(this.options.parentElement), this.shadowBottom = $('<div class="sl-scroll-shadow-bottom">').appendTo(this.options.parentElement), this.shadowTop.height(this.options.shadowSize), this.shadowBottom.height(this.options.shadowSize)
    },
    layout: function() {
        var t = this.options.parentElement.height(),
            e = this.options.footerElement ? this.options.footerElement.outerHeight() : 0,
            i = this.options.headerElement ? this.options.headerElement.outerHeight() : 0;
        (this.options.resizeContent && this.options.footerElement || this.options.headerElement) && this.options.contentElement.css("height", t - e - i), this.sync()
    },
    sync: function() {
        var t = this.options.footerElement ? this.options.footerElement.outerHeight() : 0,
            e = this.options.headerElement ? this.options.headerElement.outerHeight() : 0,
            i = this.options.contentElement.scrollTop(),
            n = this.options.contentElement.prop("scrollHeight"),
            s = this.options.contentElement.outerHeight(),
            o = n > s + this.options.threshold,
            a = i / (n - s);
        this.shadowTop.css({
            opacity: o ? a : 0,
            top: e
        }), this.shadowBottom.css({
            opacity: o ? 1 - a : 0,
            bottom: t
        })
    },
    onScroll: function() {
        this.sync()
    },
    destroy: function() {
        $(window).off("resize", this.layout), this.options.contentElement.off("scroll", this.onScroll), this.options = null
    }
}),
SL("components").Search = Class.extend({
    init: function(t) {
        this.config = t, this.searchForm = $(".search .search-form"), this.searchFormInput = this.searchForm.find(".search-term"), this.searchFormSubmit = this.searchForm.find(".search-submit"), this.searchResults = $(".search .search-results"), this.searchResultsHeader = this.searchResults.find("header"), this.searchResultsTitle = this.searchResults.find(".search-results-title"), this.searchResultsSorting = this.searchResults.find(".search-results-sorting"), this.searchResultsList = this.searchResults.find("ul"), this.searchFormLoader = Ladda.create(this.searchFormSubmit.get(0)), this.bind(), this.checkQuery()
    },
    bind: function() {
        this.searchForm.on("submit", this.onSearchFormSubmit.bind(this)), this.searchResultsSorting.find("input[type=radio]").on("click", this.onSearchSortingChange.bind(this))
    },
    checkQuery: function() {
        var t = SL.util.getQuery();
        t.search && !this.searchFormInput.val() && (this.searchFormInput.val(t.search), t.page ? this.search(t.search, parseInt(t.page, 10)) : this.search(t.search))
    },
    renderSearchResults: function(t) {
        if ($(".search").removeClass("empty"), this.searchResults.show(), this.searchResultsList.empty(), this.renderSearchPagination(t), t.results && t.results.length) {
            this.searchResultsTitle.text(t.total + " " + SL.util.string.pluralize("result", "s", t.total > 1) + ' for "' + this.searchTerm + '"');
            for (var e = 0, i = t.results.length; i > e; e++) {
                var n = t.results[e];
                n.user && this.searchResultsList.append(SL.util.html.createDeckThumbnail(n))
            }
        } else this.searchResultsTitle.text(t.error || SL.locale.get("SEARCH_NO_RESULTS_FOR", {
            term: this.searchTerm
        }))
    },
    renderSearchPagination: function(t) {
        "undefined" == typeof t.decks_per_page && (t.decks_per_page = 8);
        var e = Math.ceil(t.total / t.decks_per_page);
        this.searchPagination && this.searchPagination.remove(), e > 1 && (this.searchPagination = $('<div class="search-results-pagination"></div>').appendTo(this.searchResultsHeader), this.searchPagination.append('<span class="page">' + SL.locale.get("SEARCH_PAGINATION_PAGE") + " " + this.searchPage + "/" + e + "</span>"), this.searchPage > 1 && this.searchPagination.append('<button class="button outline previous">' + SL.locale.get("PREVIOUS") + "</button>"), this.searchPagination.append('<button class="button outline next">' + SL.locale.get("NEXT") + "</button>"), this.searchPagination.find("button.previous").on("click", function() {
            this.search(this.searchTerm, Math.max(this.searchPage - 1, 1))
        }.bind(this)), this.searchPagination.find("button.next").on("click", function() {
            this.search(this.searchTerm, Math.min(this.searchPage + 1, e))
        }.bind(this)))
    },
    search: function(t, e, i) {
        if (this.searchTerm = t || this.searchFormInput.val(), this.searchPage = e || 1, this.searchSort = i || this.searchSort, window.history && "function" == typeof window.history.replaceState) {
            var n = "?search=" + escape(this.searchTerm);
            e > 1 && (n += "&page=" + e), window.history.replaceState(null, null, "/explore" + n)
        }
        this.searchSort || (this.searchSort = this.searchResultsSorting.find("input[type=radio]:checked").val()), this.searchResultsSorting.find("input[type=radio]").prop("checked", !1), this.searchResultsSorting.find("input[type=radio][value=" + this.searchSort + "]").prop("checked", !0), this.searchTerm ? (this.searchFormLoader.start(), $.ajax({
            type: "GET",
            url: this.config.url,
            context: this,
            data: {
                q: this.searchTerm,
                page: this.searchPage,
                sort: this.searchSort
            }
        }).done(function(t) {
            this.renderSearchResults(t)
        }).fail(function() {
            this.renderSearchResults({
                error: SL.locale.get("SEARCH_SERVER_ERROR")
            })
        }).always(function() {
            this.searchFormLoader.stop()
        })) : SL.notify(SL.locale.get("SEARCH_NO_TERM_ERROR"))
    },
    sort: function(t) {
        this.search(this.searchTerm, this.searchPage, t)
    },
    onSearchFormSubmit: function(t) {
        return this.search(), t.preventDefault(), !1
    },
    onSearchSortingChange: function() {
        this.sort(this.searchResultsSorting.find("input[type=radio]:checked").val())
    }
}),
SL("components").TemplatesPage = Class.extend({
    init: function(t) {
        this.options = t || {}, this.templateSelected = new signals.Signal, this.render()
    },
    render: function() {
        this.domElement = $('<div class="page" data-page-id="' + this.options.id + '">'), this.actionList = $('<div class="action-list">').appendTo(this.domElement), this.templateList = $("<div>").appendTo(this.domElement), this.options.templates.forEach(this.renderTemplate.bind(this)), (this.isDefaultTemplates() || this.isTeamTemplates() && this.getNumberOfVisibleTemplates() > 0) && (this.blankTemplate = this.renderBlankTemplate(), this.duplicateTemplate = this.renderDuplicateTemplate())
    },
    renderBlankTemplate: function(t) {
        return t = $.extend({
            container: this.actionList,
            editable: !1
        }, t), this.renderTemplate(new SL.models.Template({
            label: "Blank",
            html: ""
        }), t)
    },
    renderDuplicateTemplate: function(t, e) {
        //var bgImgVal = (SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != "") ? SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") : ($("#params_clm_edidtor").attr("data-bg-pres-img") != "" ? $("#params_clm_edidtor").attr("data-bg-pres-img") : "none");
        var bgImgVal,
            bgColorVal,
            customNavbarAppearance,
            setScreenImg,
            setScreenColor,
            setCustomNavbarAppearance;

        if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != ""){
            bgImgVal = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img");
            setScreenImg = true;
        }
        else{
            bgImgVal = TWIG.parameters.dataBgPresImg;
            setScreenImg = false;
        }

        if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color") != ""){
            bgColorVal = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color");
            setScreenColor = true;
        }
        else{
            bgColorVal = TWIG.parameters.dataBgPresColor;
            setScreenColor = false;
        }


        if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != ""){
            setCustomNavbarAppearance = true;
            customNavbarAppearance = SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance");
        }
        else{
            setCustomNavbarAppearance = false;
            customNavbarAppearance = "standard";
        }

        //console.log("bgImgVal: " + bgImgVal);
        e += "<span class='duplicate-template-item-params' data-template-item-bgimg='" + bgImgVal + "' data-bg-screen-color='" + bgColorVal + "' data-template-item-bgcolor='" + bgColorVal + "' data-template-item-bgsize='" + SL.editor.controllers.Markup.getCurrentSlide().css("background-size") + "' data-template-item-navbarappearance='" + customNavbarAppearance + "' data-set-screen-img='" + setScreenImg + "' data-set-screen-color='" + setScreenColor + "' data-set-custom-navbarappearance='" + setCustomNavbarAppearance + "'></span>";
        return t = $.extend({
            container: this.actionList,
            editable: !1
        }, t), this.renderTemplate(new SL.models.Template({
            label: "Duplicate",
            html: e || ""
        }), t)
    },    /*renderDuplicateTemplate: function(t, e) {
        //var bgImgVal = (SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != "") ? SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") : ($("#params_clm_edidtor").attr("data-bg-pres-img") != "" ? $("#params_clm_edidtor").attr("data-bg-pres-img") : "none");
        var bgImgVal,
            bgColorVal,
            customNavbarAppearance,
            setScreenImg,
            setScreenColor,
            setCustomNavbarAppearance;
        if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img") != ""){
            bgImgVal = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-img");
            setScreenImg = true;
        }
        else{
            setScreenImg = false;
            if($("#params_clm_edidtor").attr("data-bg-pres-img") != ""){
                bgImgVal = $("#params_clm_edidtor").attr("data-bg-pres-img");
            }
            else{
                bgImgVal = "none";
            }
        }
        if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color") != ""){
            bgColorVal = SL.editor.controllers.Markup.getCurrentSlide().attr("data-bg-screen-color");
            setScreenColor = true;
        }
        else{
            setScreenColor = false;
            if($("#params_clm_edidtor").attr("data-bg-pres-color") != ""){
                bgColorVal = $("#params_clm_edidtor").attr("data-bg-pres-color");
            }
            else{
                bgColorVal = "#ffffff";
            }

        }
        if(SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != undefined && SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance") != ""){
            setCustomNavbarAppearance = true;
            customNavbarAppearance = SL.editor.controllers.Markup.getCurrentSlide().attr("data-custom-navbar-appearance");
        }
        else{
            setCustomNavbarAppearance = false;
            customNavbarAppearance = "standard";
        }

        //console.log("bgImgVal: " + bgImgVal);
        e += "<span class='duplicate-template-item-params' data-template-item-bgimg='" + bgImgVal + "' data-template-item-bgcolor='" + bgColorVal + "' data-template-item-bgsize='" + SL.editor.controllers.Markup.getCurrentSlide().css("background-size") + "' data-template-item-navbarappearance='" + customNavbarAppearance + "' data-set-screen-img='" + setScreenImg + "' data-set-screen-color='" + setScreenColor + "' data-set-custom-navbarappearance='" + setCustomNavbarAppearance + "'></span>";
        return t = $.extend({
            container: this.actionList,
            editable: !1
        }, t), this.renderTemplate(new SL.models.Template({
            label: "Duplicate",
            html: e || ""
        }), t)
    },*/
    renderTemplate: function(t, e) {
        e = $.extend({
            prepend: !1,
            editable: !0,
            container: this.templateList
        }, e);
        var i = $('<div class="template-item">');
        i.html(['<div class="template-item-thumb themed">', '<div class="template-item-thumb-content reveal reveal-thumbnail ready">', '<div class="slides">', t.get("html"), "</div>", '<div class="backgrounds"></div>', "</div>", "</div>"].join("")), i.data("template-model", t), i.on("vclick", this.onTemplateSelected.bind(this, i)), i.find(".slides>section").addClass("present"), i.find('.sl-block[data-block-type="code"] pre').addClass("hljs"), t.get("label") && i.append('<span class="template-item-label">' + t.get("label") + "</span>"), e.replaceTemplate ? e.replaceTemplate.replaceWith(i) : e.replaceTemplateAt ? e.container.find(".template-item").eq(e.replaceTemplateAt).replaceWith(i) : e.prepend ? e.container.prepend(i) : e.container.append(i);
        var n = i.find("section").attr("data-background-color"),
            s = i.find("section").attr("data-background-image"),
            o = i.find("section").attr("data-background-size"),
            a = $('<div class="slide-background present template-item-thumb-background">');
        if (a.addClass(i.find(".template-item-thumb .reveal section").attr("class")), a.appendTo(i.find(".template-item-thumb .reveal>.backgrounds")), (n || s) && (n && a.css("background-color", n), s && a.css("background-image", 'url("' + s + '")'), o && a.css("background-size", o)), this.isEditable() && e.editable) {
            var r = $('<div class="template-item-options"></div>').appendTo(i),
                l = $('<div class="option"><span class="icon i-trash-stroke"></span></div>');
            if (l.attr("data-tooltip", "Delete this template"), l.on("vclick", this.onTemplateDeleteClicked.bind(this, i)), l.appendTo(r), this.isTeamTemplates() && SL.current_user.getThemes().size() > 1) {
                var c = $('<div class="option"><span class="icon i-ellipsis-v"></span></div>');
                c.attr("data-tooltip", "Theme availability"), c.on("vclick", this.onTemplateThemeClicked.bind(this, i)), c.appendTo(r)
            }
        }
        return i
    },
    refresh: function() {
        this.duplicateTemplate && this.duplicateTemplate.length && (this.duplicateTemplate = this.renderDuplicateTemplate({
            replaceTemplate: this.duplicateTemplate
        }, SL.data.templates.templatize(Reveal.getCurrentSlide()))), this.templateList.find(".placeholder").remove();
        var t = SL.view.getCurrentTheme(),
            e = this.domElement.find(".template-item");
        if (this.isTeamTemplates() && e.each(function(e, i) {
                var n = $(i),
                    s = n.data("template-model").isAvailableForTheme(t);
                n.toggleClass(SL.current_user.isEnterpriseManager() ? "semi-hidden" : "hidden", !s)
            }.bind(this)), e = this.domElement.find(".template-item:not(.hidden)"), e.length) e.each(function(e, i) {
            var n = $(i),
                s = (n.data("template-model"), n.find(".template-item-thumb"));
            s.attr("class", s.attr("class").replace(/theme\-(font|color)\-([a-z0-9-])*/gi, "")), s.addClass("theme-font-" + t.get("font")), s.addClass("theme-color-" + t.get("color")), s.find(".template-item-thumb-content img[data-src]").each(function() {
                this.setAttribute("src", this.getAttribute("data-src")), this.removeAttribute("data-src")
            }),
                SL.data.templates.layoutTemplate(s.find("section"), !0)
        }.bind(this)), this.templateList.find(".placeholder").remove();
        else {
            var i = "You haven't saved any custom templates yet.<br>Click the button below to save one now.";
            this.isTeamTemplates() && (i = SL.current_user.isEnterpriseManager() ? "Templates saved here are made available to the everyone in your team." : "No templates are available for the current theme."), this.templateList.append('<p class="placeholder">' + i + "</p>")
        }
    },
    appendTo: function(t) {
        this.domElement.appendTo(t)
    },
    saveCurrentSlide: function() {
        var t = SL.config.AJAX_SLIDE_TEMPLATES_CREATE;
        return this.isTeamTemplates() && (t = SL.config.AJAX_TEAM_SLIDE_TEMPLATES_CREATE), $.ajax({
            type: "POST",
            url: t,
            context: this,
            data: {
                slide_template: {
                    html: SL.data.templates.templatize(Reveal.getCurrentSlide())
                }
            }
        }).done(function(t) {
            this.options.templates.create(t, {
                prepend: !0
            }).then(function(t) {
                this.renderTemplate(t, {
                    prepend: !0
                }), this.refresh()
            }.bind(this)), SL.notify(SL.locale.get("TEMPLATE_CREATE_SUCCESS"))
        }).fail(function() {
            SL.notify(SL.locale.get("TEMPLATE_CREATE_ERROR"), "negative")
        })
    },
    isEditable: function() {
        return this.isUserTemplates() || this.isTeamTemplates() && SL.current_user.isEnterpriseManager()
    },
    isDefaultTemplates: function() {
        return "default" === this.options.id
    },
    isUserTemplates: function() {
        return "user" === this.options.id
    },
    isTeamTemplates: function() {
        return "team" === this.options.id
    },
    getNumberOfVisibleTemplates: function() {
        return this.domElement.find(".template-item:not(.hidden)").length
    },
    onTemplateSelected: function(t, e) {
        e.preventDefault(), this.templateSelected.dispatch(t.data("template-model"))
    },
    onTemplateDeleteClicked: function(t, e) {
        return e.preventDefault(), SL.prompt({
            anchor: $(e.currentTarget),
            title: SL.locale.get("TEMPLATE_DELETE_CONFIRM"),
            type: "select",
            hoverTarget: t,
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Delete</h3>",
                selected: !0,
                className: "negative",
                callback: function() {
                    var e = t.data("template-model"),
                        i = SL.config.AJAX_SLIDE_TEMPLATES_DELETE(e.get("id"));
                    this.isTeamTemplates() && (i = SL.config.AJAX_TEAM_SLIDE_TEMPLATES_DELETE(e.get("id"))), $.ajax({
                        type: "DELETE",
                        url: i,
                        context: this
                    }).done(function() {
                        t.remove(), this.refresh()
                    })
                }.bind(this)
            }]
        }), !1
    },
    onTemplateThemeClicked: function(t, e) {
        e.preventDefault();
        var i = SL.current_user.getThemes();
        if (i.size() > 0) {
            var n = t.data("template-model"),
                s = n.get("id"),
                o = n.isAvailableForAllThemes(),
                a = ($(Reveal.getCurrentSlide()), [{
                    value: "All themes",
                    selected: o,
                    exclusive: !0,
                    className: "header-item",
                    callback: function() {
                        i.forEach(function(t) {
                            t.hasSlideTemplate(s) && t.removeSlideTemplate([s]).fail(this.onGenericError)
                        }.bind(this)), this.refresh()
                    }.bind(this)
                }]);
            i.forEach(function(t) {
                a.push({
                    value: t.get("name"),
                    selected: o ? !1 : n.isAvailableForTheme(t),
                    callback: function(e, i) {
                        i ? t.addSlideTemplate([s]).fail(this.onGenericError) : t.removeSlideTemplate([s]).fail(this.onGenericError), this.refresh()
                    }.bind(this)
                })
            }.bind(this)), SL.prompt({
                anchor: $(e.currentTarget),
                title: "Available for...",
                type: "list",
                alignment: "l",
                data: a,
                multiselect: !0,
                optional: !0,
                hoverTarget: t
            })
        }
        return !1
    },
    onGenericError: function() {
        SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
    }
}),
SL("components").Templates = Class.extend({
    init: function(t) {
        this.options = $.extend({
            alignment: "",
            width: 450,
            height: 800,
            arrowSize: 8
        }, t), this.pages = [], this.pagesHash = {}, SL.data.templates.getUserTemplates(), SL.data.templates.getTeamTemplates(), this.render(), this.bind()
    },
    render: function() {
        this.domElement = $('<div class="sl-templates">'), this.innerElement = $('<div class="sl-templates-inner">').appendTo(this.domElement), this.domElement.data("instance", this), this.headerElement = $('<div class="sl-templates-header">').appendTo(this.innerElement), this.bodyElement = $('<div class="sl-templates-body">').appendTo(this.innerElement), this.footerElement = $('<div class="sl-templates-footer">').appendTo(this.innerElement), this.addTemplateButton = $(['<div class="add-new-template ladda-button" data-style="zoom-out" data-spinner-color="#222" data-spinner-size="32">', '<span class="icon i-plus"></span>', "<span>Save current slide</span>", "</div>"].join("")), this.addTemplateButton.on("click", this.onTemplateCreateClicked.bind(this)), this.addTemplateButton.appendTo(this.footerElement), this.addTemplateButtonLoader = Ladda.create(this.addTemplateButton.get(0))
    },
    renderTemplates: function() {
        this.pages = [], this.headerElement.empty(), this.bodyElement.empty(), this.renderPage("default", "Default", SL.data.templates.getDefaultTemplates()), SL.data.templates.getUserTemplates(function(t) {
            this.renderPage("user", "Yours", t)
        }.bind(this)), SL.data.templates.getTeamTemplates(function(t) {
            (SL.current_user.isEnterpriseManager() || !t.isEmpty()) && this.renderPage("team", "Team", t)
        }.bind(this))
    },
    renderPage: function(t, e, i) {
        var n = $('<div class="page-tab" data-page-id="' + t + '">' + e + "</div>");
        n.on("vclick", function() {
            this.showPage(t), SL.analytics.trackEditor("Slide templates tab clicked", t)
        }.bind(this)), n.appendTo(this.headerElement);
        var s = new SL.components.TemplatesPage({
            id: t,
            templates: i
        });
        s.templateSelected.add(this.onTemplateSelected.bind(this)), s.appendTo(this.bodyElement), this.pages.push(s), this.pagesHash[t] = s, this.domElement.attr("data-pages-total", this.pages.length)
    },
    selectDefaultPage: function() {
        var t = this.pages.some(function(t) {
            return t.isTeamTemplates() && t.getNumberOfVisibleTemplates() > 0
        });
        this.showPage(t ? "team" : "default")
    },
    showPage: function(t) {
        this.currentPage = this.pagesHash[t], this.currentPage ? (this.bodyElement.find(".page").removeClass("past present future"), this.bodyElement.find('.page[data-page-id="' + t + '"]').addClass("present"), this.bodyElement.find('.page[data-page-id="' + t + '"]').prevAll().addClass("past"), this.bodyElement.find('.page[data-page-id="' + t + '"]').nextAll().addClass("future"), this.headerElement.find(".page-tab").removeClass("selected"), this.headerElement.find('.page-tab[data-page-id="' + t + '"]').addClass("selected")) : console.warn('Template page "' + t + '" not found.')
    },
    refreshPages: function() {
        this.pages.forEach(function(t) {
            t.refresh()
        })
    },
    bind: function() {
        this.layout = this.layout.bind(this), this.onKeyDown = this.onKeyDown.bind(this), this.onClicked = this.onClicked.bind(this), this.domElement.on("vclick", this.onClicked)
    },
    layout: function() {
        var t = 10,
            e = this.domElement.outerWidth(),
            i = this.domElement.outerHeight(),
            n = this.options.width,
            s = this.options.height,
            o = {};
        n = Math.min(n, i - 2 * t), s = Math.min(s, i - 2 * t), this.options.anchor && (o.left = this.options.anchor.offset().left, o.top = this.options.anchor.offset().top, o.width = this.options.anchor.outerWidth(), o.height = this.options.anchor.outerHeight(), o.right = o.left + o.width, o.bottom = o.top + o.height);
        var a, r;
        this.options.anchor && "r" === this.options.alignment ? (n = Math.min(n, o.left - 2 * t), a = o.left - n - this.options.arrowSize - t, r = o.top + o.height / 2 - s / 2) : this.options.anchor && "b" === this.options.alignment ? (s = Math.min(s, o.top - 2 * t), a = o.left + o.width / 2 - n / 2, r = o.top - s - this.options.arrowSize - t) : this.options.anchor && "l" === this.options.alignment ? (n = Math.min(n, e - o.right - 2 * t), a = o.right + this.options.arrowSize + t, r = o.top + o.height / 2 - s / 2) : (a = (e - n) / 2, r = (i - s) / 2), this.innerElement.css({
            width: n,
            height: s,
            left: a,
            top: r
        })
    },
    show: function(t) {
        this.options = $.extend(this.options, t), 0 === this.pages.length && this.renderTemplates(), this.domElement.attr("data-alignment", this.options.alignment), this.domElement.appendTo(document.body), SL.util.skipCSSTransitions(this.domElement), $(window).on("resize", this.layout), SL.keyboard.keydown(this.onKeyDown), this.refreshPages(), this.hasSelectedDefaultPage || (this.hasSelectedDefaultPage = !0, this.selectDefaultPage()), this.layout()
    },
    hide: function() {
        this.domElement.detach(), $(window).off("resize", this.layout), SL.keyboard.release(this.onKeyDown)
    },
    onTemplateSelected: function(t) {
        this.options.callback && (this.hide(), this.options.callback(t.get("html")))
    },
    onTemplateCreateClicked: function() {
        return this.currentPage.isEditable() || this.showPage("user"), this.addTemplateButtonLoader.start(), this.currentPage.saveCurrentSlide().then(function() {
            this.addTemplateButtonLoader.stop()
        }.bind(this), function() {
            this.addTemplateButtonLoader.stop()
        }.bind(this)), SL.analytics.trackEditor(this.currentPage.isTeamTemplates() ? "Saved team template" : "Saved user template"), !1
    },
    onKeyDown: function(t) {
        return 27 === t.keyCode ? (this.hide(), !1) : !0
    },
    onClicked: function(t) {
        $(t.target).is(this.domElement) && (t.preventDefault(), this.hide())
    },
    destroy: function() {
        $(window).off("resize", this.layout), SL.keyboard.release(this.onKeyDown), this.domElement.remove()
    }
}),
SL("components").TextEditor = Class.extend({
    init: function(t) {
        this.options = $.extend({
            type: "",
            value: ""
        }, t),
            this.saved = new signals.Signal,
            this.canceled = new signals.Signal,
            this.render(),
            this.bind(),
            this.originalValue = this.options.value || "", "string" == typeof this.options.value && this.setValue(this.options.value)
        //SL.editor.controllers.Capabilities.isTouchEditor() || this.focusInput()
    },
    render: function() {
        this.domElement = $('<div class="sl-text-editor">').appendTo(document.body), this.innerElement = $('<div class="sl-text-editor-inner">').appendTo(this.domElement), this.domElement.attr("data-type", this.options.type), "html" === this.options.type ? this.renderHTMLInput() : this.renderTextInput(), this.footerElement = $(['<div class="sl-text-editor-footer">', '<button class="button l outline white cancel-button">Cancel</button>', '<button class="button l positive save-button">Save</button>', "</div>"].join("")).appendTo(this.innerElement), setTimeout(function() {
            this.domElement.addClass("visible")
        }.bind(this), 1)
    },
    renderTextInput: function() {
        this.inputElement = $('<textarea class="sl-text-editor-input">').appendTo(this.innerElement), "code" === this.options.type && this.inputElement.tabby({
            tabString: "    "
        })
    },
    renderHTMLInput: function() {
        this.inputElement = $('<div class="editor sl-text-editor-input">').appendTo(this.innerElement), this.codeEditor && "function" == typeof this.codeEditor.destroy && (this.codeEditor.destroy(), this.codeEditor = null);
        try {
            this.codeEditor = ace.edit(this.inputElement.get(0)), this.codeEditor.setTheme("ace/theme/monokai"), this.codeEditor.setDisplayIndentGuides(!0), this.codeEditor.setShowPrintMargin(!1), this.codeEditor.getSession().setMode("ace/mode/html")
        } catch (t) {
            console.log("An error occurred while initializing the Ace editor.")
        }
    },
    bind: function() {
        this.footerElement.find(".save-button").on("click", this.save.bind(this)), this.footerElement.find(".cancel-button").on("click", this.cancel.bind(this)), this.onKeyDown = this.onKeyDown.bind(this), SL.keyboard.keydown(this.onKeyDown), this.onBackgroundClicked = this.onBackgroundClicked.bind(this), this.domElement.on("vclick", this.onBackgroundClicked)
    },
    save: function() {
        this.saved.dispatch(this.getValue()), this.destroy()
    },
    cancel: function() {
        var t = this.originalValue || "",
            e = this.getValue() || "";
        e !== t ? this.cancelPrompt || (this.cancelPrompt = SL.prompt({
            title: "Discard unsaved changes?",
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Discard</h3>",
                selected: !0,
                className: "negative",
                callback: function() {
                    this.canceled.dispatch(), this.destroy()
                }.bind(this)
            }]
        }), this.cancelPrompt.destroyed.add(function() {
            this.cancelPrompt = null
        }.bind(this))) : (this.canceled.dispatch(), this.destroy())
    },
    focusInput: function() {
        this.codeEditor ? this.codeEditor.focus() : this.inputElement.focus()
    },
    setValue: function(t) {
        this.originalValue = t || "", this.codeEditor ? this.codeEditor.env.document.setValue(t) : this.inputElement.val(t)
    },
    getValue: function() {
        return this.codeEditor ? this.codeEditor.env.document.getValue() : this.inputElement.val()
    },
    onBackgroundClicked: function(t) {
        $(t.target).is(this.domElement) && (this.cancel(), t.preventDefault())
    },
    onKeyDown: function(t) {
        return 27 === t.keyCode ? (this.cancel(), !1) : (t.metaKey || t.ctrlKey) && 83 === t.keyCode ? (this.save(), !1) : !0
    },
    destroy: function() {
        this.saved.dispose(), this.canceled.dispose(), SL.keyboard.release(this.onKeyDown), this.domElement.remove()
    }
}),
SL("components").ThemeOptions = Class.extend({
    init: function(t) {
        if (!t.container) throw "Cannot build theme options without container";
        if (!t.model) throw "Cannot build theme options without model";
        this.config = $.extend({
            center: !0,
            rollingLinks: !0,
            colors: SL.config.THEME_COLORS,
            fonts: SL.config.THEME_FONTS,
            transitions: SL.config.THEME_TRANSITIONS,
            backgroundTransitions: SL.config.THEME_BACKGROUND_TRANSITIONS
        }, t), this.theme = t.model, this.changed = new signals.Signal, this.render(), this.updateSelection(), this.toggleDeprecatedOptions(), this.scrollToTop()
    },
    render: function() {
        this.domElement = $('').appendTo(this.config.container),
        "string" == typeof this.config.className && this.domElement.addClass(this.config.className),
        this.config.themes && this.renderThemes(),
        (this.config.center || this.config.rollingLinks) && this.renderOptions()/*, this.config.colors && this.renderColors()*/,
        this.config.fonts && this.renderFonts(), this.config.fonts && this.renderFontsRef()
        /*, this.config.transitions && this.renderTransitions(), this.config.backgroundTransitions && this.renderBackgroundTransitions()*/
    },
    renderThemes: function() {
        if (this.config.themes && !this.config.themes.isEmpty()) {
            var t = $('<div class="section selector theme"><h3>Theme</h3><ul></ul></div>').appendTo(this.domElement),
                e = t.find("ul");
            e.append(['<li data-theme="" class="custom">', '<span class="thumb-icon icon i-equalizer"></span>', '<span class="thumb-label">Custom</span>', "</li>"].join("")), this.config.themes.forEach(function(t) {
                var i = $('<li data-theme="' + t.get("id") + '"><span class="thumb-label" title="' + t.get("name") + '">' + t.get("name") + "</span></li>").appendTo(e);
                t.hasThumbnail() && i.css("background-image", 'url("' + t.get("thumbnail_url") + '")')
            }), this.domElement.find(".theme li").on("vclick", this.onThemeClicked.bind(this))
        }
    },
    renderOptions: function() {
        var t = $('<div class="section options"><h3>Options</h3></div>').appendTo(this.domElement),
            e = $('<div class="options"></div>').appendTo(t);
        this.config.center && (e.append('<div class="unit sl-checkbox outline"><input id="theme-center" value="center" type="checkbox"><label for="theme-center" data-tooltip="Center slide contents vertically (not visible while editing)" data-tooltip-maxwidth="220" data-tooltip-delay="500">Vertical centering</label></div>'), t.find("#theme-center").on("change", this.onOptionChanged.bind(this))), this.config.rollingLinks && (e.append('<div class="unit sl-checkbox outline"><input id="theme-rolling_links" value="rolling_links" type="checkbox"><label for="theme-rolling_links" data-tooltip="Use a 3D hover effect on links" data-tooltip-maxwidth="220" data-tooltip-delay="500">Rolling links</label></div>'), t.find("#theme-rolling_links").on("change", this.onOptionChanged.bind(this)))
    }/*,
     renderColors: function() {
     var t = $('<div class="section selector color"><h3>Color</h3><ul></ul></div>').appendTo(this.domElement),
     e = t.find("ul");
     this.config.colors.forEach(function(t) {
     var i = $('<li data-color="' + t.id + '"><div class="theme-body-color-block"></div><div class="theme-link-color-block"></div></li>');
     i.addClass("theme-color-" + t.id), i.addClass("themed"), i.appendTo(e), t.tooltip && i.attr({
     "data-tooltip": t.tooltip,
     "data-tooltip-delay": 250,
     "data-tooltip-maxwidth": 300
     }), !SL.current_user.isPro() && t.pro && i.attr("data-pro", "true")
     }.bind(this)), this.domElement.find(".color li").on("vclick", this.onColorClicked.bind(this))
     }*/,
    renderFonts: function() {
        var t = $('<div class="section selector font"><label>' + TWIG.font + '</label><select class="form-control m-b sl-select" name="menu-font" id="menu-font"></select></div>').appendTo(".style .sl-themeoptions .font-list"),
            e = t.find("select");
        this.config.fonts.forEach(function(t) {
            var i = $('<option data-font="' + t.id + '" style="font-family: '+ t.id +'" data-name="' + t.title + '">' + t.title + '</option>');
            i.addClass("theme-font-" + t.id), i.appendTo(e), t.deprecated === !0 && i.addClass("deprecated"), t.tooltip && i.attr({
                "data-tooltip": t.tooltip,
                "data-tooltip-delay": 250,
                "data-tooltip-maxwidth": 300
            })
        }.bind(this))/*, this.domElement.find(".font option").on("vclick", this.onFontClicked.bind(this))*/
    },
    renderFontsRef: function() {
        var t = $('<div class="section selector font"><label>Fonts</label><select class="form-control m-b sl-select" name="menu-font-ref" id="menu-font-ref"></select></div>').appendTo(".style .sl-themeoptions .font-list-ref"),
            e = t.find("select");
        this.config.fonts.forEach(function(t) {
            var i = $('<option data-font="' + t.id + '" style="font-family: '+ t.id +'" data-name="' + t.title + '">' + t.title + '</option>');
            i.addClass("theme-font-" + t.id), i.appendTo(e), t.deprecated === !0 && i.addClass("deprecated"), t.tooltip && i.attr({
                "data-tooltip": t.tooltip,
                "data-tooltip-delay": 250,
                "data-tooltip-maxwidth": 300
            })
        }.bind(this))/*, this.domElement.find(".font option").on("vclick", this.onFontClicked.bind(this))*/
    }/*,
     renderTransitions: function() {
     var t = $('<div class="section selector transition"><h3>Transition</h3><ul></ul></div>').appendTo(this.domElement),
     e = t.find("ul");
     this.config.transitions.forEach(function(t) {
     var i = $('<li data-transition="' + t.id + '"></li>').appendTo(e);
     t.deprecated === !0 && i.addClass("deprecated"), t.title && i.attr({
     "data-tooltip": t.title,
     "data-tooltip-oy": -5
     })
     }.bind(this)), this.domElement.find(".transition li").on("vclick", this.onTransitionClicked.bind(this))
     },
     renderBackgroundTransitions: function() {
     var t = $('<div class="section selector background-transition"></div>').appendTo(this.domElement);
     t.append('<h3>Background Transition <span class="icon i-info info-icon" data-tooltip="Background transitions apply when navigating to or from a slide that has a background image or color." data-tooltip-maxwidth="250"></span></h3>'), t.append("<ul>");
     var e = t.find("ul");
     this.config.backgroundTransitions.forEach(function(t) {
     var i = $('<li data-background-transition="' + t.id + '"></li>').appendTo(e);
     t.deprecated === !0 && i.addClass("deprecated"), t.title && i.attr({
     "data-tooltip": t.title,
     "data-tooltip-oy": -5
     })
     }.bind(this)), this.domElement.find(".background-transition li").on("vclick", this.onBackgroundTransitionClicked.bind(this))
     }*/,
    populate: function(t) {
        t && (this.theme = t, this.updateSelection(), this.toggleDeprecatedOptions(), this.scrollToTop())
    },
    scrollToTop: function() {
        this.domElement.scrollTop(0)
    },
    updateSelection: function() {
        this.config.themes && !this.config.themes.isEmpty() && this.domElement.toggleClass("using-theme", this.theme.has("id")), this.config.center && this.domElement.find("#theme-center").prop("checked", 1 == this.theme.get("center")), this.config.rollingLinks && this.domElement.find("#theme-rolling_links").prop("checked", 1 == this.theme.get("rolling_links")), this.domElement.find(".theme li").removeClass("selected"), this.domElement.find(".theme li[data-theme=" + this.theme.get("id") + "]").addClass("selected"), 0 !== this.domElement.find(".theme li.selected").length || this.theme.has("id") || this.domElement.find('.theme li[data-theme=""]').addClass("selected"), this.domElement.find(".color li").removeClass("selected"), this.domElement.find(".color li[data-color=" + this.theme.get("color") + "]").addClass("selected"), this.domElement.find(".font li").removeClass("selected"), this.domElement.find(".font li[data-font=" + this.theme.get("font") + "]").addClass("selected"), this.domElement.find(".font li").each(function(t, e) {
            SL.util.html.removeClasses(e, function(t) {
                return t.match(/^theme\-color\-/gi)
            }), $(e).addClass("theme-color-" + this.theme.get("color"))
        }.bind(this)), this.domElement.find(".transition li").removeClass("selected"), this.domElement.find(".transition li[data-transition=" + this.theme.get("transition") + "]").addClass("selected"), this.domElement.find(".background-transition li").removeClass("selected"), this.domElement.find(".background-transition li[data-background-transition=" + this.theme.get("background_transition") + "]").addClass("selected")
    },
    applySelection: function() {
        SL.helpers.ThemeController.paint(this.theme, {
            center: !1,
            js: !1
        })
    },
    toggleDeprecatedOptions: function() {
        this.domElement.find(".font .deprecated").toggle(this.theme.isFontDeprecated()), this.domElement.find(".transition .deprecated").toggle(this.theme.isTransitionDeprecated()), this.domElement.find(".background-transition .deprecated").toggle(this.theme.isBackgroundTransitionDeprecated())
    },
    getTheme: function() {
        return this.theme
    },
    onThemeClicked: function(t) {
        var e = $(t.currentTarget),
            i = e.data("theme");
        if (i) {
            var n = this.config.themes.getByProperties({
                id: i
            });
            if (n) {
                if (!n.isLoading()) {
                    var s = $('<div class="thumb-preloader hidden"><div class="spinner centered"></div></div>').appendTo(e),
                        o = setTimeout(function() {
                            s.removeClass("hidden")
                        }, 1);
                    SL.util.html.generateSpinners(), e.addClass("selected"), n.load().done(function() {
                        this.theme = n.clone(), this.updateSelection(), this.applySelection(), this.changed.dispatch()
                    }.bind(this)).fail(function() {
                        SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), e.removeClass("selected")
                    }.bind(this)).always(function() {
                        clearTimeout(o), s.remove()
                    }.bind(this))
                }
            } else SL.notify("Could not find theme data", "negative")
        } else this.theme.set("id", null), this.theme.set("js", null), this.theme.set("css", null), this.theme.set("less", null), this.theme.set("html", null), this.updateSelection(), this.applySelection(), this.changed.dispatch();
        SL.analytics.trackTheming("Theme option selected")
    },
    onOptionChanged: function() {
        this.theme.set("center", this.domElement.find("#theme-center").is(":checked")), this.theme.set("rolling_links", this.domElement.find("#theme-rolling_links").is(":checked")), this.updateSelection(), this.applySelection(), this.changed.dispatch()
    },
    onColorClicked: function(t) {
        return t.preventDefault(), $(t.currentTarget).is("[data-pro]") ? void window.open("/pricing") : (this.theme.set("color", $(t.currentTarget).data("color")), this.updateSelection(), this.applySelection(), SL.analytics.trackTheming("Color option selected", this.theme.get("color")), void this.changed.dispatch())
    },
    onFontClicked: function(t) {
        t.preventDefault(), this.theme.set("font", $(t.currentTarget).data("font")), this.updateSelection(), this.applySelection(), SL.analytics.trackTheming("Font option selected", this.theme.get("font")), this.changed.dispatch()
    },
    onTransitionClicked: function(t) {
        t.preventDefault(), this.theme.set("transition", $(t.currentTarget).data("transition")), this.updateSelection(), this.applySelection(), SL.analytics.trackTheming("Transition option selected", this.theme.get("transition")), this.changed.dispatch()
    },
    onBackgroundTransitionClicked: function(t) {
        t.preventDefault(), this.theme.set("background_transition", $(t.currentTarget).data("background-transition")), this.updateSelection(), this.applySelection(), SL.analytics.trackTheming("Background transition option selected", this.theme.get("background_transition")), this.changed.dispatch()
    },
    destroy: function() {
        this.changed.dispose(), this.domElement.remove(), this.theme = null, this.config = null
    }
}),
SL.tooltip = function() {
    function t() {
        a = $("<div>").addClass("sl-tooltip"), r = $('<p class="sl-tooltip-inner">').appendTo(a), l = $('<div class="sl-tooltip-arrow">').appendTo(a), c = $('<div class="sl-tooltip-arrow-fill">').appendTo(l), e()
    }

    function e() {
        n = n.bind(this), $(document).on("keydown, mousedown", function() {
            SL.tooltip.hide()
        }),
            // SL.util.device.IS_PHONE || SL.util.device.IS_TABLET ||
            ($(document.body).delegate("[data-tooltip]", "mouseenter", function(t) {
                var e = $(t.currentTarget);
                if (!e.is("[no-tooltip]")) {
                    var n = e.attr("data-tooltip"),
                        s = e.attr("data-tooltip-delay"),
                        o = e.attr("data-tooltip-align"),
                        a = e.attr("data-tooltip-alignment"),
                        r = e.attr("data-tooltip-maxwidth"),
                        l = e.attr("data-tooltip-maxheight"),
                        c = e.attr("data-tooltip-ox"),
                        d = e.attr("data-tooltip-oy"),
                        h = e.attr("data-tooltip-x"),
                        u = e.attr("data-tooltip-y");
                    if (n) {
                        var p = {
                            anchor: e,
                            align: o,
                            alignment: a,
                            delay: parseInt(s, 10),
                            maxwidth: parseInt(r, 10),
                            maxheight: parseInt(l, 10)
                        };
                        c && (p.ox = parseFloat(c)), d && (p.oy = parseFloat(d)), h && u && (p.x = parseFloat(h), p.y = parseFloat(u), p.anchor = null), i(n, p)
                    }
                }
            }), $(document.body).delegate("[data-tooltip]", "mouseleave", s))
    }

    function i(t, e) {
        // if (!SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET) {
        //     d = e || {}, clearTimeout(p);
        //     var s = Date.now() - f;
        //     if ("number" == typeof d.delay && s > 500) return p = setTimeout(i.bind(this, t, d), d.delay), void delete d.delay;
        //     a.css("opacity", 0), a.appendTo(document.body), r.html(t), a.css({
        //         left: 0,
        //         top: 0,
        //         "max-width": d.maxwidth ? d.maxwidth : null,
        //         "max-height": d.maxheight ? d.maxheight : null
        //     }), d.align && a.css("text-align", d.align), n(), a.stop(!0, !0).animate({
        //         opacity: 1
        //     }, {
        //         duration: 150
        //     }), $(window).on("resize scroll", n)
        // }
    }

    function n() {
        var t = $(d.anchor);
        if (t.length) {
            var e = d.alignment || "auto",
                i = 10,
                n = $(window).scrollLeft(),
                s = $(window).scrollTop(),
                o = t.offset();
            o.x = o.left, o.y = o.top, d.anchor.parents(".reveal .slides").length && "undefined" != typeof window.Reveal && (o = SL.util.getRevealElementGlobalOffset(d.anchor));
            var c = t.outerWidth(),
                p = t.outerHeight(),
                f = r.outerWidth(),
                m = r.outerHeight(),
                g = o.x - $(window).scrollLeft(),
                v = o.y - $(window).scrollTop(),
                b = f / 2,
                S = m / 2;
            switch ("number" == typeof d.ox && (g += d.ox), "number" == typeof d.oy && (v += d.oy), "auto" === e && (e = o.y - (m + i + h) < s ? "b" : "t"), e) {
                case "t":
                    g += (c - f) / 2, v -= m + h + u;
                    break;
                case "b":
                    g += (c - f) / 2, v += p + h + u;
                    break;
                case "l":
                    g -= f + h + u, v += (p - m) / 2;
                    break;
                case "r":
                    g += c + h + u, v += (p - m) / 2
            }
            g = Math.min(Math.max(g, i), window.innerWidth - f - i), v = Math.min(Math.max(v, i), window.innerHeight - m - i);
            var y = h + 3;
            switch (e) {
                case "t":
                    b = o.x - g - n + c / 2, S = m, b = Math.min(Math.max(b, y), f - y);
                    break;
                case "b":
                    b = o.x - g - n + c / 2, S = -h, b = Math.min(Math.max(b, y), f - y);
                    break;
                case "l":
                    b = f, S = o.y - v - s + p / 2, S = Math.min(Math.max(S, y), m - y);
                    break;
                case "r":
                    b = -h, S = o.y - v - s + p / 2, S = Math.min(Math.max(S, y), m - y)
            }
            l.css({
                left: Math.round(b),
                top: Math.round(S)
            }), a.css({
                left: Math.round(g),
                top: Math.round(v)
            }).attr("data-alignment", e)
        }
    }

    function s() {
        o() && (f = Date.now()), clearTimeout(p), a.remove().stop(!0, !0), $(window).off("resize scroll", n)
    }

    function o() {
        return a.parent().length > 0
    }
    var a, r, l, c, d, h = 6,
        u = 4,
        p = -1,
        f = -1;
    return t(), {
        show: function(t, e) {
            i(t, e)
        },
        hide: function() {
            s()
        },
        anchorTo: function(t, e, i) {
            var n = {};
            "undefined" != typeof e && (n["data-tooltip"] = e), "number" == typeof i.delay && (n["data-tooltip-delay"] = i.delay), "string" == typeof i.alignment && (n["data-tooltip-alignment"] = i.alignment), $(t).attr(n)
        }
    }
}(),
SL("components").Tutorial = Class.extend({
    init: function(t) {
        this.options = $.extend({
            steps: []
        }, t), this.options.steps.forEach(function(t) {
            "undefined" == typeof t.backwards && (t.backwards = function() {}), "undefined" == typeof t.forwards && (t.forwards = function() {})
        }), this.skipped = new signals.Signal, this.finished = new signals.Signal, this.index = -1, this.render(), this.bind(), this.layout(), this.paint(), this.controlsButtons.css("width", this.controlsButtons.outerWidth() + 10)
    },
    render: function() {
        this.domElement = $('<div class="sl-tutorial">'), this.domElement.appendTo(document.body), this.canvas = $('<canvas class="sl-tutorial-canvas">'), this.canvas.appendTo(this.domElement), this.canvas = this.canvas.get(0), this.context = this.canvas.getContext("2d"), this.controls = $('<div class="sl-tutorial-controls">'), this.controls.appendTo(this.domElement), this.controlsInner = $('<div class="sl-tutorial-controls-inner">'), this.controlsInner.appendTo(this.controls), this.renderPagination(), this.controlsButtons = $('<div class="sl-tutorial-buttons">'), this.controlsButtons.appendTo(this.controlsInner), this.nextButton = $('<button class="button no-transition white l sl-tutorial-next">Next</button>'), this.nextButton.appendTo(this.controlsButtons), this.skipButton = $('<button class="button no-transition outline white l sl-tutorial-skip">Skip tutorial</button>'), this.skipButton.appendTo(this.controlsButtons), this.messageElement = $('<div class="sl-tutorial-message no-transition">').hide(), this.messageElement.appendTo(this.domElement)
    },
    renderPagination: function() {
        this.pagination = $('<div class="sl-tutorial-pagination">'), this.pagination.appendTo(this.controlsInner), this.options.steps.forEach(function(t, e) {
            $('<li class="sl-tutorial-pagination-number">').appendTo(this.pagination).on("click", this.step.bind(this, e))
        }.bind(this))
    },
    updatePagination: function() {
        this.pagination.find(".sl-tutorial-pagination-number").each(function(t, e) {
            e = $(e), e.toggleClass("past", t < this.index), e.toggleClass("present", t === this.index), e.toggleClass("future", t > this.index)
        }.bind(this))
    },
    bind: function() {
        this.onKeyDown = this.onKeyDown.bind(this), this.onSkipClicked = this.onSkipClicked.bind(this), this.onNextClicked = this.onNextClicked.bind(this), this.onWindowResize = this.onWindowResize.bind(this), SL.keyboard.keydown(this.onKeyDown), this.skipButton.on("click", this.onSkipClicked), this.nextButton.on("click", this.onNextClicked), $(window).on("resize", this.onWindowResize)
    },
    unbind: function() {
        SL.keyboard.release(this.onKeyDown), this.skipButton.off("click", this.onSkipClicked), this.nextButton.off("click", this.onNextClicked), $(window).off("resize", this.onWindowResize)
    },
    prev: function() {
        this.step(Math.max(this.index - 1, 0))
    },
    next: function() {
        this.index + 1 >= this.options.steps.length ? (this.finished.dispatch(), this.destroy()) : this.step(Math.min(this.index + 1, this.options.steps.length - 1))
    },
    step: function(t) {
        if (this.index < t) {
            for (; this.index < t;) this.index += 1, this.options.steps[this.index].forwards.call(this.options.context);
            this.index + 1 === this.options.steps.length && (this.skipButton.hide(), this.nextButton.text("Get started"), this.domElement.addClass("last-step"))
        } else if (this.index > t) {
            for (this.index + 1 === this.options.steps.length && (this.skipButton.show(), this.nextButton.text("Next"), this.domElement.removeClass("last-step")); this.index > t;) this.options.steps[this.index].backwards.call(this.options.context), this.index -= 1;
            this.options.steps[this.index].forwards.call(this.options.context)
        }
        this.updatePagination()
    },
    layout: function() {
        this.width = window.innerWidth, this.height = window.innerHeight;
        if (this.cutoutElement) {
            var t = this.cutoutElement.offset();
            this.cutoutRect = {
                x: t.left - this.cutoutPadding,
                y: t.top - this.cutoutPadding,
                width: this.cutoutElement.outerWidth() + 2 * this.cutoutPadding,
                height: this.cutoutElement.outerHeight() + 2 * this.cutoutPadding
            }
        }
        if (this.messageElement.is(":visible")) {
            var e = 20,
                i = this.messageElement.outerWidth(),
                n = this.messageElement.outerHeight(),
                s = {
                    left: (window.innerWidth - i) / 2,
                    top: (window.innerHeight - n) / 2
                };
            if (this.messageOptions.anchor && this.messageOptions.alignment) {
                var o = this.messageOptions.anchor.offset(),
                    a = this.messageOptions.anchor.outerWidth(),
                    r = this.messageOptions.anchor.outerHeight();
                switch (this.messageOptions.alignment) {
                    case "t":
                        s.left = o.left + (a - i) / 2, s.top = o.top - n - e;
                        break;
                    case "r":
                        s.left = o.left + a + e, s.top = o.top + (r - n) / 2;
                        break;
                    case "b":
                        s.left = o.left + (a - i) / 2, s.top = o.top + r + e;
                        break;
                    case "l":
                        s.left = o.left - i - e, s.top = o.top + (r - n) / 2;
                        break;
                    case "tl":
                        s.left = o.left - i - e, s.top = o.top - 20
                }
            }
            s.left = Math.max(s.left, 10), s.top = Math.max(s.top, 10);
            var l = "translate(" + Math.round(s.left) + "px," + Math.round(s.top) + "px)";
            this.messageElement.css({
                "-webkit-transform": l,
                "-moz-transform": l,
                "-ms-transform": l,
                transform: l
            }), setTimeout(function() {
                this.messageElement.removeClass("no-transition")
            }.bind(this), 1)
        }
    },
    paint: function() {
        this.canvas.width = this.width, this.canvas.height = this.height, this.context.clearRect(0, 0, this.width, this.height), this.context.fillStyle = "rgba( 0, 0, 0, 0.7 )", this.context.fillRect(0, 0, this.width, this.height), this.cutoutElement && (this.context.clearRect(this.cutoutRect.x, this.cutoutRect.y, this.cutoutRect.width, this.cutoutRect.height), this.context.strokeStyle = "#ddd", this.context.lineWidth = 1, this.context.strokeRect(this.cutoutRect.x + .5, this.cutoutRect.y + .5, this.cutoutRect.width - 1, this.cutoutRect.height - 1))
    },
    cutout: function(t, e) {
        e = e || {}, this.cutoutElement = t, this.cutoutPadding = e.padding || 0, this.layout(), this.paint()
    },
    clearCutout: function() {
        this.cutoutElement = null, this.cutoutPadding = 0, this.paint()
    },
    message: function(t, e) {
        this.messageOptions = $.extend({
            maxWidth: 320,
            alignment: ""
        }, e), this.messageElement.html(t).show(), this.messageElement.css("max-width", this.messageOptions.maxWidth), this.messageElement.attr("data-alignment", this.messageOptions.alignment), this.layout(), this.paint()
    },
    clearMessage: function() {
        this.messageElement.hide(), this.messageOptions = {}
    },
    hasNextStep: function() {
        return this.index + 1 < this.options.steps.length
    },
    destroy: function() {
        this.destroyed || (this.destroyed = !0, $(window).off("resize", this.onWindowResize), this.skipped.dispose(), this.finished.dispose(), this.unbind(), this.domElement.fadeOut(400, this.domElement.remove))
    },
    onKeyDown: function(t) {
        return 27 === t.keyCode ? (this.skipped.dispatch(), this.destroy(), !1) : 37 === t.keyCode || 8 === t.keyCode ? (this.prev(), !1) : 39 === t.keyCode || 32 === t.keyCode ? (this.next(), !1) : !0
    },
    onSkipClicked: function() {
        this.skipped.dispatch(), this.destroy()
    },
    onNextClicked: function() {
        this.next()
    },
    onWindowResize: function() {
        this.layout(), this.paint()
    }
}),
SL("views").Base = Class.extend({
    init: function() {
        this.header = new SL.components.Header, this.setupAce(), this.setupSocial(), this.setupScrollAnchors(), this.handleLogos(), this.handleOutlines(), this.handleFeedback(), this.handleWindowClose(), this.handleAutoRefresh(), this.parseTimes(), this.parseLinks(), this.parseMeters(), this.parseSpinners(), this.parseNotifications(), this.parseScrollLinks(), setInterval(this.parseTimes.bind(this), 12e4)
    },
    setupAce: function() {
        "object" == typeof window.ace && "object" == typeof window.ace.config && "function" == typeof window.ace.config.set && ace.config.set("workerPath", "/assets")
    },
    setupSocial: function() {
        $(window).on("load", function() {
            var t = $(".facebook-share-button"),
                e = $(".twitter-share-button"),
                i = $(".google-share-button"),
                n = {
                    url: window.location.protocol + "//" + window.location.hostname + window.location.pathname,
                    title: $('meta[property="og:title"]').attr("content"),
                    description: $('meta[property="og:description"]').attr("content"),
                    thumbnail: $('meta[property="og:image"]').attr("content")
                };
            t.length && (t.attr("href", SL.util.social.getFacebookShareLink(n.url, n.title, n.description, n.thumbnail)), t.on("vclick", function(t) {
                SL.util.openPopupWindow($(this).attr("href"), "Share on Facebook", 600, 400), t.preventDefault()
            })), e.length && (e.attr("href", SL.util.social.getTwitterShareLink(n.url, n.title)), e.on("vclick", function(t) {
                SL.util.openPopupWindow($(this).attr("href"), "Share on Twitter", 600, 400), t.preventDefault()
            })), i.length && (i.attr("href", SL.util.social.getGoogleShareLink(n.url)), i.on("vclick", function(t) {
                SL.util.openPopupWindow($(this).attr("href"), "Share on Google+", 600, 400), t.preventDefault()
            }))
        })
    },
    setupScrollAnchors: function() {
        var t = $('.sl-scroll-anchor[href^="#"]');
        if (t.length) {
            var e = t.map(function(t, e) {
                    var i = e.getAttribute("href").slice(1);
                    return {
                        id: i,
                        link: $(e),
                        target: $(document.getElementById(i))
                    }
                }).toArray(),
                i = function() {
                    var t = window.innerHeight,
                        i = $(window).scrollTop(),
                        n = null,
                        s = Number.MAX_VALUE;
                    e.forEach(function(e) {
                        e.link.removeClass("sl-scroll-anchor-selected");
                        var o = e.target.offset().top - i,
                            a = Math.abs(o);
                        s > a && .4 * t > o && (s = a, n = e)
                    }), n && n.link.addClass("sl-scroll-anchor-selected")
                };
            $(window).on("scroll", $.throttle(i.bind(this), 300)), i()
        }
    },
    handleLogos: function() {
        setTimeout(function() {
            $(".logo-animation").addClass("open")
        }, 600)
    },
    handleOutlines: function() {
        var t = $("<style>").appendTo("head").get(0),
            e = function(e) {
                t.styleSheet ? t.styleSheet.cssText = e : t.innerHTML = e
            };
        $(document).on("mousedown", function() {
            e("a, button, .sl-select, .sl-checkbox label, .radio label { outline: none !important; }")
        }), $(document).on("keydown", function() {
            e("")
        })
    },
    handleFeedback: function() {
        $("html").on("click", "[data-feedback-mode]", function(t) {
            if (UserVoice && "function" == typeof UserVoice.show) {
                var e = $(this),
                    i = {
                        target: this,
                        mode: e.attr("data-feedback-mode") || "contact",
                        position: e.attr("data-feedback-position") || "top",
                        screenshot_enabled: e.attr("data-feedback-screenshot_enabled") || "true",
                        smartvote_enabled: e.attr("data-feedback-smartvote-enabled") || "true",
                        ticket_custom_fields: {}
                    };
                SL.current_deck && (i.ticket_custom_fields["Deck ID"] = SL.current_deck.get("id"), i.ticket_custom_fields["Deck Slug"] = SL.current_deck.get("slug"), i.ticket_custom_fields["Deck Version"] = SL.current_deck.get("version"), i.ticket_custom_fields["Deck Font"] = SL.current_deck.get("theme_font"), i.ticket_custom_fields["Deck Color"] = SL.current_deck.get("theme_color"), i.ticket_custom_fields["Deck Transition"] = SL.current_deck.get("transition"), i.ticket_custom_fields["Deck Background Transition"] = SL.current_deck.get("backgroundTransition"));
                var n = e.attr("data-feedback-type");
                n && n.length && (i.ticket_custom_fields.Type = n);
                var s = e.attr("data-feedback-contact-title");
                s && s.length && (i.contact_title = s), UserVoice.show(i), t.preventDefault()
            }
        })
    },
    handleWindowClose: function() {
        var t = SL.util.getQuery();
        if (t && t.autoclose && window.opener) {
            var e = parseInt(t.autoclose, 10) || 0;
            setTimeout(function() {
                try {
                    window.close()
                } catch (t) {}
            }, e)
        }
    },
    handleAutoRefresh: function() {
        var t = SL.util.getQuery();
        if (t && t.autoRefresh) {
            var e = parseInt(t.autoRefresh, 10);
            !isNaN(e) && e > 0 && setTimeout(function() {
                window.location.reload()
            }, e)
        }
    },
    parseTimes: function() {
        $("time.ago").each(function() {
            var t = $(this).attr("datetime");
            t && $(this).text(moment.utc(t).fromNow())
        }), $("time.date").each(function() {
            var t = $(this).attr("datetime");
            t && $(this).text(moment.utc(t).format("MMM Do, YYYY"))
        })
    },
    parseLinks: function() {
        $(".linkify").each(function() {
            $(this).html(SL.util.string.linkify($(this).text()))
        })
    },
    parseMeters: function() {
        $(".sl-meter").each(function() {
            new SL.components.Meter($(this))
        })
    },
    parseSpinners: function() {
        SL.util.html.generateSpinners()
    },
    parseNotifications: function() {
        var t = $(".flash-notification");
        t.length && SL.notify(t.remove().text(), t.attr("data-notification-type"))
    },
    parseScrollLinks: function() {
        $(document).delegate("a[data-scroll-to]", "click", function(t) {
            var e = t.currentTarget,
                i = $(e.getAttribute("href")),
                n = parseInt(e.getAttribute("data-scroll-to-offset"), 10),
                s = parseInt(e.getAttribute("data-scroll-to-duration"), 10);
            isNaN(n) && (n = -20), isNaN(s) && (s = 1e3), i.length && $("html, body").animate({
                scrollTop: i.offset().top + n
            }, s), t.preventDefault()
        })
    }
}),

// SL("views.decks").EditRequiresUpgrade = SL.views.Base.extend({
//     init: function() {
//         this._super(),
//         this.makePublicButton = $(".make-deck-public").first(),
//         this.makePublicButton.on("click", this.onMakePublicClicked.bind(this)),
//         this.makePublicLoader = Ladda.create(this.makePublicButton.get(0))
//     },
//     makeDeckPublic: function() {
//         var t = {
//             type: "POST",
//             url: SL.config.AJAX_PUBLISH_DECK(SL.current_deck.get("id")),
//             context: this,
//             data: {
//                 visibility: SL.models.Deck.VISIBILITY_ALL
//             }
//         };
//         this.makePublicLoader.start(), $.ajax(t).done(function() {
//             window.location = SL.routes.DECK_EDIT(SL.current_user.get("username"), SL.current_deck.get("slug"))
//         }).fail(function() {
//             SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ERROR"), "negative"), this.makePublicLoader.stop()
//         })
//     },
//     onMakePublicClicked: function(t) {
//         t.preventDefault(), this.makeDeckPublic()
//     }
// }),

SL("views.decks").Embed = SL.views.Base.extend({
    init: function() {
        this._super(), this.footerElement = $(".embed-footer"), this.shareButton = this.footerElement.find(".embed-footer-share"), this.fullscreenButton = this.footerElement.find(".embed-footer-fullscreen"), this.revealElement = $(".reveal"), SL.util.setupReveal({
            embedded: !0,
            openLinksInTabs: !0,
            trackEvents: !0,
            maxScale: SL.config.PRESENT_UPSIZING_MAX_SCALE
        }), $(window).on("resize", this.layout.bind(this)), $(document).on("webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange", this.layout.bind(this)), this.shareButton.on("click", this.onShareClicked.bind(this)), this.fullscreenButton.on("click", this.onFullscreenClicked.bind(this));
        var t = SL.util.getQuery().style;
        "hidden" !== t || SL.current_deck.isPro() || (t = null), t && $("html").attr("data-embed-style", t), Modernizr.fullscreen === !1 && this.fullscreenButton.hide(), this.layout()
    },
    layout: function() {
        this.revealElement.height(this.footerElement.is(":visible") ? window.innerHeight - this.footerElement.height() : "100%"), Reveal.layout()
    },
    onFullscreenClicked: function() {
        var t = $("html").get(0);
        return t ? (SL.helpers.Fullscreen.enter(t), !1) : void 0
    },
    onShareClicked: function() {
        SL.popup.open(SL.components.decksharer.DeckSharer, {
            deck: SL.current_deck
        }),
            SL.analytics.trackPresenting("Share clicked (embed footer)")
    }
}),
SL("views.decks").Export = SL.views.Base.extend({
    init: function() {
        this._super(), SL.util.setupReveal({
            history: !navigator.userAgent.match(/(iphone|ipod|ipad|android)/gi),
            openLinksInTabs: !0,
            trackEvents: !0
        })
    }
}),
SL("views.decks").Fullscreen = SL.views.Base.extend({
    init: function() {
        this._super(), /no-autoplay=1/.test(window.location.search) && $(".reveal [data-autoplay]").removeAttr("data-autoplay"), SL.util.setupReveal({
            history: !navigator.userAgent.match(/(iphone|ipod|ipad|android)/gi),
            openLinksInTabs: !0,
            trackEvents: !0,
            maxScale: SL.config.PRESENT_UPSIZING_MAX_SCALE
        })
    }
}),
// SL("views.decks").LiveClient = SL.views.Base.extend({
//     init: function() {
//         this._super(), SL.util.setupReveal({
//             touch: !1,
//             history: !1,
//             keyboard: !1,
//             controls: !1,
//             progress: !1,
//             showNotes: !1,
//             slideNumber: !1,
//             autoSlide: 0,
//             openLinksInTabs: !0,
//             trackEvents: !0
//         }), Reveal.addEventListener("ready", this.onRevealReady.bind(this)), this.stream = new SL.helpers.StreamLive({
//             showErrors: !0
//         }), this.stream.ready.add(this.onStreamReady.bind(this)), this.stream.stateChanged.add(this.onStreamStateChanged.bind(this)), this.stream.statusChanged.add(this.onStreamStatusChanged.bind(this)), this.render(), this.bind(), this.stream.connect()
//     },
//     render: function() {
//         var t = SL.current_deck.get("user"),
//             e = SL.routes.DECK(t.username, SL.current_deck.get("slug")),
//             i = t.thumbnail_url;
//         this.summaryBubble = $(['<a class="summary-bubble hidden" href="' + e + '" target="_blank">', '<div class="summary-bubble-picture" style="background-image: url(' + i + ')"></div>', '<div class="summary-bubble-content"></div>', "</a>"].join("")).appendTo(document.body), this.summaryBubbleContent = this.summaryBubble.find(".summary-bubble-content"), this.renderUserSummary()
//     },
//     renderUserSummary: function() {
//         var t = SL.current_deck.get("user");
//         this.summaryBubbleContent.html(["<h4>" + SL.current_deck.get("title") + "</h4>", "<p>By " + (t.name || t.username) + "</p>"].join(""))
//     },
//     renderWaitingSummary: function() {
//         this.summaryBubbleContent.html(["<h4>Waiting for presenter</h4>", '<p class="retry-status"></p>'].join("")), this.summaryBubbleRetryStatus = this.summaryBubbleContent.find(".retry-status")
//     },
//     renderConnectionLostSummary: function() {
//         this.summaryBubbleContent.html(["<h4>Connection lost</h4>", "<p>Attempting to reconnect</p>"].join(""))
//     },
//     startUpdatingTimer: function() {
//         var t = function() {
//             if (this.summaryBubbleRetryStatus && this.summaryBubbleRetryStatus.length) {
//                 var t = Date.now() - this.stream.getRetryStartTime(),
//                     e = Math.ceil((SL.helpers.StreamLive.CONNECTION_RETRY_INTERVAL - t) / 1e3);
//                 this.summaryBubbleRetryStatus.text(isNaN(e) ? "Retrying" : e > 0 ? "Retrying in " + e + "s" : "Retrying now")
//             }
//         }.bind(this);
//         clearInterval(this.updateTimerInterval), this.updateTimerInterval = setInterval(t, 100), t()
//     },
//     stopUpdatingTimer: function() {
//         clearInterval(this.updateTimerInterval)
//     },
//     bind: function() {
//         this.summaryBubble.on("mouseover", this.expandSummary.bind(this)), this.summaryBubble.on("mouseout", this.collapseSummary.bind(this))
//     },
//     expandSummary: function(t) {
//         clearTimeout(this.collapseSummaryTimeout);
//         var e = window.innerWidth - (this.summaryBubbleContent.find("h4, p").offset().left + 40);
//         e = Math.min(e, 400), this.summaryBubbleContent.find("h4, p").css("max-width", e), this.summaryBubble.width(this.summaryBubble.height() + this.summaryBubbleContent.outerWidth()), "number" == typeof t && (this.collapseSummaryTimeout = setTimeout(this.collapseSummary.bind(this), t))
//     },
//     expandSummaryError: function() {
//         this.summaryBubbleError = !0, this.expandSummary()
//     },
//     collapseSummary: function() {
//         this.summaryBubbleError || (clearTimeout(this.collapseSummaryTimeout), this.summaryBubble.width(this.summaryBubble.height()))
//     },
//     setPresentControls: function(t) {
//         this.summaryBubble.toggleClass("hidden", !t), Reveal.configure({
//             slideNumber: SLConfig.deck.slide_number && t
//         })
//     },
//     setPresentNotes: function(t) {
//         Reveal.configure({
//             showNotes: t
//         })
//     },
//     setPresentUpsizing: function(t) {
//         Reveal.configure({
//             maxScale: t ? SL.config.PRESENT_UPSIZING_MAX_SCALE : 1
//         })
//     },
//     onRevealReady: function() {
//         this.setPresentControls(SL.current_deck.user_settings.get("present_controls")), this.setPresentNotes(SL.current_deck.user_settings.get("present_notes")), this.setPresentUpsizing(SL.current_deck.user_settings.get("present_upsizing"))
//     },
//     onStreamReady: function() {
//         this.expandSummary(5e3)
//     },
//     onStreamStateChanged: function(t) {
//         t && "boolean" == typeof t.present_controls && this.setPresentControls(t.present_controls), t && "boolean" == typeof t.present_notes && this.setPresentNotes(t.present_notes), t && "boolean" == typeof t.present_upsizing && this.setPresentUpsizing(t.present_upsizing)
//     },
//     onStreamStatusChanged: function(t) {
//         t === SL.helpers.StreamLive.STATUS_WAITING_FOR_PUBLISHER ? (this.renderWaitingSummary(), this.expandSummaryError(), this.startUpdatingTimer()) : (this.summaryBubbleError = !1, this.renderUserSummary(), this.stopUpdatingTimer())
//     }
// }),

// SL("views.decks").LiveServer = SL.views.Base.extend({
//     init: function() {
//         this._super(), this.strings = {
//             speakerViewURL: SL.current_deck.getURL({
//                 view: "speaker"
//             }),
//             liveViewHelpURL: "http://help.slides.com/knowledgebase/articles/333924",
//             speakerViewHelpURL: "http://help.slides.com/knowledgebase/articles/333923"
//         }, SL.util.setupReveal({
//             history: !0,
//             openLinksInTabs: !0,
//             trackEvents: !0,
//             showNotes: SL.current_deck.get("share_notes") && SL.current_user.settings.get("present_notes"),
//             controls: SL.current_user.settings.get("present_controls"),
//             progress: SL.current_user.settings.get("present_controls"),
//             maxScale: SL.current_user.settings.get("present_upsizing") ? SL.config.PRESENT_UPSIZING_MAX_SCALE : 1
//         }), this.stream = new SL.helpers.StreamLive({
//             publisher: !0,
//             showErrors: !1
//         }), this.stream.connect(), this.render(), this.bind(), SL.helpers.PageLoader.waitForFonts()
//     },
//     render: function() {
//         this.presentationControls = $(['<div class="presentation-controls">', '<div class="presentation-controls-content">', "<h2>Presentation Controls</h2>", '<div class="presentation-controls-section">', "<h2>Speaker View</h2>", '<p>The control panel for your presentation. Includes speaker notes, an upcoming slide preview and more. It can be used as a remote control when opened from a mobile device. <a href="' + this.strings.speakerViewHelpURL + '" target="_blank">Learn more.</a></p>', '<a class="button l outline" href="' + this.strings.speakerViewURL + '" target="_blank">Open speaker view</a>', "</div>", '<div class="presentation-controls-section">', "<h2>Present Live</h2>", '<p class="live-description">Share this link with your audience to have them follow along with the presentation in real-time. <a href="' + this.strings.liveViewHelpURL + '" target="_blank">Learn more.</a></p>', '<div class="live-share"></div>', "</div>", '<div class="presentation-controls-section sl-form">', "<h2>Options</h2>", '<div class="sl-checkbox outline fullscreen-toggle">', '<input id="fullscreen-checkbox" type="checkbox">', '<label for="fullscreen-checkbox">Fullscreen</label>', "</div>", '<div class="sl-checkbox outline controls-toggle" data-tooltip="Hide the presentation control arrows and progress bar." data-tooltip-alignment="r" data-tooltip-delay="500" data-tooltip-maxwidth="250">', '<input id="controls-checkbox" type="checkbox">', '<label for="controls-checkbox">Hide controls</label>', "</div>", '<div class="sl-checkbox outline notes-toggle" data-tooltip="Hide your speaker notes from the audience." data-tooltip-alignment="r" data-tooltip-delay="500" data-tooltip-maxwidth="250">', '<input id="controls-checkbox" type="checkbox">', '<label for="controls-checkbox">Hide notes</label>', "</div>", '<div class="sl-checkbox outline upsizing-toggle" data-tooltip="Your content is automatically scaled up to fill as much of the browser window as possible. This option disables that scaling and favors the original authored at size." data-tooltip-alignment="r" data-tooltip-delay="500" data-tooltip-maxwidth="300">', '<input id="upsizing-checkbox" type="checkbox">', '<label for="upsizing-checkbox">Disable upsizing</label>', "</div>", "</div>", "</div>", '<footer class="presentation-controls-footer">', '<button class="button xl positive start-presentation">Start presentation</button>', "</footer>", "</div>"].join("")).appendTo(document.body), this.presentationControlsExpander = $(['<div class="presentation-controls-expander" data-tooltip="Show menu" data-tooltip-alignment="r">', '<span class="icon i-chevron-right"></span>', "</div>"].join("")).appendTo(document.body), $(".global-header").prependTo(this.presentationControls), this.presentationControlsScrollShadow = new SL.components.ScrollShadow({
//             parentElement: this.presentationControls,
//             headerElement: this.presentationControls.find(".global-header"),
//             contentElement: this.presentationControls.find(".presentation-controls-content"),
//             footerElement: this.presentationControls.find(".presentation-controls-footer")
//         }),
//         SL.helpers.Fullscreen.isEnabled() === !1 && this.presentationControls.find(".fullscreen-toggle").hide(), SL.current_deck.get("share_notes") || this.presentationControls.find(".notes-toggle").hide(), this.syncPresentationControls(), this.renderLiveShare()
//     },
//     bind: function() {
//         this.presentationControls.find(".live-view-url").on("mousedown", this.onLiveURLMouseDown.bind(this)), this.presentationControls.find(".fullscreen-toggle").on("vclick", this.onFullscreenToggled.bind(this)), this.presentationControls.find(".controls-toggle").on("vclick", this.onControlsToggled.bind(this)), this.presentationControls.find(".notes-toggle").on("vclick", this.onNotesToggled.bind(this)), this.presentationControls.find(".upsizing-toggle").on("vclick", this.onUpsizingToggled.bind(this)), this.presentationControls.find(".button.start-presentation").on("vclick", this.onStartPresentationClicked.bind(this)), this.presentationControlsExpander.on("vclick", this.onStopPresentationClicked.bind(this)), $(document).on("webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange", this.onFullscreenChange.bind(this)), $(document).on("mousemove", this.onMouseMove.bind(this)), $(document).on("mouseleave", this.onMouseLeave.bind(this))
//     },
//     syncPresentationControls: function() {
//         this.presentationControls.find(".fullscreen-toggle input").prop("checked", SL.helpers.Fullscreen.isActive()), this.presentationControls.find(".controls-toggle input").prop("checked", !SL.current_user.settings.get("present_controls")), this.presentationControls.find(".upsizing-toggle input").prop("checked", !SL.current_user.settings.get("present_upsizing")), this.presentationControls.find(".notes-toggle input").prop("checked", !SL.current_user.settings.get("present_notes"))
//     },
//     renderLiveShare: function() {
//         this.liveShareElement = this.presentationControls.find(".live-share"), SL.current_deck.isVisibilityAll() ? this.showLiveShareLink(SL.current_deck.getURL({
//             view: "live"
//         })) : this.showLiveShareLinkGenerator()
//     },
//     showLiveShareLinkGenerator: function() {
//         this.presentationControls.find(".live-description").html('Share a link with your audience to have them follow along with the presentation in real-time. Note that all private links you share point to the same live presentation session. <a href="' + this.strings.liveViewHelpURL + '" target="_blank">Learn more.</a>'), this.liveShareButton = $('<button class="button l outline ladda-button" data-style="zoom-out" data-spinner-color="#222">Share link</button>'), this.liveShareButton.appendTo(this.liveShareElement), this.liveShareButton.on("vclick", function() {
//             "undefined" != typeof SLConfig && "string" == typeof SLConfig.deck.user.username && "string" == typeof SLConfig.deck.slug ? SL.popup.open(SL.components.decksharer.DeckSharer, {
//                 deck: SL.current_deck,
//                 deckView: "live"
//             }) : SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
//         }.bind(this))
//     },
//     showLiveShareLink: function(t) {
//         this.liveShareElement.html('<input class="live-view-url input-field" type="text" value="' + t + '" readonly />'), this.liveShareElement.find(".live-view-url").on("mousedown", this.onLiveURLMouseDown.bind(this))
//     },
//     showStatus: function(t) {
//         this.statusElement ? this.statusElement.find(".stream-status-message").html(t) : this.statusElement = $(['<div class="stream-status">', '<p class="stream-status-message">' + t + "</p>", "</div>"].join("")).appendTo(document.body)
//     },
//     clearStatus: function() {
//         this.statusElement && (this.statusElement.remove(), this.statusElement = null)
//     },
//     savePresentOption: function(t) {
//         this.xhrRequests = this.xhrRequests || {}, this.xhrRequests[t] && this.xhrRequests[t].abort();
//         var e = {
//             url: SL.config.AJAX_UPDATE_USER_SETTINGS,
//             type: "PUT",
//             context: this,
//             data: {
//                 user_settings: {}
//             }
//         };
//         e.data.user_settings[t] = SL.current_user.settings.get(t), this.xhrRequests[t] = $.ajax(e).always(function() {
//             this.xhrRequests[t] = null
//         })
//     },
//     startPresentation: function() {
//         $("html").addClass("presentation-started"), this.presentationStarted = !0
//     },
//     stopPresentation: function() {
//         $("html").removeClass("presentation-started"), this.presentationStarted = !1, this.presentationControlsExpander.removeClass("visible")
//     },
//     hasStartedPresentation: function() {
//         return !!this.presentationStarted
//     },
//     onLiveURLMouseDown: function(t) {
//         $(t.target).focus().select(), t.preventDefault()
//     },
//     onControlsToggled: function(t) {
//         t.preventDefault();
//         var e = !Reveal.getConfig().controls;
//         SL.current_user.settings.set("present_controls", e), Reveal.configure({
//             controls: e,
//             progress: e,
//             slideNumber: SLConfig.deck.slide_number && e
//         }), this.syncPresentationControls(), this.savePresentOption("present_controls"), this.stream.publish(null, {
//             present_controls: e
//         })
//     },
//     onNotesToggled: function(t) {
//         t.preventDefault();
//         var e = !Reveal.getConfig().showNotes;
//         SL.current_user.settings.set("present_notes", e), Reveal.configure({
//             showNotes: e
//         }), this.syncPresentationControls(), this.savePresentOption("present_notes"), this.stream.publish(null, {
//             present_notes: e
//         })
//     },
//     onUpsizingToggled: function(t) {
//         t.preventDefault();
//         var e = Reveal.getConfig().maxScale <= 1;
//         SL.current_user.settings.set("present_upsizing", e), Reveal.configure({
//             maxScale: e ? SL.config.PRESENT_UPSIZING_MAX_SCALE : 1
//         }), this.syncPresentationControls(), this.savePresentOption("present_upsizing"), this.stream.publish(null, {
//             present_upsizing: e
//         })
//     },
//     onFullscreenToggled: function(t) {
//         t.preventDefault(), SL.helpers.Fullscreen.toggle()
//     },
//     onFullscreenChange: function() {
//         this.syncPresentationControls(), Reveal.layout()
//     },
//     onStartPresentationClicked: function() {
//         this.startPresentation()
//     },
//     onStopPresentationClicked: function() {
//         this.stopPresentation()
//     },
//     onMouseMove: function(t) {
//         this.presentationControlsExpander.toggleClass("visible", this.hasStartedPresentation() && t.clientX < 50)
//     },
//     onMouseLeave: function() {
//         this.presentationControlsExpander.removeClass("visible")
//     }
// }),

// SL("views.decks").Password = SL.views.Base.extend({
//     OUTRO_DURATION: 600,
//     init: function() {
//         this._super(), this.domElement = $(".password-content"), this.formElement = this.domElement.find(".sl-form"), this.inputElement = this.formElement.find(".password-input"), this.submitButton = this.formElement.find(".password-submit"), this.submitLoader = Ladda.create(this.submitButton.get(0)), this.iconElement = $(".password-icon"), this.titleElement = $(".password-title"), this.incorrectPasswordCounter = 0, this.incorrectPasswordMessages = ["Wrong password, please try again", "Still wrong, give it another try", "That one was wrong too", "Nope"], this.submitButton.on("vclick", this.onSubmitClicked.bind(this)), $(document).on("keydown", this.onKeyDown.bind(this))
//     },
//     submit: function() {
//         this.request || (this.submitLoader.start(), this.iconElement.removeClass("wobble"), this.request = $.ajax({
//             url: SL.config.AJAX_ACCESS_TOKENS_PASSWORD_AUTH(SLConfig.access_token_id),
//             type: "PUT",
//             context: this,
//             data: {
//                 access_token: {
//                     password: this.inputElement.val()
//                 }
//             }
//         }).done(function() {
//             this.domElement.addClass("outro"), this.titleElement.text("All set! Loading deck..."), setTimeout(function() {
//                 window.location.reload()
//             }, this.OUTRO_DURATION)
//         }).fail(function() {
//             this.submitLoader.stop(), this.titleElement.text(this.getIncorrectPasswordMessage()), this.iconElement.addClass("wobble"), this.request = null
//         }))
//     },
//     getIncorrectPasswordMessage: function() {
//         return this.incorrectPasswordMessages[this.incorrectPasswordCounter++ % this.incorrectPasswordMessages.length]
//     },
//     onSubmitClicked: function(t) {
//         t.preventDefault(), this.submit()
//     },
//     onKeyDown: function(t) {
//         13 === t.keyCode && (t.preventDefault(), this.submit())
//     }
// }),

SL("views.decks").Review = SL.views.Base.extend({
    init: function() {
        this._super(), $("html").toggleClass("small-mode", window.innerWidth < 850), SL.util.setupReveal({
            help: !1,
            history: !0,
            openLinksInTabs: !0,
            margin: .15
        }),
            SL.helpers.PageLoader.show(), this.setupCollaboration().then(function() {
            SL.fonts.isReady() ? SL.helpers.PageLoader.hide() : SL.fonts.ready.add(SL.helpers.PageLoader.hide)
        }),
            SL.session.enforce()
    },
    setupCollaboration: function() {
        this.collaboration = new SL.components.collab.Collaboration({
            container: document.body,
            fixed: !$("html").hasClass("small-mode")
        });
        var t = new Promise(function(t) {
            this.collaboration.loaded.add(function() {
                t()
            }.bind(this))
        }.bind(this));
        return this.collaboration.load(), t
    }
}),
SL("views.decks").Show = SL.views.Base.extend({
    init: function() {
        this._super(), SL.util.setupReveal({
            history: !0,
            embedded: !0,
            pause: !1,
            margin: .1,
            openLinksInTabs: !0,
            trackEvents: !0
        }), this.setupDisqus(), this.setupPills(), $("header .deck-promotion").length && $("header").addClass("extra-wide"), Modernizr.fullscreen === !1 && $(".deck-options .fullscreen-button").hide(), this.bind(), this.layout()
    },
    bind: function() {
        this.editButton = $(".deck-options .edit-button"), this.editButtonOriginalLink = this.editButton.attr("href"), $(".deck-options .fork-button").on("click", this.onForkClicked.bind(this)), $(".deck-options .share-button").on("click", this.onShareClicked.bind(this)), $(".deck-options .comment-button").on("click", this.onCommentsClicked.bind(this)), $(".deck-options .fullscreen-button").on("click", this.onFullScreenClicked.bind(this)), this.visibilityButton = $(".deck-options .visibility-button"), this.visibilityButton.on("click", this.onVisibilityClicked.bind(this)), $(document).on("webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange", Reveal.layout), this.onWindowScroll = $.debounce(this.onWindowScroll, 200), $(window).on("resize", this.layout.bind(this)), $(window).on("scroll", this.onWindowScroll.bind(this)), Reveal.addEventListener("slidechanged", this.onSlideChanged.bind(this)), Reveal.addEventListener("fragmentshown", this.hideSummary), Reveal.addEventListener("fragmenthidden", this.hideSummary)
    },
    setupPills: function() {
        this.hideSummary = this.hideSummary.bind(this), this.hideInstructions = this.hideInstructions.bind(this), this.summaryPill = $(".summary-pill"), this.instructionsPill = $(".instructions-pill"), this.summaryPill.on("click", this.hideSummary), this.instructionsPill.on("click", this.hideInstructions), this.showSummaryTimeout = setTimeout(this.showSummary.bind(this), 1e3), this.hideSummaryTimeout = setTimeout(this.hideSummary.bind(this), 6e3), this.showNavigationInstructions()
    },
    setupDisqus: function() {
        $("#disqus_thread").length ? $(window).on("load", function() {
            {
                var t = window.disqus_shortname = "slidesapp";
                window.disqus_identifier = SLConfig.deck.id
            }! function() {
                var e = document.createElement("script");
                e.type = "text/javascript", e.async = !0, e.src = "//" + t + ".disqus.com/embed.js", (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(e)
            }()
        }) : $(".options .comment-button").hide()
    },
    showSummary: function() {
        this.summaryPill && this.summaryPill.addClass("visible")
    },
    hideSummary: function() {
        clearTimeout(this.showSummaryTimeout), this.summaryPill && (this.summaryPill.removeClass("visible"), this.summaryPill.on("transitionend", this.summaryPill.remove), this.summaryPill = null)
    },
    canShowInstructions: function() {
        return !SL.util.user.isLoggedIn() && !SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET && Reveal.getTotalSlides() > 1 && Modernizr.localstorage
    },
    showNavigationInstructions: function() {
        this.showInstructions("slides-has-seen-deck-navigation-instructions", 6e3, {
            title: "Navigation instructions",
            description: "Press the space key or click the arrows to the right"
        })
    },
    showVerticalInstructions: function() {
        this.showInstructions("slides-has-seen-deck-vertical-instructions", 1e3, {
            title: "There's a vertical slide below",
            description: "Use the controls to the right or the keyboard arrows",
            icon: "down-arrow"
        })
    },
    showInstructions: function(t, e, i) {
        clearTimeout(this.showInstructionsTimeout), this.instructionsPill && this.canShowInstructions() && !localStorage.getItem(t) && (localStorage.setItem(t, "yes"), this.showInstructionsTimeout = setTimeout(function() {
            this.instructionsPill.attr("data-icon", i.icon), this.instructionsPill.find(".pill-title").text(i.title), this.instructionsPill.find(".pill-description").text(i.description), this.instructionsPill.addClass("visible"), this.layout()
        }.bind(this), e))
    },
    hideInstructions: function() {
        clearTimeout(this.showInstructionsTimeout), this.instructionsPill && this.instructionsPill.removeClass("visible")
    },
    layout: function() {
        this.summaryPill && this.summaryPill.css("left", (window.innerWidth - this.summaryPill.width()) / 2), this.instructionsPill && this.instructionsPill.css("left", (window.innerWidth - this.instructionsPill.width()) / 2);
        var t = $(".reveal .playback"),
            e = $(".deck-kudos"),
            i = {
                opacity: 1
            };
        e.length && t.length && (i.marginLeft = t.offset().left + t.outerWidth() - 10), e.css(i)
    },
    saveVisibility: function(t) {
        var e = {
            type: "POST",
            url: SL.config.AJAX_PUBLISH_DECK(SL.current_deck.get("id")),
            context: this,
            data: {
                visibility: t
            }
        };
        $.ajax(e).done(function(t) {
            t.deck.visibility === SL.models.Deck.VISIBILITY_SELF ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_SELF")) : t.deck.visibility === SL.models.Deck.VISIBILITY_TEAM ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_TEAM")) : t.deck.visibility === SL.models.Deck.VISIBILITY_ALL && SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ALL")), "string" == typeof t.deck.slug && SL.current_deck.set("slug", t.deck.slug), "string" == typeof t.deck.visibility && SL.current_deck.set("visibility", t.deck.visibility)
        }).fail(function() {
            SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ERROR"), "negative")
        })
    },
    onShareClicked: function() {
        return "undefined" != typeof SLConfig && "string" == typeof SLConfig.deck.user.username && "string" == typeof SLConfig.deck.slug ? SL.popup.open(SL.components.decksharer.DeckSharer, {
            deck: SL.current_deck
        }) : SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), SL.analytics.trackPresenting("Share clicked"), !1
    },
    onCommentsClicked: function() {
        SL.analytics.trackPresenting("Comments clicked")
    },
    onFullScreenClicked: function() {
        var t = $(".reveal-viewport").get(0);
        return t ? (SL.helpers.Fullscreen.enter(t), !1) : void SL.analytics.trackPresenting("Fullscreen clicked")
    },
    onForkClicked: function() {
        return SL.analytics.trackPresenting("Fork clicked"), $.ajax({
            type: "POST",
            url: SL.config.AJAX_FORK_DECK(SLConfig.deck.id),
            context: this
        }).done(function() {
            window.location = SL.current_user.getProfileURL()
        }).fail(function() {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
        }), !1
    },
    onVisibilityClicked: function(t) {
        t.preventDefault();
        var e = SL.current_deck.get("visibility"),
            i = [];
        i.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_SELF"),
            selected: e === SL.models.Deck.VISIBILITY_SELF,
            callback: function() {
                this.saveVisibility(SL.models.Deck.VISIBILITY_SELF), SL.analytics.trackPresenting("Visibility changed", "self")
            }.bind(this)
        }),
        SL.current_user.isEnterprise() && i.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_TEAM"),
            selected: e === SL.models.Deck.VISIBILITY_TEAM,
            className: "divider",
            callback: function() {
                this.saveVisibility(SL.models.Deck.VISIBILITY_TEAM), SL.analytics.trackPresenting("Visibility changed", "team")
            }.bind(this)
        }), i.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_ALL"),
            selected: e === SL.models.Deck.VISIBILITY_ALL,
            callback: function() {
                this.saveVisibility(SL.models.Deck.VISIBILITY_ALL), SL.analytics.trackPresenting("Visibility changed", "all")
            }.bind(this)
        }),
            SL.prompt({
                anchor: $(t.currentTarget),
                type: "select",
                className: "sl-visibility-prompt",
                data: i
            }),
            SL.analytics.trackPresenting("Visibility menu opened")
    },
    onSlideChanged: function(t) {
        this.hideSummary(), this.hideInstructions();
        var e = "#";
        t.indexh && (e += "/" + t.indexh, t.indexv && (e += "/" + t.indexv)), this.editButton.attr("href", this.editButtonOriginalLink + e), t.indexh > 0 && 0 === t.indexv && Reveal.availableRoutes().down && this.showVerticalInstructions()
    },
    onWindowScroll: function() {
        $(window).scrollTop() > 10 && (this.hideSummary(), this.hideInstructions())
    }
}),

// SL("views.decks").Speaker = SL.views.Base.extend({
//     init: function() {
//         this._super(), this.notesElement = $(".speaker-controls .notes"), this.notesValue = $(".speaker-controls .notes .value"), this.timeElement = $(".speaker-controls .time"), this.timeTimerValue = $(".speaker-controls .time .timer-value"), this.timeClockValue = $(".speaker-controls .time .clock-value"), this.subscribersElement = $(".speaker-controls .subscribers"), this.subscribersValue = $(".speaker-controls .subscribers .subscribers-value"), this.currentElement = $(".current-slide"), this.upcomingElement = $(".upcoming-slide"), this.upcomingFrame = $(".upcoming-slide iframe"), this.upcomingJumpTo = $(".upcoming-slide-jump-to"), this.speakerLayout = $(".speaker-layout-button"), this.speakerLayout.on("vclick", this.onLayoutClicked.bind(this)), $(".reveal [data-autoplay]").removeAttr("data-autoplay"), this.setLayout(SL.current_user.settings.get("speaker_layout")), this.upcomingFrame.length ? (this.upcomingFrame.on("load", this.onUpcomingFrameLoaded.bind(this)), this.upcomingFrame.attr("src", this.upcomingFrame.attr("data-src"))) : this.setup(), SL.helpers.PageLoader.show()
//     },
//     setup: function() {
//         Reveal.addEventListener("ready", function() {
//             this.currentReveal = window.Reveal, this.currentReveal.addEventListener("slidechanged", this.onCurrentSlideChanged.bind(this)), this.currentReveal.addEventListener("fragmentshown", this.onCurrentFragmentChanged.bind(this)), this.currentReveal.addEventListener("fragmenthidden", this.onCurrentFragmentChanged.bind(this)), this.currentReveal.addEventListener("paused", this.onCurrentPaused.bind(this)), this.currentReveal.addEventListener("resumed", this.onCurrentResumed.bind(this)), this.upcomingFrame.length && (this.upcomingReveal = this.upcomingFrame.get(0).contentWindow.Reveal, this.upcomingReveal.isReady() ? this.setupUpcomingReveal() : this.upcomingReveal.addEventListener("ready", this.setupUpcomingReveal.bind(this))), this.setupTimer(), this.setupTouch(), this.stream = new SL.helpers.StreamLive({
//                 reveal: this.currentReveal,
//                 publisher: !0,
//                 showErrors: !0
//             }), this.stream.ready.add(this.onStreamReady.bind(this)), this.stream.subscribersChanged.add(this.onStreamSubscribersChanged.bind(this)), this.stream.connect(), this.layout(), window.addEventListener("resize", this.layout.bind(this))
//         }.bind(this)), SL.util.setupReveal({
//             touch: !0,
//             history: !1,
//             autoSlide: 0,
//             openLinksInTabs: !0,
//             trackEvents: !0,
//             showNotes: !1
//         })
//     },
//     setupUpcomingReveal: function() {
//         this.upcomingReveal.configure({
//             history: !1,
//             controls: !1,
//             progress: !1,
//             overview: !1,
//             autoSlide: 0,
//             transition: "none",
//             backgroundTransition: "none"
//         }), this.upcomingReveal.addEventListener("slidechanged", this.onUpcomingSlideChanged.bind(this)), this.upcomingReveal.addEventListener("fragmentshown", this.onUpcomingFragmentChanged.bind(this)), this.upcomingReveal.addEventListener("fragmenthidden", this.onUpcomingFragmentChanged.bind(this)), this.upcomingFrame.get(0).contentWindow.document.body.className += " no-transition", this.upcomingJumpTo.on("vclick", this.onJumpToUpcomingSlide.bind(this)), this.syncJumpButton()
//     },
//     setupTouch: function() {
//         if (this.isMobileSpeakerView() && (SL.util.device.HAS_TOUCH || window.navigator.pointerEnabled)) {
//             this.touchControls = $(['<div class="touch-controls">', '<div class="touch-controls-content">', '<span class="status">', "Tap or Swipe to change slide", "</span>", '<span class="slide-number"></span>', "</div>", '<div class="touch-controls-progress"></div>', "</div>"].join("")).appendTo(document.body), this.touchControlsProgress = this.touchControls.find(".touch-controls-progress"), this.touchControlsSlideNumber = this.touchControls.find(".slide-number"), this.touchControlsStatus = this.touchControls.find(".status"), setTimeout(function() {
//                 this.touchControls.addClass("visible")
//             }.bind(this), 1e3);
//             var t = document.body,
//                 e = new Hammer(t);
//             e.get("swipe").set({
//                 direction: Hammer.DIRECTION_ALL
//             }), e.get("press").set({
//                 threshold: 1e3
//             }), $(t).on("touchstart", function(i) {
//                 1 === $(i.target).closest(".notes-overflowing").length && (e.stop(), $(t).one("touchend", function(t) {
//                     var e = {
//                             x: i.originalEvent.pageX,
//                             y: i.originalEvent.pageY
//                         },
//                         n = {
//                             x: t.originalEvent.pageX,
//                             y: t.originalEvent.pageY
//                         };
//                     SL.util.trig.distanceBetween({
//                         x: e.x,
//                         y: e.y
//                     }, {
//                         x: n.x,
//                         y: n.y
//                     }) < 10 && (this.currentReveal.next(), this.showTouchStatus("Next slide"))
//                 }.bind(this)))
//             }.bind(this)), e.on("swipe", function(t) {
//                 switch (t.direction) {
//                     case Hammer.DIRECTION_LEFT:
//                         this.currentReveal.right(), this.showTouchStatus("Next slide");
//                         break;
//                     case Hammer.DIRECTION_RIGHT:
//                         this.currentReveal.left(), this.showTouchStatus("Previous slide");
//                         break;
//                     case Hammer.DIRECTION_UP:
//                         this.currentReveal.down(), this.showTouchStatus("Next vertical slide");
//                         break;
//                     case Hammer.DIRECTION_DOWN:
//                         this.currentReveal.up(), this.showTouchStatus("Previous vertical slide")
//                 }
//             }.bind(this)), e.on("tap", function() {
//                 this.currentReveal.next(), this.showTouchStatus("Next slide")
//             }.bind(this)), e.on("press", function() {
//                 this.currentReveal.isPaused() && (this.currentReveal.togglePause(!1), this.showTouchStatus("Resumed"))
//             }.bind(this))
//         }
//     },
//     setupTimer: function() {
//         this.timeTimerValue.on("click", this.restartTimer.bind(this)), this.restartTimer(), setInterval(this.syncTimer.bind(this), 1e3)
//     },
//     restartTimer: function() {
//         this.startTime = Date.now(), this.syncTimer()
//     },
//     layout: function() {
//         var t = window.innerHeight - this.notesValue.offset().top - 10;
//         this.isMobileSpeakerView() ? this.touchControls && (t -= this.touchControls.outerHeight()) : this.subscribersElement.hasClass("visible") && (t -= this.subscribersElement.outerHeight()), this.notesValue.height(t), this.syncNotesOverflow()
//     },
//     setLayout: function(t, e) {
//         $("html").attr("data-speaker-layout", t), this.currentReveal && this.currentReveal.layout(), this.upcomingReveal && this.upcomingReveal.layout(), this.layout(), e && (SL.current_user.settings.set("speaker_layout", t), SL.current_user.settings.save(["speaker_layout"]))
//     },
//     getLayout: function() {
//         return SL.current_user.settings.get("speaker_layout") || SL.views.decks.Speaker.LAYOUT_DEFAULT
//     },
//     sync: function() {
//         setTimeout(function() {
//             this.syncUpcomingSlide(), this.syncTouchControls(), this.syncNotes(), this.syncNotesOverflow(), this.syncTimer()
//         }.bind(this), 1)
//     },
//     syncTimer: function() {
//         var t = moment();
//         this.timeClockValue.html(t.format("hh:mm") + ' <span class="dim">' + t.format("A") + "<span>"), t.hour(0).minute(0).second((Date.now() - this.startTime) / 1e3);
//         var e = t.format("HH") + ":",
//             i = t.format("mm") + ":",
//             n = t.format("ss");
//         "00:" === e && (e = '<span class="dim">' + e + "</span>", "00:" === i && (i = '<span class="dim">' + i + "</span>")), this.timeTimerValue.html(e + i + n)
//     },
//     syncUpcomingSlide: function() {
//         if (this.upcomingReveal) {
//             var t = this.currentReveal.getIndices();
//             this.upcomingReveal.slide(t.h, t.v, t.f), this.upcomingReveal.next();
//             var e = this.upcomingReveal.getIndices();
//             this.upcomingElement.toggleClass("is-last-slide", t.h === e.h && t.v === e.v && t.f === e.f)
//         }
//     },
//     syncJumpButton: function() {
//         if (this.upcomingReveal) {
//             var t = this.currentReveal.getIndices(),
//                 e = this.upcomingReveal.getIndices();
//             this.upcomingJumpTo.toggleClass("hidden", t.h === e.h && t.v === e.v && t.f === e.f)
//         }
//     },
//     syncNotes: function() {
//         var t = $(this.currentReveal.getCurrentSlide()).attr("data-notes") || "";
//         t ? (this.notesElement.show(), this.notesValue.text(t), this.notesElement.removeAttr("data-note-length"), t.length < 120 ? this.notesElement.attr("data-note-length", "short") : t.length > 210 && this.notesElement.attr("data-note-length", "long")) : this.notesElement.hide()
//     },
//     syncNotesOverflow: function() {
//         this.notesValue.toggleClass("notes-overflowing", this.notesValue.prop("scrollHeight") > this.notesValue.height())
//     },
//     syncTouchControls: function() {
//         if (this.touchControls) {
//             var t = this.currentReveal.getProgress();
//             this.touchControlsProgress.css({
//                 "-webkit-transform": "scale(" + t + ", 1)",
//                 "-moz-transform": "scale(" + t + ", 1)",
//                 "-ms-transform": "scale(" + t + ", 1)",
//                 transform: "scale(" + t + ", 1)"
//             });
//             var e = $(".reveal .slides section:not(.stack)").length,
//                 i = this.currentReveal.getIndices().h + this.currentReveal.getIndices().v;
//             i += $(".reveal .slides>section.present").prevAll("section").find(">section:gt(0)").length, i += 1, this.touchControlsSlideNumber.html(i + "/" + e)
//         }
//     },
//     showTouchStatus: function(t) {
//         clearTimeout(this.touchControlsStatusTimeout);
//         var e = this.currentReveal && this.currentReveal.isPaused();
//         e && (t = "Paused (tap+hold to resume)"), this.touchControlsStatus && (this.touchControlsStatus.text(t).removeClass("hidden"), e || (this.touchControlsStatusTimeout = setTimeout(function() {
//             this.touchControlsStatus.addClass("hidden")
//         }.bind(this), 1e3)))
//     },
//     isMobileSpeakerView: function() {
//         return $("html").hasClass("speaker-mobile")
//     },
//     onUpcomingFrameLoaded: function() {
//         this.setup()
//     },
//     onStreamReady: function() {
//         SL.helpers.PageLoader.hide(), this.sync()
//     },
//     onStreamSubscribersChanged: function(t) {
//         "number" == typeof this.subscriberCount && (this.subscribersValue.removeClass("flash green flash-red"), t > this.subscriberCount ? setTimeout(function() {
//             this.subscribersValue.addClass("flash-green")
//         }.bind(this), 1) : t < this.subscriberCount && setTimeout(function() {
//             this.subscribersValue.addClass("flash-red")
//         }.bind(this), 1)), this.subscriberCount = t, this.subscriberCount > 0 ? (this.subscribersValue.html('<span class="icon i-eye"></span>' + t), this.subscribersElement.addClass("visible")) : this.subscribersElement.removeClass("visible"), this.layout()
//     },
//     onCurrentSlideChanged: function() {
//         this.sync()
//     },
//     onCurrentFragmentChanged: function() {
//         this.sync()
//     },
//     onCurrentPaused: function() {
//         this.pausedInstructions || (this.pausedInstructions = $('<h3 class="message-overlay">Paused. Press the "B" key to resume.</h3>'), this.pausedInstructions.appendTo(this.currentElement), this.pausedInstructions.addClass("visible"))
//     },
//     onCurrentResumed: function() {
//         this.pausedInstructions && (this.pausedInstructions.remove(), this.pausedInstructions = null)
//     },
//     onUpcomingSlideChanged: function() {
//         this.syncJumpButton()
//     },
//     onUpcomingFragmentChanged: function() {
//         this.syncJumpButton()
//     },
//     onJumpToUpcomingSlide: function() {
//         var t = this.upcomingReveal.getIndices();
//         this.currentReveal.slide(t.h, t.v, t.f), this.syncUpcomingSlide()
//     },
//     onLayoutClicked: function() {
//         var t = this.getLayout();
//         SL.prompt({
//             anchor: this.speakerLayout,
//             type: "select",
//             title: "Speaker layout",
//             className: "sl-speaker-layout-prompt",
//             data: [{
//                 html: '<div class="speaker-layout-icon" data-speaker-layout="' + SL.views.decks.Speaker.LAYOUT_DEFAULT + '"></div><h3>Default</h3>',
//                 selected: t === SL.views.decks.Speaker.LAYOUT_DEFAULT,
//                 callback: this.setLayout.bind(this, SL.views.decks.Speaker.LAYOUT_DEFAULT, !0)
//             }, {
//                 html: '<div class="speaker-layout-icon" data-speaker-layout="' + SL.views.decks.Speaker.LAYOUT_WIDE + '"></div><h3>Wide</h3>',
//                 selected: t === SL.views.decks.Speaker.LAYOUT_WIDE,
//                 callback: this.setLayout.bind(this, SL.views.decks.Speaker.LAYOUT_WIDE, !0)
//             }, {
//                 html: '<div class="speaker-layout-icon" data-speaker-layout="' + SL.views.decks.Speaker.LAYOUT_TALL + '"></div><h3>Tall</h3>',
//                 selected: t === SL.views.decks.Speaker.LAYOUT_TALL,
//                 callback: this.setLayout.bind(this, SL.views.decks.Speaker.LAYOUT_TALL, !0)
//             }, {
//                 html: '<div class="speaker-layout-icon" data-speaker-layout="' + SL.views.decks.Speaker.LAYOUT_NOTES_ONLY + '"></div><h3>Notes only</h3>',
//                 selected: t === SL.views.decks.Speaker.LAYOUT_NOTES_ONLY,
//                 callback: this.setLayout.bind(this, SL.views.decks.Speaker.LAYOUT_NOTES_ONLY, !0)
//             }]
//         })
//     }
// }),

// SL.views.decks.Speaker.LAYOUT_DEFAULT = "default",
// SL.views.decks.Speaker.LAYOUT_WIDE = "wide",
// SL.views.decks.Speaker.LAYOUT_TALL = "tall",
// SL.views.decks.Speaker.LAYOUT_NOTES_ONLY = "notes-only",

// SL("views.devise").All = SL.views.Base.extend({
//     init: function() {
//         this._super(), this.setupForm(), $(".auth-button.email.toggle").on("vclick", function(t) {
//             t.preventDefault();
//             var e = $(".auth-option.email-auth");
//             e.toggleClass("hidden"), e.hasClass("hidden") === !1 && e.find('input[type="text"], input[type="email"]').first().focus()
//         })
//     },
//     setupForm: function() {
//         if (this.formElement = $("form"), this.formElement.length) {
//             this.formElement.find(".unit[data-validate]").each(function(t, e) {
//                 new SL.components.FormUnit(e)
//             });
//             var t = this.formElement.find("button[type=submit]");
//             t.length && this.formElement.on("submit", function(e) {
//                 if (!e.isDefaultPrevented()) {
//                     if ($(".g-recaptcha").length && "undefined" != typeof window.grecaptcha && "function" == typeof window.grecaptcha.getResponse && !grecaptcha.getResponse()) return SL.notify("Please answer the reCAPTCHA to prove you're not a robot"), e.preventDefault(), !1;
//                     Ladda.create(t.get(0)).start()
//                 }
//             }.bind(this))
//         }
//     }
// }),

// SL("views.devise").Edit = SL.views.devise.All.extend({
//     init: function() {
//         this._super(), $(".delete-account-toggle").on("click", this.onDeleteAccountToggleClicked.bind(this)), $(".delete-profile-photo").on("click", this.onDeleteProfilePhotoClicked.bind(this)), $("#user_email").on("change keyup", this.onEmailChanged.bind(this)), $("#user_password").on("change keyup", this.onNewPasswordChanged.bind(this)), this.undoAutoFill()
//     },
//     undoAutoFill: function() {
//         if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) var t = window.setInterval(function() {
//             var e = $("input:-webkit-autofill");
//             e.length > 0 && (window.clearInterval(t), e.each(function() {
//                 var t = $(this).clone(!0, !0);
//                 t.is("[type=password]") && t.val(""), $(this).after(t).remove();
//                 var e = t.parent(".unit");
//                 e.length && new SL.components.FormUnit(e)
//             }))
//         }, 20)
//     },
//     updatePasswordVerification: function() {
//         var t = $("#user_email").parents(".unit"),
//             e = $("#user_password").parents(".unit"),
//             i = $("#user_current_password").parents(".unit"),
//             n = t.data("controller"),
//             s = e.data("controller");
//         n && s && n.isUnchanged() && s.isUnchanged() ? (i.removeAttr("data-required"), i.addClass("hidden")) : (i.attr("data-required", "true"), i.removeClass("hidden"))
//     },
//     onDeleteAccountToggleClicked: function(t) {
//         t.preventDefault(), $(".delete-account").toggleClass("visible")
//     },
//     onDeleteProfilePhotoClicked: function(t) {
//         t.preventDefault(), $.ajax({
//             url: SL.config.AJAX_UPDATE_USER,
//             type: "PUT",
//             context: this,
//             data: {
//                 user: {
//                     profile_photo: ""
//                 }
//             }
//         }).done(function() {
//             $(".photo-editor").attr("data-photo-type", "gravatar")
//         }).fail(function() {
//             SL.notify("An error occured while saving", "negative")
//         })
//     },
//     onEmailChanged: function() {
//         this.updatePasswordVerification()
//     },
//     onNewPasswordChanged: function() {
//         this.updatePasswordVerification()
//     }
// }),

SL("views.home").Explore = SL.views.Base.extend({
    init: function() {
        this._super(), new SL.components.Search({
            url: SL.config.AJAX_SEARCH
        })
    }
}),
SL("views.home").Index = SL.views.Base.extend({
    MARQUEE_MIN_HEIGHT: 600,
    init: function() {
        this._super(), this.learnMoreButton = $(".marquee .description-cta-secondary"), this.scrollPromotion = $(".marquee .scroll-promotion"), this.scrollPromotionArrow = $(".marquee .scroll-promotion-arrow"), this.setupVideo(), this.bind(), this.startScrollPromotion()
    },
    setupVideo: function() {
        (SL.util.device.IS_PHONE || SL.util.device.IS_TABLET) && ($(".media-item video").each(function() {
            $(this).prop("controls", !0)
        }), $(".features .media-item").each(function() {
            var t = $(this),
                e = t.find(".image-wrapper"),
                i = t.find(".video-wrapper");
            i.length && (i.appendTo(t), e.appendTo(t), t.addClass("manually-triggered"), t.find(".browser-frame").remove(), t.find(".browser-content").remove())
        })), $(".media-item video").each(function(t, e) {
            var i = "";
            e = $(e), SL.util.device.IS_PHONE || SL.util.device.IS_TABLET ? e.parents(".media-item").addClass("loaded") : e.on("loadeddata", function() {
                e.parents(".media-item").addClass("loaded")
            }), e.find("span[data-src]").each(function(t, e) {
                e = $(e), i += '<source src="' + e.attr("data-src") + '" type="' + e.attr("data-type") + '">'
            }), i && e.html(i)
        })
    },
    bind: function() {
        this.learnMoreButton.on("click", this.onLearnMoreClicked.bind(this)), this.scrollPromotion.on("click", this.onLearnMoreClicked.bind(this)), this.scrollPromotionArrow.on("mouseover", this.onScrollPromotionOver.bind(this)), this.syncScrolling = $.debounce(this.syncScrolling, 300), this.trackScrolling = $.throttle(this.trackScrolling, 500), $(window).on("resize", this.onWindowResize.bind(this)), $(window).on("scroll", this.onWindowScroll.bind(this))
    },
    trackScrolling: function() {
        this.scrollTracking = this.scrollTracking || {};
        var t = $(window).scrollTop(),
            e = window.innerHeight,
            i = $(document).height(),
            n = Math.max(Math.min(t / (i - e), 1), 0);
        n > .1 && !this.scrollTracking[.1] && (this.scrollTracking[.1] = !0, SL.analytics.track("Home: Scrolled", "10%")), n > .5 && !this.scrollTracking[.5] && (this.scrollTracking[.5] = !0, SL.analytics.track("Home: Scrolled", "50%")), n > .95 && !this.scrollTracking[.95] && (this.scrollTracking[.95] = !0, SL.analytics.track("Home: Scrolled", "100%"))
    },
    syncScrolling: function() {
        var t = $(window).scrollTop();
        // if (!SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET) {
        //     var e, i = Number.MAX_VALUE;
        //     $(".media-item .video-wrapper, .media-item .animation-wrapper").each(function(n, s) {
        //         s = $(s);
        //         var o = s.offset().top,
        //             a = o - t;
        //         a > -100 && 500 > a && i > a && (i = a, e = s)
        //     }), this.activeFeature && !this.activeFeature.is(e) && this.stopFeatureAnimation(), e && !e.hasClass("playing") && (this.activeFeature = e, this.startFeatureAnimation())
        // }
        t > 20 && this.scrollPromotion.addClass("hidden")
    },
    startFeatureAnimation: function() {
        if (this.activeFeature.addClass("playing"), this.activeFeature.is(".video-wrapper")) this.activeFeature.find("video").get(0).play();
        else if (this.activeFeature.is(".animation-wrapper")) {
            var t = parseInt(this.activeFeature.attr("data-animation-steps"), 10),
                e = parseInt(this.activeFeature.attr("data-animation-duration"), 10),
                i = 1;
            this.activeFeature.attr("data-animation-step", i), this.activeFeatureInterval = setInterval(function() {
                i += 1, i = i > t ? 1 : i, this.activeFeature.attr("data-animation-step", i)
            }.bind(this), e / t)
        }
        SL.analytics.track("Home: Start feature animation")
    },
    stopFeatureAnimation: function() {
        this.activeFeature.removeClass("playing"), this.activeFeature.removeAttr("data-animation-step"), clearInterval(this.activeFeatureInterval), this.activeFeature.is(".video-wrapper") && this.activeFeature.find("video").get(0).pause()
    },
    startScrollPromotion: function() {
        clearInterval(this.scrollPromotionInterval), this.scrollPromotionInterval = setInterval(this.promoteScrolling.bind(this), 2500)
    },
    stopScrollPromotion: function() {
        clearInterval(this.scrollPromotionInterval), this.scrollPromotionInterval = null
    },
    promoteScrolling: function() {
        this.scrollPromotionArrow.removeClass("bounce"), setTimeout(function() {
            this.scrollPromotionArrow.addClass("bounce")
        }.bind(this), 1)
    },
    onScrollPromotionOver: function() {
        this.stopScrollPromotion()
    },
    onLearnMoreClicked: function() {
        SL.analytics.track("Home: Learn more clicked"), this.stopScrollPromotion()
    },
    onWindowResize: function() {
        this.syncScrolling()
    },
    onWindowScroll: function() {
        this.scrollPromotionInterval && this.stopScrollPromotion(), this.syncScrolling(), this.trackScrolling()
    }
}),
SL("views.statik").All = SL.views.Base.extend({
    init: function() {
        this._super(), $("img.click-to-expand").on("click", function() {
            $(this).toggleClass("expanded")
        }), this.setupToC(), this.setupHighlight()
    },
    setupToC: function() {
        var t = $(".sl-scroll-toc");
        if (t.length) {
            var e = t.position().top,
                i = function() {
                    t.toggleClass("fixed", $(window).scrollTop() > e)
                };
            $(window).on("scroll", $.throttle(i, 100)), i()
        }
    },
    setupHighlight: function() {
        $("code").length > 0 && "undefined" != typeof window.hljs && window.hljs.initHighlightingOnLoad()
    }
}),
SL("views.statik").Pricing = SL.views.statik.All.extend({
    init: function() {
        this._super(), $(".tier").each(this.setupTier.bind(this))
    },
    setupTier: function(t, e) {
        var e = $(e),
            i = e.find(".cta a");
        i.length && !i.hasClass("disabled") && (e.on("click", function(t) {
            t.preventDefault(), window.location = i.attr("href")
        }), e.on("mouseenter", function() {
            e.addClass("hover")
        }), e.on("mouseleave", function() {
            e.removeClass("hover")
        }))
    }
}),
// SL("views.subscriptions").EditPeriod = SL.views.Base.extend({
//     init: function() {
//         this._super(), Ladda.bind($("#payment-form button[type=submit]").get(0))
//     }
// }),
// SL("views.subscriptions").New = SL.views.Base.extend({
//     init: function() {
//         this._super(), this.onFormSubmit = this.onFormSubmit.bind(this), this.onStripeResponse = this.onStripeResponse.bind(this), this.formElement = $("#payment-form"), this.formElement.on("submit", this.onFormSubmit), this.formSubmitButton = this.formElement.find("button[type=submit]"), this.formSubmitLoader = Ladda.create(this.formSubmitButton.get(0)), $("#stripe-card-number").payment("formatCardNumber"), $("#stripe-card-cvc").payment("formatCardCVC"), SL.util.device.supportedByEditor() || $(".column").prepend("<section class=\"critical-error\"><h2>Not supported</h2><p>It looks like you're using a browser which isn't suported by the Slides editor. Please make sure to try the editor before upgrading.</p></section>"), $("html").hasClass("subscriptions new") && ($('input[name="subscription[billing_period]"]').on("change", this.syncSubmitButton.bind(this)), this.syncSubmitButton())
//     },
//     syncSubmitButton: function() {
//         var t = this.formElement.find('input[name="subscription[billing_period]"]:checked'),
//             e = t.attr("data-period-value"),
//             i = t.attr("data-usd-value"),
//             n = this.formElement.find(".devise-note");
//         0 === n.length && (n = $('<div class="devise-note">').insertAfter(this.formElement.find(".actions"))), e && i ? n.html("You are starting a <strong>" + e + "</strong> subscription and will be charged <strong>$" + i + "</strong> today.") : n.remove()
//     },
//     onFormSubmit: function(t) {
//         return this.formSubmitLoader.start(), Stripe.createToken(this.formElement, this.onStripeResponse), t.preventDefault(), !1
//     },
//     onStripeResponse: function(t, e) {
//         if (e.error) SL.notify(e.error.message, "negative"), this.formSubmitLoader.stop();
//         else {
//             var i = e.id;
//             this.formElement.find('input[name="subscription[token]"]').remove(), this.formElement.append($('<input type="hidden" name="subscription[token]" />').val(i)), this.formElement.get(0).submit()
//         }
//     }
// }),
// SL("views.subscriptions").Show = SL.views.Base.extend({
//     DOTTED_CARD_PREFIX: "&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; ",
//     init: function() {
//         this._super(), this.strings = {
//             CONFIRM_UNSUBSCRIBE_ACTION: "Cancel subscription",
//             CONFIRM_UNSUBSCRIBE_DESCRIPTION: SL.locale.get("REMOVE_PRO_CONFIRM")
//         }, this.load()
//     },
//     bindLadda: function() {
//         $(".column section .ladda-button").each(function(t, e) {
//             e = $(e), e.data("ladda") || e.data("ladda", Ladda.create(e.get(0)))
//         })
//     },
//     load: function() {
//         $.ajax({
//             url: SL.config.AJAX_SUBSCRIPTIONS_STATUS,
//             type: "GET",
//             context: this
//         }).done(this.onDataLoaded).fail(this.onDataFailed)
//     },
//     onDataLoaded: function(t) {
//         this.data = new SL.models.Customer(t.customer), this.render()
//     },
//     onDataFailed: function() {
//         $(".billing-loader").text(SL.locale.get("BILLING_DETAILS_ERROR"))
//     },
//     render: function() {
//         $(".billing-loader").remove(), this.renderDetails(), this.renderHistory(), (!SL.current_user.isEnterprise() || SL.current_user.billing_address) && this.renderAddress(), this.bindLadda()
//     },
//     renderDetails: function() {
//         var t = $('<section class="billing-details"><h2>Billing details</h2></section>').appendTo(".billing-wrapper"),
//             e = this.data.hasActiveSubscription();
//         if (e) {
//             if (t.append('<div class="field status"><span class="label">Status</span><span class="value">Active</span></div>'), this.data.has("active_card") && t.append('<div class="field card"><span class="label">Card</span><span class="value">' + this.DOTTED_CARD_PREFIX + this.data.get("active_card.last4") + "</span></div>"), this.data.hasActiveSubscription() && this.data.hasCoupon()) {
//                 var i = this.data.get("subscription.coupon_code").toUpperCase(),
//                     n = this.data.get("subscription.percent_off");
//                 n > 0 && (i += " / " + n + "% off"), t.append('<div class="field"><span class="label">Coupon</span><span class="value">' + i + "</span></div>")
//             }
//             if (this.data.has("subscription")) {
//                 var s = moment.unix(this.data.getNextInvoiceDate()).format("MMMM Do, YYYY"),
//                     o = "$" + this.data.getNextInvoiceSum();
//                 t.append('<div class="field payment-cycle"><span class="label">Next invoice</span><span class="value">' + o + " on " + s + "</span></div>")
//             }
//             t.append('<footer class="actions"><a class="button outline" href="' + SL.routes.SUBSCRIPTIONS_EDIT_CARD + '">Change credit card</a><button class="button negative outline cancel-subscription ladda-button" data-style="expand-right" data-spinner-color="#222">' + this.strings.CONFIRM_UNSUBSCRIBE_ACTION + "</button></footer>"), this.data.get("can_change_period") && t.find(".actions").prepend('<a class="button outline" href="' + SL.routes.SUBSCRIPTIONS_EDIT_PERIOD + '">Change billing period</a>'), t.find(".actions").prepend('<p class="title">Options</p>')
//         } else {
//             var a = "No active subscription";
//             this.data.get("subscription") && (a = "Pro until " + moment.unix(this.data.get("subscription.current_period_end")).format("MMM Do, YYYY")), t.append('<div class="field status"><span class="label">Status</span><span class="value">' + a + "</span></div>"), t.append('<footer class="actions"><a class="button outline positive" href="' + SL.routes.SUBSCRIPTIONS_NEW + '">Return to Pro</a></footer>')
//         }
//         this.cancelButton = $(".billing-details .cancel-subscription"), this.cancelButton.length && (this.cancelButton.on("click", this.onCancelSubscriptionClicked.bind(this)), this.cancelLoader = Ladda.create(this.cancelButton.get(0)))
//     },
//     renderHistory: function() {
//         var t = $(['<section class="billing-history">', "<h2>Receipts</h2>", '<table class="sl-table"></table>', "</section>"].join("")).appendTo(".billing-wrapper"),
//             e = t.find("table");
//         if (this.data.get("can_toggle_notifications") === !0) {
//             t.append(['<div class="sl-checkbox outline">', '<input type="checkbox" id="receipt-notifications">', '<label for="receipt-notifications">Send receipts via email when I\'m charged</label>', "</div>"].join(""));
//             var i = t.find("#receipt-notifications");
//             i.on("change", this.onEmailNotificationChanged.bind(this)), SL.current_user.notify_on_receipt && i.prop("checked", !0)
//         }
//         e.html(["<tr>", '<th class="amount">Amount</th>', '<th class="date">Date</th>', '<th class="card">Card</th>', '<th class="download">PDF</th>', "</tr>"].join(""));
//         var n = this.data.get("charges");
//         n && n.length ? n.forEach(function(t) {
//             if (t.paid) {
//                 var i = $(['<tr data-charge-id="' + t.id + '">', '<td class="amount">$' + (t.amount / 100).toFixed(2) + "</td>", '<td class="date">' + moment.unix(t.created).format("DD-MM-YYYY") + "</td>", '<td class="card">' + this.DOTTED_CARD_PREFIX + t.card.last4 + "</td>", '<td class="download">', '<form action="' + SL.config.AJAX_SUBSCRIPTIONS_PRINT_RECEIPT(t.id) + '" method="post">', '<button type="submit" class="button outline ladda-button download-button" data-style="slide-right" data-spinner-color="#222">', '<span class="icon i-download"></span>', "</button>", "</form>", "</td>", "</tr>"].join(""));
//                 i.appendTo(e), SL.util.dom.insertCSRF(i.find(".download form"))
//             }
//         }.bind(this)) : e.replaceWith("<p>" + SL.locale.get("BILLING_DETAILS_NOHISTORY") + "</p>")
//     },
//     renderAddress: function() {
//         var t = $(['<section class="billing-address">', "<h2>Billing address</h2>", '<div class="sl-form">', '<div class="unit">', '<p class="unit-description">If you wish to include a billing address on your receipts please enter it below.</p>', '<textarea class="billing-address-input" rows="4" maxlength="300">', SL.current_user.billing_address || "", "</textarea>", "</div>", '<div class="footer">', '<button class="button l positive billing-address-save">Save</button>', "</div>", "</div>", "</section>"].join("")).appendTo(".billing-wrapper");
//         this.addressInputField = t.find(".billing-address-input"), this.addressSaveButton = t.find(".billing-address-save"), this.addressInputField.on("change keyup mouseup", this.checkAddress.bind(this)), this.addressSaveButton.on("click", this.saveAddress.bind(this)), this.checkAddress()
//     },
//     checkAddress: function() {
//         this.addressInputField.val() === (SL.current_user.billing_address || "") ? this.addressSaveButton.hide() : this.addressSaveButton.show()
//     },
//     saveAddress: function() {
//         this.billingAddressXHR && this.billingAddressXHR.abort();
//         var t = this.addressInputField.val() || "";
//         this.billingAddressXHR = $.ajax({
//             url: SL.config.AJAX_UPDATE_USER,
//             type: "PUT",
//             context: this,
//             data: {
//                 user: {
//                     billing_address: t
//                 }
//             }
//         }).done(function() {
//             SL.current_user.billing_address = t, SL.notify("Billing address saved")
//         }).fail(function() {
//             SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
//         }).always(function() {
//             this.billingAddressXHR = null, this.checkAddress()
//         })
//     },
//     onCancelSubscriptionClicked: function(t) {
//         SL.prompt({
//             anchor: $(t.currentTarget),
//             title: this.strings.CONFIRM_UNSUBSCRIBE_DESCRIPTION,
//             type: "select",
//             data: [{
//                 html: "<h3>Cancel</h3>"
//             }, {
//                 html: "<h3>Confirm</h3>",
//                 selected: !0,
//                 className: "negative",
//                 callback: function() {
//                     this.cancelLoader.start(), $.ajax({
//                         url: SL.config.AJAX_SUBSCRIPTIONS,
//                         type: "DELETE",
//                         context: this
//                     }).done(this.onCancelSubscriptionSuccess).fail(this.onCancelSubscriptionError)
//                 }.bind(this)
//             }]
//         })
//     },
//     onCancelSubscriptionSuccess: function() {
//         SL.notify(SL.locale.get("REMOVE_PRO_SUCCESS")), window.location.reload()
//     },
//     onCancelSubscriptionError: function() {
//         SL.notify(SL.locale.get("GENERIC_ERROR")), this.cancelLoader.stop()
//     },
//     onEmailNotificationChanged: function(t) {
//         this.emailNotificationXHR && this.emailNotificationXHR.abort();
//         var e = $(t.currentTarget).is(":checked");
//         this.emailNotificationXHR = $.ajax({
//             url: SL.config.AJAX_UPDATE_USER,
//             type: "PUT",
//             context: this,
//             data: {
//                 user: {
//                     notify_on_receipt: e
//                 }
//             }
//         }).done(function() {
//             SL.notify(e === !0 ? "Got it. We'll email receipts to you" : "Receipts will no longer be emailed")
//         }).fail(function() {
//             SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
//         }).always(function() {
//             this.emailNotificationXHR = null
//         })
//     }
// }),
SL("views.teams").New = SL.views.Base.extend({
    init: function() {
        this._super(), this.formElement = $("#payment-form"), this.formSubmitButton = this.formElement.find("button[type=submit]"), this.formSubmitLoader = Ladda.create(this.formSubmitButton.get(0)), this.bind(), this.summarize()
    },
    bind: function() {
        this.summarize = this.summarize.bind(this), this.formElement.on("keydown", this.onFormKeyDown.bind(this)), this.formSubmitButton.on("click", this.onFormSubmitClicked.bind(this)), this.formElement.find("#team-name").on("input", this.onTeamNameChange.bind(this)), this.formElement.find('input[name="billing-period"]').on("change", this.summarize), $("#stripe-card-number").payment("formatCardNumber"), $("#stripe-card-cvc").payment("formatCardCVC"), $("#stripe-month").payment("restrictNumeric"), $("#stripe-year").payment("restrictNumeric"), this.formElement.find(".unit[data-validate], .unit[data-required]").each(function(t, e) {
            $(e).data("unit", new SL.components.FormUnit(e))
        })
    },
    summarize: function() {
        var t = this.formElement.find(".purchase-summary"),
            e = t.find(".message"),
            i = "monthly" === this.formElement.find('input[name="billing-period"]:checked').val(),
            n = parseFloat($("#billing-period-monthly").attr("data-usd-value")),
            s = parseFloat($("#billing-period-yearly").attr("data-usd-value"));
        isNaN(n) && (n = SL.models.Plan.ACCOUNT_COST_PER_CYCLE_TEAM_14), isNaN(s) && (s = SL.models.Plan.ACCOUNT_COST_PER_CYCLE_TEAM_14_YEARLY), n % 1 != 0 && (n = n.toFixed(2)), s % 1 != 0 && (s = s.toFixed(2));
        var o = {
            period: i ? "month" : "year",
            cost: "$" + (i ? n : s)
        };
        e.html(SL.current_user && SL.current_user.isPro() ? ["Your account will be upgraded to the Team plan. The upgraded subscription will renew at the same interval as your current Pro subscription.", "<br><br>Unused time on your existing plan will be applied towards the upgrade."].join("") : ["You are starting a <strong>30 day free trial</strong>. If you cancel anytime in that period you will not be charged at all.", "<br><br>After the trial you will begin paying <strong>" + o.cost + " per " + o.period + "</strong> for each team member."].join(""))
    },
    validate: function() {
        var t = !0;
        return this.formElement.find(".unit[data-validate], .unit[data-required]").each(function(e, i) {
            var n = $(i).data("unit");
            n.validate(!0) === !1 && (t && n.focus(), t = !1)
        }), t
    },
    captureData: function() {
        this.formData = {
            team: {
                name: this.formElement.find("#team-name").val(),
                slug: this.formElement.find("#team-slug").val()
            },
            user: {
                username: this.formElement.find("#user-name").val(),
                email: this.formElement.find("#user-email").val(),
                password: this.formElement.find("#user-password").val()
            },
            subscription: {
                billing_period: this.formElement.find('input[name="billing-period"]:checked').val(),
                coupon: this.formElement.find('input[name="coupon"]').val()
            }
        }
    },
    submitToStripe: function() {
        this.validate() && (this.captureData(), this.formSubmitLoader.start(), SL.current_user && SL.current_user.isPro() && 0 === $("#stripe-card-number").length ? this.submitToApp() : Stripe.createToken(this.formElement, this.onStripeResponse.bind(this)))
    },
    submitToApp: function(t) {
        t && (this.formData.subscription.token = t), $.ajax({
            type: "POST",
            url: SL.config.AJAX_TEAMS_CREATE,
            data: JSON.stringify(this.formData),
            dataType: "json",
            context: this,
            contentType: "application/json"
        }).done(function(t) {
            window.location = t.team && "string" == typeof t.team.root_url ? window.location.protocol + "//" + t.team.root_url : window.location.protocol + "//" + this.formData.team.slug + "." + window.location.host
        }).fail(function(t) {
            var e = JSON.parse(t.responseText);
            e && e.user && e.user.email && e.user.email.length ? SL.notify("Email error: " + e.user.email[0], "negative") : SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), this.formSubmitLoader.stop()
        })
    },
    onStripeResponse: function(t, e) {
        e.error ? (SL.notify(e.error.message, "negative"), this.formSubmitLoader.stop()) : this.submitToApp(e.id)
    },
    onFormKeyDown: function(t) {
        return 13 === t.keyCode ? (this.submitToStripe(), t.preventDefault(), !1) : void 0
    },
    onFormSubmitClicked: function(t) {
        return this.submitToStripe(), t.preventDefault(), !1
    },
    onTeamNameChange: function() {
        var t = this.formElement.find("#team-name"),
            e = this.formElement.find("#team-slug");
        e.val(SL.util.string.slug(t.val()));
        var i = e.data("unit");
        i && i.validate()
    }
}),
SL("views.teams.subscriptions").Reactivate = SL.views.Base.extend({
    init: function() {
        this._super(), this.formElement = $("#payment-form"), this.formSubmitButton = this.formElement.find("button[type=submit]"), this.formSubmitLoader = Ladda.create(this.formSubmitButton.get(0)), this.bind(), this.summarize()
    },
    bind: function() {
        this.summarize = this.summarize.bind(this), this.formElement.on("keydown", this.onFormKeyDown.bind(this)), this.formSubmitButton.on("click", this.onFormSubmitClicked.bind(this)), this.formElement.find('input[name="billing-period"]').on("change", this.summarize), $("#stripe-card-number").payment("formatCardNumber"), $("#stripe-card-cvc").payment("formatCardCVC"), $("#stripe-month").payment("restrictNumeric"), $("#stripe-year").payment("restrictNumeric")
    },
    summarize: function() {
        var t = this.formElement.find(".purchase-summary"),
            e = t.find(".message"),
            i = "monthly" === this.formElement.find('input[name="billing-period"]:checked').val(),
            n = parseFloat($("#billing-period-monthly").attr("data-usd-value")),
            s = parseFloat($("#billing-period-yearly").attr("data-usd-value"));
        isNaN(n) && (n = SL.models.Plan.ACCOUNT_COST_PER_CYCLE_TEAM_14), isNaN(s) && (s = SL.models.Plan.ACCOUNT_COST_PER_CYCLE_TEAM_14_YEARLY), n % 1 != 0 && (n = n.toFixed(2)), s % 1 != 0 && (s = s.toFixed(2));
        var o = {
            period: i ? "month" : "year",
            cost: "$" + (i ? n : s)
        };
        e.html(["You are starting a <strong>" + o.period + "ly subscription</strong> and will be charged <strong>" + o.cost + "</strong> per team member."].join(""))
    },
    submitToStripe: function() {
        this.formSubmitLoader.start(), Stripe.createToken(this.formElement, this.onStripeResponse.bind(this))
    },
    submitToApp: function(t) {
        var e = {
            subscription: {
                token: t,
                billing_period: this.formElement.find('input[name="billing-period"]:checked').val()
            }
        };
        $.ajax({
            type: "POST",
            url: SL.config.AJAX_TEAMS_REACTIVATE,
            data: JSON.stringify(e),
            dataType: "json",
            context: this,
            contentType: "application/json"
        }).done(function(t) {
            window.location = t.team && "string" == typeof t.team.root_url ? window.location.protocol + "//" + t.team.root_url : "/"
        }).fail(function() {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), this.formSubmitLoader.stop()
        })
    },
    onStripeResponse: function(t, e) {
        e.error ? (SL.notify(e.error.message, "negative"), this.formSubmitLoader.stop()) : this.submitToApp(e.id)
    },
    onFormKeyDown: function(t) {
        return 13 === t.keyCode ? (this.submitToStripe(), t.preventDefault(), !1) : void 0
    },
    onFormSubmitClicked: function(t) {
        return this.submitToStripe(), t.preventDefault(), !1
    }
}),
// SL("views.teams.subscriptions").Show = SL.views.subscriptions.Show.extend({
//     init: function() {
//         this._super()
//     },
//     render: function() {
//         this.data.isTrial() ? (this.strings.CONFIRM_UNSUBSCRIBE_ACTION = "Cancel subscription and deactivate my team", this.strings.CONFIRM_UNSUBSCRIBE_DESCRIPTION = "Your trial will be canceled immediately and this team will no longer be accessible.") : (this.strings.CONFIRM_UNSUBSCRIBE_ACTION = "Cancel subscription and deactivate my team", this.strings.CONFIRM_UNSUBSCRIBE_DESCRIPTION = "Your subscription will be terminated and this team will be inaccessible after the end of the current billing cycle."), this._super()
//     },
//     renderDetails: function() {
//         var t = $('<section class="billing-details"><h2>Billing details</h2></section>').appendTo(".billing-wrapper"),
//             e = this.data.hasActiveSubscription(),
//             i = this.data.isTrial();
//         if (e) {
//             if (t.append(i ? '<div class="field status"><span class="label">Status</span><span class="value">Trial</span></div>' : '<div class="field status"><span class="label">Status</span><span class="value">Active</span></div>'), SL.current_team.has("user_count") && t.append('<div class="field active-users"><span class="label" data-tooltip="The current number of users that you have invited to the team." data-tooltip-maxwidth="260">Team members</span><span class="value">' + SL.current_team.get("user_count") + "</span></div>"), this.data.has("subscription.period") && t.append('<div class="field period"><span class="label">Billing period</span><span class="value">' + ("year" === this.data.get("subscription.period") ? "Yearly" : "Monthly") + "</span></div>"), this.data.has("active_card") && t.append('<div class="field card"><span class="label">Card</span><span class="value">' + this.DOTTED_CARD_PREFIX + this.data.get("active_card.last4") + "</span></div>"), this.data.hasActiveSubscription() && this.data.hasCoupon()) {
//                 var n = this.data.get("subscription.coupon_code").toUpperCase(),
//                     s = this.data.get("subscription.percent_off");
//                 s > 0 && (n += " / " + s + "% off"), t.append('<div class="field"><span class="label">Coupon</span><span class="value">' + n + "</span></div>")
//             }
//             if (this.data.has("subscription")) {
//                 var o = moment.unix(this.data.getNextInvoiceDate()).format("MMMM Do, YYYY"),
//                     a = i ? "First invoice" : "Next invoice",
//                     r = "$" + this.data.getNextInvoiceSum();
//                 t.append('<div class="field payment-cycle"><span class="label">' + a + '</span><span class="value">' + r + " on " + o + "</span></div>")
//             }
//             t.append('<footer class="actions"><a class="button outline" href="' + SL.routes.SUBSCRIPTIONS_EDIT_CARD + '">Change credit card</a><button class="button negative outline cancel-subscription ladda-button" data-style="expand-right" data-spinner-color="#222">' + this.strings.CONFIRM_UNSUBSCRIBE_ACTION + "</button></footer>"), this.data.get("can_change_period") && t.find(".actions").prepend('<a class="button outline" href="' + SL.routes.SUBSCRIPTIONS_EDIT_PERIOD + '">Change billing period</a>'), t.find(".actions").prepend('<p class="title">Options</p>')
//         } else {
//             var l = moment.unix(this.data.get("subscription.current_period_end")).format("MMM Do, YYYY");
//             t.append('<div class="field status"><span class="label">Status</span><span class="value">Canceled, available until ' + l + "</span></div>")
//         }
//         this.cancelButton = $(".billing-details .cancel-subscription"), this.cancelButton.length && (this.cancelButton.on("click", this.onCancelSubscriptionClicked.bind(this)), this.cancelLoader = Ladda.create(this.cancelButton.get(0)))
//     },
//     onCancelSubscriptionSuccess: function() {
//         SL.notify("Subscription canceled"), window.location = "http://slides.com"
//     }
// }),
SL("views.teams.teams").Edit = SL.views.Base.extend({
    init: function() {
        this._super(), this.render()
    },
    render: function() {
        if (this.formElement = $("form"), this.formElement.length) {
            this.formElement.find(".unit[data-factory]").each(function(t, e) {
                var i = null;
                $(e).attr("data-factory").split(".").forEach(function(t) {
                    i = i ? i[t] : window[t]
                }), "function" == typeof i && new i(e)
            }), this.formElement.find(".unit[data-validate]:not([data-factory])").each(function(t, e) {
                new SL.components.FormUnit(e)
            });
            var t = this.formElement.find("button[type=submit]");
            if (t.length) {
                var e = Ladda.create(t.get(0));
                this.formElement.on("submit", function(t) {
                    t.isDefaultPrevented() || e.start()
                }.bind(this))
            }
        }
    }
}),
SL("views.teams.teams").EditMembers = SL.views.Base.extend({
    init: function() {
        this._super(), this.strings = {
            loadMoreMembers: "Load more",
            loadingMoreMembers: "Loading..."
        }, this.render(), this.bind(), this.load().then(this.afterLoad.bind(this), function() {
            this.preloaderElement.remove(), this.contentElement.html("<strong>Sorry but we ran into an issue. Try reloading the page.</strong>").show()
        }.bind(this))
    },
    render: function() {
        this.preloaderElement = $(".users-preloader"), this.contentElement = $(".users-content"), this.activeMembersTable = this.contentElement.find(".users-group-active-members tbody"), this.inactiveMembersTable = this.contentElement.find(".users-group-inactive-members tbody"), this.invitesTable = this.contentElement.find(".users-group-invites tbody"), this.inviteForm = this.contentElement.find(".invite-form"), this.bindLadda(this.inviteForm), this.submitButton = this.inviteForm.find("[type=submit]"), this.emailInput = this.inviteForm.find("[name=email]"), this.roleInput = this.inviteForm.find("[name=role]"), this.loadMoreMembers = $('<div class="load-more">'), this.loadMoreMembers.appendTo(this.contentElement.find(".users-group-active-members")), this.loadMoreMembersLabel = $('<span class="load-more-label"></span>'), this.loadMoreMembersLabel.appendTo(this.loadMoreMembers), this.loadMoreMembersButton = $('<button class="load-more-button">' + this.strings.loadMoreMembers + "</button>"), this.loadMoreMembersButton.on("vclick", this.onLoadMoreMembersClicked.bind(this)), this.loadMoreMembersButton.appendTo(this.loadMoreMembers)
    },
    bind: function() {
        this.inviteForm.on("submit", this.onInviteSubmit.bind(this)), this.emailInput.on("input", this.onEmailInput.bind(this))
    },
    bindLadda: function(t) {
        t.find(".ladda-button").each(function(t, e) {
            e = $(e), e.data("ladda") || e.data("ladda", Ladda.create(e.get(0)))
        })
    },
    load: function() {
        return this.membersCollection = new SL.collections.TeamMembers, this.invitesCollection = new SL.collections.TeamInvites, Promise.all([this.membersCollection.load(), this.invitesCollection.load()])
    },
    afterLoad: function() {
        this.preloaderElement.remove(), this.contentElement.show(), this.membersCollection.forEach(this.renderMember.bind(this)), this.invitesCollection.forEach(this.renderInvitee.bind(this)), this.refreshLoadMore(), this.refreshTableVisibility()
    },
    refreshLoadMore: function() {
        this.loadMoreMembers.toggleClass("visible", !this.membersCollection.isLoading() && this.membersCollection.isLoaded() && this.membersCollection.hasNextPage()), this.loadMoreMembersLabel.text("Showing " + this.membersCollection.getLoadedResults() + "/" + this.membersCollection.getTotalResults() + " members")
    },
    refreshTableVisibility: function() {
        this.activeMembersTable.parents(".users-group").toggleClass("visible", this.activeMembersTable.find("tr").length > 1), this.inactiveMembersTable.parents(".users-group").toggleClass("visible", this.inactiveMembersTable.find("tr").length > 1), this.invitesTable.parents(".users-group").toggleClass("visible", this.invitesTable.find("tr").length > 1)
    },
    renderMember: function(t) {
        t.hasMembership() && t.membership.get("activated") ? this.renderActiveMember(t) : this.renderInactiveMember(t)
    },
    renderActiveMember: function(t) {
        var e = $("<tr>").attr("data-id", t.get("id")),
            i = '<div class="avatar" style="background-image: url(' + t.get("thumbnail_url") + ')" data-tooltip="View profile"></div>';
        e.append('<td><a href="/' + t.get("username") + '" target="_blank">' + i + "</a>" + t.get("email") + "</td>"), e.append('<td class="role"></td>'), e.append('<td class="actions"></td>');
        var n = this.renderRoleSelector(t, !0);
        n.appendTo(e.find(".role")), n.on("change", this.onRoleChanged.bind(this, t, e));
        var s = SL.current_user.get("id") === t.get("id"),
            o = t.hasMembership() && t.membership.isOwner();
        s || o || (e.find(".actions").append('<button class="button outline ladda-button deactivate" data-style="zoom-out" data-spinner-color="#222" data-tooltip="Deactivate"><span class="i-x"></span></button>'), e.find(".deactivate").on("click", this.onDeactivateUserClicked.bind(this, t, e))), e.appendTo(this.activeMembersTable)
    },
    renderInactiveMember: function(t) {
        var e = $("<tr>").attr("data-id", t.get("id"));
        e.append("<td>" + t.get("email") + "</td>"), e.append('<td class="role"></td>'), e.append('<td class="actions"></td>'), e.find(".role").append(this.renderRoleSelector(t, !1)), e.find(".actions").html(['<button class="button outline ladda-button delete" data-style="zoom-out" data-spinner-color="#222" data-tooltip="Delete permanently"><span class="i-trash-stroke"></span></button>', '<button class="button outline ladda-button reactivate" data-style="zoom-out" data-spinner-color="#222" data-tooltip="Reactivate account"><span class="i-plus"></span></button>'].join("")), e.find(".reactivate").on("click", this.onReactivateUserClicked.bind(this, t, e)), e.find(".delete").on("click", this.onDeleteUserClicked.bind(this, t, e)), e.appendTo(this.inactiveMembersTable)
    },
    renderInvitee: function(t) {
        var e = $("<tr>").attr("data-id", t.get("id"));
        e.append("<td>" + t.get("email") + "</td>"), e.append('<td class="role"></td>'), e.append('<td class="actions"></td>'), e.find(".role").append(this.renderRoleSelector(t, !1)), e.find(".actions").html(['<button class="button outline ladda-button resend-invite" data-style="zoom-out" data-spinner-color="#222" data-tooltip="Resend invite"><span class="i-mail"></span></button>', '<button class="button outline ladda-button delete-invite" data-style="zoom-out" data-spinner-color="#222" data-tooltip="Cancel invite"><span class="i-x"></span></button>'].join("")), e.find(".resend-invite").on("click", this.resendInvite.bind(this, t, e)), e.find(".delete-invite").on("click", this.deleteInvite.bind(this, t, e)), e.appendTo(this.invitesTable)
    },
    renderRoleSelector: function(t, e) {
        var i = $('<select class="sl-select s role-selector"></select>'),
            n = SL.models.UserMembership.ROLE_MEMBER;
        return n = t.hasMembership && t.hasMembership() ? t.membership.get("role") : t.get("team_role"), n === SL.models.UserMembership.ROLE_OWNER ? i.append(['<option value="' + SL.models.UserMembership.ROLE_OWNER + '" selected>Owner</option>'].join("")) : (i.append(['<option value="' + SL.models.UserMembership.ROLE_MEMBER + '">Member</option>', '<option value="' + SL.models.UserMembership.ROLE_ADMIN + '">Admin</option>'].join("")), i.find('[value="' + n + '"]').prop("selected", !0)), e && SL.current_user.get("id") !== t.get("id") && n !== SL.models.UserMembership.ROLE_OWNER || i.attr("disabled", !0), i
    },
    onRoleChanged: function(t, e, i) {
        $.ajax({
            type: "PUT",
            url: SL.config.AJAX_TEAM_MEMBER_UPDATE(t.get("id")),
            data: {
                user: {
                    role: i.target.value
                }
            },
            context: this
        }).done(function() {
            SL.notify("Role saved")
        }).fail(function() {
            SL.notify("Failed to change role", "negative")
        })
    },
    deactivateUser: function(t, e) {
        this.bindLadda(e);
        var i = e.find("button.deactivate").data("ladda");
        i && i.start(), $.ajax({
            type: "DELETE",
            url: SL.config.AJAX_TEAM_MEMBER_DEACTIVATE(t.get("id")),
            context: this
        }).done(function() {
            SL.notify("User deactivated"), e.remove(), t.membership.set("activated", !1), this.renderInactiveMember(t), this.refreshTableVisibility()
        }).fail(function() {
            SL.notify("Failed to deactivate member", "negative")
        }).always(function() {
            i && i.stop()
        })
    },
    onDeactivateUserClicked: function(t, e, i) {
        SL.prompt({
            type: "select",
            anchor: i.currentTarget,
            title: "Are you sure you want to deactivate this account?",
            subtitle: "This person will no longer be able to sign in to Slides. You are not charged for deactivated accounts and can reactivate any time.",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Deactivate</h3>",
                selected: !0,
                className: "negative",
                callback: this.deactivateUser.bind(this, t, e)
            }]
        })
    },
    reactivateUser: function(t, e) {
        this.bindLadda(e);
        var i = e.find("button.reactivate").data("ladda");
        i && i.start(), $.ajax({
            type: "POST",
            url: SL.config.AJAX_TEAM_MEMBER_REACTIVATE(t.get("id")),
            context: this
        }).done(function() {
            SL.notify("User activated"), e.remove(), t.membership.set("activated", !0), this.renderActiveMember(t), this.refreshTableVisibility()
        }).fail(function() {
            SL.notify("Failed to activate member", "negative")
        }).always(function() {
            i && i.stop()
        })
    },
    onReactivateUserClicked: function(t, e) {
        this.reactivateUser(t, e)
    },
    deleteUser: function(t, e, i) {
        this.bindLadda(e);
        var n = e.find("button.delete").data("ladda");
        n && n.start(), $.ajax({
            type: "DELETE",
            url: SL.config.AJAX_TEAM_MEMBER_DELETE(t.get("id")),
            data: {
                absorb_decks: i
            },
            context: this
        }).done(function() {
            SL.notify("User deleted"), e.remove(), this.refreshTableVisibility()
        }).fail(function() {
            SL.notify("Failed to delete member", "negative")
        }).always(function() {
            n && n.stop()
        })
    },
    onDeleteUserClicked: function(t, e, i) {
        SL.prompt({
            type: "select",
            anchor: i.currentTarget,
            title: "Do you want to permanently delete this account?",
            subtitle: "All settings and slide decks associated with the account will be removed. This can not be undone.",
            data: [{
                html: "<h3>Cancel</h3>"
            }, {
                html: "<h3>Delete</h3>",
                selected: !0,
                className: "negative",
                callback: this.deleteUser.bind(this, t, e)
            }, {
                html: "<h3>Delete but keep decks</h3>",
                selected: !0,
                className: "negative",
                callback: this.deleteUser.bind(this, t, e, !0)
            }]
        })
    },
    sendInvite: function() {
        var t = this.emailInput.val().trim(),
            e = this.roleInput.val();
        if (t && t.length > 1) {
            var i = this.inviteForm.find(".ladda-button").data("ladda");
            i && i.start(), $.ajax({
                type: "POST",
                url: SL.config.AJAX_TEAM_INVITATIONS_CREATE,
                data: {
                    invitation: {
                        email: t,
                        team_role: e
                    }
                },
                context: this
            }).done(function(t) {
                this.renderInvitee(this.invitesCollection.createModel(t)), this.refreshTableVisibility(), this.emailInput.val(""), SL.notify("Invite sent!")
            }).fail(function() {
                SL.notify("Failed to send invite", "negative")
            }).always(function() {
                i && i.stop()
            })
        }
    },
    resendInvite: function(t, e) {
        this.bindLadda(e);
        var i = e.find("button.resend-invite").data("ladda");
        i && i.start(), $.ajax({
            type: "POST",
            url: SL.config.AJAX_TEAM_INVITATIONS_RESEND(t.get("id")),
            context: this
        }).done(function() {
            SL.notify("Invite sent!")
        }).fail(function() {
            SL.notify("Failed to send invite", "negative")
        }).always(function() {
            i && i.stop()
        })
    },
    deleteInvite: function(t, e) {
        this.bindLadda(e);
        var i = e.find("button.delete-invite").data("ladda");
        i && i.start(), $.ajax({
            type: "DELETE",
            url: SL.config.AJAX_TEAM_INVITATIONS_DELETE(t.get("id")),
            context: this
        }).done(function() {
            SL.notify("Invite deleted"), e.remove(), this.refreshTableVisibility()
        }).fail(function() {
            SL.notify("Failed to delete invite", "negative")
        }).always(function() {
            i && i.stop()
        })
    },
    onInviteSubmit: function(t) {
        t.preventDefault(), this.sendInvite()
    },
    onEmailInput: function() {
        this.submitButton.prop("disabled", 0 == this.emailInput.val().trim().length)
    },
    onLoadMoreMembersClicked: function() {
        this.loadMoreMembersButton.prop("disabled", !0).text(this.strings.loadingMoreMembers), this.membersCollection.loadNextPage().then(function(t) {
            t.forEach(this.renderMember.bind(this))
        }.bind(this)).catch(function() {
            SL.notify("Failed to load members", "negative")
        }.bind(this)).then(function() {
            this.loadMoreMembersButton.prop("disabled", !1).text(this.strings.loadMoreMembers), this.refreshLoadMore()
        }.bind(this))
    }
}),
SL("views.teams.teams").Show = SL.views.Base.extend({
    init: function() {
        this._super(), new SL.components.Search({
            url: SL.config.AJAX_SEARCH_ORGANIZATION
        })
    }
});

// SL("views.themes").Edit = SL.views.Base.extend({
//     init: function() {
//         this._super(), this.themeData = new SL.collections.Collection, this.listElement = $(".theme-list"), this.editorElement = $(".theme-editor"), this.editorInnerElement = $(".theme-editor-inner"), this.VERSION = parseInt($(".theme-editor").attr("data-editor-version"), 10), this.load(), this.bindLadda(), this.setupPreview(), $("body").on("click", ".global-css-button", this.onGlobalCSSClicked.bind(this)), $("body").on("click", ".create-theme-button", this.onCreateThemeClicked.bind(this)), $(window).on("beforeunload", this.onWindowBeforeUnload.bind(this)), hljs.initHighlightingOnLoad()
//     },
//     bindLadda: function() {
//         $(".page-wrapper .ladda-button").each(function(t, e) {
//             e = $(e), e.data("ladda") || e.data("ladda", Ladda.create(e.get(0)))
//         })
//     },
//     setupPreview: function() {
//         this.previewFrame = $(".preview .preview-frame"), this.previewReloader = $(".preview .preview-reloader"), this.previewReloader.on("click", this.reloadPreview.bind(this)), window.addEventListener("message", function(t) {
//             t.data && "theme-preview-ready" === t.data.type && this.refreshPreview()
//         }.bind(this))
//     },
//     load: function() {
//         SL.helpers.PageLoader.show({
//             message: "Loading themes"
//         }), $.ajax({
//             type: "GET",
//             url: SL.config.AJAX_THEMES_LIST,
//             context: this
//         }).done(function(t) {
//             this.themeData.clear(), t.results.forEach(function(t) {
//                 this.themeData.push(new SL.models.Theme(t))
//             }.bind(this))
//         }).fail(function() {
//             SL.notify(SL.locale.get("THEME_LIST_LOAD_ERROR"), "negative")
//         }).always(function() {
//             this.renderList(), SL.helpers.PageLoader.hide()
//         })
//     },
//     renderList: function() {
//         this.listElement.empty(), this.themeData.isEmpty() ? this.listElement.html('<p class="theme-list-empty">' + SL.locale.get("THEME_LIST_EMPTY") + "</p>") : (this.themeData.forEach(this.renderListItem.bind(this)), SL.view.parseTimes()), this.updateListDefault()
//     },
//     renderListItem: function(t, e) {
//         e = $.extend({
//             prepend: !1,
//             showDelay: 0
//         }, e);
//         var i = this.listElement.find('[data-theme-id="' + t.get("id") + '"]');
//         if (i.length ? i.find(".theme-list-item-title").text(t.get("name")).attr("title", t.get("name")) : (i = $(['<div class="theme-list-item" data-theme-id="' + t.get("id") + '">', '<div class="theme-list-item-thumbnail"></div>', '<h2 class="theme-list-item-title" title="' + t.get("name") + '">' + t.get("name") + "</h2>", '<div class="theme-list-item-metadata">', '<div class="theme-list-item-metadata-field">Created <time class="date" datetime="' + t.get("created_at") + '"></time></div>', '<div class="theme-list-item-metadata-field">Updated <time class="ago" datetime="' + t.get("updated_at") + '"></time></div>', "</div>", '<div class="theme-list-item-controls">', '<button class="button outline l delete" data-tooltip="' + SL.locale.get("THEME_DELETE_TOOLTIP") + '">', '<span class="icon i-trash-stroke"></span>', "</button>", '<button class="button outline l edit" data-tooltip="' + SL.locale.get("THEME_EDIT_TOOLTIP") + '">', '<span class="icon i-pen-alt2"></span>', "</button>", '<button class="button outline l default" data-tooltip="' + SL.locale.get("THEME_MAKE_DEFAULT_TOOLTIP") + '">', '<span class="icon i-checkmark"></span>', "</button>", "</div>", "</div>"].join("")), e.prepend === !0 ? i.prependTo(this.listElement) : i.appendTo(this.listElement), e.showDelay > 0 && (i.hide(), setTimeout(function() {
//                 i.show()
//             }, e.showDelay))), t.hasThumbnail()) {
//             var n = t.get("thumbnail_url");
//             i.find(".theme-list-item-thumbnail").css("background-image", 'url("' + n + '")').attr("data-thumb-url", n)
//         }
//         return i.off("click").on("click", function(e) {
//             $(e.target).closest(".theme-list-item-controls .delete").length ? this.removeTheme(t, null, $(e.target).closest(".theme-list-item-controls .delete")) : $(e.target).closest(".theme-list-item-controls .default").length ? i.hasClass("default") ? this.unmakeDefaultTheme() : this.makeDefaultTheme(t) : this.editTheme(t)
//         }.bind(this)), i
//     },
//     refreshListItemThumb: function(t) {
//         if (t && t.length) {
//             var e = t.find(".theme-list-item-thumbnail"),
//                 i = e.attr("data-thumb-url");
//             i && (i = i + "?" + Math.round(1e4 * Math.random()), e.css("background-image", 'url("' + i + '")'))
//         }
//     },
//     updateListDefault: function() {
//         this.listElement.find(".theme-list-item").each(function(t, e) {
//             e = $(e), e.toggleClass("default", e.attr("data-theme-id") == SL.current_team.get("default_theme_id")), e.find(".theme-list-item-controls .default").attr("data-tooltip", SL.locale.get(e.hasClass("default") ? "THEME_IS_DEFAULT_TOOLTIP" : "THEME_MAKE_DEFAULT_TOOLTIP"))
//         })
//     },
//     editTheme: function(t) {
//         if (SL.fonts.loadAll(), this.panel) return this.panel.close(this.editTheme.bind(this, t)), !1;
//         $("html").addClass("is-editing-theme");
//         var e = {};
//         e = 1 === this.VERSION ? {
//             colors: SL.config.V1.THEME_COLORS,
//             fonts: SL.config.V1.THEME_FONTS,
//             center: !0,
//             rollingLinks: !0
//         } : {
//             colors: SL.config.THEME_COLORS,
//             fonts: SL.config.THEME_FONTS,
//             center: !1,
//             rollingLinks: !1
//         }, this.panel = new SL.views.themes.edit.Panel(this, t, e), this.panel.destroyed.add(function() {
//             $("html").removeClass("is-editing-theme"), this.panel = null
//         }.bind(this)), this.bindLadda()
//     },
//     createTheme: function() {
//         $.ajax({
//             type: "POST",
//             url: SL.config.AJAX_THEMES_CREATE,
//             data: {
//                 theme: {
//                     font: SL.config.DEFAULT_THEME_FONT,
//                     color: SL.config.DEFAULT_THEME_COLOR,
//                     transition: SL.config.DEFAULT_THEME_TRANSITION,
//                     background_transition: SL.config.DEFAULT_THEME_BACKGROUND_TRANSITION
//                 }
//             },
//             context: this
//         }).done(function(t) {
//             var e = new SL.models.Theme(t);
//             this.themeData.isEmpty() ? (this.themeData.push(e), this.renderList(), this.makeDefaultTheme(e, null, !0)) : (this.themeData.push(e), this.renderListItem(e, {
//                 prepend: !0,
//                 showDelay: 3e3
//             }),
//                 SL.view.parseTimes()), this.editTheme(e)
//         }).fail(function() {
//             SL.notify(SL.locale.get("THEME_CREATE_ERROR"), "negative")
//         })
//     },
//     saveTheme: function(t, e, i) {
//         $.ajax({
//             type: "PUT",
//             url: SL.config.AJAX_THEMES_UPDATE(t.get("id")),
//             data: {
//                 theme: t.toJSON()
//             },
//             context: this
//         }).done(function(t) {
//             var i = this.renderListItem(new SL.models.Theme(t));
//             SL.view.parseTimes(), t && t.sanitize_messages && t.sanitize_messages.length ? SL.notify(t.sanitize_messages[0], "negative") : SL.notify(SL.locale.get("THEME_SAVE_SUCCESS")), SL.util.callback(e), setTimeout(function() {
//                 this.refreshListItemThumb(i)
//             }.bind(this), 2500), setTimeout(function() {
//                 this.refreshListItemThumb(i)
//             }.bind(this), 5e3)
//         }).fail(function() {
//             SL.notify(SL.locale.get("THEME_SAVE_ERROR"), "negative"), SL.util.callback(i)
//         })
//     },
//     removeTheme: function(t, e, i) {
//         var n = this.getListItem(t);
//         SL.prompt({
//             anchor: i,
//             title: SL.locale.get("THEME_REMOVE_CONFIRM"),
//             type: "select",
//             offsetX: 15,
//             data: [{
//                 html: "<h3>Cancel</h3>"
//             }, {
//                 html: "<h3>Delete</h3>",
//                 selected: !0,
//                 className: "negative",
//                 callback: function() {
//                     var i = t.get("id");
//                     $.ajax({
//                         type: "DELETE",
//                         url: SL.config.AJAX_THEMES_DELETE(i),
//                         context: this
//                     }).done(function() {
//                         SL.util.anim.collapseListItem(n, function() {
//                             n.remove()
//                         }),
//                             SL.util.callback(e), this.themeData.removeByProperties({
//                             id: i
//                         }), this.panel && this.panel.getTheme().get("id") === i && this.panel.destroy(), SL.notify(SL.locale.get("THEME_REMOVE_SUCCESS"))
//                     }).fail(function() {
//                         SL.notify(SL.locale.get("THEME_REMOVE_ERROR"), "negative")
//                     })
//                 }.bind(this)
//             }]
//         })
//     },
//     makeDefaultTheme: function(t, e, i) {
//         $.ajax({
//             type: "PUT",
//             url: SL.config.AJAX_UPDATE_TEAM,
//             data: {
//                 team: {
//                     default_theme_id: t.get("id")
//                 }
//             },
//             context: this
//         }).done(function() {
//             SL.current_team.set("default_theme_id", t.get("id")), this.updateListDefault(), i || SL.notify(SL.locale.get("THEME_DEFAULT_SAVE_SUCCESS")), SL.util.callback(e)
//         }).fail(function() {
//             i || SL.notify(SL.locale.get("THEME_DEFAULT_SAVE_ERROR"), "negative")
//         })
//     },
//     unmakeDefaultTheme: function(t, e) {
//         $.ajax({
//             type: "PUT",
//             url: SL.config.AJAX_UPDATE_TEAM,
//             data: {
//                 team: {
//                     default_theme_id: null
//                 }
//             },
//             context: this
//         }).done(function() {
//             SL.current_team.set("default_theme_id", null), this.updateListDefault(), e || SL.notify(SL.locale.get("THEME_DEFAULT_SAVE_SUCCESS")), SL.util.callback(t)
//         }).fail(function() {
//             e || SL.notify(SL.locale.get("THEME_DEFAULT_SAVE_ERROR"), "negative")
//         })
//     },
//     getListItem: function(t) {
//         return this.listElement.find('[data-theme-id="' + (t ? t.get("id") : null) + '"]')
//     },
//     refreshPreview: function(t, e) {
//         t = t || this.previewTheme, t || (t = new SL.models.Theme), "undefined" == typeof e && (e = SL.current_team.get("global_css_output"));
//         var i = this.getPreviewWindow();
//         i && t && (i.SL && i.SL.helpers && i.SL.helpers.ThemeController.paint(t, {
//             center: 1 === this.VERSION,
//             globalCSS: e
//         }), this.previewTheme = t)
//     },
//     reloadPreview: function() {
//         var t = this.getPreviewWindow();
//         t && t.location.reload()
//     },
//     getPreviewWindow: function() {
//         return this.previewFrame.length ? this.previewFrame.get(0).contentWindow : null
//     },
//     onWindowBeforeUnload: function() {
//         return this.panel && this.panel.hasUnsavedChanges() ? SL.locale.get("LEAVE_UNSAVED_THEME") : void 0
//     },
//     onCreateThemeClicked: function(t) {
//         t.preventDefault(), this.createTheme()
//     },
//     onGlobalCSSClicked: function() {
//         return this.panel ? (this.panel.close(this.editTheme.bind(this, theme)), !1) : ($("html").addClass("is-editing-theme"), this.panel = new SL.views.themes.edit.GlobalCSSPanel(this, SL.current_team), this.panel.destroyed.add(function() {
//             $("html").removeClass("is-editing-theme"), this.panel = null
//         }.bind(this)), void this.bindLadda())
//     }
// }),
// SL("views.themes.edit").Panel = Class.extend({
//     DEFAULT_PAGE: "settings",
//     PAGES: [{
//         name: "Settings",
//         id: "settings",
//         factory: "renderSettings"
//     }, {
//         name: "CSS",
//         id: "css",
//         factory: "renderCSS"
//     }, {
//         name: "HTML",
//         id: "html",
//         factory: "renderHTML"
//     }, {
//         name: "JS",
//         id: "js",
//         factory: "renderJS",
//         condition: function() {
//             return SL.current_team.get("allow_scripts")
//         }
//     }, {
//         name: "Palette",
//         id: "palette",
//         factory: "renderPalette",
//         condition: function() {
//             return this.editor.VERSION > 1
//         }
//     }, {
//         name: "Snippets",
//         id: "snippets",
//         factory: "renderSnippets"
//     }],
//     init: function(t, e, i) {
//         this.editor = t, this.theme = e, this.themeOptionsConfig = i, this.previewTimeout = -1, this.destroyed = new signals.Signal, this.updatePreview = this.updatePreview.bind(this), this.paintPreview = this.paintPreview.bind(this), this.render(), this.load()
//     },
//     load: function() {
//         this.theme.load().done(function() {
//             this.theme = this.theme.clone(), this.afterLoad(), this.savedJSON = JSON.stringify(this.theme.toJSON()), this.checkUnsavedChanges()
//         }.bind(this)).fail(function() {
//             this.close(), SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
//         }.bind(this))
//     },
//     afterLoad: function() {
//         this.preloaderElement.addClass("hidden"), setTimeout(function() {
//             this.preloaderElement.remove(), this.preloaderElement = null
//         }.bind(this), 500), this.renderHeader(), this.renderPages(), this.bind(), this.showPage(this.DEFAULT_PAGE), this.paintPreview()
//     },
//     render: function() {
//         this.domElement = $('<div class="panel">'), this.domElement.appendTo(this.editor.editorInnerElement), this.pagesElement = $('<div class="pages">'), this.pagesElement.appendTo(this.domElement), this.preloaderElement = $('<div class="preloader"><div class="preloader-inner"><div class="preloader-spinner"></div></div></div>'), this.preloaderElement.appendTo(this.editor.editorInnerElement), SL.util.html.generateSpinners()
//     },
//     renderHeader: function() {
//         this.headerElement = $('<header class="panel-header">').appendTo(this.domElement), this.tabsElement = $('<div class="page-tabs">').appendTo(this.headerElement), this.cancelButton = $('<button class="button l grey cancel-button">Close</button>').appendTo(this.headerElement), this.saveButton = $('<button class="button l positive save-button ladda-button" data-style="zoom-out">Save</button>').appendTo(this.headerElement), this.saveButton.data("ladda", Ladda.create(this.saveButton.get(0))), this.onSaveClicked = this.onSaveClicked.bind(this), this.onCancelClicked = this.onCancelClicked.bind(this), this.saveButton.on("click", this.onSaveClicked), this.cancelButton.on("click", this.onCancelClicked)
//     },
//     renderPages: function() {
//         this.PAGES.forEach(function(t) {
//             ("function" != typeof t.condition || t.condition.call(this)) && ($('<button class="page-tab" data-page-id="' + t.id + '">' + t.name + "</button>").on("click", this.showPage.bind(this, t.id)).appendTo(this.tabsElement), this[t.factory]())
//         }.bind(this))
//     },
//     renderSettings: function() {
//         this.settingsElement = $('<div class="page sl-form" data-page-id="settings">').appendTo(this.pagesElement), this.settingsElement.append('<div class="unit name" data-required><label for="">Name</label><input id="theme-name" placeholder="Theme name" type="text" value="' + (this.theme.get("name") || "Untitled") + '"></div>'), this.settingsElement.find("#theme-name").on("change", this.paintPreview), this.settingsElement.find("#theme-name").on("input", this.onNameInputChanged.bind(this)), this.renderThemeOptions()
//     },
//     renderThemeOptions: function() {
//         var t = $.extend(this.themeOptionsConfig, {
//             model: this.theme,
//             container: this.settingsElement
//         });
//         "no-color" !== t.colors[t.colors.length - 1].id && t.colors.push({
//             id: "no-color",
//             tooltip: "Specifies as few color styles as possible, useful if you want to write custom CSS from the ground up."
//         }), "no-font" !== t.fonts[t.fonts.length - 1].id && t.fonts.push({
//             id: "no-font",
//             title: "None",
//             tooltip: "Specifies as few typographic styles as possible, useful if you want to write custom CSS from the ground up."
//         }), this.themeOptions = new SL.components.ThemeOptions(t), this.themeOptions.changed.add(this.paintPreview)
//     },
//     renderCSS: function(t, e) {
//         t = t || "CSS", e = e || "Specify custom styles using LESS or standard CSS. All selectors are automatically prefixed with .reveal when saved.", this.cssElement = $('<div class="page" data-page-id="css">').appendTo(this.pagesElement), this.cssElement.html(['<div class="page-header page-header-absolute">', "<h4>" + t + "</h4>", "<p>" + e + ' <a class="documentation-link" href="#">More info</a></p>', '<div class="documentation">', $("#css-panel-documentation").html(), "</div>", "</div>", '<div class="editor-wrapper">', '<div id="ace-less" class="editor"></div>', '<div class="error"></div>', '<div class="info positive" data-tooltip="" data-tooltip-maxwidth="300" data-tooltip-align="left"><span class="icon i-info"></span></div>', "</div>"].join("")), this.cssErrorElement = this.cssElement.find(".error"), this.cssElement.find(".info").hide();
//         try {
//             this.cssEditor = ace.edit("ace-less"), this.cssEditor.setTheme("ace/theme/monokai"), this.cssEditor.setDisplayIndentGuides(!0), this.cssEditor.setShowPrintMargin(!1), this.cssEditor.getSession().setMode("ace/mode/less"), this.cssEditor.env.document.setValue(this.getCSSInput() || ""), this.cssEditor.env.editor.on("change", this.onCSSInputChanged.bind(this)), this.syncCSS()
//         } catch (i) {
//             console.log("An error occurred while initializing the Ace CSS editor.")
//         }
//     },
//     syncCSS: function() {
//         var t = SL.util.string.getCustomClassesFromLESS(this.cssEditor.env.document.getValue());
//         if (t.length) {
//             var e = "Found custom slide classes:<br>- " + t.join("<br>- ");
//             this.cssElement.find(".info").attr("data-tooltip", e).show()
//         } else this.cssElement.find(".info").attr("data-tooltip", "").hide()
//     },
//     setCSSInput: function(t) {
//         this.theme.set("less", t)
//     },
//     getCSSInput: function() {
//         return this.theme.get("less")
//     },
//     setCSSOutput: function(t) {
//         this.theme.set("css", t)
//     },
//     getCSSOutput: function() {
//         return this.theme.get("css")
//     },
//     renderHTML: function() {
//         this.htmlElement = $('<div class="page" data-page-id="html">').appendTo(this.pagesElement), this.htmlElement.html(['<div class="page-header page-header-absolute">', "<h4>HTML</h4>", '<p>Markup is inserted outside of individual slides. This is great for things like a company logo which is fixed on top of the presentation. <a class="documentation-link" href="#">More info</a></p>', '<div class="documentation">', $("#html-panel-documentation").html(), "</div>", "</div>", '<div class="editor-wrapper">', '<div id="ace-html" class="editor"></div>', "</div>"].join(""));
//         try {
//             this.htmlEditor = ace.edit("ace-html"), this.htmlEditor.setTheme("ace/theme/monokai"), this.htmlEditor.setDisplayIndentGuides(!0), this.htmlEditor.setShowPrintMargin(!1), this.htmlEditor.getSession().setMode("ace/mode/html"), this.htmlEditor.env.document.setValue(this.theme.get("html") || ""), this.htmlEditor.env.editor.on("change", this.onHTMLInputChanged.bind(this))
//         } catch (t) {
//             console.log("An error occurred while initializing the Ace HTML editor.")
//         }
//     },
//     renderJS: function() {
//         this.jsElement = $('<div class="page" data-page-id="js">').appendTo(this.pagesElement), this.jsElement.html(['<div class="page-header page-header-absolute">', "<h4>JavaScript</h4>", "<p>Scripts will be executed when a deck that uses this theme is loaded. They are injected at the end of the document, after all other scripts.</p>", "</div>", '<div class="editor-wrapper">', '<div id="ace-js" class="editor"></div>', "</div>"].join(""));
//         try {
//             this.jsEditor = ace.edit("ace-js"), this.jsEditor.setTheme("ace/theme/monokai"), this.jsEditor.setDisplayIndentGuides(!0), this.jsEditor.setShowPrintMargin(!1), this.jsEditor.getSession().setMode("ace/mode/javascript"), this.jsEditor.env.document.setValue(this.theme.get("js") || ""), this.jsEditor.env.editor.on("change", this.onJSInputChanged.bind(this))
//         } catch (t) {
//             console.log("An error occurred while initializing the Ace JS editor.")
//         }
//     },
//     renderPalette: function() {
//         this.palette = new SL.views.themes.edit.pages.Palette(this.editor, this.theme), this.palette.appendTo(this.pagesElement), this.palette.changed.add(this.checkUnsavedChanges.bind(this))
//     },
//     renderSnippets: function() {
//         this.snippets = new SL.views.themes.edit.pages.Snippets(this.editor, this.theme), this.snippets.appendTo(this.pagesElement), this.snippets.changed.add(this.checkUnsavedChanges.bind(this))
//     },
//     bind: function() {
//         this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this), $(document).on("keydown", this.onDocumentKeyDown), this.domElement.on("click", ".page-header .documentation-link", function(t) {
//             t.preventDefault();
//             var e = $(t.currentTarget),
//                 i = e.closest(".page-header");
//             i.toggleClass("expanded"), e.text(i.hasClass("expanded") ? "Less info" : "More info")
//         }.bind(this))
//     },
//     showPage: function(t) {
//         this.domElement.find(".page").removeClass("past present future"), this.domElement.find('.page[data-page-id="' + t + '"]').addClass("present"), this.domElement.find('.page[data-page-id="' + t + '"]').prevAll().addClass("past"), this.domElement.find('.page[data-page-id="' + t + '"]').nextAll().addClass("future"), this.domElement.find(".panel-header .page-tab").removeClass("selected"), this.domElement.find('.panel-header .page-tab[data-page-id="' + t + '"]').addClass("selected"), "css" === t && this.cssEditor ? this.cssEditor.focus() : "html" === t && this.htmlEditor ? this.htmlEditor.focus() : "js" === t && this.jsEditor ? this.jsEditor.focus() : "palette" === t && this.palette && this.palette.refresh(), setTimeout(function() {
//             this.domElement.find(".page").addClass("transition")
//         }.bind(this), 1), this.resetScrollPosition()
//     },
//     resetScrollPosition: function() {
//         this.domElement.scrollLeft(0).scrollTop(0), this.settingsElement && this.settingsElement.scrollLeft(0).scrollTop(0)
//     },
//     updatePreview: function(t) {
//         "number" != typeof t && (t = 250), clearTimeout(this.previewTimeout), this.previewTimeout = setTimeout(function() {
//             this.paintPreview()
//         }.bind(this), t)
//     },
//     paintPreview: function() {
//         this.preprocess(function() {
//             this.editor.refreshPreview(this.theme)
//         }.bind(this), function() {
//             this.editor.refreshPreview(this.theme)
//         }.bind(this))
//     },
//     preprocess: function(t, e) {
//         this.theme.set("name", this.domElement.find("#theme-name").val()), this.cssEditor && this.setCSSOutput(this.cssEditor.env.document.getValue()), this.htmlEditor && this.theme.set("html", this.htmlEditor.env.document.getValue()), this.jsEditor && this.theme.set("js", this.jsEditor.env.document.getValue()), this.preprocessCSS(t, e), this.checkUnsavedChanges()
//     },
//     preprocessCSS: function(t, e) {
//         this.cssParser || (this.cssParser = new less.Parser);
//         var i = this.cssEditor.env.document.getValue();
//         i ? this.cssParser.parse(".reveal { " + i + " }", function(n, s) {
//             if (n) this.cssErrorElement.addClass("visible"), this.cssErrorElement.html(n.message), SL.util.callback(e, n);
//             else {
//                 this.cssErrorElement.removeClass("visible");
//                 try {
//                     var o = s.toCSS()
//                 } catch (a) {
//                     console.log(a)
//                 }
//                 if (o) {
//                     var r = "";
//                     o = o.replace(/@import url\(["'\s]*(http:|https:)?\/\/(.*)\);?/gi, function(t) {
//                         return r += t + "\n", ""
//                     }), o = r + o, this.setCSSInput(i), this.setCSSOutput(o), SL.util.callback(t)
//                 } else SL.util.callback(e)
//             }
//             this.checkUnsavedChanges()
//         }.bind(this)) : (this.setCSSInput(""), this.setCSSOutput(""), SL.util.callback(t))
//     },
//     hasUnsavedChanges: function() {
//         return this.theme && this.savedJSON !== JSON.stringify(this.theme.toJSON())
//     },
//     checkUnsavedChanges: function() {
//         this.domElement.toggleClass("has-unsaved-changes", this.hasUnsavedChanges())
//     },
//     save: function(t) {
//         var e = this.saveButton.data("ladda");
//         e && e.start(), this.preprocess(function() {
//             this.editor.saveTheme(this.theme, function() {
//                 e && e.stop(), this.savedJSON = JSON.stringify(this.theme.toJSON()), this.checkUnsavedChanges(), SL.util.callback(t)
//             }.bind(this), function() {
//                 e && e.stop()
//             }.bind(this))
//         }.bind(this), function() {
//             SL.notify("Please fix all CSS errors before saving", "negative"), e && e.stop()
//         }.bind(this))
//     },
//     close: function(t) {
//         this.hasUnsavedChanges() ? SL.prompt({
//             anchor: this.cancelButton,
//             title: SL.locale.get("WARN_UNSAVED_CHANGES"),
//             alignment: "b",
//             type: "select",
//             data: [{
//                 html: "<h3>Cancel</h3>"
//             }, {
//                 html: "<h3>Discard</h3>",
//                 className: "divider",
//                 callback: function() {
//                     this.destroy(), SL.util.callback(t)
//                 }.bind(this)
//             }, {
//                 html: "<h3>Save</h3>",
//                 className: "positive",
//                 selected: !0,
//                 callback: function() {
//                     SL.util.callback(t), this.save(this.destroy.bind(this))
//                 }.bind(this)
//             }]
//         }) : (this.destroy(), SL.util.callback(t))
//     },
//     getTheme: function() {
//         return this.theme
//     },
//     onCSSInputChanged: function() {
//         this.syncCSS(), this.updatePreview()
//     },
//     onHTMLInputChanged: function() {
//         this.updatePreview()
//     },
//     onJSInputChanged: function() {
//         this.updatePreview(1e3)
//     },
//     onNameInputChanged: function() {
//         this.theme.set("name", this.domElement.find("#theme-name").val()), this.checkUnsavedChanges()
//     },
//     onSaveClicked: function() {
//         this.save()
//     },
//     onCancelClicked: function() {
//         this.close()
//     },
//     onDocumentKeyDown: function(t) {
//         (t.metaKey || t.ctrlKey) && 83 === t.keyCode ? (this.hasUnsavedChanges() && this.save(), t.preventDefault()) : 27 === t.keyCode && this.close()
//     },
//     destroy: function() {
//         this.isDestroyed || (this.isDestroyed = !0, clearTimeout(this.previewTimeout), this.destroyed.dispatch(), this.destroyed.dispose(), $(document).off("keydown", this.onDocumentKeyDown), setTimeout(function() {
//             this.cssEditor && (this.cssEditor.destroy(), this.cssEditor = null), this.htmlEditor && (this.htmlEditor.destroy(), this.htmlEditor = null), this.jsEditor && (this.jsEditor.destroy(), this.jsEditor = null), this.palette && (this.palette.destroy(), this.palette = null), this.snippets && (this.snippets.destroy(), this.snippets = null), this.themeOptions && this.themeOptions.destroy(), this.preloaderElement && this.preloaderElement.remove(), this.domElement && this.domElement.remove()
//         }.bind(this), 500))
//     }
// }),
// SL("views.themes.edit").GlobalCSSPanel = SL.views.themes.edit.Panel.extend({
//     PAGES: [{
//         name: "Global CSS",
//         id: "css",
//         factory: "renderCSS"
//     }],
//     init: function(t, e) {
//         this.team = e, this.team.get("global_css_input") || this.team.set("global_css_input", ""), this.team.get("global_css_output") || this.team.set("global_css_output", ""), this.data = {
//             global_css_input: this.team.get("global_css_input"),
//             global_css_output: this.team.get("global_css_output")
//         }, this._super(t), this.tabsElement.hide()
//     },
//     load: function() {
//         this.afterLoad()
//     },
//     renderCSS: function() {
//         this._super("Global CSS", "Add custom CSS or LESS styles to all decks created by your team. These styles are injected before any theme-specific CSS. ")
//     },
//     syncCSS: function() {},
//     setCSSInput: function(t) {
//         this.data.global_css_input = t
//     },
//     getCSSInput: function() {
//         return this.data.global_css_input
//     },
//     setCSSOutput: function(t) {
//         this.data.global_css_output = t
//     },
//     getCSSOutput: function() {
//         return this.data.global_css_output
//     },
//     paintPreview: function() {
//         this.preprocess(function() {
//             this.editor.refreshPreview(this.theme, this.getCSSOutput())
//         }.bind(this), function() {
//             this.editor.refreshPreview(this.theme, this.getCSSOutput())
//         }.bind(this))
//     },
//     preprocess: function(t, e) {
//         this.setCSSOutput(this.cssEditor.env.document.getValue()), this.preprocessCSS(t, e), this.checkUnsavedChanges()
//     },
//     hasUnsavedChanges: function() {
//         return this.team.get("global_css_input") !== this.data.global_css_input
//     },
//     save: function(t) {
//         var e = this.data.global_css_input,
//             i = this.data.global_css_output,
//             n = this.saveButton.data("ladda");
//         n && n.start(), this.preprocess(function() {
//             $.ajax({
//                 url: SL.config.AJAX_UPDATE_TEAM,
//                 type: "PUT",
//                 data: {
//                     team: {
//                         global_css_input: e,
//                         global_css_output: i
//                     }
//                 },
//                 context: this
//             }).done(function() {
//                 this.team.set("global_css_input", e), this.team.set("global_css_output", i), this.checkUnsavedChanges(), SL.util.callback(t)
//             }).fail(function() {
//                 SL.notify("Failed to save, please try again", "negative")
//             }).always(function() {
//                 n && n.stop()
//             })
//         }.bind(this), function() {
//             SL.notify("Please fix all CSS errors before saving", "negative"), n && n.stop()
//         }.bind(this))
//     }
// }),
// SL("views.themes.edit.pages").Palette = Class.extend({
//     init: function(t, e) {
//         this.editor = t, this.theme = e, this.changed = new signals.Signal, this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this), this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this), this.onSaveButtonClicked = this.onSaveButtonClicked.bind(this), this.onListItemDelete = this.onListItemDelete.bind(this), this.onListItemMouseDown = this.onListItemMouseDown.bind(this), this.render(), this.bind()
//     },
//     render: function() {
//         this.domElement = $('<div class="page" data-page-id="palette">'), this.domElement.html(['<div class="page-header">', "<h4>Color Palette</h4>", '<p>Replace the default color options that we offer throughout the deck editor with your own custom color palette. <a class="documentation-link" href="#">More info</a></p>', '<div class="documentation">', $("#palette-panel-documentation").html(), "</div>", "</div>", '<div class="page-body">', '<div class="palette-picker">', '<div class="palette-picker-api"></div>', "</div>", '<ul class="palette-list"></ul>', "</div>"].join("")), this.innerElement = this.domElement.find(".page-body"), this.pickerElement = this.domElement.find(".palette-picker"), this.pickerAPIElement = this.domElement.find(".palette-picker-api"), this.listElement = this.domElement.find(".palette-list"), this.renderPicker(), this.renderList(), this.checkIfEmpty()
//     },
//     renderPicker: function() {
//         this.pickerAPIElement.spectrum({
//             flat: !0,
//             showInput: !0,
//             showButtons: !1,
//             showInitial: !1,
//             showPalette: !1,
//             showSelectionPalette: !1,
//             preferredFormat: "hex",
//             className: "palette-picker-spectrum",
//             move: function(t) {
//                 this.setPreviewColor(t.toHexString())
//             }.bind(this),
//             change: function(t) {
//                 this.setPreviewColor(t.toHexString())
//             }.bind(this)
//         }), this.domElement.find(".palette-picker-spectrum .sp-input-container").append('<div class="palette-picker-save-button"><span class="icon i-plus"></span>Save color</div>'), this.pickerSaveButton = this.domElement.find(".palette-picker-save-button")
//     },
//     renderList: function() {
//         this.listElement.empty(), this.theme.get("palette").forEach(this.renderListItem.bind(this))
//     },
//     renderListItem: function(t) {
//         var e = $('<li class="palette-list-item sl-form">');
//         return e.data("color", t), e.html(['<div class="palette-list-item-color"></div>', '<div class="palette-list-item-label">' + t + "</div>", '<div class="palette-list-item-delete"><span class="icon i-trash-stroke"></span></div>'].join("")), e.appendTo(this.listElement), e.toggleClass("is-light", tinycolor(t).isLight()), e.find(".palette-list-item-color").css("background-color", t), e.find(".palette-list-item-delete").on("click", this.onListItemDelete), e.on("mousedown", this.onListItemMouseDown), e
//     },
//     bind: function() {
//         this.pickerSaveButton.on("click", this.onSaveButtonClicked.bind(this))
//     },
//     appendTo: function(t) {
//         this.domElement.appendTo(t)
//     },
//     setPreviewColor: function(t) {
//         this.pickerSaveButton.css({
//             color: tinycolor(t).isLight() ? "#222222" : "#ffffff",
//             backgroundColor: t
//         })
//     },
//     checkIfEmpty: function() {
//         0 === this.listElement.find(".palette-list-item").length ? this.listElement.append('<span class="palette-list-empty">No custom colors have been added to the palette. Click "Save color" to add one now.</span>') : this.listElement.find(".palette-list-empty").remove()
//     },
//     refresh: function() {
//         this.pickerAPIElement.spectrum("set", "#000000"), this.pickerAPIElement.spectrum("reflow"), this.setPreviewColor("#000000")
//     },
//     persist: function() {
//         var t = this.listElement.find(".palette-list-item:not(.element)").map(function() {
//             return $(this).data("color")
//         }).toArray();
//         this.theme.set("palette", t), this.checkIfEmpty(), this.changed.dispatch()
//     },
//     destroy: function() {
//         this.changed.dispose(), this.listElement.find(".palette-list-item").off(), this.editor = null, this.theme = null
//     },
//     onSaveButtonClicked: function() {
//         var t = this.renderListItem(this.pickerAPIElement.spectrum("get"));
//         this.listElement.prepend(t), this.persist()
//     },
//     onListItemDelete: function(t) {
//         var e = $(t.target).closest(".palette-list-item");
//         e.length ? (e.remove(), this.persist()) : SL.notify("An error occured while deleting this color")
//     },
//     onListItemMouseDown: function(t) {
//         var e = $(t.currentTarget);
//         e.length && e.is(".palette-list-item") && 0 === $(t.target).closest(".palette-list-item-delete").length && (this.dragTarget = e, this.dragGhost = e.clone().appendTo(this.listElement), this.dragGhost.addClass("drag-ghost"), this.dragTarget.addClass("drag-target"), this.dragOffsetX = t.clientX - this.dragTarget.offset().left, this.dragOffsetY = t.clientY - this.dragTarget.offset().top, this.listOffsetX = this.listElement.offset().left, this.listOffsetY = this.listElement.offset().top, this.listWidth = this.listElement.width(), this.listHeight = this.listElement.height(), this.listItemSize = this.dragTarget.outerHeight(), this.listItemCols = Math.floor(this.listWidth / this.listItemSize), $(document).on("mousemove", this.onDocumentMouseMove), $(document).on("mouseup", this.onDocumentMouseUp), this.onDocumentMouseMove(t))
//     },
//     onDocumentMouseMove: function(t) {
//         t.preventDefault();
//         var e = this.listElement.find(".palette-list-item"),
//             i = t.clientX - this.listOffsetX - this.dragOffsetX,
//             n = t.clientY - this.listOffsetY - this.dragOffsetY;
//         i = Math.max(Math.min(i, this.listWidth - this.listItemSize), 0), n = Math.max(Math.min(n, this.listHeight - this.listItemSize), 0), this.dragGhost.css({
//             left: i,
//             top: n
//         });
//         var s = Math.round(i / this.listItemSize),
//             o = Math.round(n / this.listItemSize);
//         s = Math.max(Math.min(s, this.listItemCols), 0), o = Math.max(Math.min(o, e.length), 0);
//         var a = o * this.listItemCols + s,
//             r = $(e[a]);
//         r.is(this.dragTarget) || (this.dragTarget.index() > a ? r.before(this.dragTarget) : r.after(this.dragTarget))
//     },
//     onDocumentMouseUp: function() {
//         this.dragTarget.removeClass("drag-target"), this.dragGhost.remove(), $(document).off("mousemove", this.onDocumentMouseMove), $(document).off("mouseup", this.onDocumentMouseUp), this.persist()
//     }
// }),
// SL("views.themes.edit.pages").Snippets = Class.extend({
//     init: function(t, e) {
//         this.editor = t, this.theme = e, this.changed = new signals.Signal, this.render(), this.bind(), this.syncMoveButtons()
//     },
//     render: function() {
//         this.domElement = $('<div class="page" data-page-id="snippets">'), this.domElement.html(['<div class="page-header">', "<h4>Snippets</h4>", '<p>Snippets are small HTML templates that your team members can use as building blocks when creating decks. These templates can contain placeholder variables that are filled out at the time of insertion. <a class="documentation-link" href="#">More info</a></p>', '<div class="documentation">', $("#snippet-panel-documentation").html(), "</div>", "</div>", '<div class="page-body">', '<ul class="snippet-list"></ul>', '<ul class="snippet-controls snippet-list-item sl-form">', '<div class="add-button-wrapper">', '<button class="button l add-button">Add Snippet <span class="icon i-plus"></span></button>', "</div>", '<div class="unit text">', "<label>Title</label>", '<input class="title-value" maxlength="200" type="text" readonly>', "</div>", '<div class="unit text">', "<label>Template</label>", '<textarea class="template-value" rows="4" readonly></textarea>', "</div>", "</ul>", "</div>"].join("")), this.innerElement = this.domElement.find(".page-body"), this.listElement = this.domElement.find(".snippet-list"), this.controlsElement = this.domElement.find(".snippet-controls"), this.addButton = this.domElement.find(".snippet-controls .add-button-wrapper"), this.renderList()
//     },
//     renderList: function() {
//         this.listElement.empty(), this.theme.get("snippets").forEach(this.renderListItem.bind(this))
//     },
//     renderListItem: function(t) {
//         var e = $('<li class="snippet-list-item sl-form">');
//         return e.html(['<div class="unit text">', "<label>Title</label>", '<input class="title-value" maxlength="200" value="' + t.get("title") + '" type="text" spellcheck="false">', "</div>", '<div class="unit text">', "<label>Template</label>", '<textarea class="template-value" rows="4" spellcheck="false">' + t.get("template") + "</textarea>", '<div class="status" data-tooltip="" data-tooltip-maxwidth="400" data-tooltip-align="left"><span class="icon i-info"></span></div>', "</div>", '<div class="snippet-list-item-footer">', '<button class="button outline delete-button" data-tooltip="Delete" data-tooltip-delay="1000"><snap class="icon i-trash-stroke"></snap></button>', '<button class="button outline preview-button" data-tooltip="Preview" data-tooltip-delay="1000"><snap class="icon i-eye"></snap></button>', '<button class="button outline move-up-button" data-tooltip="Move Up" data-tooltip-delay="1000"><snap class="icon i-arrow-up"></snap></button>', '<button class="button outline move-down-button" data-tooltip="Move Down" data-tooltip-delay="1000"><snap class="icon i-arrow-down"></snap></button>', "</div>"].join("")), e.appendTo(this.listElement), e.data("model", t), e.find("input, textarea").on("input", this.onSnippetChange.bind(this)), e.find("input, textarea").on("focus", this.onSnippetFocused.bind(this)), e.find(".delete-button").on("click", this.onSnippetDelete.bind(this)), e.find(".preview-button").on("click", this.onSnippetFocused.bind(this)), e.find(".move-up-button").on("click", this.onSnippetMoveUp.bind(this)), e.find(".move-down-button").on("click", this.onSnippetMoveDown.bind(this)), this.validateSnippet(e), e
//     },
//     bind: function() {
//         this.addButton.on("click", this.addSnippet.bind(this))
//     },
//     appendTo: function(t) {
//         this.domElement.appendTo(t), this.listElement.find(".snippet-list-item").each(function(t, e) {
//             this.layoutSnippet($(e))
//         }.bind(this))
//     },
//     addSnippet: function() {
//         this.theme.get("snippets").create().then(function(t) {
//             var e = this.renderListItem(t);
//             e.data("model", t), e.find("input").first().focus(), setTimeout(function() {
//                 var t = this.domElement.prop("scrollHeight");
//                 t -= this.domElement.outerHeight(!0), t -= this.controlsElement.outerHeight(!0), this.domElement.scrollTop(t)
//             }.bind(this), 1), this.changed.dispatch(), this.syncMoveButtons()
//         }.bind(this))
//     },
//     layoutSnippet: function(t) {
//         var e = t.find(".template-value");
//         e.attr("rows", 4);
//         var i = parseFloat(e.css("line-height")),
//             n = e.prop("scrollHeight"),
//             s = e.prop("clientHeight");
//         n > s && e.attr("rows", Math.min(Math.ceil(n / i), 10))
//     },
//     validateSnippet: function(t) {
//         var e = t.data("model"),
//             i = [],
//             n = [],
//             s = e.templateHasVariables(),
//             o = e.templateHasSelection();
//         if (s && o) n.push("Templates can not mix variables and selection tags.");
//         else if (s) {
//             var a = e.getTemplateVariables();
//             i.push("Found " + a.length + " variables:"), a.forEach(function(t) {
//                 i.push(t.defaultValue ? "- " + t.label + " (default: " + t.defaultValue + ")" : "- " + t.label)
//             })
//         }
//         n.length ? t.find(".status").addClass("negative").show().attr("data-tooltip", n.join("<br>")) : i.length ? t.find(".status").removeClass("negative").show().attr("data-tooltip", i.join("<br>")) : t.find(".status").removeClass("negative").hide()
//     },
//     previewSnippet: function(t) {
//         var e = this.editor.getPreviewWindow(),
//             i = e.$("#snippet-slide");
//         0 === i.length && (i = $('<section id="snippet-slide">').appendTo(e.$(".reveal .slides"))), i.html(['<div class="sl-block" data-block-type="html" style="width: 100%; left: 0; top: 0; height: auto;">', '<div class="sl-block-content">', t.templatize(t.getTemplateVariables()), "</div>", "</div>"].join("")), e.SL.util.skipCSSTransitions(), e.Reveal.sync(), e.Reveal.slide(i.index())
//     },
//     syncSnippetOrder: function() {
//         var t = this.listElement.find(".snippet-list-item"),
//             e = this.theme.get("snippets");
//         t.sort(function(t, i) {
//             var n = e.find($(t).data("model")),
//                 s = e.find($(i).data("model"));
//             return n - s
//         }.bind(this)), t.each(function(t, e) {
//             this.listElement.append(e)
//         }.bind(this)), this.syncMoveButtons()
//     },
//     syncMoveButtons: function() {
//         this.listElement.find(".snippet-list-item").each(function(t, e) {
//             e = $(e), e.find(".move-up-button").toggleClass("disabled", e.is(":first-child")), e.find(".move-down-button").toggleClass("disabled", e.is(":last-child"))
//         })
//     },
//     destroy: function() {
//         this.changed.dispose(), this.listElement.find(".snippet-list-item").off().removeData("model");
//         var t = this.editor.getPreviewWindow();
//         t.$("#snippet-slide").remove(), t.Reveal.sync(), t.Reveal.slide(0), this.editor = null, this.theme = null
//     },
//     onSnippetFocused: function(t) {
//         var e = $(t.target).closest(".snippet-list-item");
//         e.length && this.previewSnippet(e.data("model"))
//     },
//     onSnippetChange: function(t) {
//         var e = $(t.target).closest(".snippet-list-item");
//         if (e.length) {
//             var i = e.find(".title-value").val(),
//                 n = e.find(".template-value").val(),
//                 s = SL.util.html.findScriptTags(n);
//             if (s.length > 0) return SL.notify("Scripts are not allowed. Please remove all script tags for this snippet to save.", "negative"), !1;
//             var o = e.data("model");
//             o.set("title", i), o.set("template", n), this.layoutSnippet(e), this.validateSnippet(e), this.previewSnippet(o), this.changed.dispatch()
//         }
//     },
//     onSnippetDelete: function(t) {
//         var e = $(t.target).closest(".snippet-list-item");
//         if (e.length) {
//             var i = e.data("model");
//             i ? SL.prompt({
//                 anchor: $(t.currentTarget),
//                 title: SL.locale.get("THEME_SNIPPET_DELETE_CONFIRM"),
//                 type: "select",
//                 data: [{
//                     html: "<h3>Cancel</h3>"
//                 }, {
//                     html: "<h3>Remove</h3>",
//                     selected: !0,
//                     className: "negative",
//                     callback: function() {
//                         SL.util.anim.collapseListItem(e, function() {
//                             e.remove(), this.syncMoveButtons()
//                         }.bind(this));
//                         var t = this.theme.get("snippets");
//                         t.remove(e.data("model")), this.changed.dispatch()
//                     }.bind(this)
//                 }]
//             }) : SL.notify("An error occured while deleting this snippet")
//         } else SL.notify("An error occured while deleting this snippet")
//     },
//     onSnippetMoveUp: function(t) {
//         var e = $(t.target).closest(".snippet-list-item");
//         if (e.length) {
//             var i = e.data("model");
//             if (i) {
//                 var n = this.theme.get("snippets");
//                 n.shiftLeft(n.find(i)), this.changed.dispatch(), this.syncSnippetOrder()
//             }
//         }
//     },
//     onSnippetMoveDown: function(t) {
//         var e = $(t.target).closest(".snippet-list-item");
//         if (e.length) {
//             var i = e.data("model");
//             if (i) {
//                 var n = this.theme.get("snippets");
//                 n.shiftRight(n.find(i)), this.changed.dispatch(), this.syncSnippetOrder()
//             }
//         }
//     }
// }),
// SL("views.themes").Preview = SL.views.Base.extend({
//     init: function() {
//         this._super(), SL.util.setupReveal({
//             openLinksInTabs: !0
//         }), window.parent !== window.self && window.parent.postMessage({
//             type: "theme-preview-ready"
//         }, window.location.origin)
//     }
// });

// SL("views.users").Show = SL.views.Base.extend({
//     init: function() {
//         this._super(),
//         SL.util.device.IS_PHONE && $("html").addClass("is-mobile-phone"),
//         this.setupAnnouncement(),
//         this.setupTabs(),
//         this.setupFilters(),
//         this.setupDecks(),
//         this.restoreFilters(),
//         $(".decks .deck .ladda-button").each(function(t, e) {
//             $(e).data("ladda", Ladda.create(e))
//         }),
//         $(window).on("scroll", this.onWindowScroll.bind(this))
//     },
//     setupAnnouncement: function() {
//         if (Modernizr.localstorage && SL.current_user.isEnterpriseManager() && SL.current_team && SL.current_team.get("beta_new_editor") === !1) {
//             var t = "slides-team-has-seen-new-editor-announcement";
//             if (!localStorage.getItem(t)) {
//                 var e = $(['<section class="announcement">', "<h3>New Editor</h3>", '<p>We have released a new and greatly improved presentation editor. Have a look at the <a href="http://slides.com/news/new-editor/" target="_blank">demo presentation</a> for a quick overview.</p>', "<p>To enable the new editor, please visit the team settings page.</p>", '<a class="button positive" href="/edit#beta-features">Team settings</a>', '<a class="button grey dismiss-button">Dismiss</a>', "</section>"].join(""));
//                 e.find(".dismiss-button").on("click", function() {
//                     e.remove(), localStorage.setItem(t, "completed")
//                 }), $(".main section").first().before(e)
//             }
//         }
//     },
//     setupTabs: function() {
//         $(".deck-filters-tab").on("vclick", function(t) {
//             this.selectTab($(t.currentTarget).attr("data-tab-id"))
//         }.bind(this)), this.tabValueDefault = $(".deck-filters-tab").first().attr("data-tab-id")
//     },
//     setupFilters: function() {
//         this.onSortOptionSelected = this.onSortOptionSelected.bind(this), this.sortDecks = this.sortDecks.bind(this), this.searchDecks = $.throttle(this.searchDecks.bind(this), 300), this.saveFilters = $.throttle(this.saveFilters.bind(this), 1e3), this.setupSortOptions(), $(".deck-filters-sort").on("vclick", function(t) {
//             return this.sortOptions.forEach(function(t) {
//                 t.selected = t.value === this.sortValue
//             }.bind(this)), SL.prompt({
//                 anchor: $(t.currentTarget),
//                 title: "Sort decks",
//                 type: "list",
//                 alignment: "b",
//                 data: this.sortOptions,
//                 multiselect: !1,
//                 optional: !0
//             }), !1
//         }.bind(this)), $(".deck-filters-search").on("vclick", function(t) {
//             $(this).focus(), t.preventDefault(), SL.analytics.track("User.show: Search")
//         }), $(".deck-filters-search").on("input", function(t) {
//             this.searchDecks($(t.currentTarget).val())
//         }.bind(this)), $(".deck-filters-search-clear").on("vclick", function(t) {
//             this.searchDecks(""), $(".deck-filters-search").val(""), t.preventDefault()
//         }.bind(this))
//     },
//     setupSortOptions: function() {
//         this.sortOptions = [], this.sortOptions.push({
//             value: "created",
//             title: "Newest first",
//             callback: this.onSortOptionSelected,
//             method: function(t, e) {
//                 return moment(this.getDeckData(e).created_at).unix() - moment(this.getDeckData(t).created_at).unix()
//             }.bind(this)
//         }), this.sortOptions.push({
//             value: "created-reverse",
//             title: "Oldest first",
//             callback: this.onSortOptionSelected,
//             method: function(t, e) {
//                 return moment(this.getDeckData(t).created_at).unix() - moment(this.getDeckData(e).created_at).unix()
//             }.bind(this)
//         }), $('.deck[data-visibility="all"]').length && this.sortOptions.push({
//             value: "views",
//             title: "Most views",
//             callback: this.onSortOptionSelected,
//             method: function(t, e) {
//                 var i = this.getDeckData(t),
//                     n = this.getDeckData(e),
//                     s = i.visibility === SL.models.Deck.VISIBILITY_ALL ? i.view_count : -1,
//                     o = n.visibility === SL.models.Deck.VISIBILITY_ALL ? n.view_count : -1;
//                 return o - s
//             }.bind(this)
//         }), this.sortOptions.push({
//             value: "az",
//             title: "Alphabetically",
//             callback: this.onSortOptionSelected,
//             method: function(t, e) {
//                 return t = this.getDeckData(t).title.trim().toLowerCase(), e = this.getDeckData(e).title.trim().toLowerCase(), e > t ? -1 : t > e ? 1 : 0
//             }.bind(this)
//         }), this.sortValueDefault = this.sortOptions[0].value, this.sortValue = this.sortValueDefault
//     },
//     setupDecks: function() {
//         $(".decks .deck").each(function(t, e) {
//             e = $(e), e.find(".edit").on("vclick", this.onEditClicked.bind(this, e)), e.find(".share").on("vclick", this.onShareClicked.bind(this, e)), e.find(".fork").on("vclick", this.onForkClicked.bind(this, e)), e.find(".clone").on("vclick", this.onCloneClicked.bind(this, e)), e.find(".delete").on("vclick", this.onDeleteClicked.bind(this, e)), e.find(".deck-lock-icon").on("vclick", this.onVisibilityClicked.bind(this, e)), e.find(".visibility").on("vclick", this.onVisibilityClicked.bind(this, e)), e.hasClass("is-owner") && (e.find(".deck-title-value").attr({
//                 "data-tooltip": "Click to edit",
//                 "data-tooltip-alignment": "l",
//                 "data-tooltip-delay": 200
//             }), e.find(".deck-title-value").on("click", this.onDeckTitleClicked.bind(this, e)), e.find(".deck-description-value").attr({
//                 "data-tooltip": "Click to edit",
//                 "data-tooltip-alignment": "l",
//                 "data-tooltip-delay": 200
//             }), e.find(".deck-description-value").on("click", this.onDeckDescriptionClicked.bind(this, e)))
//         }.bind(this)), this.loadImagesInView(), this.loadImagesInView = $.throttle(this.loadImagesInView, 200)
//     },
//     loadImagesInView: function() {
//         var t = 300,
//             e = -t,
//             i = window.innerHeight + t;
//         $(".decks .deck [data-image-url]").each(function(t, n) {
//             var s = n.getBoundingClientRect();
//             s.bottom > e && s.top < i && (n.style.backgroundImage = 'url("' + n.getAttribute("data-image-url") + '")', n.removeAttribute("data-image-url"))
//         }.bind(this))
//     },
//     flashDecks: function() {
//         clearTimeout(this.flashDecksTimeout), $(".decks").addClass("flash"), this.flashDecksTimeout = setTimeout(function() {
//             $(".decks").removeClass("flash")
//         }, 1e3)
//     },
//     selectTab: function(t) {
//         $(".deck-filters-tab").removeClass("selected"), $(".deck-filters-tab[data-tab-id=" + t + "]").addClass("selected"), $(".decks").removeClass("visible"), $(".decks[data-tab-id=" + t + "]").addClass("visible"), this.tabValue = t, this.saveFilters()
//     },
//     sortDecks: function(t) {
//         var e = this.getSortOptionByValue(t);
//         e && (this.sortValue = t, $(".deck-filters-sort").text(e.title), $(".decks").each(function() {
//             var t = $(this).find(".deck");
//             t.sort(e.method), t.detach().appendTo(this)
//         }), this.saveFilters(), this.loadImagesInView(), this.flashDecks())
//     },
//     searchDecks: function(t) {
//         if ($(".deck-placeholder").remove(), $(".decks").unhighlight(), t = (t || "").trim(), "" === t) $(".decks .deck").removeClass("hidden");
//         else {
//             var e = new RegExp(t, "i");
//             $(".decks .deck").each(function(i, n) {
//                 n = $(n);
//                 var s = n.find(".deck-title-value").text(),
//                     o = n.find(".deck-description-value").text();
//                 n.toggleClass("hidden", !e.test(s) && !e.test(o)), t.length > 1 && n.find(".deck-title-value, .deck-description-value").highlight(t)
//             }.bind(this)), $(".decks").each(function() {
//                 if (0 === $(this).find(".deck:not(.hidden)").length) {
//                     var e = $('<div class="deck-placeholder"><p></p></div>');
//                     e.find("p").text('No results matching "' + t + '"'), e.appendTo(this)
//                 }
//             })
//         }
//         this.searchValue = t, this.saveFilters(), this.loadImagesInView()
//     },
//     saveFilters: function() {
//         if (Modernizr.history) {
//             var t = [];
//             this.sortValue !== this.sortValueDefault && t.push("sort=" + escape(this.sortValue)), this.searchValue && "" !== this.searchValue && t.push("search=" + escape(this.searchValue)), this.tabValue && "" !== this.tabValue && this.tabValue !== this.tabValueDefault && t.push("tab=" + escape(this.tabValue)), t.length ? window.history.replaceState(null, null, window.location.pathname + "?" + t.join("&")) : window.history.replaceState(null, null, window.location.pathname)
//         }
//     },
//     restoreFilters: function() {
//         var t = SL.util.getQuery();
//         t.search && ($(".deck-filters-search").val(t.search), this.searchDecks(t.search)), t.sort && this.sortDecks(t.sort), t.tab && this.selectTab(t.tab)
//     },
//     getSortOptionByValue: function(t) {
//         return this.sortOptions.filter(function(e) {
//             return e.value === t
//         }).shift()
//     },
//     getDeckData: function(t) {
//         return t = $(t), {
//             user: {
//                 id: parseInt(t.attr("data-user-id"), 10),
//                 username: t.attr("data-username")
//             },
//             id: t.attr("data-id"),
//             slug: t.attr("data-slug"),
//             title: t.find(".deck-title-value").text(),
//             view_count: t.attr("data-view-count") || 0,
//             created_at: t.attr("data-created-at"),
//             updated_at: t.attr("data-updated-at"),
//             visibility: t.attr("data-visibility")
//         }
//     },
//     saveVisibility: function(t, e) {
//         var i = this.getDeckData(t),
//             n = {
//                 type: "POST",
//                 url: SL.config.AJAX_PUBLISH_DECK(i.id),
//                 context: this,
//                 data: {
//                     visibility: e
//                 }
//             },
//             s = t.find(".visibility").data("ladda");
//         s && s.start(), $.ajax(n).done(function(e) {
//             e.deck.visibility === SL.models.Deck.VISIBILITY_SELF ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_SELF")) : e.deck.visibility === SL.models.Deck.VISIBILITY_TEAM ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_TEAM")) : e.deck.visibility === SL.models.Deck.VISIBILITY_ALL && SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ALL")), "string" == typeof e.deck.slug && t.attr("data-slug", e.deck.slug), "string" == typeof e.deck.visibility && t.attr("data-visibility", e.deck.visibility)
//         }).fail(function() {
//             SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ERROR"), "negative")
//         }).always(function() {
//             s && s.stop(), t.removeClass("hover")
//         })
//     },
//     cloneDeck: function(t, e) {
//         var i = this.getDeckData(t);
//         t.addClass("hover");
//         var n = t.find(".clone.ladda-button").data("ladda");
//         n && n.start(), $.ajax({
//             type: "POST",
//             url: SL.config.AJAX_FORK_DECK(i.id),
//             context: this
//         }).done(function() {
//             SL.util.callback(e)
//         }).fail(function() {
//             SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), n && n.stop(), t.removeClass("hover")
//         })
//     },
//     onEditClicked: function(t, e) {
//         e.preventDefault(), window.location = t.attr("data-url") + "/edit"
//     },
//     onDeleteClicked: function(t, e) {
//         e.preventDefault(), t.addClass("hover");
//         var i = this.getDeckData(t),
//             n = SL.prompt({
//                 anchor: $(e.currentTarget),
//                 title: SL.locale.get("DECK_DELETE_CONFIRM", {
//                     title: SL.util.escapeHTMLEntities(i.title)
//                 }),
//                 type: "select",
//                 data: [{
//                     html: "<h3>Cancel</h3>",
//                     callback: function() {
//                         t.removeClass("hover")
//                     }.bind(this)
//                 }, {
//                     html: "<h3>Delete</h3>",
//                     selected: !0,
//                     className: "negative",
//                     callback: function() {
//                         t.find(".deck-metadata .status").text("Deleting...");
//                         var e = t.find(".delete.ladda-button").data("ladda");
//                         e && e.start(), $.ajax({
//                             type: "DELETE",
//                             url: SL.config.AJAX_UPDATE_DECK(i.id),
//                             data: {},
//                             context: this
//                         }).done(function() {
//                             SL.util.anim.collapseListItem(t, function() {
//                                 e && e.stop(), t.remove()
//                             }.bind(this)), SL.notify(SL.locale.get("DECK_DELETE_SUCCESS"))
//                         }).fail(function() {
//                             SL.notify(SL.locale.get("DECK_DELETE_ERROR"), "negative"), e && e.stop()
//                         }).always(function() {
//                             t.removeClass("hover")
//                         })
//                     }.bind(this)
//                 }]
//             });
//         n.canceled.add(function() {
//             t.removeClass("hover")
//         }),
//             SL.analytics.track("User.show: Delete deck")
//     },
//     onVisibilityClicked: function(t, e) {
//         e.preventDefault(), t.addClass("hover");
//         var i = this.getDeckData(t),
//             n = [];
//         n.push({
//             html: SL.locale.get("DECK_VISIBILITY_CHANGE_SELF"),
//             selected: i.visibility === SL.models.Deck.VISIBILITY_SELF,
//             callback: function() {
//                 this.saveVisibility(t, SL.models.Deck.VISIBILITY_SELF), SL.analytics.track("User.show: Visibility changed", "self")
//             }.bind(this)
//         }),
//         SL.current_user.isEnterprise() && n.push({
//             html: SL.locale.get("DECK_VISIBILITY_CHANGE_TEAM"),
//             selected: i.visibility === SL.models.Deck.VISIBILITY_TEAM,
//             className: "divider",
//             callback: function() {
//                 this.saveVisibility(t, SL.models.Deck.VISIBILITY_TEAM), SL.analytics.track("User.show: Visibility changed", "team")
//             }.bind(this)
//         }), n.push({
//             html: SL.locale.get("DECK_VISIBILITY_CHANGE_ALL"),
//             selected: i.visibility === SL.models.Deck.VISIBILITY_ALL,
//             callback: function() {
//                 this.saveVisibility(t, SL.models.Deck.VISIBILITY_ALL), SL.analytics.track("User.show: Visibility changed", "all")
//             }.bind(this)
//         });
//         var s = SL.prompt({
//             anchor: $(e.currentTarget),
//             type: "select",
//             className: "sl-visibility-prompt",
//             data: n
//         });
//         s.canceled.add(function() {
//             t.removeClass("hover")
//         }),
//             SL.analytics.track("User.show: Visibility menu opened")
//     },
//     onShareClicked: function(t, e) {
//         e.preventDefault();
//         var i = this.getDeckData(t);
//         return "string" != typeof i.user.username || "string" != typeof i.slug && "string" != typeof i.id ? SL.notify(SL.locale.get("GENERIC_ERROR"), "negative") : SL.popup.open(SL.components.decksharer.DeckSharer, {
//             deck: new SL.models.Deck(i)
//         }), !1
//     },
//     onCloneClicked: function(t, e) {
//         return e.preventDefault(), this.cloneDeck(t, function() {
//             window.scrollTo(0, 0), window.location.reload()
//         }), !1
//     },
//     onForkClicked: function(t, e) {
//         return e.preventDefault(), this.cloneDeck(t, function() {
//             window.location = SL.current_user.getProfileURL()
//         }), !1
//     },
//     onDeckTitleClicked: function(t) {
//         var e = t.find(".deck-title-value"),
//             i = SL.prompt({
//                 anchor: e,
//                 title: "Edit deck title",
//                 type: "input",
//                 confirmLabel: "Save",
//                 data: {
//                     value: e.text(),
//                     placeholder: "Deck title...",
//                     maxlength: SL.config.DECK_TITLE_MAXLENGTH,
//                     width: 400,
//                     confirmBeforeDiscard: !0
//                 }
//             });
//         return i.confirmed.add(function(i) {
//             i && "" !== i.trim() ? (e.text(i), $.ajax({
//                 url: SL.config.AJAX_UPDATE_DECK(this.getDeckData(t).id),
//                 type: "PUT",
//                 context: this,
//                 data: {
//                     deck: {
//                         title: i
//                     }
//                 }
//             }).fail(function() {
//                 SL.notify("An error occured while saving your deck title", "negative")
//             })) : SL.notify("Title can't be empty", "negative")
//         }.bind(this)), !1
//     },
//     onDeckDescriptionClicked: function(t) {
//         var e = t.find(".deck-description-value"),
//             i = SL.prompt({
//                 anchor: e,
//                 title: "Edit deck description",
//                 type: "input",
//                 confirmLabel: "Save",
//                 data: {
//                     value: e.text(),
//                     placeholder: "A short description of this deck...",
//                     multiline: !0,
//                     confirmBeforeDiscard: !0
//                 }
//             });
//         return i.confirmed.add(function(i) {
//             e.text(i), $.ajax({
//                 url: SL.config.AJAX_UPDATE_DECK(this.getDeckData(t).id),
//                 type: "PUT",
//                 context: this,
//                 data: {
//                     deck: {
//                         description: i
//                     }
//                 }
//             }).fail(function() {
//                 SL.notify("An error occured while saving your deck description", "negative")
//             })
//         }.bind(this)), !1
//     },
//     onWindowScroll: function() {
//         this.loadImagesInView()
//     },
//     onSortOptionSelected: function(t) {
//         SL.analytics.track("User.show: Sort", t), this.sortDecks(t)
//     }
// });
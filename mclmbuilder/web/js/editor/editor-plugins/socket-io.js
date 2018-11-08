'use strict';

const socketIo = function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var t;
        t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.io = e()
    }
}(function() {
    var e;
    return function t(e, i, n) {
        function r(s, a) {
            if (!i[s]) {
                if (!e[s]) {
                    var l = "function" == typeof require && require;
                    if (!a && l) return l(s, !0);
                    if (o) return o(s, !0);
                    var c = new Error("Cannot find module '" + s + "'");
                    throw c.code = "MODULE_NOT_FOUND", c
                }
                var d = i[s] = {
                    exports: {}
                };
                e[s][0].call(d.exports, function(t) {
                    var i = e[s][1][t];
                    return r(i ? i : t)
                }, d, d.exports, t, e, i, n)
            }
            return i[s].exports
        }
        for (var o = "function" == typeof require && require, s = 0; s < n.length; s++) r(n[s]);
        return r
    }({
        1: [function(e, t) {
            t.exports = e("./lib/")
        }, {
            "./lib/": 2
        }],
        2: [function(e, t) {
            t.exports = e("./socket"), t.exports.parser = e("engine.io-parser")
        }, {
            "./socket": 3,
            "engine.io-parser": 19
        }],
        3: [function(e, t) {
            (function(i) {
                function n(e, t) {
                    if (!(this instanceof n)) return new n(e, t);
                    t = t || {}, e && "object" == typeof e && (t = e, e = null), e ? (e = d(e), t.hostname = e.host, t.secure = "https" == e.protocol || "wss" == e.protocol, t.port = e.port, e.query && (t.query = e.query)) : t.host && (t.hostname = d(t.host).host), this.secure = null != t.secure ? t.secure : i.location && "https:" == location.protocol, t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.agent = t.agent || !1, this.hostname = t.hostname || (i.location ? location.hostname : "localhost"), this.port = t.port || (i.location && location.port ? location.port : this.secure ? 443 : 80), this.query = t.query || {}, "string" == typeof this.query && (this.query = u.decode(this.query)), this.upgrade = !1 !== t.upgrade, this.path = (t.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!t.forceJSONP, this.jsonp = !1 !== t.jsonp, this.forceBase64 = !!t.forceBase64, this.enablesXDR = !!t.enablesXDR, this.timestampParam = t.timestampParam || "t", this.timestampRequests = t.timestampRequests, this.transports = t.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.policyPort = t.policyPort || 843, this.rememberUpgrade = t.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = t.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== t.perMessageDeflate ? t.perMessageDeflate || {} : !1, !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), this.pfx = t.pfx || null, this.key = t.key || null, this.passphrase = t.passphrase || null, this.cert = t.cert || null, this.ca = t.ca || null, this.ciphers = t.ciphers || null, this.rejectUnauthorized = void 0 === t.rejectUnauthorized ? null : t.rejectUnauthorized;
                    var r = "object" == typeof i && i;
                    r.global === r && t.extraHeaders && Object.keys(t.extraHeaders).length > 0 && (this.extraHeaders = t.extraHeaders), this.open()
                }

                function r(e) {
                    var t = {};
                    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
                    return t
                }
                var o = e("./transports"),
                    s = e("component-emitter"),
                    a = e("debug")("engine.io-client:socket"),
                    l = e("indexof"),
                    c = e("engine.io-parser"),
                    d = e("parseuri"),
                    h = e("parsejson"),
                    u = e("parseqs");
                t.exports = n, n.priorWebsocketSuccess = !1, s(n.prototype), n.protocol = c.protocol, n.Socket = n, n.Transport = e("./transport"), n.transports = e("./transports"), n.parser = e("engine.io-parser"), n.prototype.createTransport = function(e) {
                    a('creating transport "%s"', e);
                    var t = r(this.query);
                    t.EIO = c.protocol, t.transport = e, this.id && (t.sid = this.id);
                    var i = new o[e]({
                        agent: this.agent,
                        hostname: this.hostname,
                        port: this.port,
                        secure: this.secure,
                        path: this.path,
                        query: t,
                        forceJSONP: this.forceJSONP,
                        jsonp: this.jsonp,
                        forceBase64: this.forceBase64,
                        enablesXDR: this.enablesXDR,
                        timestampRequests: this.timestampRequests,
                        timestampParam: this.timestampParam,
                        policyPort: this.policyPort,
                        socket: this,
                        pfx: this.pfx,
                        key: this.key,
                        passphrase: this.passphrase,
                        cert: this.cert,
                        ca: this.ca,
                        ciphers: this.ciphers,
                        rejectUnauthorized: this.rejectUnauthorized,
                        perMessageDeflate: this.perMessageDeflate,
                        extraHeaders: this.extraHeaders
                    });
                    return i
                }, n.prototype.open = function() {
                    var e;
                    if (this.rememberUpgrade && n.priorWebsocketSuccess && -1 != this.transports.indexOf("websocket")) e = "websocket";
                    else {
                        if (0 === this.transports.length) {
                            var t = this;
                            return void setTimeout(function() {
                                t.emit("error", "No transports available")
                            }, 0)
                        }
                        e = this.transports[0]
                    }
                    this.readyState = "opening";
                    try {
                        e = this.createTransport(e)
                    } catch (i) {
                        return this.transports.shift(), void this.open()
                    }
                    e.open(), this.setTransport(e)
                }, n.prototype.setTransport = function(e) {
                    a("setting transport %s", e.name);
                    var t = this;
                    this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = e, e.on("drain", function() {
                        t.onDrain()
                    }).on("packet", function(e) {
                        t.onPacket(e)
                    }).on("error", function(e) {
                        t.onError(e)
                    }).on("close", function() {
                        t.onClose("transport close")
                    })
                }, n.prototype.probe = function(e) {
                    function t() {
                        if (u.onlyBinaryUpgrades) {
                            var t = !this.supportsBinary && u.transport.supportsBinary;
                            h = h || t
                        }
                        h || (a('probe transport "%s" opened', e), d.send([{
                            type: "ping",
                            data: "probe"
                        }]), d.once("packet", function(t) {
                            if (!h)
                                if ("pong" == t.type && "probe" == t.data) {
                                    if (a('probe transport "%s" pong', e), u.upgrading = !0, u.emit("upgrading", d), !d) return;
                                    n.priorWebsocketSuccess = "websocket" == d.name, a('pausing current transport "%s"', u.transport.name), u.transport.pause(function() {
                                        h || "closed" != u.readyState && (a("changing transport and sending upgrade packet"), c(), u.setTransport(d), d.send([{
                                            type: "upgrade"
                                        }]), u.emit("upgrade", d), d = null, u.upgrading = !1, u.flush())
                                    })
                                } else {
                                    a('probe transport "%s" failed', e);
                                    var i = new Error("probe error");
                                    i.transport = d.name, u.emit("upgradeError", i)
                                }
                        }))
                    }

                    function i() {
                        h || (h = !0, c(), d.close(), d = null)
                    }

                    function r(t) {
                        var n = new Error("probe error: " + t);
                        n.transport = d.name, i(), a('probe transport "%s" failed because of error: %s', e, t), u.emit("upgradeError", n)
                    }

                    function o() {
                        r("transport closed")
                    }

                    function s() {
                        r("socket closed")
                    }

                    function l(e) {
                        d && e.name != d.name && (a('"%s" works - aborting "%s"', e.name, d.name), i())
                    }

                    function c() {
                        d.removeListener("open", t), d.removeListener("error", r), d.removeListener("close", o), u.removeListener("close", s), u.removeListener("upgrading", l)
                    }
                    a('probing transport "%s"', e);
                    var d = this.createTransport(e, {
                            probe: 1
                        }),
                        h = !1,
                        u = this;
                    n.priorWebsocketSuccess = !1, d.once("open", t), d.once("error", r), d.once("close", o), this.once("close", s), this.once("upgrading", l), d.open()
                }, n.prototype.onOpen = function() {
                    if (a("socket open"), this.readyState = "open", n.priorWebsocketSuccess = "websocket" == this.transport.name, this.emit("open"), this.flush(), "open" == this.readyState && this.upgrade && this.transport.pause) {
                        a("starting upgrade probes");
                        for (var e = 0, t = this.upgrades.length; t > e; e++) this.probe(this.upgrades[e])
                    }
                }, n.prototype.onPacket = function(e) {
                    if ("opening" == this.readyState || "open" == this.readyState) switch (a('socket receive: type "%s", data "%s"', e.type, e.data), this.emit("packet", e), this.emit("heartbeat"), e.type) {
                        case "open":
                            this.onHandshake(h(e.data));
                            break;
                        case "pong":
                            this.setPing(), this.emit("pong");
                            break;
                        case "error":
                            var t = new Error("server error");
                            t.code = e.data, this.onError(t);
                            break;
                        case "message":
                            this.emit("data", e.data), this.emit("message", e.data)
                    } else a('packet received with socket readyState "%s"', this.readyState)
                }, n.prototype.onHandshake = function(e) {
                    this.emit("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this.upgrades = this.filterUpgrades(e.upgrades), this.pingInterval = e.pingInterval, this.pingTimeout = e.pingTimeout, this.onOpen(), "closed" != this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
                }, n.prototype.onHeartbeat = function(e) {
                    clearTimeout(this.pingTimeoutTimer);
                    var t = this;
                    t.pingTimeoutTimer = setTimeout(function() {
                        "closed" != t.readyState && t.onClose("ping timeout")
                    }, e || t.pingInterval + t.pingTimeout)
                }, n.prototype.setPing = function() {
                    var e = this;
                    clearTimeout(e.pingIntervalTimer), e.pingIntervalTimer = setTimeout(function() {
                        a("writing ping packet - expecting pong within %sms", e.pingTimeout), e.ping(), e.onHeartbeat(e.pingTimeout)
                    }, e.pingInterval)
                }, n.prototype.ping = function() {
                    var e = this;
                    this.sendPacket("ping", function() {
                        e.emit("ping")
                    })
                }, n.prototype.onDrain = function() {
                    this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush()
                }, n.prototype.flush = function() {
                    "closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
                }, n.prototype.write = n.prototype.send = function(e, t, i) {
                    return this.sendPacket("message", e, t, i), this
                }, n.prototype.sendPacket = function(e, t, i, n) {
                    if ("function" == typeof t && (n = t, t = void 0), "function" == typeof i && (n = i, i = null), "closing" != this.readyState && "closed" != this.readyState) {
                        i = i || {}, i.compress = !1 !== i.compress;
                        var r = {
                            type: e,
                            data: t,
                            options: i
                        };
                        this.emit("packetCreate", r), this.writeBuffer.push(r), n && this.once("flush", n), this.flush()
                    }
                }, n.prototype.close = function() {
                    function e() {
                        n.onClose("forced close"), a("socket closing - telling transport to close"), n.transport.close()
                    }

                    function t() {
                        n.removeListener("upgrade", t), n.removeListener("upgradeError", t), e()
                    }

                    function i() {
                        n.once("upgrade", t), n.once("upgradeError", t)
                    }
                    if ("opening" == this.readyState || "open" == this.readyState) {
                        this.readyState = "closing";
                        var n = this;
                        this.writeBuffer.length ? this.once("drain", function() {
                            this.upgrading ? i() : e()
                        }) : this.upgrading ? i() : e()
                    }
                    return this
                }, n.prototype.onError = function(e) {
                    a("socket error %j", e), n.priorWebsocketSuccess = !1, this.emit("error", e), this.onClose("transport error", e)
                }, n.prototype.onClose = function(e, t) {
                    if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
                        a('socket close with reason: "%s"', e);
                        var i = this;
                        clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", e, t), i.writeBuffer = [], i.prevBufferLen = 0
                    }
                }, n.prototype.filterUpgrades = function(e) {
                    for (var t = [], i = 0, n = e.length; n > i; i++) ~l(this.transports, e[i]) && t.push(e[i]);
                    return t
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            "./transport": 4,
            "./transports": 5,
            "component-emitter": 15,
            debug: 17,
            "engine.io-parser": 19,
            indexof: 23,
            parsejson: 26,
            parseqs: 27,
            parseuri: 28
        }],
        4: [function(e, t) {
            function i(e) {
                this.path = e.path, this.hostname = e.hostname, this.port = e.port, this.secure = e.secure, this.query = e.query, this.timestampParam = e.timestampParam, this.timestampRequests = e.timestampRequests, this.readyState = "", this.agent = e.agent || !1, this.socket = e.socket, this.enablesXDR = e.enablesXDR, this.pfx = e.pfx, this.key = e.key, this.passphrase = e.passphrase, this.cert = e.cert, this.ca = e.ca, this.ciphers = e.ciphers, this.rejectUnauthorized = e.rejectUnauthorized, this.extraHeaders = e.extraHeaders
            }
            var n = e("engine.io-parser"),
                r = e("component-emitter");
            t.exports = i, r(i.prototype), i.prototype.onError = function(e, t) {
                var i = new Error(e);
                return i.type = "TransportError", i.description = t, this.emit("error", i), this
            }, i.prototype.open = function() {
                return ("closed" == this.readyState || "" == this.readyState) && (this.readyState = "opening", this.doOpen()), this
            }, i.prototype.close = function() {
                return ("opening" == this.readyState || "open" == this.readyState) && (this.doClose(), this.onClose()), this
            }, i.prototype.send = function(e) {
                if ("open" != this.readyState) throw new Error("Transport not open");
                this.write(e)
            }, i.prototype.onOpen = function() {
                this.readyState = "open", this.writable = !0, this.emit("open")
            }, i.prototype.onData = function(e) {
                var t = n.decodePacket(e, this.socket.binaryType);
                this.onPacket(t)
            }, i.prototype.onPacket = function(e) {
                this.emit("packet", e)
            }, i.prototype.onClose = function() {
                this.readyState = "closed", this.emit("close")
            }
        }, {
            "component-emitter": 15,
            "engine.io-parser": 19
        }],
        5: [function(e, t, i) {
            (function(t) {
                function n(e) {
                    var i, n = !1,
                        a = !1,
                        l = !1 !== e.jsonp;
                    if (t.location) {
                        var c = "https:" == location.protocol,
                            d = location.port;
                        d || (d = c ? 443 : 80), n = e.hostname != location.hostname || d != e.port, a = e.secure != c
                    }
                    if (e.xdomain = n, e.xscheme = a, i = new r(e), "open" in i && !e.forceJSONP) return new o(e);
                    if (!l) throw new Error("JSONP disabled");
                    return new s(e)
                }
                var r = e("xmlhttprequest-ssl"),
                    o = e("./polling-xhr"),
                    s = e("./polling-jsonp"),
                    a = e("./websocket");
                i.polling = n, i.websocket = a
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            "./polling-jsonp": 6,
            "./polling-xhr": 7,
            "./websocket": 9,
            "xmlhttprequest-ssl": 10
        }],
        6: [function(e, t) {
            (function(i) {
                function n() {}

                function r(e) {
                    o.call(this, e), this.query = this.query || {}, a || (i.___eio || (i.___eio = []), a = i.___eio), this.index = a.length;
                    var t = this;
                    a.push(function(e) {
                        t.onData(e)
                    }), this.query.j = this.index, i.document && i.addEventListener && i.addEventListener("beforeunload", function() {
                        t.script && (t.script.onerror = n)
                    }, !1)
                }
                var o = e("./polling"),
                    s = e("component-inherit");
                t.exports = r;
                var a, l = /\n/g,
                    c = /\\n/g;
                s(r, o), r.prototype.supportsBinary = !1, r.prototype.doClose = function() {
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), o.prototype.doClose.call(this)
                }, r.prototype.doPoll = function() {
                    var e = this,
                        t = document.createElement("script");
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null), t.async = !0, t.src = this.uri(), t.onerror = function(t) {
                        e.onError("jsonp poll error", t)
                    };
                    var i = document.getElementsByTagName("script")[0];
                    i ? i.parentNode.insertBefore(t, i) : (document.head || document.body).appendChild(t), this.script = t;
                    var n = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                    n && setTimeout(function() {
                        var e = document.createElement("iframe");
                        document.body.appendChild(e), document.body.removeChild(e)
                    }, 100)
                }, r.prototype.doWrite = function(e, t) {
                    function i() {
                        n(), t()
                    }

                    function n() {
                        if (r.iframe) try {
                            r.form.removeChild(r.iframe)
                        } catch (e) {
                            r.onError("jsonp polling iframe removal error", e)
                        }
                        try {
                            var t = '<iframe src="javascript:0" name="' + r.iframeId + '">';
                            o = document.createElement(t)
                        } catch (e) {
                            o = document.createElement("iframe"), o.name = r.iframeId, o.src = "javascript:0"
                        }
                        o.id = r.iframeId, r.form.appendChild(o), r.iframe = o
                    }
                    var r = this;
                    if (!this.form) {
                        var o, s = document.createElement("form"),
                            a = document.createElement("textarea"),
                            d = this.iframeId = "eio_iframe_" + this.index;
                        s.className = "socketio", s.style.position = "absolute", s.style.top = "-1000px", s.style.left = "-1000px", s.target = d, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), a.name = "d", s.appendChild(a), document.body.appendChild(s), this.form = s, this.area = a
                    }
                    this.form.action = this.uri(), n(), e = e.replace(c, "\\\n"), this.area.value = e.replace(l, "\\n");
                    try {
                        this.form.submit()
                    } catch (h) {}
                    this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                        "complete" == r.iframe.readyState && i()
                    } : this.iframe.onload = i
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            "./polling": 8,
            "component-inherit": 16
        }],
        7: [function(e, t) {
            (function(i) {
                function n() {}

                function r(e) {
                    if (l.call(this, e), i.location) {
                        var t = "https:" == location.protocol,
                            n = location.port;
                        n || (n = t ? 443 : 80), this.xd = e.hostname != i.location.hostname || n != e.port, this.xs = e.secure != t
                    } else this.extraHeaders = e.extraHeaders
                }

                function o(e) {
                    this.method = e.method || "GET", this.uri = e.uri, this.xd = !!e.xd, this.xs = !!e.xs, this.async = !1 !== e.async, this.data = void 0 != e.data ? e.data : null, this.agent = e.agent, this.isBinary = e.isBinary, this.supportsBinary = e.supportsBinary, this.enablesXDR = e.enablesXDR, this.pfx = e.pfx, this.key = e.key, this.passphrase = e.passphrase, this.cert = e.cert, this.ca = e.ca, this.ciphers = e.ciphers, this.rejectUnauthorized = e.rejectUnauthorized, this.extraHeaders = e.extraHeaders, this.create()
                }

                function s() {
                    for (var e in o.requests) o.requests.hasOwnProperty(e) && o.requests[e].abort()
                }
                var a = e("xmlhttprequest-ssl"),
                    l = e("./polling"),
                    c = e("component-emitter"),
                    d = e("component-inherit"),
                    h = e("debug")("engine.io-client:polling-xhr");
                t.exports = r, t.exports.Request = o, d(r, l), r.prototype.supportsBinary = !0, r.prototype.request = function(e) {
                    return e = e || {}, e.uri = this.uri(), e.xd = this.xd, e.xs = this.xs, e.agent = this.agent || !1, e.supportsBinary = this.supportsBinary, e.enablesXDR = this.enablesXDR, e.pfx = this.pfx, e.key = this.key, e.passphrase = this.passphrase, e.cert = this.cert, e.ca = this.ca, e.ciphers = this.ciphers, e.rejectUnauthorized = this.rejectUnauthorized, e.extraHeaders = this.extraHeaders, new o(e)
                }, r.prototype.doWrite = function(e, t) {
                    var i = "string" != typeof e && void 0 !== e,
                        n = this.request({
                            method: "POST",
                            data: e,
                            isBinary: i
                        }),
                        r = this;
                    n.on("success", t), n.on("error", function(e) {
                        r.onError("xhr post error", e)
                    }), this.sendXhr = n
                }, r.prototype.doPoll = function() {
                    h("xhr poll");
                    var e = this.request(),
                        t = this;
                    e.on("data", function(e) {
                        t.onData(e)
                    }), e.on("error", function(e) {
                        t.onError("xhr poll error", e)
                    }), this.pollXhr = e
                }, c(o.prototype), o.prototype.create = function() {
                    var e = {
                        agent: this.agent,
                        xdomain: this.xd,
                        xscheme: this.xs,
                        enablesXDR: this.enablesXDR
                    };
                    e.pfx = this.pfx, e.key = this.key, e.passphrase = this.passphrase, e.cert = this.cert, e.ca = this.ca, e.ciphers = this.ciphers, e.rejectUnauthorized = this.rejectUnauthorized;
                    var t = this.xhr = new a(e),
                        n = this;
                    try {
                        h("xhr open %s: %s", this.method, this.uri), t.open(this.method, this.uri, this.async);
                        try {
                            if (this.extraHeaders) {
                                t.setDisableHeaderCheck(!0);
                                for (var r in this.extraHeaders) this.extraHeaders.hasOwnProperty(r) && t.setRequestHeader(r, this.extraHeaders[r])
                            }
                        } catch (s) {}
                        if (this.supportsBinary && (t.responseType = "arraybuffer"), "POST" == this.method) try {
                            this.isBinary ? t.setRequestHeader("Content-type", "application/octet-stream") : t.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                        } catch (s) {}
                        "withCredentials" in t && (t.withCredentials = !0), this.hasXDR() ? (t.onload = function() {
                            n.onLoad()
                        }, t.onerror = function() {
                            n.onError(t.responseText)
                        }) : t.onreadystatechange = function() {
                            4 == t.readyState && (200 == t.status || 1223 == t.status ? n.onLoad() : setTimeout(function() {
                                n.onError(t.status)
                            }, 0))
                        }, h("xhr data %s", this.data), t.send(this.data)
                    } catch (s) {
                        return void setTimeout(function() {
                            n.onError(s)
                        }, 0)
                    }
                    i.document && (this.index = o.requestsCount++, o.requests[this.index] = this)
                }, o.prototype.onSuccess = function() {
                    this.emit("success"), this.cleanup()
                }, o.prototype.onData = function(e) {
                    this.emit("data", e), this.onSuccess()
                }, o.prototype.onError = function(e) {
                    this.emit("error", e), this.cleanup(!0)
                }, o.prototype.cleanup = function(e) {
                    if ("undefined" != typeof this.xhr && null !== this.xhr) {
                        if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = n : this.xhr.onreadystatechange = n, e) try {
                            this.xhr.abort()
                        } catch (t) {}
                        i.document && delete o.requests[this.index], this.xhr = null
                    }
                }, o.prototype.onLoad = function() {
                    var e;
                    try {
                        var t;
                        try {
                            t = this.xhr.getResponseHeader("Content-Type").split(";")[0]
                        } catch (i) {}
                        if ("application/octet-stream" === t) e = this.xhr.response;
                        else if (this.supportsBinary) try {
                            e = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response))
                        } catch (i) {
                            for (var n = new Uint8Array(this.xhr.response), r = [], o = 0, s = n.length; s > o; o++) r.push(n[o]);
                            e = String.fromCharCode.apply(null, r)
                        } else e = this.xhr.responseText
                    } catch (i) {
                        this.onError(i)
                    }
                    null != e && this.onData(e)
                }, o.prototype.hasXDR = function() {
                    return "undefined" != typeof i.XDomainRequest && !this.xs && this.enablesXDR
                }, o.prototype.abort = function() {
                    this.cleanup()
                }, i.document && (o.requestsCount = 0, o.requests = {}, i.attachEvent ? i.attachEvent("onunload", s) : i.addEventListener && i.addEventListener("beforeunload", s, !1))
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            "./polling": 8,
            "component-emitter": 15,
            "component-inherit": 16,
            debug: 17,
            "xmlhttprequest-ssl": 10
        }],
        8: [function(e, t) {
            function i(e) {
                var t = e && e.forceBase64;
                (!c || t) && (this.supportsBinary = !1), n.call(this, e)
            }
            var n = e("../transport"),
                r = e("parseqs"),
                o = e("engine.io-parser"),
                s = e("component-inherit"),
                a = e("yeast"),
                l = e("debug")("engine.io-client:polling");
            t.exports = i;
            var c = function() {
                var t = e("xmlhttprequest-ssl"),
                    i = new t({
                        xdomain: !1
                    });
                return null != i.responseType
            }();
            s(i, n), i.prototype.name = "polling", i.prototype.doOpen = function() {
                this.poll()
            }, i.prototype.pause = function(e) {
                function t() {
                    l("paused"), i.readyState = "paused", e()
                }
                var i = this;
                if (this.readyState = "pausing", this.polling || !this.writable) {
                    var n = 0;
                    this.polling && (l("we are currently polling - waiting to pause"), n++, this.once("pollComplete", function() {
                        l("pre-pause polling complete"), --n || t()
                    })), this.writable || (l("we are currently writing - waiting to pause"), n++, this.once("drain", function() {
                        l("pre-pause writing complete"), --n || t()
                    }))
                } else t()
            }, i.prototype.poll = function() {
                l("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
            }, i.prototype.onData = function(e) {
                var t = this;
                l("polling got data %s", e);
                var i = function(e) {
                    return "opening" == t.readyState && t.onOpen(), "close" == e.type ? (t.onClose(), !1) : void t.onPacket(e)
                };
                o.decodePayload(e, this.socket.binaryType, i), "closed" != this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" == this.readyState ? this.poll() : l('ignoring poll - transport state "%s"', this.readyState))
            }, i.prototype.doClose = function() {
                function e() {
                    l("writing close packet"), t.write([{
                        type: "close"
                    }])
                }
                var t = this;
                "open" == this.readyState ? (l("transport open - closing"), e()) : (l("transport not open - deferring close"), this.once("open", e))
            }, i.prototype.write = function(e) {
                var t = this;
                this.writable = !1;
                var i = function() {
                        t.writable = !0, t.emit("drain")
                    },
                    t = this;
                o.encodePayload(e, this.supportsBinary, function(e) {
                    t.doWrite(e, i)
                })
            }, i.prototype.uri = function() {
                var e = this.query || {},
                    t = this.secure ? "https" : "http",
                    i = "";
                !1 !== this.timestampRequests && (e[this.timestampParam] = a()), this.supportsBinary || e.sid || (e.b64 = 1), e = r.encode(e), this.port && ("https" == t && 443 != this.port || "http" == t && 80 != this.port) && (i = ":" + this.port), e.length && (e = "?" + e);
                var n = -1 !== this.hostname.indexOf(":");
                return t + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + i + this.path + e
            }
        }, {
            "../transport": 4,
            "component-inherit": 16,
            debug: 17,
            "engine.io-parser": 19,
            parseqs: 27,
            "xmlhttprequest-ssl": 10,
            yeast: 30
        }],
        9: [function(e, t) {
            (function(i) {
                function n(e) {
                    var t = e && e.forceBase64;
                    t && (this.supportsBinary = !1), this.perMessageDeflate = e.perMessageDeflate, r.call(this, e)
                }
                var r = e("../transport"),
                    o = e("engine.io-parser"),
                    s = e("parseqs"),
                    a = e("component-inherit"),
                    l = e("yeast"),
                    c = e("debug")("engine.io-client:websocket"),
                    d = i.WebSocket || i.MozWebSocket,
                    h = d;
                if (!h && "undefined" == typeof window) try {
                    h = e("ws")
                } catch (u) {}
                t.exports = n, a(n, r), n.prototype.name = "websocket", n.prototype.supportsBinary = !0, n.prototype.doOpen = function() {
                    if (this.check()) {
                        var e = this.uri(),
                            t = void 0,
                            i = {
                                agent: this.agent,
                                perMessageDeflate: this.perMessageDeflate
                            };
                        i.pfx = this.pfx, i.key = this.key, i.passphrase = this.passphrase, i.cert = this.cert, i.ca = this.ca, i.ciphers = this.ciphers, i.rejectUnauthorized = this.rejectUnauthorized, this.extraHeaders && (i.headers = this.extraHeaders), this.ws = d ? new h(e) : new h(e, t, i), void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, this.ws.binaryType = "buffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners()
                    }
                }, n.prototype.addEventListeners = function() {
                    var e = this;
                    this.ws.onopen = function() {
                        e.onOpen()
                    }, this.ws.onclose = function() {
                        e.onClose()
                    }, this.ws.onmessage = function(t) {
                        e.onData(t.data)
                    }, this.ws.onerror = function(t) {
                        e.onError("websocket error", t)
                    }
                }, "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (n.prototype.onData = function(e) {
                    var t = this;
                    setTimeout(function() {
                        r.prototype.onData.call(t, e)
                    }, 0)
                }), n.prototype.write = function(e) {
                    function t() {
                        n.emit("flush"), setTimeout(function() {
                            n.writable = !0, n.emit("drain")
                        }, 0)
                    }
                    var n = this;
                    this.writable = !1;
                    for (var r = e.length, s = 0, a = r; a > s; s++) ! function(e) {
                        o.encodePacket(e, n.supportsBinary, function(o) {
                            if (!d) {
                                var s = {};
                                if (e.options && (s.compress = e.options.compress), n.perMessageDeflate) {
                                    var a = "string" == typeof o ? i.Buffer.byteLength(o) : o.length;
                                    a < n.perMessageDeflate.threshold && (s.compress = !1)
                                }
                            }
                            try {
                                d ? n.ws.send(o) : n.ws.send(o, s)
                            } catch (l) {
                                c("websocket closed before onclose event")
                            }--r || t()
                        })
                    }(e[s])
                }, n.prototype.onClose = function() {
                    r.prototype.onClose.call(this)
                }, n.prototype.doClose = function() {
                    "undefined" != typeof this.ws && this.ws.close()
                }, n.prototype.uri = function() {
                    var e = this.query || {},
                        t = this.secure ? "wss" : "ws",
                        i = "";
                    this.port && ("wss" == t && 443 != this.port || "ws" == t && 80 != this.port) && (i = ":" + this.port), this.timestampRequests && (e[this.timestampParam] = l()), this.supportsBinary || (e.b64 = 1), e = s.encode(e), e.length && (e = "?" + e);
                    var n = -1 !== this.hostname.indexOf(":");
                    return t + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + i + this.path + e
                }, n.prototype.check = function() {
                    return !(!h || "__initialize" in h && this.name === n.prototype.name)
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            "../transport": 4,
            "component-inherit": 16,
            debug: 17,
            "engine.io-parser": 19,
            parseqs: 27,
            ws: void 0,
            yeast: 30
        }],
        10: [function(e, t) {
            var i = e("has-cors");
            t.exports = function(e) {
                var t = e.xdomain,
                    n = e.xscheme,
                    r = e.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!t || i)) return new XMLHttpRequest
                } catch (o) {}
                try {
                    if ("undefined" != typeof XDomainRequest && !n && r) return new XDomainRequest
                } catch (o) {}
                if (!t) try {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                } catch (o) {}
            }
        }, {
            "has-cors": 22
        }],
        11: [function(e, t) {
            function i(e, t, i) {
                function r(e, n) {
                    if (r.count <= 0) throw new Error("after called too many times");
                    --r.count, e ? (o = !0, t(e), t = i) : 0 !== r.count || o || t(null, n)
                }
                var o = !1;
                return i = i || n, r.count = e, 0 === e ? t() : r
            }

            function n() {}
            t.exports = i
        }, {}],
        12: [function(e, t) {
            t.exports = function(e, t, i) {
                var n = e.byteLength;
                if (t = t || 0, i = i || n, e.slice) return e.slice(t, i);
                if (0 > t && (t += n), 0 > i && (i += n), i > n && (i = n), t >= n || t >= i || 0 === n) return new ArrayBuffer(0);
                for (var r = new Uint8Array(e), o = new Uint8Array(i - t), s = t, a = 0; i > s; s++, a++) o[a] = r[s];
                return o.buffer
            }
        }, {}],
        13: [function(e, t, i) {
            ! function(e) {
                "use strict";
                i.encode = function(t) {
                    var i, n = new Uint8Array(t),
                        r = n.length,
                        o = "";
                    for (i = 0; r > i; i += 3) o += e[n[i] >> 2], o += e[(3 & n[i]) << 4 | n[i + 1] >> 4], o += e[(15 & n[i + 1]) << 2 | n[i + 2] >> 6], o += e[63 & n[i + 2]];
                    return r % 3 === 2 ? o = o.substring(0, o.length - 1) + "=" : r % 3 === 1 && (o = o.substring(0, o.length - 2) + "=="), o
                }, i.decode = function(t) {
                    var i, n, r, o, s, a = .75 * t.length,
                        l = t.length,
                        c = 0;
                    "=" === t[t.length - 1] && (a--, "=" === t[t.length - 2] && a--);
                    var d = new ArrayBuffer(a),
                        h = new Uint8Array(d);
                    for (i = 0; l > i; i += 4) n = e.indexOf(t[i]), r = e.indexOf(t[i + 1]), o = e.indexOf(t[i + 2]), s = e.indexOf(t[i + 3]), h[c++] = n << 2 | r >> 4, h[c++] = (15 & r) << 4 | o >> 2, h[c++] = (3 & o) << 6 | 63 & s;
                    return d
                }
            }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
        }, {}],
        14: [function(e, t) {
            (function(e) {
                function i(e) {
                    for (var t = 0; t < e.length; t++) {
                        var i = e[t];
                        if (i.buffer instanceof ArrayBuffer) {
                            var n = i.buffer;
                            if (i.byteLength !== n.byteLength) {
                                var r = new Uint8Array(i.byteLength);
                                r.set(new Uint8Array(n, i.byteOffset, i.byteLength)), n = r.buffer
                            }
                            e[t] = n
                        }
                    }
                }

                function n(e, t) {
                    t = t || {};
                    var n = new o;
                    i(e);
                    for (var r = 0; r < e.length; r++) n.append(e[r]);
                    return t.type ? n.getBlob(t.type) : n.getBlob()
                }

                function r(e, t) {
                    return i(e), new Blob(e, t || {})
                }
                var o = e.BlobBuilder || e.WebKitBlobBuilder || e.MSBlobBuilder || e.MozBlobBuilder,
                    s = function() {
                        try {
                            var e = new Blob(["hi"]);
                            return 2 === e.size
                        } catch (t) {
                            return !1
                        }
                    }(),
                    a = s && function() {
                            try {
                                var e = new Blob([new Uint8Array([1, 2])]);
                                return 2 === e.size
                            } catch (t) {
                                return !1
                            }
                        }(),
                    l = o && o.prototype.append && o.prototype.getBlob;
                t.exports = function() {
                    return s ? a ? e.Blob : r : l ? n : void 0
                }()
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        15: [function(e, t) {
            function i(e) {
                return e ? n(e) : void 0
            }

            function n(e) {
                for (var t in i.prototype) e[t] = i.prototype[t];
                return e
            }
            t.exports = i, i.prototype.on = i.prototype.addEventListener = function(e, t) {
                return this._callbacks = this._callbacks || {}, (this._callbacks[e] = this._callbacks[e] || []).push(t), this
            }, i.prototype.once = function(e, t) {
                function i() {
                    n.off(e, i), t.apply(this, arguments)
                }
                var n = this;
                return this._callbacks = this._callbacks || {}, i.fn = t, this.on(e, i), this
            }, i.prototype.off = i.prototype.removeListener = i.prototype.removeAllListeners = i.prototype.removeEventListener = function(e, t) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                var i = this._callbacks[e];
                if (!i) return this;
                if (1 == arguments.length) return delete this._callbacks[e], this;
                for (var n, r = 0; r < i.length; r++)
                    if (n = i[r], n === t || n.fn === t) {
                        i.splice(r, 1);
                        break
                    }
                return this
            }, i.prototype.emit = function(e) {
                this._callbacks = this._callbacks || {};
                var t = [].slice.call(arguments, 1),
                    i = this._callbacks[e];
                if (i) {
                    i = i.slice(0);
                    for (var n = 0, r = i.length; r > n; ++n) i[n].apply(this, t)
                }
                return this
            }, i.prototype.listeners = function(e) {
                return this._callbacks = this._callbacks || {}, this._callbacks[e] || []
            }, i.prototype.hasListeners = function(e) {
                return !!this.listeners(e).length
            }
        }, {}],
        16: [function(e, t) {
            t.exports = function(e, t) {
                var i = function() {};
                i.prototype = t.prototype, e.prototype = new i, e.prototype.constructor = e
            }
        }, {}],
        17: [function(e, t, i) {
            function n() {
                return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
            }

            function r() {
                var e = arguments,
                    t = this.useColors;
                if (e[0] = (t ? "%c" : "") + this.namespace + (t ? " %c" : " ") + e[0] + (t ? "%c " : " ") + "+" + i.humanize(this.diff), !t) return e;
                var n = "color: " + this.color;
                e = [e[0], n, "color: inherit"].concat(Array.prototype.slice.call(e, 1));
                var r = 0,
                    o = 0;
                return e[0].replace(/%[a-z%]/g, function(e) {
                    "%%" !== e && (r++, "%c" === e && (o = r))
                }), e.splice(o, 0, n), e
            }

            function o() {
                return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
            }

            function s(e) {
                try {
                    null == e ? i.storage.removeItem("debug") : i.storage.debug = e
                } catch (t) {}
            }

            function a() {
                var e;
                try {
                    e = i.storage.debug
                } catch (t) {}
                return e
            }

            function l() {
                try {
                    return window.localStorage
                } catch (e) {}
            }
            i = t.exports = e("./debug"), i.log = o, i.formatArgs = r, i.save = s, i.load = a, i.useColors = n, i.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : l(), i.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], i.formatters.j = function(e) {
                return JSON.stringify(e)
            }, i.enable(a())
        }, {
            "./debug": 18
        }],
        18: [function(e, t, i) {
            function n() {
                return i.colors[d++ % i.colors.length]
            }

            function r(e) {
                function t() {}

                function r() {
                    var e = r,
                        t = +new Date,
                        o = t - (c || t);
                    e.diff = o, e.prev = c, e.curr = t, c = t, null == e.useColors && (e.useColors = i.useColors()), null == e.color && e.useColors && (e.color = n());
                    var s = Array.prototype.slice.call(arguments);
                    s[0] = i.coerce(s[0]), "string" != typeof s[0] && (s = ["%o"].concat(s));
                    var a = 0;
                    s[0] = s[0].replace(/%([a-z%])/g, function(t, n) {
                        if ("%%" === t) return t;
                        a++;
                        var r = i.formatters[n];
                        if ("function" == typeof r) {
                            var o = s[a];
                            t = r.call(e, o), s.splice(a, 1), a--
                        }
                        return t
                    }), "function" == typeof i.formatArgs && (s = i.formatArgs.apply(e, s));
                    var l = r.log || i.log || console.log.bind(console);
                    l.apply(e, s)
                }
                t.enabled = !1, r.enabled = !0;
                var o = i.enabled(e) ? r : t;
                return o.namespace = e, o
            }

            function o(e) {
                i.save(e);
                for (var t = (e || "").split(/[\s,]+/), n = t.length, r = 0; n > r; r++) t[r] && (e = t[r].replace(/\*/g, ".*?"), "-" === e[0] ? i.skips.push(new RegExp("^" + e.substr(1) + "$")) : i.names.push(new RegExp("^" + e + "$")))
            }

            function s() {
                i.enable("")
            }

            function a(e) {
                var t, n;
                for (t = 0, n = i.skips.length; n > t; t++)
                    if (i.skips[t].test(e)) return !1;
                for (t = 0, n = i.names.length; n > t; t++)
                    if (i.names[t].test(e)) return !0;
                return !1
            }

            function l(e) {
                return e instanceof Error ? e.stack || e.message : e
            }
            i = t.exports = r, i.coerce = l, i.disable = s, i.enable = o, i.enabled = a, i.humanize = e("ms"), i.names = [], i.skips = [], i.formatters = {};
            var c, d = 0
        }, {
            ms: 25
        }],
        19: [function(e, t, i) {
            (function(t) {
                function n(e, t) {
                    var n = "b" + i.packets[e.type] + e.data.data;
                    return t(n)
                }

                function r(e, t, n) {
                    if (!t) return i.encodeBase64Packet(e, n);
                    var r = e.data,
                        o = new Uint8Array(r),
                        s = new Uint8Array(1 + r.byteLength);
                    s[0] = b[e.type];
                    for (var a = 0; a < o.length; a++) s[a + 1] = o[a];
                    return n(s.buffer)
                }

                function o(e, t, n) {
                    if (!t) return i.encodeBase64Packet(e, n);
                    var r = new FileReader;
                    return r.onload = function() {
                        e.data = r.result, i.encodePacket(e, t, !0, n)
                    }, r.readAsArrayBuffer(e.data)
                }

                function s(e, t, n) {
                    if (!t) return i.encodeBase64Packet(e, n);
                    if (f) return o(e, t, n);
                    var r = new Uint8Array(1);
                    r[0] = b[e.type];
                    var s = new y([r.buffer, e.data]);
                    return n(s)
                }

                function a(e, t, i) {
                    for (var n = new Array(e.length), r = u(e.length, i), o = function(e, i, r) {
                        t(i, function(t, i) {
                            n[e] = i, r(t, n)
                        })
                    }, s = 0; s < e.length; s++) o(s, e[s], r)
                }
                var l = e("./keys"),
                    c = e("has-binary"),
                    d = e("arraybuffer.slice"),
                    h = e("base64-arraybuffer"),
                    u = e("after"),
                    p = e("utf8"),
                    m = navigator.userAgent.match(/Android/i),
                    g = /PhantomJS/i.test(navigator.userAgent),
                    f = m || g;
                i.protocol = 3;
                var b = i.packets = {
                        open: 0,
                        close: 1,
                        ping: 2,
                        pong: 3,
                        message: 4,
                        upgrade: 5,
                        noop: 6
                    },
                    v = l(b),
                    C = {
                        type: "error",
                        data: "parser error"
                    },
                    y = e("blob");
                i.encodePacket = function(e, i, o, a) {
                    "function" == typeof i && (a = i, i = !1), "function" == typeof o && (a = o, o = null);
                    var l = void 0 === e.data ? void 0 : e.data.buffer || e.data;
                    if (t.ArrayBuffer && l instanceof ArrayBuffer) return r(e, i, a);
                    if (y && l instanceof t.Blob) return s(e, i, a);
                    if (l && l.base64) return n(e, a);
                    var c = b[e.type];
                    return void 0 !== e.data && (c += o ? p.encode(String(e.data)) : String(e.data)), a("" + c)
                }, i.encodeBase64Packet = function(e, n) {
                    var r = "b" + i.packets[e.type];
                    if (y && e.data instanceof t.Blob) {
                        var o = new FileReader;
                        return o.onload = function() {
                            var e = o.result.split(",")[1];
                            n(r + e)
                        }, o.readAsDataURL(e.data)
                    }
                    var s;
                    try {
                        s = String.fromCharCode.apply(null, new Uint8Array(e.data))
                    } catch (a) {
                        for (var l = new Uint8Array(e.data), c = new Array(l.length), d = 0; d < l.length; d++) c[d] = l[d];
                        s = String.fromCharCode.apply(null, c)
                    }
                    return r += t.btoa(s), n(r)
                }, i.decodePacket = function(e, t, n) {
                    if ("string" == typeof e || void 0 === e) {
                        if ("b" == e.charAt(0)) return i.decodeBase64Packet(e.substr(1), t);
                        if (n) try {
                            e = p.decode(e)
                        } catch (r) {
                            return C
                        }
                        var o = e.charAt(0);
                        return Number(o) == o && v[o] ? e.length > 1 ? {
                            type: v[o],
                            data: e.substring(1)
                        } : {
                            type: v[o]
                        } : C
                    }
                    var s = new Uint8Array(e),
                        o = s[0],
                        a = d(e, 1);
                    return y && "blob" === t && (a = new y([a])), {
                        type: v[o],
                        data: a
                    }
                }, i.decodeBase64Packet = function(e, i) {
                    var n = v[e.charAt(0)];
                    if (!t.ArrayBuffer) return {
                        type: n,
                        data: {
                            base64: !0,
                            data: e.substr(1)
                        }
                    };
                    var r = h.decode(e.substr(1));
                    return "blob" === i && y && (r = new y([r])), {
                        type: n,
                        data: r
                    }
                }, i.encodePayload = function(e, t, n) {
                    function r(e) {
                        return e.length + ":" + e
                    }

                    function o(e, n) {
                        i.encodePacket(e, s ? t : !1, !0, function(e) {
                            n(null, r(e))
                        })
                    }
                    "function" == typeof t && (n = t, t = null);
                    var s = c(e);
                    return t && s ? y && !f ? i.encodePayloadAsBlob(e, n) : i.encodePayloadAsArrayBuffer(e, n) : e.length ? void a(e, o, function(e, t) {
                        return n(t.join(""))
                    }) : n("0:")
                }, i.decodePayload = function(e, t, n) {
                    if ("string" != typeof e) return i.decodePayloadAsBinary(e, t, n);
                    "function" == typeof t && (n = t, t = null);
                    var r;
                    if ("" == e) return n(C, 0, 1);
                    for (var o, s, a = "", l = 0, c = e.length; c > l; l++) {
                        var d = e.charAt(l);
                        if (":" != d) a += d;
                        else {
                            if ("" == a || a != (o = Number(a))) return n(C, 0, 1);
                            if (s = e.substr(l + 1, o), a != s.length) return n(C, 0, 1);
                            if (s.length) {
                                if (r = i.decodePacket(s, t, !0), C.type == r.type && C.data == r.data) return n(C, 0, 1);
                                var h = n(r, l + o, c);
                                if (!1 === h) return
                            }
                            l += o, a = ""
                        }
                    }
                    return "" != a ? n(C, 0, 1) : void 0
                }, i.encodePayloadAsArrayBuffer = function(e, t) {
                    function n(e, t) {
                        i.encodePacket(e, !0, !0, function(e) {
                            return t(null, e)
                        })
                    }
                    return e.length ? void a(e, n, function(e, i) {
                        var n = i.reduce(function(e, t) {
                                var i;
                                return i = "string" == typeof t ? t.length : t.byteLength, e + i.toString().length + i + 2
                            }, 0),
                            r = new Uint8Array(n),
                            o = 0;
                        return i.forEach(function(e) {
                            var t = "string" == typeof e,
                                i = e;
                            if (t) {
                                for (var n = new Uint8Array(e.length), s = 0; s < e.length; s++) n[s] = e.charCodeAt(s);
                                i = n.buffer
                            }
                            r[o++] = t ? 0 : 1;
                            for (var a = i.byteLength.toString(), s = 0; s < a.length; s++) r[o++] = parseInt(a[s]);
                            r[o++] = 255;
                            for (var n = new Uint8Array(i), s = 0; s < n.length; s++) r[o++] = n[s]
                        }), t(r.buffer)
                    }) : t(new ArrayBuffer(0))
                }, i.encodePayloadAsBlob = function(e, t) {
                    function n(e, t) {
                        i.encodePacket(e, !0, !0, function(e) {
                            var i = new Uint8Array(1);
                            if (i[0] = 1, "string" == typeof e) {
                                for (var n = new Uint8Array(e.length), r = 0; r < e.length; r++) n[r] = e.charCodeAt(r);
                                e = n.buffer, i[0] = 0
                            }
                            for (var o = e instanceof ArrayBuffer ? e.byteLength : e.size, s = o.toString(), a = new Uint8Array(s.length + 1), r = 0; r < s.length; r++) a[r] = parseInt(s[r]);
                            if (a[s.length] = 255, y) {
                                var l = new y([i.buffer, a.buffer, e]);
                                t(null, l)
                            }
                        })
                    }
                    a(e, n, function(e, i) {
                        return t(new y(i))
                    })
                }, i.decodePayloadAsBinary = function(e, t, n) {
                    "function" == typeof t && (n = t, t = null);
                    for (var r = e, o = [], s = !1; r.byteLength > 0;) {
                        for (var a = new Uint8Array(r), l = 0 === a[0], c = "", h = 1; 255 != a[h]; h++) {
                            if (c.length > 310) {
                                s = !0;
                                break
                            }
                            c += a[h]
                        }
                        if (s) return n(C, 0, 1);
                        r = d(r, 2 + c.length), c = parseInt(c);
                        var u = d(r, 0, c);
                        if (l) try {
                            u = String.fromCharCode.apply(null, new Uint8Array(u))
                        } catch (p) {
                            var m = new Uint8Array(u);
                            u = "";
                            for (var h = 0; h < m.length; h++) u += String.fromCharCode(m[h])
                        }
                        o.push(u), r = d(r, c)
                    }
                    var g = o.length;
                    o.forEach(function(e, r) {
                        n(i.decodePacket(e, t, !0), r, g)
                    })
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            "./keys": 20,
            after: 11,
            "arraybuffer.slice": 12,
            "base64-arraybuffer": 13,
            blob: 14,
            "has-binary": 21,
            utf8: 29
        }],
        20: [function(e, t) {
            t.exports = Object.keys || function(e) {
                    var t = [],
                        i = Object.prototype.hasOwnProperty;
                    for (var n in e) i.call(e, n) && t.push(n);
                    return t
                }
        }, {}],
        21: [function(e, t) {
            (function(i) {
                function n(e) {
                    function t(e) {
                        if (!e) return !1;
                        if (i.Buffer && i.Buffer.isBuffer(e) || i.ArrayBuffer && e instanceof ArrayBuffer || i.Blob && e instanceof Blob || i.File && e instanceof File) return !0;
                        if (r(e)) {
                            for (var n = 0; n < e.length; n++)
                                if (t(e[n])) return !0
                        } else if (e && "object" == typeof e) {
                            e.toJSON && (e = e.toJSON());
                            for (var o in e)
                                if (Object.prototype.hasOwnProperty.call(e, o) && t(e[o])) return !0
                        }
                        return !1
                    }
                    return t(e)
                }
                var r = e("isarray");
                t.exports = n
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            isarray: 24
        }],
        22: [function(e, t) {
            try {
                t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest
            } catch (i) {
                t.exports = !1
            }
        }, {}],
        23: [function(e, t) {
            var i = [].indexOf;
            t.exports = function(e, t) {
                if (i) return e.indexOf(t);
                for (var n = 0; n < e.length; ++n)
                    if (e[n] === t) return n;
                return -1
            }
        }, {}],
        24: [function(e, t) {
            t.exports = Array.isArray || function(e) {
                    return "[object Array]" == Object.prototype.toString.call(e)
                }
        }, {}],
        25: [function(e, t) {
            function i(e) {
                if (e = "" + e, !(e.length > 1e4)) {
                    var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);
                    if (t) {
                        var i = parseFloat(t[1]),
                            n = (t[2] || "ms").toLowerCase();
                        switch (n) {
                            case "years":
                            case "year":
                            case "yrs":
                            case "yr":
                            case "y":
                                return i * d;
                            case "days":
                            case "day":
                            case "d":
                                return i * c;
                            case "hours":
                            case "hour":
                            case "hrs":
                            case "hr":
                            case "h":
                                return i * l;
                            case "minutes":
                            case "minute":
                            case "mins":
                            case "min":
                            case "m":
                                return i * a;
                            case "seconds":
                            case "second":
                            case "secs":
                            case "sec":
                            case "s":
                                return i * s;
                            case "milliseconds":
                            case "millisecond":
                            case "msecs":
                            case "msec":
                            case "ms":
                                return i
                        }
                    }
                }
            }

            function n(e) {
                return e >= c ? Math.round(e / c) + "d" : e >= l ? Math.round(e / l) + "h" : e >= a ? Math.round(e / a) + "m" : e >= s ? Math.round(e / s) + "s" : e + "ms"
            }

            function r(e) {
                return o(e, c, "day") || o(e, l, "hour") || o(e, a, "minute") || o(e, s, "second") || e + " ms"
            }

            function o(e, t, i) {
                return t > e ? void 0 : 1.5 * t > e ? Math.floor(e / t) + " " + i : Math.ceil(e / t) + " " + i + "s"
            }
            var s = 1e3,
                a = 60 * s,
                l = 60 * a,
                c = 24 * l,
                d = 365.25 * c;
            t.exports = function(e, t) {
                return t = t || {}, "string" == typeof e ? i(e) : t.long ? r(e) : n(e)
            }
        }, {}],
        26: [function(e, t) {
            (function(e) {
                var i = /^[\],:{}\s]*$/,
                    n = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                    r = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                    o = /(?:^|:|,)(?:\s*\[)+/g,
                    s = /^\s+/,
                    a = /\s+$/;
                t.exports = function(t) {
                    return "string" == typeof t && t ? (t = t.replace(s, "").replace(a, ""), e.JSON && JSON.parse ? JSON.parse(t) : i.test(t.replace(n, "@").replace(r, "]").replace(o, "")) ? new Function("return " + t)() : void 0) : null
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        27: [function(e, t, i) {
            i.encode = function(e) {
                var t = "";
                for (var i in e) e.hasOwnProperty(i) && (t.length && (t += "&"), t += encodeURIComponent(i) + "=" + encodeURIComponent(e[i]));
                return t
            }, i.decode = function(e) {
                for (var t = {}, i = e.split("&"), n = 0, r = i.length; r > n; n++) {
                    var o = i[n].split("=");
                    t[decodeURIComponent(o[0])] = decodeURIComponent(o[1])
                }
                return t
            }
        }, {}],
        28: [function(e, t) {
            var i = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                n = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
            t.exports = function(e) {
                var t = e,
                    r = e.indexOf("["),
                    o = e.indexOf("]"); - 1 != r && -1 != o && (e = e.substring(0, r) + e.substring(r, o).replace(/:/g, ";") + e.substring(o, e.length));
                for (var s = i.exec(e || ""), a = {}, l = 14; l--;) a[n[l]] = s[l] || "";
                return -1 != r && -1 != o && (a.source = t, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a
            }
        }, {}],
        29: [function(t, i, n) {
            (function(t) {
                ! function(r) {
                    function o(e) {
                        for (var t, i, n = [], r = 0, o = e.length; o > r;) t = e.charCodeAt(r++), t >= 55296 && 56319 >= t && o > r ? (i = e.charCodeAt(r++), 56320 == (64512 & i) ? n.push(((1023 & t) << 10) + (1023 & i) + 65536) : (n.push(t), r--)) : n.push(t);
                        return n
                    }

                    function s(e) {
                        for (var t, i = e.length, n = -1, r = ""; ++n < i;) t = e[n], t > 65535 && (t -= 65536, r += y(t >>> 10 & 1023 | 55296), t = 56320 | 1023 & t), r += y(t);
                        return r
                    }

                    function a(e) {
                        if (e >= 55296 && 57343 >= e) throw Error("Lone surrogate U+" + e.toString(16).toUpperCase() + " is not a scalar value")
                    }

                    function l(e, t) {
                        return y(e >> t & 63 | 128)
                    }

                    function c(e) {
                        if (0 == (4294967168 & e)) return y(e);
                        var t = "";
                        return 0 == (4294965248 & e) ? t = y(e >> 6 & 31 | 192) : 0 == (4294901760 & e) ? (a(e), t = y(e >> 12 & 15 | 224), t += l(e, 6)) : 0 == (4292870144 & e) && (t = y(e >> 18 & 7 | 240), t += l(e, 12), t += l(e, 6)), t += y(63 & e | 128)
                    }

                    function d(e) {
                        for (var t, i = o(e), n = i.length, r = -1, s = ""; ++r < n;) t = i[r], s += c(t);
                        return s
                    }

                    function h() {
                        if (C >= v) throw Error("Invalid byte index");
                        var e = 255 & b[C];
                        if (C++, 128 == (192 & e)) return 63 & e;
                        throw Error("Invalid continuation byte")
                    }

                    function u() {
                        var e, t, i, n, r;
                        if (C > v) throw Error("Invalid byte index");
                        if (C == v) return !1;
                        if (e = 255 & b[C], C++, 0 == (128 & e)) return e;
                        if (192 == (224 & e)) {
                            var t = h();
                            if (r = (31 & e) << 6 | t, r >= 128) return r;
                            throw Error("Invalid continuation byte")
                        }
                        if (224 == (240 & e)) {
                            if (t = h(), i = h(), r = (15 & e) << 12 | t << 6 | i, r >= 2048) return a(r), r;
                            throw Error("Invalid continuation byte")
                        }
                        if (240 == (248 & e) && (t = h(), i = h(), n = h(), r = (15 & e) << 18 | t << 12 | i << 6 | n, r >= 65536 && 1114111 >= r)) return r;
                        throw Error("Invalid UTF-8 detected")
                    }

                    function p(e) {
                        b = o(e), v = b.length, C = 0;
                        for (var t, i = [];
                             (t = u()) !== !1;) i.push(t);
                        return s(i)
                    }
                    var m = "object" == typeof n && n,
                        g = "object" == typeof i && i && i.exports == m && i,
                        f = "object" == typeof t && t;
                    (f.global === f || f.window === f) && (r = f);
                    var b, v, C, y = String.fromCharCode,
                        w = {
                            version: "2.0.0",
                            encode: d,
                            decode: p
                        };
                    if ("function" == typeof e && "object" == typeof e.amd && e.amd) e(function() {
                        return w
                    });
                    else if (m && !m.nodeType)
                        if (g) g.exports = w;
                        else {
                            var S = {},
                                _ = S.hasOwnProperty;
                            for (var k in w) _.call(w, k) && (m[k] = w[k])
                        }
                    else r.utf8 = w
                }(this)
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        30: [function(e, t) {
            "use strict";

            function i(e) {
                var t = "";
                do t = s[e % a] + t, e = Math.floor(e / a); while (e > 0);
                return t
            }

            function n(e) {
                var t = 0;
                for (d = 0; d < e.length; d++) t = t * a + l[e.charAt(d)];
                return t
            }

            function r() {
                var e = i(+new Date);
                return e !== o ? (c = 0, o = e) : e + "." + i(c++)
            }
            for (var o, s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), a = 64, l = {}, c = 0, d = 0; a > d; d++) l[s[d]] = d;
            r.encode = i, r.decode = n, t.exports = r
        }, {}],
        31: [function(e, t, i) {
            function n(e, t) {
                "object" == typeof e && (t = e, e = void 0), t = t || {};
                var i, n = r(e),
                    o = n.source,
                    c = n.id,
                    d = n.path,
                    h = l[c] && d in l[c].nsps,
                    u = t.forceNew || t["force new connection"] || !1 === t.multiplex || h;
                return u ? (a("ignoring socket cache for %s", o), i = s(o, t)) : (l[c] || (a("new io instance for %s", o), l[c] = s(o, t)), i = l[c]), i.socket(n.path)
            }
            var r = e("./url"),
                o = e("socket.io-parser"),
                s = e("./manager"),
                a = e("debug")("socket.io-client");
            t.exports = i = n;
            var l = i.managers = {};
            i.protocol = o.protocol, i.connect = n, i.Manager = e("./manager"), i.Socket = e("./socket")
        }, {
            "./manager": 32,
            "./socket": 34,
            "./url": 35,
            debug: 39,
            "socket.io-parser": 47
        }],
        32: [function(e, t) {
            function i(e, t) {
                return this instanceof i ? (e && "object" == typeof e && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = t, this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor(t.randomizationFactor || .5), this.backoff = new h({
                    min: this.reconnectionDelay(),
                    max: this.reconnectionDelayMax(),
                    jitter: this.randomizationFactor()
                }), this.timeout(null == t.timeout ? 2e4 : t.timeout), this.readyState = "closed", this.uri = e, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [], this.encoder = new s.Encoder, this.decoder = new s.Decoder, this.autoConnect = t.autoConnect !== !1, void(this.autoConnect && this.open())) : new i(e, t)
            }
            var n = e("engine.io-client"),
                r = e("./socket"),
                o = e("component-emitter"),
                s = e("socket.io-parser"),
                a = e("./on"),
                l = e("component-bind"),
                c = e("debug")("socket.io-client:manager"),
                d = e("indexof"),
                h = e("backo2"),
                u = Object.prototype.hasOwnProperty;
            t.exports = i, i.prototype.emitAll = function() {
                this.emit.apply(this, arguments);
                for (var e in this.nsps) u.call(this.nsps, e) && this.nsps[e].emit.apply(this.nsps[e], arguments)
            }, i.prototype.updateSocketIds = function() {
                for (var e in this.nsps) u.call(this.nsps, e) && (this.nsps[e].id = this.engine.id)
            }, o(i.prototype), i.prototype.reconnection = function(e) {
                return arguments.length ? (this._reconnection = !!e, this) : this._reconnection
            }, i.prototype.reconnectionAttempts = function(e) {
                return arguments.length ? (this._reconnectionAttempts = e, this) : this._reconnectionAttempts
            }, i.prototype.reconnectionDelay = function(e) {
                return arguments.length ? (this._reconnectionDelay = e, this.backoff && this.backoff.setMin(e), this) : this._reconnectionDelay
            }, i.prototype.randomizationFactor = function(e) {
                return arguments.length ? (this._randomizationFactor = e, this.backoff && this.backoff.setJitter(e), this) : this._randomizationFactor
            }, i.prototype.reconnectionDelayMax = function(e) {
                return arguments.length ? (this._reconnectionDelayMax = e, this.backoff && this.backoff.setMax(e), this) : this._reconnectionDelayMax
            }, i.prototype.timeout = function(e) {
                return arguments.length ? (this._timeout = e, this) : this._timeout
            }, i.prototype.maybeReconnectOnOpen = function() {
                !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
            }, i.prototype.open = i.prototype.connect = function(e) {
                if (c("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
                c("opening %s", this.uri), this.engine = n(this.uri, this.opts);
                var t = this.engine,
                    i = this;
                this.readyState = "opening", this.skipReconnect = !1;
                var r = a(t, "open", function() {
                        i.onopen(), e && e()
                    }),
                    o = a(t, "error", function(t) {
                        if (c("connect_error"), i.cleanup(), i.readyState = "closed", i.emitAll("connect_error", t), e) {
                            var n = new Error("Connection error");
                            n.data = t, e(n)
                        } else i.maybeReconnectOnOpen()
                    });
                if (!1 !== this._timeout) {
                    var s = this._timeout;
                    c("connect attempt will timeout after %d", s);
                    var l = setTimeout(function() {
                        c("connect attempt timed out after %d", s), r.destroy(), t.close(), t.emit("error", "timeout"), i.emitAll("connect_timeout", s)
                    }, s);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(l)
                        }
                    })
                }
                return this.subs.push(r), this.subs.push(o), this
            }, i.prototype.onopen = function() {
                c("open"), this.cleanup(), this.readyState = "open", this.emit("open");
                var e = this.engine;
                this.subs.push(a(e, "data", l(this, "ondata"))), this.subs.push(a(e, "ping", l(this, "onping"))), this.subs.push(a(e, "pong", l(this, "onpong"))), this.subs.push(a(e, "error", l(this, "onerror"))), this.subs.push(a(e, "close", l(this, "onclose"))), this.subs.push(a(this.decoder, "decoded", l(this, "ondecoded")))
            }, i.prototype.onping = function() {
                this.lastPing = new Date, this.emitAll("ping")
            }, i.prototype.onpong = function() {
                this.emitAll("pong", new Date - this.lastPing)
            }, i.prototype.ondata = function(e) {
                this.decoder.add(e)
            }, i.prototype.ondecoded = function(e) {
                this.emit("packet", e)
            }, i.prototype.onerror = function(e) {
                c("error", e), this.emitAll("error", e)
            }, i.prototype.socket = function(e) {
                function t() {
                    ~d(n.connecting, i) || n.connecting.push(i)
                }
                var i = this.nsps[e];
                if (!i) {
                    i = new r(this, e), this.nsps[e] = i;
                    var n = this;
                    i.on("connecting", t), i.on("connect", function() {
                        i.id = n.engine.id
                    }), this.autoConnect && t()
                }
                return i
            }, i.prototype.destroy = function(e) {
                var t = d(this.connecting, e);
                ~t && this.connecting.splice(t, 1), this.connecting.length || this.close()
            }, i.prototype.packet = function(e) {
                c("writing packet %j", e);
                var t = this;
                t.encoding ? t.packetBuffer.push(e) : (t.encoding = !0, this.encoder.encode(e, function(i) {
                    for (var n = 0; n < i.length; n++) t.engine.write(i[n], e.options);
                    t.encoding = !1, t.processPacketQueue()
                }))
            }, i.prototype.processPacketQueue = function() {
                if (this.packetBuffer.length > 0 && !this.encoding) {
                    var e = this.packetBuffer.shift();
                    this.packet(e)
                }
            }, i.prototype.cleanup = function() {
                c("cleanup");
                for (var e; e = this.subs.shift();) e.destroy();
                this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy()
            }, i.prototype.close = i.prototype.disconnect = function() {
                c("disconnect"), this.skipReconnect = !0, this.reconnecting = !1, "opening" == this.readyState && this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close()
            }, i.prototype.onclose = function(e) {
                c("onclose"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", e), this._reconnection && !this.skipReconnect && this.reconnect()
            }, i.prototype.reconnect = function() {
                if (this.reconnecting || this.skipReconnect) return this;
                var e = this;
                if (this.backoff.attempts >= this._reconnectionAttempts) c("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;
                else {
                    var t = this.backoff.duration();
                    c("will wait %dms before reconnect attempt", t), this.reconnecting = !0;
                    var i = setTimeout(function() {
                        e.skipReconnect || (c("attempting reconnect"), e.emitAll("reconnect_attempt", e.backoff.attempts), e.emitAll("reconnecting", e.backoff.attempts), e.skipReconnect || e.open(function(t) {
                            t ? (c("reconnect attempt error"), e.reconnecting = !1, e.reconnect(), e.emitAll("reconnect_error", t.data)) : (c("reconnect success"), e.onreconnect())
                        }))
                    }, t);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(i)
                        }
                    })
                }
            }, i.prototype.onreconnect = function() {
                var e = this.backoff.attempts;
                this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", e)
            }
        }, {
            "./on": 33,
            "./socket": 34,
            backo2: 36,
            "component-bind": 37,
            "component-emitter": 38,
            debug: 39,
            "engine.io-client": 1,
            indexof: 42,
            "socket.io-parser": 47
        }],
        33: [function(e, t) {
            function i(e, t, i) {
                return e.on(t, i), {
                    destroy: function() {
                        e.removeListener(t, i)
                    }
                }
            }
            t.exports = i
        }, {}],
        34: [function(e, t, i) {
            function n(e, t) {
                this.io = e, this.nsp = t, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0, this.io.autoConnect && this.open()
            }
            var r = e("socket.io-parser"),
                o = e("component-emitter"),
                s = e("to-array"),
                a = e("./on"),
                l = e("component-bind"),
                c = e("debug")("socket.io-client:socket"),
                d = e("has-binary");
            t.exports = i = n;
            var h = {
                    connect: 1,
                    connect_error: 1,
                    connect_timeout: 1,
                    connecting: 1,
                    disconnect: 1,
                    error: 1,
                    reconnect: 1,
                    reconnect_attempt: 1,
                    reconnect_failed: 1,
                    reconnect_error: 1,
                    reconnecting: 1,
                    ping: 1,
                    pong: 1
                },
                u = o.prototype.emit;
            o(n.prototype), n.prototype.subEvents = function() {
                if (!this.subs) {
                    var e = this.io;
                    this.subs = [a(e, "open", l(this, "onopen")), a(e, "packet", l(this, "onpacket")), a(e, "close", l(this, "onclose"))]
                }
            }, n.prototype.open = n.prototype.connect = function() {
                return this.connected ? this : (this.subEvents(), this.io.open(), "open" == this.io.readyState && this.onopen(), this.emit("connecting"), this)
            }, n.prototype.send = function() {
                var e = s(arguments);
                return e.unshift("message"), this.emit.apply(this, e), this
            }, n.prototype.emit = function(e) {
                if (h.hasOwnProperty(e)) return u.apply(this, arguments), this;
                var t = s(arguments),
                    i = r.EVENT;
                d(t) && (i = r.BINARY_EVENT);
                var n = {
                    type: i,
                    data: t
                };
                return n.options = {}, n.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof t[t.length - 1] && (c("emitting packet with ack id %d", this.ids), this.acks[this.ids] = t.pop(), n.id = this.ids++), this.connected ? this.packet(n) : this.sendBuffer.push(n), delete this.flags, this
            }, n.prototype.packet = function(e) {
                e.nsp = this.nsp, this.io.packet(e)
            }, n.prototype.onopen = function() {
                c("transport is open - connecting"), "/" != this.nsp && this.packet({
                    type: r.CONNECT
                })
            }, n.prototype.onclose = function(e) {
                c("close (%s)", e), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", e)
            }, n.prototype.onpacket = function(e) {
                if (e.nsp == this.nsp) switch (e.type) {
                    case r.CONNECT:
                        this.onconnect();
                        break;
                    case r.EVENT:
                        this.onevent(e);
                        break;
                    case r.BINARY_EVENT:
                        this.onevent(e);
                        break;
                    case r.ACK:
                        this.onack(e);
                        break;
                    case r.BINARY_ACK:
                        this.onack(e);
                        break;
                    case r.DISCONNECT:
                        this.ondisconnect();
                        break;
                    case r.ERROR:
                        this.emit("error", e.data)
                }
            }, n.prototype.onevent = function(e) {
                var t = e.data || [];
                c("emitting event %j", t), null != e.id && (c("attaching ack callback to event"), t.push(this.ack(e.id))), this.connected ? u.apply(this, t) : this.receiveBuffer.push(t)
            }, n.prototype.ack = function(e) {
                var t = this,
                    i = !1;
                return function() {
                    if (!i) {
                        i = !0;
                        var n = s(arguments);
                        c("sending ack %j", n);
                        var o = d(n) ? r.BINARY_ACK : r.ACK;
                        t.packet({
                            type: o,
                            id: e,
                            data: n
                        })
                    }
                }
            }, n.prototype.onack = function(e) {
                var t = this.acks[e.id];
                "function" == typeof t ? (c("calling ack %s with %j", e.id, e.data), t.apply(this, e.data), delete this.acks[e.id]) : c("bad ack %s", e.id)
            }, n.prototype.onconnect = function() {
                this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
            }, n.prototype.emitBuffered = function() {
                var e;
                for (e = 0; e < this.receiveBuffer.length; e++) u.apply(this, this.receiveBuffer[e]);
                for (this.receiveBuffer = [], e = 0; e < this.sendBuffer.length; e++) this.packet(this.sendBuffer[e]);
                this.sendBuffer = []
            }, n.prototype.ondisconnect = function() {
                c("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
            }, n.prototype.destroy = function() {
                if (this.subs) {
                    for (var e = 0; e < this.subs.length; e++) this.subs[e].destroy();
                    this.subs = null
                }
                this.io.destroy(this)
            }, n.prototype.close = n.prototype.disconnect = function() {
                return this.connected && (c("performing disconnect (%s)", this.nsp), this.packet({
                    type: r.DISCONNECT
                })), this.destroy(), this.connected && this.onclose("io client disconnect"), this
            }, n.prototype.compress = function(e) {
                return this.flags = this.flags || {}, this.flags.compress = e, this
            }
        }, {
            "./on": 33,
            "component-bind": 37,
            "component-emitter": 38,
            debug: 39,
            "has-binary": 41,
            "socket.io-parser": 47,
            "to-array": 51
        }],
        35: [function(e, t) {
            (function(i) {
                function n(e, t) {
                    var n = e,
                        t = t || i.location;
                    null == e && (e = t.protocol + "//" + t.host), "string" == typeof e && ("/" == e.charAt(0) && (e = "/" == e.charAt(1) ? t.protocol + e : t.host + e), /^(https?|wss?):\/\//.test(e) || (o("protocol-less url %s", e), e = "undefined" != typeof t ? t.protocol + "//" + e : "https://" + e), o("parse %s", e), n = r(e)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
                    var s = -1 !== n.host.indexOf(":"),
                        a = s ? "[" + n.host + "]" : n.host;
                    return n.id = n.protocol + "://" + a + ":" + n.port, n.href = n.protocol + "://" + a + (t && t.port == n.port ? "" : ":" + n.port), n
                }
                var r = e("parseuri"),
                    o = e("debug")("socket.io-client:url");
                t.exports = n
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            debug: 39,
            parseuri: 45
        }],
        36: [function(e, t) {
            function i(e) {
                e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0
            }
            t.exports = i, i.prototype.duration = function() {
                var e = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var t = Math.random(),
                        i = Math.floor(t * this.jitter * e);
                    e = 0 == (1 & Math.floor(10 * t)) ? e - i : e + i
                }
                return 0 | Math.min(e, this.max)
            }, i.prototype.reset = function() {
                this.attempts = 0
            }, i.prototype.setMin = function(e) {
                this.ms = e
            }, i.prototype.setMax = function(e) {
                this.max = e
            }, i.prototype.setJitter = function(e) {
                this.jitter = e
            }
        }, {}],
        37: [function(e, t) {
            var i = [].slice;
            t.exports = function(e, t) {
                if ("string" == typeof t && (t = e[t]), "function" != typeof t) throw new Error("bind() requires a function");
                var n = i.call(arguments, 2);
                return function() {
                    return t.apply(e, n.concat(i.call(arguments)))
                }
            }
        }, {}],
        38: [function(e, t) {
            function i(e) {
                return e ? n(e) : void 0
            }

            function n(e) {
                for (var t in i.prototype) e[t] = i.prototype[t];
                return e
            }
            t.exports = i, i.prototype.on = i.prototype.addEventListener = function(e, t) {
                return this._callbacks = this._callbacks || {}, (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t), this
            }, i.prototype.once = function(e, t) {
                function i() {
                    this.off(e, i), t.apply(this, arguments)
                }
                return i.fn = t, this.on(e, i), this
            }, i.prototype.off = i.prototype.removeListener = i.prototype.removeAllListeners = i.prototype.removeEventListener = function(e, t) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                var i = this._callbacks["$" + e];
                if (!i) return this;
                if (1 == arguments.length) return delete this._callbacks["$" + e], this;
                for (var n, r = 0; r < i.length; r++)
                    if (n = i[r], n === t || n.fn === t) {
                        i.splice(r, 1);
                        break
                    }
                return this
            }, i.prototype.emit = function(e) {
                this._callbacks = this._callbacks || {};
                var t = [].slice.call(arguments, 1),
                    i = this._callbacks["$" + e];
                if (i) {
                    i = i.slice(0);
                    for (var n = 0, r = i.length; r > n; ++n) i[n].apply(this, t)
                }
                return this
            }, i.prototype.listeners = function(e) {
                return this._callbacks = this._callbacks || {}, this._callbacks["$" + e] || []
            }, i.prototype.hasListeners = function(e) {
                return !!this.listeners(e).length
            }
        }, {}],
        39: [function(e, t, i) {
            arguments[4][17][0].apply(i, arguments)
        }, {
            "./debug": 40,
            dup: 17
        }],
        40: [function(e, t, i) {
            arguments[4][18][0].apply(i, arguments)
        }, {
            dup: 18,
            ms: 44
        }],
        41: [function(e, t) {
            (function(i) {
                function n(e) {
                    function t(e) {
                        if (!e) return !1;
                        if (i.Buffer && i.Buffer.isBuffer && i.Buffer.isBuffer(e) || i.ArrayBuffer && e instanceof ArrayBuffer || i.Blob && e instanceof Blob || i.File && e instanceof File) return !0;
                        if (r(e)) {
                            for (var n = 0; n < e.length; n++)
                                if (t(e[n])) return !0
                        } else if (e && "object" == typeof e) {
                            e.toJSON && "function" == typeof e.toJSON && (e = e.toJSON());
                            for (var o in e)
                                if (Object.prototype.hasOwnProperty.call(e, o) && t(e[o])) return !0
                        }
                        return !1
                    }
                    return t(e)
                }
                var r = e("isarray");
                t.exports = n
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            isarray: 43
        }],
        42: [function(e, t, i) {
            arguments[4][23][0].apply(i, arguments)
        }, {
            dup: 23
        }],
        43: [function(e, t, i) {
            arguments[4][24][0].apply(i, arguments)
        }, {
            dup: 24
        }],
        44: [function(e, t, i) {
            arguments[4][25][0].apply(i, arguments)
        }, {
            dup: 25
        }],
        45: [function(e, t, i) {
            arguments[4][28][0].apply(i, arguments)
        }, {
            dup: 28
        }],
        46: [function(e, t, i) {
            (function(t) {
                var n = e("isarray"),
                    r = e("./is-buffer");
                i.deconstructPacket = function(e) {
                    function t(e) {
                        if (!e) return e;
                        if (r(e)) {
                            var o = {
                                _placeholder: !0,
                                num: i.length
                            };
                            return i.push(e), o
                        }
                        if (n(e)) {
                            for (var s = new Array(e.length), a = 0; a < e.length; a++) s[a] = t(e[a]);
                            return s
                        }
                        if ("object" == typeof e && !(e instanceof Date)) {
                            var s = {};
                            for (var l in e) s[l] = t(e[l]);
                            return s
                        }
                        return e
                    }
                    var i = [],
                        o = e.data,
                        s = e;
                    return s.data = t(o), s.attachments = i.length, {
                        packet: s,
                        buffers: i
                    }
                }, i.reconstructPacket = function(e, t) {
                    function i(e) {
                        if (e && e._placeholder) {
                            var r = t[e.num];
                            return r
                        }
                        if (n(e)) {
                            for (var o = 0; o < e.length; o++) e[o] = i(e[o]);
                            return e
                        }
                        if (e && "object" == typeof e) {
                            for (var s in e) e[s] = i(e[s]);
                            return e
                        }
                        return e
                    }
                    return e.data = i(e.data), e.attachments = void 0, e
                }, i.removeBlobs = function(e, i) {
                    function o(e, l, c) {
                        if (!e) return e;
                        if (t.Blob && e instanceof Blob || t.File && e instanceof File) {
                            s++;
                            var d = new FileReader;
                            d.onload = function() {
                                c ? c[l] = this.result : a = this.result, --s || i(a)
                            }, d.readAsArrayBuffer(e)
                        } else if (n(e))
                            for (var h = 0; h < e.length; h++) o(e[h], h, e);
                        else if (e && "object" == typeof e && !r(e))
                            for (var u in e) o(e[u], u, e)
                    }
                    var s = 0,
                        a = e;
                    o(a), s || i(a)
                }
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {
            "./is-buffer": 48,
            isarray: 43
        }],
        47: [function(e, t, i) {
            function n() {}

            function r(e) {
                var t = "",
                    n = !1;
                return t += e.type, (i.BINARY_EVENT == e.type || i.BINARY_ACK == e.type) && (t += e.attachments, t += "-"), e.nsp && "/" != e.nsp && (n = !0, t += e.nsp), null != e.id && (n && (t += ",", n = !1), t += e.id), null != e.data && (n && (t += ","), t += h.stringify(e.data)), d("encoded %j as %s", e, t), t
            }

            function o(e, t) {
                function i(e) {
                    var i = p.deconstructPacket(e),
                        n = r(i.packet),
                        o = i.buffers;
                    o.unshift(n), t(o)
                }
                p.removeBlobs(e, i)
            }

            function s() {
                this.reconstructor = null
            }

            function a(e) {
                var t = {},
                    n = 0;
                if (t.type = Number(e.charAt(0)), null == i.types[t.type]) return c();
                if (i.BINARY_EVENT == t.type || i.BINARY_ACK == t.type) {
                    for (var r = "";
                         "-" != e.charAt(++n) && (r += e.charAt(n), n != e.length););
                    if (r != Number(r) || "-" != e.charAt(n)) throw new Error("Illegal attachments");
                    t.attachments = Number(r)
                }
                if ("/" == e.charAt(n + 1))
                    for (t.nsp = ""; ++n;) {
                        var o = e.charAt(n);
                        if ("," == o) break;
                        if (t.nsp += o, n == e.length) break
                    } else t.nsp = "/";
                var s = e.charAt(n + 1);
                if ("" !== s && Number(s) == s) {
                    for (t.id = ""; ++n;) {
                        var o = e.charAt(n);
                        if (null == o || Number(o) != o) {
                            --n;
                            break
                        }
                        if (t.id += e.charAt(n), n == e.length) break
                    }
                    t.id = Number(t.id)
                }
                if (e.charAt(++n)) try {
                    t.data = h.parse(e.substr(n))
                } catch (a) {
                    return c()
                }
                return d("decoded %s as %j", e, t), t
            }

            function l(e) {
                this.reconPack = e, this.buffers = []
            }

            function c() {
                return {
                    type: i.ERROR,
                    data: "parser error"
                }
            }
            var d = e("debug")("socket.io-parser"),
                h = e("json3"),
                u = (e("isarray"), e("component-emitter")),
                p = e("./binary"),
                m = e("./is-buffer");
            i.protocol = 4, i.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"], i.CONNECT = 0, i.DISCONNECT = 1, i.EVENT = 2, i.ACK = 3, i.ERROR = 4, i.BINARY_EVENT = 5, i.BINARY_ACK = 6, i.Encoder = n, i.Decoder = s, n.prototype.encode = function(e, t) {
                if (d("encoding packet %j", e), i.BINARY_EVENT == e.type || i.BINARY_ACK == e.type) o(e, t);
                else {
                    var n = r(e);
                    t([n])
                }
            }, u(s.prototype), s.prototype.add = function(e) {
                var t;
                if ("string" == typeof e) t = a(e), i.BINARY_EVENT == t.type || i.BINARY_ACK == t.type ? (this.reconstructor = new l(t), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", t)) : this.emit("decoded", t);
                else {
                    if (!m(e) && !e.base64) throw new Error("Unknown type: " + e);
                    if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                    t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, this.emit("decoded", t))
                }
            }, s.prototype.destroy = function() {
                this.reconstructor && this.reconstructor.finishedReconstruction()
            }, l.prototype.takeBinaryData = function(e) {
                if (this.buffers.push(e), this.buffers.length == this.reconPack.attachments) {
                    var t = p.reconstructPacket(this.reconPack, this.buffers);
                    return this.finishedReconstruction(), t
                }
                return null
            }, l.prototype.finishedReconstruction = function() {
                this.reconPack = null, this.buffers = []
            }
        }, {
            "./binary": 46,
            "./is-buffer": 48,
            "component-emitter": 49,
            debug: 39,
            isarray: 43,
            json3: 50
        }],
        48: [function(e, t) {
            (function(e) {
                function i(t) {
                    return e.Buffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer
                }
                t.exports = i
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        49: [function(e, t, i) {
            arguments[4][15][0].apply(i, arguments)
        }, {
            dup: 15
        }],
        50: [function(t, i, n) {
            (function(t) {
                (function() {
                    function r(e, t) {
                        function i(e) {
                            if (i[e] !== f) return i[e];
                            var r;
                            if ("bug-string-char-index" == e) r = "a" != "a" [0];
                            else if ("json" == e) r = i("json-stringify") && i("json-parse");
                            else {
                                var s, a = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                                if ("json-stringify" == e) {
                                    var l = t.stringify,
                                        d = "function" == typeof l && C;
                                    if (d) {
                                        (s = function() {
                                            return 1
                                        }).toJSON = s;
                                        try {
                                            d = "0" === l(0) && "0" === l(new n) && '""' == l(new o) && l(v) === f && l(f) === f && l() === f && "1" === l(s) && "[1]" == l([s]) && "[null]" == l([f]) && "null" == l(null) && "[null,null,null]" == l([f, v, null]) && l({
                                                    a: [s, !0, !1, null, "\x00\b\n\f\r  "]
                                                }) == a && "1" === l(null, s) && "[\n 1,\n 2\n]" == l([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == l(new c(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == l(new c(864e13)) && '"-000001-01-01T00:00:00.000Z"' == l(new c(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == l(new c(-1))
                                        } catch (h) {
                                            d = !1
                                        }
                                    }
                                    r = d
                                }
                                if ("json-parse" == e) {
                                    var u = t.parse;
                                    if ("function" == typeof u) try {
                                        if (0 === u("0") && !u(!1)) {
                                            s = u(a);
                                            var p = 5 == s.a.length && 1 === s.a[0];
                                            if (p) {
                                                try {
                                                    p = !u('"   "')
                                                } catch (h) {}
                                                if (p) try {
                                                    p = 1 !== u("01")
                                                } catch (h) {}
                                                if (p) try {
                                                    p = 1 !== u("1.")
                                                } catch (h) {}
                                            }
                                        }
                                    } catch (h) {
                                        p = !1
                                    }
                                    r = p
                                }
                            }
                            return i[e] = !!r
                        }
                        e || (e = l.Object()), t || (t = l.Object());
                        var n = e.Number || l.Number,
                            o = e.String || l.String,
                            a = e.Object || l.Object,
                            c = e.Date || l.Date,
                            d = e.SyntaxError || l.SyntaxError,
                            h = e.TypeError || l.TypeError,
                            u = e.Math || l.Math,
                            p = e.JSON || l.JSON;
                        "object" == typeof p && p && (t.stringify = p.stringify, t.parse = p.parse);
                        var m, g, f, b = a.prototype,
                            v = b.toString,
                            C = new c(-0xc782b5b800cec);
                        try {
                            C = -109252 == C.getUTCFullYear() && 0 === C.getUTCMonth() && 1 === C.getUTCDate() && 10 == C.getUTCHours() && 37 == C.getUTCMinutes() && 6 == C.getUTCSeconds() && 708 == C.getUTCMilliseconds()
                        } catch (y) {}
                        if (!i("json")) {
                            var w = "[object Function]",
                                S = "[object Date]",
                                _ = "[object Number]",
                                k = "[object String]",
                                E = "[object Array]",
                                A = "[object Boolean]",
                                x = i("bug-string-char-index");
                            if (!C) var I = u.floor,
                                D = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                                L = function(e, t) {
                                    return D[t] + 365 * (e - 1970) + I((e - 1969 + (t = +(t > 1))) / 4) - I((e - 1901 + t) / 100) + I((e - 1601 + t) / 400)
                                };
                            if ((m = b.hasOwnProperty) || (m = function(e) {
                                    var t, i = {};
                                    return (i.__proto__ = null, i.__proto__ = {
                                        toString: 1
                                    }, i).toString != v ? m = function(e) {
                                        var t = this.__proto__,
                                            i = e in (this.__proto__ = null, this);
                                        return this.__proto__ = t, i
                                    } : (t = i.constructor, m = function(e) {
                                        var i = (this.constructor || t).prototype;
                                        return e in this && !(e in i && this[e] === i[e])
                                    }), i = null, m.call(this, e)
                                }), g = function(e, t) {
                                    var i, n, r, o = 0;
                                    (i = function() {
                                        this.valueOf = 0
                                    }).prototype.valueOf = 0, n = new i;
                                    for (r in n) m.call(n, r) && o++;
                                    return i = n = null, o ? g = 2 == o ? function(e, t) {
                                        var i, n = {},
                                            r = v.call(e) == w;
                                        for (i in e) r && "prototype" == i || m.call(n, i) || !(n[i] = 1) || !m.call(e, i) || t(i)
                                    } : function(e, t) {
                                        var i, n, r = v.call(e) == w;
                                        for (i in e) r && "prototype" == i || !m.call(e, i) || (n = "constructor" === i) || t(i);
                                        (n || m.call(e, i = "constructor")) && t(i)
                                    } : (n = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], g = function(e, t) {
                                        var i, r, o = v.call(e) == w,
                                            a = !o && "function" != typeof e.constructor && s[typeof e.hasOwnProperty] && e.hasOwnProperty || m;
                                        for (i in e) o && "prototype" == i || !a.call(e, i) || t(i);
                                        for (r = n.length; i = n[--r]; a.call(e, i) && t(i));
                                    }), g(e, t)
                                }, !i("json-stringify")) {
                                var T = {
                                        92: "\\\\",
                                        34: '\\"',
                                        8: "\\b",
                                        12: "\\f",
                                        10: "\\n",
                                        13: "\\r",
                                        9: "\\t"
                                    },
                                    F = "000000",
                                    B = function(e, t) {
                                        return (F + (t || 0)).slice(-e)
                                    },
                                    P = "\\u00",
                                    M = function(e) {
                                        for (var t = '"', i = 0, n = e.length, r = !x || n > 10, o = r && (x ? e.split("") : e); n > i; i++) {
                                            var s = e.charCodeAt(i);
                                            switch (s) {
                                                case 8:
                                                case 9:
                                                case 10:
                                                case 12:
                                                case 13:
                                                case 34:
                                                case 92:
                                                    t += T[s];
                                                    break;
                                                default:
                                                    if (32 > s) {
                                                        t += P + B(2, s.toString(16));
                                                        break
                                                    }
                                                    t += r ? o[i] : e.charAt(i)
                                            }
                                        }
                                        return t + '"'
                                    },
                                    R = function(e, t, i, n, r, o, s) {
                                        var a, l, c, d, u, p, b, C, y, w, x, D, T, F, P, G;
                                        try {
                                            a = t[e]
                                        } catch (N) {}
                                        if ("object" == typeof a && a)
                                            if (l = v.call(a), l != S || m.call(a, "toJSON")) "function" == typeof a.toJSON && (l != _ && l != k && l != E || m.call(a, "toJSON")) && (a = a.toJSON(e));
                                            else if (a > -1 / 0 && 1 / 0 > a) {
                                                if (L) {
                                                    for (u = I(a / 864e5), c = I(u / 365.2425) + 1970 - 1; L(c + 1, 0) <= u; c++);
                                                    for (d = I((u - L(c, 0)) / 30.42); L(c, d + 1) <= u; d++);
                                                    u = 1 + u - L(c, d), p = (a % 864e5 + 864e5) % 864e5, b = I(p / 36e5) % 24, C = I(p / 6e4) % 60, y = I(p / 1e3) % 60, w = p % 1e3
                                                } else c = a.getUTCFullYear(), d = a.getUTCMonth(), u = a.getUTCDate(), b = a.getUTCHours(), C = a.getUTCMinutes(), y = a.getUTCSeconds(), w = a.getUTCMilliseconds();
                                                a = (0 >= c || c >= 1e4 ? (0 > c ? "-" : "+") + B(6, 0 > c ? -c : c) : B(4, c)) + "-" + B(2, d + 1) + "-" + B(2, u) + "T" + B(2, b) + ":" + B(2, C) + ":" + B(2, y) + "." + B(3, w) + "Z"
                                            } else a = null;
                                        if (i && (a = i.call(t, e, a)), null === a) return "null";
                                        if (l = v.call(a), l == A) return "" + a;
                                        if (l == _) return a > -1 / 0 && 1 / 0 > a ? "" + a : "null";
                                        if (l == k) return M("" + a);
                                        if ("object" == typeof a) {
                                            for (F = s.length; F--;)
                                                if (s[F] === a) throw h();
                                            if (s.push(a), x = [], P = o, o += r, l == E) {
                                                for (T = 0, F = a.length; F > T; T++) D = R(T, a, i, n, r, o, s), x.push(D === f ? "null" : D);
                                                G = x.length ? r ? "[\n" + o + x.join(",\n" + o) + "\n" + P + "]" : "[" + x.join(",") + "]" : "[]"
                                            } else g(n || a, function(e) {
                                                var t = R(e, a, i, n, r, o, s);
                                                t !== f && x.push(M(e) + ":" + (r ? " " : "") + t)
                                            }), G = x.length ? r ? "{\n" + o + x.join(",\n" + o) + "\n" + P + "}" : "{" + x.join(",") + "}" : "{}";
                                            return s.pop(), G
                                        }
                                    };
                                t.stringify = function(e, t, i) {
                                    var n, r, o, a;
                                    if (s[typeof t] && t)
                                        if ((a = v.call(t)) == w) r = t;
                                        else if (a == E) {
                                            o = {};
                                            for (var l, c = 0, d = t.length; d > c; l = t[c++], a = v.call(l), (a == k || a == _) && (o[l] = 1));
                                        }
                                    if (i)
                                        if ((a = v.call(i)) == _) {
                                            if ((i -= i % 1) > 0)
                                                for (n = "", i > 10 && (i = 10); n.length < i; n += " ");
                                        } else a == k && (n = i.length <= 10 ? i : i.slice(0, 10));
                                    return R("", (l = {}, l[""] = e, l), r, o, n, "", [])
                                }
                            }
                            if (!i("json-parse")) {
                                var G, N, U = o.fromCharCode,
                                    $ = {
                                        92: "\\",
                                        34: '"',
                                        47: "/",
                                        98: "\b",
                                        116: "  ",
                                        110: "\n",
                                        102: "\f",
                                        114: "\r"
                                    },
                                    O = function() {
                                        throw G = N = null, d()
                                    },
                                    W = function() {
                                        for (var e, t, i, n, r, o = N, s = o.length; s > G;) switch (r = o.charCodeAt(G)) {
                                            case 9:
                                            case 10:
                                            case 13:
                                            case 32:
                                                G++;
                                                break;
                                            case 123:
                                            case 125:
                                            case 91:
                                            case 93:
                                            case 58:
                                            case 44:
                                                return e = x ? o.charAt(G) : o[G], G++, e;
                                            case 34:
                                                for (e = "@", G++; s > G;)
                                                    if (r = o.charCodeAt(G), 32 > r) O();
                                                    else if (92 == r) switch (r = o.charCodeAt(++G)) {
                                                        case 92:
                                                        case 34:
                                                        case 47:
                                                        case 98:
                                                        case 116:
                                                        case 110:
                                                        case 102:
                                                        case 114:
                                                            e += $[r], G++;
                                                            break;
                                                        case 117:
                                                            for (t = ++G, i = G + 4; i > G; G++) r = o.charCodeAt(G), r >= 48 && 57 >= r || r >= 97 && 102 >= r || r >= 65 && 70 >= r || O();
                                                            e += U("0x" + o.slice(t, G));
                                                            break;
                                                        default:
                                                            O()
                                                    } else {
                                                        if (34 == r) break;
                                                        for (r = o.charCodeAt(G), t = G; r >= 32 && 92 != r && 34 != r;) r = o.charCodeAt(++G);
                                                        e += o.slice(t, G)
                                                    }
                                                if (34 == o.charCodeAt(G)) return G++, e;
                                                O();
                                            default:
                                                if (t = G, 45 == r && (n = !0, r = o.charCodeAt(++G)), r >= 48 && 57 >= r) {
                                                    for (48 == r && (r = o.charCodeAt(G + 1), r >= 48 && 57 >= r) && O(), n = !1; s > G && (r = o.charCodeAt(G), r >= 48 && 57 >= r); G++);
                                                    if (46 == o.charCodeAt(G)) {
                                                        for (i = ++G; s > i && (r = o.charCodeAt(i), r >= 48 && 57 >= r); i++);
                                                        i == G && O(), G = i
                                                    }
                                                    if (r = o.charCodeAt(G), 101 == r || 69 == r) {
                                                        for (r = o.charCodeAt(++G), (43 == r || 45 == r) && G++, i = G; s > i && (r = o.charCodeAt(i), r >= 48 && 57 >= r); i++);
                                                        i == G && O(), G = i
                                                    }
                                                    return +o.slice(t, G)
                                                }
                                                if (n && O(), "true" == o.slice(G, G + 4)) return G += 4, !0;
                                                if ("false" == o.slice(G, G + 5)) return G += 5, !1;
                                                if ("null" == o.slice(G, G + 4)) return G += 4, null;
                                                O()
                                        }
                                        return "$"
                                    },
                                    z = function(e) {
                                        var t, i;
                                        if ("$" == e && O(), "string" == typeof e) {
                                            if ("@" == (x ? e.charAt(0) : e[0])) return e.slice(1);
                                            if ("[" == e) {
                                                for (t = []; e = W(), "]" != e; i || (i = !0)) i && ("," == e ? (e = W(), "]" == e && O()) : O()), "," == e && O(), t.push(z(e));
                                                return t
                                            }
                                            if ("{" == e) {
                                                for (t = {}; e = W(), "}" != e; i || (i = !0)) i && ("," == e ? (e = W(), "}" == e && O()) : O()), ("," == e || "string" != typeof e || "@" != (x ? e.charAt(0) : e[0]) || ":" != W()) && O(), t[e.slice(1)] = z(W());
                                                return t
                                            }
                                            O()
                                        }
                                        return e
                                    },
                                    H = function(e, t, i) {
                                        var n = V(e, t, i);
                                        n === f ? delete e[t] : e[t] = n
                                    },
                                    V = function(e, t, i) {
                                        var n, r = e[t];
                                        if ("object" == typeof r && r)
                                            if (v.call(r) == E)
                                                for (n = r.length; n--;) H(r, n, i);
                                            else g(r, function(e) {
                                                H(r, e, i)
                                            });
                                        return i.call(e, t, r)
                                    };
                                t.parse = function(e, t) {
                                    var i, n;
                                    return G = 0, N = "" + e, i = z(W()), "$" != W() && O(), G = N = null, t && v.call(t) == w ? V((n = {}, n[""] = i, n), "", t) : i
                                }
                            }
                        }
                        return t.runInContext = r, t
                    }
                    var o = "function" == typeof e && e.amd,
                        s = {
                            "function": !0,
                            object: !0
                        },
                        a = s[typeof n] && n && !n.nodeType && n,
                        l = s[typeof window] && window || this,
                        c = a && s[typeof i] && i && !i.nodeType && "object" == typeof t && t;
                    if (!c || c.global !== c && c.window !== c && c.self !== c || (l = c), a && !o) r(l, a);
                    else {
                        var d = l.JSON,
                            h = l.JSON3,
                            u = !1,
                            p = r(l, l.JSON3 = {
                                noConflict: function() {
                                    return u || (u = !0, l.JSON = d, l.JSON3 = h, d = h = null), p
                                }
                            });
                        l.JSON = {
                            parse: p.parse,
                            stringify: p.stringify
                        }
                    }
                    o && e(function() {
                        return p
                    })
                }).call(this)
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {})
        }, {}],
        51: [function(e, t) {
            function i(e, t) {
                var i = [];
                t = t || 0;
                for (var n = t || 0; n < e.length; n++) i[n - t] = e[n];
                return i
            }
            t.exports = i
        }, {}]
    }, {}, [31])(31)
});

module.exports = { socketIo };

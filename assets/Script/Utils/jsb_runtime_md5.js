!function (n) { var t = {}; function r(e) { if (t[e]) return t[e].exports; var o = t[e] = { i: e, l: !1, exports: {} }; return n[e].call(o.exports, o, o.exports, r), o.l = !0, o.exports } r.m = n, r.c = t, r.d = function (n, t, e) { r.o(n, t) || Object.defineProperty(n, t, { enumerable: !0, get: e }) }, r.r = function (n) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 }) }, r.t = function (n, t) { if (1 & t && (n = r(n)), 8 & t) return n; if (4 & t && "object" == typeof n && n && n.__esModule) return n; var e = Object.create(null); if (r.r(e), Object.defineProperty(e, "default", { enumerable: !0, value: n }), 2 & t && "string" != typeof n) for (var o in n) r.d(e, o, function (t) { return n[t] }.bind(null, o)); return e }, r.n = function (n) { var t = n && n.__esModule ? function () { return n.default } : function () { return n }; return r.d(t, "a", t), t }, r.o = function (n, t) { return Object.prototype.hasOwnProperty.call(n, t) }, r.p = "", r(r.s = 0) }([function (n, t) { window.jsbMd56 = function (n) { function t(n, t, r) { return n & t | ~n & r } function r(n, t, r) { return r & n | ~r & t } function e(n, t, r) { return n ^ t ^ r } function o(n, t, r) { return t ^ (n | ~r) } function u(n, t) { return n[t + 3] << 24 | n[t + 2] << 16 | n[t + 1] << 8 | n[t] } if (!n instanceof Uint8Array) return function (n) { try { console.log(n) } catch (n) { } }("input data type mismatch only support Uint8Array"), null; for (var i = [], f = 0; f < n.byteLength; f++)i.push(n[f]); var c = i.length; i.push(128); var a = i.length % 64; if (a > 56) { for (f = 0; f < 64 - a; f++)i.push(0); a = i.length % 64 } for (f = 0; f < 56 - a; f++)i.push(0); i = i.concat(function (n) { for (var t = [], r = 0; r < 8; r++)t.push(255 & n), n >>>= 8; return t }(8 * c)); var l = 1732584193, s = 4023233417, p = 2562383102, d = 271733878, b = 0, y = 0, v = 0, g = 0; function h(n, t) { return 4294967295 & n + t } var j = function (n, t, r, e) { var o, u, i = g; g = v, v = y, y = h(y, (o = h(b, h(n, h(t, r)))) << (u = e) & 4294967295 | o >>> 32 - u), b = i }; for (f = 0; f < i.length / 64; f++) { b = l; var m = 64 * f; j(t(y = s, v = p, g = d), 3614090360, u(i, m), 7), j(t(y, v, g), 3905402710, u(i, m + 4), 12), j(t(y, v, g), 606105819, u(i, m + 8), 17), j(t(y, v, g), 3250441966, u(i, m + 12), 22), j(t(y, v, g), 4118548399, u(i, m + 16), 7), j(t(y, v, g), 1200080426, u(i, m + 20), 12), j(t(y, v, g), 2821735955, u(i, m + 24), 17), j(t(y, v, g), 4249261313, u(i, m + 28), 22), j(t(y, v, g), 1770035416, u(i, m + 32), 7), j(t(y, v, g), 2336552879, u(i, m + 36), 12), j(t(y, v, g), 4294925233, u(i, m + 40), 17), j(t(y, v, g), 2304563134, u(i, m + 44), 22), j(t(y, v, g), 1804603682, u(i, m + 48), 7), j(t(y, v, g), 4254626195, u(i, m + 52), 12), j(t(y, v, g), 2792965006, u(i, m + 56), 17), j(t(y, v, g), 1236535329, u(i, m + 60), 22), j(r(y, v, g), 4129170786, u(i, m + 4), 5), j(r(y, v, g), 3225465664, u(i, m + 24), 9), j(r(y, v, g), 643717713, u(i, m + 44), 14), j(r(y, v, g), 3921069994, u(i, m), 20), j(r(y, v, g), 3593408605, u(i, m + 20), 5), j(r(y, v, g), 38016083, u(i, m + 40), 9), j(r(y, v, g), 3634488961, u(i, m + 60), 14), j(r(y, v, g), 3889429448, u(i, m + 16), 20), j(r(y, v, g), 568446438, u(i, m + 36), 5), j(r(y, v, g), 3275163606, u(i, m + 56), 9), j(r(y, v, g), 4107603335, u(i, m + 12), 14), j(r(y, v, g), 1163531501, u(i, m + 32), 20), j(r(y, v, g), 2850285829, u(i, m + 52), 5), j(r(y, v, g), 4243563512, u(i, m + 8), 9), j(r(y, v, g), 1735328473, u(i, m + 28), 14), j(r(y, v, g), 2368359562, u(i, m + 48), 20), j(e(y, v, g), 4294588738, u(i, m + 20), 4), j(e(y, v, g), 2272392833, u(i, m + 32), 11), j(e(y, v, g), 1839030562, u(i, m + 44), 16), j(e(y, v, g), 4259657740, u(i, m + 56), 23), j(e(y, v, g), 2763975236, u(i, m + 4), 4), j(e(y, v, g), 1272893353, u(i, m + 16), 11), j(e(y, v, g), 4139469664, u(i, m + 28), 16), j(e(y, v, g), 3200236656, u(i, m + 40), 23), j(e(y, v, g), 681279174, u(i, m + 52), 4), j(e(y, v, g), 3936430074, u(i, m), 11), j(e(y, v, g), 3572445317, u(i, m + 12), 16), j(e(y, v, g), 76029189, u(i, m + 24), 23), j(e(y, v, g), 3654602809, u(i, m + 36), 4), j(e(y, v, g), 3873151461, u(i, m + 48), 11), j(e(y, v, g), 530742520, u(i, m + 60), 16), j(e(y, v, g), 3299628645, u(i, m + 8), 23), j(o(y, v, g), 4096336452, u(i, m), 6), j(o(y, v, g), 1126891415, u(i, m + 28), 10), j(o(y, v, g), 2878612391, u(i, m + 56), 15), j(o(y, v, g), 4237533241, u(i, m + 20), 21), j(o(y, v, g), 1700485571, u(i, m + 48), 6), j(o(y, v, g), 2399980690, u(i, m + 12), 10), j(o(y, v, g), 4293915773, u(i, m + 40), 15), j(o(y, v, g), 2240044497, u(i, m + 4), 21), j(o(y, v, g), 1873313359, u(i, m + 32), 6), j(o(y, v, g), 4264355552, u(i, m + 60), 10), j(o(y, v, g), 2734768916, u(i, m + 24), 15), j(o(y, v, g), 1309151649, u(i, m + 52), 21), j(o(y, v, g), 4149444226, u(i, m + 16), 6), j(o(y, v, g), 3174756917, u(i, m + 44), 10), j(o(y, v, g), 718787259, u(i, m + 8), 15), j(o(y, v, g), 3951481745, u(i, m + 36), 21), l = h(l, b), s = h(s, y), p = h(p, v), d = h(d, g) } return function (n, t, r, e) { for (var o, u, i, f = "", c = 0, a = 0, l = 3; l >= 0; l--)c = 255 & (a = arguments[l]), c <<= 8, c |= 255 & (a >>>= 8), c <<= 8, c |= 255 & (a >>>= 8), c <<= 8, f += (u = ((o = c |= a >>>= 8) >>> 24).toString(16), i = (16777215 & o).toString(16), "00".substr(0, 2 - u.length) + u + "000000".substr(0, 6 - i.length) + i); return f }(d, p, s, l).toLowerCase() }, n.exports = window.jsbMd56 }]);
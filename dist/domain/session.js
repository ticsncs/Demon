"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSession = exports.getSession = exports.createSession = void 0;
var crypto_1 = __importDefault(require("crypto"));
var sessions = [];
function createSession(userId) {
    var session = {
        id: crypto_1.default.randomBytes(16).toString('hex'),
        userId: userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours
    };
    sessions.push(session);
    return session;
}
exports.createSession = createSession;
function getSession(sessionId) {
    return sessions.find(function (session) { return session.id === sessionId && session.expiresAt > new Date(); });
}
exports.getSession = getSession;
function deleteSession(sessionId) {
    var index = sessions.findIndex(function (session) { return session.id === sessionId; });
    if (index !== -1) {
        sessions.splice(index, 1);
    }
}
exports.deleteSession = deleteSession;
//# sourceMappingURL=session.js.map
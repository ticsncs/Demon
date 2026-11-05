"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var database_1 = require("../db/database");
var crypto_1 = __importDefault(require("crypto"));
var router = (0, express_1.Router)();
// Obtener un servicio por nombre
router.get('/services/name/:name', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, service, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params.name;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, database_1.db.get('SELECT id, name, url, token FROM services WHERE name = ?', name)];
            case 2:
                service = _a.sent();
                if (!service) {
                    return [2 /*return*/, res.status(404).json({ error: 'Service not found' })];
                }
                res.json(service);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error('[API] Error al obtener servicio por nombre:', err_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Obtener un servicio por id (incluye token)
router.get('/services/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, service, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, database_1.db.get('SELECT id, name, url, token FROM services WHERE id = ?', id)];
            case 2:
                service = _a.sent();
                if (!service) {
                    return [2 /*return*/, res.status(404).json({ error: 'Service not found' })];
                }
                res.json(service);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error('[API] Error al obtener servicio:', err_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Actualizar un servicio existente
router.put('/services/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, url, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, name = _a.name, url = _a.url;
                if (!name || !url) {
                    return [2 /*return*/, res.status(400).json({ error: 'Name and url are required' })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, database_1.db.run('UPDATE services SET name = ?, url = ? WHERE id = ?', name, url, id)];
            case 2:
                result = _b.sent();
                if (result.changes === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'Service not found' })];
                }
                res.json({ id: id, name: name, url: url });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                if (err_3.code === 'SQLITE_CONSTRAINT') {
                    return [2 /*return*/, res.status(409).json({ error: 'Service name already exists' })];
                }
                console.error('[API] Error al actualizar servicio:', err_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Listar todos los servicios
router.get('/services', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var services, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_1.db.all('SELECT id, name, url FROM services')];
            case 1:
                services = _a.sent();
                res.json(services);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.error('[API] Error al listar servicios:', err_4);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Listar todos los servicios
router.get('/services', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var services, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_1.db.all('SELECT id, name, url FROM services')];
            case 1:
                services = _a.sent();
                res.json(services);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.error('[API] Error al listar servicios:', err_5);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/services', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, url, token, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, url = _a.url;
                if (!name || !url) {
                    return [2 /*return*/, res.status(400).json({ error: 'Name and url are required' })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                token = crypto_1.default.randomBytes(32).toString('hex');
                // Guardar en la base de datos
                return [4 /*yield*/, database_1.db.run('INSERT INTO services (name, url, token) VALUES (?, ?, ?)', name, url, token)];
            case 2:
                // Guardar en la base de datos
                _b.sent();
                res.status(201).json({ name: name, url: url, token: token });
                return [3 /*break*/, 4];
            case 3:
                err_6 = _b.sent();
                if (err_6.code === 'SQLITE_CONSTRAINT') {
                    return [2 /*return*/, res.status(409).json({ error: 'Service name already exists' })];
                }
                console.error('[API] Error al crear servicio:', err_6);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/config', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceName, authHeader, token, service, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                serviceName = req.body.service;
                authHeader = req.headers.authorization;
                if (!serviceName || !authHeader) {
                    return [2 /*return*/, res.status(400).json({ error: 'Service name and token are required' })];
                }
                token = authHeader.split(' ')[1];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, database_1.db.get('SELECT * FROM services WHERE name = ?', serviceName)];
            case 2:
                service = _a.sent();
                if (!service) {
                    return [2 /*return*/, res.status(404).json({ error: 'Service not found' })];
                }
                if (token !== service.token) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid token' })];
                }
                res.json({ url: service.url });
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                console.error(err_7);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=api.js.map
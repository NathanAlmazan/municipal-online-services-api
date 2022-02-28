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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrors_1 = __importDefault(require("../../../globalErrors"));
const zoningBounderies_1 = __importDefault(require("../InitialData/zoningBounderies"));
const zoneModel_1 = __importDefault(require("../models/zoneModel"));
const zoneModel = new zoneModel_1.default();
class Zoning {
    getZoneClassByLocation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const street = req.body.street;
            const barangay = req.body.barangay;
            if (!street || !barangay) {
                const nullArgumentError = new globalErrors_1.default.NullArgumentError("Incomplete arguments.");
                return next(nullArgumentError);
            }
            try {
                const zoneBoundary = yield zoneModel.getZoneByLocation(street, barangay);
                if (!zoneBoundary) {
                    const notFoundError = new globalErrors_1.default.NotFoundError("Cannot classify location.");
                    return next(notFoundError);
                }
                const businessTypes = yield zoneModel.getBusinessTypesByZone(zoneBoundary.zoneId);
                return res.status(200).json({
                    zone: zoneBoundary.zone,
                    overlay: zoneBoundary.zoneOverlay,
                    businessTypes: businessTypes
                });
            }
            catch (error) {
                const internalError = new globalErrors_1.default.InternalError(error.message);
                return next(internalError);
            }
        });
    }
    initializeRecord(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let x = 0; x < zoningBounderies_1.default.length; x++) {
                    const zoneClass = yield zoneModel.getZoneClassByCode(zoningBounderies_1.default[x]["ZONE CODE"]);
                    if (zoneClass) {
                        yield zoneModel.createZoneBoundary(zoneClass.zoneId, 1, zoningBounderies_1.default[x].STREET, zoningBounderies_1.default[x].BARANGAY);
                    }
                }
                return res.status(201).json({ message: "Initialized database successfully." });
            }
            catch (error) {
                const internalError = new globalErrors_1.default.InternalError(error.message);
                return next(internalError);
            }
        });
    }
}
exports.default = Zoning;
//# sourceMappingURL=zoning.js.map
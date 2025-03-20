"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.sendATRRequest = sendATRRequest;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs = __importStar(require("fs"));
function sendATRRequest(url_1, imagePath_1, models_1) {
    return __awaiter(this, arguments, void 0, function* (url, imagePath, models, additionalFields = {}) {
        // Create FormData instance
        const formData = new form_data_1.default();
        // Add image file
        formData.append('image', fs.createReadStream(imagePath));
        // Add model selections
        formData.append('line_segmentation_model', models.lineSegmentationModel);
        formData.append('text_recognition_model', models.textRecognitionModel);
        // Add any additional fields
        Object.entries(additionalFields).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });
        try {
            // Send the request
            const response = yield axios_1.default.post(url, formData, {
                headers: Object.assign({}, formData.getHeaders())
            });
            // Store both the original and current version
            const originalResponse = JSON.parse(JSON.stringify(response.data));
            let currentResponse = JSON.parse(JSON.stringify(response.data));
            return {
                original: originalResponse,
                current: currentResponse,
                // Helper function to revert to original
                revertToOriginal: () => {
                    currentResponse = JSON.parse(JSON.stringify(originalResponse));
                    return currentResponse;
                },
                // Helper function to modify the current response
                updateResponse: (transformer) => {
                    currentResponse = transformer(JSON.parse(JSON.stringify(currentResponse)));
                    return currentResponse;
                }
            };
        }
        catch (error) {
            console.error('Error:', error);
            throw error;
        }
    });
}

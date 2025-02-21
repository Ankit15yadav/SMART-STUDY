"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaCall = prismaCall;
const prisma_1 = __importDefault(require("./prisma"));
async function prismaCall() {
    try {
        const users = await prisma_1.default.user.findMany();
        return users;
    }
    catch (error) {
        console.error("Database fetch error:", error);
        return [];
    }
}

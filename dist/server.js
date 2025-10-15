"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = +process.env.PORT;
app.use(express_1.default.json());
app.use('/api/users', userRoutes_1.default);
app.get("/", function (_req, res) {
    res.send("Hello World!");
});
app.listen(port, function () {
    console.log(`starting app on: ${port}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map
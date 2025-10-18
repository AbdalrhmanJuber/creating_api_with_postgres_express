"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = +process.env.PORT;
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    console.log("Raw body:", req.body);
    next();
});
app.use(apiLimiter);
app.use("/api/users", userRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.get("/", function (_req, res) {
    res.send("Hello World!");
});
app.listen(port, function () {
    console.log(`starting app on: ${port}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map
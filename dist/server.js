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
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const errorHandler_1 = require("./middlewares/errorHandler");
const constants_1 = require("./config/constants");
dotenv_1.default.config();
// Validate environment variables on startup
(0, env_1.validateEnv)();
const app = (0, express_1.default)();
const port = +process.env.PORT;
if (process.env.NODE_ENV !== "test") {
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: constants_1.RATE_LIMIT.WINDOW_MS,
        max: constants_1.RATE_LIMIT.MAX_REQUESTS,
    });
    app.use(limiter);
}
app.use(express_1.default.json());
app.use("/api/users", userRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.get("/", function (_req, res) {
    res.send("Hello World!");
});
// Error handler middleware (must be last)
app.use(errorHandler_1.errorHandler);
// Connect to database and start server
if (process.env.NODE_ENV !== "test") {
    (0, database_1.connectDB)().then(() => {
        app.listen(port, function () {
            console.log(`🚀 Server started on port: ${port}`);
        });
    });
}
else {
    app.listen(port, function () {
        console.log(`🧪 Test server started on port: ${port}`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map
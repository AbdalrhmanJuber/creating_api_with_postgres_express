"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const errorHandler_1 = require("./middlewares/errorHandler");
const morgan_1 = __importDefault(require("morgan"));
const rateLimits_1 = require("./config/rateLimits");
dotenv_1.default.config();
// Validate environment variables on startup
(0, env_1.validateEnv)();
const app = (0, express_1.default)();
const port = +process.env.PORT;
app.use(rateLimits_1.apiRateLimit);
app.use(express_1.default.json());
const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use((0, morgan_1.default)(logFormat));
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
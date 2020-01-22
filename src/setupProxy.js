const proxy = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        proxy("/v1/ticker/ethereum/", {
            target: "api.coinmarketcap.com",
            changeOrigin: true
        })
    );
};

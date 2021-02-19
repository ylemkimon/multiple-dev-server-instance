const webpack = require('webpack');
const Server = require('webpack-dev-server');

const config = require('./webpack.config');
const host = 'localhost';
const port = 8080;

let server1, server2;

let readyCount = 0;
const ready = () => {
    readyCount += 1;
    if (readyCount === 2) {
        startSecondServer();
    }
};

const startSecondServer = () => {
    server1.close(() => {
        server2 = new Server(compiler, {
            hot: false,
            port,
        });
        server2.listen(port, host, () => {
            console.log("Listening on the second server");
        });
    });
}

const compiler = webpack(config);
compiler.hooks.done.tap('done', ready);

server1 = new Server(compiler, {
    hot: false,
    port,
});
server1.listen(port, host, () => {
    console.log("Listening on the first server");
    ready();
});

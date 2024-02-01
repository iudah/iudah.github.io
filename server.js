const http = require("http");
const url = require("url");
const fs = require("fs");
const resolve = require("path");
const mysql = require("mysql");
const mime_types = require("mime-types");
let mime;
import("mime").then((mime_) => {
    mime = mime_;


    main();
});

function main() {
    const server = create_server();
    server.on('error', (err) => { throw err; });
    console.log("Server is created\n");
    console.log("Server listening\n");
    server.listen(7777, "0.0.0.0");
}


function create_server() {
    return http.createServer(server_worker);
}

function server_worker(request, response) {
    const home = __dirname;
    const query = url.parse(request.url, true);
    const file_url = resolve.join(home, (query.pathname === '/' ? '/index.html' : query.pathname));


    if (query.search === null) {
        fs.readFile(file_url, (err, data) => {
            if (err) {
                console.log(err);
                respond(response, 404, "file not found", 'text/txt');
            } else {
                respond(response, 200, data, mime_types.lookup(file_url));
            }
        });
    }

    if (query.pathname === "/check_recency") {
        const path = query.query.path === '' ? "index.html" : query.query.path;

        if (path !== undefined) {
            fs.stat(path, (err, stats) => {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(`client requesting file update for '${path}'`);

                    respond(response, 200, `${stats.mtimeMs}`, 'text/txt');
                }
            });
        }
    }

    if (query.query.article_day !== undefined) {
        const day = query.query.article_day;
        //console.log(`client requesting file update for '${file_url}'`);
        console.log(resolve.join(file_url, `${day}.html`));
        respond(response, 200, resolve.join(file_url, `${day}.html`), 'text/txt');
    }
}

function respond(response, code, data, mime) {
    response.writeHead(code, { "Content-Type": mime });
    response.write(data);
    response.end();
}
import http from "http";
import {promises as fs} from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);


const server = http.createServer(async (req, res)=>{
    try {
        if (req.method === "GET") {
            const raw = await fs.readFile(path.join(dirname,"input.txt"),"utf8")
            if (!raw) {
                res.statusCode = 400;
                res.end("File is Empty");
            }
            res.statusCode = 200;
            res.end(raw.toString());
        }
        if (req.method === "POST") {
            let body = "";
            for await (const chunk of req){
                body += chunk;
            }
            if (!body) {
                res.statusCode = 400;
                res.end("No body");
            }
            await fs.writeFile(path.join(dirname,"output.txt"), body, "utf-8")
            res.statusCode = 201;
            res.end(body);
        }
    } catch (error) {
        res.statusCode = 500;
        res.end("Internal Server");
        console.log("Error: "+error.message);   
    }
})

server.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})
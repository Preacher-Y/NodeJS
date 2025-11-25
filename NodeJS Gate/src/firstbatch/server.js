import http from 'http'
import {promises as fs} from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'user.json');

const server = http.createServer(async (req, res) => {
    try {
        if(req.method ==="GET"){
            const raw =await fs.readFile(DATA_FILE,'utf-8');
            const data = raw? JSON.parse(raw):[]
            res.writeHead(200, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(data, null,2))
        }
        if(req.method ==="POST"){
            let body =''
            for await(const chunk of req){
                body+=chunk
            }

            if(!body){
                res.writeHead(400, {'Content-Type': 'application/json'})
                return res.end(JSON.stringify({message:"Body is required"}))
            }

            let payload
            try {
                payload=JSON.parse(body)
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'})
                return res.end(JSON.stringify({message:"Body should be a valid json"}))
            }
            const { id, name, age, email } = payload
            if(!id || !name || !age || !email){
                res.writeHead(400, {'Content-Type': 'application/json'})
                return res.end(JSON.stringify({message:"All fields are required"}))
            }
            const raw =await fs.readFile(DATA_FILE, 'utf-8');
            const data = raw ? JSON.parse(raw) : []
            data.push(payload)
            await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
            res.writeHead(201, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(payload))
            
        }else {
            res.writeHead(405, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify({message:"Method not allowed"}))
        }
    } catch (error) {
        console.log(error)
        res.writeHead(500, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify({message:"Internal server error"}))
    }
        
})


server.listen(3100,()=>console.log(`Server is running on port 3000`))
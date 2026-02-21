import * as api from './api';
import * as db from '../db/db';

const port: number = 8081;
const host: string = "127.0.0.1";

const server: api.API = new api.API(host, port);

async function makeid(length: number): Promise<string> {  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    let result: string = '';
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;
    let counter: number = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

async function retokenize(req: api.APIRequest): Promise<(string|null)> {
	var tmp;
	if (req.data != null && !("username" in req.data) || !("token" in req.data)) {
		return null;
	} else {
		tmp = await db.query("SELECT * FROM accounts WHERE id=? AND token=?", [req.data["username"], req.data["token"]]);
		if (tmp.toString() == [].toString()) {
			return null;
		} else {  // Can add a third case for timeout here
			await db.query("UPDATE tickets SET owner=NULL WHERE id=?", [req.data["id"]]);
			const token: string = await makeid(100);
			const token_valid: Date = new Date();
			tmp = await db.query("UPDATE accounts SET token=?, token_validity=? WHERE id=?", [token, token_valid, req.data["username"]]);
			return token;
		}
	}
}

server.get("/version", async (req: api.APIRequest, rep: api.APIResponse) => {
    rep.send({"version": "1.0.0"});
});

server.post("/ping", async (req: api.APIRequest, rep: api.APIResponse) => {
    rep.send({"data": req.data});
});

server.run()

console.log("Server started");

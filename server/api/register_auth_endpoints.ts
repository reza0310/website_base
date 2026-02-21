//import * as bcrypt from 'bcrypt';
import * as api from './api';
import * as db from '../db/db';
import * as auth from 'base_shared/auth/auth';


export function register_auth_endpoints(server: api.API) {
    server.post("/register", async (req: api.APIRequest, rep: api.APIResponse) => {
        var tmp;
        if (req.data != null && (!("username" in req.data) || !("password" in req.data))) {
            rep.send({"result": "INVALID REQUEST ERROR"});
        } else {
            tmp = await db.query("SELECT * FROM accounts WHERE id=?", [req.data["username"]]);
            if (tmp.toString() == [].toString()) {
                const hash: string = await bcrypt.hash(req.data["password"], 12);
                const token: string = await makeid(100);
                const token_valid: Date = new Date();
                tmp = await db.query("INSERT INTO accounts (id, digested_password_hash, role, token, token_validity) VALUES (?, ?, 1, ?, ?)", [req.data["username"], hash, token, token_valid]);
                rep.send({"result": "ACCOUNT CREATION SUCCESS", "id": req.data["username"], "token": token, "validity": token_valid});
            } else {
                console.log("Unable to create account ");
                rep.send({"result": "ACCOUNT ALREADY EXISTS ERROR"});
            }
        }
    });

    server.post("/check_connection", async (req: api.APIRequest, rep: api.APIResponse) => {
        var tmp;
        if (req.data != null && (!("id" in req.data) || !("token" in req.data))) {
            rep.send({"result": "INVALID REQUEST ERROR"});
        } else {
            tmp = await db.query("SELECT * FROM accounts WHERE id=? AND token=?", [req.data["id"], req.data["token"]]);
            if (tmp.toString() == [].toString()) {
                rep.send({"result": "NO"});
            } else {
                rep.send({"result": "YES"});
            }
        }
    });

    server.post("/connect", async (req: api.APIRequest, rep: api.APIResponse) => {
        var tmp;
        if (req.data != null && (!("username" in req.data) || !("password" in req.data))) {
            rep.send({"result": "INVALID REQUEST ERROR"});
        } else {
            tmp = await db.query("SELECT * FROM accounts WHERE id=?", [req.data["username"]]);
            if (tmp.toString() == [].toString()) {
                rep.send({"result": "ACCOUNT NOT FOUND"});
            } else {
                if (await bcrypt.compare(req.data["password"], tmp[0]["digested_password_hash"])) {
                    const token: string = await makeid(100);
                    const token_valid: Date = new Date();
                    tmp = await db.query("UPDATE accounts SET token=?, token_validity=? WHERE id=?", [token, token_valid, req.data["username"]]);
                    rep.send({"result": "CONNECTION SUCCESS", "id": req.data["username"], "token": token, "validity": token_valid});
                } else {
                    rep.send({"result": "BAD PASSWORD"});
                }
            }
        }
    });
}

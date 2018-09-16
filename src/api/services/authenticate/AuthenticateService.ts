import {RestService} from "../RestService";
import {Request, Response} from "restify";
import * as url from 'url';
import * as redis from 'redis';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const initConnection = () => {
    return new Promise((resolve, reject) => {
        const rtg   = url.parse(process.env.REDISTOGO_URL);
        const client = redis.createClient(rtg.port, rtg.hostname);
        client.auth(rtg.auth.split(":")[1]);

        client.on('connect', () => {
            resolve(client);
        });
        client.on('error', (err) => {
            reject(err);
        });
    });

};

const get = (client, userId: string) => {
    return new Promise((resolve, reject) => {
        client.get(userId, (err, reply) => {
            if (err) {
                reject(err);
            } else if (reply !== null) {
                resolve(reply.toString());
            } else {
                reject('User not found');
            }
        });
    });
};

const sign = (userId, hash, pwd) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pwd, hash, (err, res) => {
            if (res) {
                const user = {
                    user: userId,
                    password: hash
                };
                let token = jwt.sign(user, process.env.secret, {});
                resolve(token);
            } else {
                reject();
            }
        });
    });
};

async function getToken(userId: string, pwd: string) {
    let client = null;
    try {
        client = await initConnection();
        const hash = await get(client, userId);
        return await sign(userId, hash, pwd);
    } catch (error) {
        console.log(`error: ${error}`);
        return null;
    } finally {
        if (client !== null) {
            client.quit();
        }
    }
}

const authenticate : RestService = {
    execute: async (req: Request, res: Response) => {
        console.log(`user_id: ${req.body.user_id}`);
        getToken(req.body.user_id, req.body.password).then((result) => {
            if (result === null) {
                res.send(401);
            } else {
                console.log(`user ${req.body.user_id} authenticated`);
                res.send({
                    success: true,
                    token: result
                });
            }
        });
    }
};

export default authenticate;
import { Server } from 'restify';
import * as mongoose from 'mongoose';
import config from './db_config';

export default function (server: Server, port: any) {

    mongoose.connect(config.db.uri, { useNewUrlParser: true });

    const db = mongoose.connection;

    db.on('error', (err) => {
        console.error(err);
        process.exit(1);
    });

    db.once('open', () => {
        server.listen(port, () => {
            console.log('%s listening at %s', server.name, server.url);
        });
    });
}
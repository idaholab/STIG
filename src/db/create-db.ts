/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as OrientDB from 'orientjs';
import { StigDB } from './db';
import { schema, IOrientJSONClassOptions, ISchemaFile } from './schema';
import { IDatabaseConfigOptions } from 'storage/database-configuration-storage';

// export async function new_database(dbname: string, admin_user: string, admin_pass: string, db_user: string, db_pass: string, host: string, port?: number): Promise<[OrientDB.Server, OrientDB.Db]> {
export async function new_database(options: IDatabaseConfigOptions): Promise<[OrientDB.Server, OrientDB.Db]> {
    const server_port = options.port !== undefined ? options.port : 2424;

    let db;
    try {
        db = await StigDB.createDatabase(options)
        await db.createSession();
    } catch (e) {
        // error with something before we create classes,
        throw e;
    }

    for (const cls of schema.classes) {
        const resp = await db.createClassWithProperties(cls);
    }

    await alter_datetimeformat(db.ojs);
    await db.ojs.close();
    await db.ojs.close();
}
async function alter_datetimeformat(session: OrientDB.ODatabaseSession, datetime_format: string = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") {
    try {
        await session.exec(`ALTER DATABASE DATETIMEFORMAT "${datetime_format}"`);
    } catch (e) {}
}

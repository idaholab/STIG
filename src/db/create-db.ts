/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as OrientDB from 'orientjs';
import { schema, IOrientJSONClassOptions, ISchemaFile } from './schema';
import { IDatabaseConfigOptions } from 'storage/database-configuration-storage';

// export async function new_database(dbname: string, admin_user: string, admin_pass: string, db_user: string, db_pass: string, host: string, port?: number): Promise<[OrientDB.Server, OrientDB.Db]> {
export async function new_database(options: IDatabaseConfigOptions): Promise<[OrientDB.Server, OrientDB.Db]> {
    const server_port = options.port !== undefined ? options.port : 2424;

    let client;
    let session;
    let db_resp;
    try {
        client = await OrientDB.OrientDBClient.connect({
            host: options.host,
            port: parseInt(server_port),
        });

        db_resp = await client.existsDatabase({
            name: options.name,
            username: options.username,
            password: options.password,
        });

        // check if it exists and do something probably

        db_resp = await client.createDatabase({
            name: options.name,
            username: options.username,
            password: options.password,
            type: "graph",
            storage: "plocal",
        });

        session = await client.session({
            name: options.name,
            username: options.username,
            password: options.password,
        });
    } catch (e) {
        // error with something before we create classes,
        throw e;
    }

    for (const cls of schema.classes) {
        const resp = await create_class_with_properties(session, cls);
    }

    await alter_datetimeformat(session);
    await client.close();
    await session.close();
}
async function alter_datetimeformat(session: OrientDB.ODatabaseSession, datetime_format: string = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") {
    try {
        await session.exec(`ALTER DATABASE DATETIMEFORMAT "${datetime_format}"`);
    } catch (e) {}
}

async function create_class_with_properties(session: OrientDB.ODatabaseSession, cls: IOrientJSONClassOptions) {
    let alias;
    let name = cls.name;
    if (name.indexOf('-') > -1) {
        alias = name;
        name = name.replace(/-/g, "");
    }

    try {
        const obj = await session.class.create(name, cls.superClasses[0]);

        if (alias !== undefined) {
            alias = "`" + alias + "`";
            await session.exec(`ALTER CLASS ${name} SHORTNAME ${alias}`)
        }

        const propertiesCreated = await obj.property.create(cls.properties);
        return propertiesCreated;
    } catch (e) {
        // console.log("error creating class/property")
        throw e;
    }
}

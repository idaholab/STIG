/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as OrientDB from 'orientjs';
import { schema, IOrientJSONClassOptions } from './schema';
import { IDatabaseConfigOptions } from 'storage/database-configuration-storage';

// export async function new_database(dbname: string, admin_user: string, admin_pass: string, db_user: string, db_pass: string, host: string, port?: number): Promise<[OrientDB.Server, OrientDB.Db]> {
export async function new_database(options: IDatabaseConfigOptions): Promise<[OrientDB.Server, OrientDB.Db]> {
    const server_port = options.port !== undefined ? options.port : 2424;
    const server = OrientDB({
        host: options.host,
        port: server_port,
        username: options.admin_user,
        password: options.admin_password,
        useToken: true,
    });
    const db_config = {
        name: options.name,
        type: 'graph',
        storage: 'plocal',
        username: options.username,
        password: options.password,
        host: options.host,
    };
    try {
        const dbs = await server.list();
        const exists = dbs.findIndex((value: OrientDB.Db, _index: number, _obj: OrientDB.Db[]) => {
            return value.name === options.name;
        });
        if (exists !== -1) {
            server.close();
            alert(`Database with name ${name} already exists. Adding to configuration options.`);
            return [server, server.use(options.name)];
        }

        const db = await server.create(db_config);
        const ojs = new OrientDB.ODatabase(db_config);
        await create_classes(ojs);
        await ojs.exec(`ALTER DATABASE DATETIMEFORMAT "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"`);
        return [server, db];
    } catch (e) {
        server.close();
        throw e;
    }
}

async function class_query(db: OrientDB.ODatabase, options: IOrientJSONClassOptions): Promise<OrientDB.Class> {
    let name = options.name;
    const idx = name.indexOf('-');
    let alias: string;
    if (idx > -1) {
        alias = name;
        const replaced = name.replace(/-/g, '');
        name = replaced;
    }
    try {
        const exists = await db.class.get(name).suppressUnhandledRejections();
        if (exists !== undefined) {
            await db.class.drop(name);
        }
        // tslint:disable-next-line:no-empty
    } catch (e) { }
    const cls = await db.class.create(name, options.superClasses[0]);
    if (alias !== undefined) {
        alias = "`" + alias + "`";
        const query = `ALTER CLASS  ${name}  SHORTNAME ${alias}`;
        await db.exec(query);
    }
    return cls;
}

async function create_classes(db: OrientDB.ODatabase) {
    for (const cls of schema.classes) {
        const c = await class_query(db, cls);
        await create_properties(c, cls.properties);
    }
}

async function create_properties(cls: OrientDB.Class, props: OrientDB.PropertyCreateConfig[]): Promise<OrientDB.Property[]> {
    const created = await cls.property.create(props);
    return created;
}

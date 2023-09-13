import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export async function openDB(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    const db: Database<sqlite3.Database, sqlite3.Statement> = await open({
        filename: '/data/props.db',
        driver: sqlite3.Database
    });
    return db;
}

export async function query(db: Database, sqlQuery: string, params: Array<any>) {
    return await db.all(sqlQuery, params);
}

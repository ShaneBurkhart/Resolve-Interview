import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { promises as fs } from 'fs';
import { exec } from 'child_process';

const URL = "https://resolve-dev-public.s3.amazonaws.com/sample-data/interview/props.db";

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

export async function checkForDB(){
    try {
        await fs.access('/data/props.db');
        return true;
    } catch (error) {
        return false;
    }
}

export async function downloadDBAsync(){
    exec(`sleep 4 && wget -P /data ${URL} &`, (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
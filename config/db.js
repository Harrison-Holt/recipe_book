import mysql from 'mysql2/promise';

export default async function connect_database() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306,
        });

        console.log("Database connection established successfully");
        return { connection, connected: true };
    } catch (error) {
        console.error("Database connection failed: ", error);
        return { connection: null, connected: false, error: error.message };
    }
}

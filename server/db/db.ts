import * as mariadb from 'mariadb';

const pool = mariadb.createPool(); // TODO: import config

export async function query(query: string, args: any[]) {
	let conn;
	let res;
  
	conn = await pool.getConnection();  // Si erreur de co on veut qu'elle pop donc ça sert à rien de catch pour renvoyer
	try {
		res = await conn.query(query, args);
	} catch (err: any) {
		res = [err.sqlMessage!];
	}
	if (conn) conn.end();
	return res;
}
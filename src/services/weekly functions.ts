import client from "..";

export async function reset_partnerships() {
    const members = await client.sql.query('SELECT member_id FROM partnerships');

    for(const row of members.rows) {
        await client.sql.query('UPDATE partnerships SET weekly = 0 WHERE member_id = $1', [row.member_id]); 
    }
}

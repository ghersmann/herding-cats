import { sql } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const userFirstName = request.query.userFirstName as string;
    const userLastName = request.query.userLastName as string;
    if (!userFirstName || !userLastName) throw new Error('Names required');
    await sql`INSERT INTO users (firstname, lastname) VALUES (${userFirstName}, ${userLastName});`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const users = await sql`SELECT * FROM users;`;
  return response.status(200).json({ users });
}
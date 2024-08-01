import { sql } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const userFirstName = request.query.userFirstName as string;
    const userLastName = request.query.userLastName as string;
    const userAge = request.query.userAge as string;
    if (!userFirstName || !userLastName || !userAge) throw new Error('Stuff Required');
    await sql`INSERT INTO users (firstname, lastname, age) VALUES (${userFirstName}, ${userLastName}, ${userAge});`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const users = await sql`SELECT * FROM users;`;
  return response.status(200).json({ users });
}
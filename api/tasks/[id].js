import { createClient } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const client = createClient();
  await client.connect();

  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;
    const taskId = req.query.id;

    if (req.method === 'PUT') {
      // Update task
      const { title, description, status, scheduledDate, completedAt } = req.body;

      const result = await client.query(
        `UPDATE tasks SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          scheduled_date = COALESCE($4, scheduled_date),
          completed_at = COALESCE($5, completed_at)
        WHERE id = $6 AND user_id = $7
        RETURNING id, title, description, status, scheduled_date, created_at, completed_at, updated_at`,
        [title, description, status, scheduledDate, completedAt, taskId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(200).json(result.rows[0]);
    } else if (req.method === 'DELETE') {
      // Delete task
      const result = await client.query(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
        [taskId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Task operation error:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  } finally {
    await client.end();
  }
}

import { prisma } from '../../lib/prisma.js';
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

  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    if (req.method === 'GET') {
      // Get all tasks for the user
      const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      // Convert to API format
      const formattedTasks = tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        scheduled_date: task.scheduledDate ? task.scheduledDate.toISOString().split('T')[0] : null,
        created_at: task.createdAt.toISOString(),
        completed_at: task.completedAt ? task.completedAt.toISOString() : null,
        updated_at: task.updatedAt.toISOString(),
      }));

      res.status(200).json(formattedTasks);
    } else if (req.method === 'POST') {
      // Create a new task
      const { title, description, scheduledDate } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const task = await prisma.task.create({
        data: {
          userId,
          title,
          description: description || null,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
          status: 'pending',
        },
      });

      const formattedTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        scheduled_date: task.scheduledDate ? task.scheduledDate.toISOString().split('T')[0] : null,
        created_at: task.createdAt.toISOString(),
        completed_at: task.completedAt ? task.completedAt.toISOString() : null,
        updated_at: task.updatedAt.toISOString(),
      };

      res.status(201).json(formattedTask);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tasks error:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

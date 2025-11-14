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
    const taskId = parseInt(req.query.id);

    if (req.method === 'PUT') {
      // Update task
      const { title, description, status, scheduledDate, completedAt } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
      if (completedAt !== undefined) updateData.completedAt = completedAt ? new Date(completedAt) : null;

      const task = await prisma.task.updateMany({
        where: {
          id: taskId,
          userId: userId,
        },
        data: updateData,
      });

      if (task.count === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Fetch updated task
      const updatedTask = await prisma.task.findUnique({
        where: { id: taskId },
      });

      const formattedTask = {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        scheduled_date: updatedTask.scheduledDate ? updatedTask.scheduledDate.toISOString().split('T')[0] : null,
        created_at: updatedTask.createdAt.toISOString(),
        completed_at: updatedTask.completedAt ? updatedTask.completedAt.toISOString() : null,
        updated_at: updatedTask.updatedAt.toISOString(),
      };

      res.status(200).json(formattedTask);
    } else if (req.method === 'DELETE') {
      // Delete task
      const result = await prisma.task.deleteMany({
        where: {
          id: taskId,
          userId: userId,
        },
      });

      if (result.count === 0) {
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
  }
}

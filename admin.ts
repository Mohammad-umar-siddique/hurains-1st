/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import db from './db';
import { authenticateToken, requireAdmin, AuthenticatedRequest, logUserActivity } from './middleware';

const router = Router();

// Enforce protection middleware for all /api/admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// 1. GET /api/admin/users (supports optional ?search=...)
router.get('/users', ((req: AuthenticatedRequest, res: Response) => {
  const { search } = req.query;

  try {
    let users;
    if (typeof search === 'string' && search) {
      const getUsers = db.prepare(`
        SELECT id, name, email, role, avatar FROM users 
        WHERE name LIKE ? OR email LIKE ?
      `);
      users = getUsers.all(`%${search}%`, `%${search}%`);
    } else {
      const getUsers = db.prepare('SELECT id, name, email, role, avatar FROM users');
      users = getUsers.all();
    }
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal database users retrieval error.' });
  }
}) as RequestHandler);

// 2. GET /api/admin/users/:id
router.get('/users/:id', ((req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const getUser = db.prepare('SELECT id, name, email, role, avatar FROM users WHERE id = ?');
    const user = getUser.get(id);

    if (!user) {
      return res.status(404).json({ error: 'User record not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal database user retrieval error.' });
  }
}) as RequestHandler);

// 3. POST /api/admin/users (CREATE user)
router.post('/users', ((req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, role, avatar } = req.body;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string' || !name || !email || !password || !role) {
    return res.status(400).json({ error: 'Incomplete user record details.' });
  }

  try {
    const checkUser = db.prepare('SELECT id FROM users WHERE email = ?');
    if (checkUser.get(email)) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userId = 'usr-' + Math.random().toString(36).substring(2, 9);
    const userAvatar = avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400';

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(userId, name, email, hashedPassword, role, userAvatar);

    if (req.user) {
      logUserActivity(req.user.id, `Admin Created User: ${email}`);
    }

    res.status(201).json({
      id: userId,
      name,
      email,
      role,
      avatar: userAvatar
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal database user creation error.' });
  }
}) as RequestHandler);

// Helper for Update User
const handleUpdateUser = (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, role, password, avatar } = req.body;

  try {
    const checkUser = db.prepare('SELECT * FROM users WHERE id = ?');
    const existingUser: any = checkUser.get(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    if (typeof email === 'string' && email !== existingUser.email) {
      const emailConflict = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
      if (emailConflict) {
        return res.status(400).json({ error: 'Email already in use by another account.' });
      }
    }

    const updatedName = typeof name === 'string' ? name : existingUser.name;
    const updatedEmail = typeof email === 'string' ? email : existingUser.email;
    const updatedRole = typeof role === 'string' ? role : existingUser.role;
    const updatedAvatar = typeof avatar === 'string' ? avatar : existingUser.avatar;

    let updatedPassword = existingUser.password;
    if (typeof password === 'string' && password) {
      const salt = bcrypt.genSaltSync(10);
      updatedPassword = bcrypt.hashSync(password, salt);
    }

    const updateUser = db.prepare(`
      UPDATE users 
      SET name = ?, email = ?, role = ?, password = ?, avatar = ?
      WHERE id = ?
    `);
    updateUser.run(updatedName, updatedEmail, updatedRole, updatedPassword, updatedAvatar, id);

    if (req.user) {
      logUserActivity(req.user.id, `Admin Updated User: ${updatedEmail}`);
    }

    res.json({
      id,
      name: updatedName,
      email: updatedEmail,
      role: updatedRole,
      avatar: updatedAvatar
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal database user update error.' });
  }
};

// 4. PUT & PATCH /api/admin/users/:id (UPDATE user)
router.put('/users/:id', (handleUpdateUser as unknown) as RequestHandler);
router.patch('/users/:id', (handleUpdateUser as unknown) as RequestHandler);

// 5. DELETE /api/admin/users/:id
router.delete('/users/:id', ((req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const checkUser = db.prepare('SELECT email FROM users WHERE id = ?');
    const user: any = checkUser.get(id);
    if (!user) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    if (req.user && id === req.user.id) {
      return res.status(400).json({ error: 'Deleting own administrative account is prohibited.' });
    }

    const deleteUser = db.prepare('DELETE FROM users WHERE id = ?');
    deleteUser.run(id);

    if (req.user) {
      logUserActivity(req.user.id, `Admin Deleted User: ${user.email}`);
    }

    res.json({ success: true, message: 'User record deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal database user deletion error.' });
  }
}) as RequestHandler);

// 6. GET /api/admin/logs (Activity logs monitor)
router.get('/logs', ((req: AuthenticatedRequest, res: Response) => {
  try {
    const getLogs = db.prepare(`
      SELECT al.*, u.name, u.email 
      FROM activity_logs al 
      JOIN users u ON al.userId = u.id 
      ORDER BY al.id DESC
    `);
    const logs = getLogs.all();
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server logs recovery error.' });
  }
}) as RequestHandler);

export default router;

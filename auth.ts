/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from './db';
import { authenticateToken, logUserActivity, AuthenticatedRequest } from './middleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aetheron_super_secret_2026';

// Multer Local Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, GIF, PDF, and TXT files are allowed.'));
    }
  }
});

// =========================================================================
// PUBLIC & CLIENT AUTHENTICATION ROUTES (/api/auth)
// =========================================================================

// A. Register User
router.post('/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !name || !email || !password) {
    return res.status(400).json({ error: 'Incomplete registry fields.' });
  }

  try {
    const checkUser = db.prepare('SELECT id FROM users WHERE email = ?');
    if (checkUser.get(email)) {
      return res.status(400).json({ error: 'Registration failure: Email already in use.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userId = 'usr-' + Math.random().toString(36).substring(2, 9);

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      userId,
      name,
      email,
      hashedPassword,
      'customer', // signup defaults to customer role
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'
    );

    logUserActivity(userId, 'Account Registration');

    const token = jwt.sign({ id: userId, email, role: 'customer' }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        name,
        email,
        role: 'customer'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server registry database error.' });
  }
});

// B. Login User
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Missing login credentials.' });
  }

  try {
    const checkUser = db.prepare('SELECT * FROM users WHERE email = ?');
    const user: any = checkUser.get(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Authentication failure: Invalid email or password.' });
    }

    logUserActivity(user.id, 'User Login');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server database error.' });
  }
});

// C. Retrieve Profile Session
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const checkUser = db.prepare('SELECT id, name, email, role, avatar FROM users WHERE id = ?');
    const user = checkUser.get(userPayload.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server user profile error.' });
  }
});

// D. Change Password
router.post('/change-password', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const userPayload = req.user;

  if (!userPayload || typeof oldPassword !== 'string' || typeof newPassword !== 'string' || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing password fields.' });
  }

  try {
    const checkUser = db.prepare('SELECT * FROM users WHERE id = ?');
    const user: any = checkUser.get(userPayload.id);

    if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(400).json({ error: 'Password change error: Incorrect old password.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    const updatePassword = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    updatePassword.run(hashedNewPassword, user.id);

    logUserActivity(user.id, 'Password Change');

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal database password update error.' });
  }
});

// =========================================================================
// FILE UPLOAD ENDPOINTS (/api/auth)
// =========================================================================

// E. Upload User Avatar (POST /api/auth/avatar)
router.post('/avatar', authenticateToken, upload.single('avatar'), (req: AuthenticatedRequest, res: Response) => {
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No avatar file uploaded.' });
  }

  try {
    const avatarUrl = `/uploads/${req.file.filename}`;
    const updateAvatar = db.prepare('UPDATE users SET avatar = ? WHERE id = ?');
    updateAvatar.run(avatarUrl, userPayload.id);

    logUserActivity(userPayload.id, `User Uploaded Avatar: ${req.file.originalname}`);

    res.json({ success: true, avatar: avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server avatar update database error.' });
  }
});

// F. Upload File Metadata & File (POST /api/auth/uploads)
router.post('/uploads', authenticateToken, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const fileId = 'upl-' + Math.random().toString(36).substring(2, 9);
    const filepath = `/uploads/${req.file.filename}`;
    
    const insertFile = db.prepare(`
      INSERT INTO uploaded_files (id, userId, filename, filepath, mimetype, size, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertFile.run(
      fileId,
      userPayload.id,
      req.file.originalname,
      filepath,
      req.file.mimetype,
      req.file.size,
      new Date().toISOString()
    );

    logUserActivity(userPayload.id, `User Uploaded File: ${req.file.originalname}`);

    res.status(201).json({
      id: fileId,
      userId: userPayload.id,
      filename: req.file.originalname,
      filepath,
      mimetype: req.file.mimetype,
      size: req.file.size,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server file upload database error.' });
  }
});

// G. List Uploaded Files (GET /api/auth/uploads)
router.get('/uploads', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    let files;
    if (userPayload.role === 'admin') {
      const getFiles = db.prepare(`
        SELECT uf.*, u.name as userName, u.email as userEmail 
        FROM uploaded_files uf
        JOIN users u ON uf.userId = u.id
        ORDER BY uf.timestamp DESC
      `);
      files = getFiles.all();
    } else {
      const getFiles = db.prepare(`
        SELECT * FROM uploaded_files 
        WHERE userId = ? 
        ORDER BY timestamp DESC
      `);
      files = getFiles.all(userPayload.id);
    }
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server files retrieval error.' });
  }
});

// H. Delete Uploaded File (DELETE /api/auth/uploads/:id)
router.delete('/uploads/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const getFile = db.prepare('SELECT * FROM uploaded_files WHERE id = ?');
    const file: any = getFile.get(id);

    if (!file) {
      return res.status(404).json({ error: 'File record not found.' });
    }

    // Authorization: File owner or admin can delete
    if (userPayload.role !== 'admin' && file.userId !== userPayload.id) {
      return res.status(403).json({ error: 'Access denied: Unauthorized file deletion.' });
    }

    // Remove from physical disk if exists
    const diskPath = path.join(process.cwd(), file.filepath);
    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
    }

    // Delete record
    const deleteFile = db.prepare('DELETE FROM uploaded_files WHERE id = ?');
    deleteFile.run(id);

    logUserActivity(userPayload.id, `User Deleted File: ${file.filename}`);

    res.json({ success: true, message: 'File deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server file deletion database error.' });
  }
});

// =========================================================================
// FORM MANAGEMENT ENDPOINTS (/api/auth)
// =========================================================================

// I. Submit Form (POST /api/auth/forms)
router.post('/forms', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { title, content } = req.body;
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  if (typeof title !== 'string' || typeof content !== 'string' || !title || !content) {
    return res.status(400).json({ error: 'Incomplete form fields.' });
  }

  try {
    const formId = 'frm-' + Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toISOString();

    const insertForm = db.prepare(`
      INSERT INTO user_forms (id, userId, title, content, status, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    insertForm.run(formId, userPayload.id, title, content, 'Pending', timestamp);

    logUserActivity(userPayload.id, `User Submitted Form: ${title}`);

    res.status(201).json({
      id: formId,
      userId: userPayload.id,
      title,
      content,
      status: 'Pending',
      timestamp
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server form submission database error.' });
  }
});

// J. List Forms (GET /api/auth/forms)
router.get('/forms', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    let forms;
    if (userPayload.role === 'admin') {
      const getForms = db.prepare(`
        SELECT uf.*, u.name as userName, u.email as userEmail 
        FROM user_forms uf
        JOIN users u ON uf.userId = u.id
        ORDER BY uf.timestamp DESC
      `);
      forms = getForms.all();
    } else {
      const getForms = db.prepare(`
        SELECT * FROM user_forms 
        WHERE userId = ? 
        ORDER BY timestamp DESC
      `);
      forms = getForms.all(userPayload.id);
    }
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server forms retrieval error.' });
  }
});

// K. Update / Moderate Form (PATCH /api/auth/forms/:id)
router.patch('/forms/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, status } = req.body;
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const getForm = db.prepare('SELECT * FROM user_forms WHERE id = ?');
    const form: any = getForm.get(id);

    if (!form) {
      return res.status(404).json({ error: 'Form record not found.' });
    }

    // Verification: Non-admin can only update own pending forms and cannot alter status
    if (userPayload.role !== 'admin') {
      if (form.userId !== userPayload.id) {
        return res.status(403).json({ error: 'Access denied: Unauthorized form edit.' });
      }
      if (status !== undefined) {
        return res.status(403).json({ error: 'Access denied: Non-admin users cannot alter form status.' });
      }
    }

    const updatedTitle = title !== undefined ? title : form.title;
    const updatedContent = content !== undefined ? content : form.content;
    const updatedStatus = status !== undefined ? status : form.status;

    const updateForm = db.prepare(`
      UPDATE user_forms 
      SET title = ?, content = ?, status = ?
      WHERE id = ?
    `);
    updateForm.run(updatedTitle, updatedContent, updatedStatus, id);

    if (userPayload.role === 'admin') {
      logUserActivity(userPayload.id, `Admin Updated Form: ${updatedTitle}`);
    } else {
      logUserActivity(userPayload.id, `User Updated Form: ${updatedTitle}`);
    }

    res.json({
      id,
      userId: form.userId,
      title: updatedTitle,
      content: updatedContent,
      status: updatedStatus,
      timestamp: form.timestamp
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server form update database error.' });
  }
});

// L. Delete Form (DELETE /api/auth/forms/:id)
router.delete('/forms/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userPayload = req.user;
  if (!userPayload) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const getForm = db.prepare('SELECT * FROM user_forms WHERE id = ?');
    const form: any = getForm.get(id);

    if (!form) {
      return res.status(404).json({ error: 'Form record not found.' });
    }

    // Authorization: Admin or Owner
    if (userPayload.role !== 'admin' && form.userId !== userPayload.id) {
      return res.status(403).json({ error: 'Access denied: Unauthorized form deletion.' });
    }

    const deleteForm = db.prepare('DELETE FROM user_forms WHERE id = ?');
    deleteForm.run(id);

    if (userPayload.role === 'admin') {
      logUserActivity(userPayload.id, `Admin Deleted Form: ${form.title}`);
    } else {
      logUserActivity(userPayload.id, `User Deleted Form: ${form.title}`);
    }

    res.json({ success: true, message: 'Form record deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server form deletion database error.' });
  }
});

export default router;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'aetheron_super_secret_2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'customer' | 'admin' | 'staff';
  };
}

// 1. JWT Authentication Middleware
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied: Token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: 'customer' | 'admin' | 'staff';
    };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Access denied: Invalid token.' });
  }
}

// 2. Admin Privileges Enforcement Middleware
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Requires Admin privileges.' });
  }
  next();
}

// Helper to log user activities
export function logUserActivity(userId: string, activity: string) {
  try {
    const insertLog = db.prepare(`
      INSERT INTO activity_logs (userId, activity, timestamp)
      VALUES (?, ?, ?)
    `);
    insertLog.run(userId, activity, new Date().toISOString());
  } catch (err) {
    console.error('Error logging user activity:', err);
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const dbDir = path.dirname(process.env.DATABASE_PATH || './db/aetheron.sqlite');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(
  process.env.DATABASE_PATH || './db/aetheron.sqlite'
);

// Enable Foreign Keys
db.pragma('foreign_keys = ON');

// Create Users Table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('customer', 'admin', 'staff')),
    avatar TEXT
  )
`);

// Create Activity Logs Table
db.exec(`
  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    activity TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Create Uploaded Files Table
db.exec(`
  CREATE TABLE IF NOT EXISTS uploaded_files (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Create User Forms Table
db.exec(`
  CREATE TABLE IF NOT EXISTS user_forms (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Pending', 'Approved', 'Declined')),
    timestamp TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Seed Admin User
const adminEmail = process.env.ADMIN_EMAIL || 'admin@aetheron.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

const checkAdmin = db.prepare('SELECT * FROM users WHERE id = ? OR email = ?');
const adminExists = checkAdmin.get('usr-admin', adminEmail);

if (!adminExists) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(adminPassword, salt);
  
  const insertAdmin = db.prepare(`
    INSERT INTO users (id, name, email, password, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertAdmin.run(
    'usr-admin',
    'Aether Owner',
    adminEmail,
    hashedPassword,
    'admin',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'
  );
  console.log(`Default Admin user (${adminEmail}) seeded successfully.`);
}

export default db;

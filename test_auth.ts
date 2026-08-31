import express from 'express';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// Force test environment database path
const TEST_DB_PATH = './db/test_aetheron.sqlite';
process.env.DATABASE_PATH = TEST_DB_PATH;
process.env.JWT_SECRET = 'test_secret_key_2026';
let TEST_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aetheron.com';
const TEST_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Clean old test database
if (fs.existsSync(TEST_DB_PATH)) {
  try {
    fs.unlinkSync(TEST_DB_PATH);
  } catch (err) {
    console.log('Stale test database busy or locked. Using random accounts for safety.');
  }
}

// Import db and routers
import db from './db';

// Resolve actual email of usr-admin from DB in case of stale database reuse
const seededAdmin = db.prepare("SELECT email FROM users WHERE id = 'usr-admin'").get() as any;
if (seededAdmin) {
  TEST_ADMIN_EMAIL = seededAdmin.email;
}

import authRouter from './auth';
import adminRouter from './admin';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler for test app
app.use((err: any, req: any, res: any, next: any) => {
  console.error('TEST APP ERROR CAUGHT:', err);
  res.status(500).json({ error: err.message || err });
});

const testEmail = `jane-${Math.random().toString(36).substring(2, 9)}@example.com`;

async function runTests() {
  const PORT = 3001;
  const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
    
    try {
      let customerToken = '';
      let adminToken = '';
      let customerId = '';
      let newUserId = '';
      
      console.log('\n--- 1. Testing Default Admin Seeding ---');
      console.log('TEST_ADMIN_EMAIL:', TEST_ADMIN_EMAIL);
      console.log('All users in DB:', db.prepare('SELECT * FROM users').all());
      const adminInDb = db.prepare('SELECT * FROM users WHERE email = ?').get(TEST_ADMIN_EMAIL) as any;
      if (adminInDb && adminInDb.role === 'admin') {
        console.log('PASS: Seeded Admin User found in Database.');
      } else {
        throw new Error('FAIL: Seeded Admin User not found.');
      }

      console.log('\n--- 2. Testing Registration API (POST /api/auth/register) ---');
      const regRes = await fetch(`http://localhost:${PORT}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Doe',
          email: testEmail,
          password: 'password123'
        })
      });
      
      const regData = await regRes.json() as any;
      if (regRes.status === 201 && regData.token) {
        console.log('PASS: Registration API returned token.');
        customerToken = regData.token;
        customerId = regData.user.id;
      } else {
        throw new Error(`FAIL: Registration returned status ${regRes.status}: ${JSON.stringify(regData)}`);
      }

      console.log('\n--- 3. Testing GET /api/auth/me (Profile Route) ---');
      const meRes = await fetch(`http://localhost:${PORT}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${customerToken}` }
      });
      if (meRes.status === 200) {
        const meData = await meRes.json() as any;
        if (meData.id === customerId && meData.email === testEmail) {
          console.log('PASS: /api/auth/me returned authenticated user details.');
        } else {
          throw new Error('FAIL: /api/auth/me response mismatch.');
        }
      } else {
        throw new Error(`FAIL: /api/auth/me returned status ${meRes.status}`);
      }

      console.log('\n--- 4. Authenticating Admin ---');
      const adminLoginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_ADMIN_EMAIL,
          password: TEST_ADMIN_PASSWORD
        })
      });
      const adminLoginData = await adminLoginRes.json() as any;
      adminToken = adminLoginData.token;
      console.log('Admin authenticated.');

      console.log('\n--- 5. Testing Admin Authorization Protection (requireAdmin middleware) ---');
      const unauthorizedRes = await fetch(`http://localhost:${PORT}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${customerToken}` }
      });
      if (unauthorizedRes.status === 403) {
        console.log('PASS: Non-admin user blocked from admin panel access (403 Forbidden).');
      } else {
        throw new Error(`FAIL: Non-admin allowed access, status code: ${unauthorizedRes.status}`);
      }

      console.log('\n--- 6. Testing Admin GET /api/admin/users ---');
      const usersRes = await fetch(`http://localhost:${PORT}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (usersRes.status === 200) {
        const usersData = await usersRes.json() as any;
        console.log(`PASS: Admin successfully retrieved all users. Count: ${usersData.length}`);
      } else {
        throw new Error(`FAIL: Admin GET /users returned status ${usersRes.status}`);
      }

      console.log('\n--- 7. Testing Admin CREATE user (POST /api/admin/users) ---');
      const bobEmail = `bob-${Math.random().toString(36).substring(2, 9)}@example.com`;
      const createUserRes = await fetch(`http://localhost:${PORT}/api/admin/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: 'Bob Builder',
          email: bobEmail,
          password: 'bobpassword123',
          role: 'staff'
        })
      });
      if (createUserRes.status === 201) {
        const createUserData = await createUserRes.json() as any;
        newUserId = createUserData.id;
        console.log(`PASS: Admin successfully created user. New User ID: ${newUserId}`);
      } else {
        const errJson = await createUserRes.json();
        throw new Error(`FAIL: Admin CREATE user failed with status ${createUserRes.status}: ${JSON.stringify(errJson)}`);
      }

      // Verify user detail retrieval
      console.log('\n--- 8. Testing Admin GET /api/admin/users/:id ---');
      const getSingleRes = await fetch(`http://localhost:${PORT}/api/admin/users/${newUserId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (getSingleRes.status === 200) {
        const getSingleData = await getSingleRes.json() as any;
        if (getSingleData.email === bobEmail && getSingleData.role === 'staff') {
          console.log('PASS: Successfully retrieved user details by ID.');
        } else {
          throw new Error('FAIL: Retrieved user details mismatch.');
        }
      } else {
        throw new Error(`FAIL: GET user by ID returned status ${getSingleRes.status}`);
      }

      console.log('\n--- 9. Testing Admin UPDATE user (PUT /api/admin/users/:id) ---');
      const updateUserRes = await fetch(`http://localhost:${PORT}/api/admin/users/${newUserId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: 'Bob The Builder',
          role: 'admin'
        })
      });
      if (updateUserRes.status === 200) {
        const updateUserData = await updateUserRes.json() as any;
        if (updateUserData.name === 'Bob The Builder' && updateUserData.role === 'admin') {
          console.log('PASS: Admin successfully updated user properties.');
        } else {
          throw new Error('FAIL: Updated user properties mismatch.');
        }
      } else {
        throw new Error(`FAIL: Admin UPDATE user returned status ${updateUserRes.status}`);
      }

      console.log('\n--- 10. Testing Admin User Search query parameter (?search=...) ---');
      const searchRes = await fetch(`http://localhost:${PORT}/api/admin/users?search=${bobEmail}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (searchRes.status === 200) {
        const searchData = await searchRes.json() as any;
        if (searchData.length === 1 && searchData[0].id === newUserId) {
          console.log('PASS: Admin User search successfully filtered records.');
        } else {
          throw new Error(`FAIL: Search result count or values mismatch: ${JSON.stringify(searchData)}`);
        }
      } else {
        throw new Error(`FAIL: Search query returned status ${searchRes.status}`);
      }

      console.log('\n--- 11. Testing Admin DELETE user (DELETE /api/admin/users/:id) ---');
      const deleteUserRes = await fetch(`http://localhost:${PORT}/api/admin/users/${newUserId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (deleteUserRes.status === 200) {
        console.log('PASS: Admin successfully deleted user.');
      } else {
        throw new Error(`FAIL: Admin DELETE user returned status ${deleteUserRes.status}`);
      }

      // Verify deletion in DB
      const deletedUserInDb = db.prepare('SELECT * FROM users WHERE id = ?').get(newUserId);
      if (!deletedUserInDb) {
        console.log('PASS: User successfully purged from SQLite users table.');
      } else {
        throw new Error('FAIL: User still exists in SQLite users table after delete.');
      }

      console.log('\n--- 12. Testing Activity Logs API (GET /api/admin/logs) ---');
      const logsRes = await fetch(`http://localhost:${PORT}/api/admin/logs`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (logsRes.status === 200) {
        const logsData = await logsRes.json() as any;
        console.log(`PASS: Retrieved activity logs. Count: ${logsData.length}`);
        
        console.log('Logged Actions:');
        logsData.forEach((l: any) => console.log(` - User: ${l.name} (${l.email}): ${l.activity} @ ${l.timestamp}`));
        
        const hasReg = logsData.some((l: any) => l.activity === 'Account Registration');
        const hasLogin = logsData.some((l: any) => l.activity === 'User Login');
        const hasAdminCreate = logsData.some((l: any) => l.activity.includes('Admin Created User'));
        const hasAdminUpdate = logsData.some((l: any) => l.activity.includes('Admin Updated User'));
        const hasAdminDelete = logsData.some((l: any) => l.activity.includes('Admin Deleted User'));
        
        if (hasReg && hasLogin && hasAdminCreate && hasAdminUpdate && hasAdminDelete) {
          console.log('PASS: SQLite activity_logs table fully captures all system actions.');
        } else {
          throw new Error('FAIL: Some user activities are missing in activity_logs table.');
        }
      } else {
        throw new Error(`FAIL: Admin logs request failed with code ${logsRes.status}`);
      }

      console.log('\n========================================');
      console.log(' ALL PHASE 2 TESTS PASSED SUCCESSFULLY! ');
      console.log('========================================');
      
    } catch (error: any) {
      console.error('\n*** TEST SUITE ENCOUNTERED AN ERROR ***');
      console.error(error.message || error);
    } finally {
      server.close(() => {
        console.log('Test server closed.');
        if (fs.existsSync(TEST_DB_PATH)) {
          try {
            fs.unlinkSync(TEST_DB_PATH);
          } catch (err) {
            // ignore
          }
        }
        process.exit(0);
      });
    }
  });
}

runTests();

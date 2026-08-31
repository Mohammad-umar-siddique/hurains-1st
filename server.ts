/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';


import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();
import express from 'express';
// Load seed data structures
import { Product, User, Order, Review, Coupon, BlogItem, Notification } from './src/types';
import { INITIAL_PRODUCTS, INITIAL_BLOG_NEWS, INITIAL_REVIEWS, VALID_COUPONS } from './src/data';

const app = express();
const PORT = 3000;

// Express Body Parser middleware
app.use(express.json());

import db from './db';
import { authenticateToken, requireAdmin } from './middleware';
import authRouter from './auth';
import adminRouter from './admin';
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// ----------------------------------------------------
// IN-MEMORY DATABASE STORES (File-System backed / Transient durability)
// ----------------------------------------------------
let DB_PRODUCTS: Product[] = [...INITIAL_PRODUCTS];
let DB_USERS: User[] = [
  { id: 'usr-admin', name: 'Aether Owner', email: process.env.ADMIN_EMAIL || 'admin@aetheron.com', phone: '+1234567890', role: 'admin' },
  { id: 'usr-guest', name: 'Siddique Umar', email: 'user@aetheron.com', phone: '+9998887776', address: 'Cyberpunk District 9, sector a', role: 'customer' }
];

let DB_ORDERS: Order[] = [
  {
    id: 'AETH-9284',
    userId: 'usr-guest',
    customerName: 'Siddique Umar',
    customerEmail: 'user@aetheron.com',
    customerPhone: '+9998887776',
    shippingAddress: 'Cyberpunk District 9, sector a',
    items: [
      {
        productId: 'rog-8-pro',
        name: 'ASUS ROG Phone 8 Pro Ultimate',
        price: 1199,
        quantity: 1,
        color: 'Phantom Black',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'
      }
    ],
    subtotal: 1199,
    discount: 50,
    total: 1149,
    couponCode: 'CYBER50',
    status: 'Processing',
    paymentMethod: 'Stripe',
    paymentStatus: 'Paid',
    trackingNumber: 'TRK-ROG-8919',
    date: new Date(Date.now() - 48 * 3600 * 1000).toISOString() // 2 days ago
  },
  {
    id: 'AETH-4123',
    userId: 'usr-guest',
    customerName: 'Siddique Umar',
    customerEmail: 'user@aetheron.com',
    customerPhone: '+9998887776',
    shippingAddress: 'Cyberpunk District 9, sector a',
    items: [
      {
        productId: 's24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        price: 1299,
        quantity: 1,
        color: 'Titanium Gray',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800'
      }
    ],
    subtotal: 1299,
    discount: 0,
    total: 1299,
    status: 'Delivered',
    paymentMethod: 'PayPal',
    paymentStatus: 'Paid',
    trackingNumber: 'TRK-SAM-3281',
    date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() // 5 days ago
  }
];

let DB_REVIEWS: Review[] = [...INITIAL_REVIEWS];
let DB_COUPONS: Coupon[] = [...VALID_COUPONS];
let DB_NOTIFICATIONS: Notification[] = [
  { id: 'not-1', title: 'System Activated', message: 'Aetheron full-stack e-commerce engine initialized successfully.', type: 'inventory', read: false, date: new Date().toISOString() },
  { id: 'not-2', title: 'New Stock Alert', message: 'ASUS ROG Phone 8 Pro premium gaming variants updated.', type: 'inventory', read: true, date: new Date(Date.now() - 5 * 3600 * 1000).toISOString() }
];

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini API client initialized successfully.');
  } catch (err) {
    console.error('Error initializing Gemini Client:', err);
  }
} else {
  console.warn('GEMINI_API_KEY is not defined. AI Chatbot features may fall back to intelligent heuristic routines.');
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. GET ALL PRODUCTS
app.get('/api/products', (req, res) => {
  res.json(DB_PRODUCTS);
});

// 2. GET SINGLE PRODUCT
app.get('/api/products/:id', (req, res) => {
  const prod = DB_PRODUCTS.find(p => p.id === req.params.id);
  if (!prod) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(prod);
});

// 3. SECURE ORDER PLACEMENT
app.post('/api/orders', (req, res) => {
  const { userId, customerName, customerEmail, customerPhone, shippingAddress, items, subtotal, discount, total, couponCode, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Reduce inventory stock levels
  for (const item of items) {
    const product = DB_PRODUCTS.find(p => p.id === item.productId);
    if (product) {
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient inventory stock for ${product.name}. Remaining: ${product.stock}` });
      }
      product.stock -= item.quantity;
    }
  }

  // Generate random order ID and mock tracking
  const secureRandomId = 'AETH-' + Math.floor(1000 + Math.random() * 9000);
  const mockTrackingNumber = 'TRK-' + paymentMethod.substring(0,3).toUpperCase() + '-' + Math.floor(10000 + Math.random() * 90000);

  const newOrder: Order = {
    id: secureRandomId,
    userId: userId || 'usr-guest',
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    subtotal,
    discount: discount || 0,
    total,
    couponCode,
    status: 'Pending',
    paymentMethod,
    paymentStatus: 'Paid', // Assuming instant payment clearance in checkout process
    trackingNumber: mockTrackingNumber,
    date: new Date().toISOString()
  };

  DB_ORDERS.unshift(newOrder);

  // Trigger an Admin notification instantly
  const newNotif: Notification = {
    id: 'not-' + Math.random().toString(36).substring(2, 9),
    title: 'New Order Placed',
    message: `New Order (${secureRandomId}) worth $${total} placed by ${customerName}.`,
    type: 'order',
    read: false,
    date: new Date().toISOString()
  };
  DB_NOTIFICATIONS.unshift(newNotif);

  res.status(201).json(newOrder);
});

// 4. GET ACTIVE ORDERS / ORDER LIST (For accounts / dashboard)
app.get('/api/orders', (req, res) => {
  const { userId, email } = req.query;
  let filteredOrders = DB_ORDERS;

  if (userId) {
    filteredOrders = filteredOrders.filter(o => o.userId === userId);
  } else if (email) {
    filteredOrders = filteredOrders.filter(o => o.customerEmail === email);
  }

  res.json(filteredOrders);
});

// 5. UPDATE ORDER STATUS (Admin controls)
const updateOrderStatusHandler = (req: express.Request, res: express.Response) => {
  const { status, paymentStatus } = req.body;
  const orderIndex = DB_ORDERS.findIndex(o => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = DB_ORDERS[orderIndex];
  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  res.json(order);
};
app.patch('/api/orders/:id/status', updateOrderStatusHandler);
app.put('/api/orders/:id/status', updateOrderStatusHandler);

// 6. REQUEST ORDER RETURN
app.post('/api/orders/:id/return', (req, res) => {
  const { reason } = req.body;
  const order = DB_ORDERS.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.returnRequested = true;
  order.returnReason = reason || 'Not specified';
  order.returnStatus = 'Pending';
  order.status = 'Returned'; // Updates main state to Returned queue

  // Admin Notification
  const newNotif: Notification = {
    id: 'not-' + Math.random().toString(36).substring(2, 9),
    title: 'Return Requested',
    message: `Return request received from ${order.customerName} for order ${order.id}.`,
    type: 'return',
    read: false,
    date: new Date().toISOString()
  };
  DB_NOTIFICATIONS.unshift(newNotif);

  res.json(order);
});

// 7. HANDLE RETURN APPROVAL/DECLINE (Admin)
const handleReturnHandler = (req: express.Request, res: express.Response) => {
  const { status } = req.body; // Approved or Declined
  const order = DB_ORDERS.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.returnStatus = status;
  if (status === 'Approved') {
    order.paymentStatus = 'Refunded';
    
    // Return items back to active stock
    for (const item of order.items) {
      const prod = DB_PRODUCTS.find(p => p.id === item.productId);
      if (prod) prod.stock += item.quantity;
    }
  }

  res.json(order);
};
app.patch('/api/orders/:id/return-handle', handleReturnHandler);
app.put('/api/orders/:id/return-handle', handleReturnHandler);

// 8. ADD/FETCH REVIEWS
app.get('/api/reviews/:productId', (req, res) => {
  const reviews = DB_REVIEWS.filter(r => r.productId === req.params.productId);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const { productId, userName, rating, comment } = req.body;

  if (!productId || !userName || !rating) {
    return res.status(400).json({ error: 'Missing review details' });
  }

  const newReview: Review = {
    id: 'rev-' + Math.random().toString(36).substring(2, 9),
    productId,
    userName,
    rating,
    comment: comment || '',
    date: new Date().toISOString().split('T')[0]
  };

  DB_REVIEWS.unshift(newReview);

  // Recalculate and update the main product general rating
  const product = DB_PRODUCTS.find(p => p.id === productId);
  if (product) {
    const allProdReviews = DB_REVIEWS.filter(r => r.productId === productId);
    const sum = allProdReviews.reduce((acc, curr) => acc + curr.rating, 0);
    product.rating = Number((sum / allProdReviews.length).toFixed(1));
    product.reviewCount = allProdReviews.length;
  }

  res.status(201).json(newReview);
});

// 9. VERIFY DISCOUNT COUPON
app.post('/api/coupons/verify', (req, res) => {
  const { code, cartTotal } = req.body;
  const coupon = DB_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    return res.status(404).json({ error: 'Invalid coupon code.' });
  }

  if (cartTotal < coupon.minOrderValue) {
    return res.status(400).json({ error: `Coupon requires a minimum order value of $${coupon.minOrderValue}.` });
  }

  res.json(coupon);
});

// 10. NOTIFICATIONS
app.get('/api/notifications', (req, res) => {
  res.json(DB_NOTIFICATIONS);
});

app.post('/api/notifications/read-all', (req, res) => {
  DB_NOTIFICATIONS.forEach(n => n.read = true);
  res.json({ success: true });
});

// 11. ADMIN ANALYTICAL DASHBOARD STATS
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  const totalSales = DB_ORDERS
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingOrders = DB_ORDERS.filter(o => o.status === 'Pending').length;
  const processingOrders = DB_ORDERS.filter(o => o.status === 'Processing').length;
  const shippedOrders = DB_ORDERS.filter(o => o.status === 'Shipped').length;
  const deliveredOrders = DB_ORDERS.filter(o => o.status === 'Delivered').length;
  const returnRequestsCount = DB_ORDERS.filter(o => o.returnRequested === true && o.returnStatus === 'Pending').length;

  // Inventory count of alerts (items running low in stock < 15)
  const lowStockProducts = DB_PRODUCTS.filter(p => p.stock < 15).map(p => ({ id: p.id, name: p.name, stock: p.stock }));

  // Revenue analytics mapped by date
  const salesMap: { [key: string]: number } = {};
  DB_ORDERS.forEach(o => {
    const d = o.date.split('T')[0];
    salesMap[d] = (salesMap[d] || 0) + o.total;
  });

  const dailyReport = Object.keys(salesMap).map(k => ({ date: k, total: salesMap[k] })).slice(0, 10);

  res.json({
    totalSales,
    totalOrdersCount: DB_ORDERS.length,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    returnRequestsCount,
    lowStockProducts,
    dailyReport,
    recentOrders: DB_ORDERS.slice(0, 5)
  });
});

// ----------------------------------------------------
// AI AGENT SMART CHATBOT AND PRODUCT RECOMMENDATIONS (GEMINI-POWERED)
// ----------------------------------------------------

// System rules and instructions to shape AERA's cyber luxury personality
const SYSTEM_INSTRUCTION = `
You are AERA, the super-intelligent, high-end virtual luxury AI shopping assistant for AETHERON Premium Electronics.
AETHERON represents the absolute pinnacle of luxury mobile technology, blending the sleek engineering of Apple/Tesla with the high-octane visual power of ASUS ROG and cyberpunk design.

We sell elite flagship smartphones:
${JSON.stringify(DB_PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  price: p.price,
  chip: p.processor,
  ram: p.ram,
  storage: p.storage,
  screen: p.display,
  battery: p.battery,
  camera: p.camera,
  gaming: p.isGaming
})), null, 2)}

TONE:
- Professional, sophisticated, deeply informative, and slightly futuristic/cyberpunk in style.
- Fluent, precise, helpful, and highly knowledgeable. Explain technical features like refresh rates and camera sensors with elegant analogies.
- Keep your answers highly scannable using bold titles and tiny clean bullet points.

CAPABILITIES:
1. Product Advice: Highlight optimal devices based on user preferences. For example, recommend ASUS ROG 8 Pro for gaming, or Samsung S24 Ultra/Xiaomi 14 Ultra for elite camera capabilities.
2. Comparative Analysis: Create structured side-by-side spec listings for user queries matching "Compare phone X vs Y".
3. Order Mock Tracking: If a customer requests order details, explain that you can check it. (If they give any ID like AETH-9284 or a custom one, search our active database or gently guide them through placing an order first).
4. Coupon Highlight: Suggest valid codes like "AETHER10" (10% off orders > $500) if they are looking for deals.
5. Emphasize that owner and tech-visionary "Siddique Umar" welcomes elite users to AETHERON labs.

Keep your layout neat with Markdown. Do not expose internal database IDs unless requested.
`;

// AI Chatbot endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message payload is required.' });
  }

  // If Gemini is configured, call generative AI
  if (ai) {
    try {
      // Reconstruct format matching chats context
      // Standardize messages history to fit parts structure or linear context
      const chatHistory = history ? history.slice(-6).map((h: any) => 
        `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`
      ).join('\n') : '';

      const promptContext = `${chatHistory}\nUser: ${message}\nAssistant:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptContext,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const responseText = response.text || 'Understood. Let me look up additional parameters for your flagship device.';
      return res.json({ response: responseText });
    } catch (genError: any) {
      console.error('Gemini content generation error:', genError);
      // Fallback below
    }
  }

  // Heuristic rule-based intelligent fallback if Gemini is offline or rate-limited
  console.log('Using fallback AI chatbot heuristics.');
  let reply = '';
  const msgLower = message.toLowerCase();

  if (msgLower.includes('rog') || msgLower.includes('gaming') || msgLower.includes('game')) {
    reply = "Excellent inquiry! The **ASUS ROG Phone 8 Pro Ultimate** is our reigning titan. Equipped with the **Snapdragon 8 Gen 3**, **24GB of LPDDR5X RAM**, and an overclocked **165Hz LTPO AMOLED display**, it guarantees buttery gaming frame rates. Use code **AETHER10** to shaving 10% off.";
  } else if (msgLower.includes('camera') || msgLower.includes('photo') || msgLower.includes('picture') || msgLower.includes('lens')) {
    reply = "Ah, a connoisseur of optics! I highly recommend checking out: \n- **Samsung Galaxy S24 Ultra**: Features a legendary **200MP massive sensor** with robust 100x Space Zoom controls.\n- **Xiaomi 14 Ultra**: Showcases professional **Leica Summilux stepless variable apertures** on a full 1-inch sensor size.\n- **Oppo Find X7 Ultra**: The absolute first dual-periscope flagship zoom system on earth.";
  } else if (msgLower.includes('track') || msgLower.includes('order') || msgLower.includes('where is my')) {
    reply = "I would be delighted to look up your shipment tracker. Please provide your **AETHER ORDER ID** (e.g. `AETH-9284`). If you haven't placed an order yet, proceed to our Shop and finalize your cart under our secure premium gateway.";
  } else if (msgLower.includes('discount') || msgLower.includes('coupon') || msgLower.includes('offer') || msgLower.includes('code')) {
    reply = "To welcome you to our digital tech lounge, you may utilize the following secret terminal keys at checkout:\n- **AETHER10**: 10% discount on order values above $500.\n- **CYBER50**: Instant $50 flat off on order values exceeding $600.\n- **NEON300**: Generous $300 flat reduction on premium baskets over $2000.";
  } else if (msgLower.includes('siddique') || msgLower.includes('owner') || msgLower.includes('developer') || msgLower.includes('ceo')) {
    reply = "Our technical labs and luxury store are directed by our founder and lead visual architect, **Siddique Umar** (pictured inside our story block!). He welcomes you to our luxury smartphone platform.";
  } else {
    reply = "Greetings from AETHERON Luxury Lounge. I am AERA, your dynamic electronics assistant. How can I facilitate your search today? Speak to me about our custom **165Hz ROG gaming machines**, the **200MP Galaxy optics**, elite discounts, or track an active dispatch.";
  }

  return res.json({ response: reply });
});

// AI Product recommendation based on shopping habits or selected model
app.post('/api/ai/recommend', async (req, res) => {
  const { currentCartIds, viewedProductId } = req.body;

  if (ai) {
    try {
      const prompt = `Recommend two additional accessories or alternative top smartphone models to upsell our users.
      Context: User is currently inspecting or possesses items ID: [${(currentCartIds || []).join(', ')}] and viewed device: "${viewedProductId || 'rog-8-pro'}".
      Select strictly from this menu:
      ${JSON.stringify(DB_PRODUCTS.map(p => ({ id: p.id, name: p.name, price: p.price, specs: p.processor })))}
      Provide response in raw valid JSON format matching this schema:
      {
        "recommendedIds": ["id-1", "id-2"],
        "reasoning": "A short, premium upselling headline sentence."
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch {
      // Fallback
    }
  }

  // Static Fallback recommendation rules
  let recs = ['s24-ultra', 'iphone-15-pro-max'];
  let reason = 'These top flagships perfectly complement your selected technical specs.';
  
  if (viewedProductId === 'rog-8-pro') {
    recs = ['realme-gt-5', 'sony-xperia-1vi'];
    reason = 'Based on your interest in raw performance, we recommend checking these overclocked multi-core processors.';
  } else if (viewedProductId === 's24-ultra' || viewedProductId === 'xiaomi-14-ultra') {
    recs = ['oppo-find-x7-ultra', 'iphone-15-pro-max'];
    reason = 'Complete your creative workflow with these industry-leading high-resolution camera lenses.';
  }

  res.json({ recommendedIds: recs, reasoning: reason });
});

// ----------------------------------------------------
// VITE OR STATIC FILE HOSTING SETUP
// ----------------------------------------------------

async function startServer() {
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  if (process.env.NODE_ENV !== 'production') {
    // Development server with HMR routing handled by Vite
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving of built client dist folders
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AETHER BACKEND] Server running securely at http://localhost:${PORT}`);
  });
}

startServer();

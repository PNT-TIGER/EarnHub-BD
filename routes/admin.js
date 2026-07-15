const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../database');

router.get('/login', (req, res) => {
  if (req.session.adminId) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.findAdmin(username);
  if (admin && bcrypt.compareSync(password, admin.password_hash)) {
    req.session.adminId = admin.id;
    req.session.adminUser = admin.username;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'Invalid username or password' });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Dashboard
router.get('/', (req, res) => {
  const stats = db.getStats();
  const recentUsers = db.getUsers().slice(-5).reverse();
  const pendingWithdrawals = db.getWithdrawals().filter(w => w.status === 'pending').slice(-5).reverse();
  res.render('admin/dashboard', { stats, recentUsers, pendingWithdrawals, admin: req.session.adminUser, users: db.getUsers() });
});

// Users
router.get('/users', (req, res) => {
  const users = db.getUsers();
  const search = req.query.search || '';
  const filtered = search ? users.filter(u => u.email.includes(search) || u.phone.includes(search) || u.name.toLowerCase().includes(search.toLowerCase())) : users;
  res.render('admin/users', { users: filtered, search, admin: req.session.adminUser });
});

router.post('/users/:id/toggle', (req, res) => {
  const user = db.findUser(parseInt(req.params.id));
  if (user) {
    db.updateUser(user.id, { status: user.status === 'active' ? 'banned' : 'active' });
  }
  res.redirect('/admin/users');
});

router.post('/users/:id/balance', (req, res) => {
  const user = db.findUser(parseInt(req.params.id));
  if (user) {
    const newBalance = parseFloat(req.body.balance);
    if (!isNaN(newBalance) && newBalance >= 0) {
      db.updateUser(user.id, { balance: newBalance });
    }
  }
  res.redirect('/admin/users');
});

// Withdrawals
router.get('/withdrawals', (req, res) => {
  const withdrawals = db.getWithdrawals().slice().reverse();
  const users = db.getUsers();
  const filter = req.query.filter || 'all';
  let filtered = withdrawals;
  if (filter === 'pending') filtered = withdrawals.filter(w => w.status === 'pending');
  else if (filter === 'approved') filtered = withdrawals.filter(w => w.status === 'approved');
  else if (filter === 'rejected') filtered = withdrawals.filter(w => w.status === 'rejected');
  res.render('admin/withdrawals', { withdrawals: filtered, users, filter, admin: req.session.adminUser });
});

router.post('/withdrawals/:id/approve', (req, res) => {
  const w = db.findWithdrawal(parseInt(req.params.id));
  if (w && w.status === 'pending') {
    db.updateWithdrawal(w.id, { status: 'approved', approved_at: new Date().toISOString() });
  }
  res.redirect('/admin/withdrawals');
});

router.post('/withdrawals/:id/reject', (req, res) => {
  const w = db.findWithdrawal(parseInt(req.params.id));
  if (w && w.status === 'pending') {
    db.updateWithdrawal(w.id, { status: 'rejected', rejected_at: new Date().toISOString() });
    const user = db.findUser(w.user_id);
    if (user) {
      db.updateUser(user.id, { balance: +(user.balance + w.amount).toFixed(4) });
    }
  }
  res.redirect('/admin/withdrawals');
});

// Gift Codes
router.get('/giftcodes', (req, res) => {
  const giftCodes = db.getGiftCodes().slice().reverse();
  res.render('admin/giftcodes', { giftCodes, admin: req.session.adminUser });
});

router.post('/giftcodes/create', (req, res) => {
  const { code, amount, max_uses } = req.body;
  db.createGiftCode({
    code: code || undefined,
    amount: parseFloat(amount) || 0.01,
    max_uses: parseInt(max_uses) || 1
  });
  res.redirect('/admin/giftcodes');
});

router.post('/giftcodes/:id/delete', (req, res) => {
  db.deleteGiftCode(parseInt(req.params.id));
  res.redirect('/admin/giftcodes');
});

// Ads Management
router.get('/ads', (req, res) => {
  const ads = db.getAds();
  res.render('admin/ads', { ads, admin: req.session.adminUser });
});

router.post('/ads/create', (req, res) => {
  const { title, description, reward, url, duration } = req.body;
  db.createAd({
    title,
    description: description || '',
    reward: parseFloat(reward) || 0.0020,
    url: url || '#',
    duration: parseInt(duration) || 15
  });
  res.redirect('/admin/ads');
});

router.post('/ads/:id/toggle', (req, res) => {
  const ad = db.findAd(parseInt(req.params.id));
  if (ad) {
    db.updateAd(ad.id, { status: ad.status === 'active' ? 'inactive' : 'active' });
  }
  res.redirect('/admin/ads');
});

router.post('/ads/:id/delete', (req, res) => {
  db.deleteAd(parseInt(req.params.id));
  res.redirect('/admin/ads');
});

// Tasks Management
router.get('/tasks', (req, res) => {
  const tasks = db.getTasks();
  res.render('admin/tasks', { tasks, admin: req.session.adminUser });
});

router.post('/tasks/create', (req, res) => {
  const { title, description, reward, type } = req.body;
  db.createTask({
    title,
    description: description || '',
    reward: parseFloat(reward) || 0.01,
    type: type || 'general'
  });
  res.redirect('/admin/tasks');
});

router.post('/tasks/:id/toggle', (req, res) => {
  const task = db.findTask(parseInt(req.params.id));
  if (task) {
    db.updateTask(task.id, { status: task.status === 'active' ? 'inactive' : 'active' });
  }
  res.redirect('/admin/tasks');
});

router.post('/tasks/:id/delete', (req, res) => {
  db.deleteTask(parseInt(req.params.id));
  res.redirect('/admin/tasks');
});

module.exports = router;

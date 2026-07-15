const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const { adminAuth, userAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'earnhub-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

const siteRoutes = require('./routes/site');
const adminRoutes = require('./routes/admin');

app.use('/', siteRoutes);
app.use('/admin/login', (req, res, next) => next());
app.use('/admin', (req, res, next) => {
  if (req.path === '/login' || (req.method === 'POST' && req.path === '/login')) {
    return next();
  }
  adminAuth(req, res, next);
}, adminRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`EarnHub running on port ${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
  console.log('Admin: admin / admin123');
  console.log('Bot: node bot.js');
});

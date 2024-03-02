// src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const Portfolio = require('./portfolio');
const app = express();
const PORT = process.env.PORT || 3000;

const store = new MongoDBStore({
  uri: 'mongodb+srv://admin:1234@cluster0.rvhg67a.mongodb.net/blogs_db?retryWrites=true&w=majority',
  collection: 'sessions'
});

store.on('error', (error) => {
  console.error(error);
});

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'My EJS Website',
        currentDate: new Date().toDateString()
    });
});
app.use(cors());
app.use(authRoutes);
app.use(adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const requireAdmin = (req, res, next) => {
    const user = req.session.user;
  
    if (user && user.role === 'admin') {
      next(); // User is an admin, proceed to the next middleware or route handler
    } else {
      res.status(403).send('Access Forbidden'); // User is not an admin, return a 403 Forbidden status
    }
  };

app.get('/login', (req, res)=> {
    res.render('login.ejs');
});

app.get('/register', (req, res)=> {
    res.render('register.ejs');
});

app.get('/admin', (req, res)=> {
    res.render('admin.ejs');
});

app.get('/currencyApi', (req, res)=> {
    res.render('currencyApi.ejs');
});

app.get('/registerAdmin', (req, res)=> {
    res.render('registerAdmin.ejs');
});

app.get('/populationApi', (req, res)=> {
    res.render('populationApi.ejs');
});

app.get('/usersApi', (req, res)=> {
    res.render('usersApi.ejs');
});

app.get('/profile', (req, res) => {
    const user = req.session.user;
  
    if (user) {
      res.send(`Welcome, ${user.username}!`);
    } else {
      res.redirect('/login');
    }
  });
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/');
    }
  });
});
app.get('/portfolio', requireAdmin, async (req, res) => {
    try {
        const portfolios = await Portfolio.find();
        res.render('portfolio.ejs', { portfolio: portfolios });
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        res.status(500).send('Error fetching portfolios');
    }
});

app.delete('/portfolio/:id', async (req, res) => {
    try {
        await Portfolio.findByIdAndDelete(req.params.id);
        res.redirect('/portfolio');
    } catch (error) {
        console.error('Error deleting portfolio item:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/portfolio/:id/edit', async (req, res) => {
    try {
        const id = req.params.id;
        const portfolio = await Portfolio.findById(id);
        if (!portfolio) {
            res.status(404).send('Portfolio not found');
        } else {
            res.render('editPortfolio', { portfolio });
        }
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).send('Internal Server Error');
    }
  });
  
  
  app.post('/portfolio', async (req, res) => {
    try {
        const { image, name_en, name_ru, desc_en, desc_ru } = req.body;
        const portfolio = new Portfolio({
            image,
            name_en,
            name_ru,
            desc_en,
            desc_ru,
            timestamp: new Date()
        });
        await portfolio.save();
        res.redirect('/portfolio');
    } catch (error) {
        console.error('Error creating portfolio item:', error);
        res.status(500).send('Internal Server Error');
    }
});

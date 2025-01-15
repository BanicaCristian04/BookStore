    const express = require('express');
    const bcrypt = require('bcrypt');
    const cors=require('cors');
    const mongoose = require('mongoose');
    const session=require('express-session');
    const GoogleStrategy=require('passport-google-oauth20').Strategy;
    const MongoStore=require('connect-mongo');
const passport = require('passport');
    require('dotenv').config();


    const app = express();
    app.use(express.json());


    app.use(
        cors({
          origin: 'http://localhost:3000', 
          credentials: true,
        })
      );
    app.use(
        session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 3600000 
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            ttl: 3600000,
        }),
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: 'http://localhost:5000/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
          console.log('Google profile:', profile);
          return done(null, profile);
        }
      )
    );
    passport.use(
      'google-signup',
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: 'http://localhost:5000/auth/google/signup/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {

            let user = await User.findOne({ googleId: profile.id });
    
            if (!user) {

              user = new User({
                email: profile.emails[0].value,
                googleId: profile.id,
              });
              await user.save();
            }
    
            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
    app.get(
      '/auth/google/signup',
      passport.authenticate('google-signup', { scope: ['profile', 'email'] })
    );
    app.get(
      '/auth/google/signup/callback',
      passport.authenticate('google-signup', { failureRedirect: '/register' }),
      (req, res) => {
        res.redirect('http://localhost:3000/');
      }
    );

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get(
      '/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      (req, res) => {
        
        res.redirect("http://localhost:3000/");
      }
    );
    app.get('/', (req, res) => {
      res.send(`Hello, ${req.user ? req.user.displayName : 'Guest'}!`);
    });
    
    // Ruta de logout
    app.get('/logout', (req, res) => {
      req.logout(() => {
        res.redirect('/');
      });
    });
    const userSchema = new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        password_hash: { type: String },
        googleId: { type: String },
        created_at: { type: Date, default: Date.now }
    });
    const books = [
      {
        id: 1,
        title: "Ruperea blestemului",
        author: "Catalin Ranco Pitu",
        price: 62.99,
        image: "https://via.placeholder.com/150",
        category: "Ficțiune",
        isNew: true,
        discount: 10,
      },
      {
        id: 2,
        title: "Nexus",
        author: "Yuval Noah Harari",
        price: 76.5,
        image: "https://via.placeholder.com/150",
        category: "Istorie",
        isNew: false,
        discount: 20,
      },
    ];

    const User = mongoose.model('User', userSchema);

    app.get("/books", (req, res) => {
      const { category } = req.query;
      const filteredBooks = category
        ? books.filter((book) => book.category === category)
        : books;
      res.json(filteredBooks);
    });
    app.get("/books/:id", (req, res) => {
      const { id } = req.params;
      const book = books.find((b) => b.id === parseInt(id));
      if (!book) {
        return res.status(404).json({ message: "Cartea nu a fost găsită" });
      }
      res.json(book);
    });
    
    app.get("/categories", (req, res) => {
      const categories = [...new Set(books.map((book) => book.category))];
      res.json(categories);
    });
    app.post('/register', async (req, res) => {
        const {email, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            console.log('Attempting to register with:', { email, password });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
                console.log("Out1");
            }
            // const username=await User.findOne({username});
            // if (username) {
            //     return res.status(400).json({ error: 'Username already exists' });
            // }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
        
            const newUser = new User({ email, password_hash: hashedPassword });
            await newUser.save();
        
            console.log('User registered successfully:', newUser);
            res.status(201).json({ message: 'User registered successfully' });
          } catch (error) {
            console.log('Error during registration:', error.message);
            res.status(500).json({ error: 'Registration failed', details: error.message });
          }
    });
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
              return res.status(404).json({ error: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                console.log('Invalid password for user:', email);
                return res.status(401).json({ error: 'Invalid password' });
            }
            //req.session.userId = existingUser._id;
            //req.session.email = existingUser.email;
            res.json({ message: 'Login successful',}); //user: { id: user._id, email: user.email } });
            console.log('Login successful for user:', email);

        } catch (error) {
            console.error('Error during login:', error.message);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    });

    app.post('/logout', (req, res) => {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ error: 'Logout failed' });
          }
          res.clearCookie('connect.sid');
          res.json({ message: 'Logout successful' });
        });
      });
    const PORT = process.env.PORT || 5000;
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
        .catch((err) => console.log('Database connection error:', err));
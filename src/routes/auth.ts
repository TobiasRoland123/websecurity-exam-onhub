import { Router } from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../database';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
// const DOMAIN = process.env.DOMAIN || 'http://localhost:3005';


////////////////////////////////////////////////////////////////////////////////////////
// Login route to authenticate the user
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password ) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!-%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one letter and one number.' });
    }

    try {
        // Connect to MySQL and find the user
        const db = await connectToDatabase();
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        await db.end();

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0] as { id: number; password: string; role: string };

        // Compare the entered password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        const isProduction = process.env.RTE === 'prod';

        res.cookie('authToken', token, {
            httpOnly: true,                      // Prevents JavaScript access to the cookie (XSS protection)
            secure: isProduction,                // Only use secure cookies in production
            sameSite: 'strict',                  // Prevents the cookie from being sent with cross-site requests (CSRF protection)
            maxAge: 3600000,                     // 1 hour in milliseconds
            path: '/',                           // Restrict the cookie to your site's root
            priority: 'high',                    // Ensure the cookie is sent with every request
        });

        // Send a response to indicate success (no need to send token back in JSON)
        res.json({ message: 'Login successful', role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

////////////////////////////////////////////////////////////////////////////////////////
// Route to get the user details
router.get('/me', authenticateJWT([]), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    // If no userId, treat as a guest
    if (!userId) {
      return res.json({ user: "guest" }); // Respond with null to indicate a guest
    }

    const db = await connectToDatabase();

    // Fetch the user's details based on the userId from the JWT
    const [rows] = await db.execute(
      'SELECT id, username, email, role FROM users WHERE id = ?', 
      [userId]
    );
    await db.end();

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0]; // Get user object
    res.json({ user }); // Respond with user details
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



////////////////////////////////////////////////////////////////////////////////////////
// Logout route to clear the auth token
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('authToken'); // Clear the cookie
    res.json({ message: 'Logout successful' });
});




////////////////////////////////////////////////////////////////////////////////////////
// Signup route to create a new user
router.post('/signup', async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!-%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one letter and one number.' });
    }

    try {
        const db = await connectToDatabase();

        const [existingUsers] = await db.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [
            username,
            email,
            hashedPassword,
            'customer'
        ]);

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




export default router;


import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto'; // For token generation

// Import routes
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import dashboardRoutes from './routes/dashboard';
import profileRoutes from './routes/profile';
import loginRoutes from './routes/login';
import authRoutes from './routes/auth';
import signUpRoutes from './routes/signup';
import { authenticateJWT } from './middleware/auth';
import uploadRoutes from './routes/upload';

const isProduction = process.env.RTE === 'prod';
const isDevelopment = process.env.RTE === 'dev';
const isTest = process.env.RTE === 'test';

const CSRF_SECRET = process.env.CSRF_SECRET;
if (!CSRF_SECRET) {
    throw new Error('CSRF_SECRET is not defined. Please set it in your .env file.');
}

// Initialize Express app
const app = express();

// Double Signed CSRF Token 
// Generate a signed CSRF token
const generateSignedCSRFToken = () => {
    const csrfToken = crypto.randomBytes(32).toString('hex'); // Generate random token
    const signature = crypto
        .createHmac('sha256', CSRF_SECRET)
        .update(csrfToken)
        .digest('hex'); // Sign the token
    return `${csrfToken}.${signature}`; // Return token with signature
};

// Attach CSRF token to all requests
const attachCSRFToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies['csrf-token']) {
        const signedToken = generateSignedCSRFToken();
        res.cookie('csrf-token', signedToken, {
            httpOnly: true, 
            secure: isProduction? true : false, // Use secure cookies in production
            sameSite: 'strict',
            path: '/',
        });
    }
    next();
};

// Validate signed CSRF token
const validateSignedCSRFToken = (signedToken: string) => {
    const [csrfToken, signature] = signedToken.split('.');
    if (!csrfToken || !signature) return false;

    const expectedSignature = crypto
        .createHmac('sha256', CSRF_SECRET)
        .update(csrfToken)
        .digest('hex'); // Recompute signature

    return signature === expectedSignature; // Validate signature
};

// Validate CSRF token
const validateCSRFToken = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
        return next(); // Skip validation for non-mutating requests
    }

    const csrfToken = req.body._csrf || req.headers['x-csrf-token'];
    const cookieToken = req.cookies['csrf-token'];

    if (!csrfToken || !cookieToken || !validateSignedCSRFToken(cookieToken)) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    const [csrfTokenValue] = cookieToken.split('.');
    if (csrfToken !== csrfTokenValue) {
        return res.status(403).json({ message: 'CSRF token mismatch' });
    }

    next();
};

// Prevent browser caching globally for all routes
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Attach CSRF Token
app.use(attachCSRFToken);

// Global Middleware to Set Login and Role Information
app.use(authenticateJWT()); // No roles specified, just populates res.locals

// CORS Configuration
const allowedOrigins = [
    'https://examproject.xyz',
    'http://localhost:3005',
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'], // Include CSRF header
};

app.use(cors(corsOptions));

// Logging (based on environment) with morgan

if (isProduction) {
    app.use(morgan('combined'));
} else if (isDevelopment) {
    app.use(morgan('dev'));
} else if (isTest) {
    app.use(morgan('tiny'));
} else {
    console.error('Unknown runtime environment (RTE)');
    process.exit(1);
}

// Stricter rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20,
    message: 'Too many login attempts. Please try again later.',
    skipSuccessfulRequests: true,
});

app.use('/login', loginLimiter);

// General API Rate Limiter
const generalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 500,
    message: 'Too many requests, please try again later.',
});

app.use(generalLimiter);

// Enable HSTS - Strict Transport Security
app.use(
    helmet.hsts({
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    })
); 

// Prevent MIME type sniffing
// Adds the X-Content-Type-Options header to prevent browsers from trying to detect
// (or sniff) the MIME type and forces them to use the declared Content-Type.
app.use(helmet.noSniff()); 

// Hide Referer header
// Adds the Referrer-Policy header to control how much referrer information
// is included with requests.
app.use(
    helmet.referrerPolicy({
        policy: "strict-origin-when-cross-origin",
    })
);

// Hide the X-Powered-By header
app.use(helmet.hidePoweredBy());  

// Content Security Policy (CSP) with helmet
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"], // Only load resources from the same domain
            scriptSrc: ["'self'"], // Allow scripts with nonce
            styleSrc: ["'self'"], // Allow styles with nonce
            fontSrc: ["'self'"], // Only allow fonts from your domain
            imgSrc: ["'self'", 'https://instax-bucket.eu-central-1.linodeobjects.com'], // Allow images from Linode
            connectSrc: ["'self'"], // API calls restricted to self
            objectSrc: ["'none'"], // Disallow plugins (e.g., Flash)
            frameSrc: ["'none'"], // Disallow iframe embedding
            frameAncestors: ["'self'"], // Disallow embedding by other sites
            baseUri: ["'self'"], // Prevent base tag manipulation
            formAction: ["'self'"], // Restrict form submissions to the same domain
            mediaSrc: ["'self'"], // Restrict media (audio/video) to the same domain
            workerSrc: ["'self'"], // Restrict web workers to the same domain
            upgradeInsecureRequests: [], // Automatically upgrade HTTP to HTTPS
        },
    })
);

// Permissions Policy
// Adds the Permissions-Policy header to control browser features that can be used on your site.
// For example, geolocation, microphone, and camera permissions are disabled, while fullscreen is restricted to self.
app.use((req, res, next) => {
    res.setHeader(
        'Permissions-Policy',
        "geolocation=(self), microphone=(), camera=(), fullscreen=(self), payment=()"
    );
    next();
});

// Static files and view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// CSRF token endpoint
app.get('/csrf-token', (req, res) => {
    const signedToken = req.cookies['csrf-token'];
    if (!signedToken) {
        return res.status(403).json({ message: 'No CSRF token found' });
    }
    const [csrfToken] = signedToken.split('.'); // Extract only the token value
    res.json({ csrfToken });
});
// Routes
app.use('/', routes);
app.use('/users', userRoutes);
app.use('/posts', validateCSRFToken, postRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/profile', profileRoutes);
app.use('/login', loginRoutes);
app.use('/auth', validateCSRFToken, authRoutes);
app.use('/signup', signUpRoutes);
app.use('/upload', validateCSRFToken, uploadRoutes);

// Health check route for docker
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
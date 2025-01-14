// Entry point for the application
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';



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

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Global Middleware to Set Login and Role Information
app.use(authenticateJWT()); // No roles specified, just populates res.locals

// CORS
const isProduction = process.env.RTE === 'prod';
const corsOptions = {
    origin: isProduction ? 'https://examproject.xyz' : 'http://localhost:3005',
    credentials: true,              // Tillad cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Tilladte HTTP-metoder
    allowedHeaders: ['Content-Type', 'Authorization'], // Tilladte headers
};

app.use(cors(corsOptions));

if (isProduction) {
    console.log("Running in production mode");
    // Aktiver produktion-specifikke funktioner
} else {
    console.log("Running in development mode");
    // Aktiver debugging eller testfunktioner
}

// Security headers with helmet (all the x-powered-by header comes straight out the box with helmet)
app.use(helmet());

// Morgan middleware for logging HTTP requests
app.use(morgan('dev')); 

// Content Security Policy (CSP) with helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"], // Only load resources from the same domain
      scriptSrc: ["'self'"], // Allow scripts with nonce
      styleSrc: ["'self'"], // Allow styles with nonce
      fontSrc: ["'self'"], // Only allow fonts from your domain
      imgSrc: ["'self'", 'data:', 'https://*.linodeobjects.com'], // Allow images from Linode Object Storage
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

// Static files and view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/profile', profileRoutes);
app.use('/login', loginRoutes);
app.use('/auth', authRoutes);
app.use('/signup', signUpRoutes);
app.use('/upload', uploadRoutes);

// Health check route for docker
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  //
  console.log(`Server is running on port ${PORT}`);
});

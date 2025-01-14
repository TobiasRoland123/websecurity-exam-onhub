import express from 'express';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////////
// GET: Profile page
router.get('/', authenticateJWT(['customer']), (req, res) => {
  res.render('layout', { title: 'Profile page', body: 'profile' });
});

export default router;
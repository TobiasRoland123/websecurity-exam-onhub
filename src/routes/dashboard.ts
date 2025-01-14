import express from 'express';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////////
// GET: Dashboard page
router.get('/', authenticateJWT(['admin']), (req, res) => 
  {
  res.render('layout', { title: 'Dashboard page', body: 'dashboard' });
});

export default router;
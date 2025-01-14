import { Router } from 'express';

const router = Router();

////////////////////////////////////////////////////////////////////////////////////////
// GET: Home page
router.get('/', (req, res) => {
    res.render('layout', { 
      title: 'Home', 
      body: "index",
    });
});

export default router;

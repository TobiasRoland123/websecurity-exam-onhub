import express from 'express';

const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////////
// GET: Signup page
router.get('/', (req, res) => {
    res.render('layout', { 
        title: 'Signup', 
        body: 'signup', 
    });
});

export default router;

import express from 'express';

const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////////
// GET: Login page
router.get('/', (req, res) => {
    res.render('layout', { 
        title: 'Login', 
        body: "login",
    });
});

export default router;

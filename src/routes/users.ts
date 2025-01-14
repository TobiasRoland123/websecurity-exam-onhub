import { Router } from 'express';
import type { Request, Response } from 'express';
import connectToDatabase from '../database';

const router = Router();

////////////////////////////////////////////////////////////////////////////////////////
// GET: All users
router.get('/', async (req, res) => {
  try {
    const conn = await connectToDatabase();
    const [results] = await conn.execute('SELECT * FROM users');
    conn.end();
    return res.json(results);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

////////////////////////////////////////////////////////////////////////////////////////
// DELETE: Delete a user by ID
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.userId;  // Extract the authenticated user's ID from the token

    // Prevent an admin from deleting their own account
    if (parseInt(id) === userId) {
        return res.status(403).json({ message: "You cannot delete your own account." });
    }

    try {
        const db = await connectToDatabase();
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
        await db.end();

        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

////////////////////////////////////////////////////////////////////////////////////////
// GET: A specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const conn = await connectToDatabase();
    const { id } = req.params;
    const [results] = await conn.execute('SELECT * FROM users WHERE id = ?', [id]);
    conn.end();
    return res.json(results);
  } catch (error) {
    console.error(`Error fetching user with id ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
});

////////////////////////////////////////////////////////////////////////////////////////
// GET: All posts by a specific user
router.get('/:id/posts', async (req, res) => {
  try {
    const conn = await connectToDatabase();
    const { id } = req.params;
    const [results] = await conn.execute('SELECT * FROM posts WHERE user_fk = ?', [id]);
    conn.end();
    return res.json(results);
  } catch (error) {
    console.error(`Error fetching posts for user with id ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Failed to fetch posts' });
  }
}
);

export default router;

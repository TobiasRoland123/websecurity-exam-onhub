import { Router } from 'express';
import { s3, bucketName } from '../linodeStorage';
import connectToDatabase from '../database';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

////////////////////////////////////////////////////////////////////////////////////////
// GET: Get all posts
router.get('/', async (req, res) => {
  try {
    const conn = await connectToDatabase();
    const [results] = await conn.execute(`
      SELECT posts.*, users.username, users.email 
      FROM posts 
      JOIN users ON posts.user_fk = users.id
    `);
    conn.end();
    return res.json(results);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

////////////////////////////////////////////////////////////////////////////////////////
// GET: Get a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const conn = await connectToDatabase();
    const { id } = req.params;
    const [results] = await conn.execute('SELECT * FROM posts WHERE id = ?', [id]);
    conn.end();

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json(results[0]);
  } catch (error) {
    console.error(`Error fetching post with id ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Failed to fetch post' });
  }
});

////////////////////////////////////////////////////////////////////////////////////////
// DELETE: Delete a post by ID
router.delete('/:id', authenticateJWT(['customer', 'admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await connectToDatabase();

    // Find the post to delete
    const [postResults]: any = await conn.execute('SELECT * FROM posts WHERE id = ?', [id]);
    const post = postResults[0];

    if (!post) {
      conn.end();
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete the image from Linode Object Storage
    const fileName = post.image_path.split('/').pop(); // Extract the file name from the image URL
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    try {
      await s3.deleteObject(params).promise();
      console.log(`Image deleted: ${fileName}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error deleting image from Linode: ${error.message}`);
      } else {
        console.error('Error deleting image from Linode:', error);
      }
      conn.end();
      return res.status(500).json({ message: 'Failed to delete image from storage' });
    }

    // Delete the post from the database
    await conn.execute('DELETE FROM posts WHERE id = ?', [id]);
    conn.end();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(`Error deleting post with id ${id}:`, error);
    return res.status(500).json({ message: 'Failed to delete post' });
  }
});

export default router;
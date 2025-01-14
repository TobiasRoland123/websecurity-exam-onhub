import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import { s3, bucketName } from '../linodeStorage';
import connectToDatabase from '../database';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

const validateCaption = (caption: string): { valid: boolean; message?: string } => {
  if (!caption || typeof caption !== 'string') {
    return { valid: false, message: 'Caption must be a non-empty string.' };
  }

  if (caption.length < 1 || caption.length > 255) {
    return { valid: false, message: 'Caption must be between 1 and 255 characters.' };
  }

  const unsafePattern = /<script.*?>|<\/script>|[<>]/gi; // Disallow HTML tags or unsafe characters
  if (unsafePattern.test(caption)) {
    return { valid: false, message: 'Caption contains invalid characters.' };
  }

  return { valid: true };
};

// Multer configuration: limit file size to 3MB and filter file types
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // Max file size: 3MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

////////////////////////////////////////////////////////////////////////////////////////////////
// POST: Upload an image
router.post('/', authenticateJWT(['customer']), upload.single('image'), async (req: Request, res: Response) => {
  const { caption } = req.body; // Use 'caption' instead of 'title' and 'description'
  const file = req.file;

  // Validate caption
    const validationResult = validateCaption(caption);
    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message });
    }

  if (!file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  try {
    // Upload image to Linode Object Storage
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_'); 

    const params = {  
      Bucket: bucketName,
      Key: `${Date.now()}_${sanitizedFileName}`, // Generate a unique filename
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Allow public access to the file
    };

    const uploadResult = await s3.upload(params).promise();
    const publicUrl = uploadResult.Location; // URL of the uploaded file
    const userId = (req as any).user?.userId; // Assuming JWT middleware sets req.user

    // Store metadata in MySQL
    const connection = await connectToDatabase();

      await connection.query(
      'INSERT INTO posts (image_path, caption, user_fk) VALUES (?, ?, ?)',
      [publicUrl, caption, userId]
    );
    connection.end();

    res.status(201).json({ message: 'Image uploaded successfully', imageUrl: publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
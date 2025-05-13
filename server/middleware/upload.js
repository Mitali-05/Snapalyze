import multer from 'multer';

const storage = multer.memoryStorage(); // In-memory to process ZIP directly
const upload = multer({ storage });

export default upload;

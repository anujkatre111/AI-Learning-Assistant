import express from 'express';
import { createDocument, deleteDocument, getDocument, getDocuments, updateDocument } from '../controllers/documentController.js';
import protect from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

//All routes are protected
router.use(protect);

 router.post('/upload',upload.single('file'), createDocument);
 router.get('/', getDocuments);
 router.get('/:id',getDocument);
 router.delete('/:id', deleteDocument);
 router.put('/:id',upload.single('file'), updateDocument);

 export default router;
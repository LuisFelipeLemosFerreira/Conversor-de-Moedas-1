import express from 'express';
import { createConversion, getConversions, updateConversion, deleteConversion } from '../controllers/conversionController.js';

const router = express.Router();

router.post('/', createConversion);      // Create
router.get('/', getConversions);         // Read
router.put('/:id', updateConversion);    // Update
router.delete('/:id', deleteConversion); // Delete

export default router;

import express from 'express';
import { addNote, getAllNotes, delNote, editNoteDesc, editNoteName, editNoteTag, getAllNotesByTags } from '../controllers/notesController.js';



const router = express.Router();

router.post('/', addNote);
router.get('/', getAllNotes);
router.get('/tags', getAllNotesByTags);
router.delete('/', delNote);
router.put('/edit/desc', editNoteDesc);
router.put('/edit/title', editNoteName);
router.put('/edit/tag', editNoteTag);

export default router;

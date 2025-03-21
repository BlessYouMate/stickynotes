import express from 'express';
import { createTag, delTag, editTagName, editTagColor, getAllTags, changeTagState  } from '../controllers/tagsController.js';


const router = express.Router();

router.post('/', createTag);
router.get('/', getAllTags);
router.delete('/', delTag);
router.put('/edit/tag', editTagName);
router.put('/edit/isChecked', changeTagState);
router.put('/edit/color', editTagColor);

export default router;
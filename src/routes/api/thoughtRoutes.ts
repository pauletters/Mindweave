import { Router } from 'express';
const router = Router();
import { 
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
 } from '../../controllers/thoughtController.js';

// /api/thoughts
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:userId
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);

router.route('/:thoughtId/reactions').post(addReaction);

router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

export default router;

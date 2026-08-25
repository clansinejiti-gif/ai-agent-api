import {Router} from 'express';
import { getBooks, postBooks } from '../controllers/booksControllers.js';
import { roleCheck } from '../middlewares/roleChecker.js';
import requireAuth from '../middlewares/authMiddleware.js'

const router = Router();

router.get('/', requireAuth, getBooks)

router.post("/", roleCheck, postBooks);

export default router

import {Router} from 'express';
import { getBooks, postBooks } from '../controllers/booksControllers.js';
import { roleCheck } from '../middlewares/roleChecker.js';

const router = Router();

router.get('/', getBooks)

router.post("/", roleCheck, postBooks);

export default router

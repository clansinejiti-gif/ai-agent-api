import {Router} from 'express';
import { getBooks, postBooks } from '../controllers/booksControllers.js';
import { roleCheck } from '../middlewares/roleChecker.js';

const router = Router();

router.get('/books', getBooks)

router.post("/books", roleCheck, postBooks);

export default router

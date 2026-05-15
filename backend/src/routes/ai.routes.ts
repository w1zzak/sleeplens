import { Router } from "express";
import * as aiController from "../controllers/ai.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { chatSchema } from "../schemas/ai.schema";

const router = Router();

router.use(authMiddleware);

router.post('/chat', validate(chatSchema), aiController.chat);
router.get('/history', aiController.getHistory);
router.post('/weekly-report', aiController.generateWeeklyReport);

export default router;
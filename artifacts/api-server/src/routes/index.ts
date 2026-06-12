import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statsRouter from "./stats";
import usersRouter from "./users";
import filesRouter from "./files";
import chatsRouter from "./chats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(usersRouter);
router.use(filesRouter);
router.use(chatsRouter);

export default router;

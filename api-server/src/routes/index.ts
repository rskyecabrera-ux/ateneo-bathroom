import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bathroomsRouter from "./bathrooms";
import reviewsRouter from "./reviews";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bathroomsRouter);
router.use(reviewsRouter);
router.use(statsRouter);

export default router;

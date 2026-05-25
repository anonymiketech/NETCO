import { Router, type IRouter } from "express";
import healthRouter from "./health";
import packagesRouter from "./packages";
import ordersRouter from "./orders";
import paymentRouter from "./payment";
import plansRouter from "./plans";
import contactRouter from "./contact";
import statsRouter from "./stats";
import adminServersRouter from "./admin-servers";
import authEmailRouter from "./auth-email";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/packages", packagesRouter);
router.use("/orders", ordersRouter);
router.use("/payment", paymentRouter);
router.use("/plans", plansRouter);
router.use("/contact", contactRouter);
router.use(statsRouter);
router.use(adminServersRouter);
router.use("/auth/email", authEmailRouter);

export default router;

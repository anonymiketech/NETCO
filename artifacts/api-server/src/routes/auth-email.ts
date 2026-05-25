import { Router } from "express";
import { z } from "zod";
import { sendConfirmationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "../lib/email.js";
import { logger } from "../lib/logger.js";

const router = Router();

const ConfirmBody = z.object({
  email: z.string().email(),
  confirmUrl: z.string().url(),
});

const ResetBody = z.object({
  email: z.string().email(),
  resetUrl: z.string().url(),
});

const WelcomeBody = z.object({
  email: z.string().email(),
});

router.post("/confirm", async (req, res) => {
  const parsed = ConfirmBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }
  try {
    const result = await sendConfirmationEmail(parsed.data.email, parsed.data.confirmUrl);
    logger.info({ email: parsed.data.email, id: result.data?.id }, "Confirmation email sent");
    res.json({ success: true, id: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send confirmation email");
    res.status(500).json({ error: "Failed to send email" });
  }
});

router.post("/reset", async (req, res) => {
  const parsed = ResetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }
  try {
    const result = await sendPasswordResetEmail(parsed.data.email, parsed.data.resetUrl);
    logger.info({ email: parsed.data.email, id: result.data?.id }, "Password reset email sent");
    res.json({ success: true, id: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send password reset email");
    res.status(500).json({ error: "Failed to send email" });
  }
});

router.post("/welcome", async (req, res) => {
  const parsed = WelcomeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }
  try {
    const result = await sendWelcomeEmail(parsed.data.email);
    logger.info({ email: parsed.data.email, id: result.data?.id }, "Welcome email sent");
    res.json({ success: true, id: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send welcome email");
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;

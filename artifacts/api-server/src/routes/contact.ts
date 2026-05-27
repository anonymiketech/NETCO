import { Router } from "express";
import { randomUUID } from "crypto";
import { db, contactMessagesTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const parsed = SubmitContactBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
      return;
    }

    const body = parsed.data;
    const id = randomUUID();

    const [message] = await db
      .insert(contactMessagesTable)
      .values({
        id,
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        subject: body.subject ?? null,
        message: body.message,
      })
      .returning();

    req.log.info({ id, email: body.email }, "Contact message submitted");

    res.status(201).json({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone ?? null,
      subject: message.subject ?? null,
      message: message.message,
      createdAt: message.createdAt instanceof Date ? message.createdAt.toISOString() : String(message.createdAt),
    });
  } catch (err) {
    req.log.error({ err, body: req.body }, "Error submitting contact message");
    const message = err instanceof Error ? err.message : "Failed to submit contact message";
    res.status(500).json({ error: message });
  }
});

export default router;

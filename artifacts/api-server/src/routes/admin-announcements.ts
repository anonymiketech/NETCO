import { Router } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db, userProfilesTable } from "@workspace/db";
import { sendBulkAnnouncement } from "../lib/email.js";
import { logger } from "../lib/logger.js";

const router = Router();

const SendAnnouncementBody = z.object({
  subject: z.string().min(5).max(100),
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(10000),
  ctaUrl: z.string().url().optional(),
  ctaText: z.string().min(2).max(50).optional(),
  targetAudience: z.enum(["all", "newsletter_subscribers", "active_users"]).default("newsletter_subscribers"),
});

// Send announcement to users
router.post("/announcements/send", async (req, res) => {
  try {
    const parsed = SendAnnouncementBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
      return;
    }

    const { subject, title, content, ctaUrl, ctaText, targetAudience } = parsed.data;

    // Fetch target users based on audience
    let profiles;
    if (targetAudience === "newsletter_subscribers") {
      profiles = await db
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.newsletterSubscribed, true));
    } else if (targetAudience === "active_users") {
      // Users with at least one order or plan would require a join
      // For now, all verified users
      profiles = await db
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.isEmailVerified, true));
    } else {
      // All users
      profiles = await db.select().from(userProfilesTable);
    }

    if (profiles.length === 0) {
      res.status(400).json({ error: "No users found matching the target audience" });
      return;
    }

    const emails = profiles.map((p) => p.email);

    logger.info(
      { subject, targetAudience, recipientCount: emails.length },
      "Sending bulk announcement"
    );

    // Send emails
    const result = await sendBulkAnnouncement(
      emails,
      subject,
      title,
      content,
      ctaUrl,
      ctaText
    );

    logger.info(
      { subject, succeeded: result.succeeded, failed: result.failed },
      "Bulk announcement sent"
    );

    res.json({
      success: true,
      message: `Announcement sent to ${result.succeeded} users`,
      stats: result,
    });
  } catch (err) {
    logger.error({ err, body: req.body }, "Error sending announcement");
    const message = err instanceof Error ? err.message : "Failed to send announcement";
    res.status(500).json({ error: message });
  }
});

export default router;

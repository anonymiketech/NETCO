import { Router } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { db, configServersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { uploadConfigFile, downloadConfigFile, deleteConfigFile } from "../lib/storage";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".ehi" || ext === ".hc") {
      cb(null, true);
    } else {
      cb(new Error("Only .ehi and .hc config files are allowed"));
    }
  },
});

router.get("/admin/servers", async (req, res) => {
  const servers = await db
    .select()
    .from(configServersTable)
    .orderBy(configServersTable.createdAt);
  res.json(servers);
});

router.post("/admin/servers", upload.single("configFile"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Config file (.ehi or .hc) is required" });
      return;
    }

    const { serverName, network, appType, planType, duration } = req.body as Record<string, string>;

    if (!serverName || !network || !appType || !planType || !duration) {
      res.status(400).json({ error: "All fields are required: serverName, network, appType, planType, duration" });
      return;
    }

    const stored = await uploadConfigFile(req.file.buffer, req.file.originalname);

    const id = randomUUID();
    const now = new Date();
    const [server] = await db
      .insert(configServersTable)
      .values({
        id,
        serverName,
        network,
        appType,
        planType,
        duration,
        filename: stored.filename,
        originalName: stored.originalName,
        fileSize: stored.fileSize,
        status: "active",
        isFree: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    req.log.info({ id, serverName, network, appType }, "Config server added");
    res.status(201).json(server);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add config server";
    req.log.error({ err, body: req.body }, "Error adding config server");
    res.status(500).json({ error: message });
  }
});

router.patch("/admin/servers/:id", async (req, res) => {
  const id = req.params["id"] as string;
  const { status, isFree } = req.body as { status?: string; isFree?: boolean };

  if (status !== undefined && !["active", "inactive"].includes(status)) {
    res.status(400).json({ error: "status must be 'active' or 'inactive'" });
    return;
  }

  const updateFields: Record<string, unknown> = {};
  if (status !== undefined) updateFields.status = status;
  if (isFree !== undefined) updateFields.isFree = Boolean(isFree);

  if (Object.keys(updateFields).length === 0) {
    res.status(400).json({ error: "Provide at least one field to update: status or isFree" });
    return;
  }

  const [updated] = await db
    .update(configServersTable)
    .set(updateFields)
    .where(eq(configServersTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Config server not found" });
    return;
  }

  res.json(updated);
});

router.put("/admin/servers/:id/file", upload.single("configFile"), async (req, res) => {
  try {
    const id = req.params["id"] as string;

    if (!req.file) {
      res.status(400).json({ error: "Config file (.ehi or .hc) is required" });
      return;
    }

    const [existing] = await db
      .select()
      .from(configServersTable)
      .where(eq(configServersTable.id, id))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Config server not found" });
      return;
    }

    await deleteConfigFile(existing.filename).catch(() => {});

    const stored = await uploadConfigFile(req.file.buffer, req.file.originalname);

    const [updated] = await db
      .update(configServersTable)
      .set({
        filename: stored.filename,
        originalName: stored.originalName,
        fileSize: stored.fileSize,
      })
      .where(eq(configServersTable.id, id))
      .returning();

    req.log.info({ id, newFile: stored.filename }, "Config file replaced");
    res.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to replace config file";
    req.log.error({ err }, "Error replacing config file");
    res.status(500).json({ error: message });
  }
});

router.delete("/admin/servers/:id", async (req, res) => {
  const id = req.params["id"] as string;

  const [existing] = await db
    .select()
    .from(configServersTable)
    .where(eq(configServersTable.id, id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Config server not found" });
    return;
  }

  await deleteConfigFile(existing.filename).catch(() => {});
  await db.delete(configServersTable).where(eq(configServersTable.id, id));

  req.log.info({ id }, "Config server deleted");
  res.json({ success: true });
});

router.get("/admin/servers/:id/download", async (req, res) => {
  const id = req.params["id"] as string;

  const [server] = await db
    .select()
    .from(configServersTable)
    .where(eq(configServersTable.id, id))
    .limit(1);

  if (!server) {
    res.status(404).json({ error: "Config server not found" });
    return;
  }

  const buffer = await downloadConfigFile(server.filename);

  res.setHeader("Content-Disposition", `attachment; filename="${server.originalName}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Length", buffer.byteLength);
  res.send(buffer);
});

export default router;

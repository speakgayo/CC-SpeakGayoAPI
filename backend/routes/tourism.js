import express from "express";
import multer from "multer";
import Tourism from "../models/Tourism.js";
import { Storage } from "@google-cloud/storage";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Konfigurasi Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, "../service_account.json"),
});
const bucket = storage.bucket("tourism-image");

// Konfigurasi multer
const upload = multer({
  storage: multer.memoryStorage(), // Simpan di memori sementara
});

// Rute untuk mengambil semua data tourism
router.get("/", async (req, res) => {
  try {
    const tourismData = await Tourism.find();
    res.status(200).json(tourismData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tourism = await Tourism.findById(req.params.id);
    if (!tourism) {
      return res.status(404).json({ error: "Cannot find tourism" });
    }
    res.status(200).json(tourism);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload single image
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  // Membuat nama file unik
  const hash = crypto
    .createHash("md5")
    .update(Date.now().toString())
    .digest("hex");
  const ext = path.extname(req.file.originalname);
  const filename = `${hash}${ext}`;

  // Upload ke GCS
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on("error", (err) => {
    res.status(500).json({ error: err.message });
  });

  blobStream.on("finish", async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    const tourism = new Tourism({
      name: req.body.name,
      category: req.body.category,
      address: req.body.address,
      description: req.body.description,
      image: publicUrl,
    });

    try {
      const newTourism = await tourism.save();
      res.status(201).json({
        success: "Tourism data created successfully",
        data: newTourism,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  blobStream.end(req.file.buffer);
});

// Update tourism data
router.put("/:id", upload.single("image"), getTourism, async (req, res) => {
  try {
    if (req.file) {
      // Hapus gambar lama dari GCS
      const oldImage = res.tourism.image;
      if (oldImage) {
        const oldFilename = oldImage.split("/").pop();
        await bucket
          .file(oldFilename)
          .delete()
          .catch(() => {});
      }

      // Upload gambar baru ke GCS
      const hash = crypto
        .createHash("md5")
        .update(Date.now().toString())
        .digest("hex");
      const ext = path.extname(req.file.originalname);
      const filename = `${hash}${ext}`;
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on("error", (err) => {
        res.status(500).json({ error: err.message });
      });

      blobStream.on("finish", async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.tourism.image = publicUrl;

        if (req.body.name != null) res.tourism.name = req.body.name;
        if (req.body.category != null) res.tourism.category = req.body.category;
        if (req.body.address != null) res.tourism.address = req.body.address;
        if (req.body.description != null)
          res.tourism.description = req.body.description;

        try {
          const updatedTourism = await res.tourism.save();
          res.json({
            success: "Tourism data updated successfully",
            data: updatedTourism,
          });
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      });

      blobStream.end(req.file.buffer);
    } else {
      if (req.body.name != null) res.tourism.name = req.body.name;
      if (req.body.category != null) res.tourism.category = req.body.category;
      if (req.body.address != null) res.tourism.address = req.body.address;
      if (req.body.description != null)
        res.tourism.description = req.body.description;

      try {
        const updatedTourism = await res.tourism.save();
        res.json({
          success: "Tourism data updated successfully",
          data: updatedTourism,
        });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete tourism data
router.delete("/:id", getTourism, async (req, res) => {
  try {
    const oldImage = res.tourism.image;
    if (oldImage) {
      const oldFilename = oldImage.split("/").pop();
      await bucket
        .file(oldFilename)
        .delete()
        .catch(() => {});
    }
    await res.tourism.deleteOne();
    res.json({ success: "Tourism data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to get a tourism data by ID
async function getTourism(req, res, next) {
  let tourism;
  try {
    tourism = await Tourism.findById(req.params.id);
    if (tourism == null) {
      return res.status(404).json({ error: "Cannot find tourism" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  res.tourism = tourism;
  next();
}

export default router;

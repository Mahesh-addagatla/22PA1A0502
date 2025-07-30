import express from "express";
import { createShortURL, redirectToURL } from "../controllers/urlController.js";

const router = express.Router();

// New endpoint as requested
router.post("/shorturls", createShortURL);

// Keep the old endpoint for backward compatibility
router.post("/shorten", createShortURL);

// Redirect endpoint
router.get("/:shortcode", redirectToURL);

export default router;
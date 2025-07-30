import express from "express";
import { createShortURL, redirectToURL } from "../controllers/urlController.js";

const router = express.Router();
router.post("/shorten", createShortURL);
router.get("/:shortcode", redirectToURL);

export default router;

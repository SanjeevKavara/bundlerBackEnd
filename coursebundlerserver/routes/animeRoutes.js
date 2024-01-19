import express from "express";
import { createanime, getAllAnimes } from "../controllers/animeController.js";

const router = express.Router();

//Get all anime titles without lectures
router.route("/animes").get(getAllAnimes)

//create new anime - only admin
router.route("/createanime").post(createanime)

//Add lecture, delete Anime, get course details


//Delete lecture

export default router;
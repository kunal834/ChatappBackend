import express from "express";
import { Router } from "express"
import { isAuthenticated } from "../middlewares/auth.js";
import { getMessage, getuserforsidebar, markMessageSeen, sendMessage } from "../Controllers/MessageController.js";

const router = express.Router();

router.get("/users" , isAuthenticated , getuserforsidebar);
router.get("/:id" , isAuthenticated , getMessage);
router.put("/mark/:id" , isAuthenticated , markMessageSeen);
router.post("/send/:id" , isAuthenticated , sendMessage);


export default router

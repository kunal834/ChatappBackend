import express from "express"
import { isAuthenticated } from "../middlewares/auth.js"
import { checkAuth, Profileupdate, Userlogin, Usersignup ,logout} from "../Controllers/UserControllers.js";

const router = express.Router();

router.post("/login" , Userlogin)
router.post("/register" , Usersignup)
router.put("/update" ,isAuthenticated, Profileupdate)
router.get("/check" , isAuthenticated , checkAuth)
router.get("/logout" , logout)

                                        
export default router;



import {Router} from "express"
import CourseController from "../controllers/courseController.js"

const router = Router();

router.post("/", CourseController.create)
router.get("/", CourseController.getAll)
router.get("/code/:code", CourseController.getByCode)
router.get("/:id", CourseController.get)
router.put("/:id", CourseController.update)
router.delete("/:id", CourseController.delete)

export default router
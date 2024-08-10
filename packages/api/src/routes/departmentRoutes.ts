import { Router } from 'express';
import { DepartmentController } from '@/controllers/departmentController';

const router = Router();

router.get('/', DepartmentController.getAll);
router.post('/', DepartmentController.create);

export default router;

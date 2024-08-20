import DepartmentController from '@/controller/DepartmentController';
import ProgramController from '@/controller/ProgramController';
import CurriculumController from '@/controller/CurriculumController';
import CurriculumComponentController from '@/controller/CurriculumComponentController';
import ComponentController from '@/controller/ComponentController';
import AcademicHistoryController from '@/controller/AcademicHistoryController';

export const Routes = [
  {
    method: 'post',
    route: '/departments/sigaa-ids',
    controller: DepartmentController,
    action: 'saveId',
  },
  {
    method: 'put',
    route: '/departments/:sigaaId',
    controller: DepartmentController,
    action: 'saveOrUpdate',
  },
  {
    method: 'get',
    route: '/departments',
    controller: DepartmentController,
    action: 'get',
  },
  {
    method: 'post',
    route: '/programs/sigaa-ids',
    controller: ProgramController,
    action: 'saveSigaaIds',
  },
  {
    method: 'put',
    route: '/programs/:sigaaId',
    controller: ProgramController,
    action: 'saveOrUpdate',
  },
  {
    method: 'post',
    route: '/curricula/sigaa-ids',
    controller: CurriculumController,
    action: 'saveSigaaIds',
  },
  {
    method: 'put',
    route: '/curricula/:sigaaId',
    controller: CurriculumController,
    action: 'saveOrUpdate',
  },
  {
    method: 'get',
    route: '/curricula/:sigaaId/program',
    controller: CurriculumController,
    action: 'getProgram',
  },
  {
    method: 'post',
    route: '/components/sigaa-ids',
    controller: ComponentController,
    action: 'saveSigaaIds',
  },
  {
    method: 'post',
    route: '/components',
    controller: ComponentController,
    action: 'saveOrUpdate',
  },
  {
    method: 'post',
    route: '/curricula-components',
    controller: CurriculumComponentController,
    action: 'batchSaveOrUpdate',
  },
  {
    method: 'post',
    route: '/academic-history',
    controller: AcademicHistoryController,
    action: 'extract',
    upload: 'file',
  },
];

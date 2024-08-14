import DepartmentController from '@/controller/DepartmentController';
import ProgramController from '@/controller/ProgramController';

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
];

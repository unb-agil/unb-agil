import DepartmentController from './controller/DepartmentController';

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
];

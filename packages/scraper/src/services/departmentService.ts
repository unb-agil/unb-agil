import { Department, DepartmentParams } from '@/models/departmentModels';

class DepartmentService {
  async storeIds(departmentIds: Department['id'][]): Promise<void> {
    console.log(`Storing ${departmentIds.length} department ids`);
  }

  async update(department: Department) {
    console.log(`Updating department ${department.id} (${department.title})`);
  }

  async get(params: DepartmentParams): Promise<Department> {
    console.log(`Getting department with params: ${JSON.stringify(params)}`);

    const department = {
      id: 673,
      acronym: 'FGA',
      title: 'Faculdade do Gama',
    };

    return department;
  }
}

export default DepartmentService;

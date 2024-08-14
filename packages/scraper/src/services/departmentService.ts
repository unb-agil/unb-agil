import axiosInstance from '@/config/axiosConfig';
import { Department, DepartmentParams } from '@/models/departmentModels';

class DepartmentService {
  async saveIds(departmentIds: Department['id'][]) {
    console.log(`Storing ${departmentIds.length} department ids`);

    await axiosInstance.post('/departments/sigaa-ids', departmentIds);
  }

  async saveOrUpdate(department: Department) {
    console.log(`Updating department ${department.id} (${department.title})`);

    await axiosInstance.put(`/departments/${department.id}`, department);
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

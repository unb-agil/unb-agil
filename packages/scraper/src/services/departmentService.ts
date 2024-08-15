import chalk from 'chalk';
import axiosInstance from '@/config/axiosConfig';
import { Department, DepartmentParams } from '@/models/departmentModels';

const log = (message: string) => console.log(chalk.greenBright(message));
const bold = (message: string | number) => chalk.bold(message);

class DepartmentService {
  async saveIds(departmentIds: Department['sigaaId'][]) {
    log(`Salvando ${bold(departmentIds.length)} IDs de departamentos.`);
    await axiosInstance.post('/departments/sigaa-ids', departmentIds);
  }

  async saveOrUpdate(department: Department) {
    log(`Atualizando departamento ${bold(department.title)}`);
    await axiosInstance.put(`/departments/${department.sigaaId}`, department);
  }

  async get(params: DepartmentParams): Promise<Department> {
    const res = await axiosInstance.get<Department>('/departments', { params });
    return res.data;
  }
}

export default DepartmentService;

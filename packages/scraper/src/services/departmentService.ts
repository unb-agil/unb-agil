import { DepartmentDetails } from '@/models/departmentModels';

class DepartmentService {
  async storeDepartmentIds(departmentIds: number[]): Promise<void> {
    console.log(`Storing ${departmentIds.length} department ids`);
  }

  async storeDepartmentData(departmentId: number, data: DepartmentDetails) {
    const { acronym, title } = data;

    console.log(`Storing department data for  ${acronym} (${title})`);
  }

  async fetchAllDepartmentIds(): Promise<number[]> {
    return await Promise.resolve([673]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDepartmentIdByTitle(title: string): Promise<number> {
    return 673;
  }
}

export default DepartmentService;

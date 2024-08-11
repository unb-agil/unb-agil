import { DepartmentDetails } from '@/models/departmentModels';

class DepartmentService {
  async storeDepartmentId(departmentId: number): Promise<void> {
    console.log(`Storing department ID: ${departmentId}`);
  }

  async fetchAllDepartmentIds(): Promise<number[]> {
    return await Promise.resolve([673]);
  }

  async storeDepartmentDetails(
    departmentId: number,
    departmentDetails: DepartmentDetails,
  ): Promise<void> {
    const { acronym, title } = departmentDetails;

    console.log(
      `Storing department details: ${departmentId} - ${acronym} - ${title}`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDepartmentIdByTitle(title: string): Promise<number> {
    return 673;
  }
}

export default DepartmentService;

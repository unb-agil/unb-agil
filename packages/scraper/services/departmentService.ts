class DepartmentService {
  async createDepartment(departmentId: number): Promise<void> {
    console.log(`Creating department with ID: ${departmentId}`);
  }
}

export default DepartmentService;

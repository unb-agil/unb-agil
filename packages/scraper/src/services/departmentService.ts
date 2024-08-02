class DepartmentService {
  async createDepartment(
    id: number,
    acronym: string,
    title: string,
  ): Promise<void> {
    console.log(`Creating department: ${id} - ${acronym} - ${title}`);
  }
}

export default DepartmentService;

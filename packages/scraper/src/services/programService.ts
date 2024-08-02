class ProgramService {
  async createProgram(
    id: number,
    title: string,
    degree: string,
    shift: string,
    campus: string,
    departmentAcronym: string,
    departmentTitle: string,
  ): Promise<void> {
    console.log(
      `Creating program: ${departmentAcronym} - ${departmentTitle} - ${id} - ${title} - ${degree} - ${shift} - ${campus}`,
    );
  }
}

export default ProgramService;

class ProgramService {
  async storeProgramIds(programIds: number[]): Promise<void> {
    console.log(`Storing program ids: ${programIds.join(', ')}`);
  }

  async storeProgram(title: string, departmentId: number): Promise<void> {
    console.log(`Storing program details: ${title} - ${departmentId}`);
  }

  async fetchProgramIds(): Promise<number[]> {
    return [414924];
  }

  async getAllIds(): Promise<number[]> {
    return [414924, 414916];
  }
}

export default ProgramService;

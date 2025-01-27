import { AppDataSource } from '#data-source.js';
import Curriculum from '#entity/Curriculum.js';

const CurriculumRepository = AppDataSource.getRepository(Curriculum).extend({});

export default CurriculumRepository;

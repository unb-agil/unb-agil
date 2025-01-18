import { AppDataSource } from '@/data-source';
import Curriculum from '@/entity/Curriculum';

const CurriculumRepository = AppDataSource.getRepository(Curriculum).extend({});

export default CurriculumRepository;

import { AppDataSource } from '@/data-source';
import Component from '@/entity/Component';

const ComponentRepository = AppDataSource.getRepository(Component).extend({});

export default ComponentRepository;

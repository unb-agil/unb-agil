import { AppDataSource } from '#data-source.js';
import Component from '#entity/Component.js';

const ComponentRepository = AppDataSource.getRepository(Component).extend({});

export default ComponentRepository;

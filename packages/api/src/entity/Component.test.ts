import { EntityManager } from 'typeorm';
import Component, { ComponentType } from './Component';
import Department from '#entity/Department';

describe('Component Entity', () => {
  let entityManager: EntityManager;

  beforeEach(() => {
    entityManager = new EntityManager(null);
  });

  it('should create a new Component', async () => {
    const department = new Department();
    department.sigaaId = 1;
    department.title = 'Computer Science';

    const component = new Component();
    component.sigaaId = 'COMP123';
    component.title = 'Introduction to Programming';
    component.type = ComponentType.COURSE;
    component.totalWorkload = 60;
    component.prerequisites = { and: ['MATH101'] };
    component.corequisites = { or: ['PHYS101'] };
    component.equivalences = { and: ['COMP101'] };
    component.department = department;
    component.departmentSigaaId = department.sigaaId;

    jest.spyOn(entityManager, 'save').mockResolvedValue(component);

    const savedComponent = await entityManager.save(component);

    expect(savedComponent).toEqual(component);
    expect(savedComponent.sigaaId).toBe('COMP123');
    expect(savedComponent.title).toBe('Introduction to Programming');
    expect(savedComponent.type).toBe(ComponentType.COURSE);
    expect(savedComponent.totalWorkload).toBe(60);
    expect(savedComponent.prerequisites).toEqual({ and: ['MATH101'] });
    expect(savedComponent.corequisites).toEqual({ or: ['PHYS101'] });
    expect(savedComponent.equivalences).toEqual({ and: ['COMP101'] });
    expect(savedComponent.department).toEqual(department);
    expect(savedComponent.departmentSigaaId).toBe(department.sigaaId);
  });

});

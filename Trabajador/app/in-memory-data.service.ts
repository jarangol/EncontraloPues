import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let registros = [
      { tags: 'tags', descripcion: 'Mr. Nice' },
      { tags: 'tags', descripcion: 'Narco' },
      { tags: 'tags', descripcion: 'Bombasto' },
      { tags: 'tags', descripcion: 'Celeritas' },
      { tags: 'tags', descripcion: 'Magneta' },
      { tags: 'tags', descripcion: 'RubberMan' },
      { tags: 'tags', descripcion: 'Dynama' },
      { tags: 'tags', descripcion: 'Dr IQ' },
      { tags: 'tags', descripcion: 'Magma' },
      { tags: 'tags', descripcion: 'Tornado' }
    ];
    return {registros};
  }
}
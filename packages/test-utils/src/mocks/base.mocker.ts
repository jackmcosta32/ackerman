import type { Range } from '@workspace/shared';
import { faker, type Faker } from '@faker-js/faker';

export type MockParams<Model> = Partial<{
  [Key in keyof Model]: Model[Key] | ((factory: Faker) => Model[Key]);
}>;

export abstract class BaseMocker<Model> {
  protected factory: Faker = faker;

  protected abstract get model(): Model;

  public mockMany(
    quantity?: number | Range,
    params?: MockParams<Model>,
  ): Model[] {
    let length: number;

    switch (typeof quantity) {
      case 'number':
        length = quantity;
        break;

      case 'object':
        length = this.factory.number.int(quantity);
        break;

      default:
        length = 1;
        break;
    }

    return Array.from({ length }).map(() => this.mock(params));
  }

  public mock(params?: MockParams<Model>): Model {
    const model = this.model;

    if (!params) return model;

    return Object.entries(params).reduce(
      (acc, [key, value]) => {
        let computedValue = value;

        if (typeof value === 'function') {
          computedValue = value(this.factory);
        }

        acc[key as keyof Model] = computedValue as Model[keyof Model];

        return acc;
      },
      { ...model },
    );
  }
}

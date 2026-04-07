import {
  constructorReducer,
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearBurger,
  burgerConstructorSelector
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const testBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

const testFilling: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093f',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
};

const testSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

const buildBurger = (...items: TIngredient[]) =>
  items.reduce((state, item) => constructorReducer(state, addIngredient(item)), initialState);

describe('constructorSlice reducer', () => {
  it('возвращает initialState при неизвестном action', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('добавляет булку', () => {
    const state = buildBurger(testBun);

    expect(state.burger).toMatchObject({ bun: { _id: testBun._id, type: 'bun' }, ingredients: [] });
    expect(state.burger.bun?.id).toEqual(expect.any(String));
  });

  it('добавляет начинку и назначает id', () => {
    const state = buildBurger(testFilling);

    expect(state.burger.ingredients).toHaveLength(1);
    expect(state.burger.ingredients[0]).toMatchObject({ _id: testFilling._id, type: 'main' });
    expect(state.burger.ingredients[0].id).toEqual(expect.any(String));
  });

  it('удаляет начинку, не затрагивая другой ингредиент', () => {
    const state = buildBurger(testFilling, testSauce);
    const filling = state.burger.ingredients.find((item) => item.type === 'main')!;

    const nextState = constructorReducer(state, removeIngredient(filling.id));

    expect(nextState.burger.ingredients).toHaveLength(1);
    expect(nextState.burger.ingredients[0]).toMatchObject({ _id: testSauce._id, type: 'sauce' });
  });

  it('перемещает ингредиенты', () => {
    const state = buildBurger(testFilling, testSauce);
    const nextState = constructorReducer(state, moveIngredient({ from: 0, to: 1 }));

    expect(nextState.burger.ingredients.map((item) => item._id)).toEqual([
      testSauce._id,
      testFilling._id
    ]);
  });

  it('заменяет булку новой булкой', () => {
    const testBun2: TIngredient = {
      ...testBun,
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Краторная булка N-200i'
    };
    const state = buildBurger(testBun, testBun2);

    expect(state.burger.bun).toMatchObject({ _id: testBun2._id, type: 'bun' });
    expect(state.burger.ingredients).toHaveLength(0);
  });

  it('сбрасывает бургер при clearBurger', () => {
    const state = constructorReducer(buildBurger(testBun, testFilling), clearBurger());

    expect(state).toEqual(initialState);
  });

  it('селектор возвращает burger', () => {
    const state = buildBurger(testBun, testFilling);

    expect(burgerConstructorSelector({ burgerConstructor: state } as any)).toEqual(state.burger);
  });
});

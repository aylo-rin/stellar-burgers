import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDrop } from 'react-dnd';

import { userSelector } from '../../services/slices/userSlice';
import {
  burgerConstructorSelector,
  clearBurger,
  addIngredient
} from '../../services/slices/constructorSlice';

import {
  postNewOrderThunk,
  newOrderSelector,
  orderRequestSelector,
  clearOrder
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(userSelector);

  const constructorItems = useSelector(burgerConstructorSelector) ?? {
    bun: null,
    ingredients: []
  };

  const newOrder = useSelector(newOrderSelector);
  const orderRequest = useSelector(orderRequestSelector);

  const [, dropRef] = useDrop({
    accept: 'ingredient',
    drop: (item: TIngredient) => {
      dispatch(addIngredient(item));
    }
  });

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(postNewOrderThunk(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearBurger());
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <div ref={dropRef}>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={newOrder.order as TOrder | null}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
    </div>
  );
};

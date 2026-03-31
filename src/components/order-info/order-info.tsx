import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { orderByNumberSelector } from '../../services/slices/feedSlice';
import { useParams } from 'react-router-dom';
import {
  ingredientsLoadingSelector,
  ingredientsSelector
} from '../../services/slices/ingredientsSlice';
import { useEffect } from 'react';
import { getOrderByNumberThunk } from '../../services/slices/feedSlice';
import { orderLoadingSelector } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const isIngredientsLoading = useSelector(ingredientsLoadingSelector);
  const isOrderLoading = useSelector(orderLoadingSelector);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumberThunk(Number(number)));
    }
  }, [dispatch]);

  const orderData = useSelector(orderByNumberSelector);

  const ingredients: TIngredient[] = useSelector(ingredientsSelector);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (isOrderLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

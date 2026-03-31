import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDrag } from 'react-dnd';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient } from '../../services/slices/constructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    const [{ isDragging }, dragRef] = useDrag({
      type: 'ingredient',
      item: ingredient,
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });

    return (
      <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <BurgerIngredientUI
          ingredient={ingredient}
          count={count}
          locationState={{ background: location }}
          handleAdd={handleAdd}
        />
      </div>
    );
  }
);

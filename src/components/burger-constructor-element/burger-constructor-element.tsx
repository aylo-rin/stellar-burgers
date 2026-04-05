import { FC, memo, useRef } from 'react';
import { useDispatch } from '../../services/store';
import { useDrag, useDrop } from 'react-dnd';

import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
      accept: 'constructor-ingredient',
      hover(item: { index: number }) {
        if (!ref.current) return;

        if (item.index === index) return;

        dispatch(
          moveIngredient({
            from: item.index,
            to: index
          })
        );

        item.index = index;
      }
    });

    const [{ isDragging }, drag] = useDrag({
      type: 'constructor-ingredient',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });

    drag(drop(ref));

    const handleMoveDown = () => {
      dispatch(moveIngredient({ from: index, to: index + 1 }));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredient({ from: index, to: index - 1 }));
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <BurgerConstructorElementUI
          ingredient={ingredient}
          index={index}
          totalItems={totalItems}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleClose={handleClose}
        />
      </div>
    );
  }
);

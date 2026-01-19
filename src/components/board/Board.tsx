import type { ColumnType } from '@/types/column';
import BoardHeader from './boardHeader';
import { useColumns } from '@/store/boardSelectors';
import Column from '../column';

import './Board.scss';

export default function Board() {
  const columns = useColumns();

  return (
    <div className="Board">
      <BoardHeader />
      <ul className="Board__content">
        {columns.map((column: ColumnType) => (
          <Column key={column.id} item={column} />
        ))}
      </ul>
    </div>
  )
}

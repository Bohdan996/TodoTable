import { useState } from 'react';

import Button from '@/components/ui/button';
import SearchInput from '@/components/ui/searchInput';
import ColumnFormModal from '@/components/ui/columnFormModal';
import { useBoardStore } from '@/store/boardStore';

import './BoardHeader.scss';

export default function BoardHeader() {
  const [isSelectedAll, setSelectedAll] = useState(false);
  const [isOpenAddModal, setOpenAddModal] = useState(false);

  const setSearchQuery = useBoardStore((state) => state.setSearchQuery);

  return (
    <div className="BoardHeader">
      <div className="BoardHeader__top">
        <SearchInput 
          placeholder="Search"
          inputSize="md"
          color="primary"
          variant="outline"
          onChange={setSearchQuery}
        />

        <Button 
          content="+ Add Column"
          variant="outline"
          color="primary"
          size="md"
          action={() => setOpenAddModal(true)}
        />
      </div>
      <div className="BoardHeader__bottom">
        <Button 
          content="Select all"
          variant="outline"
          color="primary"
          size="md"
          action={() => setSelectedAll(!isSelectedAll)}
        />
      </div>
      {isOpenAddModal && <ColumnFormModal 
        type="create"
        closeAction={() => setOpenAddModal(false)}
      />}
    </div>
  )
}

import { useState } from 'react';

import Button from '@/components/ui/button';
import SearchInput from '@/components/ui/searchInput';
import ColumnFormModal from '@/components/ui/columnFormModal';
import { useBoardStore } from '@/store/boardStore';
import Modal from '@/components/ui/modal';
import NewColumnModal from '@/components/ui/newColumnModal';
import BoardMobileActions from '../boardMobileActions';
import BoardDesctopActions from '../boardDesctopActions';

import './BoardHeader.scss';

export default function BoardHeader() {
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
  const [isOpenNewColumnModal, setOpenNewColumnModal] = useState(false);

  const selectedTaskIds = useBoardStore((state) => state.selectedTaskIds);
  const isSelectedAllTasks = useBoardStore((state) => state.isSelectedAllTasks);
  const globalTaskFilter = useBoardStore((state) => state.globalTaskFilter);
  const setSearchQuery = useBoardStore((state) => state.setSearchQuery);
  const setGlobalTaskFilter = useBoardStore((state) => state.setGlobalTaskFilter);
  const selectAllTasks = useBoardStore((state) => state.selectAllTasks);
  const clearSelection = useBoardStore((state) => state.clearSelection);
  const completeSelected = useBoardStore((s) => s.completeAllSelectedTasks);
  const incompleteSelected = useBoardStore((s) => s.incompleteAllSelectedTasks);
  const deleteSelected = useBoardStore((s) => s.deleteAllSelectedTasks);

  const clickOnShowComplete = () => {
    if (globalTaskFilter === "completed") {
      setGlobalTaskFilter("all");
    } else {
      setGlobalTaskFilter("completed");
    }
  }

  const clickOnShowIncomplete = () => {
    if (globalTaskFilter === "incompleted") {
      setGlobalTaskFilter("all");
    } else {
      setGlobalTaskFilter("incompleted");
    }
  }

  const deleteAllSelectedTasks = () => {
    deleteSelected();
    setOpenDeleteModal(false);
  }

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
          content={
            isSelectedAllTasks
            ? "Unselect all"
            : "Select all"
          }
          variant="outline"
          color="primary"
          size="md"
          action={() => 
            isSelectedAllTasks
            ? clearSelection()
            : selectAllTasks()
          }
        />

        <Button 
          content="Show completed"
          variant={globalTaskFilter === "completed" ? "fill" : "outline"}
          color="primary"
          size="md"
          action={clickOnShowComplete}
        />

        <Button 
          content="Show incompleted"
          variant={globalTaskFilter === "incompleted" ? "fill" : "outline"}
          color="primary"
          size="md"
          action={clickOnShowIncomplete}
        />

        {selectedTaskIds?.length > 0 && (
          <>
            <div className="BoardHeader__mobile-actions">
              <BoardMobileActions 
                completeSelected={completeSelected} 
                incompleteSelected={incompleteSelected} 
                setOpenNewColumnModal={() => setOpenNewColumnModal(true)} 
                setOpenDeleteModal={() => setOpenDeleteModal(true)}                
              />
            </div>

            <div className="BoardHeader__desktop-actions">
              <BoardDesctopActions
                completeSelected={completeSelected} 
                incompleteSelected={incompleteSelected} 
                setOpenNewColumnModal={() => setOpenNewColumnModal(true)} 
                setOpenDeleteModal={() => setOpenDeleteModal(true)}    
              />
            </div>
          </> 
        )}
      </div>
      {isOpenAddModal && 
        <ColumnFormModal 
          type="create"
          closeAction={() => setOpenAddModal(false)}
        />
      }
      {isOpenDeleteModal && 
        <Modal
          title="Delete tasks?"
          description="All selected tasks it will be permanently removed."
          closeAction={() => setOpenDeleteModal(false)}
          action={deleteAllSelectedTasks}
          actionBtnText="Delete"
        />
      }
      {isOpenNewColumnModal && 
        <NewColumnModal 
          closeAction={() => setOpenNewColumnModal(false)}
        />
      }
    </div>
  )
}
import React from 'react'
import type { PageDTO } from '../types';
import NewTiptapEditor from './Editor/NewTiptapEditor';

type Props = {
  notebookId: number;
  page?: PageDTO;
  onSaved?: (page: PageDTO) => void;
};

const NewPageEditor: React.FC<Props> = () => {
  return (
    <div>
        <NewTiptapEditor />
    </div>
  )
}

export default NewPageEditor
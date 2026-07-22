// import React from 'react'
import { BsPlusLg } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { AddNoteTrue } from '../store/slice/noteSlice'

const AddButton = () => {
  const dispatch = useDispatch();
  return (
    <button 
    onClick={() => dispatch(AddNoteTrue())}
  className="fixed bottom-6 right-6 md:bottom-10 md:right-10 
             w-14 h-14 md:w-16 md:h-16 
             rounded-full bg-purple-600 text-white 
             shadow-lg hover:shadow-purple-500/50 
             flex items-center justify-center 
             z-50 transition-all hover:scale-110 active:scale-95"
  // onClick={...}
>
  <BsPlusLg size={24} />
</button>
  )
}

export default AddButton
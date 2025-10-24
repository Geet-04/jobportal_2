import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '../redux/jobSlice';

const HeroSection = () => {
  const [query, setQuery] = useState(""); // local state for the input box , This just tracks what the user types before they click the search button.
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query)); //This sends the text (stored in query) to Redux → updates the global searchQuery
    navigate("/browse"); //Then navigates to /browse so your Browse page can access that value.
  }

  return (
    <div className='text-center'>
      <span className='px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 job Hunt Website</span>
      <h1 className='text-5xl font-bold'>Search, Apply & <br/> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
      <p className="mt-4 text-lg text-gray-700">
        Find top job opportunities across industries. <br />
        Apply easily and kickstart your career today.
      </p>
      <div className='flex w-[40%] shadow -lg border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
        <input
          type="text"
          placeholder='Find your dream jobs'
          onChange={(e) => setQuery(e.target.value)}
          className='outline-none border-none w-full'
        />
        <Button onClick={searchJobHandler}className='rounded-r-full bg-[#6A38C2]'>
          <Search className='h-5 w-5'/>
        </Button>
      </div>
    </div>
  )
}

export default HeroSection 

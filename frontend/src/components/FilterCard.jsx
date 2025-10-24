import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '../redux/jobSlice'

const filterData = [
  {
    filterType:"Location",
    array:["Delhi","Bangalore","Hyderabad","Pune","Mumbai","Odisha"]
  },
  {
    filterType:"Industry",
    array:["Frontend Developer","Backend Developer","FullStack Developer"]
  },
  {
    filterType:"Salary",
    array:["0-40k","42-1lakh","1lakh-5lakh"]
  },
  {
    filterType:"Experience",
    array:["0-2yr","2-5yr",">5yr"]
  },
  {
    filterType:"Work mode",
    array:["Work from Office","Remote","Hybrid"]
  },
]
const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) =>{
    setSelectedValue(value);
  }

  useEffect(()=> {
    dispatch(setSearchedQuery(selectedValue));
  },[selectedValue]);

  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1>Filter Jobs</h1>
      <hr className='mt-3'/>
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {
          filterData.map((data,index) => (
            <div>
              <h1 className='font-bold text-lg'>{data.filterType}</h1>
              {
                data.array.map((item,idx) =>{
                  const itemId = `id${index}-${idx}`
                  return (
                    <div className='flex items-center text-gray-700 space-x-2 my-2 '> {/* space-x-2 → Only horizontal spacing, only between children, ignores top/bottom. gap-2 → General spacing for flex/grid, works in both directions (x and y). */}
                      <RadioGroupItem value={item} id={itemId} /> {/* sets what the radio option will store if selected. */}
                      <Label htmlFor={itemId}>{item}</Label>  {/*Label next to <RadioGroupItem> ensures that clicking on the label text ({item}) will select that radio option, making it more user-friendly and accessible.*/}
                    </div>
                  )
                })
              }
            </div>
          ))
        }
      </RadioGroup>
    </div>
  )
}

export default FilterCard

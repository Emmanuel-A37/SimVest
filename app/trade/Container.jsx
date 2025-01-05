import React from 'react'
import SearchBar from './SearchBar'
import PerformanceBar from './PerformanceBar'
import MakeTrade from './MakeTrade'

const Container = () => {
  return (
    <div className="mt-8 mb-10 pb-10">
        <h1 className="text-3xl font-bold ml-5 mb-8">Trade</h1>
        <SearchBar />
        <div className="flex flex-col lg:flex-row-reverse">
          <PerformanceBar /> 
          <MakeTrade />                
        </div>
    </div>
  )
}

export default Container
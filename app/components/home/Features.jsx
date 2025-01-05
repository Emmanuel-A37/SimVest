import { LuPiggyBank, LuTrendingUp } from 'react-icons/lu';
import { RiLineChartLine } from "react-icons/ri";
import React from 'react';

const Features = () => {
    const features = [
        { icon: RiLineChartLine, name: 'Real-time Market Data', description: 'Access up-to-date market information to make informed decisions.' },
        { icon: LuPiggyBank, name: 'Risk-Free Simulations', description: 'Practice investing strategies without risking real money.' },
        { icon: LuTrendingUp, name: 'Performance Analytics', description: 'Track and analyze your investment performance over time.' },
    ];
      

    return (
        <div id="features" className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className=" text-blue-600 font-semibold  uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold  text-gray-900 sm:text-4xl">
                A better way to learn investing
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our investment simulator provides all the tools you need to become a confident investor.
              </p>
            </div>
    
            <div className="mt-10  md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => (
                  <div key={feature.name} className="flex flex-row mb-6">
                    <div className=" flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                       {React.createElement(feature.icon , {className: "h-6 w-6"})}
                    </div>
                    <div >
                        <p className="ml-12 text-lg  font-medium text-gray-900">{feature.name}</p>
                        <p className="mt-2 ml-12  text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
    )
}

export default Features
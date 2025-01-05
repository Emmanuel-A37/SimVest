

const HowItWorks = () => {
    const steps = [
        { id: '01', name: 'Sign Up', description: 'Create your free account in minutes.' },
        { id: '02', name: 'Fund Your Account', description: 'Use virtual funds from your simulation account.' },
        { id: '03', name: 'Start Investing', description: 'Choose from a wide range of stocks, bonds, cryptocurrencies and ETFs.' },
        { id: '04', name: 'Track Performance', description: 'Monitor your investments and learn from the results.' },
      ]
      
    return (
        <div id="how-it-works" className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className=" text-blue-600 font-semibold  uppercase">How It Works</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold  text-gray-900 sm:text-4xl">
                Start your investment journey today
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Follow these simple steps to begin your risk-free investment simulation.
              </p>
            </div>
    
            <div className="mt-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {steps.map((step) => (
                  <div key={step.name} className="flex flex-row mb-6">
                    <div className=" flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <span className="text-lg font-bold">{step.id}</span>
                    </div>
                    <div >
                        <p className="ml-12 text-lg  font-medium text-gray-900">{step.name}</p>
                        <p className="mt-2 ml-12  text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
    )
    
}

export default HowItWorks
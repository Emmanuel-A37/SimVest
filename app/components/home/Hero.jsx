import { investPic } from "@/app/assets"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="bg-white overflow-hidden flex lg:flex-row flex-col max-md:gap-5 mt-[7rem] max-md:mt-[2rem] gap-3">
      <div className="sm:text-center lg:text-left ml-3">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Simulate Your</span>{' '}
          <span className="block text-blue-600 xl:inline">Financial Future</span>
        </h1>
        <p className="mt-3  text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          Experience risk-free investment simulations. Learn, strategize, and gain confidence in your financial decisions with our powerful investment simulator.
        </p>
        <div className="mt-5 sm:mt-8 ">
          <div className="rounded-md shadow">
            <Button 
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent  font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
              Get started
            </Button>
          </div>
        </div>
      </div>
      <div >
      <img
           className="h-59 w-full max-w-[900px] object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
           src={investPic}
           alt="Investment picture"
      />
      </div>
    </div>
    
  )
}


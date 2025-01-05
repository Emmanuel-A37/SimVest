import Link from 'next/link';
import { LuMenu } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { titlePic } from '@/app/assets';

const Header = () => {
  const MenuItem = ({ href, children }) => (
    <Link
      href={href}
      className="text-gray-400 hover:text-gray-700 px-3 py-2 text-base font-medium"
    >
      {children}
    </Link>
  );

  return (
    <header className="flex flex-row items-center justify-between mt-5 mx-2 gap-2">
      <div className="flex flex-row gap-1">
        <img src={titlePic} className="max-w-[40px] max-h-[40px]" alt="Logo" />
        <p className="text-3xl font-extrabold max-md:font-semibold text-blue-600">
          SimVest
        </p>
      </div>
      <nav className="flex gap-5 max-md:hidden">
        <Link href="#features" className="text-base text-gray-400 hover:text-gray-700">
          Features
        </Link>
        <Link href="#how-it-works" className="text-base text-gray-400 hover:text-gray-700">
          How It Works
        </Link>
      </nav>
      <div className="max-md:hidden">
        <Link href="/auth/signin">
          <Button
            variant="outline"
            className="ml-8 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-600 bg-white hover:bg-gray-50"
          >
            Sign in
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button
            className="ml-8 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign up
          </Button>
        </Link>
      </div>

      <div className="flex justify-end md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <LuMenu className="text-lg" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col mt-5">
              <MenuItem href="#features">Features</MenuItem>
              <MenuItem href="#how-it-works">How It Works</MenuItem>
              <div className="pt-4">
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-600 bg-white hover:bg-gray-50 mb-3"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;

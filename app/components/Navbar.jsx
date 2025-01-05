'use client'
import Link from 'next/link';
import { LuMenu } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { titlePic } from '@/app/assets';
import { usePathname } from 'next/navigation';




const Navbar = () => {
    const pathname = usePathname();

    const MenuItem = ({ href, children }) => {
        const isActive = pathname === href;
        return (
          <Link
            href={href}
            className={`px-3 py-2 text-base font-medium ${
              isActive ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {children}
          </Link>
        );
      };
    
      return (
        <header className="flex d flex-row items-center justify-between mt-5 mx-2 gap-2">
          <div className="flex flex-row gap-1">
            <img src={titlePic} className="max-w-[40px] max-h-[40px]" alt="Logo" />
            <p className="text-3xl font-extrabold max-md:font-semibold text-blue-600">
              SimVest
            </p>
          </div>
          <nav className="flex gap-5 max-md:hidden">
            <MenuItem href="/dashboard">Dashboard</MenuItem>
            <MenuItem href="/portfolio">Portfolio</MenuItem>
            <MenuItem href="/trade">Trade</MenuItem>
          </nav>
          <div className="max-md:hidden">
            <Link href={'/signout'}>
              <Button
                  variant="outline"
                  className="ml-8 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium bg-blue-600 text-white hover:bg-blue-900"
                  >
                  Sign Out
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
                  <MenuItem href="/dashboard">Dashboard</MenuItem>
                  <MenuItem href="/portfolio">Portfolio</MenuItem>
                  <MenuItem href="/trade">Trade</MenuItem>
                  <div className="pt-4">
                    <Link href={'/signout'}>
                      <Button
                        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Sign Out
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

export default Navbar
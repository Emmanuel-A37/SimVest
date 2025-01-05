'use client'
import useAssetStore from '../hooks/useAssetStore'

const Footer = () => {
    const {asset, setAsset} = useAssetStore();

   


  return (
    <footer className=' bottom-0 fixed mt-10 w-full h-[70px] flex bg-white flex-row items-center justify-around'>
        <p className={`text-medium p-2 rounded-xl  cursor-pointer ${asset == 'stocks' ? 'bg-blue-200 text-blue-700' : 'bg-white text-gray-500'}`}
         onClick={() => setAsset("stocks")}>
            Stocks
        </p>
        <p className={`text-medium p-2 rounded-xl cursor-pointer ${asset == 'crypto' ? 'bg-blue-200 text-blue-700' : 'bg-white text-gray-500'}`}
         onClick={() => setAsset("crypto")}>
            Crypto
        </p>
    </footer>
  )
}

export default Footer
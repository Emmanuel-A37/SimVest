import {create} from 'zustand';

 const useAssetStore = create((set) => ({
  asset: 'stocks',
  setAsset: (newAsset) => set({ asset: newAsset }),
}));


export  default useAssetStore;
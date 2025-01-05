import {create} from 'zustand';

 const useTicker = create((set) => ({
  ticker: '',
  setTicker: (newTicker) => set({ ticker: newTicker }),
}));


export  default useTicker;
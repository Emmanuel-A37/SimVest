import {create} from 'zustand';

 const useNameStore = create((set) => ({
  name: '',
  setName: (newName) => set({ name: newName }),
}));


export  default useNameStore;
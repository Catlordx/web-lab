import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: { name: '', email: '', balance: '', birthdate: '', },
  setUser: (userData) => set({ user: userData }),
}))

export default useUserStore;
import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: { name: '', email: '', balance: '', birthdate: '', phone: '', avatar: '' },
  setUser: (userData) => set({ user: userData }),
}))

export default useUserStore;
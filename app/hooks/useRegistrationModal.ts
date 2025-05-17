import { create } from 'zustand';

interface RegistrationModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useRegistrationModal = create<RegistrationModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

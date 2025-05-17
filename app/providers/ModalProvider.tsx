'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRegistrationModal } from '@/app/hooks/useRegistrationModal';

const RegistrationModal = dynamic(() => import('@/app/components/registration/RegistrationModal'), {
  ssr: false,
});

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, onClose } = useRegistrationModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <RegistrationModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

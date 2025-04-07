'use client';

import { Suspense } from 'react';
import PageContent from './components/PageContent';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Carregando formulário...</div>}>
      <PageContent />
    </Suspense>
  );
}

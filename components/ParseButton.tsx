'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ParseButton({ onParse }: { onParse: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <button
      onClick={onParse}
      className="border border-black-500 text-black-500 px-4 py-2 rounded hover:bg-black-500"
      type="button"
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Parse/GET'}
    </button>
  );
}
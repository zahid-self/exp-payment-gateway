'use client'
import React, { useState } from 'react'
import { cancelSub } from '~/app/actions'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { LoaderIcon } from 'react-hot-toast';

const UnsubscribeButton = ({ id, status }: { id: string, status: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    await cancelSub(id);
    setIsLoading(false);
    router.refresh();
  };

  return (
    <Button onClick={handleClick} className="flex items-center mt-auto text-white bg-indigo-500 border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-600 rounded" disabled={isLoading || status === 'cancelled'}>Unsubscribe
      {isLoading ? <LoaderIcon className='mr-2' /> : null}
      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </Button>
  )
}

export default UnsubscribeButton
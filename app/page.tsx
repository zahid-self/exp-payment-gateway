'use client';
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useUser } from "@stackframe/stack";

export default function Home() {

  useUser({ or: 'redirect' })
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null)
  const router = useRouter();

  async function handleParseData() {
    setIsLoading(true)
    try {
      const response = await axios.get('http://localhost:3000/api/scraper?apiKey=5d6aa8e5-2298-4fe7-a714-06a7a276f490&engine=true');
      let data = await response.data;
      setParsedData(data);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setIsLoading(false)
        return { success: false, error: error }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">

      <div className="flex mt-8 items-center justify-between h-full">
        <aside className="w-1/4 border-r-2 border-black-500 p-4">
          <button
            onClick={handleParseData}
            className="border border-black-500 text-black-500 px-4 py-2 rounded hover:bg-black-500"
            type="button"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Parse/GET'}
          </button>
        </aside>
        <main className="flex-1 p-4">
          <h2 className="text-black-500 mb-2">Api Response</h2>
          <div className="border border-black-500 p-4 h-full">
            {
              parsedData ?
                <pre>{JSON.stringify(parsedData, null, 2)}</pre>
                :
                <p>No data available. Click Parse/GET to fetch data.</p>
            }
          </div>
        </main>
      </div>
    </div>
  );
}
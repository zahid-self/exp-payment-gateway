'use client';
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useUser } from "@stackframe/stack";

export default function Home() {

  const user = useUser({ or: 'redirect' });
  const [isLoading, setIsLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleParseData() {
    setIsLoading(true);
    setErrorMessage(null);
    setParsedData(null);
    try {
      const response = await axios.get(`/api/scraper?apiKey=${user.primaryEmail}&engine=true`);
      if (response.status === 200) {
        const data = response.data;
        setParsedData(data);
        router.refresh();
      } else {
        setErrorMessage('Something went wrong!')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || 'An error occurred while fetching data.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="container mx-auto p-4">
      <div className="flex mt-8 items-start justify-between h-full">
        <aside className="w-1/4 border-r-2 border-black-500 p-4 flex flex-col">
          <button
            onClick={handleParseData}
            className="border border-black-500 text-black-500 px-4 py-2 rounded hover:bg-black-500 mb-4"
            type="button"
            disabled={isLoading}
          >
            Parse/GET
          </button>
        </aside>
        <main className="flex-1 px-4">
          <div className="border border-black-500 p-4 h-full overflow-auto">
            <h2 className="text-black-500 pb-2 border-b-2">Api Response</h2>
            {isLoading && <p>Loading...</p>}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {parsedData && (
              <pre className="text-wrap overflow-x-auto whitespace-pre-wrap overflow-y-auto h-[800px]">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
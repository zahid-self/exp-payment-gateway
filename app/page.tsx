import React from "react";
import Navbar from "~/components/Navbar";
import { getAPICredit, parseData, getParsedData } from "./actions";
import ParseButton from "~/components/ParseButton";
import { stackServerApp } from "~/stack";

export default async function Home() {

  await stackServerApp.getUser({ or: 'redirect' });

  const apiCredit = await getAPICredit();
  const parsedData = await getParsedData();
  console.log(parseData);

  return (
    <div className="container mx-auto p-4">
      <Navbar apiCredit={apiCredit} />

      <div className="flex mt-8 items-center justify-between h-full">
        <aside className="w-1/4 border-r-2 border-black-500 p-4">
          <ParseButton onParse={parseData} />
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
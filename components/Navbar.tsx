import React from 'react';
import { UserButton } from "@stackframe/stack"

const Navbar = ({ apiCredit }: { apiCredit: any }) => {
  return (
    <header className="flex justify-between items-center border-b-2 border-black-500 py-4">
      <div className="text-black-500 text-2xl">Logo</div>
      <nav className="flex space-x-8 text-black-500">
        <a href="/" className="hover:underline">Playground</a>
        <a href="/pricing" className="hover:underline">Pricing</a>
        <div className="border border-black-500 px-4 py-1">Api Credit: {apiCredit?.usedCredit}/{apiCredit?.apiCredit}</div>
        <UserButton />
      </nav>
    </header>
  )
}

export default Navbar
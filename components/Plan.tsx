import React from 'react'
import SubscribeButton from './SubscribeButton';


const Plan = ({ plan }: { plan: any }) => {
  const { description, productName, name, price } = plan.attributes;
  const variantId = plan.relationships.variants.data[0].id;
  return (
    <>
      <div className="lg:w-1/3 lg:mt-px w-full mb-10 lg:mb-0 border-2 border-gray-300 lg:border-none rounded-lg lg:rounded-none">
        <div className="px-2 text-center h-48 flex flex-col items-center justify-center">
          <h3 className="tracking-widest">{name}</h3>
          <h2 className="text-3xl text-gray-900 font-medium leading-none mb-4 mt-2">{price}</h2>
          <span className="text-sm text-gray-600">Next 1 months</span>
        </div>
        <p className="bg-gray-100 text-gray-600 h-12 text-center px-2 flex items-center -mt-px justify-center border-t border-gray-300">Schlitz single-origin</p>
        <p className="text-gray-600 text-center h-12 flex items-center justify-center">
          <span className="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" className="w-3 h-3" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </span>
        </p>
        <p className="bg-gray-100 text-gray-600 text-center h-12 flex items-center justify-center">
          <span className="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" className="w-3 h-3" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </span>
        </p>
        <p className="h-12 text-gray-600 px-6 text-center leading-relaxed flex items-center justify-center">Feature</p>
        <p className="bg-gray-100 text-gray-600 text-center h-12 flex items-center justify-center">
          <span className="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" className="w-3 h-3" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </span>
        </p>
        <p className="text-gray-600 text-center h-12 flex items-center justify-center">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </p>
        <p className="bg-gray-100 text-gray-600 text-center h-12 flex items-center justify-center">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </p>
        <p className="text-gray-600 text-center h-12 flex items-center justify-center">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </p>
        <p className="bg-gray-100 text-gray-600 text-center h-12 flex items-center justify-center">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </p>
        <div className="border-t border-gray-300 p-6 text-center rounded-bl-lg">
          <SubscribeButton variantId={variantId} />
        </div>
      </div>
    </>
  )
}

export default Plan
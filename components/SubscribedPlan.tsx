'use client';
import Link from 'next/link';
import UnsubscribeButton from './UnsubscribeButton';

type SubscribedPlanProps = {
  plan: any,
  subscription: any,
  subscriptionUrls: any
}

const SubscribedPlan = ({ plan, subscription, subscriptionUrls }: SubscribedPlanProps) => {
  const subscribedPlan = plan?.filter((plan: any) => plan.id === subscription.planId)[0];
  return (
    <>
      <div className="lg:w-4/4 lg:mt-px w-full mb-10 lg:mb-0 border-2 border-gray-300 lg:border-none rounded-lg lg:rounded-none">
        <Link href={subscriptionUrls?.update_payment_method} className='flex w-full justify-end pr-2'>Update payment gateway</Link>
        <div className="px-2 text-center h-48 flex flex-col items-center justify-center">
          <h3 className="tracking-widest">{subscribedPlan.attributes.name}</h3>
          <h2 className="text-5xl text-gray-900 font-medium leading-none mb-4 mt-2">{subscribedPlan.attributes.price}</h2>
          <span className="text-sm text-gray-600">{subscribedPlan.attributes?.price_formatted}</span>
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
          <UnsubscribeButton id={subscription.subscriptionId} status={subscription.status} />
        </div>
      </div>
    </>
  )
}

export default SubscribedPlan
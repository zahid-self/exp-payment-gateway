import React from 'react';
import { listProducts } from "@lemonsqueezy/lemonsqueezy.js";
import Plan from '~/components/Plan';
import { getUserSubscriptions } from '../actions';
import SubscribedPlan from '~/components/SubscribedPlan';
import { configureLemonSqueezy } from '~/config/lemonsqueezy';


const PricingPage = async () => {

  async function syncPlans() {
    try {
      configureLemonSqueezy();

      const products = await listProducts({
        include: ['variants'],
        filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID, },
      });

      return products.data?.data;
    } catch (error) {
      console.log(error)
    }
  }

  const subscription = await getUserSubscriptions();

  console.log(subscription);

  const allPlans = await syncPlans();


  if (!allPlans?.length) {
    return <p className='h-screen flex items-center'>No plans available.</p>
  }

  return (
    <div className='container mx-auto p-4'>
      <section className='flex justify-center w-full'>
        <div className="text-gray-700 body-font overflow-hidden w-4/6 flex items-center justify-center">
          <div className="container px-5 py-24 mx-auto flex flex-wrap">
            <div className={`lg:w-1/4 mt-48 hidden lg:block`}>
              <div className="mt-px border-t border-gray-300 border-b border-l rounded-tl-lg rounded-bl-lg overflow-hidden">
                <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start -mt-px">Fingerstache disrupt</p>
                <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">Franzen hashtag</p>
                <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start">Tilde art party</p>
                <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">Banh mi cornhole</p>
                <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start">Waistcoat squid hexagon</p>
                <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">Pinterest occupy authentic</p>
                <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start">Brooklyn helvetica</p>
                <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">Long Feature Two</p>
                <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start">Feature One</p>
              </div>
            </div>
            {
              subscription ?
                <div className="flex lg:w-3/4 w-full flex-wrap lg:border border-gray-300 rounded-lg">
                  <SubscribedPlan plan={allPlans} subscription={subscription} />
                </div>
                :
                <div className="flex lg:w-3/4 w-full flex-wrap lg:border border-gray-300 rounded-lg">
                  {allPlans.map((plan, index) => {
                    return <Plan key={`plan-${index}`} plan={plan} />
                  })}
                </div>
            }
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
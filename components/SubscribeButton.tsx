"use client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { axios } from "~/lib/axios";
import { CreateCheckoutResponse } from "../app/api/payment/subscribe/route";
import { LoaderIcon } from "react-hot-toast";
import { useUser } from "@stackframe/stack";

export default function SubscribeButton({ productId }: { productId: string }) {

  const [loading, setLoading] = useState(false);
  const user = useUser();

  const handleClick = async () => {
    try {
      setLoading(true)
      const { checkoutURL } = await axios.post<any, CreateCheckoutResponse>(
        "/api/payment/subscribe",
        { email: user?.primaryEmail, productId, userId: user?.id }
      );
      console.log(checkoutURL);
      window.location.href = checkoutURL;
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err)
    }
  };

  return <Button onClick={handleClick} disabled={loading}>
    {loading ? <LoaderIcon className="mr-2" /> : null}
    Subscribe
  </Button>;
}
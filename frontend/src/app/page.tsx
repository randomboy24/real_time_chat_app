"use client";
import { DialogDemo, proptype } from "@/components/Modal";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

proptype;

export default function Home() {
  const session = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (session.data?.user) {
      setIsLoggedIn(true);
      return;
    }
  }, [session.data]);
  return (
    <div className="flex min-h-screen justify-center items-center">
      {!isLoggedIn && <Button content="signin" />}
      <div className="min-h-[700px] min-w-[500px] border border-black rounded-lg">
        <div className="flex justify-around mt-2">
          <DialogDemo type={proptype.create} />
          <DialogDemo type={proptype.join} />
        </div>
      </div>
    </div>
  );
}

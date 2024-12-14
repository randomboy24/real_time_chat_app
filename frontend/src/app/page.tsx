"use client";
import { DialogDemo, proptype } from "@/components/Modal";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { jwtVerify } from "jose";
import { Loader } from "@/components/Loading";
import { Room } from "@/components/Room";
import { RoomContextProvider } from "./context.";

export default function Home() {
  // const session = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [inRoom, setInRoom] = useState(false);
  useEffect(() => {
    console.log("jwt_secrete :- " + "secret");
    async function checkJwt() {
      const token: string = localStorage.getItem("token") || "";
      try {
        const secret = new TextEncoder().encode(
          process.env.NEXT_PUBLIC_JWT_SECRET
        );
        const user = await jwtVerify(token, secret);
        if (user) {
          console.log(user.payload.username);

          console.log("reached here");
          setIsLoggedIn(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.log("error occured");
        console.log(err);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    }

    checkJwt();
  }, []);

  if (isLoading) {
    return (
      <div className="text-black min-h-screen flex justify-center items-center">
        <div>
          <Loader />
        </div>
      </div>
    );
  }
  return (
    <RoomContextProvider>
      <div>
        {/* <Appbar isLoggedIn={isLoggedIn}/>   */}
        <div className="flex min-h-screen justify-center  nter items-center">
          {isLoggedIn ? (
            inRoom ? (
              <Room />
            ) : (
              <div className="min-h-[700px] min-w-[500px] border border-black rounded-lg">
                <div className="flex justify-around mt-2">
                  <DialogDemo type={proptype.create} setInRoom={setInRoom} />
                  <DialogDemo type={proptype.join} setInRoom={setInRoom} />
                </div>
              </div>
            )
          ) : (
            <div className="min-h-[700px] flex flex-col min-w-[500px] border border-black rounded-lg justify-center items-center ">
              <div className="flex flex-col border p-10 border-black rounded-lg gap-y-4 items-center">
                <Input
                  className="w-40"
                  placeholder="username"
                  onChange={(e) => {
                    setUserData((userData) => ({
                      ...userData,
                      username: e.target.value,
                    }));
                  }}
                ></Input>
                <Input
                  className="w-40"
                  type="password"
                  placeholder="password"
                  onChange={(e) => {
                    setUserData((userData) => ({
                      ...userData,
                      password: e.target.value,
                    }));
                  }}
                ></Input>
                <Button
                  className="w-20"
                  onClick={() => {
                    fetch("http://localhost:3001/signup", {
                      method: "POST",
                      headers: { "content-Type": "application/json" },
                      body: JSON.stringify({
                        username: userData.username,
                        password: userData.password,
                      }),
                    })
                      .then((res) => res.json())
                      .then(async (data) => {
                        if (data.message) {
                          alert("jdjgklsgjlkj");
                          return;
                        }
                        try {
                          console.log(data.token);
                          const secret = new TextEncoder().encode(
                            process.env.NEXT_PUBLIC_JWT_SECRET
                          );
                          const user = await jwtVerify(data.token, secret);
                          console.log("user :- " + user);
                          if (user) {
                            console.log(user);
                            setIsLoggedIn(true);
                          } else {
                            setIsLoggedIn(false);
                          }
                        } catch (err) {
                          console.log("error" + err);
                        }
                        localStorage.setItem("token", data.token);
                      })
                      .catch((err) => alert("request failed"));
                  }}
                >
                  Signup
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoomContextProvider>
  );
}

// export default function Home() {
//   useEffect(() => {
//     const secret = new TextEncoder().encode("secret"); // Secret key

//     async function signAndVerifyToken(payload: any) {
//       try {
//         // Sign the JWT
//         const jwt = await new SignJWT(payload)
//           .setProtectedHeader({ alg: "HS256" }) // Use HMAC with SHA-256
//           .setIssuedAt() // Set issued at claim
//           .setExpirationTime("1h") // Set expiration time of 1 hour
//           .sign(secret); // Sign with secret key

//         console.log("Generated Token:", jwt); // Log the generated token

//         // Verify the JWT
//         const { payload: verifiedPayload } = await jwtVerify(
//           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtubGZkc25rbG5qa24iLCJwYXNzd29yZCI6Im5za2xkZm5rbCIsImlhdCI6MTczNDExNzk4MX0.HN1n9y40hAtO2ml6cXE0qPNdXKnFWlhYeR1TYDI9v0A",
//           secret
//         ); // Verify using the same secret
//         console.log("Verified Payload:", verifiedPayload); // Log the decoded payload
//       } catch (error) {
//         console.error("Error signing or verifying the token:", error);
//       }
//     }

//     // Example usage
//     signAndVerifyToken({ user: "johndoe" });
//   }, []);
//   return <div> hello world</div>;
// }

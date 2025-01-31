import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  console.log("Session côté serveur:", session);  
  if (!session) {
    redirect("/");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      Profile
    </div>
  );
};

export default Dashboard;

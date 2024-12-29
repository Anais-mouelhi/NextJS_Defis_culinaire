
import Dashboard from "./dashboard/page";
import Image from "next/image";
export default async function Home() {
 

  return (
    <main>
       {/* Hero Section */}
       <div className="bg-fuchsia-50">
        <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row p-8">
          <div className="flex-1 flex items-center justify-center flex-col gap-8 text-red-500 font-bold">
            <h1 className="text-5xl text-center uppercase p-4 md:p-10 md:text-6xl xl:text-7xl">
              Pret a relever le
            </h1>
          </div>
          <div className="w-full flex-1 relative">
            <Image
              src="/assets/food.jpg"
              alt="Food"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      <Dashboard />
    </main>
  );
}

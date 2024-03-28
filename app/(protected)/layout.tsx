import Navbar from "@/app/(protected)/_components/navbar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center p-5 bg-gradient-to-b from-c-green to-c-green-l">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;

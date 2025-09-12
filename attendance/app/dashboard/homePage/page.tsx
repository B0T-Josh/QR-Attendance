import Sidebar from "@/components/Sidebar";

export default function HomePage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 flex flex-col gap-6">
                    <div className="bg-[#2e2e2ec0] rounded-lg h-full">
                        
                    </div>

                    <div className="bg-[#2e2e2ec0] rounded-lg h-full">
                        
                    </div>
                </div>

                <div className="bg-[#2e2e2ec0] rounded-lg h-full">
                    
                </div>
            </div>
        </div>
    );
}
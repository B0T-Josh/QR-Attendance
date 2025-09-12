import Sidebar from "@/components/Sidebar";

export default function HomePage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="bg-[#2e2e2ec0] rounded-lg flex-1 transition-all duration-500 hover:flex-[3]">
                            
                        </div>
                        <div className="bg-[#2e2e2ec0] rounded-lg flex-1 transition-all duration-500 hover:flex-[3]">
                            
                        </div>
                    </div>

                    <div className="flex-1 bg-[#2e2e2ec0] rounded-lg transition-all duration-500 hover:flex-[3] h-full">
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
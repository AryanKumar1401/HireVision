import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

interface NavigationMenuProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function NavigationMenu({ activeTab, setActiveTab }: NavigationMenuProps) {
    const router = useRouter();

    const handleNavigateToProfile = () => {
        router.push("/candidates/profile");
    };

    const handleNavigateToQuestions = () => {
        router.push("/candidates/generate-questions");
    };

    return (
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-2 mb-8 sticky top-4 z-20 shadow-xl border border-gray-700/50">
            <div className="flex flex-wrap justify-between">
                <div className="flex space-x-1 md:space-x-2">
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 ${activeTab === "pending"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
                            : "text-gray-300 hover:bg-gray-700/70"
                            }`}
                    >
                        Pending Interviews
                    </button>
                    <button
                        onClick={() => setActiveTab("completed")}
                        className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 ${activeTab === "completed"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
                            : "text-gray-300 hover:bg-gray-700/70"
                            }`}
                    >
                        Completed Interviews
                    </button>
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 ${activeTab === "stats"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
                            : "text-gray-300 hover:bg-gray-700/70"
                            }`}
                    >
                        Stats
                    </button>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={handleNavigateToQuestions}
                        className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 
              text-gray-300 hover:bg-gray-700/70 flex items-center gap-1`}
                    >
                        <QuestionAnswerIcon className="h-4 w-4" />
                        <span>Generate Questions</span>
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 
              text-gray-300 hover:bg-gray-700/70 flex items-center gap-1`}
                    >
                        <HomeIcon className="h-4 w-4" />
                        <span>Home</span>
                    </button>

                    <button
                        onClick={handleNavigateToProfile}
                        className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 
              text-gray-300 hover:bg-gray-700/70 flex items-center gap-1`}
                    >
                        <PersonIcon className="h-4 w-4" />
                        <span>My Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
} 
export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0D1321] flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#F48C06]"></div>
                <p className="text-white/80 text-lg">Loading...</p>
            </div>
        </div>
    );
} 
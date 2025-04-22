"use client";
import { ProfileFormData } from "@/types/candidate";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void;
  profileData?: ProfileFormData;
}

export const ProfileForm = ({ onSubmit, profileData }: ProfileFormProps) => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      experience: formData.get("experience") as string,
      linkedin: formData.get("linkedin") as string,
      email: formData.get("email") as string,
    };
    onSubmit(data);

    // Force a reload after submission to refresh the UI state
    setTimeout(() => {
      router.refresh();
      window.location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-black mb-6">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="full_name"
              type="text"
              required
              defaultValue={profileData?.full_name}
              className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              required
              defaultValue={profileData?.phone}
              className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <select
              name="experience"
              required
              defaultValue={profileData?.experience}
              className="mt-1 text-black block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select experience</option>
              <option value="0-2">0-2 years</option>
              <option value="2-5">2-5 years</option>
              <option value="5-8">5-8 years</option>
              <option value="8+">8+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <input
              name="linkedin"
              type="url"
              required
              defaultValue={profileData?.linkedin}
              className="mt-1 block text-black w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

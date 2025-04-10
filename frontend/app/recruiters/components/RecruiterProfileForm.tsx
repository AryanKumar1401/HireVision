import { RecruiterProfile } from "../types";

interface RecruiterProfileFormProps {
  onSubmit: (data: RecruiterProfile) => void;
  profileData?: RecruiterProfile | null;
}

export const RecruiterProfileForm = ({
  onSubmit,
  profileData,
}: RecruiterProfileFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("full_name") as string,
      company: formData.get("company") as string,
      job_title: formData.get("job_title") as string,
      phone: formData.get("phone") as string,
      linkedin: formData.get("linkedin") as string,
      hiring_for: [formData.get("hiring_for") as string], // Simple implementation - can be enhanced for multiple positions
    };
    onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Complete Recruiter Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              name="full_name"
              type="text"
              required
              defaultValue={profileData?.full_name}
              className="mt-1 block w-full text-white rounded-md border border-gray-600 bg-gray-700 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Company
            </label>
            <input
              name="company"
              type="text"
              required
              defaultValue={profileData?.company}
              className="mt-1 block w-full text-white rounded-md border border-gray-600 bg-gray-700 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Job Title
            </label>
            <input
              name="job_title"
              type="text"
              required
              defaultValue={profileData?.job_title}
              className="mt-1 block w-full text-white rounded-md border border-gray-600 bg-gray-700 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={profileData?.phone}
              className="mt-1 block w-full text-white rounded-md border border-gray-600 bg-gray-700 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              LinkedIn URL
            </label>
            <input
              name="linkedin"
              type="url"
              defaultValue={profileData?.linkedin}
              className="mt-1 block text-white w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Currently Hiring For
            </label>
            <input
              name="hiring_for"
              type="text"
              placeholder="e.g. Full Stack Developer"
              defaultValue={profileData?.hiring_for?.[0]}
              className="mt-1 block text-white w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2"
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

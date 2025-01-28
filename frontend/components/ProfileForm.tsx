import { ProfileFormData } from '@/types/candidate';

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void;
  initialData?: ProfileFormData;
}

export const ProfileForm = ({ onSubmit, initialData }: ProfileFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      experience: formData.get('experience') as string,
      linkedin: formData.get('linkedin') as string,
      email: formData.get('email') as string,
    };
    onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="full_name"
              type="text"
              required
              defaultValue={initialData?.full_name}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              name="phone"
              type="tel"
              required
              defaultValue={initialData?.phone}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience Level</label>
            <select
              name="experience"
              required
              defaultValue={initialData?.experience}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select experience</option>
              <option value="0-2">0-2 years</option>
              <option value="2-5">2-5 years</option>
              <option value="5-8">5-8 years</option>
              <option value="8+">8+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input
              name="linkedin"
              type="url"
              required
              defaultValue={initialData?.linkedin}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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

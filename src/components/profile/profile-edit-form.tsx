import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file/file-upload';
import { useProfileStore } from '@/stores/profile-store';
import { profileSchema } from '@/lib/validations/profile';
import type { z } from 'zod';

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileEditForm() {
  const { profile, updateProfile } = useProfileStore();
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      bio: profile?.bio || '',
      interests: profile?.interests?.join(', ') || ''
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setSubmitError('');
      await updateProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        bio: data.bio,
        interests: data.interests.split(',').map(i => i.trim()).filter(Boolean)
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSubmitError('Failed to update profile. Please try again.');
    }
  };

  const handleAvatarUpload = async (url: string) => {
    try {
      setIsUploading(true);
      setSubmitError('');
      await updateProfile({ avatar_url: url });
    } catch (error) {
      console.error('Failed to update avatar:', error);
      setSubmitError('Failed to update avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="bg-red-50 text-orange-600 p-4 rounded-lg text-sm">
          {submitError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <FileUpload
            onUpload={handleAvatarUpload}
            accept="image/*"
            maxSize={5 * 1024 * 1024}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              {...register('firstName')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-orange-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              {...register('lastName')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-orange-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-orange-600">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
            Interests (comma separated)
          </label>
          <input
            {...register('interests')}
            placeholder="AI, Web Development, Design"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
          />
          {errors.interests && (
            <p className="mt-1 text-sm text-orange-600">{errors.interests.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="w-full sm:w-auto"
      >
        {isSubmitting || isUploading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </form>
  );
}
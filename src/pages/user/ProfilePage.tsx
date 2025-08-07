import { useState, useEffect } from 'react';
import { useGetUserQuery, useUpdateUserMutation } from '@/services/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ProfilePage = () => {
  const { data: userData, isLoading } = useGetUserQuery('Auth');
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [form, setForm] = useState({
    email: userData?.email || '',
    userName: userData?.userName || '',
    phone: userData?.phone || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Pour garder le formulaire à jour quand userData arrive
  useEffect(() => {
    setForm({
      email: userData?.email || '',
      userName: userData?.userName || '',
      phone: userData?.phone || '',
    });
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await updateUser(form).unwrap();
      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarFallback className="bg-[#ed7e0f] text-white text-2xl">
              {form.userName?.charAt(0) || ''}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">Mon Profil</h2>
          <p className="text-sm text-gray-500">Gérez vos informations personnelles</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="username"
                required
                value={form.userName}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-[#ed7e0f] focus:border-[#ed7e0f] focus:z-10 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-[#ed7e0f] focus:border-[#ed7e0f] focus:z-10 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-[#ed7e0f] focus:border-[#ed7e0f] focus:z-10 sm:text-sm"
              />
            </div>
          </div>
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <div>
            <button
              type="submit"
              disabled={isUpdating}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#ed7e0f] hover:bg-[#d96c00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed7e0f] transition-all"
            >
              {isUpdating ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 
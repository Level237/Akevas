import { useState, useEffect } from 'react';
import { useGetUserQuery, useUpdateUserMutation } from '@/services/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, User, Phone, CheckCircle, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { data: userData } = useGetUserQuery('Auth');
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [form, setForm] = useState({
    email: userData?.email || '',
    userName: userData?.userName || '',
    phone_number: userData?.phone_number || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      email: userData?.email || '',
      userName: userData?.userName || '',
      phone_number: userData?.phone_number || '',
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
      await updateUser({
        email: form.email,
        userName: form.userName,
        phone_number: form.phone_number,
      });
      setSuccess('Profil mis à jour avec succès !');
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
    }
  };

  return (
    <div className="min-h-screen max-sm:pb-12 bg-gradient-to-br from-[#ed7e0f]/30 to-[#fff7ed] flex flex-col items-center justify-start py-0 px-4 sm:px-6 lg:px-8 relative">
      {/* Header visuel */}
      <div className="w-full h-48 bg-gradient-to-r from-[#ed7e0f] to-[#ffb347] relative flex items-end justify-center">
        <div className="absolute -bottom-14 z-10">
          <Avatar className="h-28 w-28 shadow-xl border-4 border-white">
            <AvatarFallback className="bg-[#ed7e0f] text-white text-4xl">
              {form.userName?.charAt(0) || ''}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      {/* Carte profil */}
      <div className="w-full max-w-lg mt-20 bg-white rounded-2xl shadow-2xl p-8 pt-16 relative flex flex-col items-center animate-fade-in">
        {/* Badge de rôle */}
        <span className="absolute right-8 top-8 px-3 py-1 rounded-full text-xs font-semibold bg-[#ed7e0f]/10 text-[#ed7e0f] border border-[#ed7e0f]/20">
          {userData?.role_id === 1 ? 'Administrateur' : 'Utilisateur'}
        </span>
        {/* Résumé du profil */}
        <h2 className="text-2xl max-sm:text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <User className="w-5 h-5 text-[#ed7e0f]" /> {form.userName || 'Utilisateur'}
        </h2>
        <p className="text-sm max-sm:text-xs text-gray-500 mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#ed7e0f]" /> {form.email || 'Email'}
        </p>
        <p className="text-sm max-sm:text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#ed7e0f]" /> {form.phone_number || 'Téléphone'}
        </p>
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="userName" className="block max-sm:text-xs text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <div className="flex items-center rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-[#ed7e0f] bg-gray-50">
              <User className="ml-3 max-sm:w-4 max-sm:h-4 text-gray-400 w-5 h-5" />
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="username"
                required
                value={form.userName}
                onChange={handleChange}
                className="flex-1 bg-transparent placeholder:text-xs max-sm:text-xs border-none focus:ring-0 px-3 py-2 text-gray-900 placeholder-gray-400 rounded-xl"
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="email" className="block max-sm:text-xs text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-[#ed7e0f] bg-gray-50">
              <Mail className="ml-3 max-sm:w-4 max-sm:h-4 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="flex-1 bg-transparent placeholder:text-xs max-sm:text-xs border-none focus:ring-0 px-3 py-2 text-gray-900 placeholder-gray-400 rounded-xl"
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="phone" className="block max-sm:text-xs text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
            <div className="flex items-center rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-[#ed7e0f] bg-gray-50">
              <Phone className="ml-3 max-sm:w-4 max-sm:h-4 text-gray-400 w-5 h-5" />
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                autoComplete="tel"
                required
                value={form.phone_number}
                onChange={handleChange}
                className="flex-1 bg-transparent placeholder:text-xs max-sm:text-xs border-none focus:ring-0 px-3 py-2 text-gray-900 placeholder-gray-400 rounded-xl"
              />
            </div>
          </div>
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm mb-2 animate-fade-in">
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}
          {error && (
            <div className="text-red-600 text-sm mb-2 animate-fade-in">{error}</div>
          )}
          <div>
            <button
              type="submit"
              disabled={isUpdating}
              className="group max-sm:text-xs relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-[#ed7e0f] to-[#ffb347] hover:from-[#d96c00] hover:to-[#ed7e0f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed7e0f] transition-all shadow-lg"
            >
              {isUpdating ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : null}
              {isUpdating ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 
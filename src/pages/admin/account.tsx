import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mail, Phone, Shield, Edit2, Camera, CheckCircle, Loader2, ArrowLeft, Lock } from 'lucide-react';
import { logoutUser } from '@/lib/logout';
import { useLogoutMutation, useGetUserQuery, useUpdateUserMutation } from '@/services/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export default function AdminAccountPage() {
  const { data: userData } = useGetUserQuery('Auth');
  const [logout] = useLogoutMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const navigate = useNavigate();

  // Avatar state
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [form, setForm] = useState({
    userName: userData?.userName || userData?.firstName || '',
    email: userData?.email || '',
    phone_number: userData?.phone_number || '',
  });
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Password change UI
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  // Mettre à jour le formulaire quand userData arrive
  useEffect(() => {
    setForm({
      userName: userData?.userName || userData?.firstName || '',
      email: userData?.email || '',
      phone_number: userData?.phone_number || '',
    });
  }, [userData]);

  const handleLogout = async () => {
    await logout('Auth');
    logoutUser();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await updateUser({
        email: form.email,
        userName: form.userName,
        phone_number: form.phone_number,
      }).unwrap();
      setSuccess('Profil mis à jour avec succès !');
      setEditing(false);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call change password API
    setShowPasswordForm(false);
  };

  // Avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col items-center justify-start py-0 px-4 sm:px-6 lg:px-8 relative">
      {/* Header visuel */}
      <div className="w-full h-48 bg-gradient-to-r from-orange-500 to-orange-600 relative flex items-end justify-center">
        <div className="absolute -bottom-14 z-10">
          <div className="relative group">
            <Avatar className="h-28 w-28 shadow-xl border-4 border-white">
              {avatar ? (
                <AvatarImage src={avatar} alt="Avatar" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-orange-200 to-orange-400 text-white text-4xl font-bold flex items-center justify-center">
                  {form.userName?.charAt(0) || <User className="w-16 h-16" />}
                </AvatarFallback>
              )}
            </Avatar>
            {/* Overlay interactif */}
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Changer l'avatar"
            >
              <Camera className="w-7 h-7 text-white drop-shadow" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>

      {/* Carte profil principale */}
      <div className="w-full max-w-4xl mt-20 bg-white rounded-2xl shadow-2xl p-8 pt-16 relative">
        {/* Badge de rôle et bouton retour */}
        <div className="absolute right-8 top-8 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-orange-500"
            onClick={() => navigate('/admin/dashboard')}
            aria-label="Retour au tableau de bord"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 border border-orange-200">
            <Shield className="w-3 h-3 inline mr-1" />
            Administrateur
          </span>
        </div>

        {/* Informations du profil */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <User className="w-5 h-5 text-orange-500" /> {form.userName || 'Administrateur'}
          </h2>
          <p className="text-sm text-gray-500 mb-2 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-orange-500" /> {form.email || 'Email'}
          </p>
          <p className="text-sm text-gray-500 mb-6 flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-orange-500" /> {form.phone_number || 'Téléphone'}
          </p>
        </div>

        {/* Messages de succès/erreur */}
        {success && (
          <div className="mb-6 flex items-center justify-center gap-2 text-green-600 text-sm animate-fade-in">
            <CheckCircle className="w-4 h-4" /> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 text-center text-red-600 text-sm animate-fade-in">{error}</div>
        )}

        {/* Formulaire de profil */}
        <form onSubmit={handleProfileSubmit} autoComplete="off" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Label htmlFor="userName" className="text-sm font-medium text-gray-700 mb-2 block">Nom d'utilisateur</Label>
              <div className="relative">
                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={form.userName}
                  onChange={handleInputChange}
                  autoComplete="username"
                  className="pl-10 border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Adresse email"
                  value={form.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  className="pl-10 border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700 mb-2 block">Numéro de téléphone</Label>
              <div className="relative">
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="Numéro de téléphone"
                  value={form.phone_number}
                  onChange={handleInputChange}
                  
                  autoComplete="tel"
                  className="pl-10 border-gray-300 focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6">
            {!editing ? (
              <Button
                type="button"
                onClick={() => setEditing(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg px-8"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
            ) : (
              <>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg px-8"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Mise à jour...
                    </>
                  ) : (
                    'Enregistrer les modifications'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm({
                      userName: userData?.userName || userData?.firstName || '',
                      email: userData?.email || '',
                      phone_number: userData?.phone_number || '',
                    });
                    setEditing(false);
                    setSuccess('');
                    setError('');
                  }}
                >
                  Annuler
                </Button>
              </>
            )}
          </div>
        </form>

        {/* Section mot de passe */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Sécurité du compte
            </h3>
            <p className="text-sm text-gray-500">Modifiez votre mot de passe pour sécuriser votre compte</p>
          </div>

          {!showPasswordForm ? (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Lock className="w-4 h-4 mr-2" />
                Modifier le mot de passe
              </Button>
            </div>
          ) : (
            <form className="max-w-md mx-auto space-y-4" onSubmit={handlePasswordChange}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="old">
                  Ancien mot de passe
                </label>
                <input
                  id="old"
                  name="old"
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 bg-gray-50"
                  value={passwords.old}
                  onChange={e => setPasswords({ ...passwords, old: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="new">
                  Nouveau mot de passe
                </label>
                <input
                  id="new"
                  name="new"
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 bg-gray-50"
                  value={passwords.new}
                  onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirm">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 bg-gray-50"
                  value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3 justify-center pt-4">
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  Changer le mot de passe
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPasswords({ old: '', new: '', confirm: '' });
                    setShowPasswordForm(false);
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Bouton de déconnexion */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="mr-2 h-4 w-4" /> 
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
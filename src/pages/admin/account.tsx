import { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mail, Phone, Shield, Edit2, Camera } from 'lucide-react';
import { logoutUser } from '@/lib/logout';
import { useLogoutMutation, useGetUserQuery } from '@/services/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminAccountPage() {
  const { data: userData } = useGetUserQuery('Auth');
  const [logout] = useLogoutMutation();

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

  // Password change UI
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const handleLogout = async () => {
    await logout('Auth');
    logoutUser();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call update profile API
    setEditing(false);
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
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Sidebar améliorée */}
      <aside className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl px-0 py-0 mt-12 ml-4 max-w-xs w-full border border-orange-100 relative md:sticky md:top-24 overflow-hidden flex flex-col">
        {/* Header avatar section */}
        <div className="bg-gradient-to-br from-orange-200 to-orange-400 flex flex-col items-center justify-center py-10 px-6 relative">
          <div className="relative group">
            <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
              {avatar ? (
                <AvatarImage src={avatar} alt="Avatar" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-orange-200 to-orange-400 text-white text-4xl font-bold flex items-center justify-center">
                  <User className="w-16 h-16" />
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
          <div className="mt-4 text-xl font-bold text-white text-center">{form.userName}</div>
          <div className="flex items-center gap-2 text-orange-50 text-base mt-1">
            <Shield className="w-5 h-5 text-white/80" />
            <span className="font-medium">Administrateur</span>
          </div>
        </div>
        {/* Infos section */}
        <div className="flex flex-col gap-4 px-8 py-8">
          <div className="flex items-center gap-2 text-gray-600 text-base">
            <Mail className="w-4 h-4" />
            <span>{form.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-base">
            <Phone className="w-4 h-4" />
            <span>{form.phone_number || 'Non renseigné'}</span>
          </div>
        </div>
        {/* Actions section */}
        <div className="w-full flex flex-col gap-2 mt-auto px-8 pb-8 border-t pt-6">
          <Button
            variant={showPasswordForm ? "default" : "outline"}
            className="w-full"
            onClick={() => setShowPasswordForm((v) => !v)}
          >
            Modifier le mot de passe
          </Button>
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content dans une Card */}
      <main className="flex-1 flex flex-col justify-center px-8 py-16">
        <Card className="max-w-2xl w-full mx-auto">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Mon profil</CardTitle>
            {!editing && (
              <Button
                variant="ghost"
                size="icon"
                className="text-orange-500"
                onClick={() => setEditing(true)}
                aria-label="Modifier le profil"
              >
                <Edit2 className="w-5 h-5" />
              </Button>
            )}
          </CardHeader>
          <form onSubmit={handleProfileSubmit} autoComplete="off">
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <Label htmlFor="userName">Nom d'utilisateur</Label>
                  <div className="relative">
                    <Input
                      id="userName"
                      name="userName"
                      type="text"
                      placeholder="Nom d'utilisateur"
                      value={form.userName}
                      onChange={handleInputChange}
                      disabled={!editing}
                      autoComplete="username"
                      className="pl-10"
                    />
                    <User className="absolute left-2 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Adresse email"
                      value={form.email}
                      onChange={handleInputChange}
                      disabled={!editing}
                      autoComplete="email"
                      className="pl-10"
                    />
                    <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="phone_number">Numéro de téléphone</Label>
                  <div className="relative">
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      placeholder="Numéro de téléphone"
                      value={form.phone_number}
                      onChange={handleInputChange}
                      disabled={!editing}
                      autoComplete="tel"
                      className="pl-10"
                    />
                    <Phone className="absolute left-2 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
                  </div>
                </div>
              </div>
            </CardContent>
            {editing && (
              <CardFooter className="flex justify-end gap-3 mt-4">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Enregistrer les modifications
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
                  }}
                >
                  Annuler
                </Button>
              </CardFooter>
            )}
          </form>

          {/* Password change form */}
          {showPasswordForm && (
            <form className="mt-10 space-y-4" onSubmit={handlePasswordChange}>
              <h3 className="text-md font-semibold mb-2">Changer le mot de passe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="old">
                    Ancien mot de passe
                  </label>
                  <input
                    id="old"
                    name="old"
                    type="password"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-lg"
                    value={passwords.old}
                    onChange={e => setPasswords({ ...passwords, old: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="new">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="new"
                    name="new"
                    type="password"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-lg"
                    value={passwords.new}
                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50 text-lg"
                    value={passwords.confirm}
                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
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
        </Card>
      </main>
    </div>
  );
}
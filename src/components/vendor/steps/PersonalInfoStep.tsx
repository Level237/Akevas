import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PersonalInfoStep() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name *</Label>
        <Input
          id="fullName"
          className="bg-[#2a2a2a] border-none text-white"
          placeholder="Entrez votre nom complet"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur *</Label>
        <Input
          id="username"
          className="bg-[#2a2a2a] border-none text-white"
          placeholder="Choisissez un nom d'utilisateur"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="genre">Genre *</Label>
        <Select>
          <SelectTrigger className="bg-[#2a2a2a] border-none text-white">
            <SelectValue placeholder="Sélectionnez votre genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="homme">Homme</SelectItem>
            <SelectItem value="femme">Femme</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}


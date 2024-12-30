import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";



export function ContactStep() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label >Email *</Label>
        <Input
          id="email"
          type="email"
          className="bg-[#2a2a2a] border-none text-white"
          placeholder="votre@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label >Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          className="bg-[#2a2a2a] border-none text-white"
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      <div className="space-y-2">
        <Label >Message</Label>
        <Textarea
          id="message"
          className="bg-[#2a2a2a] border-none text-white min-h-[100px]"
          placeholder="Votre message..."
        />
      </div>
    </div>
  )
}


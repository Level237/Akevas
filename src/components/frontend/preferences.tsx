import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export default function Preferences() {
  return (
    <div>
      <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Par Defaut</SelectItem>
    <SelectItem value="hommes">Hommes</SelectItem>
    <SelectItem value="femmes">Femmes</SelectItem>
    <SelectItem value="enfant">Enfant</SelectItem>
  </SelectContent>
</Select>
    </div>
  )
}

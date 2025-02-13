import { formatDistanceToNow } from "date-fns"
import { fr } from 'date-fns/locale'
export const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
  }
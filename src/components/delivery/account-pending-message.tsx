import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card"

export function AccountPendingMessage() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Compte en attente de validation</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation en cours</AlertTitle>
          <AlertDescription>
            Votre compte est actuellement en cours de validation par notre équipe. Cela peut prendre jusqu'à 24 heures.
          </AlertDescription>
        </Alert>
        <p className="mt-4 text-center text-muted-foreground">
          Nous vous enverrons une notification dès que votre compte sera validé. Vous pourrez alors commencer à accepter des
          livraisons.
        </p>
      </CardContent>
      
    </Card>
  )
}


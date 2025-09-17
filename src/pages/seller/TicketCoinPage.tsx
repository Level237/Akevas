import { useParams, Link } from "react-router-dom";
import { useGetTicketCoinQuery } from "@/services/sellerService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TicketCoin = {
    id: number | string
    price: number | string
    user: string
    transaction_ref: string
    payment_of: string
}

const TicketCoinPage = () => {
    const { ref } = useParams();
    const { data, isLoading, isError, refetch } = useGetTicketCoinQuery(ref as string, { skip: !ref });

    if (!ref) {
        return (
            <div className="container mx-auto max-w-2xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Ticket introuvable</CardTitle>
                        <CardDescription>Référence de transaction manquante.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/coins/confirmation">
                            <Button>Retour</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-2xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Chargement du ticket…</CardTitle>
                        <CardDescription>Veuillez patienter.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="container mx-auto max-w-2xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Erreur</CardTitle>
                        <CardDescription>Impossible de charger le ticket. Réessayez.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Button onClick={() => refetch()}>Réessayer</Button>
                        <Link to="/coins/confirmation">
                            <Button variant="outline">Retour</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const ticket = data as TicketCoin;

    return (
        <div className="container mx-auto max-w-2xl p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Ticket de paiement</CardTitle>
                    <CardDescription>Référence: {ticket.transaction_ref}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">ID</span>
                            <span className="font-medium">{String(ticket.id)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Montant</span>
                            <span className="font-medium">{String(ticket.price)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Client</span>
                            <span className="font-medium">{ticket.user}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Objet du paiement</span>
                            <span className="font-medium">{ticket.payment_of}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <Button onClick={() => window.print()} variant="outline">Imprimer</Button>
                        <Link to="/coins/confirmation">
                            <Button>Terminer</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default TicketCoinPage



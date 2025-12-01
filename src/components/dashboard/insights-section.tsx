import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

export function InsightsSection() {
    return (
        <Card className="col-span-4 lg:col-span-1 bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    AI Finance Insights
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Gere insights personalizados baseados em seus dados.
                </p>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg bg-accent/50 p-4">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Recomendação:</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Seu fluxo de caixa está positivo. Considere aumentar o aporte na sua meta de "Reserva de Emergência" para acelerar o progresso.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { CreateNfeDuplicataData } from "@/lib/services/nfe.service"
import { toast } from "sonner"

interface DuplicatasFormProps {
  duplicatas: CreateNfeDuplicataData[]
  onChange: (duplicatas: CreateNfeDuplicataData[]) => void
  valorTotal: number
  disabled?: boolean
}

export function DuplicatasForm({ duplicatas, onChange, valorTotal, disabled }: DuplicatasFormProps) {
  const [numero, setNumero] = useState("")
  const [dataVencimento, setDataVencimento] = useState("")
  const [valor, setValor] = useState("")

  const somaDuplicatas = duplicatas.reduce((sum, dup) => sum + dup.valor, 0)
  const diferenca = valorTotal - somaDuplicatas

  const adicionarDuplicata = () => {
    // Validações
    if (!numero.trim()) {
      toast.error("Número da duplicata é obrigatório")
      return
    }

    if (!dataVencimento) {
      toast.error("Data de vencimento é obrigatória")
      return
    }

    const valorNumerico = parseFloat(valor)
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error("Valor deve ser maior que zero")
      return
    }

    // Verificar se número já existe
    if (duplicatas.some(d => d.numero === numero)) {
      toast.error("Já existe uma duplicata com este número")
      return
    }

    // Adicionar duplicata
    const novaDuplicata: CreateNfeDuplicataData = {
      numero: numero.trim(),
      dataVencimento,
      valor: valorNumerico,
    }

    onChange([...duplicatas, novaDuplicata])

    // Limpar campos
    setNumero("")
    setDataVencimento("")
    setValor("")

    toast.success("Duplicata adicionada")
  }

  const removerDuplicata = (index: number) => {
    const novasDuplicatas = duplicatas.filter((_, i) => i !== index)
    onChange(novasDuplicatas)
    toast.success("Duplicata removida")
  }

  const gerarParcelas = (numeroParcelas: number) => {
    if (numeroParcelas < 1 || numeroParcelas > 12) {
      toast.error("Número de parcelas deve ser entre 1 e 12")
      return
    }

    const valorParcela = valorTotal / numeroParcelas
    const hoje = new Date()
    const novasDuplicatas: CreateNfeDuplicataData[] = []

    for (let i = 0; i < numeroParcelas; i++) {
      const dataVenc = new Date(hoje)
      dataVenc.setDate(dataVenc.getDate() + (30 * (i + 1))) // 30 dias entre parcelas

      novasDuplicatas.push({
        numero: String(i + 1).padStart(3, '0'),
        dataVencimento: dataVenc.toISOString().split('T')[0],
        valor: i === numeroParcelas - 1 
          ? valorTotal - (valorParcela * (numeroParcelas - 1)) // Última parcela ajusta diferença
          : valorParcela,
      })
    }

    onChange(novasDuplicatas)
    toast.success(`${numeroParcelas} parcelas geradas automaticamente`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Duplicatas / Parcelamento</CardTitle>
        <CardDescription>
          Adicione as duplicatas para pagamento parcelado. A soma deve ser igual ao valor total da NFe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Geração Automática */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label>Gerar Parcelas Automaticamente</Label>
            <div className="flex gap-2 mt-1">
              {[2, 3, 4, 6, 12].map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => gerarParcelas(num)}
                  disabled={disabled || valorTotal <= 0}
                >
                  {num}x
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Formulário de Adição */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="001"
              disabled={disabled}
            />
          </div>
          <div>
            <Label htmlFor="dataVencimento">Vencimento</Label>
            <Input
              id="dataVencimento"
              type="date"
              value={dataVencimento}
              onChange={(e) => setDataVencimento(e.target.value)}
              disabled={disabled}
            />
          </div>
          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0.00"
              disabled={disabled}
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={adicionarDuplicata}
              disabled={disabled}
              className="w-full"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Lista de Duplicatas */}
        {duplicatas.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {duplicatas.map((duplicata, index) => (
                  <TableRow key={index}>
                    <TableCell>{duplicata.numero}</TableCell>
                    <TableCell>
                      {new Date(duplicata.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      {duplicata.valor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removerDuplicata(index)}
                        disabled={disabled}
                      >
                        <IconTrash className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Resumo */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Valor Total da NFe:</span>
            <span className="font-semibold">
              {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Soma das Duplicatas:</span>
            <span className="font-semibold">
              {somaDuplicatas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Diferença:</span>
            <span className={`font-semibold ${Math.abs(diferenca) > 0.01 ? 'text-destructive' : 'text-green-600'}`}>
              {diferenca.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          {Math.abs(diferenca) > 0.01 && (
            <p className="text-xs text-destructive mt-2">
              ⚠️ A soma das duplicatas deve ser igual ao valor total da NFe
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


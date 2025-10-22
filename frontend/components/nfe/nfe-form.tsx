"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { IconChevronDown, IconDeviceFloppy, IconX, IconPlus, IconTrash, IconLoader2, IconAlertCircle } from "@tabler/icons-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { DuplicatasForm } from "./duplicatas-form"
import { CreateNfeDuplicataData, NfeService } from "@/lib/services/nfe.service"
import { EmitenteService } from "@/lib/services/emitente.service"
import { ClienteService } from "@/lib/services/cliente.service"
import { ProdutoService } from "@/lib/services/produto.service"
import { AuxiliarService } from "@/lib/services/auxiliar.service"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface NfeFormProps {
  nfeId?: string
  onSuccess?: () => void
}

interface NfeItemForm {
  produtoId: string
  codigo: string
  descricao: string
  ncmId: string
  cfopId: string
  unidadeComercial: string
  quantidadeComercial: number
  valorUnitario: number
  valorDesconto: number
  valorTotal: number
  origem: string
  icmsCstId?: string
  icmsCsosnId?: string
  icmsBaseCalculo?: number
  icmsAliquota?: number
  icmsValor?: number
  pisCstId?: string
  pisBaseCalculo?: number
  pisAliquota?: number
  pisValor?: number
  cofinsCstId?: string
  cofinsBaseCalculo?: number
  cofinsAliquota?: number
  cofinsValor?: number
}

export function NfeForm({ nfeId, onSuccess }: NfeFormProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  // Listas
  const [clientes, setClientes] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [naturezasOperacao, setNaturezasOperacao] = useState<any[]>([])

  // Emitente ativo (fixo do sistema)
  const [emitente, setEmitente] = useState<any>(null)

  // Dados básicos
  const [clienteId, setClienteId] = useState("")
  const [naturezaOperacaoId, setNaturezaOperacaoId] = useState("")
  const [naturezaOperacao, setNaturezaOperacao] = useState("Venda de mercadoria")
  const [serie, setSerie] = useState(1)
  const [tipoOperacao, setTipoOperacao] = useState(1) // 1=Saída
  const [consumidorFinal, setConsumidorFinal] = useState(1) // 1=Sim
  const [presencaComprador, setPresencaComprador] = useState(1) // 1=Presencial
  const [dataEmissao, setDataEmissao] = useState(new Date().toISOString().split('T')[0])
  const [dataSaida, setDataSaida] = useState("")
  const [modalidadeFrete, setModalidadeFrete] = useState(9) // 9=Sem frete
  
  // Itens
  const [itens, setItens] = useState<NfeItemForm[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState("")
  const [quantidade, setQuantidade] = useState(1)
  const [valorUnitarioItem, setValorUnitarioItem] = useState(0)
  const [descontoItem, setDescontoItem] = useState(0)
  const [cfopItem, setCfopItem] = useState("")
  
  // Totalizadores
  const [valorFrete, setValorFrete] = useState(0)
  const [valorSeguro, setValorSeguro] = useState(0)
  const [valorDesconto, setValorDesconto] = useState(0)
  const [valorOutros, setValorOutros] = useState(0)
  
  // Totalizadores raros (baseado em XMLs reais)
  const [valorICMSDesonerado, setValorICMSDesonerado] = useState(0)
  const [valorFCP, setValorFCP] = useState(0)
  const [valorII, setValorII] = useState(0)
  const [valorOutrasDespesas, setValorOutrasDespesas] = useState(0)
  
  // Duplicatas
  const [duplicatas, setDuplicatas] = useState<CreateNfeDuplicataData[]>([])
  
  // Informações adicionais
  const [informacoesAdicionais, setInformacoesAdicionais] = useState("")
  
  // Totalizadores raros expandido
  const [totalizadoresRarosOpen, setTotalizadoresRarosOpen] = useState(false)

  // Calcular totais
  const valorProdutos = itens.reduce((sum, item) => sum + item.valorTotal, 0)
  const valorTotal = valorProdutos + valorFrete + valorSeguro - valorDesconto + valorOutros

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  // Carregar NFe se estiver editando
  useEffect(() => {
    if (nfeId) {
      loadNfe()
    }
  }, [nfeId])

  const loadInitialData = async () => {
    try {
      setLoadingData(true)

      const { NaturezaOperacaoService } = await import("@/lib/services/natureza-operacao.service")

      // Carregar dados em paralelo com tratamento de erro individual
      const results = await Promise.allSettled([
        EmitenteService.getEmitenteAtivo(),
        ClienteService.getAll({ page: 1, limit: 1000 }),
        ProdutoService.getAll({ page: 1, limit: 1000 }),
        NaturezaOperacaoService.getAtivas(),
      ])

      // Processar emitente ativo
      if (results[0].status === 'fulfilled') {
        const emitenteAtivo = results[0].value
        setEmitente(emitenteAtivo)
        setSerie(emitenteAtivo.serieNfe || 1)
      } else {
        console.error("Erro ao carregar emitente:", results[0].reason)
        // Emitente não configurado - não é erro fatal, apenas aviso
        setEmitente(null)
      }

      // Processar clientes
      if (results[1].status === 'fulfilled') {
        setClientes(results[1].value.data || [])
      } else {
        console.error("Erro ao carregar clientes:", results[1].reason)
        toast.error("Erro ao carregar clientes")
      }

      // Processar produtos
      if (results[2].status === 'fulfilled') {
        setProdutos(results[2].value.data || [])
      } else {
        console.error("Erro ao carregar produtos:", results[2].reason)
        toast.error("Erro ao carregar produtos")
      }

      // Processar naturezas de operação
      if (results[3].status === 'fulfilled') {
        const naturezas = results[3].value || []
        setNaturezasOperacao(naturezas)

        // Pré-selecionar primeira natureza
        if (naturezas.length > 0) {
          handleNaturezaChange(naturezas[0].id, naturezas)
        }
      } else {
        console.error("Erro ao carregar naturezas de operação:", results[3].reason)
        toast.error("Erro ao carregar naturezas de operação")
      }
    } catch (error) {
      console.error("Erro geral ao carregar dados:", error)
      toast.error("Erro ao carregar dados iniciais")
    } finally {
      setLoadingData(false)
    }
  }

  const loadNfe = async () => {
    try {
      setLoadingData(true)
      const nfe = await NfeService.getById(nfeId!)

      // Preencher formulário
      setClienteId(nfe.clienteId)
      setNaturezaOperacao(nfe.naturezaOperacao)
      setSerie(nfe.serie)
      setTipoOperacao(nfe.tipoOperacao)
      setConsumidorFinal(nfe.consumidorFinal)
      setPresencaComprador(nfe.presencaComprador)
      setDataEmissao(nfe.dataEmissao.split('T')[0])
      setDataSaida(nfe.dataSaida ? nfe.dataSaida.split('T')[0] : "")
      setModalidadeFrete(nfe.modalidadeFrete || 9)
      setValorFrete(nfe.valorFrete || 0)
      setValorSeguro(nfe.valorSeguro || 0)
      setValorDesconto(nfe.valorDesconto || 0)
      setValorOutros(nfe.valorOutros || 0)
      setValorICMSDesonerado(nfe.valorICMSDesonerado || 0)
      setValorFCP(nfe.valorFCP || 0)
      setValorII(nfe.valorII || 0)
      setValorOutrasDespesas(nfe.valorOutrasDespesas || 0)
      setInformacoesAdicionais(nfe.informacoesAdicionais || "")
      
      // Carregar duplicatas
      if (nfe.duplicatas) {
        setDuplicatas(nfe.duplicatas.map(d => ({
          numero: d.numero,
          dataVencimento: d.dataVencimento,
          valor: d.valor,
        })))
      }
      
      // TODO: Carregar itens quando o backend estiver pronto
    } catch (error) {
      console.error("Erro ao carregar NFe:", error)
      toast.error("Erro ao carregar NFe")
    } finally {
      setLoadingData(false)
    }
  }

  const adicionarItem = () => {
    if (!produtoSelecionado) {
      toast.error("Selecione um produto")
      return
    }

    if (quantidade <= 0) {
      toast.error("Quantidade deve ser maior que zero")
      return
    }

    const produto = produtos.find(p => p.id === produtoSelecionado)
    if (!produto) return

    // Validar se produto tem impostos configurados
    if (!produto.icmsCstId && !produto.icmsCsosnId) {
      toast.error("Produto sem impostos configurados. Configure os impostos no cadastro do produto.")
      return
    }

    const valorTotalItem = (quantidade * valorUnitarioItem) - descontoItem

    // Calcular impostos baseado nos dados do produto
    const icmsBase = valorTotalItem
    const icmsValor = icmsBase * ((produto.icmsAliquota || 0) / 100)

    const pisBase = valorTotalItem
    const pisValor = pisBase * ((produto.pisAliquota || 0) / 100)

    const cofinsBase = valorTotalItem
    const cofinsValor = cofinsBase * ((produto.cofinsAliquota || 0) / 100)

    // Usar CFOP selecionado manualmente ou determinar automaticamente
    let cfopId = cfopItem

    if (!cfopId) {
      // Determinar CFOP baseado no cliente e natureza de operação
      const cliente = clientes.find(c => c.id === clienteId)
      const natureza = naturezasOperacao.find(n => n.id === naturezaOperacaoId)

      if (natureza && cliente) {
        // Verificar se cliente é do mesmo estado do emitente
        const mesmoEstado = cliente.estadoId === emitente?.estadoId

        if (mesmoEstado && natureza.cfopDentroEstadoId) {
          cfopId = natureza.cfopDentroEstadoId
        } else if (!mesmoEstado && natureza.cfopForaEstadoId) {
          cfopId = natureza.cfopForaEstadoId
        }
      }
    }

    if (!cfopId) {
      toast.error("Selecione um CFOP ou configure a natureza de operação")
      return
    }

    const novoItem: NfeItemForm = {
      produtoId: produto.id,
      codigo: produto.codigo,
      descricao: produto.descricao,
      ncmId: produto.ncmId,
      cfopId: cfopId,
      unidadeComercial: produto.unidade,
      quantidadeComercial: quantidade,
      valorUnitario: valorUnitarioItem,
      valorDesconto: descontoItem,
      valorTotal: valorTotalItem,
      origem: produto.origem,
      icmsCstId: produto.icmsCstId,
      icmsCsosnId: produto.icmsCsosnId,
      icmsBaseCalculo: icmsBase,
      icmsAliquota: produto.icmsAliquota || 0,
      icmsValor: icmsValor,
      pisCstId: produto.pisCstId,
      pisBaseCalculo: pisBase,
      pisAliquota: produto.pisAliquota || 0,
      pisValor: pisValor,
      cofinsCstId: produto.cofinsCstId,
      cofinsBaseCalculo: cofinsBase,
      cofinsAliquota: produto.cofinsAliquota || 0,
      cofinsValor: cofinsValor,
    }

    setItens([...itens, novoItem])

    // Limpar campos
    setProdutoSelecionado("")
    setQuantidade(1)
    setValorUnitarioItem(0)
    setDescontoItem(0)
    setCfopItem("")

    toast.success("Item adicionado")
  }

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index))
    toast.success("Item removido")
  }

  const handleProdutoChange = (produtoId: string) => {
    setProdutoSelecionado(produtoId)
    const produto = produtos.find(p => p.id === produtoId)
    if (produto) {
      setValorUnitarioItem(produto.valorUnitario)
    }
  }

  const handleNaturezaChange = (naturezaId: string, naturezasList?: any[]) => {
    setNaturezaOperacaoId(naturezaId)
    const lista = naturezasList || naturezasOperacao
    const natureza = lista.find(n => n.id === naturezaId)

    if (natureza) {
      setNaturezaOperacao(natureza.descricao)
      setTipoOperacao(natureza.tipoOperacao)
      setConsumidorFinal(natureza.consumidorFinal)
      setPresencaComprador(natureza.presencaComprador)

      // Preencher informações adicionais padrão
      if (natureza.informacoesAdicionaisPadrao) {
        setInformacoesAdicionais(natureza.informacoesAdicionaisPadrao)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (!emitente) {
      toast.error("Emitente não configurado. Configure um emitente ativo antes de criar NFe.")
      return
    }

    if (!clienteId) {
      toast.error("Selecione um cliente")
      return
    }

    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item à NFe")
      return
    }
    
    // Validar duplicatas se houver
    if (duplicatas.length > 0) {
      const somaDuplicatas = duplicatas.reduce((sum, dup) => sum + dup.valor, 0)
      if (Math.abs(somaDuplicatas - valorTotal) > 0.01) {
        toast.error("A soma das duplicatas deve ser igual ao valor total da NFe")
        return
      }
    }
    
    try {
      setLoading(true)

      const data = {
        // emitenteId não é mais necessário - será buscado automaticamente no backend
        clienteId,
        serie,
        naturezaOperacao,
        tipoOperacao,
        consumidorFinal,
        presencaComprador,
        dataEmissao,
        dataSaida: dataSaida || undefined,
        modalidadeFrete,
        valorFrete,
        valorSeguro,
        valorDesconto,
        valorOutros,
        valorICMSDesonerado,
        valorFCP,
        valorII,
        valorOutrasDespesas,
        informacoesAdicionais,
        itens: itens.map(item => ({
          produtoId: item.produtoId,
          codigo: item.codigo,
          descricao: item.descricao,
          ncmId: item.ncmId,
          cfopId: item.cfopId,
          unidadeComercial: item.unidadeComercial,
          quantidadeComercial: item.quantidadeComercial,
          valorUnitario: item.valorUnitario,
          valorDesconto: item.valorDesconto,
          valorTotal: item.valorTotal,
          origem: item.origem,
          // Impostos ICMS
          icmsCstId: item.icmsCstId,
          icmsCsosnId: item.icmsCsosnId,
          icmsBaseCalculo: item.icmsBaseCalculo,
          icmsAliquota: item.icmsAliquota,
          icmsValor: item.icmsValor,
          // Impostos PIS
          pisCstId: item.pisCstId,
          pisBaseCalculo: item.pisBaseCalculo,
          pisAliquota: item.pisAliquota,
          pisValor: item.pisValor,
          // Impostos COFINS
          cofinsCstId: item.cofinsCstId,
          cofinsBaseCalculo: item.cofinsBaseCalculo,
          cofinsAliquota: item.cofinsAliquota,
          cofinsValor: item.cofinsValor,
        })),
        duplicatas: duplicatas.length > 0 ? duplicatas : undefined,
      }

      if (nfeId) {
        await NfeService.update(nfeId, data)
        toast.success("NFe atualizada com sucesso!")
      } else {
        await NfeService.create(data)
        toast.success("NFe criada com sucesso!")
      }
      
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar NFe")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="itens">Itens ({itens.length})</TabsTrigger>
          <TabsTrigger value="totalizadores">Totalizadores</TabsTrigger>
          <TabsTrigger value="cobranca">Cobrança</TabsTrigger>
          <TabsTrigger value="adicionais">Adicionais</TabsTrigger>
        </TabsList>

        {/* Aba Geral */}
        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados Gerais</CardTitle>
              <CardDescription>Informações básicas da NFe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Card informativo do Emitente */}
              {emitente ? (
                <div className="p-4 bg-muted rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Emitente</p>
                      <p className="text-lg font-semibold">{emitente.razaoSocial}</p>
                      <p className="text-sm text-muted-foreground">
                        CNPJ: {emitente.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">Série NFe</p>
                      <p className="text-2xl font-bold">{emitente.serieNfe || 1}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert variant="destructive">
                  <IconAlertCircle className="h-4 w-4" />
                  <AlertTitle>Emitente não configurado</AlertTitle>
                  <AlertDescription>
                    Você precisa cadastrar um emitente antes de criar NFe.{" "}
                    <Link href="/configuracoes/emitente" className="underline font-medium">
                      Clique aqui para configurar
                    </Link>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select value={clienteId} onValueChange={setClienteId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome} - {cliente.documento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="naturezaOperacaoId">Natureza da Operação *</Label>
                  <Select value={naturezaOperacaoId} onValueChange={handleNaturezaChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a natureza da operação" />
                    </SelectTrigger>
                    <SelectContent>
                      {naturezasOperacao.map((natureza) => (
                        <SelectItem key={natureza.id} value={natureza.id}>
                          {natureza.codigo} - {natureza.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {naturezaOperacao && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {naturezaOperacao}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="serie">Série</Label>
                  <Input
                    id="serie"
                    type="number"
                    value={serie}
                    onChange={(e) => setSerie(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="dataEmissao">Data de Emissão</Label>
                  <Input
                    id="dataEmissao"
                    type="date"
                    value={dataEmissao}
                    onChange={(e) => setDataEmissao(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="dataSaida">Data de Saída (Opcional)</Label>
                  <Input
                    id="dataSaida"
                    type="date"
                    value={dataSaida}
                    onChange={(e) => setDataSaida(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Itens */}
        <TabsContent value="itens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Itens da NFe</CardTitle>
              <CardDescription>Adicione os produtos/serviços</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulário de Adição de Item */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                <div className="md:col-span-2">
                  <Label htmlFor="produto">Produto</Label>
                  <Select value={produtoSelecionado} onValueChange={handleProdutoChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id}>
                          {produto.codigo} - {produto.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    step="0.01"
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="valorUnitario">Valor Unit.</Label>
                  <Input
                    id="valorUnitario"
                    type="number"
                    step="0.01"
                    value={valorUnitarioItem}
                    onChange={(e) => setValorUnitarioItem(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="cfop">CFOP</Label>
                  <Select value={cfopItem} onValueChange={setCfopItem}>
                    <SelectTrigger>
                      <SelectValue placeholder="CFOP" />
                    </SelectTrigger>
                    <SelectContent>
                      {cfops.filter((c: any) => c.tipo === 'SAIDA').map((cfop: any) => (
                        <SelectItem key={cfop.id} value={cfop.id}>
                          {cfop.codigo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button type="button" onClick={adicionarItem} className="w-full">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de Itens */}
              {itens.length > 0 && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Valor Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itens.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.codigo}</TableCell>
                          <TableCell>{item.descricao}</TableCell>
                          <TableCell className="text-right">{item.quantidadeComercial}</TableCell>
                          <TableCell className="text-right">
                            {item.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removerItem(index)}
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

              {itens.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum item adicionado. Adicione produtos para continuar.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Totalizadores */}
        <TabsContent value="totalizadores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Totalizadores</CardTitle>
              <CardDescription>Valores da NFe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Valor dos Produtos</Label>
                  <Input
                    type="text"
                    value={valorProdutos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="valorFrete">Valor do Frete</Label>
                  <Input
                    id="valorFrete"
                    type="number"
                    step="0.01"
                    value={valorFrete}
                    onChange={(e) => setValorFrete(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="valorSeguro">Valor do Seguro</Label>
                  <Input
                    id="valorSeguro"
                    type="number"
                    step="0.01"
                    value={valorSeguro}
                    onChange={(e) => setValorSeguro(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="valorDesconto">Valor do Desconto</Label>
                  <Input
                    id="valorDesconto"
                    type="number"
                    step="0.01"
                    value={valorDesconto}
                    onChange={(e) => setValorDesconto(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="valorOutros">Outras Despesas</Label>
                  <Input
                    id="valorOutros"
                    type="number"
                    step="0.01"
                    value={valorOutros}
                    onChange={(e) => setValorOutros(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Totalizadores Raros (Collapsible) */}
              <Collapsible open={totalizadoresRarosOpen} onOpenChange={setTotalizadoresRarosOpen}>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-between">
                    <span>Totalizadores Opcionais (Raros)</span>
                    <IconChevronDown className={`h-4 w-4 transition-transform ${totalizadoresRarosOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Campos opcionais raramente utilizados. Baseado em XMLs reais de produção.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="valorICMSDesonerado">
                        ICMS Desonerado
                        <span className="text-xs text-muted-foreground ml-2">(XML: vICMSDeson)</span>
                      </Label>
                      <Input
                        id="valorICMSDesonerado"
                        type="number"
                        step="0.01"
                        value={valorICMSDesonerado}
                        onChange={(e) => setValorICMSDesonerado(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="valorFCP">
                        FCP - Fundo Combate Pobreza
                        <span className="text-xs text-muted-foreground ml-2">(XML: vFCP)</span>
                      </Label>
                      <Input
                        id="valorFCP"
                        type="number"
                        step="0.01"
                        value={valorFCP}
                        onChange={(e) => setValorFCP(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="valorII">
                        II - Imposto de Importação
                        <span className="text-xs text-muted-foreground ml-2">(XML: vII)</span>
                      </Label>
                      <Input
                        id="valorII"
                        type="number"
                        step="0.01"
                        value={valorII}
                        onChange={(e) => setValorII(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="valorOutrasDespesas">
                        Outras Despesas Acessórias
                        <span className="text-xs text-muted-foreground ml-2">(XML: vOutro)</span>
                      </Label>
                      <Input
                        id="valorOutrasDespesas"
                        type="number"
                        step="0.01"
                        value={valorOutrasDespesas}
                        onChange={(e) => setValorOutrasDespesas(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Valor Total */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Valor Total da NFe:</span>
                  <span className="text-2xl font-bold">
                    {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Cobrança */}
        <TabsContent value="cobranca" className="space-y-4">
          <DuplicatasForm
            duplicatas={duplicatas}
            onChange={setDuplicatas}
            valorTotal={valorTotal}
            disabled={loading}
          />
        </TabsContent>

        {/* Aba Adicionais */}
        <TabsContent value="adicionais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
              <CardDescription>Dados complementares da NFe</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="informacoesAdicionais">Informações Complementares</Label>
                <Textarea
                  id="informacoesAdicionais"
                  value={informacoesAdicionais}
                  onChange={(e) => setInformacoesAdicionais(e.target.value)}
                  placeholder="Informações adicionais para o cliente..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={loading}>
          <IconX className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || itens.length === 0}>
          {loading && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
          {!loading && <IconDeviceFloppy className="h-4 w-4 mr-2" />}
          {loading ? "Salvando..." : nfeId ? "Atualizar NFe" : "Salvar NFe"}
        </Button>
      </div>
    </form>
  )
}


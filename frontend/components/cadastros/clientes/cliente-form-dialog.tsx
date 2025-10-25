"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useClienteForm } from "@/hooks/clientes/use-cliente-form"
import { User, MapPin, Phone, FileText, Search } from "lucide-react"



interface ClienteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteId?: string
  onSuccess?: (cliente?: any) => void
}

export function ClienteFormDialog({
  open,
  onOpenChange,
  clienteId,
  onSuccess,
}: ClienteFormDialogProps) {
  const {
    form,
    loading,
    loadingCnpj,
    loadingCep,
    loadingEstados,
    loadingMunicipios,
    handleSubmit,
    handleDocumentoChange,
    handleCepSearch,
    loadCliente,
    resetForm,
    loadMunicipios,
    estados,
    municipios,
    formatCnpj,
    formatCep,
    formatPhone,
    alertDialog,
  } = useClienteForm({ clienteId, onSuccess })

  const watchEstadoId = form.watch("estadoId")
  const watchDocumento = form.watch("documento")
  const [accordionValue, setAccordionValue] = useState<string[]>(["basicos"])

  // Gerencia abertura inicial do accordion baseado no modo (criar/editar)
  useEffect(() => {
    if (open && clienteId) {
      loadCliente()
      // Ao editar, abre todas as seções
      setAccordionValue(["basicos", "endereco", "contato"])
    } else if (open) {
      resetForm()
      // Ao criar novo, abre apenas "basicos"
      setAccordionValue(["basicos"])
    }
  }, [open, clienteId, loadCliente, resetForm])

  // Abre automaticamente a seção de endereço quando o documento for preenchido
  useEffect(() => {
    if (watchDocumento && watchDocumento.replace(/\D/g, '').length >= 11 && !clienteId) {
      // Só abre se não estiver já aberto
      setAccordionValue(prev => {
        if (!prev.includes("endereco")) {
          return [...prev, "endereco"]
        }
        return prev
      })
    }
  }, [watchDocumento, clienteId])







  const onSubmit = async (values: any) => {
    const success = await handleSubmit(values)
    // Só fecha o dialog se o submit foi bem-sucedido
    if (success) {
      onOpenChange(false)
    }
    // Se falhou, o dialog permanece aberto e o AlertDialog é exibido
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] sm:max-w-[90vw] flex flex-col p-0"
        onInteractOutside={(e) => {
          // Previne o fechamento do dialog ao clicar fora (overlay ou toasts)
          e.preventDefault()
        }}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {clienteId ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {clienteId
              ? "Edite as informações do cliente abaixo"
              : "Preencha os dados para cadastrar um novo cliente"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Accordion para todas as seções */}
              <Accordion
                type="multiple"
                value={accordionValue}
                onValueChange={setAccordionValue}
                className="w-full space-y-2"
              >
                {/* Accordion: Dados Básicos */}
                <AccordionItem value="basicos" className="border rounded-lg border-b-0 last:border-b">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-base font-semibold">Dados Básicos</h3>
                          <p className="text-sm text-muted-foreground">Informações principais do cliente</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-auto mr-2">Obrigatório</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 pt-4">
                      {/* Documento CPF/CNPJ */}
                      <FormField
                    control={form.control}
                    name="documento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF/CNPJ</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="00.000.000/0000-00 ou 000.000.000-00"
                              value={formatCnpj(field.value || '')}
                              onChange={(e) => {
                                const numbersOnly = e.target.value.replace(/\D/g, '')
                                field.onChange(numbersOnly)
                                handleDocumentoChange(numbersOnly)
                              }}
                            />
                            {loadingCnpj && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          {form.watch("documento")?.replace(/\D/g, '').length > 11
                            ? "CNPJ será consultado automaticamente ao completar 14 dígitos"
                            : "Digite o CNPJ (padrão) ou CPF do cliente"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                      />

                      {/* Nome */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name="nome"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs font-medium">
                                {form.watch("documento")?.replace(/\D/g, '').length > 11 ? "Razão Social" : "Nome"}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="h-9 text-sm w-full" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("documento")?.replace(/\D/g, '').length > 11 && (
                          <FormField
                            control={form.control}
                            name="nomeFantasia"
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel className="text-xs font-medium">Nome Fantasia</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-9 text-sm w-full" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      {/* Status Ativo */}
                      <FormField
                        control={form.control}
                        name="ativo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Cliente Ativo</FormLabel>
                              <FormDescription className="text-[10px]">Desative para impedir novas transações com este cliente</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Dados Fiscais - Apenas para PJ */}
                      {form.watch("documento")?.replace(/\D/g, '').length > 11 && (
                        <>
                          <div className="pt-4 border-t">
                            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Dados Fiscais
                            </h4>

                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="inscricaoEstadual"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Inscrição Estadual</FormLabel>
                                      <FormControl>
                                        <Input placeholder="000.000.000.000" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                        Preenchido automaticamente pela consulta de CNPJ quando disponível
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="inscricaoMunicipal"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Inscrição Municipal</FormLabel>
                                      <FormControl>
                                        <Input placeholder="000000000" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                        Inscrição municipal da empresa (se aplicável)
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Inscrição SUFRAMA - Apenas para estados da Amazônia Ocidental */}
                              {(() => {
                                const estadoId = form.watch("estadoId")
                                const estado = estados.find(e => e.id === estadoId)
                                const estadosSuframa = ["AM", "AC", "RO", "RR", "AP"]
                                const mostrarSuframa = estado && estadosSuframa.includes(estado.uf)

                                return mostrarSuframa ? (
                                  <FormField
                                    control={form.control}
                                    name="inscricaoSuframa"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Inscrição SUFRAMA</FormLabel>
                                        <FormControl>
                                          <Input placeholder="000000000" maxLength={15} {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          {estado.uf === "AP"
                                            ? "Apenas para clientes de Macapá e Santana (Zona Franca)"
                                            : "Zona Franca de Manaus e Amazônia Ocidental"}
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                ) : null
                              })()}

                              <FormField
                                control={form.control}
                                name="indicadorIE"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Indicador de Inscrição Estadual</FormLabel>
                                    <Select
                                      onValueChange={(value) => field.onChange(Number(value))}
                                      value={field.value?.toString()}
                                      disabled={form.watch("tipo") === "FISICA"}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o indicador" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="1">1 - Contribuinte ICMS</SelectItem>
                                        <SelectItem value="2">2 - Contribuinte isento</SelectItem>
                                        <SelectItem value="9">9 - Não Contribuinte</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      {form.watch("tipo") === "FISICA"
                                        ? "Pessoa física é sempre Não Contribuinte (preenchido automaticamente)"
                                        : form.watch("inscricaoEstadual")?.trim()
                                        ? "Contribuinte ICMS (tem Inscrição Estadual)"
                                        : "Não Contribuinte (sem Inscrição Estadual)"}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* Accordion: Endereço */}
                <AccordionItem value="endereco" className="border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-base font-semibold">Endereço</h3>
                          <p className="text-sm text-muted-foreground">Localização do cliente</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="ml-auto mr-2">Obrigatório</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 pt-4">

                      <FormField
                        control={form.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP *</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input
                                  {...field}
                                  placeholder="00000-000"
                                  value={formatCep(field.value || '')}
                                  onChange={(e) => {
                                    const numbersOnly = e.target.value.replace(/\D/g, '')
                                    field.onChange(numbersOnly)
                                  }}
                                  maxLength={9}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={handleCepSearch}
                                  disabled={loadingCep}
                                >
                                  {loadingCep ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Search className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Digite o CEP e clique na lupa para buscar o endereço
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="estadoId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado *</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  // Limpa o município quando o estado muda
                                  form.setValue("municipioId", "")
                                  // Carrega municípios do novo estado
                                  loadMunicipios(value)
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[300px]">
                                  {estados.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                      Carregando estados...
                                    </div>
                                  ) : (
                                    estados.map((estado) => (
                                      <SelectItem key={estado.id} value={estado.id}>
                                        {estado.uf} - {estado.nome}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Selecione o estado (UF)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="municipioId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Município *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!watchEstadoId}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={
                                      !watchEstadoId
                                        ? "Selecione primeiro o estado"
                                        : "Selecione o município"
                                    } />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[300px]">
                                  {municipios.length === 0 && watchEstadoId ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                      Carregando municípios...
                                    </div>
                                  ) : (
                                    municipios.map((municipio) => (
                                      <SelectItem key={municipio.id} value={municipio.id}>
                                        {municipio.nome}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                {!watchEstadoId
                                  ? "Selecione o estado primeiro"
                                  : "Selecione o município"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <FormField
                          control={form.control}
                          name="logradouro"
                          render={({ field }) => (
                            <FormItem className="md:col-span-6">
                              <FormLabel>Logradouro *</FormLabel>
                              <FormControl>
                                <Input placeholder="Rua, Avenida, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="numero"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Número *</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="complemento"
                          render={({ field }) => (
                            <FormItem className="md:col-span-4">
                              <FormLabel>Complemento</FormLabel>
                              <FormControl>
                                <Input placeholder="Apto, Sala, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do bairro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Accordion: Contato */}
                <AccordionItem value="contato" className="border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-base font-semibold">Informações de Contato</h3>
                          <p className="text-sm text-muted-foreground">Telefones e email do cliente</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto mr-2">Opcional</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(00) 0000-0000"
                                  value={formatPhone(field.value || '')}
                                  onChange={(e) => {
                                    const numbersOnly = e.target.value.replace(/\D/g, '')
                                    field.onChange(numbersOnly)
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Telefone fixo do cliente
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="celular"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Celular</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(00) 00000-0000"
                                  value={formatPhone(field.value || '')}
                                  onChange={(e) => {
                                    const numbersOnly = e.target.value.replace(/\D/g, '')
                                    field.onChange(numbersOnly)
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Telefone celular do cliente
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@exemplo.com"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Email principal para comunicação e envio de documentos fiscais
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>


              </Accordion>
            </form>
          </Form>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              onClick={form.handleSubmit(onSubmit)}
              className="flex-1 sm:flex-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </div>
              ) : (
                clienteId ? "Atualizar" : "Criar Cliente"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Alert Dialog para erros - z-index maior para ficar acima do Dialog */}
    <AlertDialog open={alertDialog.open} onOpenChange={alertDialog.onClose}>
      <AlertDialogContent className="z-[60]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            {alertDialog.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {alertDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>
            Entendi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

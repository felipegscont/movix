"use client"

import { useEffect } from "react"
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
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useClienteForm } from "@/hooks/clientes/use-cliente-form"
import { User, MapPin, Phone, FileText, Search } from "lucide-react"



interface ClienteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteId?: string
  onSuccess?: () => void
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

  useEffect(() => {
    if (open && clienteId) {
      loadCliente()
    } else if (open) {
      resetForm()
    }
  }, [open, clienteId, loadCliente, resetForm])







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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Dados Básicos - Sempre visíveis no topo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados Básicos
                  </CardTitle>
                  <CardDescription>
                    Informações principais do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch("documento")?.replace(/\D/g, '').length > 11
                              ? "Razão Social"
                              : "Nome"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormItem>
                            <FormLabel>Nome Fantasia</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Cliente Ativo
                          </FormLabel>
                          <FormDescription>
                            Desative para impedir novas transações com este cliente
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Separator />

              {/* Tabs para demais informações */}
              <Tabs defaultValue="endereco" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="endereco" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </TabsTrigger>
                  <TabsTrigger value="contato" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Contato
                  </TabsTrigger>
                  <TabsTrigger value="fiscal" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Dados Fiscais
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Endereço */}
                <TabsContent value="endereco" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Endereço
                      </CardTitle>
                      <CardDescription>
                        Localização do cliente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

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
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Contato */}
                <TabsContent value="contato" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Informações de Contato
                      </CardTitle>
                      <CardDescription>
                        Telefones e email do cliente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Dados Fiscais */}
                <TabsContent value="fiscal" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Dados Fiscais
                      </CardTitle>
                      <CardDescription>
                        Informações fiscais e tributárias
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {form.watch("documento")?.replace(/\D/g, '').length > 11 && (
                        <>
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
                                    Inscrição estadual da empresa (se aplicável)
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

                          <FormField
                            control={form.control}
                            name="indicadorIE"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Indicador de Inscrição Estadual</FormLabel>
                                <Select
                                  onValueChange={(value) => field.onChange(Number(value))}
                                  value={field.value?.toString()}
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
                                  Indica a situação do cliente em relação ao ICMS
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {form.watch("documento")?.replace(/\D/g, '').length <= 11 && (
                        <div className="flex items-center justify-center p-8 text-center">
                          <div className="space-y-2">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Dados fiscais são aplicáveis apenas para pessoas jurídicas (CNPJ)
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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

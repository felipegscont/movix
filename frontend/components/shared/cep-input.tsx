"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ExternalApiService, type CepData } from "@/lib/services/external-api.service"
import { useExternalApis } from "@/hooks/useExternalApis"
import { Search } from "lucide-react"

interface CepInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value: string
  onChange: (value: string) => void
  onDataLoaded?: (data: CepData) => void
  showValidation?: boolean
}

const CepInput = React.forwardRef<HTMLInputElement, CepInputProps>(
  ({ className, value, onChange, onDataLoaded, showValidation = true, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value)
    const [isValid, setIsValid] = useState(false)
    const { consultarCep, loading, error, clearError } = useExternalApis()

    // Atualiza o valor quando prop value muda
    useEffect(() => {
      setDisplayValue(ExternalApiService.formatCep(value))
    }, [value])

    // Valida CEP (sem auto-preenchimento)
    useEffect(() => {
      const numbers = displayValue.replace(/\D/g, '')
      const valid = ExternalApiService.validateCep(numbers)
      setIsValid(valid)
    }, [displayValue])

    // Função para buscar dados do CEP manualmente
    const handleSearchCep = async () => {
      const numbers = displayValue.replace(/\D/g, '')
      if (!isValid || !onDataLoaded) return

      try {
        clearError()
        const data = await consultarCep(numbers)
        if (data) {
          onDataLoaded(data)
        }
      } catch (error) {
        console.error('Erro ao consultar CEP:', error)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const numbers = rawValue.replace(/\D/g, '').slice(0, 8) // Limita a 8 dígitos
      const formatted = ExternalApiService.formatCep(numbers)
      
      setDisplayValue(formatted)
      onChange(numbers)
    }

    const getInputClassName = () => {
      if (!showValidation) return className
      
      if (loading) {
        return cn("border-blue-300 focus-visible:border-blue-500 bg-blue-50", className)
      } else if (error) {
        return cn("border-destructive focus-visible:border-destructive bg-destructive/5", className)
      } else if (isValid && displayValue.replace(/\D/g, '').length === 8) {
        return cn("border-green-500 focus-visible:border-green-500 bg-green-50", className)
      } else if (displayValue.replace(/\D/g, '').length === 8) {
        return cn("border-destructive focus-visible:border-destructive bg-destructive/5", className)
      }
      
      return className
    }

    return (
      <div className="relative">
        <div className="flex gap-2">
          <Input
            ref={ref}
            type="text"
            value={displayValue}
            onChange={handleChange}
            className={getInputClassName()}
            disabled={loading}
            maxLength={9} // XXXXX-XXX
            placeholder="00000-000"
            {...props}
          />

          {/* Botão de busca */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSearchCep}
            disabled={!isValid || loading}
            className="shrink-0"
            title="Buscar endereço pelo CEP"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Indicador de sucesso no input */}
        {isValid && !loading && !error && showValidation && displayValue.replace(/\D/g, '').length === 8 && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Indicador de erro no input */}
        {(error || (!isValid && displayValue.replace(/\D/g, '').length === 8)) && showValidation && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
            <svg className="h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        
        {/* Mensagens de feedback */}
        {showValidation && (
          <>
            {error && (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            )}

            {!error && displayValue.replace(/\D/g, '').length === 8 && (
              <p className={cn(
                "mt-1 text-sm",
                isValid ? "text-green-600" : "text-destructive"
              )}>
                {isValid
                  ? loading
                    ? "Buscando dados do CEP..."
                    : "✓ CEP válido - Clique na lupa para buscar endereço"
                  : "CEP inválido"
                }
              </p>
            )}
          </>
        )}
      </div>
    )
  }
)

CepInput.displayName = "CepInput"

export { CepInput }

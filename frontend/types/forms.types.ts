/**
 * Tipos relacionados a formulários
 * Tipos auxiliares para React Hook Form e componentes de formulário
 */

import { UseFormReturn } from "react-hook-form"
import { ProdutoFormValues } from "@/lib/schemas/produto.schema"

// ============================================
// TIPOS DE FORMULÁRIO - PRODUTO
// ============================================

/**
 * Tipo do formulário React Hook Form de Produto
 */
export type ProdutoForm = UseFormReturn<ProdutoFormValues>

/**
 * Props comuns para os componentes de seção de Produto
 */
export interface ProdutoSectionProps {
  form: ProdutoForm
}


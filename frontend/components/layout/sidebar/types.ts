import { LucideIcon } from "lucide-react"

/**
 * Item de navegação básico
 */
export interface NavItem {
  title: string
  url: string
  description?: string
}

/**
 * Cabeçalho de seção no menu
 */
export interface SectionHeader {
  title: string
  url: string
  isSectionHeader: true
}

/**
 * Grupo colapsável de itens
 */
export interface NavGroup {
  title: string
  url: string
  isGroup: true
  items: NavItem[]
}

/**
 * União de todos os tipos de subitens possíveis
 */
export type SubItem = NavItem | SectionHeader | NavGroup

/**
 * Item principal do menu de navegação
 */
export interface NavMainItem {
  title: string
  url: string
  icon: LucideIcon
  isActive: boolean
  items: SubItem[]
}

/**
 * Dados do usuário
 */
export interface UserData {
  name: string
  email: string
  avatar: string
}

/**
 * Estrutura completa de dados do sidebar
 */
export interface SidebarData {
  user: UserData
  navMain: NavMainItem[]
}

/**
 * Resultado de busca global
 */
export interface SearchResult {
  section: string
  sectionUrl: string
  title: string
  url: string
  description?: string
  parentTitle?: string
}

/**
 * Type guards para verificar tipos de subitens
 */
export function isSectionHeader(item: SubItem): item is SectionHeader {
  return 'isSectionHeader' in item && item.isSectionHeader === true
}

export function isNavGroup(item: SubItem): item is NavGroup {
  return 'isGroup' in item && item.isGroup === true
}

export function isNavItem(item: SubItem): item is NavItem {
  return !isSectionHeader(item) && !isNavGroup(item)
}


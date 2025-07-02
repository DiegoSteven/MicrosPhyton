"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

const breadcrumbMap = {
  "/": "Inicio",
  "/carrito": "Carrito",
  "/pedidos": "Mis Pedidos",
  "/admin": "Administración",
}

export function Breadcrumb() {
  const pathname = usePathname()
  
  // Generar breadcrumbs basado en la ruta actual
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs = [{ path: "/", label: "Inicio" }]
    
    let currentPath = ""
    paths.forEach((path) => {
      currentPath += `/${path}`
      const label = breadcrumbMap[currentPath] || path.charAt(0).toUpperCase() + path.slice(1)
      breadcrumbs.push({ path: currentPath, label })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
          ) : (
            <Link
              href={breadcrumb.path}
              className="hover:text-blue-600 transition-colors flex items-center"
            >
              {index === 0 ? (
                <Home className="h-4 w-4" />
              ) : (
                breadcrumb.label
              )}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
} 
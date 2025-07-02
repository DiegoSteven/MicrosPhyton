import { Inter } from "next/font/google"
import "./globals.css"
import { CarritoProvider } from "@/contexts/carrito-context"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DistribuMax - Distribuidora de Productos",
  description: "Sistema de ecommerce para distribuidora de productos de consumo masivo",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CarritoProvider>
          <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </CarritoProvider>
      </body>
    </html>
  )
}

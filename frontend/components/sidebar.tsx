"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  Menu,
  X,
  User,
  Truck,
  Box,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { useCarrito } from "@/contexts/carrito-context";
import { obtenerPedidos } from "@/app/api/pedidos/pedidos_api";

const navigationItems = [
  /*   {
    title: "Inicio",
    href: "/",
    icon: Home,
  }, */
  {
    title: "Productos",
    href: "/",
    icon: Package,
  },
  {
    title: "Carrito",
    href: "/carrito",
    icon: ShoppingCart,
  },
  {
    title: "Mis Pedidos",
    href: "/pedidos",
    icon: FileText,
  },
  {
    title: "Despachos",
    href: "/despachos",
    icon: Box,
  },
  {
    title: "Cobros",
    href: "/cobros",
    icon: DollarSign,
  },
  {
    title: "Envios",
    href: "/envios",
    icon: Truck,
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { cantidadCarrito } = useCarrito();
  const [cantidadOrdenes, setCantidadOrdenes] = useState(0);

  const items = navigationItems;

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const data = await obtenerPedidos();
        setCantidadOrdenes(Array.isArray(data) ? data.length : 0);
      } catch {
        setCantidadOrdenes(0);
      }
    }
    fetchPedidos();
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">DistribuMax</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10 px-3",
                    isActive && "bg-blue-50 text-blue-700 border-blue-200",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-3")}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 text-left">{item.title}</span>
                  )}
                  {!isCollapsed &&
                    item.title === "Carrito" &&
                    cantidadCarrito > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {cantidadCarrito}
                      </Badge>
                    )}
                  {!isCollapsed &&
                    item.title === "Mis Pedidos" &&
                    cantidadOrdenes > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 w-5 rounded-full p-0 text-xs"
                      >
                        {cantidadOrdenes}
                      </Badge>
                    )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

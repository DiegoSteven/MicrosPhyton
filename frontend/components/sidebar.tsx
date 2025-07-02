"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Menu,
  X,
  User,
  BarChart3,
  Truck,
  CreditCard,
} from "lucide-react";
import { useCarrito } from "@/contexts/carrito-context";

const navigationItems = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
  },
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
    title: "Envios",
    href: "/envios",
    icon: FileText,
  },
];

const adminItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Gestión Pedidos",
    href: "/admin",
    icon: Package,
  },
  {
    title: "Envíos",
    href: "/admin",
    icon: Truck,
  },
  {
    title: "Cobros",
    href: "/admin",
    icon: CreditCard,
  },
  {
    title: "Configuración",
    href: "/admin",
    icon: Settings,
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { cantidadCarrito } = useCarrito();

  // Detectar si estamos en la página de administración
  const isAdmin = pathname === "/admin";
  const items = isAdmin ? adminItems : navigationItems;

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
                </Button>
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <>
            <Separator className="my-4" />
            <div className="px-3 py-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{isAdmin ? "Administrador" : "Usuario"}</span>
              </div>
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
}

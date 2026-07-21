import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { cartStore, toggleCart, refreshCart } from "../lib/cartStore.js";
import { updateItem, removeItem, cartKey, getCart } from "../lib/cocart.js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const $cart = useStore(cartStore);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Sync store changes to the document body class for scrolling
    if ($cart.isOpen) {
      document.body.classList.add("elementor-offcanvas-active");
    } else {
      document.body.classList.remove("elementor-offcanvas-active");
    }
  }, [$cart.isOpen]);

  const handleOpenChange = (open: boolean) => {
    toggleCart(open);
  };

  const handleUpdateQuantity = async (key: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      await updateItem(key, newQty);
      refreshCart();
    } else {
      await removeItem(key);
      refreshCart();
    }
  };

  const handleRemoveItem = async (key: string) => {
    await removeItem(key);
    refreshCart();
  };

  const handleCheckout = async () => {
    const currentCartKey = cartKey.get();
    if (!currentCartKey) return;

    setIsCheckingOut(true);
    try {
      const cartData = await getCart();
      if (!cartData) throw new Error("Sync failed");

      const key = cartKey.get();
      const checkoutUrl = `https://dev-shop.meliponini.fr/checkout/?cocart-load-cart=${key}`;

      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 500);
    } catch (err) {
      console.error("Checkout failed", err);
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={$cart.isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:w-[400px] flex flex-col p-0 border-l border-border bg-background shadow-2xl">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-xl font-normal uppercase tracking-widest flex items-center justify-between">
            <span>Votre Panier</span>
            <span className="text-sm text-muted-foreground">{$cart.totals.count} article{$cart.totals.count > 1 ? "s" : ""}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {$cart.loading && $cart.items.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground uppercase tracking-widest text-xs">
              Chargement...
            </div>
          )}

          {!$cart.loading && $cart.items.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground text-sm uppercase tracking-widest">Votre panier est vide.</p>
              <Button 
                variant="outline" 
                onClick={() => toggleCart(false)}
                className="w-full uppercase tracking-widest text-xs h-12 rounded-none"
              >
                Continuer mes achats
              </Button>
            </div>
          )}

          {$cart.items.map((item: any) => {
            const price = (parseFloat(item.price) / 100).toFixed(2);
            const imgSrc = item.featured_image || (item.images && item.images[0] ? item.images[0].src : "/images/placeholder.png");
            const cleanImgSrc = imgSrc.replace("meliponini.remyparis.com", "dev-shop.meliponini.fr");

            return (
              <div key={item.item_key} className="flex gap-4 items-start border-b border-border/50 pb-6 relative">
                <div className="w-24 h-24 flex-shrink-0 bg-white border border-border/50 p-1 flex items-center justify-center">
                  <img src={cleanImgSrc} alt={item.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h3 className="font-normal uppercase tracking-wider text-sm leading-tight pr-6">
                    {item.name}
                  </h3>
                  <span className="text-xs text-muted-foreground mt-1 mb-3">{item.sku || "Miel Rare"}</span>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-border">
                      <button 
                        onClick={() => handleUpdateQuantity(item.item_key, item.quantity.value, -1)}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-zinc-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity.value}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.item_key, item.quantity.value, 1)}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-zinc-50"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold">{price} €</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemoveItem(item.item_key)}
                  className="absolute top-0 right-0 p-1 text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Supprimer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            );
          })}
        </div>

        {$cart.items.length > 0 && (
          <SheetFooter className="p-6 border-t border-border bg-zinc-50 flex-col gap-4">
            <div className="flex justify-between items-center w-full uppercase tracking-widest text-sm font-semibold">
              <span>Total</span>
              <span>{$cart.totals.total}</span>
            </div>
            
            <div className="flex flex-col gap-2 w-full mt-4">
              <Button 
                onClick={handleCheckout} 
                disabled={isCheckingOut}
                className="w-full h-12 bg-black text-white hover:bg-zinc-800 rounded-none uppercase tracking-widest text-xs relative overflow-hidden group"
              >
                <span className={`transition-transform duration-300 ${isCheckingOut ? "-translate-y-10" : "translate-y-0"}`}>
                  Commander
                </span>
                <span className={`absolute inset-0 flex items-center justify-center bg-black transition-transform duration-300 ${isCheckingOut ? "translate-y-0" : "translate-y-10"}`}>
                  Connexion sécurisée...
                </span>
              </Button>
              <button 
                onClick={() => toggleCart(false)}
                className="text-xs text-muted-foreground uppercase tracking-widest mt-2 hover:text-black transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface BudgetItem {
  name: string;
  amount: string;
}

export default function AdminBudgetCard({ isEn }: { isEn: boolean }) {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<BudgetItem[]>([
    { name: "", amount: "" },
  ]);

  if (!isAdmin) return null;

  const total = items.reduce((sum, item) => {
    const num = parseFloat(item.amount.replace(/\s/g, "")) || 0;
    return sum + num;
  }, 0);

  function addItem() {
    setItems([...items, { name: "", amount: "" }]);
  }

  function updateItem(index: number, field: keyof BudgetItem, value: string) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function formatCurrency(num: number) {
    return num.toLocaleString("cs-CZ") + " Kč";
  }

  return (
    <>
      <div
        id="rozpocet"
        className="pb-4 border-b border-border-dark"
        style={{ paddingTop: 60 }}
      >
        <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted flex items-center gap-2">
          {isEn ? "Budget" : "Rozpočet"} &bull; Admin
          <span className="text-[9px] bg-black/5 px-2 py-0.5 rounded-full normal-case tracking-normal font-normal">
            jen pro admina
          </span>
        </h3>
      </div>

      <div className="pt-8 pb-[60px] max-w-[600px]">
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(i, "name", e.target.value)}
                placeholder={isEn ? "Item name" : "Název položky"}
                className="flex-1 border-b border-black/10 bg-transparent py-2 text-sm font-light outline-none focus:border-black/30 transition-colors placeholder:text-black/20"
              />
              <input
                type="text"
                value={item.amount}
                onChange={(e) => updateItem(i, "amount", e.target.value)}
                placeholder="0"
                className="w-[120px] border-b border-black/10 bg-transparent py-2 text-sm font-light outline-none focus:border-black/30 transition-colors text-right placeholder:text-black/20"
              />
              <span className="text-[11px] text-black/30 w-6">Kč</span>
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(i)}
                  className="text-black/20 hover:text-red-400 text-sm transition-colors"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="mt-4 text-[11px] font-medium uppercase tracking-[0.1em] text-black/30 hover:text-black/60 transition-colors"
        >
          + {isEn ? "Add item" : "Přidat položku"}
        </button>

        <div className="mt-8 pt-4 border-t border-black/10 flex justify-between items-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-black/40">
            {isEn ? "Total" : "Celkem"}
          </span>
          <span className="text-lg font-light">{formatCurrency(total)}</span>
        </div>
      </div>
    </>
  );
}

// lib/app.ts
"use client";

import { useState, useEffect } from "react";

export function useSuveApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState([
    { id: "prod-1", name: "Tororo Cement", stock: 15, unit: "bag", costPrice: 26000, sellingPrice: 30000 },
    { id: "prod-2", name: "Tiles 300mmx300mm", stock: 40, unit: "sqm", costPrice: 15000, sellingPrice: 21000 },
    { id: "prod-3", name: "Hima Cement 50kg", stock: 25, unit: "bag", costPrice: 27000, sellingPrice: 31000 },
  ]);

  const [salesList, setSalesList] = useState([
    { id: "sale-1", productName: "Tororo Cement", customerName: "John Mukasa", quantity: 5, unit: "bag", totalAmount: 150000, amountPaid: 150000, profit: 20000, date: "2026-11-14" },
  ]);

  const [purchasesList, setPurchasesList] = useState<any[]>([]);

  const [customersList, setCustomersList] = useState([
    { id: "cust-1", name: "John Mukasa", phone: "0772123456", creditBalance: 0 },
    { id: "cust-2", name: "Grace Namubiru", phone: "0752987654", creditBalance: 110000 },
  ]);

  const [subscriptionDays, setSubscriptionDays] = useState(0);

  useEffect(() => {
    const savedProd = localStorage.getItem("suve_products");
    const savedSales = localStorage.getItem("suve_sales");
    const savedPurchases = localStorage.getItem("suve_purchases");
    const savedCust = localStorage.getItem("suve_customers");
    const savedDays = localStorage.getItem("suve_sub_days");

    if (savedProd) setProducts(JSON.parse(savedProd));
    if (savedSales) setSalesList(JSON.parse(savedSales));
    if (savedPurchases) setPurchasesList(JSON.parse(savedPurchases));
    if (savedCust) setCustomersList(JSON.parse(savedCust));
    if (savedDays !== null) {
      setSubscriptionDays(Number(savedDays));
    } else {
      setSubscriptionDays(0);
    }
  }, []);

  const updateSubscription = (days: number) => {
    const newDays = subscriptionDays + days;
    setSubscriptionDays(newDays);
    localStorage.setItem("suve_sub_days", String(newDays));
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    products,
    setProducts,
    salesList,
    setSalesList,
    purchasesList,
    setPurchasesList,
    customersList,
    setCustomersList,
    subscriptionDays,
    updateSubscription,
  };
}

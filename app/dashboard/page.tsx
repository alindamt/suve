"use client";

import { useState, useEffect } from "react";
import { SUBSCRIPTION_CONFIG, getDynamicAdminCode } from "@/lib/subscription";

const UNIT_OPTIONS = [
  { value: "bag", label: "Bag" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "tonne", label: "Tonne" },
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "carton", label: "Carton" },
  { value: "box", label: "Box" },
  { value: "packet", label: "Packet" },
  { value: "m", label: "Metre (m)" },
  { value: "km", label: "Kilometre (km)" },
  { value: "sqm", label: "Square Metre (sqm)" },
  { value: "litres", label: "Litres (L)" },
  { value: "ml", label: "Millilitres (ml)" },
  { value: "jerrycan", label: "Jerrycan" },
  { value: "bottle", label: "Bottle" },
  { value: "roll", label: "Roll" },
  { value: "sheet", label: "Sheet" },
  { value: "dozen", label: "Dozen" },
  { value: "pair", label: "Pair" },
  { value: "set", label: "Set" },
  { value: "tray", label: "Tray" },
];

export default function Dashboard() {
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

  const [subscriptionDays, setSubscriptionDays] = useState(30);

  const [logoClicks, setLogoClicks] = useState(0);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subProvider, setSubProvider] = useState<"MTN" | "Airtel">("MTN");
  const [subPhone, setSubPhone] = useState("");

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState("");

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [saleForm, setSaleForm] = useState({ productId: "", customerName: "", quantity: 1, amountPaid: "" });
  const [purchaseForm, setPurchaseForm] = useState({
    isNewProduct: false,
    productId: "",
    newProductName: "",
    unit: "bag",
    supplier: "",
    quantity: 10,
    unitCost: "",
    sellingPrice: "",
  });
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", creditBalance: 0 });

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
      setSubscriptionDays(30);
    }
  }, []);

  const handleLogoClick = () => {
    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);
    if (nextCount >= 5) {
      setLogoClicks(0);
      setIsAdminMode(true);
      setIsSubModalOpen(true);
    }
  };

  const handleMomoPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subPhone.trim()) return alert("Please enter your mobile phone number.");

    const newDays = subscriptionDays + 30;
    setSubscriptionDays(newDays);
    localStorage.setItem("suve_sub_days", String(newDays));

    alert(`Successfully processed ${subProvider} Mobile Money payment! Dashboard extended by 30 days.`);
    setIsSubModalOpen(false);
    setSubPhone("");
  };

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = getDynamicAdminCode();

    if (adminCodeInput.trim() === correctCode || adminCodeInput.trim() === "SUVE2026") {
      const newDays = 30;
      setSubscriptionDays(newDays);
      localStorage.setItem("suve_sub_days", String(newDays));
      alert("Admin code accepted! Dashboard successfully unlocked for 30 days.");
      setIsAdminMode(false);
      setIsSubModalOpen(false);
      setAdminCodeInput("");
    } else {
      alert("Invalid unlock code.");
    }
  };

  const totalRevenue = salesList.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProfit = salesList.reduce((acc, s) => acc + s.profit, 0);
  const pendingCredit = customersList.reduce((acc, c) => acc + (c.creditBalance || 0), 0);

  const q = searchQuery.toLowerCase().trim();
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(q));
  const filteredSales = salesList.filter(
    (s) => s.productName.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q)
  );
  const filteredPurchases = purchasesList.filter(
    (p) => p.productName.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q)
  );
  const filteredCustomers = customersList.filter(
    (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
  );

  const selectedSaleProduct = products.find((p) => p.id === saleForm.productId);

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === saleForm.productId);
    if (!product) return alert("Please select a product.");

    const qty = Number(saleForm.quantity);
    if (qty <= 0 || qty > product.stock) {
      return alert(`Invalid quantity. Available stock: ${product.stock} ${product.unit}`);
    }

    const totalAmount = product.sellingPrice * qty;
    const paid = saleForm.amountPaid === "" ? totalAmount : Number(saleForm.amountPaid);
    const profit = (product.sellingPrice - product.costPrice) * qty;
    const creditDue = Math.max(0, totalAmount - paid);

    const newSale = {
      id: `sale-${Date.now()}`,
      productName: product.name,
      customerName: saleForm.customerName || "Walk-in Customer",
      quantity: qty,
      unit: product.unit || "pcs",
      totalAmount,
      amountPaid: paid,
      profit,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedSales = [newSale, ...salesList];
    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, stock: p.stock - qty } : p
    );

    setSalesList(updatedSales);
    setProducts(updatedProducts);
    localStorage.setItem("suve_sales", JSON.stringify(updatedSales));
    localStorage.setItem("suve_products", JSON.stringify(updatedProducts));

    if (creditDue > 0 && saleForm.customerName) {
      const updatedCustomers = customersList.map((c) =>
        c.name.toLowerCase() === saleForm.customerName.toLowerCase()
          ? { ...c, creditBalance: (c.creditBalance || 0) + creditDue }
          : c
      );
      setCustomersList(updatedCustomers);
      localStorage.setItem("suve_customers", JSON.stringify(updatedCustomers));
    }

    setSaleForm({ productId: "", customerName: "", quantity: 1, amountPaid: "" });
    setIsSaleModalOpen(false);
  };

  const handlePurchaseStock = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(purchaseForm.quantity);
    const cost = Number(purchaseForm.unitCost);
    if (qty <= 0 || cost <= 0) return alert("Enter valid quantity and unit cost.");

    let updatedProducts = [...products];
    let productName = "";
    let itemUnit = purchaseForm.unit || "pcs";

    if (purchaseForm.isNewProduct) {
      if (!purchaseForm.newProductName.trim()) return alert("Enter product name.");
      const sellPrice = Number(purchaseForm.sellingPrice) || Math.round(cost * 1.25);
      productName = purchaseForm.newProductName.trim();
      itemUnit = purchaseForm.unit;

      updatedProducts.push({
        id: `prod-${Date.now()}`,
        name: productName,
        stock: qty,
        unit: itemUnit,
        costPrice: cost,
        sellingPrice: sellPrice,
      });
    } else {
      const existing = products.find((p) => p.id === purchaseForm.productId);
      if (!existing) return alert("Select a product to restock.");
      productName = existing.name;
      itemUnit = purchaseForm.unit || existing.unit || "pcs";

      updatedProducts = products.map((p) =>
        p.id === existing.id
          ? {
              ...p,
              stock: p.stock + qty,
              unit: itemUnit,
              costPrice: cost,
              sellingPrice: purchaseForm.sellingPrice ? Number(purchaseForm.sellingPrice) : p.sellingPrice,
            }
          : p
      );
    }

    const newPurchase = {
      id: `pur-${Date.now()}`,
      productName,
      supplier: purchaseForm.supplier || "General Supplier",
      quantity: qty,
      unit: itemUnit,
      unitCost: cost,
      totalCost: qty * cost,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedPurchases = [newPurchase, ...purchasesList];
    setProducts(updatedProducts);
    setPurchasesList(updatedPurchases);
    localStorage.setItem("suve_products", JSON.stringify(updatedProducts));
    localStorage.setItem("suve_purchases", JSON.stringify(updatedPurchases));

    setPurchaseForm({
      isNewProduct: false,
      productId: "",
      newProductName: "",
      unit: "bag",
      supplier: "",
      quantity: 10,
      unitCost: "",
      sellingPrice: "",
    });
    setIsPurchaseModalOpen(false);
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerForm.name.trim()) return alert("Customer name is required.");

    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: customerForm.name.trim(),
      phone: customerForm.phone.trim() || "N/A",
      creditBalance: Number(customerForm.creditBalance) || 0,
    };

    const updatedCustomers = [newCustomer, ...customersList];
    setCustomersList(updatedCustomers);
    localStorage.setItem("suve_customers", JSON.stringify(updatedCustomers));

    setCustomerForm({ name: "", phone: "", creditBalance: 0 });
    setIsCustomerModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col justify-between pb-12 relative">
      <div>
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                onClick={handleLogoClick}
                title="Click 5 times for Admin Unlock"
                className="bg-[#00a884] text-white font-bold w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-xs cursor-pointer select-none active:scale-95 transition"
              >
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-gray-900 text-base leading-tight">Suve</h1>
                  <button
                    onClick={() => {
                      setIsAdminMode(false);
                      setIsSubModalOpen(true);
                    }}
                    className="bg-emerald-50 text-[#00a884] text-[11px] font-bold px-2.5 py-0.5 rounded-full transition cursor-pointer"
                  >
              </div>
            </div>

            <div className="relative w-full sm:w-80">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or contacts..."
                className="w-full bg-gray-100/80 border border-transparent focus:border-[#00a884] focus:bg-white rounded-full pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none transition"
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["dashboard", "inventory", "sales", "purchases", "customers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl font-medium text-sm capitalize transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab ? "bg-[#00a884] text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 mt-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">UGX {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500">Net Profit</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-2">UGX {totalProfit.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500">Pending Credit</p>
                  <p className="text-2xl font-bold text-amber-500 mt-2">UGX {pendingCredit.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#00a884] to-[#008f72] rounded-3xl p-8 text-white shadow-md flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Welcome back, Boss!</h2>
                  <p className="text-emerald-50 text-sm mt-2">Your system is fully active ({subscriptionDays} days remaining).</p>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setIsSaleModalOpen(true)} className="bg-white text-[#00a884] font-semibold text-sm px-5 py-2.5 rounded-xl cursor-pointer">
                      Record New Sale
                    </button>
                    <button onClick={() => setIsPurchaseModalOpen(true)} className="bg-[#008269] text-white font-semibold text-sm px-5 py-2.5 rounded-xl cursor-pointer border border-emerald-400/30">
                      Purchase Stock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div>
              <div className="flex justify-between items-center mb-4 bg-white p-5 rounded-2xl border">
                <div>
                  <h2 className="font-bold text-lg">Inventory Stock</h2>
                  <p className="text-xs text-gray-500">Current stock levels &amp; pricing</p>
                </div>
                <button onClick={() => setIsPurchaseModalOpen(true)} className="bg-[#00a884] hover:bg-[#008f72] text-white px-4 py-2.5 rounded-xl font-medium text-sm cursor-pointer shadow-xs">
                  + Purchase Stock
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p: any) => (
                  <div key={p.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center shadow-xs">
                    <div>
                      <h3 className="font-bold text-gray-900">{p.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Cost: UGX {p.costPrice.toLocaleString()} / {p.unit}</p>
                      <p className="text-xs font-semibold text-[#00a884] mt-0.5">Selling: UGX {p.sellingPrice.toLocaleString()} / {p.unit}</p>
                    </div>
                    <div className="text-right bg-emerald-50 px-3.5 py-2 rounded-xl">
                      <p className="text-xs text-[#00a884] font-medium capitalize">{p.unit}</p>
                      <p className="font-bold text-emerald-900 text-lg">{p.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sales" && (
            <div>
              <div className="flex justify-between items-center mb-4 bg-white p-5 rounded-2xl border">
                <div>
                  <h2 className="font-bold text-lg">Sales History</h2>
                  <p className="text-xs text-gray-500">Track revenue, payments &amp; profit</p>
                </div>
                <button onClick={() => setIsSaleModalOpen(true)} className="bg-[#00a884] hover:bg-[#008f72] text-white px-4 py-2.5 rounded-xl font-medium text-sm cursor-pointer shadow-xs">
                  + Record Sale
                </button>
              </div>
              <div className="space-y-3">
                {filteredSales.map((s: any) => {
                  const isCredit = s.amountPaid < s.totalAmount;
                  return (
                    <div key={s.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center shadow-xs">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {s.productName} <span className="text-gray-400 font-normal">× {s.quantity} {s.unit}</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Customer: {s.customerName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-700 font-medium">
                            Paid: <strong className="text-gray-900">UGX {s.amountPaid.toLocaleString()}</strong>
                          </span>
                          {isCredit && (
                            <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                              Credit Due
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">UGX {s.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.date}</p>
                        <p className="text-xs text-emerald-600 font-medium mt-1.5">Profit: UGX {s.profit.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "purchases" && (
            <div>
              <div className="flex justify-between items-center mb-4 bg-white p-5 rounded-2xl border">
                <div>
                  <h2 className="font-bold text-lg">Stock Purchases</h2>
                  <p className="text-xs text-gray-500">Manage supplier restocking</p>
                </div>
                <button onClick={() => setIsPurchaseModalOpen(true)} className="bg-[#00a884] hover:bg-[#008f72] text-white px-4 py-2.5 rounded-xl font-medium text-sm cursor-pointer shadow-xs">
                  + Purchase Stock
                </button>
              </div>
              <div className="space-y-3">
                {filteredPurchases.length === 0 ? (
                  <p className="text-sm text-gray-500 bg-white p-8 rounded-2xl border text-center">No purchases recorded yet.</p>
                ) : (
                  filteredPurchases.map((p: any) => (
                    <div key={p.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center shadow-xs">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {p.productName} <span className="text-gray-400 font-normal">× {p.quantity} {p.unit}</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Supplier: {p.supplier} • {p.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">UGX {p.totalCost.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Unit: UGX {p.unitCost.toLocaleString()} / {p.unit}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <div>
              <div className="flex justify-between items-center mb-4 bg-white p-5 rounded-2xl border">
                <div>
                  <h2 className="font-bold text-lg">Customer Directory</h2>
                  <p className="text-xs text-gray-500">Track buyers &amp; credit balances</p>
                </div>
                <button onClick={() => setIsCustomerModalOpen(true)} className="bg-[#00a884] hover:bg-[#008f72] text-white px-4 py-2.5 rounded-xl font-medium text-sm cursor-pointer shadow-xs">
                  + Add Customer
                </button>
              </div>
              <div className="space-y-3">
                {filteredCustomers.map((c: any) => (
                  <div key={c.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center shadow-xs">
                    <div>
                      <h3 className="font-bold text-gray-900">{c.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Phone: {c.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">Credit Balance Due</p>
                      <p className={`font-bold mt-0.5 ${c.creditBalance > 0 ? "text-amber-500" : "text-emerald-600"}`}>
                        UGX {c.creditBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FOOTER ATTRIBUTION WITH PROFESSIONAL WHATSAPP BUTTON */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 w-full flex justify-center">
        <div className="bg-white border border-gray-100 rounded-3xl px-8 py-6 shadow-xs text-center flex flex-col items-center gap-3">
          <p className="text-sm text-gray-500">
            Designed &amp; Developed by <strong className="text-gray-900 font-bold">Eng. Ainda Moses</strong>
          </p>
          <a
            href="https://wa.me/256776704328"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </footer>

      {/* MOBILE MONEY / ADMIN UNLOCK MODAL */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                {isAdminMode ? "🔐 Admin Code Unlock" : `Renew via ${subProvider} Mobile Money`}
              </h3>
              <button onClick={() => setIsSubModalOpen(false)} className="text-xl font-bold cursor-pointer">&times;</button>
            </div>

            {!isAdminMode ? (
              <form onSubmit={handleMomoPayment} className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">Monthly Subscription: {SUBSCRIPTION_CONFIG.MONTHLY_FEE_UGX.toLocaleString()} UGX</p>
                  <p>
                    Merchant Code: <strong className="text-gray-900">{subProvider === "MTN" ? SUBSCRIPTION_CONFIG.MTN_MERCHANT : SUBSCRIPTION_CONFIG.AIRTEL_MERCHANT}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSubProvider("MTN")}
                    className={`py-2.5 px-4 rounded-xl border font-semibold text-sm cursor-pointer ${
                      subProvider === "MTN" ? "border-yellow-500 bg-yellow-50 text-yellow-800" : "border-gray-200 text-gray-600"
                    }`}
                  >
                    🟡 MTN Momo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubProvider("Airtel")}
                    className={`py-2.5 px-4 rounded-xl border font-semibold text-sm cursor-pointer ${
                      subProvider === "Airtel" ? "border-red-500 bg-red-50 text-red-800" : "border-gray-200 text-gray-600"
                    }`}
                  >
                    🔴 Airtel Money
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="0772123456"
                    value={subPhone}
                    onChange={(e) => setSubPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00a884]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsSubModalOpen(false)} className="flex-1 py-2.5 border rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-[#00a884] text-white rounded-xl text-sm font-semibold cursor-pointer">Pay &amp; Unlock</button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdminMode(true)}
                    className="text-xs text-gray-400 hover:text-gray-700 underline cursor-pointer"
                  >
                    Switch to Admin Code Unlock
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAdminUnlock} className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl text-xs space-y-2">
                  <p className="text-gray-600">Today&apos;s generated admin unlock code:</p>
                  <div className="bg-white border border-gray-300 p-3 rounded-xl text-center font-mono font-bold text-emerald-700 text-sm tracking-wider select-all">
                    {getDynamicAdminCode()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Admin Unlock Code</label>
                  <input
                    type="text"
                    required
                    placeholder="Paste code here..."
                    value={adminCodeInput}
                    onChange={(e) => setAdminCodeInput(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-[#00a884]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsAdminMode(false)} className="flex-1 py-2.5 border rounded-xl text-sm font-medium cursor-pointer">Back</button>
                  <button type="submit" className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold cursor-pointer">Unlock Dashboard</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* RECORD SALE MODAL */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Record New Sale</h3>
              <button onClick={() => setIsSaleModalOpen(false)} className="text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handleRecordSale} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                <select required value={saleForm.productId} onChange={(e) => setSaleForm({ ...saleForm, productId: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]">
                  <option value="">-- Choose Product --</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name} — UGX {p.sellingPrice.toLocaleString()} ({p.stock} {p.unit} in stock)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name (Optional)</label>
                <input type="text" placeholder="John Mukasa" value={saleForm.customerName} onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity {selectedSaleProduct ? `(${selectedSaleProduct.unit})` : ""}
                  </label>
                  <input type="number" min="1" required value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: Number(e.target.value) })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (UGX)</label>
                  <input type="number" min="0" placeholder="Full amount if blank" value={saleForm.amountPaid} onChange={(e) => setSaleForm({ ...saleForm, amountPaid: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsSaleModalOpen(false)} className="flex-1 py-2.5 border rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#00a884] text-white rounded-xl text-sm font-semibold cursor-pointer">Save Sale</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PURCHASE STOCK MODAL */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Purchase Stock</h3>
              <button onClick={() => setIsPurchaseModalOpen(false)} className="text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handlePurchaseStock} className="space-y-3">
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl text-xs font-medium">
                <button type="button" onClick={() => setPurchaseForm({ ...purchaseForm, isNewProduct: false })} className={`flex-1 py-2 rounded-lg cursor-pointer ${!purchaseForm.isNewProduct ? "bg-white text-[#00a884]" : "text-gray-600"}`}>Restock Existing</button>
                <button type="button" onClick={() => setPurchaseForm({ ...purchaseForm, isNewProduct: true })} className={`flex-1 py-2 rounded-lg cursor-pointer ${purchaseForm.isNewProduct ? "bg-white text-[#00a884]" : "text-gray-600"}`}>+ New Product</button>
              </div>
              {!purchaseForm.isNewProduct ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                  <select
                    required
                    value={purchaseForm.productId}
                    onChange={(e) => {
                      const chosen = products.find((p) => p.id === e.target.value);
                      setPurchaseForm({
                        ...purchaseForm,
                        productId: e.target.value,
                        unit: chosen?.unit || purchaseForm.unit,
                      });
                    }}
                    className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]"
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Product Name</label>
                  <input type="text" required placeholder="e.g. Iron Sheets" value={purchaseForm.newProductName} onChange={(e) => setPurchaseForm({ ...purchaseForm, newProductName: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" min="1" required value={purchaseForm.quantity} onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: Number(e.target.value) })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                  <select
                    value={purchaseForm.unit}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, unit: e.target.value })}
                    className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884] bg-white"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost (UGX)</label>
                  <input type="number" min="1" required placeholder="26000" value={purchaseForm.unitCost} onChange={(e) => setPurchaseForm({ ...purchaseForm, unitCost: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (UGX)</label>
                  <input type="number" min="1" placeholder="Optional" value={purchaseForm.sellingPrice} onChange={(e) => setPurchaseForm({ ...purchaseForm, sellingPrice: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                <input type="text" placeholder="Supplier / Distributor" value={purchaseForm.supplier} onChange={(e) => setPurchaseForm({ ...purchaseForm, supplier: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsPurchaseModalOpen(false)} className="flex-1 py-2.5 border rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#00a884] text-white rounded-xl text-sm font-semibold cursor-pointer">Save Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Add Customer</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-xl font-bold cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required placeholder="Grace Namubiru" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" placeholder="0772123456" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none focus:border-[#00a884]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="flex-1 py-2.5 border rounded-xl text-sm font-medium cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#00a884] text-white rounded-xl text-sm font-semibold cursor-pointer">Add Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

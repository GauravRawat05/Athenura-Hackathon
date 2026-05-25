import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Building2, CheckCircle2, Clock, XCircle,
  Filter, Eye, Pencil, Trash2, ChevronDown, ChevronLeft, ChevronRight,
  Plus, UploadCloud, TrendingUp, TrendingDown, ArrowUpDown, X,
} from "lucide-react";
let toastId = 0;

function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
  };

  return { toasts, toast, removeToast: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)) };
}

function ToastContainer({ toasts, removeToast }) {
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-rose-50 border-rose-200 text-rose-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
    error: <XCircle className="h-4 w-4 text-rose-500 shrink-0" />,
    info: <Bell className="h-4 w-4 text-blue-500 shrink-0" />,
  };
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-72">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 shadow-lg text-sm font-medium ${styles[t.type]}`}
          >
            {icons[t.type]}
            <span className="flex-1">{t.message}</span>
            <button type="button" onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100 transition">
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
const COLORS = [
  "from-red-400 to-rose-500",
  "from-blue-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-yellow-400 to-amber-500",
  "from-violet-400 to-purple-500",
  "from-green-400 to-emerald-500",
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-sky-500",
];

const initialUniversities = [
  { id: 1, name: "IIT Bombay", city: "Mumbai", state: "Maharashtra", address: "Powai, Mumbai", email: "admin@iitb.ac.in", contact: "Dr. Rajeev Sharma", contactEmail: "rajeev@iitb.ac.in", phone: "+91 98765 43210", status: "Active", added: "May 20, 2026", addedTs: new Date("2026-05-20").getTime(), color: COLORS[0] },
  { id: 2, name: "IIT Delhi", city: "New Delhi", state: "Delhi", address: "Hauz Khas, Delhi", email: "admin@iitd.ac.in", contact: "Prof. Meera Iyer", contactEmail: "meera@iitd.ac.in", phone: "+91 98765 43211", status: "Active", added: "May 18, 2026", addedTs: new Date("2026-05-18").getTime(), color: COLORS[1] },
  { id: 3, name: "BITS Pilani", city: "Pilani", state: "Rajasthan", address: "Vidya Vihar, Pilani", email: "admin@bits-pilani.ac.in", contact: "Dr. Anirudh Verma", contactEmail: "anirudh@bits.ac.in", phone: "+91 98765 43212", status: "Active", added: "May 15, 2026", addedTs: new Date("2026-05-15").getTime(), color: COLORS[2] },
  { id: 4, name: "VIT Vellore", city: "Vellore", state: "Tamil Nadu", address: "Katpadi, Vellore", email: "admin@vit.ac.in", contact: "Dr. Karthik N", contactEmail: "karthik@vit.ac.in", phone: "+91 98765 43213", status: "Pending", added: "May 12, 2026", addedTs: new Date("2026-05-12").getTime(), color: COLORS[3] },
  { id: 5, name: "SRM University", city: "Chennai", state: "Tamil Nadu", address: "Kattankulathur", email: "admin@srmist.edu.in", contact: "Dr. Priya Nair", contactEmail: "priya@srm.edu.in", phone: "+91 98765 43214", status: "Active", added: "May 10, 2026", addedTs: new Date("2026-05-10").getTime(), color: COLORS[4] },
  { id: 6, name: "Amity University", city: "Noida", state: "Uttar Pradesh", address: "Sector 125, Noida", email: "admin@amity.edu", contact: "Mr. Sandeep Arora", contactEmail: "sandeep@amity.edu", phone: "+91 98765 43215", status: "Inactive", added: "May 05, 2026", addedTs: new Date("2026-05-05").getTime(), color: COLORS[5] },
  { id: 7, name: "Manipal Institute of Technology", city: "Manipal", state: "Karnataka", address: "Manipal", email: "admin@mit.edu", contact: "Dr. Vineet Singh", contactEmail: "vineet@mit.edu", phone: "+91 98765 43216", status: "Active", added: "May 02, 2026", addedTs: new Date("2026-05-02").getTime(), color: COLORS[6] },
  { id: 8, name: "Jadavpur University", city: "Kolkata", state: "West Bengal", address: "Jadavpur, Kolkata", email: "admin@jadavpuruniversity.in", contact: "Dr. Subhajit Pal", contactEmail: "subhajit@ju.in", phone: "+91 98765 43217", status: "Pending", added: "Apr 28, 2026", addedTs: new Date("2026-04-28").getTime(), color: COLORS[7] },
];

const STATUS_FILTERS = ["All", "Active", "Pending", "Inactive"];
const PAGE_SIZE = 5;

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-100/70 text-emerald-700 ring-1 ring-emerald-200",
    Pending: "bg-amber-100/70 text-amber-700 ring-1 ring-amber-200",
    Inactive: "bg-violet-100/70 text-violet-700 ring-1 ring-violet-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function ActionButton({ icon: Icon, color, onClick, title }) {
  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      title={title}
      type="button"
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 backdrop-blur ring-1 ring-white/60 shadow-sm hover:shadow-md transition ${color}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </motion.button>
  );
}

const emptyForm = {
  name: "", email: "", address: "", contact: "", contactEmail: "", phone: "", status: "Active",
};

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between border-b border-slate-100 pb-2 gap-2">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="font-medium text-[#0b1b52] text-right break-all">{value || "—"}</span>
    </div>
  );
}

export function UniversityDashboard() {
  const { toasts, toast, removeToast } = useToast();

  const [universities, setUniversities] = useState(initialUniversities);
  const [globalSearch, setGlobalSearch] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortBy, setSortBy] = useState("added");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);


  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [logoName, setLogoName] = useState("");

  const effectiveSearch = (globalSearch || search).toLowerCase();

  const filtered = useMemo(() => {
    let list = universities.filter((u) => {
      const matchesSearch =
        !effectiveSearch ||
        (u.name + " " + u.email + " " + u.contact + " " + u.city + " " + u.state).toLowerCase().includes(effectiveSearch);
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    if (sortBy === "added") {
      list = [...list].sort((a, b) => sortDir === "asc" ? a.addedTs - b.addedTs : b.addedTs - a.addedTs);
    } else if (sortBy === "status") {
      list = [...list].sort((a, b) => sortDir === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));
    }
    return list;
  }, [universities, effectiveSearch, statusFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = useMemo(() => {
    const total = universities.length;
    const active = universities.filter((u) => u.status === "Active").length;
    const pending = universities.filter((u) => u.status === "Pending").length;
    const inactive = universities.filter((u) => u.status === "Inactive").length;
    return [
      { title: "Total", value: String(total), change: "12.5%", trend: "up", icon: Building2, iconBg: "from-blue-400 to-blue-600", iconRing: "bg-blue-100" },
      { title: "Active", value: String(active), change: "10.3%", trend: "up", icon: CheckCircle2, iconBg: "from-emerald-400 to-emerald-600", iconRing: "bg-emerald-100" },
      { title: "Pending", value: String(pending), change: "2.1%", trend: "down", icon: Clock, iconBg: "from-amber-400 to-orange-500", iconRing: "bg-amber-100" },
      { title: "Inactive", value: String(inactive), change: "14.3%", trend: "down", icon: XCircle, iconBg: "from-violet-400 to-purple-600", iconRing: "bg-violet-100" },
    ];
  }, [universities]);

  function toggleSort(col) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("desc"); }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setLogoName("");
    setShowForm(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.contact.trim()) {
      toast.error("Please fill in name, email, and contact person.");
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      toast.error("Please enter a valid university email.");
      return;
    }
    if (editingId !== null) {
      setUniversities((list) => list.map((u) => u.id === editingId ? {
        ...u, name: form.name, email: form.email, address: form.address,
        contact: form.contact, contactEmail: form.contactEmail, phone: form.phone, status: form.status,
      } : u));
      toast.success(`Updated ${form.name}`);
    } else {
      const ts = Date.now();
      const newU = {
        id: ts, name: form.name,
        city: form.address.split(",")[0]?.trim() || "—",
        state: form.address.split(",")[1]?.trim() || "—",
        address: form.address, email: form.email, contact: form.contact,
        contactEmail: form.contactEmail, phone: form.phone, status: form.status,
        added: formatDate(ts), addedTs: ts,
        color: COLORS[universities.length % COLORS.length],
      };
      setUniversities((list) => [newU, ...list]);
      toast.success(`Added ${form.name}`);
    }
    resetForm();
  }

  function handleEdit(u) {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, address: u.address, contact: u.contact, contactEmail: u.contactEmail, phone: u.phone, status: u.status });
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  function confirmDelete() {
    if (!deleting) return;
    setUniversities((list) => list.filter((u) => u.id !== deleting.id));
    toast.success(`Deleted ${deleting.name}`);
    setDeleting(null);
  }

  function handleLogo(e) {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 2 * 1024 * 1024) { toast.error("File exceeds 2MB"); return; }
      setLogoName(f.name);
    }
  }

  const pageNumbers = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const arr = [1];
    if (currentPage > 3) arr.push("...");
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) arr.push(p);
    if (currentPage < totalPages - 2) arr.push("...");
    arr.push(totalPages);
    return arr;
  })();

  const FormPanel = () => (
    <div className="rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <Plus className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold text-[#0b1b52]">{editingId !== null ? "Edit University" : "Add New University"}</h3>
        </div>
        <button type="button" onClick={resetForm} className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          { key: "name", label: "University Name", placeholder: "Enter university name" },
          { key: "email", label: "University Email", placeholder: "Enter official university email", type: "email" },
          { key: "address", label: "Address", placeholder: "City, State" },
          { key: "contact", label: "Contact Person", placeholder: "Enter contact person name" },
          { key: "contactEmail", label: "Contact Email", placeholder: "Enter contact email", type: "email" },
          { key: "phone", label: "Contact Phone", placeholder: "Enter contact phone number" },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-[#0b1b52]/80 mb-1">{f.label}</label>
            <input
              type={f.type || "text"}
              value={form[f.key]}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="h-10 w-full rounded-xl bg-white/80 px-3 text-sm ring-1 ring-slate-200/70 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-300 transition"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-[#0b1b52]/80 mb-1">Status</label>
          <div className="relative">
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
              className="h-10 w-full appearance-none rounded-xl bg-white/80 px-3 pr-9 text-sm ring-1 ring-slate-200/70 outline-none focus:ring-2 focus:ring-blue-300 transition"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0b1b52]/80 mb-1">University Logo (Optional)</label>
          <label htmlFor="logo-upload" className="block cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-white/50 px-3 py-4 text-center hover:bg-blue-50/50 transition">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <UploadCloud className="h-4 w-4" />
              </div>
              <p className="text-xs text-[#0b1b52]"><span className="font-semibold text-blue-600">Click to upload</span></p>
              <p className="text-xs text-slate-400">{logoName || "PNG, JPG up to 2MB"}</p>
            </div>
          </label>
          <input id="logo-upload" type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogo} />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <motion.button type="button" onClick={resetForm} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="h-10 rounded-xl bg-white/80 text-sm font-medium text-[#0b1b52] ring-1 ring-slate-200 hover:shadow-md transition">
            Cancel
          </motion.button>
          <motion.button type="submit" whileHover={{ y: -1, boxShadow: "0 12px 30px rgba(37,99,235,0.4)" }} whileTap={{ scale: 0.97 }} className="h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition">
            {editingId !== null ? "Save Changes" : "Create"}
          </motion.button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#ecfcff] via-[#f5feff] to-[#dff4ff] font-sans text-[#0b1b52]">
      {/* Custom Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1800px] px-3 py-4 sm:px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0b1b52]">University Management</h1>
          </div>
          <div className="flex-1" />
        
          <img src="https://i.pravatar.cc/80" alt="avatar" className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
        </motion.div>
        <motion.section initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
          className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <motion.div key={s.title}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(37,99,235,0.13)" }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="rounded-[20px] border border-white/60 bg-white/70 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconRing}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${s.iconBg} text-white shadow`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 truncate">{s.title}</p>
                  <p className="mt-0.5 text-2xl font-bold text-[#0b1b52]">{s.value}</p>
                  <p className={`mt-1 flex items-center gap-0.5 text-xs font-medium ${s.trend === "up" ? "text-emerald-600" : "text-rose-500"}`}>
                    {s.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {s.change}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>
        <div className="lg:hidden mt-4">
          <motion.button
            type="button"
            onClick={() => { resetForm(); setShowForm(true); }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="w-full h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 transition">
            <Plus className="h-4 w-4" /> Add New University
          </motion.button>
        </div>
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="lg:hidden mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}>
              <FormPanel />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-10 gap-5">

          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0b1b52]">Universities</h2>
                <span className="text-xs text-slate-400">{filtered.length} entries</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[160px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by name or email..."
                    className="h-9 w-full rounded-xl bg-white/80 pl-9 pr-3 text-xs ring-1 ring-slate-200/70 border border-slate-200/70 outline-none focus:ring-2 focus:ring-blue-300 transition placeholder:text-slate-400"
                  />
                </div>

                <div className="relative">
                  <button type="button" onClick={() => setStatusOpen((o) => !o)}
                    className="inline-flex items-center gap-1.5 h-9 rounded-xl bg-white/80 px-3 text-xs text-[#0b1b52] border border-slate-200/70 hover:shadow-md transition whitespace-nowrap">
                    {statusFilter === "All" ? "All Status" : statusFilter}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <AnimatePresence>
                    {statusOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                        <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200">
                          {STATUS_FILTERS.map((s) => (
                            <li key={s}>
                              <button type="button" onClick={() => { setStatusFilter(s); setStatusOpen(false); setPage(1); }}
                                className={`flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-blue-50 transition ${statusFilter === s ? "text-blue-600 font-semibold" : "text-[#0b1b52]"}`}>
                                {s === "All" ? "All Status" : s}
                                {statusFilter === s && <CheckCircle2 className="h-3.5 w-3.5" />}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <button type="button"
                  onClick={() => { setSearch(""); setGlobalSearch(""); setStatusFilter("All"); setSortBy("added"); setSortDir("desc"); setPage(1); toast.success("Filters cleared"); }}
                  className="inline-flex items-center gap-1.5 h-9 rounded-xl bg-white/80 px-3 text-xs text-[#0b1b52] border border-slate-200/70 hover:shadow-md transition">
                  <Filter className="h-3.5 w-3.5" /> Reset
                </button>
              </div>
            </div>
            <div className="mt-4 hidden md:block overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full min-w-[700px] border-separate border-spacing-y-1.5">
                <thead>
                  <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-3 pb-2">University</th>
                    <th className="px-3 pb-2">Email</th>
                    <th className="px-3 pb-2">Contact</th>
                    <th className="px-3 pb-2">
                      <button type="button" onClick={() => toggleSort("status")}
                        className="inline-flex items-center gap-1 uppercase hover:text-[#0b1b52] transition">
                        Status <ArrowUpDown className={`h-3 w-3 ${sortBy === "status" ? "text-blue-500" : ""}`} />
                      </button>
                    </th>
                    <th className="px-3 pb-2">
                      <button type="button" onClick={() => toggleSort("added")}
                        className="inline-flex items-center gap-1 uppercase hover:text-[#0b1b52] transition">
                        Added <ArrowUpDown className={`h-3 w-3 ${sortBy === "added" ? "text-blue-500" : ""}`} />
                      </button>
                    </th>
                    <th className="px-3 pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {paged.map((u, i) => (
                      <motion.tr key={u.id} layout
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, delay: 0.02 * i }}
                        className="bg-white/60 hover:bg-white/90 transition rounded-2xl shadow-sm">
                        <td className="px-3 py-3 rounded-l-2xl">
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${u.color} text-white text-xs font-bold shadow`}>
                              {u.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#0b1b52] leading-tight">{u.name}</p>
                              <p className="text-[10px] text-slate-500">{u.city}, {u.state}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-600 max-w-[140px] truncate">{u.email}</td>
                        <td className="px-3 py-3">
                          <p className="text-xs font-medium text-[#0b1b52]">{u.contact}</p>
                          <p className="text-[10px] text-slate-500">{u.phone}</p>
                        </td>
                        <td className="px-3 py-3"><StatusBadge status={u.status} /></td>
                        <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">{u.added}</td>
                        <td className="px-3 py-3 rounded-r-2xl">
                          <div className="flex items-center gap-1.5">
                            <ActionButton icon={Eye} color="text-blue-500" title="View" onClick={() => setViewing(u)} />
                            <ActionButton icon={Pencil} color="text-amber-500" title="Edit" onClick={() => handleEdit(u)} />
                            <ActionButton icon={Trash2} color="text-rose-500" title="Delete" onClick={() => setDeleting(u)} />
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {paged.length === 0 && (
                    <tr><td colSpan={6} className="py-10 text-center text-xs text-slate-400">No universities match your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 md:hidden space-y-3">
              <AnimatePresence mode="popLayout">
                {paged.map((u, i) => (
                  <motion.div key={u.id} layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, delay: 0.03 * i }}
                    className="bg-white/80 rounded-2xl shadow-sm p-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${u.color} text-white text-xs font-bold shadow`}>
                        {u.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0b1b52] truncate">{u.name}</p>
                        <p className="text-xs text-slate-500 truncate">{u.city}, {u.state}</p>
                      </div>
                      <StatusBadge status={u.status} />
                    </div>
                    <div className="mt-2.5 grid grid-cols-1 gap-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-400 shrink-0">Email:</span>
                        <span className="truncate">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-400 shrink-0">Contact:</span>
                        <span className="truncate">{u.contact} · {u.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 shrink-0">Added:</span>
                        <span>{u.added}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <ActionButton icon={Eye} color="text-blue-500" title="View" onClick={() => setViewing(u)} />
                      <ActionButton icon={Pencil} color="text-amber-500" title="Edit" onClick={() => handleEdit(u)} />
                      <ActionButton icon={Trash2} color="text-rose-500" title="Delete" onClick={() => setDeleting(u)} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {paged.length === 0 && (
                <div className="py-10 text-center text-xs text-slate-400">No universities match your filters.</div>
              )}
            </div>
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500 shrink-0">
                {filtered.length === 0 ? "0" : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)}`} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button type="button" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 ring-1 ring-slate-200 text-slate-500 hover:shadow transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {pageNumbers.map((p, idx) =>
                  p === "..." ? (
                    <span key={`e${idx}`} className="px-1 text-slate-400 text-xs">…</span>
                  ) : (
                    <button key={p} type="button" onClick={() => setPage(p)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${p === currentPage ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30" : "bg-white/80 ring-1 ring-slate-200 text-[#0b1b52] hover:shadow"}`}>
                      {p}
                    </button>
                  )
                )}
                <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 ring-1 ring-slate-200 text-slate-500 hover:shadow transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.section>
          <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:block lg:col-span-3 lg:sticky lg:top-6 h-fit">
            <FormPanel />
          </motion.aside>
        </div>
      </div>
      <AnimatePresence>
        {viewing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setViewing(null)}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${viewing.color} text-white font-bold shadow`}>
                    {viewing.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0b1b52]">{viewing.name}</h3>
                    <p className="text-xs text-slate-500">{viewing.city}, {viewing.state}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setViewing(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2.5 text-sm">
                <Row label="Email" value={viewing.email} />
                <Row label="Address" value={viewing.address} />
                <Row label="Contact Person" value={viewing.contact} />
                <Row label="Contact Email" value={viewing.contactEmail} />
                <Row label="Phone" value={viewing.phone} />
                <Row label="Added" value={viewing.added} />
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Status</span>
                  <StatusBadge status={viewing.status} />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setViewing(null)}
                  className="h-10 rounded-xl bg-slate-100 px-4 text-sm font-medium text-[#0b1b52] hover:bg-slate-200 transition">Close</button>
                <button type="button" onClick={() => { handleEdit(viewing); setViewing(null); }}
                  className="h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition">Edit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleting(null)}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600 shrink-0">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b1b52]">Delete University?</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Are you sure you want to delete <span className="font-semibold text-[#0b1b52]">{deleting.name}</span>?
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setDeleting(null)}
                  className="h-10 rounded-xl bg-slate-100 px-4 text-sm font-medium text-[#0b1b52] hover:bg-slate-200 transition">Cancel</button>
                <button type="button" onClick={confirmDelete}
                  className="h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 px-4 text-sm font-semibold text-white shadow-md shadow-rose-500/30 transition">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UniversityDashboard;
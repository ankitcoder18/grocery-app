// client/src/components/ShoppingPlanner.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiSave, FiCheckCircle, FiShoppingCart, FiChevronDown, FiChevronUp, FiX, FiEdit2 } from 'react-icons/fi';
import { shoppingApi, groceryApi } from '../api/groceryApi';
import { formatCurrency } from '../utils/helpers';

const DEFAULT_VENDORS = ['Mall', 'Online', 'Local'];

const emptyItem = () => ({
  id: Date.now() + Math.random(),
  name: '',
  quantity: '',
  unit: 'KG',
  vendorPrices: DEFAULT_VENDORS.map((v) => ({ vendorName: v, pricePerUnit: '' })),
});

// ---------- Helper ----------
const computeBest = (item) => {
  const valid = (item.vendorPrices || []).filter(
    (vp) => vp.pricePerUnit !== '' && Number(vp.pricePerUnit) > 0
  );
  if (!valid.length) return null;
  const best = valid.reduce((a, b) =>
    Number(a.pricePerUnit) < Number(b.pricePerUnit) ? a : b
  );
  const totalAmount = +(Number(item.quantity || 0) * Number(best.pricePerUnit)).toFixed(2);
  return { name: best.vendorName, pricePerUnit: Number(best.pricePerUnit), totalAmount };
};

// ============================================================
// FORM: New/Edit Session
// ============================================================
const SessionForm = ({ existing, onSaved, onCancel, knownItemNames }) => {
  const currentMonth = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const [sessionName, setSessionName] = useState(existing ? existing.sessionName : currentMonth);
  const [notes, setNotes] = useState(existing ? existing.notes : '');
  const [items, setItems] = useState(
    existing && existing.items.length
      ? existing.items.map((it, i) => ({
          id: i,
          name: it.name,
          quantity: it.quantity,
          unit: it.unit,
          vendorPrices: it.vendorPrices.map((vp) => ({
            vendorName: vp.vendorName,
            pricePerUnit: vp.pricePerUnit === 0 ? '' : vp.pricePerUnit,
          })),
        }))
      : [emptyItem()]
  );
  const [saving, setSaving] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Autocomplete suggestions
  const handleNameInput = (val, idx) => {
    setNameInput(val);
    const filtered = knownItemNames.filter((n) =>
      n.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered.length && val ? filtered : []);
    updateItem(idx, 'name', val);
  };

  const updateItem = (idx, field, value) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );
  };

  const updateVendorPrice = (itemIdx, vendorIdx, priceValue) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== itemIdx) return it;
        const vp = it.vendorPrices.map((v, j) =>
          j === vendorIdx ? { ...v, pricePerUnit: priceValue } : v
        );
        return { ...it, vendorPrices: vp };
      })
    );
  };

  const addVendorToItem = (itemIdx, vendorName) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== itemIdx) return it;
        if (it.vendorPrices.find((vp) => vp.vendorName === vendorName)) return it;
        return {
          ...it,
          vendorPrices: [...it.vendorPrices, { vendorName, pricePerUnit: '' }],
        };
      })
    );
  };

  const removeVendorFromItem = (itemIdx, vendorIdx) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== itemIdx) return it;
        return { ...it, vendorPrices: it.vendorPrices.filter((_, j) => j !== vendorIdx) };
      })
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = async (status = 'draft') => {
    if (!sessionName.trim()) return alert('Session ka naam do pehle!');
    const validItems = items.filter((it) => it.name.trim() && Number(it.quantity) > 0);
    if (!validItems.length) return alert('Kam se kam ek item add karo quantity ke saath!');

    const payload = {
      sessionName: sessionName.trim(),
      notes,
      status,
      items: validItems.map((it) => ({
        name: it.name.trim(),
        quantity: Number(it.quantity),
        unit: it.unit,
        vendorPrices: it.vendorPrices
          .filter((vp) => vp.pricePerUnit !== '' && Number(vp.pricePerUnit) > 0)
          .map((vp) => ({
            vendorName: vp.vendorName,
            pricePerUnit: Number(vp.pricePerUnit),
            totalAmount: +(Number(it.quantity) * Number(vp.pricePerUnit)).toFixed(2),
          })),
      })),
    };

    setSaving(true);
    try {
      if (existing) {
        await shoppingApi.updateSession(existing._id, payload);
      } else {
        await shoppingApi.createSession(payload);
      }
      onSaved();
    } catch (e) {
      alert('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Session Name</label>
          <input
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
            placeholder="e.g. March 2026"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (optional)</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
            placeholder="Any notes..."
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const best = computeBest(item);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              {/* Item header */}
              <div className="flex gap-3 flex-wrap items-end mb-4">
                <div className="flex-1 min-w-[140px] relative">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Item Name</label>
                  <input
                    value={item.name}
                    onChange={(e) => handleNameInput(e.target.value, idx)}
                    onFocus={() => item.name && setSuggestions(
                      knownItemNames.filter((n) => n.toLowerCase().includes(item.name.toLowerCase()))
                    )}
                    onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="Rice, Dal..."
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 w-full max-h-36 overflow-y-auto">
                      {suggestions.map((s) => (
                        <li
                          key={s}
                          onMouseDown={() => { updateItem(idx, 'name', s); setSuggestions([]); }}
                          className="px-3 py-2 text-sm hover:bg-green-50 cursor-pointer"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="w-20">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Qty</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                    placeholder="5"
                    min="0"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">Unit</label>
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  >
                    {['KG', 'L', 'Pcs', 'Pack', 'Dozen', 'Gram'].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeItem(idx)}
                  className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                  title="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              {/* Vendor price rows */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Vendor Prices (₹ per {item.unit || 'unit'})
                </p>
                {item.vendorPrices.map((vp, vi) => {
                  const isB = best && best.name === vp.vendorName && vp.pricePerUnit !== '';
                  const total = item.quantity && vp.pricePerUnit
                    ? +(Number(item.quantity) * Number(vp.pricePerUnit)).toFixed(2)
                    : null;
                  return (
                    <div key={vi} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${isB ? 'bg-green-50 ring-1 ring-green-400' : 'bg-gray-50'}`}>
                      <span className="text-sm w-20 font-medium text-gray-700 shrink-0">{vp.vendorName}</span>
                      <input
                        type="number"
                        value={vp.pricePerUnit}
                        onChange={(e) => updateVendorPrice(idx, vi, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-green-500 bg-white"
                        placeholder="0.00"
                        min="0"
                      />
                      {total !== null && (
                        <span className="text-xs text-gray-500 w-20 text-right shrink-0">
                          = {formatCurrency(total)}
                        </span>
                      )}
                      {isB && (
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full shrink-0">
                          Best ✓
                        </span>
                      )}
                      <button
                        onClick={() => removeVendorFromItem(idx, vi)}
                        className="text-gray-300 hover:text-red-400 shrink-0"
                        title="Remove vendor"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  );
                })}

                {/* Add custom vendor */}
                <AddVendorInput onAdd={(name) => addVendorToItem(idx, name)} existingVendors={item.vendorPrices.map((v) => v.vendorName)} />
              </div>

              {/* Best suggestion inline */}
              {best && item.quantity && (
                <div className="mt-3 flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm px-4 py-2 rounded-lg">
                  <FiCheckCircle />
                  <span>
                    <strong>{best.name}</strong> se lo — ₹{best.pricePerUnit}/{item.unit} × {item.quantity} = <strong>{formatCurrency(best.totalAmount)}</strong>
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add item button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-green-400 text-green-600 rounded-xl hover:bg-green-50 transition flex items-center justify-center gap-2 font-medium"
      >
        <FiPlus /> Add Item
      </motion.button>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-end">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSave('draft')}
          disabled={saving}
          className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 font-medium"
        >
          <FiSave size={16} /> Save Draft
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSave('completed')}
          disabled={saving}
          className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center gap-2 font-semibold shadow"
        >
          <FiCheckCircle size={16} />
          {saving ? 'Saving...' : 'Save & Finalise'}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Small helper component: add custom vendor
const AddVendorInput = ({ onAdd, existingVendors }) => {
  const [show, setShow] = useState(false);
  const [val, setVal] = useState('');
  const predefined = ['Mall', 'Online', 'Local', 'Wholesaler', 'Distributor', 'Kirana'].filter(
    (v) => !existingVendors.includes(v)
  );
  return (
    <div>
      {!show ? (
        <button
          type="button"
          onClick={() => setShow(true)}
          className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1"
        >
          <FiPlus size={12} /> Add Vendor
        </button>
      ) : (
        <div className="flex gap-2 mt-1 flex-wrap">
          {predefined.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { onAdd(p); setShow(false); }}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"
            >
              + {p}
            </button>
          ))}
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && val.trim()) { onAdd(val.trim()); setVal(''); setShow(false); } }}
            className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500 w-28"
            placeholder="Custom..."
          />
          <button
            type="button"
            onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(''); } setShow(false); }}
            className="text-xs text-green-600 font-semibold"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// CARD: Past Session Summary
// ============================================================
const SessionCard = ({ session, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  // Group items by bestVendor
  const byVendor = {};
  (session.items || []).forEach((item) => {
    if (item.bestVendor?.name) {
      if (!byVendor[item.bestVendor.name]) byVendor[item.bestVendor.name] = [];
      byVendor[item.bestVendor.name].push(item);
    }
  });

  const vendorIcons = { Mall: '🏬', Online: '🛒', Local: '🏪', Wholesaler: '🏭', Distributor: '📦', Kirana: '🏪' };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden ${session.status === 'completed' ? 'border-green-200' : 'border-yellow-200'}`}
    >
      {/* Card header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${session.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
            {session.status === 'completed' ? '✅' : '📝'}
          </div>
          <div>
            <p className="font-bold text-gray-800">{session.sessionName}</p>
            <p className="text-xs text-gray-400">{new Date(session.createdAt).toLocaleDateString('en-IN')} · {session.items?.length || 0} items</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <p className="text-lg font-bold text-green-600">{formatCurrency(session.totalBestPrice)}</p>
            {session.totalSavings > 0 && (
              <p className="text-xs text-green-500">Bachenge: {formatCurrency(session.totalSavings)}</p>
            )}
          </div>
          <button onClick={onEdit} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><FiEdit2 size={16} /></button>
          <button onClick={onDelete} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><FiTrash2 size={16} /></button>
          <button onClick={() => setExpanded((x) => !x)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition">
            {expanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
      </div>

      {/* Expanded: vendor-wise shopping list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-gray-100 bg-gray-50"
          >
            <div className="p-4 space-y-4">
              {/* Vendor-wise shopping list */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">📋 Kahan se lena hai:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(byVendor).map(([vendor, vendorItems]) => {
                    const vendorTotal = vendorItems.reduce((s, it) => s + (it.bestVendor?.totalAmount || 0), 0);
                    return (
                      <div key={vendor} className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="font-semibold text-gray-800 mb-2">
                          {vendorIcons[vendor] || '🏪'} {vendor}
                          <span className="ml-2 text-xs text-green-600 font-bold">{formatCurrency(vendorTotal)}</span>
                        </p>
                        <ul className="space-y-1">
                          {vendorItems.map((it) => (
                            <li key={it.name} className="flex justify-between text-sm text-gray-600">
                              <span>{it.name} ({it.quantity} {it.unit})</span>
                              <span className="font-medium">{formatCurrency(it.bestVendor?.totalAmount)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Per-item price comparison */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">💰 Item-wise Price Comparison:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 rounded-lg">
                        <th className="text-left px-3 py-2 font-semibold text-gray-600">Item</th>
                        <th className="text-left px-3 py-2 font-semibold text-gray-600">Qty</th>
                        {[...new Set((session.items || []).flatMap((it) => (it.vendorPrices || []).map((vp) => vp.vendorName)))].map((v) => (
                          <th key={v} className="text-right px-3 py-2 font-semibold text-gray-600">{v}</th>
                        ))}
                        <th className="text-right px-3 py-2 font-semibold text-green-700">Best</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(session.items || []).map((it) => {
                        const allVendors = [...new Set((session.items || []).flatMap((x) => (x.vendorPrices || []).map((vp) => vp.vendorName)))];
                        return (
                          <tr key={it.name} className="border-b border-gray-100 hover:bg-white transition">
                            <td className="px-3 py-2 font-medium text-gray-800">{it.name}</td>
                            <td className="px-3 py-2 text-gray-500">{it.quantity} {it.unit}</td>
                            {allVendors.map((v) => {
                              const vp = (it.vendorPrices || []).find((x) => x.vendorName === v);
                              const isBest = it.bestVendor?.name === v;
                              return (
                                <td key={v} className={`text-right px-3 py-2 ${isBest ? 'font-bold text-green-600' : 'text-gray-500'}`}>
                                  {vp ? formatCurrency(vp.totalAmount) : '—'}
                                </td>
                              );
                            })}
                            <td className="text-right px-3 py-2 font-bold text-green-600">
                              {it.bestVendor ? `${it.bestVendor.name}: ${formatCurrency(it.bestVendor.totalAmount)}` : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-green-50">
                        <td colSpan="2" className="px-3 py-2 font-bold text-gray-700">Total</td>
                        {[...new Set((session.items || []).flatMap((it) => (it.vendorPrices || []).map((vp) => vp.vendorName)))].map((v) => {
                          const total = (session.items || []).reduce((s, it) => {
                            const vp = (it.vendorPrices || []).find((x) => x.vendorName === v);
                            return s + (vp?.totalAmount || 0);
                          }, 0);
                          return <td key={v} className="text-right px-3 py-2 font-bold text-gray-700">{formatCurrency(total)}</td>;
                        })}
                        <td className="text-right px-3 py-2 font-bold text-green-700">{formatCurrency(session.totalBestPrice)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {session.notes && (
                <p className="text-sm text-gray-500 italic">📌 {session.notes}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================
// MAIN: Shopping Planner
// ============================================================
const ShoppingPlanner = () => {
  const [sessions, setSessions] = useState([]);
  const [knownItemNames, setKnownItemNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'new' | 'edit'
  const [editingSession, setEditingSession] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessRes, itemsRes] = await Promise.all([
        shoppingApi.getAllSessions(),
        groceryApi.getAllItems(),
      ]);
      setSessions(sessRes.data);
      setKnownItemNames(itemsRes.data.map((i) => i.name));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yeh session delete karna hai?')) return;
    try {
      await shoppingApi.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setView('edit');
  };

  const handleSaved = () => {
    setView('list');
    setEditingSession(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🛒</div>
          <p className="text-gray-600">Loading Shopping Planner...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🛒 Shopping Planner</h2>
          <p className="text-gray-500 text-sm mt-1">Vendor se quotation lo, prices enter karo, best deal auto-suggest hoga</p>
        </div>
        {view === 'list' && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setEditingSession(null); setView('new'); }}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition font-semibold shadow"
          >
            <FiShoppingCart /> Naya Order Banao
          </motion.button>
        )}
        {(view === 'new' || view === 'edit') && (
          <button
            onClick={() => { setView('list'); setEditingSession(null); }}
            className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            ← Wapas
          </button>
        )}
      </div>

      {/* Form View */}
      <AnimatePresence mode="wait">
        {(view === 'new' || view === 'edit') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-5">
                {view === 'edit' ? `✏️ Edit: ${editingSession?.sessionName}` : '✨ Naya Shopping Order'}
              </h3>
              <SessionForm
                existing={editingSession}
                knownItemNames={knownItemNames}
                onSaved={handleSaved}
                onCancel={() => { setView('list'); setEditingSession(null); }}
              />
            </div>
          </motion.div>
        )}

        {/* List View */}
        {view === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {sessions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200"
              >
                <p className="text-5xl mb-4">🛒</p>
                <p className="text-gray-700 text-lg font-semibold">Abhi koi Shopping Order nahi hai</p>
                <p className="text-gray-400 text-sm mt-2">Upar "Naya Order Banao" dabao</p>
              </motion.div>
            ) : (
              <>
                {/* Summary stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{sessions.filter((s) => s.status === 'completed').length}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm bg-green-50">
                    <p className="text-sm text-green-700">Last Order Total</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(sessions[0]?.totalBestPrice || 0)}</p>
                  </div>
                </div>

                {/* Session cards */}
                {sessions.map((s) => (
                  <SessionCard
                    key={s._id}
                    session={s}
                    onEdit={() => handleEdit(s)}
                    onDelete={() => handleDelete(s._id)}
                  />
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShoppingPlanner;

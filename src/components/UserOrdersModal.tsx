import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  db,
  collection,
  onSnapshot,
  query,
  where,
  handleFirestoreError,
  OperationType,
} from '../firebase';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      const q = query(
        collection(db, 'cartOrders'),
        where('userId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: any[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setOrders(list);
          setLoading(false);
        },
        (error) => {
          console.warn('Firestore orders read error:', error);
          // Fall back to local storage
          const local = JSON.parse(
            localStorage.getItem('cartwala_orders') || '[]'
          );
          setOrders(local);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      const local = JSON.parse(localStorage.getItem('cartwala_orders') || '[]');
      setOrders(local);
      setLoading(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#F2EAE0] relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-5">
          <div className="p-2 rounded-xl bg-amber-100 text-[#FFB800]">
            <ShoppingBag className="w-5 h-5 text-[#1E1E24]" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-[#1E1E24]">
              My Cartwala Reservations
            </h3>
            <p className="text-xs text-[#837560]">
              Track your custom build status & PM SVANidhi subsidy code
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-[#1E1E24]">
              No reservations yet
            </div>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Configure your Cartwala in 3 easy steps to lock in your 7%
              government subsidy discount.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.orderId || ord.id}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#F2EAE0] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-[#1E1E24]">
                    #{ord.orderId || ord.id}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#7c5800] text-[10px] font-extrabold uppercase">
                    {ord.status || 'Reserved'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#514532]">
                  <div>
                    <span className="text-neutral-400">Plan: </span>
                    <span className="font-bold text-[#E63946]">
                      {ord.planType === 'rent_daily'
                        ? 'Daily Rent (₹149/day)'
                        : ord.planType === 'rent_monthly'
                        ? 'Monthly Rent (₹3,499/mo)'
                        : ord.planType === 'rent_to_own'
                        ? 'Rent-to-Own'
                        : 'Buy with Subsidy'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Trade: </span>
                    <span className="font-bold text-[#1E1E24]">
                      {ord.tradeType === 'juice_chai'
                        ? 'Juice & Chai'
                        : ord.tradeType === 'chaat_snacks'
                        ? 'Chaat & Snacks'
                        : 'Fruits & Veg'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Power: </span>
                    <span className="font-bold text-[#1E1E24]">
                      {ord.solarArray}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Total / Rate: </span>
                    <span className="font-bold text-[#1E1E24]">
                      {ord.planType === 'rent_daily'
                        ? '₹149 / Day'
                        : ord.planType === 'rent_monthly'
                        ? '₹3,499 / Month'
                        : `₹${ord.finalPrice?.toLocaleString('en-IN') || '44,000'}`}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F2EAE0] flex items-center justify-between text-[11px] text-[#837560]">
                  <span>Deposit: ₹999 Refundable</span>
                  <a
                    href={`https://wa.me/919302184644?text=Hello%20Cartwala!%20Checking%20status%20for%20order%20%23${ord.orderId || ord.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Track on WhatsApp (+91 93021 84644)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

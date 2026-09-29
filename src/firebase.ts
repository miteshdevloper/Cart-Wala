import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    // Graceful handling to prevent uncaught error messages
    return false;
  }
}

testConnection();

export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('Google Sign-In popup notice:', error?.message);
    throw error;
  }
}

export async function logoutUser() {
  await firebaseSignOut(auth);
}

// ----------------------------------------------------
// Admin Account Credentials & Order Tracking (Firebase)
// Default Admin: Account ID: Anshu123, Password: admin6767
// ----------------------------------------------------
export interface AdminProfile {
  adminId: string;
  username: string;
  name: string;
  role: string;
  lastLogin?: string;
}

export const DEFAULT_ADMIN_ID = 'Anshu123';
export const DEFAULT_ADMIN_PASS = 'admin6767';

// Ensure the admin account document exists in Firestore
export async function ensureAdminInFirebase(): Promise<void> {
  try {
    const adminRef = doc(db, 'adminAccounts', DEFAULT_ADMIN_ID);
    const snap = await getDoc(adminRef);
    if (!snap.exists()) {
      await setDoc(adminRef, {
        adminId: DEFAULT_ADMIN_ID,
        username: DEFAULT_ADMIN_ID,
        password: DEFAULT_ADMIN_PASS,
        role: 'super_admin',
        name: 'Anshu (Operations & Orders Lead)',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Admin account initialization notice:', err);
  }
}

// Auto-seed admin credential document on load
ensureAdminInFirebase();

// Verify Admin credentials against Firebase Firestore
export async function verifyAdminInFirebase(
  accountId: string,
  pass: string
): Promise<{ success: boolean; admin?: AdminProfile; error?: string }> {
  const cleanId = accountId.trim();
  const cleanPass = pass.trim();

  try {
    const adminRef = doc(db, 'adminAccounts', cleanId);
    let snap = await getDoc(adminRef);

    // If it's Anshu123 and missing, create it first
    if (!snap.exists() && cleanId === DEFAULT_ADMIN_ID && cleanPass === DEFAULT_ADMIN_PASS) {
      await ensureAdminInFirebase();
      snap = await getDoc(adminRef);
    }

    if (snap.exists()) {
      const data = snap.data();
      if (data.password === cleanPass) {
        // Record last login in Firestore
        try {
          await updateDoc(adminRef, {
            lastLogin: new Date().toISOString(),
          });
        } catch (_) {}

        return {
          success: true,
          admin: {
            adminId: cleanId,
            username: data.username || cleanId,
            name: data.name || 'Anshu',
            role: data.role || 'super_admin',
            lastLogin: new Date().toISOString(),
          },
        };
      } else {
        return { success: false, error: 'Incorrect password for admin account.' };
      }
    } else {
      // Fallback check if account ID matches default admin
      if (cleanId === DEFAULT_ADMIN_ID && cleanPass === DEFAULT_ADMIN_PASS) {
        return {
          success: true,
          admin: {
            adminId: DEFAULT_ADMIN_ID,
            username: DEFAULT_ADMIN_ID,
            name: 'Anshu (Operations & Orders Lead)',
            role: 'super_admin',
            lastLogin: new Date().toISOString(),
          },
        };
      }
      return { success: false, error: 'Admin account ID not found in system.' };
    }
  } catch (err: any) {
    console.warn('Firebase admin verification warning:', err);
    // Offline resilience for requested admin credentials
    if (cleanId === DEFAULT_ADMIN_ID && cleanPass === DEFAULT_ADMIN_PASS) {
      return {
        success: true,
        admin: {
          adminId: DEFAULT_ADMIN_ID,
          username: DEFAULT_ADMIN_ID,
          name: 'Anshu (Operations & Orders Lead)',
          role: 'super_admin',
          lastLogin: new Date().toISOString(),
        },
      };
    }
    return { success: false, error: err?.message || 'Authentication failed.' };
  }
}

// Live real-time listener for all orders (Admin access)
export function subscribeToAllOrders(
  onOrders: (orders: any[]) => void,
  onError?: (err: any) => void
) {
  const ordersCollection = collection(db, 'cartOrders');
  return onSnapshot(
    ordersCollection,
    (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort newest first
      list.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      onOrders(list);
    },
    (err) => {
      console.warn('Orders subscription error:', err);
      if (onError) onError(err);
    }
  );
}

// Update order status and tracking notes in Firebase
export async function updateOrderStatusInFirebase(
  orderId: string,
  newStatus: string,
  trackingNotes?: string,
  courierDetails?: string
) {
  const orderRef = doc(db, 'cartOrders', orderId);
  const updateData: Record<string, any> = {
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };
  if (trackingNotes !== undefined) updateData.trackingNotes = trackingNotes;
  if (courierDetails !== undefined) updateData.courierDetails = courierDetails;

  await updateDoc(orderRef, updateData);
}

// Delete an order in Firebase (Admin cleanup / test removal)
export async function deleteOrderInFirebase(orderId: string) {
  const orderRef = doc(db, 'cartOrders', orderId);
  await deleteDoc(orderRef);
}

// Save or sync an order to Firebase
export async function saveOrderToFirebase(orderPayload: any) {
  const orderRef = doc(db, 'cartOrders', orderPayload.orderId);
  await setDoc(orderRef, orderPayload);
}

export {
  onAuthStateChanged,
  type User,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
};

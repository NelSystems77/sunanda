import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product, CreateProductDTO, UpdateProductDTO, InventoryMovement, CreateInventoryMovementDTO } from '@/core/domain/interfaces/Product';
import { ProductType } from '@/core/domain/enums';

const PRODUCTS_COLLECTION = 'products';
const MOVEMENTS_COLLECTION = 'inventoryMovements';

export class ProductRepository {
  async create(dto: CreateProductDTO): Promise<Product> {
    const now = Timestamp.now();
    const data = {
      ...dto,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      expirationDate: dto.expirationDate ? Timestamp.fromDate(dto.expirationDate) : null,
      purchaseDate: dto.purchaseDate ? Timestamp.fromDate(dto.purchaseDate) : null,
    };
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), data);
    return { id: docRef.id, ...dto, isActive: true, createdAt: now.toDate(), updatedAt: now.toDate() };
  }

  async getAll(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return snapshot.docs
      .map(d => this._mapDoc(d))
      .filter(p => p.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return this._mapDoc(docSnap);
  }

  async getLowStock(): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(p => p.quantity <= p.minStock);
  }

  async update(id: string, dto: UpdateProductDTO): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, { ...dto, updatedAt: Timestamp.now() });
  }

  async softDelete(id: string): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, { isActive: false, updatedAt: Timestamp.now() });
  }

  async registerMovement(dto: CreateInventoryMovementDTO & { performedBy: string }): Promise<InventoryMovement> {
    const movementRef = collection(db, MOVEMENTS_COLLECTION);
    const productRef = doc(db, PRODUCTS_COLLECTION, dto.productId);

    let savedMovement!: InventoryMovement;

    await runTransaction(db, async (tx) => {
      const productSnap = await tx.get(productRef);
      if (!productSnap.exists()) throw new Error('Producto no encontrado');

      const currentQty: number = productSnap.data().quantity ?? 0;
      let newQty: number;

      if (dto.type === 'IN') {
        newQty = currentQty + dto.quantity;
      } else if (dto.type === 'OUT') {
        if (currentQty < dto.quantity) throw new Error('Stock insuficiente');
        newQty = currentQty - dto.quantity;
      } else {
        newQty = dto.quantity;
      }

      const now = Timestamp.now();
      const movRef = doc(movementRef);
      tx.set(movRef, {
        productId: dto.productId,
        type: dto.type,
        quantity: dto.quantity,
        reason: dto.reason,
        notes: dto.notes ?? null,
        performedBy: dto.performedBy,
        previousStock: currentQty,
        newStock: newQty,
        createdAt: now,
      });

      tx.update(productRef, { quantity: newQty, updatedAt: now, lastRestockDate: dto.type === 'IN' ? now : null });

      savedMovement = {
        id: movRef.id,
        productId: dto.productId,
        type: dto.type,
        quantity: dto.quantity,
        reason: dto.reason,
        performedBy: dto.performedBy,
        createdAt: now.toDate(),
        notes: dto.notes,
      };
    });

    return savedMovement;
  }

  async getMovementsByProduct(productId: string): Promise<InventoryMovement[]> {
    const q = query(
      collection(db, MOVEMENTS_COLLECTION),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        productId: data.productId,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason,
        performedBy: data.performedBy,
        createdAt: data.createdAt.toDate(),
        notes: data.notes,
      } as InventoryMovement;
    });
  }

  private _mapDoc(d: any): Product {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      brand: data.brand,
      description: data.description,
      type: data.type as ProductType,
      sku: data.sku,
      barcode: data.barcode,
      quantity: data.quantity ?? 0,
      minStock: data.minStock ?? 0,
      maxStock: data.maxStock,
      unit: data.unit ?? 'unidad',
      cost: data.cost ?? 0,
      price: data.price,
      supplier: data.supplier,
      supplierContact: data.supplierContact,
      location: data.location,
      expirationDate: data.expirationDate?.toDate(),
      purchaseDate: data.purchaseDate?.toDate(),
      isActive: data.isActive ?? true,
      imageURL: data.imageURL,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
      lastRestockDate: data.lastRestockDate?.toDate(),
    };
  }
}

export const productRepository = new ProductRepository();

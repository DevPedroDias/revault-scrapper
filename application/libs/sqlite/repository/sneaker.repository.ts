import { openDb } from "../database";

export interface SneakerDTO {
    id?: string;
    sku: string;
    name: string;
    log_id: number;
    created_at?: string;
    updated_at?: string;
  }
  
export default class SneakerRepository {
    async createManySneakers(sneakers: SneakerDTO[]): Promise<void> {
        const db = await openDb();
        const valuesPlaceholder = sneakers.map(() => `(?, ?, ?)`).join(', ');
        const values = sneakers.flatMap(sneaker => [sneaker.sku, sneaker.name, sneaker.log_id]);
        const query = `
          INSERT OR IGNORE INTO sneakers (sku, name, log_id)
          VALUES ${valuesPlaceholder}
        `;
      
        await db.run(query, values);
      
        await db.close();
    }

    async alreadyHasSKU (sku:string ): Promise<boolean> {
      const db = await openDb();
      const result = await db.get<{ id: number }>('SELECT id FROM sneakers WHERE sku = ?', [sku]);
      await db.close();
      return !!result;
    }

    async createSneaker(sneaker: SneakerDTO): Promise<void> {
          const db = await openDb();
          await db.run(
              `INSERT INTO sneakers (sku, name, log_id) VALUES (?, ?, ?)`,
              [sneaker.sku, sneaker.name, sneaker.log_id]
          );
          await db.close();
    }
}
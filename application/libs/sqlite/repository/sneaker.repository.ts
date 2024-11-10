import Sneaker from "../../../domain/entity/sneaker";
import { openDb } from "../database";
export interface SneakerDTO {
  id?: number,
  sku?: string,
  name?: string,
  price?: string,
  description?: string,
  imageLinks?: string,
  releaseDate?: string,
  brand?: string,
  silhouette?: string,
  releasePrice?: string,
  color?: string,
  searchId?: number,
  synced?: number,
}export default class SneakerRepository {

    async alreadyHasSKU (sku:string ): Promise<boolean> {
      const db = await openDb();
      const result = await db.get<{ id: number }>('SELECT id FROM sneakers WHERE sku = ?', [sku]);
      await db.close();
      return !!result;
    }

    async createSneaker(sneaker: Sneaker): Promise<void> {
          const db = await openDb();
          await db.run(
              `INSERT INTO sneakers (sku, name, price, description, imageLinks, releaseDate, brand, silhouette, releasePrice, color, search_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
              [ sneaker.sku,
                sneaker.name,
                sneaker.price,
                sneaker.description,
                sneaker.imageLinks,
                sneaker.releaseDate,
                sneaker.brand,
                sneaker.silhouette,
                sneaker.releasePrice,
                sneaker.color,
                sneaker.searchId
              ]
          );
          await db.close();
  }
  async page (page: number): Promise<{ data: Sneaker[]; total: number; totalPages: number }> {
    const limit = 10;
    const offset = (page - 1) * limit;
    const db = await openDb();
    console.log('offset', offset)
    console.log('page', page)

    // Contagem total de registros
    const countQuery = `SELECT COUNT(*) as total FROM sneakers`;
    const countResult = await db.get<{ total: number }>(countQuery);

    const total = Number(countResult?.total) || 0;
    const totalPages = Math.ceil(total / limit);

    // Query para buscar registros paginados
    const query = `
      SELECT 
        id, sku, name, price, description, imageLinks, releaseDate, 
        brand, silhouette, releasePrice, color, search_id as searchId, synced
      FROM sneakers
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await db.all<SneakerDTO[]>(query);
    console.log('oq veio real oficial', rows)
    const sneakers = rows.length ? rows.map((row) => new Sneaker({
      id: Number(row.id),
      sku: String(row.sku),
      name: String(row.name),
      price: String(row.price),
      description: String(row.description),
      imageLinks: String(row.imageLinks),
      releaseDate: String(row.releaseDate),
      brand: String(row.brand),
      silhouette: String(row.silhouette),
      releasePrice: String(row.releasePrice),
      color: String(row.color),
      searchId: Number(row.searchId),
      synced: Number(row.synced),
    })) : [];

    return {
      data: sneakers,
      total,
      totalPages,
    };
  }
}
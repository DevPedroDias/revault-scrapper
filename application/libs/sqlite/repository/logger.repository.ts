import Search from "../../../domain/entity/search";
import { openDb } from "../database";

export interface SearchLoggerDTO {
    id?: number;
    status?: string;
    input?: string;
    search_quantity?: number;
    message?: string;
    created_at?: string;
    updated_at?: string;
  }

export default class LoggerRepository {
    async create(search: Search): Promise<number> {
        try {
            const db = await openDb();
            const result = await db.run(
              `INSERT INTO searchs (status, input, search_quantity, message) VALUES (?, ?, ?, ?)`,
              search.status,
              search.keyword,
              search.quantity,
              search.message || null,
            );
            const lastId = Number(result.lastID)
            await db.close();

            return lastId
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getAll(): Promise<SearchLoggerDTO[]> {
        try {
            const db = await openDb();
            const logs = await db.all<SearchLoggerDTO[]>(`
                SELECT id, status, input, search_quantity, message, created_at, updated_at
                FROM searchs
                WHERE status = 'FINISHED' OR status = 'FINISHED_DATA_COMPILATION' OR status = 'ERROR'
                ORDER BY created_at DESC LIMIT 10
            `);
            await db.close();

            return logs;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async update(search: Search): Promise<void> {
        try {
          const db = await openDb();
          const updatedAt = new Date().toISOString(); // Atualizar a coluna updated_at
    
          await db.run(
            `UPDATE searchs
             SET status = COALESCE(?, status),
                 input = COALESCE(?, input),
                 search_quantity = COALESCE(?, search_quantity),
                 message = COALESCE(?, message),
                 updated_at = ?
             WHERE id = ?`,
            search.status || null,
            search.keyword || null,
            search.quantity || null,
            search.message || null,
            updatedAt,
            search.id
          );
    
          await db.close();
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
}
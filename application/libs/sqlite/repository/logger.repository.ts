import { openDb } from "../database";

export interface SearchLoggerDTO {
    id?: number;
    status?: string;
    input?: string;
    filename?: string;
    search_quantity?: number;
    message?: string;
    created_at?: string;
    updated_at?: string;
  }

export default class LoggerRepository {
    async create(searchLog: Omit<SearchLoggerDTO, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
        try {
            const db = await openDb();
            const result = await db.run(
              `INSERT INTO search_log (status, input, search_quantity, message, filename) VALUES (?, ?, ?, ?, ?)`,
              searchLog.status,
              searchLog.input,
              searchLog.search_quantity,
              searchLog.message || null,
              searchLog.filename
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
                SELECT id, status, input, search_quantity, message, filename, created_at, updated_at
                FROM search_log
                WHERE status = 'FINISHED' OR status = 'FINISHED_DATA_COMPILATION'
                ORDER BY created_at DESC
            `);
            await db.close();

            return logs;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async update(searchLog: Partial<Omit<SearchLoggerDTO, 'created_at' | 'updated_at'>>): Promise<void> {
        try {
          const db = await openDb();
          const updatedAt = new Date().toISOString(); // Atualizar a coluna updated_at
    
          await db.run(
            `UPDATE search_log
             SET status = COALESCE(?, status),
                 input = COALESCE(?, input),
                 search_quantity = COALESCE(?, search_quantity),
                 message = COALESCE(?, message),
                 filename = COALESCE(?, filename),
                 updated_at = ?
             WHERE id = ?`,
            searchLog.status || null,
            searchLog.input || null,
            searchLog.search_quantity || null,
            searchLog.message || null,
            searchLog.filename || null,
            updatedAt,
            searchLog.id
          );
    
          await db.close();
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
}
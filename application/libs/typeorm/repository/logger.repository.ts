import { Repository } from "typeorm";
import Search from "../../../domain/entity/search";
import AppDataSource from "../database";
import SearchMapper from "../mapper/search.mapper";
import { SearchModel } from "../model/search.model";

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
  private readonly repository: Repository<SearchModel>
    constructor() {
      this.repository = AppDataSource.getRepository(SearchModel)
    }
    async create(search: Search): Promise<number> {
        try {
            const model = SearchMapper.toModel(search)
            const savedModel = await this.repository.save(model)
            return savedModel.id
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getAll(): Promise<Search[]> {
        try {
            const searchs = await this.repository.createQueryBuilder('search')
            .orderBy('search.created_at', 'DESC')
            .limit(10)
            .getMany()

            return searchs && searchs.map(search => SearchMapper.toEntity(search))
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async update(search: Search): Promise<void> {
        try {
          const model = SearchMapper.toModel(search)
          await this.repository.save(model)
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
}
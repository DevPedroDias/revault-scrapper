import { Repository } from "typeorm";
import Sneaker from "../../../domain/entity/sneaker";
import AppDataSource from "../database";
import { SneakerModel } from "../model/sneaker.model";
import SneakerMapper from "../mapper/sneaker.mapper";
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
}
export default class SneakerRepository {

    private readonly repository: Repository<SneakerModel>
    constructor() {
      this.repository = AppDataSource.getRepository(SneakerModel)
    }

    async alreadyHasSKU (sku:string ): Promise<boolean> {
      const sneakerFound = await this.repository.createQueryBuilder('sneaker').where('sneaker.sku = :sku', { sku }).getOne()
      return !!sneakerFound
    }

    async createSneaker(sneaker: Sneaker): Promise<void> {
      const model = SneakerMapper.toModel(sneaker)
      await AppDataSource.getRepository(SneakerModel).save(model)
    }

  async page (page: number, filters?:{
    isSynced?: boolean
  }): Promise<{ data: Sneaker[]; total: number; totalPages: number }> {
    const limit = 10;
    const offset = (page - 1) * limit;
    const sneakersFoundQuery = AppDataSource.getRepository(SneakerModel).createQueryBuilder('sneaker')
    .orderBy('sneaker.created_at', 'DESC')
    .offset(offset)
    .limit(limit)

    if (filters?.isSynced !== undefined) {
      sneakersFoundQuery.where('sneaker.synced = :isSynced', { isSynced: Number(filters.isSynced) })
    }

    const [sneakersF, count] = await sneakersFoundQuery.getManyAndCount()

    const total = Number(count) || 0;
    const totalPages = Math.ceil(total / limit);
    const sneakers = sneakersF.length ? sneakersF.map((row) => SneakerMapper.toEntity(row)) : [];

    return {
      data: sneakers,
      total,
      totalPages,
    };
  }
}
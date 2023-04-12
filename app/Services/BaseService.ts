import { LucidModel, LucidRow, ModelAttributes } from '@ioc:Adonis/Lucid/Orm';
import AppBaseModel from 'App/Models/AppBaseModel';

export default abstract class BaseService<BaseModel extends AppBaseModel> {
  protected model: LucidModel;

  constructor(model: LucidModel) {
    this.model = model;
  }

  public async create(data: Partial<BaseModel>): Promise<LucidRow> {
    return await this.model.create(data);
  }

  public async update(model: LucidRow, data: Partial<ModelAttributes<BaseModel>>): Promise<LucidRow> {
    return await model.merge(data).save();
  }
}

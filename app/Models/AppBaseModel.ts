import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
import LowerCamelCaseNamingStrategy from 'App/Strategies/LowerCamelCaseNamingStrategy';

export default class AppBaseModel extends BaseModel {
  public static namingStrategy = new LowerCamelCaseNamingStrategy();
}

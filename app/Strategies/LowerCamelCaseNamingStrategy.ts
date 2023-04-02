import { BaseModel, SnakeCaseNamingStrategy } from '@ioc:Adonis/Lucid/Orm';
import { string } from '@ioc:Adonis/Core/Helpers';

export default class LowerCamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public serializedName(_model: typeof BaseModel, propertyName: string): string {
    return string.camelCase(propertyName);
  }
}

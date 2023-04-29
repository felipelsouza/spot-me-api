import { DateTime } from 'luxon';

export default interface TokenContract {
  type: 'bearer';
  token: string;
  expiresAt: DateTime | undefined;
}

import { add, format } from 'date-fns';

export const dateFromNow = (days?: number) => format(add(new Date(), { days: days ?? 0 }), 'yyyy-LL-dd');

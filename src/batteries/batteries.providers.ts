import { Provider } from '../constants';
import { BatteryEntity } from './entities/battery.entity';

export const batteriesProviders = [
    {
        provide: Provider.BatteryRepository,
        useValue: BatteryEntity,
    },
];

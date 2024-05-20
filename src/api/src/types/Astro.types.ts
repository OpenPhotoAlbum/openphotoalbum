import { Tags } from 'exiftool-vendored';

export enum Mount {
    "foo"
}

export enum Telescope {
    "foo"
}

export type WeatherTags = Pick<Tags,
    | 'AmbientTemperature'
    | 'AmbientTemperatureFahrenheit'
    | 'RelativeHumidity'
    | 'UserComment'
>

export type AstronomyTags = {
    weather?: WeatherTags;
    mount?: Mount;
    telescope?: Telescope;
    tracking?: boolean;
    target?: {
        ra: string;
        dec: string;
        name: string;
    }
}

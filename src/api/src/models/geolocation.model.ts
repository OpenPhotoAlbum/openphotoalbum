import Logger from 'src/Logger';
import db from '.';
import { Geolocation } from 'src/types/Geolocation.types';

const logger = new Logger('getClosestCityIdByCoords');

export const getClosestCityIdByCoords = async (
    lat: number,
    lon: number
) => {
    try {
        const data = await db.raw(`
        select id, ST_Distance_Sphere( point (${lon}, ${lat}), point(longitude, latitude)) * .000621371192 as distance_in_miles 
        from geo_cities having distance_in_miles <= 10 order by distance_in_miles asc LIMIT 1`);

        if (data[0][0]?.id) {
            return { data: data[0][0].id, error: null, status: 200 };
        } else {
            logger.record('geolocation', `No city found within 10 miles of Lat: ${lat} Lon: ${lon}`);
            return { data: null, error: 'No city found within 10 miles', status: 404 };
        }

    } catch (e) {
        logger.error('getClosestCityIdByCoords', e)
    }
};

export const getGeolocationById = async (city_id: number): Promise<Geolocation> => {
    try {
        const d = await db("geo_cities")
            .select(
                "geo_cities.id as city_id",
                "geo_cities.postal_code as postal_code",
                "geo_cities.latitude as latitude",
                "geo_cities.longitude as longitude",
                "geo_cities.state_code as state_code",
                "geo_cities.city as city_name",
                "geo_cities.county_names_all as county_names_all",
                "county_name as county_name",
                "timezone as timezone",
                "s.id as state_id",
                "s.name as state_name",
                "c.id as country_id",
                "c.country_code as country_code",
                "c.country_name as country_name",
                "c.phone_code as country_phone_code"
            )
            .as("city")
            .leftOuterJoin("geo_states as s", "geo_cities.state_code", "s.code")
            .leftOuterJoin("geo_countries as c", "s.country_code", "c.country_code")
            .where({ "geo_cities.id": city_id })
            .first();

        const data = {
            full: `${d.city_name}, ${d.state_code}, ${d.country_code}`,
            city: {
                id: d.city_id,
                postalCode: d.postal_code,
                name: d.city_name,
                latitude: d.latitude,
                longitude: d.longitude,
                countyName: d.county_name,
                countyNamesAll: d.county_names_all,
                timezone: d.timezone,
            },
            state: {
                id: d.state_id,
                code: d.state_code,
                name: d.state_name,
            },
            country: {
                id: d.country_id,
                code: d.country_code,
                name: d.country_name,
                phoneCode: d.country_phone_code,
            },
        };
        return data;
    } catch (e) {
        logger.error(e)
    }
};
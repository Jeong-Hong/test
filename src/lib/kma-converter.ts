
// LCC DFS Coordinate Transformation (Lambert Conformal Conic Projection)
// Source: Korea Meteorological Administration Public Data Portal Guide

export interface LatLng {
    lat: number;
    lng: number;
}

interface GridCoord {
    x: number;
    y: number;
    lat: number;
    lng: number;
}

const RE = 6371.00877; // Earth Radius (km)
const GRID = 5.0; // Grid Size (km)
const SLAT1 = 30.0; // Projection Standard Latitude 1
const SLAT2 = 60.0; // Projection Standard Latitude 2
const OLON = 126.0; // Origin Longitude
const OLAT = 38.0; // Origin Latitude
const XO = 43; // Origin X
const YO = 136; // Origin Y

export function dfs_xy_conv(mode: "toGRID" | "toLL", v1: number, v2: number): GridCoord {
    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);

    const rs: Partial<GridCoord> = {};

    if (mode === "toGRID") {
        rs.lat = v1;
        rs.lng = v2;
        let ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        let theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs.x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs.y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
        rs.x = v1;
        rs.y = v2;
        const xn = v1 - XO;
        const yn = ro - v2 + YO;
        let ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) ra = -ra;
        let alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

        let theta = 0.0;
        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        } else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) theta = -theta;
            } else {
                theta = Math.atan2(xn, yn);
            }
        }
        let alon = theta / sn + olon;
        rs.lat = alat * RADDEG;
        rs.lng = alon * RADDEG;
    }

    return rs as GridCoord;
}

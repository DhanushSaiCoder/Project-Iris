
// src/utils/calibration.js

/**
 * Performs a linear regression on the given data points.
 * @param {Array<[number, number]>} data - An array of [x, y] data points.
 * @returns {{m: number, c: number}} - The slope (m) and y-intercept (c) of the regression line.
 */
export function linearRegression(data) {
    const n = data.length;
    if (n === 0) {
        return { m: 0, c: 0 };
    }

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (const [x, y] of data) {
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const c = (sumY - m * sumX) / n;

    return { m, c };
}

/**
 * Calculates the estimated distance in meters from a raw depth value using the calibration parameters.
 * @param {number} depthValue - The raw depth value from the model.
 * @param {{m: number, c: number}} calibration - The calibration parameters (slope and y-intercept).
 * @returns {number} - The estimated distance in meters.
 */
export function getDistance(depthValue, calibration) {
    if (!calibration) {
        return 0;
    }
    // The relationship is often inverse, so we use 1 / depthValue
    return calibration.m * (1 / depthValue) + calibration.c;
}

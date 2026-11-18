/**
 * ROI & Operational Savings Calculator for Water Bottling & Distribution Plants.
 * Models real-world plant benchmarks (TSP 2-Opt fuel optimization, admin automation, bottle loss prevention).
 */
export const ROICalculator = {
  // Benchmark operational constants (Industry standards in ARS)
  CONSTANTS: {
    BOTTLE_REPLACEMENT_COST: 6500, // Cost of 20L polycarbonate bottle in ARS
    AVG_KM_PER_ROUTE_DAY: 45, // Average km driven per truck per day
    FUEL_COST_PER_KM: 320, // Fuel and vehicle wear per km
    ADMIN_HOUR_COST: 4500, // Operator administrative cost per hour
    DAYS_PER_MONTH: 24, // Operating days per month
    BASELINE_BOTTLE_LOSS_RATE: 0.025, // 2.5% returnable bottle loss rate without digital tracking
    AQUA_BOTTLE_LOSS_RATE: 0.003, // 0.3% loss rate with Aqua QR & comodato tracking
    FUEL_EFFICIENCY_GAIN: 0.22, // 22% reduction in driven distance via 2-Opt TSP
    ADMIN_HOURS_SAVED_PER_TRUCK_MONTH: 28 // Hours saved from eliminating manual spreadsheets
  },

  /**
   * Calculates monthly operational savings for a bottling plant.
   * @param {Object} params
   * @param {number} params.dailyBottles - Average 20L/12L bottles distributed per day (e.g. 600)
   * @param {number} params.trucks - Number of delivery vehicles in fleet (e.g. 3)
   * @returns {Object} Detailed breakdown of monthly savings
   */
  calculate({ dailyBottles = 500, trucks = 2 } = {}) {
    const validBottles = Math.max(50, Number(dailyBottles) || 500);
    const validTrucks = Math.max(1, Number(trucks) || 2);

    const {
      BOTTLE_REPLACEMENT_COST,
      AVG_KM_PER_ROUTE_DAY,
      FUEL_COST_PER_KM,
      ADMIN_HOUR_COST,
      DAYS_PER_MONTH,
      BASELINE_BOTTLE_LOSS_RATE,
      AQUA_BOTTLE_LOSS_RATE,
      FUEL_EFFICIENCY_GAIN,
      ADMIN_HOURS_SAVED_PER_TRUCK_MONTH
    } = this.CONSTANTS;

    // 1. Returnable Bottle Loss Prevention
    const monthlyTotalBottles = validBottles * DAYS_PER_MONTH;
    const lostWithoutAqua = Math.round(monthlyTotalBottles * BASELINE_BOTTLE_LOSS_RATE);
    const lostWithAqua = Math.round(monthlyTotalBottles * AQUA_BOTTLE_LOSS_RATE);
    const bottlesSaved = Math.max(0, lostWithoutAqua - lostWithAqua);
    const bottleSavingsMonthly = bottlesSaved * BOTTLE_REPLACEMENT_COST;

    // 2. Fuel & Fleet Wear Savings via TSP 2-Opt Route Optimization
    const monthlyTotalKm = validTrucks * AVG_KM_PER_ROUTE_DAY * DAYS_PER_MONTH;
    const kmSavedMonthly = Math.round(monthlyTotalKm * FUEL_EFFICIENCY_GAIN);
    const fuelSavingsMonthly = kmSavedMonthly * FUEL_COST_PER_KM;

    // 3. Administrative Labor Savings (No manual copy-pasting from WhatsApp)
    const adminHoursSaved = Math.round(validTrucks * ADMIN_HOURS_SAVED_PER_TRUCK_MONTH);
    const laborSavingsMonthly = adminHoursSaved * ADMIN_HOUR_COST;

    // 4. Combined Total Savings
    const totalSavingsMonthly = bottleSavingsMonthly + fuelSavingsMonthly + laborSavingsMonthly;
    const totalSavingsAnnual = totalSavingsMonthly * 12;

    return {
      dailyBottles: validBottles,
      trucks: validTrucks,
      bottlesSaved,
      kmSavedMonthly,
      adminHoursSaved,
      bottleSavingsMonthly,
      fuelSavingsMonthly,
      laborSavingsMonthly,
      totalSavingsMonthly,
      totalSavingsAnnual,
      formatted: {
        totalMonthly: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(totalSavingsMonthly),
        totalAnnual: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(totalSavingsAnnual),
        bottlesSavedCount: `${bottlesSaved} bidones/mes`,
        kmSavedCount: `${kmSavedMonthly} km/mes`,
        hoursSavedCount: `${adminHoursSaved} hs/mes`
      }
    };
  }
};

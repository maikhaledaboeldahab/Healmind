/**
 * Centralized Pricing & Deposit Calculation Utility
 * 
 * Business rule:
 * - Deposit is 20% of the doctor's full session price.
 * - Remaining balance is the remaining 80% to be settled directly.
 */

export const DEPOSIT_PERCENTAGE = 0.20;

/**
 * Calculates session price, deposit required, and remaining balance.
 * 
 * @param {number|string} rawPrice - Doctor fee or session price
 * @returns {{ sessionPrice: number, depositAmount: number, remainingBalance: number, depositPercentage: number }}
 */
export function calculatePricing(rawPrice) {
  const price = Number(rawPrice);
  const sessionPrice = !isNaN(price) && price > 0 ? price : 500;
  const depositAmount = Math.round(sessionPrice * DEPOSIT_PERCENTAGE * 100) / 100;
  const remainingBalance = Math.round((sessionPrice - depositAmount) * 100) / 100;

  return {
    sessionPrice,
    depositAmount,
    remainingBalance,
    depositPercentage: DEPOSIT_PERCENTAGE * 100,
  };
}

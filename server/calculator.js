const { dutyRates } = require('./dutyRates');

/**
 * Calculate the total landed cost of importing a product into India.
 * 
 * Formula:
 * Final Import Cost (INR) = Converted Price + Shipping + Insurance + Customs Duty + IGST + Courier Fees
 * 
 * Traveller Mode:
 * - ₹50,000 duty-free allowance
 * - Duty applied only on excess value above ₹50,000
 */
function calculateLandedCost({
  productPrice,
  currency,
  exchangeRate,
  shippingCost = 0,
  insuranceCost = 0,
  courierFees = 0,
  category = 'Other',
  importMethod = 'online', // 'online' or 'traveller'
  indiaPrice = null
}) {
  // Step 1: Convert foreign price to INR
  const convertedPriceINR = productPrice * exchangeRate;
  const shippingINR = shippingCost * exchangeRate;
  const insuranceINR = insuranceCost * exchangeRate;
  const courierFeesINR = courierFees * exchangeRate;

  // Get duty rates for the category
  const rates = dutyRates[category] || dutyRates['Other'];
  const bcdPercent = rates.bcd;
  const igstPercent = rates.igst;

  let customsDuty = 0;
  let igst = 0;
  let assessableValue = 0;

  if (importMethod === 'traveller') {
    // Traveller Mode: ₹50,000 duty-free allowance
    const dutyFreeAllowance = 50000;
    const totalValueINR = convertedPriceINR;

    if (totalValueINR > dutyFreeAllowance) {
      // Duty only on excess value
      const excessValue = totalValueINR - dutyFreeAllowance;
      customsDuty = (excessValue * bcdPercent) / 100;
      assessableValue = excessValue;
      igst = ((assessableValue + customsDuty) * igstPercent) / 100;
    }
    // No shipping/insurance/courier for traveller mode
    const totalLandedCost = convertedPriceINR + customsDuty + igst;

    const result = {
      convertedPriceINR: round(convertedPriceINR),
      shippingINR: 0,
      insuranceINR: 0,
      assessableValue: round(assessableValue),
      bcdPercent,
      customsDuty: round(customsDuty),
      igstPercent,
      igst: round(igst),
      courierFeesINR: 0,
      totalLandedCost: round(totalLandedCost),
      dutyFreeAllowance,
      excessValue: round(Math.max(0, convertedPriceINR - dutyFreeAllowance)),
      importMethod: 'traveller'
    };

    if (indiaPrice !== null && indiaPrice > 0) {
      result.indiaPrice = round(indiaPrice);
      result.priceDifference = round(indiaPrice - totalLandedCost);
      result.savingsPercent = round((result.priceDifference / indiaPrice) * 100);
      result.recommendation = totalLandedCost < indiaPrice ? 'Import from Abroad' : 'Buy in India';
    }

    return result;

  } else {
    // Online Shipping Mode
    // Assessable Value = CIF (Cost + Insurance + Freight)
    assessableValue = convertedPriceINR + shippingINR + insuranceINR;

    // Step 3: Apply Basic Customs Duty
    customsDuty = (assessableValue * bcdPercent) / 100;

    // Step 4: Apply IGST on (Assessable Value + BCD)
    const igstBase = assessableValue + customsDuty;
    igst = (igstBase * igstPercent) / 100;

    // Step 5: Total Landed Cost
    const totalLandedCost = assessableValue + customsDuty + igst + courierFeesINR;

    const result = {
      convertedPriceINR: round(convertedPriceINR),
      shippingINR: round(shippingINR),
      insuranceINR: round(insuranceINR),
      assessableValue: round(assessableValue),
      bcdPercent,
      customsDuty: round(customsDuty),
      igstPercent,
      igst: round(igst),
      courierFeesINR: round(courierFeesINR),
      totalLandedCost: round(totalLandedCost),
      importMethod: 'online'
    };

    if (indiaPrice !== null && indiaPrice > 0) {
      result.indiaPrice = round(indiaPrice);
      result.priceDifference = round(indiaPrice - totalLandedCost);
      result.savingsPercent = round((result.priceDifference / indiaPrice) * 100);
      result.recommendation = totalLandedCost < indiaPrice ? 'Import from Abroad' : 'Buy in India';
    }

    return result;
  }
}

function round(num) {
  return Math.round(num * 100) / 100;
}

module.exports = { calculateLandedCost };

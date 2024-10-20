import { Injectable } from '@angular/core';

const state: any = {
  NEW: 0.5, // Increase by 50%
  LIKE_NEW: 0.3, // Increase by 30%
  VERY_GOOD: 0.2, // Increase by 20%
  GOOD: 0.1, // Increase by 10%
  ACCEPTABLE: 0 // No increase
};

const binding: any = {
  INTACT: 0, // No change
  WEAK: -0.05, // Decrease by 5%
  DAMAGED: -0.1, // Decrease by 10%
  BROKEN: -0.2 // Decrease by 20%
};

const cover: any = {
  INTACT: 0, // No change
  FADED: -0.05, // Decrease by 5%
  CREASED: -0.1, // Decrease by 10%
  RIPPED: -0.15, // Decrease by 15%
  DISCOLORED: -0.1, // Decrease by 10%
  SCRATCHED: -0.05, // Decrease by 5%
  CUT: -0.1, // Decrease by 10%
  STAINED: -0.15 // Decrease by 15%
};

const pages: any = {
  INTACT: 0, // No change
  YELLOWED: -0.05, // Decrease by 5%
  MARKED: -0.1, // Decrease by 10%
  FOLDED: -0.1, // Decrease by 10%
  CREASED: -0.1, // Decrease by 10%
  TORN: -0.15, // Decrease by 15%
  WARPED: -0.1, // Decrease by 10%
  STAINED: -0.15 // Decrease by 15%
};

const markings: any = {
  NONE: 0, // No change
  MINIMAL: -0.05, // Decrease by 5%
  PENCIL: -0.1, // Decrease by 10%
  HIGHLIGHTER: -0.1, // Decrease by 10%
  PEN: -0.15, // Decrease by 15%
  EXTENSIVE: -0.2 // Decrease by 20%
};

const extras: any = {
  ACCESS_CODE: 0.05, // Increase by 5%
  CD: 0.05 // Increase by 5%
};

@Injectable({
  providedIn: 'root'
})
export class BookValuatorService {
  computeEstimateRange(
    item: any,
    minPrice: number | null,
    maxPrice: number | null
  ) {
    // Calculate total adjustment factor based on characteristics
    const totalAdjustment: number =
      (state[item.state] ?? 0) +
      (binding[item.binding] ?? 0) +
      (cover[item.cover] ?? 0) +
      (pages[item.pages] ?? 0) +
      (markings[item.markings] || 0); // +
    // item.extras.reduce(
    //     (sum: number, extra: string) => (sum += adjustments.extras[extra] ?? 0),
    //     0
    // );

    if (minPrice !== null && maxPrice !== null) {
      // Both prices are available
      const minAdjusted = minPrice * (1 + totalAdjustment);
      const maxAdjusted = maxPrice * (1 + totalAdjustment);
      return {
        minPrice: parseFloat(minAdjusted.toFixed(2)), // Round min price to two decimal places
        maxPrice: parseFloat(maxAdjusted.toFixed(2)) // Round max price to two decimal places
      };
    } else if (minPrice !== null) {
      // Only min price is available
      return {
        minPrice: parseFloat(minPrice.toFixed(2)), // Round min price to two decimal places
        maxPrice: minPrice * (1 + totalAdjustment) // Calculate max based on min
      };
    } else if (maxPrice !== null) {
      // Only max price is available
      return {
        minPrice: maxPrice * (1 + totalAdjustment), // Calculate min based on max
        maxPrice: parseFloat(maxPrice.toFixed(2)) // Round max price to two decimal places
      };
    }

    // If neither min nor max price is provided
    return {
      minPrice: null,
      maxPrice: null
    };
  }
}

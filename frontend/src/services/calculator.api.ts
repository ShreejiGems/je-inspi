import { apiHelper } from '@/src/libs/helper';

/* =========================
   Interfaces
========================= */

export interface CalculatorData {
  id: string;
  miscellaneous: number;
  silverPerGram: number;
  tenKtGoldPerGram: number;
  forteenKtGoldPerGram: number;
  eighteenKtGoldPerGram: number;
  extraCost: number;
  duty: number;
  profit: number;
  usRate: number;
  dollarRupeeRate: number;
  filterMin: number;
  filterMax: number;
  status: "ENABLED" | "DISABLED";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/* =========================
   API Methods
========================= */

export const calculatorAPI = {
  /**
   * GET /calculator/calculator
   */
  getCalculatorData: async (): Promise<CalculatorData> => {
    return apiHelper.get('/calculator/calculator');
  },
};

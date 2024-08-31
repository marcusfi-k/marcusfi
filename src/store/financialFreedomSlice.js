// src/store/financialFreedomSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo state ban đầu cho tính toán tự do tài chính
const initialState = {
  monthlyCost: 0,
  emergencyFund: 0,
  financialFreedomAmount: 0
};

const financialFreedomSlice = createSlice({
  name: 'financialFreedom',
  initialState,
  reducers: {
    calculateFinancialFreedom(state, action) {
      const { monthlyCost, emergencyFund } = action.payload;
      const necessaryFunds = (monthlyCost * 12) / 0.04;
      state.monthlyCost = monthlyCost;
      state.emergencyFund = emergencyFund;
      state.financialFreedomAmount = necessaryFunds;
    }
  }
});

// Export reducer và actions
export const { calculateFinancialFreedom } = financialFreedomSlice.actions;
export default financialFreedomSlice.reducer;

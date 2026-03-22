import { useState, useCallback, useMemo } from 'react';

/**
 * Lending Protocol Simulator Hook
 *
 * Simulates depositing collateral, borrowing, and liquidation.
 *
 * Returns:
 * - collateralAmount, collateralPrice, borrowedAmount
 * - healthFactor: ratio of collateral value to borrowed value (< 1.0 = liquidation)
 * - collateralRatio: percentage (e.g. 150%)
 * - isLiquidatable: boolean
 * - deposit(amount): add collateral
 * - borrow(amount): borrow against collateral
 * - setPrice(newPrice): simulate price change
 * - liquidate(): simulate liquidation event
 * - reset(): reset to defaults
 */
export function useLending() {
  const LIQUIDATION_THRESHOLD = 120;  // 120% — below this, liquidation happens
  const INITIAL_PRICE = 3000;         // ETH price in USD

  const [collateralAmount, setCollateralAmount] = useState(0);   // ETH deposited
  const [collateralPrice, setCollateralPrice] = useState(INITIAL_PRICE);
  const [borrowedAmount, setBorrowedAmount] = useState(0);       // USDC borrowed
  const [isLiquidated, setIsLiquidated] = useState(false);
  const [logs, setLogs] = useState([]);

  const collateralValue = collateralAmount * collateralPrice;

  const collateralRatio = useMemo(() => {
    if (borrowedAmount === 0) return Infinity;
    return (collateralValue / borrowedAmount) * 100;
  }, [collateralValue, borrowedAmount]);

  const healthFactor = useMemo(() => {
    if (borrowedAmount === 0) return Infinity;
    return collateralValue / borrowedAmount;
  }, [collateralValue, borrowedAmount]);

  const isLiquidatable = collateralRatio < LIQUIDATION_THRESHOLD && borrowedAmount > 0;

  const maxBorrow = useMemo(() => {
    // Can borrow up to collateralValue / 1.5 (150% collateral ratio minimum for new borrows)
    return Math.max(0, Math.floor((collateralValue / 1.5) - borrowedAmount));
  }, [collateralValue, borrowedAmount]);

  const addLog = (type, text) => {
    setLogs(prev => [...prev.slice(-14), { type, text, time: Date.now() }]);
  };

  const deposit = useCallback((amount) => {
    if (amount <= 0 || isLiquidated) return;
    setCollateralAmount(prev => prev + amount);
    addLog('info', `Deposited ${amount} ETH as collateral`);
  }, [isLiquidated]);

  const borrow = useCallback((amount) => {
    if (amount <= 0 || isLiquidated) return;
    const newBorrowed = borrowedAmount + amount;
    const newRatio = (collateralValue / newBorrowed) * 100;
    if (newRatio < 150) {
      addLog('warn', `Cannot borrow — would drop ratio below 150%`);
      return false;
    }
    setBorrowedAmount(newBorrowed);
    addLog('info', `Borrowed ${amount} USDC (ratio: ${Math.round(newRatio)}%)`);
    return true;
  }, [borrowedAmount, collateralValue, isLiquidated]);

  const setPrice = useCallback((newPrice) => {
    setCollateralPrice(newPrice);
    const newValue = collateralAmount * newPrice;
    const newRatio = borrowedAmount > 0 ? (newValue / borrowedAmount) * 100 : Infinity;
    if (newRatio < LIQUIDATION_THRESHOLD && borrowedAmount > 0) {
      addLog('danger', `LIQUIDATION TRIGGERED — collateral ratio dropped to ${Math.round(newRatio)}%`);
    } else if (newRatio < 150 && borrowedAmount > 0) {
      addLog('warn', `WARNING — ratio at ${Math.round(newRatio)}%, approaching liquidation zone`);
    }
  }, [collateralAmount, borrowedAmount]);

  const liquidate = useCallback(() => {
    if (!isLiquidatable) return;
    setIsLiquidated(true);
    const seizedValue = borrowedAmount * 1.1; // Liquidator gets 10% bonus
    const seizedETH = seizedValue / collateralPrice;
    addLog('danger', `LIQUIDATED — ${seizedETH.toFixed(4)} ETH seized (${borrowedAmount} USDC debt repaid + 10% penalty)`);
    setCollateralAmount(prev => Math.max(0, prev - seizedETH));
    setBorrowedAmount(0);
  }, [isLiquidatable, borrowedAmount, collateralPrice]);

  const reset = useCallback(() => {
    setCollateralAmount(0);
    setCollateralPrice(INITIAL_PRICE);
    setBorrowedAmount(0);
    setIsLiquidated(false);
    setLogs([]);
  }, []);

  return {
    collateralAmount, collateralPrice, borrowedAmount,
    collateralValue, collateralRatio, healthFactor,
    isLiquidatable, isLiquidated, maxBorrow, logs,
    LIQUIDATION_THRESHOLD, INITIAL_PRICE,
    deposit, borrow, setPrice, liquidate, reset
  };
}

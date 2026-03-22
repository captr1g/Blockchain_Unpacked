import { useState, useCallback } from 'react';

/**
 * AMM Simulator Hook — implements Uniswap v2 constant product formula
 *
 * Returns state + functions for the UI to consume:
 * - poolA, poolB: current token amounts in the pool
 * - k: the constant product (poolA * poolB)
 * - swapAtoB(amountA): swap token A for token B, returns { amountOut, slippage, priceImpact }
 * - swapBtoA(amountB): swap token B for token A, returns { amountOut, slippage, priceImpact }
 * - addLiquidity(amountA, amountB): add tokens to pool
 * - reset(): reset pool to initial state
 * - getPrice(): current price of A in terms of B
 * - getSlippageForAmount(amount, direction): preview slippage without executing
 */
export function useAMM(initialA = 1000, initialB = 2000000) {
  const [poolA, setPoolA] = useState(initialA);       // e.g. 1000 ETH
  const [poolB, setPoolB] = useState(initialB);       // e.g. 2,000,000 USDC
  const [history, setHistory] = useState([]);          // swap history for display

  const k = poolA * poolB;

  const getPrice = useCallback(() => {
    return poolB / poolA;  // price of A in terms of B
  }, [poolA, poolB]);

  const getSlippageForAmount = useCallback((amountIn, direction = 'AtoB') => {
    const spotPrice = direction === 'AtoB' ? poolB / poolA : poolA / poolB;
    let amountOut;
    if (direction === 'AtoB') {
      const newPoolA = poolA + amountIn;
      const newPoolB = k / newPoolA;
      amountOut = poolB - newPoolB;
    } else {
      const newPoolB = poolB + amountIn;
      const newPoolA = k / newPoolB;
      amountOut = poolA - newPoolA;
    }
    const effectivePrice = amountOut / amountIn;
    const slippagePct = ((spotPrice - effectivePrice) / spotPrice) * 100;
    const priceImpactPct = (amountIn / (direction === 'AtoB' ? poolA : poolB)) * 100;
    return {
      amountOut: Math.max(0, amountOut),
      slippagePct: Math.max(0, slippagePct),
      priceImpactPct,
      effectivePrice,
      spotPrice
    };
  }, [poolA, poolB, k]);

  const swapAtoB = useCallback((amountIn) => {
    if (amountIn <= 0 || amountIn >= poolA * 0.9) return null;  // prevent draining pool
    const result = getSlippageForAmount(amountIn, 'AtoB');
    const newPoolA = poolA + amountIn;
    const newPoolB = k / newPoolA;
    setPoolA(newPoolA);
    setPoolB(newPoolB);
    setHistory(prev => [...prev.slice(-9), {
      direction: 'A→B',
      amountIn,
      amountOut: result.amountOut,
      slippage: result.slippagePct,
      timestamp: Date.now()
    }]);
    return result;
  }, [poolA, poolB, k, getSlippageForAmount]);

  const swapBtoA = useCallback((amountIn) => {
    if (amountIn <= 0 || amountIn >= poolB * 0.9) return null;
    const result = getSlippageForAmount(amountIn, 'BtoA');
    const newPoolB = poolB + amountIn;
    const newPoolA = k / newPoolB;
    setPoolA(newPoolA);
    setPoolB(newPoolB);
    setHistory(prev => [...prev.slice(-9), {
      direction: 'B→A',
      amountIn,
      amountOut: result.amountOut,
      slippage: result.slippagePct,
      timestamp: Date.now()
    }]);
    return result;
  }, [poolA, poolB, k, getSlippageForAmount]);

  const reset = useCallback(() => {
    setPoolA(initialA);
    setPoolB(initialB);
    setHistory([]);
  }, [initialA, initialB]);

  return {
    poolA, poolB, k, history,
    getPrice, getSlippageForAmount,
    swapAtoB, swapBtoA, reset
  };
}

/**
 * Impermanent Loss Calculator — pure function, no state
 *
 * @param {number} priceMultiplier - e.g. 2.0 means price doubled
 * @returns {{ ilPercent, lpValue, holdValue, difference }}
 *
 * Formula: IL = 2 * sqrt(priceMultiplier) / (1 + priceMultiplier) - 1
 */
export function calculateImpermanentLoss(priceMultiplier) {
  if (priceMultiplier <= 0) return { ilPercent: 0, lpValue: 0, holdValue: 0, difference: 0 };

  const sqrtP = Math.sqrt(priceMultiplier);
  const ilRatio = (2 * sqrtP) / (1 + priceMultiplier);
  const ilPercent = (1 - ilRatio) * 100;

  // Assuming initial deposit of $1000 ($500 each token)
  const initialValue = 1000;
  const holdValue = initialValue * (1 + priceMultiplier) / 2;  // one half stayed same, other half moved
  const lpValue = holdValue * ilRatio;
  const difference = holdValue - lpValue;

  return {
    ilPercent: Math.round(ilPercent * 100) / 100,
    lpValue: Math.round(lpValue * 100) / 100,
    holdValue: Math.round(holdValue * 100) / 100,
    difference: Math.round(difference * 100) / 100
  };
}

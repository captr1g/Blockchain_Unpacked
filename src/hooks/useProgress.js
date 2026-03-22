import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'blockchain-unpacked-progress';

const SECTIONS = ['consensus', 'solidity', 'deployment', 'security', 'tokens', 'defi', 'layer2'];

const BADGES = [
  { id: 'consensus_master', section: 'consensus', label: 'Consensus Master', description: 'Passed the Consensus Mechanisms quiz', icon: '⛏' },
  { id: 'solidity_scholar', section: 'solidity', label: 'Solidity Scholar', description: 'Passed the Solidity Fundamentals quiz', icon: '📝' },
  { id: 'deploy_pro', section: 'deployment', label: 'Deployment Pro', description: 'Passed the Deployment Workflow quiz', icon: '🚀' },
  { id: 'security_analyst', section: 'security', label: 'Security Analyst', description: 'Passed the Security Lab quiz', icon: '🛡' },
  { id: 'token_expert', section: 'tokens', label: 'Token Expert', description: 'Passed the Token Standards quiz', icon: '🪙' },
  { id: 'defi_savant', section: 'defi', label: 'DeFi Savant', description: 'Passed the DeFi Concepts quiz', icon: '📊' },
  { id: 'l2_explorer', section: 'layer2', label: 'L2 Explorer', description: 'Passed the Layer 2 quiz', icon: '🔗' },
  { id: 'blockchain_graduate', section: null, label: 'Blockchain Graduate', description: 'Passed ALL section quizzes', icon: '🎓' }
];

/**
 * Progress Tracking Hook — persists to localStorage
 *
 * Returns:
 * - completedSections: Set of section IDs passed
 * - totalSections: number
 * - progressPercent: 0–100
 * - badges: array of { ...badge, unlocked: boolean }
 * - markComplete(sectionId): mark a section as passed
 * - isComplete(sectionId): check if a section is completed
 * - resetProgress(): clear all progress
 */
export function useProgress() {
  const [completedSections, setCompletedSections] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Persist to localStorage whenever completedSections changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSections]));
  }, [completedSections]);

  const totalSections = SECTIONS.length;
  const progressPercent = Math.round((completedSections.size / totalSections) * 100);

  const badges = BADGES.map(badge => ({
    ...badge,
    unlocked: badge.section
      ? completedSections.has(badge.section)
      : completedSections.size === totalSections // "graduate" badge: all complete
  }));

  const markComplete = useCallback((sectionId) => {
    setCompletedSections(prev => {
      const next = new Set(prev);
      next.add(sectionId);
      return next;
    });
  }, []);

  const isComplete = useCallback((sectionId) => {
    return completedSections.has(sectionId);
  }, [completedSections]);

  const resetProgress = useCallback(() => {
    setCompletedSections(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    completedSections,
    totalSections,
    progressPercent,
    badges,
    markComplete,
    isComplete,
    resetProgress
  };
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type ChannelReward, type Prediction } from './pointsData';

interface PointsContextType {
  points: number;
  addPoints: (amount: number, reason?: string) => void;
  spendPoints: (amount: number) => boolean;
  bonusChestAvailable: boolean;
  claimBonusChest: () => number;
  recentRewards: { reward: ChannelReward; timestamp: number; input?: string }[];
  redeemReward: (reward: ChannelReward, input?: string) => boolean;
  activePrediction: Prediction | null;
  setActivePrediction: (p: Prediction | null) => void;
  placeBet: (optionId: string, tokens: number) => boolean;
  resolvePrediction: (winningOptionId: string) => { payout: number; won: boolean };
  userBets: Record<string, number>; // maps predictionId -> amount bet
  userBetOption: Record<string, string>; // maps predictionId -> optionId
}

const PointsContext = createContext<PointsContextType>({
  points: 1250,
  addPoints: () => {},
  spendPoints: () => false,
  bonusChestAvailable: false,
  claimBonusChest: () => 50,
  recentRewards: [],
  redeemReward: () => false,
  activePrediction: null,
  setActivePrediction: () => {},
  placeBet: () => false,
  resolvePrediction: () => ({ payout: 0, won: false }),
  userBets: {},
  userBetOption: {}
});

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('readabook_user_points');
    return saved ? parseInt(saved, 10) : 1250;
  });

  const [bonusChestAvailable, setBonusChestAvailable] = useState<boolean>(false);
  const [recentRewards, setRecentRewards] = useState<{ reward: ChannelReward; timestamp: number; input?: string }[]>([]);
  const [activePrediction, setActivePrediction] = useState<Prediction | null>({
    id: 'pred_ch4_twist',
    question: 'Will Frodo put on the One Ring before reaching Weathertop? 💍',
    options: [
      { id: 'opt_yes', title: 'Yes, Temptation Wins', color: '#00e5ff', totalTokens: 8500, totalUsers: 34 },
      { id: 'opt_no', title: 'No, Strider Protects Him', color: '#ff3b3b', totalTokens: 14200, totalUsers: 58 }
    ],
    status: 'active',
    createdAt: Date.now() - 120000,
    locksAt: Date.now() + 300000,
    streamerId: 'mock_lillyreads'
  });

  const [userBets, setUserBets] = useState<Record<string, number>>({});
  const [userBetOption, setUserBetOption] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem('readabook_user_points', points.toString());
  }, [points]);

  // Passive point accumulation (+10 every 60s of active presence)
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => prev + 10);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Periodic Bonus Chest popup (+50 points)
  useEffect(() => {
    const triggerChest = () => {
      setBonusChestAvailable(true);
    };

    // Trigger initial bonus chest after 15 seconds, then every 90 seconds
    const firstTimeout = setTimeout(triggerChest, 15000);
    const chestInterval = setInterval(triggerChest, 90000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(chestInterval);
    };
  }, []);

  const addPoints = (amount: number, _reason?: string) => {
    setPoints(prev => prev + amount);
  };

  const spendPoints = (amount: number): boolean => {
    if (points >= amount) {
      setPoints(prev => prev - amount);
      return true;
    }
    return false;
  };

  const claimBonusChest = (): number => {
    if (!bonusChestAvailable) return 0;
    const bonus = 50;
    setPoints(prev => prev + bonus);
    setBonusChestAvailable(false);
    return bonus;
  };

  const redeemReward = (reward: ChannelReward, input?: string): boolean => {
    if (spendPoints(reward.cost)) {
      setRecentRewards(prev => [
        { reward, timestamp: Date.now(), input },
        ...prev.slice(0, 9)
      ]);
      return true;
    }
    return false;
  };

  const placeBet = (optionId: string, tokens: number): boolean => {
    if (!activePrediction || activePrediction.status !== 'active') return false;
    if (tokens <= 0 || points < tokens) return false;

    if (spendPoints(tokens)) {
      setUserBets(prev => ({
        ...prev,
        [activePrediction.id]: (prev[activePrediction.id] || 0) + tokens
      }));
      setUserBetOption(prev => ({
        ...prev,
        [activePrediction.id]: optionId
      }));

      // Update prediction totals locally
      setActivePrediction(prev => {
        if (!prev) return null;
        return {
          ...prev,
          options: prev.options.map(opt => {
            if (opt.id === optionId) {
              return {
                ...opt,
                totalTokens: opt.totalTokens + tokens,
                totalUsers: opt.totalUsers + 1,
                userTokens: (opt.userTokens || 0) + tokens
              };
            }
            return opt;
          })
        };
      });
      return true;
    }
    return false;
  };

  const resolvePrediction = (winningOptionId: string): { payout: number; won: boolean } => {
    if (!activePrediction) return { payout: 0, won: false };

    const totalPool = activePrediction.options.reduce((acc, opt) => acc + opt.totalTokens, 0);
    const winningOpt = activePrediction.options.find(o => o.id === winningOptionId);
    const userBet = userBets[activePrediction.id] || 0;
    const userOption = userBetOption[activePrediction.id];

    let payout = 0;
    let won = false;

    if (userOption === winningOptionId && winningOpt && winningOpt.totalTokens > 0) {
      won = true;
      const ratio = userBet / winningOpt.totalTokens;
      payout = Math.round(totalPool * ratio);
      addPoints(payout, `Won prediction: ${activePrediction.question}`);
    }

    setActivePrediction(prev => prev ? { ...prev, status: 'resolved', winningOptionId } : null);
    return { payout, won };
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        addPoints,
        spendPoints,
        bonusChestAvailable,
        claimBonusChest,
        recentRewards,
        redeemReward,
        activePrediction,
        setActivePrediction,
        placeBet,
        resolvePrediction,
        userBets,
        userBetOption
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => useContext(PointsContext);

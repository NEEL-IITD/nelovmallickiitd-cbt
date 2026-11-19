export interface RankPrediction {
  examType: 'JEE Advanced' | 'JEE Mains';
  marksScored: number;
  totalMarks: number;
  percentage: number;
  estimatedPercentile?: number;
  predictedAirMin: number;
  predictedAirMax: number;
  predictedAirDisplay: string;
  tierLabel: string;
  statusColor: string; // 'emerald' | 'indigo' | 'amber' | 'rose'
  nextMilestone: {
    targetTier: string;
    marksNeeded: number;
    insight: string;
  } | null;
  milestones: {
    name: string;
    targetPercent: number;
    achieved: boolean;
  }[];
}

/**
 * Predicts JEE Advanced CRL Rank based on historical % of marks vs AIR
 */
export function predictJeeAdvancedRank(scoredMarks: number, totalMarks: number = 180): RankPrediction {
  const safeTotal = totalMarks > 0 ? totalMarks : 180;
  const safeScored = Math.max(-totalMarks, Math.min(scoredMarks, totalMarks));
  const percentage = Math.round((safeScored / safeTotal) * 1000) / 10; // 1 decimal place

  // Milestones for JEE Advanced
  const milestones = [
    { name: 'Qualifying Cutoff', targetPercent: 22, achieved: percentage >= 22 },
    { name: 'Top 10,000 (IIT Seat)', targetPercent: 40, achieved: percentage >= 40 },
    { name: 'Top 5,000 (Core IITs)', targetPercent: 50, achieved: percentage >= 50 },
    { name: 'Top 2,200 (Top Branches)', targetPercent: 60, achieved: percentage >= 60 },
    { name: 'Top 500 (Gen-1 CS/Elec)', targetPercent: 75, achieved: percentage >= 75 },
  ];

  let minAir = 50000;
  let maxAir = 65000;
  let tier = 'Below General Cutoff';
  let color = 'rose';
  let nextMilestone: RankPrediction['nextMilestone'] = null;

  if (percentage >= 90) {
    minAir = 1;
    maxAir = 50;
    tier = 'Top 50 (Dream Rank)';
    color = 'emerald';
  } else if (percentage >= 80) {
    minAir = 50;
    maxAir = 250;
    tier = 'Top 250 (IIT Bombay / Delhi CS)';
    color = 'emerald';
    const targetMarks = Math.ceil((0.90 * safeTotal));
    nextMilestone = {
      targetTier: 'Top 50',
      marksNeeded: Math.max(1, targetMarks - safeScored),
      insight: `Scoring +${Math.max(1, targetMarks - safeScored)} more marks could elevate you into the Top 50 AIR tier!`
    };
  } else if (percentage >= 70) {
    minAir = 250;
    maxAir = 800;
    tier = 'Top 800 (Top 5 IITs CS / Electrical)';
    color = 'emerald';
    const targetMarks = Math.ceil((0.80 * safeTotal));
    nextMilestone = {
      targetTier: 'Top 250',
      marksNeeded: Math.max(1, targetMarks - safeScored),
      insight: `Scoring +${Math.max(1, targetMarks - safeScored)} more marks could push you into the Top 250 AIR range!`
    };
  } else if (percentage >= 60) {
    minAir = 800;
    maxAir = 2200;
    tier = 'Top 2,200 (Top Old IITs)';
    color = 'indigo';
    const targetMarks = Math.ceil((0.70 * safeTotal));
    nextMilestone = {
      targetTier: 'Top 800',
      marksNeeded: Math.max(1, targetMarks - safeScored),
      insight: `Scoring +${Math.max(1, targetMarks - safeScored)} more marks could advance your rank into the Top 800!`
    };
  } else if (percentage >= 50) {
    minAir = 2200;
    maxAir = 5000;
    tier = 'Top 5,000 (Core IIT Branches)';
    color = 'indigo';
    const targetMarks = Math.ceil((0.60 * safeTotal));
    nextMilestone = {
      targetTier: 'Top 2,200',
      marksNeeded: Math.max(1, targetMarks - safeScored),
      insight: `Scoring +${Math.max(1, targetMarks - safeScored)} more marks could move your estimated rank into the Top 2,200!`
    };
  } else if (percentage >= 40) {
    minAir = 5000;
    maxAir = 10000;
    tier = 'Top 10,000 (Confirmed IIT Seat)';
    color = 'indigo';
    const targetMarks = Math.ceil((0.50 * safeTotal));
    nextMilestone = {
      targetTier: 'Top 5,000',
      marksNeeded: Math.max(1, targetMarks - safeScored),
      insight: `Scoring +${Math.max(1, targetMarks - safeScored)} more marks could move you into the prestigious Top 5,000 rank bracket!`
    };
  } else if (percentage >= 30) {
    minAir = 10000;
    maxAir = 18000;
    tier = 'Rank List Qualified (~AIR 10K–18K)';
    color = 'amber';
    const targetMarks = Math.ceil((0.40 * safeTotal));
    nextMilestone = {
      targetTier: 'Top 10,000',
      marksNeeded: Math.max(1, targetMarks - safeScored),
      insight: `Scoring +${Math.max(1, targetMarks - safeScored)} more marks could advance you into the Top 10,000 IIT admission zone!`
    };
  } else if (percentage >= 22) {
    minAir = 18000;
    maxAir = 32000;
    tier = 'Borderline Qualified (~AIR 18K–32K)';
    color = 'amber';
    const targetMarks = Math.ceil((0.30 * safeTotal));
    nextMilestone = {
      targetTier: 'Top 18,000',
      marksNeeded: Math.max(1, targetMarks - safeScored),
      insight: `Eliminating 2–3 negative marks (+${Math.max(1, targetMarks - safeScored)} marks) can boost you into the Top 18,000 rank list.`
    };
  } else {
    minAir = 35000;
    maxAir = 60000;
    tier = 'Below General Cutoff (~22%)';
    color = 'rose';
    const targetMarks = Math.ceil((0.22 * safeTotal));
    nextMilestone = {
      targetTier: 'Qualifying Cutoff',
      marksNeeded: Math.max(1, targetMarks - safeScored),
      insight: `You need +${Math.max(1, targetMarks - safeScored)} more marks to cross the estimated General Qualifying Cutoff (22%). Focus on high-yield accuracy.`
    };
  }

  const airDisplay = percentage < 22 
    ? 'Below Cutoff (AIR > 35,000)' 
    : `AIR ${minAir.toLocaleString()} – ${maxAir.toLocaleString()}`;

  return {
    examType: 'JEE Advanced',
    marksScored: safeScored,
    totalMarks: safeTotal,
    percentage,
    predictedAirMin: minAir,
    predictedAirMax: maxAir,
    predictedAirDisplay: airDisplay,
    tierLabel: tier,
    statusColor: color,
    nextMilestone,
    milestones
  };
}

/**
 * Predicts JEE Mains NTA Percentile and CRL Rank based on total scaled to 300
 */
export function predictJeeMainsRank(scoredMarks: number, totalMarks: number = 300): RankPrediction {
  const safeTotal = totalMarks > 0 ? totalMarks : 300;
  const scaledScore = Math.round((scoredMarks / safeTotal) * 300);
  const percentage = Math.round((scoredMarks / safeTotal) * 1000) / 10;

  const milestones = [
    { name: 'Qualifying Cutoff (~91%ile)', targetPercent: 33, achieved: scaledScore >= 100 },
    { name: 'NIT Seat (~96%ile)', targetPercent: 47, achieved: scaledScore >= 140 },
    { name: 'Top NITs (~98.5%ile)', targetPercent: 60, achieved: scaledScore >= 180 },
    { name: 'Top NIT CS (~99.5%ile)', targetPercent: 73, achieved: scaledScore >= 220 },
    { name: 'Top 500 AIR (~99.9%ile)', targetPercent: 87, achieved: scaledScore >= 260 },
  ];

  let minAir = 200000;
  let maxAir = 350000;
  let percentile = 75.0;
  let tier = 'Needs Revision';
  let color = 'rose';
  let nextMilestone: RankPrediction['nextMilestone'] = null;

  if (scaledScore >= 270) {
    minAir = 1;
    maxAir = 350;
    percentile = 99.98;
    tier = 'Top 500 (AIR 1 – 350)';
    color = 'emerald';
  } else if (scaledScore >= 240) {
    minAir = 350;
    maxAir = 2500;
    percentile = 99.80;
    tier = '99.8+ %ile (Top NIT CS)';
    color = 'emerald';
    const marksNeeded = 270 - scaledScore;
    nextMilestone = {
      targetTier: 'Top 350',
      marksNeeded,
      insight: `Scoring +${marksNeeded} more marks could raise your percentile to 99.98% (Top 350)!`
    };
  } else if (scaledScore >= 200) {
    minAir = 2500;
    maxAir = 9000;
    percentile = 99.30;
    tier = '99.3+ %ile (Top Tier NITs)';
    color = 'indigo';
    const marksNeeded = 240 - scaledScore;
    nextMilestone = {
      targetTier: '99.8% Percentile',
      marksNeeded,
      insight: `Scoring +${marksNeeded} more marks could elevate you into the 99.8+ percentile bracket!`
    };
  } else if (scaledScore >= 160) {
    minAir = 9000;
    maxAir = 25000;
    percentile = 98.20;
    tier = '98.2+ %ile (Confirmed NIT Seat)';
    color = 'indigo';
    const marksNeeded = 200 - scaledScore;
    nextMilestone = {
      targetTier: '99.3% Percentile',
      marksNeeded,
      insight: `Scoring +${marksNeeded} more marks pushes your rank under 9,000 AIR!`
    };
  } else if (scaledScore >= 120) {
    minAir = 25000;
    maxAir = 65000;
    percentile = 95.50;
    tier = '95.5+ %ile (NIT Eligible)';
    color = 'amber';
    const marksNeeded = 160 - scaledScore;
    nextMilestone = {
      targetTier: 'Top 25,000',
      marksNeeded,
      insight: `Scoring +${marksNeeded} more marks will advance your rank into the Top 25,000.`
    };
  } else if (scaledScore >= 95) {
    minAir = 65000;
    maxAir = 120000;
    percentile = 91.50;
    tier = 'JEE Advanced Qualifying Zone';
    color = 'amber';
    const marksNeeded = 120 - scaledScore;
    nextMilestone = {
      targetTier: '95.5% Percentile',
      marksNeeded,
      insight: `Scoring +${marksNeeded} more marks elevates you into a strong NIT bracket.`
    };
  } else {
    minAir = 120000;
    maxAir = 300000;
    percentile = Math.max(10, Math.round((scaledScore / 95) * 85));
    tier = 'Below JEE Advanced Cutoff (~91%ile)';
    color = 'rose';
    const marksNeeded = Math.max(1, 95 - scaledScore);
    nextMilestone = {
      targetTier: 'Advanced Qualification (~91%ile)',
      marksNeeded,
      insight: `You need +${marksNeeded} more marks to cross the JEE Advanced qualifying threshold.`
    };
  }

  return {
    examType: 'JEE Mains',
    marksScored: scoredMarks,
    totalMarks: safeTotal,
    percentage,
    estimatedPercentile: percentile,
    predictedAirMin: minAir,
    predictedAirMax: maxAir,
    predictedAirDisplay: `AIR ${minAir.toLocaleString()} – ${maxAir.toLocaleString()}`,
    tierLabel: tier,
    statusColor: color,
    nextMilestone,
    milestones
  };
}

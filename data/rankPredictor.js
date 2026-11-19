(function() {
  window.predictJeeAdvancedRank = function(scoredMarks, totalMarks) {
    var safeTotal = totalMarks > 0 ? totalMarks : 180;
    var safeScored = Math.max(-totalMarks, Math.min(scoredMarks, totalMarks));
    var percentage = Math.round((safeScored / safeTotal) * 1000) / 10;

    var milestones = [
      { name: 'Qualifying Cutoff', targetPercent: 22, achieved: percentage >= 22 },
      { name: 'Top 10,000 (IIT Seat)', targetPercent: 40, achieved: percentage >= 40 },
      { name: 'Top 5,000 (Core IITs)', targetPercent: 50, achieved: percentage >= 50 },
      { name: 'Top 2,200 (Top Branches)', targetPercent: 60, achieved: percentage >= 60 },
      { name: 'Top 500 (Gen-1 CS/Elec)', targetPercent: 75, achieved: percentage >= 75 },
    ];

    var minAir = 50000;
    var maxAir = 65000;
    var tier = 'Below General Cutoff';
    var color = 'rose';
    var nextMilestone = null;

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
      var needed = Math.max(1, Math.ceil(0.90 * safeTotal) - safeScored);
      nextMilestone = {
        targetTier: 'Top 50',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks could elevate you into the Top 50 AIR tier!'
      };
    } else if (percentage >= 70) {
      minAir = 250;
      maxAir = 800;
      tier = 'Top 800 (Top 5 IITs CS / Electrical)';
      color = 'emerald';
      var needed = Math.max(1, Math.ceil(0.80 * safeTotal) - safeScored);
      nextMilestone = {
        targetTier: 'Top 250',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks could push you into the Top 250 AIR range!'
      };
    } else if (percentage >= 60) {
      minAir = 800;
      maxAir = 2200;
      tier = 'Top 2,200 (Top Old IITs)';
      color = 'indigo';
      var needed = Math.max(1, Math.ceil(0.70 * safeTotal) - safeScored);
      nextMilestone = {
        targetTier: 'Top 800',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks could advance your rank into the Top 800!'
      };
    } else if (percentage >= 50) {
      minAir = 2200;
      maxAir = 5000;
      tier = 'Top 5,000 (Core IIT Branches)';
      color = 'indigo';
      var needed = Math.max(1, Math.ceil(0.60 * safeTotal) - safeScored);
      nextMilestone = {
        targetTier: 'Top 2,200',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks could move your estimated rank into the Top 2,200!'
      };
    } else if (percentage >= 40) {
      minAir = 5000;
      maxAir = 10000;
      tier = 'Top 10,000 (Confirmed IIT Seat)';
      color = 'indigo';
      var needed = Math.max(1, Math.ceil(0.50 * safeTotal) - safeScored);
      nextMilestone = {
        targetTier: 'Top 5,000',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks could move you into the prestigious Top 5,000 rank bracket!'
      };
    } else if (percentage >= 30) {
      minAir = 10000;
      maxAir = 18000;
      tier = 'Rank List Qualified (~AIR 10K–18K)';
      color = 'amber';
      var needed = Math.max(1, Math.ceil(0.40 * safeTotal) - safeScored);
      nextMilestone = {
        targetTier: 'Top 10,000',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks could advance you into the Top 10,000 IIT admission zone!'
      };
    } else if (percentage >= 22) {
      minAir = 18000;
      maxAir = 32000;
      tier = 'Borderline Qualified (~AIR 18K–32K)';
      color = 'amber';
      var needed = Math.max(1, Math.ceil(0.30 * safeTotal) - safeScored);
      nextMilestone = {
        targetTier: 'Top 18,000',
        marksNeeded: needed,
        insight: 'Eliminating 2–3 negative marks (+' + needed + ' marks) can boost you into the Top 18,000 rank list.'
      };
    } else {
      minAir = 35000;
      maxAir = 60000;
      tier = 'Below General Cutoff (~22%)';
      color = 'rose';
      var needed = Math.max(1, Math.ceil(0.22 * safeTotal) - safeScored);
      nextMilestone = {
        targetTier: 'Qualifying Cutoff',
        marksNeeded: needed,
        insight: 'You need +' + needed + ' more marks to cross the estimated General Qualifying Cutoff (~22%). Focus on high-yield accuracy.'
      };
    }

    var airDisplay = percentage < 22 
      ? 'Below Cutoff (AIR > 35,000)' 
      : 'AIR ' + minAir.toLocaleString() + ' – ' + maxAir.toLocaleString();

    return {
      examType: 'JEE Advanced',
      marksScored: safeScored,
      totalMarks: safeTotal,
      percentage: percentage,
      predictedAirMin: minAir,
      predictedAirMax: maxAir,
      predictedAirDisplay: airDisplay,
      tierLabel: tier,
      statusColor: color,
      nextMilestone: nextMilestone,
      milestones: milestones
    };
  };

  window.predictJeeMainsRank = function(scoredMarks, totalMarks) {
    var safeTotal = totalMarks > 0 ? totalMarks : 300;
    var scaledScore = Math.round((scoredMarks / safeTotal) * 300);
    var percentage = Math.round((scoredMarks / safeTotal) * 1000) / 10;

    var milestones = [
      { name: 'Qualifying Cutoff (~91%ile)', targetPercent: 33, achieved: scaledScore >= 100 },
      { name: 'NIT Seat (~96%ile)', targetPercent: 47, achieved: scaledScore >= 140 },
      { name: 'Top NITs (~98.5%ile)', targetPercent: 60, achieved: scaledScore >= 180 },
      { name: 'Top NIT CS (~99.5%ile)', targetPercent: 73, achieved: scaledScore >= 220 },
      { name: 'Top 500 AIR (~99.9%ile)', targetPercent: 87, achieved: scaledScore >= 260 },
    ];

    var minAir = 200000;
    var maxAir = 350000;
    var percentile = 75.0;
    var tier = 'Needs Revision';
    var color = 'rose';
    var nextMilestone = null;

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
      var needed = 270 - scaledScore;
      nextMilestone = {
        targetTier: 'Top 350',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks could raise your percentile to 99.98% (Top 350)!'
      };
    } else if (scaledScore >= 200) {
      minAir = 2500;
      maxAir = 9000;
      percentile = 99.30;
      tier = '99.3+ %ile (Top Tier NITs)';
      color = 'indigo';
      var needed = 240 - scaledScore;
      nextMilestone = {
        targetTier: '99.8% Percentile',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks could elevate you into the 99.8+ percentile bracket!'
      };
    } else if (scaledScore >= 160) {
      minAir = 9000;
      maxAir = 25000;
      percentile = 98.20;
      tier = '98.2+ %ile (Confirmed NIT Seat)';
      color = 'indigo';
      var needed = 200 - scaledScore;
      nextMilestone = {
        targetTier: '99.3% Percentile',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks pushes your rank under 9,000 AIR!'
      };
    } else if (scaledScore >= 120) {
      minAir = 25000;
      maxAir = 65000;
      percentile = 95.50;
      tier = '95.5+ %ile (NIT Eligible)';
      color = 'amber';
      var needed = 160 - scaledScore;
      nextMilestone = {
        targetTier: 'Top 25,000',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks will advance your rank into the Top 25,000.'
      };
    } else if (scaledScore >= 95) {
      minAir = 65000;
      maxAir = 120000;
      percentile = 91.50;
      tier = 'JEE Advanced Qualifying Zone';
      color = 'amber';
      var needed = 120 - scaledScore;
      nextMilestone = {
        targetTier: '95.5% Percentile',
        marksNeeded: needed,
        insight: 'Scoring +' + needed + ' more marks elevates you into a strong NIT bracket.'
      };
    } else {
      minAir = 120000;
      maxAir = 300000;
      percentile = Math.max(10, Math.round((scaledScore / 95) * 85));
      tier = 'Below JEE Advanced Cutoff (~91%ile)';
      color = 'rose';
      var needed = Math.max(1, 95 - scaledScore);
      nextMilestone = {
        targetTier: 'Advanced Qualification (~91%ile)',
        marksNeeded: needed,
        insight: 'You need +' + needed + ' more marks to cross the JEE Advanced qualifying threshold.'
      };
    }

    return {
      examType: 'JEE Mains',
      marksScored: scoredMarks,
      totalMarks: safeTotal,
      percentage: percentage,
      estimatedPercentile: percentile,
      predictedAirMin: minAir,
      predictedAirMax: maxAir,
      predictedAirDisplay: 'AIR ' + minAir.toLocaleString() + ' – ' + maxAir.toLocaleString(),
      tierLabel: tier,
      statusColor: color,
      nextMilestone: nextMilestone,
      milestones: milestones
    };
  };
})();

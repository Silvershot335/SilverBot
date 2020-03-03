const levels = [];

function generateLevels() {
    let experience = 20;
    for (let i = 1; i < Number(process.env.MAX_DISC_LEVEL || 100); ++i) {
      levels.push({ level: i, experience });
      experience = Math.round(experience * 2);
    }
  }
generateLevels()

console.log(levels)
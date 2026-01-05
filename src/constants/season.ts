/**
 * 赛季规则配置
 * 
 * 2026赛季规则：
 * - 周期：周一 00:00:00 至 周日 23:59:59
 * - 归属：以周日所在的月份为准
 * - 特殊：2026年1月第1周 = 2025/12/26(周五) - 2026/01/04(周日) (过渡期)
 * 
 * 2025赛季规则 (默认)：
 * - 周期：周五 00:00:00 至 周四 23:59:59
 * - 归属：以周四所在的月份为准
 */

export interface SeasonRule {
    year: number;
    // 周结算日 (0=周日, 1=周一, ... 4=周四)
    // 2025: 4 (周四)
    // 2026: 0 (周日)
    settlementDay: number; 
    
    // 周起始日相对结算日的偏移天数 (通常是6，即前推6天)
    // 2025: End=Thu, Start=Fri (Thu-6)
    // 2026: End=Sun, Start=Mon (Sun-6)
    durationDays: number;

    // 特殊周配置
    specialWeeks?: {
        [key: string]: { // key format: "YYYY-MM-W" e.g. "2026-1-1"
            startDate: string; // "YYYY-MM-DD"
            endDate: string;   // "YYYY-MM-DD"
        }
    }

    // 排除的结算日期 (这些日期虽然是 settlementDay，但不作为结算日计算)
    excludedSettlementDates?: string[]; // "YYYY-MM-DD"
}

export const SEASON_RULES: { [year: number]: SeasonRule } = {
    2025: {
        year: 2025,
        settlementDay: 4, // Thursday
        durationDays: 6,
        specialWeeks: {
            "2025-12-5": {
                startDate: "2025-12-26",
                endDate: "2025-12-31"
            }
        }
    },
    2026: {
        year: 2026,
        settlementDay: 0, // Sunday
        durationDays: 6,
        // Exclude 2026-01-04 (First Sunday) so that Week 1 becomes the week ending on Jan 11
        // This makes Week 1: Jan 5 - Jan 11
        excludedSettlementDates: ["2026-01-04"]
    }
};

export const DEFAULT_RULE = SEASON_RULES[2025];

export const getSeasonRule = (year: number): SeasonRule => {
    return SEASON_RULES[year] || (year > 2026 ? SEASON_RULES[2026] : DEFAULT_RULE);
};

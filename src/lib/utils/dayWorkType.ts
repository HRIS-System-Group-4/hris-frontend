export const formatDayWorkType = (type: "wfo" | "wfa" | "off-day"): string => {
    const map = {
        wfo: "WFO",
        wfa: "WFA",
        "off-day": "Off-day",
    };

    return map[type] ?? type
}
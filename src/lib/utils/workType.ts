export const formatWorkType = (type: "wfo" | "wfa" | "hybrid"): string => {
    const map = {
        wfo: "WFO",
        wfa: "WFA",
        "hybrid": "Hybrid",
    };

    return map[type] ?? type
}

export function targetLabel(type: string) {
    if (type === "ALL") return "ประกาศทั้งหมด";
    if (type === "ROOM") return "เฉพาะห้อง";
    if (type === "USER") return "เฉพาะคุณ";
}

export const targetTypeLabelMap: Record<string, string> = {
    ALL: "ทุกคนในหอ",
    ROOM: "เฉพาะห้อง",
};

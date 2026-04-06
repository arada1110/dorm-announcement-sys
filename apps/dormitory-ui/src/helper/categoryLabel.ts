export function categoryLabel(id: number) {
    const map: Record<number, string> = {
        1: "ประกาศทั่วไป",
        2: "ด่วน",
        3: "แจ้งซ่อม",
        4: "ระบบ",
    };

    return map[id] || "อื่น ๆ";
}

export const categoryLabelMap: Record<string, string> = {
    GENERAL: "ข่าวทั่วไป",
    ANNOUNCEMENT: "ประกาศสำคัญ",
    EVENT: "กิจกรรม",
    PAYMENT: "การชำระเงิน",
    MAINTENANCE: "การซ่อมบำรุง",
};

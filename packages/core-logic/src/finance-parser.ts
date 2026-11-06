export interface ParsedTransaction {
  note: string;
  amount: number;
  type: "expense" | "income";
  category?: string;
  confidence: "high" | "medium" | "low";
}

/**
 * Parses natural text into structured transaction data.
 * Examples:
 * - "kopi 25k #jajan"
 * - "gaji freelance 5jt #income"
 * - "+100k bonus"
 * - "bensin motor 45000"
 */
export function parseQuickTransaction(input: string): ParsedTransaction {
  const trimmed = input.trim();
  if (!trimmed) {
    return { note: "Pengeluaran", amount: 0, type: "expense", confidence: "low" };
  }

  let type: "expense" | "income" = "expense";
  let workingText = trimmed;

  // Check explicit prefix + or -
  if (workingText.startsWith("+")) {
    type = "income";
    workingText = workingText.slice(1).trim();
  } else if (workingText.startsWith("-")) {
    type = "expense";
    workingText = workingText.slice(1).trim();
  }

  // Extract category if starts with #
  let category: string | undefined;
  const tagMatch = workingText.match(/#(\w+)/);
  if (tagMatch) {
    category = tagMatch[1];
    workingText = workingText.replace(tagMatch[0], "").trim();
  }

  // Match amount pattern: 25k, 25.5k, 25rb, 5jt, 50000, Rp 25.000
  const amountRegex = /(?:rp\.?\s*)?(\d+(?:[.,]\d+)?)\s*(k|rb|ribu|jt|juta|m|mil|miliar)?\b/i;
  const match = workingText.match(amountRegex);

  let amount = 0;
  let note = workingText;

  if (match) {
    const rawNumStr = match[1].replace(",", ".");
    const rawNum = parseFloat(rawNumStr);
    const unit = (match[2] || "").toLowerCase();

    if (unit === "k" || unit === "rb" || unit === "ribu") {
      amount = Math.round(rawNum * 1000);
    } else if (unit === "jt" || unit === "juta" || unit === "m" || unit === "mil") {
      amount = Math.round(rawNum * 1000000);
    } else {
      // Standalone numbers
      amount = Math.round(rawNum);
    }

    // Remove the amount from note
    note = workingText.replace(match[0], "").trim();
  }

  // Fallback note
  if (!note) {
    note = type === "income" ? "Pemasukan Cepat" : "Pengeluaran Cepat";
  }

  // Auto-detect income keywords
  if (
    type === "expense" &&
    (category?.toLowerCase() === "income" ||
      category?.toLowerCase() === "gaji" ||
      note.toLowerCase().includes("gaji") ||
      note.toLowerCase().includes("bonus") ||
      note.toLowerCase().includes("transfer masuk") ||
      note.toLowerCase().includes("income"))
  ) {
    type = "income";
  }

  return {
    note,
    amount,
    type,
    category,
    confidence: amount > 0 ? "high" : "low",
  };
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

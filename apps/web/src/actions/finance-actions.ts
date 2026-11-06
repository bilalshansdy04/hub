"use server";

import { db, transactions, wallets, categories, desc, eq } from "@shrimphub/database";
import { parseQuickTransaction } from "@shrimphub/core-logic";
import { revalidatePath } from "next/cache";

export async function getFinanceOverview() {
  try {
    const allWallets = await db.select().from(wallets);
    const recentTransactions = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.date))
      .limit(10);
    const allCategories = await db.select().from(categories);

    const totalBalance = allWallets.reduce((acc, w) => acc + w.balance, 0);

    return {
      wallets: allWallets,
      recentTransactions,
      categories: allCategories,
      totalBalance,
    };
  } catch (error) {
    console.error("Failed to fetch finance overview:", error);
    return {
      wallets: [],
      recentTransactions: [],
      categories: [],
      totalBalance: 0,
    };
  }
}

export async function addQuickTransactionAction(rawText: string, targetWalletId?: string) {
  const parsed = parseQuickTransaction(rawText);
  if (parsed.amount <= 0) {
    return { success: false, error: "Nominal pengeluaran/pemasukan tidak valid." };
  }

  try {
    let walletId = targetWalletId;
    if (!walletId) {
      const firstWallet = await db.select().from(wallets).limit(1);
      if (firstWallet.length > 0) {
        walletId = firstWallet[0].id;
      } else {
        walletId = "wallet-main";
        await db.insert(wallets).values({
          id: walletId,
          name: "Dompet Utama",
          type: "cash",
          balance: 0,
          currency: "IDR",
          color: "#10b981",
          updatedAt: new Date(),
        });
      }
    }

    const txId = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await db.insert(transactions).values({
      id: txId,
      walletId,
      amount: parsed.amount,
      type: parsed.type,
      note: parsed.note,
      date: new Date(),
      createdAt: new Date(),
    });

    const wallet = await db.select().from(wallets).where(eq(wallets.id, walletId)).limit(1);
    if (wallet.length > 0) {
      const newBal =
        parsed.type === "income"
          ? wallet[0].balance + parsed.amount
          : wallet[0].balance - parsed.amount;

      await db
        .update(wallets)
        .set({ balance: newBal, updatedAt: new Date() })
        .where(eq(wallets.id, walletId));
    }

    revalidatePath("/");
    return { success: true, parsed };
  } catch (error) {
    console.error("Error creating quick transaction:", error);
    return { success: false, error: "Gagal menyimpan transaksi ke database." };
  }
}

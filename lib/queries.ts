import { db } from "@/db"; // adjust path to your db folder
import { states, metabolic, trend, ethnicity } from "@/db/schema";
import { desc, eq, sql, avg, min, max, and, gte, lte, asc, ilike } from "drizzle-orm";

export async function getMetabolicDataByYear(year: number) {
    const data = await db
        .select({
            stats_id: metabolic.stats_id,
            state: states.state_name,
            patients: metabolic.patients,
            diabetes: metabolic.diabetesPrevalence,
            hypertension: metabolic.hypertensionPrevalence,
            hyperlipidemia: metabolic.hyperlipidemiaPrevalence,
            year: metabolic.year,
        })
        .from(metabolic)
        .where(eq(metabolic.year, year))
        .leftJoin(states, eq(metabolic.state_id, states.state_id));
    return data;
}

export async function getAllMetabolicDataGrouped() {
    const rows = await db
        .select({
        state: states.state_name,
        patients: metabolic.patients,
        diabetes: metabolic.diabetesPrevalence,
        hypertension: metabolic.hypertensionPrevalence,
        hyperlipidemia: metabolic.hyperlipidemiaPrevalence,
        year: metabolic.year,
        })
        .from(metabolic)
        .leftJoin(states, eq(metabolic.state_id, states.state_id))
        .orderBy(asc(metabolic.year));

    const dataByYear: Record<
        string,
        Record<string, { patients: number; diabetes: number; hypertension: number; hyperlipidemia: number }>
    > = {};
    const yearSet = new Set<number>();

    for (const row of rows) {
        if (!row.state) continue;
        const yearKey = String(row.year);
        yearSet.add(row.year);
        if (!dataByYear[yearKey]) dataByYear[yearKey] = {};
        dataByYear[yearKey][row.state] = {
        patients: row.patients,
        // Drizzle returns pg `decimal` columns as strings — parse here once
        diabetes: parseFloat(row.diabetes as string),
        hypertension: parseFloat(row.hypertension as string),
        hyperlipidemia: parseFloat(row.hyperlipidemia as string),
        };
    }

    const availableYears = [...yearSet].sort((a, b) => a - b).map(String);
    return { dataByYear, availableYears };
}

export async function getNationalTrend() {
    const data = await db
        .select({
            trend_id: trend.trend_id,
            year: trend.year,
            patients: trend.patients,
            diabetes: trend.diabetesPrevalence,
            hypertension: trend.hypertensionPrevalence,
            hyperlipidemia: trend.hyperlipidemiaPrevalence
        })
        .from(trend)
    return data;
}

export async function getEthnicityData() {
    const data = await db
        .select({
            ethnicity_id: ethnicity.id,
            ethnicity: ethnicity.ethnicity,
            diabetes: ethnicity.diabetesPrevalence,
            hypertension: ethnicity.hypertensionPrevalence,
            hyperlipidemia: ethnicity.hyperlipidemiaPrevalence
        })
        .from(ethnicity);
    return data;
}
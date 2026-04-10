import { db } from "@/db"; // adjust path to your db folder
import { states, diabetes, trend, ethnicity } from "@/db/schema";
import { desc, eq, sql, avg, min, max, and, gte, lte, asc, ilike } from "drizzle-orm";

export async function getDiabetesDataByYear(year: number) {
    const data = await db
        .select({
            stats_id: diabetes.stats_id,
            state: states.state_name,
            patients: diabetes.patients,
            prevalence: diabetes.diabetesPrevalence,
            year: diabetes.year,
            population: diabetes.population,
        })
        .from(diabetes)
        .where(eq(diabetes.year, year))
        .leftJoin(states, eq(diabetes.state_id, states.state_id));
    return data;
}

export async function getAllDiabetesDataGrouped() {
    const rows = await db
        .select({
        state: states.state_name,
        patients: diabetes.patients,
        prevalence: diabetes.diabetesPrevalence,
        year: diabetes.year,
        population: diabetes.population,
        })
        .from(diabetes)
        .leftJoin(states, eq(diabetes.state_id, states.state_id))
        .orderBy(asc(diabetes.year));

    const dataByYear: Record<
        string,
        Record<string, { patients: number; prevalence: number; population: number }>
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
        prevalence: parseFloat(row.prevalence as string),
        population: row.population,
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
            prevalence: trend.diabetesPrevalence
        })
        .from(trend)
    return data;
}

export async function getEthnicityData() {
    const data = await db
        .select({
            ethnicity_id: ethnicity.id,
            patients: ethnicity.ethnicity,
            percentage: ethnicity.Percentage
        })
        .from(ethnicity);
    return data;
}
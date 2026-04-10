import { timestamptz } from "drizzle-orm/gel-core";
import { year } from "drizzle-orm/mysql-core";
import { pgTable, serial, text, integer, timestamp, doublePrecision, varchar, decimal, date } from "drizzle-orm/pg-core";

// Table 1: State Information (Static Info)
export const states = pgTable("states", {
    state_id: serial("id").primaryKey(),
    state_name: text("name").notNull(),
});

// Table 2: Diabetes Data (Static Info)
export const diabetes = pgTable("diabetes", {
    stats_id: serial("id").primaryKey(),
    state_id: integer("state_id").notNull().references(() => states.state_id),
    year: integer("year").notNull(),
    population: integer("population").notNull(),
    patients: integer("patients").notNull(),
    diabetesPrevalence: decimal("diabetes_prevalence").notNull(),
});

// Table 3: National Trend (Static Info)
export const trend = pgTable("trend", {
    trend_id: serial("id").primaryKey(),
    year: integer("year").notNull(),
    patients: integer("patients").notNull(),
    diabetesPrevalence: decimal("diabetes_prevalence").notNull(),
});

// Table 4: Ethnicity Percentage (Static Info)
export const ethnicity = pgTable("ethnicity", {
    id: serial("id").primaryKey(),
    ethnicity: varchar("ethnicity").notNull(),
    Percentage: decimal("percentage").notNull(),
});

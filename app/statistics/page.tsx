import { get } from "http";
import OverviewClient from "./statistics-client";
import { getAllMetabolicDataGrouped, getNationalTrend, getEthnicityData } from "@/lib/queries";

export default async function StatisticsPage() {
  const [{ dataByYear, availableYears }, nationalTrend, ethnicityData] = await Promise.all([
    getAllMetabolicDataGrouped(),
    getNationalTrend(),
    getEthnicityData(),
  ]); 

  return (
    <OverviewClient  
      dataByYear={dataByYear}
      availableYears={availableYears} 
      nationalTrend={nationalTrend}
      ethnicityData={ethnicityData}
    /> 
  );
}

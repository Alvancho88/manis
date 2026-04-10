import { get } from "http";
import OverviewClient from "./overview-client";
import { getAllDiabetesDataGrouped, getNationalTrend, getEthnicityData } from "@/lib/queries";

export default async function OverviewPage() {
  const [{ dataByYear, availableYears }, nationalTrend, ethnicityData] = await Promise.all([
    getAllDiabetesDataGrouped(),
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

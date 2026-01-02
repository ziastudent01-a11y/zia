import { useState } from "react";

export function useDashboardFilters() {
  const [campusIds, setCampusIds] = useState<string[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<number[]>([]);
  const [academicStatuses, setAcademicStatuses] = useState<string[]>([]);
  const [fundingStatuses, setFundingStatuses] = useState<string[]>([]);
  const [eligibility, setEligibility] = useState<boolean | null>(null);

  return {
    campusIds,
    setCampusIds,
    programs,
    setPrograms,
    semesters,
    setSemesters,
    academicStatuses,
    setAcademicStatuses,
    fundingStatuses,
    setFundingStatuses,
    eligibility,
    setEligibility,
  };
}

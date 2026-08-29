export type HealthcareNeedId =
  | "general_consultation"
  | "laboratory_tests"
  | "maternity_care"
  | "child_healthcare"
  | "pharmacy"
  | "imaging"
  | "emergency_care";

export interface HealthcareNeed {
  id: HealthcareNeedId;
  label: string;
  searchTerm: string;
}

export const HEALTHCARE_NEEDS: HealthcareNeed[] = [
  {
    id: "general_consultation",
    label: "General Consultation",
    searchTerm: "doctor medical clinic",
  },
  {
    id: "laboratory_tests",
    label: "Laboratory Tests",
    searchTerm: "medical laboratory diagnostic centre",
  },
  {
    id: "maternity_care",
    label: "Maternity Care",
    searchTerm: "maternity hospital obstetrician",
  },
  {
    id: "child_healthcare",
    label: "Child Healthcare",
    searchTerm: "pediatrician children's hospital",
  },
  { id: "pharmacy", label: "Pharmacy", searchTerm: "pharmacy" },
  {
    id: "imaging",
    label: "X-ray / Imaging",
    searchTerm: "radiologist imaging centre",
  },
  {
    id: "emergency_care",
    label: "Emergency Care",
    searchTerm: "emergency room",
  },
];

export function getHealthcareNeed(
  id?: string,
): HealthcareNeed | undefined {
  return HEALTHCARE_NEEDS.find((need) => need.id === id);
}

export function healthcareNeedLabel(id: HealthcareNeedId): string {
  return getHealthcareNeed(id)?.label ?? "Healthcare service";
}
import { patientObjByEncounterTypeFilter  } from "@openmrs/react-components";
import { ENCOUNTER_TYPES } from "../../constants";

export default {
  required: [patientObjByEncounterTypeFilter(ENCOUNTER_TYPES.NutritionEncounterType.uuid, 'exclude')],
  completed: [patientObjByEncounterTypeFilter(ENCOUNTER_TYPES.NutritionEncounterType.uuid, 'include')]
};

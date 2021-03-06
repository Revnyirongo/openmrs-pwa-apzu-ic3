import React from "react";
import { connect } from 'react-redux';
import { selectors } from '@openmrs/react-components';
import SummaryAndForm from "../../layout/SummaryAndForm";
import BloodPressureSummary from "./BloodPressureSummary";
import BloodPressureForm from "./BloodPressureForm";
import bloodPressureFilters from "./bloodPressureFilters";
import {ENCOUNTER_TYPES} from "../../constants";

const BloodPressureSummaryAndForm = props => {

  return (
    <SummaryAndForm
      allowMultipleForms
      completed={bloodPressureFilters.completed(props.patient)}
      encounterType={ENCOUNTER_TYPES.BloodPressureEncounterType}
      form={<BloodPressureForm />}
      summary={<BloodPressureSummary />}
      title="Blood Pressure"
    />
  );

};

const mapStateToProps = (state) => {
  return {
    patient: selectors.getSelectedPatientFromStore(state),
  };
};

export default connect(mapStateToProps)(BloodPressureSummaryAndForm);

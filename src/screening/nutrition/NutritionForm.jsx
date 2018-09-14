import React from 'react';
import { Obs, EncounterFormPage} from '@openmrs/react-components';
import { Grid, Row, FormGroup, ControlLabel, Col } from 'react-bootstrap';
import { ENCOUNTER_TYPES, CONCEPTS } from "../../constants";

let NutritionForm = (props) => {

  const formContent = (
    <Grid>
      <Row>
        <FormGroup controlId="formWeight">
          <Col componentClass={ControlLabel} sm={2}>
            Weight
          </Col>
          <Col sm={4}>
            <Obs
              concept={CONCEPTS.Weight.uuid}
              path="weight"
            />
          </Col>
        </FormGroup>
      </Row>
      <Row>
        <FormGroup controlId="formHeight">
          <Col componentClass={ControlLabel} sm={2}>
            Height
          </Col>
          <Col sm={4}>
            <Obs
              concept={CONCEPTS.Height.uuid}
              path="height"
            />
          </Col>
        </FormGroup>
      </Row>
    </Grid>
  );

  return (
    <EncounterFormPage
      afterSubmitLink="/screening/nutrition/queue"
      backLink="/screening/nutrition/queue"
      encounterType={ENCOUNTER_TYPES.NutritionEncounterType}
      formId="nutrition-form"
      formContent={formContent}
      title="Nutrition"
    />
  );
};

export default NutritionForm;


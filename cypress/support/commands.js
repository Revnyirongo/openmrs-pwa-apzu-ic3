// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { URL, RESPONSE } from './constants.js';

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
  const optionsObject = options[0];

  // add default authorization header to all cy.request
  if (optionsObject === Object(optionsObject)) {
    optionsObject.headers = {
      authorization: 'Bearer ' + btoa(Cypress.env('username') + ':' + Cypress.env('password')),
      ...optionsObject.headers,
    };

    return originalFn(optionsObject);
  }

  return originalFn(...options);
});

Cypress.Commands.add('init', (EncounterResponseStub, Ic3ScreeningResponseStub) => {
  cy.server();
  cy.viewport(1280, 800);
  cy.route({
    method: 'GET',
    url: URL.GET_PATIENT_BY_NAME,
    status: 200,
    response: {
      results: RESPONSE.MULTIPLE_PATIENTS
    }
  });
  cy.route({
    method: 'GET',
    url: URL.GET_PATIENT_BY_ID,
    status: 200,
    response: {
      results: RESPONSE.SINGLE_PATIENT
    }
  });
  cy.route({
    method: 'GET',
    url: URL.GET_IC3_PATIENTS,
    status: 200,
    response: {
      results: RESPONSE.IC3_PATIENT
    }
  });
  cy.route({
    method: 'GET',
    url: URL.GET_PATIENT_OBS,
    status: 200,
    response: {
      results: RESPONSE.PATIENT_OBS
    }
  });
  cy.route({
    method: 'GET',
    url: URL.GET_PATIENT_VISIT,
    status: 200,
    response: {
      results: RESPONSE.PATIENT_VISIT
    }
  });
  cy.route({
    method: 'GET',
    url: URL.GET_PATIENT_ENCOUNTER,
    status: 200,
    response: {
      results: [RESPONSE.POST_PATIENT_ENCOUNTER]
    }
  });
  cy.route({
    method: 'GET',
    url: URL.GET_IC3_SCREENING_DATA,
    status: 200,
    response: {
      results: Ic3ScreeningResponseStub
    }
  });
  cy.route({
    method: 'POST',
    url: URL.GET_PATIENT_ENCOUNTER,
    status: 200,
    response: {
      results: EncounterResponseStub
    }
  });
});

Cypress.Commands.add('login', (username = Cypress.env('username'), password = Cypress.env('password'), skipXHRResponse = true) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: URL.GET_IC3_PATIENTS,
    status: 200,
    response: RESPONSE.IC3_PATIENT
  });
  cy.route({
    method: 'GET',
    url: URL.GET_PATIENT_VISIT,
    status: 200,
    response: {
      results: RESPONSE.PATIENT_VISIT
    }
  });
  cy.route({
    method: 'GET',
    url: URL.GET_LOCATIONS,
    status: 200,
    response: {
      results: RESPONSE.LOGIN_LOCATIONS
    }
  });
  skipXHRResponse && cy.route('GET', '**/session').as('getSession');
  skipXHRResponse && cy.route('GET', '**/concept/**').as('getConcept');

  cy.visit('/');

  const getUserName = $el => $el.find('#username');

  cy.get('body')
    .pipe(getUserName)
    .clear()
    .type(username)
    .should('have.value', username);

  const getUserPassword = $el => $el.find('#password');

  cy.get('body')
    .pipe(getUserPassword)
    .clear()
    .type(password)
    .should('have.value', password);

  cy.get('#location').select(Cypress.env('location'));
  cy.get('#location').should('have.value', Cypress.env('locationUuid'));

  const getLoginButton = $el => $el.find('.loginButton');

  cy.get('body')
    .pipe(getLoginButton)
    .click();

  skipXHRResponse && cy.wait('@getSession').its('status').should('be', 200);
  skipXHRResponse && cy.wait('@getConcept').its('status').should('be', 200);

});

Cypress.Commands.add("searchPatientByName", (patientName) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: URL.GET_PATIENT_BY_NAME,
    status: 200,
    response: {
      results: RESPONSE.MULTIPLE_PATIENTS
    }
  });
  cy.visit('/#/searchPatient');
  cy.get('.name-filter')
    .find('[name="patient-name"]')
    .type('john'); // Hardcoding "john" here because the URL for the stubbing was hardcoded with john

  cy.get('.server-search > button')
    .click();

  cy.get('.card-list')
    .should('exist');
});

Cypress.Commands.add("searchPatientByID", (patientID) => {
  cy.server();
  cy.route({
    method: 'GET',
    url: URL.GET_PATIENT_BY_ID,
    status: 200,
    response: {
      results: RESPONSE.SINGLE_PATIENT
    }
  });
  const patientIdentifier = patientID.split(' ');

  cy.visit('/#/searchPatient');
  cy.get('.identifier-filter  select')
    .first()
    .select(patientIdentifier[0]);

  cy.get('.identifier-filter-number-input')
    .type(patientIdentifier[1]);

  patientIdentifier[2] && cy.get('.identifier-filter  select')
    .last()
    .select(patientIdentifier[2]);

  cy.get('.server-search > button')
    .click();

  cy.wait(5000);

  cy.get('.card-list')
    .should('exist');

});

Cypress.Commands.add('openmrsapi', () => {

  cy.visit(Cypress.env('apiServer'));
  cy.get('#login-button').should('exist');

});

Cypress.Commands.add('loginwithrestapi', () => {

  cy.request({
    method: 'POST',
    url: Cypress.env('apiServer') + '/ws/rest/v1/appui/session?v=ref',
    options: {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': "application/json"
      }
    },
    body: {
      location: '0d414ce2-5ab4-11e0-870c-9f6107fee88e'
    }
  }).then( (response) => {
    expect(response.status).to.eq(200);
    expect(response.body.authenticated).to.eq(true);
  });

});


Cypress.Commands.add("logout", () => {
  // TODO get this to work

  cy.get('.user-display')
    .find('[data-icon="user"]')
    .first()
    .click();

  cy.get('[href="#/logout"]')
    .first()
    .click({ force: true });

  cy.wait(5000);

  cy.get('.user-display')
    .should('not.exist');
});

Cypress.Commands.add('loginWithInvalidInfo', () => {

  cy.visit('/');

  cy.get('[name=username]')
    .type('some-ranndom-username')
    .should('have.value', 'some-ranndom-username');

  cy.get('[name=password]')
    .type('password')
    .should('have.value', 'password');

  cy.get('[name=location]')
    .select(Cypress.env('location'));

  cy.get('[type=submit]')
    .click();
});

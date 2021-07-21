/// <reference types="cypress" />

describe('App GoGrow Test', () => {

    beforeEach(() => {
        cy.intercept('POST', 'https://app.gogrow.com/api/dashboard/74101/dashboard-view')
            .as('chart')

        cy.visit('https://app.gogrow.com/')
        cy.login()
             
    })

    it('Test A - Expand Metric', () => {
        // Wait for chart to load
        cy.wait('@chart')
        // Click on a metric
        cy.get('.amcharts-Container .amcharts-Sprite')
            .eq(0)
            .click()
        // Validate popup shows on top
        cy.get('.topBar---topBar---2Y8S5')
            .should('be.visible')
        // Close popup via X
        cy.get('.topBar---closeButton---2K74G > .topBar---rightIcon---2GwcE')
            .click()
        // Validate modal is gone and main page is displayed
        cy.get('.amcharts-Rectangle')
            .should('be.visible')
    })
})
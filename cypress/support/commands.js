
Cypress.Commands.add('login', () => { 
    const email = 'marc_good@hotmail.com'
    const password = 'Grow262'

    cy.get('.STATIC-logIn-email')
        .type(email)
    cy.get('.STATIC-logIn-password')
        .type(password)
    cy.get('.sign-in')
        .click()
})

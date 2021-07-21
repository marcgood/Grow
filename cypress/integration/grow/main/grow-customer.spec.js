/// <reference types="cypress" />

describe('Grow customers page', () => {

    beforeEach(() => {
        cy.intercept('POST', 
                     'https://forms.hsforms.com/emailcheck/v1/json-ext?portalId=457983&includeFreemailSuggestions=false')
                     .as('emailcheck')
        cy.visit('/company/grow-customers')
    })

    it('Validate Grow Customers page loads',  () => {
        cy.title('eq', 'Grow')
    })

    it('Validate links to 3rd party reviews', () => {
        cy.get('.heading-hero')
            .should('have.text', 'Grow Customers')
        // Validate List of 3 Videos
        cy.get('.container-hero article')
            .its('length')
            .should('be.at.least', 3)
        // Validate text of review title
        cy.get('.title-reviews-hero')
            .should('have.text', 'Business leaders like you give Grow hundreds of 5-star reviews.')
        // Validate review links return 200
        cy.get('.container-review-sites a')
            .each(link => {
                // URL's returning 403 because of redirect on 3rd party's end so skip them
                if( (link.prop('href') != 'https://www.g2crowd.com/products/grow-com/reviews') && 
                    (link.prop('href') != 'https://www.getapp.com/business-intelligence-analytics-software/a/grow/') &&
                    (link.prop('href') != 'https://www.trustradius.com/products/grow/reviews') ) {
                        // and validate all others
                        cy.request(link.prop('href'))
                            .its('status')
                            .should('eq', 200)   
                }
            }) // end each
    })

    it('Validate Get a Demo form errors', () => {
        // First Name field
        cy.get('#firstname-0f4b52bb-a323-45cc-9246-df54345e102e')
            .focus()
            .blur()
        cy.get('.hs_firstname .hs-error-msg')
            .should('be.visible')
            .and('have.text', 'Please complete this required field.')
        // Last Name field
        cy.get('#lastname-0f4b52bb-a323-45cc-9246-df54345e102e')
            .focus()
            .blur()
        cy.get('.hs_lastname .hs-error-msg')
            .should('be.visible')
            .and('have.text', 'Please complete this required field.')
        // Work Email field
        cy.get('#email-0f4b52bb-a323-45cc-9246-df54345e102e')
            .type('crazy.0@ggmail.zzzzw')
            .blur()
        cy.log('Email Check API')
        cy.wait('@emailcheck').then((i) => {
            expect(i.response.statusCode).to.eq(200)
            cy.get('label > a')
                .should('contain.text', 'Did you mean ' + i.response.body.emailSuggestion )
        })                   
        // Mobile Number field
        cy.get('#phone-0f4b52bb-a323-45cc-9246-df54345e102e')
            .type('4*32bd')
            .blur()
        cy.get('.hs_phone .hs-error-msg')
            .should('have.text', 'Please enter a phone number that\'s at least 10 numbers long.Must contain only numbers, +()-. and x.')
        // Number Of Employees field
        cy.get('#numemployees-0f4b52bb-a323-45cc-9246-df54345e102e')
            .focus()
            .blur()
        cy.get('.hs_numemployees .hs-error-msg')
            .should('have.text', 'Please select an option from the dropdown menu.')

    })

    it('Validate Get a Demo form', () => {
        cy.get('#firstname-0f4b52bb-a323-45cc-9246-df54345e102e')
            .type('Sally')
            .should('have.value', 'Sally')
        cy.get('#lastname-0f4b52bb-a323-45cc-9246-df54345e102e')
            .type('Jensen')
            .should('have.value', 'Jensen')
        cy.get('#email-0f4b52bb-a323-45cc-9246-df54345e102e')
            .type('sally@gmail.biz')
            .should('have.value', 'sally@gmail.biz')
        cy.get('#phone-0f4b52bb-a323-45cc-9246-df54345e102e')
            .type('(801)959.3920 x490')
            .should('have.value', '(801)959.3920 x490')
        cy.get('#numemployees-0f4b52bb-a323-45cc-9246-df54345e102e')
            .select('25-50')
            .should('have.value', '25-50')
        cy.get('.hs-button')
            .should('have.value', 'Get A Demo')
            //.click()

    })

})
describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
  });

  describe('Добавление ингредиентов', () => {
    it('Добавление булки и начинки в конструктор', () => {
      cy.get('[data-testid="ingredient-card"]')
        .first()
        .contains('Добавить')
        .click();
      cy.get('[data-testid="ingredient-card"]')
        .eq(1)
        .contains('Добавить')
        .click();
      cy.get('[data-testid="constructor-list"]')
        .children()
        .should('have.length.greaterThan', 0);
    });
  });

  describe('Модальные окна ингредиентов', () => {
    beforeEach(() => {
      cy.get('[data-testid="ingredient-card"]').first().as('ingredient');
    });

    it('Открытие модального окна', () => {
      cy.get('@ingredient').click();
      cy.get('[data-testid="modal"]').should('exist');
    });

    it('Модальное окно показывает правильный ингредиент', () => {
      cy.get('@ingredient')
        .find('[data-testid="ingredient-name"]')
        .invoke('text')
        .as('ingredientName');
      cy.get('@ingredient').click();
      cy.get('@ingredientName').then((name) => {
        cy.get('[data-testid="modal"]').should('contain', name);
      });
    });

    it('Закрытие по крестику', () => {
      cy.get('@ingredient').click();
      cy.get('[data-testid="close-button"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('Закрытие по overlay', () => {
      cy.get('@ingredient').click();
      cy.get('[data-testid="overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('Закрытие по Escape', () => {
      cy.get('@ingredient').click();
      cy.get('body').type('{esc}');
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');
      cy.intercept('POST', 'api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
      cy.setCookie('accessToken', 'test-access-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('Авторизованный пользователь может оформить заказ', () => {
      cy.get('[data-testid="ingredient-card"]')
        .first()
        .contains('Добавить')
        .click();
      cy.get('[data-testid="ingredient-card"]')
        .eq(1)
        .contains('Добавить')
        .click();
        
      cy.contains('Оформить заказ').should('be.enabled').click();
      cy.wait('@createOrder');
      cy.fixture('order.json').then((order) => {
        cy.get('[data-testid="modal"]')
          .should('exist')
          .and('contain', order.order.number);
      });

      cy.get('[data-testid="close-button"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');

      cy.get('[data-testid="constructor-NoBun"]').should('exist');
      cy.get('[data-testid="constructor-NoFillings"]').should('exist');
    });
  });
});

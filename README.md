# mortgage

[![Build Status](https://travis-ci.com/cthayer/node-js-mortgage.svg?branch=master)](https://travis-ci.com/cthayer/node-js-mortgage)

Library for node.js that calculates mortgages.

### Usage

```js
const Mortgage = require('@cdmnky/mortgage');

// $100,000 mortgage at 3% interest for 30 years
let m = new Mortgage(100000, 0.03, 30);

// get monthly payment
let monthlyPayment = m.payment();

// get interest portion of monthly payment
let interest = m.paymentInterest();

// get monthly principal
let principal = m.paymentPrincipal();

// get amortization schedule
let schedule = m.amortizationSchedule();
```

### Testing

```bash
npm test
```

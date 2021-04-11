'use strict';

const BigNumber = require('bignumber.js');

const PAYMENTS_PER_YEAR = 12;

class Mortgage {
  constructor(principal, interestRate, years, paymentsPerYear = Mortgage.PAYMENTS_PER_YEAR) {
    this.principal = principal;
    this.interestRate = interestRate;
    this.years = years;
    this.paymentsPerYear = paymentsPerYear;
  }

  payment() {
    let interestRatePerPayment = new BigNumber(this.interestRatePerPayment());
    let iN = interestRatePerPayment.plus(1).pow(this.numberOfPayments());

    return parseFloat(iN.times(interestRatePerPayment).dividedBy(iN.minus(1)).times(this.principal).toFixed(2));
  }

  paymentPrincipal() {
    let payment = new BigNumber(this.payment());

    return parseFloat(payment.minus(this.paymentInterest()).toFixed(2));
  }

  paymentInterest() {
    let interestRatePerPayment = new BigNumber(this.interestRatePerPayment());

    return parseFloat(interestRatePerPayment.times(this.principal).toFixed(2));
  }

  amortizationSchedule() {
    let totalInterestPaid = new BigNumber(0);
    let totalPrincipalPaid = new BigNumber(0);

    let payment = new BigNumber(this.payment());
    let paymentInterestRate = new BigNumber(this.interestRatePerPayment());
    let numberOfPayments = this.numberOfPayments();
    let principal = new BigNumber(this.principal);

    let schedule = {
      loanAmount: this.principal,
      interestRate: this.interestRate,
      payment: parseFloat(payment.toFixed(2)),
      numberOfPayments: numberOfPayments,
      amortizationSchedule: []
    };

    for (let i = 0; i < numberOfPayments; i++) {
      let paymentInterest = new BigNumber(principal.minus(totalPrincipalPaid).times(paymentInterestRate).toFixed(2));
      let paymentPrincipal = new BigNumber(payment.minus(paymentInterest).toFixed(2));

      totalPrincipalPaid = new BigNumber(totalPrincipalPaid.plus(paymentPrincipal).toFixed(2));
      totalInterestPaid = new BigNumber(totalInterestPaid.plus(paymentInterest).toFixed(2));

      if (i === (numberOfPayments - 1) && totalPrincipalPaid.toFixed(2) !== principal.toFixed(2)) {
        // this is the last payment and it needs adjustment

        // rewind the paymentPrincipal
        totalPrincipalPaid = new BigNumber(totalPrincipalPaid.minus(paymentPrincipal).toFixed(2));

        // calculate the actual final principal payment
        paymentPrincipal = new BigNumber(principal.minus(totalPrincipalPaid).toFixed(2));

        // reapply the paymentPrincipal
        totalPrincipalPaid = new BigNumber(totalPrincipalPaid.plus(paymentPrincipal).toFixed(2));
      }

      schedule.amortizationSchedule.push({
        "amortizationTable": `End of Month ${i + 1}`,
        "remainingPrincipal": parseFloat(principal.minus(totalPrincipalPaid).toFixed(2)),
        "principalPaid": parseFloat(paymentPrincipal.toFixed(2)),
        "interestPaid": parseFloat(paymentInterest.toFixed(2)),
        "totalInterestPaid": parseFloat(totalInterestPaid.toFixed(2)),
        "totalPrincipalPaid": parseFloat(totalPrincipalPaid.toFixed(2))
      });
    }

    return schedule;
  }

  interestRatePerPayment() {
    return this.interestRate / this.paymentsPerYear;
  }

  numberOfPayments() {
    return this.years * this.paymentsPerYear;
  }
}

Mortgage.PAYMENTS_PER_YEAR = PAYMENTS_PER_YEAR;

module.exports = Mortgage;

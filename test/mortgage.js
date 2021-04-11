'use strict';

const expect = require('chai').expect;
const Mortgage = require('../');
const fs = require('fs');
const BigNumber = require('bignumber.js');

describe('mortgage class', () => {
  it('instantiates', () => {
    let m = new Mortgage(100000, 0.03, 20);

    expect(m).to.be.instanceOf(Mortgage);
  });

  it('calculates the number of payments', () => {
    let m = new Mortgage(100000, 0.03, 20);
    let n = m.numberOfPayments();

    expect(n).to.equal(240);
  });

  it('calculates the interest rate per payment', () => {
    let m = new Mortgage(100000, 0.03, 20);
    let ir = m.interestRatePerPayment();

    expect(ir).to.equal(0.0025);
  });

  it('calculates the monthly payment', () => {
    let m = new Mortgage(100000, 0.03, 20);
    let p = m.payment();

    expect(p).to.equal(554.60);
  });

  it('calculates the monthly interest', () => {
    let m = new Mortgage(100000, 0.03, 20);
    let i = m.paymentInterest();

    expect(i).to.equal(250.00);
  });

  it('calculates the monthly principal', () => {
    let m = new Mortgage(100000, 0.03, 20);
    let p = m.paymentPrincipal();

    expect(p).to.equal(304.60);
  });

  it('calculates the amortization schedule', () => {
    let m = new Mortgage(100000, 0.03, 20);
    let a = m.amortizationSchedule();
    let ea = JSON.parse(fs.readFileSync('test/amortizationSchedule-100K-3percent-20years.json').toString());

    expect(a).to.eql(ea);

    expect(a.loanAmount).to.equal(100000);
    expect(a.interestRate).to.equal(0.03);
    expect(a.payment).to.equal(m.payment());
    expect(a.numberOfPayments).to.equal(m.numberOfPayments());
    expect(a.amortizationSchedule.length).to.equal(a.numberOfPayments);

    let startingPrincipal = new BigNumber(100000);
    let priorPrincipal = startingPrincipal.minus(0);
    let priorInterest = new BigNumber(0);
    let payment = new BigNumber(m.payment());

    for (let i = 0; i < a.numberOfPayments; i++) {
      let asp = a.amortizationSchedule[i];

      let principal = new BigNumber(asp.principalPaid);
      let interest = new BigNumber(asp.interestPaid);
      let remainingPrincipal = new BigNumber(asp.remainingPrincipal);
      let totalInterestPaid = new BigNumber(asp.totalInterestPaid);
      let totalPrincipalPaid = new BigNumber(asp.totalPrincipalPaid);

      if (i === (a.numberOfPayments - 1) && !(principal.plus(interest)).isEqualTo(payment)) {
        // this is the last payment and it needs to be handled differently
        expect(principal.plus(interest).toFixed(2)).to.equal(priorPrincipal.plus(interest).toFixed(), `payment ${i + 1}::payment`);
      } else {
        expect(principal.plus(interest).toFixed(2)).to.equal(payment.toFixed(2), `payment ${i + 1}::payment`);
      }

      expect(remainingPrincipal.toFixed(2)).to.equal(priorPrincipal.minus(principal).toFixed(2), `payment ${i + 1}::remainingPrincipal`);
      expect(totalPrincipalPaid.toFixed(2)).to.equal(startingPrincipal.minus(remainingPrincipal).toFixed(2), `payment ${i + 1}::totalPrincipalPaid`);
      expect(totalInterestPaid.toFixed(2)).to.equal(priorInterest.plus(interest).toFixed(2), `payment ${i + 1}::totalInterestPaid`);

      priorInterest = priorInterest.plus(interest);
      priorPrincipal = priorPrincipal.minus(principal);

      if (i === (a.numberOfPayments - 1)) {
        // this is the last payment, make sure it's correct
        expect(totalPrincipalPaid.toFixed(2)).to.equal(startingPrincipal.toFixed(2));
        expect(remainingPrincipal.toFixed(2)).to.equal('0.00');
      }
    }
  });
});

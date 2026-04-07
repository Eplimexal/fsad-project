package com.fsad.service;

import com.fsad.model.Loan;
import com.fsad.model.LoanApplication;
import com.fsad.model.LoanOffer;
import com.fsad.model.Payment;
import com.fsad.repository.LoanApplicationRepository;
import com.fsad.repository.LoanOfferRepository;
import com.fsad.repository.LoanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanOfferRepository offerRepository;
    private final LoanApplicationRepository applicationRepository;

    public LoanService(
            LoanRepository loanRepository,
            LoanOfferRepository offerRepository,
            LoanApplicationRepository applicationRepository
    ) {
        this.loanRepository = loanRepository;
        this.offerRepository = offerRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<Loan> getLoans() {
        return loanRepository.findAll();
    }

    public List<LoanOffer> getOffers() {
        return offerRepository.findAll();
    }

    public LoanOffer createOffer(LoanOffer input) {
        LoanOffer offer = new LoanOffer();
        offer.setId("O-" + System.currentTimeMillis());
        offer.setLenderId(input.getLenderId());
        offer.setLenderName(input.getLenderName());
        offer.setMinAmount(input.getMinAmount());
        offer.setMaxAmount(input.getMaxAmount());
        offer.setInterestRate(input.getInterestRate());
        offer.setTenure(input.getTenure());
        offer.setStatus(input.getStatus() == null ? "active" : input.getStatus().toLowerCase(Locale.ROOT));
        offer.setCreatedAt(OffsetDateTime.now().toString());
        return offerRepository.save(offer);
    }

    public List<LoanApplication> getApplications() {
        return applicationRepository.findAll();
    }

    public LoanApplication createApplication(LoanApplication input) {
        LoanApplication app = new LoanApplication();
        app.setId("APP-" + System.currentTimeMillis());
        app.setBorrowerId(input.getBorrowerId());
        app.setBorrowerName(input.getBorrowerName());
        app.setLoanAmount(input.getLoanAmount());
        app.setInterestRate(input.getInterestRate());
        app.setTenure(input.getTenure());
        app.setPurpose(input.getPurpose());
        app.setStatus("pending");
        app.setAppliedAt(OffsetDateTime.now().toString());
        return applicationRepository.save(app);
    }

    public Map<String, Object> approveApplication(String appId, String lenderId) {
        LoanApplication app = findApplication(appId);
        app.setStatus("approved");
        app.setLenderId(lenderId);
        applicationRepository.save(app);

        Loan loan = new Loan();
        loan.setId("L-" + System.currentTimeMillis());
        loan.setBorrowerId(app.getBorrowerId());
        loan.setLenderId(lenderId);
        loan.setAmount(app.getLoanAmount());
        loan.setInterestRate(app.getInterestRate());
        loan.setTenure(app.getTenure());
        loan.setStatus("active");
        loan.setIssueDate(LocalDate.now().toString());
        loan.setDueDate(LocalDate.now().plusMonths(app.getTenure()).toString());
        loan.setRemainingAmount(app.getLoanAmount());

        Loan savedLoan = loanRepository.save(loan);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("application", app);
        result.put("loan", savedLoan);
        return result;
    }

    public LoanApplication rejectApplication(String appId) {
        LoanApplication app = findApplication(appId);
        app.setStatus("rejected");
        return applicationRepository.save(app);
    }

    public Loan addPayment(String loanId, Payment paymentPayload) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loan not found"));

        Payment payment = new Payment();
        payment.setId(paymentPayload.getId() == null ? "P-" + System.currentTimeMillis() : paymentPayload.getId());
        payment.setAmount(paymentPayload.getAmount());
        payment.setDate(paymentPayload.getDate() == null ? LocalDate.now().toString() : paymentPayload.getDate());
        payment.setStatus(paymentPayload.getStatus() == null ? "completed" : paymentPayload.getStatus());
        payment.setLoanId(loan.getId());

        loan.getPayments().add(payment);
        loan.setRemainingAmount(Math.max(0, loan.getRemainingAmount() - payment.getAmount()));
        if (loan.getRemainingAmount() == 0) {
            loan.setStatus("completed");
        }

        return loanRepository.save(loan);
    }

    private LoanApplication findApplication(String appId) {
        return applicationRepository.findById(appId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
    }
}

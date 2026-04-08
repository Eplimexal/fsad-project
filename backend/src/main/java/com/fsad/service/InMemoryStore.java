package com.fsad.service;

import com.fsad.model.*;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class InMemoryStore {

    private final List<UserAccount> users = new CopyOnWriteArrayList<>();
    private final List<LoanOffer> offers = new CopyOnWriteArrayList<>();
    private final List<LoanApplication> applications = new CopyOnWriteArrayList<>();
    private final List<Loan> loans = new CopyOnWriteArrayList<>();
    private final PasswordEncoder passwordEncoder;

    public InMemoryStore(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    void seed() {
        users.add(new UserAccount("U-ADMIN", "Admin User", "admin@example.com", Role.ADMIN, passwordEncoder.encode("password123")));
        users.add(new UserAccount("U-LENDER", "John Doe", "lender@example.com", Role.LENDER, passwordEncoder.encode("password123")));
        users.add(new UserAccount("U-BORROWER", "Jane Smith", "borrower@example.com", Role.BORROWER, passwordEncoder.encode("password123")));
        users.add(new UserAccount("U-ANALYST", "Finance Analyst", "analyst@example.com", Role.ANALYST, passwordEncoder.encode("password123")));

        LoanOffer offer = new LoanOffer();
        offer.setId("O001");
        offer.setLenderId("U-LENDER");
        offer.setLenderName("John Doe");
        offer.setMinAmount(100000);
        offer.setMaxAmount(1000000);
        offer.setInterestRate(5.5);
        offer.setTenure(60);
        offer.setStatus("active");
        offer.setCreatedAt("2024-01-01");
        offers.add(offer);

        LoanApplication app = new LoanApplication();
        app.setId("APP001");
        app.setBorrowerId("U-BORROWER");
        app.setBorrowerName("Jane Smith");
        app.setLoanAmount(250000);
        app.setInterestRate(7.2);
        app.setTenure(48);
        app.setStatus("pending");
        app.setPurpose("Business expansion");
        app.setAppliedAt("2024-03-01T00:00:00Z");
        applications.add(app);
    }

    public List<UserAccount> users() { return users; }
    public List<LoanOffer> offers() { return offers; }
    public List<LoanApplication> applications() { return applications; }
    public List<Loan> loans() { return loans; }

    public List<Loan> loansSnapshot() { return new ArrayList<>(loans); }
}

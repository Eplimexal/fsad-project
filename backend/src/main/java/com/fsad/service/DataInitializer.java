package com.fsad.service;

import com.fsad.model.*;
import com.fsad.repository.LoanApplicationRepository;
import com.fsad.repository.LoanOfferRepository;
import com.fsad.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserAccountRepository userRepository;
    private final LoanOfferRepository offerRepository;
    private final LoanApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserAccountRepository userRepository,
            LoanOfferRepository offerRepository,
            LoanApplicationRepository applicationRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.offerRepository = offerRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(new UserAccount("U-ADMIN", "Admin User", "admin@example.com", Role.ADMIN, passwordEncoder.encode("password123")));
            userRepository.save(new UserAccount("U-LENDER", "John Doe", "lender@example.com", Role.LENDER, passwordEncoder.encode("password123")));
            userRepository.save(new UserAccount("U-BORROWER", "Jane Smith", "borrower@example.com", Role.BORROWER, passwordEncoder.encode("password123")));
            userRepository.save(new UserAccount("U-ANALYST", "Finance Analyst", "analyst@example.com", Role.ANALYST, passwordEncoder.encode("password123")));
        }

        if (offerRepository.count() == 0) {
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
            offerRepository.save(offer);
        }

        if (applicationRepository.count() == 0) {
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
            applicationRepository.save(app);
        }
    }
}

package com.fsad.controller;

import com.fsad.model.Loan;
import com.fsad.model.LoanApplication;
import com.fsad.model.LoanOffer;
import com.fsad.model.Payment;
import com.fsad.service.LoanService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/loans")
    public List<Loan> loans() {
        return loanService.getLoans();
    }

    @GetMapping("/offers")
    public List<LoanOffer> offers() {
        return loanService.getOffers();
    }

    @PostMapping("/offers")
    @PreAuthorize("hasAnyRole('LENDER','ADMIN')")
    public LoanOffer createOffer(@RequestBody LoanOffer offer) {
        return loanService.createOffer(offer);
    }

    @PutMapping("/offers/{id}")
    @PreAuthorize("hasAnyRole('LENDER','ADMIN')")
    public LoanOffer updateOffer(@PathVariable String id, @RequestBody LoanOffer offer, Authentication auth) {
        return loanService.updateOffer(id, offer, String.valueOf(auth.getPrincipal()), auth.getAuthorities());
    }

    @DeleteMapping("/offers/{id}")
    @PreAuthorize("hasAnyRole('LENDER','ADMIN')")
    public void deleteOffer(@PathVariable String id, Authentication auth) {
        loanService.deleteOffer(id, String.valueOf(auth.getPrincipal()), auth.getAuthorities());
    }

    @GetMapping("/applications")
    public List<LoanApplication> applications() {
        return loanService.getApplications();
    }

    @PostMapping("/applications")
    @PreAuthorize("hasAnyRole('BORROWER','ADMIN')")
    public LoanApplication createApplication(@RequestBody LoanApplication application) {
        return loanService.createApplication(application);
    }

    @PutMapping("/applications/{id}/approve")
    @PreAuthorize("hasAnyRole('LENDER','ADMIN')")
    public Map<String, Object> approve(@PathVariable String id, Authentication auth) {
        return loanService.approveApplication(id, String.valueOf(auth.getPrincipal()));
    }

    @PutMapping("/applications/{id}/reject")
    @PreAuthorize("hasAnyRole('LENDER','ADMIN')")
    public LoanApplication reject(@PathVariable String id) {
        return loanService.rejectApplication(id);
    }

    @PostMapping("/loans/{id}/payments")
    @PreAuthorize("hasAnyRole('BORROWER','ADMIN')")
    public Loan addPayment(@PathVariable String id, @RequestBody Payment payment) {
        return loanService.addPayment(id, payment);
    }
}

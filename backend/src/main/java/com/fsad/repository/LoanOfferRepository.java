package com.fsad.repository;

import com.fsad.model.LoanOffer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanOfferRepository extends JpaRepository<LoanOffer, String> {
}

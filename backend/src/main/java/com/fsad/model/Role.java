package com.fsad.model;

public enum Role {
    ADMIN,
    LENDER,
    BORROWER,
    ANALYST;

    public static Role from(String value) {
        return Role.valueOf(value.trim().toUpperCase());
    }

    public String toApiValue() {
        return name().toLowerCase();
    }
}

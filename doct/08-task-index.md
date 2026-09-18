# 08 — Task Index

| ID | Phase | Domain | Dependency |
|---|---:|---|---|
| TASK-000-CLARIFY | 0 | Compliance | — |
| TASK-DB-ERD-FIX | 2 | Database | Clarify optional |
| TASK-DB-CORE | 2 | Database | ERD Fix |
| TASK-BE-SETUP | 4 | Foundation | DB Core |
| TASK-BE-AUTH | 5 | Auth | BE Setup |
| TASK-BE-SPACE | 5 | Space | BE Setup |
| TASK-BE-DISCOUNT | 5 | Discount | BE Setup |
| TASK-BE-RESERVATION | 5 | Reservation | Auth + Space + Discount |
| TASK-BE-ADMIN-MEMBER | 5 | Admin Member | Auth |
| TASK-BE-ADMIN-PROFILE | 5 | Admin Profile | Auth + ERD |
| TASK-BE-CHECKIN-OUT | 5 | Reservation | Reservation |
| TASK-BE-ETICKET | 5 | E-ticket | Reservation |
| TASK-BE-UPLOAD | 5 | Upload | BE Setup |
| TASK-BE-REPORT | 5 | Report | Reservation + Check-in/out |
| TASK-FE-FOUNDATION | 6 | Foundation | Auth foundation |
| TASK-FE-AUTH | 7 | Auth | FE Foundation + BE Auth |
| TASK-FE-SPACE-CATALOG | 7 | Space | BE Space |
| TASK-FE-RESERVATION | 7 | Reservation | BE Reservation |
| TASK-FE-ETICKET | 7 | E-ticket | FE Reservation + BE E-ticket |
| TASK-FE-ADMIN-PROFILE | 7 | Admin Profile | BE Admin Profile |
| TASK-FE-ADMIN-MEMBER | 7 | Admin Member | BE Admin Member |
| TASK-FE-ADMIN-SPACE | 7 | Admin Space | BE Space |
| TASK-FE-ADMIN-DISCOUNT | 7 | Admin Discount | BE Discount |
| TASK-FE-ADMIN-RESERVATION | 7 | Admin Reservation | BE Check-in/out |
| TASK-FE-ADMIN-REPORT | 7 | Report | BE Report |
| TASK-INT-E2E | 8–9 | Integration/Test | FE + BE |
| TASK-COMPLIANCE-REVIEW | 10 | Compliance | E2E |
| TASK-SUBMISSION | 11 | Submission | Compliance |

## Task Expansion Template

```text
Objective
Source Requirements
Relevant Files
Dependencies
Preconditions
Implementation Scope
Out of Scope
Internal Contract
Database Models
Business Rules
Validation
Acceptance Criteria
Test Cases
Expected Files Changed
Verification
Completion Status
```

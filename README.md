# ClearPath Credit 🌾 | Explainable AI for Rural Credit Scoring

**Team Name:** ClearPath Credit (Bradley Opiyo, Joshua Kingsley)  
**Track:** Mercy Corps AgriFin Track — Kenya AI Challenge (Route 1: eSusFarm Brief)  
**Core Stack:** `Featherless (Qwen-2.5)` | `Neo4j` | `XGBoost` | `Masumi Agents` | `Lovable`

---

## 📌 Problem & Scope
In Uganda, women smallholder farmers make up the majority of the agricultural workforce but face systemic exclusion from formal credit due to traditional collateral requirements. Alternative digital credit models help, but standard Explainable AI (XAI) tools rely on complex visual dashboards. 

These cannot be served over the low-bandwidth, **182-character local-language USSD/SMS interfaces** that thin-file rural borrowers (like Joyce Namuli in Masaka District) rely on. This leaves lenders trapped in a trade-off between predictive accuracy and transparent consumer protection.

## 🚀 The Solution: ClearPath Credit
ClearPath Credit sits directly on top of eSusFarm's foundational credit tier data, introducing a lightweight, text-driven **Explanation Layer** that bridges the gap between deep data engineering and localized accessibility.

```math
S_{total} = \alpha \cdot M(x) + (1 - \alpha) \cdot G(v)

# ClearPath Credit: Explainable AI for Credit Scoring

**Kenya AI Challenge — Mercy Corps AgriFin Track**
**Team:** ClearPath Credit (Bradley Opiyo, Joshua Kingsley)
**Target Submission:** June 25, 2026
**Route 1:** Finance Challenge Category

---

## 📖 Project Overview

This project addresses the **"Explainable AI for Credit Scoring (Women Farmers + USSD)"** brief submitted by eSusFarm, Uganda.

Women smallholder farmers accessing credit through USSD and feature phones often receive financial decisions they cannot understand or act on. Standard AI explainability tools are built for high-bandwidth visual dashboards, making them unsuitable for low-bandwidth, local-language delivery (like 182-character USSD/SMS limits). Our solution bridges this gap, providing explainable AI tailored for rural borrowers.

---

## ⚠️ The Problem

In Uganda, women make up an estimated 73% of the agricultural workforce but face structural exclusion from formal credit due to traditional collateral requirements.

* **The Transparency Gap:** Digital credit models offer a solution, but lenders face a trade-off between predictive accuracy and transparency. Thin-file borrowers are left with unexplained, automated decisions (e.g., loan rejections or unclear tier ratings).
* **The Access Gap:** Uganda's mobile gender gap is roughly 4% in urban areas but spikes to ~22% in rural areas. The USSD/feature-phone channel is where access is most unequal.
* **The Impact:** When a borrower like Joyce Namuli (a creditworthy but thin-file coffee farmer) receives an unexplained rating, she cannot identify which behaviors to adjust. Relying on third parties to read the text compromises her privacy and financial agency.

---

## 💡 Our Solution

We are building a **USSD/SMS-based explanation layer** that sits atop an existing credit decision engine. It provides the farmer with a short, plain-language answer to three core questions:

1. **What was decided?**
2. **What most affected the decision?**
3. **What is one realistic action to improve her position next season?**

### Core Workflow

1. A farmer receives her credit tier via USSD and requests "why."
2. The system retrieves her record and finds relationally similar farmers who improved their tier over time.
3. A grounded comparison is generated to provide realistic advice.
4. The message is delivered in her local language, within USSD limits, focusing *only* on factors within her control (e.g., repayment timing, wallet consistency).

---

## 🏗️ Technical Architecture

### 1. Decision Engine (Foundational Layer)

We utilize a hybrid index model built on variables from a 2022 Jinja region observational study. The credit index is defined as:

$$S_{total} = \alpha \cdot M(x) + (1 - \alpha) \cdot G(v)$$

* **$M(x)$**: A behavioral score derived from a gradient-boosted model (**XGBoost**) trained on five predictors: repayment timing, input-purchase consistency, mobile/USSD usage consistency, savings-group participation, and farm size/market distance.
* **$G(v)$**: A normalized trust score derived from the farmer's position in the Neo4j relationship graph.
* **$\alpha$**: A weighting parameter balancing individual behavioral scoring against network-based trust.

*Note: Feature-importance attribution is generated alongside the score to preserve predictive power for thin-file farmers without sacrificing institutional transparency.*

### 2. Institutional Masking & Language Layer (Featherless)

* **For the Lender:** Full feature-importance output is routed to the MIS dashboard for bias auditing and oversight.
* **For the Farmer:** Actionable behaviors are isolated and passed through a **Featherless-hosted RAG pipeline** (e.g., Qwen-2.5). This compresses the explanation into a concise, localized message suitable for USSD.

### 3. Graph Layer (Neo4j)

Beyond calculating $G(v)$, the Neo4j graph powers peer-comparison explanations. Instead of simple vector-similarity lookups, the graph matches shared relationships (e.g., shared savings group or input dealer) to ensure RAG-generated advice is grounded in real, local patterns.

### 4. Coordination & Interface (Masumi & Lovable)

* **Masumi:** Coordinates Data Collection, Scoring, and Translation as agent-to-agent job requests.
* **Lovable:** Powers the demo interface, showcasing the lender-facing MIS dashboard alongside a simulated farmer-facing USSD experience.

---

## 📚 References

1. **World Bank (2021).** A sustainable green recovery for Uganda depends on women. *World Bank Blogs.*
2. **FSD Uganda (2018).** FinScope Uganda 2018 Survey Report. *Financial Sector Deepening Uganda.*
3. **GSMA (2021).** The Mobile Gender Gap Report 2021. *GSM Association.*
4. **Midamba, D., et al. (2022).** Drivers of Access to Credit Among Smallholder Farmers in Uganda: Application of Binary Logistic Model. *East African Journal of Business and Economics*, 5(1), pp. 154–163.